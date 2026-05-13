window.INCIDENT_DATA = {
  meta: {
    title: "MV Hondius Andes Hantavirus 事件追踪",
    subtitle: "官方来源核验、时间线、风险信号与监测窗口",
    asOf: "2026-05-13",
    timezone: "America/New_York",
    dataVersion: "2026-05-13.v1",
    posture:
      "截至 2026-05-13 复核，WHO 2026-05-08 DON600 仍为 8 例（6 确诊、2 可能、3 死亡），CDC 2026-05-12 Current Situation 的美国公众与旅行者风险口径未变；ECDC 2026-05-13 每日页继续报 11 例，但分类改写为 8 确诊、2 可能、1 例未定论、3 死亡。当前重点不是公众风险升级，而是 WHO 与 ECDC 之间仍存在 3 例总数差异，且 ECDC 对其中 1 例仍未给出最终分类。"
  },
  summary: [
    "本事件涉及汉坦病毒家族中的 Andes virus；页面统一写作 Andes virus / 安第斯病毒，不混写为 Hantaan virus。",
    "WHO 2026-05-08 DON600 写明：8 例报告病例，6 例实验室确诊为 Andes virus，2 例可能，3 人死亡；全球公众风险为低，船上乘客和船员风险为中等。",
    "事实：ECDC 每日页在 2026-05-13 更新为截至当日 14:00 共 11 例，其中 8 确诊、2 可能、1 例未定论、0 疑似、3 死亡；MV Hondius 已于 5 月 10 日抵达 Tenerife，并在 5 月 11 日完成下船和返程安排，EU/EEA 普通人群风险仍为非常低。",
    "事实：CDC 2026-05-12 Current Situation 继续写明美国尚无因此事件报告的 Andes virus 病例，美国公众和旅行者总体风险仍极低；CDC 2026-05-10 的临时指导则把返程后 42 天随访作为核心后续处置。",
    "解释：目前不是三家机构同步上调后的统一总数，而是 ECDC 仍比 WHO 多报 3 例病例，同时把其中 1 例标记为未定论。本站保留这种来源差异，不把 WHO、ECDC、CDC 合并成单一综合病例数。",
    "不确定性：ECDC 公页摘要没有逐例解释 1 例未定论与 WHO 尚未跟进的 3 例差异各自对应的暴露链；后续需等待 WHO 或 CDC 是否补充接触链和病例分类说明。"
  ],
  stats: [
    {
      label: "WHO 最新病例",
      value: "8",
      detail: "6 确诊 / 2 可能 / 3 死亡",
      tone: "blue",
      sourceIds: ["who-don"]
    },
    {
      label: "ECDC 最新口径",
      value: "11",
      detail: "8 确诊 / 2 可能 / 1 未定论 / 3 死亡",
      tone: "violet",
      sourceIds: ["ecdc-daily"]
    },
    {
      label: "死亡",
      value: "3",
      detail: "截至 WHO 2026-05-08 / ECDC 2026-05-13，两者均报 3 例死亡",
      tone: "red",
      sourceIds: ["who-don", "ecdc-daily"]
    },
    {
      label: "船上风险",
      value: "中等",
      detail: "WHO: 仅船上乘客/船员为中等；全球公众为低",
      tone: "amber",
      sourceIds: ["who-don"]
    },
    {
      label: "船上人数",
      value: "147",
      detail: "WHO: 另有 34 人此前已下船",
      tone: "teal",
      sourceIds: ["who-don"]
    },
    {
      label: "美国公众风险",
      value: "极低",
      detail: "CDC: 美国公众和旅行者总体风险极低",
      tone: "teal",
      sourceIds: ["cdc-current"]
    }
  ],
  caseStatus: [
    { label: "WHO 确诊", value: 6, color: "#1f6feb" },
    { label: "WHO 可能", value: 2, color: "#d29922" }
  ],
  sourceSnapshots: [
    {
      source: "WHO DON600",
      date: "2026-05-08",
      total: 8,
      confirmed: 6,
      probable: 2,
      suspected: 0,
      nonCases: 1,
      deaths: 3,
      publicRisk: "Global low; ship passengers/crew moderate",
      note: "WHO 最新一手通报；作为本站当前主病例分类口径。",
      sourceIds: ["who-don"]
    },
    {
      source: "ECDC daily",
      date: "2026-05-13",
      total: 11,
      confirmed: 8,
      probable: 2,
      inconclusive: 1,
      suspected: 0,
      nonCases: null,
      deaths: 3,
      publicRisk: "EU/EEA general population very low",
      note: "ECDC 2026-05-13 每日页继续报 11 例，但分类改为 8 确诊、2 可能、1 例未定论、0 疑似；较 WHO DON600 仍多出 3 例病例。页面同时继续写明船已于 5 月 10 日抵达 Tenerife，并在 5 月 11 日完成下船和返程安排，EU/EEA 普通人群风险仍为非常低。",
      sourceIds: ["ecdc-daily"]
    },
    {
      source: "CDC Current Situation",
      date: "2026-05-12",
      total: null,
      confirmed: null,
      probable: null,
      inconclusive: null,
      suspected: null,
      nonCases: null,
      deaths: null,
      publicRisk: "US public and travelers extremely low",
      note: "CDC 2026-05-12 页面继续写明美国尚无因此事件确认的 Andes virus 病例，美国公众和旅行者总体风险仍极低；后续返程人群管理需另看 2026-05-10 的 CDC 临时指导。",
      sourceIds: ["cdc-current"]
    }
  ],
  riskRatings: [
    {
      org: "WHO",
      rating: "Low / Moderate",
      audience: "全球普通人群 / 船上乘客与船员",
      date: "2026-05-08",
      sourceIds: ["who-don"]
    },
    {
      org: "ECDC",
      rating: "Very low",
      audience: "EU/EEA 普通人群",
      date: "2026-05-13",
      sourceIds: ["ecdc-daily"]
    },
    {
      org: "CDC",
      rating: "Extremely low",
      audience: "美国公众与旅行者",
      date: "2026-05-12",
      sourceIds: ["cdc-current"]
    }
  ],
  monitoringWindows: [
    {
      label: "第一观察窗",
      from: "2026-05-10",
      to: "2026-05-24",
      rule: "若以 ECDC 2026-05-10 每日页所示的抵港与下船处置日 5 月 10 日作为最后船上暴露锚点，+14 天可作为第一个观察节点；这不是官方结案时间。",
      sourceIds: ["ecdc-daily"]
    },
    {
      label: "ECDC 返程管理 42 天窗",
      from: "2026-05-06",
      to: "2026-06-17",
      rule: "ECDC 2026-05-09 Rapid Scientific Advice 在返程与检疫管理场景下写明 Day 0 = 2026-05-06，并建议最多 42 天监测/隔离；这是操作性口径，不等于所有个体的唯一最后暴露日。",
      sourceIds: ["ecdc-rapid-advice"]
    },
    {
      label: "Andes 症状上限",
      from: "2026-05-10",
      to: "2026-06-21",
      rule: "CDC Andes virus 页面写症状可在暴露后 4-42 天出现；42 天窗口到 6 月 21 日。",
      sourceIds: ["cdc-andes"]
    },
    {
      label: "WHO 高风险接触者 42 天主动监测/隔离",
      from: "2026-05-10",
      to: "2026-06-21",
      rule: "WHO 2026-05-08 DON600 要求高风险接触者自最后暴露起 42 天主动症状监测并采取居家或设施隔离；CDC 2026-05-10 临时指导也把船上暴露定义延续到下船阶段，因此本站暂以 5 月 10 日为公开追踪锚点，但保留个体起算日可能不同的不确定性。",
      sourceIds: ["who-don", "cdc-guidance"]
    }
  ],
  route: [
    { date: "2026-04-01", place: "Ushuaia, Argentina", label: "启航" },
    { date: "2026-04-07", place: "South Georgia", label: "南大西洋行程" },
    { date: "2026-04-14", place: "Tristan da Cunha", label: "停靠/航行" },
    { date: "2026-04-24", place: "Saint Helena", label: "医疗处置" },
    { date: "2026-05-10", place: "Tenerife, Spain", label: "已抵达" }
  ],
  events: [
    {
      date: "2026-04-01",
      type: "voyage",
      title: "MV Hondius 从阿根廷乌斯怀亚启航",
      place: "Ushuaia, Argentina",
      detail:
        "WHO DON 写明该船搭载 147 人，行程涉及南大西洋、南极相关区域、南乔治亚、Tristan da Cunha、Saint Helena 等。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-06",
      type: "clinical",
      title: "首例症状出现",
      place: "On board",
      detail:
        "病例发病时间区间从 4 月 6 日持续到 4 月 28 日；早期表现包括发热、胃肠道症状，部分进展为肺炎、ARDS 和休克。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-11",
      type: "clinical",
      title: "首例在船上死亡",
      place: "On board",
      detail:
        "WHO DON 记录第一名出现症状的乘客约 5 天后死亡；早期诊断未立即锁定 Andes virus。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-24",
      type: "response",
      title: "Saint Helena 相关医疗处置",
      place: "Saint Helena",
      detail:
        "WHO DON 描述船舶抵达 Saint Helena 后进行了遗体下船、医疗评估、实验室样本安排和接触者追踪等处置。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-25",
      type: "clinical",
      title: "第二名病例在飞往 Johannesburg 途中恶化",
      place: "Johannesburg route",
      detail:
        "WHO DON 记录该病例在转运途中病情恶化，随后在南非接受检测并确认汉坦病毒感染。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-26",
      type: "clinical",
      title: "第二名病例死亡，其他病例继续出现",
      place: "South Africa / on board",
      detail:
        "WHO DON 记录第二名病例死亡；病例簇仍在已知船舶和旅行接触范围内被识别。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-04-28",
      type: "clinical",
      title: "病例发病区间延伸至 4 月 28 日",
      place: "On board",
      detail:
        "WHO DON 将本次病例发病时间列为 4 月 6 日至 4 月 28 日，支持后续仍需等待潜伏期内病例显形。",
      sourceIds: ["who-don-2026-05-04", "who-don"]
    },
    {
      date: "2026-05-02",
      type: "response",
      title: "WHO 接到事件通报",
      place: "International reporting",
      detail:
        "WHO DON 写明 5 月 2 日收到本次多国邮轮相关汉坦病毒聚集事件通报。",
      sourceIds: ["who-don-2026-05-04"]
    },
    {
      date: "2026-05-04",
      type: "official",
      title: "WHO 发布 Disease Outbreak News",
      place: "WHO",
      detail:
        "WHO 初始通报描述病例、路线、临床表现、调查方向和公共卫生建议；风险评估为低。",
      sourceIds: ["who-don-2026-05-04"]
    },
    {
      date: "2026-05-07",
      type: "official",
      title: "WHO 更新：8 例、5 确诊、3 死亡，病毒为 Andes virus",
      place: "WHO",
      detail:
        "WHO 新闻页确认病例总数和死亡数，并说明公共卫生风险仍低，后续可能因潜伏期出现更多病例。",
      sourceIds: ["who-response"]
    },
    {
      date: "2026-05-07",
      type: "official",
      title: "CDC 声明美国公众风险极低",
      place: "United States",
      detail:
        "CDC 表示正与相关部门和国际机构协调，并要求船上美国旅客遵循卫生官员指引。",
      sourceIds: ["cdc-statement"]
    },
    {
      date: "2026-05-08",
      type: "official",
      title: "WHO DON600：8 例、6 确诊、2 可能、3 死亡",
      place: "WHO",
      detail:
        "WHO 5 月 8 日 DON600 写明所有 6 例实验室确诊均为 Andes virus；全球风险为低，船上乘客和船员风险为中等。WHO 同时指出当前证据指向船上已知接触环境内的后续人传人，但链条细节仍待流行病学和测序调查确认。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-05-08",
      type: "official",
      title: "CDC Current Situation：美国公众和旅行者风险极低",
      place: "United States",
      detail:
        "CDC 2026-05-12 Current Situation 写明美国尚无因此事件确认的 Andes virus 病例，美国公众和旅行者总体风险仍极低，并描述返美乘客监测和跨机构公共卫生协作。",
      sourceIds: ["cdc-current"]
    },
    {
      date: "2026-05-08",
      type: "response",
      title: "AP/Reuters 报道各国接收、疏散和检测行动进展",
      place: "Spain / Singapore / international",
      detail:
        "AP 用于跟踪西班牙接收和疏散安排，Reuters 用于跟踪新加坡相关检测和隔离动作；这类媒体源只作为行动进展补充，不覆盖官方病例和风险口径。",
      sourceIds: ["ap-may8", "reuters-may8"]
    },
    {
      date: "2026-05-09",
      type: "official",
      title: "ECDC 返程指导：全船人员按高风险接触者管理",
      place: "ECDC",
      detail:
        "ECDC 2026-05-09 Rapid Scientific Advice 为返程与下船处置设定了更保守的管理口径：全船人员先按高风险接触者管理，最多监测/隔离 42 天，且该文档把 Day 0 记为 5 月 6 日。",
      sourceIds: ["ecdc-rapid-advice"]
    },
    {
      date: "2026-05-10",
      type: "response",
      title: "ECDC：MV Hondius 已抵达 Tenerife，乘客开始下船返程",
      place: "Tenerife, Spain",
      detail:
        "ECDC 2026-05-10 每日页写该船已抵达 Tenerife 港口，乘客正在下船并分批搭乘返程航班；若此后不再有船上新暴露，5 月 10 日可继续作为后续观察窗口锚点。",
      sourceIds: ["ecdc-daily"]
    },
    {
      date: "2026-05-10",
      type: "official",
      title: "CDC 临时指导：船上暴露按下船后继续进入 42 天随访",
      place: "United States",
      detail:
        "CDC 2026-05-10 Interim Guidance 把 4 月 6 日至相关暴露乘客完成下船期间在 MV Hondius 上的经历定义为潜在暴露，并把返程后 42 天的日常监测、自我隔离触发和分级随访作为核心处置。",
      sourceIds: ["cdc-guidance"]
    },
    {
      date: "2026-05-13",
      type: "official",
      title: "ECDC 每日页维持 11 例，并改列为 8 确诊、2 可能、1 未定论、3 死亡",
      place: "ECDC",
      detail:
        "ECDC 2026-05-13 页面写明截至 2026-05-13 14:00 共 11 例，其中 8 确诊、2 可能、1 例未定论、0 疑似、3 死亡；并继续写明人传人通常需要密切、长期接触，EU/EEA 普通人群风险非常低。",
      sourceIds: ["ecdc-daily"]
    },
    {
      date: "2026-05-24",
      type: "monitoring",
      title: "2 周观察窗",
      place: "Monitoring",
      detail:
        "按 5 月 10 日最后船上暴露锚点估算，若无脱离已知接触链病例，可视为第一个积极观察信号；这不是官方结案标准。",
      sourceIds: ["ecdc-daily", "cdc-andes"]
    },
    {
      date: "2026-06-21",
      type: "monitoring",
      title: "42 天潜伏期窗口",
      place: "Monitoring",
      detail:
        "CDC Andes virus 页面写症状可在暴露后 4-42 天出现；若无新链条，公共卫生担忧会明显下降。",
      sourceIds: ["cdc-andes"]
    },
    {
      date: "2026-06-21",
      type: "monitoring",
      title: "WHO 高风险接触者 42 天主动监测/隔离窗口",
      place: "Monitoring",
      detail:
        "WHO 2026-05-08 DON600 要求高风险接触者自最后暴露起 42 天主动症状监测并采取居家或设施隔离；若以 5 月 10 日作为公开追踪锚点，窗口到 6 月 21 日，但个体起算日可能因返程安排不同而略有差异。",
      sourceIds: ["who-don", "cdc-guidance"]
    }
  ],
  signals: [
    {
      severity: "watch",
      name: "WHO 与 ECDC 出现 3 例病例差异",
      current: "已出现，仍待 WHO/CDC 跟进说明",
      why: "WHO DON600 仍为 6 确诊、2 可能，共 8 例；ECDC 2026-05-13 每日页仍报 11 例，但改列为 8 确诊、2 可能、1 例未定论。现阶段两者对公众风险判断没有同步上调，因此更像已知观察人群中的补充识别与重新分类，而不是风险边界已改变。",
      action: "不要把不同机构口径压成单一总数；后续重点看 WHO DON 或 CDC 是否补充这 3 例差异及 ECDC 未定论病例的来源、接触链和最终分类。",
      sourceIds: ["who-don", "ecdc-daily", "cdc-current"]
    },
    {
      severity: "green",
      name: "官方风险等级维持低/非常低/极低",
      current: "满足",
      why: "WHO 对全球公众风险为低，ECDC 对 EU/EEA 普通人群风险为非常低，CDC 对美国公众和旅行者风险为极低；但 WHO 对船上乘客和船员风险为中等。",
      action: "继续按既定节奏核对 WHO、ECDC、CDC 更新。",
      sourceIds: ["who-don", "ecdc-daily", "cdc-current"]
    },
    {
      severity: "green",
      name: "新增病例仍属于已知乘客/船员/密接圈",
      current: "待持续确认",
      why: "截至 WHO 2026-05-08、ECDC 2026-05-13 与 CDC 2026-05-12，官方仍只描述已知乘客、船员或密接圈内病例；即便 ECDC 维持 11 例，现有公开页面也没有把它描述为脱离已知接触环境的社区传播。",
      action: "看病例是否脱离已知接触链，而不只看新增数字。",
      sourceIds: ["who-don", "ecdc-daily"]
    },
    {
      severity: "watch",
      name: "船医病例与船上有限人传人证据",
      current: "已出现，仍属于已知船上接触链",
      why: "WHO DON600 列出一名船医确诊，并写当前证据指向船上后续人传人；CDC 与 ECDC 也继续强调这类传播通常限于密切、长期接触，这仍符合已知的有限人传人模式，不等于普通短暂接触传播。",
      action: "重点看是否出现脱离已知船上环境的连续医护感染、家庭外二代链条或普通接触传播证据。",
      sourceIds: ["who-don", "cdc-current", "ecdc-assessment"]
    },
    {
      severity: "watch",
      name: "返程后 42 天观察已转为核心管理阶段",
      current: "已进入",
      why: "ECDC 2026-05-09 Rapid Scientific Advice 与 CDC 2026-05-10 Interim Guidance 都把返程后的接触者随访、监测和分级处置放到前台；这不代表公众风险上调，但说明监测重点已从船上应急处置转向返程后随访。",
      action: "未来若出现新增病例，先判断其是否发生在官方已定义的观察人群内，再判断是否构成新的传播边界变化。",
      sourceIds: ["ecdc-rapid-advice", "cdc-guidance", "who-don"]
    },
    {
      severity: "red",
      name: "无邮轮、无南美旅行、无鼠类暴露、无密接的新确诊",
      current: "未见官方证据",
      why: "这会提示可能存在未识别传播链或独立动物暴露。",
      action: "若出现多个，应把站点状态改为重新核对传播边界和风险口径。",
      sourceIds: ["ecdc-daily", "who-response"]
    },
    {
      severity: "red",
      name: "普通短暂接触传播被证实",
      current: "未见官方证据",
      why: "当前风险评估依赖于 Andes virus 人传人通常需要密切、长期接触。",
      action: "若证实，应等待 WHO/ECDC 更新感染控制建议。",
      sourceIds: ["ecdc-assessment", "cdc-andes"]
    },
    {
      severity: "red",
      name: "WHO/ECDC/CDC 上调公众风险等级",
      current: "未发生",
      why: "风险等级上调是综合流行病学、传播链、检测和处置能力后的硬信号。",
      action: "若上调到中/高，优先跟官方建议而不是社交媒体解读。",
      sourceIds: ["who-don", "ecdc-daily", "cdc-current"]
    }
  ],
  updateProtocol: [
    {
      period: "即日到抵港处置完成",
      cadence: "每天一次",
      focus: "WHO/ECDC 是否改病例数、风险等级、抵港和隔离安排。"
    },
    {
      period: "抵港后 2 周",
      cadence: "每 2-3 天一次",
      focus: "是否出现脱离已知接触圈病例；新增是否只是潜伏期内已知人群。"
    },
    {
      period: "2 周后到 42 天窗口结束",
      cadence: "每周一次",
      focus: "是否有二代/三代链条、医护连续感染、高风险接触者观察期内的新病例，以及风险等级上调。"
    },
    {
      period: "6 月下旬以后",
      cadence: "转为被动观察",
      focus: "仅在 WHO/ECDC/CDC 发布新警报或新病例链时恢复高频更新。"
    }
  ],
  sources: [
    {
      id: "who-don",
      priority: 1,
      name: "WHO Disease Outbreak News: Hantavirus cluster linked to cruise ship travel",
      org: "WHO",
      date: "2026-05-08",
      url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600",
      useFor: "最新 WHO 一手口径：8 例、6 确诊、2 可能、3 死亡、全球风险低、船上风险中等、船上传播证据",
      roles: ["primary-count", "global-risk", "ship-risk", "transmission-assessment"],
      active: true
    },
    {
      id: "who-don-2026-05-04",
      priority: 1,
      name: "WHO Disease Outbreak News: initial cruise ship cluster report",
      org: "WHO",
      date: "2026-05-04",
      url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599",
      useFor: "初始病例、路线、临床表现、风险评估、45 天监测建议",
      roles: ["historical-baseline"],
      active: true
    },
    {
      id: "who-response",
      priority: 1,
      name: "WHO response to hantavirus cases linked to a cruise ship",
      org: "WHO",
      date: "2026-05-07",
      url: "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
      useFor: "5 月 7 日 WHO 过渡更新口径：8 例、5 确诊、3 死亡、Andes virus、低风险",
      roles: ["historical-count-check", "historical-risk-check"],
      active: true
    },
    {
      id: "ecdc-daily",
      priority: 1,
      name: "Andes Hantavirus outbreak in cruise ship, May 2026",
      org: "ECDC",
      date: "2026-05-13",
      url: "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
      useFor: "每日更新病例分类、死亡数、欧洲风险评估；最新页维持 11 例，但改列为 8 确诊、2 可能、1 未定论、3 死亡，并确认船已于 5 月 11 日完成下船返程",
      roles: ["comparison-count", "regional-risk", "travel-anchor"],
      active: true
    },
    {
      id: "ecdc-assessment",
      priority: 1,
      name: "Hantavirus-associated cluster of illness on a cruise ship: ECDC assessment and recommendations",
      org: "ECDC",
      date: "2026-05-06",
      url: "https://www.ecdc.europa.eu/en/publications-data/hantavirus-associated-cluster-illness-cruise-ship-ecdc-assessment-and",
      useFor: "传播方式、接触者管理、欧洲公共卫生建议",
      roles: ["background-assessment", "transmission-context"],
      active: true
    },
    {
      id: "ecdc-rapid-advice",
      priority: 1,
      name: "Rapid Scientific Advice on the management of passengers - In the context of the Andes virus outbreak on the cruise ship MV Hondius",
      org: "ECDC",
      date: "2026-05-09",
      url: "https://www.ecdc.europa.eu/en/publications-data/rapid-scientific-advice-management-passengers-context-andes-virus-outbreak-cruise",
      useFor: "返程与下船管理口径：全船人员按高风险接触者管理、Day 0 = 2026-05-06、最长 42 天监测/隔离",
      roles: ["contact-management", "monitoring-window"],
      active: true
    },
    {
      id: "cdc-current",
      priority: 1,
      name: "Hantavirus: Current Situation",
      org: "CDC",
      date: "2026-05-12",
      url: "https://www.cdc.gov/hantavirus/situation-summary/index.html",
      useFor: "美国公众和旅行者风险、美国是否确认相关病例、返美乘客监测和公共卫生协作",
      roles: ["us-risk", "us-cases", "response-coordination"],
      active: true
    },
    {
      id: "cdc-statement",
      priority: 1,
      name: "Statement on the M/V Hondius Cruise Ship",
      org: "CDC",
      date: "2026-05-07",
      url: "https://www.cdc.gov/media/releases/2026-hantavirus-confirmed-cruise-ship.html",
      useFor: "美国早期声明、美国旅客指引、跨机构协调",
      roles: ["historical-us-statement"],
      active: true
    },
    {
      id: "cdc-guidance",
      priority: 1,
      name: "CDC Interim Guidance for Public Health Assessment and Management of People with Potential Exposure to Andes Virus",
      org: "CDC",
      date: "2026-05-10",
      url: "https://www.cdc.gov/hantavirus/media/pdfs/2026/05/Andes_virus_guidance_8FINAL.pdf",
      useFor: "返程后接触者管理、船上暴露定义、高风险/低风险分层、42 天随访",
      roles: ["contact-management", "monitoring-window", "exposure-definition"],
      active: true
    },
    {
      id: "cdc-andes",
      priority: 1,
      name: "About Andes Virus",
      org: "CDC",
      date: "2026-05-09",
      url: "https://www.cdc.gov/hantavirus/about/andesvirus.html",
      useFor: "Andes virus 症状、4-42 天窗口、有限人传人背景",
      roles: ["background-symptoms", "background-transmission"],
      active: true
    },
    {
      id: "ap-may8",
      priority: 2,
      name: "Spanish authorities prepare for hantavirus cruise ship arrival",
      org: "AP",
      date: "2026-05-08",
      url: "https://apnews.com/article/e5b35d12be9dc30213d7a2b8b4955a88",
      useFor: "行动进展、船舶抵达和疏散安排；不作为医学风险主口径",
      roles: ["logistics-only"],
      active: true
    },
    {
      id: "reuters-may8",
      priority: 2,
      name: "Singapore tests two residents for hantavirus after cruise outbreak",
      org: "Reuters",
      date: "2026-05-08",
      url: "https://www.reuters.com/business/healthcare-pharmaceuticals/singapore-tests-two-residents-hantavirus-after-cruise-outbreak-2026-05-08/",
      useFor: "各国接触者追踪和检测行动进展；不作为医学风险主口径",
      roles: ["logistics-only"],
      active: true
    }
  ]
};
