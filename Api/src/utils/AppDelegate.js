

const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const express = require('express');
const path =  require('path');
const template = require('art-template')

const { adminApi } = require('../configure/routerConfig')

const  { corsOrigin,isCors } = require('../configure/config')

class AppDelegate {

  constructor(){
    this.host = '';
    this.port = '';
  }

  // 初始化
  configApp(app){ 

      // 静态资源文件
      const options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['css', 'js'],
        index: false,
        maxAge: '1d',
        redirect: false,
        setHeaders: function (res, path, stat) {
          res.set('x-timestamp', Date.now())
        }
      }
      app.use('/public',express.static('public', options)) 

      // promoise
      app.use(require('express-promise')());
   
      // parse application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: false }))
      // parse application/json
      app.use(bodyParser.json())

      // 设置cookieparser
      app.use(cookieParser());
      // 设置method-override
      app.use(methodOverride('X-HTTP-Method')) //          Microsoft
      app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
      app.use(methodOverride('X-Method-Override')) //      IBM

      // 设置session
      const session = require('express-session')
      const MysqlStore =  require('express-mysql-session')(session);
      const { sessionDbConfig } = require('../configure/config')
      const sessionStore =  new MysqlStore(sessionDbConfig)
      app.use(session({
        key: 'session_cookie_name',
        secret: 'qcsdgj',
        store: sessionStore,
        resave: false,
        saveUninitialized: true
      }));

 
      // 设置返回编码
      app.use((req,res,next)=>{
        res.setHeader('content-type',"application/json");
        // res.setHeader('charset','utf-8');
        if(isCors){
          //设置允许跨域的域名，*代表允许任意域名跨域
          res.setHeader("Access-Control-Allow-Origin",corsOrigin);
          //允许的header类型
          // res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
          //跨域允许的请求方式 
          // res.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
          res.setHeader("Access-Control-Allow-Credentials",true)

          if (req.method.toLowerCase() == 'options'){
              res.send(200);  //让options尝试请求快速结束
          }else{
              next();
          }
        }else{
          next()
        }
      });

      // 授权问题
      app.use((req,res,next)=>{
        // 如果是未登录跳到登录
        const exclude = [
          adminApi.AdminController.routers.adminLogin.path
        ]

        let routerPath =  req.originalUrl;
        if(!req.session.user && !exclude.some(path => path === routerPath)){
            res.json({
                code:1,
                message:'当前账号异常，请刷新页面后再试',
                msg:'当前账号异常，请刷新页面后再试',
                isLogout:true
             });
        }else{
            next();
        }
     });

  }

  // 异常处理
  errorHander(app){
    app.use(function(error,req,res,next){
      res.end(JSON.stringify({code:1,message:"服务器开小差了",msg:'服务器开小差了'}))
      console.log(error)
    })
  }
 
  
}

module.exports = new AppDelegate();