$(function () {
    // 自定校验用户昵称规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在1~6位之间'
            }
        }
    })

    // 2.获取和渲染用户信息
    initUserinfo();
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功，后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault()
        // 从新用户渲染
        initUserinfo()
    })

    // 4.提交用户信息
    layer = layui.layer
    $('form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layer.msg('用户信息更改成功')
                window.parent.getUserInfo()
            }
        })
    })
})