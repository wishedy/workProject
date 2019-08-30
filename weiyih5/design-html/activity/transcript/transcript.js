/**
 * Created by Yangmiaomiao on 2017/6/29.
 */
$(function(){
    var i = 0;
    function number(callback,time) {

        var timer = setInterval(callback,time)
    }

    number(function () {
        i++;
        $('.startUp1 p span').text(i)
        if(i == 100){
            clearInterval(timer)
        }
    },100000);
    
    function pages() {
        var i = 0;
        var t = setInterval(function () {
            if(i=0){

            }
        },2)
    }
    function time(s) {
        return s < 10 ? '0' + s: s;
    }
    var myDate = new Date();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)


    var now=time(h)+':'+time(m);
    $('.startTime i').text(now)
    if(h >= 0&&h < 12){
        $('.startTime span').text('AM')
    }else{
        $('.startTime span').text('PM')
    }
})
