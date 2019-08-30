$(document).ready(function() {
    var collegeIndex = {
        changeCurriculum: {
            changeDirection: function() {
                var t = this;
                t.leftBtn = $(".schedule-turn-left");
                t.rightBtn = $(".schedule-turn-right");
                t.changeTimer = null;
                t.changeStep = 318;
                t.changeIndex = 0;
                t.residueNum = 3;
                t.centerContainer = $(".schedule-list");
                t.sumLen = $(".schedule-list .schedule-item").length;
                t.listEle = $(".schedule-list");
                t.rightBtn.off("click").on("click", function() {
                    t.leftRun();
                });
                t.leftBtn.off("click").on("click", function() {
                    t.rightRun();
                });
                return collegeIndex;
            },
            leftRun: function() {
                var t = this;
                if (t.changeIndex < t.sumLen - t.residueNum) {
                    t.changeIndex++;
                } else {
                    t.changeIndex = 0;
                }
                t.setCurrentEle();
            },
            setCurrentEle: function() {
                var t = this;
                t.listEle.find(".active").siblings().removeClass("active");
                t.listEle.find(".schedule-item").eq(t.changeIndex).addClass("active");
                t.listEle.animate({ left: -t.changeIndex * t.changeStep + 'px' }, 500);
            },
            rightRun: function() {
                var t = this;
                if (t.changeIndex > 0) {
                    t.changeIndex--;
                } else {
                    t.changeIndex = 0;
                }
                t.setCurrentEle();
            },
            jumpCollege: function () {
                $('.schedule-item').on('click',function () {
                    if($(this).attr('data-courseType')==1){//上架类型：1-预告，2-售卖
                        comm.alertBox({
                            title:'提示',
                            content:'课程即将上线，敬请期待',
                            ensure:'知道了'
                        })
                    }else{
                        var href = "//www.allinmd.cn/pages/college/college_schedule.html?courseId="+$(this).attr('data-courseId');
                        var param = href+"$"+$(this).attr('data-courseId');
                        comm.creatEvent({
                            triggerType:"PC唯医学院",
                            keyword:'点击专栏课',
                            browType:442,
                            actionId:11908,
                            param:param
                        });
                        g_sps.jump(null,href);
                    }
                })
            }
        },
        path: {
            coupon: '/call/coupon/getMaxReceivableCoupon/',
            //coupon:'/mock/call/coupon/maxReceivableCoupon',
            videoList: '/js/scene/college/college.banner.json',
            secondCourseList:"/allingateway/base-resource-platform/college/getCourseList",
            teamList: '/js/scene/college/doctor.team.json',
            courseList: '/call/medicalCollege/getCollegeInfoList/',
            "share": PC_CALL + 'comm/data/share/getMapList3/', //分享接口
        },
        changeTeamList: {
            changeDirection: function() {
                var t = this;
                t.leftBtn = $(".team-turn-left");
                t.rightBtn = $(".team-turn-right");
                t.changeTimer = null;
                t.changeStep = 191;
                t.changeIndex = 0;
                t.residueNum = 6;
                t.centerContainer = $(".team-list");
                t.sumLen = $(".team-list .team-item").length;
                t.listEle = $(".team-list");
                t.rightBtn.off("click").on("click", function() {
                    t.leftRun();
                });
                t.leftBtn.off("click").on("click", function() {
                    t.rightRun();
                });
                return collegeIndex;
            },
            leftRun: function() {
                var t = this;
                if (t.changeIndex < t.sumLen - t.residueNum) {
                    t.changeIndex++;
                } else {
                    t.changeIndex = 0;
                }
                t.setCurrentEle();
            },
            setCurrentEle: function() {
                var t = this;
                t.listEle.find(".active").siblings().removeClass("active");
                t.listEle.find(".team-item").eq(t.changeIndex).addClass("active");
                t.listEle.animate({ left: -t.changeIndex * t.changeStep + 'px' }, 500);
            },
            rightRun: function() {
                var t = this;
                if (t.changeIndex > 0) {
                    t.changeIndex--;
                } else {
                    t.changeIndex = 0;
                }
                t.setCurrentEle();
            }
        },
        data: {
            cid: $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : "",
            customerId: comm.getpara().cid,
            videoData: [],
            secondData:[],
            courseData: [],
            isInList: false,
            nowVideoData: {},
            couponInfo: {},
            teamData: {}
        },
        el: {
            teamList: $(".team-list"),
            discountCoupon: $(".discountCoupon"),
            turnDirection: $(".schedule-turn-direction"),
            scheduleList: $(".schedule-list"),
            produceList: $(".produce-list"),
            produceContainer: $(".al-college-produce"),
            produceTitle: $('.product-introduction .introduction-title'),
            videoContainer: $(".produce-inner-video"),
            priceBar: $(".priceNum"),
            secondCourse:$(".college-list")
        },
        player2: null,
        init: function() {
            ////console.log('scene.college.index.js初始化成功');
            var _this = this;
            user.login({
                callback: function() {//getCourseList
                    _this.registerHandleBars().getVideoList().getCoupon().getTeamList().shareInit().getSecondList();
                },
                scene: privilegeSceneConst.eSceneTypeLogin,
                onClose: function() {
                    g_sps.jump(null, "/");
                },
                onAuthCancel: "back" // 当点暂不认证时的处理、回退到来源页
            });
        },
        registerHandleBars: function() {
            var _this = this;
            Handlebars.registerHelper("jumpCustomer", function(v1) {
                if (parseInt(v1, 10) > 0) {
                    if (parseInt(_this.data.cid, 10) === parseInt(v1, 10)) {
                        return '/pages/personal/personal_index.html';
                    } else {
                        return '/pages/personal/others_contribution.html?cid=' + v1;
                    }

                } else {
                    return 'javascript:void(0);';
                }

            });
            Handlebars.registerHelper("checkCourseNum", function(v1,v2) {
                if(parseInt(v1,10)===parseInt(v2,10)){
                    return "hide";
                }else{
                    return  "";
                }

            });
            Handlebars.registerHelper("checkLast", function(v1,options) {
                if (parseInt(v1, 10) > 0) {
                    return options.fn(this);
                } else {
                    return  "<section class=\"college-item more\">\n" +
                        "                <section class=\"college-logo\">敬请期待...</section>\n" +
                        "            </section>";
                }

            });
            //比较数值
            Handlebars.registerHelper("state",function(v1,v2,options){
                if(v1===''){
                    return '';
                }
                if(v1==v2){
                    //满足添加继续执行
                    return options.fn(this);
                }else{
                    //不满足条件执行{{else}}部分
                    return "";
                }
            });
            return _this;
        },
        shareInit: function() {
            var t = this;
            var param = {
                "sceneType": 98, //
                "visitSiteId": 1, //1-PC
                'sessionCustomerId': $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : "",
                customerId: $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : ""
            };
            //var o = $.extend(param, {"sceneType": shareType});
            var sinaTitle = "";
            var qqTitle = "";
            var qZoneTitle = "";
            module.share({
                container: $(".ev-shareContainer"), // 存放分享组件的父级
                type: 2, // 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url: document.location.href, // 分享链接， 默认取当前页链接
                h5Url: document.location.href, //h5页面的链接会生成微信二维码
                title: "", // 分享标题
                shareTrend: 0, //0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: '', // 分享到站内动态的接口
                data: {}, // 分享到站内动态的接口参数
                callback: function() {}, // 分享到站内动态成功后回调函数
                triggerRequest: function(content) { //事件点击
                    $.ajax({
                        url: t.path.share,
                        type: "post",
                        data: { paramJson: $.toJSON(param) },
                        dataType: 'json',
                        async: false,
                        success: function(d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title = item.share_comm.shareTitle != "" ? item.share_comm.shareTitle : document.title;
                                $.each(item.share_channel, function(i, el) {
                                    if (el.shareChannel == 'Sina') {
                                        sinaTitle = content.sinaTitle = el.shareDesc;
                                    } else if (el.shareChannel == "QQFriend") {
                                        qqTitle = content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    } else if (el.shareChannel == "QZone") {
                                        qZoneTitle = content.qqZoneTitle = el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareSinaSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                }
            });
            return t;
        },
        getCoupon: function() {
            var _this = this;
            ////console.log(localStorage.getItem('userId'));
            if (localStorage.getItem('userId')) {
                $('#sesCustomerId').val(localStorage.getItem('userId'))
            }
            comm.ajax.async(_this.path.coupon, {
                paramJson: $.toJSON({
                    customerId: localStorage.getItem('userId') != "" && localStorage.getItem('userId') != undefined ? localStorage.getItem('userId') : "",
                    productId: _this.data.courseId,
                })
            }, function(data) {
                if (data && data.responseObject && data.responseObject.responseData) {
                    _this.data.couponInfo = data.responseObject.responseData;
                    _this.checkCouponStatus();
                }
            }, 'true', function() {}, 'GET');
            _this.el.discountCoupon.off("click").on("click", function() {
                $(".al-downLoadContent figcaption").text('\n' +
                    '更多大额优惠券，打开唯医骨科app查看');
                $('.Ev-al-downLoad_PopBox').show();
                $("body").css({ "overflow": "hidden" });
            });
            $(".Ev-closePopBtn").on("click", function() {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({ "overflow": "auto" });
            });
            return _this;
        },
        checkCouponStatus: function() {
            var _this = this;
            if ($.isEmptyObject(_this.data.couponInfo)) {
                //未配置优惠券
                _this.el.discountCoupon.remove();
            } else {
                ////console.log('配置优惠券');
                _this.el.discountCoupon.show();
                //配置优惠券
            }
            _this.el.discountCoupon.find(".priceNum").text(_this.data.couponInfo.couponDenomination);
            _this.el.priceBar.show();
        },
        checkNowVideo: function() {
            var _this = this;
            var selectIndex = 0;
            var videoList = _this.data.videoData.dataList;
            for (var num = 0; num < videoList.length; num++) {
                var dataItem = videoList[num];
                if (parseInt(dataItem.customerId, 10) === parseInt(_this.data.customerId, 10)) {
                    ////console.log('找到了数据');
                    _this.data.isInList = true;
                    _this.data.nowVideoData = dataItem;
                    selectIndex = num;
                }
            }
            if (!_this.data.isInList) {
                //数组里面没有当前链接所在的数据
                _this.data.nowVideoData = videoList[0];
            }
            $(".produce-list .produce-item").siblings().removeClass("active");
            $(".produce-list .produce-item").eq(selectIndex).addClass('active');
            return _this;
        },
        showVideo: function() {
            var _this = this;
            _this.el.produceTitle.html('\n' +
                '                        ' + _this.data.nowVideoData.videoTitle + '\n' +
                '                        <i class="column-line">|</i>\n' +
                '                        ' + _this.data.nowVideoData.videoProtagonist + '');
            _this.el.videoContainer.html('<video id="collegeVideo" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered"\n' +
                '                               oncontextmenu="return true">\n' +
                '                            <source src="' + _this.data.nowVideoData.videoUrl + '">\n' +
                '                        </video>');
            if (_this.player2) {
                _this.player2.player.dispose();
            }
            _this.player2 = new AllinmdPlayer('collegeVideo', {
                width: 708,
                height: 443,
                poster: _this.data.nowVideoData.magnifyImage, //播放之前需要放置的海报图片
                //IE8下使用的swf地址
                flash: {
                    swf: 'allinmdplayer.swf'
                }, //需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
                // 设置播放权限时间，使用时需保证allow值为true
                limitPlayTime: {
                    allow: false,
                    value: 3
                }, //设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                setMaxPlayTime: {
                    allow: false,
                    value: 0
                }
            }, function() {

                setTimeout(function() {
                    ////console.log("videojs对象初始化后的播放视频");
                    _this.player2.player.play();
                }, 2000);
            });
            _this.player2.player.on('ended', function() { //视频结束
                $(".produce-list .produce-item.active").next().trigger('click');
            });
            _this.el.produceContainer.show();
            _this.show_scrollTop();
            return _this;
        },
        getVideoList: function() {
            var _this = this;
            console.log('ceshi');
            comm.ajax.async(_this.path.videoList, {}, function(data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length) {
                    _this.data.videoData = data.responseObject.responseData;
                    var myTemplate = Handlebars.compile($("#produceTemplate").html());
                    _this.el.produceList.html(myTemplate(_this.data.videoData));
                    _this.checkNowVideo().showVideo().initTabVideo();
                    _this.el.produceList.scroll(function(e) {
                        ////console.log(e);
                        //do something...

                    });
                }
            }, 'true', function() {}, 'GET');
            comm.ajax.async(_this.path.videoList, {}, function(data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length) {
                    _this.data.videoData = data.responseObject.responseData;
                    var myTemplate = Handlebars.compile($("#produceTemplate").html());
                    _this.el.produceList.html(myTemplate(_this.data.videoData));
                    _this.checkNowVideo().showVideo().initTabVideo();
                    _this.el.produceList.scroll(function(e) {
                        ////console.log(e);
                        //do something...

                    });
                }
            }, 'true', function() {}, 'GET');
            return _this;
        },
        getSecondList:function(){
            var _this = this;
            comm.ajax.async(_this.path.secondCourseList, {}, function(data) {
                if (data && data && data.responseData) {
                    _this.data.secondData = data.responseData;
                    //console.log(data.responseObject.responseData);
                    var myTemplate = Handlebars.compile($("#secondCollege").html());
                    _this.el.secondCourse.html(myTemplate(_this.data.secondData));
                    $(".college-item").off("click").on("click",function(){
                        var _thisElement = $(this);
                        if($(this).hasClass('more')){//上架类型：1-预告，2-售卖
                            comm.alertBox({
                                title:'提示',
                                content:'学院即将上线，敬请期待',
                                ensure:'知道了'
                            })
                        }else{
                            switch (_thisElement.attr("data-departmentName")) {
                                case "关节学院":
                                    comm.creatEvent({
                                        triggerType:"PC唯医学院",
                                        keyword:'点击关节学院图标',
                                        browType:442,
                                        actionId:11904
                                    });
                                    break;
                                case "创伤学院":
                                    comm.creatEvent({
                                        triggerType:"PC唯医学院",
                                        keyword:'点击创伤学院图标',
                                        browType:442,
                                        actionId:11905
                                    });
                                    break;
                                case "运动学院":
                                    comm.creatEvent({
                                        triggerType:"PC唯医学院",
                                        keyword:'点击运动学院图标',
                                        browType:442,
                                        actionId:11906
                                    });
                                    break;
                                case "保膝学院":
                                    comm.creatEvent({
                                        triggerType:"PC唯医学院",
                                        keyword:'点击保膝学院图标',
                                        browType:442,
                                        actionId:11907
                                    });
                                    break;
                            }
                            console.log(g_sps.jump);
                            g_sps.jump(null,"//www.allinmd.cn/pages/college/second_college.html?collegeId="+$(this).attr('data-departmentId'));
                        }
                    });
                    //显示专栏课程的逻辑
                    console.log(_this.data.secondData);
                    if(_this.data.secondData.seriesCourseList.length){
                        var mycollegeTemplate = Handlebars.compile($("#courseTemplate").html());
                        _this.el.scheduleList.html(mycollegeTemplate(_this.data.secondData));
                        $('.al-college-schedule .teamd-introduction span').html('已上线'+_this.data.secondData.seriesCourseList.length+'个课程，持续更新中');
                        $("[data-coursetype='1']").removeAttr("target");
                        _this.changeCurriculum.changeDirection();
                        _this.changeCurriculum.jumpCollege();//判断能否跳转到学院课程页
                        //console.log(_this.data.secondData.seriesCourseList.length);
                        if (_this.data.secondData.seriesCourseList.length > 3) {
                            _this.el.turnDirection.show();
                        } else {
                            _this.el.turnDirection.hide();
                        }
                    }
                }
            }, 'true', function() {}, 'GET');
            return _this;
        },
        show_scrollTop: function() {
            var li_height = $(".produce-item").outerHeight(); //li的高度，包括border;
            var ul = $(".produce-item.active").parent(); //li的父级 ul
            var index = 0; //记录第几个li被选中
            for (var i = 1; i <= ul.children().length; i++) {
                if ($(ul.children()[i - 1]).hasClass("active")) { //如果这个li为选中的li
                    index = i;
                    break;
                }
            }

            if (index > 4) { //不在可视区，页面上从第8个开始就不再可视区
                var top = (index - 4) * li_height * 2;
                ////console.log(top);
                ul.scrollTop(top); //设置overflow-y：scroll 这个元素的scrollTop()
            }
        },
        getTeamList: function() {
            var _this = this;
            comm.ajax.async(_this.path.teamList, {}, function(data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length) {
                    ////console.log('team数据', data);
                    _this.data.teamData = data.responseObject.responseData;
                    var myTemplate = Handlebars.compile($("#teamItem").html());
                    _this.el.teamList.html(myTemplate(_this.data.teamData));
                    _this.changeTeamList.changeDirection()
                }
            }, 'true', function() {}, 'GET');
            return _this;
        },
        getCourseList: function() {
            var _this = this;
            comm.ajax.async(_this.path.courseList, {
                paramJson: $.toJSON({
                    opUsr: $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : "",
                    firstResult: 0,
                    maxResult: 1000
                })
            }, function(data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length) {
                    _this.data.courseData = data.responseObject.responseData.dataList[0];
                    if (_this.data.courseData && _this.data.courseData.courseList && _this.data.courseData.courseList.length > 3) {
                        _this.el.turnDirection.show();
                    } else {
                        _this.el.turnDirection.hide();
                    }
                    var countNum = 0;
                    for(var num = 0;num<_this.data.courseData.courseList.length;num++){
                        var dataItem = _this.data.courseData.courseList[num];
                        if(parseInt(dataItem.courseType,10)===2){
                            countNum++;
                        }
                    }

                    var myTemplate = Handlebars.compile($("#courseTemplate").html());
                    _this.el.scheduleList.html(myTemplate(_this.data.courseData));
                    $("[data-coursetype='1']").removeAttr("target");
                    _this.changeCurriculum.changeDirection();
                    _this.changeCurriculum.jumpCollege();//判断能否跳转到学院课程页
                }
            }, 'true', function() {}, 'GET');
            return _this;
        },
        initTabVideo: function() {
            var _this = this;
            $('.produce-item').off("click").on('click', function() {
                var _thisElement = $(this);
                _thisElement.siblings().removeClass("active");
                _thisElement.addClass("active");
                _this.data.nowVideoData = _this.data.videoData.dataList[_thisElement.index()];
                _this.showVideo();
            })
        }
    };
    collegeIndex.init();

});
