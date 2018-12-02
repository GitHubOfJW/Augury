layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;
  
    global.ajaxSetup($);

    // 查询所有的订单状态
    global.ajax({
      url:'/api/v1/order/orderStatus',
      success:function(data){
        if(!data.code){
            // 填充数据
            let options = [];
            for(let status of data.data.list){
                // options.push(`<input value="${status.id}">${status.name}</option>`)
                options.push(`<input type="checkbox" name="status[]" value="${status.id}" title="${status.name}" checked></input>`)
            }
            $('#status_id').html(options.join(''))
            
            form.render('checkbox')
        }
      },
      error:function(data){
        layer.msg('获取订单状态失败',{icon:5,time:500});
      }
    })
  
    
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
      endFlag = false
      laydate.render({
        elem: '#end', //指定元素
        type: 'datetime',
        value: global.getTodayLastTime(),
        isInitValue:false
      });

      //执行一个laydate实例
      laydate.render({
        elem: '#back_start', //指定元素
        type: 'datetime'
      });
  
      //执行一个laydate实例
      laydate.render({
        elem: '#back_end', //指定元素
        type: 'datetime',
        value: global.getTodayLastTime(),
        isInitValue:false
      });

      let product_id = 0
      let consumer_id = 0
      $('button[lay-filter="add"]').click(function(){
        if(product_id > 0 ){
          // 添加订单
          global.dialog_show('添加订单','/pages/order/add/#/product_id='+product_id)
        }else if(consumer_id > 0){
          // 添加订单
          global.dialog_show('添加订单','/pages/order/add/#/consumer_id='+consumer_id)
        }else{
          global.dialog_show('添加订单','/pages/order/add/')
        }
      })

      const user = global.getUser()
      if(user && user.is_admin){
        $('#delAll').removeClass('layui-disabled  layui-bg-gray').prop('disabled',false)
      }
 
        //列表
      const cols =  [[ //表头
          ,{field: 'id', title: 'ID', sort: true, width:'80'}
          ,{field: 'order_id', title: '订单编号', width:'180',sort: true,templet:function(d){
             return d.order_id || '预约订单'
          }}
          ,{field: 'consumer_ww.wangwang', title: '会员旺旺', width:'130',sort: true}
          ,{field: 'last_price', title: '成交价格', width:'100',sort: true,totalRow:true,totalRowText:'成交价合计：'}
          ,{field: 'member_commission', title: '会员佣金', width:'100',sort: true,totalRow:true}
          ,{field:'meta_gift.name',title: '礼品', width:'120',defaultValue:'无',sort: true}
          ,{field:'meta_orderStatus.name',title: '订单状态', width:'120',sort: true,templet:function(d){
            const status = d.status_check ? '' : "(待审)"
            if((user.id == d.admin.id || user.is_admin ) && (d.status_id == 3 || d.status_id == 4 || d.status_id == 5 || d.status_id == 8) && !isDialog){
              let color = 'layui-bg-red';
              if(d.status_id == 3){
                color = 'layui-bg-red'
              }else if(d.status_id == 4){
                color = 'layui-bg-orange'
              }else if(d.status_id == 5){
                color = 'layui-bg-blue'
              }else if(d.status_id == 8){
                color = 'layui-bg-green'
              }
              return `<button class="layui-btn ${color}" style="height:20px;border-radius:10px;padding:0 8px;font-size:12px;line-height:20px;" lay-event='status'>${d.meta_orderStatus.name}${status}</button>`
            }else{
              return d.meta_orderStatus.name+status
            }
          }}
          ,{field: 'apit_time', title: '预约下单日期', width:'150',sort: true,defaultValue:'无',templet:function(d){
            return d.apit_time || '无'
          }}
          ,{field: 'refundTime', title: '返款日期', width:'150',sort: true,defaultValue:'无'}
          ,{field: 'createdTime', title: '创建时间',width:'150',sort: true}
          ,{field:'remark',title: '备注', width:'120'}
          // 商品相关
          ,{field:'product.id',title: '商品ID', sort: true,width:'80',sort: true}
          ,{field:'product.name',title: '商品名称', width:'150',sort: true}
          ,{field:'product.price',title: '商品价格', width:'100',sort: true,totalRow:true,totalRowText:'价格合计：'}
          ,{field:'product.commission',title: '商品俑金', width:'100',sort: true,totalRow:true,totalRowText:"商品佣金合计："}
          ,{field:'product.service_price', title: '商品服务费', width:'100',sort: true,totalRow:true,totalRowText:'商品服务费合计：'}

          // 客户相关
          ,{field:'consumer.id',title: '会员ID', sort: true,width:'100',sort: true}
          ,{field:'consumer.num_id',title: '会员编号',width:'100',sort: true}
          ,{field:'consumer.name',title: '会员姓名',width:'140',sort: true}
          ,{field:'consumer.mobile',title: '会员手机',width:'140',sort: true}
          ,{field:'consumer.wechat',title: '会员微信号',width:'140',sort: true}

          // 操作人
          ,{field:'admin.id',title: '登记人编号',defaultValue:'无', width:'100',sort: true}
          ,{field:'admin.name',title: '登记人姓名',defaultValue:'无', width:'120',sort: true},
          ,{field:'admin.mobile',title: '登记人电话',defaultValue:'无', width:'140',sort: true}
        ]]

        if(!isDialog){
            cols[0].unshift({type:'checkbox',title:'选择',fixed:'left',width:'80'})
            cols[0].push({title: '操作',fixed:'right',templet:function(d){
              return template('toolbar',{
                d:d,
                account:layui.data('user').user
              })
           },width:'150'})
        }else{
          $('.tools').css('display','none');
        }

        const url = global.absoluteUrl('/api/v1/order/list')

        // 查看商品的订单
        if(!!body.product_id && isDialog){
          product_id = body.product_id
        }
        // 查看客户的订单
        if(!!body.consumer_id && isDialog){
          consumer_id = body.consumer_id
        }

        let needRefresh = false
        const tableObj = table.render({
          elem: '#table'
          ,size: 'sm'
          ,toolbar:body.product_id > 0
          ,defaultToolbar:['exports']
          ,totalRow: true
          ,height:'full-300'
          // ,url:url //数据接口
          ,page: true //开启分页
          ,limit:((layui.data('tableConfig')||{}).limit || 20)
          ,limits:[20,50,100,200,500,1000]
          ,cols: cols
          ,where: {
            consumer_id: consumer_id,
            product_id: product_id
          }
          ,cellstyle:function(d,r){
            if(user.id != d.admin.id && !user.is_admin ){
              return
            }
            if(!d.status_check && d.status_id == 4){
              if(r.field == 'meta_orderStatus.name'|| r.field == 'apit_time'){
                return  'background-color:pink;color:blue;font-weight:bold;'
              }
              return 'background-color:pink;'
            }else if(!d.status_check && d.status_id == 3){
              if(r.field == 'meta_orderStatus.name'){
                return  'background-color:yellow;color:red;font-weight:bold;'
              }
              return 'background-color:yellow;'
            }else if(!d.status_check && d.status_id == 5){
              if(r.field == 'meta_orderStatus.name'|| r.field == 'refundTime'){
                return  'background-color:pink;color:blue;font-weight:bold;'
              }
              return 'background-color:pink;'
            }
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
         },
         export:function(){ // 导出excel
           const config = tableObj.config
           global.download(url,{
            excel:true,
            ...(config.where || {}),
            limit:(config.page.limit || 20),
            page:config.page.curr,
            },'GET')
         }
       });


       tableObj.reload({
        url:url
      })

       global.on("orderListRefresh",(isEdit)=>{
        if(needRefresh || isEdit){
           tableObj.reload()
         }
       })
  
        //监听事件
        table.on('tool(orderList)', function(obj){
          switch(obj.event){             
            case 'delete':
              member_del(obj.data.id,function(){
                  obj.del()
              })
            break;
            case 'edit':
              global.dialog_show('编辑',`/pages/order/edit/#/order_id=${obj.data.id}`)
            break;
            case 'status':
              let prompt  = ''
              let url = ''
              if(obj.data.status_id ==  3){
                if(!obj.data.order_id){
                  layer.alert('请先填写会员付款后的订单编号，然后完成审核')
                  return
                }
                prompt = '确定会员已经付款了么？'
                url = '/api/v1/order/alreadyPay/' + obj.data.id
              }else if(obj.data.status_id == 4){
                prompt = '确认已审核通过？'
                url = '/api/v1/order/waitBack/' + obj.data.id
              }else if(obj.data.status_id == 5){
                if(!obj.data.refundTime){
                  layer.alert('请先填写返款日期，然后完成审核');
                  return
                }
                prompt = '确认已返款？'
                url = '/api/v1/order/alreadyBack/' + obj.data.id
              }else if(obj.data.status_id == 8){
                prompt = '订单确定核对无误？'
                url = '/api/v1/order/alreadyFinish/' + obj.data.id
              }else{
                return
              }
              
              const id = layer.confirm(prompt,function(index){
                global.ajax({
                  url:url,
                  type:'POST',
                  success:function(data){
                    layer.close(id); 
                    if(!data.code){
                      layer.msg(data.message,{icon:1,time:500});
                      tableObj.reload()
                    }else{
                      layer.msg(data.message,{icon:5,time:500});
                    }
                  },
                  error:function(){
                    layer.close(id); 
                    layer.msg("服务器开小差了",{icon:5,time:500});
                  }
                })
                 
              })
            break
          };
        });
   
  
        //监听查询
        form.on('submit(sreach)', function(data){
          tableObj.reload({
            where:{
              ...data.field,
              consumer_id: consumer_id,
              product_id: product_id
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
    
    /*用户-删除*/
    function member_del(id,callback){
        layer.confirm('确认要删除吗？',function(index){

          global.ajax({
            url:'/api/v1/order/delete',
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
            url:'/api/v1/order/delete',
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

    exports('orderList',{})
});