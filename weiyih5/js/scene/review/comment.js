/**
 * 功能描述： 撰写评论,所有页面的发布评论
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：
 *
 * Created by LiuYuTao on 2015/5/20. Change by HJ on2017/10/17
 */

$(function () {
    var cId = TempCache.getItem("userId");
    var attContent,pageSize=20;
    var quoteIds = "",quoteType = "",quoteName = "";

    var controller = {
        path: {
            create: M_CALL + "customer/review/createReview/",//发布评论接口
            update: M_CALL + "customer/review/update/",//更新
            info: M_CALL + "customer/review/info/",
            delImg: M_CALL + "customer/reviewattachment/delete/"
        },
        bindFla: false,
        pic: false,
        submitting: 0,
        el: {
            submit: $(".w_comm_fb"),
            textarea: $(".write_comm_input textarea"),
            textareaParent: $(".write_commtent_who"),
            form: $(".commentForm:eq(0)"),
            formParams: $("#formParams")
        },
        textLimitNum: 1000,
        refCustomerIdList: [],
        remindCustomerIdList: "",
        opts: {},
        init: function () {
            //Log.createBrowse(71, "评论输入页");
            var t = this;
            t.idList = "";//存储删除图片的id字符串
            t.textareaInitHeight = $(".write_comm_input textarea").height();
            $("#index").css("height", $(window).height());//回复页面全屏白背景设置
            user.privExecute({
                operateType: 'auth',
                callback: function () {
                    if (t.getParam()) {
                        if (t.opts.draftEdit) {
                            document.title = "编辑评论";
                            $(".new_case_title").text("编辑评论");
                            $("#delete").show();
                            t.delete();//删除草稿
                            t.getComment();//获取评论草稿箱
                        }
                        t.bindRemind();//提醒谁看点击操作
                        t.bindEdit(); //评论文本编辑
                        t.bindPicUpload();  // 图片上传处理
                        t.bindCancel();//评论页取消按钮操作
                        $("#reviewContent").attr("placeholder","回复："+t.opts.username);//placeholder占位内容
                    } else {
                        alert("参数不足");
                    }
                }
            });
        },
        // 提醒谁看
        bindRemind: function () {
            var t = this;
            $(".remind").off("click").on("click", function () {
                $("#remind").show().css("height", $(window).height());
                $("#index").hide();
                return false;
            });
            $(".ev-popComment_qx").off("click").on("click", function () {
                $("#remind").hide();
                $("#index").show();
            });
        },
        //获取参数
        getParam: function () {
            var t = this;
            var param = comm.getpara();
            t.opts.id = param.id;
            t.opts.resourceId = param.resourceId;
            t.opts.username = param.username;
            t.opts.type = param.type;
            t.opts.parentId = param.parentId;
            t.opts.draftEdit = param.draft;
            t.opts.refCustomerId = param.refCustomerId ? param.refCustomerId : '';//资源发布人ID
            if (param.id) {
                return true;
            } else if (param.resourceId == undefined || param.username == undefined || param.type == undefined) {
                return false;
            } else {
                $(".write_commtent_who_text span").html(t.opts.username);
                return true;
            }
        },
        // 图片上传处理
        bindPicUpload: function () {
            var t = this;
            $(".w_comm_photo .upload").addRemoveablePicComment({
                container: $(".w_comm_photo ul", t.el.form),
                limit: 9,
                existNum: t.existNum,//已上传
                html: '<div><img src="//img50.allinmd.cn/comment/photo_normal.png" /></div>',
                onSizeChange: function (isExist) {
                    t.picCb(isExist);
                    var _toW=$(".add_photo"),//大外层ul
                        _upW=$(".ev-uploadBtn"),//上传照片按钮
                        _divW=$(".uploadImgListCont"),//图片列表外层div
                        _ulW=$(".ev-uploadImgList"),//图片列表内层ul包裹
                        _liW=$(".ev-uploadImgList li"),//上传的图片列表li
                        _imgW=$(".add_photo_img");//添加图片外包
                    var _w=_imgW.outerWidth()*_imgW.length;
                    var _tW=_toW.width()-_upW.width();
                    if(_w>=_tW){
                        _divW.css("width",_toW.width()-_upW.width()-1);
                        _ulW.css("width", _liW.width()*_liW.length);
                        _divW.scrollLeft(_liW.width()*(_liW.length-1));
                    }else{
                        _divW.css("width","auto");
                        _ulW.css("width", "auto");
                    }
                },
                //删除初始化图片
                deleteImg: function ($this) {
                    t.idList += $this.attr("closeid") + ",";
                }
            });
        },
        //评论文本编辑
        bindEdit: function () {
            var t = this;
            t.el.textarea.on("keyup keydown change input cut paste drop", function () {
                t.checkHeight();
                t.submitToggle();
                t.updateParams();
            });
        },
        //文本域高度
        checkHeight: function () {//高度出错，会挡住上面回复给。。。
            var t = this;
            t.el.textareaParent.css("marginTop", 0);
            if (t.el.textarea.val().length > 0) {
                t.content = true;
                if (t.el.textarea.val().length > (t.textLimitNum)) {
                    t.el.textarea.val(t.el.textarea.val().substr(0, t.textLimitNum));
                }
            } else {
                t.content = false;
            }
        },
        picCb: function (isExist) {
            var t = this;
            t.pic = isExist;


            // TODO:2018年5月22日 删除已经上传的input框
            //获取上传所有的图片标签，过滤掉视频默认图start
            var newArr = $('.commentForm .uploadImgListCont .uploadImgList .add_photo_img input');
            newArr.remove();
            //end

            t.submitToggle();
            t.updateParams();
        },
        //切换发布
        submitToggle: function () {
            var t = this;
            if (t.pic || t.content) {
                if (!t.bindFlag) {
                    $(t.el.submit).removeClass("comm_disable").
                    off("click").on("click", function () {
                        if (!t.submitting) {
                            t.updateParams();
                            t.submit();
                            t.submitting = 1;
                        }
                    });
                    t.bindFlag = true;
                }
            } else {
                $(t.el.submit).addClass("comm_disable").off("click");

                t.bindFlag = false;
            }
        },
        imgSizeFn: function (w, h) { //图片压缩后宽高
            if (w <= 1280 && h <= 1280) {
                return {w: w, h: h};
            } else if (w / h <= 2 && (w > 1280 || h > 1280)) {
                //opt.ratio = 1;
                if (w > h) {
                    return {w: 1280, h: parseInt(h / w * 1280)};
                } else {
                    return {w: parseInt(w / h * 1280), h: 1280};
                }

            } else if (w / h > 2) {
                if (w > 1280 && h > 1280) {
                    //opt.ratio = 1;
                    if (w > h) { //压缩规则第4条，宽高都大于1280时，取较小值为1280，经多次测试数据过大造成浏览器卡死崩溃，故更改为取较大值为1280，小值等比压缩
                        if(h/w*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩   （小值按1280算，ajax上传时报413 Request Entity Too Large）
                            return {w: 1280, h: parseInt(h / w * 1280)};
                        }else{//如果h小于500，按H500等比压缩
                            return {w: w*500/h, h: 500};
                        }
                    } else {
                        if(w/h*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩
                            return {w: parseInt(w / h * 1280), h: 1280};
                        }else{//如果h小于500，按H500等比压缩
                            return {w: 500, h: h*500/w};
                        }
                    }
                } else {
                    //opt.ratio = 1;
                    return {w: w, h: h};
                }
            }
        },
        canvasDataURL:function(path, dataCallBack){
            var t = this;
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width;
                var   h = that.height;
                //scale = w / h;
                //w = obj.width || w;
                //h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var compressRect = t.imgSizeFn(w, h);
                canvas.width = compressRect.w;
                canvas.height = compressRect.h;
                ctx.drawImage(that, 0, 0, compressRect.w, compressRect.h);
                // 图像质量
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg',.7);
                // 回调函数返回base64的值
                dataCallBack&&dataCallBack(base64);

                return base64;
            }
        },
        //发布保存操作
        submit: function () {
            //draft  传值的话：保存草稿箱
            var t = this;
            comm.loading.show();
            $("#loading_mask").show();

            // TODO:添加压缩图片的逻辑
            //start
            function convertBase64UrlToBlob(result){
                // var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                //     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                // while(n--){
                //     u8arr[n] = bstr.charCodeAt(n);
                // }
                // return new Blob([u8arr], {type:mime});
                var text = window.atob(result.split(",")[1]);
                var buffer = new Uint8Array(text.length);
                for (var i = 0; i < text.length; i++) {
                    buffer[i] = text.charCodeAt(i);
                }
                var blob = getBlob([buffer], 'image/png');
                return blob;
            }

            var form = document.querySelector('.commentForm');


            //此段代码使用es6编译过
            function formDataFileFix(formData) {
                try {
                    if (formData.keys) {
                        var formKeysToBeRemoved = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var key = _step.value;

                                var fileName = null || formData.get(key)['name'];
                                var fileSize = null || formData.get(key)['size'];
                                if (fileName != null && fileSize != null && fileName == '' && fileSize == 0) {
                                    formKeysToBeRemoved.push(key);
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        for (var i = 0; i < formKeysToBeRemoved.length; i++) {
                            formData.delete(formKeysToBeRemoved[i]);
                        }
                    }
                } catch (err) {
                    console.log(err.message);
                }
            }

            var formData = new FormData(form);
            formDataFileFix(formData);

            function getBlob(buffer, format) {
                try {
                    return new Blob(buffer, {type: format});
                } catch (e) {
                    var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
                    buffer.forEach(function (buf) {
                        bb.append(buf);
                    });
                    return bb.getBlob(format);
                }
            }


            //获取上传所有的图片标签，过滤掉视频默认图
            var newArr = $('.commentForm .uploadImgListCont .uploadImgList .add_photo_img img');

            function getAllImage(){
                $.each(newArr,function(index,value){
                    if($(value).attr('src').indexOf('data:')==0){
                        var re = $(value).attr('src');
                        t.canvasDataURL(re,function(baseData){
                            $(value).attr('data-scence',1);
                            formData.append("file", convertBase64UrlToBlob(baseData), "file_"+'photo'+[index]+".jpg"); // 文件对象
                        });
                    }else{
                        $(value).attr('data-scence',2);
                    }
                });
            }
            getAllImage();

            function request(){
                clearInterval(clear);
                $.ajax({
                    type: "POST",
                    url: t.opts.draftEdit ? t.path.update : t.path.create,
                    data: formData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend:function(){},
                    complete:function(){},
                    success: function (result) {
                        if (typeof result != "object") {
                            var result = $.parseJSON(result);
                        }
                        $("#loading_mask").hide();
                        comm.loading.hide();
                        if (t.draft) {
                            $("#save_dra").attr("on", "true");
                        }
                        if (result.responseObject.responseStatus) {
                            TempCache.setItem("detailNoNeedApp", 1);
                            if(isWXBrowse()=='iphoneWX'){//$('.ev-uploadImgList li').length&&
                                g_sps.jump(null,document.referrer);
                            }else{
                                history.go(-1);
                            }
                        } else {
                            t.submitting = 0;
                            if (t.draft) {
                                $("#atten").hide();
                                popup("草稿箱保存失败！");
                                return;
                            }
                            popup("发布失败，请稍后再试！");
                        }
                    },
                    error: function(data) {
                        popup('请求失败'+data);
                    }
                });
            }

            var complete = $('.commentForm .uploadImgListCont .uploadImgList .add_photo_img img');

            var clear = setInterval(function(){
                if($("[data-scence=1]").length){
                    if(complete.length===$("[data-scence=1]").length){
                        request();
                    }
                }else{
                    request();
                }
            },300);
            //结束

            //注释之前提交功能2018.5.23
            // $(t.el.form).ajaxSubmit({
            //     url: t.opts.draftEdit ? t.path.update : t.path.create,
            //     success: function (result) {
            //         if (typeof result != "object") {
            //             var result = $.parseJSON(result);
            //         }
            //         $("#loading_mask").hide();
            //         comm.loading.hide();
            //         if (t.draft) {
            //             $("#save_dra").attr("on", "true");
            //         }
            //         if (result.responseObject.responseStatus) {
            //             TempCache.setItem("detailNoNeedApp", 1);
            //             if(isWXBrowse()=='iphoneWX'){//$('.ev-uploadImgList li').length&&
            //               g_sps.jump(null,document.referrer);
            //             }else{
            // 			history.go(-1);
            //             }
            //         } else {
            //             t.submitting = 0;
            //             if (t.draft) {
            //                 $("#atten").hide();
            //                 popup("草稿箱保存失败！");
            //                 return;
            //             }
            //             popup("发布失败，请稍后再试！");
            //         }
            //     }
            // });
        },
        //组装提交参数
        updateParams: function (noRemind) {
            //draft  传值的话：保存草稿箱
            var t = this;
            var isUploadAttachment = 0, attachmentIds = "";
            if (typeof FileReader != 'undefined') {  // 本地可预览模式
                isUploadAttachment = 1;
            }
            attachmentIds = $(".imgPkList").length > 0 ? $(".imgPkList").val() : '';
            idList = t.idList.substr(0, t.idList.length - 1);
            var reviewContent = "";
            if (noRemind) {
                reviewContent = $(t.el.textarea).val();
            } else {
                reviewContent = $(t.el.textarea).val() + t.remindCustomerIdList;
            }
            var data = {};
            if (t.opts.id) {
                data.id = t.opts.id;
                data.reviewAttachmentIdList = idList;
            }
            data.reviewType = t.opts.type;
            data.isDraft = t.draft ? 1 : 0;
            data.isValid = t.draft ? 0 : 1;
            data.refId = t.opts.resourceId;
            data.parentId = t.opts.parentId;
            data.reviewContent = reviewContent;
            data.imageType = 5;
            data.refCustomerIdList = t.refCustomerIdList.toString();
            data.isUploadAttachment = isUploadAttachment;
            data.attachmentIds = attachmentIds;
            data.quoteIds = quoteIds;
            data.quoteType = quoteType;
            data.quoteName = quoteName;
            $(t.el.formParams).val("" + JSON.stringify(data));
        },
        //获取评论草稿箱
        getComment: function () {
            var t = this;
            var data = {id: this.opts.id, attUseFlag: 7};
            var param = {};
            param.paramJson = $.toJSON(data);
            $.ajax({
                type: "post",
                url: this.path.info,
                data: param,
                async: false,
                dataType: "json",
                success: function (rep) {
                    if (rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.author_name) {
                            $(".write_commtent_who_text span").html(rep.responseObject.responseData.author_name);
                        }
                        if (rep.responseObject.responseData.customer_review_insite) {
                            reviewInsite = rep.responseObject.responseData.customer_review_insite;
                            $("#reviewContent").val(reviewInsite.reviewContent);
                            t.opts.type = reviewInsite.reviewType;
                            t.opts.resourceId = reviewInsite.refId;
                            t.opts.parentId = reviewInsite.parentId;
                        }
                        if (rep.responseObject.responseData.customer_review_attachment) {
                            att = rep.responseObject.responseData.customer_review_attachment;
                            html = "";
                            t.existNum = att.length;
                            if (att.length > 0) {
                                $.each(att, function (i, val) {
                                    html += '<li><div class="add_photo_img"><div class="comm_close" closeid="' + val.id + '"></div><img src="' + val.attUrl + '"></div></li>';
                                });
                                $(html).appendTo($(".w_comm_photo ul").find(".ev-uploadImgList"));
                            }
                        }
                        if (rep.responseObject.responseData.review_remind_list) {
                            attContent = rep.responseObject.responseData.review_remind_list;
                            if (attContent.length > 0) {
                                html = "";
                                $.each(attContent, function (i, val) {
                                    $("#rem_title").hide();
                                    $("#rem_show").show();
                                    name = val.lastName + val.firstName;
                                    html += "<li>" + name + "，</li>";
                                    t.refCustomerIdList.push(val.customerId);
                                    t.remindCustomerIdList += "<a href=" + val.customerId + ">@" + name + "</a>";
                                });
                                html += '<div class="clear"></div>';
                                $(".rem_list").show().append(html);
                            }
                        }
                        t.checkHeight();
                        t.submitToggle();
                        t.updateParams();
                    } else {
                        popup("获取信息失败");
                    }
                },
                error: function () {
                }
            });
        },
        //删除草稿
        delete: function () {
            var t = this;
            $("#delete").on("click", function () {
                comm.loading.show();
                var data = {id: t.opts.id, deleteFlag: 1, isValid: 0};
                var param = {};
                param.paramJson = $.toJSON(data);
                $.ajax({
                    type: "post",
                    url: t.path.update,
                    data: param,
                    dataType: "json",
                    success: function (rep) {
                        comm.loading.hide();
                        if (rep.responseObject.responseStatus) {
                            popup("删除成功");
                            TempCache.setItem("detailNoNeedApp", 1);
                            history.go(-1);
                        } else {
                            popup("删除失败");
                        }
                    },
                    error: function () {
                    }
                });
            })
        },
        //评论页取消按钮操作
        bindCancel: function () {
            var t = this;
            $(".ev-comment_qx").on("click", function () {
                comm.creatEvent({
                    triggerType: '全站功能按钮点击',
                    keyword: "取消",
                    actionId: 45,
                    async: false
                });
                $('#reviewContent').blur();
                //新增文库保存caos稿郑辉修改
                if ($(".case_content textarea").val() || $(".add_photo li").length > 1 || $(".rem_list li").length > 0) {
                    $("#backMask").addClass("on");
                    //放弃
                    $("#backMask .giveup").off('click').on("click",function(){
                        TempCache.setItem("detailNoNeedApp", 1);
                        if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
                            history.go(-1);
                        } else {
                            history.go(-1);
                        }
                        return false;
                    });
                    //取消
                    $("#backMask .cancel").off('click').on("click",function(){
                        comm.creatEvent({
                            triggerType: '全站功能按钮点击',
                            keyword: "取消",
                            actionId: 45,
                            async: false
                        });
                        $("#backMask").removeClass("on");
                    });
                    //保存草稿
                    $("#backMask .save").off('click').on("click",function(){
                        t.draft = 1;
                        t.updateParams(1);//不需要拼@
                        t.submit();
                    });
                } else {
                    history.go(-1);
                }
            });
        }
    };

    /*提醒谁看页面的相关操作*/
    var remindController = attention = {
        path: {
            peopleList: M_CALL + "customer/follow/people/json_list/"
        },
        init: function () {
            var t = this;
            var para = comm.getpara();
            t.source = para.source;
            t.getInitUser();
        },
        //html结构获取
        getHtml: function (data, className) {
            var html = "", baseInfo, userAuth, medicalTitle, medical, userAtt;
            $.each(data.responseObject.responseData.data_list, function (i, val) {
                if (className == "who_look_link") {
                    baseInfo = val.customer_baseinfo;
                } else {
                    baseInfo = val.customer_unite;
                }
                userAuth = val.customer_auth;
                medicalTitle = "";
                if (typeof userAuth.medicalTitle == "string") {
                    medical = userAuth.medicalTitle.split(",");
                } else {
                    medical = "";
                }
                if (medical) {
                    $.each(medical, function (i, val) {
                        if (val && val.split("_")[1]) {
                            medicalTitle += (val.split("_")[1] + ",");
                        } else {
                            medicalTitle += val + ",";
                        }
                    });
                }
                userAtt = val.customer_att.logoUrl;
                html += '<li class="' + className + '" customerid="' + baseInfo.customerId + '">' +
                    '<div class="user_img_who">' +
                    '<img src="' + ($.isEmptyObject(userAtt) ? '//img50.allinmd.cn/personal_v2/user_mr.png' : userAtt) + '" />' +

                    '</div>' +
                    '<div class="user_name_who">' +
                    '<div class="who_name">' + (userAuth.lastName ? userAuth.lastName + userAuth.firstName : baseInfo.nickname) + '' +
                    (userAuth.state >= 1 ? '<div class="vip_img_who"><img src="//img50.allinmd.cn/pages/personal/mark_vip.png" /></div>' : '') +
                    '</div>' +
                    '<div class="who_zhiwei">' + (userAuth.state >= 1 ? (medicalTitle.substring(0, medicalTitle.length - 1) ? '<span>' + medicalTitle.substring(0, medicalTitle.length - 1) + '</span>' : '') + '<span>' + userAuth.company + '</span>' : '<span>你们可能是朋友</span>') + '</div>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</li>';
            });
            return html;
        },
        //初始化
        getInitUser: function () {
            var t = this;
            user.getSessionInfo();
            var data = {
                dataFlag: 2,
                useFlag: 1,
                customerId: cId,
                sessionCustomerId: cId,
                pageIndex: 1,
                pageSize: 100,
                logoUseFlag: 3
            };
            $("#loading").show();
            $.ajax({
                url: t.path.peopleList,
                data: data,
                type: "get",
                dataType: "json",
                success: function (data) {
                    $("#loading").hide();
                    if (attContent && attContent.length > 0) {
                        var html = "";
                        $.each(attContent, function (i, val) {
                            name = val.lastName + val.firstName;
                            html += "<li customerid=" + val.customerId + ">" + name + "，</li>";
                            $.each($("#my_user li"), function (j, em) {
                                if (val.customerId == $(em).attr("customerid")) {
                                    $(em).removeClass("who_look_link").addClass("who_look_hover");
                                }
                            })
                        });
                        $(".user_list").append(html);
                    }
                    t.keyUp();
                    $("#success").off("click").on("click", function () {
                        t.setLocalStorage();
                        $("#remind").hide();
                        $("#index").show();
                        return false;
                    })
                },
                error: function () {
                    popup("没有内容了");
                    return false;
                }
            });
        },
        myUserClick: function () {
            var t = this;
            $("#my_user li").each(function (i, em) {
                $(em).on("click", function () {
                    if ($(em).attr("class") == "who_look_link") {//添加
                        setTimeout(function () {
                            if ($(".user_list li").length < 10) {
                                $(".user_list").append("<li customerid=" + $(em).attr("customerid") + ">" + $(em).find(".who_name").text() + "，</li>");
                                $(em).removeClass("who_look_link").addClass("who_look_hover");
                            }
                        }, 300);
                    } else {//删除
                        setTimeout(function () {
                            $(em).removeClass("who_look_hover").addClass("who_look_link");
                            $this = $(em);
                            $(".user_list li").each(function (i, em) {
                                if ($(em).attr("customerid") == $this.attr("customerid")) {
                                    $(em).remove();
                                }
                            });
                        }, 300);
                    }
                });
            });
        },
        //键盘事件
        keyUp: function () {
            var t = this;
            this.input = $("#user_input");
            var timer = null;
            var nowVal = '';
            var inputSelf;
            var flag = true;
            var searchVal;
            t.input.bind('compositionstart',function(){
                flag = false;
            });
            t.input.bind('compositionend',function(){
                flag = true;
            });
            t.input.bind('input propertychange',function(e){
                clearTimeout(timer);
                inputSelf = $(this);
                nowVal = inputSelf.val();
                timer = setTimeout(function(){
                    searchVal = nowVal;
                    if(searchVal&&flag){
                        changeHandler(t.input.val());
                    }else{//列表清空
                        $("#search_user").hide();
                        $("#my_user").show();
                    }
                },500);
            });
            function changeHandler(keyWord) {
                if (keyWord != "") {
                    $("#my_user").hide();
                    $("#loading").show();
                    var data = {
                        dataFlag: 1,
                        useFlag: 1,
                        logoUseFlag: 3,
                        searchParam: t.input.val(),
                        pageIndex: 1,
                        pageSize: 10
                    };
                    $.ajax({
                        url: "/mcall/customer/unite/json_list/",
                        data: data,
                        type: "get",
                        dataType: "json",
                        success: function (data) {
                            var html = "";
                            $("#loading").hide();
                            if (data && data.responseObject.responseStatus && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length > 0) {
                                $(".yy_none_search").hide();
                                $("#search_user").show().html(t.getHtml(data, "who_look_mr"));
                            } else {
                                $("#search_user").hide();
                                $(".yy_none_search").show();
                            }
                            t.searchClick();
                            t.scrollPage();
                        }
                    });
                } else {
                    $("#search_user").hide();
                    $("#my_user").show();
                }
            }
            $("#user_input").keyup(function (ev) {
                //13:enter键,188:逗号
                if ($(this).val() == "") {
                    //删除
                    if (ev.keyCode == "8") {
                        setTimeout(function () {
                            var userList = $(".user_list li");
                            var last = userList.eq(userList.length - 1);
                            if (userList.length > 0) {
                                last.remove();
                                $.each($(".who_look_hover"), function (i, em) {
                                    if ($(em).attr("customerid") == last.attr("customerid")) {
                                        $(em).removeClass("who_look_hover").addClass("who_look_link");
                                        return;
                                    }
                                })
                            }
                        }, 300);
                    }
                }
            });
        },
        //瀑布流
        scrollPage: function (url) {
            var t = this;
            var param = {
                dataFlag: 1,
                useFlag: 1,
                logoUseFlag: 3,
                searchParam: t.input.val(),
                pageIndex: 1,
                pageSize: 10
            };
            var num = 2;
            $("#search_user").off("scroll").scrollPagination({
                'contentPage': '/mcall/customer/unite/json_list/',
                'noParamJson': 1,
                'contentData': $.extend(param, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    $("#loading").show();
                },
                'afterLoad': function (elementsLoaded) {
                    $("#loading").hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $("#search_user").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $("#search_user").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            $("#search_user").append(t.getHtml(data, "who_look_mr"));
                            t.searchClick();
                        }
                    }
                }
            });
        },
        //搜索列表点击
        searchClick: function () {
            var t = this;
            $("#search_user li").off("click").on("click", function () {
                $("#user_input").val("");
                var $this = $(this);
                var has = false;
                setTimeout(function () {
                    $(".user_list li").each(function (i, em) {
                        if ($(em).attr("customerid") == $this.attr("customerid")) {
                            $(em).remove();
                            has = true;
                            return;
                        }
                    });
                    $.each($("#my_user li"), function (i, em) {

                        if ($(em).attr("customerid") == $this.attr("customerid")) {
                            if ($(em).attr("class") == "who_look_link") {
                                $(em).removeClass("who_look_link").addClass("who_look_hover");
                            } else {
                                $(em).removeClass("who_look_hover").addClass("who_look_link");
                            }
                        }
                    });
                    if (!has) {
                        if ($(".user_list li").length < 10) {
                            $(".user_list").append("<li customerid=" + $this.attr("customerid") + ">" + $this.find(".who_name").text() + "，</li>");
                        }
                    }
                }, 300);
            })
        },
        setLocalStorage: function () {
            var attention = {};
            attention.attContent = [];
            var str = "";
            controller.refCustomerIdList = [];
            controller.remindCustomerIdList = "";
            $(".user_list li").each(function (i, em) {
                var customerId = $(em).attr("customerid");
                var name = $(em).text().substring(0, $(em).text().length - 1);
                str += "<li>" + name + ",</li>";
                controller.refCustomerIdList.push(customerId);
                controller.remindCustomerIdList += "<a href=" + customerId + ">@" + name + "</a>";
            });
            controller.updateParams();
            if (str.length > 0) {
                $("#rem_title").hide();
                $("#rem_show").show();
                $(".rem_list").show().html(str + "<div class=clear></div>");
                controller.submitToggle();
            } else {
                $("#rem_title").show();
                $("#rem_show").hide();
                $(".rem_list").hide();
            }
        }
    };

    /*引用事件的相关操作*/
    var quoteController = {
        path: {
            myPubUrl: M_CALL + "customer/trends/getMapList/",//我发布资源
            quoteUrl:M_CALL + "customer/quote/json_list/"//引用列表接口
        },
        init: function () {
            var t = this;
            t.quoteEvent();
            t.inputSearchEve();
        },
        //input触发搜索事件
        inputSearchEve:function(){
            var t=this;
            t.input=$(".ev-inputSearch");
            var timer = null;
            var nowVal = '';
            var inputSelf;
            var flag = true;
            var searchVal;
            t.input.bind('compositionstart',function(){
                flag = false;
            });
            t.input.bind('compositionend',function(){
                flag = true;
            });
            t.input.bind('input propertychange',function(e){
                clearTimeout(timer);
                inputSelf = $(this);
                nowVal = inputSelf.val();
                timer = setTimeout(function(){
                    searchVal = nowVal;
                    if(searchVal&&flag){
                        t.quoteAjaxFunc(2);
                    }else{//列表清空
                        $(".ev-myPublish,.ev-ChoiceList").hide();
                        if(flag == 2){
                            $(".ev-quoteNone").show();
                        }
                    }
                },500);
            });
            $('.al-quoteCont .searchInput b').off('click').on('click',function(){
                if(t.input.val()){
                    t.input.val('');
                    t.quoteAjaxFunc(1);
                }
            })
        },
        //引用事件相关操作
        quoteEvent: function () {
            var t = this, _pop = $("#quotePop");
            t.input=$("#ev-inputSearch");
            $(".ev-quote_cont").off("click").on("click", function (e) {
                if($(e.target).hasClass('quoteTextI')){
                    $('.ev-quoteText_show span').text('');
                    $('.ev-quoteText_show,#quote_show').hide();
                    $('#quote_title').show();
                    quoteIds = '';
                    quoteType = '';
                    quoteName = '';
                    $('.ev-ChoiceList ul').text('');
                }else {
                    if (_pop.attr("data-flag") == 1) {//首次点击引用
                        t.quoteAjaxFunc(1);
                        $(".ev-quoteNone,.ev-ChoiceList").hide();//没有发现，选中隐藏
                    } else if ($("#quotePop").attr("data-flag") == 3) {//搜索中
                        t.quoteAjaxFunc(1);
                        $(".ev-myPublish,.ev-ChoiceList").show();//我发布的，已经选中的显示
                        $(".ev-quoteNone").hide();//没有发现隐藏
                    }
                    _pop.show().css("height", $(window).height());
                    $("#index").hide();
                }
            });
            $(".ev-quotePop_qx").off("click").on("click", function () {
                $("#quotePop").hide();//引用弹层隐藏
                $("#index").show();
                $(".ev-inputSearch").val("");//关闭弹层的时候清空搜索框
            });
        },
        //引用的列表ajax请处理
        quoteAjaxFunc: function (flag) {//区分请求场景
            var t = this, url;
            var param = {};
            if (flag == 1) {//首次点击请求我的发布
                url = t.path.myPubUrl;
                param = {
                    customerId: cId,
                    opId: 0,
                    resourceType: "", //类型变化
                    trendTypes : "1,2,4,7",
                    dataFlag: 4,
                    logoUseFlag: 3,
                    useFlag:3,
                    attUseFlag: 5, //300*200 新的
                    visitSiteId: 2,
                    pageIndex: 1,
                    pageSize: pageSize
                };
            } else if (flag == 2) {//请求搜索列表
                url= t.path.quoteUrl;
                param={
                    customerId:cId,
                    queryPara: t.input.val(),
                    pageIndex: 1,
                    pageSize: 30,
                    visitSiteId: 2,
                    appVersion:3110
                };
            }
            var cBack = function (rep) {
                comm.loading.hide();
                if (rep&&comm.hasResponseData(rep)&&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length) {
                    $(".ev-myPublish,.ev-ChoiceList").show();
                    var items=rep.responseObject.responseData;
                    t.getQuoteHtml(url,param,items,flag);
                }else{
                    $(".ev-myPublish,.ev-ChoiceList").hide();
                    if(flag == 2){
                        $(".ev-quoteNone").show();
                    }
                }
            };
            comm.loading.show();
            comm.ajax.async(url, {paramJson: $.toJSON(param)}, cBack);
        },
        //引用的html格式处理
        getQuoteHtml: function (url,param,items,flag,scrflag) {
            var t = this;
            var html="",_kvHtml=$(".ev-myPublish ul");
            if (flag == 1) {//首次点击
                html="";
                $.each(items.data_list,function(i,e){
                    customerName = "";
                    if(e.customer_trends.trendType==1){
                        customerName = e.customer_auth.ownerNameStr;
                    }else{
                        customerName = e.customer_auth.lastName+ e.customer_auth.firstName;
                    }
                    html+=' <li data-refTy="'+ e.customer_trends.resourceType+'" data-refId="'+e.customer_trends.resourceId+'">' +
                        '<i>'+t.refTypeText(e.customer_trends.resourceType)+'</i>' +
                        '<div class="quoteListText">' +
                        '<p>'+ e.customer_trends.resourceName+'</p>' +
                        '<p class="quotePersonal">'+ comm.getStrLen(customerName,15)+'</p>'+
                        '</div>'+
                        '</li>';
                });
                $(".myPublishTitle").show();
                if(scrflag){
                    _kvHtml.append(html);
                }else{
                    _kvHtml.html(html);
                    if(items.total_count&&items.total_count>20){
                        t.scrollPage(url,param,flag);
                        _kvHtml.attr("scrollPagination", "enabled");
                    }else{
                        _kvHtml.attr("scrollPagination", "disabled");
                    }
                }
            }else if(flag==2){
                html="";
                $.each(items.data_list,function(i,e){
                    customerName = "";
                    if(e.type_id==1){
                        customerName = e.ownerNameStr;
                    }else{
                        customerName = e.customerName;
                    }
                    html+=' <li data-refTy="'+ e.type_id+'" data-refId="'+e.resourceId+'"><i>'+e.type_name+'</i>' +
                        '<div class="quoteListText">' +
                        '<p>'+ e.resourceName+'</p>' +
                        '<p class="quotePersonal">'+ comm.getStrLen(customerName,15)+'</p>'+
                        '</div>'+
                        '</li>';
                });
                $(".myPublishTitle,.ev-ChoiceList").hide();
                $(".ev-myPublish").show();
                _kvHtml.html(html);
                _kvHtml.attr("scrollPagination", "disabled");
            }
            t.quoteClickEve();
        },
        //引用点击选中事件
        quoteClickEve:function(){
            var t=this,_kvHtml=$(".ev-myPublish ul"),html="";
            $("li",_kvHtml).off("click").on("click",function(){
                $("#quotePop").hide().attr("data-flag","3");
                $("#index,#quote_show,.ev-quoteText_show").show();
                $("#quote_title").hide();
                $(".ev-inputSearch").val("");//关闭弹层的时候清空搜索框
                //添加选中状态的引用
                html= '<li class="ev-choiceList" data-refTy="'+ $(this).attr("data-refTy")+'" data-refId="'+$(this).attr("data-refId")+'">'+
                    '<i>'+ $(this).find("i").text()+'</i>'+
                    '<div class="quoteListText"><p>'+ $(this).find("p:eq(0)").text()+'</p>'+
                    '<div class="personalChoice"> <p class="quotePersonal">'+ $(this).find(".quotePersonal").text()+'</p>' +
                    '<p class="Choice">已选 1/1</p></div>'+
                    '</div>'+
                    '</li>';
                $(".ev-ChoiceList ul").html(html);
                $(".ev-quoteText_show span").text("《"+$(this).find("p:eq(0)").text()+"》");//回复页面的引用显示
                quoteIds = $(this).attr("data-refId");
                quoteType = $(this).attr("data-refTy");
                quoteName = $(this).find("p:eq(0)").text();
            });
            //点击已选择的列表按钮
            $(".ev-choiceList").off("click").on("click",function(){
                $("#quotePop").hide();//引用弹层隐藏
                $("#index").show();//回复页面内容显示
                $(".ev-inputSearch").val("");//关闭弹层的时候清空搜索框
            });
        },
        refTypeText:function(kv){
            var word="";
            switch (kv) {
                case 1:
                    word = '视频';
                    break;
                case 2:
                    word = '文库';
                    break;
                case 4:
                    word = '话题';
                    break;
                case 7:
                    word = '病例';
                    break;
            }
            return word;
        },
        //瀑布流
        scrollPage: function (url,par,flag) {
            var t = this,
                _kvHtml=$(".ev-myPublish ul"),
                pageIndex = 2,
                params = par;
            params.pageIndex = pageIndex;
            _kvHtml.off("scroll").scrollPagination({
                'contentPage': url,
                'contentData': $.extend(params, {
                    pageIndex: function () {
                        return pageIndex++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "post",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        _kvHtml.attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            _kvHtml.attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var items = data.responseObject.responseData;
                            t.getQuoteHtml(url,params,items,flag,1);
                        }
                    }
                }
            });

        }
    };

    controller.init();
    remindController.init();
    quoteController.init();
});
