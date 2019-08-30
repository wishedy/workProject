/**
 * 会议首页
 * Created by zhenghui on 2017/8/2.
 */
$(function(){
    var channelMeeting={
        path:{
            indexLoad:PC_CALL+'conference/index/getMapList/'
        },
        ele:{
            major:$('.al-screenCondition .major ul'),//专业下拉框
            date:$('.al-screenCondition .date .dateBor'),//日期下拉框
            dateYear:$('.date .dateYear ul'),//年份
            dateDay:$('.date .dateDay ul'),//月份
        },
        config:{
            dataLi:[]
        },
        //页面交互入口
        init:function(){
            var t=this;
            t.swiperInit();//轮播图相关操作
            t.selectLabel();//选择筛选条件
            t.dataReqInfor(true,true);//获取初始数据
        },
        //获取初始数据
        dataReqInfor:function(istrue,isLike,option){
            var t=this;
            var paramData={
                conferenceVersion:1,
                visitSiteId:1,
                platformId:$('#sesDepartment').val()||1,sessionCustomerId:$('#sesCustomerId').val()||""
            };
            paramData={
                param: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.indexLoad,
                data:paramData,
                type:"post",
                callback:function(req){
                    //console.log(req)
                    if(req.responseObject.responseStatus){
                        var data=req.responseObject.responseData,
                            youLikeArr=[
                                {name:'脊柱',id:1},
                                {name:'关节',id:0},
                                {name:'创伤',id:2},
                                {name:'2017年',id:6},
                            ],
                            listStr='';
                        if(isLike){
                            var  youLikeStr='';
                            //猜你喜欢
                            for(var i= 0,max=youLikeArr.length;i<max;i++){
                                if(parseInt(youLikeArr[i].name.slice(0,4))>0){
                                    youLikeStr+='<li class="youLikeDate" data-name="date" data-id="'+youLikeArr[i].id+'">'+youLikeArr[i].name+'</li>';
                                }else {
                                    youLikeStr+='<li data-name="major" data-id="'+youLikeArr[i].id+'">'+youLikeArr[i].name+'</li>';
                                }
                            }
                        }
                        //列表数据
                        for(var i= 0,max=data.data_list.length;i<max;i++){
                            var country='',
                                conference=data.data_list[i].conference;
                            if(conference.country && conference.conPlace){
                                country=conference.country+' &sdot; '+conference.conPlace;
                            }else {
                                country=conference.country||conference.conPlace;
                            }
                            listStr+='<li>'+
                                '  <a href="'+conference.conUrl+'"><span>脊柱</span>'+conference.conName+'</a>'+
                                '  <article class="">'+
                                '      <span class="meetingTime">'+comm.date.dateLocalJoint(conference.createTime,conference.endTime,'/','-')+'</span>'+
                                '      <span class="meetingAddress">'+country+'</span>'+
                                '      <span class="meetingLiving"><i></i>直播中</span>'+
                                '   </article>'+
                                '</li>';
                        }
                        $('.ev-screenNone').hide();
                        $('.ev-screenList ul,.ev-meetingListMore,.ev-results').show();
                        if(isLike){
                            $('.ev-screenYouLike .likeTab').html(youLikeStr);
                        }
                        if(istrue){
                            $('.ev-screenList ul').html(listStr);
                        }else {
                            $('.ev-screenList ul').append(listStr);
                        }
                        t.majorLike();
                        t.moreReqInfor();//加载更多数据
                    }else {
                        $('.ev-screenList ul,.ev-meetingListMore,.ev-results').hide();
                        $('.ev-screenNone').show();
                    }
                }
            })
        },
        //点击查看更多
        moreReqInfor:function(){
            var t=this;
            $('.ev-meetingListMore').off('click').on('click',function(){
                var option={};
                t.dataReqInfor(false,option);//获取初始数据
            });
        },
        //专业与猜你喜欢相关联
        majorLike:function(){
            var t=this;
            var youLike=$('.ev-screenYouLike li'),
                majorLi=$('.al-majorList li'),
                majorSpan=$('.al-screenCondition .major span'),
                yearLi=t.ele.dateYear.find('li'),
                dayLi=t.ele.dateDay.find('li');
            majorLi.off('click').on('click',function(){
                t.ele.major.hide();
                t.ele.major.parent().removeClass('show')
                    .attr('data-id',$(this).attr('data-id'))
                    .find('span').text($(this).text());
                var dataId=$(this).attr('data-id');
                youLike.each(function(index,ele){
                    if($(ele).attr('data-id')==dataId){
                        $(ele).addClass('active');
                    }else if($(ele).attr('data-name')!='date'){
                        $(ele).removeClass('active');
                    }
                });
                //console.log(t.findActive())
                t.dataReqInfor(true,false);//获取初始数据
            });
            youLike.off('click').on('click',function(){
                var $this=$(this);
                $this.toggleClass('active');
                if($this.attr('data-name')=='date'){
                    if($this.hasClass('active')){
                        yearLi.each(function(index,ele){
                            if(parseInt($(ele).text())==parseInt($this.text().slice(0,4))){
                                if($(ele).hasClass('active')){
                                    $(ele).attr('data-month','');
                                    for(var i= 0,max=channelMeeting.config.dataLi.length;i<max;i++){
                                        if(channelMeeting.config.dataLi[i].year==$(ele).text()){
                                            channelMeeting.config.dataLi[i].month='';
                                        }
                                    }
                                }else {
                                    $(ele).addClass('active');
                                    $(ele).attr('data-month','')
                                    channelMeeting.config.dataLi.push({
                                        year:$(ele).text(),
                                        month:''
                                    })
                                }

                            }
                        })
                    }else {
                        yearLi.each(function(index,ele){
                            if(parseInt($(ele).text())==parseInt($this.text().slice(0,4))){
                                if($(ele).hasClass('active')){
                                    $(ele).removeClass('active');
                                    $(ele).attr('data-month','');
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
                                majorSpan.text($this.text()).parent().attr('data-id',$this.attr('data-id'));
                            }
                        }else if(!youLike.eq($this.index()).hasClass('active')){
                            majorSpan.text('专业').parent().attr('data-id','');
                        }
                    })
                }
                //console.log(channelMeeting.config)
                //console.log(t.findActive())
                t.dataReqInfor(false);//获取初始数据
            });
        },
        //查找激活状态
        findActive:function(){
            var youLikeLi=$('.ev-screenYouLike li'),
                major=$('.al-screenCondition .major'),
                majorId='',
                youLikeId=[];
            majorId=$('.al-screenCondition .major').attr('data-id');
            youLikeLi.each(function(index,ele){
                if($(ele).hasClass('active')){
                    youLikeId.push($(ele).attr('data-id'));
                }
            })
            return {
                majorId:majorId,
                youLikeId:youLikeId
            }
        },
        //选择筛选条件
        selectLabel:function(){
            var t=this;
            $('body').off('click').on('click',function(e){
                if(!($(e.target).parents().hasClass('major')||$(e.target).parents().hasClass('date')||$(e.target).hasClass('major')||$(e.target).hasClass('date'))){
                    t.ele.major.hide().parent().removeClass('show');
                    t.ele.date.hide().parent().removeClass('show');
                }
            });
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
                }else if($target.hasClass('date')||$target.parent().hasClass('date')){
                    //点击日期
                    var target= $target.hasClass('date') ? $target : $target.parent();
                    target.toggleClass('show');
                    t.ele.major.hide();
                    target.hasClass('show') ? t.ele.date.show() : t.ele.date.hide();
                    //年月日期点击事件
                    t.selectDate();
                }
            });
        },
        //年月日期点击事件
        selectDate:function(){
            var t=this,
                yearLi=t.ele.dateYear.find('li'),
                dayLi=t.ele.dateDay.find('li'),
                maxLength=t.monthLength().length;
            if(yearLi.length-1!=maxLength){
                var str='<li>全部</li>';
                for(var i= 0;i<maxLength;i++){
                    str+='<li>'+t.monthLength()[i]+'</li>';
                }
                t.ele.dateYear.html(str);
                yearLi=t.ele.dateYear.find('li');
                dayLi=t.ele.dateDay.find('li');
            }
            //选择年,月
            t.selectYear(yearLi,dayLi);
        },
        //选择年,月
        selectYear:function(yearLi,dayLi){
            var t=this;
            //年份点击
            yearLi.off('click').on('click',function(){
                $('.date .dateDay').show();
                var that=$(this);
                yearLi.attr('data-new',false).removeClass('activeBg');
                that.toggleClass('active').attr('data-new',true).addClass('activeBg');
                dayLi.removeClass('active');
                if(that.hasClass('active')){
                    if(!that.attr('data-month')||that.attr('data-month')==''){
                        $('.dateDay p').addClass('active');
                    }else {
                        $('.dateDay p').removeClass('active');
                    }

                }else {
                    that.attr('data-month','')
                    $('.dateDay p').removeClass('active');
                }
                //隐藏没到的月份
                if(that.text()==t.dataInfor().year){
                    dayLi.each(function(index,ele){
                        if(parseInt($(ele).text().slice(0,2))>t.dataInfor().month){
                            $(ele).hide();
                        }
                    })
                }else {
                    dayLi.show();
                }
                //年份未点击月份隐藏
                if( that.index()>0){
                    yearLi.eq(0).removeClass('active');
                    $('.date .dateDay').show();
                    $('.ev-active').addClass('active');
                }else if(that.index()==0){
                    yearLi.removeClass('active');
                    yearLi.eq(0).addClass('active');
                    yearLi.attr('data-month','');
                    $('.date .dateDay').hide();
                }
            });
            //月份点击
            dayLi.off('click').on('click',function(){
                var that=$(this);
                that.toggleClass('active');
                //将月份以属性的方式增加到年份上
                for (var i= 0,max=yearLi.length;i<max;i++){
                    if(yearLi.eq(i).attr('data-new')=='true'){
                        yearLi.eq(i).addClass('active');
                        if(that.hasClass('active')){
                            var dataMonth=yearLi.eq(i).attr('data-month') ? yearLi.eq(i).attr('data-month')+that.text()+',' : that.text()+',';
                            yearLi.eq(i).attr('data-month',dataMonth);
                        }else {
                            var dataMonth=yearLi.eq(i).attr('data-month');
                            yearLi.eq(i).attr('data-month',dataMonth.replace(that.text()+',',''));
                        }
                    }
                }
                //年份未点击月份隐藏
                if(t.ele.dateDay.find('.active').length>0){
                    $('.dateDay p,.youLikeDate').removeClass('active');
                }else {
                    $('.dateDay p,.youLikeDate').addClass('active');
                }
            });
            //确定按钮
            $('.ev-active').off('click').on('click',function(){
                var option=[];
                for(var i= 0,max=yearLi.length; i<max;i++){
                    if(yearLi.eq(i).hasClass('active')){
                        var yearObj={};
                        yearObj.year=yearLi.eq(i).text();
                        yearObj.month=yearLi.eq(i).attr('data-month');
                        option.push(yearObj);
                    }
                }
                t.ele.date.hide().parent().removeClass('show')
                    .find('span').text('已选');
                if(option.length==0){
                    t.ele.date.hide().parent().removeClass('show')
                        .find('span').text('日期');
                }
                $('.youLikeDate').removeClass('active');
                for (var i= 0,max=option.length;i<max;i++){
                    if(parseInt(option[i].year)==parseInt($('.youLikeDate').text().slice(0,4))&&((!option[i].month)||option[i].month=='')){
                        $('.youLikeDate').addClass('active');
                    }
                }
                channelMeeting.config.dataLi=option;
                //console.log(channelMeeting.config);
                //console.log(t.findActive())
                t.dataReqInfor(true,false);//获取初始数据
            });
            //月份“全部”点击
            $('.dateDay p').off('click').on('click',function(){
                var that=$(this);
                that.toggleClass('active');
                dayLi.removeClass('active');
                for (var i= 0,max=yearLi.length;i<max;i++){
                    if(yearLi.eq(i).attr('data-new')=='true'){
                        yearLi.eq(i).addClass('active');
                        yearLi.eq(i).attr('data-month','');
                    }
                }
            });
            //重置按钮点击
            $('.ev-reset').off('click').on('click',function(){
                yearLi.removeClass('active').attr('data-month','');
                dayLi.removeClass('active');
                $('.dateDay p').removeClass('active');
            });
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
        swiperInit:function(){
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
                locationId=$(this).index()+1;
                //事件埋点
                comm.creatEvent({
                    async:false,
                    triggerType:"广告",
                    keyword:'广告位-轮播图(热门)-'+$(this).find("img").attr("alt"),
                    locationId:locationId,
                    actionId:14
                });
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
