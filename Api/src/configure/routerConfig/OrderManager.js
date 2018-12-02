
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
  GiftController:{
    name:'礼品管理相关',
    routers:{
      giftList:{
        path:'/api/v1/gift/list',
        desc:'礼品列表',
        method:'giftList',
        type:GET,
        selected:false,
      },
      giftAdd:{
        path:'/api/v1/gift/add',
        desc:'添加礼品',
        method:'giftAdd',
        type:POST,
        selected:false
      },
      giftEdit:{
        path:'/api/v1/gift/edit/:id',
        desc:'修改礼品',
        method:'giftEdit',
        type:POST,
        selected:false
      },
      giftDelete:{
        path:'/api/v1/gift/delete',
        desc:'删除礼品',
        method:'giftDelete',
        type:POST,
        selected:false,
      },
      giftDetail:{
        path:'/api/v1/gift/detail/:id',
        desc:'礼品详情',
        method:'giftDetail',
        type:GET,
        selected:false
      },
    }
  },
  OrderController:{
    name:'订单管理相关',
    routers:{
      orderList:{
        path:'/api/v1/order/list',
        desc:'订单列表',
        method:'orderList',
        type:GET,
        selected:false,
      },
      orderAdd:{
        path:'/api/v1/order/add',
        desc:'添加订单',
        method:'orderAdd',
        type:POST,
        selected:false
      },
      orderEdit:{
        path:'/api/v1/order/edit/:id',
        desc:'编辑订单',
        method:'orderEdit',
        type:POST,
        selected:false
      },
      orderDetail:{
        path:'/api/v1/order/detail/:id',
        desc:'订单详情',
        method:'orderDetail',
        type:GET,
        selected:false
      },
      orderAlreadyPay:{
        path:'/api/v1/order/alreadyPay/:id',
        desc:'订单已支付',
        method:'orderAlreadyPay',
        type:POST,
        selected:true
      },
      orderWaitBack:{
        path:'/api/v1/order/waitBack/:id',
        desc:'订单待返款',
        method:'orderWaitBack',
        type:POST,
        selected:true
      },
      alreadyBack:{
        path:'/api/v1/order/alreadyBack/:id',
        desc:'订单待返款',
        method:'alreadyBack',
        type:POST,
        selected:true
      },
      alreadyFinish:{
        path:'/api/v1/order/alreadyFinish/:id',
        desc:'订单已完成',
        method:'alreadyFinish',
        type:POST,
        selected:true
      },
      orderDelete:{
        path:'/api/v1/order/delete',
        desc:'删除订单',
        method:'orderDelete',
        type:POST,
        selected:false,
      },
      statusList:{
        path:'/api/v1/order/orderStatus',
        desc:'礼品列表',
        method:'statusList',
        type:GET,
        selected:true,
      }
    }
  },
}


// 导出
module.exports = {
  adminApi
}