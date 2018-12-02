
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Product = sequelize.define('product', {
  product_id: { 
    type: Sequelize.STRING(50),
    allowNull: false,
    comment: '商品编号'
  },
  name: { 
    type: Sequelize.STRING(50),
    allowNull: false,
    comment: '商品名称'
  },
  origin_price: {
    type: Sequelize.DECIMAL(8,2),
    allowNull: false,
    defaultValue:0,
    comment: '商品原价'
  },
  price: {
    type: Sequelize.DECIMAL(8,2),
    allowNull: false,
    defaultValue:0,
    comment: '商品价格'
  },
  commission: {
    type:Sequelize.DECIMAL(8,2),
    allowNull: false,
    defaultValue:0,
    comment: '佣金'
  },
  service_price: {
    type:Sequelize.DECIMAL(8,2),
    allowNull: false,
    comment: '服务费用'
  },
  charge_id: {
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '放单负责人'
  },
  shop_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '店铺编号'
  },
  admin_id: {
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '登记人'
  },
  cooperate_status: {
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '合作状态'
  },
  remark: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue:0,
    comment: '备注'
  },
  ysd_orders: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:0,
    comment: '昨天的单量'
  },
  today_orders: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:0,
    comment: '今天的单量'
  },
  is_delete: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '删除'
  }
},{
  getterMethods:{
    createdTime(){
      const time =  this.getDataValue('createdAt');
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
    updatedTime(){
      const time =  this.getDataValue('updatedAt');
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
})

module.exports =  Product