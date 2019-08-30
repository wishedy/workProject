$(function(){
	var refType=$("#resourceType").val();
	module.reviewBox({
		scene: 'terminal',
		context:$('.ev-detailReviewForm'),
		refId: $("#resourceId").val(),
		type: refType,
		callback:function(){
			if($(".ev-listSortOld").hasClass("al-oldNews")){
				$(".ev-listSortOld").click();//最旧
			}else{
				$(".ev-listSortNew").click();//最新
			}
		}
	});
	function checkReacherRole(){//处理唯医3.7讲师、学号展示的需求张恒
		setTimeout(function(){//处理唯医3.7讲师、学号展示的需求张恒
			$('.al-contentCommentItemTitle [data-teacher]').each(function(){
				var _thisElement = $(this);
				if(parseInt(_thisElement.attr("data-teacher"),10)){
					_thisElement.append('<span class="teacherIcon">讲师</span>');
				}else{
					if(parseInt(_thisElement.attr("data-studentnum"),10)){
						_thisElement.append('<span class="studyNum">No.'+parseInt(_thisElement.attr("data-studentnum"),10)+'</span>');
					}
				}
			});
		},3000);
	}
	var first=true;
	//回复列表最新最旧事件绑定
	$(".ev-listSortOld").data("sortType",1).on('click', function(){ //最旧
		$('.ev-list').empty();
		module.reviewPage({sortType: 1,$context: $('.ev-list'),scene: 'terminal',refType: refType, refId: $("#resourceId").val()});
		$(this).addClass("al-oldNews");
		$(".ev-listSortNew").removeClass("al-oldNews");
		checkReacherRole();
		//事件埋点
		if(!first){
			comm.creatEvent({
				triggerType:"评论",
				keyword:"评论区排序-最旧",
				actionId:74
			});
		}
		first=false;
	});
	
	$(".ev-listSortNew").data("sortType",3).on('click', function(){ //最新
		$('.ev-list').empty();
		module.reviewPage({sortType: 3,$context: $('.ev-list'),scene: 'terminal',refType: refType, refId: $("#resourceId").val()});
		$(this).addClass("al-oldNews");
		$(".ev-listSortOld").removeClass("al-oldNews");
		checkReacherRole();
		//事件埋点
		if(!first) {
			comm.creatEvent({
				triggerType: "评论",
				keyword: "评论区排序-最新",
				actionId: 74
			});
		}
		first=false;
	});

	//默认为最旧
	$(".ev-listSortOld").click();

	//终端页评论区域个人中心跳转
	var href;
	$(".Ev-mesPersonalCenter").off("click").on("click",function(){
		href=$(this).attr("data-perCenter");
        g_sps.jump(null,href,true);
	});

});
