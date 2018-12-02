const path =  require('path')
const fse =  require('fs-extra')
const fs = require('fs')
const moment = require('moment')

const Excel = require('exceljs')

const UploadUtil = require('./UploadUtil')

const { domain } = require('../configure/config')

module.exports =  class ExcelUtil {
  static clearXlsx(){
    const fileDirPath = path.join(path.dirname(__filename),'../../public/resource/xlsx/')
    this.clearDir(fileDirPath)
  }

  static clearDir(dirpath){
      const time = moment().add(-1,'hours').format('YYYYMMDDHH');

      if(fse.pathExistsSync(dirpath)){
        let dirs = fse.readdirSync(dirpath)
        for(let pathStr of dirs){
          const abPath = path.join(dirpath,pathStr)
          // 遍历判断文件还是文件夹
          const stat = fse.statSync(abPath)
           if(stat.isFile()){ 
             if(fse.pathExistsSync(abPath)){
              fse.remove(abPath)
             }
           }else if(stat.isDirectory()){
              const lastComPath = abPath.substr(abPath.lastIndexOf('/')+1);
              if(lastComPath < time){
                this.clearDir(abPath)
                fse.removeSync(abPath)
              }
           }
        }
      }
  }

  static xlsxDirPath(){
    const hourUrl = moment().format('YYYYMMDDHH');
    const fileDirPath = path.join(path.dirname(__filename),`../../public/resource/xlsx/${hourUrl}/`)
    UploadUtil.syncDirPath(fileDirPath)
    const serverDirPath = `${domain}/public/resource/xlsx/${hourUrl}`.replace('//public','/public')
    return {
      fileDirPath,
      serverDirPath
    }
  }

  // 创建数据模版 Buffer
  static async createExcelTemplate(data){
       // 读取模版
       const fileIndex = Math.ceil(data.length / 3) * 3
       if(fileIndex > 27 ){
         fileIndex = 31
       }
       const orderTemplate = path.join(path.dirname(__filename),`../../static/xlsxTemplate/order.xlsx`);
        // 读取一个模版
        const workBook = new Excel.Workbook()
        let sheetIndex = 0;
        await workBook.xlsx.readFile(orderTemplate)
        workBook.eachSheet(function(worksheet,sheetId){
            // 设置sheet名称
            if(sheetIndex < data.length){
              worksheet.name = data[sheetIndex++].key || sheetIndex
            }
        })

        
       return await workBook.xlsx.writeBuffer()
  }
 
  // 修改模版
  static async changeTemplate(dirpath){

    if(fse.pathExistsSync(dirpath)){
      let dirs = fse.readdirSync(dirpath)
      for(let pathStr of dirs){
        const abPath = path.join(dirpath,pathStr)
        // 遍历判断文件还是文件夹
        const stat = fse.statSync(abPath)
         if(stat.isFile()){ 
            
           if(fse.pathExistsSync(abPath) && abPath.indexOf('.xlsx') > 0 ){
             //读取文件
             console.log(abPath,'读取路径')
            const workBook = new Excel.Workbook()
            await workBook.xlsx.readFile(abPath)
            workBook.eachSheet((sheet,id)=>{
               console.log(id,sheet.name);
               const index = parseInt(sheet.name) - 1
               sheet.getCell("E5").value='<%#"=SUM(E3:E"+(_row-1)+")"%>'
               sheet.getCell("E6").value='<%#"=SUM(F3:F"+(_row-2)+")"%>'
            })
            workBook.xlsx.writeFile(abPath)
           }
         }else if(stat.isDirectory()){
            this.changeTemplate(abPath) 
         }
      }
    }
}
  

}