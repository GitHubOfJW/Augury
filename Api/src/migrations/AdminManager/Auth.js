const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const Auth = sequelize.define('auths', {
  name: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '权限名称'
  },
  rules: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '规则'
  },
  cate_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '分类编号'
  },
  remark: {
    type:Sequelize.TEXT,
    allowNull: true,
    comment: '备注'
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

module.exports = Auth