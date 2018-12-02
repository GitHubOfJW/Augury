// 引入baseController
const BaseController = require('../BaseController'); 

const { domain } = require('../../configure/config')

const wechatModel = require('../../models/AdminInfoManager/Wechat')

const fse = require('fs-extra')

const UploadUtil = require('../../utils/UploadUtil')
 
class WechatController extends BaseController {
  
  

  //管理管理员列表请求
  static async wechatList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const match = req.query.match || '';
    const admin_id = req.query.admin_id || '';
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      match:match,
      admin_id:admin_id
    };

    const count = await wechatModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await wechatModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }
 
  // 添加礼品请求
  static async wechatAdd(req,res){
    if(super.validator(req.body.wechat_id,{required:true},'微信编号',res)
    ||super.validator(req.body.wechat,{required:true},'微信号',res)
    ||super.validator(req.body.wechat_name,{required:true},'微信昵称',res)
    ||super.validator(req.body.password,{required:true},'微信密码',res)
    ||super.validator(req.body.mobile,{required:true,mobile:true},'绑定手机',res)
    ||super.validator(req.body.real_name,{required:true},'实名制姓名',res)
    ||super.validator(req.body.pay_password,{required:true},'支付密码',res)
    ||super.validator(req.body.device_id,{required:true},'设备',res)
    ) return;
  
    const data = await wechatModel.insertOrUpdate({
      ...req.body
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
  static async wechatDelete(req,res){
    if(req.body.ids){
      const data = await wechatModel.deleteByIds(req.body.ids.split(','))
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
  static async wechatRemove(req,res){
    if(req.body.ids){
      const data = await wechatModel.removeByIds(req.body.ids.split(','))
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
  static async wechatEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.wechat_id,{required:true},'微信编号',res)
    ||super.validator(req.body.wechat,{required:true},'微信号',res)
    ||super.validator(req.body.wechat_name,{required:true},'微信昵称',res)
    ||super.validator(req.body.password,{required:true},'微信密码',res)
    ||super.validator(req.body.mobile,{required:true,mobile:true},'绑定手机',res)
    ||super.validator(req.body.real_name,{required:true},'实名制姓名',res)
    ||super.validator(req.body.pay_password,{required:true},'支付密码',res)
    ||super.validator(req.body.device_id,{required:true},'设备',res)
    ) return;
  
    
    const data = await wechatModel.update({
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

  // 获取单个
  static async wechatDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await wechatModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }
}

module.exports = WechatController