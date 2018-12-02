// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')

const authModel =  require('../../models/adminManager/Auth')
const authCateModel = require('../../models/adminManager/AuthCate')
const roleModel =  require('../../models/adminManager/Role')
 
class RoleController extends BaseController {
   
  // 状态更新
  static async roleUpate(req,res){
    if(req.params.id){

      const data = await roleModel.update(req.body,req.params.id);
      if(data){
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

  //权限分类列表请求
  static async roleList(req,res){
    const page = req.query.page || 1;
    const pageSize = parseInt(req.query.limit || 10);
    const name =  req.query.name || '';
    const start = req.query.start || '';
    const end = req.query.end || '';
    
    const conditions = {
      page:page,
      name:name,
      start:start,
      end:end
    };

    const count = await roleModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
  
    const list = await roleModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 获取所有角色
  static async roleAllList(req,res){
    const list = await roleModel.list(-1,-1,true)
    const result = super.handlerResponseData(0,'成功',{list:list});
    res.json(result);
  }

  // 角色管理
  static roleListPage(req,res){
    super.setHtmlHeader(res);

    // 获取权限
    const cateList = authCateModel.list(-1, -1);
    res.render('admin/admin-role.html',{
      cateList
    });
  }

   
  // 添加权限请求
  static async roleAdd(req,res){
    if(super.validator(req.body.name,{required:true},'角色名称',res)
      ||super.validator(req.body.authIds,{required:true},'拥有权限',res)
    ) return;
 
    const data =  roleModel.insert({
      name:req.body.name,
      authIds:(typeof req.body.authIds == 'number')? [req.body.authIds] : req.body.authIds,
      remark:req.body.remark,
      enable:req.body.enable
    })
    if(data){
      const result = super.handlerResponseData(0,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'添加失败');
      res.json(result);
    }
  }

  // 修改请求
  static roleEdit(req,res){
    if(super.validator(req.params.id,{required:true},'唯一标标识',res)
      ||super.validator(req.body.name,{required:true},'角色名称',res)
      ||super.validator(req.body.authIds,{required:true},'拥有权限',res)
    ) return;
  
    const data =  roleModel.update({
      name:req.body.name,
      authIds:(typeof req.body.authIds == 'number')? [req.body.authIds] : req.body.authIds,
      remark:req.body.remark,
      enable:req.body.enable
    },req.params.id)
    if(data){
      const result = super.handlerResponseData(0,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败');
      res.json(result);
    }
    
  }
  

  static async roleDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    const data = await roleModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }

  static configAuthList(){
    const authMap = {}

    for(let controllerKey of Object.keys(adminApi)){
      if(!authMap[controllerKey]){
        authMap[controllerKey] = {
           api:[],
           page:[]
         }
      }
      for(let routerKey of Object.keys(adminApi[controllerKey])){
        if(!adminApi[controllerKey][routerKey].selected){
          authMap[controllerKey].api.push(adminApi[controllerKey][routerKey]);
        }
      }
    }
    
    const authList = []
    for(let controllerKey of Object.keys(authMap)){
        authList.push({
          key:controllerKey,
          controller:authMap[controllerKey]
        })
    }

    return authList;
  }

  // 删除
  static async roleDelete(req,res){
    if(req.body.ids){
      const data = await roleModel.deleteByIds(req.body.ids.split(','))
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
  static async roleRemove(req,res){
    if(req.body.ids){
      const data = await roleModel.removeByIds(req.body.ids.split(','))
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
}

module.exports = RoleController