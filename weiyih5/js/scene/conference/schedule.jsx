$(function () {
	var Common = {};

	comm.getpara = function ()//获取参数的函数
	{
		var url = document.URL;
		var param = {};
		var str, item;
		if (url.lastIndexOf("?") > 0) {

			str = url.substring(url.lastIndexOf("?") + 1, url.length);
			if (url.lastIndexOf("#") > 0) {
				str = str.split("#")[0];
			}
			var arr = str.split("&");
			for (var i = 0; i < arr.length; i++) {
				item = arr[i].split("=");
				param[item[0]] = decodeURI(item[1]);
			}
		}
		return param;
	};


	var TempCache = {
		cache: function (value) {
			localStorage.setItem("EasyWayTempCache", value);
		},
		getCache: function () {
			return localStorage.getItem("EasyWayTempCache");
		},
		setItem: function (key, value) {
			localStorage.setItem(key, value);
		},
		getItem: function (key) {
			var item = localStorage.getItem(key);
			if (key && key == "fromPage") // 来源页面只能获取一次
				localStorage.removeItem(key);
			return item;
		},
		removeItem: function (key) {
			return localStorage.removeItem(key);
		},
		clear: function () {
			// 清除缓存
			/* storage = window.localStorage;
			 while (storage.key(storage.length - 1).indexOf(keyword) === 0) {
			 storage.removeItem(storage.key(storage.length - 1))
			 }*/
			localStorage.clear();
		}
	};
	if (typeof comm.getpara() != null && !$.isEmptyObject(comm.getpara())) {
		var conId = comm.getpara().conId;
		var conSubId = comm.getpara().conSubId;
		var conSubName = comm.getpara().conSubName;
		$(".new_case_title").text(conSubName.length > 11 ? conSubName.substring(0, 12) : conSubName);
		var nickname;
		if (TempCache.getItem("email") != "" && TempCache.getItem("email") != null) {
			nickname = TempCache.getItem("email");
		} else {
			if (TempCache.getItem("nickname") != "" && TempCache.getItem("nickname") != null) {
				nickname = TempCache.getItem("nickname");
			} else {
				nickname = "游客" + Math.floor(Math.random() * 10000 % 10000);
			}
		}

		var result = null;
		$.ajax({
			url: "/mcall/conference/index/getAgendaVideoList/",
			type: "POST",
			dataType: "json",
			data: {paramJson: $.toJSON({pageIndex: 1, pageSize: 10000, conSubId: conSubId, conId: conId})},
			async: false,
			success: function (data) {
				if (data != null && data != undefined && data.responseObject && data.responseObject.responseStatus) {
					result = data.responseObject;
				}
			}
		});

		var data = result.responseMessage;
		var info = result.responseData.conIntro;

		/*React组件*/
		var NavBar = React.createClass({
				getInitialState: function () {
					var t = this;
					var data = commdata.getData("getAgendaVideoList", {
						pageIndex: 1,
						pageSize: 10000,
						conSubId: conSubId,
						conId: conId
					});
					var dates = getDateArr(data);
					return {data: data, dateArr: dates, video: t.getVideo(0, data, dates)};
				},
				getVideo: function (i, data, dates) {
					var t = this;
					var date = dates[i].date;
					var videoArr = [], temp;

					for (var j = 0; j < data.length; j++) {
						temp = new Date(data[j].startTime.replace(/-/g, "/"));
						if (temp > date && temp < add(date, 1)) {
							videoArr.push(data[j]);
						}
					}
					return videoArr;
				},
				componentDidMount: function () {

					var t = this;
					//	console.log(",------mount");
					t.visualRange = $("#m_nav_list");
					t.oUl = t.visualRange.find("ul");
					var width, conWidth, ulWidth, ulHeight;
					var l = t.state.dateArr.length;
					conWidth = t.visualRange.width();
					width = l > 4 ? conWidth / 4.7 : conWidth / l;
					ulWidth = width * l;
					t.oUl.find("li").width(width);
					t.oUl.width(ulWidth);
					t.visualRange.height(t.oUl.find("li").outerHeight());

					t.visualRangeWidth = t.visualRange.width(); // 可视区域宽度
					t.widthDif = t.visualRangeWidth - ulWidth; // 相差长度，正数为超出，负数为不需要滚动

					var index = t.getDefaultDay();

					t.setState({video: this.getVideo(index, t.state.data, t.state.dateArr), index: index});
					t.bindClick();
					t.bindDrag();

					var newLeft = -(t.state.index - 1) * t.oUl.find("li:eq(0)").width();
					if (t.state.index > 0) {
						t.oUl.animate({"left": Math.max(t.widthDif, newLeft) + "px"});
					}
				},
				/*更新后 */
				componentDidUpdate:
					function () {
					var t = this;
					//	console.log("componentDidUpdate");
					var liWidth = t.oUl.find("li:eq(0)").width();
					var newLeft = -(t.state.index - 0.5) * liWidth;
					//debugger;

					/*if (t.state.index > 0) {
					 t.oUl.animate({"left": Math.max(t.widthDif, newLeft) + "px"});
					 }*/
					if (t.state.dateArr.length > 4) {
						if (t.state.index < 3) {
							t.oUl.animate({"left": "0px"});
						} else {
							if (t.state.index > t.state.dateArr.length - 4) {
								t.oUl.animate({"left": -(t.state.dateArr.length - 4.7) * liWidth + "px"});
							}else{
								t.oUl.animate({"left": -(t.state.index - 1) * liWidth + "px"});
							}
						}
					}

				},
				//获取默认应显示的日程
				getDefaultDay: function () {
					var t = this;
					var flag = null;
					var today = new Date();
					var arr = t.state.dateArr;

					for (var i = 0; i < arr.length; i++) {
						if (!flag) {
							if (arr[i].date > today) { // 大于今天的某个直播
								flag = i;
								break;
							}
						}
					}
					return flag || (arr.length - 1);
				}

				,
				bindClick: function () {
					//onTouchStart={t.changeVideo}
					var t = this;
					t.oUl.find("li").on("vclick", function (e) {
						t.changeVideo(e);
					});
				}
				,
				/*绑定滑动效果*/
				bindDrag: function () {
					var t = this;
					var startMX, startMY, startOUlX;

					t.oUl.on("vmousedown", function (e) {
						//console.log("vmousedown");

						t.oUl.off("vclick");
						startMX = e.pageX;
						startMY = e.pageY;
						startOUlX = parseInt(t.oUl.css("left"));

						t.oUl.on("vmousemove", function (e) {
							//	console.log("vmousemove");
							var newMX = e.pageX, newMY = e.pageY, mx = newMX - startMX;
							var nowx = mx + startOUlX;

							if (nowx < 0 && (nowx > t.widthDif)) {

								t.oUl.css("left", nowx + "px");
							}
							if (nowx >= 0) {
								t.visualRange.addClass("cantmove-left");
							}

							if (nowx <= t.widthDif) {
								t.visualRange.addClass("cantmove-right");
							}

						});
					});

					t.oUl.on("selectstart", function () {
						return false;
					});

					t.oUl.on("vmouseup touchstop", function () {
						t.oUl.off("vmousemove vclick");
						t.visualRange.removeClass("cantmove-left").removeClass("cantmove-right");
					});
				}
				,
				/*切换日期*/
				changeVideo: function (event) {
					var t = this;
					var i = event.target.getAttribute("data-index");
					if (i) {
						t.setState({video: this.getVideo(i, this.state.data, this.state.dateArr), index: i});
					}
					event.defaultPrevented;
				}
				,
				render: function () {
					var t = this;
					var l = this.state.dateArr.length;
					var list, mList;

					if (l > 0) {

						list = this.state.dateArr.map(function (val) {
							var time = val.date.getMonth() + 1 + "月" + val.date.getDate() + "日";
							return (
								<li ref="navBar" className={t.state.index==val.index?"on":""} data-index={val.index}>
									<div data-index={val.index}>{time}</div>
								</li>                  //  onTouchStart={t.changeVideo}
							);
						});

						mList = this.state.video.map(function (val) {
							var url, time, lecturer, conName, icon;
							if (val.videoUrl != "" && !$.isEmptyObject(val.videoUrl)) {
								url = "/html/m" + val.videoUrl;
							} else {
								url = "javascript:;";
							}
							time = val.startTime.split(" ")[1].substr(0, 5);
							lecturer = val.lecturer.length > 8 ? (val.lecturer.substring(0, 8) + '...') : val.lecturer;
							conName = val.conName.length > 80 ? (val.conName.substring(0, 80) + '...') : val.conName;
							icon = (val.videoId != undefined && val.videoId != "") ?
								<img src="//img50.allinmd.cn/meeting/bofang_icon.png"/> : "";
							return (
								<div className="m_d_list_floor">
									<div className="m_d_list_l"></div>
									<a href={url} data-ajax="false">
										<div className="m_d_list_r">
											<div className="m_d_list_r_border">
												<div className="m_d_list_r_position"></div>
												<div className="m_d_l_cont">
													<div className="m_d_l_cont_t">
														<div className="m_d_l_cont_t_l">时间：{time}<span
															className="m_d_l_cont_t_lec">主讲人：{lecturer}</span>
														</div>
														<div className="m_d_l_cont_t_r">
															<div className="bofang">{icon}</div>
														</div>
													</div>
													<div className="m_d_l_cont_b">{conName}</div>
												</div>
											</div>
										</div>
									</a>
								</div>
							);
						})
					}

					return (
						<div>
							<div id="m_nav_list" className="m_d_nav">
								<ul className="fix">
									{list}
								</ul>
							</div>

							{l>0?<div className="m_d_list">{mList}</div>:<div>本会场暂无相关信息，请检查</div>}
						</div>
					);
				}
			}
		);

		React.render(
			<NavBar/>,
			document.getElementById("m_list")
		);

	} else {
		alert("无相关数据");
	}

//按时间分组
	function getDateArr(data) {
		var arr = [], d, datearr;
		for (var i = 0; i < data.length; i++) {
			datearr = data[i].startTime.split(" ");

			if (data[i].startTime != "" && !$.isEmptyObject(data[i].startTime)) {
				d = new Date("" + datearr[0].replace(/-/g, "/"));
				arr.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
			}
		}
		arr = unique(arr);
		var tempArr = [];
		for (var j = 0; j < arr.length; j++) {
			tempArr.push({index: j, date: arr[j]});
		}
		return tempArr;
	}

//数组去重
	function unique(arr) {
		var ret = [];
		var hash = {};

		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			var key = typeof(item) + item;
			if (hash[key] !== 1) {
				ret.push(item);
				hash[key] = 1
			}
		}

		return ret
	}


	function add(d, n) {
		if (d == "Invalid Date") {
			alert("非日期");
			return;
		}
		//当前日期的毫秒数 + 天数 * 一天的毫秒数
		var n = d.getTime() + 1 * 24 * 60 * 60 * 1000;
		var result = new Date(n);
		//alert(result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate());
		return result;
	}


	function buildStr(list) {
		var str = '<ul class="time-list">';
		var item, url;
		for (var j = 0, n = list.length; j < n; j++) {
			item = list[j];
			if (item.videoUrl != "" && !$.isEmptyObject(item.videoUrl)) {
				url = "/html/m" + item.videoUrl;
			} else {
				url = "#";
			}
			str += '<a  href="' + url + '" data-ajax="false"><li>' +
				'<div class="time">' + item.startTime.split(" ")[1].substr(0, 5) + '</div>' +
				'<div class="bg-time-arrow"></div>' +
				'<div class="title ' + ((item.videoId != undefined && item.videoId != "") ? "play" : "") + '"><div class="' + ((item.videoId != undefined && item.videoId != "") ? "video" : "") + '">' +
				(($.trim(item.lecturer) != "" && $.trim(item.lecturer) != null) ? '<span class="author">' + (item.lecturer.length > 80 ? (item.lecturer.substring(0, 80) + '...') : item.lecturer) + '：</span>' : "") +
				'<span class="grey" videoKey="' + (item.videoId != undefined ? item.videoId : "") + '">' +
				(item.conName.length > 80 ? (item.conName.substring(0, 80) + '...') : item.conName) +
					// ((item.videoId!=undefined && item.videoId!="")?'<img src="/images/img50010.png" alt="" style="width:1.8em;"/>':'') +
				'</span>' +
				'</div></div>' +
				"<div class='clear'></div>" +
				'</li></a>';
		}
		str += "</ul>";
		return str;
	}


})
;

/**
 * 微信分享
 */
var resourceCount = 0;
