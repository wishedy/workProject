/**
 * 功能描述：  赞，粉丝，关注的用户列表
 * 使用方法:   module.userList({
 *              customerId:"123",//本人id
 *              type:"praise",//类型
 *              container:".XXX",//存放列表的容器
 *              pageTotal:30,//总页数
 *              pageSize:16,//每页的数量
 *              pagination:".pager",//分页容器
 *            });
 * 注意事件：
 * 引入来源：  //分页
 *            <link href="/js/third-party/pagination/pager.css" rel="stylesheet" type="text/css"/>
 *            <script src="/js/third-party/pagination/jquery.pager.js"></script>
 *            //关注
 *            <script src="/js/plugins/follow/plugin.follow.js"></script>
 *            //延迟加载
 *            <script src="/js/third-party/jquery_lazyload/jquery.lazyload.min.js" type="text/javascript"></script>
              <script src="/js/third-party/jquery_lazyload/jquery.scrollstop.js" type="text/javascript"></script>
 *            (认证的一些引用文件)
 *           作用：分页
 *
 * Created by LiChunHui on 2015/4/16.
 */
module.userList=function(Obj){
    var controller={
        path:{
            praise:PC_CALL+"prefer/json_list/",//赞
            fans:PC_CALL+"customer/follow_fans/json_list/",//粉丝
            follow:PC_CALL+"customer/follow_people/json_list/"//关注
        },
        init:function(Obj){
            var t = this;
            t.options={};
            var o={

            };
            t.options= $.extend(o,Obj);
            this.getUserList();
        },
        getParam:function(pageIndex){
        		var t =this;
            var data={};
            var params={};
        		if(t.options.type!=="praise"){
	            data.customerId=t.options.customerId;
	            data.useFlag=UseFlag.c;
	            data.logoUseFlag=3;
	            data.pageIndex=pageIndex;//第几页
	            data.pageSize= t.options.pageSize;//每一页的数量
	            params.paramJson = $.toJSON(data);
        		}else{ //赞方式
        			data.usefulType = 9;
        			data.refId=t.options.customerId;
        			data.useFlag=UseFlag.c;
        			data.logoUseFlag=3;
        			data.pageIndex=pageIndex;//第几页
        			data.pageSize= t.options.pageSize;//每一页的数量
        			params.paramJson = $.toJSON(data);
        		}
            return params;
        },
        getUserList:function(){
            var t=this;
            switch (t.options.type){
                case "praise"://赞
                    url= t.path.praise;
                    break;
                case "fans"://粉丝
                    url= t.path.fans;
                    break;
                case "follow"://关注
                    url= t.path.follow;
            }
            pagecount= Math.ceil(t.options.pageTotal/t.options.pageSize);
            
            $.ajax({
                type : "post",
                url : url,
                data : t.getParam(1),
                dataType : "json",
                success : function(rep){
                    if(rep){
                        t.getHtml(rep.responseObject);
                        $(t.options.pagination).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                    }else{
                    		t.options.container("<div class=\"no_dongtai font_yahei\">暂无数据！</div>");
                    }
                },
                error:function(){}
            });
            PageClick = function(pageclickednumber){
                $.ajax({
                    type : "post",
                    url : url,
                    data : t.getParam(pageclickednumber),
                    dataType : "json",
                    success : function(rep){
                        if(rep){
                            t.getHtml(rep.responseObject);
                            $(t.options.pagination).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                        }
                    },
                    error:function(){}
                });
            };
        },
        getHtml:function(data){
            var t=this;
            var html="";
            var arrHT=[];
            switch (t.options.type){
                case "praise"://赞
                    rows=data.responseData.data_list;
                    break;
                case "fans"://粉丝
                    rows= data;
                    break;
                case "follow"://关注
                    rows= data.responseData.data_list;
            }
            
            if(rows&&rows.length>0){
                $.each(rows,function(i,val){
                    var logo; var auth; var base; var fans; var statistic;
                    if(val.customer_att){
                        logo=val.customer_att;
                    }
                    if(val.customer_auth){
                        auth=val.customer_auth;
                    }
                    if(val.customer_baseinfo){
                        base=val.customer_baseinfo;
                    }
                    if(val.customer_statistic){
                        statistic=val.customer_statistic;
                    }
                    
                    fans=val.customer_fans?val.customer_fans:val.customer_people;
                    name=auth.lastName?auth.lastName+auth.firstName:"";
                    medicalTitle=comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",","))?"<span>"+comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",","))+"</span>":"";
                    company=auth.company?comm.getStrLen(auth.company,22):"";
                    
                    if(t.options.type === "praise"){ //赞时customerId从auth中取
                    		fans = {};
                			fans.relationship = val.customer_relationship;
                			base.customerId = val.customer_auth.customerId;
                    }
                    
                    //蓝色或灰色数据
                    var followpeopleNum = parseInt((statistic.followOrgNum?statistic.followOrgNum:statistic.followpeopleNum)),followHtml = "";
                    if(followpeopleNum===0) followHtml = '<span class="info_num" style="color:#969696">'+followpeopleNum+'</span>' ;
                    else followHtml = '<span class="info_num">'+followpeopleNum+'</span>';
                    
                    var fansNum = parseInt(statistic.fansNum),fansHtml = "";
                    if(fansNum===0) fansHtml = '<span class="info_num" style="color:#969696">'+fansNum+'</span>';
                    else  fansHtml = '<span class="info_num">'+fansNum+'</span>';
                    
                    var trendsNum = parseInt(statistic.trendsNum),trendsHtml = "";
                    if(trendsNum===0) trendsHtml = '<span class="info_num" style="color:#969696">'+trendsNum+'</span>';
                    else trendsHtml = '<span class="info_num">'+trendsNum+'</span>';
                    
                    html= '<div class="list_info_bg">'+
                    '<div class="info_left"><a href="/pages/personal/others_contribution.html?cid='+base.customerId+'" target="_blank"><img src="//modules.allinmd.cn/user-list/images/65_65.jpg" data-original="'+logo.logoUrl+'" /></a></div>'+
                    '<div class="info_right">'+
                    '<div class="info_name"><a href="/pages/personal/others_contribution.html?cid='+base.customerId+'" target="_blank">'+comm.getStrByteLen(name,24)+'</a></div>'+
                    '<div class="info_zhiwei">'+medicalTitle+company+'</div>'+
                    '<div class="info_jh">'+
                    '<div class="info_gz" style="padding-left:0;">关注'+followHtml+'</div>'+
                    '<div class="info_gz">粉丝'+fansHtml+'</div>'+
                    '<div class="info_gz" style="border:none;padding-right:0;">动态'+trendsHtml+'</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="gz_but follow_'+i+'"></div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';

                    var cId=base.customerId;
                    if(cId == $("#sesCustomerId").val() || cId == t.options.customerId || !auth.state || cId === null){
                        arrHT.push($(html));
                    }else{
                        var temp = $(html);
                        temp.find(".follow_"+i).follow({fStatus:fans.relationship?fans.relationship:0,classStyle:"gz_but",fId:cId?cId:""});
                        arrHT.push(temp);
                    }
                });
            }
            arrHT.push("<div class='clear'></div>");
            
            $(t.options.container).empty();
            $(t.options.container).prepend("<div class=\"ev-F2P\"></div>");
            $(".ev-F2P",t.options.container).html(arrHT);
            // 延迟加载
            $(".info_left img").lazyload({
                effect:"fadeIn",
                event:"scrollstop"
            });
        }
    };

    controller.init(Obj);
};
