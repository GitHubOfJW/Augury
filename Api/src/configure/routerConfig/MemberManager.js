
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
  MemberController:{
    name:'会员管理相关',
    routers:{
      memberList:{
        path:'/api/v1/member/list',
        desc:'会员列表',
        method:'memberList',
        type:GET,
        selected:false,
      },
      memberAdd:{
        path:'/api/v1/member/add',
        desc:'添加会员',
        method:'memberAdd',
        type:POST,
        selected:false
      },
      memberEdit:{
        path:'/api/v1/member/edit/:id',
        desc:'编辑会员',
        method:'memberEdit',
        type:POST,
        selected:false
      },
      memberDetail:{
        path:'/api/v1/member/detail/:id',
        desc:'会员详情',
        method:'memberDetail',
        type:GET,
        selected:false
      },
      memberDelete:{
        path:'/api/v1/member/delete',
        desc:'删除会员',
        method:'memberDelete',
        type:POST,
        selected:false,
      },
    }
  },
}


// 导出
module.exports = {
  adminApi
}