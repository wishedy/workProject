/**
 * 功能描述：定考
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/30.
 */
$(function () {
    user.login({
        callback: function () {
            $(".mask_body").remove();
        },
        scene:privilegeSceneConst.eSceneTypeDingKao,
	    onLoginClose: function () {
            g_sps.jump(null,"/");
	    },
	    onAuthCancel:"back"
    });


    String.prototype.htmlEncode = function () {
        return this.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    };
    var json_selector_data = {
        options_1:["关节外科","骨科总论","骨科基础","脊柱外科","骨肿瘤", "运动医学","创伤骨科"],
        options_2:["难","中","易"],
        options_3:["A1（单句型最佳选择题）",
            "A2（病例摘要型最佳选择题）",
            "A3（病例组型最佳选择题）",
            "A4（病例串型最佳选择题）",
            "B1（标准配伍题）",
            "X（多项选择题）"]
    };
    var template = "{for item in items}<li>" +
        "<div class='quest-header' quest-header='${item.questionHeader}'>${parseInt(item_index)+1}.${item.questionHeader}${item.questionTitle}</div>" +
        "<ul class='options'>" +
        "{for option in item.options}"+
        "<li optionTitle='${option.optionTitle}'>${option.optionId}. ${option.optionTitle}</li>" +
        "{/for}"+
        "</ul>" +
        "<div class='analysis'>" +
        "<div class='border'>" +
        "<div class='chakan'>滑动到这里查看答案与解析</div>" +
        "<div class='ana-content'>" +
        "   <div class='ana-answer'><span></span>答案：${item.answer}</div>" +
        "   <div class='ana-text ny_du nandu${item.levelId}'><span></span>难易度：</div>" +



        "   <div class='ana-text'>解析：${item.analysis}</div>" +
        "   <div class='hide-content'>点击隐藏答案</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "   </div>"  +
        "<div class='clear'></div>" +
        "</li>{/for}";


    var videoList = {};
    videoList.downSelector = {};
    videoList.search = {

    };

    function getOptionByQuestionId(data,questionId){
        var arr = [];
        for(var i= 0,l=data.length;i<l;i++){
            if(data[i].questionId==questionId){
                arr.push(data[i]);
            }
        }
        return arr;
    }

    videoList.query = function (pageIndex) {
        var t = this;
        clearTimeout(t.time);
        t.time = setTimeout(function () {
            var param = downSelector.getParam();
            param = $.extend(param, {pageIndex: downSelector.pageNum});
            var item;
            // Common.showloading();
            comm.LightBox.showloading();
            $.ajax({
                url: PC_CALL+"question/choice/list/",
                data: {paramJson: $.toJSON(param)},
                type: "POST",
                dataType: "json",
                success: function (data) {
                    //Common.hideloading();
                    var result,total;
                    comm.LightBox.hideloading();
                    var arr = ["易","中","难"];
                    if (data && data.rows && data.rows.rows && data.rows.rows.total > 0) {
                        result = data.rows.rows;
                        total =  data.rows.rows.total;
                        for (var i = 0; i < result.items.length; i++) {
                            result.items[i].options = getOptionByQuestionId(data.rows.question_options_list,result.items[i].questionId);
                            result.items[i].level = arr[result.items[i].levelId-1];
                        }
                        var html = template.process({items: result.items});
                        var $pageContent = $("#pageContent");
                        $pageContent.html(
                                html + "<div class='clear'></div>"
                        );

                        $pageContent.find(".analysis").on("mouseenter",function(){
                            $(this).find(".chakan").hide();
                            $(this).find(".chakan").siblings().slideDown();
                        });

                        $pageContent.find(".hide-content").on("click",function(){
                            $(this).parent().slideUp();
                            $(this).parent().siblings().show();
                        });

                        if(downSelector.typeId=="3" || downSelector.typeId=="4"){
                            downSelector.hebingType2();
                        }
                        if(downSelector.typeId=="5"){
                            downSelector.hebingType3();
                        }
                        $("#pageContent").find(">li:last").css("border-bottom", "none");
                        $("#noFind").hide();
                        $(".center_bg").show();

                        //延迟加载
                        $("#pageContent img").lazyload({
                            effect: "fadeIn",
                            event: "scrollstop"
                        });



                        //初始化分页导航
                        $(".pager").pager({
                            pagenumber:pageIndex,
                            pagecount: data.rows.rows.pageCount,
                            buttonClickCallback: PageClick});

                    } else {
                        $(".pagination").empty();
                        $("#noFind").show();
                        $(".center_bg").hide();
                        total = 0;
                    }
                    $(".tiaojian").html("为你找到" + total + "条结果");

                    // 隐藏下拉菜单
                    downSelector.downSelectorContainer.removeClass("on");

                }

            });
        }, 1000);

        //if(typeof console!=undefined)//console.log(param);
    };

    var xuezuArr = [
        {name:"关节",id:"2"},
        {name:"足踝",id:"3"},
        {name:"四肢矫形",id:"4"},
        {name:"小儿骨科",id:"5"},
        {name:"肘&肩",id:"6"},
        {name:"脊柱",id:"7"},
        {name:"运动医学",id:"8"},
        {name:"创伤",id:"9"},
        {name:"骨肿瘤",id:"816"},
        {name:"康复",id:"817"},
        {name:"骨质疏松",id:"818"},
        {name:"基础",id:"819"},
        {name:"显微修复",id:"820"},
        {name:"中西医结合",id:"830"}
    ];

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


    var downSelector = {
        domain: PC_CALL,
        downSelectorContainer: {},
        timeout: {},
        pageNum: 1,
        initParam: null,
        mediaType: "ALL", //载体类型,后选值:ALL,VIDEO,DOC
        selectedItems: [],
        //
        init: function () {
            var t = this;

            t.downSelectorContainer = $(".doctor_test_l_t");

            t.setupOptions(1, t.getData(1), "vertical");
            t.setupOptions(2, t.getData(3), "vertical");



            t.bindAllOptions();
            $(".options:eq(1) li:eq(0)").click();
            var arr = [], i, parent, l;
            videoList.query(1);
        },

        // 获取某下拉框需要的数据
        getData: function (i) {
            return json_selector_data["options_" + i];
        },
        /**
         *  为下拉选择填充下拉选项
         *  序号，数据
         * */
        setupOptions: function (index, data) {
            var t = this, list;
            var con = t.downSelectorContainer.eq(index - 1).find(".options-list").empty();
            list = $.map(data, function (val) {
                return ' <li>                  ' +
                    '       <div class="doctor_test_l_text">' +
                    '           ' + val +
                    '       </div>' +
                    '       <div class="clear"></div>' +
                    '    </li>';
            });

            con.html(list.join(""));
        },
        // 鼠标经过下拉选择事件
        bindSelectorHover: function () {
            var t = this;
            t.downSelectorContainer.on("click",function () {
                if(!$(this).hasClass("on")){
                    t.downSelectorContainer.removeClass("on");
                    $(this).addClass("on");
                    if (t.timeout) {
                        clearTimeout(t.timeout);
                    }
                }else{
                    var o = $(this);
                    t.timeout = setTimeout(function () {
                        o.removeClass("on");
                    }, 500);
                }
            });
        },
        // 绑定选项
        bindAllOptions: function () {
            var t = this;
            t.bindXueZhu();
            t.bindTypes();
        },
        // 绑定学组
        bindXueZhu: function () {
            var t = this;
            var lis = t.downSelectorContainer.eq(0).find(".options-list li:not(.sep-line)");
            lis.each(function (index, el) {

                $(this).click(function () {
                    el = $(el);
                    var tagName = el.find("a").text();
                    /*lis.find(".doctor_test_l_img").remove();
                    lis.removeClass("on");*/
                    var tagName = el.find(".doctor_test_l_text").text();
                    if(!$(this).hasClass("on")){
                        $(this).addClass("on");
                        $(this).find(".doctor_test_l_text").after('<div class="doctor_test_l_img">' +                            '<img src="//img00.allinmd.cn/channel/doctor_test/close_icon.png"/></div>');
                        $(this).find(".doctor_test_l_img").on("click",function(e){  // 关闭

                            $(this).parent().removeClass("on");
                            $(this).remove();
                            videoList.query(1);
                            comm.stopBubble(e);
                        });


                    }
                    t.pageNum = 1;
                    videoList.query(1);
                });
            });
        },

        // 绑定题型
        bindTypes: function () {
            var t = this;
            var lis = t.downSelectorContainer.eq(1).find(".options-list li:not(.last)");
            lis.each(function (index, el) {
                $(this).click(function () {
                    var tagName = $(el).find("a").text();
                    lis.removeClass("on");
                    $(this).addClass("on");
                    t.pageNum = 1;
                    videoList.query(1);
                });
            });
        },

        // 同题干，多答案
        hebingType2:function(){
            var t= this;
            var quest = $(".quest-header");
            var index=0;
            var questHeader;
            var i=0;
            var compareIndex=0; // 比较位
            var comparePos=0;     // 当前位置
            while(i<quest.length){
                header = quest.eq(compareIndex).attr("quest-header");
                for(i=compareIndex;i<quest.size();i++){

                    if(quest.eq(i).attr("quest-header")==header){
                        if(compareIndex==i-1){
                            quest.eq(compareIndex).parent().prepend("<div class='top-header'>"+ header +"</div>");
                        }
                        quest.eq(i).parent().find(".analysis").addClass("inner");    //多题干，非最后一题的边框样式
                        if(i>compareIndex){
                            if((i-compareIndex)==1){
                                quest.eq(compareIndex).html(quest.eq(compareIndex).html().replace(header,""));    // 去掉题干中相同部分，剩下问法
                            }
                            quest.eq(i).html(quest.eq(i).html().replace(header,""));    // 去掉题干中相同部分，剩下问法
                        }

                    }else{
                        quest.eq(compareIndex).parent().find(".top-header").prepend("<span>（"+ (compareIndex+1) + "-" + i +"题共用题干）</span>");
                        quest.eq(i-1).parent().find(".analysis").removeClass("inner");
                        compareIndex = i;
                        break;
                    }
                    if(i==9 && compareIndex!=9){
                        quest.eq(compareIndex).parent().find(".top-header").prepend("<span>（"+ (compareIndex+1) + "-10题共用题干）</span>");
                        quest.eq(9).parent().find(".analysis").removeClass("inner");
                    }

                }
            }
        },
        // 同答案，多题干
        hebingType3:function(){
            var t= this;
            var quest = $(".quest-header");
            var index=0;
            var questHeader;
            var i=0;
            var compareIndex=0; // 比较位
            var comparePos=0;     // 当前位置
            var li,answerLi;
            while(i<quest.length){
                optionTitle = quest.eq(compareIndex).parent().find(".options-list li:eq(0)").attr("optionTitle");
                for(i=compareIndex;i<quest.size();i++){

                    if(quest.eq(i).parent().find(".options-list li:eq(0)").attr("optionTitle")==optionTitle){
                        if(compareIndex==i-1){
                            li =   quest.eq(compareIndex).parents("li");
                            answerLi = li.find(".options-list").clone();
                            answerLi.insertBefore(li);
                            answerLi.show().wrap("<li></li>");
                        }
                        quest.eq(i).parent().find(".analysis").addClass("inner");    //多题干，非最后一题的边框样式
                        //if(compareIndex!=i){
                        quest.eq(i).siblings(".options-list").hide();    // 隐藏答案，剩下题干 与 问法
                        //}

                    }else{
                        if(i==(compareIndex+1)){

                            quest.eq(compareIndex).siblings(".options-list").show();
                        }

                        if(answerLi!=undefined){
                            answerLi.prepend("<span>（"+ (compareIndex+1) + "-" + i +"题共用备选答案）</span>");
                        }
                        quest.eq(i-1).parent().find(".analysis").removeClass("inner");
                        compareIndex = i;
                        break;
                    }
                    if(i==9 && compareIndex!=9){
                        answerLi.prepend("<span>（"+ (compareIndex+1) + "-" +"10题共用备选答案）</span>");
                        quest.eq(9).parent().find(".analysis").removeClass("inner");
                    }

                }
            }
        },
        // 获取下拉框的参数
        getDownSelectParams: function () {
            var t = this;
            return {
                studyGroup: t.studyGroup,
                typeId: t.types
            }
        },

        getStudyGroupStr:function(arr){
            var t = this;
            var str = [];
            for(var i = 0;i<arr.length;i++){
                for(var j = 0;j<xuezuArr.length;j++){
                    if(arr[i]==xuezuArr[j].name){
                        str.push(xuezuArr[j].id);
                    }
                }
            }
            return str.join(",");
        },

        getParam: function () {
            var t = this, difficulty = [], studyGroup = [], types = [];
            var param = {};
            var insertedIndex = -1;

            var studyGroupList = $(".zhuanye").find("li.on");
            studyGroupList.each(function (index,obj) {
                studyGroup.push("'" +$.trim($(obj).text()) + "'" );
            });

            var typesList = $(".types").find("li.on");
            typesList.each(function (index,obj) {
                types.push("'" + $.trim($(obj).text())+ "'");
            });

            var typeId=types.join("");
            var typeArr = ["A1","A2","A3","A4","B1","X"];
            var rst="";
            $.each(typeArr,function(index,o){
                if(types.join("").indexOf(o)>-1){
                    rst = index+1;
                }
            });

            t.typeId=rst;
            var studyGroupStr = studyGroup.join(",");

            param = {
                studyGroup: studyGroupStr,
                // difficulty: difficultyStr,
                categoryId:rst
            };

            return param;
        }
    };


    PageClick = function (pageclickednumber) {

        downSelector.pageNum = pageclickednumber;
        $(".fh_top").trigger("click");
        videoList.query(pageclickednumber);
    };

   /* $(document).on("click",function(){
        user.login({
            callback:function(){
                $(document).off("click");

                $(".mask_body").remove();

            },
            operateType:"respond",
            isGuide:1
        });
    })


    user.login({
        callback:function(){
            $(document).off("click");
            downSelector.init();
            $(".mask_body").remove();

        },
        operateType:"respond",
        isGuide:1
    });*/

    $(".pages li").live("click", function () {
        $(document).scrollTop(0);
    });

    downSelector.init();
});
