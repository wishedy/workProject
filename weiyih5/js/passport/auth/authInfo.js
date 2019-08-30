/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/4/21
 * @author: sunhaibin
 */
$.getScript(window.paasFilePathObj.js, function () {
    $(function () {
        var cusRole = TempCache.getItem("customerRole");
        var index = {
            path: {
                createAuthNew: M_CALL + 'customer/auth/createAuth2/',
                getCustomerAuth: M_CALL + "customer/auth/getCustomerAuth/",//获取认证信息
                getDataRoleConfigs: M_CALL + "comm/data/roleconfig/getSortList/",//获取会员证件类型
                getAuthAttachments: M_CALL + "customer/auth_attachment/getAuthAttachmentsV2/",//获取认证附件
                upload: M_CALL + "comm/upload_attachment/upload/",//上传图片
                creatAuth: M_CALL + "customer/auth_attachment/createAuthAttachment/",
                promptMessage: M_CALL + "customer/unite/promptMessage/",//获取上传证件提示信息接口
                showTip: ""
            },
            init: function () {
                // Log.createBrowse(10025, '个人中心-其他个人信息-个人中心-证件信息');
                setTimeout(function () {
                    if (g_sps) {
                        g_sps.createBrowse({pageId: 452})
                    }
                }, 2000);
                var t = this;
                t.backBtn();
                t.questionModule();
                t.getCustomerAuthFun();
                t.promptMessageFun();
            },
            //获取用户证件信息
            getCustomerAuthFun: function () {
                var t = this;
                var cBack = function (res) {
                    if (res && res.responseObject && res.responseObject.responseMessage) {
                        var _kv = res.responseObject.responseMessage.medicalTitle;//记录id
                        t.medicalTitleId = _kv ? (_kv.substr(0, _kv.indexOf("_")) ? _kv.substr(0, _kv.indexOf("_")) : res.responseObject.responseMessage.medicalTitleId)
                            : res.responseObject.responseMessage.medicalTitleId;//记录id
                        t.loadCertificate();//获取证件信息
                    }
                };
                comm.ajax.async(t.path.getCustomerAuth, {}, cBack);
            },
            //证件信息访问状态
            getAuthProcess: function () {
                var t = this;
                $.ajax({
                    url: M_CALL + "customer/revise/auth/getMapList/",
                    type: "post",
                    data: {paramJson: $.toJSON({customerId: TempCache.getItem('userId')})},
                    dataType: 'json',
                    success: function (res) {
                        if (res && res.responseObject && res.responseObject.responseData && !$.isEmptyObject(res.responseObject.responseData)) {
                            t.authProcess = true;
                            $('input[type=text]').attr('readOnly', true);
                            $('input[type=file]').click(function (e) {
                                comm.alertBox({
                                    title: '审核中，暂时无法编辑证件信息',
                                    ensure: "知道了"
                                });
                                e.preventDefault();
                            });
                            $('.al-certItemUploadBox, .al-authInfoSave').off('click').on('click', function () {
                                comm.alertBox({
                                    title: '审核中，暂时无法编辑证件信息',
                                    ensure: "知道了"
                                });
                            });

                        } else {
                            t.submit();
                        }
                    }
                });
            },
            //获取上传证件顶部提示信息
            promptMessageFun: function () {
                var t = this;
                var cBack = function (res) {
                    if (comm.hasResponseData(res)) {
                        var item = res.responseObject.responseData;
                        $(".ev-tipsTitle").text(item.promptMessage.split("@=@")[0]);
                        $(".ev-detailText").text('(' + item.promptMessage.split("@=@")[1] + ')');
                    }
                };
                comm.ajax.async(t.path.promptMessage, {
                    paramJson: $.toJSON({
                        scene: cusRole == 12 ? 6 : 2,//护理角色传6，医生传2
                        isValid: 1,
                        promptCondition: 0
                    })
                }, cBack);
            },

            backBtn: function () {
                var t = this;
                $('.ev_authBackBtn').off("click").on("click", function () {
                    var flag = false;
                    $.each($('.al-certCode'), function (i, el) {
                        if ($(el).find('input').val()) {
                            flag = true;
                            return false;
                        }
                    });
                    if ($('.newUploadSuccess').length || flag) {
                        comm.confirmBox({
                            title: "确定现在离开吗？<br><span style='color:#909090;font-size:0.3rem;'>已有内容被编辑，现在离开将放弃编辑内容</span>",
                            cancel: "取消",
                            ensure: "离开",
                            ensureCallback: function () {
                                history.back();
                            }
                        });
                    } else {
                        history.back();
                    }
                });
            },
            //帮助按钮点击展示帮助弹层
            questionModule: function () {
                $('.icon-question').off("click").on("click", function () {
                    comm.creatEvent({
                        triggerType: "认证",
                        triggerName: '认证-等级规则',
                        keyword: '认证-等级规则',
                        actionId: 2517
                    });
                    if (cusRole == 12) {//护理系角色  护士、护师、主管护师、副主任护师、主任护师
                        $(".ev-nurseHelp").show();
                    } else {//默认医生角色
                        $(".ev-doctorHelp").show();
                    }
                    // $('.serviceTime').show();
                    $("body,html").css({
                        height: "100%",
                        overflow: "hidden"
                    });
                });
                $('.ev-authGradeClose').off("click").on("click", function () {
                    $('.serviceTime').hide();
                    $("body,html").css({
                        height: "auto",
                        overflow: "auto"
                    });
                });

            },
            //加载证书项
            loadCertificate: function () {
                var t = this;
                var param = {
                    medicalTitleId: t.medicalTitleId,
                    isValid: 2, visitSiteId: 2
                };
                $.ajax({
                    type: 'POST',
                    url: t.path.getDataRoleConfigs,
                    data: {paramJson: $.toJSON(param)},
                    async: false,
                    dataType: "json",
                    timeout: 10000,
                    success: function callback(rep) {
                        $('.ev_authNextStep').addClass('ev-hasLoadedCert');
                        var html = "";
                        var certArr = [];
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            var data = rep.responseObject.responseData.data_list;
                            if (data && data.length > 1) {
                                $.each(data, function (index, i) {
                                    html += t.certTemplate(i.refId, i.refValue);
                                });
                                $('.ev_notIdCert').html(html);
                                var getCutStr = function (str, len) {
                                    if (typeof str != 'undefined') {
                                        var newStr = '',
                                            newLength = 0;
                                        for (var i = 0; i < str.length; i++) {
                                            if (str.charCodeAt(i) > 128) {
                                                newLength += 2;
                                            } else {
                                                newLength++;
                                            }
                                            if (newLength <= len) {
                                                newStr = newStr.concat(str[i]);
                                            } else {
                                                break;
                                            }
                                        }
                                        return newStr;
                                    }
                                };
                                $('.ev_notIdCert .al-certCode input').on('input change propertychange copy cut paste', function () {
                                    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
                                    if (comm.getByteLen($.trim($(this).val()).length > 50)) {
                                        $(this).val(getCutStr($.trim($(this).val()), 50));
                                    }
                                    checkCertReady();
                                });
                                $('.ev_idCert .al-certCode input').on('input change propertychange copy cut paste', function () {
                                    $(this).val($(this).val().replace(/[^0-9x]/g, ''));
                                    if ($.trim($(this).val()).length > 18) {
                                        $(this).val($(this).val().substring(0, 18));
                                    }
                                    checkCertReady();
                                });
                                t.getAuthAttachments();
                                t.getAuthProcess();
                                if (TempCache.getItem('auth')) {
                                    if (JSON.parse(TempCache.getItem('auth')).state == 7) {
                                        $('.ev_attFile').click(function (e) {
                                            comm.alertBox({
                                                title: '审核中，暂时无法编辑证件信息',
                                                ensure: "知道了"
                                            });
                                            e.preventDefault();
                                        });
                                    }
                                }
                                $.each($('.ev_attFile'), function (i, e) {
                                    t.bindUpload($(e));
                                });
                            }
                        }
                    }
                });
            },
            //获取认证附件
            getAuthAttachments: function () {
                var t = this;
                t.delAttIdList = [];
                var loadingImg = '//img50.allinmd.cn/authentication/certificate/authImgLoading.png';
                var medTitle = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).medicalTitle : "";
                var isStudent = /医学生/.test(medTitle);
                $.ajax({
                    url: t.path.getAuthAttachments,
                    data: {firstResult: 0, maxResult: 999},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        t.attTypeArr = [];
                        if (comm.hasResponseData(res) && res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length) {
                            var data_list = res.responseObject.responseData.data_list;
                            var attType = [];
                            //(refId==1||refId==6||refId==8||refId==13)
                            var newData = [];
                            var flag = false;
                            $.each(data_list, function (ni, nel) {
                                if (newData.length == 0) {
                                    newData.push(nel);
                                } else {
                                    $.each(newData, function (ji, jel) {
                                        flag = false;
                                        if (jel.attType == nel.attType && jel.attPositionType == nel.attPositionType) {
                                            flag = true;
                                            if (jel.createTime && nel.createTime && Date.parse(jel.createTime.substring(0, 19)) > Date.parse(nel.createTime.substring(0, 19))) {//新数组中同一位置 图片时间> 老的时间 ==为新
                                                newData.splice(ji, 1, jel);
                                            } else {
                                                newData.splice(ji, 1, nel);
                                            }
                                            return false;
                                        }
                                    });
                                    if (!flag) {//是学生，不push 11的，不是学生，不push12的
                                        newData.push(nel);
                                    }
                                }
                            });

                            $.each(newData, function (i, ele) {
                                //图片
                                var _temp;
                                _temp = $('.ev-imgAtt' + ele.attType);

                                var _img = _temp.eq(ele.attPositionType - 1).find('img');
                                var certItems = _temp.parents('.al-certificateItems').eq(0);
                                if (ele.attPath && (ele.attPath.indexOf('jpg') != -1 || ele.attPath.indexOf('jpeg') != -1 || ele.attPath.indexOf('png') != -1 || ele.attPath.indexOf('PNG') != -1 || ele.attPath.indexOf('JPG') != -1 || ele.attPath.indexOf('JPEG') != -1)) {
                                    certItems.find('input[type=file]').eq(ele.attPositionType - 1).siblings('img').eq(0).attr({
                                        src: ele.attPath,
                                        id: ele.id
                                    }).addClass('newUploadSuccess hasUploadImg').siblings(".al-certUpText").hide();//上传图片文字修改
                                }
                                if (ele.attCode) {
                                    //给已经完成的input和inputBox赋值进行展示
                                    _temp.parents('.al-certificateItems').siblings(".al-certCode").find('.al-certInputBox p').show().text(ele.attCode);
                                    _temp.parents('.al-certificateItems').siblings(".al-certCode").find('input').remove();//.val(ele.attCode);
                                }

                                attType.push(ele.attType);
                            });
                            t.attTypeArr = attType;
                            var attNum = checkLeftAtt(attType);  //剩余未传个数
                            if (attNum > 0) {
                                $('.ev-authEmptyCount').html(attNum);
                            } else {
                                var state = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).state : null;
                                if (state == 8) {
                                    $('.authReason.color777').html('您已认证成为唯医执业医师');
                                    $('.authReason.color777.newAddTips').hide();
                                } else {
                                    $('.authReason.color777').html('您已上传所有标星证件，请等待审核');
                                    $('.authReason.color777.newAddTips').hide();
                                }
                                $('.authReason.smallFont').remove();
                            }
                            $.each($('.al-certificateToggleArea'), function (idx, elex) {
                                var hasCodeVal = true;
                                if ($(elex).find('.al-certCode input').length && !$(elex).find('.al-certCode input').val()) {
                                    hasCodeVal = false;
                                }
                                if ($(elex).find('.hasUploadImg').length == $(elex).find('input[type=file]').length && hasCodeVal) {//已经填完的照片和证件号的
                                    if ($(elex).find('.hasUploadImg').length == 1) {// 1个证件照片
                                        $(elex).find('.al-firstCertItem section').eq(0).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(0).attr('src') + '"/>');
                                        $(elex).find('.al-firstCertItem section').eq(1).remove();
                                    } else {
                                        $(elex).find('.al-firstCertItem section').eq(0).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(0).attr('src') + '"/>');
                                        $(elex).find('.al-firstCertItem section').eq(1).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(1).attr('src') + '"/>');
                                        $(elex).find('.al-certItem').eq(1).remove();
                                    }
                                    $(elex).find('h3 input').val($(elex).find('.al-certCode input').val()).hide();//老版本展示容错
                                    $(elex).find(".al-certInputBox").addClass("authInfo");//证件编码样式修改
                                    $(elex).find(".al-certItemBox .al-certTip").hide();//图片下的提示文字隐藏
                                } else {//未填完整的照片和证件号的
                                    $(elex).find('.hasUploadImg').siblings('input[type=file]').hide();
                                }
                            });
                            // t.viewBigImg();
                            $('.ev_demoImg').each(function (ix, ele) {
                                var img = new Image();
                                img.src = $(ele).attr('imgSrc');
                                img.onload = function () {
                                    $(ele).attr('src', img.src);
                                    t.viewBigImg($('.ev_demoImg').parent());
                                };
                            });
                            checkCertReady();
                        } else {
                            $('.ev_demoImg').each(function (ix, ele) {
                                var img = new Image();
                                img.src = $(ele).attr('imgSrc');
                                img.onload = function () {
                                    $(ele).attr('src', img.src);
                                    // t.viewBigImg($('.ev_demoImg').parent());
                                };
                            });
                            $('.ev-authEmptyCount').html(4);
                        }
                    }
                });
            },
            //证书模板
            certTemplate: function (refId, refValue) {
                var demoImg = [];//存放示例图片
                var tipWords = '';
                var medTitle = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).medicalTitle : "";
                var isStudent = /医学生/.test(medTitle);
                var loadingImg = '//img50.allinmd.cn/authentication/certificate/authImgLoading.png';
                demoImg[8] = ['pic_zhiye1.png', 'pic_zhiye2.png'];//医师执业证
                demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];//医师资格证
                demoImg[13] = ['pic_zhicheng.png'];//医师职称证
                demoImg[10] = ['pic_work.png'];//工作证
                demoImg[11] = ['pic_work.png','pic_nurseWork.png'];//工作证
                demoImg[12] = ['pic_student.png'];//学生证
                demoImg[7] = ['pic_xuewei.png'];//学位证
                demoImg[9] = ['pic_xueli.png'];//学历证
                demoImg[1] = ['pic_id1.png', 'pic_id2.png'];//身份证
                demoImg[15] = ['pic_nurseZhiye1.png', 'pic_nurseZhiye2.png'];//15-护士执业证
                demoImg[16] = ['pic_nurseJishuzige1.png'];//16-专业技术资格证

                if (refId == 1 || refId == 6 || refId == 8 || refId == 15) {
                    tipWords = '第一页'
                }

                var html =
                    ' <section class="al-certificateToggleArea slideDownState">' +
                    '     <article class="al-tableModuleItem al-cerTitleText">' +
                    '         <h3 class="al-toggleStar auth_Info">' + refValue +
                    '        </h3> ' +
                    '     </article>' +
                    '     <section class="al-certificateItems' + (refId == 1 ? ' ev-idCard' : '') + '">' +
                    '<p class="al-certNameText">证件照片</p>' + /*证件信息父层  加标题用20180905*/
                    '<section class="al-certItemBox">' +
                    '         <section class="al-certItem al-firstCertItem">' +
                    '<aside class="al-upImgBox">' +
                    '             <section class="ev-imgAtt' + refId + '">' +
                    '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + ((cusRole==12&&refId==11)?demoImg[11][1]:demoImg[refId][0])  + '" />' +
                    '             </section>' +
                    '                 <p class="al-certTip">' + tipWords + '示例' + '</p>' +
                    '</aside>' +
                    '<aside class="al-upImgBox">' +
                    '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                    '                 <img src="//img50.allinmd.cn/authentication/auth/upload_01.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/upload_01.png"/>' +
                    '                 <span class="al-certUpText">上传照片</span>' +
                    '                 <figure class="al-certLoadingTip hide">' +
                    '                     <img class="notShow" src="//img50.allinmd.cn/case/loading.gif" alt=""/>' +
                    '                 </figure>' +
                    '                 <figure class="al-certErrorTip hide">' +
                    '                     <p>上传失败<br/>删除后重新上传</p>' +
                    '                 </figure>' +
                    '                 <span class="al-certClose hide"></span>' +
                    '            </section>' +
                    '                 <p class="al-certTip">' + ((refId == 1 || refId == 6 || refId == 8 || refId == 15) ? '第一页' : '') + '</p>' +
                    '    </aside>' +
                    '         </section>' +
                    ((refId == 1 || refId == 6 || refId == 8 || refId == 15) ? (   //两张图片的
                        '         <section class="al-certItem">' +
                        '<aside class="al-upImgBox">' +
                        '             <section>' +
                        '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + demoImg[refId][1] + '" alt=""/>' +
                        '             </section>' +
                        '              <p class="al-certTip">第二页示例</p>' +
                        '   </aside>' +
                        '<aside class="al-upImgBox">' +
                        '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                        '                 <img src="//img50.allinmd.cn/authentication/auth/upload_01.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/upload_01.png"/>' +
                        '                 <span class="al-certUpText">上传照片</span>' +
                        '                 <figure class="al-certLoadingTip hide">' +
                        '                     <img class="notShow" src="//img50.allinmd.cn/case/loading.gif" alt=""/>' +
                        '                 </figure>' +
                        '                 <figure class="al-certErrorTip hide">' +
                        '                     <p>上传失败<br/>删除后重新上传</p>' +
                        '                 </figure>' +
                        '                 <span class="al-certClose hide"></span>' +
                        '            </section>' +
                        '              <p class="al-certTip">第二页</p>' +
                        '    </aside>' +
                        '         </section>'
                    ) : "") +
                    '     </section>' +
                    '     </section>' +
                    '<p class="al-cerPlaceholder"></p>' +
                    ' </section>';
                return html;
            },
            //绑定上传图片
            bindUpload: function (obj) {
                var t = this;
                var loadingTip = '';//上传loading
                var errorTip = '';//错误提示
                var certClose = '';//删除
                var showImg = '';     //显示图片
                obj.uploadImg({
                    ajaxData: {
                        url: M_CALL + "comm/upload_attachment/upload/",
                    },               //ajax请求配置参数 url,type等
                    ratio: 0.6,
                    formData: {
                        paramJson: '{imageType:2}'
                    },
                    fileName: 'file',// 上传的data
                    multiple: false,            //文件单选多选
                    inputStyle: {
                        width: '100%',
                        height: '100%',
                        "z-index": 3,
                        top: 0,
                        left: 0,
                        position: "absolute",
                        opacity: 0
                    },
                    fileChange: function () {
                    },
                    fileSelected: function (file) {
                        if (!/((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test(file.type)) {
                            popup('只允许上传.jpg .jpeg .png类型的图片文件');
                            obj.find("input").val("");
                            return false;
                        }
                        var fileSize = file.size;
                        if (fileSize > 10 * 1048576) {
                            popup("超过10M大小，无法上传");
                            obj.find("input").val("");
                            return false;
                        }
                    },
                    uploadBefore: function () {
                        var self = obj.find("input");
                        loadingTip = self.siblings('.al-certLoadingTip');//上传loading
                        errorTip = self.siblings('.al-certErrorTip');//错误提示
                        certClose = self.siblings('.al-certClose');//删除
                        showImg = self.siblings('img');     //显示图片
                        loadingTip.removeClass('hide');
                        showImg.addClass('hide');
                        showImg.siblings(".al-certUpText").hide();//上传图片文字修改
                    },
                    uploadSuccess: function (data, status) {
                        var url = data.responseObject.responseMessage.url;
                        var path = data.responseObject.responseMessage.path;
                        if (data.responseObject.responseStatus) {
                            showImg.attr({
                                src: url,
                                val: url
                            }).removeClass('hide newDelete').addClass('newUploadSuccess').siblings(".al-certUpText").hide();//上传图片文字修改
                            loadingTip.addClass('hide');
                            t.viewBigImg('.al-certItemUploadBox');
                            obj.find("input").hide();
                            t.attTypeArr.push(parseInt(obj.attr('attType')));
                            var _nn = checkLeftAtt(t.attTypeArr);
                            $('.ev-authEmptyCount').attr('leftNum', _nn);
                            checkCertReady();
                            certClose.removeClass('hide').off('click').click(function () {
                                obj.find("input").show().val("");
                                $.each(t.attTypeArr, function (index, num) {
                                    if (num == parseInt(obj.attr('attType'))) {
                                        t.attTypeArr.splice(index, 1);
                                        return false;
                                    }
                                });
                                loadingTip.addClass('hide');
                                var _num = checkLeftAtt(t.attTypeArr);
                                $('.ev-authEmptyCount').attr('leftNum', _num);
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide').siblings(".al-certUpText").show();//上传图片文字修改
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(0).attr('class')) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                checkCertReady();
                            });

                        } else {
                            errorTip.removeClass('hide');
                            loadingTip.addClass('hide');
                            obj.find("input").hide();
                            certClose.removeClass('hide').off('click').click(function () {
                                errorTip.addClass('hide');
                                obj.find("input").show().val("");
                                loadingTip.addClass('hide');
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide');
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                checkCertReady();
                            });
                        }
                    },
                    uploadFail: function (XMLHttpRequest, textStatus, errorThrown) {
                        errorTip.removeClass('hide');
                        obj.find("input").hide();
                        loadingTip.addClass('hide');
                        certClose.removeClass('hide').off('click').click(function () {
                            errorTip.addClass('hide');
                            obj.find("input").show().val("");
                            showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide');
                            $(this).addClass('hide');
                            if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                    $('html').removeAttr('emptyAttCode');
                                }
                            }
                            checkCertReady();
                        });

                    },
                });
            },
            //查看大图
            viewBigImg: function () {
                bigPicShow.init({
                    domIdList: [".al-certItemUploadBox,.al-certItem section"],//指定多个class|| ID
                    topSwiperOptions: {
                        isInit: true,//是否需要初始化,
                        onInit: function (sipwer) {
                        },
                        zoom: true
                    },
                    imgClickCallBack: function (index, ele) {
                        // Log.createBrowse(188, '点击大图');
                        setTimeout(function () {
                            if (g_sps) {
                                g_sps.createBrowse({pageId: 453})
                            }
                        }, 2000);
                        $('html').attr('sT', $(window).scrollTop());
                        $('html,body').css({height: '100%', overflow: 'hidden'});
                    },
                    bottomSwiperOptions: {
                        isInit: false,//是否需要初始化,
                    },
                    closeCallBack: function () {
                        $('html,body').css({height: 'auto', overflow: 'auto'});
                        $(window).scrollTop($('html').attr('sT') || 0);
                        $('html').removeAttr('sT');
                    },
                    theme: 'dark',
                    topTitle: {
                        isInit: true,
                        title: ""
                    }
                });
            },
            //提交认证
            submit: function () {
                var t = this;
                $('.al-authInfoSave').off("click").on("click", function () {
                    var saveBtn = $(this);
                    if ($(this).hasClass('active') && $(this).attr('flag') == 'true') {
                        comm.loading.show();
                        $('.al-middleTipsBox').css({
                            left: 0, right: 0, background: "rgba(0,0,0,0.3)"
                        });
                        var attArr = [];
                        $.each($('.newUploadSuccess'), function (i, el) {
                            attArr.push({
                                attType: $(el).parents('.al-certificateItems').find('.al-firstCertItem section').eq(0).attr('class').split('ev-imgAtt')[1],
                                // attCode: _attCode,
                                attPath: $(el).attr('src').split('img05.allinmd.cn/')[1],
                                attPositionType: $(el).parents('.al-certItem').hasClass('al-firstCertItem') ? 1 : 2,
                                isUpdate: ($(el).attr('id')) ? 1 : 0,
                                id: $(el).attr('id') ? $(el).attr('id') : '_'
                            });
                        });
                        $.each($('input[type=file]'), function (si, sl) {
                            if ($(sl).siblings('img').eq(0).attr('id') && !$(sl).siblings('img').eq(0).hasClass('newUploadSuccess')) { //有id却没有图片，说明被删除
                                t.delAttIdList.push($(sl).siblings('img').eq(0).attr('id'));
                            }
                        });
                        var param = {
                            customerId: TempCache.getItem('userId'),
                            delAttIdList: t.delAttIdList.join(","),
                            authAttList: JSON.stringify(attArr),
                            opflag: 2,
                            isCompleted: 1//是否补全四证1-是0-否

                        };
                        var _callback = function (data) {
                            comm.loading.hide();
                            $('.al-middleTipsBox').css({
                                left: 0, right: 0, background: "transparent"
                            });
                            if (data && data.responseObject && data.responseObject.responseStatus) {
                                $.each($('.newUploadSuccess'), function (i, ele) {
                                    var imgLen = $(ele).parents('.al-certificateItems').find('.al-certItem').length;
                                    var selfIndex = $(ele).parents('.al-certItem').index();
                                    var attCode = '';
                                    if ($(ele).parents('.al-certificateToggleArea').find('h3 input').val() == "") {
                                        attCode = $(ele).parents('.al-certificateToggleArea').find('.al-certCode input').val();
                                        $(ele).parents('.al-certificateToggleArea').find('h3 input').val(attCode).hide();
                                        $(ele).parents('.al-certificateToggleArea').find(".al-certInputBox").addClass("authInfo");//证件编码样式修改
                                        $(ele).parents('.al-certificateToggleArea').find('.al-certInputBox p').text(attCode);
                                        $(ele).parents('.al-certificateToggleArea').find('.al-certInputBox input').remove();//.val(ele.attCode);
                                    }
                                    $(ele).parents('.al-certificateToggleArea').find(".al-certItemBox .al-certTip").hide();//图片下的提示文字隐藏

                                    if (imgLen == 1) {
                                        $(ele).parents('.al-certItem').find('section').eq(0).html('<img src="' + $(ele).attr('src') + '"/>');
                                        $(ele).parents('.al-certificateToggleArea').find('.al-certCode').remove();
                                        $(ele).parents('.al-certItem').find('section').eq(1).remove();
                                    } else {
                                        if ($(ele).parents('.al-certItem').hasClass('al-firstCertItem')) {//二张图片的第一个
                                            $(ele).parents('.al-certItem').find('section').eq(0).html('<img src="' + $(ele).attr('src') + '"/>');
                                        } else { //第二张图片
                                            if ($(ele).parents('.al-certificateItems').find('.al-certItem').eq(0).find('section').eq(1).find('.hasUploadImg').length == 1) {//如果第一张已经有图片
                                                $(ele).parents('.al-certificateItems').find('.al-certItem').eq(0).find('section').eq(0).html($(ele).parents('.al-certificateItems').find('.al-certItem').eq(0).find('section').eq(1).find('.hasUploadImg')[0]);
                                            }
                                            $(ele).parents('.al-certificateItems').find('.al-certItem').eq(0).find('section').eq(1).html('<img src="' + $(ele).attr('src') + '"/>');
                                            // $(ele).parents('.al-certificateToggleArea').find('.al-certCode').remove();
                                            $(ele).parents('.al-certificateItems').find('.al-certItem').eq(1).remove();
                                        }
                                    }
                                    $(ele).removeClass('newUploadSuccess');
                                });
                                t.viewBigImg();
                                saveBtn.removeClass('active');
                            }
                        };
                        comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _callback);
                    } else {
                        //1*身份证,8*医师执业证,6*医师资格证,13*医师职称证书,10工作证(学生证),9医学学历证,7医学学位证
                        if ($('html').attr('emptyAttCode')) {
                            $(window).scrollTop($('.' + $('html').attr('emptyAttCode')).parents('.al-certificateToggleArea').offset().top);
                            if ($('html').attr('emptyAttCode') == 'ev-imgAtt1') {
                                popup('请完整上传身份证后再保存');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt8') {
                                popup('请完整上传医师执业证后再保存');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt6') {
                                popup('请完整上传医师资格证后再保存');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt13') {
                                popup('请完整上传医师职称证后再保存');
                            }
                            $('.' + $('html').attr('emptyAttCode')).parents('.al-certificateToggleArea').find('.al-certCode').focus();
                        } else {
                            return false;
                        }

                    }
                });

            }
        };
        user.privExecute({
            operateType: 'login',
            callback: function () {
                index.init();
            }
        });

        function checkCertReady() {//检测证件是否可以保存
            var flaArr = [], flaArr2 = [];
            $('.al-authInfoSave').removeClass('active').attr('flag', false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev_notIdCert .al-certificateItems'), function (ind, elem) {
                if ($(elem).find('.ev-imgAtt1').length) {//身份证判断
                    $.each($('.ev-idCard'), function (inde, eleme) {//身份证上传2张并且 资质证明至少有一张
                        if (($(eleme).find('.newUploadSuccess').length && $(eleme).find('.newUploadSuccess').length != 2)) {// 只上传了一张
                            $('html').attr('emptyAttCode', 'ev-imgAtt1');
                            flaArr.push(1);
                            flaArr2.push(0);
                        }else if ($(eleme).find('.newUploadSuccess').length == 2) {// 上传了2张，并且身份证号相符
                            $('.al-authInfoSave').addClass('active');
                            if ($('html').attr('emptyAttCode') == 'ev-imgAtt1') {
                                $('html').removeAttr('emptyAttCode');
                            }
                            flaArr.push(1);
                            flaArr2.push(1);
                        }
                    });
                }
                //传了图片
                if (
                    $(elem).find('input').length != 0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                    $(elem).find('input').length == $(elem).find('.newUploadSuccess').length
                ) {
                    $('.al-authInfoSave').addClass('active').attr('flag', true);
                    flaArr.push(1);
                    flaArr2.push(1);
                } else if ($(elem).find('input').length != $(elem).find('.newUploadSuccess').length && $(elem).find('.newUploadSuccess').length != 0) {//两张传一张
                    $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem section').eq(0).attr('class'));
                    flaArr.push(1);
                    flaArr2.push(0);

                }
            });
            if (flaArr.indexOf(1) > -1) {
                $('.al-authInfoSave').addClass('active');
            }
            if (flaArr2.indexOf(0) > -1) {
                $('.al-authInfoSave').attr('flag', false);
            } else {
                $('.al-authInfoSave').attr('flag', true);
            }

        }

        function checkLeftAtt(attType) {
            var attNum = 4;
            if (attType.indexOf(1) > -1) {
                if (attType.indexOf(1) != attType.lastIndexOf(1)) {
                    attNum--;
                }
            }
            if (attType.indexOf(6) > -1) {
                if (attType.indexOf(6) != attType.lastIndexOf(6)) {
                    attNum--;
                }
            }
            if (attType.indexOf(8) > -1) {
                if (attType.indexOf(8) != attType.lastIndexOf(8)) {
                    attNum--;
                }
            }
            if (attType.indexOf(13) > -1) {
                attNum--;
            }
            return attNum;
        }
    })
});
