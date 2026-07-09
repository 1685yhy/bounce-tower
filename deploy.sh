#!/bin/bash
# 弹弹塔一键部署脚本
# 用法: ./deploy.sh
# 需要 sshpass: brew install sshpass

set -e

SERVER="root@47.102.42.238"
REMOTE_DIR="/opt/bounce-tower"

# 同步引擎到 deploy 目录
cp shared/game-engine.js deploy/game-engine.js

echo "📦 上传文件..."
sshpass -p 'Asdfghjkl123!!' scp -o StrictHostKeyChecking=no \
  deploy/index.html \
  deploy/game-engine.js \
  "$SERVER:$REMOTE_DIR/"

echo "✅ 部署完成 → http://47.102.42.238"
