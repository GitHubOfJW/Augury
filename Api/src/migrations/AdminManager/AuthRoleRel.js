const { sequelize, Sequelize } = require('../../utils/SequelizeInit')
const AuthRoleRel = sequelize.define('auth_role_rel', {
  role_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '角色编号'
  },
  auth_id: {
    type:Sequelize.INTEGER,
    allowNull: true,
    comment: '权限编号'
  },
},{
  engine: 'Innodb',//如果要createAt 和updateAt 不能用MYISAM
  createdAt:false,
  updatedAt:false
})
 
module.exports =  AuthRoleRel;