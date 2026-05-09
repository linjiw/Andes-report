const data = window.INCIDENT_DATA;

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

function renderSummary() {
  document.querySelector("#asOf").textContent = data.meta.asOf;
  document.querySelector("#dataVersion").textContent = data.meta.dataVersion;
  document.querySelector("#posture").textContent = data.meta.posture;

  const list = document.querySelector("#summaryList");
  list.innerHTML = data.summary.map((item) => `<li>${item}</li>`).join("");
}

function renderMetrics() {
  const grid = document.querySelector("#metricGrid");
  grid.innerHTML = data.stats
    .map(
      (stat) => `
        <article class="metric-card ${stat.tone}">
          <span class="label">${stat.label}</span>
          <strong class="value">${stat.value}</strong>
          <p class="detail">${stat.detail}</p>
          <p class="detail">来源：${sourceDateLabel(stat.sourceIds)}</p>
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
    return `${item.color} ${start}% ${end}%`;
  });

  const donut = document.querySelector("#donut");
  donut.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  donut.innerHTML = `
    <div class="donut-center">
      <strong>${total}</strong>
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
            <strong>${item.label}</strong>
            <span>${item.value} 例 / ${percent}%</span>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" style="width:${percent}%; background:${item.color}"></div>
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
          <span class="risk-badge">${risk.rating}</span>
          <div>
            <strong>${risk.org}</strong>
            <span>${risk.audience} · ${risk.date}</span>
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
          <h3>${snapshot.source}</h3>
          <span class="snapshot-date">${snapshot.date} · 来源：${sourceDateLabel(snapshot.sourceIds)}</span>
          <div class="snapshot-counts">
            <span><strong>${snapshot.total ?? "—"}</strong>报告病例</span>
            <span><strong>${snapshot.confirmed ?? "—"}</strong>确诊</span>
            <span><strong>${snapshot.probable ?? "—"}</strong>可能</span>
            <span><strong>${snapshot.suspected ?? "—"}</strong>疑似</span>
            <span><strong>${snapshot.nonCases ?? "—"}</strong>非病例</span>
            <span><strong>${snapshot.deaths ?? "—"}</strong>死亡</span>
          </div>
          <p><strong>风险：</strong>${snapshot.publicRisk}</p>
          <p>${snapshot.note}</p>
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
          <span>${formatDate(stop.date)}</span>
          <strong>${stop.label}</strong>
          <small>${stop.place}</small>
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
          <strong>${windowItem.label}</strong>
          <span class="dates">${formatDate(windowItem.from)} - ${formatDate(windowItem.to)}</span>
          <p>${windowItem.rule}</p>
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
        <button class="filter-button" type="button" data-type="${type}" aria-pressed="${type === "all"}">
          ${typeLabels[type]}
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
      return `<div class="scale-tick" style="left:${left}%"><span>${anchor.label}<br>${formatDate(anchor.date)}</span></div>`;
    })
    .join("");
  const nowLeft = clamp(((parseDate(data.meta.asOf).getTime() - start) / range) * 100, 0, 100);
  scale.innerHTML =
    ticks +
    `<div class="scale-now" style="left:${nowLeft}%"><span>当前<br>${formatDate(data.meta.asOf)}</span></div>`;
}

function renderTimeline(filterType = "all") {
  const container = document.querySelector("#timeline");
  const events = data.events.filter((event) => filterType === "all" || event.type === filterType);
  container.innerHTML = events
    .map(
      (event) => `
        <article class="event-card ${event.type}">
          <div>
            <div class="event-date">${event.date}</div>
            <span class="event-type">${typeLabels[event.type]}</span>
          </div>
          <div>
            <h3>${event.title}</h3>
            <div class="event-place">${event.place} · 来源：${sourceDateLabel(event.sourceIds)}</div>
            <p>${event.detail}</p>
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
        <article class="signal-card ${signal.severity}">
          <span class="tag">${severityLabels[signal.severity]}</span>
          <h3>${signal.name}</h3>
          <p class="current">当前：${signal.current}</p>
          <p>${signal.why}</p>
          <p><strong>动作：</strong>${signal.action}</p>
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
          <strong>${item.period}</strong>
          <span>${item.cadence}</span>
          <p>${item.focus}</p>
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
          <td>${source.priority}</td>
          <td><strong>${source.org}</strong><br>${source.name}</td>
          <td>${source.date}</td>
          <td>${source.useFor}</td>
          <td><a href="${source.url}" target="_blank" rel="noreferrer">打开</a></td>
        </tr>
      `
    )
    .join("");
}

function init() {
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
