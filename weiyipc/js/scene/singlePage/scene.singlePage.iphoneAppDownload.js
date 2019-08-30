/**
 * app 下载推广页
 * Created by Administrator on 2015/8/27.
 */

$(function () {
	
	/**
	 * 部分应用页，展开关闭 app推广
	 * **/
	//将要被追加的app广告下载页
	var urlArr = ["case_home.html","video_home.html","meeting_home.html","topic_home.html","live_list.html"];
	
	//template
	var template = '<div class="app_open evAppAdvertCloseView">'+
		'<div class="app_downland"></div>'+
		'<div class="evWindowToggle app_downland_blue app_d_big_width">'+
		    '<div class="app_downland_content">'+
		         '<div class="app_d_logo">'+
		             '<img src="//img00.allinmd.cn/app/logo_app.png" />'+
		         '</div>'+
		         '<div class="app_d_logo_t">'+
		             '<div class="wyapp"><img src="//img00.allinmd.cn/app/wyapp.png" /></div>'+
		             '<div class="title_app"><img src="//img00.allinmd.cn/app/title_app.png" /></div>'+
		             '<div class=""><a href="/pages/singlePage/iphone-app-download.html"><img src="//img00.allinmd.cn/app/lj_more.png" /></a></div>'+
		         '</div>'+
		         '<div class="phone_hq">'+
		             '<div class="phone_input"><input type="text"  placeholder="输入手机号，即可获取下载链接"  /></div>'+
		             '<div class="downland_but phone_hq_zt cursor" id="getmesg">点击获取</div>'+
		             '<div class="clear"></div>'+
	                '<div class="evInputPhone"></div>'+ //请输入正确手机号码 app_downland_err
		         '</div>'+
		         '<div class="app_line"><img src="//img00.allinmd.cn/app/line.png" /></div>'+
		         '<div class="app_xz">'+
					  '<div class="app_iphone">'+
							'<img src="//img00.allinmd.cn/app/iphone_land.png" />'+
			         '</div>'+
			         '<div class="">'+
							'<img src="//img00.allinmd.cn/app/andriod_land.png" />'+
			         '</div>'+
		         '</div>'+
		         '<div class="app_erweima"><img src="//img00.allinmd.cn/app/erweima.png" /></div>'+
		         '<div class="app_close cursor evAppAdvertClose"><img src="//img00.allinmd.cn/app/close.png" /></div>'+
		         '<div class="clear"></div>'+
		    '</div>'+
		'</div>'+
	'</div>'+
	'<div class="app_stop evAppAdvertOpen cursor"  style="display:none;">'+
		'<div class="app_stop_img"><img src="//img00.allinmd.cn/app/app_stop.png" /></div>'+
	'</div>';
		
    //倒计时
    function countdownGetMsg() {
        counting = true;
        var t = 60;
        $("#getmesg,#getmesg2").addClass("downland_but_disable");
        $("#getmesg,#getmesg2").addClass("downland_but_long");
        $("#getmesg,#getmesg2").text(t-- + "秒后重新获取");
        var a = setInterval(function () {
            if (t > 0) {
                $("#getmesg,#getmesg2").text(--t + "秒后重新获取");
            } else {
                clearInterval(a);
                $("#getmesg,#getmesg2").removeClass("downland_but_disable");
                $("#getmesg,#getmesg2").removeClass("downland_but_long");
                $("#getmesg,#getmesg2").text("重新发送");
                $("#getmesg,#getmesg2").on("click", getmsgHandle);
                counting = false;
            }
        }, 1000);
    }


    function sendSms(val){
    		$(".evInputPhone").removeClass("app_downland_err").html('');
    		$(".evInputPhone").removeClass("app_error_red_icon_xc").html('');
        var timestamp = new Date().getTime();
        $.ajax({
            url:PC_CALL+"customer/verification/sendSms/",
            type:"POST",
            dataType:"json",
            data:{paramJson: $.toJSON({
				account:val,
				siteId:7,
                timestamp:timestamp,
                ALLINACCESSTOKEN: comm.allinaccesstoken(timestamp,val)
            })},
            success: function (data) {
                if(data && data.responseObject && data.responseObject.responseStatus){
                    //alert('已成功发送。请查看您的手机短信');
    	        			$(".downland_a").removeClass("downland_a_error");
                  	if(location.href.indexOf("iphone-app-download.html")===-1){ //针对悬浮
	        	    			$(".evInputPhone").removeClass("app_downland_err").addClass("app_downland_succ");
	        	    		}else{ //针对落地页
	        	    			$(".evInputPhone").removeClass("app_error_red_icon_xc").addClass("app_error_red_icon_succ");
	        	    		}                		
                		$(".evInputPhone").html("已成功发送。请查看您的手机短信");
                		countdownGetMsg();
                }else{
                    if(data.responseObject.responseCode=="ERR_001"){
                        //alert('同一手机号，一天只能发送3次');
                    		$(".downland_a").addClass("downland_a_error");
                      	if(location.href.indexOf("iphone-app-download.html")===-1){ //针对悬浮
	            	    			$(".evInputPhone").removeClass("app_downland_succ").addClass("app_downland_err");
	            	    		}else{ //针对落地页
	            	    			$(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
	            	    		}
                      	
                    		$(".evInputPhone").html("同一手机号，一天只能发送3次");
                    		$("#getmesg,#getmesg2").text("重新发送");
                    		$("#getmesg,#getmesg2").on("click", getmsgHandle);
                    }else{
                        //alert('发送失败，请稍后重试');
                    	    $(".downland_a").addClass("downland_a_error");
                      	if(location.href.indexOf("iphone-app-download.html")===-1){ //针对悬浮
                      		$(".evInputPhone").removeClass("app_downland_succ").addClass("app_downland_err");
	            	    		}else{ //针对落地页
	            	    			$(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
	            	    		}
                        $(".evInputPhone").html("发送失败，请稍后重试");
                        $("#getmesg,#getmesg2").text("重新发送");
                			$("#getmesg,#getmesg2").on("click", getmsgHandle);
                    }

                }
            }
        });
    }


   $(".downland_but").on("click", getmsgHandle);

    //获取短信按钮点击事件处理方法
    function getmsgHandle() {
    		$(".evInputPhone").removeAttr("style");
    		
        $("#getmesg,#getmesg2").off("click");
        $("#getmesg,#getmesg2").addClass("downland_but_disable");
        
        var value = getValue();
       if(validateInput(value)){
    	   	   sendSms(value);
       }
      
    }
    
    function getValue(){
    	var input = $(".downland_a input");
        if(input.length===0){
        		input = $(".phone_input input");
        }
        var value = "";
        input.each(function (index,obj) {
           if($(obj).val()!=""){
               value = $(obj).val();
           }
        });
        return value;
    }
    
    
    $(".downland_a input").on("change",function(){
    		validateBtn(getValue());
    });
    
    function validateInput(value){
    	  if(value.match(/^1\d{10}$/)){
              $(".evInputPhone").html("");
          	  $(".downland_a").removeClass("downland_a_error"); 
          	  return true;
          }else{
          	  $(".downland_but").on("click", getmsgHandle);
          	  $(".downland_a").addClass("downland_a_error"); 
          	  
          	if(location.href.indexOf("iphone-app-download.html")===-1){ //针对悬浮
	    			$(".evInputPhone").removeClass("app_downland_succ").addClass("app_downland_err");
	    		}else{ //针对落地页
	    			$(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
	    		}
          	  
              $(".evInputPhone").html("请输入正确手机号码");
              return false;
          }
    }
    
    
    function validateBtn(value){
  	  if(value.match(/^1\d{10}$/)){
	        	$(".downland_but").removeClass("downland_but_disable");
	        	$(".downland_a").removeClass("downland_a_error"); 
	        	return true;
        }else{
        		$(".downland_a").addClass("downland_a_error");
        		$(".downland_but").on("click", getmsgHandle); 
        		
        		if(location.href.indexOf("iphone-app-download.html")===-1){ //针对悬浮
        			$(".evInputPhone").removeClass("app_downland_succ").addClass("app_downland_err");
        		}else{ //针对落地页
        			$(".evInputPhone").removeClass("app_error_red_icon_succ").addClass("app_error_red_icon_xc");
        		}
        		
            $(".evInputPhone").html("请输入正确手机号码");
            $(".downland_but").addClass("downland_but_disable");
            return false;
        }
  }
    
	/**
	 *  新增：如果关闭过app推广，一天内不在出现app推广
	 */
    var appADCookie = function(){
		var isARL = $.cookie("appRecommendLock");
		if(isARL === undefined){ $.cookie("appRecommendLock","off",{path:"/"});}
	    
		var commAppAD = function(){
			$("body").append(template).find(".evAppAdvertOpen").off("click").on("click",function(){ //合上状态
				$(".evAppAdvertCloseView").show(); //打开状态
				$(".evAppAdvertOpen").hide(); //
			}).parent().find(".evAppAdvertClose").off("click").on("click",function(){ //打开状态
				$.cookie("appRecommendLock","on",{path:"/",expires:1});  //置为以后默认不打开  new Date(new Date().setTime(new Date().getTime()+(24 * 60 * 60 * 1000)))
				$(".evAppAdvertCloseView").hide(); //合上状态
				$(".evAppAdvertOpen").show();
			}).parent().find(".downland_but").off("click").on("click",getmsgHandle);
		    if($(window).width() < 1024){
		    		$(".evWindowToggle").removeClass("app_d_big_width");
		    }	
		}

		if(location.href.indexOf("live_list.html")>-1){
			commAppAD();
			return false;
		}
		if(isARL===undefined || isARL === "off"){	
		    var currUrl = location.href;
			for(var i=0;i<urlArr.length;i++){
				if(currUrl.indexOf(urlArr[i])>-1){
					commAppAD();
					return false;
				}
			}
		}else{
			var currUrl = location.href;
			for(var i=0;i<urlArr.length;i++){
				if(currUrl.indexOf(urlArr[i])>-1){
					commAppAD();
					$(".evAppAdvertCloseView").hide(); //合上状态
					$(".evAppAdvertOpen").show();
					return false;
				}
			}
		}	
    }

	if(location.href.indexOf("live_list.html")>-1){
		appADCookie();
		return false;
	}
	/* 如果登录过APP就永久不出来 */
    if($.cookie('appLogin') !== 'on'){
		var params = {};
		params.paramJson = $.toJSON({dataFlag:2,pageIndex:1,pageSize:10});
		var $promise = $.ajax({url:PC_CALL+"log/customer/login/getIsLogin/",type:"POST",data:params});
		var callback = function(data){
			if(data.responseObject.responseMessage.isLogin !== "0"){ //装过APP
				$.cookie('appLogin','on',{path:"/",expires:100});
				return false; //不执行APP推广
			}else{ 
				appADCookie();
			}
		}
		$promise.done(callback);
		 
    };	
});