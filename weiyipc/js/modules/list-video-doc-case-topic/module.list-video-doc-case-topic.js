/**
 * 功能描述：绑定列表功能
 * 使用方法:
 * 注意事件：   mediaType : 资源类型
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/30.
 */


module.listVideoDocCaseTopic = function (Obj) {
	var param = comm.getpara();

	var defaults = {
		mediaType: "",
		initParam: param
	};

	var options = $.extend(defaults, Obj);

	var selectorData = {
		options_1: ["全部", "视频", "文库"],
		options_2: [
			{
				tagId: "2", tagName: "关节", children: [
				{tagId: "10", tagName: "人工髋关节置换"},
				{tagId: "11", tagName: "人工髋关节翻修"},
				{tagId: "12", tagName: "保髋治疗"},
				{tagId: "13", tagName: "人工膝关节置换"},
				{tagId: "14", tagName: "人工膝关节翻修"},
				{tagId: "15", tagName: "保膝治疗"}
			]
			},
			{
				tagId: "3", tagName: "足踝", children: [{tagId: "16", tagName: "足踝"}]
			},
			{
				tagId: "4", tagName: "四肢矫形", children: [
				{tagId: "17", tagName: "手"},
				{tagId: "18", tagName: "腕"}
			]
			},
			{
				tagId: "5", tagName: "小儿骨科", children: [
				{tagId: "19", tagName: "髋"},
				{tagId: "20", tagName: "脊柱"},
				{tagId: "21", tagName: "运动医学"},
				{tagId: "22", tagName: "创伤"},
				{tagId: "23", tagName: "上肢"},
				{tagId: "24", tagName: "足踝"}
			]
			},
			{
				tagId: "6", tagName: "肘&肩", children: [
				{tagId: "25", tagName: "肘"},
				{tagId: "26", tagName: "肩"}]
			},
			{
				tagId: "7", tagName: "脊柱", children: [
				{tagId: "27", tagName: "颈椎"},
				{tagId: "28", tagName: "腰椎"},
				{tagId: "29", tagName: "脊柱侧凸"},
				{tagId: "30", tagName: "脊髓"},
				{tagId: "31", tagName: "脊柱创伤"},
				{tagId: "32", tagName: "脊柱肿瘤"}]
			},
			{
				tagId: "8", tagName: "运动医学", children: [
				{tagId: "33", tagName: "肘"},
				{tagId: "34", tagName: "足踝"},
				{tagId: "35", tagName: "髋"},
				{tagId: "36", tagName: "膝"},
				{tagId: "37", tagName: "肩"},
				{tagId: "38", tagName: "腕关节镜"}]
			},
			{
				tagId: "9", tagName: "创伤", children: [
				{tagId: "39", tagName: "髋与骨盆"},
				{tagId: "40", tagName: "下肢"},
				{tagId: "41", tagName: "脊柱"},
				{tagId: "42", tagName: "上肢"}]
			},
			{
				tagId: "816", tagName: "骨肿瘤", children: []
			},
			{
				tagId: "817", tagName: "康复", children: []
			},
			{
				tagId: "818", tagName: "骨质疏松", children: []
			},
			{
				tagId: "819", tagName: "基础", children: []
			},
			{
				tagId: "820", tagName: "显微修复", children: []
			},
			{
				tagId: "821", tagName: "中西医结合", children: []
			}
		],
		options_4: ["WOA", "CAOS", "COA", "JOA", "OrthoEvidence", "AAOS", "ASIA"],

		options_5: {
			"all": ["手术视频", "课程视频", "会议视频", "专家访谈", "教材", "指南", "期刊", "讲义"],
			"video": ["手术视频", "课程视频", "会议视频", "专家访谈"],
			"doc": ["教材", "指南", "期刊", "讲义"],
			"topic": ["专业话题", "随便聊聊"]
		}
	};


	String.prototype.htmlEncode = function () {
		return this.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	};

	var template = '{for item in items}<li class="${item.typeClass}">' +
		'     <div class="list_cont_main_l_mr {if item.imgUrl==""} list_text_l{/if}">' +
		'        <div class="list_cont_name"><a href="${item.toUrl}" target="_blank">${item.title}</a></div>' +
		'        <div class="list_cont_author">' +
		'         <ul>' +
		'            {if item.author!=""}' +
		'               <li>{if item.author!=undefined && item.author.length>6}${item.author.substring(0,6)}...{else}${item.author}{/if}</li>' +
		'               <li class="pointer"></li>' +
		'            {/if}' +
		'            {if item.source!=""}' +
		'               <li>来源：{if item.source!=undefined && item.source.length>6}${item.source.substring(0,6)}...{else}${item.source}{/if}</li>' +
		'               <li class="pointer"></li>' +
		'            {/if}' +
		'            <li>${item.browse}</li>' +
		'            {if item.reviewNum!=""}' +
		'               <li class="pointer"></li>' +
		'               <li>评论数：${item.reviewNum}</li>' +
		'            {/if}' +
		'            {if item.pYM!=""}' +
		'            <li class="time">${item.pYM}-${item.pD}</li>' +
		'            {/if}' +
		'            {if item.publishTime!=""}' +
		'            <li class="time">${item.publishTime}</li>' +
		'            {/if}' +
		'            <div class="clear"></div>' +
		'        </ul>' +
		'       </div>' +
		'       <div class="list_cont_text font_yahei Ev-ContentA">{if (item.content+item.summay).length>200}${(item.content+item.summay).substring(0,200)}...{else}${(item.content+item.summay)}{/if}</div>' +
		'    </div>' +
		'    {if item.imgUrl!=""}' +
		'    <div class="list_cont_main_r">' +
		'        <a href="${item.toUrl}" target="_blank"><img src="${item.img}" data-original="${item.imgUrl}" width="${item.width}" height="${item.height}" /></a>' +
		'       {if item.playTime!=""}' +
		'           <div class="v_tj_img_time_bg"></div>' +
		'           <div class="v_tj_img_time">${item.playTime}</div>' +
		'       {/if}' +
		'    </div>' +
		'    {/if}' +
		'    <div class="clear"></div>' +
		'    </li>{/for}';

	/***
	 * 删除数据元素
	 * @param dx
	 * @returns {boolean}
	 */
	Array.prototype.remove = function (dx) {
		if (isNaN(dx) || dx > this.length) {
			return false;
		}
		for (var i = 0, n = 0; i < this.length; i++) {
			if (this[i] != this[dx]) {
				this[n++] = this[i]
			}
		}
		this.length -= 1
	};

	var controller = {};
	controller.currentParamIndex = 0;   // 参数索引
	controller.pageSize = 20;
	controller.mediaType = options.mediaType;
	controller.search = {               // 搜索
		keyInput: $("#keyword"),
		init: function () {
			var t = this;
			t.keyInput.focus(function () {
				if (t.keyInput.val() == "在结果中搜索如作者名") {
					$(this).val("");
				}
				$(document).keydown(function (e) {
					if (e.keyCode == 13) {
						controller.query();
					}
				});
			});
			t.keyInput.blur(function () {
				if (t.keyInput.val().trim() == "") {
					$(this).val("在结果中搜索如作者名");
				}
				$(document).off("keydown");
			});
			$("#search_but").click(function () {
				controller.query();
			});

			$(".pages li").live("click", function () {
				$(document).scrollTop(0);
			});

			t.bindRecommend();
			t.keyInput.searchAutoComplete();
		},
		/**
		 * 关键词联想
		 */
		bindRecommend: function () {
			$("#keyword").on("change", function () {
				//TODO: 请求相关数据
			});
		}
	};


	/***
	 *  四个 下拉 选择
	 * @type {{domain: string, downSelectorContainer: {}, selectedOptionsContainer: {}, timeout: {}, pageNum: number, mediaType: string, selectedItems: Array, init: init, initParam: initParam, getHrefParam: getHrefParam, getData: getData, setupOptions: setupOptions, bindSelectorHover: bindSelectorHover, bindAllOptions: bindAllOptions, bindSpecs: bindSpecs, bindTags: bindTags, bindFroms: bindFroms, bindTypes: bindTypes, getDownSelectParams: getDownSelectParams, createSelectedItem: createSelectedItem, clearTag: clearTag, clearDownSelector: clearDownSelector, getParam: getParam, getFileType: getFileType}}
	 */
	controller.downSelector = {
		domain: "/call/",
		downSelectorContainer: {},
		selectedOptionsContainer: {},
		timeout: {},
		pageNum: 1,
		mediaType: options.mediaType, //载体类型,后选值:ALL,VIDEO,DOC
		selectedItems: [],
		//
		init: function () {
			var t = this;

			//t.downSelectorContainer.filter(":gt(0)").append("<div class='list_position'><div class='list_t_bg'></div><div class='list_c_bg'><ul class='options'></ul><div class='clear'></div></div><div class='list_b_bg'></div></div>");
			t.selectedOptionsContainer = $("#selectedOptions");
			t.downSelectorContainer = $("#downSelector").find(".down-select-item");
			t.getHrefParam();

			t.initDownSelectorData();
			t.bindSelectorHover();      // 下拉选项的鼠标经过效果
			t.bindAllOptions();
			// 初始化 地址栏参数
			t.initParamAction();
			controller.query();
		},
		initDownSelectorData: function () {
			var t = this;
			t.setupOptions(1, t.getData(2), "vertical");        // 填充下拉里的数据
			t.setupOptions(2, t.getData(3), "horizontal");

			if (options.mediaType === "video" || options.mediaType === "doc") {
				t.setupOptions(3, t.getData(4), "vertical");
				t.setupOptions(4, t.getData(5, options.mediaType), "vertical");
			} else {
				if (options.mediaType === "topic") {  //   话题
					//  只显示类别
					t.downSelectorContainer.filter(":lt(3):gt(0)").hide();
					t.setupOptions(4, t.getData(5, options.mediaType), "vertical");
				}
				if (options.mediaType === "case") {    //  病例
					// 只显示专业与标签
					t.downSelectorContainer.filter(":gt(1)").hide();
				}
			}
		},
		/***
		 *  初始化地址参数
		 */
		initParamAction: function () {
			var t = this;
			var parent;

			var arr, i, l;
			if (t.initParam) {
				if (t.initParam.spec != undefined) {
					t.downSelectorContainer.eq(0).find("a[tagid=" + t.initParam.spec + "]").click();
				}

				if (t.initParam.tags != undefined) {
					parent = t.downSelectorContainer.eq(1);
					if (t.initParam.tags.indexOf(",") > 0) {
						arr = t.initParam.tags.split(",");
						if (arr.length) {
							for (i = 0, l = arr.length; i < l; i++) {
								parent.find("a[tagid=" + arr[i] + "]").click();
							}
						}
					} else {
						parent.find("a[tagid=" + t.initParam.tags + "]").click();
					}
				}
				if (t.initParam.source != undefined) {
					parent = t.downSelectorContainer.eq(2);

					if (t.initParam.source.indexOf(",") > 0) {
						arr = t.initParam.source.split(",");
						for (i = 0, l = arr.length; i < l; i++) {
							parent.find("a:contains(" + arr[i] + ")").click();
						}
					} else {
						parent.find("a:contains(" + t.initParam.source + ")").click();
					}
				}
				if (t.initParam.type != undefined) {
					parent = t.downSelectorContainer.eq(3);

					if (t.initParam.type.indexOf(",") > 0) {
						arr = t.initParam.type.split(",");
						for (i = 0, l = arr.length; i < l; i++) {
							parent.find("a:contains(" + arr[i] + ")").click();
						}
					} else {
						parent.find("a:contains(" + t.initParam.type + ")").click();
					}
				}
				if (t.initParam.sortType != undefined) {    // 更多，一般为最新发布 排序类型
					controller.sort.sortTypeIndex = t.initParam.sortType;
				}
			}
		},
		/***
		 * 获取地址参数
		 */
		getHrefParam: function () {
			var t = this;

			function getpara()//获取参数的函数
			{
				var url = document.URL;
				var param = {};
				var str, item;
				if (url.lastIndexOf("?") > 0) {
					str = url.substring(url.lastIndexOf("?") + 1, url.length);
					var arr = str.split("&");
					for (var i = 0; i < arr.length; i++) {
						item = arr[i].split("=");
						param[item[0]] = decodeURI(item[1]);
					}
					return param;
				}
			}

			var p = getpara();
			if (p) {
				t.initParam = p;
			}
		},
		// 获取某下拉框需要的数据
		getData: function (m, type) {
			var rst;
			if (m == 3) {	// 标签数据特别
				var opts = selectorData["options_2"];
				if (type) {
					for (var j = 0, l = opts.length; j < l; j++) {
						if (opts[j].tagId == type) {
							rst = opts[j].children;
						}
					}
				} else {
					var arr = [];
					for (var k = 0, ol = opts.length; k < ol; k++) {
						arr = arr.concat(opts[k].children);
					}
					rst = arr;
				}
			} else {
				rst = type ? selectorData["options_" + m][type]
					: selectorData["options_" + m];
			}

			return rst;
		},
		/**
		 *  为下拉选择填充下拉选项
		 *  序号，数据，类型("horizontal","vertical")
		 * */
		setupOptions: function (index, data, type) {
			var t = this, list;
			var con = t.downSelectorContainer.eq(index - 1).find("ul").empty();
			list = $.map(data, function (val,i) {
				var html;
				if (index == 1 || index == 2) {
					if (type == "horizontal") {//水平
						html = "<li style='"+(i%5==4?'background-image: none;':'')+"'><a style='"+(i%5==4?'background-image: none;':'')+"' href='javascript:void(0)' tagId='" + val.tagId + "'>" + val.tagName + "</a></li>";
					}else{
						html = "<li><a href='javascript:void(0)' tagId='" + val.tagId + "'>" + val.tagName + "</a></li>";
					}
				} else {
					html = "<li><a href='javascript:void(0)'>" + val + "</a></li>";
				}
				return html;
			});
			if (type == "horizontal") {//水平
				//con.hasClass("list_bq_xl") ? "" : con.addClass("list_bq_xl");
				//con.html(list.join("<li class='sep-line'>|</li>") + "<li class='last clear'></li>");
				con.html(list.join(" ") + "<li class='last clear'></li>");
			} else {
				//con.hasClass("list_zy_xl") ? "" : con.addClass("list_zy_xl");
				con.html(list.join(" "));
			}

		},
		// 鼠标经过下拉选择事件
		bindSelectorHover: function () {
			var t = this;
			t.downSelectorContainer.hover(function () {
				t.downSelectorContainer.removeClass("list_top_hover");
				$(this).addClass("list_top_hover");
				if (t.timeout) {
					clearTimeout(t.timeout);
				}
			}, function () {
				var o = $(this);
				t.timeout = setTimeout(function () {
					o.removeClass("list_top_hover");
				}, 500);
			});
		},
		// 绑定点击选项
		bindAllOptions: function () {
			var t = this;
			t.bindSpecs();
			t.bindTags();
			t.bindFroms();
			t.bindTypes();
		},
		// 选中
		selectEl: function (el) {
			el.find("a").removeClass("hover");
			el.find("a").addClass("active");
			el.attr("select-status", "true");
		},
		// 未选中
		unSelectEl: function (el) {
			el.find("a").removeClass("selected-hover");
			el.find("a").removeClass("active");
			el.attr("select-status", "false");
		},
		bindLisHover: function (lis) {
			lis.each(function (index, el) {
				$(this).hover(function () {
					// 设置样式
					if ($(el).attr("select-status") == null ||
						$(el).attr("select-status") == "false") {
						$(el).find("a").addClass("hover");
					} else {
						$(el).find("a").addClass("selected-hover");
					}
				}, function () {
					if ($(el).attr("select-status") == null ||
						$(el).attr("select-status") == "false") {
						$(el).find("a").removeClass("hover");
					} else {
						$(el).find("a").removeClass("selected-hover");
					}
				});
			});
		},
		// 绑定专业
		bindSpecs: function () {
			var t = this;
			var lis = t.downSelectorContainer.eq(0).find(".options li:not(.last)");
			lis.each(function () {
				$(this).click(function () {
					var el = $(this);
					lis.find("a").removeClass("active");

					var tagName = el.find("a").text();
					var tagId = el.find("a").attr("tagId");

					if (el.attr("select-status") == null ||       // 之前若没选中
						el.attr("select-status") == "false") {
						t.selectEl(el);
						t.clearTag(2);

						t.createSelectedItem(2, tagName, tagId);
					} else {                                    // 之前已选中 清除掉专业及 标除   e
						t.unSelectEl(el);
						t.clearTag(2, tagName, tagId);
					}

					if (lis.find(".active").length > 0) {           // 若有选中的
						t.setupOptions(2, t.getData(3, tagId), "vertical");
					} else {                                            // 若无选中的
						t.setupOptions(2, t.getData(3), "vertical");
					}
					t.bindTags();
					t.pageNum = 1;
					controller.currentParamIndex++;
					controller.query();

				});
			});
			t.bindLisHover(lis);

		},
		// 绑定标签
		bindTags: function () {
			var t = this;
			var lis = t.downSelectorContainer.eq(1).find(".options li:not(.last)");
			lis.each(function () {
				$(this).click(function () {
					var el = $(this);
					var tagName = el.find("a").text();
					var tagId = el.find("a").attr("tagId");
					if (el.attr("select-status") == null ||
						el.attr("select-status") == "false") {
						t.selectEl(el);        // 设置样式
						t.createSelectedItem(3, tagName, tagId);
					} else {
						t.unSelectEl(el);
						t.clearTag(3, tagName, tagId);
					}
					t.pageNum = 1;
					controller.currentParamIndex++;
					controller.query();
				});
			});
			t.bindLisHover(lis);
		},
		// 绑定来源
		bindFroms: function () {
			var t = this;
			var lis = t.downSelectorContainer.eq(2).find(".options li:not(.last)");
			lis.each(function () {
				$(this).click(function () {
					// 设置样式
					var el = $(this);
					el.addClass("active");
					var tagName = el.find("a").text();

					if (el.attr("select-status") == null ||
						el.attr("select-status") == "false") {
						t.selectEl(el);
						t.createSelectedItem(4, tagName);
					} else {
						t.unSelectEl(el);

						t.clearTag(4, tagName);
					}
					t.pageNum = 1;
					controller.currentParamIndex++;
					controller.query();
				});
			});
			t.bindLisHover(lis);
		},
		// 绑定类别
		bindTypes: function () {
			var t = this;
			var lis = t.downSelectorContainer.eq(3).find(".options li:not(.last)");
			lis.each(function () {
				$(this).click(function () {
					var el = $(this);
					el.addClass("active");
					var tagName = el.find("a").text();

					if (el.attr("select-status") == null ||
						el.attr("select-status") == "false") {
						t.selectEl(el);

						t.createSelectedItem(5, tagName);
					} else {
						t.unSelectEl(el);

						t.clearTag(5, tagName);
					}
					t.pageNum = 1;
					controller.currentParamIndex++;
					controller.query();
				});

				t.bindLisHover(lis);
			});
		},
		// 获取下拉框的参数
		getDownSelectParams: function () {
			var t = this;
			return {
				mediaType: t.mediaType,
				tags: t.tags || "",
				sourceStr: t.sources,
				types: t.types
			}
		},
		// 选中后在下面添加查询关键词
		createSelectedItem: function (downType, keyName, tagId) {
			var t = this;
			var el = $('<li>' +
				'    <div class="list_select_success_text">' + keyName + '</div>' +
				'    <div class="list_select_success_close close">' +
				'         <img src="//modules.allinmd.cn/list-video-doc-case-topic/images/list_close.png"/>' +
				'    </div>' +
				'    <div class="clear"></div>' +
				'</li>');

			var item = {
				downType: downType, keyName: keyName, tagId: tagId ? tagId : "", el: el, clear: function () {
					this.el.remove();
					controller.currentParamIndex++;
					t.clearDownSelector(this);
				}
			};
			item.el.find(".close").click(function () {
				t.clearTag(item.downType, item.keyName, item.tagId);
				controller.query();
			});
			t.selectedItems.push(item);

			t.selectedOptionsContainer.find(".clear:last").before(item.el);
		},
		// 清除标签
		clearTag: function (downType, keyName, tagId) {
			var t = this, toDelArr = [];

			var l = t.selectedItems.length;                             // 遍历选中的元素
			for (var i = 0; i < l; i++) {                               // 遍历选中的项
				var item = t.selectedItems[i];
				if (downType == 2) {	// 当点击类别为专业时，清除所有标签
					t.setupOptions(2, t.getData(3), "vertical");      // 重设标签
					t.bindTags();                                       // 重新绑定标签
					if (item.downType == "2" || item.downType == "3") { // 若为专业或者标签
						item.clear();
						toDelArr.push(i);
					}
				} else if (downType == 1) {             // 若当前点击的是 资源类别
					if (item.downType == "5") {         // 若是类别
						item.clear();
						toDelArr.push(i);
					}
				} else {
					if (tagId) {
						if (item.tagId == tagId) {
							item.clear();
							toDelArr.push(i);
						}
					} else {
						if (item.keyName == keyName) {
							item.clear();
							toDelArr.push(i);
						}
					}

				}
			}
			toDelArr.sort();

			for (l = toDelArr.length, i = l; i >= 0; i--) {
				t.selectedItems.remove(toDelArr[i]);
			}
		},
		clearDownSelector: function (obj) {

			var t = this;
			var el = t.downSelectorContainer.eq(obj.downType - 2).find(".options li:contains(" + obj.keyName + ")");
			if (el) {
				el.find("a").removeClass("active");
				el.attr("select-status", "false");
			}
		},
		getParam: function () {
			var t = this, tags = [], sources = [], types = [];
			var param = {
				mediaType: options.mediaType
				/*   sources:"",
				 tags:"",
				 types:""*/
			};


			var insertedIndex = -1;
			for (var i = 0, l = t.selectedItems.length; i < l; i++) {
				var item = t.selectedItems[i];
				switch (item.downType) {
					case 2:
						tags.push(item.tagId);
						insertedIndex = i;
						break;
					case 3:
						if (insertedIndex >= 0) {
							tags.shift();
							insertedIndex = -1;
						}
						tags.push(item.tagId);
						break;
					case 4:
						sources.push(item.keyName);
						break;
					case 5:
						types.push(t.getFileType(item.keyName));
						break;
				}
			}


			if (sources.length > 0) {
				param.sourceStr = sources.join(",")
			}
			if (tags.length > 0) {
				param.tags = tags.join(",")
			}
			if (types.length > 0) {
				param.types = types.join(",")
			}

			return param;
		},
		getFileType: function (name) {
			var rst;
			switch (name) {
				case "手术视频":
					rst = "v_1";
					break;
				case "课程视频":
					rst = "v_2";
					break;
				case "会议视频":
					rst = "v_3";
					break;
				case "专家访谈":
					rst = "v_4";
					break;
				case "教材":
					rst = "d_1";
					break;
				case "指南":
					rst = "d_2";
					break;
				case "期刊":
					rst = "d_3";
					break;
				case "讲义":
					rst = "d_4";
					break;
				case "随便聊聊":
					rst = "1";
					break;
				case "专业话题":
					rst = "2";
					break;
			}
			return rst;
		}
	};
	/**
	 * 排序
	 * @type {{sortType: string, sortContainer: (*|jQuery|HTMLElement), sortTab: (*|jQuery), sortTabContent: (*|jQuery|HTMLElement), pageContainer: (*|jQuery|HTMLElement), index: number, init: init}}
	 */
	controller.sort = {
		sortType: "sortListAuthority",
		sortNewType: 5,
		sortTypeIndex: 0,
		sortContainer: $(".list_cont_list"),
		sortTab: $(".list_cont_list_nav").find("li:eq(0)"),
		sortTabContent: $(".list_cont_list .list:eq(0)"),
		pageContainer: $(".page-container"),
		index: 0,    // 当前选中的选项卡顺序号 用以切换选项卡时关联
		init: function () {
			var t = this;
			t.sortContainer = $(".list_cont_list");
			var tabs = t.sortContainer.find(".list_cont_list_nav li");
			tabs.each(function (index) {
				$(this).click(function () {
					t.sortTab = $(this);
					t.index = $(this).index();
					t.sortTabContent = $(".list_cont_list").find(".list:eq(" + t.index + ")");
					switch (index) {
						case 0:
							t.sortType = "sortListAuthority";
							t.sortNewType = 5;
							break;
						case 1:
							t.sortType = "publishTime";
							t.sortNewType = 2;
							break;
						case 2:
							t.sortType = "browse";
							t.sortNewType = 4;
							break;
						case 3:
							t.sortType = "reviewNum";
							t.sortNewType = 3;
							break;
					}

					$(this).find("div").addClass("on");                 // 选中此选项卡
					$(this).siblings().find("div").removeClass("on");
					t.sortContainer.find(".list:eq(" + $(this).index() + ")").show().siblings().hide();  // 显示内容区
					t.pageContainer.find(".pagination:eq(" + t.index + ")").show().siblings().hide();
					if ($(this).attr("loaded") == "false"
						|| $(this).attr("currentParamIndex") != controller.currentParamIndex) {    // 此页未加载 或参数有变化的话

						controller.sort.sortTab.attr("pageIndex", 1);
						controller.query();
					}

				});
			});

			if (controller.sort.sortTypeIndex) {
				tabs.filter(":eq(" + controller.sort.sortTypeIndex + ")").click();
			}
		}
	};
	/**
	 * 翻页调的函数
	 * @param pageclickednumber
	 */
	var pageClick = function (pageclickednumber) {
		controller.sort.sortTab.attr("pageIndex", pageclickednumber);
		controller.query();
	};

	/**
	 * 查询
	 */
	controller.query = function () {
		var t = this;
		clearTimeout(t.time);
		t.time = setTimeout(function () {
			var sortTab = t.sort.sortTab;
			var sortTabContent = t.sort.sortTabContent;
			var index = t.sort.index;
			var param = t.downSelector.getParam();
			var pageIndex;
			var hasParam = false, hasKeyword = false;
			if (param.types || param.sources || param.tags) {
				hasParam = true;
			}
			if (sortTab.attr("pageIndex") == "" || typeof sortTab.attr("pageIndex") == "undefined") {
				pageIndex = 1;
			} else {
				pageIndex = sortTab.attr("pageIndex");
			}


			var author = $.trim(t.search.keyInput.val());
			if (author != "在结果中搜索如作者名") {
				if (author.length > 0) {
					if (t.keyword != author) {
						pageIndex=1;
						controller.currentParamIndex++;
						t.keyword = author;
					}
					param = $.extend(param, {author: author,searchParam:author});
					hasKeyword = true;
				}
			}

			param = $.extend(param, {
				order: t.sort.sortType,
				sortType: t.sort.sortNewType,
				pageIndex: pageIndex,
				sourceStr: param.sourceStr,
				pageSize: t.pageSize,
				attUseFlag: 8,
				logoUseFlag: 4,
				scene: 3
			});
			if(t.mediaType=="video"){
				param.useFlag = 3;
			}
			comm.LightBox.showloading();        // TODO
			sortTabContent.find("ul").empty();
			$.ajax({
				url: PC_CALL+"resources/search/search_list/",
				data: param,
				type: "POST",
				dataType: "json",
				success: function (data) {
					comm.LightBox.hideloading();   // TODO
					if (data && data != null) {
						var existData = false, dataJson;
						if (data.responseObject) {  //   以防万一线上接口回滚---新数据
							if (data.responseObject.responseStatus && data.responseObject.responseData && data.responseObject.responseData.data_list.length > 0) {
								existData = true;
								dataJson = data.responseObject.responseData;
								t.modifyNewData(dataJson);
							}
						} else {// 以防万一线上接口回滚 --旧数据
							if (data.dataJson.rows.total > 0) {         // 12-15日搜索优化备份，以备将来回滚
								existData = true;
								dataJson = data.dataJson;
								t.modifyData(dataJson);
							}
						}

						if (existData) {     // 有数据
							var html = template.process({items: dataJson.data_list});
						
							sortTabContent.find("ul").html(html + "<div class='clear'></div>");
							$(".Ev-ContentA a").on("click", function(e){
								var href = "/pages/personal/home.html?cid="+$(this).attr("href");
                                g_sps.jump(null,href);
								return false;
							});
							sortTabContent.find(">li:last").css("border-bottom", "none");
							$(".list_cont_list").show();
							$(".no_find").hide();
							
							//延迟加载
							sortTabContent.find("img").lazyload({
								effect: "fadeIn",
								event: "scroll"
							});

							$(".page-container > .pager:eq(" + index + ")").show().pager({
								pagenumber: dataJson.pageIndex,
								pagecount: dataJson.pageCount,
								buttonClickCallback: pageClick
							});
						} else { 							        // 若无数据
							t.noResultShow(sortTabContent, hasKeyword, hasParam, index);
						}
						/*if (data.dataJson.rows.total > 0) {         // 12-15日搜索优化备份，以备将来回滚
						 var dataJson = data.dataJson;

						 t.modifyData(dataJson);

						 var html = template.process({items: dataJson.rows.items});

						 sortTabContent.find("ul").html(
						 html + "<div class='clear'></div>"
						 );
						 sortTabContent.find(">li:last").css("border-bottom", "none");
						 $(".list_cont_list").show();
						 $(".no_find").hide();

						 //延迟加载
						 sortTabContent.find("img").lazyload({
						 effect: "fadeIn",
						 event: "scroll"
						 });

						 $(".page-container > .pager:eq(" + index + ")").show().pager({
						 pagenumber: dataJson.rows.pageIndex,
						 pagecount: dataJson.rows.pageCount,
						 buttonClickCallback: pageClick});
						 } else {          // 若无数据
						 t.noResultShow(sortTabContent,hasKeyword,hasParam,index);
						 }*/
					} else {          // 若无数据
						t.noResultShow(sortTabContent, hasKeyword, hasParam, index);
					}

					// 设置暂存参数
					sortTab.attr("loaded", "true");  // 已加载
					sortTab.attr("currentParamIndex", controller.currentParamIndex);   // 当前参数 版本号 切换选项卡时判断参数是否有变，
				}
			});
		}, 300);

	};
	controller.noResultShow = function (sortTabContent, hasKeyword, hasParam, index) {
		var t = this;
		sortTabContent.find("ul").empty();
		$(".list_cont_list").hide();
		if (hasKeyword) {             // 有关键词
			$(".no_find .with-param,.no_find .no-param").find("a").text(t.search.keyInput.val());
			$(".no_find .no-keyword").hide();
			if (hasParam) {   // 有参
				$(".no_find .with-param").show();
				$(".no_find .no-param").hide();
			} else {  // 无参
				$(".no_find .with-param").hide();
				$(".no_find .no-param").show();
			}
		} else {                    // 无关键词
			$(".no_find .with-param").hide();
			$(".no_find .no-param").hide();
			$(".no_find .no-keyword").show();
		}

		$(".no_find").show();

		$(".page-container .pager").hide();
	};
	/**
	 * 修改数据
	 * @param dataJson
	 */
	controller.modifyData = function (dataJson) {
		var t = this;
		var item, obj;
		for (var i = 0; i < dataJson.rows.items.length; i++) {
			item = dataJson.rows.items[i];
			item.toUrl = dataJson.rows.items[i].toUrl;

			if (item.categroy)
				item.img = item.categroy == "doc" ? "//modules.allinmd.cn/list-video-doc-case-topic/images/loading/110_150.jpg" : "//modules.allinmd.cn/list-video-doc-case-topic/images/loading/225_150.jpg";

			if (item.summay != null && item.summay != "" && typeof item.summay != "object") {
				item.summay = item.summay.htmlEncode();
			} else {
				item.summay = '';
			}
			if (item.pD && typeof item.pD != "object") {

			} else {
				item.pD = '';
			}
			if (item.pYM && typeof item.pYM != "object") {
			} else {
				item.pYM = '';
			}
			var imgUrl = '';
			if (item.categroy && item.categroy == "doc") {
				item.typeClass = "doc";
				item.content = "";
				item.browse = "阅读：" + item.browse;
				if (dataJson.docAttList) {
					var docList = dataJson.docAttList;
					for (var m = 0; m < docList.length; m++) {
						obj = docList[m];
						if (obj.docId == item.id) {
							imgUrl = obj.docAttUrl;
							item.width = obj.docAttWidth;
							item.height = obj.docAttHeight;
							if (item.width == "225") {
								item.typeClass = "video";
							}
						}
					}
				}
			} else if (item.categroy && item.categroy == "video") {
				item.typeClass = "video";
				item.content = "";
				item.browse = "播放：" + item.browse;
				if (dataJson.videoAttList) {
					var videoList = dataJson.videoAttList;
					for (var j = 0; j < videoList.length; j++) {
						obj = videoList[j];
						if (obj.videoId == item.id) {
							imgUrl = obj.videoAttUrl;
							item.width = obj.videoAttWidth;
							item.height = obj.videoAttHeight;
						}
					}
				}

			} else if (item.categroy && item.categroy == "topic") {
				if (item.title) {
					item.title = item.title;
				} else if (!item.title && item.summay) {
					item.title = item.summay.substring(0, 20);
				} else if (!item.title && !item.summay) {
					item.title = "看图讨论";
				}

				item.typeClass = "video";
				item.content = "讨论：";
				item.browse = "阅读：" + item.browse;
				if (dataJson.topicAttList) {
					var topicList = dataJson.topicAttList;
					for (var k = 0; k < topicList.length; k++) {
						obj = topicList[k];
						if (obj.topicId == item.id) {
							imgUrl = obj.topicAttUrl;
							item.width = "225";
							item.height = "150";

						}
					}
				}

			} else if (item.categroy && item.categroy == "case") {
				item.typeClass = "video";
				item.content = "主诉：";
				item.browse = "阅读：" + item.browse;
				if (dataJson.caseAttList) {
					var caseList = dataJson.caseAttList;
					for (var n = 0, cl = caseList.length; n < cl; n++) {
						obj = caseList[n];
						if (obj.caseId == item.id) {
							imgUrl = obj.caseAttUrl;
							item.width = "225";
							item.height = "150";
						}
					}
				}
			}
			item.imgUrl = imgUrl;
		}
	};

	/**
	 * 修改新版数据 12-15  solr
	 * @param dataJson
	 */
	controller.modifyNewData = function (dataJson) {
		var t = this;
		var item, obj;
		var rows = dataJson.data_list;
		dataJson.pageIndex = dataJson.page_no;
		dataJson.pageCount = Math.floor(dataJson.total_count / t.pageSize) + 1;
		for (var i = 0; i < rows.length; i++) {
			item = rows[i];
			item.playTime = "";
			item.content = "";
			item.source = "";
			item.pYM = "";
			item.img = t.mediaType == "doc" ? "//modules.allinmd.cn/list-video-doc-case-topic/images/loading/110_150.jpg" : "//modules.allinmd.cn/list-video-doc-case-topic/images/loading/225_150.jpg";
			if (t.mediaType == "case") {
				item.content = "主诉：";
				item.typeClass = "video";
				item.author = item.case_customer_auth.lastName + item.case_customer_auth.firstName;
				item.title = item.case_baseinfo.caseName;
				item.summay = item.case_baseinfo.mainNarrate;
				item.browse = "阅读：" + item.case_baseinfo.browseNum;
				item.publishTime = item.case_baseinfo.publishTime;
				item.toUrl =  item.case_baseinfo.pageStoragePath;
				item.imgUrl = item.case_attachment.attUrl;
				item.reviewNum = item.case_baseinfo.reviewNum;
				item.publishTime = item.case_baseinfo.publishTime.split(" ")[0];
			}
			if (t.mediaType == "doc") {
				item.typeClass = "doc";
				item.source = item.customer_doc.docSource;
				item.title = item.customer_doc.docName;
				item.author = item.customer_auth.lastName + item.customer_auth.firstName;
				item.summay = item.customer_doc.docAbstract;
				item.browse = "阅读：" + item.customer_doc.browseNum;
				item.publishTime = item.customer_doc.createTime;
				item.toUrl =  item.customer_doc.pageStoragePath;
				item.imgUrl = item.cms_doc_attachment_logo.docAttUrl;
				item.reviewNum = item.customer_doc.reviewNum;
				item.publishTime = item.customer_doc.publishTime.split(" ")[0];
			}
			if (t.mediaType == "video") {
				item.typeClass = "video";
				item.author = item.cms_video.videoAuthor;
				item.title = item.cms_video.videoName;
				item.summay = item.cms_video.videoAbstract;
				item.source = item.cms_video.videoSource;
				item.browse = "播放：" + item.cms_video.playNum;
				item.publishTime = item.cms_video.publishTime;
				item.toUrl = item.cms_video.pageStoragePath;
				item.imgUrl = item.cms_video_attachment_logo.videoAttUrl;
				item.reviewNum = item.cms_video.reviewNum;
				item.publishTime = item.cms_video.publishTime.split(" ")[0];
				item.playTime = item.cms_video.playTime;
			}
			if (t.mediaType == "topic") {
				item.typeClass = "video";
				item.content = "讨论：";
				item.title = item.cms_topic.topicName;
				item.author = item.cms_topic_customer_auth.lastName + item.cms_topic_customer_auth.firstName;
				item.summay = item.cms_topic.topicDiscuss;
				item.browse = item.cms_topic.browseNum;
				item.browse = "阅读：" + item.cms_topic.browseNum;
				item.publishTime = item.cms_topic.publishTime;
				item.toUrl = item.cms_topic.pageStoragePath;
				item.imgUrl = item.cms_topic_attachment.topicAttUrl;
				item.reviewNum = item.cms_topic.reviewNum;
				item.publishTime = item.cms_topic.publishTime.split(" ")[0];
			}
			if (item.summay != null && item.summay != "" && typeof item.summay != "object") {
				//item.summay = item.summay.htmlEncode();
			} else {
				item.summay = '';
			}
			dataJson.data_list[i] = item;
		}
	};

	controller.init = function () {
		this.search.init();
		this.downSelector.init();
		this.sort.init();
	};

	controller.init();

};