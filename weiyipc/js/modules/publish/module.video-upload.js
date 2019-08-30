/**
 * 功能描述：  视频上传功能
 * 使用方法:   module.videoUpload({
                    videoBtn:$("#xxx"),//创建点击btn
                    container:$(".personal_content"),//存放弹层的外层
                    top:126,//弹层top值
                    userImg:1,//是否有用户头像
                    activityId:xxx,//活动ID 不传表示普通上传
                    property:{},//活动时选择的专业和术式
                    property_area:{},//新版活动赛区参数
                    callback:function(){},//回调函数
                    publishBack:function(){}
                });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/11/4.
 */
module.videoUpload = function (obj) {
    String.prototype.subByte = function (start, bytes) {
        for (var i = start; bytes > 0; i++) {
            var code = this.charCodeAt(i);
            bytes -= code < 256 ? 1 : 2;
        }
        return this.slice(start, i)
    };
    controller = {
        config: {
            imgPath: "//modules.allinmd.cn/publish/"
        },
        el: {},
        path: {
            getAreaExpertise: PC_CALL + "commdata/getAreaExpertise/",
            videoUpload: PC_CALL + "qiniu/storage/putUploadFile/",
            saveToTable: PC_CALL + "qiniu/storage/saveFileToTable/",
            videoCreate: PC_CALL + "video/baseinfo/create/",
            videoUpdate: PC_CALL + "customer/video/update/",
            videoDelete: PC_CALL + "customer/video/deleteAll/"
        },
        template: {
            videoTem: function (option) {
                var html = "";
                html += '<div class="doc_tc al_publishCon" id="content_video" style="top:' + option.top + 'px;' + (option.left ? "left:" + option.left + "px" : "") + '">' +
                '<!-- 发布遮罩 -->' +
                '<div class="publish_mask">' +
                '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />' +
                '</div>' +
                '<!-- 点击取消遮罩 -->' +
                '<div class="cancel_mask"></div>' +
                '<div class="upload_end">' +
                '<div class="upload_question new_question"><span></span>确定取消本次上传吗？</div>' +
                '<div class="bjfb_but">' +
                '<div><a href="javascript:;"><img class="continue_edit" src="' + option.imgPath + 'images/jx_sc.png" /></a></div>' +
                '<div style="margin-left:25px;"><a href="javascript:;"><img class="cancel_pub" src="' + option.imgPath + 'images/sure.png" /></a></div>' +
                '</div>' +
                '</div>' +
                (option.userImg ? '<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="' + option.userImg + '"/></div>' : '') +
                '<div class="fb_doc">' +
                '<div class="doc_tc_bg"></div>' +
                '<div class="upload_top" id="upload_init">' +
                '<div class="upload_video_icon">' +
                '<img src="' + option.imgPath + 'images/video_icon.png">' +
                '</div>' +
                '<div class="upload_top_center">' +
                '<div class="upload_video_value">格式：mp4、mov、avi、wmv、flv ，清晰度：不低于720p ，大小：不超过2G </div>' +
                '</div>' +
                '<div class="upload_top_text">' +
                '<a href="javascript:;" class="video_upload_but" id="container1">' +
                '<input class="upload_btn" type="file" name="file" id="upload_now">' +
                '</a>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="upload_top" id="upload_ing" style="display:none;">' +
                '<div class="upload_top_img">' +
                '<img id="file_icon" src="' + option.imgPath + 'images/video_icon.png" suc_img="' + option.imgPath + 'images/video_icon_success.png">' +
                '</div>' +
                '<div class="upload_top_center">' +//upload_error_img  success_upload_doc
                '<div class="uploading"><div class="upload_icon_status"></div><div class="upload_status">正在上传视频：</div> <div class="file_name"></div><div class="clear"></div></div>' +
                '<div class="jdt_img">' +
                '<div class="jdt_content"></div>' +
                '</div>' +
                '<div class="miao_text uv_loadding">努力上传中，请勿关闭当前页面<div class="loading_bg"><img src="' + option.imgPath + 'images/loadding.gif"/></div></div>' +
                '<div class="upload_success" style="display: none;">唯医网的视频需审核哦！</div>' +
                '</div>' +
                '<div class="upload_top_text">' +
                    /*'<a href="javascript:;" class="select_qx"></a>'+*/
                '<a href="javascript:;" class="select_anew" style="display:none"  id="container2">' +
                '<input class="upload_btn" type="file" name="file" id="upload_new">' +
                '</a>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +

                '<div class="upload_center">' +
                '<div class="upload_title">' +
                '<div class="found_case_small">' +
                '<div class="default_name font_yahei" style="display:none">标题</div>' +
                '<div class="input_write01">' +
                '<input type="text" id="video_name" placeholder="标题(必填)" class="font_yahei" max="25">' +
                ' </div>' +
                '<div class="djs_num name_num">25</div>' +
                '</div>' +
                '</div>' +
                '<div class="upload_textarea">' +
                '<div class="textarea_mr font_yahei">描述(必填)</div>' +
                '<div><textarea placeholder="最少70个字" id="video_abstract" class="font_yahei" max="400"></textarea></div>' +
                '<div class="ds_text ab_num">400</div>' +
                '<div class="uv_miaoshu">描述范本</div>' +
                '<div class="uv_ms_jt"></div>' +
                '<div class="uv_ms_text">微创技术是治疗复杂平台骨折的理想方法，河北医科大学第三医院彭阿钦教授介绍了自2006年5月2010年3' +
                '月间应用MIPO技术治疗SchatzkerV型和VI型骨折，即AO/OTA C型骨折共计30例。彭教授提到经验强调：把' +
                '握手术时机，伤后1-2小时手术，牵引有利于消肿...</div>' +
                '</div>' +
                /*'<div class="xuezu_x">' +
                '<div class="found_case_big">' +
                '<div class="default_name font_yahei" id="areaTitle1" style="display:block; top:26px">所属专业</div>' +
                '<div class="input_write">' +
                '<ul class="tc_tab_list" id="areaSel1"></ul>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="publish_zy_position">' +
                '<ul id="areaExp1"></ul>' +//专业数据
                '</div>' +
                '</div>' +*/
                '<div class="t_but">' +
                '<div class="publish_t_fb" id="video_save">发布</div>' +
                '<div class="publish_t_qx" id="video_cancel">取消</div>' +
                '</div>' +
                '</div>' +
                '</div>';

                return html;
            }
        },
        init: function (obj) {
            var t = this;
            this.options = {};
            var o = {
                container: $("body")
            };
            this.options = $.extend(o, obj);
            t.options.videoBtn.attr("on",true);
            this.create();

        },
        create: function () {
            var t = this;
            if(t.options.oneUpload){//TODO:针对活动只有一个资源发布时先清除click事件
                t.options.videoBtn.off("click");
            }
            this.options.videoBtn.on("click", function () {
                //if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
                //}
                var $this=$(this);
                if($(this).attr("on")=="true") {
                    $(this).attr("on", false);
                    if (t.options.needAuth) {
                        user.login({
                            callback: function () {
                                $this.attr("on",true);
                                t.options.indexLogin && t.options.indexLogin();
                                t.videoId = "";
                                t.options.container.css("position", "relative");
                                comm.LightBox.show(95, "#3c3c3d");
                                comm.LightBox.setZIndex(8);
                                if (!t.options.top) {
                                    var tTop = $(document).scrollTop();
                                    t.options.top = tTop + (tTop != 0 ? 50 : 80);
                                    t.options.left = ($(window).width() - 713) / 2;
                                }
                                if(!$("#content_video").length){
                                    t.options.container.append(t.template.videoTem({
                                        top: t.options.top,
                                        left: t.options.left,
                                        userImg: t.options.userImg,
                                        imgPath: t.config.imgPath
                                    }));
                                }
                                t.options.callback && t.options.callback();//回调函数
                                $("#content_video").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                                t.sample();
                                //t.getXuezu();
                                t.publishCancel();
                                t.someAction();
                            },
                            onClose: function () {
                                $this.attr("on",true);
                                t.options.indexLogin && t.options.indexLogin();
                            },
                            onAuthCancel: function () {
                                $this.attr("on",true);
                                t.options.indexLogin && t.options.indexLogin();
                            },
                            scene: privilegeSceneConst.eSceneTypePublic
                        })
                    } else {
                        //user.login({
                        //callback:function(){
                        $this.attr("on",true);
                        t.videoId = "";
                        t.options.container.css("position", "relative");
                        comm.LightBox.show(95, "#3c3c3d");
                        comm.LightBox.setZIndex(8);
                        if (!t.options.top) {
                            var tTop = $(document).scrollTop();
                            t.options.top = tTop + (tTop != 0 ? 50 : 80);
                            t.options.left = ($(window).width() - 713) / 2;
                        }
                        t.options.container.append(t.template.videoTem({
                            top: t.options.top,
                            left: t.options.left,
                            userImg: t.options.userImg,
                            imgPath: t.config.imgPath
                        }));
                        t.options.callback && t.options.callback();//回调函数
                        $("#content_video").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                        t.sample();
                        //t.getXuezu();
                        t.publishCancel();
                        t.someAction();
                        //},operateType : "auth"
                        //})
                    }
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"发布",
                    keyword:"发布视频",
                    actionId: 38
                });
                return false;
            })

        },
        //事件统一存放的方法
        someAction: function () {
            var t = this;
            //this.fileChange("#upload_now");
            this.uploadFile("#upload_now");
            comm.textChange({"$tex": $("#video_name"), "$num": $(".name_num")});
            comm.textChange({"$tex": $("#video_abstract"), "$num": $(".ab_num"), "noTop": 1});
            $("#video_name").bind("keyup keydown change input cut paste drop", function () {
                t.submitToggle();
            });
            $("#video_abstract").bind("keyup keydown change input cut paste drop", function () {
                t.submitToggle();
            });
            $("#video_abstract").bind("focus", function () {
                $(".textarea_mr").css("color", "#3d84c6");
            });
            $("#video_abstract").bind("blur", function () {
                $(".textarea_mr").css("color", "#969696");
            });
            var html = "";
            /*var tagList = t.options.property ? t.options.property.property_1 : [];
            if (tagList.length > 0) {
                $.each(tagList, function (i, val) {
                    $.each($("#areaExp1 li"), function (j, em) {
                        if ($(this).text() == val.propertyName) {
                            $("#areaTitle1").css("top", 20);//所属专业上浮
                            t.createSelectedItem(val.propertyName, '', 1);
                            $(this).addClass("disable").attr("select-status", "true").attr("no-change", "true");
                        }
                    });
                });
            }*/
        },
        //立即上传视频按钮
        uploadFile: function (obj, rUp) {
            var t = this;
            var dateStrBefore = "";
            var param={
                customerId:$("#sesCustomerId").val()
            };
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: obj.substring(1),
                container: $(obj).parent().attr("id"),
                drop_element: $(obj).parent().attr("id"),
                //max_file_size: '2048mb',
                multi_selection: false,
                flash_swf_url: '/js/third-party/plupload/Moxie.swf',
                dragdrop: true,
                chunk_size: '4mb',
                uptoken_url: PC_CALL+"qiniu/storage/getToken/",
                domain: "//"+location.hostname,
                get_new_uptoken: false,
                filters: {
                    mime_types: [ //只允许上传video
                        {title: "video", extensions: "mp4,mov,avi,wmv,flv"}
                    ],
                    prevent_duplicates: true //不允许选取重复文件
                },
                // downtoken_url: '/downtoken',
                // unique_names: true,
                // save_key: true,
                // x_vars: {
                //     'id': '1234',
                //     'time': function(up, file) {
                //         var time = (new Date()).getTime();
                //         // do something with 'time'
                //         return time;
                //     },
                // },
                auto_start: true,
                init: {
                    'FilesAdded': function (up, files) {// 文件添加进队列后,处理相关的事情
                        $(".jdt_content").css({width: 0, background: "#3d84c6"});
                        plupload.each(files, function (file) {
                            var progress = new FileProgress(file, 'fsUploadProgress');
                            progress.setStatus("等待...");
                            progress.bindUploadCancel(up);
                        });
                    },
                    'BeforeUpload': function (up, file) {// 每个文件上传前,处理相关的事情
                        if (t.getSuffixName(file)) {
                            var fileSize = file.size;
                            if (fileSize > 2 * 1048 * 1048576) {
                                alert("视频过大，请联系在线客服寻求帮助");
                                uploader.removeFile(uploader.getFile(file.id));
                                return false;
                            } else {

                            }
                        } else {
                            alert("格式不支持，请选择mov、mp4、avi、wmv、flv");
                            uploader.removeFile(uploader.getFile(file.id));
                            return false;
                        }
                        dateStrBefore = comm.date.local_time();
                        //console.log("上传开始时间：" + comm.date.local_time());

                        $("#video_cancel").off("click");
                        $("#upload_init").hide();//初始框
                        $("#upload_ing").show();//上传中

                        if (rUp) {//重新上传
                            $("#video_save").off("click");
                            $("#file_icon").attr("src", t.config.imgPath + "images/video_icon.png");
                            $(".jdt_content").css({width: 0, background: "#3d84c6"});
                            $(".jdt_img").show();
                            $(".miao_text").show();
                            $(".upload_success").hide().text("唯医网的视频需要审核哦！");
                            $(".upload_status").text("正在上传视频：");
                            $(".upload_icon_status").removeClass("success_upload_doc").removeClass("upload_error_img");
                            $(".select_anew").hide();
                        }

                        var name = t.getName(file);
                        t.videoAttFormat=t.getFileName(file);
                        t.fileName = name.length > 15 ? name.substring(0, 15) + '...' : name + '.' + t.getFileName(file);
                        $(".file_name").text(t.fileName);
                        if(!$("#video_name").val()){
                            $("#video_name").val(name);
                        }
                        if (name) {
                            num = Math.ceil((100 - comm.getByteLen(name)) / 2);
                            if (num <= 0) {
                                num = 0;
                                $(".name_num").css("color", "#F00");
                                $("#video_name").val(name.subByte(0, 100));
                            }
                            $(".name_num").text(num);
                            $("#video_name").parent().css("top", 34);
                            $("#video_name").parent().parent().find(".default_name").show();
                        }

                        timeS = new Date();
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            progress.setChunkProgess(chunk_size);
                        }
                    },
                    'UploadProgress': function (up, file) {// 每个文件上传时,处理相关的事情
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        //progress.setProgress(file.percent + "%", file.speed, chunk_size);

                        $(".jdt_content").animate({width: file.percent + '%'}, 200);
                    },
                    'UploadComplete': function () { //队列文件处理完毕后,处理相关的事情
                        endTime = new Date();
                    },
                    'FileUploaded': function (up, file, info) {// 每个文件上传成功后,处理相关的事情
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setComplete(up, info);

                        if(info){
                            var dataJSON = JSON.parse(info);
                            t.key=dataJSON.key;
                            t.persistentId=dataJSON.persistentId;

                            var dateStrAfter = comm.date.local_time();
                            //console.log("上传结束时间：" + comm.date.local_time());
                            var dateStrB = new Date(dateStrBefore.replace(/\-/g, '/'));
                            var dateStrA = new Date(dateStrAfter.replace(/\-/g, '/'));
                            var A_B = (dateStrA.getTime() - dateStrB.getTime()) / 1000;
                            //console.log("用时：" + A_B + "秒");

                            t.widthNum = 100;
                            clearInterval(t.timer);
                            $("#file_icon").attr("src", $("#file_icon").attr("suc_img"));
                            $(".jdt_content").animate({width: '100%'}, 200);
                            $(".jdt_img").hide();
                            $(".miao_text").hide();
                            $(".upload_success").show().text("唯医网的视频需要审核哦！");
                            $(".upload_status").text("成功上传视频");
                            $(".upload_icon_status").addClass("success_upload_doc");
                            $(".select_anew").show();
                            t.uploadStatus = true;
                            uploader.removeFile(uploader.getFile(file.id));
                            if (!rUp) {
                                t.uploadFile("#upload_new", 1);//重新上传
                            }
                            t.submitToggle();
                            t.publish();
                            t.publishCancel();
                        }

                    },
                    'Error': function (up, err, errTip) {// 每个文件上传失败后,处理相关的事情
                        $("#video_save").off("click");
                        t.uploadStatus = false;
                        t.uploadFaild();
                        if (!rUp) {
                            t.uploadFile("#upload_new", 1);//重新上传
                        }
                        var progress = new FileProgress(err.file, 'fsUploadProgress');
                        progress.setError();
                        progress.setStatus(errTip);
                    }
                    /*'Key': function(up, file) {
                         var key = "";
                         // do something with key
                         return key
                    }*/
                }
            });
            uploader.bind('FilesAdded', function(uploader, file){
                if(uploader.files.length>1){ // 最多上传1个视频
                    uploader.splice(1,999);
                }
            });
            uploader.bind('FileUploaded', function () {
                //console.log('hello man,a file is uploaded');
            });
        },
        //选中文件后触发
        fileChange: function (obj, rUp) {
            var t = this;
            var dateStrBefore = "";
            $(obj).bind("change", function () {
                t.widthNum = 0;
                t.hasAlert = 0;
                var name = t.getName($(this));
                var fileName = name.length > 15 ? name.substring(0, 15) + '...' : name + '.' + t.getFileName($(this));

                if (t.getSuffixName($(this))) {
                    var fileSize = comm.file.getFileSize(document.getElementById(obj.substring(1)));
                    if (fileSize > 2 * 1048 * 1048576) {
                        alert("视频过大，请联系在线客服寻求帮助");
                        return false;
                    } else {
                        dateStrBefore = comm.date.local_time();
                        //console.log("上传开始时间：" + comm.date.local_time());
                        $("#video_cancel").off("click");
                        $("#upload_init").hide();//初始框
                        $("#upload_ing").show();//上传中

                        if (rUp) {//重新上传
                            $("#video_save").off("click");
                            $("#file_icon").attr("src", t.config.imgPath + "images/video_icon.png");
                            $(".jdt_content").css({width: 0, background: "#3d84c6"});
                            $(".jdt_img").show();
                            $(".miao_text").show();
                            $(".upload_success").hide().text("唯医网的视频需要审核哦！");
                            $(".upload_status").text("正在上传视频：");
                            $(".upload_icon_status").removeClass("success_upload_doc").removeClass("upload_error_img");
                            $(".select_anew").hide();
                        }

                        t.progressBar(t.widthNum);
                        $(".file_name").text(fileName);
                        $("#video_name").val(name);
                        if (name) {
                            num = Math.ceil((100 - comm.getByteLen(name)) / 2);
                            if (num <= 0) {
                                num = 0;
                                $(".name_num").css("color", "#F00");
                                $("#video_name").val(name.subByte(0, 100));
                            }
                            $(".name_num").text(num);
                            $("#video_name").parent().css("top", 34);
                            $("#video_name").parent().parent().find(".default_name").show();
                        }
                    }
                } else {
                    alert("格式不支持，请选择mov、mp4、avi、wmv、flv");
                    $(this).val("");
                    return false;
                }

                //ajax异步上传文件的控件
                $.ajaxFileUpload({
                    type: 'POST',
                    url: t.path.videoUpload,
                    secureuri: false,
                    data: {activityId: t.options.activityId ? t.options.activityId : '', videoId: rUp ? t.videoId : ''},
                    fileElementId: obj.substring(1),//file控件id
                    dataType: '',
                    success: function (data, status) {

                        var dateStrAfter = comm.date.local_time();
                        //console .log("上传结束时间：" + comm.date.local_time());
                        var dateStrB = new Date(dateStrBefore.replace(/\-/g, '/'));
                        var dateStrA = new Date(dateStrAfter.replace(/\-/g, '/'));
                        var A_B = (dateStrA.getTime() - dateStrB.getTime()) / 1000;
                        //console.log("用时：" + A_B + "秒");

                        var dataJSON = eval("(" + data.body.innerHTML + ")");
                        if (dataJSON.responseStatus) {
                            t.widthNum = 100;
                            clearInterval(t.timer);
                            t.videoId = dataJSON.responseData.videoId;
                            $("#file_icon").attr("src", $("#file_icon").attr("suc_img"));
                            $(".jdt_content").animate({width: '100%'}, 200);
                            $(".jdt_img").hide();
                            $(".miao_text").hide();
                            $(".upload_success").show().text("唯医网的视频需要审核哦！");
                            $(".upload_status").text("成功上传视频");
                            $(".upload_icon_status").addClass("success_upload_doc");
                            $(".select_anew").show();
                            t.uploadStatus = true;
                            $(obj).val("");
                            t.fileChange("#upload_new", 1);//重新上传
                            t.submitToggle();
                            t.publish();
                            t.publishCancel();
                        } else {
                            //t.uploadFaild();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (!t.hasAlert) {
                            t.fileChange("#upload_new", 1);//重新上传
                            t.uploadFaild();
                        }

                        //document.title=XMLHttpRequest+":"+textStatus+":"+errorThrown
                    }
                });
            })
        }
        ,
