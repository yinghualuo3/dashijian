// 1.入口函数
$(function () {
    // 1.请求文章列表
    getArtList()
    // 2.请求文章分类
    getCateData()
    // 3.为筛选按钮添加点击事件
    $('#btnSearch').on('click', searchList);

    // 1.4为每一行的删除按钮代理绑定点击事件
    $('.layui-table tbody').on('click', '.btn-del', doDel)
})


function searchList(e) {
    e.preventDefault()
    // 获取两个下拉框数据
    queryData.cate_id = $('[name=selCate]').val();
    queryData.state = $('[name=selStatus]').val();
}


var queryData = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''

}


// 1.1生成页码条(参数 总行数)
function renderPageBar(total) {
    // 渲染页码条
    layui.laypage.render({
        elem: 'pageBar', // 分页容器的Id
        count: total,   // 总数据条款
        limit: queryData.pagesize,
        curr: queryData.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        jump: function (obj, first) {  // jump 函数 会在页码被点击时调用
            // 将当前被点击对象设置给全局参数对象里的页码属性
            queryData.pagenum = obj.curr;
            // 将当前选中的页容量设置给全局参数对象
            queryData.pagesize = obj.limit;
            // 调用查询文章列表方法
            // 不是第一次触发就重新请求列表数据
            if (!first) {
                // 调用查询 文章列表 方法
                getArtList()
            }
        }
    });
}
// 请求文章列表
function getArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: queryData,
        success: function (res) {
            // console.log(res);
            var strHtml = template('tpl-row', res);
            console.log(strHtml);
            // 生成文章列表
            $('.layui-table tbody').html(strHtml);
            // 生成页码条
            renderPageBar(res.total)
        }
    })
}

function padZero(time) {
    return time < 10 ? "0" + time : time;
}

// 定义美化时间过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}



// 3.请求分类下拉框
function getCateData() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            if (res.status === 0) {
                // 生成下拉框html字符串
                var optStr = template('tpl-select-status', res)
                $('[name=selCate]').append(optStr)
                // 重新渲染layui的当前页面
                layui.form.render();
            }
        }
    })
}


// 4.删除按钮点击事件方法
function doDel() {
    // a.从被点击按钮上获取当前数据的id
    var dId = this.dataset.id;
    console.log(dId);
    // 注意 删除数据之前 获取当前删除按钮的个数
    var restRowNum = $('.layui-table tbody tr btn-del').length
    layui.layer.confirm('狗狗 你确认要删除这条骨头吗', { icon: 3, title: '提示' }, function (index) {

        // b.发送id到删除接口 执行删除操作
        $.ajax({
            url: '/my/article/delete/' + dId,
            method: 'get',
            success(res) {
                console.log(res);
                layui.layer.msg(res.message);
                if (res.status == 0) {
                    if (restRowNum == 1) {
                        // 当前页码 - 1
                        queryData.pagenum = queryData.pagenum == 1 ? 1 : queryData.pagenum - 1;
                    }
                    // b1.如果删除成功 则重新调用加载列表方法(刷新表格数据)
                    // b2.如果删除失败 则显示错误消息
                    getArtList();
                }
            }
        })
        layer.close(index);
    })
}

