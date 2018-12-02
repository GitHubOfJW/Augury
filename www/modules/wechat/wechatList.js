layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;

    global.ajaxSetup($);
 
    

    // 获取参数
    const isDialog = !!parent.layer.getFrameIndex(window.name)
    let body = {};
    if(isDialog && parent.$){
      const iframe = parent.$(`iframe[name=${window.name}]`)
      body = global.getParamsWithUrl(iframe.attr('src'))
    }
    
      //执行一个laydate实例
      laydate.render({
        elem: '#start', //指定元素
        type: 'datetime'
      });
  
      //执行一个laydate实例
      laydate.render({
        elem: '#end', //指定元素
        type: 'datetime',
        value: global.getTodayLastTime(),
        isInitValue:false
      });


      let admin_id = 0
      $('button[lay-filter="add"]').click(function(){
        if(admin_id > 0){
          // 添加商铺
          global.dialog_show('添加微信','/pages/wechat/add/',null,null,function(layero,index){
            const body = layui.layer.getChildFrame('body', index);
            body.find('#admin_id').val(admin_id);
          })
        }else{
          global.dialog_show('添加微信','/pages/wechat/add/',null,null)
        }
      })

     

      const user = global.getUser()
      if(user && user.is_admin){
        $('#delAll').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
      }

        //列表
        const cols = [[ //表头
          ,{field: 'id', title: 'ID', width:'80', sort: true}
          ,{field: 'wechat_id', title: '微信编号', width:'140',sort: true}
          ,{field: 'wechat', title: '微信号', width:'140',sort: true}
          ,{field: 'wechat_name', title: '微信昵称', width:'140',sort: true}
          ,{field: 'meta_device.name', title: '设备名称', width:'140',sort: true}
          ,{field: 'meta_device.device_code', title: '设备编号', width:'140',sort: true}
          ,{field: 'mobile', title: '支付密码', width:'140',sort: true}
          ,{field: 'password', title: '微信密码', width:'120',sort: true}
          ,{field: 'real_name', title: '实名制姓名', width:'120',sort: true}
          ,{field: 'pay_password', title: '支付密码', width:'120',sort: true}
          ,{field: 'admin.name', title: '管理员', width:'120',sort: true}
          ,{field: 'admin.account', title: '管理账号', width:'120',sort: true}
          ,{field: 'createdTime', title: '创建时间',width:'150',sort: true}
        ]]

        if(!isDialog){
          $('button[lay-filter="add"]').css('display','none')
          cols[0].unshift({type:'checkbox',fixed:'left',width:'80'})
          cols[0].push({title: '操作',fixed:'right',templet:function(d){
            return template('toolbar',{
              d:d,
              account:layui.data('user').user
            })
         },width:'300'})
        }else{
          $('.tools').css('display','none');
        }

        const url = global.absoluteUrl('/api/v1/wechat/list')
        // 查看客户的微信
        if(!!body.admin_id && isDialog){
          admin_id = body.admin_id
        }

        let needRefresh = false;
        const tableObj = table.render({
          elem: '#table'
          ,size: 'sm'
          ,height: 'full-204'
          // ,url:url //数据接口
          ,page: true //开启分页
          ,limit: ((layui.data('tableConfig')||{}).limit || 20)
          ,limits:[20,50,100,200,500,1000]
          ,cols: cols
          ,where:{
            admin_id:admin_id
          }
          ,done:function(res, curr, count){
            if(res.isLogout){
              window.top.location.href = '/pages/login/'
              return;
            }
            needRefresh = false;
            if((!curr || curr==1) && (res.totalPage || 0) <= 1){
              needRefresh = true;
            }
            if(isDialog){
              if(res.code){
                $('.tools').css('display','block');
                $('button[lay-filter="add"]').css('display','inline-block')
              }else{
                $('.tools').css('display','none');
              }
            }
          }
        });
        tableObj.reload({
          url:url
        })

        global.on("wechatListRefresh",(isEdit)=>{
          if(needRefresh || isEdit){
            tableObj.reload()
          }
        })
  
        //监听事件
        table.on('tool(wechatList)', function(obj){
          switch(obj.event){
            case 'add':
            // 添加银行卡
            global.dialog_show('添加银行卡','/pages/bankCard/add/#/wechat_id='+obj.data.id,null,null,function(layero,index){
              const body = layui.layer.getChildFrame('body', index);
              body.find('#bankCard_id').val(obj.data.id);
            })
            break;
            case 'lookBankCards':
            // 查看银行卡信息
              global.dialog_show('银行卡列表','/views/bankCard/bankCardList/#/wechat_id='+obj.data.id)
            break
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/wechat/edit/#/wechat_id=${obj.data.id}`)
            break;
          };
        });
  
        form.on('switch(switch)',function(obj){
          member_stop(obj.elem.checked,obj.value,function(status,message){
              if(!status){
                layer.msg(message,{icon:1,time:500});
              }
          })
        })
  
        //监听查询
        form.on('submit(sreach)', function(data){
            tableObj.reload({
              where:{
                ...data.field,
                admin_id:admin_id
              }
            })
          return false;
        });
  
      
      
        $('#delAll').on('click',function(){
          const checkStatus =  table.checkStatus('table')
          const ids = checkStatus.data.map(obj=>{
              return obj.id;
          })
          delAll(ids,function(){
              tableObj.reload()
          })
        })
        
        $('#refresh').click(function(){
             tableObj.reload();
        })
    
     /*用户-停用*/
     function member_stop(enable,id,callback){
          global.ajax({
            url:'/api/v1/wechat/status/'+ id,
            method:"POST",
            data:{
              enable:enable
            },
            type:'json',
            success:function(data){
               if(callback)callback(data.status,data.message)
            },
            error(){
              if(callback)callback(false,'服务器开小差了')
            }
          })
    }
  
    /*用户-删除*/
    function member_del(id,callback){
        layer.confirm('确认要删除吗？',function(index){

          global.ajax({
            url:'/api/v1/wechat/delete',
            data:{
              ids:id
            },
            method:'POST',
            type:'json',
            success:function(data){
              if(!data.code){
                //发异步删除数据
                if(callback){
                  callback()
                }
                layer.msg(data.message,{icon:1,time:500});
              }else{
                layer.msg(data.message,{icon:5,time:500});
              }
            },
            error:function(res){
              layer.msg('服务器开小差了',{type:5,shade:0.2});
            }
          })
        });
    }
  
  
    // 批量删除
    function delAll (ids,callback) {
        if(!ids || ids.length <=0){
          layer.msg('并未选择',{icon:5,time:500});
          return;
        }
      layer.confirm('确认要删除吗？这个事情很严重，考虑一下下！',function(index){
          global.ajax({
            url:'/api/v1/wechat/delete',
            data:{
              ids:ids.join(",")
            },
            method:'POST',
            type:'json',
            success:function(data){
              if(!data.code){
                //发异步删除数据
                if(callback){
                  callback()
                }
                layer.msg(data.message,{icon:1,time:500});
              }else{
                layer.msg(data.message,{icon:5,time:500});
              }
            },
            error:function(res){
              layer.msg('服务器开小差了',{type:5,shade:0.2});
            }
        });
      });
    }

    $('#refresh').click(function(){
      tableObj.reload()
    })

    exports('wechatList',{})
});