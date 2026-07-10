# 编码规范

## 通用
- JavaScript，ES5 标准（兼容微信/抖音小程序）
- 使用 `'use strict'`
- 无外部依赖（纯原生 HTML/CSS/JS）
- 缩进：2空格

## 引擎编码规范
- 游戏引擎使用 IIFE 模式：`(function(global){...})(typeof window!=='undefined'?window:...)`
- 对外暴露 `BounceTower.create(platform)` 工厂方法
- platform 对象包含所有外部依赖（ctx, raf, 存储, 音效, 震动等）
- 重要状态使用局部变量闭包，不挂在全局对象上
- 每行不超过100字符

## UI编码规范
- 首页：flexbox 布局，column 方向
- canvas：全屏绝对定位，负责游戏渲染
- HTML元素：z-index 分层（home:10, hud:5, tools:5, panel:15, toast:30）
- 安全区域：所有定位使用 `env(safe-area-inset-*)`
- 按钮反馈：transform scale + transition

## 存储规范
- localStorage key 列表：
  - `'stars'`：关卡星级 `{levelId: stars}`
  - `'lvl'`：当前关卡
  - `'stats'`：统计数据（总局数、总层数、成就等）
  - `'mute'`：静音状态
  - `'theme'`：当前主题
  - `'tutDone'`：新手引导完成
  - `'shareBonus'`：分享获得的道具加成
  - `'best'`：最高分
- 写入失败时（QuotaExceeded）通知用户
