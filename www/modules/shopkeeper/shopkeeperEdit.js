layui.define(['form', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   global = layui.global
   
  //自定义验证规则
  form.verify({
    name: function(value){
      if(value.length < 5){
        return '名称至少得4个字符啊';
      }
    }
  });

  const isDialog = !!parent.layer.getFrameIndex(window.name)
  let body = {};
  if(isDialog && parent.$){
    const iframe = parent.$(`iframe[name=${window.name}]`)
    body = global.getParamsWithUrl(iframe.attr('src'))
  }

  if(body.shopkeeper_id){
      global.ajax({
          url:'/api/v1/shopkeeper/detail/'+body.shopkeeper_id,
          type:'GET',
          success:function(data){
              if(!data.code){
                $('#name').val(data.data.name)
                $('#mobile').val(data.data.mobile)
                $('#wechat').val(data.data.wechat)
                $('#qq').val(data.data.qq)
                $('#remark').val(data.data.remark)
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
        url:'/api/v1/shopkeeper/edit/'+body.shopkeeper_id,
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
                global.emit('shopkeeperListRefresh',true)
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

   exports('shopkeeperEdit',{})
});