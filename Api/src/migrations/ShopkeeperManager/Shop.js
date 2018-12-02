
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Shop = sequelize.define('shop', {
  wangwang: { 
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '旺旺名'
  },
  mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '手机号'
  },
  sub_account: {
    type:Sequelize.STRING(40),
    allowNull: true,
    comment: '子账号'
  },
  password: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '密码'
  },
  remark: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue:0,
    comment: '备注'
  },
  shopkeeper_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '店家联系人编号'
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

module.exports =  Shop