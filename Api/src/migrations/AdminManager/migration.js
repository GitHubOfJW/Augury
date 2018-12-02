const force =  false;


const  { Admin,Auth,AuthCate,Role,AuthRoleRel,Device,Bank} = require('../allModel')

const md5 =  require('md5')

// 管理关系
Admin.belongsTo(Role,{foreignKey:"role_id"})
Auth.hasOne(AuthRoleRel,{foreignKey:'auth_id'})
Role.hasMany(AuthRoleRel,{foreignKey:"role_id"})

Auth.belongsTo(AuthCate,{foreignKey:"cate_id"});
AuthCate.hasMany(Auth,{foreignKey:'cate_id'})

// 重复添加外键
AuthRoleRel.belongsTo(Auth,{ foreignKey:'auth_id' })

const {bankList} = require('../../meta/metadata')

// 创建表
const fn =  (async (callback)=> {
  await Bank.sync({ force: force })
  const bankCount = await Bank.count()
  if(bankCount <= 0){
      const bankData = [];
      for(let bankKey of Object.keys(bankList)){
         bankData.push({
           bank_code:bankKey,
           name:bankList[bankKey]
         })
      }
      Bank.bulkCreate(bankData)
  }
  await Device.sync({ force:force })
  await AuthCate.sync({ force:force })
  await Role.sync({ force:force })
  await Auth.sync({ force:force })
  await AuthRoleRel.sync({ force:force })
  await Admin.sync({ force: force })
  const  count = await Admin.count()
  if(count <= 0){
    await Admin.bulkCreate([{
          account: 'admin',
          name: '王亚青',
          password:md5(md5('wangyaqing')),
          mobile: '18905241511',
          email: null,
          wechat: 'mxyxscz',
          wechat_name: '王帅哥',
          qq: '1234567890',
          qq_name: '王帅哥',
          dingding:null,
          role_id: null,
          is_admin: true,
          computer:'none',
          enable: true,
          jst_account: '18905241511',
          is_delete: false
        },{
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
          is_admin: false,
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
