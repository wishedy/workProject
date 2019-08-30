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

        var index = {
            path: {
                createAuthNew: M_CALL + 'customer/auth/createAuth2/',
                getCustomerAuth: M_CALL + "customer/auth/getCustomerAuth/",//获取认证信息
                getDataRoleConfigs: M_CALL + "comm/data/roleconfig/getDataRoleConfigs/",//获取会员证件类型
                getAuthAttachments: M_CALL + "customer/auth/getAuthAttachments/",//获取认证附件
                upload: M_CALL + "comm/upload_attachment/upload/",//上传图片
                creatAuth: M_CALL + "customer/auth_attachment/createAuthAttachment/",
                showTip: ""
            },
            init: function () {
                // Log.createBrowse(10025, '个人中心-其他个人信息-个人中心-证件信息');
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId:452})
                    }},2000);
                var t = this;
                t.backBtn();
                t.loadCertificate();
                t.questionModule();
                t.showTipAction();
                //
            },
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
            showTipAction: function () {
                var state = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).state : null;
                if (state == 9) {
                    $('.ev-authV2Fail').show();
                } else if (state == 8) {
                    $('.authReason.color777').html('您已认证成为唯医执业医师');
                    $('.authReason.color777.newAddTips').hide();
                    $('.authReason.smallFont').remove();
                } else if (state == 7) {
                    $('.authReason.color777').html('您已上传所有标星证件，请等待审核');
                    $('.authReason.color777.newAddTips').hide();
                    $('.authReason.smallFont').remove();
                }
                $('.ev-authV2Fail i').click(function () {
                    $('.ev-authV2Fail').remove();
                });
                if (state == 7 || state == 1 || state == 0) {
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
                }
            },
            backBtn: function () {
                var t = this;
                $('.ev_authBackBtn').click(function () {
                    var flag = false;
                    $.each($('.al-certCode'), function (i, el) {
                        if ($(el).find('input').val() != "") {
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
            questionModule: function () {
                $('.icon-question').click(function () {
                    comm.creatEvent({
                        triggerType: "认证",
                        triggerName: '认证-等级规则',
                        keyword: '认证-等级规则',
                        actionId: 2517
                    });
                    $('.serviceTime').show();
                });
                $('.ev-authGradeClose').click(function () {
                    $('.serviceTime').hide();
                });

            },
            //加载证书项
            loadCertificate: function () {
                var t = this;
                var param = {roleId: 6, typeId: 1};
                $.ajax({
                    type: 'POST',
                    url: commdata.urlList.getDataRoleConfigs.url,
                    data: {paramJson: $.toJSON(param)},
                    async: false,
                    dataType: "json",
                    timeout: 10000,
                    success: function callback(rep) {
                        $('.ev_authNextStep').addClass('ev-hasLoadedCert');
                        var html = "";
                        var certArr = [];
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            var data = rep.responseObject.responseMessage;
                            if (data && data.length > 1) {
                                $.each(data, function (index, i) {
                                    if (i.refId != 1) {//其他证件
                                        html += t.certTemplate(i.refId, i.refValue);
                                    } else {//身份证
                                        $('.ev_idCert').html(t.certTemplate(1, i.refValue));
                                    }
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
            getAuthAttachments: function () {
                var t = this;
                t.delAttIdList = [];
                var loadingImg = '//img50.allinmd.cn/authentication/certificate/authImgLoading.png';
                var medTitle = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).medicalTitle : "";
                var isStudent = /医学生/.test(medTitle);
                $.ajax({
                    url: t.path.getAuthAttachments,
                    data: {"dataFlag": 2, pageSize: 20},
                    type: "post",
                    dataType: "json",
                    success: function (res) {
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
                                        if (jel.attType == 10) {//&&(nel.attType ==11||nel.attType==12
                                            if ((isStudent && nel.attType == 12) || (!isStudent && nel.attType == 11)) {//如果是学生，且当前attType是12，替换现有的attType是10的数据， 是医生，替换11的
                                                newData.splice(ji, 1, nel);
                                            }

                                        }
                                    });
                                    if (!flag && ((isStudent && nel.attType != 11) || (!isStudent && nel.attType != 12))) {//是学生，不push 11的，不是学生，不push12的
                                        newData.push(nel);
                                    }
                                }
                            });

                            $.each(newData, function (i, ele) {
                                //图片
                                var _temp;
                                if (ele.attType == 10 || ele.attType == 11 || ele.attType == 12) {
                                    _temp = $('.ev-imgAtt10');
                                    if (ele.attType != 10) {
                                        _temp.addClass('ev-imgAtt' + ele.attType);//.removeClass('ev-imgAtt10');
                                    }
                                    _temp = $('.ev-imgAtt' + ele.attType);
                                } else {
                                    _temp = $('.ev-imgAtt' + ele.attType);
                                }

                                var _img = _temp.eq(ele.attPositionType - 1).find('img');
                                var certItems = _temp.parents('.al-certificateItems').eq(0);
                                //_temp.parents('.al-certificateToggleArea').addClass('hasLoadedCerts').find('.al-certCode').remove();
                                if(ele.attPath&&(ele.attPath.indexOf('jpg')!=-1||ele.attPath.indexOf('jpeg')!=-1||ele.attPath.indexOf('png')!=-1||ele.attPath.indexOf('PNG')!=-1||ele.attPath.indexOf('JPG')!=-1||ele.attPath.indexOf('JPEG')!=-1)) {
                                    certItems.find('input[type=file]').eq(ele.attPositionType - 1).siblings('img').eq(0).attr({
                                        src: ele.attPath,
                                        id: ele.id
                                    }).addClass('newUploadSuccess hasUploadImg');//
                                }
                                if (ele.attCode) {
                                    _temp.parents('.al-certificateItems').siblings('.al-certCode').find('input').val(ele.attCode);
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
                                        $(elex).find('.al-firstCertItem>section').eq(0).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(0).attr('src') + '"/>');
                                        $(elex).find('.al-firstCertItem>section').eq(1).remove();
                                    } else {
                                        $(elex).find('.al-firstCertItem>section').eq(0).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(0).attr('src') + '"/>');
                                        $(elex).find('.al-firstCertItem>section').eq(1).html('<img class="ev_demoImg" src="' + loadingImg + '" imgSrc="' + $(elex).find('.hasUploadImg').eq(1).attr('src') + '"/>');
                                        $(elex).find('.al-certItem').eq(1).remove();
                                    }
                                    $(elex).find('h3 input').val($(elex).find('.al-certCode input').val());
                                    $(elex).find('.al-certCode').remove();

                                } else {//未填完整的照片和证件号的
                                    $(elex).find('.hasUploadImg').siblings('input[type=file]').hide();
                                    /*此处保留删除功能，防止需求反复*/
                                    //$(elex).find('.hasUploadImg').siblings('.al-certClose').removeClass('hide').off('click').click(function(){
                                    //    $(this).addClass('hide');
                                    //    $(this).siblings('input').show().val("");
                                    //    $(this).siblings('img').eq(0).attr('src',$(this).siblings('img').eq(0).attr('oriUrl')).removeClass('newUploadSuccess hasUploadImg');
                                    //    var slef = $(this);
                                    //    $.each(t.attTypeArr,function(index,num){
                                    //        if(num==parseInt(slef.siblings('input').attr('attType'))){
                                    //            t.attTypeArr.splice(index,1);
                                    //            return false;
                                    //        }
                                    //    });
                                    //    var _num = checkLeftAtt(t.attTypeArr);
                                    //    $('.ev-authEmptyCount').attr('leftNum',_num);
                                    //    //if(_num>0){
                                    //    //    $('.ev-authEmptyCount').html(_num);
                                    //    //}else{
                                    //    //    $('.authReason.color777').html('您已上传所有标星证件，请等待审核');
                                    //    //    $('.authReason.smallFont').remove();
                                    //    //}
                                    //    var showImg = $(this).siblings('img').eq(0);
                                    //    if(showImg.parents('.al-certificateItems').find('.newUploadSuccess').length<showImg.parents('.al-certificateItems').find('input').length){
                                    //        if($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(0).attr('class')){
                                    //            $('html').removeAttr('emptyAttCode');
                                    //        }
                                    //    }
                                    //    checkCertReady();
                                    //
                                    //});
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
                demoImg[8] = ['pic_zige1.png', 'pic_zige2.png'];
                demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];
                demoImg[13] = ['pic_zhicheng.png'];
                demoImg[10] = ['pic_work.png', 'pic_student.png'];
                demoImg[11] = ['pic_work.png'];
                demoImg[12] = ['pic_student.png'];
                demoImg[7] = ['pic_xuewei.png'];
                demoImg[9] = ['pic_xueli.png'];
                demoImg[1] = ['pic_id1.png', 'pic_id2.png'];
                if (refId == 1 || refId == 6 || refId == 8) {
                    tipWords = '第一页'
                }

                var html =
                    ' <section class="al-certificateToggleArea slideDownState">' +
                    '     <article class="al-tableModuleItem">' +
                    '         <h3 class="al-toggleStar">' + (refId == 10 ? (isStudent ? "学生证" : "工作证") : refValue) + ((refId == 1 || refId == 6 || refId == 8 || refId == 13) ? ('<img class="al-certificateStar" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAbVJREFUOBHFlM9Kw0AQxr+NVQQRDyIIHjxIVawH/2Go6KGKBx/Cx/DqC/gY6r1HoehJLJX676CIpQcPgiAeRCxi1fWbko0xm5pICy4kszPz228nk2SB/x66jM2216BPsERhLTapuJMQNNUaG7tMxRH6FFl84sjnHCyoGRR9v8kkvmId6m3YbyL8a8X6HPN4R8lam4KrpnBsxQMBS1hfoguvGIFCmi3YILsY4M30EA62oFFBN6oqgzeTMFaxh+sEXF5pBtMUHOY8vkW+ArfXuKVb4Vq5SnwH24qPO83HLTDRb9gW7CNSWGWbzhy5USjHnR5aEIS3Pufp0fUGWzLBh9qnO2hif7D3bN4KW3Bl1vjCEmBbRvGBA/ZsyACxVuEOHVhmpTdB9oewJPjryhdRpPhAEIycS/s0smoO1XDeevseVAuDTfxalKiwdsXX6MULnliJlbPEFake9KlxPIdzVsUUzSQSFSXZXPiIYQtrTEZwdUrsMV63ciqpcBBU/AAVdtCJMTWLNbENX+JmRBdist+Wh3mhcaiXkdcXkdVD4mTy3uEvf238ILzLy40nG5+mK3wStm3MF7+TgMtRiX3pAAAAAElFTkSuQmCC" alt=""/>') + '<input type="text" placeholder="" value="" readonly/>' : "") +
                    '        </h3> ' +
                    '     </article>' +
                    ((refId == 1 || refId == 6 || refId == 8 || refId == 13) ?
                        '     <section class="al-certCode">' +
                        (refId == 8?'<p class="al-certAuthTips"><span>需包含必要信息页：基本信息页 和 变更信息页</span></p>':"")+//20180703 修改需求如果是医师执业证需要增加说明文字
                        '         <span>证件编号</span><input type="text" placeholder="请输入证件编号"/>' +
                        '     </section>' : "") +
                    '     <section class="al-certificateItems">' +
                    '         <section class="al-certItem al-firstCertItem">' +
                    '             <section class="ev-imgAtt' + refId + '">' +
                    '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + (refId == 10 ? (isStudent ? demoImg[10][1] : demoImg[10][0]) : demoImg[refId][0]) + '" alt=""/>' +
                    '                 <span class="al-certTip '+(refId==8?' bgChange':'')+'">' +(refId==8?'基础页+照片页示例':tipWords+'示例')+'</span>' +
                    '             </section>' +
                    '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                    '                 <img src="//img50.allinmd.cn/authentication/auth/photo.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/photo.png"/>' +
                    //'                 <input type="file" name="file" class="attFile ev_attFile" attType="'+refId+'" id="attFile_'+refId+((refId==1||refId==6||refId==8)?'_1':"")+'"/>'+
                    '                 <figure class="al-certLoadingTip hide">' +
                    '                     <img class="notShow" src="//img50.allinmd.cn/case/loading.gif" alt=""/>' +
                    '                 </figure>' +
                    '                 <figure class="al-certErrorTip hide">' +
                    '                     <p>上传失败<br/>删除后重新上传</p>' +
                    '                 </figure>' +
                    '                 <span class="al-certClose hide"></span>' +
                    '            </section>' +
                    '         </section>' +
                    ((refId == 1 || refId == 6 || refId == 8) ? (   //两张图片的
                        '         <section class="al-certItem">' +
                        '             <section>' +
                        '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + demoImg[refId][1] + '" alt=""/>' +
                        '                 <span class="al-certTip '+(refId==8?' bgChange':'')+'">' +(refId==8?'信息页+变更页示例':'第二页示例')+'</span>' +
                        '             </section>' +
                        '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                        '                 <img src="//img50.allinmd.cn/authentication/auth/photo.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/photo.png"/>' +
                        //'                 <input type="file" name="file" class="attFile ev_attFile" attType="'+refId+'"  id="attFile_'+refId+((refId==1||refId==6||refId==8)?'_2':"")+'"/>'+
                        '                 <figure class="al-certLoadingTip hide">' +
                        '                     <img class="notShow" src="//img50.allinmd.cn/case/loading.gif" alt=""/>' +
                        '                 </figure>' +
                        '                 <figure class="al-certErrorTip hide">' +
                        '                     <p>上传失败<br/>删除后重新上传</p>' +
                        '                 </figure>' +
                        '                 <span class="al-certClose hide"></span>' +
                        '            </section>' +
                        '         </section>'
                    ) : "") +
                    '     </section>' +
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
                    },
                    uploadSuccess: function (data, status) {
                        var url = data.responseObject.responseMessage.url;
                        var path = data.responseObject.responseMessage.path;
                        if (data.responseObject.responseStatus) {
                            showImg.attr({
                                src: url,
                                val: url
                            }).removeClass('hide newDelete').addClass('newUploadSuccess');
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
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide');
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(0).attr('class')) {
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
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
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
                                if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                    $('html').removeAttr('emptyAttCode');
                                }
                            }
                            checkCertReady();
                        });

                    },
                });
            },
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
                        setTimeout(function(){
                            if(g_sps) {
                                g_sps.createBrowse({pageId: 453})
                            }},2000);
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
                $('.al-authInfoSave').click(function () {
                    var saveBtn = $(this);
                    if (saveBtn.attr('leftNum') == 0) {
                        comm.alertBox({
                            title: '审核中，暂时无法编辑证件信息',
                            ensure: "知道了"
                        });
                        return false;
                    }
                    if ($(this).hasClass('active') && $(this).attr('flag') == 'true') {
                        comm.loading.show();
                        $('.al-middleTipsBox').css({
                            left: 0, right: 0, background: "rgba(0,0,0,0.3)"
                        });
                        var attArr = [];
                        $.each($('.newUploadSuccess'), function (i, el) {
                            var _attCode = '';
                            if ($(el).parents('.al-certificateToggleArea').find('.al-certCode').length) {
                                _attCode = $(el).parents('.al-certificateToggleArea').find('.al-certCode input').val();
                            } else if ($(el).parents('.al-certificateToggleArea').find('h3 input').length) {
                                _attCode = $(el).parents('.al-certificateToggleArea').find('h3 input').val();
                            }
                            attArr.push({
                                attType: $(el).parents('.al-certificateItems').find('.al-firstCertItem section').eq(0).attr('class').split('ev-imgAtt')[1],
                                attCode: _attCode,
                                attPath: $(el).attr('src').split('img05.allinmd.cn/')[1],
                                attPositionType: $(el).parents('.al-certItem').hasClass('al-firstCertItem') ? 1 : 2,
                                isUpdate: 0,
                                id: '_'
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
                                        $(ele).parents('.al-certificateToggleArea').find('h3 input').val(attCode);
                                    }


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
                                            $(ele).parents('.al-certificateToggleArea').find('.al-certCode').remove();
                                            $(ele).parents('.al-certificateItems').find('.al-certItem').eq(1).remove();
                                        }
                                    }
                                    $(ele).removeClass('newUploadSuccess');
                                });
                                if (TempCache.getItem('auth') && JSON.parse(TempCache.getItem('auth')).state != 8) {
                                    if ($('.ev-authEmptyCount').attr('leftNum') > 0) {
                                        $('.ev-authEmptyCount').html($('.ev-authEmptyCount').attr('leftNum'));
                                    } else {
                                        $('.authReason.color777').html('您已上传所有标星证件，请等待审核');
                                        $('.authReason.color777.newAddTips').hide();
                                        $('.authReason.smallFont').remove();
                                        saveBtn.attr('leftNum', 0);
                                        $('.ev_attFile').click(function (e) {
                                            comm.alertBox({
                                                title: '审核中，暂时无法编辑证件信息',
                                                ensure: "知道了"
                                            });
                                            e.preventDefault();
                                        });
                                    }
                                }

                                t.viewBigImg();
                                saveBtn.removeClass('active');
                            } else {
                                if (data && data.responseObject && data.responseObject.responseCode) {
                                    var rscode = data.responseObject.responseCode;
                                    if (rscode == "0B0101" || rscode == "0B0102") {
                                        comm.alertBox({
                                            "title": "审核中，暂时无法编辑证件信息",
                                            "ensure": "知道了"

                                        });
                                    } else {
                                        popup(rst.responseMessage);
                                        user.success();
                                    }
                                }
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
            var isID1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,//身份证校验
                isID2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
            //var isID1 =/\d/;
            //var isID2 =/\d/;
            var flaArr = [], flaArr2 = [];
            $('.al-authInfoSave').removeClass('active').attr('flag', false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev_notIdCert .al-certificateItems'), function (ind, elem) {
                //传了图片
                if (
                    $(elem).find('input').length != 0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                    $(elem).find('input').length == $(elem).find('.newUploadSuccess').length
                ) {
                    //身份证、医师执业证、医师资格证、医师职称证; 证件的证件号码为必填项，上传证件必须证件号加证件照片都填写
                    if ($(elem).find('.ev-imgAtt13').length > 0 || $(elem).find('.ev-imgAtt6').length > 0 || $(elem).find('.ev-imgAtt8').length > 0) {
                        if (/^[a-zA-Z0-9]{1,50}$/.test($(elem).siblings('.al-certCode').find('input').val())) {//证件号码为必填 非空 （图片传全，号码正确）
                            $('.al-authInfoSave').addClass('active').attr('flag', true);
                            flaArr.push(1);
                            flaArr2.push(1);
                        } else {//（图片传全，号码不正确）
                            flaArr.push(1);
                            flaArr2.push(0);
                            $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem section').eq(0).attr('class'));

                        }
                    } else {
                        $('.al-authInfoSave').addClass('active').attr('flag', true);
                        flaArr.push(1);
                        flaArr2.push(1);
                    }

                } else if ($(elem).find('input').length != $(elem).find('.newUploadSuccess').length && $(elem).find('.newUploadSuccess').length != 0) {//两张传一张
                    $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(0).attr('class'));
                    flaArr.push(1);
                    flaArr2.push(0);

                } else if ($(elem).find('.newUploadSuccess').length == 0 &&
                    ($(elem).siblings('.al-certCode').length ?           //如果未保存过证件号，有输入input，检测输入input的值 ， 如果已保存过证件号，检测h3中input的值，都没有为false，双三元
                        /^[a-zA-Z0-9]{1,50}$/.test($(elem).siblings('.al-certCode').find('input').val()) :
                        (($(elem).siblings('.al-tableModuleItem').find('h3 input').length && $(elem).find('input').length != 0) ?
                            /^[a-zA-Z0-9]{1,50}$/.test($(elem).siblings('.al-tableModuleItem').find('h3 input').val()) : false))) {//没传图片，填了证件号
                    $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(0).attr('class'));
                    flaArr.push(1);
                    flaArr2.push(0);
                }

            });

            $.each($('.ev_idCert .al-certificateItems'), function (inde, eleme) {//身份证上传2张并且 资质证明至少有一张
                var _attCode = '';
                if ($(eleme).siblings('.al-certCode').length) {
                    _attCode = $(eleme).siblings('.al-certCode').find('input').val();
                } else if ($(eleme).siblings('.al-tableModuleItem h3 input').length) {
                    _attCode = $(eleme).siblings('.al-tableModuleItem h3 input').val();
                }
                if (
                    ($(eleme).find('.newUploadSuccess').length && $(eleme).find('.newUploadSuccess').length != 2)       // 只上传了一张
                ) {
                    $('html').attr('emptyAttCode', 'ev-imgAtt1');
                    flaArr.push(1);
                    flaArr2.push(0);
                } else if (
                    $(eleme).find('.newUploadSuccess').length == 2 &&
                    !(isID2.test(_attCode) || isID1.test(_attCode))
                ) {// 上传了2张，但身份证号不符
                    $('html').attr('emptyAttCode', 'ev-imgAtt1');
                    flaArr.push(1);
                    flaArr2.push(0);
                } else if (
                    $(eleme).find('.newUploadSuccess').length == 2 &&
                    (isID2.test(_attCode) || isID1.test(_attCode))
                ) {// 上传了2张，并且身份证号相符
                    $('.al-authInfoSave').addClass('active');
                    if ($('html').attr('emptyAttCode') == 'ev-imgAtt1') {
                        $('html').removeAttr('emptyAttCode');
                    }
                    flaArr.push(1);
                    flaArr2.push(1);
                } else if (
                    (isID1.test(_attCode) || isID2.test(_attCode))	//传了身份证号，图片不全
                    && $(eleme).find('.newUploadSuccess').length != 2
                ) {
                    $('html').attr('emptyAttCode', 'ev-imgAtt1');
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
