/**
 * 功能描述：选择并截取用户头像  截取未开发
 * 使用方法:
 * 注意事件：
 * 引入来源：  依赖 v2/js/plugins/add-removeable-group-pic/plugin.replaceInput/plugin.replaceInput.js
 *               v2/js/plugins/add-removeable-group-pic/plugin.readFile/plugin.readFile.js
 *               ajaxSubmit.js
 * 作用：
 *
 * Created by LiuYuTao on 2015/4/7.
 */

$.fn.selectCutUserPic = function (Obj) {
    var defaults = {

    };
    

    var picpath = "";
    var options = $.extend(defaults, Obj);
    var _thisEl = $(this);
    var controller = {
        path: {
            upload: PC_CALL+"comm/upload_attachment/upload/"
        },
        template: {
            main: '<div class="personal_sc">' +
                '    <div class="personal_top_title_sc">编辑个人头像<div class="personal_pupop_close"></div></div>' +
                '    <div class="personal_img_cont_sc">' +
                '       <form id="uploadPic" method=\"post\" enctype=\"multipart/form-data\" >' +
                '           <div class="personal_img_cont_sc_left">' +
                '           <input type="file" id="uploadPersonalImg" />' +
                '        </div></form>' +
                '        <div class="personal_img_cont_sc_right">' +
                // '            <div class="personal_img_cont_sc_right01">预览</div>' +
                '            <div class="personal_img_cont_sc_right02 showWrap big-wrap" id="bigWrap"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/userImgNormal.png" /></div>' +
                // '            <div class="personal_img_cont_sc_right03">100 x 100</div>' +
                '            <div class="personal_img_cont_sc_right02 showWrap middle-wrap" id="middleWrap"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/userImgNormal.png" /></div>' +
                // '            <div class="personal_img_cont_sc_right03">65 x 65</div>' +
                '            <div class="personal_img_cont_sc_right02 showWrap small-wrap" id="samllWrap"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/userImgNormal.png" /></div>' +
                // '            <div class="personal_img_cont_sc_right03">40 x 40</div>' +
                '        </div>' +
                '         <div class="personal_mb"></div>' +
                '    </div>' +
                '<div class="uploadImgbtn"><p class="uploadImgbtnText"><i></i><span>上传图片</span></p><input type="file" style="opacity: 0;outline: none;" /></div>'+
                '<div class="uploadImgIntro">仅支持JPG、JPEG、PNG，大小不超过10M</div>'+
                '    <div class="personal_sc_img_but">' +
            '        <div class="personal_sc_img_but_bg p_s_r cursor" id="cancelBtn">取消</div>' +
                '        <div class="personal_sc_img_but_bg p_s_l cursor" id="saveBtn">确定</div>' +

                '    </div>' +
                '</div>'
        },

        init: function (Obj) {
            var t = this;
            t.bindInit();
        },
        bindInit: function () {
            var t = this;
            _thisEl.on("click", function () {
                t.openDialog();
            });
        },
        //弹层
        openDialog: function () {
            

            var t = this;
            t.dialog = $(t.template.main);
            $("body").append(t.dialog);
            comm.LightBox.show(50, "#999");
            comm.setCenter(t.dialog);
            t.bindDialog();
        },
        html:'<div class="first">   ' +
           // '   <div class="show personal_img_cont_sc_l_top"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/sc_img_tishi.png" /></div>' +
           //  '   <div class="show  personal_img_cont_sc_l_center choicePicture"><span>选择图片</span></div>' +
           //  '   <div class="show personal_img_cont_sc_l_bottom">只支持JPG、JPEG、PNG，大小不超过10M</div>' +
            '   <div class="showWrap hide previewBox"></div>' +
            '   <div class="uploading hide">' +
            '        <div class="personal_img_cont_sc_l_top"><img src="//plugins.allinmd.cn/select-cut-user-pic/images/loading.gif" /></div>' +
            '        <div class="personal_img_cont_sc_l_center upload-font">正在上传</div>' +
            '   </div>' +
            '</div>',
        bindDialog: function () {
            var t = this;
            // 关闭 取消
            t.dialog.find(".personal_pupop_close,#cancelBtn").on("click", function () {
                comm.LightBox.hide();
                t.dialog.remove();
                if($(this).hasClass("personal_pupop_close")){
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"上传头像弹层关闭",
                        actionId:43
                    });
                }else{
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"上传头像弹层取消",
                        actionId:45
                    });
                }
            });
            var input = t.dialog.find("#uploadPersonalImg");
            // 选择图片
            

            if(typeof FileReader != 'undefined') {  // 本地可预览模式
                t.bindReplaceInput(t.html);
            }else{    // 远程上传模式
                t.bindRemoteUpload();
            }
            // 上传过程
            t.bindUpload();
        },

        bindReplaceInput: function (obj) {
            var t = this;
            t.dialog.find("#uploadPersonalImg").replaceInput({
                uploadReplaceCss: {width: 350, height: 350},
                uploadInputCss: {
                    fontSize: 72,
                    cursor: 'pointer',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    filter: 'alpha(opacity=0)',
                    opacity: 0,
                    outline: 'none',
                    width: 350,
                    height: 350,
                    hideFocus: 'expression(this.hideFocus=true)'
                },
                //MAX_FILE_SIZE:5242880,
                html: obj,

                onChangeHdl: function () {
                    var fileSize = comm.file.getFileSize(document.getElementById("uploadPersonalImg"));
                    if (fileSize > 1048576*10) {
                        alert('图片不能大于10M');
                        $("#uploadPersonalImg").val("");
                        return false;
                    }
                    if (!/\.((jpg)|(jpeg)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .jpeg .png类型的图片文件');
                        return false;
                    }
                    $.imageFileVisible({
                        wrapSelector: ".showWrap",
                        fileSelector: "#uploadPersonalImg",
                        isBackground: true
                    });
                    var origin = $("#uploadPersonalImg");
                    origin.attr("name","file");
                    $(".showWrap").empty();
                    t.dialog.find(".first .show").hide();
                    t.dialog.find(".previewBox").show();

                }
            });
        },
        bindRemoteUpload: function () {
            $("#uploadPersonalImg").attr("name","file");
            var t = this;
            czyx.uploadReplace("#uploadPersonalImg", {
                url: PC_CALL+"comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
                data: {paramJson: $.toJSON({imageType: "0", domain: location.hostname})},
                uploadReplaceCss: {
                    //设置上传按钮图片
                    background: 'url(' + (picpath==""?"":picpath) + ') center no-repeat',
                    backgroundSize: '100%',
                    width: "375",             //上传按钮的宽度
                    height: "375",              //上传按钮的高度
                    marginRight: "10px",
                    marginTop: "10px",
                    borderRadius:(picpath==""?0:"50%")
                },
                html:(picpath==""?t.html:""),      // 替换后的DOM代码
                uploadInputCss: {
                    width: "375",             //上传按钮的宽度
                    height: "375",             //上传按钮的高度
                    top:0,
                    padding: "0",
                    borderRadius:(picpath==""?0:"200px")
                },
                uploadBefore: function () {
                    var fileSize = comm.file.getFileSize(document.getElementById("removeablePicBtn"));
                    if (fileSize > 1048576*10) {
                        alert('图片不能大于10M');
                        $("#removeablePicBtn").val("");
                        return false;
                    }
                    if (!/\.((jpg)|(jpeg)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .jpeg .png类型的图片文件');
                        $("#removeablePicBtn").val("");
                        return false;
                    }
                },
                uploadEnd: function (serverJson) {//上传完毕后调用

                    try {
                        serverJson = $.parseJSON(serverJson);
                        if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.url != "") {
                            $(".personal_img_cont_sc_left").html(
                                    ' <input type="file" id="uploadPersonalImg"/>');
                            picpath = serverJson.responseObject.responseMessage.url;
                            t.uploadResult = serverJson.responseObject.responseMessage;
                            $(".showWrap img").attr("src",picpath);
                            t.bindRemoteUpload();
                        } else {
                            if (serverJson.message) {
                                alert(serverJson.message);
                            } else {
                                alert("上传失败");
                            }
                        }
                    } catch (e) {
                        alert("上传失败")
                        //t.img = null;
                        return;
                    }
                }
            });
        },
        bindUpload: function () {
            var t = this;
            t.dialog.find("#saveBtn").on("click", function () {
                t.dialog.find(".previewBox").hide();
                t.dialog.find(".uploading").show();     // 上传中

                if(typeof FileReader != 'undefined') {  // 本地可预览模式

                        var uploadOptions = {
                            url: t.path.upload,
                            data:{paramJson:$.toJSON({imageType: "1"})},
                            type:"POST",
                            success: function (result) {

                                if (result.responseObject.responseStatus) {
                                    options.callback && options.callback(result);
                                    comm.LightBox.hide();
                                    t.dialog.remove();
                                } else {
                                    // 上传失败 TODO
                                }
                            }
                        };
                        t.dialog.find("form").ajaxSubmit(uploadOptions);
                }else{                      // 上传图片模式
                    //  保存操作
                    if(!t.uploadResult){return }
                    $.ajax({
                        url: PC_CALL+"commdata/saveLogoUrl/",
                        data: {
                            paramJson: $.toJSON({
                                uploadType: 0,
                                logoType: 10,
                                imageType: 1,
                                logoSize:t.uploadResult.logoSize,
                                logoWidth:t.uploadResult.logoWidth,
                                logoHeight: t.uploadResult.logoHeight,
                                dynaWidth: t.uploadResult.dynaWidth,
                                dynaHeight: t.uploadResult.dynaHeight,
                                logoUrl: t.uploadResult.url
                            })
                        },
                        type:"post",
                        success: function (result) {
                            if (result.responseObject.responseStatus) {
                                options.callback && options.callback(result);
                                comm.LightBox.hide();
                                t.dialog.remove();
                            } else {
                                // 上传失败 TODO
                            }
                        }
                    })
                }

            });
        }
    };

    controller.init(Obj);

};