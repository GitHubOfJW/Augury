
const { sequelize, Sequelize } = require('../utils/SequelizeInit')

module.exports = {
  // 元数据
  Bank: require('./MetaManager/Bank'),
  Gift: require('./MetaManager/Gift'),
  Device: require('./MetaManager/Device'),
  OrderStatus: require('./MetaManager/OrderStatus'),
  ProductStatus: require('./MetaManager/ProductStatus'),
  // 权限管理
  Admin :  require('./AdminManager/Admin'),
  Auth : require('./AdminManager/Auth'),
  AuthCate : require('./AdminManager/AuthCate'),
  Role :  require('./AdminManager/Role'),
  AuthRoleRel :  require('./AdminManager/AuthRoleRel'),
  
  Wechat: require('./AdminInfoManager/Wechat'),
  BankCard: require('./AdminInfoManager/BankCard'),

  // 商店/商品模块
  Shopkeeper : require('./ShopkeeperManager/Shopkeeper'),
  Shop : require('./ShopkeeperManager/Shop'),
  Product: require('./ShopkeeperManager/Product'),
  Consumer: require('./ShopkeeperManager/Consumer'),
  ConsumerWw : require('./ShopkeeperManager/ConsumerWw'),

  // 订单模块
  Order: require('./OrderManager/Order'),

  // 天干地支
  TianGan: require('./CalendarManager/TianGan'),
  DiZhi: require('./CalendarManager/DiZhi'),
  GanZhi: require('./CalendarManager/GanZhi'),
 
  // sequelize
  sequelize,
  Sequelize
}