/**
 * 功能描述：  认证信息
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/25.
 */
$(function(){
    var authInfo={};
    authInfo={
        path:{
            getCustomerAuth:M_CALL+"customer/auth/getCustomerAuth/",//获取认证信息
            getDataRoleConfigs:M_CALL+"comm/data/roleconfig/getDataRoleConfigs/",//获取会员证件类型
            getAuthAttachments: M_CALL+"customer/auth/getAuthAttachments/",//获取认证附件
            upload:M_CALL+"comm/upload_attachment/upload/",//上传图片
            creatAuth:M_CALL+"customer/auth_attachment/createAuthAttachment/"
        },
        init:function(){
            this.getAuth();
            this.getRole();
            this.authProcess();
            this.digHole();
            this.customerRole();

        },
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        getAuth:function(){
            var t=this;
            var localAuth = JSON.parse(TempCache.getItem('auth'));
            if(!$.isEmptyObject(localAuth)){
                $("#trueName").text(comm.getStrLen((localAuth.lastName+localAuth.firstName),30));
                if(localAuth.platformId==1){
                    $('#platform').text('骨科').attr('platformId',1);
                }else if(localAuth.platformId==2){
                    $('#platform').text('手外科').attr('platformId',2);
                }
                if(localAuth.company!=""){
                    $("#company").text(comm.getStrLen(localAuth.company,30));
                }else{
                    $("#company").text(comm.getStrLen(localAuth.schoolName,30));
                }
                $("#medicalTitle").text(comm.getStrLen(comm.cutLine(localAuth.medicalTitle,"_",","),30));
                $("#areasExpertise").text(comm.getStrLen(comm.cutLine(localAuth.areasExpertise,"_",","),30));
                $('.ev_clinicalDate').text(localAuth.clinicalYear.substring(0,7));
                if(localAuth.state==0){
                    $('.al-applyBtn').css({color:"#c5c5c5",borderColor:"#c5c5c5"}).click(function(){
                        return false;
                    });
                }

            }
        },
        customerRole:function(){
            if(TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==4){   // 厂商无此修改权限 0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师
                $('.al-applyBtn').click(function(){
                    popup('该用户没有操作权限');
                    $(this).css({color:"#c5c5c5",borderColor:"#c5c5c5"}).attr('href','javascript:;').off('click');
                    return false;
                });
            }
        },
        authProcess:function(){
            var t=this;
            $.ajax({
                url:M_CALL+"customer/auth_process/getMapList/",
                type:"post",
                data:{
                    paramJson:$.toJSON({
                        customerId:TempCache.getItem('userId'),
                        state:4,
                        sortType:1,
                        isValid	:1,
                        authType:3
                    })
                },
                dataType:'json',
                success:function(res){
                    if(res&&res.responseObject&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)){
                        $('.al-applyBtn').css({color:"#c5c5c5",borderColor:"#c5c5c5"}).click(function(){
                            return false;
                        });
                    }
                }
            })
        },
        getRole:function(){
            var t=this;
            var data={siteId:'2',roleId:'6',typeId:'1'};
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getDataRoleConfigs,
                data : param,
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseMessage){
                        var html="";
                        $.each(rep.responseObject.responseMessage,function(i,val){
                            var attCode="";
                            if(val.refId!=10){
                                attCode='<figure class="al-tableModuleItemInput ev-attCodePar01">'+
                                '<input class="ev-attCode01" type="text" placeholder="请输入证件号">'+
                                '</figure>'+
                                '<figure class="al-tableModuleItemInput ev-attCodePar02" style="display: none">'+
                                '<a href="javascript:void(0)" class="al-selectTitle al-searchResult ev-attCode02" style="color: #aaa;"></a>'+
                                '</figure>'
                            }
                            if(val.refId!=1&&val.refId!=8&&val.refId!=6) {
                                html += '<article class="al-tableModuleItem ev-attCon ev-attEmpty" refid="' + val.refId + '" attCodeError="请填写' + val.refValue + '号" attPathError="请上传' + val.refValue + '照">' +
                                    '<h3>' + val.refValue + '</h3>' +
                                    attCode +
                                    '<figure class="al-tableModuleUploadImg">' +
                                    '<p class="al_uploadAttTip">添加照片</p>' +
                                    '<img class="al-uploadTipsPic ev-attPath" id="_" attType='+val.refId+' attCode="_" attPositionType=1 src="//img50.allinmd.cn/pages/personal/img_upload.png">' +
                                    '<input type="file" name="file" refid="' + val.refId + '" class="ev-attFile" id="attFile_' + val.refId + '">' +
                                    '</figure>' +
                                    '</article>';
                            }else if(val.refId==1||val.refId==8||val.refId==6){//身份证1，医师执业证8，医师资格证（6）传2张
                                html += '<article class="al-tableModuleItem ev-attCon ev-attEmpty" refid="' + val.refId + '" attCodeError="请填写' + val.refValue + '号" attPathError="请上传' + val.refValue + '照">' +
                                    '<h3>' + val.refValue + '</h3>' +
                                    attCode +
                                    '<figure class="al-tableModuleUploadImg">' +
                                    '<p class="al_uploadAttTip">'+(val.refId==1?"添加正面":"添加第一页")+'</p>' +
                                    '<img class="al-uploadTipsPic ev-attPath '+(val.refId==1?"idCardPic":"")+'" id="_" attType='+val.refId+' attCode="_" attPositionType=1  src="//img50.allinmd.cn/pages/personal/img_upload.png">' +
                                    '<input type="file" name="file" refid="' + val.refId + '" class="ev-attFile" id="attFile_' + val.refId + '_1">' +
                                    '</figure>' +
                                    '<figure class="al-tableModuleUploadImg  al-tableModuleUploadImgSecond">' +
                                    '<p class="al_uploadAttTip">'+(val.refId==1?"添加反面":"添加第二页")+'</p>' +
                                    '<img class="al-uploadTipsPic ev-attPath '+(val.refId==1?"idCardPic":"")+'" id="_" attType='+val.refId+' attCode="_" attPositionType=2  src="//img50.allinmd.cn/pages/personal/img_upload.png">' +
                                    '<input type="file" name="file" refid="' + val.refId + '" class="ev-attFile" id="attFile_' + val.refId + '_2">' +
                                    '</figure>' +
                                    '</article>';
                            }
                        });

                        $.ajax({
                            url: t.path.getAuthAttachments,
                            data:{"dataFlag":2},
                            type:"get",
                            dataType:"json",
                            success:function(rep){
                                $(".ev-authList").html(html);
                                t.inputEvent();
                                t.save();
                                if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                                    $.each($(".ev-attCon"),function(i,em){
                                        t.uploadFile($(em).find(".ev-attFile"));
                                        $.each(rep.responseObject.responseData.data_list,function(j,val){
                                            if(val.attType==1||val.attType==6||val.attType==8){
                                                if($(em).attr("refid")==val.attType){
                                                    $(em).find('.ev-attPath[attPositionType='+val.attPositionType+']').siblings('.al_uploadAttTip').remove();
                                                    if(val.attCode){
                                                        $(em).find(".ev-attCodePar01").remove();
                                                        $(em).find(".ev-attCodePar02").show();
                                                        $(em).find('.ev-attPath').attr('attCode',val.attCode);
                                                    }
                                                    $(em).find(".ev-attCode02").text(val.attCode);

                                                    var att_path=$(em).find(".ev-attPath");
                                                    if(val.attPath){
                                                        $(em).find('.ev-attPath[attPositionType='+val.attPositionType+']').attr('src',val.attPath);
                                                        $(em).find('.ev-attPath[attPositionType='+val.attPositionType+']').attr('id',val.id);
                                                        $(em).find('.ev-attPath[attPositionType='+val.attPositionType+']').parents('.al-tableModuleUploadImg').find('.ev-attFile').remove();
                                                        $(em).find('.ev-attPath[attPositionType='+val.attPositionType+']').addClass("al-uploadSuccessPic").removeClass("al-uploadTipsPic");

                                                    }
                                                    if($(em).find('al-uploadSuccessPic').length==2){
                                                        $(em).removeClass('ev-attEmpty');
                                                    }

                                                }
                                            }else{
                                                if($(em).attr("refid")==val.attType){
                                                    $(em).find(".ev-attCodePar01,.al_uploadAttTip").remove();
                                                    $(em).find(".ev-attCodePar02").show();
                                                    $(em).find(".ev-attCode02").text(val.attCode);
                                                    $(em).removeClass('ev-attEmpty');
                                                    var att_path=$(em).find(".ev-attPath");
                                                    if(val.attPath){
                                                        att_path.addClass("al-uploadSuccessPic").removeClass("al-uploadTipsPic");
                                                        att_path.attr("src",val.attPath);
                                                        $(em).find(".ev-attFile").remove();
                                                    }
                                                }
                                            }

                                        });
                                        if($('.ev-attEmpty').length==0){
                                            $(".ev-save").off('click').parent().addClass('al-qualificationSubmitNone').removeClass('al-qualificationSubmit');
                                        }
                                    });
                                }
                            }
                        });
                    }
                },
                error:function(){}
            });
        },
        inputEvent:function(){
            var val = '';
            $('.ev-attCode01').on('input propertyChange',function(){
                val = $(this).val();
                if(val) {
                    $(this).parents('.ev-attCon').find('.ev-attPath').attr('attCode', val);
                }else{
                    $(this).parents('.ev-attCon').find('.ev-attPath').attr('attCode', '_');
                }
            });
        },
        //上传事件绑定
        uploadFile:function(obj){
            var t=this;
            //var att_path=obj.siblings('.ev-attPath');
            obj.bind("change",function(){
                var self = $(this);
                var att_path = self.siblings('.ev-attPath');
                var att_tip = self.siblings('.al_uploadAttTip');
                var id=$(this).attr("id");
                if(!/\.((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test($(this).val())){
                    popup('只允许上传.jpg .jpeg .png类型的图片文件');
                    $(this).val("");
                    return false ;
                }
                var fileSize = comm.getFileSize(document.getElementById(id));
                if (fileSize > 5* 1048* 1048576) {
                    popup("超过5M大小，无法上传");
                    $(this).val("");
                    return false;
                }
                comm.loading.show();
                $.ajaxFileUpload({
                    type: 'POST',
                    url: t.path.upload,
                    data:{paramJson: '{imageType:2}'},
                    secureuri: false,
                    fileElementId: id,//file控件id
                    dataType: '',
                    success: function (data, status) {
                        var dataJSON = eval("(" + data.body.innerText + ")");
                        var url=dataJSON.responseObject.responseMessage.url;
                        var path=dataJSON.responseObject.responseMessage.path;
                        if (dataJSON.responseObject.responseStatus) {
                            comm.loading.hide();
                            att_path.attr("attPath",path);
                            att_path.addClass("al-uploadSuccessPic newUploadSuccess").removeClass("al-uploadTipsPic");
                            att_path.parent().find('.ev-attFile').remove();
                            att_path.attr("src",url);
                            att_tip.hide();
                        } else {
                            popup("上传失败");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        popup("上传失败");
                    },
                    complete: function(xmlHttpRequest) {
                        //t.uploadFile(obj);
                    }
                });
            })
        },
        save:function() {
            var t = this;
            var isID1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,//身份证校验
                isID2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/gi;
            $(".ev-save").attr("on", "true");
            if ($('.ev-attEmpty').length > 0) {
                $(".ev-save").on("click", function () {
                    var hasInfoToSave='';
                    $.each($('.ev-attEmpty input[type=text]'),function(index,ele){
                        hasInfoToSave+=$(ele).val();
                    });
                    if($('.ev-attEmpty .al-uploadSuccessPic').length==0){//hasInfoToSave==""&&
                        popup('请您添写信息后再点击保存');
                        return false;
                    }else{

                        if ($(this).attr("on") == "true") {
                            isSuccess = true;
                            if($('.newUploadSuccess').length==0){
                                popup('请您上传图片后再点击保存');
                                isSuccess = false;
                                return false;
                            }
                            var attPath = "";
                            var attCode = "";
                            var attType = "";
                            var attPositionType="";
                            var id = "";
                            var customerId = "";
                            var cid = TempCache.getItem('userId');
                            var idCorrect  = true;
                            $.each($('.newUploadSuccess'),function(i,em){
                                if($(em).hasClass('idCardPic')){
                                    var idCode = $(em).attr('attCode');
                                    if(!isID1.test(idCode)&&!isID2.test(idCode)&&idCode!="_"){

                                        idCorrect = false;
                                    }
                                }
                                if($(em).attr('attPath')){
                                    attPath += $(em).attr('attPath')+',';
                                    attCode += $(em).attr('attCode')+',';
                                    attType += $(em).attr('attType')+',';
                                    attPositionType += $(em).attr('attPositionType')+",";
                                    if($(em).attr('id')){
                                        id += $(em).attr('id')+',';
                                    }

                                    customerId += cid+',';
                                }
                            });
                            if(!idCorrect){
                                popup('请您添写正确的身份证号');
                                return false;
                            }
                            attPath = attPath.substring(0,attPath.length-1);
                            attCode = attCode.substring(0,attCode.length-1);
                            attType = attType.substring(0,attType.length-1);
                            attPositionType = attPositionType.substring(0,attPositionType.length-1);
                            id = id.substring(0,id.length-1);
                            customerId = customerId.substring(0,customerId.length-1);

                            //可以提交
                            if (isSuccess) {
                                comm.loading.show();
                                $(this).attr("on", "false");
                                var data = {
                                    id:id,
                                    attCode:attCode,
                                    attPath:attPath,
                                    attType:attType,
                                    visitSiteId:2,
                                    customerId:customerId,
                                    attPositionType:attPositionType
                                };
                                var param = {};
                                param.paramJson = $.toJSON(data);
                                $.ajax({
                                    type: "post",
                                    url: t.path.creatAuth,
                                    data: param,
                                    dataType: "json",
                                    success: function (rep) {
                                        comm.loading.hide();
                                        $(".ev-save").attr("on", "true");
                                        if (rep.responseObject.responseStatus) {
                                            popup("认证信息保存成功");

                                            $.each($('.ev-attCon'),function(em,el){
                                                var _attCode = $(el).find('.ev-attPath').eq(0).attr('attCode');
                                                if(_attCode!="_"){//如果有证件号
                                                    $(el).find('.ev-attCodePar01').remove();
                                                    $(el).find('.ev-attCodePar02').html(_attCode).show().css('color','#aaa');
                                                }else {//没有证件号
                                                    if ($(el).find('.ev-attPath').length == 2 && $(el).find('al-uploadSuccessPic').length == 2) {//如果要上传2张图片的证件
                                                        $(el).find('.ev-attCodePar01').remove();
                                                        $(el).removeClass('ev-attEmpty');
                                                    }else if($(el).find('.ev-attPath').length == 1&&$(el).find('al-uploadSuccessPic').length == 1){//一张图片的证件 不能再上传编号
                                                        $(el).find('.ev-attCodePar01').remove();
                                                        $(el).removeClass('ev-attEmpty');
                                                    }
                                                }
                                            });
                                            $('.ev-attPath').removeClass('newUploadSuccess');

                                        } else {
                                            popup("认证信息保存失败请稍后重试");
                                        }
                                        if ($('.ev-attEmpty').length == 0) {
                                            $(".ev-save").off('click').parent().addClass('al-qualificationSubmitNone').removeClass('al-qualificationSubmit');
                                        }
                                    },
                                    error: function () {
                                        comm.loading.hide();
                                        $(".ev-save").attr("on", "true");
                                    }
                                });
                            }

                        }
                    }

                })
            }else{
                $(".ev-save").off('click').parent().addClass('al-qualificationSubmitNone').removeClass('al-qualificationSubmit');
            }
        }
    };

    authInfo.init();
});

