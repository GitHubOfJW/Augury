const { Shopkeeper,Admin, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class Shopkeepers {
  
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
          wechat:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          qq:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      },
      {
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.username}%`
          }
        }
      },{
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }]
    }

    conditions.include = [{
      model:Admin
    }]
    
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


    const data = Shopkeeper.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Shopkeeper.count({
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
   return Shopkeeper.update(values || {} ,{
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
          wechat:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          qq:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      },
      {
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.username}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.username}%`
          }
        }
      },{
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        qq:{
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


    const count =  Shopkeeper.count(conditions);
    return count;
  }
   
  ShopkeeperLogin(account,password){
    // 查询Shopkeeper
    let Shopkeeper =  Shopkeeper.findOne({
      attributes:{ exclude:['password'] },
      where:{
        [Sequelize.Op.or]:{
          account: account,
          mobile: account,
          email: account
        },
        password:password
      },include:[{
        model:Role
      }]
    });

    return Shopkeeper;
  }
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Shopkeeper.update({
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
    return Shopkeeper.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
    return Shopkeeper.create(values)
  }
  
  // 查询
  findOne(id){
    return Shopkeeper.findOne({ where:{
      id:id,
      }
    })
  }
}


module.exports = new Shopkeepers();