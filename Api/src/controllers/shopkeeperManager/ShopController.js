// 引入baseController
const BaseController = require('../BaseController'); 
 

const shopModel = require('../../models/shopkeeperManager/Shop')

 
class ShopController extends BaseController {
  
  

  //管理管理员列表请求
  static async shopList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const contact = req.query.contact || '';
    const match = req.query.match || '';
    const page = req.query.page || 1;
    const shopkeeper_id = req.query.shopkeeper_id || 0
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      contact:contact,
      match:match,
      shopkeeper_id:shopkeeper_id
    };

    const count = await shopModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await shopModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async shopUpdate(req,res){
    if(req.params.id){
      const data = await shopModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await shopModel.findOne(req.params.id)
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
  static async shopAdd(req,res){
    if(super.validator(req.body.wangwang,{required:true,min:2,max:20},'旺旺名称',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.sub_account,{required:true},'子账号',res)
    ||super.validator(req.body.password,{required:true},'子账号',res)
    ) return;
  
    const data = await shopModel.insert({
      ...req.body,
      admin_id:req.session.user.id
    })

    if(data){
      const result = super.handlerResponseData(0,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'添加失败');
      res.json(result);
    }
     
  }


  // 删除
  static async shopDelete(req,res){
    if(req.body.ids){
      const data = await shopModel.deleteByIds(req.body.ids.split(','))
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
  static async shopRemove(req,res){
    if(req.body.ids){
      const data = await shopModel.removeByIds(req.body.ids.split(','))
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
 
  static async shopDetail(req,res){ 
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await shopModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }

  // 编辑
  static async shopEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.wangwang,{required:true,min:2,max:20},'旺旺名称',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.sub_account,{required:true},'子账号',res)
    ||super.validator(req.body.password,{required:true},'子账号',res)
    ) return;
  
    const data = await shopModel.update({
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
}

module.exports = ShopController