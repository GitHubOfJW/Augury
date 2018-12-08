const { Admin, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')
const md5 = require('md5')
class AdminModel {
  
   // 获取数据
  list(page = 1,pagesize = 20,others = {},is_delete = false){
    const conditions = {};
    // 分页
    if(page > 0 && pagesize > 0){
      if(page <= 0){
        page = 1;
      }
      conditions.offset =  (page - 1) * pagesize;
      conditions.limit = pagesize;
    }
    
    // 排序
    conditions.order = [[Sequelize.col('id'),'DESC']]

    // where条件
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.and]:[{
        [Sequelize.Op.or]:{
          qq:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          qq_name:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      },
      {
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          account:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.username}%`
          }
        }
      },{
      [Sequelize.Op.or]:{
        account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        jst_account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        computer:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        email:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }]
    }
 
    
    // 时间约束
    if(others.start && others.start.trim().length && moment(others.start).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.gt]:moment(others.start).toDate()
      }
    }
    if(others.end && others.end.trim().length && moment(others.end).isValid()){
      conditions.where.createdAt = conditions.where.createdAt || {};
      conditions.where.createdAt[Sequelize.Op.lt] = moment(others.end).toDate()
    }


    const data = Admin.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Admin.count({
      where:{
        ...conditions,
        id:{
          [Sequelize.Op.notIn]:[excludeId]
        }
      }
    })
  }

  // 更新各状态
  update(values,id){
    if(values.password){
      values.password = md5(md5(values.password))
    }
   return Admin.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={},is_delete = false){
    const conditions = {};
   
     // where条件
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.and]:[{
        [Sequelize.Op.or]:{
          qq:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          qq_name:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      },
      {
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          account:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.username}%`
          }
        }
      },{
      [Sequelize.Op.or]:{
        account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        jst_account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        computer:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        email:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }]
    }


    // 时间约束
    if(others.start && others.start.trim().length && moment(others.start).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.gt]:moment(others.start).toDate()
      }
    }
    if(others.end && others.end.trim().length && moment(others.end).isValid()){
      conditions.where.createdAt = conditions.where.createdAt || {};
      conditions.where.createdAt[Sequelize.Op.lt] = moment(others.end).toDate()
    }


    const count =  Admin.count(conditions);
    return count;
  }
   
  adminLogin(account,password){
    // 查询admin
    let admin =  Admin.findOne({
      attributes:{ include:['id','name','account','mobile','is_admin'] },
      where:{
        [Sequelize.Op.or]:{
          account: account,
          mobile: account,
          email: account
        },
        password:md5(md5(password))
      }
    });

    return admin;
  }
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Admin.update({
      is_delete:!reverse
    },{
      where:{
        id:{
          [Sequelize.Op.in]:deleteIds
        }
      }
    })
  }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return Admin.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
    if(values.password){
      values.password = md5(md5(values.password))
    }
    return Admin.create(values)
  }
  
  // 查询
  findOne(id){
    return Admin.findOne({ where:{
      id:id,
      }
    })
  }
}


module.exports = new AdminModel();