
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Order = sequelize.define('order', {
  order_id: { 
    type: Sequelize.STRING(50),
    allowNull: false,
    comment: '订单编号'
  },
  last_price: {
    type: Sequelize.DECIMAL(8,2),
    allowNull: false,
    comment: '商品的成交价格'
  },
  member_commission: {
    type:Sequelize.DECIMAL(8,2),
    allowNull: false,
    comment: '会员佣金'
  },
  refundTime:{
    type:Sequelize.DATE,
    allowNull:true,
    comment:'返款日期'
  },
  gift_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '礼品编号'
  },
  status_id: {
    type:Sequelize.INTEGER,
    allowNull: false,
    defaultValue:1,
    comment: '订单状态'
  },
  status_check: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '订单状态审核'
  },
  apit_time: {
    type:Sequelize.DATE,
    allowNull: true,
    comment: '预约时间'
  },
  break_rule: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:0,
    comment: '是否违规'
  },
  remark: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue:0,
    comment: '备注'
  },
  product_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '商品编号'
  },
  consumer_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '会员编号'
  },
  consumerww_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '旺旺编号'
  },
  admin_id: {
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '登记人'
  },
  address:{
    type: Sequelize.STRING(300),
    allowNull: true,
    comment: '所在地'
  },
  order_ip:{
    type: Sequelize.STRING(50),
    allowNull: true,
    comment: '做单ip'
  },
  ip_adress:{
    type: Sequelize.STRING(50),
    allowNull: true,
    comment: 'ip地址'
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
    },
    refundTime(){
      const time =  this.getDataValue('refundTime');
      if(!time){
        return time
      }
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
    apit_time(){
      const time =  this.getDataValue('apit_time');
      if(!time){
        return time
      }
      return  moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
    createdDate(){
      const time =  this.getDataValue('createdAt');
      return  moment(time).format('YYYY-MM-DD');
    }
  },
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
})

module.exports =  Order