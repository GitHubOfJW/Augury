const { Product, Admin, ProductStatus,Shop,Order, Sequelize, sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class Products {
  
  
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
      service_price:{
        [Sequelize.Op.lte]:others.sp_max,
        [Sequelize.Op.gte]:others.sp_min
      },
      price:{
        [Sequelize.Op.lte]:others.price_max,
        [Sequelize.Op.gte]:others.price_min
      },
      commission:{
        [Sequelize.Op.lte]:others.commission_max,
        [Sequelize.Op.gte]:others.commission_min
      },
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }

    conditions.include = [{
      model:Admin,
      scope:{
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:Shop,
      scope:{
        [Sequelize.Op.or]:{
          sub_account:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          wangwang:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      }
    },{
      model:Admin,
      as:'charge',
      scpoe:{
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:ProductStatus,
      scpoe:{
        name:{
          [Sequelize.or.like]:`%${others.match}%`
        }
      }
    }]

    if(others.shop_id && others.shop_id > 0){
      conditions.where.shop_id = others.shop_id
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


    const data = Product.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Product.count({
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
   if(values.shop_id <= 0){
      delete values.shop_id
   }
   return Product.update(values || {} ,{
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
      service_price:{
        [Sequelize.Op.lte]:others.sp_max,
        [Sequelize.Op.gte]:others.sp_min
      },
      price:{
        [Sequelize.Op.lte]:others.price_max,
        [Sequelize.Op.gte]:others.price_min
      },
      commission:{
        [Sequelize.Op.lte]:others.commission_max,
        [Sequelize.Op.gte]:others.commission_min
      },
      [Sequelize.Op.or]:{
        name:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }

    conditions.include = [{
      model:Admin,
      scope:{
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:Shop,
      scope:{
        [Sequelize.Op.or]:{
          sub_account:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.contact}%`
          },
          wangwang:{
            [Sequelize.Op.like]:`%${others.contact}%`
          }
        }
      }
    },
    {
      model:Admin,
      as:'charge',
      scpoe:{
        [Sequelize.Op.or]:{
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          mobile:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:ProductStatus,
      scpoe:{
        name:{
          [Sequelize.or.like]:`%${others.match}%`
        }
      }
    }]
    
    if(others.shop_id && others.shop_id > 0){
      conditions.where.shop_id = others.shop_id
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


    const count =  Product.count(conditions);
    return count;
  } 
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Product.update({
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
    return Product.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加管理员
  insert(values){
      return Product.create(values)
  }
  
  // 查询
  findOne(id){
    return Product.findOne({ where:{
      id:id,
      },include:[{
        model: ProductStatus
      },{
        model:Shop
      }]
    })
  }

  // 更新订单数
  updateCount(product_id=0){
    if(!product_id && product_id == 0){
      return
    }
    return sequelize.transaction(t=>{
        // 计算今日订单总和
      return Order.count({
        where:{
          createdAt:{
            [Sequelize.Op.gt]:moment().hours(0).minutes(0).seconds(0).toDate(),
            [Sequelize.Op.lt]:moment().hours(23).minutes(59).seconds(59).toDate(),
          },
          status_id:{
            [Sequelize.Op.notIn]:[11]
          },
          product_id:product_id,
        }
      },{transaction:t}).then(count => {
         // 如果订单大于1,则不用统计昨日订单量
        if(count > 1 ){
          return Product.update({
            today_orders:count
          },{where:{
            id:product_id
          }},{transaction:t})
        }else{
          // 获取去昨天的订单数
          return Order.count({
            where:{
              createdAt:{
                [Sequelize.Op.gt]:moment().add(-1,'days').hours(0).minutes(0).seconds(0).toDate(),
                [Sequelize.Op.lt]:moment().add(-1,'days').hours(23).minutes(59).seconds(59).toDate(),
              },
              status_id:{
                [Sequelize.Op.in]:[4,5,6,7,8,9,10]
              },
              product_id:product_id,
            }
          },{transaction:t}).then(ysd_count =>{
             // 更新昨天的单量和今天的单量
             return Product.update({
               ysd_orders:ysd_count,
               today_orders:count
             },{where:{id:product_id}},{transaction:t})
          })
        }
      })
    })
  
  }
}


module.exports = new Products();