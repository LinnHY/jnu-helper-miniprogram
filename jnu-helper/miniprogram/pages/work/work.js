const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        })
      },
    })
    db.collection('jianzhi')
      .orderBy('createTime', 'desc') //按发布时间排序
      .get({
        success(res) {
          console.log("请求成功", res.data[0])
          that.setData({
            dataList: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },
  go: function(event) {
    var info = event.currentTarget.dataset.id
    wx.setStorage({
      key: 'info',
      data: info,
    })
    wx.navigateTo({
      url: '../temp/temp?name=work',
    })
  },
  send: function() {
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (res.data) {
          wx.navigateTo({
            url: '../send/send?name=work',
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '你还未登录'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    })
  },
  delete: function(e) {
    var info = e.currentTarget.dataset.t
    console.log(info)
    db.collection('jianzhi').doc(info._id).remove({
      success: function(res) {
        console.log(res.data)
        wx.showToast({
          icon: 'success',
          title: '删除成功',
        })
      }
    })
    this.onLoad()
  },
})