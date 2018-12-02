
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const { domain } = require('../../configure/config')

const Wechat = sequelize.define('wechat', {
  wechat_id: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: '微信编号'
  },
  wechat: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: '微信号'
  },
  password: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '密码'
  },
  pay_password: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '支付密码'
  },
  wechat_name: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '微信昵称'
  },
  real_name: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '实名制姓名'
  },
  device_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '设备编号'
  },
  admin_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    comment: '管理员编号'
  },
  mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '绑定手机号'
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

module.exports =  Wechat