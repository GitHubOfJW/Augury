
const validator = require('validator')

// 写一个baseController，用于做一些公共的处理
class BaseController {
  // 用户处理返回的数据
  static handlerResponseData(status = 0,message = '',data = {}){
    return { 
      code: status,
      data: data,
      message: message
    };
  }
  static handlerListResponseData(status = 0,data = {},message = ''){
    return { 
      code: status,
      ...data,
      msg: message
    };
  }

  static setHtmlHeader(res){
    res.setHeader("Content-Type", "text/html");
    res.setHeader('charset','utf-8');
  }

  static validator(data = '',rules={
    required:false,
    isEmail:false,
    isMobile:false,
    isInt:false,
    isBoolean:false,
    min:undefined,
    max:undefined,
    regular:{ enable:false,regx:'',prompt:''}
  },name='',res){
      if(rules.required && (!data && typeof data === 'string' || validator.isEmpty(data))){
        const result = BaseController.handlerResponseData(1,`${name} 不能为空`)
        res.json(result);
        return true;
      }else if(rules.isEmail && !validator.isEmail(data)){
        const result = BaseController.handlerResponseData(1,`${name} 不合法`)
        res.json(result);
        return true;
      }else if(rules.isMobile && !validator.isMobilePhone(data,'zh-CN')){
        const result = BaseController.handlerResponseData(1,`${name} 不合法`)
        res.json(result);
        return true;
      }else if(rules.isBoolean && !validator.isBoolean(data) && (!validator.isInt(data) || data%2 <= 1)){
        const result = BaseController.handlerResponseData(1,`${name} 必须为0或者1`)
        res.json(result);
        return true;
      }else if(rules.isInt && !validator.isInt(data+0)){
        const result = BaseController.handlerResponseData(1,`${name} 必须为整数`)
        res.json(result);
        return true;
      }else if(rules.min && rules.max && data && typeof data =='string' && data.trim().length < rules.min && data.trim().length > rules.max){
        const result = BaseController.handlerResponseData(1,`${name} 必须为 ${rules.min}到${rules.max}个字符`)
        res.json(result);
        return true;
      }else if(rules.min && data && typeof data =='string' && data.trim().length < rules.min){
        const result = BaseController.handlerResponseData(1,`${name} 不得少于${rules.min}个字符`)
        res.json(result);
        return true;
      }else if(rules.max && data && typeof data =='string' && data.trim().length > rules.max){
        const result = BaseController.handlerResponseData(1,`${name} 不得多于${rules.max}个字符`)
        res.json(result);
        return true;
      }else if(rules.regular && rules.regular.enable && data && !rules.regular.regx.test(data)){
        const result = BaseController.handlerResponseData(1,rules.regular.prompt)
        res.json(result);
        return true;
      }

      return false
  }

  // 处理分页逻辑
  static pagination(jumpPage,totalPage){

    let paginations = [];

    if(totalPage <= 1){
      return paginations;
    }

    let startPage = jumpPage - 2 > 0 ? jumpPage - 2 : 1;
    let endPage =  startPage + 4 > totalPage ? totalPage : startPage + 4;

    if(endPage - 4 >= 1 && endPage - 4 < startPage){
      startPage =  endPage - 4;
    }

    
    for(let i = startPage ; i <= endPage ; i++){
      paginations.push({
        page:i,
        text:i,
        className:'num'
      })
    }

    // 添加<<   >>
    if(startPage > 1){
      let preGroupStart = endPage - 4 > 0 ? endPage - 4 : 1;
      paginations.unshift({
        page:preGroupStart,
        text:"<<",
        className:'pre'
      })
    }
    if(endPage < totalPage){
      let nextGroupEnd =  startPage + 4 > totalPage ? totalPage - 4 : startPage + 4;
      paginations.push({
        page:nextGroupEnd,
        text:">>",
        className:'next'
      })
    }

    return paginations
  }
}

module.exports =  BaseController;