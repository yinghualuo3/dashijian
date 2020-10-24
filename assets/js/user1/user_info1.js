
$(function () {
    // a.添加自定义校验规则
    layui.form.verify({
        nickename: function (inputValue) {
            if (inputValue.length > 6) {
                return '昵称必须在1-6个字符之间~'
            }
        }
    })
    // 1.获取用户基本信息
    getUserInfo();
    // 2.提交修改用户的信息
    // modifyUserInfo();
    // 3.重置功能   点击重置按钮重置用户信息
    $('#btnReset').on('click', function () {
        // 调用方法 重新请求用户信息 并填充到表单中
        getUserInfo();
    })
})

// 1.获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            console.log(res);
            if (res.status == 0) {
                // console.log(res);
                layui.form.val('fUserInfo', res.data);
            }
        }
    })
}


// 2.点击提交按钮提交修改用户的信息
$('#btnSubmit').on('click', function () {
    var dataStr = $('#formModify').serialize();
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: dataStr,
        success(res) {
            if (res.status === 0) {
                layui.layer.msg('res.message');
                window.parent.getUserInfo();
            }
        }
    })
})