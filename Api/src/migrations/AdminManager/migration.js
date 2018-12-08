const force =  false;


const  { Admin} = require('../allModel')

const md5 =  require('md5')

 
// 创建表
const fn =  (async (callback)=> {
  await Admin.sync({ force: force })
  const  count = await Admin.count()
  if(count <= 0){
    await Admin.bulkCreate([{
          account: 'zhujianwei',
          name: '朱建伟',
          password: md5(md5('zhujianwei')),
          mobile: '13311255165',
          email: '1284627282@qq.com',
          wechat: 'zhujianwei9823',
          wechat_name: '凡夫俗子',
          qq: '12846272822',
          qq_name: '一失足成大瘸子',
          dingding:null,
          role_id: null,
          is_admin: true,
          computer:'none',
          enable: true,
          jst_account: '13311255165',
          is_delete: false
        }])
  }
  callback()
})


module.exports = function(){
   return new Promise((resolove)=>{
      fn(()=>{
          resolove(true) 
      })
   })
}
