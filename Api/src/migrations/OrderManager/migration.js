const force =  false;

const {Admin,Order,Product,Consumer,OrderStatus,Gift,ConsumerWw} = require('../allModel')

Order.belongsTo(Gift,{foreignKey:'gift_id'})
Order.belongsTo(OrderStatus,{foreignKey:'status_id'})
// 登记人
Order.belongsTo(Admin,{foreignKey:'admin_id'})

Order.belongsTo(Product,{foreignKey:'product_id'})
Order.belongsTo(Consumer,{foreignKey:"consumer_id"})

Order.belongsTo(Gift,{foreignKey:'gift_id'})
Order.belongsTo(OrderStatus,{ foreignKey:'status_id'})
Order.belongsTo(ConsumerWw,{ foreignKey: 'consumerww_id'})
 
const fn =  (async (callback)=>{
  await Gift.sync({force: force})
  await OrderStatus.sync({force: force})
  await Order.sync({force: force})
  const {orderStatusData} = require('../../meta/metadata')
   
  const statusCount = await OrderStatus.count()
  if(statusCount <= 0){
    await OrderStatus.bulkCreate(orderStatusData)
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