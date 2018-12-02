layui.define(['form','upload','global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   upload =  layui.upload,
   global = layui.global
   
   global.ajaxSetup($)
   
  //自定义验证规则
  form.verify({
    sort: [/^\d+$/, '排序必须为非负整数']
  });

  //执行实例
  const uploadUrl =  global.absoluteUrl('/api/v1/image/upload')
  var uploadInst = upload.render({
    elem: '#uploadImage' //绑定元素
    ,url: uploadUrl //上传接口
    ,acceptMime:'image/jpg, image/png'
    ,accept:'images'
    ,done: function(data){
      //上传完毕回调
      if(!data.code){
         $('#thumb_img').attr('src',data.data.url)
         $('#imgUrl').val(data.data.url);
      }
    }
    ,error: function(data){
      //请求异常回调
      console.log(data)
    }
  });

  //监听提交
  form.on('submit(add)', function(data){
    // 弹出提示
    let index = null;
    const id = setTimeout(() => {
        clearTimeout(id);
        if(!index){
            index = layer.msg('玩命卖萌中...',{type:1,shade:0.5,time:0});
        }
    }, 1000);

    global.ajax({
        url:'/api/v1/device/add',
        traditional:true,
        data:data.field,
        method:'POST',
        type:'json',
        success:function(data){
            layer.close(index);
            index = " ";
            if(!!data.code){
                layer.msg(data.message,{icon:2,shade:0.2,time:500});
                return;
            }

            layer.alert(data.message, {icon: 6},function () {
                global.emit('deviceListRefresh')
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        },
        error:function(err){
            layer.msg('服务器开小差了',{icon:2,shade:0.2,time:500});
            layer.close(index);
            index = " ";
        }
    })
    
    return false;
    });

   exports('deviceAdd',{})
});