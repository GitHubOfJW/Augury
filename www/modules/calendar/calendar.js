layui.define(['form','laydate', 'table', 'global'], function(exports) {
   
    const form = layui.form,
    $ =  layui.jquery,
    table = layui.table,
    laydate = layui.laydate,
    global = layui.global;
  
    global.ajaxSetup($);
    
      //执行一个laydate实例
      laydate.render({
        elem: '#date', //指定元素
        position:'static',
        showBottom: false,
        type: 'date',
        change:function(date){
          console.log(date)
          global.ajax({
            url:'/api/v1/calendar/getLunar',
            type:'GET',
            data:{
              date:date
            },
            success:function(data){
              console.log(data)
              if(!data.code){
                $('#sunary').html(date)
                $('#year').html(data.data.yearColumn)
                $('#month').html(data.data.monthColumn)
                $('#day').html(data.data.dateColumn)
              }
            },
            error:function(data){

            }
          })
        }
      });
  
    exports('calendar',{})
});