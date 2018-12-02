// 引入baseController
const BaseController = require('../BaseController'); 

const productModel = require('../../models/shopkeeperManager/Product')

const orderModel = require('../../models/orderManager/Order')

const metaDateModel = require('../../models/metaManager/MetaData')

const UUID = require('uuid')

const fse = require('fs-extra')

const moment = require('moment')

const Excel = require('exceljs')

const ejsexcel = require('ejsexcel')

const UploadUtil = require('../../utils/UploadUtil')

const ExcelUtil = require('../../utils/ExcelUtil')


const stream = require('stream')
const fs = require('fs')

const path = require('path')
 
class OrderController extends BaseController {
  
  

  //管理管理员列表请求
  static async orderList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';

    const username = req.query.username || '';
    const contact = req.query.contact || '';
    const match = req.query.match || '';

    const page = req.query.page || 1;
    const consumer_id = req.query.consumer_id || 0;
    const product_id =  req.query.product_id || 0;
    const pageSize = parseInt(req.query.limit || 20);

    const price_min = req.query.price_min || Number.MIN_SAFE_INTEGER;
    const price_max = req.query.price_max || Number.MAX_SAFE_INTEGER;
    const commission_min = req.query.price_min || Number.MIN_SAFE_INTEGER;
    const commission_max = req.query.price_max || Number.MAX_SAFE_INTEGER;
    const sp_min = req.query.sp_min || Number.MIN_SAFE_INTEGER;
    const sp_max = req.query.sp_max || Number.MAX_SAFE_INTEGER;

    const member_commission_min = req.query.member_commission_min || Number.MIN_SAFE_INTEGER;
    const member_commission_max = req.query.member_commission_max || Number.MAX_SAFE_INTEGER;
    
    const excel  = req.query.excel || false

    const status = req.query.status

    const conditions = {
      excel:excel,
      page:page,
      start:start,
      end:end,
      username:username,
      contact:contact,
      match:match,
      status:status,
      
      consumer_id:consumer_id,
      product_id:product_id,

      sp_min:sp_min,
      sp_max:sp_max,
      price_min:price_min,
      price_max:price_max,
      commission_min:commission_min,
      commission_max:commission_max,
      member_commission_min:member_commission_min,
      member_commission_max:member_commission_max,
    };

    const count = await orderModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await orderModel.list(page,pageSize,conditions)
    
