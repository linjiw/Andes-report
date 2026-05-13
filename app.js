const data = window.INCIDENT_DATA;
const latestSnapshot = window.LATEST_SOURCE_SNAPSHOT ?? null;
const sourceRegistry = { sources: data.sources };
const computeDashboardSyncStatus = window.AndesSyncStatus.dashboardSyncStatus;

const typeLabels = {
  all: "全部",
  voyage: "行程",
  clinical: "临床",
  response: "处置",
  official: "官方",
  monitoring: "观察窗"
};

const severityLabels = {
  green: "绿色信号",
  watch: "观察信号",
  red: "红色信号"
};

const sourceMap = new Map(data.sources.map((source) => [source.id, source]));

const parseDate = (value) => new Date(`${value}T12:00:00`);
const formatDate = (value) =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit"
  }).format(parseDate(value));

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function classToken(value, fallback = "") {
  const text = String(value ?? "");
  return /^[a-z0-9_-]+$/i.test(text) ? text : fallback;
}

function safeUrl(value) {
  try {
    const url = new URL(String(value ?? ""), window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? escapeHtml(url.href) : "#";
  } catch {
    return "#";
  }
}

function safeColor(value) {
  const text = String(value ?? "");
  return /^#[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/i.test(text) ? text : "#64748b";
}

function displayValue(value, fallback = "—") {
  return escapeHtml(value ?? fallback);
}

function sourceLabel(ids) {
  return ids
    .map((id) => sourceMap.get(id)?.org)
    .filter(Boolean)
    .filter((org, index, arr) => arr.indexOf(org) === index)
    .join(" / ");
}

function sourceDateLabel(ids) {
  return ids
    .map((id) => sourceMap.get(id))
    .filter(Boolean)
    .map((source) => `${source.org} ${source.date}`)
    .filter((label, index, arr) => arr.indexOf(label) === index)
    .join(" / ");
}

function dashboardSyncStatus() {
  return computeDashboardSyncStatus({ incidentData: data, latestSnapshot, sourceRegistry });
}

function renderAutomationStatus() {
  const pill = document.querySelector("#automationPill");
  const summary = document.querySelector("#automationSummary");
  const detail = document.querySelector("#automationDetail");
  const status = dashboardSyncStatus();

  if (!status.checkedAt) {
    pill.textContent = "状态未知";
    summary.textContent = "当前页面未加载到最近一次官方检查快照。";
    detail.textContent = "请先查看 Update history 页面，确认公开快照文件是否存在。";
    return;
  }

  const checkedAtLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(status.checkedAt));

  if (status.aligned) {
    pill.textContent = status.humanReviewRequired ? "已同步，仍需人工复核" : "已同步";
    summary.textContent = `最近一次成功官方检查时间：${checkedAtLabel}。当前首页的结构化快照与最近一次公开检查结果对齐。`;
    detail.textContent = status.humanReviewRequired
      ? "这表示数字和基础风险口径已对齐；若官方传播评估、旅行建议或医学措辞发生变化，仍应按人工复核流程更新说明文字。"
      : "这表示首页当前展示的结构化快照与最近一次公开检查结果一致。";
    return;
  }

  pill.textContent = status.snapshotReady ? "最新检查未完全同步到首页" : "仅有审计快照";
  summary.textContent = `最近一次官方检查时间：${checkedAtLabel}。当前首页整理版可能落后于最新公开检查结果，请优先查看 Update history 和官方口径快照。`;
  detail.textContent = status.snapshotReady
    ? "这通常表示自动检查已拿到新官方结果，但 curated dashboard 仍需补充结构化数据或中文说明。"
    : "这通常表示最近一次运行存在抓取或解析失败，所以只保留了审计记录，没有替换当前公开快照。";
}

