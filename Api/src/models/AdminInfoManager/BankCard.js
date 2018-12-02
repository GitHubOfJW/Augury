const { BankCard, Device , Bank, Sequelize } = require('../../migrations/migration')

const moment = require('moment') 

class BankCards {
  
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
        card_num:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        real_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        bank_mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_link:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }

    if(others.wechat_id && others.wechat_id > 0){
      conditions.where.wechat_id = others.wechat_id
    }
    
    conditions.include = [{
      model:Bank,
      scop:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        bank_code:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
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

    return  BankCard.findAll(conditions);
  }

  totalCount(others = {},is_delete = false){
    const conditions = {};
    
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        card_num:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        real_name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        bank_mobile:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_account:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_password:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        abv_link:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }

    if(others.wechat_id && others.wechat_id > 0){
      conditions.where.wechat_id = others.wechat_id
    }

    conditions.include = [{
      model:Bank,
      scop:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        bank_code:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
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
    return  BankCard.count(conditions);
  }

  insertOrUpdate(values){
    if(values.bank_id && values.bank_id <= 0){
      delete values.bank_id
    }
     const result =  BankCard.insertOrUpdate(values)
     return result;
  }

  // 查询
  findOne(id){
    return BankCard.findOne({ where:{
      id:id
      },
      include:[{
        model:Bank
      }]
    })
  }

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return BankCard.update({
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
    if(values.wechat_id <= 0){
      delete values.wechat_id;
    }
    return BankCard.update(values || {} ,{
       where:{
         id:id
       }
     })
   }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return BankCard.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }
}


module.exports = new BankCards();