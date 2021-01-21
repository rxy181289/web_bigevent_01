$(function () {
    // 为art-template定义过滤器
    template.defaults.imports.dataFormat = function (daStr) {
        var dt = new Date(daStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    var layer = layui.layer
    var q = {
        // 定义提交的参数
        pagenum: 1, //页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: '',	//文章的状态，可选值有：已发布、草稿
    }

    // 1.渲染文章列表
    initTable()
    // 封装渲染文章列表
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 2.初始化分类
    var form = layui.form
    initCate()
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // form.render() 就是根据 select 标签生成 / 渲染 dl放dd
                // 如果我们赋值之后，发现数据没有同步出来，就可以调用 form.render() 
                form.render();
            }
        })
    }

    // 3.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();

        // 赋值
        q.state = state;
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 4.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            // 分页模块设置，显示了哪些模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器

            // 触发jump: 分页初始化的时候， 页面改变的时候
            jump: function (obj, first) {
                // obj: 所有参数所在的对象; first: 是否是第一次初始化分页
                // 把最新的页码值，复制到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // 判断， 不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    //初始化文章列表
                    initTable()
                }
            }
        })

    }


    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('文章删除成功')
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--

                    initTable();
                    layer.close(index);
                }
            })
        })
    })

})
