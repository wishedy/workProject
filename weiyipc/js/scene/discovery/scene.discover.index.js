/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/9
 * @author: sunhaibin
 */
$(function(){
    var ctrl={
        cutAuthName:function(str){
            return comm.getStrByteLen(str,24);
        },
        opt:{
            cid:$('#sesCustomerId').val(),
            department: parseInt($('#sesDepartment').val())||1
            //state:parseInt($('#sesAuth').val())
        },
        path:{
            seriesCourse:"/call/cms/course/getHotCourseList/",
            getTags:PC_CALL+'discovery/search/getMapList/',
            doctorList:PC_CALL+"customer/pundits/getPunditsCustomerList/" ,         //专家列表
            allSee:PC_CALL+"recommend/customer/tag/json_othertags/",
            banner:PC_CALL + 'ad/position/profile/getMapList/'             //banner
        },
        init:function(x){
            var t=this;
            if(x){//判断从发布登录重新获取资源
                $(".al-release_popBox").attr('reloadData',1);
                t.opt.cid = $('#sesCustomerId').val();
                t.opt.department = $('#sesDepartment').val();
            }
            t.bannerLoad();
            t.getTags();
            t.authYouKnow();
            t.allSee();
            t.seriesCourse();
            if(t.opt.department==2){
                $(".al_dis_item").eq(3).hide();
                $(".al_dis_item").eq(4).hide();
            }
        },
        bannerLoad:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                firstResult: 0,
                maxResult: 1,
                visitSiteId:1,//pc 1  h52
                channelId:139, //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
                isIndex:1,//是否是首页,首页传1，频道页不传值
                platformId: t.opt.department||1,
                customerId: t.opt.cid||''
            })};
            var callback =function(d){
                if(d&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list[0];
                    var html="";
                    if(item.ad_profile_attachment&&item.ad_profile_attachment.length){
                        html = '<a href="'+item.ad_profile_attachment[0].linkUrl+'"><img src="'+item.ad_profile_attachment[0].adAttUrl+'" alt="'+item.ad_profile_attachment[0].adAttName+'"></a>'+
                            '<i><img src="//img10.allinmd.cn/v3/discover/weekHot.png" alt=""/></i>';
                        $('.ev_banner').html(html);
                        $(".ev_banner a").on("click",function(){
                            locationId=$(this).index()+1;
                            //事件埋点
                            comm.creatEvent({
                                async:false,
                                triggerType:"广告",
                                keyword:'广告位-轮播图(发现)-'+$(this).find("img").attr("alt"),
                                locationId:locationId,
                                actionId:14
                            });
                        })
                    }
                }
            };
            comm.ajax.async(t.path.banner,param,callback);
        },
        getTags:function(){
            var t=this;
            var params = {paramJson: $.toJSON({pageSize:10,pageIndex:1,visitSiteId:1,platformId: this.opt.department })};
            var callback = function(data){
                if(data&& data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list){
                    var item =data.responseObject.responseData.data_list;
                    var acts = item.activityMapList;        //热门活动
                    var opes =item.operationMapList;        //术士
                    var diseases =item.diseaseMapList;      //疾病
                    var specias =item.specialtyMapList;     //专业
                    var props =item.propertyMapList;        //标签
                    var themes =item.themeMapList;          //专题
                    var types = item.typeMapList;           //类型
                    if(acts.length){
                        var actHtml ='<a href="'+acts[0].activityUrl+'">'+
                                    '<img src="'+acts[0].activityPicUrl+'" alt=""/>'+
                                    '</a>'+
                                    '<p><a href="'+acts[0].activityUrl+'">'+acts[0].activityName+'</a></p>';
                        $('.ev_acts').html(actHtml);  //  热门活动
                    }

                    if(specias.length){
                        var spe_html='';
                        $.each(specias,function(si,se){
                            spe_html+='<a href="/pages/discover/discover_major.html#type=major&tId='+se.refId+'">'+comm.getStrLen(se.refRename,16)+'</a>';
                        })
                        $('.ev_major').html(spe_html);
                    }
                    if(diseases.length){
                        var dis_html='';
                        $.each(diseases,function(di,de){
                            dis_html+='<a href="/pages/discover/discover_major.html#type=disease&tId='+de.refId+'">'+comm.getStrLen(de.refRename,16)+'</a>';
                        })
                        $('.ev_disease').html(dis_html);
                    }
                    if(opes.length){ //术士
                        var opes_html='';
                        $.each(opes,function(oi,oe){
                            opes_html+= '<a href="/pages/discover/discover_major.html#type=operation&tId='+oe.refId+'">'+comm.getStrLen(oe.refRename,16)+'</a>';
                        });
                        $('.ev_opes').html(opes_html);
                    }
                    if(props.length){//标签
                        var props_html='';
                        $.each(props,function(pi,pe){
                            props_html+='<a href="/pages/discover/discover_tagSubject.html#tId='+pe.propertyId+'" class="al_dis_tag">'+comm.getStrLen(pe.propertyName,16)+'</a>';
                        });
                        $('.ev_props').html(props_html);
                    }
                    if(themes.length){//专题
                        var theme_html="";
                        $.each(themes,function(ti,te){
                           theme_html+='<a href="'+te.themeStoragePath+'" class="al_dis_sub_img"><img src="'+te.themeLogoUrl+'" alt=""/></a>'
                        });
                        $('.ev_theme').html(theme_html);
                    }
                }
            };
            comm.ajax.async(t.path.getTags,params,callback);
        },
        authYouKnow:function(){
            var t=this;
            var bubbleSort = function (list){
                var array = JSON.parse(JSON.stringify(list));//给每个未确定的位置做循环
                for(var unfix=array.length-1; unfix>0; unfix--){
                    //给进度做个记录，比到未确定位置
                    for(var i=0; i<unfix;i++){
                        if(parseInt(array[i].toplistType)>parseInt(array[i+1].toplistType)){
                            var temp = array[i];
                            array.splice(i,1,array[i+1]);
                            array.splice(i+1,1,temp);
                        }
                    }
                }
                // //console.log(array)
                return array;
            };

            var param ={
                paramJson:$.toJSON({"customerId":t.opt.cid!=undefined? t.opt.cid:0,platformId: t.opt.department||1,})
            };
            var callback = function(data){
                    var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                    var realStatus = data.responseObject.responseStatus;
                    if (realNoData || !realStatus) {}else{
                        var demoList = bubbleSort(data.responseObject.responseData.data_list);
                        var demoStr= "";
                        var userLogo = function(str){
                            var strDeal = "";
                            if((typeof str)=="string"){
                                strDeal = str.replace(/(^\s*)|(\s*$)/g, "");
                            }
                            if(strDeal.length==0||$.isEmptyObject(str)){
                                return "//img10.allinmd.cn/default/customer/190_190.jpg";
                            }else{
                                return str;
                            }
                        };
                        var medicalTitle = function(str){
                            if(str){
                                var returnStr = "";
                                if(str.indexOf(",")>-1){
                                    returnStr = str.split(",")[0].split("_")[1];
                                }else{
                                    if(str.indexOf("_")>-1){
                                        returnStr = str.split("_")[1];
                                    }else{
                                        returnStr = str;
                                    }
                                }
                                return returnStr;
                            }else{
                                return "";
                            }
                        };
                        $.each(demoList,function(i,v){
                            var title = "";
                            var describe = "";
                            switch (v.toplistType){
                                case 1:
                                    title = "贡献榜";
                                    describe = '<p class="describe">'+
                                        '	周贡献 <span>'+v.num.toWKH()+'</span>'+
                                        '</p>';
                                    break;
                                case 2:
                                    title = "活跃榜";
                                    describe = '<ul class="describe">'+
                                        '	<li>浏览 <span>'+v.browseNum.toWKH()+'</span></li>'+
                                        '	<li>分享 <span>'+v.shareNum.toWKH()+'</span></li>'+
                                        '	<li>评论 <span>'+v.reviewNum.toWKH()+'</span></li>'+
                                        '</ul>';
                                    break;
                                case 3:
                                    title = "推荐榜";
                                    describe = '<ul class="describe">'+
                                        '	<li>贡献 <span>'+v.contributionCount.toWKH()+'</span></li>'+
                                        '	<li>粉丝 <span>'+v.fansNum.toWKH()+'</span></li>'+
                                        '	<li>评论 <span>'+v.reviewNum.toWKH()+'</span></li>'+
                                        '</ul>';
                                    break;
                            }
                            demoStr+='<section class="contribution" data-cid="'+v.customerId+'">'+
                                '<header><i></i>'+title+'</header>'+
                                '<section class="user">'+
                                '<a href="javascript:;"><img src="'+userLogo(v.logoUrl)+'" alt=""><i>1</i></a>'+
                                '<aside>'+
                                '<p class="name">'+
                                t.cutAuthName(v.customerName)+
                                '</p>'+
                                '<p class="hospital">'+
                                '	'+medicalTitle(v.medicalTitle)+'<span>'+comm.getStrByteLen(v.company,14)+'</span>'+
                                '</p>'+
                                describe+
                                '</aside>'+
                                '</section>'+
                                '</section>'
                        });
                        $(".billboardStar").html(demoStr);
                        $(".contribution").off("click").on("click",function(e){
                            var linkUrl ="";
                                if($(e.target).attr("src")){
                                    linkUrl = "/pages/personal/others_contribution.html?cid="+$(this).attr("data-cid")+"";
                                    g_sps.jump($(this),linkUrl);
                                }
                                if($(e.target).hasClass("name")){
                                    linkUrl = "/pages/personal/others_contribution.html?cid="+$(this).attr("data-cid")+"";
                                    g_sps.jump($(this),linkUrl);
                                }

                        });
                    }
            };
            comm.ajax.async("/call/customer/toplist/getTheTopCustomer/",param,callback);
            /*module.personYouKnow({
                 container:$('.ev_mayKnowPerson'),
                 url: t.path.doctorList,
                 contribution:"contribution",
                 platformId: t.opt.department
            });*/
        },
        allSee:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                customerId: t.opt.cid!=undefined? t.opt.cid:0,
                firstResult:0,
                maxResult:5,
                platformId:t.opt.department
            })};
            var callback =function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list){
                    var item = d.responseObject.responseData.data_list;
                    var html='';
                    $.each(item,function(i,el){
                         html+= ' <section>'+
                                '    <a href="/pages/discover/discover_tagSubject.html#tId='+el.propertyId+'">'+comm.getStrLen(el.propertyName,50)+'</a>'+
                                '        <p><span class="al-orange">'+el.propertyNum+'</span>个相关资源</p>'+
                                '    </section>';
                    });
                    $('.ev_allSee').html(html);
                }
            };
            comm.ajax.async(t.path.allSee,param,callback);
        },
        seriesCourse:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                "customerId":$("#sesCustomerId").val()||'',
                "isValid": 1,
                "firstResult": 0,
                "maxResult": 10,
                "sortType": 4,                  // tab默认页传“5”，
                "courseSubjectTeamId":-1,   //学组id，发现页传“-1”，tab默认页传0，2-关节，7-脊柱，9-创伤
                visitSiteId:1,//pc 1  h52
                platformId:t.opt.department
            })};
            var callback =function(d){
                var str ="";
                /*
                 @function     JsonSort 对json排序
                 @param        json     用来排序的json
                 @param        key      排序的键值
                 */
                function JsonSort(json,key){
                    ////console.log(json);
                    for(var j=1,jl=json.length;j < jl;j++){
                        var temp = json[j],
                            val  = temp[key],
                            i    = j-1;
                        while(i >=0 && json[i][key]<val){
                            json[i+1] = json[i];
                            i = i-1;
                        }
                        json[i+1] = temp;

                    }
                    ////console.log(json);
                    return json;
                }
                if(d.responseObject.responseData){
                    if(d.responseObject.responseData.data_list){
                        if(d.responseObject.responseData.data_list.length>0){
                            var byJson = JsonSort(d.responseObject.responseData.data_list,"totalLearnNum");
                        }
                    }
                }
                if(byJson){
                    $.each(byJson,function(i,v){
                        var name = "";
                        if(i<6){
                            if(v.courseName.length>7){
                                name = v.courseName.substring(0,7)+"...";
                            }else{
                                name = v.courseName;
                            }
                            var indexNum = Number(i)+1;
                            str+='<a href="/pages/discover/series/discover_series_details.html?tId='+v.courseId+'" data-actionId="11000" data-keyword="系列课程" data-triggerType = "系列课"  data-browType="43" data-log-index="'+(indexNum)+'" data-log-id="'+v.courseId+'" data-log-record="true">《'+name+'》</a>';
                        }
                    });
                }
                str+='<a href="/pages/discover/series/discover_series_course.html" class="al_dis_more al_series_more"  data-log-record="true" data-actionId="11001" data-keyword="系列课程-查看更多" data-triggerType = "系列课"  data-browType="43">More</a>';
                var seriesObj = $(".al_dis_series");
                if(d.responseObject.responseData){
                    if(d.responseObject.responseData.data_list){
                        if(d.responseObject.responseData.data_list.length>0){
                            seriesObj.html(str).parent().show();
                        }else{
                            seriesObj.parent().hide();
                        }
                    }
                }

                $('[data-log-record]').off("mousedown").on("mousedown",function(){
                    var triggerType = $(this).attr("data-triggerType");
                    var keyword = $(this).attr("data-keyword");
                    var browType = $(this).attr("data-browType");
                    var actionId = $(this).attr("data-actionId");
                    var options = {
                        triggerType:triggerType,
                        keyword:keyword,
                        browType:browType,
                        actionId:actionId
                    };

                    if($(this).attr("data-log-index")){
                        options.locationId = $(this).attr("data-log-index");
                    }
                    if($(this).attr("data-log-id")){
                        options.refId = $(this).attr("data-log-id");
                    }
                    comm.creatEvent(options);
                });

            };
            comm.ajax.async(t.path.seriesCourse,param,callback);
        }
    };
    ctrl.init();
    //顶部导航登录回调
    scene.TopHeadLoginCallback= function(){
        ctrl.init('reloadData');
    };
});
