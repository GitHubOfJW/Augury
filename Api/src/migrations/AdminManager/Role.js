const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Role = sequelize.define('roles', {
  name: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '角色名称'
  },
  remark: {
    type:Sequelize.TEXT,
    allowNull: true,
    comment: '角色备注'
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
  engine: 'Innodb'
})

module.exports = Role