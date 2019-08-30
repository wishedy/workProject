/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/4/21
 * @author: sunhaibin
 */
$(function(){
    //user.privExecute({
    //    operateType:"login",
    //    callback:function(){}
    //});
    //单位
    var company ={
        init:function(){
            var t=this;
            t.changeCompany();
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
                    wordLen:$(window).width()<700?24:30,
                    fn:function(){
                        checkFinish();
                        $('#company').attr({school:"",workplaceType:1});
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
                    wordLen:$(window).width()<700?24:30,
                    fn:function(){
                        checkFinish();
                        $('#company').attr({company:"",workplaceType:2});
                        t.type = 2;
                    }
                });
            });
        }

    };
    //职称
    var medTitle ={
        init:function(){
            this.changeMedicalTitle();
        },
        changeMedicalTitle:function(){
            var t=this;
            $('.ev_changeMedicalTitle').click(function(){
                module.medicalTitle({
                    container:$('#medicalTitle'),
                    wordLen:$(window).width()<700?26:34,
                    fn:function(){
                        checkFinish();
                    }
                });
                $(".al-selectorBarMask").addClass('on');
                var medical = $(this).find('a').attr('nowVal');
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

        }
    };
    //专业
    var expertise = {
        init:function(pId){ //pId  platformId
            var t=this;
            t.areaExpertise(pId);
        },
        areaExpertise: function(pId) {
            $(".ev_changeArea").on("click", function() {
                // Log.createBrowse(149,"专业选择页");
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId: 454})
                    }},2000);
                $(".ev-mainInner").hide();
                $(".ev-areaInner").show();

                $(".al-searchResult.expert").css("marginTop", "0");
            });
            $(".ev-goBack").on("click", function() {
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-areaInner").hide();
                }, 500);
            });
            this.getAreas(pId);
        },
        //数据初始化
        getAreas: function(pId) {
            var t = this;
            var html = "";
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            data.platformId=pId||1;
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
                    $(".ev-areasCon").html(html).attr('platformId',pId).show();
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
                });
                $("#areasExpertise").text(comm.getStrLen(html.substring(0, html.length - 1),$(window).width()<700?26:34));
                $("#areasExpertise").attr("areasExpertise", str.substring(0, str.length - 1)).attr("nowVal", str.substring(0, str.length - 1));
                if (html) {
                    $("#areasExpertise").css("color", "#333");
                } else {
                    $("#areasExpertise").css("color", "#aaa").text("请选择专业领域");
                }
                checkFinish();
                $(".ev-mainInner").show();
                $(".ev-areaInner,.ev_areasCon").hide();

            });
        }
    };
    //获取个人信息
    var getUserInfo={
        init:function(fn){
            var t=this;
            comm.loading.show();
            $.ajax({
                type : "post",
                url : M_CALL + "customer/unite/getMapById/",
                data : {paramJson: $.toJSON({customerId: TempCache.getItem('userId'),"logoUseFlag": UseFlag.d})},
                dataType : "json",
                async:false,
                success : function(rep) {
                    comm.loading.hide();
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                        if(rep.responseObject.responseData.data_list.length>0){
                            responseData=rep.responseObject.responseData.data_list[0];

                            var auth=responseData.customer_auth;
                            var baseInfo = responseData.customer_baseinfo;
                            //姓名
                            $('#fullName').val(auth.lastName+auth.firstName).blur();
                            //年龄

                            ymd({
                                year: $("#year01"),
                                month: $("#month01"),
                                default1:true
                            });
                            var birthday = auth.birthYear||baseInfo.birthday;
                            if(birthday&&!$.isEmptyObject(birthday)){
                                gettime($("#year01"), birthday.substring(0, 4),1);
                                gettime($("#month01"), birthday.substring(5, 7),1);
                            }
                            //临床时间
                            ymd({
                                year: $("#year02"),
                                month: $("#month02"),
                                default1:true
                            });
                            if(auth.clinicalYear){ //如果有临床时间，显示临床时间，没有显示 临床时间默认选中2010年6月
                                gettime($("#year02"),auth.clinicalYear.substring(0,4),1);
                                gettime($("#month02"), auth.clinicalYear.substring(5,7),1);
                            }else{
                                gettime($("#year02"), 2010,1);
                                gettime($("#month02"), 6,1);
                            }
                            //单位
                            $('#company').text(comm.getStrLen(auth.workplace,30))
                                .attr({
                                    workplaceType:auth.workplaceType,
                                    nowVal:auth.workplace,
                                    companyId:auth.id
                                });
                            //职称
                            if(auth.medicalTitle!=""){
                                $('#medicalTitle').text(comm.getStrLen(comm.cutLine(auth.medicalTitle,"_",","),30)).attr({nowVal:auth.medicalTitle});
                            }
                            //一级职称
                            var medIds = [1,2,3,4,10,11];
                            var mIds = auth.medicalTitle.match(/\d+/g)||[];    //10_医学生,6_副教授

                            $.each(mIds,function(mi,me){
                                $.each(medIds,function(mei,med){
                                    if(me==med){
                                        $('#medicalTitle').attr('medFirstClass',1);
                                        return false;
                                    }
                                });
                            });
                            //专业
                            if(auth.areasExpertiseShow){
                                $('#areasExpertise').text(comm.getStrLen(auth.areasExpertiseShow,30))
                                .attr({
                                        nowVal:auth.areasExpertise
                                    });
                            }
                            checkFinish();
                        }else{
                            ymd({
                                year: $("#year01"),
                                month: $("#month01"),
                                default1:true
                            });
                            ymd({
                                year: $("#year02"),
                                month: $("#month02"),
                                default1:true
                            });
                            //如果有临床时间，显示临床时间，没有显示 临床时间默认选中2010年6月
                            gettime($("#year02"), '2010',1);
                            gettime($("#month02"), '6',1);
                        }
                    }else{
                        ymd({
                            year: $("#year01"),
                            month: $("#month01"),
                            default1:true
                        });
                        ymd({
                            year: $("#year02"),
                            month: $("#month02"),
                            default1:true
                        });
                        //如果有临床时间，显示临床时间，没有显示 临床时间默认选中2010年6月
                        gettime($("#year02"), '2010',1);
                        gettime($("#month02"), '6',1);
                    }
                }
            });
        }
    };
    var index={
        init:function(){
            // window.onload = Log.createBrowse(69, '认证页面');
            window.onload = setTimeout(function(){
                if(g_sps) {
                    g_sps.createBrowse({pageId: 455})
                }},2000);
            var t = this;
            t.chooseDepartment();
            t.edit();
            t.backBtn();
            t.skipAuth();
            t.nextStepBtn();
            company.init();
            medTitle.init();
            getUserInfo.init();
        },
        edit:function(){
            $('#fullName').on('input propertychange blur',function(){
                checkFinish();
            });
            $('select').on('change',function(){
                checkFinish();
            });
        },
        backBtn:function(){
            $('.ev_authBackBtn').click(function(){
                var hash = location.hash;
                if(hash=='#thirdstep'){
                    $('.ev_authStep').hide().eq(1).show();
                }else if(hash=='#secondstep'){
                    $('.ev_authStep').hide().eq(0).show();
                }
                history.back();
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'认证返回',
                    actionId:41,
                    async:false
                });
            });
        },
        //暂不认证
        skipAuth:function(){
            $('.ev-skipAuth').on('click',copyAuthJS_notRenZheng_Fn);
            function copyAuthJS_notRenZheng_Fn(){
                comm.creatEvent({
                    triggerType:'认证',
                    keyword:"暂不认证",
                    actionId:26
                });
                TempCache.removeItem('autoplay');
                TempCache.removeItem('needAuth');
                TempCache.removeItem('needAuthRegist');
                var t = "/";
                var fromPage = TempCache.getItem("fromPage");
                if(fromPage!=undefined && fromPage!="" && fromPage!=null) {
                    t = fromPage;
                    if(fromPage.lastIndexOf("personal/personal_")>-1||fromPage.lastIndexOf("/sns.html")>-1){//从个人中心跳过来
                        t="/pages/personal/personal_index.html";
                    }
                    if(fromPage.lastIndexOf("message_")>-1){//从消息跳过来
                        t="/pages/message/message_main.html";
                    }
                    if(fromPage.lastIndexOf("/html/m/")>-1){//终端页暂不认证
                        t="/";
                    }
                    if(fromPage.indexOf('living_watch')>-1){//直播页不认证回首页
                        t = "//pages/live/livingList.html";
                    }
                    if(fromPage.indexOf('live.html')>-1||fromPage.indexOf('live-wrap.html')>-1){//会议直播页不认证
                        history.go(-2);
                    }

                }
                user.getSessionInfo();
                g_sps.jump(null, t);
            }
        },
        //选择科室
        chooseDepartment: function(){
            var t = this;
            $('.ev-chooseDepartment').on('click',function(){
                var _dept = $(this).data('dept');
                if(_dept==2){
                    comm.creatEvent({
                        triggerType:'认证-手外',
                        keyword:"认证-手外",
                        actionId:28
                    });
                }else{
                    comm.creatEvent({
                        triggerType:'认证-骨科',
                        keyword:"认证-骨科",
                        actionId:27
                    });
                }
                t.platformId = _dept;
                if(_dept != $(".ev-areasCon").attr('platformId')){  //避免重复取 “专业” 数据
                    expertise.init(_dept);
                }
                $('.ev_authStep').hide();
                $('.ev_authStepTwo').show();
                location.hash = "#secondstep";
            });
        },
        nextStepBtn:function(){
            var t = this;
            $('.ev_authNextStep').on('click',function(){
                //下一步
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'下一步',
                    actionId:44
                });
                if($(this).hasClass('active')){
                    if($('#czyx1').length==0){
                        t.loadCertificate();
                        t.bindUpload();
                    }
                    $('.ev_authStepTwo').hide();
                    $('.ev_authStepThree').show();
                    location.hash = "#thirdstep";
                }
            });

        },
        //加载证书项
        loadCertificate:function(){
            var t = this;
            var param={roleId:6,typeId:1};
            $.ajax({
                type: 'POST',
                url: commdata.urlList.getDataRoleConfigs.url,
                data:{paramJson:$.toJSON(param)},
                async: false,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    var html="";
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        var data=rep.responseObject.responseMessage;
                        if(data && data.length>1){
                            $.each(data,function(index,i){
                                if(i.refId!=1&&i.refId!=13){
                                    html+= ' <section class="al-selectorBarItem ev_selectItem">'+
                                        '     <figure class="al-selectorBarItemIcon"></figure>'+
                                        '    <figcaption class="al-selectorBarItemName" certId="'+i.refId+'">'+i.refValue+'</figcaption>'+
                                        '</section>';
                                }

                            });

                        }
                    }
                    $(".ev-certsCon").html(html);
                    $('.ev_selectItem').off('click').click(function(){
                        var certId = $(this).find('figcaption').attr('certId');
                        $(this).addClass('selected').siblings().removeClass('selected');
                        $('.ev_certName').text($.trim($(this).text()));
                        $('.ev_certType i').addClass('down');
                        $('.ev_certType').attr('selectCert',certId);
                        $(".ev-certsCon").hide();
                        $('.authTypedetail,.ev_authSubmitBtn').show();
                        if(certId==10){
                            $('.ev_certShowTip').show();
                            $('input[name=attCode]').hide();
                        }else{
                            $('.ev_certShowTip').hide();
                            $('input[name=attCode]').show();
                        }
                    });
                    $('.ev_certType').off('click').click(function(){
                        if($(this).attr('selectCert')){
                            if($(this).find('i').hasClass('down')){
                                $(this).find('i').removeClass('down');
                                $(".ev-certsCon").show();
                                $('.authTypedetail,.ev_authSubmitBtn').hide();
                            }else{
                                $('.ev_certType i').addClass('down');
                                $(".ev-certsCon").hide();
                                $('.authTypedetail,.ev_authSubmitBtn').show();
                            }
                        }
                    });
                }
            });
        },
        //绑定上传图片
        bindUpload: function () {
            var t = this;
            if($("#uploadPicBtn [id^=czyx]").length>0){
                $("#uploadPicBtn").html('<input type="file"    id="file1" name="file" data-role="none" />');
            }

            var paramJson=$.toJSON({imageType:"2"});
            czyx.uploadReplace('#file1',{
                url:"/mcall/comm/upload_attachment/upload/", //文件处理的URL,
                data:{paramJson:paramJson},
                uploadReplaceCss:{
                    //设置上传按钮图片
                    background:'transparent',
                    width:"100%",             //上传按钮的宽度
                    height:"100%",              //上传按钮的高度
                    zIndex:1
                },
                uploadInputCss:{
                    width:"100%",             //上传按钮的宽度
                    height:"100%",             //上传按钮的高度
                    zIndex:2
                },
                uploadBefore:function(){
                    //校验必填项
                    if(!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(png)|(PNG))$/i.test(this.value)){
                        popup('只允许上传.jpg .jpeg .png类型的图片文件');
                        return false ;
                    }
                    var fileSize =comm.getFileSize(document.getElementById("file1"));
                    if(fileSize>5242880){
                        popup('图片不能大于'+5242880/1048576+"M");
                        return false;
                    }

                },
                uploadEnd:function(serverJson){//上传完毕后调用
                    try{
                        serverJson = $.parseJSON($(serverJson).html());
                        if(serverJson.responseObject.responseStatus) {
                            popup("证件上传成功");    // serverJson.responseObject.responseMessage.url
                            $('.ev_loadedPic').attr('src',serverJson.responseObject.responseMessage.url);
                            $('.ev_loadedPic').siblings('i,span').hide();
                            $('.ev_authSubmitBtn').addClass('active').click(function(){
                                t.submit();
                            });
                        }else{
                            popup(serverJson.responseObject.responseMessage);
                        }
                    }catch(e){
                        popup('上传失败');
                        return ;
                    }
                }
            });
        },
        //提交认证
        submit:function(){
            var t = this;
            var compType = $('#company').attr('workplaceType');             //单位类型
            var compVal = $('#company').attr('nowVal');                     //单位名称
            var compId = $('#company').attr('companyId');                   //单位号码
            var birthYear = $('#year01').val();                             //出生年月日
            var birthMonth = $('#month01').val();
            var birthDay = "01";
            var param = {
                customerId:TempCache.getItem('userId'),
                fullName:$('#fullName').val(),
                //lastName: $("input[name=lastName]").val(),
                //firstName: $('#fullName').val(),
                birthYear:birthYear+"-"+birthMonth+'-'+birthDay,
                attType:$(".ev_certType").attr('selectCert'),
                attPath:$('.ev_loadedPic').attr('src'),
                attCode:$("input[name=attCode]").val(),
                company:compType==1?compVal:"",
                companyId:compType==1?compId:"",
                schoolName:compType==2?compVal:"",
                schoolId:compType==2?compId:"",
                medicalTitle:$('#medicalTitle').attr('nowVal'),                 //职称
                areasExpertise: $('#areasExpertise').attr('nowVal'),            //专业
                platformId:t.platformId,                            //科室
                clinicalYear:$('#year02').val()+'-'+$('#month02').val()+'-01'
            };
            t.isSubmiting = true;
            var rst = customer.execute("createAuth",param);
            t.isSubmiting = false;
            if(rst.responseStatus){
                user.getSessionInfo();
                var isFollow=location.search.indexOf('isFollow')>-1;    //有
                var name=$('#fullName').val();
                var flag=comm.getpara().flag;
                TempCache.setItem("department", t.platformId);
                if(isFollow){
                    comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+t.platformId,0);
                }else{
                    if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
                        if(comm.getpara().reAuth){//认证已拒绝，重新认证
                            comm.alertBox({
                                "title":"我们已经收到您的认证资料，审核周期为3-5个工作日，请耐心等待！谢谢您的配合 ",
                                "ensure":"知道了",
                                ensureCallback:function(){
                                    user.success();
                                }
                            });
                        }else {
                            user.success("已提交认证，请等待审核！");
                        }
                    }else{

                        if(TempCache.getItem('needAuthRegist')=="need"){//需要认证并认证成功
                            TempCache.setItem('needAuthCompleted','needAuthCompleted');
                        }
                        user.success("认证成功，即将返回来源页");
                    }

                }


            }else{
                if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
                    popup("已提交认证，请等待审核！");
                    user.success();
                }else{
                    popup(rst.responseMessage);
                    user.success();
                }
            }
        }
    };
    function checkFinish(){
        var fullName = $('#fullName').val();    //姓名
        var _isValidName = /^[\u4e00-\u9fa5]{1,25}$/.test(fullName)||/^[A-Za-z·.]{1,50}$/.test(fullName);
        var birthYear = $('#year01').val();     //出生年，月，
        var birthMonth = $('#month01').val();
        var clinicalYear = $('#year02').val();      //临床时间年,月
        var clinicalMonth = $('#month02').val();
        var companyVal = $('#company').attr('nowVal');
        var medTitleVal = $('#medicalTitle').text();
        var medFirstClass = $('#medicalTitle').attr('medFirstClass')==1;//一级职称
        var areasVal = $('#areasExpertise').text();
        if(fullName&&_isValidName&& birthYear && birthMonth && clinicalYear && clinicalMonth && companyVal && medTitleVal && medFirstClass && areasVal){
            $('.ev_authNextStep').addClass('active');
        }else{
            $('.ev_authNextStep').removeClass('active');
        }
    }
    index.init();
});
