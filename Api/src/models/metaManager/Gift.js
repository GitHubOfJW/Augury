const { Gift, ProductStatus, OrderStatus, Sequelize } = require('../../migrations/migration')

const moment = require('moment') 

class Gifts {
  
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
    conditions.order = [[Sequelize.col('sort'),'ASC'],[Sequelize.col('id'),'DESC']]

    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        imgUrl:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        thumb_imgUrl:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
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

    return  Gift.findAll(conditions);
  }

  totalCount(others = {},is_delete = false){
    const conditions = {};
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        imgUrl:{
          [Sequelize.Op.like]:`%${others.match}%`
        },
        thumb_imgUrl:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
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
    return  Gift.count(conditions);
  }

  insertOrUpdate(values){
     const result =  Gift.insertOrUpdate(values)
     return result;
  }

  // 查询
  findOne(id){
    return Gift.findOne({ where:{
      id:id
      }
    })
  }

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Gift.update({
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
    return Gift.update(values || {} ,{
       where:{
         id:id
       }
     })
   }

  // 彻底删除
  removeByIds(ids = []){
    const removeIds =  [...(ids||[])]
    return Gift.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }
}


module.exports = new Gifts();