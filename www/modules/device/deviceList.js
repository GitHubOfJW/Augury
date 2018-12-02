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


      const isDialog = !!parent.layer.getFrameIndex(window.name)

      $('button[lay-filter="add"]').click(function(){
        global.dialog_show('添加设备','/pages/device/add/',null,null)
      })
      


        //列表
      const cols =  [[ //表头
          {type:isDialog ? 'radio':'checkbox',title:'选择',fixed:'left',width:'60',sort: true}
          ,{field: 'id', title: 'ID', sort: true, width:'100',sort: true}
          ,{field: 'name', title: '设备名称', width:'140',sort: true}
          ,{field: 'device_code', title: '设备编号', width:'150',sort: true}//
          ,{field: 'sort', title: '排序', width:'100',sort: true}
          ,{field: 'createdTime', title: '创建时间',width:'150',sort: true}
          ,{ title: '缩略图', width:'200',templet:function(d){
            return `<img  src="${d.thumb_imgUrl}" width="210" alt="">`
          },sort: true},
        //   ,{title: '操作',fixed:'right',templet:function(d){
        //     return template('toolbar',{
        //       d:d,
        //       account:layui.data('user').user
        //     })
        //  },width:'150'}
        ]]

        
      const user = global.getUser()
      if(user && user.is_admin){
        $('button[lay-filter="add"]').removeClass('layui-disabled  layui-bg-gray').prop('disabled',false)
        $('#delAll').removeClass('layui-disabled  layui-bg-gray').prop('disabled',false)
      }

        if(!isDialog){
          cols[0].push({title: '操作',fixed:'right',templet:function(d){
            return template('toolbar',{
              d:d,
              account:layui.data('user').user
            })
         },width:'150'})
        }else{
          $(".device-choose-confirm").click(function(){
            const checkStatus =  table.checkStatus('table')
            const objs = checkStatus.data.map(obj=>{
                return obj;
            })
            if(objs.length <= 0){
              layer.msg('请选择设备',{icon:2,time:500});
            }else{
              global.emit('choose_device_confirm',{objs:objs});
              // 获得frame索引
              var index = parent.layer.getFrameIndex(window.name);
              //关闭当前frame
              parent.layer.close(index);
            }
          })
          $('.tools').css('display','none');
        }
 
        const url = global.absoluteUrl('/api/v1/device/list')
        let needRefresh = false;
        const tableObj = table.render({
          elem: '#table'
          ,size: 'sm'
          ,height:'full-204'
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

        global.on("deviceListRefresh",(isEdit)=>{
          if(needRefresh || isEdit){
            tableObj.reload()
          }
        })
  
        //监听事件
        table.on('tool(deviceList)', function(obj){
          switch(obj.event){
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/device/edit/#/device_id=${obj.data.id}`)
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
     
    /*用户-删除*/
    function member_del(id,callback){
        layer.confirm('确认要删除吗？',function(index){

          global.ajax({
            url:'/api/v1/device/delete',
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
            url:'/api/v1/device/delete',
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

    exports('deviceList',{})
});