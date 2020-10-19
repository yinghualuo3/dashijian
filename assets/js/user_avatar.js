$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1, // 1代表是正方形的裁剪区域 长方形 16/9 4/3
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // -----------------------------------------
    // 为上传按钮绑定点击事件 模拟文件框被点击
    $('#btnUpload').on('click', function () {
        $('#file').click();
    })

    // 为文件选择框绑定onchange事件
    $('#file').on('change', function (e) {
        var list = e.target.files;
        // 判断 如果没有选中图片 则提示消息
        if (list.length == 0) {
            return layui.layer.msg('请选中要上传的图片~')
        }


        // a.拿到用户选择的文件 如果选中了新的图片 则设置给图片剪裁区
        var file = e.target.files[0];
        // b.为文件图片创建虚拟路径
        var newImgURL = URL.createObjectURL(file);
        // c.设置给剪裁区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 确定上传--------------------------------------------------
    // 为确定按钮绑定点击事件
    $('#btnOk').on('click', function (e) {
        // 1.要拿到用户裁剪之后的头像
        var imgDataBase64 = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        console.log(imgDataBase64);
        // 2.调用接口 把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: imgDataBase64,
            },
            success: function (res) {
                // 一旦收到服务器数据后 就立即显示提示消息

                layui.layer.msg(res.message)
                if (res.status === 0) {
                    window.parent.getUserInfo()
                }
            }
        })
    });

})