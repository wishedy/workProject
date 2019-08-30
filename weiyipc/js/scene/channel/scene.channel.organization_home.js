/**
 * 功能描述：频道 组织页首页
 * 使用方法:
 * 注意事件：
 * 引入来源：plugin.follow.js jquery.pager.js  作用：
 *
 * Created by QiaoLiang on 2015-04-14.
 * Change By HJ on 2018-12-06.
 *更改获取信息的所有接口都要进行新版组织变更
 */
$(function(){
	var cid = comm.getpara().cid;
	if(cid==null) g_sps.jump(null,"/");
	var obj = {
			naviEl : $(".ev-navi"), //导航位置
			pageElSignature : $(".ev-signature"), //签名
			pageElNickname : $(".ev-nickname"), //昵称
			pageElFans : $(".ev-fansNum"), // 粉丝数
			pageElLogo : $(".ev-logo"),//logo图标
			pageElResource : $(".ev-resourceNum"), //资源数
			pageElAccessHome : $(".ev-accessHome"),//访问主页
			listTitleEl : $(".ev-listTitle"), //数据列表头部title位置
			listEl : $(".ev-list"), //数据列表位置
			pageEl : $(".pager"), //翻页位置
			followPlaceParent : $(".organization_content_but"), //关注位置父层
			followPlace : $(".ev-orgFollow"), //关注位置
			cid : cid ,
			fansNaviEl : $(".ev-naviFans"), //粉丝导航元素
			sourceNaviEl : $(".ev-naviResource"), //资源导航元素
			sunNavi : $(".ev-sunNavi"), //子导航
			uid : $("#sesCustomerId").val()
	};
	scene.organizationHome(obj);

});