//进度条
        progressBar: function (num) {
            var t = this;
            clearInterval(t.timer);
            t.timer = setInterval(function () {
                num += 1;
                $(".jdt_content").animate({width: num + '%'}, 200);
                if (num == 100 || num > 100) {
                    clearInterval(t.timer);
                }
            }, 3000);
        }
        ,
//判断文件后缀
        getSuffixName: function (obj) {
            //var path = obj.val();
            var path = obj.name;
            var pos1 = path.lastIndexOf(".");
            var pos = path.substring(pos1 + 1, path.length);
            return /(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(pos);
        }
        ,
//获取文件后缀
        getFileName: function (obj) {
            var path = obj.name;//obj.val();
            var pos1 = path.lastIndexOf(".");
            var pos = path.substring(pos1 + 1, path.length);
            return pos;
        }
        ,
//获取文件名不包括后缀
        getName: function (obj) {
            var path = obj.name//obj.val();
            var pos1 = path.lastIndexOf('/');
            var pos2 = path.lastIndexOf("\\");
            var pos3 = Math.max(pos1, pos2);
            var pos4 = path.lastIndexOf(".");
            var pos = path.substring(pos3 + 1, pos4);
            return pos;
        }
        ,
//描述范本的事件处理
        sample: function () {
            var timer = null;
            $(".uv_miaoshu").on("mouseover", function () {
                $(".uv_ms_jt").show();
                $(".uv_ms_text").show();
            });
            $(".uv_miaoshu").on("mouseout", function () {
                timer = setTimeout(function () {
                    $(".uv_ms_jt").hide();
                    $(".uv_ms_text").hide();
                }, 500);
            });
            $(".uv_ms_text").on("mouseover", function () {
                clearTimeout(timer);
                $(".uv_ms_jt").show();
                $(".uv_ms_text").show();
            });
            $(".uv_ms_text").on("mouseout", function () {
                clearTimeout(timer);
                $(".uv_ms_jt").hide();
                $(".uv_ms_text").hide();
            })
        }
        ,
//发布失败
        uploadFaild: function () {
            this.hasAlert = 1;
            $(".select_anew").show();
            $(".miao_text").hide();
            $(".upload_success").show().text("单个视频大小不超过2G，目前支持格式mp4、mov、avi、wmv、flv");
            $(".jdt_content").css({background: "#dbdbdb"});
            $(".upload_status").text("上传视频失败：");
            $(".upload_icon_status").addClass("upload_error_img");
            clearInterval(this.timer);
            alert("上传失败!请稍后再试");
            this.publishCancel();
        }
        ,
//发布取消
        publishCancel: function () {
            var t = this;
            $("#video_cancel").on("click", function () {
                if ($("#video_name").val() == '' && $("#video_abstract").val() == '') {
                    $("#content_video").remove();
                    comm.LightBox.hide();
                } else {
                    $(".cancel_mask").show();
                    $(".upload_end").show();
                    $(".continue_edit").bind("click", function () {
                        $(".cancel_mask").hide();
                        $(".upload_end").hide();
                    });
                    $(".cancel_pub").bind("click", function () {
                        $(".select_tc").remove();
                        $("#firstStep").remove();
                        $("#secondStep").remove();
                        $("#content_video").remove();
                        comm.LightBox.hide();
                        if (t.videoId) {
                            $.ajax({
                                type: "post",
                                url: t.path.videoDelete,
                                data: {paramJson: $.toJSON({"videoId": t.videoId})},
                                dataType: "json",
                                success: function (rep) {
                                    if (rep.responseObject.responseStatus) {

                                    }
                                },
                                error: function () {
                                }
                            });
                        }
                    });
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"视频发布取消",
                    browType:91,
                    actionId:45
                });
            });
        }
        ,
