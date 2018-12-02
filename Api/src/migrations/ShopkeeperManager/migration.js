const force =  false;

const {Admin,Shopkeeper,Shop,Product,Consumer,ProductStatus,ConsumerWw} = require('../allModel')


Shop.belongsTo(Admin,{foreignKey:'admin_id'})
Shopkeeper.belongsTo(Admin,{foreignKey:'admin_id'})
Product.belongsTo(Admin,{foreignKey:'charge_id',as:'charge'})
Product.belongsTo(Admin,{foreignKey:'admin_id'})

Shop.belongsTo(Shopkeeper,{foreignKey:'shopkeeper_id'})
Shopkeeper.hasMany(Shop,{foreignKey:'shopkeeper_id'})

Product.belongsTo(Shop,{foreignKey:'shop_id'})
Shop.hasMany(Product,{foreignKey:'shop_id'})

Consumer.belongsTo(Admin,{ foreignKey: 'admin_id'})
ConsumerWw.belongsTo(Consumer,{ foreignKey: 'consumer_id'})
Consumer.hasMany(ConsumerWw,{ foreignKey: 'consumer_id' })

Product.belongsTo(ProductStatus,{foreignKey:'cooperate_status'})


const fn =  (async (callback)=>{
  await ProductStatus.sync({force: force})
  await Shopkeeper.sync ( {force:force })
  await Shop.sync ( {force:force })
  await Product.sync({force: force})
  await Consumer.sync({force: force})
  await ConsumerWw.sync({force: force})
  const {productStatusData} = require('../../meta/metadata')
  const statusCount = await ProductStatus.count()
  if( statusCount <= 0){
    await ProductStatus.bulkCreate(productStatusData)
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