/**日期选择
 * Created by ALLIN on 2017/8/8.
 * module.selectDate(option)
 * option({
 *     yearContainer:$('.dateYear ul'),//包含年份的标签
 *     yearEle:'li',//包裹年的元素，默认是li标签
 *     isAllYear:true,//年列表是否需要全部按钮
 *     monthContainer:$('.dateDay'),//包含月份的标签
 *     monthEle:'li',//包裹月的元素，默认是li标签
 *     year:2013,//year到当前年份，默认是2013-当前年份,可不传
 *     insure:$('.insure'),//确定按钮
 *     reset:$('.reset'),//重置按钮
 *     yearcallBack:function(){},//点击年的时候回调
       monthcallBack:function(){},//点击月的时候回调
       AllmonthcallBack:function(){},//点击月的时候回调
 *     callBack:function(){},//点击确定按钮回调函数
 *
 * })
 */

module.selectDate=function(option){
    var selectDate={
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
        //年份下拉框内容
        yearArr:function(option){
            var t=this,
                yearArr=[],
                yearEle=option.yearEle||'li',
                monthEle=option.monthEle||'li',
                year=t.dataInfor().year,
                yearLi=option.yearContainer.find(yearEle),
                monthLi=option.monthContainer.find(monthEle),
                minYear=option.year||2013;
            for(var i=year;i>=minYear;i--){
                yearArr.push(i);
            }
            if((option.isAllYear&&yearArr.length!=yearLi.length-1)||(!option.isAllYear&&yearArr.length!=yearLi.length)){
                var str='';
                if(option.isAllYear){
                    str='<'+yearEle+'>全部</'+yearEle+'>'
                }
                for(var i= 0,max=yearArr.length;i<max;i++){
                    str+='<'+yearEle+'>'+yearArr[i]+'</'+yearEle+'>';
                }
                option.yearContainer.html(str);
                yearLi=option.yearContainer.find(yearEle);
                monthLi=option.monthContainer.find(monthEle);
            }
            //选择年,月
            t.selectYear(yearLi,monthLi,option);
        },
        //选择年,月
        selectYear:function(yearLi,monthLi,option){
            var t=this,
                monthAll=option.monthContainer.find('p');
            //年份点击
            yearLi.off('click').on('click',function(){
                option.monthContainer.show();
                var that=$(this);
                yearLi.attr('data-new',false).removeClass('activeBg');
                that.toggleClass('active').attr('data-new',true).addClass('activeBg');
                monthLi.removeClass('active');
                //当单击年份判断全部按钮是否显示
                if(that.hasClass('active')){
                    if(!that.attr('data-month')||that.attr('data-month')==''){
                        monthAll.addClass('active');
                        that.attr('data-month','0');
                    }else {
                        monthAll.removeClass('active');
                    }
                }else {
                    that.attr('data-month','')
                    monthAll.removeClass('active');
                }
                //月份未选择去掉年份激活
                yearLi.siblings('li').each(function(index,ele){
                    if(!$(ele).attr('data-month')){
                        $(ele).removeClass('active');
                    }
                });
                //隐藏当年未到的月份
                if(that.text()==t.dataInfor().year){
                    monthLi.each(function(index,ele){
                        if(parseInt($(ele).text(),10)>t.dataInfor().month){
                            $(ele).hide().addClass('ev-hide');
                        }else {
                            $(ele).removeClass('ev-hide');
                        }
                    })
                }else {
                    monthLi.show();
                    monthLi.removeClass('ev-hide');
                }
                //点击全部年份，月份隐藏
                if(option.isAllYear){
                    if( that.index()>0){
                        yearLi.eq(0).removeClass('active');
                        option.monthContainer.show();
                    }else if(that.index()==0){
                        yearLi.eq(0).siblings('li').removeClass('active').attr('data-month','');
                        option.monthContainer.hide();
                    }
                }
                option.yearcallBack&&option.yearcallBack(that);
            });
            //月份点击
            monthLi.off('click').on('click',function(){
                var that=$(this);
                that.toggleClass('active');
                var newLi='',monthText='';
                //将月份以“data-month”属性的方式增加到年份上
                for (var i= 0,max=yearLi.length;i<max;i++){
                    if(yearLi.eq(i).attr('data-new')=='true'){
                        monthText=yearLi.eq(i).text()+'-'+parseInt(that.text(),10);
                        yearLi.eq(i).addClass('active');
                        newLi=i;
                        if(that.hasClass('active')){
                            var dataMonth=yearLi.eq(i).attr('data-month')!='0' ? yearLi.eq(i).attr('data-month')+that.text()+',' : that.text()+',';
                            yearLi.eq(i).attr('data-month',dataMonth);
                        }else {
                            var dataMonth=yearLi.eq(i).attr('data-month');
                            yearLi.eq(i).attr('data-month',dataMonth.replace(that.text()+',',''));
                        }
                    }
                }
                //月份点击全年取消
                if(option.monthContainer.find('ul .active').length>0&&option.monthContainer.find('ul .active').length<12-option.monthContainer.find('ul .ev-hide').length){
                    monthAll.removeClass('active');
                }else if(option.monthContainer.find('ul .active').length==12-option.monthContainer.find('ul .ev-hide').length){
                    monthAll.addClass('active');
                    monthLi.removeClass('active');
                    if(newLi&&newLi!=''){
                        yearLi.eq(newLi).attr('data-month','0');
                    }
                }
                option.monthcallBack&&option.monthcallBack(that,monthText);
            });
            //确定按钮
            option.insure.off('click').on('click',function(){
                var yearArr=[];
                yearLi.each(function(index,ele){
                    if($(ele).hasClass('active')){
                        if($(ele).attr('data-month')!=''||$(ele).text()=='全部'){
                            var yearObj={};
                            yearObj.year=$(ele).text();
                            yearObj.month=$(ele).attr('data-month');
                            yearArr.push(yearObj);
                        }else {
                            $(ele).removeClass('active')
                        }
                    }
                })
                console.log(yearArr)
                option.callBack&&option.callBack(yearArr);
            });
            //月份“全部”点击
            monthAll.off('click').on('click',function(){
                var that=$(this),monthText='';
                that.toggleClass('active');
                monthLi.removeClass('active');
                yearLi.each(function(index,ele){
                    if($(ele).attr('data-new')=='true'){
                        monthText=$(ele).text()+'-'+that.text();
                        $(ele).addClass('active');
                        that.hasClass('active') ? $(ele).attr('data-month','0'):$(ele).attr('data-month','');
                    }
                })
                option.AllmonthcallBack&&option.AllmonthcallBack(that,monthText)
            });
            //重置按钮点击
            option.reset.off('click').on('click',function(){
                yearLi.removeClass('active').attr('data-month','');
                monthLi.removeClass('active');
                monthAll.removeClass('active');
            });
        },
    }
    selectDate.yearArr(option);
}