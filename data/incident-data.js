window.INCIDENT_DATA = {
  meta: {
    title: "MV Hondius Andes Hantavirus 事件追踪",
    subtitle: "新闻核验、时间线、风险信号与数据看板",
    asOf: "2026-05-09",
    timezone: "America/New_York",
    dataVersion: "2026-05-09.v2",
    posture:
      "截至本版，最新 WHO 一手通报支持“严重的局部旅行/密接暴露事件，而非 COVID 式广泛传播”的判断；WHO 与 ECDC 的 5 月 8 日病例分类存在时间点差异，本站并列展示。"
  },
  summary: [
    "本事件涉及汉坦病毒家族中的 Andes virus，不应简单写成 Hantaan virus。",
    "WHO 2026-05-08 DON600 写明：8 例报告病例，6 例实验室确诊为 Andes virus，2 例可能，3 人死亡；WHO 将全球风险评估为低，船上乘客和船员风险为中等。",
    "ECDC 2026-05-08 每日页仍显示 5 确诊、2 可能、1 疑似、3 死亡；这是需要在自动化中保留的来源差异，不应强行合并。",
    "CDC 2026-05-08 Current Situation 写明美国尚无因此事件报告的 Andes virus 病例，美国公众和旅行者总体风险仍极低。"
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
      label: "ECDC 同日口径",
      value: "8",
      detail: "5 确诊 / 2 可能 / 1 疑似 / 3 死亡",
      tone: "violet",
      sourceIds: ["ecdc-daily"]
    },
    {
      label: "死亡",
      value: "3",
      detail: "WHO: CFR 38%",
      tone: "red",
      sourceIds: ["who-don", "ecdc-daily"]
    },
    {
      label: "船上风险",
      value: "中等",
      detail: "WHO 对乘客和船员的事件相关风险",
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
      detail: "CDC: routine travel can continue",
      tone: "teal",
      sourceIds: ["cdc-current"]
    }
  ],
  caseStatus: [
    { label: "确诊", value: 6, color: "#1f6feb" },
    { label: "可能", value: 2, color: "#d29922" }
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
      date: "2026-05-08",
      total: 8,
      confirmed: 5,
      probable: 2,
      suspected: 1,
      nonCases: null,
      deaths: 3,
      publicRisk: "EU/EEA general population very low",
      note: "ECDC 每日页保留一个疑似病例；与 WHO DON600 不强行合并。",
      sourceIds: ["ecdc-daily"]
    },
    {
      source: "CDC Current Situation",
      date: "2026-05-08",
      total: null,
      confirmed: null,
      probable: null,
      suspected: null,
      nonCases: null,
      deaths: null,
      publicRisk: "US public and travelers extremely low",
      note: "CDC 写明美国尚无因此事件报告的 Andes virus 病例，常规旅行可继续。",
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
      date: "2026-05-08",
      sourceIds: ["ecdc-daily"]
    },
    {
      org: "CDC",
      rating: "Extremely low",
      audience: "美国公众与旅行者",
      date: "2026-05-08",
      sourceIds: ["cdc-current"]
    }
  ],
  monitoringWindows: [
    {
      label: "第一观察窗",
      from: "2026-05-10",
      to: "2026-05-24",
      rule: "若以 ECDC 写明的预计抵达/集中处置日 5 月 10 日作为最后船上暴露锚点，+14 天是第一个积极信号窗口。",
      sourceIds: ["ecdc-daily"]
    },
    {
      label: "Andes 症状上限",
      from: "2026-05-10",
      to: "2026-06-21",
      rule: "CDC Andes virus 页面写症状可在暴露后 4-42 天出现；42 天窗口到 6 月 21 日。",
      sourceIds: ["cdc-andes"]
    },
    {
      label: "WHO 主动监测",
      from: "2026-05-10",
      to: "2026-06-24",
      rule: "WHO 对乘客和船员建议 45 天主动症状监测；按 5 月 10 日锚点约到 6 月 24 日。",
      sourceIds: ["who-don"]
    }
  ],
  route: [
    { date: "2026-04-01", place: "Ushuaia, Argentina", label: "启航" },
    { date: "2026-04-07", place: "South Georgia", label: "南大西洋行程" },
    { date: "2026-04-14", place: "Tristan da Cunha", label: "停靠/航行" },
    { date: "2026-04-24", place: "Saint Helena", label: "医疗处置" },
    { date: "2026-05-10", place: "Tenerife, Spain", label: "预计抵达" }
  ],
  events: [
    {
      date: "2026-04-01",
      type: "voyage",
      title: "MV Hondius 从阿根廷乌斯怀亚启航",
      place: "Ushuaia, Argentina",
      detail:
        "WHO DON 写明该船搭载 147 人，行程涉及南大西洋、南极相关区域、南乔治亚、Tristan da Cunha、Saint Helena 等。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-06",
      type: "clinical",
      title: "首例症状出现",
      place: "On board",
      detail:
        "病例发病时间区间从 4 月 6 日持续到 4 月 28 日；早期表现包括发热、胃肠道症状，部分进展为肺炎、ARDS 和休克。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-11",
      type: "clinical",
      title: "首例在船上死亡",
      place: "On board",
      detail:
        "WHO DON 记录第一名出现症状的乘客约 5 天后死亡；早期诊断未立即锁定 Andes virus。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-24",
      type: "response",
      title: "Saint Helena 相关医疗处置",
      place: "Saint Helena",
      detail:
        "WHO DON 描述船舶抵达 Saint Helena 后进行了遗体下船、医疗评估、实验室样本安排和接触者追踪等处置。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-25",
      type: "clinical",
      title: "第二名病例在飞往 Johannesburg 途中恶化",
      place: "Johannesburg route",
      detail:
        "WHO DON 记录该病例在转运途中病情恶化，随后在南非接受检测并确认汉坦病毒感染。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-26",
      type: "clinical",
      title: "第二名病例死亡，其他病例继续出现",
      place: "South Africa / on board",
      detail:
        "WHO DON 记录第二名病例死亡；病例簇仍在已知船舶和旅行接触范围内被识别。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-04-28",
      type: "clinical",
      title: "病例发病区间延伸至 4 月 28 日",
      place: "On board",
      detail:
        "WHO DON 将本次病例发病时间列为 4 月 6 日至 4 月 28 日，支持后续仍需等待潜伏期内病例显形。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-05-02",
      type: "response",
      title: "WHO 接到事件通报",
      place: "International reporting",
      detail:
        "WHO DON 写明 5 月 2 日收到本次多国邮轮相关汉坦病毒聚集事件通报。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-05-04",
      type: "official",
      title: "WHO 发布 Disease Outbreak News",
      place: "WHO",
      detail:
        "WHO 初始通报描述病例、路线、临床表现、调查方向和公共卫生建议；风险评估为低。",
      sourceIds: ["who-don"]
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
        "WHO 5 月 8 日 DON600 写明所有 6 例实验室确诊均为 Andes virus；全球风险为低，船上乘客和船员风险为中等。WHO 同时指出当前证据指向船上后续人传人，但仍需流行病学和测序调查确认链条细节。",
      sourceIds: ["who-don"]
    },
    {
      date: "2026-05-08",
      type: "official",
      title: "CDC Current Situation：美国公众和旅行者风险极低",
      place: "United States",
      detail:
        "CDC 写明美国尚无因此事件报告的 Andes virus 病例，常规旅行可继续；Andes virus 人传人通常限于密切接触。",
      sourceIds: ["cdc-current"]
    },
    {
      date: "2026-05-08",
      type: "official",
      title: "ECDC 每日页更新病例分类和欧洲风险评估",
      place: "ECDC",
      detail:
        "ECDC 写明 8 例中 5 确诊、2 可能、1 疑似、3 死亡；EU/EEA 普通人群风险非常低。",
      sourceIds: ["ecdc-daily"]
    },
    {
      date: "2026-05-10",
      type: "response",
      title: "预计抵达 Tenerife/Granadilla",
      place: "Tenerife, Spain",
      detail:
        "ECDC 5 月 8 日页面写该船预计 5 月 10 日抵达 Tenerife。若该日后不再有船上新暴露，可作为后续监测窗口锚点。",
      status: "planned",
      sourceIds: ["ecdc-daily"]
    },
    {
      date: "2026-05-24",
      type: "monitoring",
      title: "2 周观察窗",
      place: "Monitoring",
      detail:
        "按 5 月 10 日最后船上暴露锚点估算，若无脱离已知接触链病例，是第一个积极信号；这不是官方结案标准。",
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
      date: "2026-06-24",
      type: "monitoring",
      title: "45 天主动症状监测窗口",
      place: "Monitoring",
      detail:
        "WHO 对乘客和船员建议主动症状监测 45 天；若风险等级仍低且无无来源病例，可基本收尾。",
      sourceIds: ["who-don"]
    }
  ],
  signals: [
    {
      severity: "green",
      name: "官方风险等级维持低/非常低/极低",
      current: "满足",
      why: "WHO 对全球公众风险为低，ECDC 对 EU/EEA 普通人群风险为非常低，CDC 对美国公众和旅行者风险为极低；但 WHO 对船上乘客和船员风险为中等。",
      action: "继续低频查看官方更新。",
      sourceIds: ["who-don", "ecdc-daily", "cdc-current"]
    },
    {
      severity: "green",
      name: "新增病例仍属于已知乘客/船员/密接圈",
      current: "待持续确认",
      why: "潜伏期内已知暴露者新增发病并不等同社区传播。",
      action: "看病例关系链，不只看新增数字。",
      sourceIds: ["who-don", "ecdc-daily"]
    },
    {
      severity: "watch",
      name: "船医病例与船上有限人传人证据",
      current: "已出现，仍属于已知船上接触链",
      why: "WHO DON600 列出一名船医确诊，并写当前证据指向船上后续人传人；这符合 Andes virus 可在密切、长期接触中有限传播的已知模式，不等于普通短暂接触传播。",
      action: "继续看是否出现规范防护下的连续医护感染、家庭外二代链条或普通接触传播证据。",
      sourceIds: ["who-don", "cdc-current", "ecdc-assessment"]
    },
    {
      severity: "red",
      name: "无邮轮、无南美旅行、无鼠类暴露、无密接的新确诊",
      current: "未见官方证据",
      why: "这会提示可能存在未识别传播链或独立动物暴露。",
      action: "若出现多个，应重新评估个人风险和信息更新频率。",
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
      period: "2 周后到 45 天窗口结束",
      cadence: "每周一次",
      focus: "是否有二代/三代链条、医护连续感染、风险等级上调。"
    },
    {
      period: "6 月下旬以后",
      cadence: "停止主动跟踪",
      focus: "除非 WHO/ECDC/CDC 发布新警报。"
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
      useFor: "最新 WHO 一手口径：8 例、6 确诊、2 可能、3 死亡、全球风险低、船上风险中等、船上传播证据"
    },
    {
      id: "who-don-2026-05-04",
      priority: 1,
      name: "WHO Disease Outbreak News: initial cruise ship cluster report",
      org: "WHO",
      date: "2026-05-04",
      url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599",
      useFor: "初始病例、路线、临床表现、风险评估、45 天监测建议"
    },
    {
      id: "who-response",
      priority: 1,
      name: "WHO response to hantavirus cases linked to a cruise ship",
      org: "WHO",
      date: "2026-05-07",
      url: "https://www.who.int/news/item/07-05-2026-who-s-response-to-hantavirus-cases-linked-to-a-cruise-ship",
      useFor: "最新 WHO 口径：8 例、5 确诊、3 死亡、Andes virus、低风险"
    },
    {
      id: "ecdc-daily",
      priority: 1,
      name: "Andes Hantavirus outbreak in cruise ship, May 2026",
      org: "ECDC",
      date: "2026-05-08",
      url: "https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak",
      useFor: "每日更新病例分类、死亡数、欧洲风险评估、预计抵达 Tenerife 日期"
    },
    {
      id: "ecdc-assessment",
      priority: 1,
      name: "Hantavirus-associated cluster of illness on a cruise ship: ECDC assessment and recommendations",
      org: "ECDC",
      date: "2026-05-05",
      url: "https://www.ecdc.europa.eu/en/publications-data/hantavirus-associated-cluster-illness-cruise-ship-ecdc-assessment-and",
      useFor: "传播方式、接触者管理、欧洲公共卫生建议"
    },
    {
      id: "cdc-current",
      priority: 1,
      name: "Hantavirus: Current Situation",
      org: "CDC",
      date: "2026-05-08",
      url: "https://www.cdc.gov/hantavirus/situation-summary/index.html",
      useFor: "美国公众和旅行者风险、美国是否报告相关病例、传播与症状口径"
    },
    {
      id: "cdc-statement",
      priority: 1,
      name: "Statement on the M/V Hondius Cruise Ship",
      org: "CDC",
      date: "2026-05-07",
      url: "https://www.cdc.gov/media/releases/2026-hantavirus-confirmed-cruise-ship.html",
      useFor: "美国早期声明、美国旅客指引、跨机构协调"
    },
    {
      id: "cdc-andes",
      priority: 1,
      name: "About Andes Virus",
      org: "CDC",
      date: "2026-04-18",
      url: "https://www.cdc.gov/hantavirus/about/andesvirus.html",
      useFor: "Andes virus 症状、4-42 天窗口、有限人传人背景"
    },
    {
      id: "ap-may8",
      priority: 2,
      name: "Spanish authorities prepare for hantavirus cruise ship arrival",
      org: "AP",
      date: "2026-05-08",
      url: "https://apnews.com/article/e5b35d12be9dc30213d7a2b8b4955a88",
      useFor: "行动进展、船舶抵达和疏散安排；不作为医学风险主口径"
    },
    {
      id: "reuters-may8",
      priority: 2,
      name: "Singapore tests two residents for hantavirus after cruise outbreak",
      org: "Reuters",
      date: "2026-05-08",
      url: "https://www.reuters.com/business/healthcare-pharmaceuticals/singapore-tests-two-residents-hantavirus-after-cruise-outbreak-2026-05-08/",
      useFor: "各国接触者追踪和检测行动进展；不作为医学风险主口径"
    }
  ]
};
