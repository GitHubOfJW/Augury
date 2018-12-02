layui.define(['form', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   global = layui.global
   
  //自定义验证规则
//   form.verify({
//     name: function(value){
//       if(value.length < 5){
//         return '名称至少得4个字符啊';
//       }
//     }
//     ,pass: [/(.+){6,16}$/, '密码必须6到16位']
//     ,repass: function(value){
//         if($('#L_pass').val()!=$('#L_repass').val()){
//             return '两次密码不一致';
//         }
//     }
//   });

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
        url:'/api/v1/consumer/add',
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
                global.emit("consumerListRefresh")
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

   exports('consumerAdd',{})
});