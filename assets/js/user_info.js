$(function () {
    // a.添加layui的自定义校验规则
    layui.form.verify({
        nickname: function (inputValue) {
            if (inputValue.length > 6) {
                return '昵称必须在1-6个字符之间~'
            }
        }
    });

    // b.发送异步请求
    getUserInfo()

    // c.重置功能
    $('#btnReset').on('click', function () {
        // 调用方法 重新请求用户信息 并填充到表单中
        getUserInfo();
    })
    // d.提交修改功能
    $('#btnSubmit').on('click', function () {
        modifyUserInfo();
    })
})

// 1.获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            layui.form.val('fUserInfo', res.data)
        }
    });
}

// 2.提交修改用户的信息---------------------------------
function modifyUserInfo() {
    // a.获取表单的数据 username=...
    var dataStr = $('#formModify').serialize();
    // b.异步提交到服务器 修改数据的接口
    $.ajax({
        url: '/my/userinfo',
        method: 'POST',
        data: dataStr,
        success: function (res) {
            console.log(res);
            if (res.status === 0) {
                layui.layer.msg(res.message);
                console.log(window.parent);
                window.parent.getUserInfo();
            }
        }
    })
}