// 引入BaseController 
const BaseController = require('./BaseController')

const { Consumer,Shopkeeper,Product,Shop,Order,Admin }  = require('../migrations/allModel')
const moment = require('moment')

class IndexController extends BaseController {

  // 跳转到首页
  static async index(req,res){
    super.setHtmlHeader(res)
    res.render('index.html',{
      account:req.session.user
    });
  }


   //管理管理员列表请求
   static async welcome(req,res){
    const memberCount = await Consumer.count()
    const shopkeeperCount = await Shopkeeper.count()
    const productCount = await Product.count()
    const shopCount = await Shop.count()
    const orderCount =  await Order.count()
    const adminCount = await Admin.count()

    res.json(super.handlerResponseData(0,'成功',{
      list:[
        {
          name:'会员数',
          count:memberCount
        },
        {
          name:'客户数',
          count:shopkeeperCount
        },
        {
          name:'商品数',
          count:productCount
        },
        {
          name:'店铺数',
          count:shopCount
        },
        {
          name:'订单数',
          count:orderCount
        },
        {
          name:'管理员数',
          count:adminCount
        }
    ]
    }))
  }

  static unicode(req,res){
    super.setHtmlHeader(res)
    res.render('unicode.html');
  }
}


module.exports = IndexController