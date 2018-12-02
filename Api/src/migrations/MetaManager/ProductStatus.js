
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const ProductStatus = sequelize.define('meta_productStatus', {
  name: { 
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '名称'
  },
  sort: { 
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:1,
    comment: '排序'
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

module.exports =  ProductStatus