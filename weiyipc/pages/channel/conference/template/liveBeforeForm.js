//直播前表单填写	
$(function() {

	$("#evNaviTab li").live("click",function(){
		_this = $(this);
		if($(_this).text() == "视频直播"){
			user.login({
				callback : function() {
					liveCheck($(_this).find("span").attr("link"));
					return false;
				},
				scene:privilegeSceneConst.eSceneTypeLiveShow
			});
		}
	})
})

function save(liveHref) {
	liveHref = liveHref;
	var firstName = $("#firstName").val();
	var lastName = $("#lastName").val();
	var company = $("#company").val();

	var arrList = [];
	$.each($("#proFieldshow>li"), function(i, el) {
		var id = $(el).attr("rel");
		var text = $(el).find("b").text();
		arrList.push(id + "_" + text);
	})
	var areasExpertise = arrList.toString();
	
	//验证
	if(getByteLen($.trim(firstName)) > 50){
		alert("姓氏最长50个字");
		return false;
	}else if(getByteLen($.trim(lastName)) > 50){
		alert("名字最长50个字" );
		return false;
	}else if(getByteLen($.trim(company)) > 200){
		alert("医院最长200个字");
		return false;
	}
	
	if ($.trim(firstName).length == 0){
		alert("请填写你的姓氏" );
		return false;
	}else if($.trim(lastName).length == 0){
		alert("请填写你的名字");
		return false;
	}else if($.trim(company).length == 0){
		alert("请填写你的医院名称");
		return false;
	}else if($.trim(areasExpertise).length == 0) {
		alert("请选择你的学组");
		return false;
	}
	
	
	var params = {};
	params.paramJson = $.toJSON({
		firstName : lastName,
		lastName : firstName,
		company : company,
		areasExpertise : areasExpertise
	});

	$.ajax({
		url : PC_CALL+"customer/auth/save/",
		type : "post",
		data : params,
		success : function(data) {
			if (data.responseObject.responseStatus) {
				location.href = liveHref;
			} else {
				alert("请正确填写各项信息！");
			}
		}
	})
}

function liveCheck(liveHref){
	var template ="<div style=\"position:fixed;left:0;top:0;z-index:3;width:100%;background:#000;filter:alpha(opacity=50);-moz-opacity:0.5;opacity:0.5;height:100%;\"></div>"+ 
	"<div  id=\"showAddInfo\" style=\"position:absolute;z-index:3;\">"
		+ "<div class=\"live_tc\">"
		+ "<div class=\"live_tc_t\">"
		+ "<div class=\"tishi_xx\">添加个人信息</div>"
		+ "</div>"
		+ "<div class=\"live_tc_c\">"
		+ "<div class=\"tc_shuru_xx\">"
		+ "<div class=\"shuru01\"><div class=\"shuru_text\">姓名</div><div class=\"name_input_live\"><input type=\"text\" id=\"firstName\" placeholder=\"姓氏\" /></div><div class=\"name_input_live\"><input id=\"lastName\" type=\"text\" placeholder=\"名字\" /></div><div class=\"clear\"></div></div>"
		+ "<div class=\"shuru01\"><div class=\"shuru_text\">医院</div><div class=\"shuru_input\"><input id=\"company\" type=\"text\" /></div><div class=\"clear\"></div></div>"
		+ "<div class=\"shuru01\">"
		+ "<div class=\"shuru_text\">学组</div>"
		+ "<div class=\"shuru_select\" style=\"overflow:auto;\">"
		+ "<div class=\"proFieldnav\" style=\"width:auto;\">	"
		+ "<ul id=\"proFieldshow\">"
		+ "</ul>"
		+ "</div>"
		+ "</div>"
		+ "<div class=\"clear\"></div>"
		+ "</div>"
		+ "<div class=\"tc_but_bottom\" onclick=\"save('"+liveHref+"');\"><img src=\"//img00.allinmd.cn/conference/enter_live.png\" /></div>"
		+ "<div id=\"proFieldMenu\" class=\"xmenu\" style=\"display: none;\">"
		+ "<div class=\"select-info\">	"
		+ "<label class=\"top-label\" style=\"line-height: 20px;\">已选职位：</label>"
		+ "<ul>"
		+ "</ul>"
		+ "<a  name=\"menu-confirm\" href=\"javascript:void(0);\" class=\"a-btn\">"
		+ "<span class=\"a-btn-text\">确定</span>"
		+ "</a> "
		+ "</div>"
		+ "<dl>"
		+ "</dl>"
		+ "</div>"
		+ "</div>"
		+ "</div>"
		+ "<div class=\"live_tc_b\"></div>" + "</div>"

$
		.ajax({
			url : PC_CALL+"customer/auth/getAttendVideoStatus/",
			type : "post",
			data : {},
			success : function(data) {
				if (!data.responseObject.responseStatus) {
					$("body").prepend(template);
					//格式化样式
					$(".proFieldnav").css("border", "none");
					var cHeight = $(window).height();
					var sHeight = $("#showAddInfo").height();
					var cWidth = $(window).width();
					var sWidth = $("#showAddInfo").width();

					$("#showAddInfo").css("top", cHeight / 2 - sHeight / 2)
							.css("left", cWidth / 2 - sWidth / 2);

					var data = data.responseObject.responseData.data_list;
					if(isEmptyObject(data)){
						$("#firstName").val('');
						$("#lastName").val('');
						$("#company").val('');
						var arrList = [''];
					}else{
						$("#firstName").val(data.lastName);
						$("#lastName").val(data.firstName);
						$("#company").val(data.company);
						var arrList = data.areasExpertise.split(",");
					}
					
					if(arrList[0].length!=0){
						var html = "";
						$.each(arrList,function(i, el) {
								kv = el.split("_");
											html += "<li rel=\""
													+ kv[0]
													+ "\" class=\"current\">"
													+ "<div class=\"link_l_bg\"></div><div class=\"link_c_bg\"><b>"
													+ kv[1]
													+ "</b><p>×</p></div><div class=\"link_r_bg\"></div></li>";
										})
						$("#proFieldshow").html(html);
					}	

					$(".proFieldnav")
							.xMenu(
									{
										width : 400,
										eventType : "click", //事件类型 支持focus click hover
										dropmenu : "#proFieldMenu",//弹出层
										dataUrl : PC_CALL+"commdata/getAreaExpertise/"//数据存放
									});
				}else{
					location.href = liveHref;
				}
			}
		});
}

//字数检测
function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
			len += 2;
		else
			len += 1;
	}
	return len;
}
