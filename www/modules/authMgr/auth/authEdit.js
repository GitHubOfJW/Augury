layui.define(['form','layer','global'], function(exports) {
   const $ = layui.jquery,
   form = layui.form,
   global = layui.global,
   layer = layui.layer;

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
    const iframe =  parent.$(`iframe[name=${window.name}]`)
    body = global.getParamsWithUrl(iframe.attr('src'))
  }


    // 获取权限配置
    global.ajax({
        url:'/api/v1/auth/configs',
        type:'GET',
        success:function(data){
            if(!data.code){
                // 获取数据 
                const html =  template('authList',{authList:data.data.list})
                $('.authList').html(html)
                if(rules){
                    const rulesArr = rules.split(',')
                    if(rulesArr){
                        for(let rule of rulesArr){
                            $(`input[alt="${rule}"]`).prop('checked',true)
                        }
                    }
                }
                form.render('checkbox')
            }else{
                layer.msg(data.message,{icon:2,shade:0.2,time:500}); 
            }
        }
    })

    let cateId = null
    let rules = null
    // 获取分类列表
    global.ajax({
        url:'/api/v1/cate/list',
        type:'GET',
        data:{
            page:-1,
            limit:-1
        },
        success:function(data){
            if(!data.code){
                const cateList = []
                for(let cateItem of data.data){
                    cateList.push(`<input name="cateId" id="cateId-${cateItem.id}" lay-skin="primary" type="radio" title="${cateItem.name}"  value="${cateItem.id}">`)
                }
                const html = cateList.join('')
                $('.cateList').html(html)
                if(cateId){
                    $('#cateId-'+cateId).prop('checked',true)
                }
                form.render('radio')
            }else{
                layer.msg(data.msg||data.message,{icon:2,shade:0.2,time:500});
            }
        }
    })

    if(body.auth_id){
         // 获取详情
        global.ajax({
            url:'/api/v1/auth/detail/'+ body.auth_id,
            type:"GET",
            success:function(data){
                if(!data.code){
                    $('#name').val(data.data.name)
                    $('#remark').val(data.data.remark)
                    cateId = data.data.auth_cate.id
                    $('#cateId-'+cateId).prop('checked',true)
                    form.render('radio')

                    rules = data.data.rules;
                    const rulesArr = rules.split(',')
                    if(rulesArr){
                        for(let rule of rulesArr){
                            $(`input[alt="${rule}"]`).prop('checked',true)
                        }
                        form.render('checkbox')
                    }
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
    
    const rules = []
    const rlueObjs =  $("input[name='rule']");
    if(rlueObjs){
        for(let i = 0;i < rlueObjs.length; i ++){
            if(rlueObjs[i].checked){
                rules.push(rlueObjs[i].value)
            }
        }
    }
    
    global.ajax({
        url:'/api/v1/auth/edit/'+body.auth_id,
        traditional:true,
        data:{
            name:data.field.name,
            cateId:data.field.cateId,
            remark:data.field.remark,
            rules:rules
        },
        method:'POST',
        type:'json',
        success:function(data){
            layer.close(index);
            index = " ";
            //发异步，把数据提交给php
            if(data.code){
                layer.msg(data.message,{icon:2,shade:0.2,time:500});
                return;
            }

            layer.alert(data.message, {icon: 6},function () {
                global.emit("authListRefresh")
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

  exports('authEdit',{})
});