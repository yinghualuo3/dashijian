// var layer = layui.layer;
// var form = layui.form;
$(function () {
    // 1.初始化表格
    getArtList();
    // 2.初始化分类数据
    getCateData();
    // 3.为筛选区表单绑定提交事件(写在入口函数外面)
    // 4.定义渲染分页的方法
    renderPageBar();
    // 5.删除列表数据
})

// 0.全局变量 默认查询参数对象
let queryData = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',  // 文章分类id
    state: ''
};


// 1.请求文章列表
function getArtList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: queryData,
        success(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取文章列表失败！');
            }
            // 调用模板引擎
            var strHtml = template('tpl-row', res);
            $('.layui-table tbody').html(strHtml);

            // 调用渲染分页的方法
            renderPageBar(res.total); // res.total总数据条数
        }
    })
}

// 1.1定义美化时间过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
function padZero(time) {
    return time > 9 ? time : '0' + time;
}


// 2.初始化文章分类的方法
function getCateData() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            if (res.status !== 0) {
                console.log('获取文章分类列表失败');
            }
            // 如果获取文章分类列表成功 则调用模板引擎并得到下拉框的html字符串并重新渲染页面
            var optStr = template('tpl-select-status', res);
            // 属性选择器
            $('[name=selCate]').append(optStr);
            // 通知layui重新渲染表单区域的ui结构
            layui.form.render();
        }
    })
}


// 3.为筛选区表单绑定提交事件
$('#formSearch').on('submit', function (e) {
    // 3.1阻止表单默认提交行为
    e.preventDefault();
    // 3.2获取表单中选项的值 并赋值给查询参数对象queryData中的属性
    queryData.cate_id = $('#select1').val();
    queryData.state = $('#select2').val();
    // console.log(queryData);
    // 3.3根据最新筛选条件重新渲染表格数据
    getArtList();
})


// 4.定义渲染分页的方法
function renderPageBar(total) {
    // console.log(total);  //打印条数
    layui.laypage.render({
        elem: 'pageBar', // 分页容器的Id 注意不要加#
        count: total,   // 总数据条款
        limit: queryData.pagesize,
        curr: queryData.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页切换的时候会触发jump函数
        jump: function (obj, first) {
            // 把最新的页码值赋值到queryData查询参数对象的pagenum属性中
            queryData.pagenum = obj.curr; // 将当前被点击对象设置给全局参数对象里的页码属性
            // 把最新的条目数 赋值到queryData查询参数对象的pagesize属性中
            queryData.pagesize = obj.limit; // 将当前选中的页容量设置给全局参数对象
            //  不是第一次触发就重新请求列表数据
            if (!first) {
                getArtList();
            }
        }
    })
}


// 5.删除列表数据
$('tbody').on('click', '.btn-del', function () {
    // 5.1从被点击按钮上获取当前数据的id
    var id = this.dataset.id;
    console.log(this);
    // 删除数据之前 获取当前删除按钮的个数
    var restRowNum = $('.layui-table tbody tr btn-del').length;
    // 5.2询问用户是否要删除数据
    layui.layer.confirm('您确认要删除这条数据吗', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success(res) {
                layui.layer.msg(res.message);
                if (res.status == 0) {
                    if (restRowNum == 1) {
                        // 当前页码 - 1
                        queryData.pagenum = queryData.pagenum == 1 ? 1 : queryData.pagenum - 1;
                    }
                    // 如果删除成功 则重新调用加载列表方法(刷新表格数据)
                    // 如果删除失败 则显示错误消息
                    getArtList();
                }
            }
        })
        layer.close(index);
    })
});





