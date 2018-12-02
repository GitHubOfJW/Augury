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

    form.verify({
      price:function(value){
        if(value.length > 0 && !/^\d+(\.\d+)?$/.test(value)){
          return '价格必须是非负数值'
        }
      }
    })

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
      
      let shop_id = 0
      $('button[lay-filter="add"]').click(function(){
        if(shop_id > 0){
         // 添加商品
          global.dialog_show('添加商品','/pages/product/add/#/shop_id='+obj.data.id)
        }else{
          global.dialog_show('添加商品','/pages/product/add/')
        }
      })

      const user = global.getUser()
      if(user && user.is_admin){
        $('#delAll').removeClass('layui-disabled  layui-bg-gray').prop('disabled',false)
      }


        //列表
      const cols =  [[ //表头
          ,{field: 'id', title: 'ID', sort: true, width:'80'}
          ,{field: 'product_id', title: '商品编号', width:'120',sort: true}
          ,{field: 'name', title: '商品名称', width:'150',sort: true}
          ,{field: 'origin_price', title: '商品展示价格', width:'120',totalRow:true,totalRowText:'价格合计：',sort: true}
          ,{field: 'price', title: '商品下单价格', width:'120',totalRow:true,totalRowText:'价格合计：',sort: true}
          ,{field: 'commission', title: '俑金', width:'100',totalRow:true,totalRowText:'佣金合计：',sort: true}
          ,{field: 'service_price', title:'服务费', width:'100',totalRow:true,totalRowText:'服务费合计：',sort: true}
          ,{field:'shop.wangwang',title: '店铺旺旺',defaultValue:'无', width:'150',sort: true}
          ,{field:'ysd_orders',title: '昨日单量', width:'100',totalRow:true,totalRowText:'昨日单量：',sort: true}
          ,{field:'today_orders',title: '今日单量', width:'100',totalRow:true,totalRowText:'今日单量：',sort: true}
          ,{field: 'remark', title:'备注', width:'120'}
          ,{field: 'createdTime', title: '创建时间',width:'150',sort: true}

          
          // ,{field: 'charge.id',title: '负责人编号',defaultValue:"无", width:'100',sort: true}
          // ,{field:'charge.name',title: '负责人姓名',defaultValue:'无', width:'140',sort: true},
          // ,{field:'charge.mobile',title: '负责人电话',defaultValue:'无', width:'140',sort: true}
          ,{field:'admin.id',title: '登记人编号',defaultValue:'无', width:'100',sort: true}
          ,{field:'admin.name',title: '登记人姓名',defaultValue:'无', width:'120',sort: true},
          ,{field:'admin.mobile',title: '登记人电话',defaultValue:'无', width:'140',sort: true}
        ]]

        if(!isDialog){
          $('button[lay-filter="add"]').css('display','none')
          cols[0].unshift({type:'checkbox',title:'选择',fixed:'left',width:'80'})
          cols[0].push({title: '操作',fixed:'right',templet:function(d){
            return template('toolbar',{
              d:d,
              account:layui.data('user').user
            })
         },width:'280'})
        }else{
          $('.tools').css('display','none');
        }

        const url = global.absoluteUrl('/api/v1/product/list') 
        // 查看商品
        let isChoose = false;
        if(!!body.shop_id && isDialog){
          shop_id = body.shop_id
          $('.product-choose-confirm').css('display','none');
        }else if(isDialog){ //如果不是查看商品,则是添加商品
          isChoose = true;
          // 设置选择
          cols[0].unshift({type:'radio',title:'选择',fixed:'left',width:'6%'})
          // 点击选择会员的确定按钮
          $(".product-choose-confirm").click(function(){
            const checkStatus =  table.checkStatus('table')
            const objs = checkStatus.data.map(obj=>{
                return obj;
            })
            if(objs.length <= 0){
              layer.msg('请选择商品',{icon:2,time:500});
            }else{
              global.emit('choose_product_confirm',{objs:objs});
              // 获得frame索引
              var index = parent.layer.getFrameIndex(window.name);
              //关闭当前frame
              parent.layer.close(index);
            }
          })
          $('.tools').css('display','none');
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
          ,totalRow:true
          ,cols: cols
          ,where:{
            shop_id:shop_id
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
                $('button[lay-filter="add"]').css('display','inline-block').removeClass('layui-disabled layui-bg-gray').prop('disabled',false)
                $('#delAll').css('display','none')
              }else{
                $('.tools').css('display','none');
              }
            }
          }
        });
        tableObj.reload({
          url:url
        })
        
        global.on("productListRefresh",(isEdit)=>{
          console.log(isEdit,'是不是编辑')
          if(needRefresh || isEdit){
            tableObj.reload()
          }
        })

        //监听事件
        table.on('tool(productList)', function(obj){
          switch(obj.event){
            case 'add':
              // 添加订单
              global.dialog_show('添加订单','/pages/order/add/#/product_id='+obj.data.id+"&commission="+obj.data.commission)
            break;
            case 'lookOrders':
              // 查看订单
              global.dialog_show('商品订单','/views/order/orderList/#/product_id='+obj.data.id)
            break
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/product/edit/#/product_id=${obj.data.id}`)
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
              shop_id:shop_id
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
              tableObj.reload({})
          })
        })
        
        $('#refresh').click(function(){
             tableObj.reload();
        })
    
     /*用户-停用*/
     function member_stop(enable,id,callback){
          global.ajax({
            url:'/api/v1/shopkeeper/status/'+ id,
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
            url:'/api/v1/product/delete',
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
            url:'/api/v1/product/delete',
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

    exports('productList',{})
});