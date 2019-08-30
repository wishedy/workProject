/**
 * 功能描述：个人中心头像替换功能
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：
 * Created by HJ on 2018/05/08.
 */
module.logoReplace = function (obj) {
    var picpath = "";
    var defaults = {};
    var options = $.extend(defaults, obj);
    var controller = {
        template: {
            main: '<div class="personal_sc">' +
            '    <div class="personal_top_title_sc">编辑个人头像<div class="personal_pupop_close"></div></div>' +
            '    <div class="personal_img_cont_sc">' +
            '           <div class="personal_img_cont_sc_left">' +

            '           </div>' +
            '        <div class="personal_img_cont_sc_right">' +
            '            <div class="personal_img_cont_sc_right02 showWrap big-wrap" id="bigWrap"><img class="ev-showWrapImg" src="//modules.allinmd.cn/logo-Replace/images/userImgNormal.png" /></div>' +
            '            <div class="personal_img_cont_sc_right02 showWrap middle-wrap" id="middleWrap"><img class="ev-showWrapImg" src="//modules.allinmd.cn/logo-Replace/images/userImgNormal.png" /></div>' +
            '            <div class="personal_img_cont_sc_right02 showWrap small-wrap" id="samllWrap"><img class="ev-showWrapImg" src="//modules.allinmd.cn/logo-Replace/images/userImgNormal.png" /></div>' +
            '        </div>' +
            '         <div class="personal_mb"></div>' +
            '    </div>' +
            '<div class="uploadImgbtn"><p class="uploadImgbtnText ev-uploadImgbtnText"><i></i><span>上传图片</span></p>' +
            '   <form id="uploadPic" method=\"post\" enctype=\"multipart/form-data\" >' +
            '       <input type="file" id="ev-uploadBtn" accept="image/*" style="opacity: 0;outline: none;" />' +
            '   </form>' +
            '</div>' +
            '<div class="uploadImgIntro">仅支持JPG、JPEG、PNG，大小不超过10M</div>' +
            '    <div class="personal_sc_img_but">' +
            '        <div class="personal_sc_img_but_bg p_s_r cursor" id="cancelBtn">取消</div>' +
            '        <div class="personal_sc_img_but_bg p_s_l cursor gray" id="saveBtn">确定</div>' +

            '    </div>' +
            '</div>',
            html: '<div class="first ev-first"> ' +
            '     <div class="showWrap hide previewBox ev-previewBox">' +

            '     </div>' +
            '     <div class="uploading ev-uploading hide">' +
            '          <div class="personal_img_cont_sc_l_top"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/loading.gif" /></div>' +
            '          <div class="personal_img_cont_sc_l_center upload-font">正在上传</div>' +
            '     </div>' +
            '</div>'
        },
        path: {
            upload: PC_CALL + "comm/upload_attachment/uploadLogo/"
        },
        init: function (obj) {
            var t = this;
            t.triggerClick();
        },
        //触发更换头像的click事件
        triggerClick: function () {
            var t = this;
            var _imgLogo = options.container.find("img");
            options.container.off("click").on("click", function () {
                t.dialog = $(t.template.main);
                $("body").append(t.dialog);
                comm.LightBox.show(50, "#999");
                comm.setCenter(t.dialog);

                $(".personal_img_cont_sc_left").html(t.template.html);
                $('.ev-previewBox').append('<img src=""/>');
                $.each($(".showWrap"), function (i, e) {
                    if ($(e).find("img").length) {
                        $(e).find("img").attr("src", _imgLogo.attr("src"))
                    } else {
                        $(e).append('<img src="' + _imgLogo.attr("src") + '"/>');
                    }
                    $(e).show();
                });
                $(".ev-uploadImgbtnText span").text("上传图片");
                $("#saveBtn").addClass("gray");
                t.bindDialog();
                if (comm.browser.isIe8()){
                    $('.ev-previewBox').css({
                        'margin-left':-$('.ev-previewBox img').width()/2,
                        'margin-top':-$('.ev-previewBox img').height()/2
                    });
                }

            });
        },
        //选择图片，关闭，取消上传
        bindDialog: function () {
            var t = this;
            // 关闭 取消
            t.dialog.find(".personal_pupop_close,#cancelBtn").on("click", function () {
                comm.LightBox.hide();
                t.dialog.remove();
                if ($(this).hasClass("personal_pupop_close")) {
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "全站功能按钮点击",
                        keyword: "上传头像弹层关闭",
                        actionId: 43
                    });
                } else {
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "全站功能按钮点击",
                        keyword: "上传头像弹层取消",
                        actionId: 45
                    });
                }
            });
            if (typeof FileReader != 'undefined') {  // 本地可预览模式
                t.bindReplaceInput();
            } else {    // 远程上传模式
                t.bindRemoteUpload();
            }
            // 上传过程
            t.bindUpload();
        },
        //本地可裁切模式
        bindReplaceInput: function () {
            var t = this;
            $("#ev-uploadBtn").off("change").on('change', function (e) {
                var _file = e.target.files[0];
                if (_file) {

                    var fileSize = comm.file.getFileSize($(this)[0]);
                    if (fileSize > 1048576 * 10) {
                        alert('图片不能大于10M');
                        $("#ev-uploadBtn").val("");
                        return false;
                    }
                    if (!/\.((jpg)|(jpeg)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .jpeg .png类型的图片文件');
                        return false;
                    }
                    $(".ev-uploading").show();
                    $("#ev-uploadBtn").hide();
                    if (!$(".ev-first").length) {
                        $(".personal_img_cont_sc_left").html(t.template.html);
                        $('.showWrap').append('<img src=""/>');
                    } else {
                        $('.showWrap').find('img').remove();
                    }
                    if($(".cropper-container").length){
                        $(".cropper-container").remove();
                    }
                    $.imageFileVisible({
                        wrapSelector: ".showWrap",
                        fileSelector: "#ev-uploadBtn",
                        callback: function () {
                            $("#ev-uploadBtn").show();
                            $("#saveBtn").removeClass("gray");
                            $(".showWrap").show();
                            $(".ev-uploading,.ev-showWrapImg").hide();
                            t.callbackW = $(".ev-previewBox img").width();
                            t.callbackH = $(".ev-previewBox img").height();
                            t.cropperInit();
                        }
                    });
                }
            });
        },
        //初始化裁剪框
        cropperInit: function () {
            var t = this;
            $('.ev-previewBox>img').cropper({
                aspectRatio: 16 / 16,
                background: false,
                zoomable: false,
                mouseWheelZoom: false,
                movable: false,
                autoCropArea: 1,
                viewMode:1,
                dragMode:'move',
                minContainerWidth: 1,
                minContainerHeight: 1,
                minCanvasWidth:1,
                minCanvasHeight:1,
                minCropBoxWidth:1,
                minCropBoxHeight:1,
                crop: function (data) {
                    $(".ev-uploadImgbtnText span").text("重新上传");
                    t.cropCutImg();
                }
            });
        },
        //裁剪图片事件
        cropCutImg: function () {
            var t = this;
            var photo = $('.ev-previewBox>img').cropper('getCroppedCanvas', {
                width: 300,
                height: 300
            }).toDataURL('image/png');
            t.photo = photo;
            $("#bigWrap img").attr("src", photo);
            $("#middleWrap img").attr("src", photo);
            $("#samllWrap img").attr("src", photo);
        },
        //远程上传模式，可能是兼容IE
        bindRemoteUpload: function () {
            var t = this;
            $("#uploadPic").hide();
            $(".uploadImgIntro").text("您当前的浏览器暂不支持此项操作，请更换其他浏览器");
        },
        //上传保存过程操作
        bindUpload: function () {
            var t = this;
            t.dialog.find("#saveBtn").off("click").on("click", function () {
                if(!$("#saveBtn").hasClass("gray")){
                    $("#ev-uploadBtn").hide();
                    t.dialog.find(".previewBox").hide();
                    t.dialog.find(".uploading").show();     // 上传中
                    if (typeof FileReader != 'undefined') {  // 本地可预览模式
                        $.ajax({
                            type: "POST",
                            url: t.path.upload,
                            data: {
                                paramJson: $.toJSON({
                                    fileContent: t.photo.split('data:image/png;base64,')[1],
                                    imageType: 1,
                                    extName: 'png',
                                    isValid:1
                                })
                            },
                            dataType: "json",
                            success: function (data) {
                                if (data && data.responseObject && data.responseObject.responseStatus) {
                                    options.callback && options.callback(data);
                                    comm.LightBox.hide();
                                    $("#ev-uploadBtn").show();
                                    t.dialog.remove();
                                }
                            },
                            error: function (data) {
                            }
                        });
                    }
                }

            });
        }
    };
    controller.init(obj);
};