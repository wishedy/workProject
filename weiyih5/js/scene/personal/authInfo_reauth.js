/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/11/11
 * @author: sunhaibin
 */

/**
 * 功能描述：  认证信息
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/25.
 */
$(function(){
    var
    authInfo={
        path:{
            getCustomerAuth:M_CALL+"customer/auth/getCustomerAuth/",//获取认证信息
            getDataRoleConfigs:M_CALL+"comm/data/roleconfig/getDataRoleConfigs/"//获取会员证件类型
        },
        init:function(){
            var t=this;
            this.digHole();
            this.authProcess();
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
                      g_sps.jump(null,'/pages/personal/authInfo.html');
                    }else{
                        t.getAuth();
                        t.changePlatform();
                        t.changeCompany();
                        t.changeMedicalTitle();

                        t.changeName();
                        t.save();
                    }
                }
            })
        },
        getAuth:function(){
            var t=this;
            var auth = JSON.parse(TempCache.getItem('auth'));
            if(!$.isEmptyObject(auth)){
                $("#trueName").attr('preVal',auth.lastName+auth.firstName).attr('nowVal',auth.lastName+auth.firstName);//text(auth.lastName+auth.firstName).
                if(auth.platformId==1){
                    $('#platform').text('骨科').attr({preVal:1,nowVal:1});
                }else if(auth.platformId==2){
                    $('#platform').text('手外科').attr({preVal:2,nowVal:2});
                }
                t.areaExpertise();
                $('#ev_changeName').val(comm.getStrLen((auth.lastName+auth.firstName),30));
                $('#ev_changeName').on('change input propertyChange',function(){
                    $("#trueName").attr('nowVal',$(this).val());
                }).on('focus',function(){
                    $(this).val($("#trueName").attr('nowVal'));
                }).on('blur',function(){
                    $(this).val( comm.getStrLen( $(this).val(),30) )
                });
                if(auth.company!=""){
                    $("#company").text(comm.getStrLen(auth.company,30)).attr({
                        preVal:auth.company,
                        companyId:auth.id,
                        company:auth.company,
                        before:1,               //变更前类型，1医院，2学校
                        beforeId:auth.id,        //变更前id
                        nowVal:auth.company
                    });
                }else{
                    $("#company").text(comm.getStrLen(auth.schoolName,30)).attr({
                        preVal:auth.schoolName,
                        companyId:auth.id,
                        school:auth.schoolName,
                        before:2,
                        beforeId:auth.id,
                        nowVal:auth.schoolName
                    });
                }
                $("#medicalTitle").text(comm.getStrLen(comm.cutLine(auth.medicalTitle,"_",","),30)).attr({
                    preVal:auth.medicalTitle,
                    before:auth.medicalTitle,
                    medicalTitle:auth.medicalTitle,
                    nowVal:auth.medicalTitle
                });
                $("#areasExpertise").text(comm.getStrLen(comm.cutLine(auth.areasExpertise,"_",","),30)).attr({
                    //preVal:comm.cutLine(auth.areasExpertise,"_",","),
                    preVal:auth.areasExpertise,
                    before:auth.areasExpertise,
                    areasExpertise:auth.areasExpertise,
                    nowVal:auth.areasExpertise
                });

                var area = auth.areasExpertise;
                var area1 = area ? area.split(",") : [];
                var areaIds = [];
                $.each(area1, function(i, val) {
                    if (val) {
                        if (val.split("_")[1]) {
                            areaIds.push(val.split("_")[0]);
                        }
                    }
                });
                $(".ev-areasCon figcaption").each(function(i, em) {
                    $.each(areaIds, function(j, val) {
                        if ($(em).attr("tagid") == val) {
                            $(em).parent().attr("select", "yes");
                            $(em).parent().addClass("selected");
                        }
                    });
                });
                //临床时间

                ymd({
                    year: $("#clinicalTime"),
                    month:$('#clinicalMonth'),
                    default1:1,
                    defaultVal:'请选择临床时间'
                });
                if(auth.clinicalYear){  //有临床时间 设置临床时间
                    gettime($("#clinicalTime"),auth.clinicalYear.substring(0,4),1);
                    gettime($("#clinicalMonth"),auth.clinicalYear.substring(5,7),1);
                    $("#clinicalTime").attr({preVal:auth.clinicalYear.substring(0,4),nowVal:auth.clinicalYear.substring(0,4)}).css('color','#333');
                    $("#clinicalMonth").attr({preVal:auth.clinicalYear.substring(5,7),nowVal:auth.clinicalYear.substring(5,7)}).css('color','#333');
                }else{  //默认提示
                    gettime($("#clinicalTime"),'请选择临床时间',1);
                    $("#clinicalTime").attr('preVal','请选择临床时间');
                    gettime($("#clinicalMonth"),'请选择临床时间',1);
                    $("#clinicalMonth").attr('preVal','请选择临床时间');
                }

                $("#clinicalTime,#clinicalMonth").on('change',function(){  //select选择赋值 校验可否提交
                    $(this).attr('nowVal',$("option:selected",this).val());
                    if($(this).val()=="请选择临床时间"){
                        $(this).css('color','#aaa');
                    } else {
                        $(this).css('color','#333');
                    }
                    t.checkSubmitState(t);
                });

            }
        },
        changeName:function(){
            var t=this;
            $('#ev_changeName').on('input propertychange blur',function(){
                //$('#trueName').text($.trim($(this).val()));
                t.checkSubmitState(t);
                //t.save();
            });
        },
        checkSubmitState:function($this){
            var t=this;
            $('.al-tableModuleItemInput a, select').each(function(){
                if($(this).attr('nowVal')=="请选择临床时间"){
                    return false;
                }
               if($(this).attr('nowVal')!=$(this).attr('preVal')&&$(this).attr('nowVal')!=""){
                   $('.ev_authChangeSave').parent().css('opacity',1);
                   $('.al-saveBtnBox').addClass('canSubmit');
                   return false;
               }else{
                   $('.ev_authChangeSave').parent().css('opacity',0.4);
                   $('.al-saveBtnBox').removeClass('canSubmit');

               }

            });

            $this.save();
        },
        changePlatform:function(){
            var t=this;
            $("#platform").parents("article").on("click", function() {
                $('#platFormSelect').addClass('on');
            });
            $('.ev_bone').on('click',function(){
                $('#platform').text($(this).text()).attr('nowVal',1);
                $('#platFormSelect').removeClass('on');
                t.checkSubmitState(t);
                t.areaExpertise();
            });
            $('.ev_hand').on('click',function(){
                $('#platform').text($(this).text()).attr('nowVal',2);
                $('#platFormSelect').removeClass('on');
                t.checkSubmitState(t);
                t.areaExpertise();
            });
            $('#ev-platformCancel').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'科室选择取消',
                    actionId:45
                });
                $('#platFormSelect').removeClass('on');
            });
        },
        changeMedicalTitle:function(){
            var t=this;
            $('.ev_changeMedicalTitle').click(function(){
                module.medicalTitle({
                    container:$('#medicalTitle'),
                    fn:function(){
                        t.checkSubmitState(t);
                    }
                });
                $(".al-selectorBarMask").addClass('on');
                var medical = $(this).find('a').attr('medicaltitle');
                var medical1 = medical ? medical.split(",") : [];
                var ids = [];
                $.each(medical1, function(i, val) {
                    if (val) {
                        if (val.split("_")[1]) {
                            ids.push(val.split("_")[0]);
                        }
                    }
                });
                $(".ev-medBox figcaption").each(function(i, em) {
                    $.each(ids, function(j, val) {
                        if ($(em).attr("medicalid") == val) {
                            $(em).parent().attr("select", "yes");
                            $(em).parent().addClass("selected");
                        }
                    });
                });
            });

        },
        changeCompany:function(){
            var t=this;
            $('.ev_changeCompany').on('click',function(){
                $('#backMask').addClass('on');
            });
            $('#EV-cancelSelect').on('click',function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'医院/学校选择取消',
                    actionId:45
                });
                $('#backMask').removeClass('on');
            });
            $('.ev_hospital').on('click',function(){

                $(".ev-mainInner").hide();
                $(".ev-companyInner").show();
                $(".ev-sProvince").show();
                $('#backMask').removeClass('on');
                module.addCompany({
                    container:$('#company'),
                    fn:function(){
                        t.checkSubmitState(t);
                        $('#company').attr('school',"");
                    }
                });
            });
            $('.ev_school').on('click',function(){
                $(".ev-mainInner").hide();
                $(".ev-schoolInner").show();
                $(".ev-schoolProvince").show();
                $('#backMask').removeClass('on');
                module.addSchool({
                    container:$('#company'),
                    fn:function(){
                        t.checkSubmitState(t);
                        $('#company').attr('company',"");
                    }
                });
            });
        },
        areaExpertise: function() {
            $(".ev_changeArea").on("click", function() {
                $(".ev-mainInner").hide();
                $(".ev-areaInner").show();
                Log.createBrowse(149,"专业选择页");
                $(".al-searchResult.expert").css("marginTop", "0");
            });
            $(".ev-goBack").on("click", function() {
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-areaInner").hide();
                }, 500);
            });

            this.getAreas();
        },
        //数据初始化
        getAreas: function() {
            var t = this;
            var html = "";
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            data.platformId=$('#platform').attr('nowVal');
            $.ajax({
                url:  M_CALL + "comm/data/tag/json_list/",
                data: data,
                dataType: "json",
                async: false,
                timeout: 10000,
                success: function(rep) {
                    if (rep && rep.responseObject.responseStatus) {
                        $.each(rep.responseObject.responseData.data_list, function(i, val) {
                            html += '<section class="al-selectorBarItem" select="no">' +
                                '<figure class="al-selectorBarItemIcon"></figure>' +
                                '<figcaption class="al-selectorBarItemName" tagid="' + val.id + '">' + val.tagName + '</figcaption>' +
                                '</section>';
                        });
                    }
                    $(".ev-areasCon").html(html);
                    t.selectTag();
                    t.saveAreaExp();
                }
            });
        },
        //数据的选择
        selectTag: function() {
            $.each($(".ev-areasCon section"), function(i, em) {
                $(em).on("click", function() {
                    if ($(em).attr("select") == "no") {
                        $(em).attr("select", "yes");
                        $(this).addClass("selected");
                    } else {
                        $(em).attr("select", "no");
                        $(this).removeClass("selected");
                    }
                });
            })
        },
        //保存专业领域
        saveAreaExp: function() {
            var t = this;
            $(".ev-areasSave").on("click", function() {
                var html = "";
                var str = "";
                $.each($(".ev-areasCon section"), function(i, em) {
                    if ($(em).attr("select") == "yes") {
                        html += $("figcaption", $(em)).text() + "，";
                        str += $("figcaption", $(em)).attr("tagid") + "_" + $("figcaption", $(em)).text() + ",";
                    }
                })
                $("#areasExpertise").text(comm.getStrLen(html.substring(0, html.length - 1),30));
                $("#areasExpertise").attr("areasExpertise", str.substring(0, str.length - 1)).attr("nowVal", str.substring(0, str.length - 1));
                if (html) {
                    $("#areasExpertise").css("color", "#333");
                } else {
                    $("#areasExpertise").css("color", "#aaa").text("请选择专业领域");
                }
                t.checkSubmitState(t);
                $(".ev-mainInner").show();
                $(".ev-areaInner").hide();
            });
        },
        save:function(){
            var t=this;
            $('.al-saveBtnBox').off('click').click(function(){
                if($(this).hasClass('canSubmit')&&!$(this).hasClass('ev-reauthing')){
                    $(this).addClass('ev-reauthing');
                    $.ajax({
                        url:M_CALL+"customer/auth_process/create/",
                        type:"post",
                        dataType:'json',
                        data:{paramJson:$.toJSON({
                            authId:TempCache.getItem('userId'),
                            customerId:TempCache.getItem('userId'),
                            authType:3,
                            state : 4,
                            updateFullName:$("#trueName").attr('nowVal'),
                            updateAreasExpertise:$('#areasExpertise').attr('areasExpertise'),
                            updateMedicalTitle:$('#medicalTitle').attr('medicalTitle'),
                            updateWorkplaceType:$('#company').attr('company')!=""?1:2,
                            updateWorkplaceId:$('#company').attr('companyId'),
                            updateWorkplace:$('#company').attr('company')||$('#company').attr('school'),
                            beforeFullName:$('#trueName').attr('default'),
                            beforeAreasExpertise:$('#areasExpertise').attr('before'),
                            beforeMedicalTitle:$('#medicalTitle').attr('before'),
                            beforeWorkplaceType:$('#company').attr('before'),
                            beforeWorkplaceId:$('#company').attr('beforeId'),
                            beforeWorkplace:$('#company').attr('default'),
                            beforePlatformId:$('#platform').attr('preVal'),
                            updatePlatformId:$('#platform').attr('nowVal'),
                            beforeClinicalYear:($('#clinicalTime').attr('preVal')=='请选择临床时间'?"0000":$('#clinicalTime').attr('preVal'))+'-'+($('#clinicalMonth').attr('preVal')=='请选择临床时间'?"00":$('#clinicalMonth').attr('preVal'))+"-01",
                            updateClinicalYear:$('#clinicalTime').attr('nowVal')+'-'+(($('#clinicalMonth').attr('nowVal')=="请选择临床时间"||!$('#clinicalMonth').attr('nowVal'))?"01":$('#clinicalMonth').attr('nowVal'))+"-01",
                        })},
                        success:function(){
                            comm.alertBox({
                                mTitle: "变更信息已提交",
                                title: "您的申请我们已收到,会尽快处理,处理后会以邮件或短信形式通知您。谢谢您对唯医的支持",
                                ensure: "知道了",
                                ensureCallback: function() {
                                    //history.back(-1);
                                    g_sps.jump(null,'/pages/personal/authInfo.html');
                                }
                            });
                        }
                    });
                }
                return false;
            });
        }
    };

    authInfo.init();
});

