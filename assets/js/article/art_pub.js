var $image = null
var options
var pubState = '草稿';
$(function () {
    // 1.初始化图片裁剪器
    $image = $('#image')
    // 2.裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.初始化剪裁区
    $image.cropper(options);

    // 0.初始化富文本编辑器
    initEditor()
    // 1.调用下拉框方法
    makeSelect();
    // 2.为选择封面按钮绑定事件
    $('#btnChoose').on('click', function (e) {
        $('#fileCover').click()
    });
    // 3.为文件选择框添加onchange事件
    $('#fileCover').on('change', changeFile);
    // 注意：
    // 4.为表单添加submit事件
    $('#formAdd').on('submit', submitData);
    // 5.为两个提交按钮添加点击事件 用来修改发布状态
    // 5.1发布按钮
    $('#btnFB').on('click', function (e) {
        pubState = '已发布';
    })
    // 5.2存为草稿
    $('#btnCG').on('click', function (e) {
        pubState = '草稿';
    })

})

// 1.请求下拉框数据并生成下拉框
function makeSelect() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            // a.判断是否获取成功
            if (res.status === 0) {
                // b.通过模板引擎生成下拉框的html代码字符串
                var htmlStr = template('tpl-cate', res.data);
                $('[name=cate_id]').html(htmlStr);
                // c.重新渲染表单元素
                layui.form.render();
                // return layer.msg('初始化文章失败！')
            }

        }
    })
}

// 2.文件选择框的onchang事件处理函数
function changeFile(e) {
    // a.判断是否选中文件
    if (e.target.files.length == 0) {
        return layui.layer.msg('请选择文件哦~');
    }
    // b.获取选中文件创建虚拟路径
    var selFile = e.target.files[0];
    var virPath = URL.createObjectURL(selFile);
    // c.将虚拟路径设置给剪裁区
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', virPath)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

}

// 3.表单 onsubmit 事件处理函数
function submitData(e) {
    // a.阻断表单默认的表单元素数据
    e.preventDefault()
    // b.通过formData获取表单元素数据
    var fd = new FormData(this);
    // c.为fd添加文章的发布状态
    fd.append('state', pubState)
    // c.测试数据
    // console.log(fd);
    // fd.forEach(function (v, k) {
    //     console.log(k, '=', v);
    // });
    // d.将图片数据添加到formData中
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将图片数据添加到formData中
            fd.append('cover_img', blob);
            // e.异步提交到新增文章接口
            pubArticle(fd);
        });
    // fd.forEach(function (v, k) {
    //     console.log(k, '=', v);
    // });
}

function pubArticle(fd) {
    // layui.layer.msg(123)
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 提交formData数据需要设置一下两个属性为false
        processData: false,
        contentType: false,
        success(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }

            layui.layer.msg(res.message, function () {
                location.href = '/article/art_list.html'
            });


            /* layui.layer.msg(res.message);
            if (res.status === 0) {
                location.href = '/article/art_list.html'
            } */

        }
    })
}