// 弹弹塔 — 微信小游戏入口
var BounceTower = require('./utils/game-engine.js');

var canvas = wx.createCanvas();
var ctx = canvas.getContext('2d');
var s = wx.getSystemInfoSync();
var W = s.windowWidth, H = s.windowHeight, dpr = s.pixelRatio;
canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

function L(k, d) { try { var v = wx.getStorageSync(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function S(k, v) { try { wx.setStorageSync(k, JSON.stringify(v)); } catch (e) {} }

var startLv = Math.min(parseInt(L('bttLvl', '1')), 30);
var lv = BounceTower.LEVELS[startLv - 1];

// 工具默认值（补全v4.0引擎缺失的reverse字段）
var defaultStats = {totalGames:0,totalLayers:0,bestComboEver:0,totalPerfects:0,unlockedSkins:['default'],dailyStreak:0,lastPlayDate:'',unlockedAchievements:[],levelStars:{},dailyBest:{},tools:{slow:0,widen:0,reverse:0},levelAttempts:{},shareRefills:0};

var game = BounceTower.create({
  ctx: ctx, width: W, height: H,
  loadBest: function() { return L('bttBest', 0); },
  saveBest: function(v) { S('bttBest', v); },
  requestAnimationFrame: function(fn) { return canvas.requestAnimationFrame(function(){fn();}); },
  playBeep: function() {},
  onGameOver: function(){},
  onNewBest: function(){},
  onAchievement: function(){},
  onLevelComplete: function(r) {
    var stars = L('bttStars', {});
    if (!stars[r.levelId] || r.stars > stars[r.levelId]) { stars[r.levelId] = r.stars; S('bttStars', stars); }
    S('bttLvl', Math.min(30, r.levelId + 1));
  },
  onUseTool: function(){},
  loadStats: function() { var s = L('bttStats', {}); if(!s.tools) s.tools={slow:0,widen:0,reverse:0}; if(!s.tools.reverse) s.tools.reverse=0; return s; },
  saveStats: function(v) { S('bttStats', v); },
  getTheme: function() { return L('bttTheme', 'default'); },
});

game.setMode('level', { levelId: lv.id, target: lv.target, speedMul: lv.speedMul });
game.init();

wx.onTouchStart(function() { game.handleTap(); });
