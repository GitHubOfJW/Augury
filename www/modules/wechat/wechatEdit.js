layui.define(['form', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   global = layui.global
 
   
  //自定义验证规则
    form.verify({
        service_price:function(value){
          if(value.length > 0 && !/^\d+(\.\d+)?$/.test(value)){
            return '服务费必须是非负数值'
          }
        }
    })

    const isDialog = !!parent.layer.getFrameIndex(window.name)
    let body = {};
    if(isDialog && parent.$){
      const iframe = parent.$(`iframe[name=${window.name}]`)
      body = global.getParamsWithUrl(iframe.attr('src'))
    }

  if(body.wechat_id){
      global.ajax({
          url:'/api/v1/wechat/detail/'+body.wechat_id,
          type:'GET',
          success:function(data){
              if(!data.code){
                  console.log(data)
                $('#wechat_id').val(data.data.wechat_id)
                $('#wechat').val(data.data.wechat)
                $('#wechat_name').val(data.data.wechat_name)
                $('#password').val(data.data.password)
                $('#pay_password').val(data.data.pay_password)
                $('#real_name').val(data.data.real_name)
                $('#mobile').val(data.data.mobile)

                $('#admin_id').val(data.data.admin.id)

                const deviceModel = data.data.meta_device;
                $('.device_id_choose').val(deviceModel.name)
                $('.device_desc').html(`${deviceModel.name} 编号：${deviceModel.device_code}`)
                $('#device_id').val(deviceModel.id)
              }
          },
          err:function(data){

          }
      })
  }


  //监听提交
  form.on('submit(edit)', function(data){
    // 弹出提示
    let index = null;
    const id = setTimeout(() => {
        clearTimeout(id);
        if(!index){
            index = layer.msg('玩命卖萌中...',{type:1,shade:0.5,time:0});
        }
    }, 1000);

    global.ajax({
        url:'/api/v1/wechat/edit/'+body.wechat_id,
        traditional:true,
        data:data.field,
        method:'POST',
        type:'json',
        success:function(data){
            layer.close(index);
            index = " ";
            //发异步，把数据提交给php
            if(!!data.code){
                layer.msg(data.message,{icon:2,shade:0.2,time:500});
                return;
            }

            layer.alert(data.message, {icon: 6},function () {
                global.emit("wechatListRefresh",true)
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

   exports('wechatEdit',{})
});