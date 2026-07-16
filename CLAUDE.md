# 弹弹塔 Bounce Tower — 游戏工作室Agent架构

HTML5 Canvas塔堆叠游戏，专业游戏开发团队管理的多Agent协作项目。
每个Agent拥有特定领域，职责分离，保证质量。

## Technology Stack

- **引擎**: HTML5 Canvas (Vanilla JS)
- **语言**: JavaScript (ES5, 兼容微信/抖音小程序)
- **版本控制**: Git (GitHub)
- **部署**: Nginx静态托管 (Linux Ubuntu)
- **依赖**: 零外部依赖，纯原生

## 项目结构

```
bounce-tower/
├── deploy/                     # 线上部署文件
│   ├── index.html              # 游戏主页面（所有UI+逻辑）
│   └── game-engine.js          # 游戏引擎（核心机制+渲染）
├── shared/
│   └── game-engine.js          # 引擎源码（deploy/ 的源文件）
├── wechat/                     # 微信小程序版
├── douyin/                     # 抖音小程序版
├── .claude/                    # Agent定义、技能、Hook、规则
│   ├── agents/                 # 专业游戏开发Agent
│   ├── rules/                  # 编码规范
│   ├── hooks/                  # Git/会话Hook
│   ├── skills/                 # Slash命令
│   └── docs/                   # 文档
├── deploy.sh                   # 一键部署脚本
└── backup_original_engine.js   # 原始v4.0引擎备份
```

## 核心架构

### 引擎 (game-engine.js)
使用 IIFE 模式暴露全局 `BounceTower` 对象。通过 `BounceTower.create(platform)` 创建游戏实例。

核心状态：`stack[]`（堆叠方块）、`cur`（当前移动方块）、`score`、`combo`、`status`

### 关卡系统
50关，奇数缓冲/偶数断崖。每关：`{id, name, target, speedMul, widthPct, desc}`
- 1星：达target | 2星：target×1.2 | 3星：target×1.5
- 31关起每5层加速5%，最高1.6倍

## 协作协议

**用户驱动的协作，非自主执行。**
每个任务遵循：**提问 → 选项 → 决策 → 起草 → 批准**

- Agent必须询问"我可以写入[文件路径]吗？"才能使用Write/Edit工具
- Agent必须在写入前展示草案或摘要
- 多文件改动需要用户明确批准完整变更集
- 未经用户指示不得提交代码

## 编码规范

@.claude/docs/coding-standards.md

## 上下文管理

@.claude/docs/context-management.md

## 部署信息

- 服务器：124.221.233.214（root）
- 部署目录：/opt/bounce-tower/
- 访问地址：http://124.221.233.214
- GitHub：https://github.com/1685yhy/bounce-tower
- GitHub原始分支：original-v4.0
