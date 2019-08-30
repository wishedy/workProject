/**
 * 会议首页
 * Created by zhenghui on 2017/8/2.
 */
$(function(){
    var channelMeeting={
        path:{
            getBannerList:PC_CALL+'conference/index/getBannerList/',//广告位
            getScreeningCondition:PC_CALL+'conference/index/getScreeningCondition/',//筛选条件
            getMapList:PC_CALL+'conference/index/getMapListV4/'//内容列表
        },
        ele:{
            major:$('.al-screenCondition .major ul'),//专业下拉框
            date:$('.al-screenCondition .date .dateBor'),//日期下拉框
            dateYear:$('.date .dateYear ul'),//年份
            dateDay:$('.date .dateDay ul'),//月份
        },
        config:{
            pageIndex:1,
            dataLi:[]
        },
        //页面交互入口
        init:function(){
            var t=this;
            t.bannerList();//获取轮播图数据
            t.condition();//选择专业和猜你喜欢列表
            t.selectLabel();//选择筛选条件
            t.dataReqInfor(true,{});//获取初始数据列表
            t.toggleTab();//会议tab事件埋点
        },
        //获取轮播图数据
        bannerList:function(){
            var t=this;
            var paramData={
                visitSiteId:1,
                platformId:$('#sesDepartment').val()||1,
                customerId:$('#sesCustomerId').val()||""
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.getBannerList,
                data:paramData,
                type:"post",
                callback:function(req){
                    if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list&&req.responseObject.responseData.data_list.length>0){
                        var responseData=req.responseObject.responseData.data_list,
                            bannerStr='';
                        for(var i= 0,max=responseData.length;i<max;i++){
                            bannerStr+=' <figure class="swiper-slide" adId="'+responseData[i].id+'">'+
                                '                    <a href="'+(responseData[i].linkUrl?responseData[i].linkUrl:'javascript:;')+'" data-alcode-item="a1.66.94.1" data-id="'+responseData[i].id+'">'+
                                '                        <img src="'+responseData[i].adAttUrl+'" alt="'+responseData[i].adAttName+'">'+
                                '                    </a>'+
                                '                </figure>';
                        }
                        $('.ev-swiperWrapper').html(bannerStr);
                        if(responseData.length>1){
                            $('.ev-pagination').html('<span class="swiper-pagination-switch swiper-visible-switch swiper-active-switch"></span>');
                        }
                        t.swiperInit(responseData.length);//轮播图相关操作
                    }
                }
            })
        },
        //获取专业和猜你喜欢列表
        condition:function(){
            var t=this;
            var paramData={
                sessionCustomerId:$('#sesCustomerId').val()||"",
                platformId:$('#sesDepartment').val()||1
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.getScreeningCondition,
                data:paramData,
                type:"post",
                callback:function(req){
                    if(comm.hasResponseData(req)){
                        var majorList=req.responseObject.responseData.majorList,
                            authMajorList=req.responseObject.responseData.authMajorList,
                            authMajorStr='',
                            youLikeStr='';
                        //专业列表
                        authMajorStr+='<li data-id="" data-tagType="1">全部</li>';
                        for(var i= 0,max=majorList.length;i<max;i++){
                            authMajorStr+='<li data-id="'+majorList[i].tagId+'" data-tagType="'+majorList[i].tagType+'">'+majorList[i].tagName+'</li>';
                        }
                        //猜你喜欢
                        for(var i= 0,max=authMajorList.length;i<max;i++){
                            if(authMajorList[i].tagType=='2'){
                                youLikeStr+='<li class="youLikeDate" data-name="date" data-id="'+authMajorList[i].tagId+'">'+authMajorList[i].tagName+'</li>';
                            }else {
                                youLikeStr+='<li data-name="major" data-id="'+authMajorList[i].tagId+'">'+authMajorList[i].tagName+'</li>';
                            }
                        }
                        $('.al-majorList').html(authMajorStr);
                        $('.ev-screenYouLike .likeTab').html(youLikeStr);
                        $('#sesDepartment').val()=='2' ?  $('.al-majorList').addClass('handSurgery') :$('.al-majorList').removeClass('handSurgery');
                        t.selectLabel();//选择筛选条件
                        t.majorLike();//专业与猜你喜欢相关联
                    }
                }
            })
        },
        //获取初始数据
        dataReqInfor:function(istrue,option){
            var t=this;
            var paramData={
                scene:0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                subjectTeamId:option.subjectTeamId||'',//专业标签
                runState:option.runState||'',//会议状态（0-未进行，1-已进行）
                shootState:option.shootState||'',//拍摄状态（0-不拍摄，1-拍摄）
                openTime:option.openTime||'',//	时间筛选（多个时间以“_”分隔）
                pageIndex:channelMeeting.config.pageIndex,
                pageSize:20,
                platformId:$('#sesDepartment').val()||1
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            var callBack = function(req){
                comm.localData.storeLocalData(t.path.getMapList,req);
                if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list&&req.responseObject.responseData.data_list.length>0){
                    var dataList=req.responseObject.responseData.data_list,
                        total=req.responseObject.responseData.total,
                        listStr='';
                    //列表数据
                    for(var i= 0,max=dataList.length;i<max;i++){
                        listStr+='<li>'+
                            '  <a href="'+dataList[i].conUrl+'" data-id="'+dataList[i].conId+'">'+
                            (dataList[i].conTag?'<span>'+dataList[i].conTag+'</span>':'')+dataList[i].conName+
                            '  </a>'+
                            '    <article class="">'+
                            (dataList[i].startTime&&dataList[i].endTime?'<span class="meetingTime">'+comm.date.dateLocalJoint(dataList[i].startTime,dataList[i].endTime,'/','-')+'</span>':'')+
                            (dataList[i].conAddr?'<span class="meetingAddress">'+dataList[i].conAddr+'</span>':'')+
                            (dataList[i].isLive=='1'? '<span class="meetingLiving"><i></i>直播中</span>':'')+
                            '    </article>'+
                            '</li>';
                    };
                    $('.ev-screenNone').hide();
                    $('.ev-screenList ul, .ev-results').show();
                    if(istrue){
                        $('.ev-results span').html(total);
                        $('.ev-screenList ul').html(listStr);
                        if(req.responseObject.responseData.liveState=='1'){
                            $('.al-headerTopNav .active').append('<i class="meetingI"></i>');
                        }else {
                            $('.al-headerTopNav .active');
                        }
                    }else {
                        $('.ev-screenList ul').append(listStr);
                    }
                    if(total<20||dataList.length<20){
                        $('.ev-meetingListMore').hide();
                    }else {
                        $('.ev-meetingListMore').show();
                    }
                    t.moreReqInfor();//加载更多数据
                }else {
                    if(istrue){
                        $('.ev-screenList ul').hide();
                        $('.ev-screenNone').show();
                    }
                    $('.ev-meetingListMore').hide();
                    $('.ev-results').show().find('span').html('0');
                }
            };
            if(istrue){
                comm.localData.getLocalData({
                    path: t.path.getMapList,
                    exhibitionData: callBack,
                    requestData: function () {
                        t.ajax({
                            url: t.path.getMapList,
                            data:paramData,
                            type:"post",
                            callback:callBack
                        })
                    }
                });
            }else {
                t.ajax({
                    url: t.path.getMapList,
                    data:paramData,
                    type:"post",
                    callback:callBack
                })
            }

        },
        //点击查看更多
        moreReqInfor:function(){
            var t=this;
            $('.ev-meetingListMore').off('click').on('click',function(){
                channelMeeting.config.pageIndex++;
                var option={
                    subjectTeamId:t.findActive().subjectTeamId,
                    openTime:t.transitionDate(channelMeeting.config.dataLi)
                };
                t.dataReqInfor(false,option);//获取初始数据
            });
        },
        //专业与猜你喜欢相关联
        majorLike:function(){
            var t=this,
                youLike=$('.ev-screenYouLike li'),
                majorLi=$('.al-majorList li'),
                majorSpan=$('.al-screenCondition .major span'),
                yearLi=t.ele.dateYear.find('li'),
                dayLi=t.ele.dateDay.find('li');
            //专业列表选择
            majorLi.off('click').on('click',function(){
                t.ele.major.hide();
                t.ele.major.parent().removeClass('show')
                    .attr('data-id',$(this).attr('data-id'))
                    .find('span').text(comm.getStrLen($(this).text(),6));
                var dataId=$(this).attr('data-id');
                //绑定猜你喜欢
                youLike.each(function(index,ele){
                    if($(ele).attr('data-id')==dataId){
                        $(ele).addClass('active');
                    }else if($(ele).attr('data-name')!='date'){
                        $(ele).removeClass('active');
                    }
                });
                //btn-筛选专业选择
                var text=$(this).text();
                comm.creatEvent({
                    triggerName:'btn-筛选专业选择',
                    triggerType:"筛选",
                    keyword:text,
                    actionId:11016
                });
                var option={
                    subjectTeamId:t.findActive().subjectTeamId,
                    openTime:t.transitionDate(channelMeeting.config.dataLi)
                };
                channelMeeting.config.pageIndex=1;
                t.dataReqInfor(true,option);//获取初始数据
            });
            //猜你喜欢列表选择
            youLike.off('click').on('click',function(){
                var $this=$(this);
                $this.toggleClass('active');
                if($this.attr('data-name')=='date'){
                    //绑定日期
                    if($this.hasClass('active')){
                        yearLi.each(function(index,ele){
                            if(parseInt($(ele).text(),10)==parseInt($this.text(),10)){
                                if($(ele).hasClass('active')){
                                    for(var i= 0,max=channelMeeting.config.dataLi.length;i<max;i++){
                                        if(channelMeeting.config.dataLi[i].year==$(ele).text()){
                                            channelMeeting.config.dataLi[i].month='0';
                                        }
                                    }
                                }else {
                                    $(ele).addClass('active');
                                    channelMeeting.config.dataLi.push({
                                        year:$(ele).text(),
                                        month:'0'
                                    })
                                }
                                if(parseInt($(ele).text(),10)!= t.dataInfor().year){
                                    $('.date .dateDay li,.dateDay').show();
                                }
                                $(ele).siblings('li').removeClass('activeBg');
                                $(ele).attr('data-month','0').addClass('activeBg');
                                $('.date .dateDay p').addClass('active');
                                $('.date .dateDay li').removeClass('active');
                            }
                        })
                    }else {
                        yearLi.each(function(index,ele){
                            if(parseInt($(ele).text(),10)==parseInt($this.text(),10)){
                                if($(ele).hasClass('active')){
                                    $(ele).removeClass('active');
                                    $(ele).attr('data-month','');
                                    $('.date .dateDay p').removeClass('active');
                                }
                                var index=-1;
                                for(var i= 0,max=channelMeeting.config.dataLi.length;i<max;i++){
                                    if(channelMeeting.config.dataLi[i].year==$(ele).text()){
                                        index=i;
                                    }
                                }
                                if(index!=-1){
                                    channelMeeting.config.dataLi.splice(index, 1);
                                }
                            }
                        })
                    }
                }else {
                    //绑定专业
                    youLike.each(function(index,ele){
                        if(index!=$this.index()&&$(ele).attr('data-name')!='date'){
                            $(ele).removeClass('active');
                        }else if(youLike.eq($this.index()).hasClass('active')){
                            var eleLength=0;
                            majorLi.each(function(index,ele){
                                if($(ele).attr('data-id')==$this.attr('data-id')){
                                   eleLength++;
                                }
                            })
                            if(eleLength==0){
                                majorSpan.text('专业').parent().attr('data-id','');
                            }else {
                                majorSpan.text(comm.getStrLen($this.text(),6)).parent().attr('data-id',$this.attr('data-id'));
                            }
                        }else if(!youLike.eq($this.index()).hasClass('active')){
                            majorSpan.text('专业').parent().attr('data-id','');
                        }
                    })
                }
                var option={
                    subjectTeamId:t.findActive().subjectTeamId,
                    openTime:t.transitionDate(channelMeeting.config.dataLi)
                };
                //会议推荐筛选项
                comm.creatEvent({
                    triggerName:'会议推荐筛选项',
                    triggerType:"筛选",
                    keyword:$this.text(),
                    actionId:11014
                });
                channelMeeting.config.pageIndex=1;
                t.dataReqInfor(true,option);//获取初始数据
            });
        },
        //查找激活状态
        findActive:function(){
            var youLikeLi=$('.ev-screenYouLike li'),
                major=$('.al-screenCondition .major'),
                majorId='',
                youLikeId=[];
                majorId=$('.al-screenCondition .major').attr('data-id');
            //youLikeLi.each(function(index,ele){
            //    if($(ele).hasClass('active')&&!$(ele).hasClass('youLikeDate')&&$(ele).attr('data-id')!=majorId){
            //        youLikeId.push($(ele).attr('data-id'));
            //    }
            //})
            return {
                subjectTeamId:majorId
                //youLikeId:youLikeId
            }
        },
        //选择筛选条件
        selectLabel:function(){
            var t=this;
            //点击非目标区域
            $('body').off('click').on('click',function(e){
                if(!($(e.target).parents().hasClass('major')||$(e.target).parents().hasClass('date')||$(e.target).hasClass('major')||$(e.target).hasClass('date'))){
                    t.ele.major.hide().parent().removeClass('show');
                    t.ele.date.hide().parent().removeClass('show');
                }
            });
            //点击目标区域
            $('.al-screenCondition').off('click').on('click',function(e){
                var $target=$(e.target);
                if($target.hasClass('major')||$target.parent().hasClass('major')){
                    //点击专业
                    var target= $target.hasClass('major') ? $target : $target.parent();
                    target.toggleClass('show');
                    t.ele.date.hide();
                    target.hasClass('show') ? t.ele.major.show() : t.ele.major.hide() ;
                    var dataId=target.attr('data-id');
                    t.ele.major.find('li').removeClass('active').each(function(index,ele){
                        if($(ele).attr('data-id')==dataId){
                            $(ele).addClass('active');
                        }
                    });
                    $('.al-majorList li').addClass('handSurgeryli');
                    //会议btn-筛选项呼出
                    comm.creatEvent({
                        triggerName:'会议btn-筛选项呼出',
                        triggerType:"筛选",
                        keyword:'',
                        actionId:11015
                    });
                }else if($target.hasClass('date')||$target.parent().hasClass('date')){
                    //会议btn-筛选项呼出
                    comm.creatEvent({
                        triggerName:'会议btn-筛选项呼出',
                        triggerType:"筛选",
                        keyword:'',
                        actionId:11015
                    });
                    //点击日期
                    var target= $target.hasClass('date') ? $target : $target.parent();
                    target.toggleClass('show');
                    t.ele.major.hide();
                    target.hasClass('show') ? t.ele.date.show() : t.ele.date.hide();
                    $('.date .dateYear ul li,.date .dateDay p,.date .dateDay li').removeClass('active');
                    $('.date .dateYear ul li').attr('data-month','');
                    for(var i= 0,max=channelMeeting.config.dataLi.length;i<max;i++){
                        $('.date .dateYear ul li').each(function(index,ele){
                            if($(ele).text()==channelMeeting.config.dataLi[i].year){
                                $(ele).addClass('active').attr('data-month',channelMeeting.config.dataLi[i].month);
                                if($(ele).text()==$('.youLikeDate').text()&&$('.youLikeDate').hasClass('active')){
                                    $(ele).addClass('activeBg').attr('data-new',true);
                                    $(ele).siblings('li').removeClass('activeBg').attr('data-new',false);
                                    if($(ele).text()==t.dataInfor().year){
                                        $('.date .dateDay li').each(function(index,ele){
                                            if(parseInt($(ele).text(),10)>t.dataInfor().month){
                                                $(ele).hide().addClass('ev-hide');
                                            }else {
                                                $(ele).removeClass('ev-hide');
                                            }
                                        })
                                    }else {
                                        $('.date .dateDay li').show();
                                        $('.date .dateDay li').removeClass('ev-hide');
                                    }
                                }
                            }
                            if($(ele).hasClass('activeBg')){
                                if($(ele).hasClass('active')){
                                    if(channelMeeting.config.dataLi[i].month&&channelMeeting.config.dataLi[i].month=='0'){
                                        $('.date .dateDay p').addClass('active');
                                        $('.date .dateDay li').removeClass('active');
                                    }else if(channelMeeting.config.dataLi[i].month&&channelMeeting.config.dataLi[i].month!='0'){
                                        $('.date .dateDay li').each(function(index,ele){
                                            if(channelMeeting.config.dataLi[i].month.indexOf($(ele).text())!=-1){
                                                $(ele).addClass('active');
                                            }
                                        })
                                    }
                                }else {
                                    $('.date .dateDay p,.date .dateDay li').removeClass('active');
                                }
                            }
                        })
                    }
                    //年月日期点击事件
                    dataPicker({
                        yearContainer:$('.date .dateYear ul'),//包含年份的标签
                        monthContainer:$('.date .dateDay'),//包含月份的标签
                        yearEle:'li',//包裹年的元素，默认是li标签
                        isAllYear:true,//年列表是否需要全部按钮，默认是true
                        year:2013,
                        insure:$('.ev-active'),//确定按钮
                        reset:$('.ev-reset'),//重置按钮
                        yearcallBack:function(ele){
                            //btn-筛选项年份选择
                            comm.creatEvent({
                                triggerName:'btn-筛选项年份选择',
                                triggerType:"筛选",
                                keyword:ele.text(),
                                actionId:11017
                            });
                        },
                        monthcallBack:function(ele,text){
                            //btn-筛选项月份选择
                            comm.creatEvent({
                                triggerName:'btn-筛选项月份选择',
                                triggerType:"筛选",
                                keyword:text,
                                actionId:11018
                            });
                        },
                        AllmonthcallBack:function(ele,text){
                            //btn-筛选项月份选择
                            comm.creatEvent({
                                triggerName:'btn-筛选项月份选择',
                                triggerType:"筛选",
                                keyword:text,
                                actionId:11018
                            });
                        },
                        callBack:function(option){
                            t.ele.date.hide().parent().removeClass('show')
                                .find('span').text('已选');
                            if(option.length==0){
                                t.ele.date.hide().parent().removeClass('show')
                                    .find('span').text('日期');
                            }
                            $('.youLikeDate').removeClass('active');
                            for (var i= 0,max=option.length;i<max;i++){
                                if(parseInt(option[i].year,10)==parseInt($('.youLikeDate').text(),10)&&((!option[i].month)||option[i].month=='0')){
                                    $('.youLikeDate').addClass('active');
                                }
                            }
                            //btn-筛选项确定
                            comm.creatEvent({
                                triggerName:'btn-筛选项确定',
                                triggerType:"筛选",
                                keyword:'',
                                actionId:11019
                            });
                            channelMeeting.config.dataLi=option;
                            var option={
                                subjectTeamId:t.findActive().subjectTeamId,
                                openTime:t.transitionDate(channelMeeting.config.dataLi)
                            };
                            channelMeeting.config.pageIndex=1;
                            t.dataReqInfor(true,option);//获取初始数据
                        }//回调函数
                    })
                }
            });
        },
        //日期转换
        transitionDate:function(dataArr){
            var dateStr='';
            for(var i= 0,maxI=dataArr.length;i<maxI;i++){
                if((dataArr[i].month)&&(dataArr[i].month!='')&&(dataArr[i].month!='0')){
                    var dataMonth=dataArr[i].month.split(',');
                    for(var j= 0,maxJ=dataMonth.length;j<maxJ;j++){
                        if(dataMonth[j]!=''){
                            dateStr+=dataArr[i].year+'-'+dataMonth[j].slice(0,dataMonth[j].length-1)+'_';
                        }
                    }
                }else {
                    dateStr+=dataArr[i].year+'_';
                }

            }
            dateStr=dateStr.slice(0,dateStr.length-1);
            if(dateStr=='全部'){
                dateStr='';
            }
            return dateStr;
        },
        //获取当前年月日
        dataInfor:function(){
            var date=new Date,
                year=date.getFullYear(),
                month=date.getMonth()+ 1,
                day=date.getDate();
            return {
                year:year,
                month:month,
                day:day
            }
        },
        //年份下拉框
        monthLength:function(){
            var t=this,
                monthArr=[],
                month=t.dataInfor().year;
            for(var i=month;i>=2013;i--){
                monthArr.push(i);
            }
            return monthArr;
        },
        //swiper初始化以及广告位的相关操作
        swiperInit:function(slideLength){
            if(slideLength>1){
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
            }
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
        },
        //会议首页Tab切换事件埋点
        toggleTab:function(){
            $('.meetingNav p').on('click',function(){
                if($(this).hasClass('meetingFellow')){
                    comm.creatEvent({
                        triggerName:'首页-会议tab',
                        triggerType:"会议tab",
                        keyword:'我关注的会议',
                        actionId:11011
                    });
                }else {
                    comm.creatEvent({
                        triggerName:'首页-会议tab',
                        triggerType:"会议tab",
                        keyword:'会议预告',
                        actionId:11011
                    });
                }
            })

        },
        //ajax请求
        ajax:function(option) {
            comm.LightBox.showloading();
            $.ajax({
                url: option.url,
                type: option.type,
                dataType: 'json',
                data: option.data,
                success: function(req) {
                    comm.LightBox.hideloading();
                    option.callback(req);

                },
                error: function(xhr, type, error) {
                    comm.LightBox.hideloading();
                }
            });
        },


    };
    channelMeeting.init();
});
