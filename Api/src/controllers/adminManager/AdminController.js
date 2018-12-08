// 引入baseController
const BaseController = require('../BaseController');

const adminModel =  require('../../models/adminManager/Admin')
 
class AdminController extends BaseController {
  
  // 退出成功
  static adminLogout(req,res){
    delete req.session.user 
    res.json(super.handlerResponseData(0,"退出成功"));
  }

  // 登录
  static async adminLogin(req,res){
    // 获取登录数据
    if(req.body && req.body.username && req.body.password){
      const model = await adminModel.adminLogin(req.body.username,req.body.password);
      if(model){
        // 设置model到sesson中
        req.session.user = model;
        res.json(super.handlerResponseData(0,"登录成功"));
      }else{
        res.json(super.handlerResponseData(1,"账号或密码不存在"));
      }
    }else{
      res.json(super.handlerResponseData(1,"缺少请求参数"));
    }
  }

  static async adminInfo(req,res){
     // 获取基本信息
     if(req.session.user){
       res.json(super.handlerResponseData(0,'获取成功',req.session.user))
     }else{
       res.json(super.handlerResponseData(1,'获取失败',{}))
     }
  }

  //管理管理员列表请求
  static async adminList(req,res){
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

    const count = await adminModel.totalCount(conditions);

    // 计算页数
    const totalPage = Math.floor((count +  pageSize - 1) / pageSize);
    
    const list = await adminModel.list(page,pageSize,conditions)
 
    const data =  {
      data:list,
      count:count,
      totalPage:totalPage
    }
    const result = super.handlerListResponseData(list.length > 0 ? 0:1,data,list.length <= 0 ? '暂未查询到相关数据':'成功');
    res.json(result);
  }

  // 状态更新
  static async adminUpdate(req,res){
    if(req.params.id){
      const data = await adminModel.update(req.body,req.params.id);
      if(data){
        if(req.session.user && req.session.user.id == req.params.id){
          const model = await adminModel.findOne(req.params.id)
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
  static async adminAdd(req,res){
    if(super.validator(req.body.account,{required:true},'用户名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.jst_account,{required:true},'聚水潭账号',res)
    ||super.validator(req.body.qq,{required:true},'QQ号',res)
    ||super.validator(req.body.qq_name,{required:true},'QQ昵称',res)
    // ||super.validator(req.body.email,{required:true,isEmail:true},'邮箱',res)
    ||super.validator(req.body.name,{required:true,min:2,max:6},'姓名',res)
    ||super.validator(req.body.password,{required:true,regular:{enable:true,regx:/[a-z0-9A-Z]{6,12}/,prompt:"密码必须为6-12大小写字母、数字组合"}},'密码',res)
    ||super.validator(req.body.role_id,{required:true,isInt:true},'角色',res)
    ||super.validator(req.body.enable,{required:true,isBoolean:true},'启用状态',res)
    ) return;

    let count = await adminModel.has({
        account:req.body.account
    })
    if(count>0){
      const result = super.handlerResponseData(1,'用户名已存在');
      res.json(result);
      return;
    }

    count = await adminModel.has({
      mobile:req.body.mobile
    })
    if(count>0){
      const result = super.handlerResponseData(1,'手机号已存在');
      res.json(result);
      return;     
    }
    
    const data =  adminModel.insert(req.body)
    if(data){
      const result = super.handlerResponseData(0,'添加成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'添加失败');
      res.json(result);
    }
     
  }


  // 删除
  static async adminDelete(req,res){
    if(req.body.ids){
      const data = await adminModel.deleteByIds(req.body.ids.split(','))
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
  static async adminRemove(req,res){
    if(req.body.ids){
      const data = await adminModel.removeByIds(req.body.ids.split(','))
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

  // 获取单个
  static async adminDetail(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }
    const data = await adminModel.findOne(req.params.id)

    if(data){
      const result = super.handlerResponseData(0,'获取成功',data);
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'获取失败');
      res.json(result);
    }
  }
 
  // 编辑
  static async adminEdit(req,res){
    if(!req.params.id){
      const result = super.handlerResponseData(1,'未获取到对应的id');
      res.json(result);
      return;
    }

    if(super.validator(req.body.account,{required:true},'用户名',res)
    ||super.validator(req.body.mobile,{required:true,isMobile:true},'手机号',res)
    ||super.validator(req.body.jst_account,{required:true},'聚水潭账号',res)
    ||super.validator(req.body.qq,{required:true},'QQ号',res)
    ||super.validator(req.body.qq_name,{required:true},'QQ昵称',res)
    // ||super.validator(req.body.email,{required:true,isEmail:true},'邮箱',res)
    ||super.validator(req.body.name,{required:true,min:2,max:6},'姓名',res)
    // ||super.validator(req.body.password,{required:true,regular:{enable:true,regx:/[a-z0-9A-Z]{6,12}/,prompt:"密码必须为6-12大小写字母、数字组合"}},'密码',res)
    // ||super.validator(req.body.roleId,{required:true,isInt:true},'角色',res)
    ||super.validator(req.body.enable,{required:true,isBoolean:true},'启用状态',res)
    ) return;

    let count = await adminModel.has({
        account:req.body.account
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(1,'用户名已存在');
      res.json(result);
      return;     
    }

    count = await adminModel.has({
      mobile:req.body.mobile
    },req.params.id)
    if(count>0){
      const result = super.handlerResponseData(1,'手机号已存在');
      res.json(result);
      return;     
    }
    
    const data =  adminModel.update(req.body,req.params.id)
    if(data){
      const result = super.handlerResponseData(0,'修改成功');
      res.json(result);
    }else{
      const result = super.handlerResponseData(1,'修改失败');
      res.json(result);
    }
     
  }
}

module.exports = AdminController