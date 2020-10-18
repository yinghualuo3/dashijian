 $(function () {
    getUserInfo();

    // 为退出按钮添加事件
    $('#logoutBtn').on('click', function () {
        // 1.询问用户 使用layui提供的确认选择框
        layui.layer.confirm('亲 你确认要离开吗', { icon: 3, title: '提示' }, function (index) {
            // 2.如果用户点击确认退出 则
            // a.删除localString中的token
            localStorage.removeItem('token');
            // b.跳转到/login.html页面
            location.href = 'login.html'

            // 3.关闭当前弹出层
            layer.close(index);
        });
    });
})




// 1.异步获取获取用户的基本信息----------------------------------
function getUserInfo() {
    // a.获取token
    // var token = localStorage.getItem('token')
    // b.发送异步请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: token
        // },
        success: function (res) {
            // 显示加载消息
            layui.layer.msg(res.message);

            // 如果加载信息成功 则渲染页面用户信息区域
            if (res.status === 0) {
                renderUserinfo(res.data)
            }
        }
    });

    // 2.渲染用户信息的方法---------------------------------
    function renderUserinfo(userinfo) {
        // a.显示用户昵称或用户名
        var uName = userinfo.nickname || userinfo.username;
        console.log(uName);
        $('#welcome').html('欢迎' + uName);
        // b.显示用户头像
        // b1.图片头像
        if (userinfo.user_pic != null) {
            // b1.0 隐藏文字头像
            $('.userinfo .text-avatar').hide()
            // b1.1 设置头像路径 并显示图片头像
            $('.userinfo img').attr('src', userinfo.user_pic).show();
        }
        // b2.文本头像
        else {
            // b2.0 隐藏图片头像
            $('.userinfo img').hide()
            // b2.1 提取名字的首字符并转成大写
            var firstChar = uName[0].toUpperCase();
            // b2.2 将首字符设置给标签
            $('.userinfo .text-avatar').html(firstChar).show();
        }
    }
}