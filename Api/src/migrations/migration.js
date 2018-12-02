


const admin = require('./AdminManager/migration')
const adminInfo = require('./AdminInfoManager/migration')
const shop = require('./ShopkeeperManager/migration')
const order = require('./OrderManager/migration')

const calendar = require('./CalendarManager/migration')
 
// 同步数据表 异步执行
;(async ()=>{
  await admin()
  await adminInfo()
  await shop()
  await order()
  await calendar()
})()

module.exports = require('./allModel')