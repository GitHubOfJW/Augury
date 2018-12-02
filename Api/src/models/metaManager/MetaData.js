const { Gift, ProductStatus, OrderStatus, Bank, Sequelize } = require('../../migrations/migration')

const moment =  require('moment')

class MetaData {
  
   // 获取数据
  giftList(is_delete = false){
    return  Gift.findAll({
      where:{
        is_delete:is_delete
      }
    });
  }

  productStatusList(is_delete = false){
    return  ProductStatus.findAll({
      where:{
        is_delete:is_delete
      }
    });
  }

  orderStatusList(is_delete = false){
    return  OrderStatus.findAll({
      where:{
        is_delete:is_delete
      }
    });
  }

  bankList(is_delete = false){
    return Bank.findAll({
      where:{
        is_delete:is_delete
      }
    })
  }


   

}


module.exports = new MetaData();