const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const AuthCate = sequelize.define('auth_cates', {
  name: {
    type: Sequelize.STRING(40),
    allowNull: false,
    comment: '分类名称'
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
 
module.exports =  AuthCate;