/**
 * @Desc：普通用户
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
        userName = ownTranscriptData && ownTranscriptData.customerName, //登录用户的用户id

        otherUserId = localStorage.getItem("otherUserId"),
        waterAudio = document.getElementById('waterAudio');       //查看他人的用户id.
    //alert(ownTranscriptData.customerName);
    // console.log(ownTranscriptData);
    if (otherUserId && (userId !== otherUserId) && !!otherUserId) { //查看他人的成绩
        $(".transcriptBg").addClass("normalUserTA");//切换我的 Ta的 图片
        var swiperObject = new Swiper('.swiper-container', {
            //pagination: '.swiper-pagination',
            // paginationClickable: true,
            direction: 'vertical',
            speed: 80,
            onSlideChangeEnd: function (_swiper) {
                console.log(_swiper.activeIndex); //切换结束时，告诉我现在是第几个slide
                if (_swiper.activeIndex === 1) {
                    waterAudio.play();
                }
                // _swiper.slides.css({opacity: 0});
                // _swiper.slides.eq(_swiper.activeIndex).css({opacity: 1});
                !waterAudio.paused && waterAudio.pause();//如果未暂停,则暂停
            }
        });
        swiperObject.removeSlide(0);
        $(".continueBtn a").click(function () {
            swiperObject.slideTo(1, 500, false);//切换到第一个slide，速度为1秒
            swiperObject.slides.eq(1).css({opacity: 1});
            return false;
        });
        setNormalData(otherTranscriptData);
        /*普通用户还是KOL用户*/
        $(".mineBtn a,.normalUserP8 .checkBtn").click(function (e) {
            if(e.target.tagName.toLowerCase() == "img"){
                //个人账单尾-点击查看我的报告
                comm.creatEvent({
                    triggerType:"功能",
                    triggerName:"个人账单尾-点击查看我的报告",
                    browType:222,
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
                    browType:222,
                    actionId:110479,
                    async:false
                });
            }
            localStorage.removeItem("otherUserId");
            localStorage.removeItem("otherTranscriptData");
            // 不存在我的id
            if (!userId) {
                localStorage.setItem("fromPage", "//m.allinmd.cn/pages/column/transcript/jump.html");
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
                    if (data.responseObject.responseStatus === true) {
                        var ownTranscriptData = data.responseObject.responseData.data_list[0];
                        localStorage.setItem("ownTranscriptData", JSON.stringify(ownTranscriptData));
                        if (ownTranscriptData.customerType == 1) {
                            //console.log("kol用户");
                            window.location.href = "/pages/column/transcript/KOL.html#";
                            return false;
                            // kol用户
                        } else if (ownTranscriptData.customerType == 2) {
                            // 普通用户
                            //console.log("普通用户");
                            window.location.href = "/pages/column/transcript/normalUser.html";
                            return false;
                        }
                    } else {
                        //console.log("无数据");
                        window.location.href = "newUser.html";
                        return false;
                    }
                });
                return false;
            } else if (ownTranscriptData.customerType == 1) {
                window.location.href = "/pages/column/transcript/KOL.html";
                return false;
                // kol用户
            } else if (ownTranscriptData.customerType == 2) {
                // 普通用户
                window.location.href = "/pages/column/transcript/normalUser.html";
                return false;
            } else {
                console.log("无数据");
                window.location.href = "newUser.html";
                return false;
            }
            return false;
        });
        $(".erweima").addClass("hide");
        $(".erweimaText").addClass("hide");

        initShareWeixinm(false, otherUserId, otherTranscriptData.customerName, otherTranscriptData.customerNumber);
    } else { //查看自己的成绩
        /*查看是否登录*/
        if (!ownTranscriptData || !userId){
            localStorage.setItem("fromPage", "//m.allinmd.cn/pages/column/transcript/jump.html");
            localStorage.setItem("fromPageN", "//m.allinmd.cn/pages/column/transcript/jump.html");
            window.location.href = "/pages/passport/loginV2/login.html";
            return false;
        }
        var swiperObject = new Swiper('.swiper-container', {
            // pagination: '.swiper-pagination',
           // paginationClickable: true,
            direction: 'vertical',
            speed: 80,
            onSlideChangeEnd: function (_swiper) {
                console.log(_swiper.activeIndex); //切换结束时，告诉我现在是第几个slide
                if (_swiper.activeIndex === 1) {
                    waterAudio.play();
                }
                !waterAudio.paused && waterAudio.pause();//如果未暂停,则暂停


                //如果用户是2017年新用户或者 关注的专家或者内容小于指定值则第6页不显示不显示
                // //微信分享引导页
                if(is_weixn()){
                    var followTag = ownTranscriptData.followTag && ownTranscriptData.followTag.split(","); //关注标签   新增关注内容
                    var followContent = ownTranscriptData.followContent && ownTranscriptData.followContent.split(",");  //  新关注的专家
                    if ((ownTranscriptData.authDate && ownTranscriptData.authDate.substring(0, 4) === "2017") || (followContent && followContent.length < 3) || (followTag && followTag.length < 3) || (!followContent && !followTag)) {
                        if (_swiper.activeIndex === 6) {
                            setTimeout(function () {
                                if (_swiper.activeIndex === 6) {
                                    $(".sharePopup").removeClass("hide");
                                    $(".sharePopup").on("touchstart", function () {
                                        $(".sharePopup").addClass("hide");
                                    })
                                }
                            }, 3000)
                        }
                    }else{
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
            }
        });
        swiperObject.removeSlide(1);

        setNormalData(ownTranscriptData, true);
        $(".checkBtn").addClass("hide");
        jQuery('#qrcodeCanvas').qrcode({
            text: "https://m.allinmd.cn/pages/column/transcript/transcriptStartUp.html?ouid=" + userId
        });
        $(".normalUserP8").one("click", function () {
            var transcriptBgMargintTop = $(".transcriptBg").css("marginTop");
            $(".transcriptBg").css({"marginTop": 0});
            $(".transcriptBg .normalUserP8 article .userDetail img").css({"border":"none"})
            convert2canvas($("#myKeywords"));
            $(".transcriptBg").css({"marginTop": transcriptBgMargintTop})
        });
        initShareWeixinm(true, userId, userName || (ownTranscriptData && ownTranscriptData.customerName), ownTranscriptData && ownTranscriptData.customerNumber);
    }

    function setNormalData(data, isMySelf) {
        var isWho = isMySelf ? "我" : "TA";
        data.customerName && $(".userName").text(data.customerName); // '医生名称',
        data.compayName && $(".userCompany").text(data.compayName); // '医院名称',
        data.browseTime && $(".learnTimes").html("<span>" + data.browseTime + "</span><i>小时</i>");  //累计访问时间（小时）',
        data.studyTime && $(".p3_win01 .column01").text(data.studyTime && data.studyTime.substr(0, 10).replace(/-/g,'.'));  // '离3点最近的在线访问时间',
        data.studyTime && $(".p3_win01 .column03 span").text(data.studyTime.substr(11, 8));  // '离3点最近的在线访问时间',
        $(".p3_win02 p:first-of-type").text(isWho + "最爱学习的内容是");//'学习时间最长资源名称',
        data.studyResourceName && $(".p3_win02 p:last-of-type").text("《" + stringLimitLength(data.studyResourceName, 40, '...') + "》");//'学习时间最长资源名称',
        $(".normalUserP4 p:nth-child(1) ").text(isWho + "今年一共参加了");
        // '学习会议总和',
        data.browseConferenceNum && $(".normalUserP4 p:nth-child(2) ").html("<span>" + data.browseConferenceNum + "</span>次线上会议");
        data.conferenceSaveTime && $(".normalUserP4 p:nth-child(3)").html("节省下来<span>" + data.conferenceSaveTime + "</span>小时，<br>让我们一起陪陪家人。<br>生活不止有工作，还有诗和远方。")

        if (data.highestResourceUv) {
            $(".p5_win01").removeClass("oops");
            $(".p5_win01 p").html("有<span>" + data.highestResourceUv + "</span>人和" + isWho + "同时在看 《" + stringLimitLength(data.highestResourceName, 40, "...") + "》")
        }
        if (data.searchKeywordNum) { //'搜索词次数',
            $(".p5_win02").removeClass("oops");
            $(".p5_win02 p").html("和" + isWho + "一起查" + '"' + data.searchKeyword + '"' + "有<span>" + data.searchKeywordNum + "</span>人")
        } else {
            $(".p5_win02 p").html("<span>oops</span>，2017年" + isWho + "还<br>没有搜索过学术热词")
        }


        data.sameCustomerFirstLogo && $(".normalUserP6 li:first-of-type  .userImg img").attr('src', data.sameCustomerFirstLogo);//头像
        data.sameCustomerFirstName && $(".normalUserP6 li:first-of-type  .userText p:first-of-type").html(data.sameCustomerFirstName);
        // 如果没有医生名字,则不显示医院名字
        data.sameCustomerFirstName && data.compayName && $(".normalUserP6 li:first-of-type  .userText p:last-of-type").html(data.compayName);

        data.sameCustomerSecondLogo && $(".normalUserP6 li:last-of-type  .userImg img").attr("src", data.sameCustomerSecondLogo);//头像
        data.sameCustomerSecondName && $(".normalUserP6 li:last-of-type  .userText p:first-of-type").html(data.sameCustomerSecondName);
        // 如果没有医生名字,则不显示医院名字
        data.sameCustomerFirstName && data.compayName && $(".normalUserP6 li:last-of-type  .userText p:last-of-type").html(data.compayName);

        $(".normalUserP6 .p6_win03 p:last-of-type").html(data.sameCustomerContent);


        var followTag = data.followTag && data.followTag.split(","); //关注标签   新增关注内容
        if (followTag && followTag.length > 0 && followTag[0] != "") {
            $(".p7_win02 li:nth-of-type(1) p").text(followTag[0]);
            if (followTag[1] != "") {
                $(".p7_win02 li:nth-of-type(2) p").text(followTag[1]);
                if (followTag[2] != "") {
                    $(".p7_win02 li:nth-of-type(3) p").text(followTag[2]);
                } else {
                    $(".p7_win02 li:last-of-type").remove();
                }
            } else {
                $(".p7_win02 li").not(":first").remove();
            }
        } else {
            $(".p7_win02 li").remove();
        }


        var followContent = data.followContent && data.followContent.split(",");  //  新关注的专家
        if (followContent && followContent.length > 0 && followContent[0] != "") { //如果第一个元素不为空
            $(".p7_win03 li:nth-of-type(1)")/*.css({"paddingLeft":Math.floor(Math.random()*1)+1+"rem"})*/.find("p").text(followContent[0]); ///*设置随机距离*/
            if (followContent[1] != "") {
                $(".p7_win03 li:nth-of-type(2)")/*.css({"paddingLeft":Math.floor(Math.random()*1)+1+"rem"})*/.find("p").text(followContent[1]);
                if (followContent[2] != "") {
                    $(".p7_win03 li:nth-of-type(3)")/*.css({"paddingLeft":Math.floor(Math.random()*1)+1+"rem"})*/.find("p").text(followContent[2]);
                } else {
                    $(".p7_win02 li:last-of-type").remove();
                }
            } else {
                $(".p7_win03 li").not(":first").remove();
            }
        } else {
            $(".p7_win03 li").remove();
        }

        //如果用户是2017年新用户或者 关注的专家或者内容小于指定值则该页不显示
        if ((data.authDate && data.authDate.substring(0, 4) === "2017") || (followContent && followContent.length < 3) || (followTag && followTag.length < 3) || (!followContent && !followTag)) {
            swiperObject.removeSlide(6);
        }


        /*年度关键词,最后一个关键词最先显示*/
        var customerKeyword = data.customerKeyword && data.customerKeyword.split(",");
        if (customerKeyword && customerKeyword.length === 3 && customerKeyword[2] !== "") {
            customerKeyword[2] && $(".normalUserP8 .keywordTextTop").text(customerKeyword[2]);
            customerKeyword[1] && $(".normalUserP8 .keywordTextLeft").text(customerKeyword[1]);
            customerKeyword[0] && $(".normalUserP8 .keywordTextRight").text(customerKeyword[0]);
        } else if (customerKeyword && customerKeyword.length === 2 && customerKeyword[1] !== "") {
            customerKeyword[1] && $(".normalUserP8 .keywordTextTop").text(customerKeyword[1]);
            customerKeyword[0] && $(".normalUserP8 .keywordTextLeft").text(customerKeyword[0]);
        } else if (customerKeyword && customerKeyword.length === 1 && customerKeyword[0] !== "") {
            customerKeyword[0] && $(".normalUserP8 .keywordTextTop").text(customerKeyword[0]);
        }

        function keywordLen(dom) {
            if(dom.text().length <= 4){
                dom.css('fontSize','0.66rem')
            }else{
                dom.css('fontSize','0.45rem')
            }
        }
        keywordLen($('.keywordTextLeft'))
        keywordLen($('.keywordTextRight'))

        // customerKeyword[0] && $(".normalUserP8 .keywordTextTop").text(customerKeyword[0]);
        // customerKeyword[1] && $(".normalUserP8 .keywordTextLeft").text(customerKeyword[1]);
        // customerKeyword[2] && $(".normalUserP8 .keywordTextRight").text(customerKeyword[2]);

        $(".normalUserP8 .title").text(isWho + "的年度关键词");
        data.customerName && $(".normalUserP8 .nameText").text(data.customerName);
        data.compayName && $(".normalUserP8 .hospitalText").text(data.compayName);
        data.customerLogo && $(".normalUserP8  .userDetail figure img").attr("src", data.customerLogo);
        var synthesizedRanking = data.customerNumber; //普通用户字段修复
        if(synthesizedRanking){
            if(synthesizedRanking>99.9){
                synthesizedRanking=99.9
            }else if(synthesizedRanking<5){
                synthesizedRanking="5.0"
            }else{
                synthesizedRanking=parseFloat(synthesizedRanking).toFixed(1);//转为float后,截取1位
            }
            $(".normalUserP8 .comprehensive").text("综合指数超过了" + synthesizedRanking + "%用户"); //综合指数
        }
    }

    function initShareWeixinm(isYourSelf, customerId, username, customerNumber) {
        var weiXinTitle = "";
        var weiXinDesc = "专属你的学术报告";
        var weiXinLogo = "https://m.allinmd.cn/pages/column/transcript/images/shareLogo.png";
        var weiXinLink = "https://m.allinmd.cn/pages/column/transcript/transcriptStartUp.html";

        if (typeof customerId != "undefined" && customerId != "") {
            if (isYourSelf) {
                weiXinTitle = "「" + username + "」的勤勉度超越了全国「" + parseFloat(customerNumber).toFixed(2) + "%」的骨科医师，快来看看我的年度学习报告吧！";
                weiXinLink += "?ouid=" + customerId;
            } else {
                weiXinTitle = "「" + username + "」的勤勉度超越了全国「" + parseFloat(customerNumber).toFixed(2) + "%」的骨科医师，快来看看TA的年度学习报告吧！";
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
            }
		}, true);
    }

});