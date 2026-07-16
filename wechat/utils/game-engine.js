/**
 * ============================================================
 *  弹弹塔 Bounce Tower — 共享游戏引擎 v4.0
 *  羊了个羊式设计：第1关极简→断崖变难→道具裂变
 *  闯关(30关) + 每日挑战(引爆点)
 * ============================================================
 */
(function(global){
'use strict';

// ========== 30关 — 羊了个羊式心理曲线 ==========
// 第1关极简(人人过)→第3关断崖→奖励关穿插→末尾传说
var LEVELS = [
  {id:1, name:'你好世界',    target:2,  speedMul:0.3, desc:'闭着眼都能过'},
  {id:2, name:'地狱之门',    target:5,  speedMul:1.8, desc:'第2关 · 90%死在这'},
  {id:3, name:'才刚开始',    target:5,  speedMul:1.4, desc:'继续继续'},
  {id:4, name:'升温',        target:6,  speedMul:1.6, desc:'手开始冒汗'},
  {id:5, name:'别放松',      target:6,  speedMul:1.3, desc:'下一关更难'},
  {id:6, name:'步步惊心',    target:8,  speedMul:1.7, desc:'集中注意力'},
  {id:7, name:'稍微缓缓',    target:8,  speedMul:1.4, desc:'别被骗了'},
  {id:8, name:'加速',        target:10, speedMul:1.8, desc:'手指在发抖'},
  {id:9, name:'稳住',        target:10, speedMul:1.5, desc:'你能行的'},
  {id:10,name:'分水岭',      target:12, speedMul:1.9, desc:'⭐ 半数玩家在此止步'},
  {id:11,name:'悬崖勒马',    target:12, speedMul:1.5, desc:'快用道具'},
  {id:12,name:'真刀真枪',    target:15, speedMul:1.9, desc:'超过70%玩家'},
  {id:13,name:'喘息之间',    target:15, speedMul:1.6, desc:'让你歇一秒'},
  {id:14,name:'地狱深处',    target:18, speedMul:2.0, desc:'只有30%能过'},
  {id:15,name:'里程碑',      target:18, speedMul:1.7, desc:'⭐ 你已经很强了'},
  {id:16,name:'精英门槛',    target:20, speedMul:2.0, desc:'前20%玩家'},
  {id:17,name:'暴风雨前',    target:20, speedMul:1.7, desc:'给你歇口气'},
  {id:18,name:'极限挑战',    target:24, speedMul:2.2, desc:'只有10%能看到这'},
  {id:19,name:'绿洲',        target:24, speedMul:1.8, desc:'最后的温柔'},
  {id:20,name:'生死线',      target:28, speedMul:2.4, desc:'⭐ 前5%·传说门槛'},
  {id:21,name:'大师入门',    target:28, speedMul:2.0, desc:'大师联赛'},
  {id:22,name:'狂风暴雨',    target:32, speedMul:2.5, desc:'确定还要继续？'},
  {id:23,name:'休整',        target:32, speedMul:2.1, desc:'最后休息站'},
  {id:24,name:'不归路',      target:38, speedMul:2.7, desc:'只有1%能看到这'},
  {id:25,name:'传奇',        target:38, speedMul:2.3, desc:'⭐ 前1%·炫耀资格'},
  {id:26,name:'神之试炼',    target:45, speedMul:2.8, desc:'0.1%通关率'},
  {id:27,name:'天堑',        target:45, speedMul:2.5, desc:'难以置信'},
  {id:28,name:'登天之路',    target:55, speedMul:3.0, desc:'传奇诞生中'},
  {id:29,name:'最后之门',    target:55, speedMul:2.7, desc:'没有人相信'},
  {id:30,name:'弹弹之神',    target:65, speedMul:3.5, desc:'👑 0.001%·你是神'},
];

var ACHIEVEMENTS = [
  {id:'first_game',name:'初次尝试',desc:'完成第一局',icon:'🎮'},
  {id:'level_5',name:'小有所成',desc:'通过第 5 关',icon:'⭐'},
  {id:'level_10',name:'渐入佳境',desc:'通过第 10 关',icon:'🌟'},
  {id:'level_15',name:'势不可挡',desc:'通过第 15 关',icon:'💫'},
  {id:'level_20',name:'大师风范',desc:'通过第 20 关',icon:'🏆'},
  {id:'level_25',name:'登峰造极',desc:'通过第 25 关',icon:'👑'},
  {id:'level_30',name:'弹弹之神',desc:'通关全部 30 关',icon:'🗼'},
  {id:'combo_5',name:'手感火热',desc:'达成 5 连击',icon:'🔥'},
  {id:'combo_10',name:'人机合一',desc:'达成 10 连击',icon:'⚡'},
  {id:'combo_20',name:'神之手',desc:'达成 20 连击',icon:'👑'},
  {id:'layer_50',name:'摩天大楼',desc:'单局 50 层',icon:'🏢'},
  {id:'layer_100',name:'通天塔',desc:'单局 100 层',icon:'🗼'},
  {id:'games_50',name:'铁粉',desc:'累计玩 50 局',icon:'💎'},
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
function shade(c,p){var n=parseInt(c.replace('#',''),16),a=Math.round(2.55*p);var R=Math.max(0,Math.min(255,(n>>16)+a)),G=Math.max(0,Math.min(255,(n>>8&0x00FF00)+a)),B=Math.max(0,Math.min(255,(n&0x0000FF)+a));return'rgb('+R+','+G+','+B+')';}
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

  function BH(){return Math.max(22,W*0.075);}
  function IBW(){var base=Math.min(W*0.5,200);if(levelId===1)return base;return Math.max(70,base-(levelId-1)*5);}
  var PERF=4;
  function SPB(){return W*0.014;}
  function SPI(){return W*0.00055;}

  var status='idle',stack=[],cur=null,score=0,combo=0,maxCombo=0,bestScore=0,perfCount=0;
  var camY=0,tCamY=0,pts=[],fps=[],dp=0,dtY=0,cpt=0,cpText='',cpColor='#fff';
  var shake=0,flashA=0,flashC='#fff',wasNewBest=false,rafId=null,destroyed=false,lastFrameTime=0,rafWatchdog=null,scorePopTimer=0;
  var mode='level',levelId=1,levelTarget=0,levelSpeedMul=1,starsEarned=0;
  var themeId='default',pals=THEMES.default.pals,bgColors=THEMES.default.bg,pi=0,ci=0;

  // 道具
  var slowMotionTimer=0,slowMotionActive=false;

  function nc(){var p=pals[pi];var c=p[ci%p.length];ci++;if(ci%p.length===0){pi=(pi+1)%pals.length;ci=0;}return c;}

  function sfxPlace(){playBeep(600,0.07,'square',0.04);}
  function sfxPerfect(){playBeep(880,0.08,'sine',0.05);setTimeout(function(){playBeep(1320,0.08,'sine',0.05);},50);}
  function sfxCombo(){playBeep(1100,0.05,'sine',0.04);setTimeout(function(){playBeep(1650,0.06,'sine',0.04);},40);}
  function sfxAchieve(){playBeep(660,0.08,'sine',0.06);setTimeout(function(){playBeep(880,0.08,'sine',0.06);},80);setTimeout(function(){playBeep(1100,0.12,'sine',0.06);},160);}
  function sfxStar(){playBeep(523,0.08,'sine',0.06);setTimeout(function(){playBeep(659,0.08,'sine',0.06);},100);setTimeout(function(){playBeep(784,0.12,'sine',0.06);},200);}
  function sfxTool(){playBeep(440,0.06,'sine',0.05);setTimeout(function(){playBeep(660,0.06,'sine',0.05);},70);setTimeout(function(){playBeep(880,0.08,'sine',0.05);},140);}
  function sfxMiss(){playBeep(100,0.35,'sawtooth',0.06);}

  // ====== BGM 魔性循环音乐 ======
  var bgmPlaying=false,bgmTimer=null,bgmNoteIdx=0;
  // 羊了个羊式魔性旋律 (C大调 4/4拍 120BPM)
  var BGM_NOTES=[
    {f:523,d:0.18},{f:659,d:0.18},{f:784,d:0.18},{f:1047,d:0.25}, // C5 E5 G5 C6
    {f:0,d:0.08},{f:784,d:0.15},{f:659,d:0.15},{f:523,d:0.2},      // rest G5 E5 C5
    {f:0,d:0.12},{f:523,d:0.12},{f:587,d:0.12},{f:659,d:0.12},      // rest C5 D5 E5
    {f:784,d:0.2},{f:659,d:0.15},{f:587,d:0.15},{f:523,d:0.3},      // G5 E5 D5 C5
    {f:0,d:0.15},{f:784,d:0.12},{f:880,d:0.12},{f:988,d:0.15},      // rest G5 A5 B5
    {f:1047,d:0.3},{f:0,d:0.1},{f:988,d:0.12},{f:880,d:0.12},       // C6 rest B5 A5
    {f:784,d:0.2},{f:659,d:0.15},{f:523,d:0.25},{f:0,d:0.35},       // G5 E5 C5 rest
  ];
  var BGM_VOL=0.03;

  function bgmStart(){
    if(bgmPlaying)return;bgmPlaying=true;bgmNoteIdx=0;bgmScheduleNext();
  }
  function bgmStop(){bgmPlaying=false;if(bgmTimer)clearTimeout(bgmTimer);bgmTimer=null;}
  function bgmToggle(){if(bgmPlaying)bgmStop();else bgmStart();return bgmPlaying;}
  function bgmScheduleNext(){
    if(!bgmPlaying||destroyed)return;
    var note=BGM_NOTES[bgmNoteIdx%BGM_NOTES.length];
    if(note.f>0)playBeep(note.f,note.d,'sine',BGM_VOL);
    if(note.f>0&&bgmNoteIdx%2===0)playBeep(note.f*0.5,note.d,'triangle',BGM_VOL*0.5); // bass
    bgmNoteIdx++;
    bgmTimer=setTimeout(bgmScheduleNext,note.d*1000);
  }

  function spawnPts(x,y,n,c,sm){sm=sm||1;if(pts.length>200)return;for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=(2+Math.random()*6)*sm;var shape=Math.random()<0.3?'rect':'circle';pts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3*sm,life:1,decay:0.008+Math.random()*0.02,size:3+Math.random()*5,color:c,shape:shape});}}

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
  if(!stats.tools)stats.tools={slow:0,widen:0};
  if(!stats.levelAttempts)stats.levelAttempts={};
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
          case'level_5':cond=getLevelProgress()>=5;break;
          case'level_10':cond=getLevelProgress()>=10;break;
          case'level_15':cond=getLevelProgress()>=15;break;
          case'level_20':cond=getLevelProgress()>=20;break;
          case'level_25':cond=getLevelProgress()>=25;break;
          case'level_30':cond=getLevelProgress()>=30;break;
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
  function getPassRate(lv){var attempts=stats.levelAttempts[lv]||0;if(attempts===0)return 99;var clears=(stats.levelStars[lv]||0)>=1?1:0;return Math.round((1/attempts)*100);}

  function topOfStack(){if(stack.length===0)return{x:W/2-IBW()/2,y:H*0.65,w:IBW()};var t=stack[stack.length-1];return{x:t.x,y:t.y+BH(),w:t.w};}
  function swBounds(bw){var t=topOfStack(),hs=t.w/2,hb=bw/2,cx=t.x+hs;
  // Level 1: tiny zone (easy). Level 2+: WALL (2x+ zone)
  var extraMul=levelId===1?0.05:2.5;
  var extra=t.w*extraMul;
  return{min:cx-hs-hb-extra,max:cx+hs+hb+extra,cx:cx};}

  function spawnBlock(){
    var t=topOfStack(),w=t.w,b=swBounds(w),fromR=stack.length%2===0;
    var spd=(SPB()+score*SPI())*levelSpeedMul;
    if(slowMotionActive)spd*=0.3;
    cur={x:fromR?b.max:b.min,y:t.y+BH()+2,w:w,color:nc(),dir:fromR?-1:1,speed:spd,spawnAnim:8};
    dp=0;status='playing';
  }
  function dropBlock(){if(status!=='playing'||!cur)return;dp=0;dtY=topOfStack().y;status='dropping';}

  function placeBlock(){
    var b=cur,t=topOfStack(),bL=b.x,bR=b.x+b.w,sL=t.x,sR=t.x+t.w,oL=Math.max(bL,sL),oR=Math.min(bR,sR),oW=oR-oL;
    if(oW<=0){gameOver();return;}
    var isPerf=Math.abs(b.x-t.x)<=PERF;var cutLoss=isPerf?0:Math.abs(b.x-t.x)*0.3;var finalW=Math.max(30,oW-cutLoss);var pb={x:oL+(oW-finalW)/2,y:t.y,w:finalW,color:b.color};
    if(bL<sL)fps.push({x:bL,y:t.y,w:sL-bL,h:BH(),color:b.color,vy:-1,vx:-2-Math.random()*3,rot:0,rs:(Math.random()-0.5)*0.2});
    if(bR>sR)fps.push({x:sR,y:t.y,w:bR-sR,h:BH(),color:b.color,vy:-1,vx:2+Math.random()*3,rot:0,rs:(Math.random()-0.5)*0.2});
    stack.push(pb);score++;scorePopTimer=20;wasNewBest=false;
    if(score>bestScore){bestScore=score;wasNewBest=true;saveBest(bestScore);onNewBest(score);}
    stats.totalLayers++;flushStats();

    if(isPerf){
      combo++;if(combo>maxCombo)maxCombo=combo;perfCount++;stats.totalPerfects++;flushStats();
      if(combo>=3){var bonus=Math.min(combo*1.5,20);pb.w=Math.min(pb.w+bonus,IBW()*1.1);pb.x=Math.max(1,pb.x-(pb.w-oW)/2);}
      spawnPts(oL+oW/2,t.y+BH()/2,18,b.color,1.2);flashA=0.25;flashC='#ffd700';
      if(combo>=5)spawnPts(oL+oW/2,t.y+BH()/2,10,'#ffffff',1.5);
      if(combo>=3){var msgs=combo>=20?['👑 神之手!','🌟 无敌!','💎 传说!']:combo>=10?['🔥 炸裂!','⚡ 疯狂!','🎯 精准!']:combo>=5?['✨ 连击!','💪 厉害!','👏 漂亮!']:['👍 不错!','✅ 完美!','💯 满分!'];cpText=msgs[Math.floor(Math.random()*msgs.length)]+' x'+combo;cpColor=b.color;cpt=55;if(platform.vibrate)platform.vibrate('light');sfxCombo();if(platform.vibrate)platform.vibrate('heavy');}else{sfxPerfect();if(platform.vibrate&&combo===0)platform.vibrate('light');}
    }else{combo=0;perfCount=0;shake=Math.max(0,10-oW*0.6);sfxPlace();if(oW>0&&oW<t.w*0.3){spawnPts(oL+oW/2,t.y+BH()/2,8,'rgba(255,180,0,0.8)',1);if(oW<t.w*0.15){shake=Math.max(shake,6);if(platform.vibrate)platform.vibrate('medium');}}}
    tCamY=Math.max(0,t.y-H*0.35);cur=null;dp=0;

    if(mode==='level'&&score>=levelTarget){
      var stars=1;if(score>=levelTarget*1.5)stars=3;else if(score>=levelTarget*1.2)stars=2;
      completeLevel(stars);
    }
    if(mode==='daily'&&score>=levelTarget){
      var ds=1;if(score>=levelTarget*1.5)ds=3;else if(score>=levelTarget*1.2)ds=2;
      completeLevel(ds);
    }
  }

  function completeLevel(stars){
    starsEarned=stars;
    if(mode==='level'){
      var prev=stats.levelStars[levelId]||0;if(stars>prev){stats.levelStars[levelId]=stars;flushStats();persistStats();}
    }else{
      var today=new Date().toISOString().slice(0,10),prev=stats.dailyBest[today]||0;if(stars>prev){stats.dailyBest[today]=stars;flushStats();persistStats();}
    }
    onLevelComplete({mode:mode,levelId:levelId,stars:stars,score:score,maxCombo:maxCombo,layers:stack.length,wasNewBest:wasNewBest});
    spawnPts(W/2,H/2,stars*10,stars>=3?'#ffd700':stars>=2?'#c0c0c0':'#cd7f32',2.5);
    flashA=0.5;flashC=stars>=3?'#ffd700':'#ffffff';sfxStar();
    checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});
    status='levelcomplete';
  }

  function gameOver(){
    status='gameover';sfxMiss();
    if(cur){
        fps.push({x:cur.x,y:cur.y,w:cur.w,h:BH(),color:cur.color,vy:-4,vx:(Math.random()-0.5)*6,rot:0,rs:(Math.random()-0.5)*0.25});
        for(var di=0;di<12;di++){var da=Math.random()*Math.PI*2,ds=3+Math.random()*8;
          pts.push({x:cur.x+cur.w/2,y:cur.y+BH()/2,vx:Math.cos(da)*ds,vy:Math.sin(da)*ds-5,life:1,decay:0.015+Math.random()*0.03,size:3+Math.random()*5,color:cur.color});
        }
        cur=null;}
    shake=20;flashA=0.7;flashC=levelId<=2?'#ff4444':levelId<=10?'#ff6b6b':levelId<=20?'#ff3366':'#cc0033';for(var di2=0;di2<stack.length;di2++){var b2=stack[di2];if(Math.random()<0.3)spawnPts(b2.x+b2.w/2,b2.y+BH()/2,3,b2.color,0.5);}slowMotionActive=false;slowMotionTimer=0;
    stats.totalGames++;if(maxCombo>stats.bestComboEver)stats.bestComboEver=maxCombo;
    if(mode==='level'){stats.levelAttempts[levelId]=(stats.levelAttempts[levelId]||0)+1;}
    var today=new Date().toISOString().slice(0,10);
    if(stats.lastPlayDate!==today){if(stats.lastPlayDate===''||(new Date(today)-new Date(stats.lastPlayDate))<=86400000*2)stats.dailyStreak++;else stats.dailyStreak=1;stats.lastPlayDate=today;}
    flushStats();checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});
    onGameOver(score,maxCombo,stack.length,wasNewBest,mode,levelId,levelTarget);
    persistStats();
  }

  function revive(){if(status!=='gameover')return;status='playing';shake=0;flashA=0;combo=0;perfCount=0;slowMotionActive=false;slowMotionTimer=0;spawnBlock();}

  // 道具系统
  function useTool(toolName){
    if(status!=='playing'||!cur)return false;
    if(toolName==='slow'){
      if(stats.tools.slow<=0)return false;
      stats.tools.slow--;flushStats();persistStats();
      slowMotionActive=true;slowMotionTimer=300; // 5秒(60fps)
      sfxTool();onUseTool('slow',stats.tools.slow);
      return true;
    }else if(toolName==='widen'){
      if(stats.tools.widen<=0)return false;
      stats.tools.widen--;flushStats();persistStats();
      // 将当前堆顶宽度重置为初始宽度
      if(stack.length>0){
        var top=stack[stack.length-1];
        top.w=IBW();top.x=Math.max(2,W/2-IBW()/2);
      }
      sfxTool();spawnPts(W/2,H*0.6,20,'#ffd700',1.5);flashA=0.3;flashC='#ffd700';
      onUseTool('widen',stats.tools.widen);
      return true;
    }else if(toolName==='reverse'){
      if(stats.tools.reverse<=0||status!=='playing'||!cur)return false;
      stats.tools.reverse--;flushStats();persistStats();
      cur.dir*=-1;
      sfxTool();spawnPts(cur.x+cur.w/2,cur.y,8,'#64c8ff',1);
      onUseTool('reverse',stats.tools.reverse);
      return true;
    }
    return false;
  }
  function addTool(toolName,amount){
    stats.tools[toolName]=(stats.tools[toolName]||0)+amount;
    flushStats();persistStats();
  }
  function getToolCount(toolName){return stats.tools[toolName]||0;}
  function shareRefill(){
    if(stats.shareRefills>=3)return false;
    stats.shareRefills++;stats.tools.slow++;stats.tools.widen++;stats.tools.reverse++;
    flushStats();persistStats();return true;
  }
  function getShareRefillsLeft(){return 3-(stats.shareRefills||0);}

  function setMode(m,opts){opts=opts||{};mode=m;levelId=opts.levelId||1;levelTarget=opts.target||0;levelSpeedMul=opts.speedMul||1;flashA=0.4;flashC='#ffffff';reset();
  try{render();}catch(e){} }
  function reset(){
    persistStats();themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;
    pi=Math.floor(Math.random()*pals.length);ci=0;
    stack=[];cur=null;score=0;combo=0;maxCombo=0;perfCount=0;starsEarned=0;
    camY=0;tCamY=-H*0.1;pts=[];fps=[];dp=0;shake=0;flashA=0;cpt=0;cpText='';wasNewBest=false;
    slowMotionActive=false;slowMotionTimer=0;scorePopTimer=0;
    status='idle';
  }
  function refreshTheme(){themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;}
  function unlockSkin(skinId){if(stats.unlockedSkins.indexOf(skinId)===-1){stats.unlockedSkins.push(skinId);flushStats();persistStats();checkAchievements({totalGames:stats.totalGames,score:score,maxCombo:maxCombo});}}

  function getDailyChallenge(){
    var today=new Date().toISOString().slice(0,10),h=hash(today),lv=LEVELS[5+(h%(LEVELS.length-5))];
    return{levelId:lv.id,name:lv.name,target:lv.target,desc:lv.desc,speedMul:Math.round((0.9+(h%100)/250)*100)/100};
  }

  // ====== Update ======
  function update(){
    if(destroyed)return;
    camY=lerp(camY,tCamY,0.08);if(shake>0)shake*=0.84;if(shake<0.08)shake=0;if(flashA>0)flashA-=0.025;if(flashA<0)flashA=0;if(cpt>0){cpt--;if(cpt<=0)cpText='';}
    if(slowMotionActive){slowMotionTimer--;if(slowMotionTimer<=0){slowMotionActive=false;}}
    if(status==='playing'&&cur){var b=cur,bd=swBounds(b.w);b.x+=b.speed*b.dir;if(b.x<=bd.min){b.x=bd.min;b.dir=1;}else if(b.x+b.w>=bd.max){b.x=bd.max-b.w;b.dir=-1;}}
    if(status==='dropping'&&cur){dp+=0.13;if(dp>=1){dp=1;cur.y=dtY;placeBlock();if(status!=='gameover'&&status!=='levelcomplete')spawnBlock();}else{var sy=topOfStack().y+BH()+2;cur.y=sy+(dtY-sy)*eOutBounce(dp);}}
    for(var i=pts.length-1;i>=0;i--){var p=pts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=p.decay;if(p.life<=0)pts.splice(i,1);}
    for(var j=fps.length-1;j>=0;j--){var f=fps[j];f.vy+=0.45;f.y+=f.vy;f.x+=f.vx;f.rot+=f.rs;if(f.y>H+250)fps.splice(j,1);}
  }

  // ====== Render ======
  function rrect(x,y,w,h,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.fill();}
  function dBlock(x,y,w,h,c,a,rot){a=a===undefined?1:a;rot=rot||0;ctx.save();if(rot!==0){ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.globalAlpha=a;rrect(-w/2,-h/2,w,h,3,c);}else{ctx.globalAlpha=a;var g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,shade(c,20));g.addColorStop(0.3,c);g.addColorStop(1,shade(c,-40));rrect(x,y,w,h,6,g);ctx.fillStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.moveTo(x+5,y+2);ctx.lineTo(x+w-5,y+2);ctx.quadraticCurveTo(x+w,y+2,x+w,y+5);ctx.lineTo(x+w-4,y+h*0.2);ctx.lineTo(x+4,y+h*0.2);ctx.lineTo(x,y+5);ctx.quadraticCurveTo(x,y+2,x+5,y+2);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(x,y+h-2,w,4);ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(x,y+h-6,w,4);ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=1;ctx.stroke();}ctx.restore();}
  function dText(t,x,y,s,c,a,sc,sb){a=a||'center';sb=sb||0;ctx.font='900 '+s+'px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign=a;ctx.textBaseline='middle';if(sb>0&&sc){ctx.shadowColor=sc;ctx.shadowBlur=sb;}ctx.fillStyle=c;ctx.fillText(t,x,y);ctx.shadowColor='transparent';ctx.shadowBlur=0;}

  function drawBg(){
    var bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,bgColors[0]);bg.addColorStop(0.5,bgColors[1]);bg.addColorStop(1,bgColors[2]);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      // DEBUG: draw a visible rectangle to confirm rendering works
      
    ctx.strokeStyle='rgba(0,0,0,0.03)';ctx.lineWidth=0.5;for(var x=40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(var y=40;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  function render(){
    ctx.clearRect(0,0,W,H);var sx=shake?(Math.random()-0.5)*shake*2:0,sy=shake?(Math.random()-0.5)*shake*2:0;
    ctx.save();ctx.translate(sx,sy);drawBg();var cam=camY;
    if(stack.length===0){var t0=topOfStack(),by=t0.y-cam;if(by>-BH()&&by<H+BH()){dBlock(t0.x,by,t0.w,BH(),'#d5cdbc',0.85);if(status==='idle'){var pulse=Math.sin(Date.now()/550)*0.25+0.45;ctx.fillStyle='rgba(255,107,107,'+(pulse*0.15)+')';ctx.fillRect(t0.x,by,t0.w,BH());ctx.strokeStyle='rgba(255,107,107,'+(pulse*0.5)+')';ctx.lineWidth=2.5;ctx.setLineDash([6,4]);ctx.strokeRect(t0.x-2,by-2,t0.w+4,BH()+4);ctx.setLineDash([]);}}}
    for(var i=0;i<stack.length;i++){var b=stack[i],dy=b.y-cam;if(dy>H+BH()||dy<-BH()*2)continue;dBlock(b.x,dy,b.w,BH(),b.color);}
    if(cur&&status==='playing'){var t=topOfStack(),zy=t.y-cam;
      // Landing zone glow
      var overlap=Math.max(0,Math.min(cur.x+cur.w,t.x+t.w)-Math.max(cur.x,t.x));
      var pct=overlap/Math.max(cur.w,t.w);
      var glowC=pct>0.7?'rgba(74,222,128,0.3)':pct>0.3?'rgba(255,180,0,0.2)':'rgba(255,100,100,0.15)';
      ctx.fillStyle=glowC;ctx.fillRect(t.x,zy,t.w,BH());
      ctx.strokeStyle='rgba(255,180,0,0.35)';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.strokeRect(t.x,zy,t.w,BH());ctx.setLineDash([]);
      // Alignment indicator line
      ctx.strokeStyle='rgba(255,180,0,0.2)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cur.x+cur.w/2,zy-4);ctx.lineTo(cur.x+cur.w/2,zy+BH()+4);ctx.stroke();
    }
    if(cur&&status==='dropping'){var td=topOfStack();ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(td.x,td.y-cam,td.w,BH());}
    if(cur){
      // Motion trail (ghost blocks behind)
      if(status==='playing'){
        var trailX=cur.x-cur.dir*cur.speed*5;
        ctx.globalAlpha=0.08;dBlock(trailX,cur.y-cam,cur.w,BH(),cur.color);ctx.globalAlpha=1;
      }
      dBlock(cur.x,cur.y-cam,cur.w,BH(),cur.color);
    }
    for(var j=0;j<fps.length;j++){var f=fps[j];dBlock(f.x,f.y-cam,f.w,f.h,f.color,0.9,f.rot);}
    for(var k=0;k<pts.length;k++){var pt=pts[k];ctx.fillStyle=pt.color;ctx.globalAlpha=pt.life;if(pt.shape==='rect'){var s2=pt.size;ctx.fillRect(pt.x-s2/2,pt.y-cam-s2/2,s2,s2)}else{ctx.beginPath();ctx.arc(pt.x,pt.y-cam,pt.size,0,Math.PI*2);ctx.fill();}}
    ctx.globalAlpha=1;if(flashA>0){ctx.fillStyle=flashC;ctx.globalAlpha=flashA;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
    // 慢动作效果
    if(slowMotionActive){ctx.fillStyle='rgba(100,200,255,'+(0.08+Math.sin(Date.now()/200)*0.04)+')';ctx.fillRect(0,0,W,H);}
    ctx.restore();drawUI();
  }

  function drawUI(){
    var safeTop=44,sY=safeTop+20;

    // 分数 - 金色渐变效果
    var scoreGrad=ctx.createLinearGradient(W/2-40,sY-20,W/2+40,sY+20);
    scoreGrad.addColorStop(0,'#ffffff');scoreGrad.addColorStop(1,'#ffd700');
    dText(String(score),W/2,sY,56,scoreGrad,'center','rgba(255,107,107,0.3)',20);

    // 模式标签
    if(mode==='level'){
      var lv=LEVELS.find(function(l){return l.id===levelId;});
      if(lv)dText('🎯 第'+lv.id+'关 · '+lv.name,W/2,sY+28,13,'rgba(0,0,0,0.5)','center');
    }else if(mode==='daily'){
      dText('📅 今日挑战',W/2,sY+28,13,'rgba(200,140,0,0.8)','center');
    }

    if(combo>=2&&status!=='gameover'&&status!=='levelcomplete'){
      dText('🔥 '+combo+'x 连击',W/2,sY+46,15,'#e67e00','center','rgba(230,126,0,0.3)',12);
    }

    // 进度条 - 带发光
    if(levelTarget>0&&status!=='idle'&&status!=='levelcomplete'&&status!=='gameover'){
      var barW=Math.min(W*0.64,240),barH=6,barX=W/2-barW/2,barY=sY+72,prog=Math.min(1,score/levelTarget);
      // 背景
      ctx.fillStyle='rgba(0,0,0,0.06)';rrect(barX,barY,barW,barH,3,'rgba(0,0,0,0.06)');
      // 进度
      var barC=prog>=1?'#4ade80':prog>=0.6?'#ffd700':prog>=0.3?'#f97316':'#ef4444';
      if(prog>0){rrect(barX,barY,Math.max(barW*prog,barH),barH,3,barC);}
      // 发光
      if(prog>=0.8&&prog<1){ctx.shadowColor=barC;ctx.shadowBlur=8;ctx.fillStyle=barC;ctx.fillRect(barX+barW*prog-2,barY-1,4,barH+2);ctx.shadowBlur=0;}
      dText(score+'/'+levelTarget,W/2,barY+14,11,prog>=1?'#4ade80':'rgba(0,0,0,0.5)','center');
    }

    // 道具计数
    if(status==='playing'){
      var totalT=stats.tools.slow+stats.tools.widen+stats.tools.reverse;
      if(totalT>0){
        var ty2=H-35;
        ctx.font='900 14px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign='center';
        ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillText('🐢×'+stats.tools.slow+'  📏×'+stats.tools.widen+'  🔄×'+stats.tools.reverse,W/2,ty2);
      }else{
        ctx.font='900 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign='center';
        ctx.fillStyle='rgba(255,50,50,0.8)';var refills=3-(stats.shareRefills||0);ctx.fillText('⚠️ 道具用完 · 分享得3个(剩'+refills+'次)',W/2,H-35);
      }
    }
    if(slowMotionActive){
      var sma=0.6+Math.sin(Date.now()/300)*0.3;
      dText('🐢 慢动作',W/2,H-35,13,'rgba(0,150,220,0.8)','center','rgba(0,150,220,0.2)',8);
    }

    // Idle
    if(status==='idle'){
      var p2=Math.sin(Date.now()/800)*0.3+0.5;
      ctx.fillStyle='rgba(0,0,0,'+(p2*0.7)+')';ctx.font='600 18px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign='center';
      ctx.font='bold 22px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillText('🪜 弹弹塔',W/2,H*0.66);
      ctx.font='600 16px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,'+(p2*0.6)+')';ctx.fillText('👆 点击屏幕开始',W/2,H*0.72);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.font='12px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.font='12px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.fillText('⚠️ 色块大小随机 · 对准了再点',W/2,H*0.72+26);
      if(mode==='level'&&levelTarget>0){var lv2=LEVELS.find(function(l){return l.id===levelId;});if(lv2){
        ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillText('🎯 目标: '+lv2.target+' 层 — '+lv2.desc,W/2,H*0.72+44);
      }}
      if(stats.dailyStreak>=2){ctx.fillStyle='rgba(230,120,0,0.7)';ctx.font='11px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.fillText('🔥 连续签到 '+stats.dailyStreak+' 天',W/2,H*0.72+62);}
    }

    // Combo pop
    if(cpt>0&&cpText){var pa=cpt>30?1:cpt/30,ps2=1+(55-cpt)*0.008;ctx.save();ctx.globalAlpha=pa;ctx.translate(W/2,H*0.30);ctx.scale(ps2,ps2);dText(cpText,0,0,44,cpColor,'center',cpColor,35);ctx.restore();}

    // ====== 通关面板 ======
    if(status==='levelcomplete'&&!useNativeUI){
      // 暗色遮罩+模糊感
      ctx.fillStyle='rgba(255,255,255,0.65)';ctx.fillRect(0,0,W,H);
      // 装饰圆
      ctx.fillStyle='rgba(255,180,0,0.1)';ctx.beginPath();ctx.arc(W*0.3,H*0.3,W*0.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(W*0.7,H*0.7,W*0.35,0,Math.PI*2);ctx.fill();

      var pw=Math.min(W*0.82,320),ph=280,px=W/2-pw/2,py=H/2-ph/2-15;
      // 玻璃面板
      var panelGrad=ctx.createLinearGradient(px,py,px,py+ph);
      panelGrad.addColorStop(0,'rgba(22,22,60,0.95)');panelGrad.addColorStop(1,'rgba(16,16,40,0.97)');
      rrect(px,py,pw,ph,22,panelGrad);
      ctx.strokeStyle='rgba(255,215,0,0.3)';ctx.lineWidth=2;ctx.stroke();
      // 内发光
      ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
      ctx.strokeStyle="rgba(255,255,255,0.04)";ctx.lineWidth=1;rrect(px+2,py+2,pw-4,ph-4-2,20,"transparent");ctx.stroke();

      dText(mode==='level'?'🎉 通关!':'🎉 挑战完成!',W/2,py+32,26,'#e67e00','center','rgba(230,126,0,0.2)',10);

      // 星星 - 带动效
      var starY=py+74,starGap=46;
      for(var si=0;si<3;si++){
        var starAlpha=si<starsEarned?1:0.15;
        var starScale=si<starsEarned?1.1+Math.sin(Date.now()/400+si)*0.08:1;
        ctx.globalAlpha=starAlpha;ctx.font=(38*starScale)+'px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';ctx.textAlign='center';
        ctx.fillText('⭐',W/2-(1-si)*starGap,starY);
      }
      ctx.globalAlpha=1;

      dText(score+' 层 · '+maxCombo+' 连击',W/2,starY+48,15,'rgba(0,0,0,0.6)','center');
      if(starsEarned>=3){dText('🌟 完美通关! 道具+1',W/2,starY+64,13,'#ffd700','center');}
      var pct=levelId<=3?50:levelId<=6?30:levelId<=10?15:levelId<=15?8:levelId<=20?3:levelId<=25?1:0.5;
      dText('🏅 你超过了 '+pct+'% 的玩家!',W/2,starY+66,13,'#ff6b6b','center');
      if(wasNewBest)dText('🏆 新纪录!',W/2,starY+72,15,'#ff6b6b','center','rgba(255,107,107,0.4)',12);
      if(mode==='level'){var nl=LEVELS.find(function(l){return l.id===levelId+1;});if(nl)dText('下一关: '+nl.name+' → '+nl.target+'层',W/2,starY+(wasNewBest?96:86),12,'rgba(0,0,0,0.35)','center');}

      var bw=160,bh=42,bx=W/2-bw/2,by=py+ph-58;
      var bgrad=ctx.createLinearGradient(bx,by,bx,by+bh);bgrad.addColorStop(0,'#667eea');bgrad.addColorStop(1,'#764ba2');rrect(bx,by,bw,bh,bh/2,bgrad);
      dText(mode==='level'?'▶ 继续闯关':'返回',W/2,by+bh/2,16,'#ffffff','center');
      var pulse3=Math.sin(Date.now()/600)*0.15+0.85;
      ctx.strokeStyle='rgba(0,0,0,'+(pulse3*0.2)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx+bw/2,by+bh/2,bh/2+5,0,Math.PI*2);ctx.stroke();
    }

    // ====== 失败面板 ======
    if(status==='gameover'&&!useNativeUI){
      ctx.fillStyle='rgba(255,255,255,0.6)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(255,107,107,0.08)';ctx.beginPath();ctx.arc(W*0.25,H*0.25,W*0.45,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,180,0,0.08)';ctx.beginPath();ctx.arc(W*0.75,H*0.75,W*0.35,0,Math.PI*2);ctx.fill();

      var pw2=Math.min(W*0.8,310),ph2=mode==='level'?220:210,px2=W/2-pw2/2,py2=H/2-ph2/2-15;
      var pg2=ctx.createLinearGradient(px2,py2,px2,py2+ph2);
      pg2.addColorStop(0,'rgba(255,255,255,0.95)');pg2.addColorStop(1,'rgba(250,248,245,0.97)');
      rrect(px2,py2,pw2,ph2,22,pg2);
      ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=1;ctx.stroke();

      if(mode==='level'){
        dText('😢 挑战失败',W/2,py2+30,22,'#333','center');
        var remain=levelTarget-score;
        if(remain>0&&remain<=10){
          dText('只差 '+remain+' 层就过关了! 💪',W/2,py2+56,16,'#ff6b35','center','rgba(255,107,53,0.3)',8);
        }else{
          dText('目标 '+levelTarget+' 层 · 到达 '+score+' 层',W/2,py2+56,13,'rgba(0,0,0,0.4)','center');
        }
      }else if(mode==='daily'){
        dText('😢 挑战失败',W/2,py2+30,22,'#333','center');
        var rem=levelTarget-score;
        if(rem>0&&rem<=10)dText('只差 '+rem+' 层! 明天再来~',W/2,py2+56,16,'#ff6b35','center','rgba(255,107,53,0.3)',8);
        else dText('目标 '+levelTarget+' 层 · 到达 '+score+' 层',W/2,py2+56,13,'rgba(0,0,0,0.4)','center');
      }else{
        dText('🎯 游戏结束',W/2,py2+30,22,'#ffffff','center');
      }

      // 分数 - 金色渐变
      var sg2=ctx.createLinearGradient(W/2-40,py2+90,W/2+40,py2+90);
      sg2.addColorStop(0,'#ffffff');sg2.addColorStop(1,'#ffd700');
      dText(String(score),W/2,py2+102,52,sg2,'center','rgba(255,215,0,0.4)',25);

      if(wasNewBest)dText('🏆 新纪录!',W/2,py2+130,15,'#ff6b6b','center','rgba(255,107,107,0.4)',12);
      dText((maxCombo>0?'最高 '+maxCombo+' 连击 · ':'')+stack.length+' 层',W/2,py2+(wasNewBest?148:138),11,'rgba(0,0,0,0.4)','center');

      var bw2=160,bh2=42,bx2=W/2-bw2/2,by2=py2+ph2-58;
      var bgrad2=ctx.createLinearGradient(bx2,by2,bx2,by2+bh2);bgrad2.addColorStop(0,'#667eea');bgrad2.addColorStop(1,'#764ba2');rrect(bx2,by2,bw2,bh2,bh2/2,bgrad2);
      dText('🔄 再来一局',W/2,by2+bh2/2,16,'#ffffff','center');
      var p3=Math.sin(Date.now()/700)*0.15+0.85;
      ctx.strokeStyle='rgba(0,0,0,'+(p3*0.3)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx2+bw2/2,by2+bh2/2,bh2/2+5,0,Math.PI*2);ctx.stroke();
    }
  }
  function renderShareCard(cc,cw,ch){
    var bg2=cc.createLinearGradient(0,0,0,ch);bg2.addColorStop(0,'#1a1a3e');bg2.addColorStop(0.4,'#2a1a4e');bg2.addColorStop(1,'#1a1a3e');cc.fillStyle=bg2;cc.fillRect(0,0,cw,ch);
    cc.fillStyle='rgba(255,255,255,0.03)';cc.beginPath();cc.arc(cw*0.2,ch*0.3,cw*0.4,0,Math.PI*2);cc.fill();cc.beginPath();cc.arc(cw*0.8,ch*0.7,cw*0.3,0,Math.PI*2);cc.fill();
    cc.font='bold 28px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.textAlign='center';cc.textBaseline='middle';cc.fillStyle='#ffffff';cc.fillText('🪜 弹弹塔',cw/2,ch*0.18);
    cc.font='900 72px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.shadowColor='rgba(255,215,0,0.5)';cc.shadowBlur=30;cc.fillStyle='#ffd700';cc.fillText(String(score),cw/2,ch*0.45);cc.shadowColor='transparent';cc.shadowBlur=0;
    if(mode==='level'){var lv3=LEVELS.find(function(l){return l.id===levelId;});if(lv3)cc.fillText('第'+lv3.id+'关 · '+lv3.name+' · '+starsEarned+'星',cw/2,ch*0.55);}
    cc.font='16px -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif';cc.fillStyle='rgba(255,255,255,0.5)';cc.fillText('来挑战我吧! 微信搜「弹弹塔」',cw/2,ch*0.85);
  }

  function loop(){if(destroyed)return;lastFrameTime=Date.now();update();render();if(rafWatchdog)clearTimeout(rafWatchdog);rafWatchdog=setTimeout(function(){if(Date.now()-lastFrameTime>1500&&!destroyed){console.warn('RAF stalled, restarting');rafId=raf(loop);}},2000);rafId=raf(loop);}
  function init(){themeId=getTheme();var th=THEMES[themeId]||THEMES.default;pals=th.pals;bgColors=th.bg;pi=Math.floor(Math.random()*pals.length);ci=0;bestScore=loadBest();
  // Draw first frame immediately (don't wait for RAF)
  try{render();}catch(e){}
  loop();}
  function handleTap(){if(destroyed)return;if(status==='idle')spawnBlock();else if(status==='playing')dropBlock();else if(status==='gameover'||status==='levelcomplete')reset();}
  function destroy(){destroyed=true;persistStats();if(rafWatchdog)clearTimeout(rafWatchdog);rafWatchdog=null;rafId=null;}

  return{
    init:init,handleTap:handleTap,reset:reset,revive:revive,destroy:destroy,setMode:setMode,
    useTool:useTool,addTool:addTool,getToolCount:getToolCount,
    renderShareCard:renderShareCard,refreshTheme:refreshTheme,unlockSkin:unlockSkin,
    getStatus:function(){return status;},getScore:function(){return score;},getBestScore:function(){return bestScore;},getMode:function(){return mode;},
    getStats:function(){return stats;},getTheme:function(){return themeId;},
    isSkinUnlocked:function(id){return stats.unlockedSkins.indexOf(id)!==-1;},
    getLevelProgress:getLevelProgress,getTotalStars:getTotalStars,getDailyChallenge:getDailyChallenge,
    getLevelStars:function(lv){return stats.levelStars[lv]||0;},shareRefill:shareRefill,getShareRefillsLeft:getShareRefillsLeft,
    getSlowMotionActive:function(){return slowMotionActive;},
    bgmStart:bgmStart,bgmStop:bgmStop,bgmToggle:bgmToggle,
    THEMES:THEMES,ACHIEVEMENTS:ACHIEVEMENTS,LEVELS:LEVELS
  };
}

module.exports={create:create,THEMES:THEMES,ACHIEVEMENTS:ACHIEVEMENTS,LEVELS:LEVELS};if(typeof module!=='undefined')module.exports=global.BounceTower;
})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:this));
