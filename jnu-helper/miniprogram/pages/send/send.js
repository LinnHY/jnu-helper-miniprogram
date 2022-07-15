const app = getApp()
var util = require('../util/util.js');
const db = wx.cloud.database(); //初始化数据库
Page({
  //页面的初始数据
  data: {
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
  },
  onLoad: function(options) {
    this.setData({
      type: options.name      //lostlost/lostfound/xianzhi/work
    })
    console.log(this.data.type)
    //设置页面title
    if (this.data.type == 'lostlost' || this.data.type == 'lostfound') {
      wx.setNavigationBarTitle({
        title: '失物招领'
      })
    } else if(this.data.type == 'xianzhi'){
      wx.setNavigationBarTitle({
        title: '闲置发布'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '兼职发布'
      })
    }
    var that = this    //暂存this
    wx.getStorage({    //根据key值获取对应res
      key: 'userInfo',
      success: function(res) {
        that.setData({
          user: res.data
        })
      },
    })
  },
  //输入信息
  //输入人名
  pName(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      pName: event.detail.value
    })
  },
  //输入电话
  pCall(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      pCall: event.detail.value
    })
  },
  //输入微信号
  pWechat(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      pWechat: event.detail.value
    })
  },
  //输入物品名
  name(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      name: event.detail.value
    })
  },
  //输入价值
  price(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      price: event.detail.value
    })
  },
 //输入地点
 location(event) {
  console.log("输入的对象", event.detail.value)
  this.setData({
    location: event.detail.value
  })
},
  //输入详细说明
  info(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      info: event.detail.value
    })
  },
  // 删除照片
  imgDelete1: function(e) {
    //let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    this.setData({
      imgbox: imgbox
    });
  },
  // 选择图片
  addPic1: function(e) {
    var imgbox = this.data.imgbox;
    var that = this;
    var n = 5;
    wx.chooseImage({
      count: n, // 最多设置图片张数
      sizeType: ['original', 'compressed'], // 指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性
        var tempFilePaths = res.tempFilePaths  //图片的本地临时文件路径列表 (本地路径)	
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (imgbox.length < 5) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },
  //发布按钮
  fb: function(e) {
    if (this.data.type == 'lostlost') {
      var room = 'lost'
    } else if (this.data.type == 'lostfound') {
      var room = 'found'
    } else if (this.data.type == 'xianzhi'){
      var room = 'xianzhi'
    }else{
      var room = 'jianzhi'
    }
    console.log(room)
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
          var that = this
          //获取全局唯一的文件管理器并异步读取图片
          const fileContent = wx.getFileSystemManager().readFileSync(item, 'base64');
          wx.cloud.callFunction({    //调用img云函数
            name: 'img',
            data: {
              fileContent: fileContent,
              cloudPath: new Date().getTime() + suffix // 使用随机文件名
            },
            success: function(res) {
              that.setData({
                fileIDs: that.data.fileIDs.concat(res.result.fileID) //拼接返回的fileid
              });
              console.log(res.result.fileID) //输出上传后图片的返回地址
              reslove();
              wx.showToast({
                title: "上传成功",
              })
            },
            fail: function(error) {
              console.log(error)
              // wx.hideLoading();
              wx.showToast({
                icon: 'none',
                title: "上传失败",
              })
            }
          })
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        //调用云函数send 将数据存储至对应数据库 完成发布
        wx.cloud.callFunction({
          name: 'send',
          data: {
            room,
            fileIDs: this.data.fileIDs,
            sendTime: util.formatTime(new Date()),
            pName: this.data.pName,
            pCall: this.data.pCall,
            pWechat: this.data.pWechat,
            name: this.data.name,
            price: this.data.price,
            info: this.data.info,
            images: this.data.imgbox,
            touxiang: this.data.user.avatarUrl,
            userName: this.data.user.nickName,
            location: this.data.location
          },
          success: res => {
            // wx.hideLoading()
            wx.showToast({
              title: '发布成功',
            })
            console.log('发布成功', res)
            wx.navigateBack({
            })
          },
          fail: err => {
            // wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '网络不给力....'
            })
            console.error('发布失败', err)
          }
        })
      })

    }
  },

})