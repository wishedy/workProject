/**
 * Created by ALLIN on 2016/11/28.
 */
var alViewBigImg = {};
$(document).ready(function(){
	alViewBigImg = {
		createHtml: function(data,index,quesThemId){
			var lenStr = "";
			lenStr += '<section class="al-Mask_Layer al-viewBigImgCover">' +
				'<div class="al-viewBigWidth_auto">' +
				'<div class="al-topViewBigImgBox">' +
				'<div class="al-out_pagination">' +
				'<button class="al-top_left"></button>' +
				'<div class="al-quesPagination"></div>' +
				'<button class="al-top_right"></button>' +
				'</div>' +
				'</div>' +
				'<div class="al-viewBigImgOriginal">' +
				'<div class="al-out_bottom_close">' +
				'<img src="/images/img00/column/specialTemplate/close.png" />' +
				'</div>' +
				'<div class="al-swiper_top">' +
				'<span class="swiper_top_left"></span>' +
				'<span class="swiper_top_right"></span>' +
				'</div>' +
				'<div class="al-swiper_out">' +
				'<div class="al-swiper_right">' +
				'<span class="swiper_right_width">适应窗口</span>' +
				'<span class="swiper_right_big">查看原图</span>' +
				'</div>' +
				'<div class="swiper-container">' +
				'<div class="swiper-wrapper">' +
				'<a class="al-arrow-left" href="javascript:;"></a>' +
				'<a class="al-arrow-right" href="javascript:;"></a>' +
				'<img/>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				' </section>';
			$('.al-questionnaireViewBig').empty();
			$('div[data-id='+quesThemId+']').find('.al-questionnaireViewBig').html(lenStr);
			alViewBigImg.nowIndexNum=index;
			alViewBigImg.swiper();
			alViewBigImg.creatSwitch(data);
		},
		nowIndexNum:null,
		swiper: function() {
			var mySwiper = new Swiper('.swiper-container', {
				pagination: '.al-quesPagination',
				paginationClickable: true,
				loop: true,
				noSwiping: true
			});
		},
		creatSwitch: function(data){
			for(var i = 0; i < data.length; i++){
				if(i == 0) {
					var span = $("<span class='swiper-pagination-switch swiper-visible-switch swiper-active-switch'><img/></span>");
					$(".al-quesPagination").append(span);
				} else {
					var span = $("<span class='swiper-pagination-switch swiper-visible-switch'><img/></span>");
					$(".al-quesPagination").append(span);
				}
				span.find('img').attr('src', data[i].src);
			}
			$(".swiper_top_left").text(alViewBigImg.nowIndexNum + "/" + (data.length));
			alViewBigImg.rightAddClass(alViewBigImg.nowIndexNum, data);
			alViewBigImg.leftAddClass(alViewBigImg.nowIndexNum, data);
			alViewBigImg.bigImg(alViewBigImg.nowIndexNum - 1, data);
			alViewBigImg.moveImg(alViewBigImg.nowIndexNum, data.length);
			alViewBigImg.elseClick(data);
			$('.al-arrow-left').on('click', function(){
				alViewBigImg.leftClick(data);
			});
			$('.al-arrow-right').on('click', function(){
				alViewBigImg.rightClick(data);
			});
			$(".swiper-pagination-switch").unbind("click").bind("click", function() {
				alViewBigImg.nowIndexNum = $(this).index() + 1;
				alViewBigImg.moveImg(alViewBigImg.nowIndexNum);
				for(var i = 0; i < data.length; i++) {
					$('.swiper-pagination-switch').removeClass('swiper-active-switch');
				}
				$(this).addClass('swiper-active-switch');
				$(".swiper_top_left").text(alViewBigImg.nowIndexNum + "/" + (data.length));
				alViewBigImg.bigImg(alViewBigImg.nowIndexNum - 1, data);
			});
			$('.al-top_left').on('click', function(){
				alViewBigImg.leftClick(data);
			});
			$('.al-top_right').on('click', function(){
				alViewBigImg.rightClick(data);
			});
		},
		elseClick: function(data) {
			$('.al-out_bottom_close').click(function(){
				$('body').removeClass('al-questionnaireScroll');
				$('.al-viewBigImgCover').hide();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"专题页查看大图关闭",
					actionId:43
				});
			})
			$(".swiper_right_width").click(function(){
				//var windowHeight = $(window).height() - 308;
				if($('.swiper_right_width').text() == "适应宽度"){
					$('.swiper_right_width').text("适应窗口");
					$('.swiper-wrapper img').css("max-height","none");
				} else {
					$('.swiper_right_width').text("适应宽度");
					$('.swiper-wrapper img').css("max-height","100%");
				}
			});
			$(".swiper-container").mouseover(function(){
				$(".al-arrow-left").css("display", 'block');
				$(".al-arrow-right").css("display", 'block');
			});
			$(".swiper-container").mouseout(function(){
				$(".al-arrow-left").css("display", 'none');
				$(".al-arrow-right").css("display", 'none');
			});
			$('.swiper_right_big').click(function(){
				var picData = JSON.stringify(data);//将JSON对象转化成字符串
				sessionStorage.setItem("picUrl",picData);
				alViewBigImg.nowIndexNum = $(".swiper-active-switch").index() + 1;
                g_sps.jump(null,'/pages/column/specialTemplate/al-bigImgOriginal.html?' + alViewBigImg.nowIndexNum,true);
			})
		},
		bigImg: function(index, data){
			$('.swiper-wrapper img').attr('src', data[index].src);
			$('.swiper_top_right').text("发布于:" + data[index].time);
		},
		moveImg: function(index){
			if(index > 6) {
				$(".al-quesPagination").css({
					left: -105 * (index - 6),
					transition: "all 1s"
				})
			} else {
				$(".al-quesPagination").css({
					left: 50,
					transition: "all 1s"
				})
			}
		},
		leftAddClass: function(index, data){
			index--;
			for(var i = 0; i < data.length; i++){
				$('.swiper-pagination-switch').removeClass('swiper-active-switch');
			}
			$('.swiper-pagination-switch').eq(index).addClass('swiper-active-switch');
		},
		rightAddClass: function(index, data){
			for(var i = 0; i < data.length; i++){
				$('.swiper-pagination-switch').removeClass('swiper-active-switch');
			}
			$('.swiper-pagination-switch').eq(index - 1).addClass('swiper-active-switch');
		},
		leftClick: function(data){
			alViewBigImg.nowIndexNum = $(".swiper-active-switch").index() + 1;
			alViewBigImg.nowIndexNum--;
			if(alViewBigImg.nowIndexNum > 0){
				alViewBigImg.leftAddClass(alViewBigImg.nowIndexNum, data);
				alViewBigImg.moveImg(alViewBigImg.nowIndexNum);
				$(".swiper_top_left").text(alViewBigImg.nowIndexNum + "/" + (data.length));
				alViewBigImg.bigImg(alViewBigImg.nowIndexNum - 1, data);
			}
		},
		rightClick: function(data){
			alViewBigImg.nowIndexNum = $(".swiper-active-switch").index() + 1;
			alViewBigImg.nowIndexNum++;
			if(alViewBigImg.nowIndexNum <= data.length){
				alViewBigImg.rightAddClass(alViewBigImg.nowIndexNum, data);
				alViewBigImg.moveImg(alViewBigImg.nowIndexNum);
				$(".swiper_top_left").text(alViewBigImg.nowIndexNum + "/" + (data.length));
				alViewBigImg.bigImg(alViewBigImg.nowIndexNum - 1, data);
			}
		}
	};
});