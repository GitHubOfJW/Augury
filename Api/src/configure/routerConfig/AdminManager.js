
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  adminApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

// 所有的路由都配置导这里
const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'

// 调用api接口的路由
const adminApi = {
  AdminController:{
    name:'管理员相关',
    routers:{
      adminLogin:{
        path:'/api/v1/login',
        desc:'登录请求',
        method:'adminLogin',
        type:POST,
        selected:true
      },
      adminLogout:{
        path:'/api/v1/logout',
        desc:'退出请求',
        method:'adminLogout',
        type:GET,
        selected:true
      },
      adminInfo:{
        path:'/api/v1/info',
        desc:'用户信息',
        method:'adminInfo',
        type:POST,
        selected:true
      },
      adminList:{
        path:'/api/v1/admin/list',
        desc:'管理员列表请求',
        method:'adminList',
        type:GET,
        selected:false,
      },
      adminAdd:{
        path:'/api/v1/admin/add',
        desc:'添加管理员',
        method:'adminAdd',
        type:POST,
        selected:false
      },
      adminEdit:{
        path:'/api/v1/admin/edit/:id',
        desc:'添加管理员',
        method:'adminEdit',
        type:POST,
        selected:false
      },
      adminDetail:{
        path:'/api/v1/admin/detail/:id',
        desc:'管理员详情',
        method:'adminDetail',
        type:GET,
        selected:false
      },
      adminStatus:{
        path:'/api/v1/admin/status/:id',
        desc:'启用/禁用管理员',
        method:'adminUpdate',
        type:POST,
        selected:false,
      },
      adminDelete:{
        path:'/api/v1/admin/delete',
        desc:'删除管理员',
        method:'adminDelete',
        type:POST,
        selected:false,
      },
    }
  }
}


// 导出
module.exports = {
  adminApi
}