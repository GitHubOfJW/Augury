
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const { domain } = require('../../configure/config')

const BankCard = sequelize.define('bank_card', {
  card_num: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: '银行卡号'
  },
  real_name: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '实名制姓名'
  },
  abv_account: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '网银登录账号'
  },
  abv_password: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '网银登录账号'
  },
  abv_link: {
    type:Sequelize.STRING(300),
    allowNull: false,
    comment: '网银登录网址'
  },
  bank_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '银行编号'
  },
  wechat_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '微信编号'
  },
  bank_mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '银行预留手机'
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

module.exports =  BankCard