layui.define(['form', 'laydate', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   laydate = layui.laydate,
   global = layui.global;
   
  //自定义验证规则
  form.verify({
    price:function(value){
      if(value.length > 0 && !/^\d+(\.\d+)?$/.test(value)){
        return '金额必须是非负数值'
      }
    },
    gift:function(value){
        if(value <= 0){
          const commission = $('#member_commission').val()
          if(!/^\d+(\.\d+)?$/.test(commission) || commission <= 0 ){
            return '礼品和佣金至少填写一个'
          }
        }
    },
    order_number:function(value){
      if($('#apit_time').val().trim().length <=0){
        if(value.trim().length <= 0){
            return '请填写订单编号或预约时间'
        }else if(!/^\+?[1-9][0-9]*$/.test(value)){
            return '订单编号格式错误'
        }
      }
    }, 
    apit_date:function(value){
        if($('#order_id').val().trim().length <= 0){
            if(value.trim().length <= 0 ){
              return '请填写预约下单时间或订单编号'
            }
            const date = new  Date()
            const hour =  date.getHours()
            const minute = date.getMinutes()
            const seconds = date.getSeconds()
            const time = `${hour < 10 ? '0':''}${hour}:${minute < 10 ? '0':''}${minute}:${seconds < 10 ? '0':''}${seconds}`
            if(time > value && $('.apit_time').css('display') != 'none'){
                return '预约下单日期不得晚于当前时间'
            }
        }
    }, 
    member_commission:function(value){
        if(value.length > 0 && /^\d+(\.\d+)?$/.test(value)){
            const price = $('.product_commission').html()
            if(parseFloat(value) > parseFloat(price)){
                return '会员佣金不得大于商品佣金'
            }
        }
    },
    back_date:function(value){
        const date = new  Date()
        const year = date.getFullYear()
        const month = date.getMonth()+1
        const day  = date.getDate()
        const hour =  date.getHours()
        const minute = date.getMinutes()
        const seconds = date.getSeconds()
        const time = `${year}-${month < 10 ? '0':''}${month}-${day < 10 ? '0':''}${day} ${hour < 10 ? '0':''}${hour}:${minute < 10 ? '0':''}${minute}:${seconds < 10 ? '0':''}${seconds}`
        if(time > value  && $('.refundTime').css('display') != 'none'){
            return '返款日期不得晚于当前时间'
        }
    }
  })
 
  const date = new  Date()
  const year = date.getFullYear()
  const month = date.getMonth()+1
  const day  = date.getDate()
  const hour =  date.getHours()
  const minute = date.getMinutes()
  const seconds = date.getSeconds()
   
  laydate.render({
    elem: '#refundTime', //指定元素
    type: 'datetime',
    value: global.getTodayLastTime(),
    isInitValue:false
  });
  
  laydate.render({
    elem: '#apit_time', //指定元素
    type: 'time',
    min:`${hour < 10 ? '0':''}${hour}:${minute < 10 ? '0':''}${minute}:${seconds < 10 ? '0':''}${seconds}`,
    isInitValue:false,
    change:function(value){
        $('#apit_time').attr('name','apit_time')
        
        $('.apit_desc').html(`${year}-${month < 10 ? '0':''}${month}-${day<10?'0':''}${day} ${value}`)
     }
  });

  let body = {}
  if(parent.$){
    const iframe = parent.$(`iframe[name=${window.name}]`)
    body = global.getParamsWithUrl(iframe.attr('src'))
  }
  // 会员添加订单
  if(body.consumer_id){
    $('#consumer_id').val(body.consumer_id);
    $(".consumer").css('display','none');
  }

  // 产品添加订单
  if(body.product_id){
    $('#product_id').val(body.product_id);
    $('.product_commission').html(body.commission)
    $(".product").css('display','none');
  }

  // 获取礼品
  global.ajax({
    url:'/api/v1/gift/list',
    data:{
        page:-1,
        limit:-1
    },
    success:function(data){
       if(!data.code){
          // 填充数据
          let options = [];
          for(let status of data.data){
              options.push(`<option value="${status.id}">${status.name}</option>`)
          }

          options.unshift('<option  value="0">选择礼品</option>')
          $('select[name="gift_id"]').html(options.join(''))
          form.render('select')
       }
    },
    error:function(data){

    }
})
// 获取订单状态
global.ajax({
    url:'/api/v1/order/orderStatus',
    success:function(data){
       if(!data.code){
          // 填充数据
          let options = [];
          for(let status of data.data.list){
              options.push(`<option value="${status.id}">${status.name}</option>`)
          }
          $('select[name="status_id"]').html(options.join(''))
          form.render('select')
       }
    },
    error:function(data){

    }
})

 // 选择礼品 佣金设置为0
//  form.on('select(gift_id)',function(obj){
//    // 如果礼品选择
//    if(obj.value > 0){
//        $('#member_commission').val('0')
//    }
// })

// 输入佣金则礼品置空
// $('#member_commission').on('input',function(){
//    // 如果输入金额，置空佣金
//   if(/^\d+(\.\d+)?$/.test($(this).val()) && $(this).val() > 0){
//       $('select[name="gift_id"]').val(0)
//       form.render('select')
//   }
// })

  // 监听会员选择
  $('.consumer_id_choose').click(function(){
    // 选择会员
    global.on('choose_consumer_confirm',function(value){
      if(value && value.objs && value.objs.length){
          const consumerModel = value.objs[0];
          $('.consumer_id_choose').val(consumerModel.name)
          $('.consumer_desc').html(`${consumerModel.name} 手机：${consumerModel.mobile}`)
          $('#consumer_id').val(consumerModel.id)
      }
    })
    global.dialog_show('选择会员','/views/consumer/consumerList/')
  })

  // 监听商品选择
  $('.product_id_choose').click(function(){
    // 选择会员
    global.on('choose_product_confirm',function(value){
      if(value && value.objs && value.objs.length){
          const productModel = value.objs[0];
          $('.product_id_choose').val(productModel.name)
          $('.product_desc').html(`${productModel.name}&nbsp;&nbsp;价格:<span class="x-red">${productModel.price}</span>&nbsp;&nbsp;商品佣金：<span class="x-red">${productModel.commission}</span>&nbsp;&nbsp;服务费：<span class="x-red">${productModel.service_price}</spn>`)
          $('#product_id').val(productModel.id)
          $('.product_commission').html(productModel.commission)
      }
    })
    global.dialog_show('选择商品','/views/product/productList/')
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
        url:'/api/v1/order/add',
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
                // 添加成功
                global.emit("orderListRefresh")
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

   exports('orderAdd',{})
});