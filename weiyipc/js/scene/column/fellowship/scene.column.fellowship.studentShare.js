/**
 * 功能描述：  学员分享页面
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/05/25.
 */

$(function(){
    var controller={
        config:{
            imgPath: "//modules.allinmd.cn/publish/",
            swf:"/js/third-party/uploadify/uploadify.swf",
            uploadImg:"//modules.allinmd.cn/publish/images/add_img.jpg",
            conUpload:"//modules.allinmd.cn/publish/images/add_img_small.jpg",
            customerId:$("#sesCustomerId").val(),
            fellowshipId:$("#fellowShipHiddenId").val(),
            maxImgNum:9,
            pageSize: 20,
            pageIndex: 1,
            useFlag: 3,
            attUseFlag:8
        },
        path:{
            shareListUrl:PC_CALL+"customer/fellowship/topic/getMapList/",//分享列表请求
            fellowStuUrl:PC_CALL+"customer/fellowship/topic/getShortList/",//是否进修用户
            infoCompleteUrl:PC_CALL+"customer/fellowship/topic/getSchoolList/",//学校信息是否完善
            nextBtnUrl:PC_CALL+"customer/fellowship/sub/update/",//下一步按钮
            topicCreate:PC_CALL+"topic/baseinfo/create/",
            topicUpdate:PC_CALL+"topic/baseinfo/update/",
            topicAttList:PC_CALL+"topic/attachment/json_list/",
            topicAttCreate:PC_CALL+"topic/attachment/create/",
            topicAttDelete:PC_CALL+"topic/attachment/delete/"
        },
        template:{
            fellowSharePopA:function(dataHtml){
                var html='';
                html='<div class="doc_tc Ev-SharePopPosition" style="z-index:9;background: #fff;">'+
                    '<!-- 发布遮罩 -->'+
                    '<div class="publish_mask">'+
                        '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                    '</div>'+
                    '<!-- 点击取消遮罩 -->'+
                    '<div class="cancel_mask"></div>'+
                    '<div class="upload_end">'+
                        '<div class="upload_question">接下来你想....</div>'+
                        '<div class="bjfb_but">'+
                            '<div>' +
                                '<a href="javascript:;">'+
                                    '<img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" />' +
                                '</a>' +
                            '</div>'+
                            '<div style="margin-left:25px;">' +
                                '<a href="javascript:;">' +
                                    '<img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" />' +
                                '</a>' +
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="fellowLayerTit">进修感想<a class="Ev-ShareCloseBtn" href="javascript:;">'+
                        '<img src="//img00.allinmd.cn/fellow/fs_v2/fellowshipClose.png" alt=""/></a>'+
                    '</div>'+
                    '<div class="fellowLayer clearFloat">'+
                        '<p class="scoolLef">进修学校</p>'+
                            '<div class="scoolRig">'+
                                '<select name="" id="Ev-SchoolSelect">'+
                                    dataHtml+
                                '</select>'+
                            '</div>'+
                    '</div>'+
                    '<div class="felLayer clearFloat">'+
                        '<p class="scoolLef">开始时间</p>'+
                        '<div class="scoolRig">'+
                            '<input id="Ev-StartTime" class="laydate-icon" onclick="laydate()">'+
                        '</div>'+
                        '<div class="fellowShipError Ev-StartTimeInfo hide"><span></span>开始时间不能为空！</div>'+
                    '</div>'+
                    '<div class="felLayer clearFloat">'+
                        '<p class="scoolLef">结束时间</p>'+
                        '<div class="scoolRig">'+
                            '<input id="Ev-EndTime" class="laydate-icon" onclick="laydate()">'+
                            '<div class="fellowShipError Ev-EndTimeInfo hide"><span></span>结束时间不能为空！</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="fellowshipBtn">'+
                        '<a href="javascript:;" class="nextA Ev-ShareNextBtn">下一步</a>'+
                        '<a href="javascript:;" class="defultA Ev-ShareCancelBtn">取消</a>'+
                    '</div>'+
                    '</div>';
                return html;
            },
            fellowSharePopB:function(kv){
                var html="";
                html='<div class="doc_tc Ev-SharePopPosition" id="topic" style="z-index:9;background: #fff;position: absolute;top:'+kv.top+'px;left:'+kv.left+'px">'+
                    '<!-- 发布遮罩 -->'+
                    '<div class="publish_mask">'+
                        '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                    '</div>'+
                    '<!-- 点击取消遮罩 -->'+
                    '<div class="cancel_mask"></div>'+
                    '<div class="upload_end">'+
                        '<div class="upload_question">接下来你想....</div>'+
                        '<div class="bjfb_but">'+
                            '<div>' +
                                '<a href="javascript:;">'+
                                    '<img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" />' +
                                '</a>' +
                            '</div>'+
                            '<div style="margin-left:25px;">' +
                                '<a href="javascript:;">' +
                                    '<img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" />' +
                                '</a>' +
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="fellowLayerTit">进修感想<a class="Ev-ShareCloseBtn" href="javascript:;">'+
                        '<img src="//img00.allinmd.cn/fellow/fs_v2/fellowshipClose.png" alt=""/></a>'+
                    '</div>'+
                    '<div class="fellowLayer">'+
                        '<div class="upload_center">'+
                            '<div class="uploadTop"></div>'+
                            '<div class="upload_title">'+
                                '<div class="found_case_small">'+
                                    '<div class="default_name font_yahei" style="display:none">标题</div>'+
                                    '<div class="input_write01">'+
                                        '<input type="text" id="toc_name" placeholder="标题" class="font_yahei" max="25">'+
                                    '</div>'+
                                    '<div class="djs_num toc_num">25</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="upload_textarea_topic">'+
                                '<div class="default_name font_yahei">正文</div>'+
                                '<div class="textarea_write">'+
                                    '<textarea placeholder="正文" id="toc_abstract" class="font_yahei" max="500"></textarea>'+
                                '</div>'+
                                '<div class="ds_text">500</div>'+
                            '</div>'+
                            '<div class="clear"></div>'+
                        '</div>'+
                        '<div class="add_img">'+
                        '<div class="add_content">请上传该话题的相关照片，jpg或png，单张不超过10M，最多'+ kv.maxImgNum+'张</div>'+
                        '<input type="file" name="uploadifyToc" id="uploadifyToc">' +
                    '</div>'+
                    '<div class="add_img_fangda">'+//style="max-height:450px;overflow-y: auto;width:650px;overflow-x: hidden"
                        '<ul id="topic_img_queue" data-img="">'+

                        '</ul>'+
                        '<div class="add_img_a">'+
                            '<a href="javascript:;">jpg或png，单张不超过10M还能上传<span class="is_num"></span>张</a>'+
                            '<input type="file" name="uploadifyTop_con" id="uploadifyTop_con">'+
                        '</div>'+
                        '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="t_but fellow_pub">'+
                        '<div class="publish_t_fb fellowship_fb Ev-FellowPublishBtn">发布</div>'+
                        '<div class="publish_t_qx Ev-ShareCancelBtn">取消</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';

                return html;
            }
        },
        init:function(){
            var t=this;
            t.login();
            t.fellowShareListShow();
        },
        ajaxFn:function(opt) {
                comm.LightBox.showloading();
                var cfg = opt;
                $.ajax({
                    url: cfg.url,
                    type: 'post',
                    data: {paramJson: $.toJSON(cfg.param)},
                    dataType: 'json',
                    async:opt.async?opt.async:true,
                    success: function (data) {
                        comm.LightBox.hideloading();
                        if (data) {
                            cfg.fn(data);
                        }
                    }
                });
        },
        //判断用户的进修状态，是否进修过
        login:function(){
            var t=this,
                val=$("#sesCustomerId").val(),
                customerFellowStatus;
            if(val){
                var data={};
                data.fellowshipId=t.config.fellowshipId;
                data.customerId=val;
                $.ajax({
                    url: t.path.fellowStuUrl,
                    type:"POST",
                    data:{paramJson: $.toJSON(data)},
                    dataType:"json",
                    success:function(data){
                        if(data&&data.responseObject){
                            customerFellowStatus=data.responseObject.state;
                            if(customerFellowStatus=="true"){//进修过，有分享资格
                                $(".Ev-FellowStuShareBtn").show().off("click").on("click",function() {
                                    if($(".Ev-FellowStuShareBtn").attr("data-flag")==1) {//阻止发布按钮多次创建话题
                                        $(this).attr("data-flag","0");
                                        var fellowshipMainType=$("#fellowshipMainType").val();
                                        if(fellowshipMainType==1){//国外进修
                                            t.publishShare();//判断是否填写进修学校
                                        }else{//国内进修和培训
                                            t.studentPublishSharePopB();
                                        }

                                    }
                                });
                            }
                        }
                    }
                });
            }
            t.LefRigBtnClick();
        },
        //学员分享列表展示
        fellowShareListShow:function(){
            var t=this,
                cfg= t.config;
            t.ajaxFn({
                url: t.path.shareListUrl,
                param:{
                    pageIndex:cfg.pageIndex,
                    pageSize:cfg.pageSize,
                    useFlag: cfg.useFlag,
                    attUseFlag:cfg.attUseFlag,
                    fellowshipId: cfg.fellowshipId
                   // fellowshipMainType:$("#fellowshipMainType").val()
                },
                fn:function(data){
                    t.addHtml(data);
                    $(".pager").pager({pagenumber: 1, pagecount: data.responseObject.pageCount, buttonClickCallback: PageClick});
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.path.shareListUrl,
                    param:{
                        pageIndex:pageclickednumber,
                        pageSize:cfg.pageSize,
                        useFlag: cfg.useFlag,
                        attUseFlag:cfg.attUseFlag,
                        fellowshipId: cfg.fellowshipId
                        //fellowshipMainType:$("#fellowshipMainType").val()
                    },
                    fn:function(data){
                        $(".pager").pager({pagenumber: pageclickednumber, pagecount: data.responseObject.pageCount, buttonClickCallback: PageClick});
                        t.addHtml(data);
                    }
                });
            };

        },
        //学员分享列表展示
        addHtml:function(data){
            var t=this, html='', html2="", html3="",
                stuShareList, topicAttUrl,//列表中的图片
                topicUrl,
                publishTime,
                medicalTitle,
                medicalTitleParam,
                fellowshipName;//进修学校
            var topicDiscuss,topicName;
            if(data&&data.responseObject.items.length>0){
                stuShareList=data.responseObject.items;
                for(var i=0;i<stuShareList.length;i++){
                    if(stuShareList[i].medicalTitle.indexOf("医师")>-1){
                        medicalTitleParam=comm.strHandle.cutDoctorTitle(comm.cutLine(stuShareList[i].medicalTitle, "_", ","));
                    }else{
                        medicalTitleParam=comm.strHandle.cutNotDoctorTitle(comm.cutLine(stuShareList[i].medicalTitle, "_", ","));
                    }
                    if(medicalTitleParam){//医师职称
                        medicalTitle='<span class="listBtn">'+medicalTitleParam+'</span>';
                    }else{
                        medicalTitle="";
                    }
                    if(stuShareList[i].fellowshipName){//进修学校名字
                        fellowshipName='<span>'+stuShareList[i].fellowshipName+'</span>';
                    }else{
                        fellowshipName="";
                    }
                    if(stuShareList[i].topic&&stuShareList[i].topic.topicAttUrl){
                        topicAttUrl=stuShareList[i].topic.topicAttUrl;
                    }else{
                        topicAttUrl="";
                    }

                    if(stuShareList[i].topic&&stuShareList[i].topic.topicUrl){
                        topicUrl=stuShareList[i].topic.topicUrl;
                    }else{
                        topicUrl="";
                    }


                    if(stuShareList[i].topic&&stuShareList[i].topic.publishTime){
                        publishTime=stuShareList[i].topic.publishTime.substring(0,10);
                    }else{
                        publishTime="";
                    }

                    if(stuShareList[i].topic&&stuShareList[i].topic.topicName){
                        topicName=comm.getStrLen(stuShareList[i].topic.topicName,94);
                    }else{
                        topicName="";
                    }

                    if(stuShareList[i].topic&&stuShareList[i].topic.topicDiscuss){
                        topicDiscuss=comm.getStrLen(stuShareList[i].topic.topicDiscuss,228);
                    }else{
                        topicDiscuss="";
                    }
                    if(topicAttUrl&&topicAttUrl.length>0){
                        html2="";
                        var LefRigShow="";
                        $.each(topicAttUrl,function(index,ele){//内层循环，  图片循环
                            html2+='<li><a target="_blank" href="'+topicUrl+'"><img src="'+ele+'"/></a></li>';
                            if(index>7){
                                LefRigShow='<a href="javascript:;" class="positionLef Ev-positionLef hide"><img src="//img00.allinmd.cn/fellow/fs_v2/positionLef.png"/></a>'+
                                    '<a href="javascript:;" class="positionRig Ev-positionRig"><img src="//img00.allinmd.cn/fellow/fs_v2/positionRig.png"/></a>';
                            }
                        });
                        html3='<div class="clearFloat_box">' +
                            LefRigShow+
                            '<ul class="clearFloat Ev-ul-ClearFloat">'+
                            html2+
                            '</ul>' +
                            '</div>';
                    }else{
                        html3="";
                    }
                    html+='<li class="fs_nass_listMain">'+
                        '<div class="fsListMainTop clearFloat">'+
                        '<div class="fsListMainLef">' +
                        '<a target="_blank" href="/pages/personal/others_contribution.html?cid='+ stuShareList[i].customerId+'">' +
                        '<img src="'+ (stuShareList[i].logoUrl?stuShareList[i].logoUrl:"//img10.allinmd.cn/default/customer/user_img65.png")+'"/>' +
                        '</a>' +
                        '</div>'+
                        '<div class="fsListMainRig">'+
                        '<div>' +
                        '<a target="_blank" href="/pages/personal/others_contribution.html?cid='+ stuShareList[i].customerId+'" class="lisName">'+ stuShareList[i].customerName+'</a>' +
                        medicalTitle +//职称
                        '</div>'+
                        '<p>'+ stuShareList[i].company+fellowshipName+'</p>'+//医院，进修学校
                        '</div>'+
                        '</div>'+
                        '<dl>'+
                        '<dt class="clearFloat">' +
                        '<a target="_blank" href="'+topicUrl+'">'+topicName+'</a><span>'+publishTime+'</span>' +
                        '</dt>'+//标题
                        '<dd>'+topicDiscuss+'</dd>'+//正文
                        '</dl>'+
                        html3+
                        '</li>';
                }
                $(".page-container").show();
                $(".Ev-ShareListShowOrHide").show();
                $(".Ev-ul-StudentShareListAppend").html(html);
                $(".Ev-NoShareShowOrHide").hide();
                $(".Ev-ul-ClearFloat").width($(".Ev-ul-ClearFloat li").outerWidth(true)*9);
                t.LefRigBtnClick();
            }else{//无学员分分享数据
                $(".Ev-NoShareShowOrHide").show();
            }
        },
        //图片左右滑动按钮
        LefRigBtnClick:function(){
            $(".Ev-positionRig").off("click").on("click",function(){
                $(this).siblings(".Ev-ul-ClearFloat").animate({right:($(this).siblings(".Ev-ul-ClearFloat").find("li").length-7)*$(".Ev-ul-ClearFloat li").outerWidth(true)},500);
                $(this).hide();
                $(this).siblings(".Ev-positionLef").show();

            });
            $(".Ev-positionLef").off("click").on("click",function(){
                $(this).siblings(".Ev-ul-ClearFloat").animate({right:0},500);
                $(this).hide();
                $(this).siblings(".Ev-positionRig").show();
            });
        },
        //判断是否填写进修学校
        publishShare:function(){
            var t=this;
            var schoolList;
            t.ajaxFn({
                url: t.path.infoCompleteUrl,
                param:{
                    fellowshipId:t.config.fellowshipId,
                    customerId:$("#sesCustomerId").val(),
                    isValid:1,
                    sortIdType:0
                },
                fn:function(data){
                    if(data&&data.responseObject){
                        if(data.responseObject.schoolList){
                            schoolList=data.responseObject.schoolList;
                                $("body").append(t.template.fellowSharePopA(t.studentPublishSharePopA(schoolList))).css("overflow","hidden");
                                comm.setCenter($(".doc_tc"));
                                comm.LightBox.show(50,"#000");
                                comm.LightBox.setZIndex(8);
                                t.sharePopResizePosition();
                                t.publishCancel();
                                t.popANextBtn();
                            }else {//registration:true
                                t.studentPublishSharePopB();
                            }
                    }
                }
            });
        },
        //发布分享弹层A页面，进修学校和时间的选择
        studentPublishSharePopA:function(data){
            var html="";
            $.each(data,function(i,e){
                html+='<option value="'+e.fellowshipSubName+'" data-subId="'+ e.fellowshipSubId+'">'+e.fellowshipSubName+'</option>';
            });
            return html;
        },
        //进修A页面的下一步按钮
        popANextBtn:function(){
            var t=this;
            $(".Ev-ShareNextBtn").off("click").on("click",function(){
                var startTime=$("#Ev-StartTime").val();
                var endTime=$("#Ev-EndTime").val();
                var NowDate=comm.date.local_time(new Date());
                var isSuccess=1;
                if(!startTime){
                    isSuccess=0;
                    $(".Ev-StartTimeInfo").show().html("<span></span>开始时间不能为空！");
                    $("#Ev-StartTime").addClass("fellowshipInput");
                }else{
                    if(!checkEndTime(startTime,NowDate)){
                        isSuccess=0;
                        $(".Ev-StartTimeInfo").show().html("<span></span>不能大于当前时间！");
                        $("#Ev-StartTime").addClass("fellowshipInput");
                    }else{
                        $(".Ev-StartTimeInfo").hide();
                        $("#Ev-StartTime").removeClass("fellowshipInput");
                    }
                }
                if(!endTime){
                    isSuccess=0;
                    $(".Ev-EndTimeInfo").show().html("<span></span>结束时间不能为空！");
                    $("#Ev-EndTime").addClass("fellowshipInput");
                }else{
                    if(!checkEndTime(endTime,NowDate)){
                        isSuccess=0;
                        $(".Ev-EndTimeInfo").show().html("<span></span>不能大于当前时间！");
                        $("#Ev-EndTime").addClass("fellowshipInput");
                    }else{
                        $(".Ev-EndTimeInfo").hide();
                        $("#Ev-EndTime").removeClass("fellowshipInput");
                    }
                }
                if(!checkEndTime(startTime,endTime)){
                    isSuccess=0;
                    $(".Ev-StartTimeInfo").show().html("<span></span>不能大于结束时间！");
                    $("#Ev-StartTime").addClass("fellowshipInput");
                }

                var statYear=startTime.substring(0,4),
                    statMonth=startTime.substring(5,7),
                    statDay=startTime.substring(8,10);
                var endYear=endTime.substring(0,4),
                    endMonth=endTime.substring(5,7),
                    endDay=endTime.substring(8,10);
                var fellowshipSubId=$("#Ev-SchoolSelect option:selected").attr("data-subId");
                var fellowshipSubName=$("#Ev-SchoolSelect option:selected").val();
                if(isSuccess){
                    t.ajaxFn({
                        url: t.path.nextBtnUrl,
                        param: {
                            customerId: $("#sesCustomerId").val(),
                            fellowshipId: t.config.fellowshipId,
                            fellowshipSubId:fellowshipSubId,
                            fellowshipSubName:fellowshipSubName,
                            statYear:statYear,
                            statMonth:statMonth,
                            statDay:statDay,
                            endYear:endYear,
                            endMonth:endMonth,
                            endDay:endDay,
                            sortId:0,
                            isValid:1
                            },
                        fn:function(data){}
                    });
                    comm.LightBox.hide();
                    $(".Ev-SharePopPosition").remove();
                    $("body").css("overflow","auto");
                    t.studentPublishSharePopB();
                }
            });
        },
        //发布分享弹层B页面, 标题、正文、图片的添加
        studentPublishSharePopB:function(){
            var t=this;
            var publishPopLeft=($(window).width()-713)/2;
            var publishPopTop=$(window).scrollTop()+100;
            $("body").append(t.template.fellowSharePopB({
                top:publishPopTop,
                left:publishPopLeft,
                maxImgNum: t.config.maxImgNum
            }))/*.css("overflow","hidden")*/;
            t.sharePopResizePosition();
            comm.LightBox.show(50,"#000");
            comm.LightBox.setZIndex(8);
            comm.textChange({"$tex":$("#toc_name"),"$num":$(".toc_num")});
            comm.textChange({"$tex":$("#toc_abstract"),"$num":$(".ds_text"),"minTop":14});
            t.create();
            t.publishCancel();
            t.publishBtnEvent();
        },
        //创建话题
        create:function(){
            var t=this;
            t.len=0;
            t.ajaxFn({
                url:t.path.topicCreate,
                fn: function (data) {
                    if(data.responseObject.responseStatus){
                        t.topicId=data.responseObject.responsePk;
                        t.uploadImg();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                }
            });
        },
        //上传图片处理插件
        uploadImg:function(){
            var t=this;
            $("#uploadifyToc").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.topicAttCreate,
                'formData'        : {'topicId':t.topicId},
                'auto'            : true,
                'width'           : 633,
                'height'          : 141,
                'buttonImage'     : t.config.uploadImg,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG)',
                'fileSizeLimit'   : 5120*2,//单个文件允许大小
                'uploadLimit'     : t.config.maxImgNum,//允许你设置同时上传文件的最大数量。
                'removeTimeout'   : 0.5,
                'onQueueComplete' :function(){
                    $("#uploadifyToc").animate({opacity:0,height:0},200,function(){
                        $(".add_img").hide();
                        $("#uploadifyToc").hide();
                        $("#uploadifyToc").css({height:141,opacity:1});
                    });
                    t.getImgList();
                }
            });
        },
        //继续上传
        conUpload:function(){
            var t=this;
            var maxNum=t.config.maxImgNum-this.len;
            $(".is_num").text(maxNum);
            $("#uploadifyTop_con").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.topicAttCreate,
                'formData'        : {"topicId":t.topicId},
                'auto'            : true,
                'width'           : 200,
                'height'          : 200,
                'buttonImage'     : t.config.conUpload,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG)',
                'fileSizeLimit'   : 5120*2,//单个文件允许大小
                'uploadLimit'     : maxNum,//允许你设置同时上传文件的最大数量。
                'removeTimeout'   : 0.5,
                //'removeCompleted' : false,//自动移除队列中已经完成上传的项目设置
                'onQueueComplete' :function(){
                    t.getImgList();
                }

            });
        },
        //获取上传图片列表
        getImgList:function(){
            var t=this;
            var params={};
            var data={};
            data.topicId=t.topicId;
            data.attUseFlag=AttUseFlag.g;
            params.paramJson= $.toJSON(data);
            $.ajax({
                url: t.path.topicAttList,
                type: "post",
                data: params,
                //dataType:"json",
                success: function (data) {
                    var html="";
                    if(data.responseObject.responseData){
                        var rows=data.responseObject.responseData.data_list;
                        $.each(rows,function(i,val){
                            if(i>t.len-1||t.len==0){//只加载最新添加的图片
                                html+='<li '+(i%3===2?'style="margin-right:0;"':'')+' listId="'+val.id+'">'+
                                    '<img class="pic" src="'+val.topicAttUrl+'">'+
                                    '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                                    '</li>';
                            }
                        });

                    }
                    $("#topic_img_queue").append(html);
                    t.len=rows.length;
                    t.conUpload();//继续添加图片
                    t.removeImg();

                    if(t.len<t.config.maxImgNum){
                        $(".add_img_a").show();
                    }else{
                        $(".add_img_a").hide();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){}
            });
        },
        //删除图片
        removeImg:function(){
            var t=this;
            $.each($(".removeico"),function(){
                $(this).live("click",function(){
                    var removeLi=$(this).parents("li");
                    $(".publish_mask").show();
                    var data={};
                    var param={};
                    data.id=$(this).parents("li").attr("listId");
                    param.paramJson= $.toJSON(data);
                    $.ajax({
                        url: t.path.topicAttDelete,
                        type: "post",
                        data: param,
                        dataType:"json",
                        success:function(data){
                            $(".publish_mask").hide();
                            if(data.responseObject.responseStatus){
                                removeLi.remove();
                                $("#topic_img_queue li").css("marginRight","16px");
                                $("#topic_img_queue li").each(function(i,em){
                                    if(i%3===2){
                                        $(em).css("marginRight","0");
                                    }
                                });
                                t.len=$("#topic_img_queue li").length;
                                if(t.len<t.config.maxImgNum){
                                    $(".add_img_a").show();
                                }
                                if(t.len==0){
                                    $("#uploadifyToc").show();
                                    $(".add_img").show();
                                    $(".add_img_a").hide();
                                }
                                t.conUpload();//继续添加图片
                            }else{
                                alert("删除失败");
                            }
                        }
                    });
                });
            });
        },
        //发布取消
        publishCancel:function(){
            var t=this;
            $(".Ev-ShareCloseBtn,.Ev-ShareCancelBtn").bind("click",function(){
                if($("#toc_name").val()==''&&$("#toc_abstract").val()==''&&$("#topic_img_queue li").length==0){
                    $(".Ev-SharePopPosition").remove();
                    $("body").css("overflow","auto");
                    comm.LightBox.hide();
                    if($(this).hasClass("Ev-ShareCloseBtn")){//关闭
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"fellowship学员分享关闭",
                            actionId:43
                        });
                    }else{
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"fellowship学员分享取消",
                            actionId:45
                        });
                    }
                }else{
                    $(".cancel_mask").show();
                    $(".upload_end").show();
                    if($(".upload_end",".Ev-SharePopPosition").height>window.innerHeight){
                        var top=(window.innerHeight-$(".upload_end",".Ev-SharePopPosition").height())/2+$(document).scrollTop();
                        $(".upload_end",".Ev-SharePopPosition").css({"top":top});
                    }else{
                        $(".upload_end",".Ev-SharePopPosition").css({top:50+'%'});
                    }
                    $(".continue_edit").bind("click",function(){
                        $(".cancel_mask").hide();
                        $(".upload_end").hide();
                    });
                    $(".cancel_pub").bind("click",function(){
                        $(".Ev-SharePopPosition").remove();
                        $("body").css("overflow","auto");
                        comm.LightBox.hide();
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"fellowship学员分享取消",
                            actionId:45
                        });
                    });
                }

                $(".Ev-FellowStuShareBtn").attr("data-flag","1");//阻止发布按钮多次创建话题
            });
        },
        //发布
        publishBtnEvent:function(){
            var t=this;
            var inputTitleContent,textareaContent,topicAttUrl;
            $(".Ev-FellowPublishBtn").off("click").on("click",function(){
                inputTitleContent=$("#toc_name").val();
                textareaContent=$("#toc_abstract").val();
                topicAttUrl= $("#topic_img_queue").attr("data-img");
                if(!inputTitleContent){
                    alert("标题不能为空");
                    return false;
                }
                if(!textareaContent){
                    alert("正文不能为空");
                    return false;
                }
                var shareImgSrc="";
               var  contentJsonData=[];
                contentJsonData.push({"content":$("#toc_abstract").val(),"contentType":"0","topicAttName":""});
                $("#topic_img_queue .pic").each(function(i,e){
                    if(/_c_t_200_200/.test($(e).attr("src"))){
                        shareImgSrc=$(e).attr("src").replace("_c_t_200_200","");
                    }else{
                        shareImgSrc=$(e).attr("src");
                    }
                    contentJsonData.push({"content":shareImgSrc,"contentType":"1","topicAttName":""});
                });
                t.ajaxFn({
                    url: t.path.topicUpdate,
                    param:{
                        fellowshipId: t.config.fellowshipId,
                        customerId: $("#sesCustomerId").val(),
                        topicId: t.topicId,
                        topicName:$("#toc_name").val(),
                        contentJson: contentJsonData,
                        topicType:3,
                        isValid:1
                    },
                    fn:function(data){
                        if(data.responseObject.responseStatus==true){
                                $(".publish_mask").hide();//关闭loading
                                $("#topic").remove();
                                $("body").css("overflow","auto");
                                comm.LightBox.hide();
                                $.topTip({mark:"success",showTime:2,content:"成功发布话题！"});
                                t.topicId="";
                            t.fellowShareListShow();
                        }else{
                            $(".publish_mask").hide();
                            $("#topic").remove();
                            $("body").css("overflow","auto");
                            comm.LightBox.hide();
                            $.topTip({mark:"warn",showTime:2,content:"未发布成功，请稍后再试！"});
                        }
                    }
                });


                $(".Ev-FellowStuShareBtn").attr("data-flag","1");//阻止发布按钮多次创建话题
            });
        },
        //遮罩弹层的重新定位
        sharePopResizePosition:function(){
            $(window).on('load resize',function(){
                $('.doc_tc').css({
                    left:($(window).width()-713)/2+'px'
                });
            })
        }
    };
    controller.init();
    scene.TopHeadLoginCallback= function(){
        controller.login();
        controller.fellowShareListShow();
    };
});