
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  adminApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'


const adminManager = require('./routerConfig/AdminManager')
const adminInfoManager = require('./routerConfig/AdminInfoManager')
const uploadManager = require('./routerConfig/UploadManager')
const shopkeeperManager = require('./routerConfig/ShopKeeperManager')
const orderManager = require('./routerConfig/OrderManager')
const othersManager =  require('./routerConfig/OthersManager')

// 导出
module.exports = {
  adminApi:{
    ...othersManager.adminApi,
    ...adminManager.adminApi,
    ...adminInfoManager.adminApi,
    ...uploadManager.adminApi,
    ...shopkeeperManager.adminApi,
    ...orderManager.adminApi,
  },
  requestType:{
    POST,
    PATCH,
    DELETE,
    GET
  }
}