//获取专业数据
        getXuezu: function () {
            var html = '';
            var t = this;
            $.ajax({
                type: "POST",
                url: t.path.getAreaExpertise,
                dataType: "json",
                async: false,
                success: function (data) {
                    $.each(data, function (i, n) {
                        html += '<li tagId=' + data[i].id + '>' + data[i].tagName + '</li>';
                    });

                    $("#areaExp1").html(html);
                    t.selectXuezu();
                }
            });
        }
        ,
//选择学组
        selectXuezu: function () {
            var t = this;
            $(".xuezu_x", "#content_video").bind("click", function () {
                clearTimeout(t.timer);
                $(".publish_zy_position").css("bottom", -$(".publish_zy_position").outerHeight());
                $(".publish_zy_position").show();
                t.mouse = true;
            });
            $(".xuezu_x", "#content_video").bind("mouseover", function () {
                if (t.mouse) {
                    clearTimeout(t.timer);
                    $(".publish_zy_position").show();
                }
            });
            $(".xuezu_x", "#content_video").bind("mouseout", function () {
                if (t.mouse) {
                    t.timer = setTimeout(function () {
                        $(".publish_zy_position").hide();
                        t.mouse = false;
                    }, 500);

                }
            });
            //下拉学组鼠标移入
            $(".publish_zy_position li").live("mouseover", function () {
                if ($(this).attr("select-status") === undefined || $(this).attr("select-status") === "false") {//未选择
                    $(".publish_zy_position li").removeClass("active");
                    $(this).addClass("active");
                }
                return false;
            });
            //下拉学组鼠标移出
            $(".publish_zy_position li").live("mouseout", function () {
                $(".publish_zy_position li").removeClass("active");
                return false;
            });
            //下拉学组鼠标点击
            $(".publish_zy_position li").die("click").live("click", function () {
                var tagName = $(this).text();
                var tagId = $(this).attr("tagId");
                if (!$(this).attr("no-change")) {
                    if ($(this).attr("select-status") === undefined || $(this).attr("select-status") === "false") {//未选择
                        $(this).addClass("disable");
                        $(this).attr("select-status", "true");
                        t.createSelectedItem(tagName, tagId);
                    } else {                                   //已选择
                        $(this).removeClass("disable");
                        $(this).attr("select-status", "false");
                        t.clearTag(tagName, tagId);
                    }
                }

            });
        }
        ,
