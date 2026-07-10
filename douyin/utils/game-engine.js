/**
 * ============================================================
 *  弹弹塔 Bounce Tower — 共享游戏引擎 v7.0
 *  下方滑块向上冲·堆叠在顶部固定区域·始终保持固定间距
 *  奇数关缓冲·偶数关断崖·每5关难度峰值·31关起关内变速
 * ============================================================
 */
(function(global){
'use strict';

var LEVELS = [
  {id:1, name:'你好世界',   target:5,   speedMul:0.3, widthPct:0.90, desc:'闭着眼都能过'},
  {id:2, name:'地狱之门',   target:15,  speedMul:2.4, widthPct:0.45, desc:'90%的人死在这'},
  {id:3, name:'喘口气',     target:10,  speedMul:0.7, widthPct:0.74, desc:'缓一缓'},
  {id:4, name:'升温',       target:16,  speedMul:1.1, widthPct:0.58, desc:'手开始冒汗'},
  {id:5, name:'节奏来了',   target:13,  speedMul:0.8, widthPct:0.66, desc:'⭐ 找到感觉了'},
  {id:6, name:'步步惊心',   target:20,  speedMul:1.2, widthPct:0.54, desc:'集中注意力'},
  {id:7, name:'稍微缓缓',   target:16,  speedMul:0.9, widthPct:0.62, desc:'别被骗了'},
  {id:8, name:'加速',       target:22,  speedMul:1.3, widthPct:0.50, desc:'手指在发抖'},
  {id:9, name:'稳住',       target:18,  speedMul:1.0, widthPct:0.58, desc:'你能行的'},
  {id:10,name:'分水岭',     target:28,  speedMul:1.4, widthPct:0.46, desc:'⭐ 半数玩家止步于此'},
  {id:11,name:'悬崖勒马',   target:22,  speedMul:1.0, widthPct:0.54, desc:'快用道具'},
  {id:12,name:'真刀真枪',   target:30,  speedMul:1.4, widthPct:0.44, desc:'超过大多数玩家'},
  {id:13,name:'喘息之间',   target:24,  speedMul:1.0, widthPct:0.52, desc:'让你歇一秒'},
  {id:14,name:'地狱深处',   target:34,  speedMul:1.5, widthPct:0.42, desc:'只有30%能过'},
  {id:15,name:'里程碑',     target:26,  speedMul:1.1, widthPct:0.50, desc:'⭐ 你已经很强了'},
  {id:16,name:'精英门槛',   target:38,  speedMul:1.5, widthPct:0.40, desc:'前20%玩家'},
  {id:17,name:'暴风雨前',   target:28,  speedMul:1.1, widthPct:0.48, desc:'给你歇口气'},
  {id:18,name:'极限挑战',   target:42,  speedMul:1.5, widthPct:0.38, desc:'只有10%能看到这'},
  {id:19,name:'绿洲',       target:30,  speedMul:1.2, widthPct:0.46, desc:'最后的温柔'},
  {id:20,name:'生死线',     target:50,  speedMul:1.6, widthPct:0.36, desc:'⭐ 前5%·传说门槛'},
  {id:21,name:'大师入门',   target:35,  speedMul:1.2, widthPct:0.44, desc:'大师联赛'},
  {id:22,name:'狂风暴雨',   target:55,  speedMul:1.6, widthPct:0.34, desc:'确定还要继续？'},
  {id:23,name:'休整',       target:38,  speedMul:1.3, widthPct:0.42, desc:'最后休息站'},
  {id:24,name:'不归路',     target:60,  speedMul:1.6, widthPct:0.32, desc:'只有1%能看到这'},
  {id:25,name:'传奇',       target:42,  speedMul:1.4, widthPct:0.40, desc:'⭐ 前1%·炫耀资格'},
  {id:26,name:'神之试炼',   target:65,  speedMul:1.7, widthPct:0.30, desc:'0.1%通关率'},
  {id:27,name:'天堑',       target:46,  speedMul:1.4, widthPct:0.38, desc:'难以置信'},
  {id:28,name:'登天之路',   target:72,  speedMul:1.7, widthPct:0.28, desc:'传奇诞生中'},
  {id:29,name:'最后之门',   target:50,  speedMul:1.4, widthPct:0.36, desc:'没有人相信'},
  {id:30,name:'弹弹神话',   target:80,  speedMul:1.7, widthPct:0.26, desc:'👑 前0.5%'},
  {id:31,name:'封神之路',   target:55,  speedMul:1.5, widthPct:0.34, desc:'巅峰之路'},
  {id:32,name:'疾风骤雨',   target:85,  speedMul:1.8, widthPct:0.24, desc:'0.3%通关率'},
  {id:33,name:'大师修炼',   target:60,  speedMul:1.5, widthPct:0.32, desc:'节奏变了'},
  {id:34,name:'百层挑战',   target:90,  speedMul:1.8, widthPct:0.22, desc:'0.2%通关率'},
  {id:35,name:'风暴之眼',   target:65,  speedMul:1.5, widthPct:0.30, desc:'⭐ 前0.1%'},
  {id:36,name:'混沌之门',   target:95,  speedMul:1.8, widthPct:0.21, desc:'极少人到这里'},
  {id:37,name:'逆流而上',   target:70,  speedMul:1.6, widthPct:0.28, desc:'越来越快'},
  {id:38,name:'深渊凝视',   target:100, speedMul:1.8, widthPct:0.20, desc:'百层·传说'},
  {id:39,name:'意志之战',   target:75,  speedMul:1.6, widthPct:0.27, desc:'毅力的考验'},
  {id:40,name:'极限突破',   target:105, speedMul:1.9, widthPct:0.19, desc:'⭐ 封神门槛'},
  {id:41,name:'神域之路',   target:80,  speedMul:1.6, widthPct:0.26, desc:'常人难以企及'},
  {id:42,name:'天罚',       target:110, speedMul:1.9, widthPct:0.18, desc:'0.05%通关率'},
  {id:43,name:'超凡脱俗',   target:85,  speedMul:1.7, widthPct:0.25, desc:'传说级别'},
  {id:44,name:'神罚降临',   target:115, speedMul:1.9, widthPct:0.17, desc:'0.02%通关率'},
  {id:45,name:'封神候选',   target:90,  speedMul:1.7, widthPct:0.24, desc:'⭐ 万里挑一'},
  {id:46,name:'末日审判',   target:120, speedMul:2.0, widthPct:0.16, desc:'0.01%通关率'},
  {id:47,name:'神迹之前',   target:95,  speedMul:1.7, widthPct:0.23, desc:'神迹在前'},
  {id:48,name:'混沌深渊',   target:125, speedMul:2.0, widthPct:0.15, desc:'0.005%通关率'},
  {id:49,name:'封神之战',   target:100, speedMul:1.8, widthPct:0.22, desc:'最后的修炼'},
  {id:50,name:'弹弹之神',   target:130, speedMul:2.0, widthPct:0.14, desc:'👑 0.001%·你是神'},
];

var ACHIEVEMENTS = [
  {id:'first_game',name:'初次尝试',desc:'完成第一局',icon:'🎮'},
  {id:'level_5', name:'小有所成',desc:'通过第 5 关',icon:'⭐'},
  {id:'level_10',name:'渐入佳境',desc:'通过第 10 关',icon:'🌟'},
  {id:'level_15',name:'势不可挡',desc:'通过第 15 关',icon:'💫'},
  {id:'level_20',name:'大师风范',desc:'通过第 20 关',icon:'🏆'},
  {id:'level_25',name:'登峰造极',desc:'通过第 25 关',icon:'👑'},
  {id:'level_30',name:'传说降临',desc:'通过第 30 关',icon:'🔥'},
  {id:'level_35',name:'封神之路',desc:'通过第 35 关',icon:'⚡'},
  {id:'level_40',name:'极限突破',desc:'通过第 40 关',icon:'💎'},
  {id:'level_45',name:'万里挑一',desc:'通过第 45 关',icon:'🌈'},
  {id:'level_50',name:'弹弹之神',desc:'通关全部 50 关',icon:'👑'},
  {id:'combo_5', name:'手感火热',desc:'达成 5 连击',icon:'🔥'},
  {id:'combo_10',name:'人机合一',desc:'达成 10 连击',icon:'⚡'},
  {id:'combo_20',name:'神之手',  desc:'达成 20 连击',icon:'👑'},
  {id:'layer_50', name:'摩天大楼',desc:'单局 50 层',icon:'🏢'},
  {id:'layer_100',name:'通天塔', desc:'单局 100 层',icon:'🗼'},
  {id:'games_50', name:'铁粉',   desc:'累计玩 50 局',icon:'💎'},
  {id:'total_1000',name:'堆叠大师',desc:'累计 1000 层',icon:'🏆'},
  {id:'skins_all',name:'皮肤收藏家',desc:'解锁全部皮肤',icon:'🌈'},
];

var THEMES = {
  default:{name:'糖果乐园',bg:['#fef9f0','#fef5e7','#fef9f0'],pals:[['#FF6B6B','#FF8E72','#FFA07A'],['#4ECDC4','#6EE7DE','#44B3AA'],['#A78BFA','#C4B5FD','#8B5CF6'],['#F59E0B','#FBBF24','#FCD34D'],['#EC4899','#F472B6','#FB85C7'],['#06B6D4','#22D3EE','#67E8F9'],['#84CC16','#A3E635','#BEF264']],cost:0},
  ocean:{name:'晴空万里',bg:['#e8f4fd','#dcecf9','#e8f4fd'],pals:[['#0077B6','#0096C7','#00B4D8'],['#48CAE4','#90E0EF','#ADE8F4'],['#023E8A','#0077B6','#0096C7']],cost:1},
  sunset:{name:'橘子汽水',bg:['#fff5f0','#ffe8dc','#fff5f0'],pals:[['#FF6B35','#F7C59F','#EFEFD0'],['#F7931E','#FF6B6B','#FF8E72'],['#E84855','#FF6B35','#F7931E']],cost:1},
  neon:{name:'赛博乐园',bg:['#f5f0ff','#ede0ff','#f5f0ff'],pals:[['#FF00FF','#FF69B4','#FF1493'],['#00FFFF','#00CED1','#40E0D0'],['#FFD700','#FFA500','#FF8C00']],cost:2},
  forest:{name:'抹茶森林',bg:['#f0faf5','#e4f5ea','#f0faf5'],pals:[['#2D6A4F','#40916C','#52B788'],['#95D5B2','#B7E4C7','#D8F3DC'],['#1B4332','#2D6A4F','#40916C']],cost:1},
  gold:{name:'奶油爆米花',bg:['#fffef5','#fff8e0','#fffef5'],pals:[['#FFD700','#FFC107','#FFB300'],['#FFE082','#FFD54F','#FFCA28'],['#FFA000','#FF8F00','#FF6F00']],cost:3},
};

function lerp(a,b,t){return a+(b-a)*t;}
function shade(c,p){var n=parseInt(c.replace('#',''),16),a=Math.round(2.55*p);var R=Math.max(0,Math.min(255,(n>>16&0xFF)+a)),G=Math.max(0,Math.min(255,(n>>8&0xFF)+a)),B=Math.max(0,Math.min(255,(n&0xFF)+a));return'rgb('+R+','+G+','+B+')';}
function eOutBounce(t){var n1=7.5625,d1=2.75;if(t<1/d1)return n1*t*t;else if(t<2/d1){t-=1.5/d1;return n1*t*t+0.75;}else if(t<2.5/d1){t-=2.25/d1;return n1*t*t+0.9375;}else{t-=2.625/d1;return n1*t*t+0.984375;}}
function hash(s){var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h);}

function create(platform){
  var ctx=platform.ctx,W=platform.width,H=platform.height;
  var loadBest=platform.loadBest,saveBest=platform.saveBest,raf=platform.requestAnimationFrame;
  var playBeep=platform.playBeep||function(){};
  var onGameOver=platform.onGameOver||function(){};
  var onNewBest=platform.onNewBest||function(){};
  var onAchievement=platform.onAchievement||function(){};
  var onLevelComplete=platform.onLevelComplete||function(){};
  var onUseTool=platform.onUseTool||function(){};
  var loadStats=platform.loadStats||function(){return{};};
  var saveStats=platform.saveStats||function(){};
  var getTheme=platform.getTheme||function(){return'default';};
  var useNativeUI=platform.useNativeUI||false;
  var vibrate=platform.vibrate||function(){};
  var safeTop=platform.safeTop||44;

  // ====== 新布局常量 ======
  var STACK_ANCHOR = Math.max(safeTop + 50, 70);    // 堆叠区固定锚点（屏幕顶部附近）
  var BLOCK_SPAWN_Y = H - 80;                       // 移动方块固定生成位置（屏幕底部）
  var stackOffset = 0;                               // 堆叠逐块上移偏移量

  function BH(){return Math.max(22,W*0.075);}
  function IBW(){var base=Math.min(W*0.5,200);var pct=levelWidthPct||(curLvData?curLvData.widthPct:0.8);return Math.max(35,Math.round(base*pct));}
  function PERF(){return Math.max(4,Math.round(IBW()*0.06));}
  function SPB(){return W*0.014;}
  function SPI(){return W*0.000026;}

  var status='idle',stack=[],cur=null,score=0,combo=0,maxCombo=0,bestScore=0,perfCount=0,levelShiftX=0;
  var camY=0,tCamY=0,pts=[],fps=[],dp=0,dtY=0,cpt=0,cpText='',cpColor='#fff';
  var shake=0,flashA=0,flashC='#fff',wasNewBest=false,rafId=null,destroyed=false,lastFrameTime=0;
  var mode='level',levelId=1,levelTarget=0,levelSpeedMul=1,levelWidthPct=0,starsEarned=0,curLvData=LEVELS[0],dailyMutatorId='';
  var themeId='default',pals=THEMES.default.pals,bgColors=THEMES.default.bg,pi=0,ci=0;
  var slowMotionTimer=0,slowMotionActive=false;
  var landAnim=0;
  var checkpointScore=0;  // 续关存档点（target的50%）

  // 离屏背景
  var bgCanvas=null,bgDirty=true;
  function ensureBgCanvas(){
    if(!bgCanvas)bgCanvas=document.createElement('canvas');
    if(bgCanvas.width!==W||bgCanvas.height!==H){bgCanvas.width=W;bgCanvas.height=H;bgDirty=true;}
    if(bgDirty){
      bgDirty=false;
      var bCtx=bgCanvas.getContext('2d');
      var bg=bCtx.createLinearGradient(0,0,0,H);bg.addColorStop(0,bgColors[0]);bg.addColorStop(0.5,bgColors[1]);bg.addColorStop(1,bgColors[2]);
      bCtx.fillStyle=bg;bCtx.fillRect(0,0,W,H);
      bCtx.strokeStyle='rgba(0,0,0,0.03)';bCtx.lineWidth=0.5;
      for(var x=40;x<W;x+=40){bCtx.beginPath();bCtx.moveTo(x,0);bCtx.lineTo(x,H);bCtx.stroke();}
      for(var y=40;y<H;y+=40){bCtx.beginPath();bCtx.moveTo(0,y);bCtx.lineTo(W,y);bCtx.stroke();}
    }
  }

  function nc(){var p=pals[pi];var c=p[ci%p.length];ci++;if(ci%p.length===0){pi=(pi+1)%pals.length;ci=0;}return c;}

  function sfxPlace(){playBeep(600,0.07,'square',0.04);}
  function sfxPerfect(){playBeep(880,0.08,'sine',0.05);setTimeout(function(){playBeep(1320,0.08,'sine',0.05);},50);}
  var lastComboSfxTime=0;
  function sfxCombo(){var now=Date.now();if(now-lastComboSfxTime<80)return;lastComboSfxTime=now;playBeep(1100,0.05,'sine',0.04);setTimeout(function(){playBeep(1650,0.06,'sine',0.04);},40);}
  function sfxAchieve(){playBeep(660,0.08,'sine',0.06);setTimeout(function(){playBeep(880,0.08,'sine',0.06);},80);setTimeout(function(){playBeep(1100,0.12,'sine',0.06);},160);}
  function sfxStar(){playBeep(523,0.08,'sine',0.06);setTimeout(function(){playBeep(659,0.08,'sine',0.06);},100);setTimeout(function(){playBeep(784,0.12,'sine',0.06);},200);}
  function sfxTool(){playBeep(440,0.06,'sine',0.05);setTimeout(function(){playBeep(660,0.06,'sine',0.05);},70);setTimeout(function(){playBeep(880,0.08,'sine',0.05);},140);}
  function sfxMiss(){playBeep(150,0.25,'sawtooth',0.08);}

  // BGM
  var bgmPlaying=false,bgmTimer=null,bgmNoteIdx=0;
  var BGM_NOTES=[
    {f:523,d:0.18},{f:659,d:0.18},{f:784,d:0.18},{f:1047,d:0.25},
    {f:0,d:0.08},{f:784,d:0.15},{f:659,d:0.15},{f:523,d:0.2},
    {f:0,d:0.12},{f:523,d:0.12},{f:587,d:0.12},{f:659,d:0.12},
    {f:784,d:0.2},{f:659,d:0.15},{f:587,d:0.15},{f:523,d:0.3},
    {f:0,d:0.15},{f:784,d:0.12},{f:880,d:0.12},{f:988,d:0.15},
    {f:1047,d:0.3},{f:0,d:0.1},{f:988,d:0.12},{f:880,d:0.12},
    {f:784,d:0.2},{f:659,d:0.15},{f:523,d:0.25},{f:0,d:0.35},
  ];
  var BGM_VOL=0.03;
  function bgmStart(){if(bgmPlaying)return;bgmPlaying=true;bgmNoteIdx=0;bgmScheduleNext();}
  function bgmStop(){bgmPlaying=false;if(bgmTimer)clearTimeout(bgmTimer);bgmTimer=null;}
  function bgmToggle(){if(bgmPlaying)bgmStop();else bgmStart();return bgmPlaying;}
  function bgmScheduleNext(){
    if(!bgmPlaying||destroyed)return;
    var note=BGM_NOTES[bgmNoteIdx%BGM_NOTES.length];
    if(note.f>0)playBeep(note.f,note.d,'sine',BGM_VOL);
    if(note.f>0&&bgmNoteIdx%2===0)playBeep(note.f*0.5,note.d,'triangle',BGM_VOL*0.5);
    bgmNoteIdx++;
    bgmTimer=setTimeout(bgmScheduleNext,note.d*1000);
  }

  function spawnPts(x,y,n,c,sm){sm=sm||1;if(pts.length>180){for(var pi=pts.length-1;pi>=0;pi--){if(pts[pi].life<=0.1)pts.splice(pi,1);}}if(pts.length>200)return;for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=(2+Math.random()*6)*sm;var shape=Math.random()<0.3?'rect':'circle';pts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3*sm,life:1,decay:0.008+Math.random()*0.02,size:3+Math.random()*5,color:c,shape:shape});}}

  var stats=loadStats();
  if(!stats.totalGames)stats.totalGames=0;
  if(!stats.totalLayers)stats.totalLayers=0;
  if(!stats.bestComboEver)stats.bestComboEver=0;
  if(!stats.totalPerfects)stats.totalPerfects=0;
  if(!stats.unlockedSkins)stats.unlockedSkins=['default'];
  if(!stats.dailyStreak)stats.dailyStreak=0;
  if(!stats.lastPlayDate)stats.lastPlayDate='';
  if(!stats.unlockedAchievements)stats.unlockedAchievements=[];
  if(!stats.levelStars)stats.levelStars={};
  if(!stats.dailyBest)stats.dailyBest={};
  if(!stats.tools)stats.tools={slow:0,widen:0,reverse:0};
  if(stats.tools.reverse===undefined)stats.tools.reverse=0;
  if(!stats.levelAttempts)stats.levelAttempts={};
  if(!stats.shareRefills)stats.shareRefills=0;
  if(!stats.version)stats.version=1;
  var statsDirty=false;
  function flushStats(){statsDirty=true;}
  function persistStats(){if(statsDirty){saveStats(stats);statsDirty=false;}}

  function checkAchievements(gameStats){
    var newly=[];
    for(var i=0;i<ACHIEVEMENTS.length;i++){
      var a=ACHIEVEMENTS[i];
      if(stats.unlockedAchievements.indexOf(a.id)===-1){
        var cond=false;
        switch(a.id){
          case'first_game':cond=gameStats.totalGames>=1;break;
          case'level_5': cond=getLevelProgress()>=5;break;
          case'level_10':cond=getLevelProgress()>=10;break;
          case'level_15':cond=getLevelProgress()>=15;break;
          case'level_20':cond=getLevelProgress()>=20;break;
          case'level_25':cond=getLevelProgress()>=25;break;
          case'level_30':cond=getLevelProgress()>=30;break;
          case'level_35':cond=getLevelProgress()>=35;break;
          case'level_40':cond=getLevelProgress()>=40;break;
          case'level_45':cond=getLevelProgress()>=45;break;
          case'level_50':cond=getLevelProgress()>=50;break;
          case'combo_5':cond=gameStats.maxCombo>=5;break;
          case'combo_10':cond=gameStats.maxCombo>=10;break;
          case'combo_20':cond=gameStats.maxCombo>=20;break;
          case'layer_50':cond=gameStats.score>=50;break;
          case'layer_100':cond=gameStats.score>=100;break;
          case'games_50':cond=stats.totalGames>=50;break;
          case'total_1000':cond=stats.totalLayers>=1000;break;
          case'skins_all':cond=stats.unlockedSkins.length>=Object.keys(THEMES).length;break;
        }
        if(cond){stats.unlockedAchievements.push(a.id);newly.push(a);}
      }
    }
    for(var j=0;j<newly.length;j++){onAchievement(newly[j]);sfxAchieve();}
    flushStats();
  }

  function getLevelProgress(){var max=0;for(var key in stats.levelStars){if(stats.levelStars[key]>=1){var lv=parseInt(key,10);if(lv>max)max=lv;}}return max;}
  function getTotalStars(){var t=0;for(var key in stats.levelStars)t+=stats.levelStars[key];return t;}

  // ====== 核心机制：堆叠区固定顶部，移动方块从底部上冲 ======
  function topOfStack(){
    if(stack.length===0) return {x:W/2-IBW()/2+levelShiftX, y:STACK_ANCHOR, w:IBW()};
    var t=stack[stack.length-1];
    return {x:t.x, y:t.y+BH(), w:t.w};
  }

  function swBounds(bw){
    var t=topOfStack(),hs=t.w/2,hb=bw/2,cx=t.x+hs;
    var extraMul=levelId===1?0.5:2.5;  // 第1关缩小范围，第2关起正常
    var extra=t.w*extraMul;
    return {min:cx-hs-hb-extra, max:cx+hs+hb+extra, cx:cx};
  }

  function spawnBlock(){
    var t=topOfStack(),w=t.w,b=swBounds(w),fromR=stack.length%2===0;
    var spd=(SPB()+score*SPI())*levelSpeedMul;
    if(levelId>=31){var accel=Math.min(1+Math.floor(score/5)*0.03,1.1);spd*=accel;}
    var x=fromR?b.max:b.min;
    x=Math.max(10,Math.min(x,W-w-10));  // 确保方块完整可见
    var initDir=fromR?-1:1;if(dailyMutatorId==='reverse')initDir*=-1;
    cur={x:x, y:BLOCK_SPAWN_Y, w:w, color:nc(), dir:initDir, speed:spd, baseSpeed:spd, spawnAnim:1.0, spawnTime:Date.now()};
    dp=0;status='playing';
  }

  function dropBlock(){
    if(status!=='playing'||!cur)return;
    if(Date.now()-cur.spawnTime<180)return;  // 防止双击秒杀，最少180ms滑动时间
    dp=0;dtY=topOfStack().y;status='dropping';
  }

  function placeBlock(){
    var b=cur,t=topOfStack(),bL=b.x,bR=b.x+b.w,sL=t.x,sR=t.x+t.w,oL=Math.max(bL,sL),oR=Math.min(bR,sR),oW=oR-oL;
    if(oW<=0){gameOver();return;}
    var isPerf=Math.abs(b.x-t.x)<=PERF();
    var cutLoss=isPerf?0:Math.abs(b.x-t.x)*0.3;
    var finalW=Math.max(30,oW-cutLoss);
    var pb={x:oL+(oW-finalW)/2, y:t.y, w:finalW, color:b.color};
    if(bL<sL)fps.push({x:bL, y:t.y, w:sL-bL, h:BH(), color:b.color, vy:-1, vx:-2-Math.random()*3, rot:0, rs:(Math.random()-0.5)*0.2});
    if(bR>sR)fps.push({x:sR, y:t.y, w:bR-sR, h:BH(), color:b.color, vy:-1, vx:2+Math.random()*3, rot:0, rs:(Math.random()-0.5)*0.2});
    if(fps.length>30)fps.splice(0,fps.length-30);
    stack.push(pb);score++;wasNewBest=false;
    if(score>bestScore){bestScore=score;wasNewBest=true;saveBest(bestScore);onNewBest(score);}
    stats.totalLayers++;flushStats();
    landAnim=8;
    // 检查点：达到目标50%时记录
    if(!checkpointScore&&score>=Math.floor(levelTarget*0.5))checkpointScore=score;

    // 堆叠偏移：每放一块堆叠整体上移一个块高，保持视觉效果固定
    stackOffset+=BH();
    var syoff=t.y-stackOffset+BH()/2;  // 更新的粒子偏移参考

    if(isPerf){
      combo++;if(combo>maxCombo)maxCombo=combo;perfCount++;stats.totalPerfects++;flushStats();
      if(combo>=3&&dailyMutatorId!=='no_combo'){
        var bonus=Math.min(combo*1.5,20);
        var cap=Math.max(IBW()*1.1,IBW()+bonus*0.8);
        pb.w=Math.min(pb.w+bonus,cap);
        pb.x=Math.max(1,pb.x-(pb.w-oW)/2);
        if(pb.x+pb.w>W-1)pb.x=W-1-pb.w;
      }
      spawnPts(oL+oW/2,syoff,18,b.color,1.2);flashA=0.25;flashC='#ffd700';
      if(combo>=5)spawnPts(oL+oW/2,syoff,10,'#ffffff',1.5);
      if(combo>=3){var msgs=combo>=20?['👑 神之手!','🌟 无敌!','💎 传说!']:combo>=10?['🔥 炸裂!','⚡ 疯狂!','🎯 精准!']:combo>=5?['✨ 连击!','💪 厉害!','👏 漂亮!']:['👍 不错!','✅ 完美!','💯 满分!'];cpText=msgs[Math.floor(Math.random()*msgs.length)]+' x'+combo;cpColor=b.color;cpt=55;vibrate('light');sfxCombo();vibrate('heavy');}else{sfxPerfect();if(combo===0)vibrate('light');}
    }else{combo=0;perfCount=0;shake=Math.max(0,10-oW*0.6);sfxPlace();if(oW>0&&oW<t.w*0.3){spawnPts(oL+oW/2,syoff,8,'rgba(255,180,0,0.8)',1);if(oW<t.w*0.15){shake=Math.max(shake,6);vibrate('medium');}}
      // 切割偏差提示
      if(oW<t.w*0.6){var devMsgs=['⚠ 偏了','✂ 偏差','👀 再对准'];cpText=devMsgs[Math.floor(Math.random()*devMsgs.length)];cpColor='#f97316';cpt=40;}
    }
    cur=null;dp=0;

    // 第20关特殊规则：每5块平台随机漂移
    if(levelId===20&&score>2&&score%5===0)levelShiftX+=Math.floor(Math.random()>0.5?8:-8);
    // 里程碑：每10层庆祝
    if(score%10===0&&score<levelTarget){
      spawnPts(W/2,H*0.4,8,'#ffd700',1.5);
      flashA=0.2;flashC='#ffd700';
      cpText='🎯 '+score+' 层!';cpColor='#ffd700';cpt=55;
    }

    if(score>=levelTarget){
      // 星级阈值随关卡递增而放缓（后期通关已极难，3星不应要求翻倍）
      var mul3=levelId<=10?1.5:levelId<=20?1.35:levelId<=30?1.25:levelId<=40?1.2:1.15;
      var mul2=levelId<=10?1.2:levelId<=20?1.15:levelId<=30?1.1:levelId<=40?1.08:1.05;
      var stars=1;if(score>=levelTarget*mul3)stars=3;else if(score>=levelTarget*mul2)stars=2;
      completeLevel(stars);
    }
  }

  function completeLevel(stars){
    starsEarned=stars;
    if(mode==='level'){
      var prev=stats.levelStars[levelId]||0;if(stars>prev){stats.levelStars[levelId]=stars;flushStats();}
    }else{
      var today=new Date().toISOString().slice(0,10),prev=stats.dailyBest[today]||0;if(stars>prev){stats.dailyBest[today]=stars;flushStats();}
    }
    bgmStop();
    // 先回调（写stars key），再persistStats，避免闪退时stars和stats不一致
    onLevelComplete({mode:mode,levelId:levelId,stars:stars,score:score,maxCombo:maxCombo,layers:stack.length,wasNewBest:wasNewBest});
    persistStats();
    spawnPts(W/2,H/2,stars*10,stars>=3?'#ffd700':stars>=2?'#c0c0c0':'#cd7f32',2.5);
    flashA=0.5;flashC=stars>=3?'#ffd700':'#ffffff';sfxStar();
    checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});
    status='levelcomplete';
  }

  function gameOver(){
    status='gameover';sfxMiss();bgmStop();
    if(cur){
      fps.push({x:cur.x,y:cur.y,w:cur.w,h:BH(),color:cur.color,vy:-4,vx:(Math.random()-0.5)*6,rot:0,rs:(Math.random()-0.5)*0.25});
      for(var di=0;di<12;di++){var da=Math.random()*Math.PI*2,ds=3+Math.random()*8;
        pts.push({x:cur.x+cur.w/2,y:cur.y+BH()/2,vx:Math.cos(da)*ds,vy:Math.sin(da)*ds-5,life:1,decay:0.015+Math.random()*0.03,size:3+Math.random()*5,color:cur.color});}
      cur=null;}
    shake=20;flashA=0.7;flashC=levelId<=2?'#ff4444':levelId<=10?'#ff6b6b':levelId<=20?'#ff3366':levelId<=35?'#cc0033':'#8800cc';
    for(var di2=0;di2<stack.length;di2++){var b2=stack[di2];if(Math.random()<0.3)spawnPts(b2.x+b2.w/2,b2.y-stackOffset+BH()/2,3,b2.color,0.5);}
    slowMotionActive=false;slowMotionTimer=0;
    stats.totalGames++;if(maxCombo>stats.bestComboEver)stats.bestComboEver=maxCombo;
    if(mode==='level'){stats.levelAttempts[levelId]=(stats.levelAttempts[levelId]||0)+1;}
    var today=new Date().toISOString().slice(0,10);
    if(stats.lastPlayDate!==today){var diff=stats.lastPlayDate?Math.round((new Date(today)-new Date(stats.lastPlayDate))/86400000):0;if(diff===1)stats.dailyStreak++;else stats.dailyStreak=1;stats.lastPlayDate=today;}
    flushStats();checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});
    onGameOver(score,maxCombo,stack.length,wasNewBest,mode,levelId,levelTarget);
    persistStats();
  }

  function revive(){if(status!=='gameover'||!checkpointScore)return;
    checkpointScore=0;stats.totalGames--;  // 回退stats，不算新一局
    status='playing';shake=0;flashA=0;combo=0;perfCount=0;slowMotionActive=false;slowMotionTimer=0;spawnBlock();}

  function useTool(toolName){
    if(status!=='playing'||!cur)return false;
    if(toolName==='slow'){
      if(stats.tools.slow<=0)return false;
      stats.tools.slow--;flushStats();persistStats();
      slowMotionActive=true;slowMotionTimer=300;
      cpText='🐢 慢动作！';cpColor='#64c8ff';cpt=50;
      sfxTool();onUseTool('slow',stats.tools.slow);return true;
    }else if(toolName==='widen'){
      if(stats.tools.widen<=0||stack.length===0)return false;
      stats.tools.widen--;flushStats();persistStats();
      if(stack.length>0){var top=stack[stack.length-1];top.w=IBW();top.x=Math.max(2,W/2-IBW()/2);}
      cpText='📏 加宽！';cpColor='#ffd700';cpt=50;
      sfxTool();spawnPts(W/2,H*0.6,20,'#ffd700',1.5);flashA=0.3;flashC='#ffd700';
      onUseTool('widen',stats.tools.widen);return true;
    }else if(toolName==='reverse'){
      if(stats.tools.reverse<=0)return false;
      stats.tools.reverse--;flushStats();persistStats();
      cur.dir*=-1;
      cpText='🔄 反向！';cpColor='#a78bfa';cpt=50;
      sfxTool();spawnPts(cur.x+cur.w/2,cur.y,8,'#64c8ff',1);
      onUseTool('reverse',stats.tools.reverse);return true;
    }
    return false;
  }
  function addTool(toolName,amount){stats.tools[toolName]=(stats.tools[toolName]||0)+amount;flushStats();persistStats();}
  function getToolCount(toolName){return stats.tools[toolName]||0;}
  function shareRefill(){if(stats.shareRefills>=3)return false;stats.shareRefills++;stats.tools.slow++;stats.tools.widen++;stats.tools.reverse++;flushStats();persistStats();return true;}
  function getShareRefillsLeft(){return 3-(stats.shareRefills||0);}

  function setMode(m,opts){
    opts=opts||{};mode=m;levelId=opts.levelId||1;levelTarget=opts.target||0;levelSpeedMul=opts.speedMul||1;levelWidthPct=opts.widthPct||0;
    curLvData=LEVELS[levelId-1]||LEVELS[0];
    bgDirty=true;flashA=0.4;flashC='#ffffff';reset();
    dailyMutatorId=opts.mutatorId||'';  // 必须在reset之后赋值
    try{render();}catch(e){}
  }
  function reset(){
    persistStats();themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;bgDirty=true;
    pi=Math.floor(Math.random()*pals.length);ci=0;
    stack=[];cur=null;score=0;combo=0;maxCombo=0;perfCount=0;starsEarned=0;
    camY=0;tCamY=0;pts=[];fps=[];dp=0;shake=0;flashA=0;cpt=0;cpText='';wasNewBest=false;
    slowMotionActive=false;slowMotionTimer=0;landAnim=0;stackOffset=0;checkpointScore=0;dailyMutatorId='';levelShiftX=0;
    paused=false;bgmWasPlaying=false;
    status='idle';
  }
  function refreshTheme(){
    themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;bgDirty=true;
    pi=0;ci=0;  // 重置颜色索引
    // 重新着色已有方块，保持视觉一致
    for(var si=0;si<stack.length;si++){stack[si].color=nc();}
  }
  function unlockSkin(skinId){if(stats.unlockedSkins.indexOf(skinId)===-1){stats.unlockedSkins.push(skinId);flushStats();persistStats();checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});}}

  var DAILY_MUTATORS=[
    {id:'speed',name:'极速模式',desc:'速度+30%',apply:function(s){s.speedMul*=1.3;}},
    {id:'narrow',name:'刀锋之上',desc:'宽度-15%',apply:function(s){s.widthPct*=0.85;}},
    {id:'no_combo',name:'孤军奋战',desc:'连击奖励关闭',apply:function(s){s.noCombo=1;}},
    {id:'endless',name:'无限挑战',desc:'目标翻倍',apply:function(s){s.target*=2;}},
    {id:'reverse',name:'反向模式',desc:'方向相反',apply:function(s){s.reverseInit=1;}},
    {id:'no_tools',name:'赤手空拳',desc:'无初始道具',apply:function(s){s.noTools=1;}},
    {id:'double_speed',name:'双倍速',desc:'速度翻倍不易把握',apply:function(s){s.speedMul*=2.0;}},
    {id:'half_width',name:'一线天',desc:'方块更窄',apply:function(s){s.widthPct*=0.7;}},
  ];
  function getDailyChallenge(){
    var today=new Date().toISOString().slice(0,10),h=hash(today);
    var lv=LEVELS[5+(h%(LEVELS.length-5))];
    var mut=DAILY_MUTATORS[h%(DAILY_MUTATORS.length)];
    var lv2={id:lv.id,name:lv.name,target:lv.target,desc:lv.desc,speedMul:lv.speedMul,widthPct:lv.widthPct};
    if(mut)mut.apply(lv2);
    lv2.mutator=mut;
    return lv2;
  }

  function update(){
    if(destroyed)return;
    var now=Date.now(),delta=Math.min(now-lastFrameTime,50);lastFrameTime=now;
    var lerpT=1-Math.pow(0.92,delta/16);
    camY=lerp(camY,tCamY,lerpT);
    if(shake>0)shake*=0.84;if(shake<0.08)shake=0;
    if(flashA>0)flashA-=0.025;if(flashA<0)flashA=0;
    if(cpt>0){cpt--;if(cpt<=0)cpText='';}
    if(landAnim>0)landAnim--;
    if(slowMotionActive){slowMotionTimer--;if(slowMotionTimer<=0){slowMotionActive=false;}}
    if(status==='playing'&&cur){
      if(cur.spawnAnim>0)cur.spawnAnim=Math.max(0,cur.spawnAnim-0.15);
      var b=cur,bd=swBounds(b.w);
      var effectiveSpeed=slowMotionActive?b.baseSpeed*0.3:b.baseSpeed;
      b.x+=effectiveSpeed*b.dir;
      if(b.x<=bd.min){b.x=bd.min;b.dir=1;}else if(b.x+b.w>=bd.max){b.x=bd.max-b.w;b.dir=-1;}
    }
    // 从底部向堆叠区上冲
    if(status==='dropping'&&cur){
      dp+=delta/16*0.13;
      if(dp>=1){dp=1;cur.y=dtY;placeBlock();if(status!=='gameover'&&status!=='levelcomplete')spawnBlock();}
      else{cur.y=BLOCK_SPAWN_Y+(dtY-BLOCK_SPAWN_Y)*eOutBounce(dp);}
    }
    for(var i=pts.length-1;i>=0;i--){var p=pts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=p.decay;if(p.life<=0)pts.splice(i,1);}
    for(var j=fps.length-1;j>=0;j--){var f=fps[j];f.vy+=0.65;f.y+=f.vy;f.x+=f.vx;f.rot+=f.rs;if(f.y>H+250)fps.splice(j,1);}
  }

  function rrect(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.fill();}
  function dBlock(x,y,w,h,c,a,rot,scaleY){
    a=a===undefined?1:a;rot=rot||0;scaleY=scaleY||1;
    ctx.save();ctx.translate(x+w/2,y+h/2);
    if(rot!==0)ctx.rotate(rot);
    ctx.globalAlpha=a;
    // 投影
    ctx.shadowColor='rgba(0,0,0,0.10)';ctx.shadowBlur=6;ctx.shadowOffsetY=3;
    // 3D砖块：主面 + 顶边高光 + 底边暗影 + 侧边深度
    // 主面 - 渐变
    var g=ctx.createLinearGradient(-w/2,-h/2,-w/2,h/2);
    g.addColorStop(0,shade(c,25));
    g.addColorStop(0.15,c);
    g.addColorStop(0.85,shade(c,-15));
    g.addColorStop(1,shade(c,-35));
    rrect(-w/2,-h/2,w,h,4,g);
    ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    // 顶边高光线
    ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(-w/2+5,-h/2+2,w-10,Math.min(5,h*0.12));
    // 底边暗影线
    ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(-w/2,-h/2+h-4,w,3);
    // 侧边深度（左右各一条暗线）
    ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(-w/2,-h/2+4,2,h-8);
    ctx.fillRect(w/2-2,-h/2+4,2,h-8);
    if(scaleY!==1)ctx.scale(1,scaleY);  // 弹性动画在投影后应用，不拉伸阴影
    ctx.restore();
  }
  function dText(t,x,y,s,c,a,sc,sb){a=a||'center';sb=sb||0;ctx.font='900 '+s+'px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign=a;ctx.textBaseline='middle';if(sb>0&&sc){ctx.shadowColor=sc;ctx.shadowBlur=sb;}ctx.fillStyle=c;ctx.fillText(t,x,y);ctx.shadowColor='transparent';ctx.shadowBlur=0;}

  function render(){
    ctx.clearRect(0,0,W,H);
    var sx=shake?(Math.random()-0.5)*shake*2:0,sy=shake?(Math.random()-0.5)*shake*2:0;
    ctx.save();ctx.translate(sx,sy);
    ensureBgCanvas();ctx.drawImage(bgCanvas,0,0);
    var cam=camY;

    // 初始平台
    if(stack.length===0){
      var t0=topOfStack(),by=t0.y-cam-stackOffset;
      if(by>-BH()&&by<H+BH()){
        dBlock(t0.x,by,t0.w,BH(),'#d5cdbc',0.85);
        if(status==='idle'){
          var pulse=Math.sin(Date.now()/550)*0.25+0.45;
          ctx.fillStyle='rgba(255,107,107,'+(pulse*0.15)+')';ctx.fillRect(t0.x,by,t0.w,BH());
          ctx.strokeStyle='rgba(255,107,107,'+(pulse*0.5)+')';ctx.lineWidth=2.5;ctx.setLineDash([6,4]);ctx.strokeRect(t0.x-2,by-2,t0.w+4,BH()+4);ctx.setLineDash([]);
        }
      }
    }

    // 堆叠方块（应用stackOffset使其视觉位置固定，底部渐淡）
    var stLen=stack.length;
    for(var i=0;i<stLen;i++){
      var b=stack[i],dy=b.y-cam-stackOffset;
      if(dy>H+BH()||dy<-BH()*5)continue;
      var landSY=1;
      if(i===stLen-1&&landAnim>0){
        var lp=landAnim/8;
        landSY=lp>0.5?lerp(1.0,0.88,(lp-0.5)*2):lerp(1.04,1.0,lp*1.5);
      }
      // 底部老化：越靠下的方块越透明
      var age=(stLen-i-1)/Math.max(stLen,1);
      var ageAlpha=age>0.7?lerp(1,0.5,(age-0.7)/0.3):1;
      dBlock(b.x,dy,b.w,BH(),b.color,ageAlpha,0,landSY);
    }

    // 落点预览
    if(cur&&status==='playing'){
      var t=topOfStack(),zy=t.y-cam-stackOffset;
      var overlap=Math.max(0,Math.min(cur.x+cur.w,t.x+t.w)-Math.max(cur.x,t.x));
      var oPct=overlap/Math.max(cur.w,t.w);
      var glowC=oPct>0.7?'rgba(74,222,128,0.3)':oPct>0.3?'rgba(255,180,0,0.2)':'rgba(255,100,100,0.15)';
      ctx.fillStyle=glowC;ctx.fillRect(t.x,zy,t.w,BH());
      ctx.strokeStyle='rgba(255,180,0,0.35)';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.strokeRect(t.x,zy,t.w,BH());ctx.setLineDash([]);
      ctx.strokeStyle='rgba(255,180,0,0.2)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cur.x+cur.w/2,zy-4);ctx.lineTo(cur.x+cur.w/2,zy+BH()+4);ctx.stroke();
    }
    if(cur&&status==='dropping'){var td=topOfStack();ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(td.x,td.y-cam-stackOffset,td.w,BH());}

    // 当前上冲方块（底部生成 + 入场 + 3级拖影）
    if(cur){
      if(status==='playing'){
        var sa=cur.spawnAnim||0;
        var blockScaleY=sa>0?(0.7+sa*0.3):1;
        ctx.globalAlpha=0.04;dBlock(cur.x-cur.dir*cur.baseSpeed*9,cur.y-cam,cur.w,BH(),cur.color,0.04);
        ctx.globalAlpha=0.07;dBlock(cur.x-cur.dir*cur.baseSpeed*5,cur.y-cam,cur.w,BH(),cur.color,0.07);
        ctx.globalAlpha=1;
        ctx.save();ctx.translate(cur.x,cur.y-cam);
        ctx.strokeStyle='rgba(255,255,255,'+(0.12+Math.sin(Date.now()/250)*0.08)+')';ctx.lineWidth=2;
        ctx.strokeRect(-cur.w/2-1,-BH()/2-1,cur.w+2,BH()+2);ctx.restore();
        dBlock(cur.x,cur.y-cam,cur.w,BH(),cur.color,1,0,blockScaleY);
      }else{
        dBlock(cur.x,cur.y-cam,cur.w,BH(),cur.color);
      }
    }

    for(var j=0;j<fps.length;j++){var f=fps[j];dBlock(f.x-f.w/2,f.y-f.h/2-cam,f.w,f.h,f.color,0.9,f.rot);}
    for(var k=0;k<pts.length;k++){var pt=pts[k];ctx.fillStyle=pt.color;ctx.globalAlpha=pt.life;if(pt.shape==='rect'){var s2=pt.size;ctx.fillRect(pt.x-s2/2,pt.y-cam-s2/2,s2,s2);}else{ctx.beginPath();ctx.arc(pt.x,pt.y-cam,pt.size,0,Math.PI*2);ctx.fill();}}
    ctx.globalAlpha=1;

    if(combo>=5&&flashA>0){
      var edgeGrad=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.8);
      edgeGrad.addColorStop(0,'rgba(255,215,0,0)');edgeGrad.addColorStop(1,'rgba(255,215,0,'+(flashA*0.4)+')');
      ctx.fillStyle=edgeGrad;ctx.fillRect(0,0,W,H);
    }else if(flashA>0){
      ctx.fillStyle=flashC;ctx.globalAlpha=flashA*0.6;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
    }

    if(slowMotionActive){ctx.fillStyle='rgba(100,200,255,'+(0.06+Math.sin(Date.now()/200)*0.03)+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();drawUI();
  }

  function drawUI(){
    var sY=safeTop+22;
    var scoreStr=String(score);
    ctx.font='900 56px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
    var tw=ctx.measureText(scoreStr).width;
    var scoreGrad=ctx.createLinearGradient(W/2-tw/2,sY-28,W/2+tw/2,sY+28);
    scoreGrad.addColorStop(0,'#ffffff');scoreGrad.addColorStop(1,'#ffd700');
    dText(scoreStr,W/2,sY,56,scoreGrad,'center','rgba(255,107,107,0.25)',18);

    if(mode==='level'){
      if(curLvData){
        var label='第'+curLvData.id+'关 · '+curLvData.name;
        if(slowMotionActive)label='🐢 '+Math.ceil(slowMotionTimer/60)+'s · '+label;
        if(levelId>=31&&score>=5){var accelNow=Math.min(1+Math.floor(score/5)*0.03,1.1);if(accelNow>1)label+=' ⚡'+accelNow.toFixed(2)+'x';}
        dText(label,W/2,sY+32,12,'rgba(0,0,0,0.4)','center');
      }
    }else if(mode==='daily'){
      dText(slowMotionActive?'🐢 '+Math.ceil(slowMotionTimer/60)+'s · 今日挑战':'📅 今日挑战',W/2,sY+32,12,'rgba(200,140,0,0.7)','center');
    }

    if(combo>=2&&status!=='gameover'&&status!=='levelcomplete'){
      dText('🔥 '+combo+'x 连击',W/2,sY+50,14,'#e67e00','center','rgba(230,126,0,0.3)',10);
    }

    if(levelTarget>0&&status!=='idle'&&status!=='levelcomplete'&&status!=='gameover'){
      var barW=Math.min(W*0.60,220),barH=6,barX=W/2-barW/2,barY=sY+68,prog=Math.min(1,score/levelTarget);
      ctx.fillStyle='rgba(0,0,0,0.08)';rrect(barX,barY,barW,barH,3,'rgba(0,0,0,0.08)');
      var barC=prog>=1?'#4ade80':prog>=0.6?'#ffd700':prog>=0.3?'#f97316':'#ef4444';
      if(prog>0)rrect(barX,barY,barW*prog,barH,3,barC);
      if(prog>=0.8&&prog<1){ctx.shadowColor=barC;ctx.shadowBlur=8;rrect(barX+barW*prog-3,barY-1,6,barH+2,3,barC);ctx.shadowBlur=0;}
      dText(score+'/'+levelTarget,W/2,barY+14,11,prog>=1?'#4ade80':'rgba(0,0,0,0.4)','center');
    }

    if(status==='idle'){
      var p2=Math.sin(Date.now()/800)*0.3+0.5;
      ctx.textAlign='center';
      ctx.font='bold 22px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillText('🪜 弹弹塔',W/2,H*0.66);
      ctx.font='600 16px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,'+(p2*0.6)+')';ctx.fillText('👆 点击屏幕出发！',W/2,H*0.72);
      ctx.font='12px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillText('下方方块会向上冲刺，对准上面不动的方块',W/2,H*0.72+26);
      if(mode==='level'&&levelTarget>0&&curLvData){
        ctx.fillStyle='rgba(0,0,0,0.45)';ctx.fillText('🎯 目标 '+curLvData.target+' 层 — '+curLvData.desc,W/2,H*0.72+44);
      }
      if(stats.dailyStreak>=2){ctx.font='11px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.fillStyle='rgba(230,120,0,0.7)';ctx.fillText('🔥 连续登录 '+stats.dailyStreak+' 天',W/2,H*0.72+62);}
    }

    if(cpt>0&&cpText){var pa=cpt>30?1:cpt/30,ps2=1+(55-cpt)*0.008;ctx.save();ctx.globalAlpha=pa;ctx.translate(W/2,H*0.30);ctx.scale(ps2,ps2);dText(cpText,0,0,44,cpColor,'center',cpColor,35);ctx.restore();}
  }

  function renderShareCard(cc,cw,ch){
    var bg2=cc.createLinearGradient(0,0,0,ch);bg2.addColorStop(0,'#1a1a3e');bg2.addColorStop(0.4,'#2a1a4e');bg2.addColorStop(1,'#1a1a3e');cc.fillStyle=bg2;cc.fillRect(0,0,cw,ch);
    cc.fillStyle='rgba(255,255,255,0.03)';cc.beginPath();cc.arc(cw*0.2,ch*0.3,cw*0.4,0,Math.PI*2);cc.fill();cc.beginPath();cc.arc(cw*0.8,ch*0.7,cw*0.3,0,Math.PI*2);cc.fill();
    cc.font='bold 28px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.textAlign='center';cc.textBaseline='middle';cc.fillStyle='#ffffff';cc.fillText('🪜 弹弹塔',cw/2,ch*0.18);
    cc.font='900 72px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.shadowColor='rgba(255,215,0,0.5)';cc.shadowBlur=30;cc.fillStyle='#ffd700';cc.fillText(String(score),cw/2,ch*0.45);cc.shadowColor='transparent';cc.shadowBlur=0;
    if(mode==='level'&&curLvData)cc.fillText('第'+curLvData.id+'关 · '+curLvData.name+' · '+starsEarned+'星',cw/2,ch*0.55);
    cc.font='16px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.fillStyle='rgba(255,255,255,0.5)';cc.fillText('来挑战我吧！',cw/2,ch*0.85);
  }

  var paused=false,bgmWasPlaying=false;
  function loop(){if(destroyed||paused)return;update();render();rafId=raf(loop);}
  function pauseEngine(){if(paused)return;paused=true;bgmWasPlaying=bgmPlaying;bgmStop();}
  function resumeEngine(){if(!paused)return;paused=false;lastFrameTime=Date.now();if(bgmWasPlaying)bgmStart();rafId=raf(loop);}
  function onVisibility(){if(document.hidden){pauseEngine();}else{resumeEngine();}}

  function init(){
    themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;
    pi=Math.floor(Math.random()*pals.length);ci=0;bestScore=loadBest();
    lastFrameTime=Date.now();
    document.addEventListener('visibilitychange',onVisibility);
    try{render();}catch(e){}
    loop();
  }
  function handleTap(){if(destroyed)return;if(status==='idle')spawnBlock();else if(status==='playing')dropBlock();else if(status==='dropping')vibrate('light');}
  function destroy(){destroyed=true;persistStats();document.removeEventListener('visibilitychange',onVisibility);rafId=null;}
  function resizeViewport(w,h){W=w;H=h;bgDirty=true;}

  return{
    init:init,handleTap:handleTap,reset:reset,revive:revive,destroy:destroy,
    setMode:setMode,resizeViewport:resizeViewport,
    pauseEngine:pauseEngine,resumeEngine:resumeEngine,isPaused:function(){return paused;},
    useTool:useTool,addTool:addTool,getToolCount:getToolCount,
    renderShareCard:renderShareCard,refreshTheme:refreshTheme,unlockSkin:unlockSkin,
    getStatus:function(){return status;},getScore:function(){return score;},
    getBestScore:function(){return bestScore;},getMode:function(){return mode;},
    getStats:function(){return stats;},getTheme:function(){return themeId;},
    isSkinUnlocked:function(id){return stats.unlockedSkins.indexOf(id)!==-1;},
    getLevelProgress:getLevelProgress,getTotalStars:getTotalStars,getDailyChallenge:getDailyChallenge,
    getLevelStars:function(lv){return stats.levelStars[lv]||0;},
    shareRefill:shareRefill,getShareRefillsLeft:getShareRefillsLeft,
    getSlowMotionActive:function(){return slowMotionActive;},
    getCheckpointScore:function(){return checkpointScore;},
    bgmStart:bgmStart,bgmStop:bgmStop,bgmToggle:bgmToggle,
    THEMES:THEMES,ACHIEVEMENTS:ACHIEVEMENTS,LEVELS:LEVELS
  };
}

global.BounceTower={create:create,THEMES:THEMES,ACHIEVEMENTS:ACHIEVEMENTS,LEVELS:LEVELS};
if(typeof module!=='undefined')module.exports=global.BounceTower;
})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:this));
