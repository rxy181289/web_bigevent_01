$(function () {
    $('#link-reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('#link-login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 2.自定义规则校验
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须是6-16位，且不能输入空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    })


    // 3.监听表单注册事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录!');
                //注册成功后自动返回登录页
                $('#link-login').click()
                // 清空注册页
                $('#form_reg')[0].reset()
            }
        })
    })

    // 4.监听表单登录事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        // 发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // 失败
                    return layer.msg(res.message)
                }
                // 成功
                layer.msg('登录成功')
                // 保存token本地存储
                localStorage.setItem('token', res.token)
                // 跳转页面
                location.href = '/index.html'
            }
        })
    })
})