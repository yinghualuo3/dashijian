// 1.入口函数
$(function () {

    getArtList()
})

// 请求文章列表
var queryData = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
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


function getArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: queryData,
        success: function (res) {
            // console.log(res);
            var strHtml = template('tpl-row', res);
            // console.log(strHtml);
            $('.layui-table tbody').html(strHtml);
        }
    })
}