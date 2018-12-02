layui.define(['form', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   global = layui.global
    
  //自定义验证规则
  form.verify({
    price:function(value){
      if(value.length > 0 && !/^\d+(\.\d+)?$/.test(value)){
        return '金额必须是非负数值'
      }
    },
    product_number:function(value){
      if(!/^\+?[1-9][0-9]*$/.test(value)){
          return '商品编号格式错误'
      }
    },
    // 下单价格
    orderPrice:function(value){
       if(value.length > 0 && /^\d+(\.\d+)?$/.test(value)){
          const price =  $('#origin_price').val()
          if(parseFloat(value) > parseFloat(price)){
              return '下单价格不得大于显示价格'
          }
       }
    },
    commission:function(value){
        if(value.length > 0 && /^\d+(\.\d+)?$/.test(value)){
            const price = $('#price').val()
            if(parseFloat(value) > parseFloat(price)){
                return '商品佣金不得大于下单价格'
            }
        }
    }
  })

    const isDialog = !!parent.layer.getFrameIndex(window.name)
    let body = {};
    if(isDialog && parent.$){
      const iframe = parent.$(`iframe[name=${window.name}]`)
      body = global.getParamsWithUrl(iframe.attr('src'))
    }
    if(body.shop_id){
        $('#shop_id').val(body.shop_id)
    }

  // 获取合作状态
  global.ajax({
      url:'/api/v1/product/statusList',
      success:function(data){
         if(!data.code){
            // 填充数据
            let options = [];
            for(let status of data.data.list){
                options.push(`<option value="${status.id}">${status.name}</option>`)
            }
            $('select[name="cooperate_status"]').html(options.join(''))
            form.render('select')
         }
      },
      error:function(data){

      }
  })

  // 选择放单负责人
  $('.charge_id_choose').click(function(){
      global.on('choose_admin_confirm',function(value){
         if(value && value.objs && value.objs.length){
             const adminModel = value.objs[0];
             $('.charge_id_choose').val(adminModel.name+" : "+adminModel.mobile)
             $('#charge_id').val(adminModel.id)
         }
      })
      global.dialog_show('选择放单负责人','/views/admin/adminList/')
  })

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
        url:'/api/v1/product/add',
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
                global.emit("productListRefresh");
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

   exports('productAdd',{})
});