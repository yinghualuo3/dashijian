// 为jq的异步请求 新增一个回调函数 每次jq异步请求之前 都会先执行以下代码
$.ajaxPrefilter(function (opt) {
    // 1.基地址改造 opt.url=基地址+'/api/login'
    opt.url = 'http://ajax.frontend.itheima.net' + opt.url;
    // console.log(opt.url);

    // 2.自动将localstring中的token读取并加入到请求报文中 一起发送给服务器
    // 2.1判断当前url中是否包含了/my/' 如果包含则发送token
    if (opt.url.indexOf('/my/') > -1) {
        opt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 3.统一处理服务端返回的未登录错误
    opt.complete = function (res) {
        if (res.responseJSON.status === 1) {
            // a.提示用户没有权限
            alert('对不起，您的登录已失效 (＞人＜；)')
            // b.删除localStorage中可能存在的伪造的token
            localStorage.removeItem('token');
            // c.强制跳转到登录页面
            location.href = './login.html';
        }
    }
})
