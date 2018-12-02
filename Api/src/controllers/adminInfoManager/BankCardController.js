// 引入baseController
const BaseController = require('../BaseController'); 

const { domain } = require('../../configure/config')

const bankCardModel = require('../../models/AdminInfoManager/BankCard')
const metaDataModel = require('../../models/metaManager/MetaData')

const fse = require('fs-extra')

const UploadUtil = require('../../utils/UploadUtil')
 
class BankCardController extends BaseController {
  
  

  //管理管理员列表请求
  static async bankCardList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const match = req.query.match || '';
    const wechat_id = req.query.wechat_id || '';
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      match:match,
      wechat_id:wechat_id
    };

    const count = await bankCardModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await bankCardModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }
 
  // 添加礼品请求
  static async bankCardAdd(req,res){
    if(super.validator(req.body.card_num,{required:true},'银行卡号',res)
    ||super.validator(req.body.bank_id,{required:true},'所属银行',res)
    ||super.validator(req.body.real_name,{required:true},'预留姓名',res)
    ||super.validator(req.body.bank_mobile,{required:true,mobile:true},'预留手机',res)
    ||super.validator(req.body.abv_account,{required:true},'网银账号',res)
    ||super.validator(req.body.abv_password,{required:true},'网银密码',res)
    ||super.validator(req.body.abv_link,{required:true},'网银网址',res)

    ) return;
  
    const data = await bankCardModel.insertOrUpdate({
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
  static async bankCardDelete(req,res){
    if(req.body.ids){
      const data = await bankCardModel.deleteByIds(req.body.ids.split(','))
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
  static async bankCardRemove(req,res){
    if(req.body.ids){
      const data = await bankCardModel.removeByIds(req.body.ids.split(','))
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
  static async bankCardEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.card_num,{required:true},'银行卡号',res)
    ||super.validator(req.body.bank_id,{required:true},'所属银行',res)
    ||super.validator(req.body.real_name,{required:true},'预留姓名',res)
    ||super.validator(req.body.bank_mobile,{required:true,mobile:true},'预留手机',res)
    ||super.validator(req.body.abv_account,{required:true},'网银账号',res)
    ||super.validator(req.body.abv_password,{required:true},'网银密码',res)
    ||super.validator(req.body.abv_link,{required:true},'网银网址',res)
    ) return;
  
    const data = await bankCardModel.update({
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
  static async bankCardDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await bankCardModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }
  
  // 银行卡列表
  static async bankList(req,res){
    
    const data = metaDataModel.bankList()

    const result = super.handlerResponseData(0,'获取成功',{ list:data});

    res.json(result);

  }
}

module.exports = BankCardController