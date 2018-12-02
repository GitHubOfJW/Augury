
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
  WechatController:{
    name:'微信相关',
    routers:{
      wechatList:{
        path:'/api/v1/wechat/list',
        desc:'微信列表',
        method:'wechatList',
        type:GET,
        selected:false,
      },
      wechatAdd:{
        path:'/api/v1/wechat/add',
        desc:'添加微信',
        method:'wechatAdd',
        type:POST,
        selected:false
      },
      wechatEdit:{
        path:'/api/v1/wechat/edit/:id',
        desc:'修改微信',
        method:'wechatEdit',
        type:POST,
        selected:false
      },
      wechatDelete:{
        path:'/api/v1/wechat/delete',
        desc:'删除微信',
        method:'wechatDelete',
        type:POST,
        selected:false,
      },
      wechatDetail:{
        path:'/api/v1/wechat/detail/:id',
        desc:'微信详情',
        method:'wechatDetail',
        type:GET,
        selected:false
      },
    }
  },
  BankCardController:{
    name:'银行卡相关',
    routers:{
      bankCardList:{
        path:'/api/v1/bankCard/list',
        desc:'银行卡列表',
        method:'bankCardList',
        type:GET,
        selected:false,
      },
      bankCardAdd:{
        path:'/api/v1/bankCard/add',
        desc:'添加银行卡',
        method:'bankCardAdd',
        type:POST,
        selected:false
      },
      bankCardEdit:{
        path:'/api/v1/bankCard/edit/:id',
        desc:'修改银行卡',
        method:'bankCardEdit',
        type:POST,
        selected:false
      },
      bankCardDelete:{
        path:'/api/v1/bankCard/delete',
        desc:'删除银行卡',
        method:'bankCardDelete',
        type:POST,
        selected:false,
      },
      bankCardDetail:{
        path:'/api/v1/bankCard/detail/:id',
        desc:'银行卡详情',
        method:'bankCardDetail',
        type:GET,
        selected:false
      },
      bankList:{
        path:'/api/v1/bank/list',
        desc:'银行列表',
        method:'bankList',
        type:GET,
        selected:true
      }
    }
  }
}


// 导出
module.exports = {
  adminApi
}