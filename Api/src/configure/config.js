const isLocal = true // true 本地开发
const isPro = false  // false 测试环境开发 true 上线

const local = {
  isPro:isPro,
  domain:'http://localhost:3000',
  corsOrigin:'http://localhost',
  isCors:true,
  dbConfig:{
    database:'augury',
    dialect:'mysql',
    host:'localhost',
    username:'root',
    password:'zhu45683968',
    port:3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  },
  sessionDbConfig:{
    database:'augury',
    host:'localhost',
    port:3306,
    user:'root',
    password:'zhu45683968',
    clearExpired:true,
    checkExpirationInterval:3600000,//1小时
    expiration: 86400000,//24小时
  }
}

const dev = {
  isPro:isPro,
  domain:'http://testapi.qcgongju.com',
  corsOrigin:'http://test.qcgongju.com',
  isCors:true,
  dbConfig:{
    database:'augury',
    dialect:'mysql',
    host:'118.25.150.166',
    username:'root',
    password:'xcrW02hLGu8yE97B',
    port:3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  },
  sessionDbConfig:{
    database:'augury',
    host:'118.25.150.166',
    port:3306,
    user:'root',
    password:'xcrW02hLGu8yE97B',
    clearExpired:true,
    checkExpirationInterval:3600000,//1小时
    expiration: 86400000,//24小时
  }
}

const dist = {
  isPro:isPro,
  domain:'http://api.qcgongju.com',
  corsOrigin:'http://www.qcgongju.com',
  isCors:true,
  dbConfig:{
    database:'qc_sdgj',
    dialect:'mysql',
    host:'122.152.204.72',
    username:'root',
    password:'4NZit9bV17wk4eMw',
    port:3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  },
  sessionDbConfig:{
    database:'qc_sdgj',
    host:'122.152.204.72',
    port:3306,
    user:'root',
    password:'4NZit9bV17wk4eMw',
    clearExpired:true,
    checkExpirationInterval:3600000,//1小时
    expiration: 86400000,//24小时
  }
}

if(isPro){
  if(isLocal){
    module.exports = local
  }else{
    module.exports = dist
  }
    
}else{
  if(isLocal){
    module.exports = local
  }else{
    module.exports = dev
  }
}