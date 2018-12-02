// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authCateModel =  require('../../models/adminManager/AuthCate')
 
class CateController extends BaseController {
  
   // 状态更新
  static async cateUpdate(req,res){
    if(req.params.id){

      const data = await authCateModel.update(req.body,req.params.id);
      if(data){
        const result = super.handlerResponseData(0,'修改成功');
        res.json(result);
      }else{
        const result = super.handlerResponseData(0,'修改失败');
        res.json(result);
      }
      
    }else{
      const result = super.handlerResponseData(1,'修改失败，缺少唯一标识');
      res.json(result);
    }
  }
 
   //权限分类列表请求
  static async cateList(req,res){
    const page = req.query.page || 1;
    const pageSize = parseInt(req.query.limit || 20);
    
    const count = await authCateModel.totalCount();

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
  
    const list = await authCateModel.list(page,pageSize)

    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 权限列表
  static async cateAllList(req,res){
    const list = await authCateModel.list(-1,-1,!!req.query.auths)
    const result = super.handlerResponseData(0,'成功',{list:list});
    res.json(result);
  }
  // 添加权限分类
  static async cateAdd(req,res){
    if(req.body.name){
      const result = await authCateModel.insert({
        name: req.body.name
      })

      if(result){
        const result = super.handlerResponseData(0,'添加成功！');
        res.json(result); 
      }else{
        const result = super.handlerResponseData(1,'缺少分类名称');
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(1,'缺少分类名称');
      res.json(result);
    }
  }


  // 删除
  static async cateDelete(req,res){
    if(req.body.ids){
      const data = await cateModel.deleteByIds(req.body.ids.split(','))
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
  static async cateRemove(req,res){
    if(req.body.ids){
      const data = await authCateModel.removeByIds(req.body.ids.split(','))
      // if(data){
        const result = super.handlerResponseData(0,'删除成功');
        res.json(result);
      // }else{
      //   const result = super.handlerResponseData(1,'删除失败');
      //   res.json(result);
      // }
      
    }else{
      const result = super.handlerResponseData(1,'删除失败，缺少参数');
      res.json(result);
    }
  }
}

module.exports =  CateController