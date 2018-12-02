layui.define(['form','element'], function(exports) {

  const $ =  layui.jquery,
  element = layui.element;

  // ajax默认处理的方法
  const ajaxDefaultFns = {
    success: (data) => {

    },
    error: (data) => {
      
    },
    completed: (data) => {

    }
  }
  // 全局模块
  class Global {

    constructor(){
      window.emitEvents = {};
    }

    // 获取当前最后日期
    getTodayLastTime(){
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth()+1;
      const day = date.getDate();
      return `${year}-${month}-${day} 23:59:59`
    }

    // 定义到jQuery全局变量下-文件下载
    download(url,params = {},method) {
        const form = $('<form method="'+method+'" action="' + url + '">');
        $.each(params, function(k, v) {
            form.append($('<input type="hidden" name="' + k +'" value="' + v + '">'));
        });
        $('body').append(form);
        form.submit(); //自动提交
    }

    getUser(){
      if(layui.data('user')){
        return layui.data('user').user || {}
      }
      return {}
    }

    ajaxSetup($){
      // 跨域携带cookie
      $.ajaxSetup({
        xhrFields:{withCredentials: true},
        crossDomain:true
      })
    }

    // 全局路由
    absoluteUrl(relativeUrl){
       relativeUrl = `/${relativeUrl}`.replace('//','/');
      //  return `http://testapi.qcgongju.com${relativeUrl}`;
      //  return `http://api.qcgongju.com${relativeUrl}`;
      return `http://localhost:3000${relativeUrl}`;
    }

    // 封装ajax 模块，用于发送请求
    ajax(options){

      // 备份方法
      const fns = {
        success: options.success || ajaxDefaultFns.success,
        error: options.error || ajaxDefaultFns.error,
        completed:options.completed || ajaxDefaultFns.completed
      }

      options.url = this.absoluteUrl(options.url)

      options.spcials = options.spcials || {}

      // 跨域携带cookie
      options.xhrFields = {withCredentials: true},
      options.crossDomain =  true

      // 拦截方法
      options.success = (data) => { 
        if(data.isLogout){
          location.href = '/pages/login'
          return;
        }
         fns.success(data)
      }
      options.error = (data) => {
        fns.error(data)
      }

      return $.ajax(options);
    }

    // 获取基本信息
    getInfo(callBack){
      this.ajax({
        url:'/api/v1/info',
        type:'POST',
        success:function(data){
          if(!data.code){
            layui.data('user',{
              key:'user',
              value:data.data
            })
          }
          if(callBack && typeof callBack == 'function'){
            callBack(!data.code == 1);
          }
        },
        error:function(data){
          if( callBack && typeof callBack == 'function'){
            callBack(false);
          }
        }
      })
    }

     dialog_show(title,url,w,h,callback){
      if (title == null || title == '') {
          title=false;
      };
      if (url == null || url == '') {
          url="404.html";
      };
      if (w == null || w == '') {
          w=($(window).width()*0.95);
      };
      if (h == null || h == '') {
          h=($(window).height() - 50);
      };
      layer.open({
          type: 2,
          area: [w+'px', h +'px'],
          fix: false, //不固定
          maxmin: true,
          shadeClose: true,
          shade:0.4,
          title: title,
          content: url,
          success:callback
      });
    }

    // 添加菜单选项卡
    tabAdd(title,url,id){
       //新增一个Tab项
       element.tabAdd('xbs_tab', {
         title: title 
         ,content: '<iframe tab-id="'+id+'" frameborder="0" src="'+url+'" scrolling="yes" class="x-iframe"></iframe>'
         ,id: id
       })
     }

     tabDelete(othis){
       //删除指定Tab项
       element.tabDelete('xbs_tab', '44'); //删除：“商品管理”
       othis.addClass('layui-btn-disabled');
     }

     tabChange(id){
       //切换到指定Tab项
       element.tabChange('xbs_tab', id); //切换到：用户管理
     }
    
    /*关闭弹出框口*/
    dialog_close(){
      var index = parent.layer.getFrameIndex(window.name);
      parent.layer.close(index);
    }
     

    on(eventName,fn){
      window.top.emitEvents && (window.top.emitEvents[eventName] = fn);
      //  console.log(Object.keys(window.top.emitEvents))
    }

    emit(eventName,values){
      // console.log(Object.keys(window.top.emitEvents))
      if(!window.top.emitEvents || !window.top.emitEvents.hasOwnProperty(eventName)){
        return;
      }

      const fn = window.top.emitEvents[eventName];
      if(fn && typeof fn == 'function'){
        try {
          fn(values); 
        } catch (error) {
          delete window.top.emitEvents[eventName]  
          console.log('事件通知出现问题')
        }
        
      }
    }

    clearEvents(eventName){
        if(eventName){
          delete window.top.emitEvents[eventName]
        }else{
          window.top.emitEvents = {};
        }
    }

    // 匹配字符串
    matchSearch(keywords,text){
      let content = text
      if(keywords && keywords.length && keywords.length> 0 ){
         for(let word of keywords){
            content = content.replace(word,`<span class='x-red'>${word}</span>`)
         }
      }

      return content;
    }


    // 获取参数
    getParamsWithUrl(url){
      if(!url){
        return {}
      }
      let str = url;
      let index = 0
      if(!!str.indexOf('#/')){
        index =  str.indexOf('#/')+2
      }else{
        str = location.href
        index =  str.indexOf('?')+1
      }

      
       
      // 参数
      str  =  str.substring(index)
      const querys = str.split('&')

      const params = {}
      for(let query of querys){
        const items = query.split('=')
        if(items.length > 1){
           const key =  items[0]
           const value = items[1]
           params[key] = value
        }
      }
      return params
    }

  }

  const global = new Global()

  exports('global',global)
  
});