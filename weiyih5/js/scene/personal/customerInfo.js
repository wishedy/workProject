/**
 * 功能描述：  个人中心简介
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/13.
 */
$(function(){
    //window.onload = Log.createBrowse(8,'我的资料页面');
    var customerInfo={
        path:{
            inforate:M_CALL + "comm/data/inforate/queryCustomerInforate/",//简介百分比
            occList:M_CALL + "customer/occupation/json_list/",//工作经历
            eduList:M_CALL + "customer/education/json_list/",//教育背景
            cEduList:M_CALL + "customer/continue/education/json_list/",//继续教育
            honorList:M_CALL + "customer/honor/json_list/",//获得荣誉
            fundList:M_CALL + "customer/fund/json_list/",//科研基金
            socialList:M_CALL + "customer/social/json_list/",//社会任职
            opusList:M_CALL + "customer/opus/json_list/",//学术专著
            patentList: M_CALL + "customer/patent/json_list/"//发明专利
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            if(!this.customerId){
               return;
            }
            this.getInforate();
            this.getBase();
            this.getOccupation();
            this.getEducation();
            this.getcEdu();
            this.getHonor();
            this.getFund();
            this.getSocial();
            this.getOpus();
            this.getPatent();
        },
        //获取简介百分比
        getInforate:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.inforate,
                data : {paramJson: $.toJSON({customerId: t.customerId})},
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject.responseData){
                        if(typeof(rep.responseObject.responseData.rate)!=="undefined"){
                            
                            var rate=rep.responseObject.responseData.rate+"%";
                            $(".ev-inforate").css({width:rate});
                            $(".ev-inforateNum").text(rate);
                            if(rate=="100%"){//简介已完善
                                $(".ev-infoText").text("你的简介已完善，能有更多人认识你了");
                                $(".ev-inforate100").show();
                            }else{//简介未完善
                                $(".ev-inforateNo100").show();
                            }
                        }else{
                            $(".ev-inforateNo100").show();
                        }
                    }
                },
                error:function(){}
            });
        },
        //获取基本信息
        getBase:function(){
            var unit=responseData.customer_unite;
            var baseInfo=responseData.customer_baseinfo;
            var auth=responseData.customer_auth;
            var csc=responseData.customer_statistic;
            var att=responseData.customer_att;
            var sex="";
            var name="";
            if(auth.lastName){
                name=comm.getStrLen((auth.lastName+auth.firstName),30)+" ";
            }
            var birthday=auth.birthYear||baseInfo.birthday;
            var birth="";
            if(birthday&&!$.isEmptyObject(birthday)){
                birth=birthday.substring(0,4)+"年"+birthday.substring(5,7)+"月"+birthday.substring(8,10)+"日"
            }
            if (baseInfo.sexId == "1") {
                sex="男 ";
            }
            if (baseInfo.sexId == "2") {
                sex="女 ";
            }
            //临床时间
            if(auth.clinicalTime&&auth.clinicalTime!=0){
                $('.ev-clinicalTime').text('临床时间'+auth.clinicalTime+'年');
            }
            $(".ev-nameSex").text(name+sex+birth);
            if(auth.state==1 || auth.state==2 ) {//认证

            }else{

            }
            if(auth.platformId==1){
                $('.ev_platform').text('骨科');
            }else if(auth.platformId==2){
                $('.ev_platform').text('手外科');
            }
            $(".ev-medicalTitle").text(comm.cutLine(auth.medicalTitle, "_", "，"));
            $(".ev-company").text(auth.workplace);
            var area = auth.areasExpertise;
            var area1 = area.split(",");
            var areaHtml = "";
            $.each(area1, function (i, val) {
                if (val) {
                    if (val.split("_")[1]) {
                        areaHtml+='<button>' + val.split("_")[1] + '</button>';
                    }
                }
            });
            $(".ev-areas").html(areaHtml);
            var summary=baseInfo.summary;
            if(comm.getByteLen(summary)>124){
                summaryNew=comm.getStrLen(summary,124);
                $(".ev-expansion").show();
            }else{
                summaryNew=summary;
            }

            $(".ev-summary").find('span').html(summaryNew);
            /*$(".ev-expansion").on("click",function(){
                $(".ev-summary").html(summary);

            });*/
            var dataFlag = 0;
            $(".ev-expansion").on('click',function(){
                if(dataFlag == 1){
                    $(".ev-summary").find('span').html(summaryNew);
                    $(this).html('展开<i></i>').removeClass('pickUp');
                    dataFlag = 0;
                }else{
                    $(".ev-summary").find('span').html(summary);
                    $(this).html('收起<i></i>').addClass('pickUp');

                    dataFlag = 1;
                }
            });
            if(auth.lastName||auth.firstName||(!$.isEmptyObject(baseInfo.sexId)||baseInfo.sexId>0)||baseInfo.birthday||auth.workplace||auth.medicalTitle||auth.areasExpertise){
                $(".ev-hasInfo").show();
                $(".ev-goInfo").hide();
            }else{
                $(".ev-hasInfo").hide();
                $(".ev-goInfo").show();
                $(".ev-hasbase").hide();
                if(baseInfo.summary){
                    $(".ev-summaryno").hide();
                    $(".ev-hasInfo").show();
                }else{
                    $(".ev-summaryhas").hide();
                }
                $(".ev-goInfo").on("click",function(){
                    g_sps.jump($(this),"/pages/personal/customerInfoEdit.html");
                })
            }
        },
        //工作经历列表
        getOccupation:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.occList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                var sYear=val.startTime.substring(0,4);
                                var sMonth=val.startTime.substring(5,7);
                                var sDay=val.startTime.substring(8,10);
                                if(val.upNow==1){
                                    time=sYear+'/'+sMonth+'-至今';
                                }else{
                                    var eYear=val.endTime.substring(0,4);
                                    var eMonth=val.endTime.substring(5,7);
                                    var eDay=val.endTime.substring(8,10);
                                    time=sYear+'/'+sMonth+'-'+eYear+'/'+eMonth;
                                }
                                medicalTitle="";
                                title=val.medicalTitle.indexOf(",")>0?val.medicalTitle.split(","):[val.medicalTitle];
                                $.each(title,function(j,n){
                                    if(n){
                                        medicalTitle+=(n.split("_")[1]+"、");
                                    }
                                })
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.unit+' '+val.address+'</p>'+
                                '<p>'+val.department+'</p>'+
                                '<p>'+medicalTitle.substring(0,medicalTitle.length-1)+'</p>'+
                                '<span class="al-timeRange">'+time+'</span>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-occList").parent().show();
                            $(".ev-occList").html(html);
                        }

                    }
                }
            });
        },
        //教育背景列表
        getEducation:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.eduList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                var sYear=val.startTime.substring(0,4);
                                var sMonth=val.startTime.substring(5,7);
                                var sDay=val.startTime.substring(8,10);
                                if(val.upNow==1){
                                    time=sYear+'/'+sMonth+'-至今';
                                }else{
                                    var eYear=val.endTime.substring(0,4);
                                    var eMonth=val.endTime.substring(5,7);
                                    var eDay=val.endTime.substring(8,10);
                                    time=sYear+'/'+sMonth+'-'+eYear+'/'+eMonth;
                                }
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+(val.city?val.city+' ':'')+val.university+'</p>'+
                                '<p>'+(val.major?val.major+' ':'')+val.education+'</p>'+
                                '<span class="al-timeRange">'+time+'</span>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-eduList").parent().show();
                            $(".ev-eduList").html(html);
                        }

                    }
                }
            });
        },
        //继续教育列表
        getcEdu:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.cEduList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                var sYear=val.startTime.substring(0,4);
                                var sMonth=val.startTime.substring(5,7);
                                var sDay=val.startTime.substring(8,10);
                                var eYear=val.endTime.substring(0,4);
                                var eMonth=val.endTime.substring(5,7);
                                var eDay=val.endTime.substring(8,10);
                                var time=sYear+'/'+sMonth+'/'+sDay+'/-'+eYear+'/'+eMonth+'/'+eDay;
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.organization+'</p>'+
                                '<p>'+val.cmeDesc+'</p>'+
                                '<span class="al-timeRange">'+time+'</span>'+
                                '<p>'+val.certificate+'</p>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-cEduList").parent().show();
                            $(".ev-cEduList").html(html);
                        }

                    }
                }
            });
        },
        //获得荣誉列表
        getHonor:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.honorList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.honorName+'</p>'+
                                '<p>'+val.awardDepartment+'</p>'+
                                '<span class="al-timeRange">'+val.awardYear+'</span>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-honorList").parent().show();
                            $(".ev-honorList").html(html);
                        }

                    }
                }
            });
        },
        //科研基金列表
        getFund:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.fundList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.fundName+'</p>'+
                                '<p>'+val.fundCode+'</p>'+
                                '<span class="al-timeRange">'+val.approvalTime.substring(0,4)+'</span>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-fundList").parent().show();
                            $(".ev-fundList").html(html);
                        }
                    }
                }
            });
        },
        //社会任职列表
        getSocial:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.socialList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                var time="";
                                if(val.upNow){
                                    time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+" ～ 至今";
                                }else{
                                    time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+" ～ "+val.endTime.substring(0,4)+'/'+val.endTime.substring(5,7);
                                }
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.organization+'</p>'+
                                '<p>'+val.socialTitle+'</p>'+
                                '<span class="al-timeRange">'+time+'</span>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-socialList").parent().show();
                            $(".ev-socialList").html(html);
                        }

                    }
                }
            });
        },
        //学术专著列表
        getOpus:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.opusList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                author="";
                                switch	(val.authorType){
                                    case 1:
                                        author="第一作者";
                                        break;
                                    case 2:
                                        author="第一译者";
                                        break;
                                    case 3:
                                        author="联合作者";
                                        break;
                                    case 4:
                                        author="联合译者";
                                        break;
                                }
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.opusName+'</p>'+
                                '<p>'+author+'</p>'+
                                '<p>'+val.publisher+'</p>'+
                                '<span class="al-timeRange">'+val.publicationTime.substring(0,4)+"/"+val.publicationTime.substring(5,7)+'</span>'+
                                '<p>'+val.information+'</p>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-opusList").parent().show();
                            $(".ev-opusList").html(html);
                        }

                    }
                }
            });
        },
        //发明专利列表
        getPatent:function(){
            var t=this;
            var html="";
            var data={};
            data.customerId=this.customerId;
            data.languageFlag=0;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url: t.path.patentList,
                data:data,
                dataType:"json",
                success : function callback(rep) {
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var rows=rep.responseObject.responseData.data_list;
                            $.each(rows,function(i,val){
                                html+='<article class="al-tableModuleContent">'+
                                '<p>'+val.patentName+'</p>'+
                                '<p>'+val.patentCode+'</p>'+
                                '<span class="al-timeRange">'+val.patentTime.substring(0,4)+"/"+val.patentTime.substring(5,7)+'</span>'+
                                '<p>'+val.country+'</p>'+
                                '</article>';
                            });
                            $(".ev-hasInfo").show();
                            $(".ev-patentList").parent().show();
                            $(".ev-patentList").html(html);
                        }

                    }
                }
            });
        }
    }
    customerInfo.init();

})
