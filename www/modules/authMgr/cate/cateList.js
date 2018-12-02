layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;

    global.ajaxSetup($);


    const isDialog = !!parent.layer.getFrameIndex(window.name)

     //自定义验证规则
      form.verify({
        name: function(value){
          if(value.length < 5){
            return '名称至少得4个字符啊';
          }
        }
      });


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
        global.dialog_show('添加分类','/pages/cateMgr/cate/add/')
      })

      const cols = [[ //表头
        {width:'80',type:'checkbox',fixed:'left'}
        ,{field: 'id', title: 'ID', width:'80', sort: true}
        ,{field:'name',title: '权限分类名称<i class="layui-icon">&#xe642;</i>', width:'180',edit:true}
        ,{field: 'createdTime', title: '创建时间',width:'150'}
        ,{title: '操作',width:'130',fixed:'right',templet:function(d){
          return template('toolbar',{
            d:d,
            account:layui.data('user').user
          })
       }}
      ]]
 

      // 分类
      const user = global.getUser()
      if(user && user.is_admin){
         $('button[lay-filter="add"]').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
         $('#delAll').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
      }

        //列表
        const url = global.absoluteUrl('/api/v1/cate/list')
        // 查看分类
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

       global.on("cateListRefresh",(isEdit)=>{
         if(needRefresh || isEdit){
           tableObj.reload()
         }
       })

        //监听事件
        
    //监听事件
    table.on('tool(cateList)', function(obj){
      switch(obj.event){
        case 'delete':
          member_del(obj.data.id,function(){
              obj.del()
          })
        break;
        case 'edit':
        layer.confirm('带有<i class="layui-icon">&#xe642;</i>图标的单元格，可单击进行修改',{
          btn:'我知道',function(index){
           layer.close(index)
          }
        })
        break;
      };
    });
 
    table.on('edit(cateList)', function(obj){ //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
          global.ajax({
            url:'/api/v1/cate/edit/'+obj.data.id,
            method:'POST',
            data:{
              [obj.field]:obj.value
            },
            type:'json',
            success:function(data){
              if(data.code){
                layer.msg('修改失败',{type:2,shade:0.2,time:500});
                tableObj.reload();
              }
            },
            error:function(err){
              layer.msg('修改失败',{type:2,shade:0.2,time:500});
              tableObj.reload();
            }
          })
    });


        //监听提交 新增权限分类
        form.on('submit(cateAdd)', function(data){
          
          // 弹出提示
          let index = null;
          const id = setTimeout(() => {
              clearTimeout(id);
              if(!index){
                index = layer.msg('玩命卖萌中...',{type:1,shade:0.5,time:0});
              }
          }, 1000);

          global.ajax({
              url:'/api/v1/cate/add',
              data:data.field,
              method:'POST',
              type:'json',
              success: function(data){  
                if(!data.code){
                  //清除数据
                  $('form input').val('')
                  tableObj.reload({})
                  layer.msg(data.message,{icon:1,shade:0.2,time:500});
                }else{
                  layer.msg(data.message,{icon:2,shade:0.2,time:500});
                }
                layer.close(index);
                index = " ";
              },
              error:function(err){
                layer.msg('服务器开小差了',{icon:2,shade:0.2,time:500});
                layer.close(index);
                index = " ";
              }
          });
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
  
    /*用户-删除*/
    function member_del(id,callback){
        layer.confirm('确认要删除吗？',function(index){

          global.ajax({
            url:'/api/v1/cate/remove',
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
            url:'/api/v1/cate/remove',
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

    exports('cateList',{})
});