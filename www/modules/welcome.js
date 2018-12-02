layui.define(['form','global'], function(exports) {
  // 设置模块
  const form = layui.form,
  global = layui.global,
  $ =  layui.jquery
 
  global.ajax({
    url:'/api/v1/welcome/list',
    type:'GET',
    success:function(data){
      if(!data.code){
        const lis =  $('.layui-this li')
        let index = 0;
        for(let item of data.data.list){
            lis.eq(index).find('h3').html(item.name)
            lis.eq(index).find('cite').html(item.count)
            index++;
        }
        
      }
    }
  })


  const user = layui.data('user');
  if(user.user){
    $('.user').html(user.user.name);
  }
  
  
  exports('welcome',{})
});