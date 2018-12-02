const { Order,Admin,Consumer,Product,ProductStatus,Gift,OrderStatus,ConsumerWw, Sequelize, sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class Orders {
  
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
 

    if(others.excel){
      conditions.order = [[Sequelize.col('createdAt'),'ASC']]
    }else{
      conditions.order = [[Sequelize.col('createdAt'),'DESC']]
    }

    // where条件
     conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        order_id:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      },
      member_commission:{
        [Sequelize.Op.lte]:others.member_commission_max,
        [Sequelize.Op.gte]:others.member_commission_min
      },
    }

     // 订单状态
     if(others.status){
      conditions.where.status_id = {
        [Sequelize.Op.in]:others.status
      }
    }

    if(others.consumer_id>0){
      conditions.where.consumer_id = others.consumer_id
    }
    if(others.product_id>0){
      conditions.where.product_id = others.product_id
    }
  

    
    conditions.include = [{
      model:Admin
    },{
      model:Product,
      include:[{
        model:ProductStatus
      }],
      where:{
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
    },{
      model:Consumer,
      where:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
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
      }
    },{
      model:Gift,
      scope:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:OrderStatus,
      order:[[Sequelize.col('meta_orderStatuses.sort'),'DESC']],
      scope:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:ConsumerWw
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

    // 时间约束
    if(others.back_start && others.back_start.trim().length && moment(others.back_start).isValid()){
      conditions.where.refundTime = conditions.where.refundTime || {};
      conditions.where.refundTime[Sequelize.Op.lt] = moment(others.back_start).toDate()
    }

    if(others.back_end && others.back_end.trim().length && moment(others.back_end).isValid()){
      conditions.where.refundTime = conditions.where.refoundTime || {};
      conditions.where.refundTime[Sequelize.Op.lt] = moment(others.back_end).toDate()
    }


    const data = Order.findAll(conditions);
    return data;
  }

  // 获取
  has(conditions={},excludeId=0){
   return Order.count({
      where:{
        ...conditions,
        id:{
          [Sequelize.Op.notIn]:[excludeId]
        }
      }
    })
  }

  // 更新
  updateValues(values,id){
    return Order.update(values,{
       where:{
         id:id
       }
     })
  }

  // 更新各状态
  update(values,id){
    if(values.gift_id && values.gift_id <= 0){
      values.gift_id = null
    }
   return sequelize.transaction(t => {
     return  ConsumerWw.update({
       wangwang:values.wangwang
      },{where:{
        id:values.consumerww_id
      }
     },{transaction:t}).then(result => {
       delete values.consumerww_id
       delete values.wangwang
       return Order.update(values,{
         where:{
           id:id
         }
       },{transaction:t})
     })
   })
   
  }

  // 获取总数
  totalCount(others={},is_delete = false){
    const conditions = {};
   
    // where条件
    conditions.where = {
      is_delete:is_delete,
      [Sequelize.Op.or]:{
        order_id:{
          [Sequelize.Op.like]:`%${others.match}%`
        }
      }
    }

    // 订单状态
    if(others.status){
      conditions.where.status_id = {
        [Sequelize.Op.in]:others.status
      }
    }

    if(others.consumer_id>0){
        conditions.where.consumer_id = others.consumer_id
    }
    if(others.product_id>0){
      conditions.where.product_id = others.product_id
    }

    conditions.include = [{
      model:Admin
    },{
      model:Product,
      include:[{
        model:ProductStatus
      }],
      scope:{
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
    },{
      model:Consumer,
      scope:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
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
      }
    },{
      model:Gift,
      scope:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:OrderStatus,
      scope:{
        [Sequelize.Op.or]:{
          id:{
            [Sequelize.Op.like]:`%${others.match}%`
          },
          name:{
            [Sequelize.Op.like]:`%${others.match}%`
          }
        }
      }
    },{
      model:ConsumerWw
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

    // 时间约束
    if(others.back_start && others.back_start.trim().length && moment(others.back_start).isValid()){
      conditions.where.refundTime = conditions.where.refundTime || {};
      conditions.where.refundTime[Sequelize.Op.gt] = moment(others.back_start).toDate()
    }

    if(others.back_end && others.back_end.trim().length && moment(others.back_end).isValid()){
      conditions.where.refundTime = conditions.where.refoundTime || {};
      conditions.where.refundTime[Sequelize.Op.lt] = moment(others.back_end).toDate()
    }


    const count =  Order.count(conditions);
    return count;
  }
   
  
  // 删除
  deleteByIds(ids = [],reverse = false){
    const deleteIds =  [...(ids||[])]
    return Order.update({
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
    return Order.destroy({
      where:{
        id:{
          [Sequelize.Op.in]:removeIds
        }
      }
    })
  }

  // 添加订单
 insert(values){  
    if(values.gift_id && values.gift_id <= 0){
      values.gift_id = null
    }
    return sequelize.transaction(t => {
      return ConsumerWw.findOne({where:{
        wangwang:(values.wangwang||'').trim()
      }},{transaction:t}).then(result => { 
        if(result){
          delete values.wangwang
          values.consumerww_id =  result.id;
          return Order.create({
            ...values,
            status_id:3//默认待付款
          },{transaction:t})
        }else{
          return ConsumerWw.create({
            wangwang:values.wangwang,
            consumer_id:values.consumer_id
          },{transaction:t}).then(ww => {
            delete values.wangwang
            values.consumerww_id =  ww.id;
            return Order.create(values,{transaction:t})
          })
        }
      })
    })
  }
  
  // 查询
  findOne(id){
    return Order.findOne({ where:{
      id:id,
      },include:[{
        model:OrderStatus
      },{
        model:Gift
      },{
        model:Product
      },{
        model:Consumer
      },{
        model:ConsumerWw
      }]
    })
  }
}


module.exports = new Orders();