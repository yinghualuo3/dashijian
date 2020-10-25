$(function () {
    // 添加layui的自定义校验规则
    layui.form.verify({
        repwd: function (confirmpwd) {
            var newpwdStr = $('[name=newPwd]').val().trim();
            if (newpwdStr != confirmpwd) {
                return '两次输入密码不一致！'
            }
        }
    })

    // 为提交按钮添加点击事件
    $('#formChangPwd').on('submit', changePwd);
})


// 2.修改用户的密码
function changePwd(e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 获取表单数据
    var strData = $(this).serialize();
    console.log(strData);
    // 提交到重置密码接口
    $.ajax({
        method: 'POST',
        url: "/my/updatepwd",
        data: strData,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.layer.msg(res.message, function () {
                localStorage.removeItem('token');
                window.top.location.href = '../login.html';
            })
        }
    })
}