
const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const moment = require('moment')
const { domain } = require('../../configure/config')

const GanZhi = sequelize.define('meta_ganzhi', {
  name: { 
    type: Sequelize.STRING(10),
    allowNull: false,
    comment: '名称'
  },
  tiangan_id:{
    type: Sequelize.INTEGER,
    allowNull:false,
    comment:'天干id'
  },
  dizhi_id:{
    type: Sequelize.INTEGER,
    allowNull:false,
    comment:'地支id'
  },
  is_yang: {
    type: Sequelize.INTEGER,
    allowNull:false,
    comment: '是否属阳'
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

module.exports =  GanZhi