    // 存储excel
    if(excel){
      // 根据商品名称查询 店铺名称
      let shopName = '店铺名称'
      if(product_id > 0 ){
        const product = await productModel.findOne(product_id)
        shopName = product.shop.wangwang
      }
       const data = [];
       const dataMap = {}
       for(let order of list){
         const orderDate = order.createdDate
         if(!dataMap.hasOwnProperty(orderDate)){
            dataMap[orderDate] = {
              key:orderDate,
              shopName:shopName,
              offset:0,
              list:[order],
              length:0
            }
         }else{
            dataMap[orderDate].list.push(order)
         }
       }
       const keys =  Object.keys(dataMap).sort((obj1,obj2)=>{
          return obj1 > obj2 ? 1 : -1;
       }) 
        
       // 设置数据
       for(let key of keys){
         data.push(dataMap[key]);
       }

        const exlBuf = await ExcelUtil.createExcelTemplate(data)
        const exlBuf2 = await ejsexcel.renderExcel(exlBuf, data);
        
        const xlsxConfig = ExcelUtil.xlsxDirPath()
        const downloadfileName = `${shopName}${moment().format('YYYYMMDDHH')}`
        const fileName = `${xlsxConfig.fileDirPath}${UUID.v1().toString()}.xlsx`;
        fse.writeFileSync(fileName,exlBuf2);
 
        const stat = fse.stat(fileName)
        // 设置数据
        res.set({
          'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
          'Content-Disposition': 'attachment; filename=' + encodeURI(downloadfileName)+'.xlsx', //告诉浏览器这是一个需要下载的文件
          'Content-Length': stat.size  //文件大小
        });
        const stream =  fse.createReadStream(fileName)
        stream.pipe(res)
        // 清理垃圾
        ExcelUtil.clearXlsx()
        return;
    }
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async orderUpdate(req,res){
    if(req.params.id){
      const data = await orderModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await orderModel.findOne(req.params.id)
          if(model){
            // 设置model到sesson中
            req.session.user = model;
          }
        }
        const result = super.handlerResponseData(0,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(1,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(1,'修改失败，缺少唯一标识');
      res.json(result);
    }
  }
 
  // 添加订单请求
  static async orderAdd(req,res){
    if(!req.body.apit_time || req.body.apit_time.trim().length <= 0){
      if(super.validator(req.body.order_id,{required:true},'订单编号或预约下单时间',res)){
        return
      }
    }else if(!req.body.order_id || req.body.order_id.trim().length <= 0){
      if(super.validator(req.body.apit_time,{required:true},'预约下单时间或订单编号',res)){
        return
      }
    }
    if(super.validator(req.body.wangwang,{required:true},'会员旺旺',res)
    ||super.validator(req.body.last_price,{required:true},'成交价格',res)
    ||super.validator(req.body.member_commission,{required:true},'会员佣金',res)
    // ||super.validator(req.body.gift_id,{required:true},'礼品',res)
    ||super.validator(req.body.product_id,{required:true},'商品',res)
    ||super.validator(req.body.consumer_id,{required:true},'会员',res)
    ||super.validator(req.body.break_rule,{required:true},'是否违规',res)
    
    
    ) return;
    
    let count = 0
    if(req.body.order_id && req.body.order_id.trim().length > 0){
      count = await orderModel.has({
        order_id:req.body.order_id
      })
      if(count>0){
        const result = super.handlerResponseData(1,'订单编号已存在'); 
        res.json(result);
        return;     
      }
    }
    
    // 转成时间
    if(req.body.apit_time && req.body.apit_time.trim().length > 0){
      req.body.apit_time  = moment().format('YYYY-MM-DD')+" "+req.body.apit_time
      if(!moment(req.body.apit_time).isValid()){
        const result = super.handlerResponseData(1,'预约下单日期格式不正确'); 
        res.json(result);
        return;
      }
    }

    const data = await orderModel.insert({
      ...req.body,
      status_id:(req.body.order_id && req.body.order_id.trim()) ? 5:3,
      status_check:false,
      admin_id:req.session.user.id
    })

    // 更新数量
    productModel.updateCount(req.body.product_id)

    if(data){
      const result = super.handlerResponseData(0,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'添加失败');
      res.json(result);
    }
     
  }


  // 删除
  static async orderDelete(req,res){
    if(req.body.ids){
      const data = await orderModel.deleteByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(0,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(1,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(1,'删除失败，缺少参数');
      res.json(result);
    }
  }

  // 彻底删除
  static async orderRemove(req,res){
    if(req.body.ids){
      const data = await orderModel.removeByIds(req.body.ids.split(','))
      if(data){
        const result = super.handlerResponseData(0,'删除成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(1,'删除失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(1,'删除失败，缺少参数');
      res.json(result);
    }
  }
 

  // 编辑
  static async orderEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(req.body.apit_time && req.body.apit_time.trim().length <= 0){
      if(super.validator(req.body.order_id,{required:true},'订单编号或预约下单时间',res)){
        return
      }
    }else if((req.body.apit_time && req.body.apit_time.trim().length < 0) && (!req.body.order_id || req.body.order_id.trim().length <= 0)){
      if(super.validator(req.body.apit_time,{required:true},'预约下单时间或订单编号',res)){
        return
      }
    }
    if(super.validator(req.body.wangwang,{required:true},'会员旺旺',res)
    ||super.validator(req.body.last_price,{required:true},'成交价格',res)
    ||super.validator(req.body.member_commission,{required:true},'会员佣金',res)
    // ||super.validator(req.body.gift_id,{required:true},'礼品',res)
    ||super.validator(req.body.product_id,{required:true},'商品',res)
    ||super.validator(req.body.consumer_id,{required:true},'会员',res)
    ||super.validator(req.body.break_rule,{required:true},'是否违规',res)
    
    
    ) return;
    
 
    // 转成时间
    if(req.body.apit_time && req.body.apit_time.trim().length > 0){
      req.body.apit_time  = moment().format('YYYY-MM-DD')+" "+req.body.apit_time
      if(!moment(req.body.apit_time).isValid()){
        const result = super.handlerResponseData(1,'预约下单日期格式不正确'); 
        res.json(result);
        return;
      }
    }

    let count = 0
    if(req.body.order_id && req.body.order_id.trim().length > 0){
      count = await orderModel.has({
        order_id:req.body.order_id
      },req.params.id)
      if(count>0){
        const result = super.handlerResponseData(1,'订单编号已存在'); 
        res.json(result);
        return;     
      }
    }

    // 判断是否是需要填写返款日期
    count = await orderModel.has({
      order_id:req.body.order_id,
      status_id:4,//对方已付款，就得有返款日期
    },req.params.id)
    if(count > 0){
      const result = super.handlerResponseData(1,'请选择返款日期'); 
      res.json(result);
      return;
    }
    
    const data = await orderModel.update({
      ...req.body,
      admin_id:req.session.user.id
    },req.params.id)

    // 更新统计
    productModel.updateCount(req.body.product_id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败');
      res.json(result);
    }
     
  }

   // 获取礼品列表
  static async giftList(req,res){
    const  giftList  = await  metaDateModel.giftList()

    let gifts = [];
    
    for(let gift of giftList){
      if(!gift.is_delete){
          gifts.push(gift);
      }
    }

    const result = super.handlerResponseData(0,'获取成功',{list:gifts});

    res.json(result);
  }

  // 订单
  static async orderDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    const data = await orderModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }

  // 订单状态列表
  static async statusList(req,res){

    const  orderStatusList  = await  metaDateModel.orderStatusList()

    let statusList = [];
    
    for(let status of orderStatusList){
      if(!status.is_delete){
        statusList.push(status);
      }
    }

    const result = super.handlerResponseData(0,'获取成功',{list:statusList});

    res.json(result);
  }


  // 修改订单状态
  static async orderAlreadyPay(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    // 订单状态
    const data = await orderModel.updateValues({
      status_check:false,
      status_id:4
    },req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功')
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败')
      res.json(result);
    }
  }

  static async orderWaitBack(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    
    // 订单状态
    const data = await orderModel.updateValues({
      status_check:false,
      status_id:5
    },req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功')
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败')
      res.json(result);
    }
  }


  // 已经返款
  static async alreadyBack(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    

    // 订单状态
    const data = await orderModel.updateValues({
      status_check:false,
      status_id:8
    },req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功')
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败')
      res.json(result);
    }
  }

  // 订单已经完成
  static async alreadyFinish(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    

    // 订单状态
    const data = await orderModel.updateValues({
      status_check:true,
      status_id:9
    },req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功')
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败')
      res.json(result);
    }
  }

   // 取消订单
   static async cancelOrder(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
 
    // 更新订单总量
    const orderData = await orderModel.findOne(req.params.id)
    productModel.updateCount(orderData.product.id)
     
    // 订单状态
    const data = await orderModel.updateValues({
      status_check:true,
      status_id:11
    },req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'修改成功')
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败')
      res.json(result);
    }
  }
}

module.exports = OrderController