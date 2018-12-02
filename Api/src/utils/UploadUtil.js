const path =  require('path')
const fse =  require('fs-extra')
const fs = require('fs')
const moment = require('moment')

const gm = require('gm').subClass({imageMagick: true});

const { domain } = require('../configure/config')

module.exports =  class UploadUtil {
   
  static imgsDirPath(){
    const hourUrl = moment().format('YYYYMMDDHH');
    const fileDirPath = path.join(path.dirname(__filename),`../../public/resource/imgs/${hourUrl}/`)
    UploadUtil.syncDirPath(fileDirPath)
    const serverDirPath = `${domain}/public/resource/imgs/${hourUrl}`.replace('//public','/public')
    return {
      fileDirPath,
      serverDirPath
    }
  }

  

  // 保存图片 去掉 _[n] 表示图片在使用
  static saveImgPath(imgUrl){
    if(!imgUrl){
      return null
    }
    // 解析出图片的相对根工程的路径 /public/resource/imgs ....
    const img_url = imgUrl.replace(domain,'')
    // 定位到该文件
    const filePath =  path.join(path.dirname(__filename),'../../',img_url)
    const destFilePath = filePath.replace('_[n]','')
    if(fse.pathExistsSync(filePath)){
      fse.renameSync(filePath,destFilePath)
    }
    UploadUtil.saveThumbImg(img_url.replace('_[n]',''))
    const result =  {
      imgUrl:img_url.replace('_[n]',''),
      thumb_imgUrl:this.getThumImgUrl(img_url.replace('_[n]',''))
    }
    return result
  }

  // 删除图片
  static removeImgPath(imgUrl){
    if(!imgUrl){
      return false
    }
    // 解析出图片的相对根工程的路径 /public/resource/imgs ....
    const img_url = imgUrl.replace(domain,'')
    // 定位到该文件
    const filePath =  path.join(path.dirname(__filename),'../../',img_url)
    if(fse.pathExistsSync(filePath)){
      fse.unlinkSync(filePath)
    }
    if(fse.pathExistsSync(this.getThumImgUrl(filePath))){
      fse.unlinkSync(this.getThumImgUrl(filePath))
    }
    return true
  }

  // 保存缩略图
  static saveThumbImg(imagePath){
    const imageFilePath =  path.join(path.dirname(__filename),'../../',imagePath)
    if(fse.pathExistsSync(imageFilePath)){
      const dstUrl =  this.getThumImgUrl(imageFilePath)
      const imgObj = gm(imageFilePath)
      imgObj.resize(imgObj.size().width * 0.5).write(dstUrl,function(err){
        console.log(err)
      })
      return dstUrl
    }
    return imageFilePath
  }

  // 获取缩略图url
  static getThumImgUrl(imageFilePath){
    const name =  path.basename(imageFilePath,path.extname(imageFilePath))
    return imageFilePath.replace(name,`thumb_${name}`)
  }
  
  // 创建路径
  static  syncDirPath(path){ 
      // 如果不存在路径
      if(!fse.pathExistsSync(path)){
         if(fse.mkdirpSync(path)){
           return true;
         }else{
           return false
         }
      }
      return true
  }

  
}