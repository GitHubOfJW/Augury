
// 引入baseController
const BaseController = require('../BaseController'); 
 

const productModel = require('../../models/shopkeeperManager/Product')
const MetaDataModel  = require('../../models/metaManager/MetaData')
 
class ProductController extends BaseController {
  
  

  //管理管理员列表请求
  static async productList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const match = req.query.match || '';
    const page = req.query.page || 1;
    const price_min = req.query.price_min || Number.MIN_SAFE_INTEGER;
    const price_max = req.query.price_max || Number.MAX_SAFE_INTEGER;
    const commission_min = req.query.price_min || Number.MIN_SAFE_INTEGER;
    const commission_max = req.query.price_max || Number.MAX_SAFE_INTEGER;
    const sp_min = req.query.sp_min || Number.MIN_SAFE_INTEGER;
    const sp_max = req.query.sp_max || Number.MAX_SAFE_INTEGER;
    const shop_id = req.query.shop_id || 0
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      match:match,
      sp_min:sp_min,
      sp_max:sp_max,
      price_min:price_min,
      price_max:price_max,
      commission_min:commission_min,
      commission_max:commission_max,
      shop_id:shop_id
    };

    const count = await productModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await productModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async productUpdate(req,res){
    if(req.params.id){
      const data = await productModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await productModel.findOne(req.params.id)
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
 
  // 添加权限请求
  static async productAdd(req,res){
    if(super.validator(req.body.name,{required:true,min:2,max:40},'商品名称',res)
    // ||super.validator(req.body.charge_id,{required:true},'放单负责人',res)
    ||super.validator(req.body.price,{required:true},'商品价格',res)
    ||super.validator(req.body.commission,{required:true},'商品俑金',res)
    ||super.validator(req.body.service_price,{required:true},'服务费',res)
    ||super.validator(req.body.cooperate_status,{required:true},'合作状态',res)
    ) return;
  
    
    const data = await productModel.insert({
      ...req.body,
      admin_id:req.session.user.id,
      charge_id:req.session.user.id
    })
    if(data){
      const result = super.handlerResponseData(0,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'添加失败');
      res.json(result);
    }
     
  }

   // 获取单个
   static async productDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await productModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }


  // 删除
  static async productDelete(req,res){
    if(req.body.ids){
      const data = await productModel.deleteByIds(req.body.ids.split(','))
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
  static async productRemove(req,res){
    if(req.body.ids){
      const data = await productModel.removeByIds(req.body.ids.split(','))
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
  static async productEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.name,{required:true,min:2,max:40},'商品名称',res)
    // ||super.validator(req.body.charge_id,{required:true},'放单负责人',res)
    ||super.validator(req.body.price,{required:true},'商品价格',res)
    ||super.validator(req.body.commission,{required:true},'商品俑金',res)
    ||super.validator(req.body.service_price,{required:true},'服务费',res)
    ||super.validator(req.body.cooperate_status,{required:true},'合作状态',res)
    ) return;
  
    
    const data = await productModel.update({
      ...req.body
    },req.params.id)
    if(data){
      const result = super.handlerResponseData(0,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败');
      res.json(result);
    }
  }

  // 获取商品状态
  static async statusList(req,res){
    const list = await MetaDataModel.productStatusList()
    const result = super.handlerResponseData(0,'获取成功',{list:list});

    res.json(result);
  }
}

module.exports = ProductController