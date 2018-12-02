const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Admin = sequelize.define('admins', {
  account: { 
    type: Sequelize.STRING(30),
    allowNull: false,
    comment: '账户名'
  },
  name: {
    type: Sequelize.STRING(15),
    allowNull: false,
    comment: '真实姓名'
  },
  password: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '密码'
  },
  mobile: {
    type: Sequelize.STRING(11),
    allowNull: true,
    comment: '手机号'
  },
  email: {
    type:Sequelize.STRING(40),
    allowNull: true,
    comment: '邮箱'
  },
  qq: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: 'qq号'
  },
  qq_name: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: 'qq昵称'
  },
  dingding: {
    type:Sequelize.STRING(40),
    allowNull: true,
    comment: '钉钉'
  },
  computer: {
    type:Sequelize.STRING(30),
    allowNull: false,
    comment: '使用电脑'
  },
  jst_account: {
    type:Sequelize.STRING(40),
    allowNull: false,
    comment: '聚水潭账号'
  },
  role_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '角色编号'
  },
  is_admin: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:false,
    comment: '超级管理员'
  },
  enable: {
    type:Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '启用/禁用'
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

module.exports =  Admin