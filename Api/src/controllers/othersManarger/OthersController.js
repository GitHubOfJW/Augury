// 引入baseController
const BaseController = require('../BaseController'); 
 

const { Consumer,Shopkeeper,Product,Shop,Order,Admin }  = require('../../migrations/allModel')

const metaDateModel = require('../../models/metaManager/MetaData')

const Excel = require('exceljs')

const UploadUtil = require('../../utils/UploadUtil')

const ExcelUtil = require('../../utils/ExcelUtil')

const ejsexcel = require('ejsexcel')

const fse = require('fs-extra')

const path = require('path')
 
class OthersController extends BaseController {
  
  static async excelExport(req,res){
    const orderTemplate = path.join(path.dirname(__filename),'../../../static/xlsxTemplate/order.xlsx');
    res.setHeader('content-type',"application/force-download");
    res.setHeader('content-disposition','attachment; filename=order.xlsx');
    const s = fse.createReadStream(orderTemplate)
    s.pipe(res)
  }

  //管理管理员列表请求
  static async welcome(req,res){
    const memberCount = await Consumer.count()
    const shopkeeperCount = await Shopkeeper.count()
    const productCount = await Product.count()
    const shopCount = await Shop.count()
    const orderCount =  await Order.count()
    const adminCount = await Admin.count()

    res.json(super.handlerResponseData(0,'成功',{
      list:[
        {
          name:'会员数',
          count:memberCount
        },
        {
          name:'客户数',
          count:shopkeeperCount
        },
        {
          name:'商品数',
          count:productCount
        },
        {
          name:'店铺数',
          count:shopCount
        },
        {
          name:'订单数',
          count:orderCount
        },
        {
          name:'管理员数',
          count:adminCount
        }
    ]
    }))
  }
  static async excelExport1(req,res){
    if(req.body.data){
      try {
        const data = JSON.parse(req.body.data)
        // 读取模版
        const orderTemplate = path.join(path.dirname(__filename),'../../../static/xlsxTemplate/order.xlsx');

        const orderhdTemplate = path.join(path.dirname(__filename),'../../../static/xlsxTemplate/orderhd.xlsx');
        const orderhddesTemplate = path.join(path.dirname(__filename),'../../../static/xlsxTemplate/orderhd1.xlsx');

        // 读取一个模版
        const workBook = new Excel.Workbook()
        workBook.xlsx.readFile(orderhdTemplate).then(()=>{
          workBook.eachSheet(function(worksheet,sheetId){
            worksheet.name = "我改一下试试"
          })
          workBook.xlsx.writeFile(orderhddesTemplate)
        })
        // 生成新的模版
        
        const exlBuf = fse.readFileSync(orderTemplate)
        if(data.data){
          data.title = '样式表标题'
          const exlBuf2 = await ejsexcel.renderExcel(exlBuf, data);
          const xlsxConfig = UploadUtil.xlsxDirPath()
          const fileName = `${xlsxConfig.fileDirPath}${data.fileName||'table'}.xlsx`;
          fse.writeFileSync(fileName,exlBuf2);
        }
        const result = super.handlerResponseData(0,'导出成功')
        res.json(result);

      } catch (error) {
        const result = super.handlerResponseData(1,'导出失败,数据异常！')
        res.json(result);
      }
    }else{
      const result = super.handlerResponseData(1,'导出失败,数据异常！')
      res.json(result);
    }
  }

  static async excelExport1(req,res){
    
    if(req.body.data){
      try {
        const data = JSON.parse(req.body.data)

        if(!data.cols || !data.data){
          const result = super.handlerResponseData(1,'导出失败,数据异常！')
          res.json(result);
          return
        }

        // 生成 excel 表
        const workBook =  new Excel.Workbook()
        // 配置时间创建人
        workBook.created = new Date()
        workBook.creator = req.session.user.account

        const chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

        // 添加工作表
        const sheet = workBook.addWorksheet('第一张表');
        sheet.properties.defaultRowHeight = 25
    
        // 遍历行头
        const columns = []
        for(let col of data.cols){
          columns.push({
            header:col.title,
            key:col.field,
            width:32,
            height:42.5,
          })
        }
        sheet.columns = columns;
 
        let rowIndex = 1

        // // 标题
        // // data.sheetTitle = data.sheetTitle || '我是标题啊，建伟淘淘'
        // if(data.sheetTitle){
        //   // 合并单元格
        //   sheet.mergeCells(`${chars[0]}${rowIndex}:${chars[columns.length-1]}${rowIndex}`)
        //   const title = sheet.getRow(rowIndex)
        //   ExcelUtil.eachTitleStyle(title,(cell,index)=>{
        //     console.log('标题索引：'+index+" "+cell);
        //     cell.value = data.sheetTitle || "砸了"
        //   })
        //   rowIndex++
        // }

        // 行头
        const header =  sheet.getRow(rowIndex++)
        header.height = 30;
        ExcelUtil.eachHeaderStyle(header,(cell,index)=>{
          if(index < columns.length)
          cell.value = columns[index-1].header
        })
         

        for(let rowData of data.data){
          sheet.getRow(rowIndex).values = rowData
          sheet.getRow(rowIndex).height = 30;
          sheet.getRow(rowIndex).eachCell((cell,index)=>{
              cell.style = {
                alignment:{ vertical:'middle',horizontal:'center'},
                font:{size:12,color:{argb:'FF555555'}}
              }
          })
          sheet.getRow(rowIndex).commit()
          rowIndex ++
        }
        
        // 统计
        

        const xlsxConfig = UploadUtil.xlsxDirPath()
        const fileName = `${xlsxConfig.fileDirPath}${data.fileName||'table'}.xlsx`;
        workBook.xlsx.writeFile(fileName)
        .then(function(){
            console.log('生成 xlsx');
        });

        // 生成 结束

        const result = super.handlerResponseData(0,'成功',{
          url:'数据链接',
          data:data
        })
        res.json(result);

      } catch (error) {
        console.log(error)
        const result = super.handlerResponseData(1,'导出失败,数据异常！')
        res.json(result);
      }
    }
  }
}

module.exports = OthersController