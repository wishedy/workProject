var _content = [];
		var lazy = {
			_default:10,
			_loading:5,
			init:function(){
				var lis = $(".discoverCourse .courseList li");
				$(".discoverCourse ul.list").html("");
				for(var n=0;n<lazy._default;n++){
					lis.eq(n).appendTo(".discoverCourse ul.list");
				}
				$(".discoverCourse ul.list img").each(function(){
					$(this).attr('src',$(this).attr('realSrc'));
				})
				for(var i=lazy._default;i<lis.length;i++){
					_content.push(lis.eq(i));
				}
				$(".discoverCourse .courseList").html("");
			},
			loadMore:function(){
				var mLis = $(".discoverCourse ul.list li").length;
				for(var i =0;i<lazy._loading;i++){
					var target = _content.shift();
					if(!target){
						$('.discoverCourse .courseMore').html("<p>ȫ���������...</p>");
						break;
					}
					$(".discoverCourse ul.list").append(target);
					$(".discoverCourse ul.list img").eq(mLis+i).each(function(){
						$(this).attr('src',$(this).attr('realSrc'));
					});
				}
			}
		}
		lazy.init();