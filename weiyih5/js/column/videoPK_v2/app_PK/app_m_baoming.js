/**
 * Created by JuKun on 2016/9/20.
 */

$(function(){
    history.go(1);
    var data={
        customerId:appjs.getAuthorCustomerId(),
        activityId:$("#activityId").val()
    };
    var param={paramJson: $.toJSON(data)};
    $.ajax({
        url:"/mcall/activity/register/getRegisterStatus/",
        type:"post",
        data:param,
        dataType:"json",
        async:false,
        success:function(data){
            doStatus(data);
        },
        error:function(){
        }
    });
    function doStatus(data){
        if(data.responseObject.responseData&&data.responseObject.responseData.registerStatus){
            var status=data.responseObject.responseData.registerStatus;
            if(status.length>0){
                if(status==1){
                    $(".applyLeft").text("我要报名");

                }else{
                    $(".applyLeft").text("我要发布");
                    var url=getpara();
                    if(url.access){
                        var access=getpara().access;
                    }
                    if(access=="yes"){
                        $(".applyLeft").text("我要发布");
                        $("#zhezhao_baomingSuc").show();
                        $(".zhezhao_baomingSucCenter").show();
                        $("body").css("overflow","hidden")
                    }
                }
            }
        }
    }
    //判断用户登录状态：end--

    //个人信息填写：start--
    var datas={
        customerId:appjs.getAuthorCustomerId(),
        sessionCustomerId:appjs.getAuthorCustomerId(),
        dataFlag:3,
        logoUseFlag:4,
        pageIndex:1,
        pageSize:1,
        useFlag:1
    };
    $.ajax({
        url:"/mcall/customer/unite/json_list/",
        type:"get",
        data:datas,
        dataType:"json",
        async:false,
        success:function(data){
            if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                var data_list=data.responseObject.responseData.data_list;
                if(data_list.length>0){
                    doResult(data_list);
                }
            }
        },
        error:function(){
        }
    });
    function doResult(data_list){
        var userInfo=data_list[0].customer_auth;
        var addr=data_list[0].customer_unite;

        var userName=userInfo.lastName+userInfo.firstName;
        var titleShow=userInfo.medicalTitleShow;
        var company=userInfo.company;
        var email=addr.email;
        var mobile=addr.mobile;
        $(".per_name.per input").val(userName);
        $(".per_zc input").val(titleShow);
        $(".per_yy input").val(company);
        $(".per_yx input").val(email);
        $(".per_phone input").val(mobile);
    }
    $(".pk_submit").bind("click",function(){
        var customerId=appjs.getAuthorCustomerId();
        var userName= $(".per_name.per input").val();
        var titleShow=$(".per_zc input").val();
        var company=$(".per_yy input").val();
        var email=$(".per_yx input").val();
        var mobile=$(".per_phone input").val();
        var create={
            "customerId":customerId,
            "activityId":$("#activityId").val(),
            "name":userName,
            "company":company,
            "medicalTitle":titleShow,
            "contactEmail":email,
            "contactMobile":mobile
        };
        var createJson={paramJson: $.toJSON(create)};
        var kong = /\S/;
        var flagn = kong.test(titleShow);
        if(!flagn){
            $(".titleShow_tip").show();
            $(".per_zc").css("margin-bottom","0.5rem");
            $(".per_zc input").css("color","red");
        }else{
            $(".titleShow_tip").hide();
            $(".per_zc").css("margin-bottom","0");
            $(".per_zc input").css("color","#000");
        }
        if(email.length>0&&mobile.length>0){
            var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            var flage=filter.test(email);
            var flagm = reg.test(mobile);
            if(flage&&flagm){
                $.ajax({
                    url:"/mcall/activity/register/create/",
                    type:"post",
                    data:createJson,
                    dataType:"json",
                    async:true,
                    success:function(data){
                      g_sps.jump(null,"/html/app/activity/new/"+$('#activityId').val()+"/activity_index.html?activityId="+$('#activityId').val()+"&access=yes");
                    },
                    error:function(){
                    }
                });
            }else{
                if(!flage){
                    $(".email_tip").show();
                    $(".per_yx").css("margin-bottom","0.5rem");
                    $(".per_yx input").css("color","red");

                }
                if(!flagm){
                    $(".phone_tip").show();
                    $(".per_phone").css("margin-top","0.6rem");
                    $(".per_phone input").css("color","red");
                }
            }
        }else{
            if(email==null){
                $(".email_tip").show();
                $(".phone_tip").hide()
            }
            if(mobile==null){
                $(".phone_tip").show();
                $(".email_tip").hide();
            }
        }
    });
    $(".per_phone input").bind("keyup",function(){
        $(".per_phone input").css("color","#000");
        if($(this).val().length>0){
            $(".pk_submit").removeClass("pk_submit_no").addClass("pk_submit_yes");
        }else{
            $(".phone_tip").hide();
            $(".per_phone").css("margin-top","0");
            $(".pk_submit").removeClass("pk_submit_yes").addClass("pk_submit_no");
        }
    });
    $(".per_yx input").bind("keyup",function(){
        $(".per_phone input").css("color","#000");
        if($(this).val().length>0){
            $(".pk_submit").addClass("pk_submit_yes").removeClass("pk_submit_no");
        }else{
            $(".email_tip").hide();
            $(".per_yx").css("margin-bottom","0");
            $(".pk_submit").addClass("pk_submit_no").removeClass("pk_submit_yes");
        }
    });

    $(" .baoming_success").on("click",function(){
        $("#zhezhao_baomingSuc").hide();
        $($(this).parent()).hide();
        $("body").css("overflow","scroll")
    });

    $(".apply_and_share .applyLeft").on("click",function(){
        if($(this).text()=="我要发布"){
            $("#zhezhao_baomingSuc").show();
            $(".zhezhao_fabuTip").show();
            $("body").css("overflow","hidden")
        }else{
            appjs.signup();
            if(appjs.getIsSignuped()==true){
                if($(".apply_and_share .applyLeft").text()=="我要报名"){
                    var customerId=appjs.getAuthorCustomerId();
                    if(customerId){
                      g_sps.jump(null,"/pages/column/videoPK_v2/app_PK/app_m_baoming.html?activityId="+$('#activityId').val());
                    }
                }
            }
        }
    })
});
/**
 * 功能描述：  职称选择
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/15.
 */
