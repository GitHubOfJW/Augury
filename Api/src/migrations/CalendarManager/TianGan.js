
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const { domain } = require('../../configure/config')

const TianGan = sequelize.define('meta_tiangan', {
  name: { 
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '名称'
  },
  code: {
    type: Sequelize.INTEGER,
    allowNull:false,
    comment: '编号'
  },
  is_yang: {
    type: Sequelize.INTEGER,
    allowNull:false,
    comment: '是否属阳'
  },
  xiangfa: {
    type: Sequelize.STRING(1000),
    allowNull:true,
    comment:'象法',
  },
  explain: {
    type: Sequelize.TEXT,
    allowNull: true,
    comment: '说明'
  },
  pinyin:{
    type: Sequelize.STRING(20),
    allowNull:false,
    comment:'拼音'
  },
  sort: { 
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:1,
    comment: '排序'
  },
},{
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
  createdAt:false,
  updatedAt:false
})

module.exports =  TianGan