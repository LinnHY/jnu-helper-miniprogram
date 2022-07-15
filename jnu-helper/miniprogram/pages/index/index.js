Page({

  data: {
    
  },
  biaobai: function() {
    wx.navigateTo({
      url: '../biaobai/biaobai',
    })
  },
  lost: function() {
    wx.navigateTo({
      url: '../lost/lost',
    })
  },
  work: function() {
    wx.navigateTo({
      url: '../work/work',
    })
  },
  xianzhi: function() {
    wx.navigateTo({
      url: '../xianzhi/xianzhi',
    })
  }
})