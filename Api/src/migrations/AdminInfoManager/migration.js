const force =  false;

const {Admin,Wechat,Device,BankCard,Bank} = require('../allModel')

Admin.hasMany(Wechat,{foreignKey:'admin_id'})
Wechat.belongsTo(Admin,{foreignKey:'admin_id'})

Wechat.belongsTo(Device,{ foreignKey:'device_id' })

BankCard.belongsTo(Wechat,{ foreignKey:'wechat_id' })
Wechat.hasMany(BankCard,{ foreignKey:'wechat_id'})

BankCard.belongsTo(Bank,{ foreignKey:'bank_id' })

const fn =  (async (callback)=>{
  await Wechat.sync({ force: force })
  await BankCard.sync({ force:force })
  callback()
})


module.exports = function(){
  return new Promise((resolove)=>{
     fn(()=>{
         resolove(true) 
     })
  })
}