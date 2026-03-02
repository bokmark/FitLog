# FitLog 健身计划小程序

一个微信小程序，用于管理个人健身计划和记录训练打卡。

## 功能

- **今日训练**：展示当天的训练计划，支持每组打卡，实时显示完成进度
- **计划管理**：按周循环安排训练，自由编辑每天的动作、组数、次数、重量
- **动作示例**：每个动作可添加示例图片或视频
- **明日预览**：提前查看明天的训练内容
- **打卡历史**：日历视图展示历史打卡记录，点击查看每日详情

## 项目结构

```
├── app.js / app.json / app.wxss    # 全局配置与样式
├── pages/
│   ├── today/                       # 今日训练（首页）
│   ├── plan/                        # 我的计划
│   ├── plan-edit/                   # 编辑某天训练
│   ├── exercise-edit/               # 编辑动作（含媒体上传）
│   ├── tomorrow/                    # 明日预览
│   └── history/                     # 打卡记录
├── components/
│   ├── exercise-card/               # 动作卡片组件
│   ├── set-checker/                 # 单组打卡组件
│   └── media-viewer/                # 图片/视频预览弹窗
├── services/
│   ├── storage.js                   # 存储抽象层
│   ├── plan-service.js              # 计划管理
│   └── checkin-service.js           # 打卡管理
└── utils/
    └── date.js                      # 日期工具
```

## 使用方式

1. 使用微信开发者工具打开本项目
2. 在 `project.config.json` 中替换为你自己的 `appid`
3. 编译运行

## 数据存储

当前使用 `wx.setStorageSync` 本地存储。存储层已做抽象（`services/storage.js`），后续可平滑切换至微信云开发。
