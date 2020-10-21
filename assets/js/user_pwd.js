$(function () {
    // a.添加layui的自定义校验规则
    /* 校验规则的方法
        调用时机 onsubmit
        返回值：
             */
    layui.form.verify({
        repwd: function (confirmpwd) {
            // a.获取新密码 
            var newpwdStr = $('[name=newPwd]').val().trim();
            // b.比较两次密码是否一致
            if (newpwdStr != confirmpwd) {
                return '两次密码输入不一致！';
            }
        }
    });

    // 1.为提交按钮添加点击事件
    $('#btnSubmit').on('submit', function () {
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
            // 判断
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            } else {
                layui.layer.msg(res.message, function () {
                    // 删除localStroage中的token
                    localStorage.removeItem('token');
                    // 跳转到login.html页面
                    window.parent.location.href = '../login.html'
                })

                /* // 这几个同时进行
                // 提示身份过期  
                layui.layer.msg(res.message);
                // 删除localStroage中的token
                localStorage.removeItem('token');
                // 跳转到login.html页面
                window.parent.location.href = '../login.html' */
            }
        }
    })

}