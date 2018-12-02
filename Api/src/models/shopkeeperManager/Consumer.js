const { Consumer,Admin, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class Consumers {
  
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
          recommand:{
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
        recommand:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        num_id:{
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


    const data = Consumer.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Consumer.count({
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
   return Consumer.update(values || {} ,{
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
          recommand:{
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
        recommand:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        num_id:{
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


    const count =  Consumer.count(conditions);
    return count;
  }
   
  ConsumerLogin(account,password){
    // 查询Consumer
    let Consumer =  Consumer.findOne({
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

    return Consumer;
  }
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Consumer.update({
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
    return Consumer.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
    return Consumer.create(values)
  }
  
  // 查询
  findOne(id){
    return Consumer.findOne({ where:{
      id:id,
      }
    })
  }
}


module.exports = new Consumers();