


const admin = require('./AdminManager/migration')

const member = require('./MemberManager/migration')


const calendar = require('./CalendarManager/migration')
 
// 同步数据表 异步执行
;(async ()=>{
  await admin()
  await member()
  // await calendar()
})()

module.exports = require('./allModel')