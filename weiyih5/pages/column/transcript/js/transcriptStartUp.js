/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by WangNing on 2017/12/4.
 */

$(function () {
    /*load方法*/

    if(document.location.protocol =="http:"){
        var Url=document.location.href;
        document.location.href="https:"+ Url.substring(5,Url.length);
        return false;
    }
    localStorage &&  localStorage.removeItem("otherTranscriptData"); //清除缓存
    localStorage &&  localStorage.removeItem("otherUserId"); //清除缓存
    var startUpAudio = document.getElementById('startUpAudio'),
        clickAudio = document.getElementById('clickAudio'),
        typingAudio = document.getElementById('typingAudio'),
        waterAudio = document.getElementById('waterAudio'),
        startUp2Audio = document.getElementById('startUp2Audio');
        document.addEventListener("WeixinJSBridgeReady", function () {
            startUpAudio.play();
        }, false);
    (function progress(){
        /*要加载的资源列表*/
        var imglist=[
                '/pages/column/transcript/images/startUp1.jpg',
                '/pages/column/transcript/images/startMenuActive.png',
                '/pages/column/transcript/images/startUp2.png',
                '/pages/column/transcript/images/startBtn.png',
                '/pages/column/transcript/images/startMenuActive.png',
                '/pages/column/transcript/images/winFind.png'
            ],
            prg=0, //进度
            timer = window.setInterval(function(){
                if (prg >= 80) { // 到达第一阶段80%，关闭定时器，保持等待
                    window.clearInterval(timer);
                    prg = 100;
                    joinAnimation();
                } else {
                    prg=prg+Math.random()*10
                }
                $('.startUp1 p span').text(parseInt(prg));
                //console.log(prg)
            }, 80),
            loadNum=0; //加载资源数
        //console.log("第一张进场动画");
        imglist.forEach(function(ele,index){
            var bg = new Image();
            bg.src=ele;
            bg.onload = function(){
                //console.log("加载资源数为"+loadNum);
                /*如果onload后,数值大于定时器的数值,则改写*/
                if((++loadNum/imglist.length).toFixed(3)*100>prg){
                    $('.startUp1 p span').text(parseInt((++loadNum/imglist.length)*100));
                }
            };
        })
    })();
    /*进场动画,页面切换*/
    function joinAnimation(){
        var   activeIndex=1;//当前页数
        var pageChangeTimer  = setInterval(function(){
            switch (activeIndex++){
                case 0:
                    break;
                case 1:
                    $(".startUp1").addClass("hide");
                    $(".startUp2").removeClass("hide");
                    // console.log("第二张进场动画");
                    break;
                case 2:
                    /*声音自动播放*/
                    // (function(){

                    //audio.play();
                    //--创建页面监听，等待微信端页面加载完毕 触发音频播放
                    // document.addEventListener('load', function () {
                    //     startUpAudio.play();
                    //     document.addEventListener("WeixinJSBridgeReady", function () {
                    //         startUpAudio.play();
                    //     }, false);
                    // });
                    // startUpAudio.play();
                    //--创建触摸监听，当浏览器打开页面时，触摸屏幕触发事件，进行音频播放,此处touchstart 不起作用,
                    // document.addEventListener('click', function () {
                    //     startUpAudio.play();
                    // });
                    // })();
                    startUpAudio.play();
                    //console.log("第三张进场动画");
                    $(".startBtn").removeClass('hide')
                    $(".startMenu").removeClass("hide");
                    break;
                case 3:
                    startUpAudio.pause();
                    clickAudio.play();
                    //console.log("第四章进场动画");
                    $(".startMenu").addClass("startMenuActive");
                    break;
                case 4:
                    //console.log("第五章进场动画");

                    $(".startMenu").addClass("hide");
                    $(".winFind").removeClass("hide");
                    break;
                case 5:
                    clickAudio.pause();
                    typingAudio.play();
                    //console.log("第六章进场动画");
                    var text = "2017年度报告单",
                        index=0;
                    var textTimer = setInterval(function(ele){

                        if(index===text.length+1 ){ //输入完成后
                            /*清除文字输入的定时器*/
                            clearInterval(textTimer);
                            $(".okEnter").removeClass("hide");
                            /*清除切换页面的定时器*/
                            clearTimeout(pageChangeTimer);

                            setTimeout(function () {
                                //    判断是否登录
                                var userId = localStorage.getItem("userId"),
                                    otherUserId =  getparaNew().ouid;
                                otherUserId && localStorage.setItem("otherUserId",otherUserId); //设置其他人id
                                localStorage.removeItem("otherTranscriptData"); //清除数据,以免缓存
                                /*不需要判断是否登录*/
                                window.location.href = "/pages/column/transcript/jump.html";
                            },1000)
                        }else{
                            $(".winFindText span").text(text.substring(0,index));
                        }
                        // console.log("index>>>"+ index);
                        // console.log(text.length);
                        // console.log("要输入的文字>>>"+text.substring(0,index));
                        index++;
                    },150);
                    break;
            }
        },800);
    }
    /*日期方法*/
    (function setDate(){
        var now = new Date;
        var y = now.getFullYear();
        var m = now.getMonth();
        var d = now.getDate();
        var h = now.getHours();
        var mm = now.getMinutes();
        var s = now.getSeconds();
        var str;
        if(h>12) {
            h -= 12;
            str = " PM";
        }else{
            str = " AM";
        }
        h = h < 10 ? "0" + h : h;
        d = d < 10 ? "0" + d : d;
        m = m < 10 ? "0" + m : m;
        mm = mm < 10 ? "0" + mm : mm;
        s = s < 10 ? "0" + s : s;
//            var xy = y + "/" + m + "/" + d + "," + h + ":" + mm + ":" + s;
        var xy =  h + ":" + mm ;
        xy += str;
        $('.startTime i').text(xy);
    })();
});