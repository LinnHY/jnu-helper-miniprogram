Page({
  data: {

  },

  onLoad: function(options) {
    this.setData({
      type:options.name
    })
    if (this.data.type == 'work') {
      wx.setNavigationBarTitle({ title: '兼职' })
    } else {
      wx.setNavigationBarTitle({ title: '闲置物品' })
    } 
    var that = this
    wx.getStorage({
      key: 'info',
      success: function(res) {
        that.setData({
          item: res.data
        })
        
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
    let imgData = e.currentTarget.dataset.img;
    wx.previewImage({
      //当前显示图片
      current: imgData,
      //所有图片
      urls: this.data.item.fileIDs
    })
  },
  onUnload: function() {
    wx.removeStorage({
      key: 'info',
      success: function(res) {},
    })
  }
})