// 1.开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'

// 拦截所有ajax请求: get/post/ajax;
// 处理参数
$.ajaxPrefilter(function (params) {
    // 1.路径添加前缀
    params.url = baseURL + params.url;
    // 2.给有权限的路径添加头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 3. 拦截所有响应，判断身份认证信息
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html'
        }
    }
})