module.medicalTitle=function(obj){
    var controller = {
        path : {
            medical:M_CALL+"comm/data/medicalTitle/json_list/"
        },
        init : function(options){
            var t=this;
            this.options={};
            var o = {callback:function(){}};
            this.options = $.extend(o,options);
            html='<!-- 选择职称  -->'+
                '<section class="al-selectorBarMask ev-medBox">'+
                '<section class="al-selectorBar">'+
                '<header class="al-selectorBarTitle">'+
                '<figure class="al-selectorBarTitleItem al-selectorBarCancel">'+
                '<a href="javascript:void(0)" class="ev-medCancel">取消</a>'+
                '</figure>'+
                '<figure class="al-selectorBarTitleItem">'+
                '<h2>选择职称</h2>'+
                '</figure>'+
                '<figure class="al-selectorBarTitleItem">'+
                '<a href="javascript:void(0)" class="ev-medSave">完成</a>'+
                '</figure>'+
                '</header>'+
                '<section class="al-selectorBarList" id="ev-medical01">'+

                '</section>'+
                '<section class="al-selectorBarList" id="ev-medical02">'+

                '</section>'+
                '<section class="al-selectorBarList" id="ev-medical03">'+

                '</section>'+
                '</section>'+
                '</section>';
            $("body").append(html);
            this.getData();
            t.options.container.parents(".per_zc").on("click",function(){
                $(".al-selectorBarMask").addClass('on');
            });
        },
        getData:function(){
            var t=this;
            var html1=html2=html3="";
            $.ajax({
                type : "post",
                url : t.path.medical,
                async: false,
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            if(i<4){
                                html1+='<section class="al-selectorBarItem" select="no">'+
                                    '<figure class="al-selectorBarItemIcon"></figure>'+
                                    '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                    '</section>';
                            }else if(i<7){
                                html2+='<section class="al-selectorBarItem" select="no">'+
                                    '<figure class="al-selectorBarItemIcon"></figure>'+
                                    '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                    '</section>';
                            }else{
                                html3+='<section class="al-selectorBarItem" select="no">'+
                                    '<figure class="al-selectorBarItemIcon"></figure>'+
                                    '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                    '</section>';
                            }
                        });
                        $("#ev-medical01").html(html1);
                        $("#ev-medical02").html(html2);
                        $("#ev-medical03").html(html3);
                        t.listAction();
                    };

                }
            });
        },
        listAction:function(){
            var t=this;
            var html="";
            var str="";
            $(".al-selectorBarList",".ev-medBox").each(function(i,em){
                $(".al-selectorBarItem",$(em)).each(function(j,obj){
                    $(obj).on("click",function(){
                        html="";
                        str="";
                        if($(this).attr("select")=="no"){
                            $(".al-selectorBarItem",$(em)).attr("select","no");
                            $(".al-selectorBarItem",$(em)).removeClass("selected");
                            $(this).addClass("selected");
                            $(this).attr("select","yes");
                        }else{
                            $(this).removeClass("selected");
                            $(this).attr("select","no");
                        }

                    });
                });
            });
            $(".ev-medSave").on("click",function(){
                var html="";
                var str="";
                $(".al-selectorBarItem",".ev-medBox").each(function(n,val){
                    if($(val).attr("select")=="yes"){
                        html+=$("figcaption",$(val)).text()+"，";
                        str+=$("figcaption",$(val)).attr("medicalid")+"_"+$("figcaption",$(val)).text()+",";
                    }
                });
                t.options.container.val(html.substring(0,html.length-1));
                t.options.container.attr("medicalTitle",str.substring(0,str.length-1));
                if(html){
                    t.options.container.css("color","#000");
                }else{
                    t.options.container.css("color","#aaa").val("请选择职称");
                }
                $(".al-selectorBarMask").removeClass('on');
            });
            $(".ev-medCancel").on("click",function(){
                $(".al-selectorBarMask").removeClass('on');
            })
        }
    };
    controller.init(obj);
}
module.medicalTitle({
    container:$(".per_zc input")
})