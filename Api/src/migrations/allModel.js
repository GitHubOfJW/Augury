
const { sequelize, Sequelize } = require('../utils/SequelizeInit')

module.exports = { 
  // 权限管理
  Admin :  require('./AdminManager/Admin'), 
    
  Member: require('./MemberManager/Member'),
 
  // 天干地支
  TianGan: require('./CalendarManager/TianGan'),
  DiZhi: require('./CalendarManager/DiZhi'),
  GanZhi: require('./CalendarManager/GanZhi'),
 
  // sequelize
  sequelize,
  Sequelize
}