// 引入BaseController 
const BaseController = require('./BaseController')

const moment = require('moment')

class IndexController extends BaseController {

  // 跳转到首页
  static async index(req,res){
    super.setHtmlHeader(res)
    res.render('index.html',{
      account:req.session.user
    });
  }


  // 跳转到欢迎页
  static async welcome(req,res){
    super.setHtmlHeader(res)
    res.render('welcome.html',{
      account:req.session.user,
      time:moment().format('YYYY-MM-DD HH:mm:ss')
    });
  }

  static unicode(req,res){
    super.setHtmlHeader(res)
    res.render('unicode.html');
  }
}


module.exports = IndexController