
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
  OthersController:{
    name:'其他',
    routers:{
      welcome:{
        path:'/api/v1/welcome/list',
        desc:'订单列表',
        method:'welcome',
        type:GET,
        selected:true,
      },
      export:{
        path:'/api/v1/excel/export',
        desc:'导出功能',
        method:'excelExport',
        type:GET,
        selected:true
      }
    }
  },
  DeviceController:{
    name:'设备管理相关',
    routers:{
      deviceList:{
        path:'/api/v1/device/list',
        desc:'订单设备',
        method:'deviceList',
        type:GET,
        selected:false,
      },
      deviceAdd:{
        path:'/api/v1/device/add',
        desc:'添加设备',
        method:'deviceAdd',
        type:POST,
        selected:false
      },
      deviceEdit:{
        path:'/api/v1/device/edit/:id',
        desc:'修改设备',
        method:'deviceEdit',
        type:POST,
        selected:false
      },
      deviceDelete:{
        path:'/api/v1/device/delete',
        desc:'删除设备',
        method:'deviceDelete',
        type:POST,
        selected:false,
      },
      deviceDetail:{
        path:'/api/v1/device/detail/:id',
        desc:'设备详情',
        method:'deviceDetail',
        type:GET,
        selected:false
      },
    }
  },
}


// 导出
module.exports = {
  adminApi
}