function renderSummary() {
  document.querySelector("#asOf").textContent = data.meta.asOf;
  document.querySelector("#dataVersion").textContent = data.meta.dataVersion;
  document.querySelector("#posture").textContent = data.meta.posture;

  const list = document.querySelector("#summaryList");
  list.innerHTML = data.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderMetrics() {
  const grid = document.querySelector("#metricGrid");
  grid.innerHTML = data.stats
    .map(
      (stat) => `
        <article class="metric-card ${classToken(stat.tone)}">
          <span class="label">${escapeHtml(stat.label)}</span>
          <strong class="value">${escapeHtml(stat.value)}</strong>
          <p class="detail">${escapeHtml(stat.detail)}</p>
          <p class="detail">来源：${escapeHtml(sourceDateLabel(stat.sourceIds))}</p>
        </article>
      `
    )
    .join("");
}

function renderCaseChart() {
  const total = data.caseStatus.reduce((sum, item) => sum + item.value, 0);
  let current = 0;
  const gradientParts = data.caseStatus.map((item) => {
    const start = current;
    const end = current + (item.value / total) * 100;
    current = end;
    return `${safeColor(item.color)} ${start}% ${end}%`;
  });

  const donut = document.querySelector("#donut");
  donut.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  donut.innerHTML = `
    <div class="donut-center">
      <strong>${escapeHtml(total)}</strong>
      <span>报告病例</span>
    </div>
  `;

  const bars = document.querySelector("#caseBars");
  bars.innerHTML = data.caseStatus
    .map((item) => {
      const percent = Math.round((item.value / total) * 100);
      return `
        <div class="bar-row">
          <div class="bar-meta">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.value)} 例 / ${escapeHtml(percent)}%</span>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" style="width:${percent}%; background:${safeColor(item.color)}"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderRiskRatings() {
  const container = document.querySelector("#riskRatings");
  container.innerHTML = data.riskRatings
    .map(
      (risk) => `
        <div class="risk-item">
          <span class="risk-badge">${escapeHtml(risk.rating)}</span>
          <div>
            <strong>${escapeHtml(risk.org)}</strong>
            <span>${escapeHtml(risk.audience)} · ${escapeHtml(risk.date)}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderSourceSnapshots() {
  const container = document.querySelector("#sourceSnapshots");
  container.innerHTML = data.sourceSnapshots
    .map(
      (snapshot) => `
        <article class="snapshot-card">
          <h3>${escapeHtml(snapshot.source)}</h3>
          <span class="snapshot-date">${escapeHtml(snapshot.date)} · 来源：${escapeHtml(sourceDateLabel(snapshot.sourceIds))}</span>
          <div class="snapshot-counts">
            <span><strong>${displayValue(snapshot.total)}</strong>报告病例</span>
            <span><strong>${displayValue(snapshot.confirmed)}</strong>确诊</span>
            <span><strong>${displayValue(snapshot.probable)}</strong>可能</span>
            <span><strong>${displayValue(snapshot.inconclusive)}</strong>未定论</span>
            <span><strong>${displayValue(snapshot.suspected)}</strong>疑似</span>
            <span><strong>${displayValue(snapshot.nonCases)}</strong>非病例</span>
            <span><strong>${displayValue(snapshot.deaths)}</strong>死亡</span>
          </div>
          <p><strong>风险：</strong>${escapeHtml(snapshot.publicRisk)}</p>
          <p>${escapeHtml(snapshot.note)}</p>
        </article>
      `
    )
    .join("");
}

function renderRoute() {
  const route = document.querySelector("#routeStrip");
  route.innerHTML = data.route
    .map(
      (stop) => `
        <div class="route-stop">
          <span>${escapeHtml(formatDate(stop.date))}</span>
          <strong>${escapeHtml(stop.label)}</strong>
          <small>${escapeHtml(stop.place)}</small>
        </div>
      `
    )
    .join("");
}

function renderMonitoringWindows() {
  const container = document.querySelector("#monitoringWindows");
  container.innerHTML = data.monitoringWindows
    .map(
      (windowItem) => `
        <article class="window-card">
          <strong>${escapeHtml(windowItem.label)}</strong>
          <span class="dates">${escapeHtml(formatDate(windowItem.from))} - ${escapeHtml(formatDate(windowItem.to))}</span>
          <p>${escapeHtml(windowItem.rule)}</p>
        </article>
      `
    )
    .join("");
}

function renderFilters() {
  const filters = document.querySelector("#filters");
  const types = ["all", "voyage", "clinical", "response", "official", "monitoring"];
  filters.innerHTML = types
    .map(
      (type) => `
        <button class="filter-button" type="button" data-type="${classToken(type)}" aria-pressed="${type === "all"}">
          ${escapeHtml(typeLabels[type])}
        </button>
      `
    )
    .join("");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (!button) return;
    filters
      .querySelectorAll("button")
      .forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    renderTimeline(button.dataset.type);
  });
}

function renderTimeScale() {
  const scale = document.querySelector("#timeScale");
  const start = parseDate("2026-04-01").getTime();
  const end = parseDate("2026-06-24").getTime();
  const range = end - start;
  const anchors = [
    { date: "2026-04-01", label: "启航" },
    { date: "2026-04-06", label: "首例症状" },
    { date: "2026-05-10", label: "预计抵达" },
    { date: "2026-05-24", label: "2 周" },
    { date: "2026-06-21", label: "42 天" },
    { date: "2026-06-24", label: "45 天" }
  ];

  const ticks = anchors
    .map((anchor) => {
      const left = clamp(((parseDate(anchor.date).getTime() - start) / range) * 100, 0, 100);
      return `<div class="scale-tick" style="left:${left}%"><span>${escapeHtml(anchor.label)}<br>${escapeHtml(formatDate(anchor.date))}</span></div>`;
    })
    .join("");
  const nowLeft = clamp(((parseDate(data.meta.asOf).getTime() - start) / range) * 100, 0, 100);
  scale.innerHTML =
    ticks +
    `<div class="scale-now" style="left:${nowLeft}%"><span>当前<br>${escapeHtml(formatDate(data.meta.asOf))}</span></div>`;
}

function renderTimeline(filterType = "all") {
  const container = document.querySelector("#timeline");
  const events = data.events.filter((event) => filterType === "all" || event.type === filterType);
  container.innerHTML = events
    .map(
      (event) => `
        <article class="event-card ${classToken(event.type)}">
          <div>
            <div class="event-date">${escapeHtml(event.date)}</div>
            <span class="event-type">${escapeHtml(typeLabels[event.type])}</span>
          </div>
          <div>
            <h3>${escapeHtml(event.title)}</h3>
            <div class="event-place">${escapeHtml(event.place)} · 来源：${escapeHtml(sourceDateLabel(event.sourceIds))}</div>
            <p>${escapeHtml(event.detail)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSignals() {
  const container = document.querySelector("#signals");
  container.innerHTML = data.signals
    .map(
      (signal) => `
        <article class="signal-card ${classToken(signal.severity)}">
          <span class="tag">${escapeHtml(severityLabels[signal.severity])}</span>
          <h3>${escapeHtml(signal.name)}</h3>
          <p class="current">当前：${escapeHtml(signal.current)}</p>
          <p>${escapeHtml(signal.why)}</p>
          <p><strong>动作：</strong>${escapeHtml(signal.action)}</p>
        </article>
      `
    )
    .join("");
}

function renderProtocol() {
  const container = document.querySelector("#updateProtocol");
  container.innerHTML = data.updateProtocol
    .map(
      (item) => `
        <article class="protocol-item">
          <strong>${escapeHtml(item.period)}</strong>
          <span>${escapeHtml(item.cadence)}</span>
          <p>${escapeHtml(item.focus)}</p>
        </article>
      `
    )
    .join("");
}

function renderSources() {
  const rows = document.querySelector("#sourceRows");
  rows.innerHTML = data.sources
    .map(
      (source) => `
        <tr>
          <td>${escapeHtml(source.priority)}</td>
          <td><strong>${escapeHtml(source.org)}</strong><br>${escapeHtml(source.name)}</td>
          <td>${escapeHtml(source.date)}</td>
          <td>${escapeHtml(source.useFor)}</td>
          <td><a href="${safeUrl(source.url)}" target="_blank" rel="noreferrer">打开</a></td>
        </tr>
      `
    )
    .join("");
}

function init() {
  renderAutomationStatus();
  renderSummary();
  renderMetrics();
  renderCaseChart();
  renderRiskRatings();
  renderSourceSnapshots();
  renderRoute();
  renderMonitoringWindows();
  renderFilters();
  renderTimeScale();
  renderTimeline();
  renderSignals();
  renderProtocol();
  renderSources();
}

init();
