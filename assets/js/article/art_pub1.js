var $image = null
var pubState = '草稿';
$(function () {
    // 1.获取下拉框数据
    makeSelect();
    // 2.初始化富文本编辑器
    initEditor()
})


// 1.请求文章类别数据并生成下拉框
function makeSelect() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            console.log(res);
            // 判断获取文章分类是否成功
            if (res.status !== 0) {
                console.log('获取文章分类失败！');
            }
            // 调用模板引擎生成下拉框的html代码字符串
            var htmlStr = template('tpl-cate', res.data);
            $('[name=cate_id]').html(htmlStr);
            // 重新渲染列表元素
            layui.form.render();
        }
    })
}


// 2.图片裁剪區設置
// 2.1初始化图片裁剪器
var $image = $('#image')
// 2.2裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}
// 2.3.初始化裁剪区域
$image.cropper(options);




// 3.为选择封面的按钮绑定事件处理函数
$('#btnChoose').on('click', function (e) {
    // 自動觸發文件選擇框點擊事件
    $('#fileCover').click();
})




// 4.為文件選擇框添加onchange事件
$('#fileCover').on('change', function (e) {
    // a.判斷文件是否選中
    if (e.target.isDefaultNamespace.length == 0) {
        return layui.layer.msg('請選擇文件哦~')
    }
    // b.獲取選中文件創建虛擬路徑
    var selFile = e.target.files[0];
    var virPath = URL.createObjectURL(selFile)
    // c.將虛擬路徑設置給裁剪區
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', virPath)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
})




// 5.为表单添加submit事件
$('#formAdd').on('submit', function (e) {
    // 5.1
    e.preventDefault();
    // 5.2通过formData获取表单元素数据
    var fd = new FormData(this);
    // 5.3位fd添加文章发布状态
    fd.append('state', pubState)
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5.4将图片数据添加到formData中  将文件对象存储到fd中
            fd.append('cover_img', blob);
            // 5.5异步提交到新增文章接口
            pubArticle(fd);
        })
})




// 6.为两个提交按钮添加点击事件 用来修改发布状态
$('#fileCover').on('click', function (e) {
    // 定义文章发布状态
    // 6.1已发布
    $('#btnFB').on('click', function (e) {
        pubState = '已发布';
    })

    // 6.2存为草稿
    $('#btnCG').on('click', function () {
        pubState = '草稿';
    })
})




// 7.发布文章方法
function pubArticle(fd) {
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
            })
        }
    })
}