# Detection 报告发送后重置设计

## 目标

`detection` 页面成功调用 `addSmileAssess` 发送报告后，将顶部分析分数和四组图表数据恢复为首次进入页面时的状态，同时保留刚生成报告的 `detailsId`，确保“查看报告”仍可用。

## 方案

在 `src/views/front/views/detection/index.vue` 中增加一个单一职责的重置方法。该方法把 `analysisData`、`LeftTopValueData`、`leftBottomValueData`、`rightTopValueData`、`psychologyData`、`positiveData` 和 `negativeData` 恢复为 `data()` 中对应的初始值，不修改 `detailsId`。

仅在 `addSmileAssess` 返回成功码后，先保存 `detailsId`，再调用重置方法。现有图表子组件继续通过 props 的 watcher 接收新数组并刷新，无需操作 ECharts 实例或强制重建组件。

## 异常行为

接口失败或返回非成功码时不重置，保留当前检测结果，便于用户重试。现有消息和报告跳转逻辑不变。

## 验证标准

- 报告发送成功后，顶部分析分数回到初始空态，所有图表回到初始零值状态。
- 成功后点击“查看报告”，仍能使用保存的 `detailsId` 打开刚生成的报告。
- 报告发送失败时，当前分数和图表数据保持不变。
- 项目构建通过。
