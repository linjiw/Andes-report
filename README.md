# MV Hondius Andes Hantavirus 事件追踪

这个目录是一个无依赖的中文静态看板，用来整理 MV Hondius 邮轮相关 Andes virus / hantavirus 事件的新闻核验、时间线、关键数字、风险信号和后续观察窗口。设计目标是“信号驱动”，不是普通新闻流。

## 打开看板

直接打开 [index.html](/Users/linji/projects/Andes-report/index.html) 即可。页面数据来自 [data/incident-data.js](/Users/linji/projects/Andes-report/data/incident-data.js)，并提供两个可用于表格软件的 CSV：

- [data/events.csv](/Users/linji/projects/Andes-report/data/events.csv)
- [data/sources.csv](/Users/linji/projects/Andes-report/data/sources.csv)

## 快速核验新闻

运行：

```bash
npm run check-news
```

脚本会抓取 WHO、ECDC、CDC 的官方页面，尝试解析病例数、死亡数和风险措辞。它不是自动事实判断器，作用是提醒你“官方数字或风险口径是否可能发生变化”。如果脚本提示 count change warning，先打开官方源确认上下文，再改数据和叙述。

需要机器可读输出时：

```bash
node scripts/check-news.mjs --json
```

保存官方来源快照：

```bash
npm run snapshot-news
```

生成编辑草稿：

```bash
npm run draft-update
```

For the scheduled end-to-end refresh path that saves organized artifacts and validates before publish:

```bash
npm run update-news
```

完整验证：

```bash
npm run validate
```

完整验证并实时检查官方来源：

```bash
npm run validate-with-news
```

## 当前口径

不要把本 README 当作当前病例和风险数字的权威副本。最新公开状态应以这些位置为准：

- 首页与历史页：[`index.html`](/Users/linji/projects/Andes-report/index.html) 和 [`history.html`](/Users/linji/projects/Andes-report/history.html)
- 当前结构化数据：[`data/incident-data.js`](/Users/linji/projects/Andes-report/data/incident-data.js)
- 最近一次自动官方检查：[`data/source-snapshots/latest.json`](/Users/linji/projects/Andes-report/data/source-snapshots/latest.json)
- 规范来源注册表：[`data/source-registry.json`](/Users/linji/projects/Andes-report/data/source-registry.json)

## Project docs

- [docs/DESIGN_PLAN.md](/Users/linji/projects/Andes-report/docs/DESIGN_PLAN.md)
- [docs/NEWS_UPDATE_PLAYBOOK.md](/Users/linji/projects/Andes-report/docs/NEWS_UPDATE_PLAYBOOK.md)
- [docs/AUTOMATIONS.md](/Users/linji/projects/Andes-report/docs/AUTOMATIONS.md)
- [docs/progress/2026-05-09.md](/Users/linji/projects/Andes-report/docs/progress/2026-05-09.md)
- [repo-local Codex skill](/Users/linji/projects/Andes-report/.codex/skills/andes-report-updater/SKILL.md)

## 更新规则

优先更新顺序：

1. WHO Disease Outbreak News 和 WHO 事件响应页。
2. ECDC 每日更新页和 ECDC assessment。
3. CDC 声明和 CDC Andes virus 背景页。
4. AP / Reuters 只用于行动进展，例如抵达、疏散、各国检测和隔离安排。

更新时重点看这些硬信号：

- 官方风险等级是否从低/非常低/极低上调。
- 是否出现脱离邮轮、南美旅行、鼠类暴露或密切接触链的新病例。
- 是否证实普通短暂接触传播。
- 是否出现多名医护或接触者在规范防护下连续感染。
- 新增病例是否只是已知暴露者在潜伏期内显形。

## 主要来源

公开来源清单在两处维护：

- 机器可读注册表：[`data/source-registry.json`](/Users/linji/projects/Andes-report/data/source-registry.json)
- 页面展示列表：[`sources.html`](/Users/linji/projects/Andes-report/sources.html)

## 说明

这是新闻和公共卫生信息整理，不是医疗建议。若有实际暴露史或症状，应联系医生或当地卫生部门，并主动说明旅行、鼠类或 Andes hantavirus 相关接触史。
