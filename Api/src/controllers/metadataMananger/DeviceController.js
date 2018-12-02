// 引入baseController
const BaseController = require('../BaseController'); 

const { domain } = require('../../configure/config')

const deviceModel = require('../../models/metaManager/Device')

const fse = require('fs-extra')

const UploadUtil = require('../../utils/UploadUtil')
 
class DeviceController extends BaseController {
  
  

  //管理管理员列表请求
  static async deviceList(req,res){
    const start = req.query.start || '';
    const end = req.query.end || '';
    const match = req.query.match || '';
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 20);
    
    const conditions = {
      page:page,
      start:start,
      end:end,
      match:match
    };

    const count = await deviceModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await deviceModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }
 
  // 添加设备请求
  static async deviceAdd(req,res){
    if(super.validator(req.body.name,{required:true},'设备名称',res)
    // ||super.validator(req.body.device_code,{required:true},'设备编号',res)
    ||super.validator(req.body.sort,{required:true,isInt:true},'设备排序',res)
    // ||super.validator(req.body.imgUrl,{required:true},'设备图片',res)
    ) return;
  
    if(req.body.imgUrl){
      // 处理数据
      const urls =  UploadUtil.saveImgPath(req.body.imgUrl)
      if(urls){
        req.body.imgUrl = urls.imgUrl
        req.body.thumb_imgUrl = urls.thumb_imgUrl
      }else{
        delete req.body.imgUrl
        delete req.body.thumb_imgUrl
      }
    }

    const data = await deviceModel.insertOrUpdate({
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
  static async deviceDelete(req,res){
    if(req.body.ids){
      const data = await deviceModel.deleteByIds(req.body.ids.split(','))
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
  static async deviceRemove(req,res){
    if(req.body.ids){
      const data = await deviceModel.removeByIds(req.body.ids.split(','))
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
  static async deviceEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.name,{required:true},'设备名称',res)
    // ||super.validator(req.body.device_code,{required:true},'设备编号',res)
    ||super.validator(req.body.sort,{required:true,isInt:true},'设备排序',res)
    ) return;

    // 处理数据
    if(req.body.imgUrl && req.body.imgUrl !== req.body.old_imgUrl){
      // 移除旧图
      UploadUtil.removeImgPath(req.body.old_imgUrl)
      // 图片不同 删除旧图片
      const urls =  UploadUtil.saveImgPath(req.body.imgUrl)
      if(urls){
        req.body.imgUrl = urls.imgUrl
        req.body.thumb_imgUrl = urls.thumb_imgUrl
      }else{
        delete req.body.imgUrl
        delete req.body.thumb_imgUrl  
      }
    }else{
      delete req.body.imgUrl
      delete req.body.thumb_imgUrl
    }
   
    const data = await deviceModel.update({
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
  static async deviceDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await deviceModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }
}

module.exports = DeviceController