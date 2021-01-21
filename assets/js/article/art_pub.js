$(function () {
    var layer = layui.layer
    var form = layui.form

    // 1.初始化分类
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)

    // 4.选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5.文章渲染封面
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file === undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的URL地址:
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域:
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布'
    // $('#btnSend1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSend2').on('click', function () {
        state = '草稿'
    })

    // 7.发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData对象，收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                // 发送ajax 要写在toBlob里面
                // console.log(...fd);
                publishArticle(fd)
            })
    })

    // 封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // formData类型数据ajax提交,需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布文章成功')
                // 跳转
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
            }
        })
    }
})