// 选中后添加关键词
        createSelectedItem: function (keyName, tagId, no) {
            var t = this;
            $("#areaTitle1").css("top", 20);//所属专业上浮
            var el = $("<li><div class='tab_text tagName' tagId=" + tagId + ">" + keyName + "</div>" +
            "<div class='tc_close' " + (no ? "no-change='true'" : "") + "><img src='" + t.config.imgPath + "images/close.png' /></div>" +
            "</li>");

            el.find(".tc_close").click(function () {
                if (!$(this).attr("no-change")) {
                    t.clearTag(keyName, tagId);
                    t.clearDownSelector(el.find(".tagName"));
                    return false;
                }
            });

            $("#areaSel1").append(el);
        }
        ,
// 清除标签
        clearTag: function (keyName, tagId) {
            $.each($("#areaSel1 li"), function (i, em) {
                if ($(em).find(".tagName").text() == keyName) {//$(em).find(".tagName").attr("tagId")==tagId
                    $(em).remove();
                }
            });
            if ($("#areaSel1 li").length === 0) {
                $("#areaTitle1").css("top", 26);
            }
        }
        ,
// 取消下拉学组的其中一个选中状态
        clearDownSelector: function (obj) {
            $.each($("#areaExp1 li"), function (i, em) {
                if ($(em).text() === obj.text()) {//$(em).attr("tagId")===obj.attr("tagId")
                    $(em).removeClass("disable");
                    $(em).attr("select-status", "false");
                }
            });

        }
        ,
        tagInput: function () {
            var t = this;
            $("#tag_input").on("keyup", function (ev) {//13:enter键,188:逗号,8:删除
                tagName = $(this).val();
                if (tagName !== "" && $("#tagSel li").length < 10) {
                    $(".default_name_new").show();
                    $(this).removeClass("mr_input");
                    $(this).attr("placeholder", "");
                    if (ev.keyCode == "13") {//
                        if ($(this).val().length > 50) {
                            alert("标签最多50个字");
                            return;
                        }
                        html = '<li><div class="tab_text tagName" tagId="0">' + tagName + '</div>' +
                        '<div class="tc_close"><img src="' + t.config.imgPath + 'images/close.png" /></div>' +
                        '</li>';
                        $(".tc_tab_list").append(html);
                        $(this).val("");
                    }
                    if (ev.keyCode == "188" && tagName != "，") {
                        if ($(this).val().length > 50) {
                            alert("标签最多50个字");
                            return;
                        }
                        html = '<li><div class="tab_text tagName" tagId="0">' + tagName.substring(0, tagName.length - 1) + '</div>' +
                        '<div class="tc_close"><img src="' + t.config.imgPath + 'images/close.png" /></div>' +
                        '</li>';
                        $(".tc_tab_list").append(html);
                        $(this).val("");
                    }
                } else {
                    if ($(".tc_tab_list li").length === 0) {
                        $(".default_name_new").hide();
                        $(this).addClass("mr_input");
                        $(this).attr("placeholder", "标签（多个用逗号或者回车分隔）");
                    }
                }
            });
            $(".tc_tab_list .tc_close").live("click", function () {
                $(this).parent().remove();
                if ($(".tc_tab_list li").length === 0) {
                    $(".default_name_new").hide();
                    $("#tag_input").addClass("mr_input");
                    $("#tag_input").attr("placeholder", "标签（多个用逗号或者回车分隔）");
                }
            })
        }
        ,
        submitToggle: function () {
            var t = this;
            videoName = $("#video_name").val();
            videoAbstract = $("#video_abstract").val();
            if (videoName && videoAbstract && t.uploadStatus) {
                $("#video_save").addClass("can_fb").attr("status", 1);
            } else {
                $("#video_save").removeClass("can_fb").attr("status", 0).off("vclick");
            }
        }
        ,
