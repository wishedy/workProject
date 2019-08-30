/*
 * X-Menu 下拉框多选组件
 * 依赖jquery.powerFloat.js 
 * 整合powerFloat
 * 浏览器支持 FF Chrome Opera IE9 IE8一下不兼容
 * @author yelingfeng
 * @email  yelingfeng521@gmail.com 
 */
 
;(function($) {

	var defaults  = {
		width :580, //可选参数：inherit，数值(px)
		left:0,
		top:0,
		eventType: "click", //事件类型，其他可选参数有：click, focus
		dropmenu:".xmenu",//弹出层div
		showList:"",
		emptytext: "请选择",
		dataUrl:"",
        callback:null
	};
	
	$.fn.xMenucon = function(options) {
		return $(this).each(function() {
			
			var owl = $.extend({}, defaults, options || {});
			//触发按钮
			var $this = $(this);
			//已选显示ul
			var $showul=$(owl.showList);//"#proFieldshow"
			//span
			var $span = $this.find("span");
			//浮动层主div
			var $dropmenu= $(owl.dropmenu);
			//存数据ID
			var arr=[];
			//关闭按钮
			var $closebtn =$(".m-close", $dropmenu);			
			//已选在职位div
			var $selectinfo = $(".select-info",$dropmenu);
			//已选在职位ul
			var $selectUl = $("ul",$selectinfo);
			//确认按钮
			var $okbtn = $("a[name='menu-confirm']",$selectinfo);
			//根据显示区
			/*$("li",$showul).each(function(i,val){
				arr.push($(val).attr("rel"));
			})*/
			$.getJSON(owl.dataUrl,function(data){
				
				//动态添加数据
				if(data){	
					var html='';
					$.each(data,function(i,n){
						if(i==1){
							html+='<dt class="open"></dt><dd><ul></ul></dd>';
						}
					});
					$dropmenu.find('dl').html(html);
					$.each($dropmenu.find('dd ul'),function(i,n){
						var html2='';
						$.each(data[i+1],function(dex,value){
						   html2+='<li rel="'+data[i+1][dex].id+'">'+data[i+1][dex].medicalTitle+'</li>';
						});
						$dropmenu.find('dd ul').eq(i).html(html2);
					})
				}
				//主dd
				var $mli = $("dd li",$dropmenu);
				
				//伸缩事件绑定
				$("dl dt",$dropmenu).toggle(function(){
					var $this = $(this);
					if($this.hasClass('open')){
						$this.removeClass('open').next().slideUp('fast');
					}else{
						$this.addClass('open').next().slideDown('fast');
					}				
				} , function(){
					$(this).removeClass('open').next().slideUp('fast');
				});
				
				//绑定关闭
				$closebtn.click(function(){
					 $.powerFloat.hide();
				});
				//绑定保存
				$okbtn.click(function(){
					var $li =$selectUl.find("li");
					var id = "";
					arr=[];	
					$showul.empty();//清空显示ul的数据		
					$li.each(function(){
						_this = $(this);
						arr.push(_this.attr("rel"));
						//显示ul添加li
						$("<li rel='"+_this.attr('rel')+"' class='current'><div class='link_l_bg'></div><div class='link_c_bg'><b>"+_this.text()+"</b><p>×</p></div><div class='link_r_bg'></div></li>").appendTo($showul);
					})
					id = id.substring(0,id.length-1);
					$.powerFloat.hide();
                    if(owl.callback!=null){
                        owl.callback();
                    }
				});
				
				//绑定每一个职位
				var $seldd=$dropmenu.find("dd");
				for(var i=0; i<$seldd.length; i++){
					onlyClick($seldd.eq(i).find("li"));	
				};
				/*var $sedli=$dropmenu.find("dd").eq(2).find("li");
				$sedli.click(function(){
					var $li = $(this);
					var val  =$li.text();
					var id  = $li.attr("rel");
					if($selectinfo.is(":hidden")){
						$selectinfo.show();
					}
					if($li.hasClass("current")){
						$selectUl.find("li[rel='"+id+"']").remove();				
						$li.removeClass("current");
					}else{					
						$("<li rel='"+id+"' class='current'>"+val+"</li>").appendTo($selectUl);
						$li.addClass("current");
					}				
					if($selectUl.children("li").length==0){
						$selectinfo.hide();
					}
				});*/
				function onlyClick(obj){
					obj.click(function(){
						var $li = $(this);
						var val  =$li.text();
						var id  = $li.attr("rel");
						if($selectinfo.is(":hidden")){
							$selectinfo.show();
						}
						
						if($li.hasClass("current")){
							$selectUl.find("li[rel='"+id+"']").remove();				
							$li.removeClass("current");
						}else{
							obj.removeClass("current");
							$.each($("li",$selectUl),function(i,n){
								if($("li",$selectUl).eq(i).attr("rel")>obj.eq(0).attr("rel")-1&&$("li",$selectUl).eq(i).attr("rel")<obj.eq(obj.length-1).attr("rel")+1){
									$("li",$selectUl).eq(i).remove();	
								}	
							})					
							$("<li rel='"+id+"' class='current'>"+val+"</li>").appendTo($selectUl);
							$li.addClass("current");
						}				
						if($selectUl.children("li").length==0){
							$selectinfo.hide();
						}	
					});	
				}
				
				//绑定已选区li事件
				$selectUl.delegate("li",'click',function(){
					var $li = $(this);
					var id  = $li.attr("rel");
					$mli.filter("li[rel='"+id+"']").removeClass("current");	
					$li.remove();
					if($selectUl.children("li").length==0){
						$selectinfo.hide();
					}
				});
				
				//绑定显示区li p事件
				$showul.delegate("p",'mouseover',function(){	
					$(this).addClass("hover");
				});
				$showul.delegate("p",'mouseout',function(){	
					$(this).removeClass("hover");
				});
				
				$showul.delegate("p",'click',function(){
					var $swli = $(this).parent().parent();
					var id  = $swli.attr("rel");
					var $selli=$("li",$selectUl);
					$mli.filter("li[rel='"+id+"']").removeClass("current");
					$selli.filter("li[rel='"+id+"']").remove();	
					$swli.remove();
					if($selectUl.children("li").length==0){
						$selectinfo.hide();
					}
					//删除arr的指定元素		
					for(var i=0; i<arr.length; i++){
						if(arr[i]==id){
							arr.splice(i,1);	
						}	
					}	
					return false;
					
				});
				
				
				//绑定power浮动层
				$this.powerFloat({
					width: owl.width,
					eventType: owl.eventType,
					offsets: {
						x: options.left?options.left:0,
						y: options.top?options.top:0 
					},
					target: $dropmenu, 	 		
					showCall: function(){ 				
						//标注已选职位
						setCurrentItem(arr);					
						$this.addClass("menu-open");
						if($selectUl.children("li").length){
							$selectinfo.show();
						}
					},
					hideCall:function(){
						$this.removeClass("menu-open");
						arr=[];
						if($selectUl.children("li").length==0){
							$span.text(owl.emptytext);
							arr=[];
						}
					}
				});
				//选中已选的职位
				var setCurrentItem = function (arr){			
					if(arr&&arr!=""){
						$mli.removeClass("current");
						$selectUl.empty();
						for(var i=0;i<arr.length;i++){
							var $cli = $mli.filter("li[rel='"+arr[i]+"']");
							$cli.addClass("current");
							$("<li rel='"+arr[i]+"' class='current'>"+$cli.text()+"</li>").appendTo($selectUl);
						}					
					}else{
						$selectinfo.hide();
	
					}
					
				}
				
				
			})			
		});
	};
	

	
	
})(jQuery);