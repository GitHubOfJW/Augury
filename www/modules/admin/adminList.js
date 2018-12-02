layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;

    global.ajaxSetup($);

    const isDialog = !!parent.layer.getFrameIndex(window.name)

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

      $('button[lay-filter="add"]').click(function(){
        global.dialog_show('添加管理员','/pages/admin/add/')
      })


      const cols = [[ //表头
        {width:'80',type:!isDialog ? 'checkbox':'radio',title:'选择',fixed:'left'}
        ,{field: 'id', title: 'ID', width:'80', sort: true}
        ,{field: 'account', title: '用户名', width:'100', sort: true}
        ,{title: '角色', width:'100',templet:function(d){
          return d.role ? d.role.name : (d.is_admin ? '超级管理员' : '普通管理员')
        }, sort: true}
        ,{field: 'mobile', title: '手机', width:'120', sort: true}
        ,{field: 'jst_account', title: '聚水潭账号', width:'120', sort: true}
        ,{field: 'qq', title: 'QQ号', width:'140', sort: true}
        ,{field: 'qq_name', title: 'QQ昵称', width:'120', sort: true}
        ,{field: 'computer', title: '使用电脑', width:'120', sort: true}
        ,{field: 'enable', title: '开启/停用',width:'100',
        templet:function(d){
          if(d.is_admin){
            return '已启用';
          }
          if(isDialog){
            return d.enable ? '已启用':'已禁用'
          }
          return `<input type="checkbox" name="switch" class="layui-switch-xs" lay-size="xs" lay-filter="switch" value='${d.id}' lay-text="开启|停用" ${d.enable ? 'checked=""' : ""} lay-skin="switch">`;
        }, sort: true}
        ,{field: 'createdTime', title: '创建时间',width:'180', sort: true}
      ]]

      if(!isDialog){
        
        cols[0].push({title: '操作',width:'280',fixed:'right',templet:function(d){
          return template('toolbar',{
            d:d,
            account:layui.data('user').user
          })
       }})

      }else{
        // 点击选择管理员的确定按钮
        $(".admin-choose-confirm").click(function(){
          const checkStatus =  table.checkStatus('table')
          const objs = checkStatus.data.map(obj=>{
              return obj;
          })
          if(objs.length <= 0){
            layer.msg('请选择放单负责人',{icon:2,time:500});
          }else{
            global.emit('choose_admin_confirm',{objs:objs});
            // 获得frame索引
            var index = parent.layer.getFrameIndex(window.name);
            //关闭当前frame
            parent.layer.close(index);
          }
        })
        $('.tools').css('display','none');
      }

      // 权限
      const user = global.getUser()
      if(user && user.is_admin){
         $('button[lay-filter="add"]').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
         $('#delAll').removeClass('layui-disabled  layui-bg-gray').prop('disabled',false)
      }

        //列表
        const url = global.absoluteUrl('/api/v1/admin/list')
        // 查看管理员
        const tableObj = table.render({
          elem: '#table'
          ,size: 'sm'
          ,height: 'full-204'
          // ,url:url //数据接口
          ,page: true //开启分页
          ,limit: ((layui.data('tableConfig')||{}).limit || 20)
          ,limits:[20,50,100,200,500,1000]
          ,cols: cols
          ,done:function(res, curr, count){
            if(res.isLogout){
              window.top.location.href = '/pages/login/'
              return;
            }
            needRefresh = false;
            if((!curr || curr==1) && (res.totalPage || 0) <= 1){
              needRefresh = true;
            }
         }
       });
       tableObj.reload({
        url:url
       })

       global.on("adminListRefresh",(isEdit)=>{
         if(needRefresh || isEdit){
           tableObj.reload()
         }
       })

        //监听事件
        table.on('tool(adminList)', function(obj){
          switch(obj.event){
            case 'add':
              // 添加微信
              global.dialog_show('添加微信','/pages/wechat/add/#/admin_id='+obj.data.id)
            break;
            case 'lookWechats':
              // 查看订单
              global.dialog_show('绑定微信','/views/wechat/wechatList/#/admin_id='+obj.data.id)
            break
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/admin/edit/#/admin_id=${obj.data.id}`)
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
            where:data.field
          })
          return false;
        });
  
      
      
        $('#delAll').on('click',function(){
          const checkStatus =  table.checkStatus('table')
          const ids = checkStatus.data.map(obj=>{
              return obj.id;
          })
          delAll(ids,function(){
              tableObj.reload({})
          })
        })
        
        $('#refresh').click(function(){
             tableObj.reload();
        })
    
     /*用户-停用*/
     function member_stop(enable,id,callback){
          global.ajax({
            url:'/api/v1/admin/status/'+ id,
            method:"POST",
            data:{
              enable:enable
            },
            type:'json',
            success:function(data){
               if(callback)callback(!data.code,data.message)
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
            url:'/api/v1/admin/delete',
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
            url:'/api/v1/admin/delete',
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

    exports('adminList',{})
});