
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const ShopKeeper = sequelize.define('shopkeeper', {
  name: { 
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '负责人姓名'
  },
  mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '负责人手机号'
  },
  wechat: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: '微信号'
  },
  qq: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: 'qq号'
  },
  admin_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '登记人'
  },
  remark: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue:0,
    comment: '备注'
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

module.exports =  ShopKeeper