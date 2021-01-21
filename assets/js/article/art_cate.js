$(function () {
    var layer = layui.layer
    // 1.初始化文章分类列表
    initArticleList()

    function initArticleList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var str = template('tpl-art-cate', res)
                $('tbody').html(str)
            }
        })

    }


    // 2.显示添加区域
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    })

    // 3.提交文章分类(事件委托)
    var layer = layui.layer
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功，重新渲染页面数据
                initArticleList()
                layer.msg('文章类别添加成功')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 4.显示修改form表单
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章类别',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // alert($(this).attr("dara-id"))
        var Id = $(this).attr("data-id")
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

        // 5修改
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('文章类别更新成功')
                    initArticleList()
                    layer.close(indexEdit)
                }
            })
        })
    })

    // 6删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArticleList()
                    layer.msg('删除成功')
                    layer.close(index);
                }
            })
        })
    })
})