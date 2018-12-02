
/**
 *  注意配置文件中的控制器名称Key要保持一致 
 *  articlePage articleApi controllers 中的所有控制器名称key要保持一致
 *  具体功能路由配置重的 method 要与控制器中的方法名一致
 */

// 所有的路由都配置导这里
const PATCH  = 'patch'
const DELETE = 'delete'
const POST = 'post'
const GET = 'get'
 
// 调用api接口的路由
const adminApi = {
  UploadController:{
    name:'图片上传',
    routers:{
      upload:{
        path:'/api/v1/image/upload',
        desc:'图片/视频上传',
        method:'imageUpload',
        type:POST,
        selected:true
      }
    }
  }
}


// 导出
module.exports = {
  adminApi
}