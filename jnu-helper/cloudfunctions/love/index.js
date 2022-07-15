// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection("biaobai").add({   //向biaobai表中插入数据
      data: {
        _openid: wxContext.OPENID,
        createTime: db.serverDate(),
        info: event.info,
        to: event.to,
        writer: event.writer,
        sendTime: event.sendTime,
        like: 0
      }
    })
  } catch (e) {
    console.log(e)  //打印错误信息
  }
}