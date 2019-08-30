$(function() {

	$("#changeWindows").toggle(function() {
		iframeHide(function() {
			$("#ifr-1").animate({
				width : "656px",
				height : "476px"
			}, 0, function() {
				$(".video3").animate({
					width : "656px",
					height : "476px",
					left : "0"
				}, 500, function() {
					$(".overlay").hide();
				});
			});

		
			$("#ifr-2").animate({
				width : "300px",
				height : "207px"
			}, 0, function() {
				$(".document3").animate({
					left : "680px",
					width : "300px",
					height : "207px"
				}, 500, function() {
					$(".overlay").hide();
				});
			});
		});

	}, function() {
		iframeHide(function() {
			//$(".overlay").show();
			$("#ifr-2").animate({
				width : "656px",
				height : "476px"
			}, 0, function() {
				$(".document3").animate({
					left : "0",
					width : "656px",
					height : "476px"
				}, 500, function() {
					$(".overlay").hide();
				});
			});

			$("#ifr-1").animate({
				width : "300px",
				height : "207px"
			}, 0, function() {
				$(".video3").animate({
					left : "680px",
					width : "300px",
					height : "207px"
				}, 500, function() {
					$(".overlay").hide();
				});
			});
		});
	});

	$(".time_title li").each(function(i, val) {
		$(val).bind("click", function() {
			$(".time_title li").removeClass("on");
			$(val).addClass("on");
			$(".richeng ul").hide();
			$(".richeng ul").eq(i).show();
		})

	});

});
function iframeHide(callback) {
	$("iframe").css("visibility", "visible");
	callback();
}
function iframeShow() {
	setTimeout(function() {
		$("iframe").css("visibility", "visible")
	}, 800)
}