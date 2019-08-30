/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/7/29
 * @author: sunhaibin
 */

scene.indexLoginAndGetInfo = function(opt){

	//检查厂商角色  2019-04-11 屏蔽厂商 厂商用户隐藏掉关注分丝与收藏
    var customerRole = TempCache.getItem("customerRole");
    if(customerRole && (customerRole =="14" || customerRole =="15" )){
      $(".al-mesMainR ul").hide();
    }


    var _obj={
        cid : $("#sesCustomerId").val(),
        el:$('.al-index-mesMainR'),
        userImg:$('.ev-personalImg'),
        userName:$('.ev-personalName'),
        medicalTitle:$('.al-mesMainR-userTitle'),
        company:$('.al-mesMainR-userUnit'),
        fansNum:$('.ev-fanNum'),
        followNum:$('.ev-followNum'),
        praiseNum:$(".ev-praiseNum"),
        index_login:null,
        index_getBaseInfo:null,
        index_dynamicResource:null,
        login_from:null
    };
    _obj.index_login =function(o){
        var _opt = $.extend({},o,opt);
        _obj.cid = $("#sesCustomerId").val();
        if(_obj.cid===undefined||_obj.cid===""){
            module.indexLogin_v2({
                container:$('.module-index-login-area'),
                callback:function(){
                    //_obj.cid=$("#sesCustomerId").val();
                    //if(_obj.cid!=undefined){
                    //    _obj.index_getBaseInfo();       //个人信息
                    //    _obj.dynamicResource(true);     //动态
                    //    _opt.callFn&&_opt.callFn();
                    //}
                    _obj.getUnite();
                    g_sps.jump(null,"/");
                },
                indexRegisterAuthcancel:function(){//首页暂不认证
                    g_sps.jump(null,"/");
                },
                onAuthCancel:function(){
                    g_sps.jump(null,"/");
                }
            });
            _obj.dynamicResource(false);//动态
        }else{
            _obj.index_getBaseInfo();
            _obj.dynamicResource(true);
            $(".al-release_popBox").attr('hasLogin',1);
            return;
        }
    };
    //主要获取注册来源
    _obj.getUnite = function(){
        $.ajax({
            type: 'POST',
            url: PC_CALL + "customer/unite/getCustomerUnite/",
            dataType: 'json',
            async: false,
            success: function (rep) {
                if (rep && rep.responseObject) {
                    unite = rep.responseObject;
                    if (unite != null && unite != undefined) {
                        if(unite.platformType){
                            TempCache.setItem("platformType",unite.platformType);//1唯医 2医栈 3医鼎
                        }
                        if(unite.mobile){
                            TempCache.setItem("mobile",unite.mobile);
                        }
                        if(unite.email){
                            TempCache.setItem("email",unite.email);
                        }
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    },
        _obj.index_getBaseInfo =function(){
            _obj.cid =$("#sesCustomerId").val();
            $.ajax({
                url: PC_CALL+"customer/unite/getMapById/",
                type:"post",
                data:{paramJson: $.toJSON({customerId:_obj.cid,isCustomer:1})},
                dataType:'json',
                success:function(res){
                    if(res&&res.responseObject.responseData&&res.responseObject.responseData.data_list&&res.responseObject.responseData.data_list.length>0){
                        var list=res.responseObject.responseData.data_list[0],
                            unit=list.customer_unite,
                            baseInfo=list.customer_baseinfo,
                            _auth=list.customer_auth,
                            csc=list.customer_statistic,
                            att=list.customer_att;
                        var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
                        if(att.logoUrl !== "") logoUrl = att.logoUrl;
                        var nickname='',text="";
                        _auth.state = parseInt(_auth.state,10);
                        if(_auth.state!==2 && _auth.state!==7 && _auth.state!==8 && _auth.state!==9){//未认证
                            nickname = baseInfo.nickname;
                            if(nickname ==="") nickname = comm.getRegisterName(unit.email,unit.mobile);
                            _obj.userName.text(nickname);
                            if(_auth.state==1){
                                text="V1审核中";
                            }else{
                                text="您尚未认证";
                            }
                            if(_obj.el.find('.has_noAuth').length==0){
                                $('<span class="has_noAuth" style="position: relative;top:20px;background:#f5f6f8;padding:3px 10px;border-radius:25px;color:#a5a6a8;">'+text+'</span>').insertBefore(_obj.medicalTitle);
                            }
                            _obj.medicalTitle.text("");//职称

                        }else{
                            var name=_auth.lastName+_auth.firstName;
                            _obj.userName.html(name+'<i class="al-vipUser ev-vip"></i>');
                            _obj.medicalTitle.text(_auth.medicalTitleShow);//职称
                            _obj.company.text(_auth.company?_auth.company:_auth.schoolName);//医院
                            _obj.el.find('.has_noAuth').remove();
                        }
                        /*//console.log($(".al-vipUser"))
                        if (_auth.state === 1 || _auth.state === 2 || _auth.state === 7 || _auth.state === 9) {
                            $(".al-vipUser").css({"background": "url('/images/img10/authentication/V1.png') no-repeat 50% 50%",    backgroundSize: 'cover'});
                        }
                        if (_auth.state === 8) {
                            $(".al-vipUser").css({"background": "url('/images/img10/authentication/V2.png') no-repeat 50% 50%",    backgroundSize: 'cover'});
                        }*/
                        _obj.userImg.attr('src',logoUrl);//头像

                        _obj.fansNum.text(csc.fansNum);//粉丝
                        // _obj.followNum.text(csc.followpeopleNum);//关注数
                        _obj.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);//关注数
                        _obj.praiseNum.text(csc.othersUpNum);//点赞
                        _obj.el.find('a.ev_toPersonalCenter').attr('href','/pages/personal/personal_contribution.html');
                        _obj.el.show();
                        $('.module-index-login-area').hide();
                        _obj.el.on('click','.has_noAuth',function(){
                            if(_auth.state==0){
                                $('.ev-guide').remove();
                                var str = '<div class="al-two_authenticate">'+
                                    '<figure class="al_twoSureBox">'+
                                    '<b class="al-popCloseBtn sh_t_r close"></b>'+
                                    '<figcaption>认证资格正在审核中</figcaption>'+
                                    '<p>我们已经收到您的认证申请，审核通常需要3-5个工作日，请耐心等待，感谢您的理解和配合。</p>'+
                                    '<footer>'+
                                    '<span id="evcancel">知道了</span>'+ //'<p class="al-againSure">重新申请认证</p>'+
                                    '</footer>'+
                                    '</figure>'+
                                    '</div>'+
                                    '<div id="evlightbox" style="left:0; background:#000000; top:0; width:100%; height:100%; filter:alpha(opacity=70); -moz-opacity: 0.7; opacity: 0.7;zoom:1; position:fixed; z-index:4; "></div>';
                                $('body').append(str);
                                $('.close,#evcancel').click(function(){
                                    $('.al-two_authenticate,#evlightbox').remove();
                                });
                            }else if(_auth.state!=1){
                                if(unit.customerRole=="14"){
									g_sps.jump(null,"/pages/singlePage/user/companyAuth.html");
                                }else{
									g_sps.jump(null,"/pages/singlePage/user/auth.html");
                                }

                            }
                        })
                    }
                }
            });
        };
    _obj.dynamicResource = function(opt){//opt 已登录true，未登录false
        var params={paramJson: $.toJSON({
            customerId:(_obj.cid===undefined||_obj.cid==="")?'':_obj.cid,
            dataFlag:(_obj.cid===undefined||_obj.cid==="")?5:6,             //4本人（贡献）动态5他人（贡献）动态6我关注的人动态
            logoUseFlag:3,
            attUseFlag:4,
            visitSiteId:1,
            scene:10,
            firstResult:0,
            maxResult:5,
            platformId: $('#sesDepartment').val()
        })};
        var _url =PC_CALL+"customer/trends/getMapList/";
        if(opt){
            $('.ev_dynamicName').text('朋友圈');
            $('.al-checkFirendCircle').css('display','block');
        }else{
            $('.ev_dynamicName').text('全部动态');
            $('.al-checkFirendCircle').css('display','none');
        }
        var _callback =function(d){
            comm.localData.storeLocalData(_url,d);
            if(d&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                var item = d.responseObject.responseData.data_list;
                var html='';
                $.each(item,function(it,ite){
                    //参数customerId  userName  publishTime resName resUrl
                    html+= module.indexListTem.friendCircleList({
                        customerId:ite.customer_auth.customerId,
                        userName:ite.customer_auth.lastName+ite.customer_auth.firstName,
                        publishTime:ite.customer_trends.opDate,
                        trendName:ite.customer_trends.trendName,
                        resName:ite.customer_trends.resourceName,
                        resUrl:ite.resource_valid.tpl_Path==286?"/pages/eBook/eBook_details.html?bId="+ite.customer_trends.resourceId:ite.customer_trends.resourceUrl,
                        resourceValid:ite.resource_valid.resourceValid
                        //tplPath:ite.resource_valid.tpl_Path,
                        //resourceId:ite.customer_trends.resourceId
                    });
                });
                $('.ev_dynamicBox').html(html);
            }else{
                //$('.ev_dynamicBox').html("");
                if($('#sesDepartment').val()==2){
                    $('.al-allActive').hide();
                }else {
                    var html = '';
                    $.ajax({
                        url: _url,
                        data: {
                            paramJson: $.toJSON({
                                customerId: '',
                                dataFlag: 5,             //4本人（贡献）动态5他人（贡献）动态6我关注的人动态
                                logoUseFlag: 3,
                                attUseFlag: 4,
                                visitSiteId: 1,
                                scene: 10,
                                firstResult: 0,
                                maxResult: 5
                            })
                        },
                        type: 'post',
                        dataType: "json",
                        success: function (res) {
                            if (res && !$.isEmptyObject(res.responseObject.responseData) && res.responseObject.responseData.data_list.length) {
                                var item = res.responseObject.responseData.data_list;
                                var html = '';
                                $.each(item, function (its, ites) {
                                    //参数customerId  userName  publishTime resName resUrl
                                    html += module.indexListTem.friendCircleList({
                                        customerId: ites.customer_auth.customerId,
                                        userName: ites.customer_auth.lastName + ites.customer_auth.firstName,
                                        publishTime: ites.customer_trends.opDate,
                                        trendName: ites.customer_trends.trendName,
                                        resName: ites.customer_trends.headerName,
                                        resUrl: ites.customer_trends.resourceUrl,
                                        resourceValid: ites.resource_valid.resourceValid
                                    });
                                });
                                $('.ev_dynamicBox').html(html);
                                $('.ev_dynamicName').text('全部动态');
                                $('.al-checkFirendCircle').css('display', 'none');
                            }
                        }
                    });
                }
            }
        };
        comm.localData.getLocalData({
            path: _url,
            exhibitionData: _callback,
            requestData: function () {
                comm.ajax.async(_url,params,_callback);
            }
        });

    };


    return{
        index_login:function(o){
            _obj.index_login(o);
        },
        index_getBaseInfo:function(){
            _obj.index_getBaseInfo();
        },
        index_dynamicResource:function(o){
            _obj.dynamicResource(o);
        }
    }

};
$(function() {
    var obj={
        cid :$("#sesCustomerId").val()!=undefined&&$("#sesCustomerId").val()!=""?$("#sesCustomerId").val():""//1399533638818//////1434505803474 //$("#sesCustomerId").val()
    };

    var controller={
        path : {
            initCore : PC_CALL+"customer/unite/json_info/", //个人信息
            dynamicEntry:PC_CALL+"navigation/scheduling/json_list/",
            banner:PC_CALL + 'ad/position/profile/getMapList/',             //banner
            getRecommendRes:PC_CALL+"customer/recommendResourceItem/json_list/", //推荐列表
            getFriendDynamic:PC_CALL+"customer/trends/getMapList/",//朋友圈动态
            getRecommendDoctor:PC_CALL+"customer/recommendCustomerFirst/json_list3/",    //推荐医师
            getRecommendTag:PC_CALL+'recommend/customer/tag/json_list/'  ,               //推荐标签
            topNList:PC_CALL+"cms/resource/json_list/",
            getHeadMessageList:PC_CALL+"ad/position/profile/getHeadMessageList/"//置顶标签

        },
        number:{
            tagPage:0,
            docPage:0,
            topNpage:0
        },
        params:{
            customerId:obj.cid, //   用户ID
            pageIndex:1,//   首记录
            pageSize:10,//  尾记录
            scene:10,        // 场景（首页传10）    新增10 -  首页11 -  朋友圈12 -  个人主页13 -  发现
            sessionCustomerId:obj.cid,
            flag:1,
            score:0,
            platformId: $('#sesDepartment').val()
        },
        init:function(){
            var t=this;
            t.tagDom2 = "";
            t.TOP2="";
            t.bannerLoad(true);//轮播图加载
            t.bannerLoad(false);//首页广告推荐

            t.dynamicEntry();//加载动态入口
            scene.indexLoginAndGetInfo().index_login({
                callFn: function(){
                    t.getRecommendRes();
                    t.stickIconFun();
                }
            });//登录+加载个人信息
            t.allActiveHoverStyle();//全部动态滑过样式
            t.getRecommendRes();//推荐内容
            t.stickIconFun();//带有置顶标签的推荐内容

            //t.topNList();
            //controller.guidance();
        },
        adDelivery:function(data){
            var t = this;
            if(localStorage.getItem("indexAdDelivery")){
                return false;
            }else{
                if(data.ad_profile_attachment.length>0){
                    var src = data.ad_profile_attachment[0].adAttUrl;
                    var href = data.ad_profile_attachment[0].linkUrl;
                    var adId = data.ad_profile_attachment[0].id;
                    var param = href+"$"+adId;
                    if(href.length>0||src.length>0){
                        // if(!(href.length>0||src.length>0)){
                        var adDeliveryTemplate = '<section class="al-ad-delivery" style="display: none;"><section class="al-ad-delivery-details"><section class="al-ad-delivery-close"></section><a class="al-ad-delivery-banner" href="javascript:;" target="_blank"></a></section></section>';
                        $(".al-ad-delivery").remove();
                        $('.ev-guide').hide();
                        $('body').append(
                            adDeliveryTemplate
                        ).css({"overflow":"hidden"});
                        if(href.length){
                            $(".al-ad-delivery-banner").attr({"href":href});
                        }
                        if(src.length){
                            var backgroundStyle = ':url("'+src+'") no-repeat center 50%;';
                            var backgroundSize = "cover;"
                            $(".al-ad-delivery-banner").attr({style:"background"+backgroundStyle+'background-size:'+backgroundSize});
                        }
                        $(".al-ad-delivery-close").off("click").on("click",function(e){
                            e.stopPropagation();
                            $('.ev-guide').show();

                            $(".al-ad-delivery").remove();
                            comm.creatEvent({
                                triggerType:"广告",
                                keyword:'弹窗广告-关闭',
                                param:param,
                                locationId:adId,
                                actionId:11046
                            });
                            $("body").css({"overflow":"auto"});
                            localStorage.setItem("indexAdDelivery",true);
                        });
                        $(".al-ad-delivery-banner").on("mousedown",function(e){
                            comm.creatEvent({
                                async:false,
                                triggerType:"广告",
                                keyword:'弹窗广告-图文',
                                param:param,
                                locationId:adId,
                                actionId:11045
                            });
                            if(1 == e.which){
                                clearTimeout(closeTimer);
                                var closeTimer =setTimeout(function(){
                                    $(".al-ad-delivery-close").trigger("click");
                                },2000)
                            }

                        });
                        $(".al-ad-delivery").show();
                    }else{
                        $('.ev-guide').show();
                        return false;
                    }
                }

            }


        },
        //轮播图加载
        bannerLoad:function(swiperOnOff){
            var t=this;
            var jsonData = {
                firstResult: 0,
                maxResult: 10,
                visitSiteId:1,  //pc 1  h52
                channelId:68,   //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
                isIndex:1,      //是否是首页,首页传1，频道页不传值
                platformId:$('#sesDepartment').val()||1,
                customerId:$("#sesCustomerId").val()
            }
            // //console.log(swiperOnOff)
            if(swiperOnOff===false){
                jsonData.positionId = (($('#sesDepartment').val()||1,10)===1)?581:579;     //是否是首页,首页传1，频道页不传值
                // //console.log("首屏推荐");
            }
            var param = {paramJson: $.toJSON(jsonData)};
            var callback =function(d){
                /*if(swiperOnOff){
                    comm.localData.storeLocalData(t.path.banner,d);
                }*/
                if(d&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list[0];
                    var html="";
                    if(swiperOnOff===false){
                        // //console.log(swiperOnOff,jsonData,item)
                        t.adDelivery(item);
                        return false;
                    }else{
                        if(item.ad_profile_attachment&&item.ad_profile_attachment.length){
                            $.each(item.ad_profile_attachment,function(i,el){
                                var _target="";
                                if(el.linkUrl.lastIndexOf("www.medplus.net")>-1){
                                    _target="target='_href'";
                                }
                                if(!$("#sesCustomerId").val()&&el.linkUrl.lastIndexOf("personal_customerInfo")>-1){//TODO:推广 V1用户去补全四证其他状态不显示此广告位

                                }else{
                                    if($("#sesAuth").val()!=2&&el.linkUrl.lastIndexOf("personal_customerInfo")>-1){

                                    }else{
                                        html+='<figure class="swiper-slide" adId="'+el.id+'">'+
                                            '<a href="'+el.linkUrl+'" '+_target+'>'+
                                            '<img src="'+el.adAttUrl+'" alt="'+el.adAttName+'">'+
                                            '</a>'+
                                            '</figure>';
                                    }
                                }
                            });
                            $('.ev_banner').html(html);
                            if($('.ev_banner .swiper-slide').length>1){
                                var mySwiper = new Swiper('.swiper-container',{
                                    loop: true,
                                    pagination: ".al-pagination",
                                    autoplay: 3000,
                                    paginationClickable: true,
                                    autoplayDisableOnInteraction: false,
                                    speed: 1000
                                });
                                $('.swiper-container').on("mouseover",function(){
                                    $('.swiper-button-prev').show();
                                    $('.swiper-button-next').show();
                                }).on("mouseout",function(){
                                    $('.swiper-button-prev').hide();
                                    $('.swiper-button-next').hide();
                                });
                                $('.swiper-button-prev').on('click', function(e){
                                    e.preventDefault();
                                    mySwiper.swipePrev();
                                });
                                $('.swiper-button-next').on('click', function(e){
                                    e.preventDefault();
                                    mySwiper.swipeNext();
                                });
                                $('.swiper-container .swiper-slide').on("click",function(){
                                    var locationId='',
                                        slideLength=$('.swiper-container .swiper-slide').length,
                                        index=$(this).index();
                                    switch (index){
                                        case 0:
                                            locationId=slideLength-2;
                                            break;
                                        case slideLength:
                                            locationId=1;
                                            break;
                                        case slideLength-1:
                                            locationId=index-1;
                                            break;
                                        default:
                                            locationId=index;
                                            break;
                                    }
                                    var param=$("a",$(this)).attr("href")+"$"+$(this).attr("adId");
                                    //事件埋点
                                    comm.creatEvent({
                                        async:false,
                                        triggerType:"广告",
                                        keyword:'广告位-轮播图(热门)-'+$(this).find("img").attr("alt"),
                                        param:param,
                                        locationId:locationId,
                                        actionId:14
                                    });
                                })
                            }
                        }
                    }

                }else {
                    $('.ev-guide').show();
                }
            };
            comm.ajax.async(t.path.banner,param,callback);
            /*comm.localData.getLocalData({
                path: t.path.banner,
                exhibitionData: callback,
                requestData: function () {

                }
            });*/

        },
        //加载动态入口
        dynamicEntry:function(){
            var t=this;
            var params={paramJson: $.toJSON({navigationType:2,visitSiteId:1,customerId:$('#sesCustomerId').val()||"",sessionCustomerId:$('#sesCustomerId').val()||"",platformId: $('#sesDepartment').val()})};
            var callback=function(o){
                comm.localData.storeLocalData(t.path.dynamicEntry,o);
                if(o&&o.responseObject.responseData&& !$.isEmptyObject(o.responseObject.responseData)&&o.responseObject.responseData.data_list.length>0){
                    var res = o.responseObject.responseData.data_list.slice(0,8);//最多取5个
                    var html='';
                    $.each(res,function(i,ele){
                        html+='<section class="al-recommendLinksWrap">'+
                            '<a href="'+ele.navigationPath+'" class="al-recommendLinkItem">'+
                            '<img src="'+ele.navigationLogo+'" alt="">'+
                            '<figcaption>'+ele.navigationName+'</figcaption>'+
                            '</a>'+
                            '</section>';
                    });
                    $('.al-recommendLinks').html(html);
                    var _len = $('.al-recommendLinks>section').length;
                    /*switch(_len){
                        case 3:
                            $('.al-recommendLinks>section').css('width','32%');
                            break;
                        case 4:
                            $('.al-recommendLinks>section').css('width','25%');
                            break;
                        case 5:
                            $('.al-recommendLinks>section').css('width','19%');
                            break;
                        default:
                            $('.al-recommendLinks>section').css('width','49%');
                    }*/
                    $('.al-recommendLinksWrap').on("click",function(){
                        //事件埋点
                        // //console.log($(this).index());
                        comm.creatEvent({
                            async:false,
                            triggerType:"动态入口",
                            locationId:$(this).index()+1,
                            keyword:$(this).text(),
                            actionId:63
                        });
                    })
                }
            };
            comm.localData.getLocalData({
                path: t.path.dynamicEntry,
                exhibitionData: callback,
                requestData: function () {
                    comm.ajax.async(t.path.dynamicEntry,params,callback);
                }
            });

        },
        //带置顶标签的推荐内容
        stickIconFun:function () {
          var t=this,
              params={
                  visitSiteId:1,
                  // channelId:68,//大首页
                  firstResult:0,
                  maxResult:10,
                  platformId:$('#sesDepartment').val()||1,
                  scene:10,
                  positionId:$('#sesDepartment').val()==2?626:625
              };
          var cBack=function (res) {
              if (comm.hasResponseData(res)){
                  var item = res.responseObject.responseData.data_list;
                  var html = '', _html = '';
                  $.each(item, function (ei, elei) {
                      _html = t.singleDom(elei,1);
                      html += _html;
                  });
                  $('.ev_stickBox').html(html);
                  $(".lazyImg").lazyload({
                      //effect:"fadeIn",
                      //event:"scrollstop"
                      effect:"show",
                      event:"scroll"
                  });
              }
          };
          comm.ajax.async(t.path.getHeadMessageList, {paramJson:$.toJSON(params)},cBack);
        },
        //推荐内容
        getRecommendRes:function(x){
            var t=this;
            t.params.customerId = $('#sesCustomerId').length?$('#sesCustomerId').val():"";
            t.params.sessionCustomerId= $('#sesCustomerId').length?$('#sesCustomerId').val():"";
            t.params.pageIndex = 1;
            t.params.platformId = $('#sesDepartment').val()||1;
            t.params.score = 0;
            var _params={paramJson: $.toJSON(t.params)};
            var localDataRender = function(data){
					if(data&& !$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length) {
						var item = data.responseObject.responseData.data_list;
						var tagList = data.responseObject.responseData.tag_list;
						var scoreList = data.responseObject.responseData.score_list;
						var itemLength = item.length;
						var html = '', _html = '';
						if (tagList.length) {
							html = t.eachQueryDom(item, tagList);
						} else {
							$.each(item, function (ei, elei) {
								_html = t.singleDom(elei);
								html += _html;
							});
						}
						$('.ev_recBox').html(html);
					}
            };
            var _callback = function(data){
                comm.localData.storeLocalData(t.path.getRecommendRes,data);
                if(data&& !$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                    var item = data.responseObject.responseData.data_list;
                    var tagList =data.responseObject.responseData.tag_list;
                    var scoreList=data.responseObject.responseData.score_list;
                    var itemLength = item.length;
                    var html='',_html='';
                    if(tagList.length){
                        html = t.eachQueryDom(item,tagList);
                    }else{
                        $.each(item,function(ei,elei){
                            _html =  t.singleDom(elei);
                            html+=_html;
                        });
                    }

                    $('.ev_recBox').html(html);
                    if(x){//判断从发布登录重新获取资源
                        $(".al-release_popBox").attr('reloadData',1);
                    }
                    $(".lazyImg").lazyload({
                        //effect:"fadeIn",
                        //event:"scrollstop"
                        effect:"show",
                        event:"scroll"
                    });
                    if(itemLength>4){
                        t.topNList();
                    }
                    if(itemLength>7){
                        t.tagRecList();
                    }
                    //if(itemLength>19){
                    //    t.docRecList();
                    //}
                    module.dislikeAction();
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.params.score=scoreList[0][i];
                            }
                        }
                    }

                    t.scrollPage();
                }
            };
            comm.localData.getLocalData({
                path: t.path.getRecommendRes,
                exhibitionData: localDataRender,
                requestData: function () {
                    comm.ajax.async(t.path.getRecommendRes, _params, _callback);
                }
            });
        },
        eachQueryDom:function(item,tagList){
            var t=this;
            var html='',_html0="",_html1="",_html2="",_html11_13="";
            $.each(item,function(_ei,_elei){
                if(_ei<10){
                    _html0 += t.singleDom(_elei);
                }else if(_ei>=10&&_ei<13){
                    _html1 += t.singleDom(_elei);

                }else if(_ei>=13){
                    _html2 += t.singleDom(_elei);
                }
                _html11_13='<section class="al-contentItem al_mtb_20">' +
                    '<header class="al-contentItemTitle">' +
                    '<h2><i class="al-contentItemTitleIcon"></i>'+tagList[0].propertyName+'</h2>' +
                    '</header>'+
                    _html1+
                    '</section>';
            });
            html+=_html0+_html11_13+_html2;
            return html;
        },
        singleDom:function(elei,icon){
            var attLength = elei.picNum;
            var attUrl="";
            if(attLength!=0){
                attUrl = elei.picUrl.split('|');
                for(var i= 0,l=attUrl.length;i<l;i++){
                    if(attUrl[i].indexOf('http')==-1){
                        attUrl.splice(i,1);
                    }
                }
            }
            attLength = attUrl.length;
            var _html = module.indexListTem.list({
                refType:elei.itemType,
                resUrl:elei.itemUrl,
                resName:htmlToString(elei.itemTitle),
                resDesc:htmlToString(elei.itemAbstract),
                isAward:elei.isAward,
                isAttend:elei.isAttend,
                isNew:elei.isNew,
                isHot:elei.isHot,
                tplPath:elei.tplPath,
                resAuthor:elei.ownerNameStr,
                resWatchCount:elei.browseNum.toWK(),
                attUrl:attUrl,
                attLength:attLength,
                id:elei.itemId,
                playTime:elei.playTime,
                videoType:elei.videoType,
                score:elei.currentStarLevel,
                scoreNum:elei.currentScoreNum,
                isShowActivityTag:elei.isShowActivityTag,
                activityTagName:elei.activityTagName,
                activityTagColor:elei.activityTagColor,
                stickIconFlag:icon?icon:""
            });
            return _html;
        },
        //医师推荐列表
        docRecList:function(noLoading){
            var t=this;
            var loginCallback=scene.indexLoginAndGetInfo().index_login;//点击关注 登录成功后回调
            var indexOnClose =scene.indexLoginAndGetInfo().index_login;//取消登录回调
            var _params ={paramJson: $.toJSON({
                customerId:obj.cid!=""&&obj.cid!=undefined?obj.cid:"",
                pageIndex:t.number.docPage+1,
                pageSize:3,
                scene:10,
                flag:1,
                score:t.docRecScore?t.docRecScore:0,
                sessionCustomerId:$('#sesCustomerId').val()||"",
                platformId: $('#sesDepartment').val()
            })};
            var callback =function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list){
                    var item =d.responseObject.responseData.data_list;
                    var len =$('.ev_flow').length;  //<i class="al-contentItemTitleIcon"></i>
                    var docDom ='<section class="al-contentItem al_mtb_20"><header class="al-contentItemTitle"><h2>医师推荐</h2></header><section class="ev-docRecommend01"></section></section>';
                    $(docDom).insertAfter($('.ev_flow').eq(19+t.number.docPage*15));
                    $('.ev_flow').eq(19+t.number.docPage*15).css('borderBottom','1px solid #ecf0f2').find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                    $('.ev-docRecommend01').eq(t.number.docPage).html(module.indexListTem.docRecommendList(item, loginCallback,indexOnClose))
                        .find('.al-doctorMsg:eq(2)').css('borderBottom','none');
                    t.number.docPage++;
                    var scoreList = d.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.docRecScore=scoreList[0][i];
                            }
                        }
                    }
                    $(".ev_operate").off("click").on("click",function(){
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"广告",
                            keyword:$(this).attr("username"),
                            actionId:62,
                            refId:$(this).attr("itemId")
                        });
                    });
                }
            };
            comm.ajax.async(t.path.getRecommendDoctor,_params,callback,(noLoading?"true":""));
        },
        //推荐标签
        tagRecList:function(noLoading){
            var t=this;
            var _params ={paramJson: $.toJSON({
                customerId:obj.cid!=""&&obj.cid!=undefined?obj.cid:"",
                pageIndex:t.number.tagPage+1,
                pageSize:20,
                scene:10,
                flag:1,
                score:t.tagRecScore?t.tagRecScore:0,
                sessionCustomerId:$('#sesCustomerId').val()||"",
                platformId: $('#sesDepartment').val()
            })};
            var _callback =function(q){
                if(q&& q.responseObject.responseData&&!$.isEmptyObject(q.responseObject.responseData)&&q.responseObject.responseData.data_list){
                    var item =q.responseObject.responseData.data_list;
                    var html="",html2="";
                    $.each(item,function(i,e){
                        if(!comm.checkInvalid(e.propertyName)) {
                            if (i < 10) {
                                html += '<a href="/pages/discover/discover_tagSubject.html#tId=' + e.propertyId + '" class="al-contentTagItem ev_operateTag" tagId="' + e.propertyId + '">' + comm.getStrLen(e.propertyName, 18) + '</a>';
                            } else if (i >= 10) {
                                html2 += '<a href="/pages/discover/discover_tagSubject.html#tId=' + e.propertyId + '" class="al-contentTagItem ev_operateTag" tagId="' + e.propertyId + '">' + comm.getStrLen(e.propertyName, 18) + '</a>';
                            }
                        }
                    })

                    var tagDom="",tagDom2="";
                    if(html!="") {
                        tagDom = ' <section class="al-contentItem al_mtb_20">' +
                            '   <header class="al-contentItemTitle">' +
                            '   <h2>标签推荐</h2>' +        //<i class="al-contentItemTitleIcon"></i>
                            '   </header>' +
                            '   <section class="al-contentTagRecommend">' +
                            html +
                            '   </section>' +
                            '   </section>';
                        $('.ev_flow').eq(6+ t.number.tagPage*20).css('borderBottom','1px solid #ebe9ed').after(tagDom);
                        $('.ev_flow').eq(6+ t.number.tagPage*20).find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                        $(".ev_operateTag").off("click").on("click",function(){
                            //事件埋点
                            var tagId=$(this).attr("tagId");
                            comm.creatEvent({
                                async:false,
                                triggerType:"标签",
                                keyword:tagId,
                                actionId:79
                            });
                        });
                    }
                    if(html2!='') {
                        tagDom2= ' <section class="al-contentItem al_mtb_20">' +
                            '   <header class="al-contentItemTitle">' +
                            '   <h2>标签推荐</h2>' +        //<i class="al-contentItemTitleIcon"></i>
                            '   </header>' +
                            '   <section class="al-contentTagRecommend">' +
                            html2 +
                            '   </section>' +
                            '   </section>';
                        t.tagDom2 = tagDom2;
                        //$('.ev_flow').eq(16+ t.number.tagPage*20).after(tagDom2);
                    }

                    var scoreList = q.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.tagRecScore=scoreList[0][i];
                            }
                        }
                    }
                }
                t.number.tagPage++;
            };
            comm.ajax.async(t.path.getRecommendTag,_params,_callback,(noLoading?"true":""));
        },
        //top n list
        topNList:function(){
            var t=this;
            $.ajax({
                url: t.path.topNList,
                type:"post",
                data:{paramJson: $.toJSON({channelId:0,firstResult:(0+ parseInt(t.number.topNpage*2)),maxResult:2,sessionCustomerId:$('#sesCustomerId').val()||"",platformId: $('#sesDepartment').val()})},
                dataType:'json',
                success:function(d){
                    if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                        var item = d.responseObject.responseData.data_list;
                        $.each(item,function(i,el){
                            if(el.data_list.length>0){
                                var _el = el.data_list;
                                if(el.itemType==15){//top5榜单
                                    var topHtml='';
                                    var attUrl;
                                    var topDom='';
                                    $.each(_el,function(j,jl){
                                        attUrl=jl.picUrl.split('|')[0];
                                        topHtml+=module.indexListTem.topNList({
                                            attUrl:attUrl,
                                            resUrl:jl.itemUrl,
                                            resName:jl.itemTitle,
                                            resDesc:jl.itemTitle,
                                            itemId:jl.itemId,
                                            itemType:jl.itemType
                                        });
                                    });
                                    topDom ='<section class="al-contentItem al_mtb_20">'+
                                        '<header class="al-contentItemTitle">'+
                                        '<h2>'+el.itemName+'</h2>'+
                                        '</header>'+
                                        '<section class="al-videoAlbumRank">'+
                                        topHtml+
                                        '</section></section>';
                                }
                                if(el.itemType==16||el.itemType==14){    //16 专题  14广告 同一种样式
                                    var speHtml="";
                                    $.each(_el,function(spi,spl){
                                        speHtml+=module.indexListTem.special({
                                            resUrl:spl.itemUrl,
                                            attUrl:spl.picUrl.split('|')[0],
                                            resName:spl.itemTitle,
                                            itemId:spl.itemId,
                                            itemType:spl.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        });
                                    });
                                }
                                if(el.itemType==12){//活动
                                    var actHtml ="";
                                    $.each(_el,function(ai,al){
                                        actHtml+= module.indexListTem.activityList({
                                            resUrl:al.itemUrl,
                                            attUrl:al.picUrl.split('|')[0],
                                            resName:al.itemTitle,
                                            itemId:al.itemId,
                                            itemType:al.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        })
                                    });
                                }
                                if(el.itemType==13){//专辑
                                    var serHtml="";
                                    var serDom="";
                                    _el = _el.slice(0,9);
                                    $.each(_el,function(si,sl){
                                        serHtml+=module.indexListTem.tagVideoList({
                                            resUrl:sl.itemUrl,
                                            attUrl:sl.picUrl,
                                            playTime:sl.playTime,
                                            resName:sl.itemTitle,
                                            itemType:sl.itemType,
                                            itemId:sl.itemId
                                        })
                                    });
                                    serDom = '<section class="al-contentItem al_mtb_20 ev_series">'+
                                        '      <header class="al-contentItemTitle">'+
                                        '      <h2>'+el.itemName+'</h2>'+
                                        '  </header>'+
                                        '  <section class="al-videoAlbumContent">'+
                                        serHtml+
                                        '</section></section>';
                                }
                                if(el.itemType==1||el.itemType==2||el.itemType==4||el.itemType==7){
                                    var _resHtml;
                                    if(el.data_list[0].tplPath==286){
                                        _resHtml = module.indexListTem.release({
                                            resUrl:el.data_list[0].itemUrl,
                                            attUrl:el.data_list[0].picUrl.split('|')[0],
                                            resName:el.data_list[0].itemTitle,
                                            itemId:el.data_list[0].itemId,
                                            itemType:el.data_list[0].itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        }) ;
                                    }else {
                                        _resHtml = t.singleDom(_el[0]);
                                        _resHtml = _resHtml.replace(/ev_flow/, '');   //去除ev_flow类，不占用推荐流位置
                                    }
                                }
                                if(el.itemType==3){
                                    var meetHtml ="";
                                    $.each(_el,function(mi,ml){
                                        meetHtml+= module.indexListTem.conferenceList({
                                            resUrl:ml.itemUrl,
                                            resName:ml.itemTitle,
                                            attUrl:ml.picUrl,
                                            startTime:ml.startTime,
                                            endTime:ml.endTime,
                                            place:ml.conLocation,
                                            itemId:ml.itemId,
                                            itemType:ml.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        });
                                    });
                                }
                                var TOP1="",TOP2="";
                                var TOP1_type,TOP2_type;    //判断类型，是否在dom中是单独的分离块，榜单15，专辑13分离，其他不分离 为下面判断borderBottom做准备
                                if(i==0){
                                    TOP1="";
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP1 = topDom;TOP1_type=1;break;
                                        case 16:
                                        case 14:TOP1 =speHtml;break;
                                        case 12:TOP1 = actHtml;break;
                                        case 13:TOP1=serDom;TOP1_type=1;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP1=_resHtml;break;
                                        case 3:TOP1=meetHtml;break;

                                    }
                                }else if(i==1){
                                    TOP2="";
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP2 = topDom;TOP2_type=1;break;
                                        case 16:
                                        case 14:TOP2 =speHtml;break;
                                        case 12:TOP2 = actHtml;break;
                                        case 13:TOP2=serDom;TOP2_type=1;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP2=_resHtml;break;
                                        case 3:TOP2=meetHtml;break;
                                    }
                                }
                                if(TOP1_type==1){
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).css('borderBottom','1px solid #e4e9ed').after(TOP1);
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                }else{
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).after(TOP1);
                                }
                                $(".ev_operate").off("click").on("click",function(){
                                    var pageIndex=$(this).attr("index")+1;
                                    //事件埋点
                                    comm.creatEvent({
                                        async:false,
                                        locationId:pageIndex+"-"+$(this).index(),
                                        triggerType:"广告",
                                        keyword:$(this).find("a").eq(0).text(),
                                        actionId:62,
                                        pushMessageId:$(this).attr("itemId"),
                                        refId:$(this).attr("itemId"),
                                        refType:$(this).attr("itemType")
                                    });
                                });
                                //$('.ev_flow').eq(13+ t.number.topNpage*20).after(TOP2);
                                t.TOP2=TOP2;
                                t.TOP2_type = TOP2_type;
                                $(".lazyImg").lazyload({
                                    //effect:"fadeIn",
                                    //event:"scrollstop"
                                    effect:"show",
                                    event:"scroll"
                                });
                            }
                        });
                    }
                    t.number.topNpage++;
                }
            });
        },
        //全部动态滑过样式
        allActiveHoverStyle:function(){
            $('.al-allActive .al-activeItem').hover(function(){
                $(this).addClass('hover').siblings().removeClass('hover');
            },function(){
                $(this).removeClass('hover');
            });
        },
        //瀑布流
        scrollPage:function(){
            var t=this;
            var pagenumber=2;
            var f = t.params.firstResult;
            var m = t.params.maxResult;
            var top = 200;//$('.ev_scrollPage').offset().top;
            $('.ev_recBox').scrollPagination({
                'contentPage': t.path.getRecommendRes,
                'contentData': $.extend(t.params, {
                    pageIndex: function () {
                        return pagenumber++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 1000, // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 1000,
                'type': "post",
                'dataType':"json",
                'beforeLoad': function () {
                    //comm.LightBox.showloading();
                    $('.al-loadMoreImg').show();
                },
                'afterLoad': function (elementsLoaded) {
                    //comm.LightBox.hideloading();
                    $('.al-loadMoreImg').hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev_recBox").attr("scrollPagination", "disabled");
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev_recBox").attr("scrollPagination", "disabled");
                            //alert("没有内容了2");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            var tagList = data.responseObject.responseData.tag_list;
                            var scoreList = data.responseObject.responseData.score_list;
                            if(scoreList&&scoreList.length>0){
                                for (var i in scoreList[0]){
                                    if(i==1){
                                        t.params.score=scoreList[0][i];
                                    }
                                }
                            }
                            var itemsLength = items.length;
                            var html='',attUrl,attLength,_html,picUrl;
                            if(tagList.length){
                                html = t.eachQueryDom(items,tagList);
                            }else{
                                $.each(items,function(ei,elei){
                                    _html =  t.singleDom(elei);
                                    html+=_html;
                                });
                            }
                            $('.ev_recBox').append(html);
                            if(pagenumber%2==0){
                                if(itemsLength>4){
                                    t.topNList();
                                }
                                if(itemsLength>7){
                                    t.tagRecList(true);
                                }
                                //if(itemsLength>19){
                                //t.docRecList(true);
                                //}
                            }else{
                                var _evTagDom = $('.ev_flow').eq(16+ (t.number.tagPage-1)*20);
                                _evTagDom.css('borderBottom','1px solid #ecf0f2').after(t.tagDom2);
                                _evTagDom.find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                t.tagDom2="";
                                var _topDom = $('.ev_flow').eq(13+ (t.number.topNpage-1)*20);
                                _topDom.after(t.TOP2);
                                if(t.TOP2_type==1){
                                    _topDom.css('borderBottom','1px solid #ecf0f2').find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                }
                                t.TOP2="";
                                t.docRecList(true);
                            }
                            //推荐资源添加事件埋点
                            $(".ev_operate").off("click").on("click",function(){
                                //事件埋点
                                comm.creatEvent({
                                    async:false,
                                    locationId:$(this).index()+1,
                                    triggerType:"广告",
                                    keyword:$(this).find("a").eq(0).text()||$(this).find("a").eq(1).text(),
                                    actionId:62,
                                    pushMessageId:$(this).attr("itemId"),
                                    refId:$(this).attr("itemId"),
                                    refType:$(this).attr("itemType")
                                });
                            });
                            //推荐标签添加事件埋点
                            $(".ev_operateTag").off("click").on("click",function(){
                                //事件埋点
                                var tagId=$(this).attr("tagId");
                                comm.creatEvent({
                                    async:false,
                                    triggerType:"标签",
                                    keyword:tagId,
                                    actionId:79
                                });
                            });
                            $(".lazyImg").lazyload({
                                //effect:"fadeIn",
                                //event:"scrollstop"
                                effect:"show",
                                event:"scroll"
                            });
                            module.dislikeAction();
                            if(itemsLength< t.params.pageSize){
                                $(".ev_recBox").attr("scrollPagination", "disabled");
                                return false;
                            }

                        }
                    }
                }
            });
        },
        guidance:function(){
            //引导页
            if(!TempCache.getItem("indexGuide")){
                $(".al-promptPopup").show();
                $('body').addClass('bodyScrollNone');
				TempCache.setItem("indexGuide","isHas");
            }
            $(".iKnow").off("click").on("click",function(){
                $(".al-promptPopup").hide();
                $('body').removeClass('bodyScrollNone');
				TempCache.setItem("indexGuide","isHas");
                if(!TempCache.getItem("discoverIndexTips")){
                    var sideBarTip = $(".promptLeftNav");
                    if(sideBarTip.length===1){
                        sideBarTip.show();
                    }
                }
                if(!TempCache.getItem("publishGuideHide")){
                    var topTips = $(".al-publishGuide");
                    if(topTips.length===1){
                        topTips.show();
                    }
                }
            });
            $(".al-promptPopupCont").css({"marginLeft":0,left:$(".al-indexInner").offset().left})
            $(window).resize(function() {
                $(".al-promptPopupCont").css({"left":$(".al-indexInner").offset().left});
            });

        }
    };
    controller.init();
    $(document).off("click").on('click','.al-contentImgList>a',function(){
    // $('.al-contentImgList>a').off("click").on('click',function(){
        var _index = $(this).index();
        var src = $(this).attr("href");
        var _a = $(this).parent().find("a");
        var _l = 0;
        for(var i=0; i<_a.length;i++){
            if(/http/g.test(_a.eq(i).attr("href"))){
                _l ++;
            }
        }
        if(!/http/g.test(src)){
            module.viewBigImgAll({
                container:$(this).parent(),
                typeTitle: "",
                index: _index-_l,
                reverse:"reverse"
            });
        }
    });
    scene.TopHeadLoginCallback= function(){
        controller.getRecommendRes('reloadData');//登录刷新资源
        //controller.bannerLoad(true);//轮播图加载
        //controller.bannerLoad(false);//首页广告位推荐
        controller.dynamicEntry();//加载动态入口
        // controller.guidance();
    };
});
