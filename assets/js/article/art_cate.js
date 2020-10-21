// 打开的新增窗口的id
var addWindowId = null;

$(function () {
    // 1.请求分类列表
    getArtCateList()
    // 2.为添加分类按钮添加点击事件 并显示新增面板
    $('#btnShowAdd').on('click', function () {
        addWindowId = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#addPannel').html()
        })
    })

    // 3.为新增表单添加提交事件
    $('body').on('submit', '#formAddPannel', function (e) {
        e.preventDefault();
        addArtCate()
    })

    // 4.为动态生成的数据行里的修改按钮代理点击事件
    $('.layui-table tbody').on('click', '.btn-edit', function (e) {
        // 1.获取当前行中的数据
        // console.log(this.dataset.id); 
        var oldData = {
            Id: this.dataset.id,// ES6语法
            name: $(this).parent().prev('td').prev('td').text().trim(),
            alias: $(this).parent().prev('td').text().trim()
        }
        // 2.显示编辑面板 同时显示数据
        showEditPannel(oldData);

        // 3.为编辑面板的表单提交事件绑定方法
        $('body').on('submit', '#formEditPannel', function (e) {
            e.preventDefault();
            editArtCate();
        })

        // $('tbody').on('submit', '#formEditPannel', function (e) {
        //     e.preventDefault();
        //     editArtCate();
        // })

    });

    // 5.为动态生成的数据行里的删除按钮代理点击事件
    $('.layui-table tbody').on('click', '.btn-del', function (e) {
        var id = $(this).attr("data-id")
        delArtCate(id);
    })
})




// 1.请求分类列表 数据 并通过模板引擎渲染到页面
function getArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            // console.log(res);
            // 1.
            if (res.status === 0) {
                var strHtml = template('tpl-row', res);
                $('.layui-table tbody').html(strHtml)
            }
        }
    })
}

// 2.新增分类
function addArtCate() {
    // console.log($('#formAddPannel').serialize());
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $('#formAddPannel').serialize(),
        success(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 如果新年增成功 则刷新列表并关闭窗口
            getArtCateList();
            console.log(addWindowId);
            layui.layer.close(addWindowId);
        }
    })
}

// 3.显示编辑窗口
function showEditPannel(oldData) {
    addWindowId = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '编辑文章分类',
        content: $('#editPannel').html()
    })
    console.log(oldData);
    // 调用yayui的方法来填充表单
    layui.form.val('form-edit', oldData);
}

// 4.修改分类方法 
function editArtCate() {
    var dataStr = $('#formEditPannel').serialize();
    $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: dataStr,
        success(res) {
            layui.layer.msg(res.message);
            if (res.status === 0) {
                getArtCateList() // 
                layui.layer.close(addWindowId);
            }
        }
    })
}

// 5.删除分类方法
function delArtCate(cateId) {
    layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + cateId,
            success(res) {
                console.log(res);
                // layui.layer.msg(res.message)
                if (res.status === 0) {
                    getArtCateList()
                }
            }
        })
        // 关闭消息窗
        layer.close(index);
    })
}