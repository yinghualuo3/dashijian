
$(function () {
    // 1.获取用户信息
    getUserInfo()
})

// 1.获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        daheaders: {
            Authorization: localStorage.getItem('token') || ''
        },
        success(res) {
            // 先显示加载成功与否的消息
            layui.layer.msg(res.message);
            // 如果加载成功 则渲染页面用户信息区域
            if (res.status === 0) {
                // 2.渲染用户信息区域(如下)
                renderUserInfo(res.data);

            }
        }
    })
}

// 2.渲染用户信息区域
function renderUserInfo(userinfo) {
    // console.log(userinfo);
    // 显示用户昵称或用户名
    var uName = userinfo.nickname || userinfo.username;
    console.log(uName);
    $('#welcome').html('欢迎 ' + uName + '~');
    // 显示用户头像
    // 图片头像
    if (userinfo.user_pic != null) {
        // 隐藏文字头像
        $('.userinfo .text-avatar').hide()
        // 设置头像图片路径并显示图片头像
        $('.userinfo img').attr('src', userinfo.user_pic).show();
    }
    // 文本头像
    else {
        // 隐藏图片头像
        $('.userinfo img').hide()
        // 提取名字的首字符并转成大写
        var firstChar = uName[0].toUpperCase();
        // 将首字符设置给标签
        $('.userinfo .text-avatar').html(firstChar).show()
    }
}


// 3.退出
$('#logoutBtn').on('click', function () {
    // 3.1点击退出按钮时跳出弹出层 提示用户是否退出
    layui.layer.confirm('确认要退出吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // console.log('ok');
        // 3.2点击确认退出时
        // 3.2.1删除中的token
        localStorage.removeItem('token')
        // 3.2.2跳转到login.html
        location.href = 'login.html';

        layui.layer.close(index);  // 关闭弹出层 layui中自带
    });
})