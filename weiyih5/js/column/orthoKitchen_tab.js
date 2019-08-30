//jq:tab切换效果展示：
$(function(){
   $(".fnav_ul li").each(function(i,em){
	   $(em).on("click",function(){
		   $(".fnav_ul li a").removeClass("cur");
		   $(em).find("a").addClass("cur");
		   $(".fnav_down").hide();
		   $(".fnav_down").eq(i).show();
	   })
   });
});
