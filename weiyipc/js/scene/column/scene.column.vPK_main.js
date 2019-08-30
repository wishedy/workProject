/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/11/19.
 */
$(function(){
    //获取活动的activityId；
    var left=($(window).width()-713)/2;
    var str= location.href;
    var activityId="";
    var activityIdValue;
	activityId=comm.getpara().activityId;
	$("#activityId").val(activityId);
	$.ajax({
        type:"post",
        url:PC_CALL+"cms/activity/getMenuMapList/",
        data:{paramJson:$.toJSON({ activityId:$("#activityId").val(),siteId:1})},
        dataType:"json",
        async:false,
        success:function(data){
            if(data&&data.responseObject.responseData){
                var items=data.responseObject.responseData.data_list;
                for(var i=0;i<items.length;i++){
                    var activityMenuName=items[i].activityMenuName;
                    if(activityMenuName=="参选作品"){
                        $("#Ev-NavList li").eq(3).show();
                        break;
                    }
                }
            }
        }
    });
    //结果是否在公示中，上传是否截止
	$.ajax({
		type:'post',
		url:PC_CALL+'activity/event/isResultShowBegin/',
		data:{paramJson:$.toJSON({ activityId:activityId})},
        dataType:"json",
        async:false,
        success:function(res){
        	if(res&&res.responseObject.responseData&&(!$.isEmptyObject(res.responseObject.responseData))){
        		var isResultShowBegin=res.responseObject.responseData.expireStatus;
        		if(isResultShowBegin==1){//如果在公示中，默认上传截止
	        		$('#activityId').attr('isResultShowBegin',isResultShowBegin);	//0:未知错误 1:结果公示中 -1:过期
	        		$(".nav_bm a").text("结果公布").attr('href','/pages/column/videoPK/pk4_results.html?activityId=1449026372937').css('color','#fff').parent().off('click');		//更改公布链接
           		}
        	}
        	if(!$('#activityId').attr('isResultShowBegin')){		//如果不是结果公示过程，则查看上传是否截止
        		//上传是否截止
        		
				$.ajax({
					type:'post',
					url:PC_CALL+'activity/event/isSignUpOver/',
					data:{paramJson:$.toJSON({ activityId:activityId})},
			        dataType:"json",
			        async:false,
			        success:function(rep){
			        	if(rep&&rep.responseObject.responseData&&(!$.isEmptyObject(rep.responseObject.responseData))){
			        		var isSignState=rep.responseObject.responseData.expireStatus;
			        		$('#activityId').attr('isSignUpOver',isSignState);	////0:未知错误 1:未截止 -1:截止
			        	}
			        }
				});
				//评分是否开始
				$.ajax({
					type:'post',
					url:PC_CALL+"activity/event/isReviewBegin/",
					data:{paramJson:$.toJSON({ activityId:activityId})},
					dataType:"json",
			        async:false,
			        success:function(data){
			        	if (data && data.responseObject.responseData) {
                            var isReviewBegin = data.responseObject.responseData.expireStatus;
                           $('#activityId').attr('isReviewBegin',isReviewBegin);//1是已经开始了,-1没开始
                        }
			        }
				})
				$('.nav_bm a').css('color','#fff');
        	}
        	
        }
	})
	
    if(!$("#sesCustomerId").val()){//未登录
        $(".video_pk_shouye_navhuodongjianjie").show();
        if(!$('#activityId').attr('isResultShowBegin')){//结果非公示中
        	//评分开始不可以上传，报名截止还可以继续上传
        	if($('#activityId').attr('isReviewBegin')==1||$('#activityId').attr('isSignUpOver')==-1){
        		$(".nav_bm a").text("评选进行中").css({'fontSize':'21px','cursor':'default'});
        	}else{
	        	$(".nav_bm a").text("立即报名");
	        	
	        	module.videoCasePk({
		            enrollBtn:$(".nav_bm"),
		            //container: $(".personal_content"),
		            top:parseInt(($('body').height())/2-($('.doc_tc').height()/2)),
		            //left:left,
		            activityId:activityId,
		            needGoDetail:1,//需要跳终端
		            enrollCallBack:function(){//报名成功后回调
		            	$(".nav_bm a").text("立即上传");				                      
		            },
		            publishBack:function(){
		                if(str.lastIndexOf("personal_center")){
                            g_sps.jump(null,str);
		                }
		            },
		            videoPKList:function(){
		            	videoPK_personal_center();
		            }
		        });
        	}    	
	    }	   
    }else{
    	var isEnroll;
    	if($('#activityId').attr('isResultShowBegin')){//结果公示中 只获取报过名与否
    		setRegisterStatus();
    	}else{
    		if($('#activityId').attr('isSignUpOver')==-1){	//登录后-如果截止//0:未知错误 1:未截止 -1:截止
    			$(".nav_bm a").text("评选进行中").css({'fontSize':'21px','cursor':'default'}).parent().off('click');
    			setRegisterStatus();
    		}else{
    			setRegisterStatus();
    			if(isEnroll==0){
    				$(".nav_bm a").text("立即报名");
    			}else{
    				$(".nav_bm a").text("立即上传");
    			}
      			    module.videoCasePk({
                        enrollBtn:$(".nav_bm"),
                        //container: $(".personal_content"),
                        //top:200,
                         top:parseInt(($('body').height())/2-($('.doc_tc').height()/2)),
                        //left:left,
                        activityId:activityId,
                        isEnroll:isEnroll,
                        needGoDetail:1,//需要跳终端
                        enrollCallBack:function(){//报名成功后回调
                            $(".nav_bm a").text("立即上传");
                        },
                        publishBack:function(){
                            if(str.lastIndexOf("personal_center")){
                                g_sps.jump(null,str);
                            }
                        },
                        videoPKList:function(){
			            	videoPK_personal_center();
			            }
                   });
    					
    		}
    	}
        
        var isReviewed;		//是否是专家
            if($("#activityId").attr("expert")){
                isReviewed = $("#activityId").attr("expert");
            }else{
                isReviewed=isReviewerPK3();
                $("#activityId").attr("expert",isReviewed);
            }
            //如果在结果公示阶段，立即上传变为结果公示
            if(isReviewed==1){	//如果是专家
            	$(".nav_zx_a").text("作品审核");
            	if($('#activityId').attr('isResultShowBegin')){//如果在公示阶段
            		
	            }else{
	            	$(".nav_bm").remove();
	            }
            }           
            
        $(".video_pk_shouye_navhuodongjianjie").show();
    }

	var dv = $('.video_pk_shouye_navhuodongjianjie').eq(0);
		dv.attr('otop', dv.offset().top);
		 $(window).scroll(function () {
		 if($(window).scrollTop()>=570){
				dv.css({ 'position': 'fixed', top: 0 ,width:"100%",background:"#fff",zIndex:3});
			}
			else{
				dv.css({ 'position': 'static'});
			}
		})
		
})
function setRegisterStatus(){
	$.ajax({
        type : "post",
        url : PC_CALL+"activity/register/getRegisterStatus/",//获取报名状态
        data : {paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})},
        dataType : "json",
        success : function(rep){
            if(rep.responseObject.responseData){
                if(rep.responseObject.responseData.registerStatus==1){//没有报名
                	$('#activityId').attr('registerStatus',1)
                    isEnroll=0;
                }else if(rep.responseObject.responseData.registerStatus>=2){//报过名
                	$('#activityId').attr('registerStatus',2)
                    isEnroll=1;
          		}
            }
//          callback&&callback();
        }
    });
}
function isReviewerPK3(){
    comm.LightBox.showloading();
    var isReviewer;
    $.ajax({
        url:PC_CALL+"activity/api/isReviewer/",
        type:"POST",
        data:{paramJson: $.toJSON({customerId:$("#sesCustomerId").val()})},
        dataType:"json",
        async:false,
        success:function(data){
            comm.LightBox.hideloading();
            if(data&&data.responseObject.responseData){
                isReviewer=data.responseObject.responseData.isReviewer;
            }
        }
    });
    return isReviewer;
}