scene.organizationHome = function(obj){
	var orgHome = {
		path : {
			total : PC_CALL+"customer/statistics/getCustomerStatistics/", //统计数
			intro : PC_CALL+"organization/getOrgHomePage/",//组织的简介,签名等介绍信息
			resList : PC_CALL+"organization/getResourcePager/"//资源列表，文库视频公用一个
		},
		opts : {
			tempTotal : 0, //临时记录总数也在翻页时用 用于区别视频与文档之类的
			chooseNav : null,//记录当前导航
			pageSize : 5, //
			videoTotal : 0, //通过返回总数更新
			docTotal : 0, //通过返回总数更新
			cid : 0, //被访问组织id
			uid : 0,  //当前人
			fansNaviEl : null,
			sourceNaviEl : null,
			naviEl : null,
			listTitleEl : null,
			listEl : null,
			sunNavi : null, //子导航
			pageEl : null
		},
        introData:{//暂存介绍信息
		    introduction:""
        },
		init : function(obj){
			var t=this;
			$.extend(t.opts,obj);
			//初始化页面基础信息
			t.pageBaseInfo();
			//先隐藏翻页
			t.opts.pageEl.parent().hide();
		},
		//获取页面基础信息，更改title等信息
		pageBaseInfo : function(){
			var t = this;
			$.ajax({
				url : t.path.intro,
				type : "get",
				data : {paramJson:$.toJSON({
                        organizationId:t.opts.cid?t.opts.cid:'',
                        customerId:$("#sesCustomerId").val()?$("#sesCustomerId").val():0
					})},
				success : function(data){
					if(data&&comm.hasResponseData(data)&&data.responseObject.responseData.dataList&&
					!$.isEmptyObject(data.responseObject.responseData.dataList)){
						var kv=data.responseObject.responseData.dataList;
						if(kv.isValid==1){
                            //追加标题
                            $("title").text(kv.name+"的主页 - 唯医,allinmd");
                            //关键词
                            $("[name=Keywords]").attr("content",kv.name+",临床指南，医学会议，手术视频，医学教学视频，医学科研视频，唯医，allinmd");
                            //logo
                            t.opts.pageElLogo.html('<a href="'+(kv.orgUrl?kv.orgUrl:'javascript:;')+'" target="_blank"><img src="'+(kv.logoUrl?kv.logoUrl:'//img10.allinmd.cn/v3/organization/org_logo_default.png')+'"/></a>');
                            //签名
                            t.opts.pageElSignature.html(kv.signature?kv.signature:'');
                            //姓名
                            t.opts.pageElNickname.html('<a href="'+(kv.orgUrl?kv.orgUrl:'javascript:;')+'" target="_blank">'+kv.name+'</a>');
                            //访问主页
                            t.opts.pageElAccessHome.html('<a href="'+(kv.orgUrl?kv.orgUrl:'javascript:;')+'" target="_blank">访问主页</a>');
                            //资源计数
                            t.opts.pageElResource.text(kv.resourceNum?kv.resourceNum:0);
                            //粉丝计数
                            t.opts.pageElFans.text(kv.fansNum?kv.fansNum:0);
                            //导航数据修改
                            t.opts.naviEl.append(t.template.nav(kv));
                            //介绍描述（组织介绍渲染公共方法）
                            t.introIfo(kv);
                            //关注状态,以及添加关注
                            t.opts.followPlaceParent.follow({
                                fId : t.opts.cid,
                                followPlace : t.opts.followPlace,
                                fStatus : kv.relationship,
                                picStyle : 2
                            });
                            //导航点击进行list数据请求;
                            t.navCtrl();
                        }else{
						    window.location.href="//www.allinmd.cn/pages/not_found.html";
                        }
					}else {
                        t.failData();//显示暂无数据失败
					}
				},
				error:function (data) {
                    t.failData();//显示暂无数据失败
                }
			})
		},
        //组织介绍公共push渲染
        introIfo:function(kv){
            var t=this;
            t.opts.listEl.html((kv.introduction&&kv.introduction!='暂无数据')?'<div class="organization_js">'+(kv.introduction.replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;"))+'</div>':'<div style="height: 110px;text-align: center;line-height: 110px;font-size: 16px;font-family: microsoft yahei;">暂无数据！</div>');
            t.introData.introduction=kv.introduction?kv.introduction.replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;"):"暂无数据";//暂存介绍信息，目的免刷新
        },
        //加载数据失败
        failData:function(kv){
            var t=this;
            t.opts.listEl.html('<p class="al-org_error">暂无数据！</p>');
        },
		//右侧导航点击
		navCtrl : function(){
			var t = this;
            var params = {
                pageIndex:1,
                pageSize:t.opts.pageSize,
                organizationId:t.opts.cid,
                tagId:""
            };
			//触发右侧导航，介绍、视频、文档
			t.opts.naviEl.find("li").off("click").on("click",function(){
				//先隐藏翻页
				t.opts.pageEl.parent().hide();
				$(this).siblings("li").removeClass("on");
				$(this).addClass("on");
				t.opts.listTitleEl.text($(".ev-title",this).text());
				var nav = $("[data-event]",this).attr("data-event");
				t.opts.chooseNav = nav;
				//资源列表请求参数
				switch(nav){
					case "intro":
						if(t.introData.introduction){//如果首次进入介绍存在
                           t.introIfo(t.introData);
						}else{//如果不存在再进行请求
                           t.pageBaseInfo();
						}
						break;
					case "video":
                        params.tagId=1;
						comm.Log.createBrowse({href:location.href,id:116,name:'组织视频'});
                        t.ajaxList(params);
						break;
					case "doc":
                        params.tagId=2;
						comm.Log.createBrowse({href:location.href,id:117,name:'组织文档'});
                        t.ajaxList(params);
						break;
				}
			});
			//点击资源按钮，请求展示全部资源列表
			t.opts.sourceNaviEl.off("click").on("click",function(){
                t.opts.listTitleEl.text("所有资源");
                t.opts.naviEl.find("li").removeClass("on");
                params.tagId="";
                t.ajaxList(params);
			});
            //点击粉丝进行请求
            t.opts.sunNavi.find("[data-events=fans]").off("click").on("click",function(){
                t.opts.listTitleEl.text("粉丝");
                t.opts.naviEl.find("li").removeClass("on");
                var total = parseInt($(".ev-fansNum").text());
                if(total>0){ //大于0调用列表
                    t.opts.pageEl.parent().show();
                    module.userList({
                        customerId:t.opts.cid, //本人id
                        type:"fans",//类型
                        container: t.opts.listEl,//存放列表的容器
                        pageTotal:total,//总数量
                        pageSize:12,//每页的数量
                        pagination:t.opts.pageEl//分页容器
                    });
                }else{//0时调用列表
                    t.opts.pageEl.parent().hide();
                    t.opts.listEl.html('<p class="al-org_error">你还没有被赞过哦～</p>');
                }
            });
		},
        //右侧导航切换html渲染，资源列表(总资源，视频，文库)
        dataCtrl : function(kv){
            var t = this,html = "";
            $.each(kv.dataList,function(i,el){
                html += t.template.listWord(el);
            });
            t.opts.listEl.html(html);
        },
		//列表ajax请求
		ajaxList : function(params){
			var t = this;
            var groupCount;
            //分页请求
            var PageClick = function(pageclickednumber){
                comm.LightBox.showloading();
                $.ajax({
                    url:t.path.resList,
                    type:"get",
                    data:{paramJson:$.toJSON({
                            pageIndex: pageclickednumber,
                            pageSize: t.opts.pageSize,
                            organizationId:t.opts.cid,
                            tagId:params.tagId
                        })},
                    dataType:"json",
                    async: false,
                    success:function (res) {
                        comm.LightBox.hideloading();
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                        if (res && comm.hasResponseData(res)&&
                            res.responseObject.responseData.dataList&&
                            res.responseObject.responseData.dataList.length>0){
                            var ev=res.responseObject.responseData;
                            t.dataCtrl(ev);
                        } else{
                            t.failData();//显示暂无数据
                            t.opts.pageEl.parent().hide();
                        }
                    },
                    error:function (res) {
                        t.failData();//显示暂无数据
                        t.opts.pageEl.parent().hide();
                    }
                });
            };

            //初次列表请求
            comm.LightBox.showloading();
			$.ajax({
				url : t.path.resList,
				type : "get",
				data : {paramJson:$.toJSON(params)},
				success : function(data){
                    comm.LightBox.hideloading();
					//视频和文库列表，和总资源列表
					if(data&&comm.hasResponseData(data)&&data.responseObject.responseData.dataList&&
						data.responseObject.responseData.dataList.length>0){//列表资源有数据
						var ev=data.responseObject.responseData;
						t.dataCtrl(ev);
						t.opts.pageEl.parent().show();//分页展示
						groupCount=Math.ceil(data.responseObject.responseData.totalCount/ t.opts.pageSize);
						$(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick});
					}else{
						t.failData();//显示暂无数据
					}
				},
				error:function (data) {
                    t.failData();//显示暂无数据
                }
			});
		},
		template : {
            //初使化视频与文章总记录值
			nav : function(kv){
				var t= orgHome;
				t.opts.videoTotal = kv.videoNum?kv.videoNum:"0";
				t.opts.docTotal = kv.docNum?kv.docNum:"0";

				return "<li class=\"on\">"+
                 "<div class=\"organization_cont_mr_js\"></div>"+
                 "<div class=\"case_b ev-title\" data-event=\"intro\">介绍</div>"+
                 "<div class=\"p_nav_num\"></div>"+
                 "<div class=\"clear\"></div>"+
               "</li>"+
               "<li>"+
                 "<div class=\"organization_cont_video_js\"></div>"+
                 "<div class=\"case_b ev-title\" data-event=\"video\">视频</div>"+
                 "<div class=\"p_nav_num\">(<span class=\"ev-num\">"+t.opts.videoTotal+"</span>)</div>"+
                 "<div class=\"clear\"></div>"+
               "</li>"+
               "<li>"+
                 "<div class=\"organization_cont_doc_js\"></div>"+
                 "<div class=\"case_b ev-title\"  data-event=\"doc\">文档</div>"+
                 "<div class=\"p_nav_num\">(<span class=\"ev-num\">"+t.opts.docTotal+"</span>)</div>"+
                 "<div class=\"clear\"></div>"+
               "</li>";
			},
			//列表结构html
			listWord : function(kv){
				return '<li>'+
              '<div class="v_list_r font_yahei">'+
                '<div class="v_list_r_name"><a href="'+(kv.pageStoragePath?kv.pageStoragePath:"javascript:;")+'" target="_blank">'+comm.getStrLen(kv.resourceName,82)+'</a></div>'+
                '<div class="v_list_r_author o_doc_list" style="width:670px;">'+
                  '<ul>'+
                    '<li>'+comm.getStrLen(kv.resourceAuthor,22)+'</li>'+
                    '<li class="pointer"></li>'+
                    '<li>来源：'+kv.resourceSource+'</li>'+
                    '<li class="pointer"></li>'+
                    '<li>阅读：'+kv.browseNum+'</li>'+
                    '<li class="time">'+comm.date.diffDay_one(kv.publishTime,comm.date.local_time())+'</li>'+
                    '<div class="clear"></div>'+
                  '</ul>'+
                '</div>'+
                '<div class="v_list_text font_yahei o_doc_list">'+comm.getStrLen(kv.resourceAbstract,268)+'</div>'+
              '</div>'+
              '<div class="clear"></div>'+
            '</li>';
			}
		}
	};
	orgHome.init(obj);
};