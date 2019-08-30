/**
 * 功能描述：  他人资料页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/9/1.
 */
$(function(){
    //window.onload = Log.createBrowse(68,'他人简介页面');
   var othersBaseInfo={
       path:{
           occList:M_CALL + "customer/occupation/json_list/",//工作经历
           eduList:M_CALL + "customer/education/json_list/",//教育背景
           cEduList:M_CALL + "customer/continue/education/json_list/",//继续教育
           honorList:M_CALL + "customer/honor/json_list/",//获得荣誉
           fundList:M_CALL + "customer/fund/json_list/",//科研基金
           socialList:M_CALL + "customer/social/json_list/",//社会任职
           opusList:M_CALL + "customer/opus/json_list/",//学术专著
           patentList: M_CALL + "customer/patent/json_list/"//发明专利
       },init:function(){
           this.cid=comm.getpara().cid;
           this.refId=TempCache.getItem("userId");//登录人id
           if(this.cid === this.refId){//是自己
             g_sps.jump(null,"/pages/personal/personal_customerInfo.html");
           }
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
      //获取基本信息
       getBase:function(){
           var t=this;
           t.responseData=othersData;
           var baseInfo=t.responseData.customer_baseinfo;
           var auth=t.responseData.customer_auth;
           var sex="";
           var name="";
           if(auth.lastName){
               name=auth.lastName+auth.firstName+" ";
           }
           var birthday=auth.birthYear||baseInfo.birthday;
           var birth="";
           if(birthday){
               birth=birthday.substring(0,4)+"-"+birthday.substring(5,7)+"-"+birthday.substring(8,10);
           }
           if (baseInfo.sexId == "1") {
               sex="男 ";
           }
           if (baseInfo.sexId == "2") {
               sex="女 ";
           }
           $(".ev-nameSex").text(name+sex+birth);
          
           //临床时间
           if(auth.clinicalTime&&auth.clinicalTime!=0){
               $('.ev-clinicalTime').text('临床时间'+auth.clinicalTime+'年');
           }
           if(auth.platformId==1){
               $('.ev-platform').text('骨科');
           }else if(auth.platformId==2){
               $('.ev-platform').text('手外科');
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
           var summaryNew ="";
           if(summary){
               $(".ev-summaryPar").show();
           }
           if(comm.getByteLen(summary)>124){
               summaryNew=comm.getStrLen(summary,124)+'<b class="al-contentShow ev-expansion">展开</b>';
           }else{
               summaryNew=summary;
           }
           $(".ev-summary").html(summaryNew);
           $(".ev-summary").on("click",'.ev-expansion',function(){
               $(".ev-summary").html(summary+'<b class="al-contentShow pickUp ev-fold">收起</b>');
           });
           $(".ev-summary").on("click",'.ev-fold',function(){
               $(".ev-summary").html(summaryNew);
           });
       },
       //工作经历列表
       getOccupation:function(){
           comm.loading.show();
           var t=this;
           var html="";
           var data={};
           data.customerId=this.cid;
           data.languageFlag=0;
           data.pageIndex=1;
           data.pageSize=100;
           $.ajax({
               type:'POST',
               url: t.path.occList,
               data:data,
               dataType:"json",
               success : function callback(rep) {
                   comm.loading.hide();
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
           data.customerId=this.cid;
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
           data.customerId=this.cid;
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
           data.customerId=this.cid;
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
           data.customerId=this.cid;
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
           data.customerId=this.cid;
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
                               };
                               html+='<article class="al-tableModuleContent">'+
                               '<p>'+val.organization+'</p>'+
                               '<p>'+val.socialTitle+'</p>'+
                               '<span class="al-timeRange">'+time+'</span>'+
                               '</article>';
                           });
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
           data.customerId=this.cid;
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
                               };
                               html+='<article class="al-tableModuleContent">'+
                               '<p>'+val.opusName+'</p>'+
                               '<p>'+author+'</p>'+
                               '<p>'+val.publisher+'</p>'+
                               '<span class="al-timeRange">'+val.publicationTime.substring(0,4)+"/"+val.publicationTime.substring(5,7)+'</span>'+
                               '<p>'+val.information+'</p>'+
                               '</article>';
                           });
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
           data.customerId=this.cid;
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
                           $(".ev-patentList").parent().show();
                           $(".ev-patentList").html(html);
                       }

                   }
               }
           });
       }
   };
   othersBaseInfo.init();
});
