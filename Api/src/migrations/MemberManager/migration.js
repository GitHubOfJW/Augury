const force =  false;

const {Admin,Member} = require('../allModel')

Member.belongsTo(Admin,{ foreignKey: 'admin_id'})

const fn =  (async (callback)=>{
  await Member.sync({force: force})
  callback()
})


module.exports = function(){
  return new Promise((resolove)=>{
     fn(()=>{
         resolove(true) 
     })
  })
}