const { AuthCate, Auth, AuthRoleRel, Sequelize, sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class AuthCateModel {
  
   // 获取数据
  list(page = 1,pagesize = 20,includeAuth = false,roleId = 0){
    const conditions = {};
    // 分页
    if(page > 0 && pagesize > 0){
      if(page <= 0){
        page = 1;
      }
      conditions.offset =  (page - 1) * pagesize;
      conditions.limit = pagesize;
    }

    if(includeAuth){
      conditions.include = [{
        model:Auth,
      }]
    }

    // 排序
    conditions.order = [[Sequelize.col('id'),'DESC']]
   
    if(roleId > 0){
      conditions.include = [{
        model:Auth,
        include:{
          model:AuthRoleRel,
          where:{
            roleId:roleId
          }
        },
      }]
    }
    
    const data = AuthCate.findAll(conditions);
    return data;
  }

  // 更新各状态
  update(values,id){
   return AuthCate.update(values || {} ,{
      where:{
        id:id
      }
    })
  }

  // 获取总数
  totalCount(others={}){
    const count =  AuthCate.count();
    return count;
  }

  // 添加分类
  insert(values){
    return AuthCate.create(values)
  }


  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return AuthCate.update({
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
    return  sequelize.transaction(function(t){
      
      return Auth.destroy({
          where:{
            cate_id:{
              [Sequelize.Op.in]:removeIds
            }
          }
        },{transaction:t}).then(result => {
          return AuthCate.destroy({
            where:{
              id:{
                [Sequelize.Op.in]:removeIds
              }
            }
          },{transaction:t}).then(result => {
            return AuthRoleRel.destroy({
              where:{
                auth_id:{
                  [Sequelize.Op.eq]:null
                }
              }
            },{transaction:t})
          })
        })      
    });
    
  }
  
}


module.exports = new AuthCateModel();