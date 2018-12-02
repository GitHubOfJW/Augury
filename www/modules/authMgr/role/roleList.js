layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;

    global.ajaxSetup($);
 

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
        global.dialog_show('添加角色','/pages/authMgr/role/add/')
      })

      const cols =  [[ //表头
        {width:'80',type:'checkbox',fixed:'left'}
        ,{field: 'id', title: 'ID', width:'80', sort: true}
        ,{field: 'name', title: '角色名', width:'180'}
        ,{title: '拥有权限规则', width: '180',templet:function(d){
          const rules = [];
          for(let  relItem of d.auth_role_rels){
            rules.push(relItem.auth.name);
          }
          if(rules.length <=0){
            return '暂无权限'
          }
          return rules.join(',')
        }}
        ,{field: 'enable', title: '开启/停用',width:'10%',
        templet:function(d){
          return `<input type="checkbox" name="switch" lay-filter="switch" value='${d.id}' lay-text="开启|停用" ${d.enable ? 'checked=""' : ""} lay-skin="switch">`;
        }}
        ,{field: 'remark', title: '描述',width:'15%',templet: function(d){
          return d.remark || '未填写'
        }}
        ,{field: 'createdTime', title: '创建时间',width:'15%'}
        ,{title: '操作',width:'16%',fixed:'right',templet:function(d){
            return template('toolbar',{
              d:d,
              account:layui.data('user').user
            })
        }}
      ]]

      // 权限
      const user = global.getUser()
      if(user && user.is_admin){
         $('button[lay-filter="add"]').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
         $('#delAll').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
      }

        //列表
        const url = global.absoluteUrl('/api/v1/role/list')
        // 查看权限
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

       global.on("authListRefresh",(isEdit)=>{
         if(needRefresh || isEdit){
           tableObj.reload()
         }
       })

        //监听事件
        table.on('tool(roleList)', function(obj){
          switch(obj.event){
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/authMgr/role/edit/#/role_id=${obj.data.id}`)
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
  

     // 停用
     function member_stop(enable,id,callback){
      global.ajax({
        url:'/api/v1/role/status/'+ id,
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
            url:'/api/v1/auth/remove',
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
            url:'/api/v1/auth/remove',
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

    exports('roleList',{})
});