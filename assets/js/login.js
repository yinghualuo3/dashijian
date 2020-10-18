// 声明全局变量
var $LoginBox, $RegBox; // 登录页面的两个超链接

$(function () {
    $LoginBox = $('.login-box');
    $RegBox = $('.reg-box');

    // 1.dom树准备完毕后 为去登录 和去注册 超链接添加点击事件
    $('#link_reg').on('click', function () {
        // 隐藏 登录框
        $LoginBox.hide();
        // 显示 注册框
        $RegBox.show();
    })

    // 2.dom树准备完毕后 为 去注册超链接 添加点击事件
    $('#link_login').on('click', function () {
        // 显示 登录框
        $LoginBox.show();
        // 隐藏 注册框
        $RegBox.hide();
    })

    // ----------------------------------------
    // 为登录 和 注册添加新的 验证规则
    // 从layui中获取form对象
    var form = layui.form;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 重复验证 形参val 会获取 确认密码框的内容
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败 则return一个提示消息即可
            var pwdStr = $('.reg-box [name=password]').val()
            // 1.获取 密码内容
            if (pwdStr !== value) {
                // 2.对比 密码内容 和 val 中的内容是否一致
                return '两次密码不一致哦 亲~~~'
            }
        }
    })


    // 1.注册表单提交事件
    $('#formReg').on('submit', function (e) {
        // a.取消表单的默认提交行为
        e.preventDefault();
        // b.获取注册信息
        let data = {
            username: $('.reg-box [name=username]').val().trim(),
            password: $('.reg-box [name=password]').val().trim(),
        };
        console.log(data);
        // c.发送注册信息到接口
        $.post('/api/reguser', data, function (res) {

            console.log(res);
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                layui.layer.msg(res.message, function () {
                    // alert(res.message);
                    // 模拟点击事件 去登录 按钮
                    // 进而触发点击事件 切换显示
                    $('#link_login').click();
                    // 清空注册表单内容
                    $('#formReg')[0].reset();
                })
                // 将用户名和密码设置给登录窗体的输入框
                $('.login-box [name=username]').val(data.username);
                $('.login-box [name=password]').val(data.password);
            }
        })
    })


    // 2.登录表单提交事件
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        // 获取用户名密码数据 urlencoded 格式 (键值对字符串--查询字符串)
        var strData = $(this).serialize();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: strData,
            success: function (res) {
                console.log(res);
                layui.layer.msg(res.message, function () {
                    if (res.status === 0) {
                        localStorage.setItem('token', res.token);
                        //     return layer.msg('登录失败！')
                        // }
                        // layer.msg('登录成功！')
                        // 跳转到后台主页
                        location.href = 'index.html';
                    }
                })
            }
        })
    })
})