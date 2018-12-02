const { Wechat, Admin, Device , Sequelize } = require('../../migrations/migration')

const moment = require('moment') 

class Wechats {
  
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

    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        wechat:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat_id:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        real_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }, 
        pay_password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
      }
    }

    if(others.admin_id && others.admin_id > 0){
      conditions.where.admin_id = others.admin_id
    }

    conditions.include = [{
      model:Device
    },{
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

    return  Wechat.findAll(conditions);
  }

  totalCount(others = {},is_delete = false){
    const conditions = {};
    
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        wechat:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat_id:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        wechat_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        real_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }, 
        pay_password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
      }
    }

    if(others.admin_id && others.admin_id > 0){
      conditions.where.admin_id = others.admin_id
    }

    conditions.include = [{
      model:Device
    },{
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
    return  Wechat.count(conditions);
  }

  insertOrUpdate(values){
     const result =  Wechat.insertOrUpdate(values)
     return result;
  }

  // 查询
  findOne(id){
    return Wechat.findOne({ where:{
      id:id
      },
      include:[{
        model:Device,
      },{
        model:Admin
      }]
    })
  }

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Wechat.update({
      is_delete:!reverse
    },{
      where:{
        id:{
          [Sequelize.Op.in]:deleteIds
        }
      }
    })
  }


  // 更新各状态
  update(values,id){
    if(values.admin_id <= 0){
      delete values.admin_id;
    }
    return Wechat.update(values || {} ,{
       where:{
         id:id
       }
     })
   }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return Wechat.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }
}


module.exports = new Wechats();