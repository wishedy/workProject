/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/5/25.
 */
$(function(){
    /**
     * 翻页调的函数
     * @param pageclickednumber
     */
    var pageClick = function(pageclickednumber) {
        doctorList.sort.sortTab.attr("pageIndex",pageclickednumber);
        doctorList.query();
    };
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
    var selectorData = {
        options_1:["全部","视频","文库"],
        options_2:[
            {tagId:"2",tagName:"关节",children:[
                {tagId:"10",tagName:"人工髋关节置换"},
                {tagId:"11",tagName:"人工髋关节翻修"},
                {tagId:"12",tagName:"保髋治疗"      },
                {tagId:"13",tagName:"人工膝关节置换"},
                {tagId:"14",tagName:"人工膝关节翻修"},
                {tagId:"15",tagName:"保膝治疗"}
            ]
            },
            {tagId:"3",tagName:"足踝",children:[{tagId:"16",tagName:"足踝"}]
            },
            {tagId:"4",tagName:"四肢矫形",children:[
                {tagId:"17",tagName:"手"          },
                {tagId:"18",tagName:"腕"          }
            ]
            },
            {tagId:"5",tagName:"小儿骨科",children:[
                {tagId:"19",tagName:"髋"          },
                {tagId:"20",tagName:"脊柱"        },
                {tagId:"21",tagName:"运动医学"    },
                {tagId:"22",tagName:"创伤"        },
                {tagId:"23",tagName:"上肢"        },
                {tagId:"24",tagName:"足踝"        }
            ]
            },
            {tagId:"6",tagName:"肘&肩",children:[
                {tagId:"25",tagName:"肘"          },
                {tagId:"26",tagName:"肩"          }]
            },
            {tagId:"7",tagName:"脊柱",children:[
                {tagId:"27",tagName:"颈椎"        },
                {tagId:"28",tagName:"腰椎"        },
                {tagId:"29",tagName:"脊柱侧凸"    },
                {tagId:"30",tagName:"脊髓"        },
                {tagId:"31",tagName:"脊柱创伤"    },
                {tagId:"32",tagName:"脊柱肿瘤"    }]
            },
            {tagId:"8",tagName:"运动医学",children:[
                {tagId:"33",tagName:"肘"          },
                {tagId:"34",tagName:"足踝"        },
                {tagId:"35",tagName:"髋"          },
                {tagId:"36",tagName:"膝"          },
                {tagId:"37",tagName:"肩"          },
                {tagId:"38",tagName:"腕关节镜"    }]
            },
            {tagId:"9",tagName:"创伤",children:[
                {tagId:"39",tagName:"髋与骨盆"    },
                {tagId:"40",tagName:"下肢"        },
                {tagId:"41",tagName:"脊柱"        },
                {tagId:"42",tagName:"上肢"        }]
            },
            {tagId:"816",tagName:"骨肿瘤",children:[  ]
            },
            {tagId:"817",tagName:"康复",children:[  ]
            },
            {tagId:"818",tagName:"骨质疏松",children:[  ]
            },
            {tagId:"819",tagName:"基础",children:[  ]
            },
            {tagId:"820",tagName:"显微修复",children:[  ]
            },
            {tagId:"821",tagName:"中西医结合",children:[  ]
            }
        ],
        options_4:["WOA","CAOS","COA","JOA","OrthoEvidence","AAOS","ASIA"],

        options_5:{
            "all":["手术视频","课程视频","会议视频","专家访谈","教材","指南","期刊","讲义"],
            "video":["手术视频","课程视频","会议视频","专家访谈"],
            "doc":["教材","指南","期刊","讲义"],
            "topic":["专业话题","随便聊聊"]
        }
    };
    var doctorList={};
    doctorList={
        path:{
            province:PC_CALL+"comm/data/region/json_list/",
            docList:PC_CALL+"customer/auth/getDoctorList/"
        },
        init:function(){
            var t=this;
            t.downSelectorContainer={};
            t.selectedOptionsContainer={};
            t.timeout={};
            t.pageNum=1;
            //mediaType: options.mediaType, //载体类型,后选值:ALL,VIDEO,DOC
            t.selectedItems=[];
            t.currentParamIndex = 0;   // 参数索引
            t.selectedOptionsContainer = $("#selectedOptions");
            t.downSelectorContainer = $("#downSelector").find(".down-select-item");
            t.getHrefParam();
            t.setupOptions(1, t.getData(2), "vertical");//初始化下拉数据
            t.getProvince();
            t.bindSelectorHover();      // 下拉选项的鼠标经过效果
            t.bindSpecs();
            t.bindCity();
            t.sort.init();
            t.query();
        },
        //获取地区
        getProvince:function(){
            var t=this;
            var html="";
            $.ajax({
                url: t.path.province,
                dataType:"json",
                async: false,
                type:"POST",
                data:{treeLevel:2,pageIndex:1,pageSize:100},
                success:function(data){
                    if(data.responseObject.responseData.data_list){
                        $.each(data.responseObject.responseData.data_list,function(i,val){
                            html += "<li><a href='javascript:void(0)' regionId='"+val.regionId+"'>" + val.regionName + "</a></li>";
                        });
                        html+="<li class='last clear'></li>";
                        t.downSelectorContainer.eq(1).find("ul").empty().html(html);
                    }
                }
            });
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
                    rst =  arr;
                }
            } else {
                rst =  type ? selectorData["options_" + m][type]
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
            list = $.map(data, function (val) {
                var html;
                if (index == 1 || index == 2) {
                    html = "<li><a href='javascript:void(0)' tagId='" + val.tagId + "'>" + val.tagName + "</a></li>";
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

                    /*if (lis.find(".active").length > 0) {           // 若有选中的
                        t.setupOptions(2, t.getData(3, tagId), "vertical");
                    } else {                                            // 若无选中的
                        t.setupOptions(2, t.getData(3), "vertical");
                    }
                    t.bindTags();*/

                    t.sort.sortTab.attr("pageIndex",1);
                    t.pageNum = 1;
                    t.currentParamIndex++;
                    t.query();

                });
            });
            t.bindLisHover(lis);

        },
        // 绑定地区
        bindCity: function () {
            var t = this;
            var lis = t.downSelectorContainer.eq(1).find(".options li:not(.last)");
            lis.each(function () {
                $(this).click(function () {
                    var el = $(this);
                    lis.find("a").removeClass("active");

                    var tagName = el.find("a").text();
                    var tagId = el.find("a").attr("regionId");

                    if (el.attr("select-status") == null ||       // 之前若没选中
                        el.attr("select-status") == "false") {
                        t.selectEl(el);
                        t.clearTag(3);

                        t.createSelectedItem(3, tagName, tagId);
                    } else {                                    // 之前已选中 清除掉专业及 标除   e
                        t.unSelectEl(el);
                        t.clearTag(3, tagName, tagId);
                    }

                    /*if (lis.find(".active").length > 0) {           // 若有选中的
                     t.setupOptions(2, t.getData(3, tagId), "vertical");
                     } else {                                            // 若无选中的
                     t.setupOptions(2, t.getData(3), "vertical");
                     }
                     t.bindTags();*/
                    t.sort.sortTab.attr("pageIndex",1);
                    t.pageNum = 1;
                    t.currentParamIndex++;
                    t.query();

                });
            });
            t.bindLisHover(lis);

        },
        // 选中后在下面添加查询关键词
        createSelectedItem: function (downType, keyName, tagId) {
            var t = this;
            var el = $(  '<li>' +
            '    <div class="list_select_success_text">'+ keyName +'</div>' +
            '    <div class="list_select_success_close close">' +
            '         <img src="//img00.allinmd.cn/list/list_close.png"/>' +
            '    </div>' +
            '    <div class="clear"></div>' +
            '</li>' );

            var item = {downType: downType, keyName: keyName, tagId: tagId ? tagId : "", el: el, clear: function () {
                this.el.remove();
                t.currentParamIndex++;
                t.clearDownSelector(this);
            }};
            item.el.find(".close").click(function () {
                t.clearTag(item.downType, item.keyName, item.tagId);
                t.sort.sortTab.attr("pageIndex",1);
                t.query();
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
                    //t.setupOptions(2, t.getData(3), "vertical");      // 重设标签
                    //t.bindTags();                                       // 重新绑定标签
                    if (item.downType == "2") { // 若为专业或者标签
                        item.clear();
                        toDelArr.push(i);
                    }
                } else if (downType == 3) {             // 若当前点击的是 地区
                    if (item.downType == "3") {         // 若是地区
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
        sort:{
            sortType: 1,
            sortTypeIndex: 0,
            sortContainer: $(".list_cont_list"),
            sortTab:$(".list_cont_list_nav").find("li:eq(0)"),
            sortTabContent:$(".list_cont_list .list:eq(0)"),
            pageContainer: $(".page-container"),
            index:0,    // 当前选中的选项卡顺序号 用以切换选项卡时关联
            init: function () {
                var t = this;
                t.sortContainer = $(".list_cont_list");
                var tabs = t.sortContainer.find(".list_cont_list_nav li");
                tabs.each(function (index) {
                    $(this).click(function () {
                        t.sortTab = $(this);
                        t.index = $(this).index();
                        t.sortTabContent =  $(".list_cont_list").find(".list:eq("+  t.index +")");
                        switch (index) {
                            case 0://活跃医师
                                t.sortType = 1;
                                break;
                            case 1://热门医师
                                t.sortType = 2;
                                break;
                        }

                        $(this).find("div").addClass("on");                 // 选中此选项卡
                        $(this).siblings().find("div").removeClass("on");
                        t.sortContainer.find(".list:eq(" + $(this).index() + ")").show().siblings().hide();  // 显示内容区
                        t.pageContainer.find(".pagination:eq("+ t.index +")").show().siblings().hide();
                        if($(this).attr("loaded")=="false"
                            || $(this).attr("currentParamIndex") != doctorList.currentParamIndex ){    // 此页未加载 或参数有变化的话

                            t.sortTab.attr("pageIndex",1);
                            doctorList.query();
                        }

                    });
                });

                if(t.sortTypeIndex){
                    tabs.filter(":eq(" + t.sortTypeIndex + ")").click();
                }
            }
        },
        getParam: function () {
            var t = this, tags = [], province = [];
            var param = {};

            var insertedIndex = -1;
            for (var i = 0, l = t.selectedItems.length; i < l; i++) {
                var item = t.selectedItems[i];
                switch (item.downType) {
                    case 2://专业
                        tags.push(item.tagId);
                        insertedIndex = i;
                        break;
                    case 3://地区
                        province.push(item.keyName);
                        insertedIndex = i;
                        break;
                }
            }

            if(tags.length>0){
                param.tagId  = tags.join(",")
            }
            if(province.length>0){
                param.province = province.join(",")
            }

            return param;
        },
        query : function () {
            var t = this;
            clearTimeout(t.time);
            t.time = setTimeout(function () {
                var sortTab = t.sort.sortTab;
                var sortTabContent = t.sort.sortTabContent;
                var index = t.sort.index;
                var param = t.getParam();
                var pageIndex;
                var hasParam = false,hasKeyword =false;
                if(param.province || param.tags){
                    hasParam = true;
                }
                if(sortTab.attr("pageIndex")=="" || typeof sortTab.attr("pageIndex")=="undefined"){
                    pageIndex = 1;
                }else{
                    pageIndex = sortTab.attr("pageIndex");
                }

                param = $.extend(param, {sortType : t.sort.sortType, logoUseFlag:3, pageIndex: pageIndex,pageSize :10});
                var params={};
                params.paramJson = $.toJSON(param);
                comm.LightBox.showloading();        // TODO
                sortTabContent.empty();
                $.ajax({
                    url: t.path.docList,
                    data: params,
                    type: "POST",
                    dataType: "json",
                    success: function (data) {
                        comm.LightBox.hideloading();   // TODO
                        if (data && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                            if (data.responseObject.responseData.data_list.length>0) {
                                var dataJson = data.responseObject.responseData.data_list;
                                var html="";
                                var arrHT=[];
                                count=0;
                                $.each(dataJson,function(i,val){
                                    count=val.count;
                                    doctor=val.customer_doctor;
                                    logoUrl=val.customer_att.logoUrl;
                                    name=doctor.last_name+doctor.first_name;
                                    medicalTitle=comm.strHandle.cutDoctorTitle(comm.cutLine(doctor.medical_title,"_",","))?"<span>"+comm.strHandle.cutDoctorTitle(comm.cutLine(doctor.medical_title,"_",","))+"</span>":"";
                                    company=doctor.company?comm.getStrLen(doctor.company,36):"";
                                    followNum=doctor.follow_people_num;
                                    fansNum=doctor.fans_num;
                                    trendsNum=doctor.trends_num;
                                    trends=val.customer_trends;
                                    trendsHtml="";
                                    if(trends){
                                        resourceName=trends.resourceName?comm.getStrLen("《"+trends.resourceName+"》",36):"";
                                        trendsHtml='<div class="new_dongtai"><p></p><span class="dt_text">最新动态：</span>'+trends.headerName+' <span class="dt_name_text"><a href="'+trends.resourceUrl+'" target="_blank">'+resourceName+'</a></span></div>';
                                    }
                                    var cId=doctor.customer_id;
                                    html='<div class="doctor_list">'+
                                    '<div class="doctor_list_cont">'+
                                    '<div class="doctor_l"><a href="/pages/personal/home.html?cid='+cId+'" target="_blank"><img src="//img10.allinmd.cn/default/65_65.jpg" data-original="'+logoUrl+'"/></a></div>'+
                                    '<div class="doctor_c">'+
                                    '<div class="doctor_name font_yahei"><a href="/pages/personal/home.html?cid='+cId+'" target="_blank">'+(name?comm.getStrLen(name,26):'')+'</a></div>'+
                                    '<div class="doctor_r follow_'+i+'"></div>'+
                                    '<div class="clear"></div>'+
                                    '<div class="doctor_hospital">'+medicalTitle+company+'</div>'+
                                    '<div class="info_jh">'+
                                    '<div class="info_gz" style="padding-left:0;">关注<span '+(followNum>0?'class="info_num"':'')+'>'+followNum+'</span></div>'+
                                    '<div class="info_gz">粉丝<span '+(fansNum>0?'class="info_num"':'')+'>'+fansNum+'</span></div>'+
                                    '<div class="info_gz" style="border:none;">动态<span '+(trendsNum>0?'class="info_num"':'')+'>'+trendsNum+'</span></div>'+
                                    '<div class="clear"></div>'+
                                    '</div>'+
                                    '</div>'+

                                    '<div class="clear"></div>'+
                                    '</div>'+trendsHtml+
                                    '</div>';


                                    if(cId == $("#sesCustomerId").val() || !doctor.state || cId == null){
                                        arrHT.push($(html));
                                    }else{                               //relationship
                                        var temp = $(html);
                                        temp.find(".follow_"+i).follow({fStatus:val.relationship?val.relationship:0,classStyle:"gz_but",fId:cId?cId:""});
                                        arrHT.push(temp);
                                    };
                                });

                                arrHT.push("<div class='clear'></div>");

                                sortTabContent.html(arrHT);
                                //sortTabContent.find(">li:last").css("border-bottom", "none");
                                $(".list_cont_list").show();
                                $(".no_find").hide();

                                //延迟加载
                                sortTabContent.find(".doctor_l img").lazyload({
                                    effect: "fadeIn",
                                    event: "scroll"
                                });

                                $(".page-container > .pager:eq(" + index + ")").show().pager({
                                    pagenumber: pageIndex,
                                    pagecount: Math.ceil(count/10),
                                    buttonClickCallback: pageClick});
                            } else {          // 若无数据
                                t.noResultShow(sortTabContent,hasKeyword,hasParam,index);
                            }
                        } else {          // 若无数据
                            t.noResultShow(sortTabContent,hasKeyword,hasParam,index);
                        }

                        // 设置暂存参数
                        sortTab.attr("loaded","true");  // 已加载
                        sortTab.attr("currentParamIndex",t.currentParamIndex);   // 当前参数 版本号 切换选项卡时判断参数是否有变，
                    }
                });
            }, 300);

        },
        noResultShow : function (sortTabContent,hasKeyword,hasParam,index) {
            var t = this;
            sortTabContent.find("ul").empty();
            $(".list_cont_list").hide();
            if(hasKeyword){             // 有关键词
                $(".no_find .with-param,.no_find .no-param").find("a").text(t.search.keyInput.val());
                $(".no_find .no-keyword").hide();
                if (hasParam) {   // 有参
                    $(".no_find .with-param").show();
                    $(".no_find .no-param").hide();
                } else {  // 无参
                    $(".no_find .with-param").hide();
                    $(".no_find .no-param").show();
                }
            }else{                    // 无关键词
                $(".no_find .with-param").hide();
                $(".no_find .no-param").hide();
                $(".no_find .no-keyword").show();
            }

            $(".no_find").show();
            $(".page-container .pager:eq(" + index + ")").hide();
        }
    };

    doctorList.init();
})
