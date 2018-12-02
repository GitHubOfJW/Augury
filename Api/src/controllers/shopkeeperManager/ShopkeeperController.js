// 引入baseController
const BaseController = require('../BaseController'); 
 

const shopkeeperModel = require('../../models/shopkeeperManager/Shopkeeper')

 
class ShopkeeperController extends BaseController {
  
  

  //管理管理员列表请求
  static async shopkeeperList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const username = req.query.username || '';
    const contact = req.query.contact || '';
    const match = req.query.match || '';
    const page = req.query.page || 1;
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      username:username,
      contact:contact,
      match:match
    };

    const count = await shopkeeperModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await shopkeeperModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async shopkeeperUpdate(req,res){
    if(req.params.id){
      const data = await shopkeeperModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await shopkeeperModel.findOne(req.params.id)
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
  static async shopkeeperAdd(req,res){
    if(super.validator(req.body.name,{required:true,min:2,max:6},'负责人姓名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'负责人电话',res)
    ||super.validator(req.body.wechat,{required:true},'微信号',res)
    ||super.validator(req.body.qq,{required:true},'QQ号',res)
    ) return;
  
    const data = await shopkeeperModel.insert({
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
  static async shopkeeperDelete(req,res){
    if(req.body.ids){
      const data = await shopkeeperModel.deleteByIds(req.body.ids.split(','))
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
  static async shopkeeperRemove(req,res){
    if(req.body.ids){
      const data = await shopkeeperModel.removeByIds(req.body.ids.split(','))
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

  static async shopkeeperDetail(req,res){ 
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await shopkeeperModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }
 

  // 编辑
  static async shopkeeperEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.name,{required:true,min:2,max:6},'负责人姓名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'负责人电话',res)
    ||super.validator(req.body.wechat,{required:true},'微信号',res)
    ||super.validator(req.body.qq,{required:true},'QQ号',res)
    ) return; 

    const data = await shopkeeperModel.update({
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

module.exports = ShopkeeperController