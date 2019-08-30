/**
 * @Desc：KOL用户
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by WangNing on 2017/12/6.
 */

$(function () {
    var ownTranscriptData = JSON.parse(localStorage.getItem("ownTranscriptData")),
        otherTranscriptData = JSON.parse(localStorage.getItem("otherTranscriptData")),
        userId = localStorage.getItem("userId"), //登录用户的用户id
        userName = localStorage.getItem("trueName"), //登录用户的用户id
        otherUserId = localStorage.getItem("otherUserId");       //查看他人的用户id.
    // 他人的id 或者 资源数据为空 则跳转至登录页面
    if (!otherUserId && !userId) {
        localStorage.setItem("fromPage", "/pages/column/transcript/jump.html");
        localStorage.setItem("fromPageN", "//m.allinmd.cn/pages/column/transcript/jump.html");
        window.location.href = "/pages/passport/loginV2/login.html";
        return false;
    }
    if (otherUserId && userId !== otherUserId) { //默认查看他人的成绩
        $(".transcriptBg").addClass("kolUserTA");//切换我的 Ta的 图片
        var swiperObject = new Swiper('.swiper-container', {
            // pagination: '.swiper-pagination',
            // paginationClickable: true,
            direction: 'vertical',
            speed: 80,
            onSlideChangeEnd: function (_swiper) {
                // _swiper.slides.css({opacity: 0});
                // _swiper.slides.eq(_swiper.activeIndex).css({opacity: 1});
                if ($('.swiper-slide-active .error').length > 0) {
                    // if(_swiper.activeIndex ===6){
                    var n = -1;
                    swiperObject.timer = setInterval(function () {
                        n++;
                        if (n < 20) {
                            $('.swiper-slide-active .error').append('<p style="left: ' + n * 16 / 75 + 'rem;top: ' + (2 + n * 16 / 75) + 'rem;"></p>')
                        } else {
                            clearInterval(swiperObject.timer);
                            var m = -1;
                            swiperObject.SecTimer = setInterval(function () {
                                m++;
                                if (m < 20) {
                                    $('.swiper-slide-active .error').append('<p style="left: ' + m * 16 / 75 + 'rem;top: ' + (6 + m * 16 / 75) + 'rem;"></p>')
                                } else {
                                    swiperObject.imgTimer = setInterval(function () {
                                        $(".kolUserP7 img").show();
                                        $(".errorBox").css("background", "rgba(0,0,0,0.60)");
                                        clearInterval(swiperObject.imgTimer);
                                    }, 500);
                                    clearInterval(swiperObject.SecTimer);
                                }
                            }, 10)
                        }
                    }, 10)
                } else {
                    /*清除对应的定时器*/
                    clearInterval(swiperObject.timer);
                    clearInterval(swiperObject.SecTimer);
                    clearInterval(swiperObject.imgTimer);
                    $('.swiper-slide .error p').remove();
                    $(".kolUserP7 img").hide();
                    $(".errorBox").css("background", "none")
                }
            }
        });
        swiperObject.removeSlide(0);
        $(".continueBtn a").click(function () {
            swiperObject.slideTo(1, 500, false);//切换到第一个slide，速度为1秒
            swiperObject.slides.eq(1).css({opacity: 1});
            return false;
        });
        setKOLData(otherTranscriptData);
        /*普通用户还是KOL用户*/
        $(".mineBtn a ,.kolUserP8 .kolBtn").click(function (e) {

            if(e.target.tagName.toLowerCase() == "img"){
                //个人账单尾-点击查看我的报告
                comm.creatEvent({
                    triggerType:"功能",
                    triggerName:"个人账单尾-点击查看我的报告",
                    browType:221,
                    browseTypeUrl:window.location.href,
                    actionId:110480,
                    async:false
                });
            }else if(e.target.tagName.toLowerCase() =="a"){
                //个人账单首-点击查看我的报告
                comm.creatEvent({
                    triggerType:"功能",
                    triggerName:"个人账单首-点击查看我的报告",
                    browseTypeUrl:window.location.href,
                    browType:221,
                    actionId:110479,
                    async:false
                });
            }

            localStorage.removeItem("otherUserId");
            localStorage.removeItem("otherTranscriptData");
            if (!userId) {
                localStorage.setItem("fromPage", "/pages/column/transcript/jump.html");
                localStorage.setItem("fromPageN", "//m.allinmd.cn/pages/column/transcript/jump.html");
                window.location.href = "/pages/passport/loginV2/login.html";
                return false;
            }
            //判断是否首次登录,首次登录跳转再接再厉
            var firstRegist = localStorage.getItem("firstRegist");
            if(parseInt(firstRegist)===1){
                window.location.href = "sorry.html";
                return false;
            }

            // /*如果缺少我的相关数据,再次拉取,并缓存*/
            if (!ownTranscriptData) {
                getData(userId, function (data) {
                    if (data && data.responseObject && data.responseObject.responseStatus === true) {
                        var ownTranscriptData = data.responseObject.responseData.data_list[0];
                        localStorage.setItem("ownTranscriptData", JSON.stringify(ownTranscriptData));
                        if (ownTranscriptData.customerType == 1) {
                            window.location.href = "/pages/column/transcript/KOL.html";
                            return false;
                            // kol用户
                        } else if (ownTranscriptData.customerType == 2) {
                            // 普通用户
                            window.location.href = "/pages/column/transcript/normalUser.html";
                            return false;
                        }
                    } else {
                        console.log("无数据");
                        window.location.href = "newUser.html";
                        return false;
                    }
                })
            } else if (ownTranscriptData.customerType == 1) {
                window.location.href = "/pages/column/transcript/KOL.html";
                return false;
                // kol用户
            } else if (ownTranscriptData.customerType == 2) {
                // 普通用户
                window.location.href = "/pages/column/transcript/normalUser.html";
                return false;
            } else {
                window.location.href = "newUser.html";
                return false;
            }
        });
        $(".kolUserP8").addClass("hisEffect");
        $(".kolUserP8 .kolBtn").removeClass("hide"); //显示"点击查看我的" 按钮
        initShareWeixinm(false, otherUserId, otherTranscriptData.customerName);

    } else { //查看自己的成绩
        var swiperObject = new Swiper('.swiper-container', {
            // pagination: '.swiper-pagination',
            // paginationClickable: true,
            direction: 'vertical',
            speed: 80,
            onSlideChangeEnd: function (_swiper) {
                // _swiper.slides.css({opacity: 0});
                // _swiper.slides.eq(_swiper.activeIndex).css({opacity: 1});
                if ($('.swiper-slide-active .error').length > 0) {
                    // if(_swiper.activeIndex ===6){
                    var n = -1;
                    swiperObject.timer = setInterval(function () {
                        n++;
                        if (n < 20) {
                            $('.swiper-slide-active .error').append('<p style="left: ' + n * 16 / 75 + 'rem;top: ' + (2 + n * 16 / 75) + 'rem;"></p>')
                        } else {
                            clearInterval(swiperObject.timer);
                            var m = -1;
                            swiperObject.SecTimer = setInterval(function () {
                                m++;
                                if (m < 20) {
                                    $('.swiper-slide-active .error').append('<p style="left: ' + m * 16 / 75 + 'rem;top: ' + (6 + m * 16 / 75) + 'rem;"></p>')
                                } else {
                                    swiperObject.imgTimer = setInterval(function () {
                                        $(".kolUserP7 img").show();
                                        $(".errorBox").css("background", "rgba(0,0,0,0.60)");
                                        clearInterval(swiperObject.imgTimer);
                                    }, 500);
                                    clearInterval(swiperObject.SecTimer);
                                }
                            }, 10)
                        }
                    }, 10)
                } else {
                    /*清除对应的定时器*/
                    clearInterval(swiperObject.timer);
                    clearInterval(swiperObject.SecTimer);
                    clearInterval(swiperObject.imgTimer);
                    $('.swiper-slide .error p').remove();
                    $(".kolUserP7 img").hide();
                    $(".errorBox").css("background", "none")
                }
                //微信分享引导页
                if(is_weixn()){
                    if (_swiper.activeIndex === 7) {
                        setTimeout(function () {
                            if (_swiper.activeIndex === 7) {
                                $(".sharePopup").removeClass("hide");
                                $(".sharePopup").on("touchstart", function () {
                                    $(".sharePopup").addClass("hide");
                                })
                            }
                        }, 3000)
                    }
                }

            }
        });
        swiperObject.removeSlide(1);
        /*查看是否登录*/
        if (!ownTranscriptData || !userId) {
            localStorage.setItem("fromPage", "/pages/column/transcript/jump.html");
            localStorage.setItem("fromPageN", "//m.allinmd.cn/pages/column/transcript/jump.html");
            window.location.href = "/pages/passport/loginV2/login.html";
            return false;
        }
        $(".kolUserP8 .erweima").removeClass("hide"); //显示二维码
        setKOLData(ownTranscriptData, true);
        $(".kolUserP8").addClass("mineEffect");

        jQuery('#qrcodeCanvas').qrcode({
            text: "https://m.allinmd.cn/pages/column/transcript/transcriptStartUp.html?ouid=" + userId
        });
        $(".kolUserP8").one("click", function () {
            var transcriptBgMargintTop = $(".transcriptBg").css("marginTop");
            $(".transcriptBg").css({"marginTop": 0});
            $("#myKeywords .userCont .userImg img").css({"border":"none"})
            convert2canvas($("#myKeywords"));
            $(".transcriptBg").css({"marginTop": transcriptBgMargintTop})
        });
        initShareWeixinm(true, userId, userName);
    }

    //TODO 公共方法是否需要提取
    function setKOLData(data, isMySelf) {
        var isWho = isMySelf ? "我" : "TA";
        data.customerName && $(".kolUserP1 .userName,.kolUserP8  .userCont .userName").text(data.customerName); // '医生名称',
        data.compayName && $(".userCompany,.kolUserP6 ul .userHospital,.kolUserP8  .userCont .userHospital").text(data.compayName); // '医院',
        if(data.browseNum){
            $(".userNum").text(data.browseNum); //
            $(".kolUserP2 .userNumText").html("人反复学习过<br>" + isWho + "发表的资源"); //
            data.provinceNum && $(".province").html("<span>" + data.provinceNum + "</span>个省"); //覆盖省份
            data.companyNum && $(".hospital").html("<span>" + data.companyNum + "</span>家医院"); //覆盖医院
            data.themeNum && $(".effect .effectNum").text(data.themeNum); //主题演讲次数
            data.themeNum && $(".effect .effectText").html("次国家级学术<br>主题演讲"); //主题演讲次数 话术
            data.patientNum && $(".p4_win03  p span").text(data.patientNum); //患者人数
            data.patientNum && $(".p4_win03  p ").html("<span>" + data.patientNum + "</span>位患者"); //患者人数话术
            // data.browsePeopleNum &&  $(".p4_win01 p span").text(data.browsePeopleNum); //大于30分钟的浏览人数 //帮助人数
            data.browsePeopleNum && $(".p4_win01 p").html("帮助<span>" + data.browsePeopleNum + "</span>位"); //大于30分钟的浏览人数 //帮助人数
            data.coverCity && $(".p5_win03  p:first-of-type").html(data.coverCity + "<span>最多</span>"); //距离最远的省份名称

            if (data.farthestProvince == "黑龙江省" || data.farthestProvince == "内蒙古自治区") {
                var farthestProvince = data.farthestProvince && data.farthestProvince.substring(0, 3);
            } else {
                var farthestProvince = data.farthestProvince && data.farthestProvince.substring(0, 2);
            }
            if ((farthestProvince + " " + data.farthestCity).length > 7) {
                $(".p5_win03  p:last-of-type").addClass("smallFontSize");
            }
            (data.farthestCity || farthestProvince ) && $(".p5_win03  p:last-of-type").text(farthestProvince + " " + data.farthestCity); //距离最远的省份名称


            // data.studyCustomerId && data.studyCustomerId.split(",")[0] && $(".kolUserP6  li:first-of-type .userName").text(data.studyCustomerId.split(",")[0]); //
            // data.studyCustomerId && data.studyCustomerId.split(",")[1] && $(".kolUserP6  li:last-of-type .userName").text(data.studyCustomerId.split(",")[1]); //
            //KOL中对于医院的处理
            var studyCustomerId_studyCustomer1 = data.studyCustomerId && data.studyCustomerId.split(",")[0].split("_")[0];
            var studyCustomerId_hosptail1 = data.studyCustomerId && (data.studyCustomerId.split(",")[0].split("_").length>1)&&data.studyCustomerId.split(",")[0].split("_")[1];
            var studyCustomerId_studyCustomer2 = data.studyCustomerId && (data.studyCustomerId.split(",").length>1) && data.studyCustomerId.split(",")[1].split("_")[0];
            var studyCustomerId_hosptail2 = data.studyCustomerId && (data.studyCustomerId.split(",").length>1) &&(data.studyCustomerId.split(",")[1].split("_").length>1)&& data.studyCustomerId.split(",")[1].split("_")[1];
            studyCustomerId_studyCustomer1 && $(".kolUserP6  li:first-of-type .userName").text(studyCustomerId_studyCustomer1);
            studyCustomerId_studyCustomer2 && $(".kolUserP6  li:last-of-type .userName").text(studyCustomerId_studyCustomer2); //
            studyCustomerId_hosptail1 && $(".kolUserP6  li:first-of-type .userHospital").text(studyCustomerId_hosptail1); //
            studyCustomerId_hosptail2 && $(".kolUserP6  li:last-of-type .userHospital").text(studyCustomerId_hosptail2); //

            //对于追随者头像的处理
            data.studyCustomerLogo1 && $(".kolUserP6  li:first-of-type .userImg img").attr("src", data.studyCustomerLogo1);
            data.studyCustomerLogo2 && $(".kolUserP6  li:last-of-type .userImg img").attr("src", data.studyCustomerLogo2);

            data.expertCustomerName && $(".kolUserP6 .fellowMine .userName span").text(data.expertCustomerName); //专家医生
            data.expertCustomerCompany && $(".kolUserP6 .fellowMine .userHospital").text(data.expertCustomerCompany); //专家医生医院

            // 专业排名   major_ranking
            //synthesized_ranking  综合排名
            var hospitalLevel = [],
                medicalTitle = [];
            data.hospitalLevel && data.hospitalLevel.split(",").forEach(function (ele, index) {
                var _data = ele.split("_");
                hospitalLevel.push({
                    hospital: _data[0],
                    num: _data[1]
                })
            });
            data.medicalTitle && data.medicalTitle.split(",").forEach(function (ele, index) {
                var _data = ele.split("_");
                medicalTitle.push({
                    hospital: _data[0],
                    num: _data[1]
                });
            });
            draw2(hospitalLevel);
            draw1(medicalTitle);

            //综合排名
            if (data.synthesizedRanking <= 20) {
                $(".ranking").show();
                $(".ranking span").text(data.synthesizedRanking);
            } else if (data.synthesizedRanking > 50) {
                swiperObject.removeSlide(6);//如果排名大于50,增移除第6张
            }
            data.customerName && $(".kolUserP8  .username").text(data.customerName);
            data.compayName && $(".kolUserP8  .userHospital").text(data.compayName);
            data.customerLogo && $(".kolUserP8  .userImg img").attr("src", data.customerLogo);
            if(data.effectNumer==""){
                $(".kolUserP8  .startRanking p:last-of-type").css({"width":  "60%"}) //影响力指数
            }else{
                if( data.effectNumer>100){
                    data.effectNumer=100;
                }
                $(".kolUserP8  .startRanking p:last-of-type").css({"width": data.effectNumer + "%"}) //影响力指数
            }
            swiperObject.removeSlide(swiperObject.slides.length-1)
        }else{
            swiperObject.removeSlide([1,2,3,4,5,6,7]);//移除1-7个
        }




    }

    //职称分布
    function draw1(data) {
        var colors = {
            "主任医师": "#e13146",
            "副主任医师": "#0380d7",
            "主治医师": "#f6bf1a",
            "住院医师": "#44c8ba",
            "医学生": "#a45422",
            "护士": "#a468c4"
        };

        var filterData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (colors[obj.hospital]) {
                filterData.push(obj);
            }
        }
        var svg = d3.select("#d3View1");
        var newData = [];
        var width = $(".kolUserP5 figure").width();
        var height = $(".kolUserP5 figure").width();
        svg.attr("width", width)
            .attr("height", height);

        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", width / 2)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px");


        //
        // var sortDataSet = filterData.sort(function (a, b) {
        //     return (parseInt(a.num) < parseInt(b.num))?1:0;
        // });

        var sortDataSet = filterData.sort(function(a,b){
            return (parseInt(a.num) < parseInt(b.num)) ? 1 : (parseInt(a.num) > parseInt(b.num)) ? -1 : 0;
        })

        var pieArr = [];
        var all = 0;
        $.each(sortDataSet, function (index, item) {
            all += parseInt(item.num);
            newData.push({hospital: item.hospital, num: parseInt(item.num)});
        });

        var pie = d3.layout.pie().value(function (d) {
            return d.num;
        });

        var piedata = pie(newData);

        var outerRadius = width / 2 - 4;	//外半径
        var innerRadius = 0;	//内半径，为0则中间没有空白

        var arc = d3.svg.arc()	//弧生成器
            .innerRadius(innerRadius)	//设置内半径
            .outerRadius(outerRadius);	//设置外半径

        var arcs = svg.selectAll("g")
            .data(piedata)
            .enter()
            .append("g")
            .attr("fill", function (d, i) {
                return colors[d.data.hospital];
            })
            .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");


        arcs.append("path")
            .attr("d", function (d, i) {
                return arc(d);
            })
            .attr("id", function (d, i) {
                return i
            });


        if (newData && newData[0] && newData[0].num && newData[0].num != 0) {
            $("#data1_1").text(Math.floor(newData[0].num * 100 / all) + "%").css("background", colors[newData[0].hospital]);
        } else {
            $("#data1_1").remove()
        }
        if (newData && newData[1] && newData[1].num && newData[1].num != 0) {
            $("#data1_2").text(Math.floor(newData[1].num * 100 / all) + "%").css("background", colors[newData[1].hospital]);
        } else {
            $("#data1_2").remove()
        }
        if (newData && newData[2] && newData[2].num && newData[2].num != 0) {
            $("#data1_3").text(Math.floor(newData[2].num * 100 / all) + "%").css("background", colors[newData[2].hospital]);
        } else {
            $("#data1_3").remove()
        }
    }


    //医院等级
    function draw2(data) {

        var colors = {
            "三甲医院": "#0380d7",
            "三乙医院": "#a468c4",
            "二甲医院": "#44c8ba",
            "二乙医院": "#e13146",
            "一级医院": "#f6bf1a"
        };

        var filterData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (colors[obj.hospital]) {
                filterData.push(obj);
            }
        }

        var svg = d3.select("#d3View2");
        var newData = [];
        var width = $(".kolUserP5 figure").width();
        var height = $(".kolUserP5 figure").width();
        svg.attr("width", width)
            .attr("height", height);
        // var sortDataSet = filterData.sort(function (a, b) {
        //     return (parseInt(a.num) < parseInt(b.num))?1:0;
        // });

        var sortDataSet = filterData.sort(function (a, b) {
            return (parseInt(a.num) < parseInt(b.num)) ? 1 : (parseInt(a.num) > parseInt(b.num)) ? -1 : 0;
        });

        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", width / 2)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px");


        var pieArr = [];
        var all = 0;
        $.each(sortDataSet, function (index, item) {
            all += parseInt(item.num);
            newData.push({hospital: item.hospital, num: parseInt(item.num)});
        });

        var pie = d3.layout.pie().value(function (d) {
            return d.num;
        });

        var piedata = pie(newData);

        var outerRadius = width / 2 - 4;	//外半径
        var innerRadius = 0;	//内半径，为0则中间没有空白

        var arc = d3.svg.arc()	//弧生成器
            .innerRadius(innerRadius)	//设置内半径
            .outerRadius(outerRadius);	//设置外半径

        var arcs = svg.selectAll("g")
            .data(piedata)
            .enter()
            .append("g")
            .attr("fill", function (d, i) {
                return colors[d.data.hospital];
            })
            .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");


        arcs.append("path")
            .attr("d", function (d, i) {
                return arc(d);
            })
            .attr("id", function (d, i) {
                return i
            })

        //.attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");

        if (newData && newData[0] && newData[0].num && newData[0].num != 0) {
            $("#data2_1").text(Math.floor(newData[0].num * 100 / all) + "%").css("background", colors[newData[0].hospital]);
        } else {
            $("#data2_1").remove()
        }
        if (newData && newData[1] && newData[1].num && newData[1].num != 0) {
            $("#data2_2").text(Math.floor(newData[1].num * 100 / all) + "%").css("background", colors[newData[1].hospital]);
        } else {
            $("#data2_2").remove()
        }
        if (newData && newData[2] && newData[2].num && newData[2].num != 0) {
            $("#data2_3").text(Math.floor(newData[2].num * 100 / all) + "%").css("background", colors[newData[2].hospital]);
        } else {
            $("#data2_3").remove()
        }
        //console.log(newData);
    }

    function initShareWeixinm(isYourSelf, customerId, username) {
        var weiXinTitle = "";
        var weiXinDesc = "专属你的学术报告";
        var weiXinLogo = "https://m.allinmd.cn/pages/column/transcript/images/shareLogo.png";
        var weiXinLink = "https://m.allinmd.cn/pages/column/transcript/transcriptStartUp.html";

        if (typeof customerId != "undefined" && customerId != "") {
            if (isYourSelf) {
                weiXinTitle = "「" + username + "」荣膺唯医风云人物，快来看看我的年度成绩报告吧！";
                weiXinLink += "?ouid=" + customerId;
            } else {
                weiXinTitle = "「" + username + "」荣膺唯医风云人物，快来看看TA的年度成绩报告吧！";
                weiXinLink += "?ouid=" + customerId;
            }
        } else {
            weiXinTitle = "2017年度报告出炉啦，快来看看吧！";
        }

		//
        // WeixinJSApi.title = function () {
        //     return weiXinTitle;
        // };
        // WeixinJSApi.desc = function () {
        //     return weiXinDesc;
        // };
		//
        // WeixinJSApi.imgUrl = function () {
        //     return weiXinLogo;
        // };
		//
        // WeixinJSApi.link = function () {
        //     return weiXinLink;
        // };
        // WeixinJSApi.init();
		shareAll({
			wxTitle:weiXinTitle,
            timeLineTitle:weiXinTitle,
			wxDesc:"专属你的学术报告",
			pic:'https://m.allinmd.cn/pages/column/transcript/images/shareLogo.png',
			url:weiXinLink,
            // 分享好友成功
            fnMessageSuc: function() {
                //微信,分享给好友
                comm.creatEvent({
                    triggerType:"功能",
                    triggerName:"个人账单-分享",
                    keyword:"微信-好友",
                    browseTypeUrl:window.location.href,
                    browType:221,
                    actionId:110481,
                    async:false
                });
            },
            // 分享朋友圈成功
            fnTimelineSuc: function() {
                //微信,分享朋友圈成功
                comm.creatEvent({
                    triggerType:"功能",
                    triggerName:"个人账单-分享",
                    keyword:"微信-朋友圈",
                    browseTypeUrl:window.location.href,
                    browType:221,
                    actionId:110481,
                    async:false
                });
            },
		}, true);
    }
});