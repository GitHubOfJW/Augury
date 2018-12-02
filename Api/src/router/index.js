const express = require('express');
const router = express.Router()
 

// 引入路由配置文件
const { adminApi ,requestType} = require('../configure/routerConfig')

// 执行功能的控制器
const controllers = {
  IndexController:require('../controllers/IndexController'),
  AdminController:require('../controllers/adminManager/AdminController'),
  CateController:require('../controllers/adminManager/CateController'),
  AuthController:require('../controllers/adminManager/AuthController'),
  RoleController:require('../controllers/adminManager/RoleController'),
  UploadController:require('../controllers/uploadManager/UploadController'),

  WechatController: require('../controllers/adminInfoManager/WechatController'),

  ShopkeeperController: require('../controllers/shopkeeperManager/ShopkeeperController'),
  ShopController: require('../controllers/shopkeeperManager/ShopController'),
  ProductController: require('../controllers/shopkeeperManager/ProductController'),
  ConsumerWwController: require('../controllers/shopkeeperManager/ConsumerWwController'),
  ConsumerController: require('../controllers/shopkeeperManager/ConsumerController'),
  OrderController: require('../controllers/orderManarger/OrderController'),

  BankCardController: require('../controllers/adminInfoManager/BankCardController'),
  GiftController: require('../controllers/metadataMananger/GiftController'),
  DeviceController: require('../controllers/metadataMananger/DeviceController'),

  OthersController: require('../controllers/othersManarger/OthersController'),
}

// console.log(controllers)

// 取出所有的控制器配置
const totalConfigControllers = [];

for(let controllerKey of Object.keys(adminApi)){
  // console.log(controllerKey)
  totalConfigControllers.push({
    configController:adminApi[controllerKey],
    controllerKey:controllerKey,
  })
}

// 遍历设置路由
for(let {configController,controllerKey} of totalConfigControllers){
  for(let key of Object.keys(configController.routers)){
    const type = configController.routers[key].type;
    const method = configController.routers[key].method;
    const path = configController.routers[key].path;
    // console.log(key,type,method,path,controllerKey);
    switch(type){
      case requestType.PATCH:
        router.patch(path,controllers[controllerKey][method]);
        break
      case requestType.GET:
        router.get(path,controllers[controllerKey][method]);
        break
      case requestType.POST:
        router.post(path,controllers[controllerKey][method]);
        break;
      case requestType.DELETE:
        router.delete(path,controllers[controllerKey][method]);
        break;
    }
  }
}


module.exports =  router;