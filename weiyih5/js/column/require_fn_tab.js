$(function(){
	function localChange(i){
		var a = window.location.pathname + location.search;
		if (a.indexOf("#") < 0) {
			a += "#";
		}
		if(i==0){
      g_sps.jump(null,a+"&tab=video");
		}else{
      g_sps.jump(null,a+"&tab=case");
		}
	}
	//作品展示区TAB
	$('.act_con:first .prod>a').on('click',function(){
		var _index = $(this).index();
		$(this).addClass('now').siblings('a').removeClass('now')
		$('.prod_list').eq(_index).show().siblings('.prod_list').hide();
		localChange(_index);
		return false;
	})
	//专业及术式区TAB
	$('.act_con:eq(2) .prod>a').on('click',function(){
		var _index = $(this).index();
		$(this).addClass('now').siblings('a').removeClass('now')
		$('.shipinkuai').eq(_index).show().siblings('.shipinkuai').hide();
		return false;
	})

	function getPara(){
		var url=document.URL;
		var param={};
		var str,item;
		if(url.lastIndexOf("#")>0)
		{
			str=url.substring(url.lastIndexOf("?")+1,url.length);
			var arr=str.split("&");
			for(var i=0;i<arr.length;i++)
			{
				item =  arr[i].split("=");
				param[item[0]] = decodeURI(item[1]);
			}
		}
		return param;
	}
	var para=getPara();
	if(para.tab=="case"){
		$('.act_con .prod>a').eq(1).click();
	}

	var j=3;	//.documents默认显示3个
	$('.shipinkuai .xinshiqu').children('.documents:lt('+j+')').show();
	$('.shipinkuai:eq(1) .xinshiqu').children('.documents:lt('+j+')').show();

	//每个区块的”点击更多“显示
	$('.shipinkuai').each(function(){
		$(this).find('#zhankai_pk').click(function(){
			if($(this).text()=='收起全部'){
				$('.shipinkuai .xinshiqu').children('.documents:gt('+j+')').hide();
				$('.shipinkuai:eq(1) .xinshiqu').children('.documents:lt('+j+')').show();
				$(this).text('展示更多');
				$(this).addClass("zk_more").removeClass("sq_more");
			}else{
				$(this).parents(".look_more_pk").siblings('.xinshiqu').children('.documents').show();
				$(this).text('收起全部');
				$(this).addClass("sq_more").removeClass("zk_more");
			}

			return false;
		})
	})


})
