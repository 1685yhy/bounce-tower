# 弹弹塔 Bounce Tower

一个HTML5 Canvas塔堆叠游戏，下方方块向上冲刺撞击顶部堆叠区。

## 项目结构

```
bounce-tower/
├── deploy/                    # 线上部署文件
│   ├── index.html             # 游戏主页面（所有UI+逻辑）
│   └── game-engine.js         # 游戏引擎（核心机制+渲染）
├── shared/
│   └── game-engine.js         # 引擎源码（deploy/game-engine.js 的源文件）
├── wechat/                    # 微信小程序版
├── douyin/                    # 抖音小程序版
├── .claude/
│   ├── agents/                # 专业agent定义
│   │   ├── game-designer.md   # 游戏策划
│   │   ├── ui-designer.md     # UI/UX设计师
│   │   └── qa-tester.md       # QA测试
│   └── CLAUDE.md              # 本文件
├── deploy.sh                  # 一键部署脚本
└── index.html                 # 旧版入口（非deploy目录版本）
```

## 核心架构

### 引擎 (`game-engine.js`)
引擎使用 IIFE 模式暴露全局 `BounceTower` 对象。通过 `BounceTower.create(platform)` 创建游戏实例。

核心状态变量：
- `stack[]`：堆叠的方块数组，每块有 `{x, y, w, color}`
- `cur`：当前移动的方块
- `score`：当前层数
- `combo/maxCombo`：连击数
- `status`：游戏状态（idle/playing/dropping/gameover/levelcomplete）

### 新布局机制（v7.0+）
- `STACK_ANCHOR`：堆叠区顶部锚点（屏幕顶部下方~70px处）
- `BLOCK_SPAWN_Y`：方块生成位置（屏幕底部上方~80px处）
- `stackOffset`：每放一块整体上移一个块高，视觉保持固定

### 关键常量
- `SPB = W*0.014`：基础速度
- `SPI = W*0.000026`：每层速度增量（大幅降低，避免后期超屏幕宽）
- `IBW = min(W*0.5, 200) * widthPct`：初始方块宽
- `PERF = IBW * 6%`：完美判定（随宽度缩放）
- `widthPct`：每关独立配置的宽度百分比

## 关卡系统
50关，奇数缓冲/偶数断崖。每关数据结构：
```js
{id, name, target, speedMul, widthPct, desc}
```

星级判定：
- 1星：达到 target
- 2星：达到 target × 1.2
- 3星：达到 target × 1.5

31关以后：每落5层速度加速5%，最高1.6倍。

## 常用命令
```bash
./deploy.sh          # 一键部署到服务器
cp shared/game-engine.js deploy/game-engine.js   # 同步引擎
sshpass -p '密码' scp deploy/* root@47.102.42.238:/opt/bounce-tower/  # 手动上传
```

## 部署信息
- 服务器：47.102.42.238（root）
- 部署目录：/opt/bounce-tower/
- 访问地址：http://47.102.42.238
- GitHub：https://github.com/1685yhy/bounce-tower

## 开发规范
1. 引擎改动在 `shared/game-engine.js` 中做
2. 页面改动在 `deploy/index.html` 中做
3. 改完后执行 `cp shared/game-engine.js deploy/game-engine.js` 同步
4. 更新 `index.html` 中 JS 版本号 `?v=N`
5. wechat/ 和 douyin/ 的 game-engine.js 也要同步
6. deploy/ 下的文件直接上线，不经过构建

## 测试流程
1. 在服务器上验证功能
2. 检查第1关（最简单）和第50关（最后关卡）的边界
3. 检查横竖屏切换
4. 检查分享功能
5. git push 前确认所有改动已提交
