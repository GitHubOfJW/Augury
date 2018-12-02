layui.define(['form', 'global'], function(exports) {
   const form = layui.form,
   $ = layui.jquery,
   global = layui.global
 
   
  //自定义验证规则
  form.verify({
    bank_id:function(value){
        if(!value || value <= 0){
            return '请选择银行'
        }
    },
    card_no:function(value){
      const str = value
      if(value.length > 0 && !/\d{16,19}/.test(str.replace(' ',''))){
        return '银行卡号不合法'
      }
    },
    link:function(value){
        if(value.length > 0 && !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/.test(value)){
            return '网址输入有误'
        }
    }
})

    const isDialog = !!parent.layer.getFrameIndex(window.name)
    let body = {};
    if(isDialog && parent.$){
      const iframe = parent.$(`iframe[name=${window.name}]`)
      body = global.getParamsWithUrl(iframe.attr('src'))
    }


    global.ajax({
        url:'/api/v1/bank/list',
        success:function(data){
            if(!data.code){
                // 填充数据
                let options = [];
                for(let bank of data.data.list){
                    options.push(`<option value="${bank.id}" code="${bank.bank_code}">${bank.name}</option>`)
                }
                options.unshift('<option value="0">选择银行(可选项)</option>')
                $('select[name="bank_id"]').html(options.join('')).prop('disabled',true)
                form.render('select')
            }
        }
    })

    let preValue = undefined
    $('#card_num').on('input',function(){ 
        const inputValue = ($(this).val()||'').replace(/\s+/,'')
        const value = inputValue.replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','')

        if(typeof preValue == 'undefined'){
            preValue = value;
        }
        
        if(/\d{16,19}/.test(value)){
            //每四位数字加一个空格
            const newValue = value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
            $(this).val(newValue)

            $('button[lay-filter="edit"]').prop('disabled',true)
            $.ajax({
                url:'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json',
                data:{
                    _input_charset:'utf-8',
                    cardBinCheck:true,
                    cardNo:value,
                },
                success:function(data){
                    $('button[lay-filter="edit"]').prop('disabled',false)
                    if(data.stat == 'ok' && data.validated){
                        $(`select[name="bank_id"]`).val($(`option[code="${data.bank}"]`).val()).prop('disabled',true)
                        $()
                        form.render('select')
                    }else{
                        $('select[name="bank_id"]').prop('disabled',false)
                        form.render('select')
                    }
                },
                error:function(){
                    $('button[lay-filter="edit"]').prop('disabled',false)
                }
            })
        }else{
            if(preValue &&  preValue.length <= value.length){
                const newValue = value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
                $(this).val(newValue)
            }

            $('select[name="bank_id"]').prop('disabled',false)
            form.render('select')
        }

        preValue = value
    })

  if(body.bankCard_id){
      global.ajax({
          url:'/api/v1/bankCard/detail/'+body.bankCard_id,
          type:'GET',
          success:function(data){
              if(!data.code){
                  console.log(data)
                  const card_num = data.data.card_num.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
                  $('#card_num').val(card_num)
                  $('#real_name').val(data.data.real_name)
                  $('#bank_mobile').val(data.data.bank_mobile)
                  $('#wechat_id').val(data.data.wechat_id)
                  $('select[name="bank_id"]').val(data.data.bank_id)
                  $('#abv_account').val(data.data.abv_account)
                  $('#abv_password').val(data.data.abv_password)
                  $('#abv_link').val(data.data.abv_link)
                  form.render('select')
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
        url:'/api/v1/bankCard/edit/'+body.bankCard_id,
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

   exports('bankCardEdit',{})
});