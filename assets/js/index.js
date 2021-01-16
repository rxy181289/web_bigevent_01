$(function () {
    // 1.获取用户信息和头像，并渲染到页面上
    getUserInfo()

    var layer = layui.layer
    // 2.退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 清除本地存储token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})
// 封装一个获取用户信息和头像的方法
// 定义全局函数，方便后面使用

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败')
            }
            // 成功,获取头像
            randerAvatar(res.data)

        }
    })
}

function randerAvatar(user) {
    // 渲染名称(nickname优先，如果没有，就用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}