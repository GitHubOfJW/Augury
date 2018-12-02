const moment =  require('moment')

const { Auth, AuthCate, AuthRoleRel, Sequelize, sequelize} = require('../../migrations/migration')


class AuthModel {
  
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

    conditions.include = [{
      model:AuthCate,
    }]

    // where条件
    conditions.where = {}
    if(others.cateId){
        conditions.where.cate_id =  others.cateId;
    }
    conditions.where[Sequelize.Op.or] = {
      name:{
        [Sequelize.Op.like]:`%${others.cateName}%`
      },
      rules:{
        [Sequelize.Op.like]:`%${others.cateName}%`
      }
    }

    // 时间约束
    if(others.start && others.start.trim().length && moment(others.start).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.gt]:moment(others.start).toDate()
      }
    }
    if(others.end && others.end.trim().length && moment(others.end).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.lt]:moment(others.end).toDate()
      }
    }

    

    const data = Auth.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return Auth.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={},is_delete=false){
    const conditions = {};
    
    // where条件
    conditions.where = {}
    if(others.cateId){
        conditions.where.cate_id =  others.cateId;
    }
    conditions.where[Sequelize.Op.or] = {
      name:{
        [Sequelize.Op.like]:`%${others.cateName}%`
      },
      rules:{
        [Sequelize.Op.like]:`%${others.cateName}%`
      }
    }

    // 时间约束
    if(others.start && others.start.trim().length && moment(others.start).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.gt]:moment(others.start).toDate()
      }
    }
    if(others.end && others.end.trim().length && moment(others.end).isValid()){
      conditions.where.createdAt = {
        [Sequelize.Op.lt]:moment(others.end).toDate()
      }
    }

    const count =  Auth.count(conditions);
    return count;
  }
  
  // 添加权限
  insert(values){
    return Auth.create(values)
  }
  

  // 查询
  findOne(id){
    return Auth.findOne({ where:{
      id:id,
      },include:[{
        model:AuthCate
      }]
    })
  }

  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Auth.update({
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
    return sequelize.transaction(function(t){
      return AuthRoleRel.destroy({
        where:{
          auth_id:{
            [Sequelize.Op.in]:removeIds
          }
        }
      },{transaction:t}).then(result => {
        return Auth.destroy({
          where:{
            id:{
              [Sequelize.Op.in]:removeIds
            }
          }
        },{ transaction:t})
     })
    })
  }
}


module.exports = new AuthModel();