//发布
        publish: function () {
            var t = this;
            $("#video_save").off("click").on("click", function () {
                if(TempCache.getItem("userId")){
                    if ($(this).attr("status") == 1) {

                        var params = {};
                        var data = {};
                        /*var position = $("#areaExp1 li");
                         var tagIdString = '';
                         for (var i = 0; i < position.length; i++) {
                         if (position.eq(i).attr("select-status") == "true") {
                         tagIdString += position.eq(i).attr("tagId") + ',';
                         }
                         };*/

                        data.tplPath = 48;
                        data.videoName = symbolToString($("#video_name").val());
                        data.videoAbstract = symbolToString($("#video_abstract").val());
                        data.platformId= $("#sesDepartment").val();
                        //data.tagIdString = tagIdString.substring(0, tagIdString.length - 1);
                        if (t.options.activityId) {
                            data.activityId = t.options.activityId;
                        }
                        //TODO 新版活动报名添加赛区和类别的参数
                        if(t.options.property){
                            data.property= t.options.property;//JSON.stringify(t.options.property);
                        }
                        if(t.options.property_area){
                            data.property_area= t.options.property_area;//JSON.stringify(t.options.property_area);
                        }
                        if (!data.videoName) {
                            alert("请填写视频标题！");
                            return;
                        } else if (!data.videoAbstract) {
                            alert("请填写视频描述！");
                            return;
                        } else if (comm.getByteLen(data.videoAbstract) < 140) {
                            alert("视频描述最少70个字！");
                            return;
                        }
                        t.uploadStatus = false;
                        $(".publish_mask").show();
                        //$(".upload_title").css("border-color","");

                        var params1 = {};
                        var data1 = {};
                        data1.key= t.key;
                        data1.persistentId= t.persistentId;
                        data1.fileName= t.fileName;
                        data1.videoAttFormat= t.videoAttFormat;
                        if(t.options.activityId){
                            data1.activityId=t.options.activityId;
                        }
                        params1.paramJson = $.toJSON(data1);
                        $.ajax({//创建
                            type : "post",
                            url : t.path.saveToTable,
                            data : params1,
                            dataType : "json",
                            success : function(rep){
                                if(rep.responseObject.responseStatus){
                                    comm.creatEvent({
                                        triggerType: "发布",
                                        keyword: "发布",
                                        actionId: 32,
                                        browType:91//视频上传
                                    });

                                    t.videoId=rep.responseObject.responseData.videoId;

                                    data.videoId = t.videoId;
                                    params.paramJson = $.toJSON(data);

                                    $.ajax({//更新
                                        url: t.path.videoUpdate,
                                        type: "post",
                                        dataType: "json",
                                        data: params,
                                        success: function (data) {
                                            if (data == null) {
                                                t.uploadStatus = true;
                                                $.topTip({mark: "warn", content: "未发布成功，请稍后再试！"});
                                                return;
                                            }
                                            if (data && data.responseObject.responseStatus) {
                                                //alert("发布成功");
                                                /*if(data.responseObject.responseData.cms_video){
                                                 url=data.responseObject.responseData.pageStoragePath;
                                                 }else{
                                                 url="";
                                                 }*/
                                                //判断页面是否生成
                                                //comm.ajaxExistHtml(url,function(){
                                                $(".publish_mask").hide();
                                                $(".select_tc").remove();
                                                $("#firstStep").remove();
                                                $("#secondStep").remove();
                                                $("#content_video").remove();
                                                comm.LightBox.hide();
                                                //发布
                                                $.topTip({mark: "success", content: "发布成功！审核通过后可在“我的-贡献”查看~"});//视频已上传成功，请耐心等待审核结果
                                                t.options.publishBack && t.options.publishBack();
                                                //});

                                            } else {
                                                //alert("发布失败");
                                                $(".publish_mask").hide();
                                                t.uploadStatus = true;
                                                $.topTip({mark: "warn", content: "未发布成功，请稍后再试！"});
                                            }
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            t.uploadStatus = true;
                                            $(".publish_mask").hide();
                                            $.topTip({mark: "warn", content: "未发布成功，请稍后再试！"});
                                        }
                                    });
                                }else{
                                    t.uploadStatus = true;
                                    $(".publish_mask").hide();
                                    $.topTip({mark: "warn", content: "未发布成功，请稍后再试！"});
                                }
                            },
                            error:function(){}
                        });

                    }
                }else{
                    g_sps.jump(null,"/");
                }

            });
        }

    }
    ;

    controller.init(obj);
};
