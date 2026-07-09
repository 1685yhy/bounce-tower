var BounceTower=require('../../utils/game-engine');
var AD={rewardedVideo:'adunit-xxxxxxxxxxxxxxxx',banner:'adunit-xxxxxxxxxxxxxxxx',interstitial:'adunit-xxxxxxxxxxxxxxxx'};
var INTERVAL=5,RV_LIMIT=5;

Page({
  data:{
    showHome:true,showGameOver:false,showLevelComplete:false,showLeaderboard:false,showSkinPanel:false,showAchievement:false,showToolbar:false,
    finalScore:0,finalDetail:'',isNewBest:false,canRevive:true,gameOverTitle:'',restartLabel:'重试本关',showNearMiss:false,nearMissText:'',
    levelCompleteTitle:'',nextLevelText:'',levelStars:0,achievement:{icon:'',name:'',desc:''},
    rankList:[],skinList:[],currentSkin:'default',
    levelProgress:0,totalStars:0,levelList:[],nextLevel:0,maxUnlocked:1,
    dailyInfo:{name:'',target:0,desc:''},currentMode:'',slowCount:0,widenCount:0,reverseCount:0,bgmOn:false,dailyPlayers:0,
  },
  onLoad:function(){var t=this;t.game=null;t.canvas=null;t.rafId=null;t.audioCtx=null;t.rewardedVideoAd=null;t.bannerAd=null;t.interstitialAd=null;t.gameCount=0;t.reviveCount=0;t.isAdLoading=false;t.pendingRevive=false;t.achieveTimer=null;t._levelId=0;},
  onReady:function(){this.initCanvas();},
  onShow:function(){if(this.bannerAd&&this.game&&!this.data.showHome)this.bannerAd.show();},
  onHide:function(){if(this.bannerAd)this.bannerAd.hide();},
  onUnload:function(){if(this.achieveTimer)clearTimeout(this.achieveTimer);if(this.game)this.game.destroy();if(this.rafId&&this.canvas)try{this.canvas.cancelAnimationFrame(this.rafId);}catch(e){}if(this.audioCtx)try{this.audioCtx.close();}catch(e){}this.destroyAds();},

  initCanvas:function(){
    var t=this;
    wx.createSelectorQuery().select('#gameCanvas').fields({node:true,size:true}).exec(function(res){
      if(!res||!res[0]){console.error('Canvas not found');return;}
      var c=res[0].node,ctx=c.getContext('2d'),s=wx.getSystemInfoSync(),dpr=s.pixelRatio,w=s.windowWidth,h=s.windowHeight;
      c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);t.canvas=c;t.ctx=ctx;t.sysInfo=s;t.initAudio();t.initAds();
      t.game=BounceTower.create({
        ctx:ctx,width:w,height:h,
        loadBest:t.loadBest.bind(t),saveBest:t.saveBest.bind(t),
        requestAnimationFrame:function(fn){t.rafId=c.requestAnimationFrame(function(){fn();});return t.rafId;},
        playBeep:t.playBeep.bind(t),onGameOver:t.onGameOver.bind(t),onNewBest:t.onNewBest.bind(t),
        onAchievement:t.onAchievement.bind(t),onLevelComplete:t.onLevelComplete.bind(t),onUseTool:t.onUseTool.bind(t),
        loadStats:t.loadStats.bind(t),saveStats:t.saveStats.bind(t),getTheme:t.getTheme.bind(t),useNativeUI:true,
        vibrate:function(type){try{wx.vibrateShort({type:type||'light'});}catch(e){}},
      });
      t.game.init();
      t.refreshHome();
    });
  },

  initAudio:function(){try{this.audioCtx=wx.createWebAudioContext();}catch(e){this.audioCtx=null;}},
  playBeep:function(f,d,type,vol){if(!this.audioCtx)return;try{var ctx=this.audioCtx,now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,now);g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(0.001,now+d);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+d);}catch(e){}},
  loadBest:function(){try{return wx.getStorageSync('bttBest')||0;}catch(e){return 0;}},
  saveBest:function(s){try{wx.setStorageSync('bttBest',s);this.uploadToCloud(s);}catch(e){}},
  uploadToCloud:function(s){try{wx.setUserCloudStorage({KVDataList:[{key:'maxScore',value:String(s)}]});}catch(e){}},
  loadStats:function(){try{var s=wx.getStorageSync('bttStats');return s?JSON.parse(s):{};}catch(e){return{};}},
  saveStats:function(s){try{wx.setStorageSync('bttStats',JSON.stringify(s));}catch(e){}},
  getTheme:function(){try{return wx.getStorageSync('bttTheme')||'default';}catch(e){return'default';}},
  setTheme:function(id){try{wx.setStorageSync('bttTheme',id);}catch(e){}if(this.game)this.game.refreshTheme();},

  initAds:function(){this.initRV();this.initBanner();this.initInterstitial();},
  initRV:function(){if(AD.rewardedVideo.indexOf('xxxxxxxx')!==-1)return;try{var t=this;var rv=wx.createRewardedVideoAd({adUnitId:AD.rewardedVideo,multiton:false});rv.onLoad(function(){t.isAdLoading=false;});rv.onError(function(err){t.isAdLoading=false;if(t.pendingRevive){t.pendingRevive=false;t.doRevive();}});rv.onClose(function(res){if(res&&res.isEnded){if(t.pendingRevive){t.pendingRevive=false;t.doRevive();}}else{t.pendingRevive=false;wx.showToast({title:'看完才能获得奖励哦~',icon:'none'});}});this.rewardedVideoAd=rv;}catch(e){}},
  initBanner:function(){if(AD.banner.indexOf('xxxxxxxx')!==-1)return;try{var s=this.sysInfo||wx.getSystemInfoSync();this.bannerAd=wx.createBannerAd({adUnitId:AD.banner,adIntervals:30,style:{left:0,top:s.windowHeight-60,width:s.windowWidth}});}catch(e){}},
  initInterstitial:function(){if(AD.interstitial.indexOf('xxxxxxxx')!==-1)return;try{this.interstitialAd=wx.createInterstitialAd({adUnitId:AD.interstitial});}catch(e){}},
  showRV:function(){if(!this.rewardedVideoAd){this.doRevive();return;}var t=this;this.rewardedVideoAd.show().catch(function(){t.isAdLoading=true;t.rewardedVideoAd.load().then(function(){t.isAdLoading=false;return t.rewardedVideoAd.show();}).catch(function(){t.isAdLoading=false;if(t.pendingRevive){t.pendingRevive=false;t.doRevive();}});});},
  showInterstitial:function(){if(!this.interstitialAd)return;this.gameCount++;if(this.gameCount%INTERVAL!==0)return;var t=this;this.interstitialAd.show().catch(function(){t.interstitialAd.load().then(function(){t.interstitialAd.show().catch(function(){});});});},
  showBanner:function(){if(this.bannerAd&&!this.data.showHome)this.bannerAd.show().catch(function(){});},
  destroyAds:function(){['rewardedVideoAd','bannerAd','interstitialAd'].forEach(function(k){if(this[k])try{this[k].destroy();}catch(e){}},this);},

  refreshHome:function(){
    var g=this.game,stats=g?g.getStats():{},lv=g?g.getLevelProgress():0,total=g?g.getTotalStars():0;
    var maxUnlocked=Math.max(1,Math.min(30,lv+1)),nextLevel=Math.min(30,lv+1);
    var list=[];for(var i=0;i<BounceTower.LEVELS.length;i++){var l=BounceTower.LEVELS[i];var rate=0;if(g){var a=g.getStats().levelAttempts[l.id]||0;var s2=g.getLevelStars(l.id)||0;rate=a>0?Math.round(s2/a*100):(l.id<=3?95:l.id<=8?70:l.id<=15?40:l.id<=22?15:l.id<=28?5:1);}list.push({id:l.id,target:l.target,name:l.name,stars:g?g.getLevelStars(l.id):0,rate:rate});}
    var daily=g?g.getDailyChallenge():{name:'',target:0,desc:''};
    this.setData({levelProgress:lv,totalStars:total,maxUnlocked:maxUnlocked,levelList:list,nextLevel:nextLevel,dailyInfo:daily,currentSkin:g?g.getTheme():'default',slowCount:g?g.getToolCount("slow"):0,widenCount:g?g.getToolCount("widen"):0,reverseCount:g?g.getToolCount("reverse"):0,dailyPlayers:Math.floor(Math.random()*5000+1000)});
  },

  // ====== 首页按钮 ======
  onStartTap:function(){this.startLevel(this.data.nextLevel,'level');},
  onLevelPick:function(e){var id=e.currentTarget.dataset.id;if(id>this.data.maxUnlocked)return;this.startLevel(id,'level');},
  onDailyTap:function(){if(!this.game)return;var d=this.game.getDailyChallenge();this.startLevel(d.levelId,'daily');},

  startLevel:function(id,mode){
    mode=mode||'level';if(!this.game){console.error('startLevel: game is null');return;}
    var lv=BounceTower.LEVELS.find(function(l){return l.id===id;});
    if(!lv){console.error('startLevel: level not found:',id);return;}
    this.setData({showHome:false,currentMode:mode,showToolbar:true});
    this.game.setMode(mode,{levelId:lv.id,target:lv.target,speedMul:lv.speedMul});
    this._levelId=id;this.showBanner();
    this.setData({slowCount:this.game.getToolCount("slow"),widenCount:this.game.getToolCount("widen"),reverseCount:this.game.getToolCount("reverse")});
    if(this.data.bgmOn&&this.game)this.game.bgmStart();
  },

  onBackHome:function(){
    this.setData({showGameOver:false,showLevelComplete:false,showHome:true,showToolbar:false,currentMode:''});
    if(this.bannerAd)this.bannerAd.hide();
    if(this.game&&this.game.bgmStop)this.game.bgmStop();
    this.refreshHome();
  },

  onBgmToggle:function(){
    if(!this.game)return;
    var on=this.game.bgmToggle();
    this.setData({bgmOn:on});
    wx.showToast({title:on?'🔊 音乐开':'🔇 音乐关',icon:'none',duration:1000});
  },

  // ====== 道具 ======
  onToolSlow:function(){if(!this.game||this.data.slowCount<=0)return;if(this.game.useTool('slow'))this.setData({slowCount:this.game.getToolCount('slow')});},
  onToolWiden:function(){if(!this.game||this.data.widenCount<=0)return;if(this.game.useTool('widen'))this.setData({widenCount:this.game.getToolCount('widen')});},
  onToolReverse:function(){if(!this.game||this.data.reverseCount<=0)return;if(this.game.useTool("reverse"))this.setData({reverseCount:this.game.getToolCount("reverse")});},
  onUseTool:function(){this.setData({slowCount:this.game.getToolCount("slow"),widenCount:this.game.getToolCount("widen"),reverseCount:this.game.getToolCount("reverse")});},

  // ====== 通关 ======
  onLevelComplete:function(result){
    var t=this;
    if(result.mode==='level'){
      var nl=BounceTower.LEVELS.find(function(l){return l.id===result.levelId+1;});
      t.setData({showToolbar:false,showLevelComplete:true,finalScore:result.score,finalDetail:'最高 '+result.maxCombo+' 连击 · '+result.layers+' 层',levelStars:result.stars,nextLevelText:nl?'下一关: '+nl.name+' → '+nl.target+' 层':'🎉 全部通关!',isNewBest:result.wasNewBest});
    }else{
      t.setData({showToolbar:false,showLevelComplete:true,finalScore:result.score,finalDetail:'最高 '+result.maxCombo+' 连击',levelStars:result.stars,nextLevelText:'明天再来~',isNewBest:result.wasNewBest});
    }
    t.refreshHome();
  },
  onLevelNext:function(){
    var t=this;t.setData({showLevelComplete:false});
    if(t.data.currentMode==='level'){var n=t._levelId+1;if(n>30){t.onBackHome();return;}t.startLevel(n,'level');}
    else{t.onBackHome();}
  },

  // ====== 失败 ======
  onGameOver:function(score,maxCombo,layers,isNewBest,mode,levelId,levelTarget){
    this.reviveCount=0;this.setData({showToolbar:false});
    var title='游戏结束',rl='重试本关',showMiss=false,missText='';
    if(mode==='level'&&levelTarget){var r=levelTarget-score;if(r>0&&r<=10){title='只差一点!';showMiss=true;missText='离过关只差 '+r+' 层';rl='再试一次';}else{title='挑战失败';rl='再试一次';}}
    else if(mode==='daily'&&levelTarget){var rr=levelTarget-score;if(rr>0&&rr<=10){title='只差一点!';showMiss=true;missText='明天再来~';}else{title='挑战失败';}}
    this.setData({showGameOver:true,finalScore:score,finalDetail:'最高 '+maxCombo+' 连击 · '+layers+' 层',isNewBest:isNewBest,canRevive:true,gameOverTitle:title,restartLabel:rl,showNearMiss:showMiss,nearMissText:missText});
    this.showInterstitial();this.refreshHome();
  },
  onAchievement:function(a){var t=this;t.setData({showAchievement:true,achievement:a});if(t.achieveTimer)clearTimeout(t.achieveTimer);t.achieveTimer=setTimeout(function(){t.setData({showAchievement:false});},2500);},

  onReviveTap:function(){if(this.reviveCount>=RV_LIMIT){wx.showToast({title:'本局复活次数已用完',icon:'none'});return;}this.setData({showGameOver:false,showToolbar:true});this.pendingRevive=true;this.reviveCount++;this.showRV();},
  doRevive:function(){if(this.game)this.game.revive();this.setData({showGameOver:false,canRevive:this.reviveCount<RV_LIMIT,showToolbar:true});},

  onRestartTap:function(){this.setData({showGameOver:false,showToolbar:true});if(this.game)this.game.reset();},
  onShareTap:function(){
    var t=this;if(t.game){t.game.addTool("slow",1);t.game.addTool("widen",1);t.game.addTool("reverse",1);}
    t.setData({slowCount:t.game?t.game.getToolCount("slow"):0,widenCount:t.game?t.game.getToolCount("widen"):0,reverseCount:t.game?t.game.getToolCount("reverse"):0});
    wx.shareAppMessage({title:'我在弹弹塔第'+t._levelId+'关堆了'+(t.game?t.game.getScore():0)+'层！',path:'/pages/game/game'});
    wx.showToast({title:'获得 🐢慢动作 + 📏加宽!',icon:'success'});
  },

  onLeaderboardTap:function(){
    var t=this;try{wx.getFriendCloudStorage({keyList:['maxScore'],success:function(res){var list=(res.data||[]).filter(function(i){return i.KVDataList&&i.KVDataList.length>0;}).map(function(i){var kv=i.KVDataList.find(function(k){return k.key==='maxScore';});return{name:i.nickname||'匿名',avatar:i.avatarUrl||'',score:kv?parseInt(kv.value,10):0};}).sort(function(a,b){return b.score-a.score;}).slice(0,50).map(function(item,i){item.rank=i+1;return item;});t.setData({showLeaderboard:true,rankList:list});},fail:function(){t.setData({showLeaderboard:true,rankList:[{rank:1,name:'我',avatar:'',score:t.loadBest()}]});}});}catch(e){t.setData({showLeaderboard:true,rankList:[]});}},
  onLeaderboardClose:function(){this.setData({showLeaderboard:false});},

  onSkinPanelOpen:function(){var t=this,themes=BounceTower.THEMES,list=[];Object.keys(themes).forEach(function(id){var th=themes[id];list.push({id:id,name:th.name,colors:th.pals[0].slice(0,3),unlocked:t.game?t.game.isSkinUnlocked(id):id==='default',cost:th.cost});});t.setData({showSkinPanel:true,skinList:list,currentSkin:t.game?t.game.getTheme():'default'});},
  onSkinSelect:function(e){var id=e.currentTarget.dataset.id,t=this;if(t.game.isSkinUnlocked(id)){t.setTheme(id);t.setData({currentSkin:id});wx.showToast({title:'皮肤已切换',icon:'success'});}else{wx.showModal({title:'解锁皮肤',content:'看一段广告即可解锁此皮肤',success:function(res){if(res.confirm)t.showRV();}});}},
  onSkinPanelClose:function(){this.setData({showSkinPanel:false});},

  onTouchStart:function(e){
    if(this.data.showHome||this.data.showLeaderboard||this.data.showSkinPanel||this.data.showGameOver||this.data.showLevelComplete)return;
    if(this.game)this.game.handleTap();
  },
  onShareAppMessage:function(){return{title:'弹弹塔 · 你能堆多高？',path:'/pages/game/game'};},
});
