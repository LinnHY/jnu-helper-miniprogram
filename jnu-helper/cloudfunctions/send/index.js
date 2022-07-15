// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()   //在云函数中获取微信调用上下文
  try {
    //room对应着发布消息的内容属于哪个板块 xianzhi/lost/found 相对应的表中插入数据
    return await db.collection(event.room).add({ 
      data: {
        _openid: wxContext.OPENID,    //用户的唯一标识
        fileIDs: event.fileIDs,
        createTime: db.serverDate(),   //serverDate方法返回当前时间
        sendTime: event.sendTime,
        pName: event.pName,
        pCall: event.pCall,
        pWechat: event.pWechat,
        name: event.name,
        price: event.price,
        info: event.info,
        images: event.imgbox,
        touxiang: event.touxiang,
        userName: event.userName,
        location: event.location
      }
    })
  } catch (e) {
    console.log(e)     //打印错误信息
  }

}