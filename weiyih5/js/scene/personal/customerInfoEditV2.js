/**
 * 功能描述：  资料编辑
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/15.
 */
$(function() {
    //user.privLogin(); //未登录跳转
    var expertise = {
        init: function () {
            var t = this;
            t.data = [];
            t.areaExpertise();
        },
        areasExpertiseShow:{'1':'','2':''},
        areaExpertise: function () {
            var t = this;
            $(".ev_changeArea").on("click", function () {
                // Log.createBrowse(10013, "认证-选择专科");
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId: 448})
                    }},2000);
                //专科选择时 如果已有专科数据与当前相同不请求，否则重新请求数据
                if ($('.ev_changeArea').attr('pId') != $('input[name=platformId]').val()) {
                    t.getAreas($('input[name=platformId]').val());
                }
                var area = $('#areasExpertise').attr('nowVal');
                var area1 = area ? area.split(",") : [];
                var areaIds = [];
                $.each(area1, function (i, val) {
                    if (val) {
                        if (val.split("_")[1]) {
                            areaIds.push(val.split("_")[0]);
                        }
                    }
                });
                $(".ev-areasCon figcaption").each(function (i, em) {
                    $.each(areaIds, function (j, val) {
                        if ($(em).attr("tagid") == val) {
                            $(em).parent().attr("select", "yes");
                            $(em).parent().addClass("selected");
                        }
                    });
                });
                $(".ev-mainInner").hide();
                $(".ev-areaInner").show();
                $(".al-searchResult.expert").css("marginTop", "0");
                /*点击专科进入选择列表时保存按钮的状态*/
                $('.al-selectorBarItem').each(function () {
                    if ($(this).attr('select') == 'yes') {
                        $('.ev-areasSave').addClass('focus')
                    } else {

                    }
                })
            });
            $(".ev-goBack").on("click", function () {
                setTimeout(function () {
                    $(".ev-mainInner").show();
                    $(".ev-areaInner").hide();
                    $('.ev-areasCon .al-selectorBarItem').removeClass('selected').removeAttr('select');
                }, 500);
            });

        },
        //数据初始化
        getAreas: function (pId) {
            var t = this;
            var html = "";
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            data.platformId = pId || 1;
            $('.ev_changeArea').attr('pId', pId);
            var callback = function (rep) {
                if (rep && rep.responseObject.responseStatus) {
                    $.each(rep.responseObject.responseData.data_list, function (i, val) {
                        html += '<section class="al-selectorBarItem" select="no">' +
                            '<figure class="al-selectorBarItemIcon"></figure>' +
                            '<figcaption class="al-selectorBarItemName" tagid="' + val.id + '">' + val.tagName + '</figcaption>' +
                            '</section>';
                    });
                    if (pId == 1) {
                        t.data[1] = rep;
                    } else {
                        t.data[2] = rep;
                    }
                }
                $(".ev-areasCon").html(html).attr('platformId', pId).show();
                t.selectTag();
                t.saveAreaExp(data.platformId);
            };
            if (!t.data[pId]) {
                $.ajax({
                    url: M_CALL + "comm/data/tag/json_list/",
                    data: data,
                    dataType: "json",
                    async: false,
                    timeout: 10000,
                    success: function (rep) {
                        callback(rep);
                    }
                });
            } else {
                callback(t.data[pId]);
            }


        },
        //数据的选择
        selectTag: function () {
            var t = this;
            $.each($(".ev-areasCon section"), function (i, em) {
                $(em).on("click", function () {
                    if ($(em).attr("select") == "no") {
                        $(em).attr("select", "yes");
                        $(this).addClass("selected");
                    } else {
                        $(em).attr("select", "no");
                        $(this).removeClass("selected");
                    }
                    /*点击专科列表时保存按钮的状态*/

                    var sign = 0;
                    $(".ev-areasCon section").each(function (i, e) {
                        if ($(e).attr("select") == "yes") {
                            sign = 1
                        }
                    })
                    if (sign === 1) {
                        $('.ev-areasSave').addClass('focus')
                    } else {
                        $('.ev-areasSave').removeClass('focus')
                    }
                    //t.saveAreaExp(1);
                });
            })
        },
        //保存专业领域
        saveAreaExp: function (pId) {
            var t = this;
            $(".ev-areasSave").on("click", function () {
                if ($(this).hasClass('focus')) {
                    var html = "";
                    var str = "";
                    $.each($(".ev-areasCon section"), function (i, em) {
                        if ($(em).attr("select") == "yes") {
                            html += $("figcaption", $(em)).text() + "、";
                            str += $("figcaption", $(em)).attr("tagid") + "_" + $("figcaption", $(em)).text() + ",";
                        }
                    });
                    $("#areasExpertise").text(comm.getStrLen(html.substring(0, html.length - 1), $(window).width() < 760 ? 26 : 30));
                    $("#areasExpertise").attr({
                        areasExpertise: str.substring(0, str.length - 1),
                        nowVal: str.substring(0, str.length - 1),
                        pId: pId
                    });
                    if (html) {
                        $("#areasExpertise").css("color", "#333");
                    } else {
                        $("#areasExpertise").css("color", "#B4B4B4").text("请选择专科");
                    }
                    //checkFinish();
                    $(".ev-mainInner").show();
                    $(".ev-areaInner,.ev_areasCon").hide();
                }


            });
        }
    };
    var professional = {
        init:function(type){
            var platFormList = $(".professionalSelect .al-radio-item");
            platFormList.eq((parseInt(type)-1)).addClass("al-radio-active").siblings().removeClass('al-radio-active');

            platFormList.off("click").on("click",function(){
               var t = $(this);
                if($('.al-radio-active').index()!=t.index()){
                    if(t.index()==0){
                        expertise.areasExpertiseShow['2'] = $("#areasExpertise").attr("nowval");
                    }else{
                        expertise.areasExpertiseShow['1'] = $("#areasExpertise").attr("nowval");
                    }
                    var newPlatForm = t.index()+1;
                    if (expertise.areasExpertiseShow[''+newPlatForm]) {
                        var str= '';
                        var arrList = expertise.areasExpertiseShow[''+newPlatForm].split(',');
                        $.each(arrList,function(index,value){
                            var newVal = '';
                            if(value){
                                newVal = value.split('_');
                            }
                            if(str.length==0){
                                str+=newVal[1];
                            }else{
                                str+=","+newVal[1];
                            }
                        });
                        $('#areasExpertise').text(comm.getStrLen(str, $(window).width() < 760 ? 26 : 30))
                            .attr({
                                nowVal: expertise.areasExpertiseShow[''+newPlatForm],
                                preVal: expertise.areasExpertiseShow[''+newPlatForm],
                                pId: newPlatForm
                            })
                            .removeClass('placeHolderColor');
                    }else{
                        $("#areasExpertise").html('请选择专科').attr({"nowval":''}).addClass('placeHolderColor');
                    }
                    t.addClass('al-radio-active').siblings().removeClass('al-radio-active');
                    $('input[name=platformId]').val(t.index()+1);
                    $(".al-selectorBarList.ev-areasCon").attr({"platformid":newPlatForm});
                }

            });
        }
    }
    var customerInfoEdit = {
        ele:{
            input:$(".inputBorder input"),
            sicknessStr :"",    //保存疾病数据
            surgeryStr:"",      //保存手术数据
            data:"",            //保存简介内容
            areasExpertise:"",  //擅长手术保存回传的id
            operationList:[],   //选中手术id项
            addressId:'',       //获取地址ID ,""或者是当前参数
            dataList:[],        //擅长疾病上面的ID值
            searchList:[]       //擅长疾病下面的ID值
        },
        data:{
            platformId:1,
            operationList:[]
        },
        path: {
            getBigLogo:M_CALL + "comm/data/logourl/getMapById/",//获取头像·
            logoUpload:M_CALL+"comm/upload_attachment/upload/",//上传图片·
            getInfo:'/mcall/customer/auth/getCustomerBaseinfo/',//获取个人信息·
            getInitSurgeryFirst:'/mcall/comm/data/specialty/baseinfo/getMapList/',//获取擅长手术1级·
            getInitSurgerySecond:'/mcall/comm/data/specialty/operation/getMapList/',  //获取手术2级，3级·
            bindTextChange:'/mcall/comm/data/illness/getMapList/',   //搜搜疾病
            updateInfo:'/mcall/customer/auth/updateBaseinfo/',  //保存信息·
            occList: M_CALL + "customer/occupation/json_list/", //工作经历·
            eduList: M_CALL + "customer/education/json_list/", //教育背景·
            cEduList: M_CALL + "customer/continue/education/json_list/", //继续教育·
            honorList: M_CALL + "customer/honor/json_list/", //获得荣誉·
            fundList: M_CALL + "customer/fund/json_list/", //科研基金·
            socialList: M_CALL + "customer/social/json_list/", //社会任职·
            opusList: M_CALL + "customer/opus/json_list/", //学术专著·
            patentList: M_CALL + "customer/patent/json_list/",  //发明专利·
            newLogoUpload:M_CALL +"comm/upload_attachment/uploadLogo/",//新上传图片

        },
        init: function() {
            this.cid=TempCache.getItem("userId");
            this.customerId = TempCache.getItem("userId");
            this.digHole(); //埋点
            this.updataLogo(); //上传头像
            this.getInfo(); //获取头像-临床时间-擅长疾病-擅长手术-个人简介-通讯地址
            this.getInitSurgeryFirst();  //获取手术专科列表1级 → 2级、3级 q
            this.bindTextChange();    //搜索病例
            //工作start
            this.getOccupation();
            this.getEducation();
            this.getcEdu();
            this.getHonor();
            this.getFund();
            this.getSocial();
            this.getOpus();
            this.getPatent();
            //专利end
            // this.sickness();  //编辑疾病
            // this.surgery();   //编辑手术
            // this.editSummary();  //编辑个人签名
            this.editAddress();  //编辑通讯地址
            // this.department();//科室
        },
        //埋点
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
        //获取大图
        getBigLogo:function(){
            var t=this;
            var data={};
            data.refId=t.cid;
            data.logoType=10;
            data.logoUseFlag=2;
            data.visitSiteId=2;
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getBigLogo,
                data : param,
                dataType : "json",
                success : function(rep){
                    var bigLogo = '';
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        var data=rep.responseObject.responseData.data_list[rep.responseObject.responseData.data_list.length-1];
                        bigLogo=data.logoUrl;
                    }
                    if(!bigLogo){
                      bigLogo=$(".ev-logoUrl img").attr('src');
                    }
                    $(".ev-bigLogo").attr("src",bigLogo);
                },
                error:function(){}
            });
        },
        //上传头像
        updataLogo:function(){
            var t=this;
            $(".ev-logoUrl").on("click",function(){
                $(".ev-mainInner").hide();
                $(".ev-uploadInner").show();
                var OtherMsgCont=$('.OtherMsgCont .ev-logoUrl img').attr('src');
                $('.ev-personalImg').html(' <p class="ev-cropper cropperImg">' +
                    '                    <img class="ev-bigLogo" src="'+OtherMsgCont+'" alt="">' +
                    '                </p>');
            });
            $(".ev-backMain").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:TempCache.getItem('userId'),
                    actionId:41
                });
                setTimeout(function(){
                    $(".ev-mainInner").show();
                    $(".ev-uploadInner").hide();
                    //删除裁剪图片区域
                    $('.cropper-container,.ev-cropper').remove();
                    $('.al-personalChangeImgInner').removeClass('ChangeCropper');
                    $('.ev-bigLogo').removeClass('cropper-hidden');
                    $('.ev-changeButton').show();
                    $('#ev-uploadBtn').val('');
                    $('.ev-newState').hide();
                    //end
                },500);
            });
            $("#ev-uploadBtn").bind("change",function(event){
                // Log.createBrowse(192,'添加头像');
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId: 456})
                    }},2000);
                if(!/\.((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test($(this).val())&&$(this).val()){
                    popup('只允许上传.jpg .jpeg .png类型的图片文件');
                    $(this).val("");
                    return false ;
                }
                if(comm.getFileSize(document.getElementById("ev-uploadBtn"))>1048576*10){
                    popup('图片不能大于10M');
                    $(this).val("");
                    return false ;
                }
                $('.al-personalChangeImgInner').addClass('ChangeCropper');
                $('.ev-changeButton，.al-personalChangeImgHeader').hide();
                $('.ev-newState').show();
                /*读取照片*/
                var file = event.target.files[0];
                var newUrl = URL.createObjectURL(file);
                /**
                 * 2018/5/8
                 * */
                var $image = $('.ev-cropper>img');
                $image.attr("src", newUrl);
                $image.on("load", function() {
                    $image.cropper({
                        aspectRatio: 1/1,
                        autoCropArea:0.8,
                        dragCrop:false,
                        resizable:false,
                        zoomable:false,
                        viewMode:1,
                        dragMode:'move',
                        // zoomable:true,
                        touchDragZoom:false,
                        // touchDragZoom:true,
                        // minContainerWidth:
                        crop: function(data) {
                            // Output the result data for cropping image.
                            $('.cropper-container').css({
                                // 'width':$('.cropper-canvas').width()+'px',
                                // 'transform':'translateX(0px)',
                                'marginTop':($('.ChangeCropper').height()-$('.cropper-container').height())/2+'px'
                            });

                        }
                    });
                });

                if($('.cropper-container').length>0){
                    $image.cropper('replace',newUrl);
                }


                // $(".ev-showStatus").show();//上传状态父层显示
                // $(".al-loading").css("display","inline-block");//上传loading显示
                // $(".ev-mainInner").show();
                // $(".ev-uploadInner").hide();

                // $.ajaxFileUpload({
                //     type: 'POST',
                //     url: t.path.logoUpload,
                //     data:{paramJson: '{imageType:1}'},
                //     secureuri: false,
                //     fileElementId: "ev-uploadBtn",//file控件id
                //     dataType: '',
                //     success: function (data, status) {
                //         $("#ev-uploadBtn").val("");
                //         var dataJSON = eval("(" + data.body.innerText + ")");
                //         $(".al-loading").hide();//上传loading隐藏
                //         if (dataJSON.responseObject.responseStatus) {
                //             $(".ev-logoUrl img").attr("src",dataJSON.responseObject.responseMessage.url);
                //             t.getBigLogo();
                //             $(".al-loadingFinish").css("display","inline-block");//上传成功显示
                //             setTimeout(function(){
                //                 $(".ev-showStatus").hide();//上传状态父层隐藏
                //                 $(".al-loadingFinish").hide();//上传成功隐藏
                //             },2000);
                //         } else {
                //             popup("上传失败");
                //             $(".ev-showStatus").hide();//上传状态父层隐藏
                //         }
                //     },
                //     error: function (XMLHttpRequest, textStatus, errorThrown) {
                //         popup("上传失败");
                //         $(".ev-showStatus").hide();//上传状态父层隐藏
                //     }
                // });
            });
        //    裁剪头像确认
            $('.ev-sure').on('click',function () {
                var photo = $('.ev-cropper>img').cropper('getCroppedCanvas', {
                    width: 300,
                    height: 300
                }).toDataURL('image/png');
                $(".ev-showStatus").show();//上传状态父层显示
                $(".al-loading").css("display","inline-block");//上传loading显示
                $(".ev-mainInner").show();
                $(".ev-uploadInner").hide();
                //删除裁剪图片区域
                $('.cropper-container,.ev-cropper').remove();
                $('.al-personalChangeImgInner').removeClass('ChangeCropper');
                $('.ev-bigLogo').removeClass('cropper-hidden');
                $('.ev-changeButton,.al-personalChangeImgHeader').show();
                $('#ev-uploadBtn').val('');
                $('.ev-newState').hide();
                //end
                $.ajax({
                    type: "POST",
                    url: t.path.newLogoUpload,
                    data:{paramJson:JSON.stringify({
                            fileContent:photo.split('data:image/png;base64,')[1],
                            imageType:1,
                            extName:'png',
                            isValid:1
                        })},
                    dataType:'json',
                    success: function (data) {
                        $(".al-loading").hide();//上传loading隐藏
                        if (data&&data.responseObject&&data.responseObject.responseStatus){
                            $('.OtherMsgCont .ev-logoUrl img').attr('src',data.responseObject.responseMessage.url);
                            $(".al-loadingFinish").css("display","inline-block");//上传成功显示
                            setTimeout(function(){
                                $(".ev-showStatus").hide();//上传状态父层隐藏
                                $(".al-loadingFinish").hide();//上传成功隐藏
                            },2000);
                        }else {
                            popup("上传失败");
                            $(".ev-showStatus").hide();//上传状态父层隐藏
                        }
                    },
                    error: function(data) {
                        popup("上传失败");
                        $(".ev-showStatus").hide();//上传状态父层隐藏
                    }
                });
            });
            //裁剪取消
            $('.ev-cancelBtn').on('click',function () {
                $('.al-personalChangeImgHeader').show();
                $('.cropper-container').hide();
                $('.al-personalChangeImgInner').removeClass('ChangeCropper');
                $('.ev-bigLogo').removeClass('cropper-hidden');
                $('.ev-changeButton').show();
                $('#ev-uploadBtn').val('');
                $('.ev-newState，.cropper-container').hide();
                var OtherMsgCont=$('.OtherMsgCont .ev-logoUrl img').attr('src');
                $('.ev-cropper img').attr('src',OtherMsgCont);
            })
        },
        //初始化个人信
        getInfo: function() {
            comm.loading.show();
            var t = this;
            var data = {};
            data.customerId = this.customerId;
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                type: "get",
                url: t.path.getInfo,
                data: param,
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    var baseInfoData =data.responseObject.responseData.data_list;
                    if (baseInfoData.areasExpertiseShow) {
                        $('#areasExpertise').text(comm.getStrLen(baseInfoData.areasExpertiseShow, $(window).width() < 760 ? 26 : 30))
                            .attr({
                                nowVal: baseInfoData.areasExpertise,
                                preVal: baseInfoData.areasExpertise,
                                pId: baseInfoData.platformId
                            })
                            .removeClass('placeHolderColor');
                    }
                    $('input[name=platformId]').val(data.responseObject.responseData.data_list.platformId);
                    comm.loading.hide();
                    ymd({
                        year: $("#year01"),
                        month: $("#month01"),
                        day: $('#day01'),
                        latestYear: 2000,
                        default1: true
                    });
                    if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.birthYear&&data.responseObject.responseData.data_list.birthYear.length){
                        var dateContent = data.responseObject.responseData.data_list.birthYear.split(' ');
                        var dateArr = dateContent[0].split('-');
                        var yearStr = dateArr[0];
                        var monthStr = dateArr[1];
                        var dayStr = dateArr[2];
                        gettime($("#year01"), yearStr, 1);
                        gettime($("#month01"), monthStr, 1);
                        gettime($('#day01'), dayStr, 1);

                    }else{
                        gettime($("#year01"), '1980', 1);
                        gettime($("#month01"), '01', 1);
                        gettime($('#day01'), '01', 1);
                    }
                    expertise.init();
                    professional.init(data.responseObject.responseData.data_list.platformId);
                    //新注册的用户,首次进入其他个人信息,目前返回false,正常返回state值和默认头像
                    if($.isEmptyObject(data.responseObject.responseData)){
                        var logoUrl = "//img50.allinmd.cn/pages/personal/no_head.png";
                        $(".ev-logoUrl img").attr('src',logoUrl);
                        t.getBigLogo(); //获取大图
                        ymd({
                            year:$('#auth_clinicalYear'),
                            month:$('#auth_clinicalMonth'),
                            default1:true,
                            defaultVal:""
                        });
                    }
                    //end
                    if(comm.hasResponseData(data)){
                        var item = data.responseObject.responseData.data_list;
                        t.data.operationList = item.operationList;
                        if(item.operationList.length){
                            for(var i = 0;i<item.operationList.length;i++){
                                t.ele.areasExpertise += item.operationList[i].id;
                                if(i==item.operationList.length-1){
                                    t.ele.operationList += item.operationList[i].operationIdList.split(',');
                                }else{
                                    t.ele.operationList += item.operationList[i].operationIdList.split(',')+',';
                                }
                            }
                        }
                        //保存地址要使用的ID存放在顶级变量
                        if(item.addressId==0){
                            t.ele.addressId = "";
                        }else{
                            t.ele.addressId =item.addressId;
                        }
                        //头像展示
                        var logoUrl="";
                        if(item.logoUrl == "0" || item.logoUrl == ""){
                            logoUrl = "//img50.allinmd.cn/pages/personal/no_head.png";
                        }else{
                            logoUrl = item.logoUrl;
                        }
                        $(".ev-logoUrl img").attr('src',logoUrl);
                        t.getBigLogo(); //获取大图
                        if (item.state != 2 &&item.state!=7&&item.state!=8&&item.state!=9) { //未认证item.state != 1 &&
                            ymd({
                                year:$('#auth_clinicalYear'),
                                month:$('#auth_clinicalMonth'),
                                default1:true,
                                defaultVal:""
                            });
                            if(item.clinicalYear){
                                gettime($('#auth_clinicalYear'),item.clinicalYear.substring(0,4),1);
                                gettime($('#auth_clinicalMonth'),item.clinicalYear.substring(5,7),1);
                                $('.clinicalTime .al-tableModuleSelect p').css('color','#333');
                                $('.clinicalTime .al-tableModuleSelect .al-dateSelector').css('border-bottom','1px solid #333');
                            }else{
                                gettime($('#auth_clinicalYear'),"",1);
                                gettime($('#auth_clinicalMonth'),"",1);
                                $('#auth_clinicalYear,#auth_clinicalMonth,.ev-clinicalTime span').css('color','#aaa');
                            }
                        }else{
                            //获取临床时间
                            if(item.clinicalYear){
                                $('.clinicalTime .al-tableModuleSelect').html('<span>'+item.clinicalYear+'&nbsp;&nbsp;</span><b>至今</b>');
                            }else{
                                ymd({
                                    year:$('#auth_clinicalYear'),
                                    month:$('#auth_clinicalMonth'),
                                    default1:true,
                                    defaultVal:""
                                });
                            }
                        }
                        t.saveBirthDay(); //保存临床时间
                        //擅长领域
                        // var illnessList = item.illnessList;
                        // if (illnessList.length > 0) {
                        //     var template = "";
                        //     var str = "",strs = "";
                        //     for(var i= 0,le=illnessList.length;i<le;i++){
                        //         if(i==le-1){
                        //             template += illnessList[i].illnessName
                        //         }else{
                        //             template += illnessList[i].illnessName+'、';
                        //         }
                        //         t.ele.dataList.push(illnessList[i].illnessId);
                        //         str += '<li data-list="'+illnessList[i].illnessId+'">'+illnessList[i].illnessName+'<i></i></li>';
                        //     }
                        //     $('#sickness').css('color','#333').html(template);
                        //     $('.diseasesTag ul').html(str);
                        //     if($('.diseasesTag ul li').length>0){
                        //         $('.save-sickness').addClass('active');
                        //     }
                        // }
                        // var filed = $("#filed").val(),sickNess = $("#sickness").text(),surgery = $("#surgery").text();
                        // $('#field').text(filed+surgery+sickNess);
                        //个人签名展示
                        var summaryNew= "";
                        var summary=htmlToString(item.summary);
                        if(summary){
                            $("#summary span").css("color","#333");
                            $("#summaryIn").val(item.summary);
                            if(comm.getByteLen(summary)>122){
                                summaryNew=comm.getStrLen(summary,124);
                                $(".ev-expansion").show();
                                t.ele.data=summary;
                            }else{
                                summaryNew=summary;
                            }
                            $(".ev-summary").find('span').html(summaryNew);
                        }
                        var dataFlag = 0;
                        $(".ev-expansion").on('click',function(e){
                            e.stopPropagation();
                            if(dataFlag == 1){
                                $(".ev-summary").find('span').html(comm.getStrLen(t.ele.data,124));
                                $(this).html('展开<i></i>').removeClass('pickUp');
                                dataFlag = 0;
                            }else{
                                $(".ev-summary").find('span').html(t.ele.data);
                                $(this).html('收起<i></i>').addClass('pickUp');
                                dataFlag = 1;
                            }
                        });
                        t.editSummary();  //编辑个人签名
                        //地址展示
                        if(item.addressFull){
                            $("#address").css("color", "#333").text(item.addressFull);
                                    //.attr("addId",c_address.customerAId);
                            $("#addressIn").val(item.addressFull);
                        }else{
                            $("#address").css("color", "#aaa");
                        }
                        t.editAddress();
                        //科室
                        if(item.department){
                            $("#department span").css("color", "#333").text(item.department);
                            $("#department span").attr('longTxt',item.department);
                            if(item.department.length>62){
                                $("#department span").attr('longTxt',item.department);
                                $(".ev-ksExpansion").show();
                                $('.ev-ksExpansion').html('展开<i></i>').removeClass('pickUp');
                                var dataFlag = 0;
                                $(".ev-ksExpansion").on('click',function(e){
                                    e.stopPropagation();
                                    if(dataFlag == 1){
                                        $("#department").find('span').html(comm.getStrLen($("#department span").attr('longTxt'),124));
                                        $(this).html('展开<i></i>').removeClass('pickUp');
                                        dataFlag = 0;
                                    }else{
                                        $("#department").find('span').html($("#department span").attr('longTxt'));
                                        $(this).html('收起<i></i>').addClass('pickUp');
                                        dataFlag = 1;
                                    }
                                });
                            }else{
                                $(".ev-ysjyExpansion").hide();
                            }
                        }else{
                            $("#department span").css("color", "#aaa");
                        }
                        t.department();
                        //独立完成手术病例数
                        if(item.yesteryearOperationNum){
                            $("#surgeryNum .yesterYear div").text(item.yesteryearOperationNum+'例');
                            $(".ev-surgeryNumInput .yesterYear input").val(item.yesteryearOperationNum);
                            $("#surgeryNum").css("color", "#aaa");
                        }
                        if(item.precedingyearOperationNum){
                            $("#surgeryNum .precedingYear div").text(item.precedingyearOperationNum+'例');
                            $(".ev-surgeryNumInput .precedingYear input").val(item.precedingyearOperationNum);
                            $("#surgeryNum").css("color", "#333");
                        }
                        t.surgeryNum();//大度完成病例数
                    //    擅长领域

                        var allExpertise = '';
                        if(item.expertise){
                            allExpertise += item.expertise;
                            $("#filed").val(item.expertise)
                        }
                        //擅长疾病
                        var illnessList = item.illnessList,illNewArr = [];
                        if (illnessList.length > 0) {
                            var template = "";
                            var str = "",strs = "";
                            for(var i= 0,le=illnessList.length;i<le;i++){
                                if(illNewArr.indexOf(illnessList[i])<0){
                                    if(i==le-1){
                                        template += illnessList[i].illnessName
                                    }else{
                                        template += illnessList[i].illnessName+'、';
                                    }
                                    t.ele.dataList.push(illnessList[i].illnessId);
                                    str += '<li data-list="'+illnessList[i].illnessId+'">'+illnessList[i].illnessName+'<i></i></li>';
                                }
                            }
                            $('#sickness').css('color','#333').html(template);
                            if(item.expertise!=''){
                                allExpertise += '<br/>'+template;
                            }else{
                                allExpertise += template;
                            }
                            $('.diseasesTag ul').html(str);
                            if($('.diseasesTag ul li').length>0){
                                $('.save-sickness').addClass('active');
                            }
                        }
                        //擅长手术
                        var operationNameList = item.operationNameList;
                        if (operationNameList.length > 0) {
                            var arr = operationNameList.split(','),newArr=[];//新的数组用来保存新的数据
                            var template = "";
                            for(var i = 0,le = arr.length; i<le; i++){
                               if(arr[i]!=""){
                                   if(newArr.indexOf(arr[i])<0){
                                       if(i==le-1){
                                           template += arr[i];
                                       }else{
                                           template += arr[i]+'、';
                                       }
                                       newArr.push(arr[i]);
                                   }
                               }
                            }
                            // var template = operationNameList.replace(/,/g,'、');
                            //$('[data-operationId='+value.operationId+'] i' ).addClass('active');
                            $('#surgery').css('color','#333').html(template);
                            if(illnessList!=''||item.expertise!=''){
                                allExpertise += '<br/>'+template;
                            }else{
                                allExpertise += template;
                            }
                            if( t.ele.operationList.length>0){
                                $('.save-surgery').addClass('active');
                            }
                        }
                        if(allExpertise!=''){
                            $("#field span").html(allExpertise);
                            $("#field span").css('color','#333');
                        }
                        if($('#field').height()>350){
                            $("#field").find('span').css('-webkit-line-clamp','4');
                            $("#field span").attr('longTxt',allExpertise);
                            $(".ev-fileExpansion").show();
                            $('.ev-fileExpansion').html('展开<i></i>').removeClass('pickUp');
                            var dataFlag = 0;
                            $(".ev-fileExpansion").on('click',function(e){
                                e.stopPropagation();
                                if(dataFlag == 1){
                                    $("#field").find('span').css('-webkit-line-clamp','4');
                                    $(this).html('展开<i></i>').removeClass('pickUp');
                                    dataFlag = 0;
                                }else{
                                    $("#field").find('span').css('-webkit-line-clamp','1111');//啊哈哈我知道你会原谅我的
                                    $(this).html('收起<i></i>').addClass('pickUp');
                                    dataFlag = 1;
                                }
                            });
                        }else{
                            $(".ev-ysjyExpansion").hide();
                            $("#field").find('span').css('-webkit-line-clamp','1111');
                        }
                        t.sickness();  //编辑疾病
                        t.surgery();   //编辑手术
                        t.field();//擅长领域
                        //医师寄语
                        if(item.sendWord){
                            $(".compile-sendWord").show();
                            $("#sendWord").find('span').html(comm.getStrLen(item.sendWord, 124));
                            $("#sendWordIn").val(item.sendWord);
                            if(item.sendWord.length>62){
                                $("#sendWord span").attr('longTxt',item.sendWord);
                                $(".ev-ysjyExpansion").show();
                                $('.ev-ysjyExpansion').html('展开<i></i>').removeClass('pickUp');
                                var dataFlag = 0;
                                $(".ev-ysjyExpansion").on('click',function(e){
                                    e.stopPropagation();
                                    if(dataFlag == 1){
                                        $("#sendWord").find('span').html(comm.getStrLen($("#sendWord span").attr('longTxt'),124));
                                        $(this).html('展开<i></i>').removeClass('pickUp');
                                        dataFlag = 0;
                                    }else{
                                        $("#sendWord").find('span').html($("#sendWord span").attr('longTxt'));
                                        $(this).html('收起<i></i>').addClass('pickUp');
                                        dataFlag = 1;
                                    }
                                });
                            }else{
                                $(".ev-ysjyExpansion").hide();
                            }
                            $("#sendWord span").unbind().css("color",'#333');
                        }else{
                            $(".compile-sendWord").hide();
                        }
                        t.sendWord();//医师寄语
                    }
                },
                error: function() {}
            });
        },
        //保存临床时间
        saveBirthDay: function(){
            var t = this;
            $("#auth_clinicalYear,#auth_clinicalMonth").on("change", function() {
                if($("#auth_clinicalYear option:selected").val()!=""){
                    $('.clinicalTime .al-tableModuleSelect p').css('color','#333');
                    $('.clinicalTime .al-tableModuleSelect .al-dateSelector').css('border-bottom','1px solid #333');
                    comm.loading.show();
                    var data = {};
                    data.customerId = t.customerId;
                    data.clinicalYear = $("#auth_clinicalYear option:selected").val() + "-" + $("#auth_clinicalMonth option:selected").val()+"-"+'01';
                    var rep = CommService.execute(t.path.updateInfo, data);
                    comm.loading.hide();
                    if (rep && rep.responseStatus) {
                        //popup("保存成功");
                    } else {
                        //popup("保存失败");
                    }
                }
            });
        },
        //初始化擅长手术信息1级
        getInitSurgeryFirst:function(){  //获取1级
            comm.loading.show();
            var t = this;
            var data = {};
            data.customerId = 1399252409974;
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                url: t.path.getInitSurgeryFirst,
                //url:'/comm/data/specialty/operation/getMapList/',
                //url:'/mcall/comm/data/baseinfo/specialty/getMapList/',
                type: "post",
                data: param,
                dataType: "json",
                success: function(data) {
                    comm.loading.hide();
                    if(comm.hasResponseData(data)){
                        var item = data.responseObject.responseData.dataList;
                        if(item.length>0){
                            var html = "";
                            $.each(item,function(index,value){
                                html += '<section class="majorTitle"  data-majorId="'+value.specialtyId+'">'+value.specialtyName+'</section><ul class="majorList hide"></ul>';
                            });
                            $('.ev-surgery .al-indexHeader').after(html);
                            t.getInitSurgerySecond();
                        }
                    }
                },
                error: function() {}
            });
        },
        //初始化擅长手术信息2,3级
        getInitSurgerySecond:function(){  //获取2级和3级
            comm.loading.show();
            var t = this;
            var data = {};
            data.specialtyIdList ="";
            data.isValid = "1";
            data.pageIndex = "1";
            data.pageSize = "999";
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                type: "post",
                url: t.path.getInitSurgerySecond,
                data: param,
                dataType: "json",
                success: function(data) {
                    comm.loading.hide();
                    if(comm.hasResponseData(data)){
                        var item = data.responseObject.responseData.dataList;
                        if (item.length > 0) {
                            var template = "",str = "",html="";
                            str = '<div class="option all"><i class="checkBox" style="clear:right"></i><span>全部</span></div>';
                            $.each(item,function(index,value){
                                if(value.children.length){
                                    var html = "";
                                    $.each(value.children,function(i,v){
                                        html += '<div class="option" data-operationId="'+v.operationId+'"><i class="checkBox" style="clear:right"></i><span>'+v.operationName+'</span></div>';
                                    });
                                    template= '<li data-belongId="'+value.majorId+'">' +
                                    '<div class="majorListOne" data-operaId="'+value.operationId+'"><span>'+value.operationName+'</span><i class="arrow"></i></div>' +
                                    '<aside class="majorListTwo">'+str+html+'</aside>' +
                                    '</li>';
                                    $('[data-majorId='+value.majorId+']').next().append(template);
                                }
                            });
                            $(".majorList").each(function(){
                                if($(this).find("[data-belongid]").length){
                                   $(this).show();
                                }else{
                                    $(this).prev().remove();
                                    $(this).remove();
                                }
                            });
                            if(t.ele.operationList.length){
                                t.ele.operationList = t.ele.operationList.split(',');
                                for(var j = 0,lg= t.ele.operationList.length; j<lg; j++){
                                    $('[data-operationid='+t.ele.operationList[j]+'] i').addClass('active');
                                    var th = $('[data-operationid='+t.ele.operationList[j]+']');  //获取选中的手术
                                    var all = th.parent().find('.all');    //获取选中手术的父亲下的全部按钮
                                    var sumNum = th.parent('.majorListTwo').find('.option').length-1;   //获取选中手术下的所有孩子-1（-全部）
                                    var  checkNum= 0;
                                    var alls = th.parent().children();   //获取选中元素父亲下的所有孩子
                                    $(alls).each(function(){
                                        if(!$(this).hasClass("all")&&($(this).find(".active").length===1)){
                                            checkNum++;
                                        }
                                    });
                                    if(checkNum===sumNum){
                                        all.find(".checkBox").addClass("active");
                                    }
                                }
                            }
                        }
                        t.surgery();
                    }
                },
                error: function() {}
            });
        },
        //2018/04/16  加入擅长领域，包括擅长疾病+擅长手术
        //科室
        department:function () {
            var t = this;
            if($('#department span').css('color')=='rgb(170, 170, 170)'){//没有输入过内容.
                $(".compile-department").hide();
                $('#department').on('click',function () {
                    $('.al-mainInner').hide();
                    $(".ev-department").show();
                })
            }else{
                $(".compile-department").show();
                $(".compile-department").on("click",function () {
                    $('.al-mainInner').hide();
                    $(".ev-department").show();
                    $('#departmentIn').val($('#department span').attr('longTxt'));
                });
            }
            $(".ev-ksBackToMain").off('click').on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'科室修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $('.ev-mainInner').show();
                    $('.ev-department').hide();
                }, 500);
            });
            $("#departmentIn").on('input keyup focus',function () {
                if($(this).val()!=''){
                    $("#saveDepartment").removeClass('al-msgWriting');
                }else{
                    $("#saveDepartment").addClass('al-msgWriting');
                }
            });
            $("#saveDepartment").on('click',function () {
                if ($("#departmentIn").val()) {
                    var data = {};
                    data.customerId = t.customerId;
                    data.department = $("#departmentIn").val();
                    t.ele.data = htmlToString(data.department);  //把编辑好的内容存到公共数据，在点击展开收起的时候调用226
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-department").hide();
                                if (t.ele.data) {
                                    $("#department span").css("color", "#333");
                                    $("#department span").attr("longtxt",t.ele.data);
                                    $("#department").find('span').html(comm.getStrLen(t.ele.data, 124));
                                    if(t.ele.data.length>62){
                                        $(".ev-ksExpansion").show();
                                        $('.ev-ksExpansion').html('展开<i></i>').removeClass('pickUp');
                                    }else{
                                        $(".ev-ksExpansion").hide();
                                    }
                                } else {
                                    $("#department").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            });
            var ksDataFlag = 0;
            $('.ev-ksExpansion').on('click',function (e) {
                e.stopPropagation();
                if(ksDataFlag == 1){
                    $("#department").find('span').html(comm.getStrLen($("#department span").attr('longTxt'),124));
                    $(this).html('展开<i></i>').removeClass('pickUp');
                    ksDataFlag = 0;
                }else{
                    $("#department").find('span').html($("#department span").attr('longTxt'));
                    $(this).html('收起<i></i>').addClass('pickUp');
                    ksDataFlag = 1;
                }
            });
        },
        //独立完成的病例数
        surgeryNum:function () {
            var t = this,date = new Date(),year = date.getFullYear(),isShow = false,isInput = false;
            $(".ev-dlBackToMain").on('click',function () {
                $(".ev-mainInner").show();
                $(".ev-surgeryNum").hide();
            });
            $('.yesterYear span').text((year-1));$('.precedingYear span').text((year-2));
            if($("#surgeryNum .yesterYear div").text().indexOf('例')>0||$("#surgeryNum .precedingYear div").text().indexOf('例')>0){
                isShow = true;
            }
            cliBtn(isShow);
            function cliBtn(isShow) {
                if(isShow){//显示编辑按钮
                    $('.compile-surgeryNum').show();
                    $('.compile-surgeryNum').on('click',function () {
                        $('.ev-mainInner').hide();
                        $('.ev-surgeryNum').show();
                    });
                    $("#surgeryNum div div").unbind('click');
                }else{
                    $('.compile-surgeryNum').hide();
                    $('#surgeryNum input').attr("disabled","");
                    $("#surgeryNum div div").on("click",function () {
                        $('.ev-mainInner').hide();
                        $('.ev-surgeryNum').show();
                    })
                }
            }
            $('.surgeryNumInput input').on('input keyup change',function () {
                if($(this).parent().hasClass('yesterYear')){
                    $(".ev-surgeryNumInput .yesterYear input").val($(".ev-surgeryNumInput .yesterYear input").val().replace(/[^\d]/g,''));
                }
                if($(this).parent().hasClass('precedingYear')){
                    $(".ev-surgeryNumInput .precedingYear input").val($(".ev-surgeryNumInput .precedingYear input").val().replace(/[^\d]/g,''));
                }
                if($('.surgeryNumInput .yesterYear input').val()!=''||$('.surgeryNumInput .precedingYear input').val()!=''){
                    isInput = true;
                }else{
                    isInput = false;
                }
                if(isInput){
                    $('#saveSurgeryNum').removeClass('al-msgWriting');
                }else{
                    $('#saveSurgeryNum').addClass('al-msgWriting');
                }
            });
            $('#saveSurgeryNum').on('click',function () {
                if(!$(this).hasClass('al-msgWriting')){
                    var data = {};
                    data.customerId = t.customerId;
                    data.yesteryearOperationNum = $(".surgeryNumInput .yesterYear input").val();
                    data.precedingyearOperationNum = $(".surgeryNumInput .precedingYear input").val();
                    // t.ele.data = htmlToString(data.department);  //把编辑好的内容存到公共数据，在点击展开收起的时候调用226
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-surgeryNum").hide();
                                if (data.yesteryearOperationNum||data.precedingyearOperationNum) {
                                    $("#surgeryNum").css("color", "#333");
                                    if(data.yesteryearOperationNum!=''&&data.yesteryearOperationNum!=0){
                                        $(".surgeryNum .yesterYear div").text(data.yesteryearOperationNum+'例');
                                        isShow = true;
                                    }
                                    if(data.precedingyearOperationNum!=''&&data.precedingyearOperationNum!=0){
                                        $(".surgeryNum .precedingYear div").text(data.precedingyearOperationNum+'例');
                                        isShow = true;
                                    }
                                    cliBtn(isShow);
                                } else {
                                    $("#surgeryNum").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            })
        },
        //擅长领域
        field:function () {
            var t = this;
            if($('#field').height()>350){
                $("#field").find('span').css('-webkit-line-clamp','4');
                var allExpertise = '';
                if($("#filed").val()!=''){
                    allExpertise += $("#filed").val();
                }
                if($("#sickness").css('color')=='rgb(51, 51, 51)'){
                    if($("#filed").val()!=''){
                        allExpertise += '<br/>'+$("#sickness").text();
                    }else{
                        allExpertise += $("#sickness").text();
                    }
                }
                if($("#surgery").css('color')=='rgb(51, 51, 51)'){
                    if($("#sickness").css('color')=='rgb(51, 51, 51)'){
                        allExpertise += '<br/>'+$("#sickness").text();
                    }else{
                        allExpertise += $("#sickness").text();
                    }
                }
                $("#field span").attr('longTxt',allExpertise);
                $(".ev-fileExpansion").show();
                $('.ev-fileExpansion').html('展开<i></i>').removeClass('pickUp');
                var dataFlag = 0;
                $(".ev-fileExpansion").off('click').on('click',function(e){
                    e.stopPropagation();
                    if(dataFlag == 1){
                        $("#field").find('span').css('-webkit-line-clamp','4');
                        $(this).html('展开<i></i>').removeClass('pickUp');
                        dataFlag = 0;
                    }else{
                        $("#field").find('span').css('-webkit-line-clamp','1111');//啊哈哈原谅我
                        $(this).html('收起<i></i>').addClass('pickUp');
                        dataFlag = 1;
                    }
                });
            }else{
                $(".ev-ysjyExpansion").hide();
            }
            if($('#field').find('span').css('color')=='rgb(170, 170, 170)'){//表示没有输入过内容，编辑按钮不显示，点击输入框进行编辑
                $('.compile-field').hide();
                $('#field').on('click',function () {
                    $('.al-mainInner').hide();
                    $(".ev-filed").show();
                })
            }else{//表示已经输入过内容，可以进行编辑按钮点击，输入框不可点击
                $('.compile-field').show();
                $('.compile-field').off("click").on('click',function () {
                    $('.al-mainInner').hide();
                    $(".ev-filed").show();
                });
                $('#field').unbind('click');
            }
            $(".ev-expertBack").off('click').on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'擅长领域修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $('.ev-mainInner').show();
                    $('.ev-filed').hide();
                }, 500);
            });
            $('#filed').on('keyup focus change',function () {
                if($(this).val()!=''){
                  $('#saveFiled').removeClass('al-msgWriting');
                }else{
                    $('#saveFiled').addClass('al-msgWriting');
                }
            });
            $("#saveFiled").on('click',function () {
                // if($('#filed').val()){
                    var data = {};
                    data.customerId = t.customerId;
                    data.expertise = $("#filed").val()?$('#filed').val():' ';
                    t.ele.data = htmlToString(data.expertise);  //把编辑好的内容存到公共数据，在点击展开收起的时候调用226
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-filed").hide();
                                if (t.ele.data) {
                                    $("#field span").css("color", "#333");
                                    t.txtAdd();
                                    //判断高度是否超过
                                    if($('#field').height()>350){
                                        $("#field").find('span').css('-webkit-line-clamp','4');
                                        $('.ev-fileExpansion').show();
                                        $('.compile-field').show();
                                        $('.compile-field').off("click").on('click',function () {
                                            $('.al-mainInner').hide();
                                            $(".ev-filed").show();
                                        });
                                        $('#field').unbind('click');
                                    }else{
                                        $('.ev-fileExpansion').hide().removeClass('pickUp');
                                        $("#field").find('span').css('-webkit-line-clamp','1111');//啊哈哈我知道你会原谅我的
                                    }
                                    $(".ev-fileExpansion").show();
                                    $('.ev-fileExpansion').html('展开<i></i>').removeClass('pickUp');
                                    var dataFlag = 0;
                                    $(".ev-fileExpansion").off('click').on('click',function(e){
                                        e.stopPropagation();
                                        if(dataFlag == 1){
                                            $("#field").find('span').css('-webkit-line-clamp','4');
                                            $(this).html('展开<i></i>').removeClass('pickUp');
                                            dataFlag = 0;
                                        }else{
                                            $("#field").find('span').css('-webkit-line-clamp','1111');//啊哈哈原谅我
                                            $(this).html('收起<i></i>').addClass('pickUp');
                                            dataFlag = 1;
                                        }
                                    });
                                } else {
                                    $("#field").css("color", "#aaa");
                                }
                                popup("保存失败");
                                popup("保存成功");
                            } else {
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                // }
            });
            //倒计数
            var setSug=$("#filed");
            comm.textChange({'$tex':setSug,'$num':$("#ev-filSugNum"),'noTop':0,maxTop:0});
            setSug.on('focus',function(){
                $("#ev-filSugNum").show().html(2000-parseInt(comm.getByteLen(setSug.val())/2));
                $("#ev-filSugNum").css('float','right');
            }).on('blur',function(){
                $("#ev-filSugNum").hide();
            });
        },
        //擅长领域内容拼接函数
        txtAdd:function () {
            var t = this;
            var allTxt = '',filed='',sickness = '',surgery = '';
            if($("#filed").val()!=''&&$("#filed").val()!=' '){
                filed = $("#filed").val();
            }
            if($("#sickness").css('color')=='rgb(51, 51, 51)'){
                if($("#filed").val()!=''){
                    sickness = '<br/>'+$("#sickness").text()
                }else{
                    sickness = $("#sickness").text()
                }
            }
            if($("#surgery").css('color')=='rgb(51, 51, 51)'){
                if($("#sickness").css('color')=='rgb(51, 51, 51)'){
                    surgery = '<br/>'+$("#surgery").text()
                }else{
                    surgery = $("#surgery").text()
                }
            }
            $("#field span").html(filed+sickness+surgery);
        },
        //医师寄语
        sendWord:function () {
            var t = this;
            if($('#sendWord').find('span').css('color')=='rgb(170, 170, 170)'){//表示没有输入过内容，编辑按钮不显示，点击输入框进行编辑
                $('.compile-sendWord').hide();
                $('#sendWord').on('click',function () {
                    $('.al-mainInner').hide();
                    $('.ev-sendWord').show();
                })
            }else{//表示已经输入过内容，可以进行编辑按钮点击，输入框不可点击
                $('.compile-sendWord').show();
                $('.compile-sendWord').off("click").on('click',function () {
                    $(document).scrollTop(0);
                    $('.al-mainInner').hide();
                    $('.ev-sendWord').show();
                });
            }
            $(".ev-sendWord li i").on("click",function () {
                var _t = $(this),sendWord = $('#sendWordIn').val();
                $('#sendWordIn').val(sendWord+_t.parent("li").find('span').text());
                $('#saveSendWord').removeClass('al-msgWriting');
                var e = jQuery.Event("keyup");
                $('#sendWordIn').trigger(e);
            });
            $("#sendWordIn").on('keyup change focus',function () {
               if($(this).val()!=''){
                   $('#saveSendWord').removeClass('al-msgWriting');
               }
            });
            $('.ev-ysjyBackToMain').on('click',function () {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'医师寄语修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-sendWord").hide();
                }, 500);
            });
            $('#saveSendWord').off('click').on('click',function () {
                if($("#sendWordIn").val()){
                    var data = {};
                    data.customerId = t.customerId;
                    data.sendWord = $("#sendWordIn").val();
                    t.ele.data = htmlToString(data.sendWord);  //把编辑好的内容存到公共数据，在点击展开收起的时候调用226
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-sendWord").hide();
                                if (t.ele.data) {
                                    $("#sendWord span").css("color", "#333");
                                    $('#sendWord span').attr('longTxt',$("#sendWordIn").val());
                                    $("#sendWord").find('span').html(comm.getStrLen(t.ele.data, 124));
                                    if(t.ele.data.length>62){
                                        $(".ev-ysjyExpansion").show();
                                        $('.ev-ysjyExpansion').html('展开<i></i>').removeClass('pickUp');
                                    }else{
                                        $(".ev-ysjyExpansion").hide();
                                    }
                                } else {
                                    $("#sendWord").css("color", "#aaa");
                                    $('#sendWord span').text('请简述个人情况，让大家更了解你');
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            });
            var dataFlag = 0;
            $(".ev-ysjyExpansion").on('click',function(e){
                e.stopPropagation();
                if(dataFlag == 1){
                    $("#sendWord").find('span').html(comm.getStrLen($("#sendWord span").attr('longTxt'),124));
                    $(this).html('展开<i></i>').removeClass('pickUp');
                    dataFlag = 0;
                }else{
                    $("#sendWord").find('span').html($("#sendWord span").attr('longTxt'));
                    $(this).html('收起<i></i>').addClass('pickUp');
                    dataFlag = 1;
                }
            });
            //倒计数
            var setSug=$("#sendWordIn");
            comm.textChange({'$tex':setSug,'$num':$("#ev-docSugNum"),'noTop':0,maxTop:0});
            setSug.on('focus',function(){
                $("#ev-docSugNum").show().html(500-parseInt(comm.getByteLen(setSug.val())/2));
                $("#ev-docSugNum").css('float','right');
            }).on('blur',function(){
                $("#ev-docSugNum").hide();
            });
        },
        //擅长疾病
        sickness:function(){
            var  t = this;
            if($("#sickness").css("color")=='rgb(170, 170, 170)'){//表示没有输入文字
                $('.compile-sickness').hide();
                $("#sickness").on('click',function () {
                    $('.al-mainInner').hide();
                    $('.ev-sickness').show();
                })
            }else{
                $("#sickness").unbind("click");
                $('.compile-sickness').show();
                $('.compile-sickness').on('click',function(){
                    $('.al-mainInner').hide();
                    $('.ev-sickness').show();
                });
            }
            $(".ev_backBtn").off('click').on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'擅长疾病修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $('.al-mainInner').hide();
                    $('.ev-filed').show();
                }, 500);
                // var filed = $("#filed").val(),sickNess = $("#sickness").text(),surgery = $("#surgery").text();
                // $('#field').find("span").text(filed+'<br/>'+surgery+'<br/>'+sickNess);
            });
            function sicknessSave(){
                if($('.diseasesTag ul li').length>0){
                    $('.save-sickness').addClass('active');
                }else{
                     $('.save-sickness').removeClass('active');
                }
            }
            $('.diseasesTag ul').on('click','li',function(){  //删除操作
                var id = $(this).attr('data-list');
                var text = $(this).text();
                var status;
                for(var i= 0,le=t.ele.dataList.length;i<le;i++){
                    if(t.ele.dataList[i]==id){
                        t.ele.dataList.splice(i,1);
                    }
                }
                for(var j= 0,lg=t.ele.searchList.length;j<lg;j++){
                    if(t.ele.searchList[j]==id){
                        status = true;
                    }
                }
                if(status){
                    $('[data-list='+id+']').removeAttr('style');
                }else{
                    $('.association ul').append('<li data-list="'+id+'">'+text+'</li>');
                }

                $(this).remove();
                sicknessSave();
            });

            $('.diseasesInput .association ul').on('click','li',function(){  //添加操作
                var that = $(this);
                var id = parseInt(that.attr('data-list'));
                var isRepeat = false;
                $.each(t.ele.dataList,function(index,value){
                    if(value == id){
                        isRepeat = true;
                        return false;
                    }
                });
                if(!isRepeat){
                    $('.diseasesTag ul').append('<li data-list="'+id+'">'+that.html()+'<i></i></li>');
                    t.ele.dataList.push(id);
                    that.attr('style','color:#c9c9c9');
                }
                //console.log(t.ele.dataList);

                sicknessSave();
            });
            t.savesickness();
        },
        //保存疾病
        savesickness: function() {
            var t = this;
            $(".save-sickness").off('click').on("click", function() {
                if ($(this).hasClass('active')) {
                    t.ele.sicknessStr = "";
                    var data = {};
                    data.customerId = t.customerId;
                    data.illnessIdList = "";
                    data.illnessNameList = "";
                    var content = $('.diseasesTag ul li');
                    $.each(content, function (index, value) {
                        if (index == content.length - 1) {
                            t.ele.sicknessStr += $(this).text();
                            data.illnessIdList += $(this).attr('data-list');
                            data.illnessNameList += $(this).text();
                        } else {
                            t.ele.sicknessStr += $(this).text() + '、';
                            data.illnessIdList += $(this).attr('data-list') + ',';
                            data.illnessNameList += $(this).text() + ',';
                        }
                    });
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function (rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $('.ev-mainInner').hide();
                                $('.ev-sickness').hide();
                                $('.ev-filed').show();
                                if (t.ele.sicknessStr) {
                                    $("#sickness").css("color", "#333");
                                    $("#sickness").html(t.ele.sicknessStr);
                                    t.txtAdd();
                                } else {
                                    $("#sickness").html('添加擅治疾病，为您推荐更精准资源');
                                    $("#sickness").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function () {
                            comm.loading.hide();
                        }
                    });
                    $('.inputBorder input').val("");
                    $('.association ul li').remove();
                }
            });
        },
        //搜索疾病
        bindTextChange: function() {
            var t = this;
            var flag = true;
            var timer = null;
            t.ele.input.bind('compositionstart',function(){
                flag = false;
            });
            t.ele.input.bind('compositionend',function(){
                flag = true;
            });
            t.ele.input.bind("input propertychange keyup change",function(event){
                clearTimeout(timer);
                var searchParam= $.trim($(this).val());
                timer=setTimeout(function(){
                    if(searchParam&&flag){
                        changeHandler(searchParam);
                    }
                },500);
            });
            function changeHandler(keyWord) {
                var data = {};
                data.isValid = 1;
                data.firstResult = 1;
                data.maxResult = 10;
                data.illnessName = keyWord;
                var param={};
                param.paramJson= $.toJSON(data);
                comm.loading.show();
                $.ajax({
                    type: 'get',
                    url: t.path.bindTextChange,
                    data: param,
                    dataType: "json",
                    timeout: 10000,
                    success: function(data) {
                        comm.loading.hide();
                        if(comm.hasResponseData(data)){
                            var item = data.responseObject.responseData.data_list;
                            if(item.length>0){
                                var html = "",state="";
                                $.each(item,function(index,value){
                                    $.each(t.ele.dataList,function(i,v){
                                        if(value.illnessId == v){
                                            state=v;
                                        }
                                    });
                                    if(value.illnessId!=state){
                                        html += '<li data-list="'+value.illnessId+'">'+ value.illnessName+'</li>';
                                    }else{
                                        html += '<li data-list="'+value.illnessId+'" style="color:#c9c9c9">'+ value.illnessName+'</li>';
                                    }
                                    t.ele.searchList.push(value.illnessId);

                                });
                                $('.association ul').html(html);

                                //console.log(t.ele.searchList);
                            }
                        }
                    },
                    error: function() {}
                });

            }
        },
        saveNewAdditionBaseInfo:function(){
            var t = this;
            //2.7版本，个人中心最新维护的出生日期、专业、专科字段
            var resultBirthday = $("#year01 option:selected").text()+'-'+$("#month01 option:selected").text()+'-'+$("#day01 option:selected").text();
            var platformId = $(".al-radio-item.al-radio-active").index()+1;
            var areasExpertise = $("#areasExpertise").attr('nowval');
            if(areasExpertise.length&&$("#day01 option:selected").text().length&&$("#year01 option:selected").text().length&&$("#month01 option:selected").text().length){
                var data = {
                    visitSiteId:2,
                    areasExpertise:areasExpertise,
                    platformId:platformId,
                    birthYear:resultBirthday,
                    customerId:t.customerId
                }
                var param = {};
                param.paramJson = $.toJSON(data);
                $.ajax({
                        type: "post",
                        url: '/mcall/customer/auth/updateBaseinfo/',
                        data: param,
                        dataType: "json",
                        success: function (rep) {
                            if(rep.responseObject.responseStatus){
                                $('input[name=platformId]').val(platformId);
                                $(".al-selectorBarList.ev-areasCon").attr({"platformid":platformId});
                                $("#areasExpertise").attr({preval:areasExpertise});
                            }
                        }
                })
            }
        },
        //擅长手术
        surgery:function(){
            var  t = this;
            $('.compile-surgery').on('click',function(){
                $('.al-mainInner').hide();
                $('.ev-surgery').show();
            });
            $(".ev_backBtn").off('click').on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'擅长手术修改取消',
                    actionId:45
                });
                t.saveNewAdditionBaseInfo();
                setTimeout(function() {
                    $('.al-mainInner').hide();
                    $('.ev-filed').show();
                }, 500);
            });
            $('.majorListOne').on('click', function (e) {
                var t = $(this).find('.arrow');  //当前对象下面的i标记
                var that = $(this).next('.majorListTwo');   //当前对象下一个兄弟aside(被隐藏部分)
                if(!t.hasClass('pickUp')){
                    t.addClass('pickUp');
                    that.show();
                }else{
                    t.removeClass('pickUp');
                    that.hide();
                }
            });
            function lightSave(){
            if($(".majorList .active").length>0){
                 $('.save-surgery').addClass('active');
            }else{
                 $('.save-surgery').removeClass('active');
            }
            }
            $('.option').on('click',function(){
                var parent = $(this).parent().find('.all');
                var all = $(this).parent().children();
                if(!$(this).hasClass("all")){
                    var t = $(this).find('.checkBox'); //当前对象下面i标记
                    t.toggleClass("active");
                   var  sumNum= $(this).parents(".majorListTwo").find(".option").length-1;
                   var  checkNum= 0;
                    $(all).each(function(){
                       if(!$(this).hasClass("all")&&($(this).find(".active").length===1)){
                           checkNum++
                       }
                    });
                    if(checkNum===sumNum){
                        $(parent).find(".checkBox").addClass("active");
                    }else{
                        $(parent).find(".checkBox").removeClass("active");
                    }
                    lightSave();
                }
            });
            $('.all').on('click',function(){
                var t = $(this).find('.checkBox'); //当前对象下面i标记
                t.toggleClass("active");
                if(t.hasClass("active")){
                    t.parent().siblings().find(".checkBox").addClass("active");
                }else{
                    t.parent().siblings().find(".checkBox").removeClass("active");
                }
                lightSave();
            });
            t.savesurgery();
        },
        //保存手术
        savesurgery: function(){
            var t = this;
            $(".save-surgery").off('click').on("click", function() {
                if ($(this).hasClass('active')&&$(this).attr('unBind')!=1) {
                    $(this).attr('unBind',1);
                    var attArr = [];
                    t.ele.surgeryStr = "";
                    var delSpecialtyIdList = '';
                    var subDot = function (str) {
                        var lastStr = "";
                        lastStr = str.substring(0, str.length - 1);
                        return lastStr;
                    };
                    $(".majorTitle").each(function(i,v){
                        var isThis = $(this);
                        var selectedOnOff = false;
                        isThis.next().find(".active").each(function(){
                            var isThisIt = $(this);
                            if(isThisIt.parent().attr('data-operationid')){
                                selectedOnOff = true;
                            }
                        });
                        if(selectedOnOff){
                            var tyId = "",tyName = "",idList = "",nameList = "";
                            isThis.next().find(".active").each(function(){
                                var innerItem = $(this);
                                if(innerItem.parent().attr('data-operationid')){
                                    t.ele.surgeryStr += $(this).parent().text()+'、';
                                    tyId=  innerItem.parents('.majorList').prev().attr('data-majorid');
                                    tyName =  innerItem.parents('.majorList').prev().text();
                                    idList += innerItem.parent().attr('data-operationid')+',';
                                    nameList += innerItem.parent().text()+',';
                                }
                            });
                            var dataJson = {
                                specialtyId: tyId,
                                specialtyName:tyName,
                                operationIdList: subDot(idList),
                                operationNameList:subDot(nameList)
                            };
                            $.each(t.data.operationList,function(index,val){
                                if(parseInt(val.specialtyId,10)===parseInt(dataJson.specialtyId,10)){
                                    dataJson.id = val.id;
                                    dataJson.isUpdate =1;
                                }
                            });
                            attArr.push(dataJson);
                        }
                    });
                    $.each(t.data.operationList,function(index,val){
                        var nothing = true;
                        $.each(attArr,function(innerIndex,item){
                            if(parseInt(val.id,10)===parseInt(item.id,10)){
                                nothing = false;
                            }
                        });
                        if(nothing){
                            delSpecialtyIdList+=val.id+',';
                        }
                    });
                    var data = {};
                    data.customerId = t.customerId;
                    data.delSpecialtyIdList = subDot(delSpecialtyIdList);
                    data.specialtyList = JSON.stringify(attArr);
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function (rep) {
                            $.ajax({
                                type: "get",
                                url: t.path.getInfo,
                                data: param,
                                dataType: "json",
                                success: function(res) {
                                    t.data.operationList = res.responseObject.responseData.data_list.operationList;
                                }
                            });
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $('.ev-mainInner').hide();
                                $('.ev-surgery').hide();
                                $('.ev-filed').show();
                                if (t.ele.surgeryStr) {
                                    $("#surgery").css("color", "#333");
                                    $("#surgery").html(t.ele.surgeryStr);
                                    t.txtAdd();
                                } else {
                                    $("#surgery").html('添加擅长手术，为您推荐更精准资源');
                                    $("#surgery").css("color", "#aaa");
                                }
                                popup("保存成功");
                                $(".save-surgery").attr('unBind',0);
                            } else {
                                popup("保存失败");
                                $(".save-surgery").attr('unBind',0);
                            }
                        },
                        error: function () {
                            $(".save-surgery").attr('unBind',0);
                            comm.loading.hide();
                        }
                    });
                }
            })
        },
        //编辑简介
        editSummary: function() {
            if($("#summary span").css('color')=='rgb(51, 51, 51)'){//表示已经填写过文字
                $('#summary').unbind();
                $(".compile-profile").show();
                $('.compile-profile').on('click',function () {
                    $(".ev-mainInner").hide();
                    $(".ev-summaryInner").show();
                });
            }else{
                $(".compile-profile").hide();
                $("#summary").on("click", function() {
                    $(".ev-mainInner").hide();
                    $(".ev-summaryInner").show();
                });
            }
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'个人简介修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-summaryInner").hide();
                }, 500);
            });
            $("#summaryIn").on("keyup change focus", function() {
                if ($(this).val().length === 0) {
                    $("#saveSummary").addClass('al-msgWriting');
                } else {
                    $("#saveSummary").removeClass('al-msgWriting');
                }
            });
            this.saveSummary();
        },
        //保存简介
        saveSummary: function() {
            var t = this;
            $("#saveSummary").on("click", function() {
                if ($("#summaryIn").val()) {
                    var data = {};
                    data.customerId = t.customerId;
                    data.summary = $("#summaryIn").val();
                    t.ele.data = htmlToString(data.summary);  //把编辑好的内容存到公共数据，在点击展开收起的时候调用226
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-summaryInner").hide();
                                if (t.ele.data) {
                                    $("#summary span").css("color", "#333");
                                    $(".ev-summary").find('span').html(comm.getStrLen(t.ele.data, 124));
                                    if(t.ele.data.length>62){
                                        $(".ev-expansion").show();
                                        $('.ev-expansion').html('展开<i></i>').removeClass('pickUp');
                                    }else{
                                        $(".ev-expansion").hide();
                                    }
                                } else {
                                    $("#summary").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            })
        },
        //编辑地址
        editAddress: function() {
            if($("#address").css('color')=='rgb(51, 51, 51)'){
                $("#address").unbind();
                $('.compile-address').show();
                $('.compile-address').on("click",function () {
                    $(".ev-mainInner").hide();
                    $(".ev-addressInner").show();
                })
            }else{
                $('.compile-address').hide();
                $("#address").on("click", function() {
                    $(".ev-mainInner").hide();
                    $(".ev-addressInner").show();
                });
            }
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'通讯地址修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-addressInner").hide();
                }, 500);

            });
            $("#addressIn").on("keyup", function() {
                if ($(this).val().length === 0) {
                    $("#saveAddress").addClass('al-msgWriting');
                } else {
                    $("#saveAddress").removeClass('al-msgWriting');
                }
            });
            var setSug=$("#addressIn");
            comm.textChange({'$tex':setSug,'$num':$("#Ev-settingSugNum"),'noTop':0,maxTop:0});
            setSug.on('focus',function(){
                $("#Ev-settingSugNum").show().html(100-parseInt(comm.getByteLen(setSug.val())));
                $("#ev-settingSugNum").css('float','right');
            }).on('blur',function(){
                $("#Ev-settingSugNum").hide();
            });
            this.saveAddress();
        },
        //保存地址
        saveAddress: function() {
            var t = this;
            $("#saveAddress").on("click", function() {
                if ($("#addressIn").val()) {
                    var data = {};
                    data.customerId = t.customerId;
                    data.addressId =  140;  //t.ele.addressId, // 是否写死(现已写死)
                    data.addressFull = $("#addressIn").val();
                    data.visitSiteId =2;
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-addressInner").hide();
                                if (data.addressFull) {
                                    $("#address").css("color", "#333");
                                    $("#address").text(data.addressFull);
                                    $(".compile-address").show();
                                } else {
                                    $("#address").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            })
        },
        //工作经历列表
        getOccupation: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.occList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                var sDay = val.startTime.substring(8, 10);
                                if (val.upNow == 1) {
                                    time = sYear + '/' + sMonth + '-至今';
                                } else {
                                    var eYear = val.endTime.substring(0, 4);
                                    var eMonth = val.endTime.substring(5, 7);
                                    var eDay = val.endTime.substring(8, 10);
                                    time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                                }
                                medicalTitle = "";
                                title = val.medicalTitle.indexOf(",") > 0 ? val.medicalTitle.split(",") : [val.medicalTitle];
                                $.each(title, function(j, n) {
                                    if (n) {
                                        medicalTitle += (n.split("_")[1] + "、");
                                    }
                                });
                                html += '<article class="al-tableModuleContent" occid=' + val.id + '>' +
                                    '<p>' + htmlToString(val.unit) + ' ' + htmlToString(val.address) + '</p>' +
                                    '<p>' + htmlToString(val.department) + '</p>' +
                                    '<p>' + medicalTitle.substring(0, medicalTitle.length - 1) + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-occList").html(html);
                                $(".ev-occList .editIcon").on("click", function() {
                                var href = "/pages/personal/occupation.html?id=" + $(this).parents('article').attr("occid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //教育背景列表
        getEducation: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.eduList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                var sDay = val.startTime.substring(8, 10);
                                if (val.upNow == 1) {
                                    time = sYear + '/' + sMonth + '-至今';
                                } else {
                                    var eYear = val.endTime.substring(0, 4);
                                    var eMonth = val.endTime.substring(5, 7);
                                    var eDay = val.endTime.substring(8, 10);
                                    time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                                }
                                html += '<article class="al-tableModuleContent" eduid="' + val.id + '">' +
                                    '<p>' + (val.city ? htmlToString(val.city) + ' ' : '') + htmlToString(val.university) + '</p>' +
                                    '<p>' + (val.major ? htmlToString(val.major) + ' ' : '') + val.education + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-eduList").html(html);
                            $(".ev-eduList .editIcon").on("click", function() {
                                var href = "/pages/personal/education.html?id=" + $(this).parents('article').attr("eduid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //继续教育列表
        getcEdu: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.cEduList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                //var sDay = val.startTime.substring(8, 10);
                                var eYear = val.endTime.substring(0, 4);
                                var eMonth = val.endTime.substring(5, 7);
                                //var eDay = val.endTime.substring(8, 10);
                                var time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                                html += '<article class="al-tableModuleContent" cEduid="' + val.id + '">' +
                                    '<p>' + htmlToString(val.organization) + '</p>' +
                                    '<p>' + htmlToString(val.cmeDesc) + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<p>' + htmlToString(val.certificate) + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-cEduList").html(html);
                            $(".ev-cEduList .editIcon").on("click", function() {
                                var href = "/pages/personal/cEducation.html?id=" + $(this).parents('article').attr("cEduid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //获得荣誉列表
        getHonor: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.honorList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" honorid="' + val.id + '">' +
                                    '<p>' + htmlToString(val.honorName) + '</p>' +
                                    '<p>' + htmlToString(val.awardDepartment) + '</p>' +
                                    '<span class="al-timeRange">' + val.awardYear + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-honorList").html(html);
                            $(".ev-honorList .editIcon").on("click", function() {
                                var href = "/pages/personal/honor.html?id=" + $(this).parents('article').attr("honorid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //科研基金列表
        getFund: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.fundList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" fundid="' + val.id + '">' +
                                    '<p>' + htmlToString(val.fundName) + '</p>' +
                                    '<p>' + htmlToString(val.fundCode) + '</p>' +
                                    '<span class="al-timeRange">' + val.approvalTime.substring(0, 4) + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-fundList").html(html);
                            $(".ev-fundList .editIcon").on("click", function() {
                                var href = "/pages/personal/fund.html?id=" + $(this).parents('article').attr("fundid");
                                g_sps.jump($(this),href);
                            });
                        }
                    }
                }
            });
        },
        //社会任职列表
        getSocial: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.socialList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var time = "";
                                if (val.upNow) {
                                    time = val.startTime.substring(0, 4) + '/' + val.startTime.substring(5, 7) + " ～ 至今";
                                } else {
                                    time = val.startTime.substring(0, 4) + '/' + val.startTime.substring(5, 7) + " ～ " + val.endTime.substring(0, 4) + '/' + val.endTime.substring(5, 7);
                                };
                                html += '<article class="al-tableModuleContent" socialid="' + val.id + '">' +
                                    '<p>' + val.organization + '</p>' +
                                    '<p>' + val.socialTitle + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-socialList").html(html);
                            $(".ev-socialList .editIcon").on("click", function() {
                                var href = "/pages/personal/social.html?id=" + $(this).parents('article').attr("socialid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //学术专著列表
        getOpus: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.opusList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                author = "";
                                switch (val.authorType) {
                                    case 1:
                                        author = "第一作者";
                                        break;
                                    case 2:
                                        author = "第一译者";
                                        break;
                                    case 3:
                                        author = "联合作者";
                                        break;
                                    case 4:
                                        author = "联合译者";
                                        break;
                                };
                                html += '<article class="al-tableModuleContent" opusid="' + val.id + '">' +
                                    '<p>' + htmlToString(val.opusName) + '</p>' +
                                    '<p>' + author + '</p>' +
                                    '<p>' + htmlToString(val.publisher) + '</p>' +
                                    '<span class="al-timeRange">' + val.publicationTime.substring(0, 4) + "/" + val.publicationTime.substring(5, 7) + '</span>' +
                                    '<p>' + htmlToString(val.information) + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';

                            });
                            $(".ev-opusList").html(html);
                            $(".ev-opusList .editIcon").on("click", function() {
                                var href = "/pages/personal/opus.html?id=" + $(this).parents('article').attr("opusid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //发明专利列表
        getPatent: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.patentList,
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" patentid="' + val.id + '">' +
                                    '<p>' + htmlToString(val.patentName) + '</p>' +
                                    '<p>' + htmlToString(val.patentCode) + '</p>' +
                                    '<span class="al-timeRange">' + val.patentTime.substring(0, 4) + "/" + val.patentTime.substring(5, 7) + '</span>' +
                                    '<p>' + val.country + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '<div class="editIcon"><i></i></div>'+
                                    '</article>';
                            });
                            $(".ev-patentList").html(html);
                            $(".ev-patentList .editIcon").on("click", function() {
                                var href = "/pages/personal/patent.html?id=" + $(this).parents('article').attr("patentid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        }
    };
    customerInfoEdit.init();
});
