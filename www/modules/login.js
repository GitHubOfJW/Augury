layui.define(['form','global'], function(exports) {
  // 设置模块
  const form = layui.form,
  global = layui.global,
  $ =  layui.jquery
  
  // 定义类
  class Login {

  }
  const login =  new Login();

  // 监听登录请求
  form.on('submit(login)',function(data){
    const loginBtn = $('input[lay-filter="login"]')
    loginBtn.attr('disabled',true)
    loginBtn.val('登录中...')
    // 发送请求
    global.ajax({
      url:'/api/v1/login',
      type:'POST',
      data:data.field,
      success:function(data){
        if(!data.code == 1){
          window.location.replace('/')
        }else{
          layer.msg(data.message);
          loginBtn.attr('disabled',false)
          loginBtn.val('登录')
        }
      },
      error:function(){
        loginBtn.attr('disabled',false)
        loginBtn.val('登录')
      }
    })
    return false;
  })

  exports('login',login);
});