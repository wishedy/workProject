/**
 * 功能描述：频道 组织页 ROWS
 * 使用方法:
 * 注意事件：
 * 引入来源：plugin.follow.js jquery.pager.js module.banner-carousel.js  作用：
 *
 * Created by QiaoLiang on 2015-04-13.
 * Change By HJ on 2018-12-06.
 * 更改组织列表请求接口
 */

$(function(){
	var putEl = $(".organization-wrap"); //输出列表位置
	var pager = $(".pager"); //翻页位置
	var adEl = $(".ev-AdList");//图片列表位置
	var adTitleEl = $(".ev-AdTitle"); //图片列表标题
	
	scene.organization({putEl:putEl,pager:pager,adEl:adEl,adTitleEl:adTitleEl});
	
});

scene.organization = function(obj){
	var org = {
		config : {
			maxPage : 0,//最大页数
			pager : null, //翻页陈放位置
			putEl : null, //数据陈放位置
			adEl : null,//广告陈放位置
			adTitleEl : null,//广告标题陈放位置
            pageIndex:1,//首页
			pageSize : 6 //一页6条
		},
		path : {
			list : PC_CALL+"organization/getPager/",
			adList : PC_CALL+"customer/unite/org_page_listmap/"
		},
		init : function(obj){
			var t = this;
			$.extend(t.config,obj);
			//载入广告
			t.adCtrl();
			t.ajaxTotal();//列表数据请求接口
		},
		//html格式渲染
		dataCtrl : function(kv){
			var t = this, arrHtml = [];
			for(var i=0;i<kv.length;i++){
				arrHtml.push(t.template(kv[i]));
			};
			arrHtml.push('<div class="clear"></div>');
			t.config.putEl.html(arrHtml).find(">li").hover(function(){
												$(this).addClass("o_l_hover");
											},function(){
												$(this).removeClass("o_l_hover");
											});
			//给所有偶数值加入下方类
			$("li:odd",t.config.putEl).addClass("organization_no_margin");
			$(".or_gz_cont_r").on("click",function(){
				var url=$(this).find("a").attr("orgUrl");
				if(url&&url.lastIndexOf("www.allinmd.cn")<=-1){
					comm.surePop({
						icon:0, //需要图标吗
						title:'即将跳转外站',
						success:function(){
							window.open(url);
						}
					});
					return false;
				}
			});
		},
		//列表分页请求变更
		ajaxTotal : function(){
			var t = this;
            var groupCount;
            var PageClick = function(pageclickednumber){
                comm.LightBox.showloading();
                $.ajax({
                    url:t.path.list,
                    type:"get",
                    data:{paramJson:$.toJSON({
                            pageIndex: pageclickednumber,
                            pageSize: t.config.pageSize,
                            customerId:$("#sesCustomerId").val()?$("#sesCustomerId").val():""
                        })},
                    dataType:"json",
                    async: false,
                    success:function (res) {
                        comm.LightBox.hideloading();
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                        if (res && comm.hasResponseData(res)&&
                            res.responseObject.responseData.dataList&&
                            res.responseObject.responseData.dataList.length>0){
                            t.config.putEl.removeClass("noListData");
                            t.dataCtrl(res.responseObject.responseData.dataList); //列表铺设、
                        } else{
                            t.config.putEl.text("暂无数据！").addClass("noListData");
                            $(".pagination").hide();
                        }
                    },
                    error:function (res) {
                        t.config.putEl.text("暂无数据！").addClass("noListData");
                        $(".pagination").hide();
                    }
                });
            };
			comm.LightBox.showloading();
			$.ajax({
				url:t.path.list,
				type:"get",
				data:{paramJson:$.toJSON({
						pageIndex:t.config.pageIndex,
						pageSize:t.config.pageSize,
                        customerId:$("#sesCustomerId").val()?$("#sesCustomerId").val():""
					})},
				dataType:"json",
                async: false,
				success:function (res) {
                    comm.LightBox.hideloading();
					if (res && comm.hasResponseData(res)&&
						res.responseObject.responseData.dataList&&
                        res.responseObject.responseData.dataList.length>0){
                        t.config.putEl.removeClass("noListData");
                        t.dataCtrl(res.responseObject.responseData.dataList); //列表铺设、
                        $(".pagination").show();
                        groupCount=Math.ceil(res.responseObject.responseData.totalCount/ t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick});
					}else{
                        t.config.putEl.text("暂无数据！").addClass("noListData");
                        $(".pagination").hide();
					}
                },
                error:function (res) {
                    t.config.putEl.text("暂无数据！").addClass("noListData");
                    $(".pagination").hide();
                }
			});

		},
		//组织首页html模版
		template : function(kv){
			var orgUrl="/pages/channel/organization-home.html?cid="+kv.id;//组织主页链接
			var logoUrl=kv.logoUrl?kv.logoUrl:"//img10.allinmd.cn/v3/organization/org_logo_default.png";
			var headImgUrl=kv.headImgUrl?kv.headImgUrl:"//img10.allinmd.cn/v3/organization/org_bg_default.png";
			var html='<li>'+
		    '<div class="or_list_img">' +
				'<a href="'+orgUrl+'">' +//组织id跳转组织详情页
				'<img alt="'+kv.name+'" title="'+kv.name+'" src="'+headImgUrl+'">' +//组织名和背景图
				'</a>'+
		      '<div class="or_list_biao">'+
		        '<div>' +
				'<a href="'+orgUrl+'">' +//组织id跳转组织详情页
				'<img alt="'+kv.name+'" title="'+kv.name+'"  ' +
				'src="'+logoUrl+'" width="100" height="100">' +//组织logo
				'</a>' +
				'</div>'+
		      '</div>'+
		      '<div class="or_gz_cont">'+
				'<div class="or_gz_cont_l evFollow"></div>'+
				'<div class="or_gz_cont_r">' +
				'<a href="javascript:;" orgUrl="'+$.trim(kv.orgUrl)+'">' +//他的主页（外站链接）
					'<img alt="'+kv.name+'" title="'+kv.name+'" ' +
					'src="//img00.allinmd.cn/channel/organization/my_home.png"/>' +
				'</a>' +
				'</div>'+
				'<div class="clear"></div>'+
		        '</div>'+
		    '</div>'+
		    '<div class="or_list_name"><a href="'+orgUrl+'">'+kv.name+'</a></div>'+
		    '<div class="or_list_text" >'+(kv.introduction.replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;"))+'</div>'+//组织介绍
		  '</li>';
			//加关注
			return $(html).follow({fId:kv.id,followPlace:".evFollow",fStatus:kv.relationship,picStyle:3})
		},
        //广告列表
		adCtrl : function(){
			var t=this;
			var callBack = function(data){
                if($.isEmptyObject(data)){ return false;}
                var kv = data.responseObject.responseData.data_list;
                var len = kv.length;
                var html = "",html2="";
                $.each(kv,function(i,el){
                    html += t.adTemplate.list(el.ad_profile_attachment,i+1);
                    html2 += t.adTemplate.title(i+1);
                });
                t.config.adEl.html(html);
                //最后一个没有边框线
                t.config.adTitleEl.html(html2).find("li:last").css("border","none");
                //引入大轮播
                module.bannerCarousel();
                $(".banner-inner li").on("click",function(){
                    locationId=$(this).attr("index");
                    //事件埋点
                    comm.creatEvent({
                        async:false,
                        triggerType:"广告",
                        keyword:$(this).find("img").attr("alt"),
                        locationId:locationId,
                        actionId:14
                    });
                })
            };
            $.ajax({
                url : t.path.adList,
                type : "POST",
                data : {},
                success :callBack ,
                error : function(){}
            });
		},
        //广告模版
		adTemplate : {
			list : function(kv,num){ //列表
	               return "<li index="+num+">"+
                   "<a href=\""+kv.linkUrl+"\">"+
                       "<img  alt=\""+kv.adAttName+"\" src=\""+kv.adAttUrl+"\" /></a>"+
                   "</li>";
			},
			title : function(num){ //标题
				return  "<li> "+num+"</li>"
			}
		}
	};
	org.init(obj);
};