// 弹弹塔 - 微信小程序入口
App({
  onLaunch() {
    // 获取系统信息
    const sysInfo = wx.getSystemInfoSync();
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
