$(function () {
    // 获取裁剪区域的dom元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1, // 1代表是正方形的裁剪区域 长方形 16/9 4/3
        // 指定预览区域
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)

    // 上传 绑定点击事件
    $('#btnUpload').on('click', function () {
        $('#file').click();
    })

    // 为本间选择框绑定onchange事件
    $('#file').on('change', function (e) {
        var list = e.target.files;
        if (list.length == 0) {
            return layui.layer.msg('请选中要上传的图片哦~')
        }

        // 给图片设置裁剪区
        var file = e.target.files[0];
        // 为文件图片虚拟路径
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 确认上传
    $('#btnOk').on('click', function (e) {
        // 拿到用户裁剪之后的头像
        var imgDataBase64 = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(imgDataBase64);
        // 调用接口 把图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: imgDataBase64
            },
            success(res) {
                layui.layer.msg('res.message');
                if (res.status === 0) {
                    window.parent.getUserInfo()
                }
            }
        })
    })
})