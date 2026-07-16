# 编码规范

## 通用
- JavaScript ES5标准（兼容微信/抖音小程序）
- 使用 `'use strict'`
- 零外部依赖（纯原生HTML/CSS/JS）
- 缩进：2空格

## 引擎编码规范
- 游戏引擎使用 IIFE 模式：`(function(global){...})(window||global)`
- 对外暴露 `BounceTower.create(platform)` 工厂方法
- platform 对象包含所有外部依赖（ctx, raf, 存储, 音效, 震动）
- 重要状态使用局部变量闭包，不挂在全局对象上
- 每行不超过100字符

## UI编码规范
- 首页：flexbox 布局，column 方向
- canvas：全屏绝对定位，负责游戏渲染
- HTML元素：z-index 分层（home:10, hud:5, tools:5, panel:15, toast:30）
- 安全区域：所有定位使用 `env(safe-area-inset-*)`
- 按钮反馈：transform scale + transition

## 存储规范
- localStorage key 列表：stars, lvl, stats, mute, theme, tutDone, shareBonus, best

## 关卡设计规范
- LEVELS 数组：`{id, name, target, speedMul, widthPct, desc}`
- 奇数关缓冲，偶数关断崖
- 每5关一个难度峰值

## 提交规范
- 提交信息使用中文
- 简洁描述改动内容
