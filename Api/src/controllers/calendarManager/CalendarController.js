// 引入baseController
const BaseController = require('../BaseController'); 

// moment
const moment = require('moment')
 
const {
    Solar,
    Lunar
  } =  require('../../utils/CalendarUtil')
 
class CalendarController extends BaseController {
  
  //列表请求
  static async getLunar(req,res){
    // 判断日期是否存在
    if(super.validator(req.query.date,{required:true,isDate:true},'参数',res)){
        return
    }
    
    // 日期转换
    const date =  moment(req.query.date).toDate()
    const solar = new  Solar(date)
    //  返回json
    const result =  super.handlerResponseData(0,'查询成功',solar)
    res.json(result)
  }
 
}

module.exports = CalendarController