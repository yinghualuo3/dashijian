$(function () {
    // 1.为提交按钮添加点击事件
    $('#btnSubmit').on('click', function () {
        changePwd()
    });
})

// 2.修改用户的密码
function changePwd() {
    // a.通过jq获取表单数据(原密码和新密码 因为新密码没有加name)
    var strData = $('#formChangPwd').serialize();
    console.log(strData);
    // b.提交到重置密码接口
    $.ajax({
        url: '/my/updatepwd',
        method: 'POST',
        data: strData,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                layui.layer.msg(res.message);
            } else {
                layui.layer.msg(res.message, function () {
                    localStorage.removeItem('token');
                    window.parent.location.href='../login.html'
                })
            }
        }
    })

}