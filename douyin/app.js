// 弹弹塔 - 抖音小程序入口
App({
  onLaunch() {
    const sysInfo = tt.getSystemInfoSync();
    this.globalData = {
      screenWidth: sysInfo.windowWidth,
      screenHeight: sysInfo.windowHeight,
      pixelRatio: sysInfo.pixelRatio,
      statusBarHeight: sysInfo.statusBarHeight,
      platform: sysInfo.platform
    };
  },
  globalData: {}
});
