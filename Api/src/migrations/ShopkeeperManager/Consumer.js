
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
// 会员
const Consumer = sequelize.define('consumer', {
  num_id: { 
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '会员编号'
  },
  name: { 
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '真实姓名'
  },
  mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '手机号'
  },
  address:{
    type: Sequelize.STRING(300),
    allowNull: true,
    comment: '所在地'
  },
  ip_adress:{
    type: Sequelize.STRING(50),
    allowNull: true,
    comment: 'ip地址'
  },
  wechat: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '微信号'
  },
  gender: {
    type:Sequelize.ENUM,
    values:['1','2','0'],
    allowNull: false,
    defaultValue:'2',
    comment: '0 女 1 男  2 未知'
  },
  wechat_mobile_match:{
    type:Sequelize.ENUM,
    values:['1','2','0'],
    allowNull: false,
    defaultValue:'2',
    comment: '1 是  0 否  2 未知'
  },
  recommand:{
    type:Sequelize.STRING(100),
    allowNull: false,
  },
  taobao_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '淘宝账号id，用于关联验号系统'
  },
  credit_price: {
    type: Sequelize.DECIMAL(8,2),
    allowNull: false,
    defaultValue:0,
    comment: '信用额度'
  },
  break_rules: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:0,
    comment: '违规次数'
  },
  remark: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue:0,
    comment: '备注'
  },
  is_black: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '黑名单'
  },
  admin_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '登记人'
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

module.exports =  Consumer