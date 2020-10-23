
var $LoginBox, $RegBox;

$(function () {
    $LoginBox = $('.login-box');
    $RegBox = $('.reg-box')

    // 1.dom树加载完毕后 为登录和注册超链接添加点击事件
    // 1.1为 注册 超链接添加点击事件
    $('#link_reg').on('click', function () {
        $LoginBox.hide(); // 隐藏登录框
        $RegBox.show();   // 显示注册框
    })
    // 1.1为 登录 超链接添加点击事件
    $('#link_login').on('click', function () {
        $LoginBox.show(); // 显示登录框
        $RegBox.hide();   // 隐藏注册框
    })


    // 预定义校验规则lay-verify在html页面
    // 2.自定义校验规则
    layui.form.verify({
        // 密码框校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 确认密码框校验规则
        repwd: function (value) { // 此处形参value拿到的是确认密码框中的内容
            // 获取密码内容
            var pwdStr = $('.reg-box [name=password]').val() // 密码框中的值
            // 判断确认密码框value中的内容与密码框val中内容是否一致
            if (pwdStr !== value) {
                return '两次密码不一致哦亲~'
            }
        }
    })

    // 3.注册表单提交事件
    $('#formReg').on('submit', function (e) {
        // 3.1
        e.preventDefault();
        // 3.2获取注册信息 即获取username和password
        let data = {
            username: $('.reg-box [name=username]').val().trim(),
            password: $('.reg-box [name=password]').val().trim()
        }
        // 3.3
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                layui.layer.msg(res.message, function () {
                    // ---------------------
                    $('#link_login').click();
                    // 清空表单内容
                    $('#formReg')[0].reset();
                })
                // 将用户名和密码设置给等领域窗体的输入框
                $('.login-box [name=username]').val(data.username);
                $('.login-box [name=password]').val(data.password);
            }
        })
    })


    // 4.登录表单提交事件  // 表单而非按钮
    $('#formLogin').on('submit', function (e) {
        // 4.1
        e.preventDefault();
        // 4.2获取用户名密码数据 serialize()快速获取数据
        var strData = $(this).serialize();
        // 4.3
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: strData,
            success(res) {
                layui.layer.msg(res.message, function () {
                    if (res.status === 0) {
                        // 将获取到的token值存到本地
                        localStorage.setItem('token', res.token);
                        // 跳转到主页
                        location.href = 'index.html';
                    }
                })
            }
        })
    })
})