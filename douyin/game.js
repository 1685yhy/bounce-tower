// 弹弹塔 — 抖音小游戏入口
var BounceTower = require('./utils/game-engine.js');

var canvas = tt.createCanvas();
var ctx = canvas.getContext('2d');
var s = tt.getSystemInfoSync();
var W = s.windowWidth, H = s.windowHeight, dpr = s.pixelRatio;
canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

function L(k, d) { try { var v = tt.getStorageSync(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function S(k, v) { try { tt.setStorageSync(k, JSON.stringify(v)); } catch (e) {} }

var game = BounceTower.create({
  ctx: ctx, width: W, height: H,
  loadBest: function() { return L('bttBest', 0); },
  saveBest: function(v) { S('bttBest', v); },
  requestAnimationFrame: function(fn) { return canvas.requestAnimationFrame(function(){fn();}); },
  playBeep: function() {},
  onGameOver: function() {},
  onNewBest: function() {},
  onAchievement: function() {},
  onLevelComplete: function(r) {
    var stars = L('bttStars', {});
    if (!stars[r.levelId] || r.stars > stars[r.levelId]) { stars[r.levelId] = r.stars; S('bttStars', stars); }
    S('bttLvl', Math.min(30, r.levelId + 1));
  },
  onUseTool: function() {},
  loadStats: function() { return L('bttStats', {}); },
  saveStats: function(v) { S('bttStats', v); },
  getTheme: function() { return L('bttTheme', 'default'); },
});

game.init();

tt.onTouchStart(function() {
  var st = game.getStatus();
  if (st === 'idle' || st === 'playing') { game.handleTap(); return; }
  if (st === 'gameover' || st === 'levelcomplete') {
    var lvl = parseInt(L('bttLvl', '1'));
    if (lvl > 30) lvl = 1;
    var lv = BounceTower.LEVELS[lvl - 1];
    game.reset();
    game.setMode('level', { levelId: lv.id, target: lv.target, speedMul: lv.speedMul });
  }
});
