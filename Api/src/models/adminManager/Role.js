const moment =  require('moment')

const { Auth, AuthCate, Role, AuthRoleRel, Sequelize, sequelize} = require('../../migrations/migration')

class RoleModel {
  
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
      model:AuthRoleRel,
      include:{
        model:Auth
      }
    }]

    // where条件
    conditions.where = {is_delete:is_delete}
    conditions.where[Sequelize.Op.or] = {
      name:{
        [Sequelize.Op.like]:`%${others.name||''}%`
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

    

    const data = Role.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
    // 如果没有修改权限，则可能是更新状态或修改名称
    if(!values.authIds){
      return  Role.update(values,{where:{
        id:id
      }});
    }
    
    values.authIds = values.authIds || []
    return sequelize.transaction(function(t){
      const roleValues = { ...values }
      delete roleValues.authIds;

      return Role.update(roleValues,{ where:{ id:id }, transaction:t }).then(result =>{
        return AuthRoleRel.findAll({
          where:{
            role_id:id
          }
        })
      }).then(rels => {
         const relIds = rels.map(relItem=>{
           return `${relItem.auth_id}`;
         })
         const delIds = [];
         const addRels = [];
         
         const idSets = new Set([...relIds,...values.authIds])
         for(let authId of idSets){
           // 不在选中的权限关系里，得删除
           if(!values.authIds.includes(authId)){
              delIds.push(authId)
           }
           // 不在已有的权限关系里，得添加
           if(!relIds.includes(authId)){
              addRels.push({
                auth_id:authId,
                role_id:id
              })
           }
         }

         return Promise.all([
           AuthRoleRel.destroy({
             where:{
               auth_id:{
                 [Sequelize.Op.in]:delIds
               },
               role_id:id
             }
           },{transaction:t}),
           AuthRoleRel.bulkCreate(addRels,{transaction:t})
         ])
      })
    })
  }

  // 获取总数
  totalCount(others={},is_delete=false){
    const conditions = {};
    
    // where条件
    conditions.where = {is_delete:is_delete}
    conditions.where[Sequelize.Op.or] = {
      name:{
        [Sequelize.Op.like]:`%${others.name||''}%`
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

    const count =  Role.count(conditions);
    return count;
  }
  
  // 添加权限
  insert(values){
    return sequelize.transaction(function(t){
      const roleValues = { ...values }
      delete roleValues.authIds;
      return Role.create(roleValues,{transaction:t}).then(role =>{
        const data = [];
        for(let authId of values.authIds){
          data.push({
            role_id:role.id,
            auth_id:authId
          })
        }
       return AuthRoleRel.bulkCreate(data,{ transaction:t})
      })
    })
  }


  // 查询
  findOne(id){
    return Role.findOne({ where:{
      id:id,
      },include:[{
        model:AuthRoleRel,
        include:{
          model:Auth
        }
      }]
    })
  }


  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Role.update({
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
    return Role.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

}


module.exports = new RoleModel();