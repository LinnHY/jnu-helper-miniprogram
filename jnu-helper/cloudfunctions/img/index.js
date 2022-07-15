// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await cloud.uploadFile({
      fileContent: new Buffer(event.fileContent, 'base64'),//要上传文件的内容
      cloudPath: event.cloudPath  //云存储路径
    })
  } catch (e) {
    return e
  }
}