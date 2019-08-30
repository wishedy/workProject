/**
 * 功能描述：  输入框输入文字，标题上浮，字数倒数   参照个人首页发布类
 * 使用方法: comm.textChange({"$tex":$(""),"$num":$(""),"noTop":1});
 *          comm.textChangeNew({//新版病例发布倒记数功能
 *              $tex:$(""),//输入框
 *              $num:$(""),//存放数字的元素
 *              judgmentCE:1,//需要中英文区分 默认0
 *              inputIng:function(){},//输入中回调函数
 *              inputFinish:function(){},//输入完成回调函数
 *              inputSurpass:function(){}//输入超出回调函数
 *           });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/3/27.
 */
String.prototype.subByte = function (start, bytes)
{
    for (var i=start; bytes>0; i++)
    {
        var code = this.charCodeAt(i);
        bytes -= code<256 ? 1 : 2;
    }
    return this.slice(start,i)
};
comm.textChange=function(obj){
    var options={};
    var o={
        minTop:24,
        maxTop:32
    };
    options= $.extend(o,obj);
    var ie = jQuery.support.htmlSerialize; //是否ie
    var str = 0;//汉字的个数
    var abcnum = 0; //非汉字个数
    var maxNum = maxNum; //最大字符数
    var texts= 0;
    options.$tex.bind("focus",function(){
        options.$tex.parent().parent().find(".default_name").css("color","#3d84c6");
    });
    options.$tex.bind("blur",function(){
        options.$tex.parent().parent().find(".default_name").css("color","#808080");
    });
    var flag=true;
    options.$tex.bind('compositionstart',function(){//中文输入法
        flag = false;
    });
    options.$tex.bind('compositionend',function(){
        flag = true;
    });
    //文本框字数计算和提示改变
    if(!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)){//ie
        options.$tex.bind("propertychange",function(){
            if(flag){
                changeNum();
            }
        });
        options.$tex.bind("keyup",function(){
            if(flag){
                changeNum();
            }
        });
    }else{//非ie
        options.$tex.bind("keyup keydown change input cut paste drop",function(){
            if(flag){
                changeNum();
            }
        })
    }
    function changeNum(){

        var total=comm.getByteLen(options.$tex.val());//str*2+abcnum;
        maxNum = options.$tex.attr("max")*2;
        if(options.noJudgmentCE){//不需要中英文区分
            total=options.$tex.val().length;
            maxNum=options.$tex.attr("max");
        }
        if(!options.noTop){
            if(total==0){
                options.$tex.parent().parent().find(".default_name").hide();
                options.$tex.parent().css("top",options.minTop);
            }else{
                options.$tex.parent().parent().find(".default_name").show();
                options.$tex.parent().css("top",options.maxTop);
            }
        }
        if(total<maxNum || total == maxNum){ //未超出
            texts =Math.ceil((maxNum - total)/2);
            if(options.noJudgmentCE){//不需要中英文区分
                texts =Math.ceil(maxNum - total);
            }
            //texts= maxNum - abcnum;
            if(options.$num) {
                if(obj.numTip!=undefined&&obj.numTip>0){
                    if(texts<=obj.numTip){
                        options.$num.text(texts);
                        options.$num.css("color", "#F00");
                    }else {
                        options.$num.text("")
                    }
                }else{
                    options.$num.text(texts);
                    if (texts == 0) {
                        options.$num.css("color", "#F00");
                    } else {
                        options.$num.css("color", "#c5c5c5");
                    }
                }
            }
        }else if(total>maxNum){ //超出规定字符
            if(options.noJudgmentCE){//不需要中英文区分
                options.$tex.val(options.$tex.val().substring(0,maxNum));
            }else{
                options.$tex.val(options.$tex.val().subByte(0,maxNum));
            }
            if(options.$num) {
                options.$num.text(0).css("color", "#F00");
            }
        }
    }
};
//新版病例发布倒记数功能
comm.textChangeNew=function(obj){
    var options={};
    var o={
        minTop:24,
        maxTop:32
    };
    options= $.extend(o,obj);
    var ie = jQuery.support.htmlSerialize; //是否ie
    var maxNum = parseInt(options.$num.text()); //最大字符数
    if(options.judgmentCE) {//区分中英文
        maxNum = parseInt(options.$num.text())*2;
    }
    var texts= 0;

    var flag=true;
    options.$tex.bind('compositionstart',function(){//中文输入法
        flag = false;
    });
    options.$tex.bind('compositionend',function(){
        flag = true;
    });
    //文本框字数计算和提示改变
    if(!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)){//ie
        options.$tex.bind("propertychange",function(){
            if(flag){
                changeNum();
            }
        });
        options.$tex.bind("keyup",function(){
            if(flag){
                changeNum();
            }
        });
    }else{//非ie
        options.$tex.bind("keyup keydown change input cut paste drop",function(){
            if(flag){
                changeNum();
            }
        })
    }
    if(options.$tex.val().length>0){
        changeNum()
    }
    function changeNum(){
        var total=options.$tex.val().length;
        if(options.judgmentCE){//区分中英文
            total=comm.getByteLen(options.$tex.val());
        }
        if(total<maxNum || total == maxNum){ //未超出
            texts =Math.ceil((maxNum - total));
            if(options.judgmentCE) {//区分中英文
                texts =Math.ceil((maxNum - total)/2);
            }
            if(options.$num) {
                if(obj.numTip!=undefined&&obj.numTip>0){
                    if(texts<=obj.numTip){
                        options.$num.text(texts);
                        options.inputIng&&options.inputIng();//输入中的回调函数
                    }else {
                        options.$num.text("");
                        options.inputFinish&&options.inputFinish();//输入完成的回调函数
                    }
                }else{
                    options.$num.text(texts);
                    if (texts == 0) {
                        options.inputFinish&&options.inputFinish();//输入完成的回调函数
                    } else {
                        options.inputIng&&options.inputIng();//输入中的回调函数
                    }
                }
            }
        }else if(total>maxNum){ //超出规定字符
            if(options.judgmentCE) {//区分中英文
                options.$tex.val(options.$tex.val().subByte(0,maxNum));
            }else{
                options.$tex.val(options.$tex.val().substring(0,maxNum));
            }
            options.$num.text(0).hide();
            if(options.$num) {
                options.inputSurpass&&options.inputSurpass();//输入超出的回调函数
            }
        }
    }
};
