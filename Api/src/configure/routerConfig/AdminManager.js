
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
      // adminRemove:{
      //   path:'/api/v1/admin/remove',
      //   desc:'彻底删除管理员',
      //   method:'adminRemove',
      //   type:POST,
      //   selected:false
      // },
    }
  },
  CateController:{
    name:'权限分类相关',
    routers:{
      cateList:{
        path:'/api/v1/cate/list',
        desc:'权限分类列表',
        method:'cateList',
        type:GET,
        selected:false,
      },
      cateAuthAll:{
        path:'/api/v1/cate/allList',
        desc:'全部分类',
        method:'cateAllList',
        type:GET,
        selected:true,
      },
      cateAdd:{
        path:'/api/v1/cate/add',
        desc:'添加权限分类',
        method:'cateAdd',
        type:POST,
        selected:false
      },
      cateEdit:{
        path:'/api/v1/cate/edit/:id',
        desc:'修改权限分类',
        method:'cateUpdate',
        type:POST,
        selected:false
      },
      // cateDelete:{
      //   path:'/api/v1/cate/delete',
      //   desc:'删除权限分类',
      //   method:'cateDelete',
      //   type:POST,
      //   selected:false,
      // },
      cateRemove:{
        path:'/api/v1/cate/remove',
        desc:'彻底删除权限分类',
        method:'cateRemove',
        type:POST,
        selected:false
      },
    }
  },
  AuthController:{
    name:'权限规则相关',
    routers:{
      authAdd:{
        path:'/api/v1/auth/add',
        desc:'添加权限规则',
        method:'authAdd',
        type:POST,
        selected:false
      },
      authList:{
        path:'/api/v1/auth/list',
        desc:'权限列表',
        method:'authList',
        type:GET,
        selected:false
      },
      authConfigs:{
        path:'/api/v1/auth/configs',
        desc:'权限路由配置',
        method:'authConfigList',
        type:GET,
        selected:true
      },
      authEdit:{
        path:'/api/v1/auth/edit/:id',
        desc:'修改权限',
        method:'authEdit',
        type:POST,
        selected:false
      },
      authDetail:{
        path:'/api/v1/auth/detail/:id',
        desc:'权限详情',
        method:'authDetail',
        type:GET,
        selected:false
      },
      // authDelete:{
      //   path:'/api/v1/auth/delete',
      //   desc:'删除管理员',
      //   method:'authDelete',
      //   type:POST,
      //   selected:false
      // },
      authRemove:{
        path:'/api/v1/auth/remove',
        desc:'彻底删除权限',
        method:'authRemove',
        type:POST,
        selected:false
      },
    }
  },
  RoleController:{
    name:'角色管理相关',
    routers:{
      roleList:{
        path:'/api/v1/role/list',
        desc:'角色列表',
        method:'roleList',
        type:GET,
        selected:false
      }, 
      roleAll:{
        path:'/api/v1/roleAll/list',
        desc:'全部角色',
        method:'roleAllList',
        type:GET,
        selected:true,
      },
      roleAdd:{
        path:'/api/v1/role/add',
        desc:'角色添加',
        method:'roleAdd',
        type:POST,
        selected:false
      },
      roleEdit:{
        path:'/api/v1/role/edit/:id',
        desc:'修改角色',
        method:'roleEdit',
        type:POST,
        selected:false
      },
      roleDetail:{
        path:'/api/v1/role/detail/:id',
        desc:'角色详情',
        method:'roleDetail',
        type:GET,
        selected:true
      },
      roleStatus:{
        path:'/api/v1/role/status/:id',
        desc:'启用/禁用角色',
        method:'roleUpate',
        type:POST,
        selected:false,
      },
      roleDelete:{
        path:'/api/v1/role/delete',
        desc:'删除管理员',
        method:'roleDelete',
        type:POST,
        selected:false
      },
      // roleRemove:{
      //   path:'/api/v1/role/remove',
      //   desc:'彻底删除角色',
      //   method:'roleRemove',
      //   type:POST,
      //   selected:false
      // },
    }
  }
}


// 导出
module.exports = {
  adminApi
}