/**
 * Created by LiuYuTao on 2016/11/24.
 */
var debug = 1;
var testData = true;
var width;
var height;

/*var appjs = { // mock
 getAuthorCustomerId: function () {
 return 1481512690830
 }
 };*/
var commConfig = {};

var xScale, yScale;

var shareCustomerId = "";
var isYourself = false;
var isApp = typeof appjs != "undefined";

$(function () {
    var loadingNum = 0;

    /**
     * 微信分享
     */
    function initShareWeixinm(isYourSelf, customerId, title, username) {
        var weiXinTitle = "";
        var weiXinDesc = "专属你的学术名片";
        var weiXinLogo = "https://m.allinmd.cn/pages/column/data_cube2/images/weixinShare.png";
        var weiXinLink = "https://m.allinmd.cn/pages/column/data_cube2/feedback.html";

        if (typeof customerId != "undefined" && customerId != "") {
            if (isYourSelf) {
                weiXinTitle = "2016骨医账单，我在唯医获得“#" + title + "#”称号，你呢？";
                weiXinLink += "?customerId=" + customerId;
            } else {
                weiXinTitle = "2016骨医账单，#" + username + "#在唯医获得“" + title + "”称号，你呢？";
                weiXinLink += "?customerId=" + customerId;
            }
        } else {
            weiXinTitle = "2016骨医账单出炉啦，快来看看吧！";
        }


        WeixinJSApi.title = function () {
            return weiXinTitle;
        };
        WeixinJSApi.desc = function () {
            return weiXinDesc;
        };

        WeixinJSApi.imgUrl = function () {
            return weiXinLogo;
        };

        WeixinJSApi.link = function () {
            return weiXinLink;
        };
        WeixinJSApi.init();
    }

    var rem = function (num) {
        return num / 75 + "rem";
    };

    width = $(window).width();
    height = $(window).height();

    xScale = d3.scaleLinear()
        .range([0, width]);

    yScale = d3.scaleLinear()
        .domain([0, height])
        .range([0, height]);

    commConfig = {
        greenDotConfig: {
            num: 40,
            direction: 0,
            color: "#08A077",
            sizeRange: [width * 0.003, width * 0.009], // px
            xSpeed: [0.4, 1.5],   // 水平速度
            ySpeed: [1.0, 2.6],   // 垂直速度
            opacity: [0.6, 0.9]
        },
        boatConfig: {
            width: width * 0.368,// 船宽
            height: height * 0.18,//船高
            centerX: 100,    // 船重心x 相对于船左上角
            centerY: 12,//   // 船重心y
            floatRange: [0.2, 0.3], // 船的漂浮区间
            speed: 0.1,
            direction: 1
        },
        bubblesConfig: {
            num: 15,
            direction: 0,
            color: "white",
            sizeRange: [width * 0.04, width * 0.06], // px
            xSpeed: [0, 0.4],   // 水平速度
            ySpeed: [0, 0.6],   // 垂直速度
            opacity: [0.4, 0.9],
            timeStep: 2
        },
        waveConfig: {
            waveHeight: [height * 0.07, height * 0.08, height * 0.09], // from 3---10 每层的波浪高度
            waveRange: [height * 0.008, height * 0.009, height * 0.008], // from 3---10 每层的波浪幅度
            waveNums: [3, 6, 4], // 每层的波浪个数
            timeStep: 1000
        },
        starConfig: {
            star1: {
                w: 50,
                h: 50
            },
            star2: {
                w: 50,
                h: 50
            },
            star3: {
                w: 50,
                h: 50
            },
            star4: {
                w: 60,
                h: 64
            },
            star5: {
                w: 146,
                h: 94
            },
            star6: {
                w: 120,
                h: 60
            },
            star7: {
                w: 130,
                h: 130
            },
            star8: {
                w: 70,
                h: 60
            }
        }
    };

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    if (isAndroid) {
        commConfig.greenDotConfig.num = 20;
        commConfig.bubblesConfig.num = 10;
    }

    var dataLoading = false;
    var imageLoading = 0;
    var imgs = ['bg-no-mountain.png',
        'index-title.png',
        'weixiaobao/index-2.png',
        'bubbles/1.png',
        'bubbles/2.png',
        'bubbles/3.png',
        'bubbles/4.png',
        'bubbles/5.png',
        'bubbles/6.png',
        'stars/star01.png',
        'stars/star02.png',
        'stars/star03.png',
        'stars/star04.png',
        'stars/star05.png',
        'ufo/index-ufo.png',
        'logo.png',
        'mountain.png'
    ];//可能从配置或者接口读取的
    var total = imgs.length;//总共需要读取的图片

    var ScenesArr = [], scene;

    function loadImgs() {
        loadingNum++;
        console.log("loadIMgs");
        var process = 0;//读取进度
        imgs.forEach(function (url) {
            var img = document.createElement('img');
            img.src = "images/" + url;
            img.onload = function () {
                imageLoading++;
                if (imageLoading == total) {
                    loadingNum--;
                }
                if (!loadingNum) {
                    loadingEffect.stop();
                    if (scenes.length > 1) {
                        initSwiper();
                    } else {
                        $("#wrap").show();
                        var scene = new SceneConstructor({
                            scene: "index"
                        });


                        scene.start();
                    }
                }
            }
        });
        /*===============登录===================*/
        $(".caos").on("click", function () {
            jump("/pages/passport/login_caos.html");
        });

        $(".allin").on("click", function () {
            jump("/pages/passport/login_allin.html");
        });

        function jump(url) {
            localStorage.setItem("fromPage", window.location.href);
            window.location.href = url;
        }
    }

    function initSwiper() {
        var myslider = new iSlider({
            wrap: '#wrap',
            item: '.item',
            rememberIndex: false,
            onslide: function (index) {

                debug && console.log("scroll" + index);
                scene && scene.stop();
                delete scene;
                scene = new SceneConstructor({
                    scene: scenes[index]
                });
                scene.start();
            }
        });
        console.info(myslider)
    }

    var scenes = [
        "index",
        "dearTeacher",
        "lastYear",
        "noRecord",
        "pieChart",
        "youLearn",
        "yourRelation",
        "yourRelation-no",
        "yourCard",
        "share",
        "downloadApp"
    ];

    function removeScene(arr) {
        var index;
        for (var i = 0; i < arr.length; i++) {
            index = scenes.indexOf(arr[i]);
            index >= 0 && scenes.remove(index, index);
            $("#item-" + arr[i]).remove();
        }
    }

    $("svg").on("click", function (e) {
        return false;
    });

    function getData(customerId, callback) {

        loadingNum++;
        console.log("loadData");
        $.ajax({
            url: "/mcall/customer/statisticsStat/info/",
            data: {
                paramJson: $.toJSON({
                    "year": 2016,
                    "customerId": customerId,// 1480992058863(无浏览) 1407837291235（有浏览）
                    "visitSiteId": 5
                })
            },
            type: "POST",
            success: function (data) {
                loadingNum--;
                if (data && data.responseObject && data.responseObject.responseStatus
                    && data.responseObject.responseData && data.responseObject.responseData.bo_data) {
                    var rst = data.responseObject.responseData.bo_data;

                    if (rst.authState == 2 || rst.authState == 7 ||rst.authState ==8||rst.authState == 9) {
                        callback(data.responseObject.responseData.bo_data);
                    } else {
                        if (isApp) {
                            appNoData();
                        } else {
                            window.location.href = "/pages/personal/personal_index.html";
                        }
                    }
                } else {
                    if (isApp) {
                        appNoData();
                    } else {
                        window.location.href = "/pages/personal/personal_index.html";
                    }
                }
            }
        });
    }

    function getDataTest(customerId, callback) {
        $.ajax({
            url: "/mcall/customer/statisticsStat/info/",
            data: {
                paramJson: $.toJSON({
                    "year": 2016,
                    "customerId": customerId,// 1480992058863(无浏览) 1407837291235（有浏览）
                    "visitSiteId": 5
                })
            },
            type: "POST",
            success: function (data) {
                console.log(data.responseObject.responseData);
            }
        });
    }

  /*  setInterval(function(){
        getData(1481512690830, function (data) {    })
    },100)*/

    function handleScene(rst) {
        /* 获取第一个重要的职称 */
        function getFirstBigTitle(str) {
            var titleArr = ["住院医师", "医学生", "护士", "其他", "主治医师", "副主任医师", "主任医师",
                "讲师", "副教授", "教授", "硕士生导师", "博士生导师"];
            var exist = false, i = 0;
            while (!exist && i < titleArr.length) {
                if (str.indexOf(titleArr[i]) < 0) {
                    i++;
                } else {
                    exist = true;
                }
            }
            return titleArr[i];
        }

        $("#teacherName").text(rst.name);
        $("#teacherName2").text(rst.name);
        $("#registTime").text(rst.registTime);
        $("#registDays").text(rst.registDays + "个");

        /*=====================处理交往数据=======================*/
        if (rst.customerSocial[0].num == 0) {        // 无交往
            removeScene(["yourRelation"]);
        } else {
            removeScene(["yourRelation-no"]);     // 移除无关系
            $(".relation .title-3 span").text(rst.customerSocial[0].num);
        }

        if (rst.customerSocial[0].num != 1) {   // 两行
            $(".customerSocial ul").addClass("two")
        }

        if (rst.customerSocial)
            $(".customerSocial ul").append(rst.customerSocial.map(function (d, i) {
                return '<li ' + (d.company.length > 9 ? ' class="twoLine" ' : '') + '>'
                    + ( rst.customerSocial[0].num == 0 ? ''
                        : '<img src="images/tag.png" alt="" class="award"/>' ) +
                    '   <div class="imgBox"><img src="' + d.logoUrl + '" alt=""/></div>' +
                    '   <div class="name">' + comm.getStrLen(d.customerName, 9) + '</div>' +
                    '   <div class="medicalTitle">' + (d.medicalTitle ? getFirstBigTitle(d.medicalTitle) : "") + '</div>' +
                    '   <div class="company">' + d.company + '</div>' +
                    '</li>';
            }));


        /*===============================================================*/

        if (rst.browseResource.length == 0) { // 无浏览  移除不相关页面

            removeScene(["lastYear", "pieChart", "youLearn", "yourCard", "share"]);
            if(!isYourself){
                removeScene(["downloadApp"]);
            }
            if(isApp){
                $(".relation .next-page").remove();
            }

        } else {    // 有浏览
            removeScene(["noRecord", "downloadApp"]);

            $(".login_btns .text span").parent().on("click", function (e) {
                window.location.href = "/pages/column/data_cube2/feedback.html?customerId" + customerId
            });
            /*===================填充数据========================*/
            $("#browseNum").text(rst.browseNum);
            $("#browseTime").text(rst.browseTime);
            $("#resourceNum").text(rst.resourceNum);
            $("#logoUrl").attr("src", rst.logoUrl);
            $("#company").text(rst.company);
            $("#doctorTitle").text("“" + rst.worthTag + "”");

            $("#worthPercent").text(rst.worthPercent);
            $("#tagBall").html(rst.keywords.map(function (d, i) {
                return d.length > 8 ? "" : "<div class='tag'>" + d + "</div>";
            }));

            if (rst.resourceNum == 0) {
                $(".lastyearTable").addClass("noPub")
                    .find("li:eq(2)").remove();
            }


            buildPieChart();

            /*================学习了哪些知识====================*/
            var resource;
            /**/
            switch (rst.browseResource.length) {
                case 1:
                    $("#learnList").html('<section class="type-1"> <header>2016年，您只在唯医浏览过<span>1</span>条资源</header>'
                        + getArticle(rst.browseResource[0], 0)
                        + '<div class="fighting">悄悄告诉您，在这里：<br/>' +
                        '   手术视频免费下载，会议直播从不间断。</div>'
                        + '</section>');
                    break;
                case 2:
                    $("#learnList").html('<section class="type-2"> <header>2016年，您只在唯医浏览过<span>2</span>条资源</header>'
                        + getArticle(rst.browseResource[0], 0, true)
                        + getArticle(rst.browseResource[1], 1)
                        + '<div class="fighting">悄悄告诉您，在这里：<br/>' +
                        '   手术视频免费下载，会议直播从不间断。</div>'
                        + '</section>');
                    break;
                case 3:
                    $("#learnList").html('<section class="type-3"> <header>这是您在2016浏览次数最多的<span>3</span>条资源：</header>'
                        + getArticle(rst.browseResource[0], 0, true)
                        + getArticle(rst.browseResource[1], 1)
                        + getArticle(rst.browseResource[2], 2) +
                        '</section>');
                    break;
            }

        }
        console.log("loadingNum" + loadingNum);
        if (!loadingNum) {
            loadingEffect.stop();
            initSwiper();
        }


        /*生成饼图*/
        function buildPieChart() {


            var lastYearEl = $(".lastYear");
            var lastYearElHeight = parseInt(lastYearEl.height())
                + parseInt(lastYearEl.css("marginTop"))
                + parseInt(lastYearEl.css("marginBottom"));
            var timeTextEl = $(".time-text");
            var timeTextHeight = parseInt(timeTextEl.css("height"))
                + parseInt(timeTextEl.css("marginTop"))
                + parseInt(timeTextEl.css("marginBottom"));
            var svgHeight = height - lastYearElHeight - timeTextHeight - commConfig.waveConfig.waveHeight[1];
            var svgWidth = width * .75;

            var pieSvg = d3.select("#pieSvg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            var viewNumRate = pieSvg.append("g")
                .attr("id", "viewNumRate");

            var viewTimeRate = pieSvg.append("g")
                .attr("id", "viewTimeRate");

            var rectWidth = svgWidth * .39;
            var rectHeight = svgHeight * .47;


            var numRectPos = {
                x: 0,
                y: 0
            };

            var timeRectPos = {
                x: svgWidth - rectWidth,
                y: svgHeight - rectHeight
            };


            var numRect = viewNumRate.append("rect")
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("x", numRectPos.x)
                .attr("y", numRectPos.y)
                .attr("fill", "#18205A")
                .attr("stroke", "#0F3860")
                .attr("stroke-width", 2);

            var lineHeight = rectHeight / 5;
            var fontSize = (rectWidth - 30) / 6;

            var timeRect = viewTimeRate.append("rect")
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("x", timeRectPos.x)
                .attr("y", timeRectPos.y)
                .attr("fill", "#18205A")
                .attr("stroke", "#0F3860")
                .attr("stroke-width", 2);

            viewNumRate.append("text")
                .text("浏览数量占比")
                .attr("class", "rect-title")
                .attr("font-size", fontSize)
                .attr("fill", "#06EB8E")
                .attr("x", numRectPos.x + 15)
                .attr("y", numRectPos.y + lineHeight / 2 + 10);


            viewTimeRate.append("text")
                .text("浏览时间占比")
                .attr("class", "rect-title")
                .attr("font-size", fontSize)
                .attr("fill", "#02DBFC")
                .attr("x", timeRectPos.x + 15)
                .attr("y", timeRectPos.y + lineHeight / 2 + 10);

            function appendNum(text, num, index) {
                try {
                    var g = this.append("g");

                    var containerPos = {
                        x: +this.select("rect").attr("x"),
                        y: +this.select("rect").attr("y")
                    };
                    var baseY = containerPos.y + lineHeight + fontSize + 10;
                    g.append("text")
                        .text(text)
                        .attr("class", "text" + parseInt(num))
                        .attr("fill", "#ffffff")
                        .attr("font-size", fontSize)
                        .attr("x", containerPos.x + rectWidth * 0.1)
                        .attr("y", baseY + lineHeight * index);

                    g.append("text")
                        .text(num)
                        .attr("fill", "#E6BE35")
                        .attr("font-size", fontSize * 1.1)
                        .attr("x", containerPos.x + fontSize * 4)
                        .attr("y", baseY + lineHeight * index);
                }
                catch (e) {
                    console.info(e.message);
                }
            }


            appendNum.call(viewNumRate, "视频", rst.videoNumRate, 0);
            appendNum.call(viewNumRate, "病例", rst.caseNumRate, 1);
            appendNum.call(viewNumRate, "文库", rst.docNumRate, 2);
            appendNum.call(viewNumRate, "话题", rst.topicNumRate, 3);

            appendNum.call(viewTimeRate, "视频", rst.videoTimeRate, 0);
            appendNum.call(viewTimeRate, "病例", rst.caseTimeRate, 1);
            appendNum.call(viewTimeRate, "文库", rst.docTimeRate, 2);
            appendNum.call(viewTimeRate, "话题", rst.topicTimeRate, 3);


            /*三角背景*/

            var numRightPoint = {
                x: svgWidth * .61,
                y: rectHeight / 2
            };

            var timeLeftPoint = {
                x: svgWidth * .39,
                y: timeRectPos.y + rectHeight / 2
            };

            var numtriAng = viewNumRate.append("path")
                .attr("class", "triangle1")
                .attr("d", "M" + rectWidth + " 0 V " + rectHeight
                + " L " + numRightPoint.x + " " + numRightPoint.y
                + " L " + rectWidth + " 0")
                .attr("fill", "#ffffff")
                .attr("opacity", 0.05);

            var timetriAng = viewTimeRate.append("path")
                .attr("class", "triangle1")
                .attr("d", "M" + timeRectPos.x + " " + timeRectPos.y + " v " + rectHeight
                + " L " + timeLeftPoint.x + " " + timeLeftPoint.y
                + " L " + timeRectPos.x + " " + timeRectPos.y)
                .attr("fill", "#ffffff")
                .attr("opacity", 0.05);

            /*饼图*/

            var radius = svgWidth * .21;

            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);


            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d;
                })
                .startAngle(270);

            var numPieTranslate = {
                x: svgWidth * .75,
                y: rectHeight / 2
            };

            var timePieTranslate = {
                x: svgWidth * .25,
                y: timeLeftPoint.y
            };

            var numPie = viewNumRate.append("g")
                .attr("id", "numPie")
                .attr("transform", "translate(" + numPieTranslate.x + "," + numPieTranslate.y + ")");


            var timePie = viewTimeRate.append("g")
                .attr("id", "timePie")
                .attr("transform", "translate(" + timePieTranslate.x + "," + timePieTranslate.y + ")");

            var numCircle = numPie.append("circle")
                .attr('class', 'pie1')
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radius)
                .attr("style", "fill:url(#pie1Gradient);");

            var timeCircle = timePie.append("circle")
                .attr('class', 'pie2')
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radius)
                .attr("style", "fill:url(#pie2Gradient);");


            var numData = [
                parseInt(rst.videoNumRate),
                parseInt(rst.caseNumRate),
                parseInt(rst.docNumRate),
                parseInt(rst.topicNumRate)
            ];

            var timeData = [
                parseInt(rst.videoTimeRate),
                parseInt(rst.caseTimeRate),
                parseInt(rst.docTimeRate),
                parseInt(rst.topicTimeRate)
            ];


            numData.sort();
            timeData.sort();


            var numArc = numPie.selectAll(".arc")
                .data(pie(numData))
                .enter().append("g")
                .attr("class", "arc1");

            numArc.append("path")
                .attr("d", arc)
                .attr("id", function (d) {
                    return "arcNum" + d.data;
                });

            var timeArc = timePie.selectAll(".arc")
                .data(pie(timeData))
                .enter().append("g")
                .attr("class", "arc2");

            timeArc.append("path")
                .attr("d", arc)
                .attr("id", function (d) {
                    return "arcTime" + d.data;
                });

            var maxNum = Math.max.apply(null, numData);
            var maxTime = Math.max.apply(null, timeData);

            /*连线部分*/

            /*放大*/
            var MaxNumPath = d3.select("#arcNum" + maxNum);
            var MaxTimePath = d3.select("#arcTime" + maxTime);

            MaxNumPath.attr("transform", "scale(1.05)")
                .attr("class", "selected");

            MaxTimePath.attr("transform", "scale(1.05)")
                .attr("class", "selected");

            var numArcPos, timeArcPos;


            MaxNumPath.each(function (d) {
                numArcPos = arc.centroid(d);
            });


            MaxTimePath.each(function (d) {
                timeArcPos = arc.centroid(d);
            });

            /*为了解决线遮盖的问题*/
            var clone = $("#arcNum" + maxNum + ".selected").parent().clone();
            $("#arcNum" + maxNum + ".selected").parent().remove();
            clone.appendTo($("#numPie"));

            var clone2 = $("#arcTime" + maxTime + ".selected").parent().clone();
            $("#arcTime" + maxTime + ".selected").parent().remove();
            clone2.appendTo($("#timePie"));

            numArcPos = {
                x: numArcPos[0] + numPieTranslate.x,
                y: numArcPos[1] + numPieTranslate.y
            };

            timeArcPos = {
                x: timeArcPos[0] + timePieTranslate.x,
                y: timeArcPos[1] + timePieTranslate.y
            };
            var textNumPoint = viewNumRate.select(".text" + maxNum);
            var textTimePoint = viewTimeRate.select(".text" + maxTime);

            var numTextPos = {
                x: +textNumPoint.attr("x") + rectWidth * 0.76,
                y: +textNumPoint.attr("y") - 14
            };

            var timeTextPos = {
                x: +textTimePoint.attr("x") - 10,
                y: +textTimePoint.attr("y")
            };

            function drawLine(container, textPoint, arcPoint, color) {
                var centerPoint = {x: 0, y: 0};
                centerPoint.x = textPoint.x + (arcPoint.x < textPoint.x ? -svgWidth * .1 : svgWidth * .1);
                centerPoint.y = textPoint.y;

                container.append("polyline")
                    .attr("points", textPoint.x + "," + textPoint.y + " "
                    + centerPoint.x + "," + centerPoint.y + " "
                    + arcPoint.x + "," + arcPoint.y)
                    .attr("stroke", color)
                    .attr("stroke-width", 1)
                    .attr("fill", "none")

            }

            drawLine(viewNumRate, numTextPos, numArcPos, "#0ADE8D");
            drawLine(viewTimeRate, timeTextPos, timeArcPos, "#0979AB");
        }


        /*=========================资源列表===============================*/
        function getArticle(resource, index, isFirst) {

            return '<article>' +
                '<div class="imgBox" ><div class="img-wrap">' +
                '   <img class="resourceImg" src="' + (resource.resourceAtt == "" ? ("images/default/" + index + ".jpg") : resource.resourceAtt) + '"/>' +
                (isFirst ? "<img class='award' src='images/no1.png' />" : "") +
                '</div></div>' +
                '<div class="infoBox">' +
                '   <p class="name">《' + comm.getStrLen(resource.resourceName, 14) + '》</p>' +
                '   <div class="visit"><img src="images/no-shadow-eye.png"/> ' +
                '   <div class="text"> 访问了 <span><span class="t"> ' + resource.num + ' </span> 次</span></div></div>' +
                '</div>' +
                '</article>';
        }


        /*12.28建勋*/

    }

    function WebInit() {
        var params = comm.getparaNew();

        if (params.forward) {    // 直接访问
            if (params && params.customerId) {    // 有他人Id
                removeScene(["index"]); // 跳过首页
                /*12.28 建勋 如果看他人，在最后页将方案改成 查看您的账单 */
                var url = "/pages/column/data_cube2/feedback.html";
                if(localStorage.getItem("userId")!=undefined && localStorage.getItem("userId")!=null && localStorage.getItem("userId")!=""){
                    url += "?customerId=" + localStorage.getItem("userId") + "&forward=true";
                }
                if(params.customerId != localStorage.getItem("userId")){
                    $(".yourCard footer p").html('<a href="' + url + '" id="viewYours">查看您的账单</a>');
                    // 12.28 去掉分享页 建勋
                    removeScene(["share"]);
                }

                if (user.checkSession() && params.customerId == localStorage.getItem("userId")) { // 已登录,并且在查看别人
                    isYourself = true;
                }else{
                    isYourself = false;
                }
                getData(params.customerId, function (data) {
                    dataLoading = true;
                    handleScene(data);
                    shareCustomerId = params.customerId;
                    initShareWeixinm(isYourself, params.customerId, data.worthTag, data.name);
                });
            } else {
                alert("无数据");
            }
        }
        else { // 非直接访问
            if (params && params.customerId) {    // 有他人Id

                $("#viewOther").attr("href",
                    "/pages/column/data_cube2/feedback.html?customerId="
                    + params.customerId + "&forward=true");



                // 显示分享人的名称
                getData(params.customerId, function (data) {
                    $("#viewOther span").text(data.name);
                    if (!loadingNum) {
                        loadingEffect.stop();
                        //if (scenes.length > 1) {
                        initSwiper();
                        //}
                    }
                });

            } else {  // 非分享进入，站内入口打开
                // 隐藏查看他人按钮
                $("#viewOther").hide();
            }

            /*检查本人情况*/
            if (user.checkSession()) { // 已登录的话，加载本人数据
                // 隐藏登录按钮
                $(".login_btns .btn").hide();

                if(params && params.customerId && localStorage.getItem("userId")==params.customerId){
                    // 如果是本人去掉查看他人的链接
                    isYourself = true;
                    $(".indexCon .login_btns .text").empty();
                }

                /* 12.28 建勋 添加查看您的账单按钮 */
                var url = "/pages/column/data_cube2/feedback.html";
                url += "?customerId=" + localStorage.getItem("userId") + "&forward=true";
                $(".indexCon .login_btns .text").append('<a href="' + url + '">查看您的帐单</a>');
                shareCustomerId = localStorage.getItem("userId");
                getData(localStorage.getItem("userId"), function (data) {
                    isYourself = true;
                    dataLoading = true;
                    handleScene(data);
                    initShareWeixinm(true, localStorage.getItem("userId"), data.worthTag);
                });

            } else { // 未登录 屏蔽其他界面
                initShareWeixinm(false);
                removeScene([
                    "dearTeacher",
                    "lastYear",
                    "noRecord",
                    "pieChart",
                    "youLearn",
                    "yourRelation",
                    "yourRelation-no",
                    "yourCard",
                    "share",
                    "downloadApp"]);
                dataLoading = true;
                var showTimeout, hideTimeout;
                $(".data-cube2").on("touchmove", function () {
                    clearTimeout(showTimeout);
                    clearTimeout(hideTimeout);
                    showTimeout = setTimeout(function () {
                        clearTimeout(hideTimeout);
                        $(".loginMask").show();
                        hideTimeout = setTimeout(function () {
                            $(".loginMask").fadeOut();
                        }, 2000);
                    }, 500);
                });
            }
        }
        loadImgs();
    }


    function AppInit() {
        var customerId = appjs.getAuthorCustomerId();
        shareCustomerId = customerId;
        removeScene([       // 如果在App中不显示下载页 不显示分享页
            "share", "downloadApp"
        ]);



        $(".login_btns").hide();
        if (typeof customerId != "undefined" && customerId != "" && customerId != null) {   // 已登录

            getData(customerId, function (data) {
                isYourself = true;
                dataLoading = true;
                handleScene(data);
            });
            loadImgs();
        } else {  // 未登录
            appNoData();
        }

    }

    function appNoData() {
        // 只显示无浏览页
        removeScene([
            "dearTeacher",
            "lastYear",
            "pieChart",
            "youLearn",
            "yourRelation",
            "yourRelation-no",
            "yourCard",
            "share",
            "downloadApp"
        ]);

        $(".noRecord .next-page").remove();

        if (!loadingNum) {
            loadingEffect.stop();
            if (scenes.length > 1) {
                initSwiper();
            }
        }
    }

    function init() {
        if (typeof appjs != "undefined") { // 唯医app
            AppInit();
        } else {
            WebInit();
        }
    }

    setTimeout(function () {
        init();
    }, 1000);
});