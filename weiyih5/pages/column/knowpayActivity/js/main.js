/**
 * 功能描述：知识付费活动
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2019/4/4
 */

'use strict';

/**
 * 页面内容：
 * 1、UI页面搭建，布局+样式
 *     1）底部Logo需要展示
 *     2）发布需要弹新窗口
 * 2、参与人数
 * 3、点赞排行榜
 * 4、用户评论-精选评论（最多6条）：
 *      1）数据展示
 *      2）数据获取
 *      3）点赞交互（当前页针对同一用户只可点赞1次）
 * 5、用户评论-最新评论：
 *      1）首页最多显示10条
 *      2）点击查看更多，多展示10条
 *      3）点赞交互（当前页针对同一用户只可点赞1次）
 * 6、发布评论
 *      1）判断当前页面所在位置 APP / H5
 *      2）如果已登录则允许直接发布
 *      3）如果未登录，则要求填写手机号码
 * 7、数据埋点
 *      1）页面 uv 、pv 、根据url区分来源
 *      2）分享量
 *      3）点赞量（通过数据库统计）
 *      4）评论数（通过数据库统计）
 *      5）点击评论按钮（埋点）
 */

$(function () {
    // DOM 集合
    var DOM_OBJECT = {
        // 参与讨论人数的 dom
        discussTotal: $('#discussTotal'),
        // 点赞排行榜的 <ul></ul> 容器 dom
        favoriteRankContent: $('#favoriteRankContent'),
        // 精选评论的 <ul></ul> 容器 dom
        discussContentFeatured: $('#discussContentFeatured'),
        // 最新评论的 <ul></ul> 容器 dom
        discussContentRecent: $('#discussContentRecent'),
        // “我要评论”按钮
        ownerDiscussBtn: $('#ownerDiscussBtn'),
        // 带“发布”的弹层
        ownerDiscussContainer: $('#ownerDiscussContainer'),
        // “发布”按钮点击事件
        discussPublishBtn: $('#discussPublishBtn'),
        // 讨论输入框 textarea 的 dom
        discussTextArea: $('#discussTextArea'),
        // 讨论输入框已输入字数的计数 dom
        discussWordsTotal: $('#discussWordsTotal'),
        // 输入手机号的整个模块 dom
        discussPhoneNumberPanel: $('#discussPhoneNumberPanel'),
        // 输入手机号 input 的 dom
        discussPhoneNumber: $('#discussPhoneNumber'),
        // 关闭讨论弹层按钮 dom
        ownerDiscussCloseBtn: $('#ownerDiscussCloseBtn'),
        // “查看更多”
        discussContentMore: $('#discussContentMore'),
        // APP 中的分享按钮
        appShareBtn: $('#appShareBtn'),
        // 发布成功后弹层
        discussSuccessDialog: $('#discussSuccessDialog'),
        // 发布成功后确定按钮
        discussSuccessDialogBtn: $('#discussSuccessDialogBtn'),
        // 活动结束后弹层
        activityOverDialog: $('#activityOverDialog')
    };

    // API 集合
    var API_CONFIG = {
        // 获取参与讨论的总人数
        getDiscussTotal: {
            url: M_CALL + 'single/activity/getTotalCount/',
            type: 'get'
        },// 点赞总数排行
        getFavoriteRankData: {
            url: M_CALL + 'single/activity/getBranchList/',
            type: 'get'
        },// 精选留言
        getFeaturedDiscussData: {
            url: M_CALL + 'single/activity/getBranchList/',
            type: 'get'
        },// 最新留言
        getRecentDiscussData: {
            url: M_CALL + 'single/activity/getBranchList/',
            type: 'get'
        },// 发布评论
        insertCustomerReview: {
            url: M_CALL + 'single/activity/insertCustomerReview/',
            type: 'post'
        },// 插入点赞
        insertCustomerPrefer: {
            url: M_CALL + 'single/activity/insertCustomerPrefer/',
            type: 'post'
        },// 获取分享话术
        getShareContent: {
            url: M_CALL + 'single/activity/getShareContent/',
            type: 'get'
        }
    };

    //  数据集合
    var DATA_OBJECT = {
        // 当前页面是否在 APP 页面中
        isAppPage: false,
        // 当前访问页面的用户id，如果非登录用户，则用户id为空
        currentCustomerId: '',
        // 当前用户是否可发布评论
        canPublishComment: false,
        // 最新评论，每次查询数10条
        recentDiscussMaxResult: 10,
        // 最新评论，当前页数,从0开始计数
        recentDiscussCurrentPage: 0,
        // 最新评论，评论总数
        recentDiscussTotal: 0,
        // 是否正在加载新数据，防止重复加载
        isLoadingRecentData: false,
        // 分享话术对象
        shareObject: {
            "url": window.location.href.replace("/app/", "/m/"),
            "imgUrl": "https://m.allinmd.cn/pages/column/knowpayActivity/images/icon-share.png",
            "sinaContent": "参与话题讨论#你愿意为提升自己而知识付费吗？#，即可获得《骨科行业报告》或电子版《坎贝尔手术学》一本，留言你的观点更有千元豪礼，等你来拿！点击查看：{1}",
            "qqTitle": "我在参与唯医骨科发起的话题讨论",
            "qqContent": "留言你的观点或点赞，即可获得骨科行业报告一份，更有千元豪礼等你来拿",
            "messageTitle": "我们不贩卖焦虑，我们只做骨科教育",
            "messageFriendTitle": "我们不贩卖焦虑，我们只做骨科教育",
            "messageFriendContent": "留言你的观点或点赞，即可获得《骨科行业报告》一份，更有千元豪礼等你来拿！",
            "emailTitle": "骨科医生都在关注的话题，参与讨论，免费看千元好课",
            "emailContent": "在这个瞬息万变的时代，人们对摄取新知识的需求不断提高。作为一名骨科医生，同样面临这个问题。那么什么样的内容才被称之为知识？获取知识是否应为其付费？如何体现知识的价值？带着这些问题，让我们看看骨科医生怎么说……激烈讨论中，点击查看（超链接）↵{1}",
        }
    }
    // 业务准备
    businessPreparate();

    // 业务准备工作，获取参加讨论的人数，以及活动是否失效
    function businessPreparate() {
        // 如果活动无效，则继续后续操作
        getDiscussTotal(function (isActivityOver) {
            if (isActivityOver) {
                // 显示活动结束弹窗，不进行后续操作
                DOM_OBJECT.activityOverDialog.show();
                // 禁止滑动
                pageScrollToggle(false);
            } else {
                // 启动主逻辑
                init();
                // 判断是否在 app 中，并获取相关用户信息
                // 如果在 app 中，则显示分享按钮，并从 APP 中获取用户id
                // 如果不在 app 中，则通过 H5 的方法判断其是否已登录，并获取对应的用户id
                checkIsAppPage(function (isAppPage) {
                    if (isAppPage) {
                        DATA_OBJECT.isAppPage = isAppPage;
                        // APP内页面浏览日志埋点
                        Log.createBrowse('410',"h5付费活动页面（APP内）");
                    } else {
                        // 非APP内页面浏览日志埋点
                        Log.createBrowse('412',"h5付费活动页面（非APP内）");
                        checkLoginStatus();
                    }
                });
            }
        });
        // 初始化拓展插件
        initExtendsPlugin();
    }

    // 主逻辑启动函数
    function init() {
        // 获取分享话术
        getShareData();
        // 获取点赞排行榜的数据
        getFavoriteRankData();
        // 获取用户评论-精选评论
        getFeaturedDiscussData();
        // 获取用户评论-最新评论
        getRecentDiscussData();
        // “我要评论”按钮点击事件
        DOM_OBJECT.ownerDiscussBtn.on('click', ownerDiscussBtnOnClick);
        // “发布”按钮点击事件
        DOM_OBJECT.discussPublishBtn.on('click', discussPublishBtnOnClick);

        // 评论输入框字数监听事件
        DOM_OBJECT.discussTextArea.on('input propertychange', discussTextAreaOnChange);
        // 手机号码输入框监听事件
        DOM_OBJECT.discussPhoneNumber.on('input', discussPhoneNumberOnChange);
        // 弹层关闭按钮点击事件
        DOM_OBJECT.ownerDiscussCloseBtn.on('click', ownerDiscussCloseBtnOnClick);

        // 查看更多按钮点击事件
        DOM_OBJECT.discussContentMore.on('click', discussContentMoreOnClick);
        // APP 中分享按钮点击事件
        DOM_OBJECT.appShareBtn.on('click', appShareBtnOnClick);
        // 发布成功确定按钮点击事件
        DOM_OBJECT.discussSuccessDialogBtn.on('click', discussSuccessDialogBtnOnClick);
    }

    // 初始化扩展的插件
    function initExtendsPlugin() {
        extendsFavoriteEffect();
    }

    // 判断当前是否在 APP 内的页面
    function checkIsAppPage(callback) {
        // 如果在 APP 中，则返回 true, 同时设置用户信息
        if (window.appjs) {
            DATA_OBJECT.isAppPage = true;
            DATA_OBJECT.currentCustomerId = window.appjs.getAuthorCustomerId();
            // 设置 页面title,IOS中不设置会显示不了
            window.appjs.updateTitle(document.title);
            callback(true);
        } // 如果不在 APP 中，则返回 false
        else {
            callback(false);
        }
    }

    // 判断登录状态，用于 H5 页面中
    function checkLoginStatus() {
        user.privExecute({
            operateType: "login",
            callback: function () {
                DATA_OBJECT.currentCustomerId = TempCache.getItem('userId');
            }
        });
    }

    // 获取参与讨论的人数
    function getDiscussTotal(callback) {
        $.ajax({
            url: API_CONFIG.getDiscussTotal.url,
            type: API_CONFIG.getDiscussTotal.type,
            data: {paramJson: $.toJSON({activityId: 1})},
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    // 如果 isValid 为 0 ，或异常则提示活动结束
                    // 如果活动结束，则返回true,否则返回false
                    if (dataList && dataList.isValid) {
                        DOM_OBJECT.discussTotal.html(parseInt(dataList.totalCount) + '人参与了活动');
                        callback(false);
                    } else {
                        callback(true);
                    }
                } else {
                    callback(true);
                }
            },
            fail: function () {
                callback(true);
            }
        });
    }

    // 获取分享话术
    function getShareData() {
        $.ajax({
            url: API_CONFIG.getShareContent.url,
            type: API_CONFIG.getShareContent.type,
            data: {
                paramJson: $.toJSON({
                    id: 1
                })
            },
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    if (dataList.length > 0) {
                        var obj = dataList[0];
                        DATA_OBJECT.shareObject.emailContent = obj.emailContent; // 邮件内容
                        DATA_OBJECT.shareObject.emailTitle = obj.emailTitle;    // 邮件标题
                        DATA_OBJECT.shareObject.messageFriendContent = obj.messageFriendContent; // 微信朋友圈内容
                        DATA_OBJECT.shareObject.messageFriendTitle = obj.messageFriendTitle;  // 微信朋友圈标题
                        DATA_OBJECT.shareObject.messageTitle = obj.messageTitle;    // 微信好友标题
                        DATA_OBJECT.shareObject.messageContent = obj.messageContent; // 微信好友内容
                        DATA_OBJECT.shareObject.qqContent = obj.qqContent;   // qq 好友内容
                        DATA_OBJECT.shareObject.qqFriendContent = obj.qqFriendContent; // qq 空间内容
                        DATA_OBJECT.shareObject.qqFriendTitle = obj.qqFriendTitle;  // qq 空间标题
                        DATA_OBJECT.shareObject.qqTitle = obj.qqTitle;             // qq 好友标题
                        DATA_OBJECT.shareObject.sinaContent = obj.sinaContent;     // 新浪微博内容
                        DATA_OBJECT.shareObject.sinaTitle = obj.sinaTitle;         // 新浪微博标题
                        DATA_OBJECT.shareObject.smsContent = obj.smsContent;        // 短信内容
                        DATA_OBJECT.shareObject.smsTitle = obj.smsTitle;            // 短信标题
                        appShareBtnToggle(DATA_OBJECT.isAppPage);
                    }

                    window.shareAll && window.shareAll({
                        pic: DATA_OBJECT.shareObject.imgUrl,
                        // 发送给微信好友的title
                        wxTitle: DATA_OBJECT.shareObject.messageTitle,
                        // 发送给微信好友的desc
                        wxDesc: DATA_OBJECT.shareObject.messageContent,
                        // 发送到朋友圈的 title
                        timeLineTitle: DATA_OBJECT.shareObject.messageFriendTitle,
                        url: DATA_OBJECT.shareObject.url,
                        // 分享好友成功
                        fnMessageSuc: function () {
                            comm.creatEvent({
                                triggerType: 'h5单独付费活动页面',
                                triggerName: '点击分享按钮-站外',
                                keyword: '点击分享按钮-站外',
                                actionId: 11749,
                                browType: 410
                            });
                        },
                        // 分享朋友圈成功
                        fnTimelineSuc: function () {
                            comm.creatEvent({
                                triggerType: 'h5单独付费活动页面',
                                triggerName: '点击分享按钮-站外',
                                keyword: '点击分享按钮-站外',
                                actionId: 11749,
                                browType: 410
                            });
                        }
                    }, true);
                }

            }
        });
    }

    // 获取点赞排行榜数据
    function getFavoriteRankData() {
        var favoriteRankContent = DOM_OBJECT.favoriteRankContent;
        favoriteRankContent.html('');

        $.ajax({
            url: API_CONFIG.getFavoriteRankData.url,
            type: API_CONFIG.getFavoriteRankData.type,
            data: {paramJson: $.toJSON({firstResult: 0, upNum: 1, activityId: 1, maxResult: 3})},
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    getFavoriteRankDom(dataList);
                } else {
                    getFavoriteRankDom(null);
                }
            },
            fail: function () {
                getFavoriteRankDom(null);
            }
        })

        // 组装 dom
        function getFavoriteRankDom(data) {
            var _html = '';
            var _name = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    _name = data[i].fullName ? data[i].fullName : data[i].mobile ? data[i].mobile : data[i].customerId;
                    _html +=
                        '<li>' +
                        '<div class="item-content">' +
                        '<div class="item-content-icon">' +
                        '<div class="icon-top"><img src="./images/icon-favorite-top.png"></div>' +
                        '<div class="icon"><img src="' + (data[i].logoUrl ? data[i].logoUrl : "./images/icon-user-default.png") + '"></div>' +
                        '</div>' +
                        '<h3>' + _name + '</h3>' +
                        '<div class="item-content-favorite"><img src="./images/icon-favorite-white.png">' + data[i].upNum + '</div>' +
                        '</div>' +
                        '</li>';
                }
            } else {
                _html += "暂无数据";
            }
            favoriteRankContent.html(_html);
        }
    }

    // 获取用户评论-精选评论
    function getFeaturedDiscussData() {
        var discussContentFeatured = DOM_OBJECT.discussContentFeatured;
        discussContentFeatured.html('');

        $.ajax({
            url: API_CONFIG.getFeaturedDiscussData.url,
            type: API_CONFIG.getFavoriteRankData.type,
            data: {paramJson: $.toJSON({firstResult: 0, reviewStatus: 1, activityId: 1})},
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    discussContentFeatured.html(getDiscussDomList(dataList));
                    // 添加点赞事件监听/处理
                    addFavoriteClickEvent(discussContentFeatured);
                } else {
                    discussContentFeatured.html(getDiscussDomList(null));
                }
            },
            fail: function () {
                discussContentFeatured.html(getDiscussDomList(null));
            }
        })

    }

    // 获取用户评论-最新评论
    function getRecentDiscussData() {
        var discussContentRecent = DOM_OBJECT.discussContentRecent;

        $.ajax({
            url: API_CONFIG.getFeaturedDiscussData.url,
            type: API_CONFIG.getFavoriteRankData.type,
            data: {
                paramJson: $.toJSON({
                    firstResult: DATA_OBJECT.recentDiscussCurrentPage * DATA_OBJECT.recentDiscussMaxResult,
                    maxResult: DATA_OBJECT.recentDiscussMaxResult,
                    sortId: 3,
                    activityId: 1
                })
            },
            success: function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    DATA_OBJECT.recentDiscussTotal = data.responseObject.responseData.totalCount;
                    discussContentRecent.append(getDiscussDomList(dataList));
                    // 添加点赞事件监听/处理
                    addFavoriteClickEvent(discussContentRecent);
                    // 翻页数 +1
                    DATA_OBJECT.recentDiscussCurrentPage += 1;
                    DATA_OBJECT.isLoadingRecentData = false;
                } else {
                    discussContentRecent.html(getDiscussDomList(null));
                }
            },
            fail: function () {
                discussContentRecent.html(getDiscussDomList(null));
            }
        })
        // 添加点赞事件监听/处理
        addFavoriteClickEvent(discussContentRecent);
    }

    // “我要评论”按钮点击事件处理函数
    function ownerDiscussBtnOnClick() {
        // “我要评论”按钮点击日志
        comm.creatEvent({
            triggerType: 'h5单独付费活动页面',
            triggerName: 'h5单独付费活动页面-我要评论',
            keyword: '付费活动-我要评论',
            actionId: 11747,
            browType: 410
        });
        // 禁止页面滚动
        pageScrollToggle(false);
        // 隐藏 “我要评论” 按钮
        DOM_OBJECT.ownerDiscussBtn.hide();
        // 显示带“发布”的弹层
        DOM_OBJECT.ownerDiscussContainer.show();
        // 判断是否需要显示 “输入手机号”
        if (DATA_OBJECT.currentCustomerId === "") {
            DOM_OBJECT.discussPhoneNumberPanel.show();
        }
        // 动画效果
        DOM_OBJECT.ownerDiscussContainer.find('.owner-discuss-container').animate({top: '1.6rem'});
    }

    // “发布”按钮点击事件处理函数
    function discussPublishBtnOnClick() {
        // 校验发布内容状态
        checkDiscussPublishStatus();
        if (DATA_OBJECT.canPublishComment) {
            $.ajax({
                url: API_CONFIG.insertCustomerReview.url,
                type: API_CONFIG.insertCustomerReview.type,
                data: {
                    paramJson: $.toJSON({
                        mobile: DOM_OBJECT.discussPhoneNumber.val(),
                        customerId: DATA_OBJECT.currentCustomerId,
                        reviewContent: DOM_OBJECT.discussTextArea.val(),
                        activityId: 1
                    })
                },
                success: function (data) {
                }
            })
            // 发布成功后，会显示分享引导页
            // 动画效果
            setTimeout(function () {
                DOM_OBJECT.ownerDiscussContainer.find('.owner-discuss-container').animate({top: '100%'}, "slow", function () {
                    // 隐藏带“发布”的弹层
                    DOM_OBJECT.ownerDiscussContainer.hide();
                    DOM_OBJECT.discussSuccessDialog.show();
                    appShareBtnToggle(false);
                });
            }, 380);


        }
    }

    // 评论输入框字数变化事件处理函数
    function discussTextAreaOnChange() {
        checkDiscussPublishStatus();
        var _value = $(this).val().length;
        var _wrapArr = $(this).val().match(/\n/gi);
        var _wrap = _wrapArr ? _wrapArr.length : 0;
        var _total = _value - _wrap;
        DOM_OBJECT.discussWordsTotal.text(_total);
    }

    // 手机号码变化事件处理函数
    function discussPhoneNumberOnChange() {
        checkDiscussPublishStatus();
        $(this).val($(this).val().replace(/[^\d]/g, ''));
    }

    // 弹层关闭按钮点击事件处理函数
    function ownerDiscussCloseBtnOnClick() {
        // 允许页面拖拽
        pageScrollToggle(true);
        // 显示 “我要评论” 按钮
        DOM_OBJECT.ownerDiscussBtn.show();
        // 动画效果
        DOM_OBJECT.ownerDiscussContainer.find('.owner-discuss-container').animate({top: '100%'}, "slow", function () {
            // 隐藏带“发布”的弹层
            DOM_OBJECT.ownerDiscussContainer.hide();
        });
        return false;
    }

    // 查看更多点击事件处理函数
    function discussContentMoreOnClick() {
        var page = DATA_OBJECT.recentDiscussTotal / DATA_OBJECT.recentDiscussMaxResult;
        var hasMore = page > DATA_OBJECT.recentDiscussCurrentPage;
        if (hasMore) {
            if(!DATA_OBJECT.isLoadingRecentData){
                DATA_OBJECT.isLoadingRecentData = true;
                // 继续请求
                getRecentDiscussData();
            }
        } // 如果没有了，则禁止点击查看更多，并替换文案为“没有更多了”
        else {
            $(this).off('click');
            $(this).html('没有更多了');
        }
    }

    // APP 中分享按钮点击处理事件
    function appShareBtnOnClick() {
        // APP中分享按钮点击日志
        comm.creatEvent({
            triggerType: 'h5单独付费活动页面',
            triggerName: '点击分享按钮-站内',
            keyword: '点击分享按钮-站内',
            actionId: 11748,
            browType: 410
        });
        // 需要注意：H5页面中调用app的分享接口时，
        // 微信好友、微信朋友圈、QQ好友，QQ空间的分享话术，
        // 统一为 qqTitle 和 qqContent
        appjs && appjs.share($.toJSON({
            "url": DATA_OBJECT.shareObject.url, // 分享地址
            "imgUrl": DATA_OBJECT.shareObject.imgUrl, // 分享头图地址
            "sinaContent": DATA_OBJECT.shareObject.sinaContent, // 新浪微博内容
            "qqTitle": DATA_OBJECT.shareObject.qqTitle,  // qq标题
            "qqContent": DATA_OBJECT.shareObject.qqContent, // qq内容
            "messageContent": DATA_OBJECT.shareObject.smsContent,  // 短信内容
            "emailTitle": DATA_OBJECT.shareObject.emailTitle,  // 电子邮件标题
            "emailContent": DATA_OBJECT.shareObject.emailContent // 电子邮件内容
        }));
    }

    // 发布成功后确定按钮点击处理事件
    function discussSuccessDialogBtnOnClick() {
        window.location.href = window.location.href + '?time=' + ((new Date()).getTime());
    }

    /********************* 一些可以复用的公共方法 ************************/

    // 校验当前是否可以进行发布操作，如果不可以，则返回false，否则返回 true
    function checkDiscussPublishStatus() {
        var status = true;
        // 如果用户 id 为空，则需要判断是否填写了手机号码
        if (DATA_OBJECT.currentCustomerId === "") {
            if (DOM_OBJECT.discussPhoneNumber.val().length < 11) {
                status = false;
            }
        }
        // 如果输入框内容为空，则不允许发布
        if (DOM_OBJECT.discussTextArea.val().length <= 0) {
            status = false;
        }// 如果全为空格或全为换行，也允许发布
        else if (DOM_OBJECT.discussTextArea.val().replace(/\s+|\n+/gi, "").length <= 0) {
            status = false;
        } else if (DOM_OBJECT.discussTextArea.val().length > 200) {
            status = false;
        } else if (DOM_OBJECT.discussPhoneNumber.val().length > 11) {
            status = false;
        }

        DATA_OBJECT.canPublishComment = status;
        if (status) {
            DOM_OBJECT.discussPublishBtn.removeClass('discuss-publish-btn-disabled');
        } else {
            DOM_OBJECT.discussPublishBtn.addClass('discuss-publish-btn-disabled');
        }

    }

    /**
     * app 页面内分享按钮显示开关
     * @param showBtn
     */
    function appShareBtnToggle(showBtn) {
        // 是否需要显示 app 页面内的分享按钮
        if (showBtn) {
            DOM_OBJECT.appShareBtn.show();
        } else {
            DOM_OBJECT.appShareBtn.hide();
        }
    }

    /**
     * 页面滑动开/关
     * @param canScroll true 表示可滑动，false 为不可滑动
     */
    function pageScrollToggle(canScroll) {
        // true 为可滑动
        if (canScroll) {
            $('body').css("overflow", "auto");
            $('html').css("overflow", "auto");
            $('html').css("height", "auto");
        } else {
            $('body').css("overflow", "hidden");
            $('html').css("overflow", "hidden");
            $('html').css("height", "100%");

        }
    }

    // 获取评论的列表DOM
    function getDiscussDomList(data) {
        var _html = '';
        var _name = '';
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                _name = data[i].fullName ? data[i].fullName : data[i].mobile ? data[i].mobile : data[i].customerId;
                _html +=
                    '<li>' +
                    '<div class="content-detail-icon"><img src="' + (data[i].logoUrl ? data[i].logoUrl : "./images/icon-user-default.png") + '"></div>' +
                    '<div class="content-detail-info">' +
                    '<div class="detail-info-header">' +
                    '<h5>' + _name + '</h5>' +
                    '<div class="favorite-total" data-id="' + data[i].customerId + '" data-discuss-id="' + data[i].id + '" data-mobile="' + data[i].mobile + '">' +
                    '<span>' + data[i].upNum + '</span>' +
                    '<img src="./images/icon-favorite-orange.png">' +
                    '</div>' +
                    '</div>' +
                    '<p>' + data[i].reviewContent + '</p>' +
                    '</div>' +
                    '</li>';
            }
        } else {
            _html = '暂无数据';
        }
        return _html;
    }

    // 添加点赞事件监听/处理
    function addFavoriteClickEvent(parentDom) {
        // 获取评论的DOM列表
        var discussItemList = parentDom.find('li');
        if (discussItemList && discussItemList.length > 0) {
            for (var i = 0; i < discussItemList.length; i++) {
                (function (index) {
                    var item = $(discussItemList[index]).find('.favorite-total');
                    var curstomerId = item.attr('data-id') ? item.attr('data-id') : "0";
                    var discussId = item.attr('data-discuss-id');
                    var mobile = item.attr('data-mobile') ? item.attr('data-mobile') : "0";
                    var itemDom = $()
                    item.off('click').on('click', function () {
                        $.tipsBox({
                            obj: $(this),
                            str: "+1",
                            callback: function () {
                            }
                        });
                        item.find('span').html(parseInt(item.find('span').html()) + 1);
                        updateFavoriteData(curstomerId, discussId, mobile);
                        $(item).off('click');
                    });
                })(i);
            }
        }
        return false;
    }

    // 更新评论点赞
    function updateFavoriteData(toCustomerId, discussId, mobile) {
        $.ajax({
            url: API_CONFIG.insertCustomerPrefer.url,
            type: API_CONFIG.insertCustomerPrefer.type,
            data: {
                paramJson: $.toJSON({
                    customerId: DOM_OBJECT.curstomerId ? DOM_OBJECT.curstomerId : "0",
                    refMobile: mobile,
                    refId: discussId,
                    refCustomerId: toCustomerId,
                    activityId: 1
                })
            },
            success: function (data) {
            }
        });
    }

    /*************************** jQuery 拓展 ********************************/
    function extendsFavoriteEffect() {
        (function ($) {
            $.extend({
                tipsBox: function (options) {
                    options = $.extend({
                        obj: null, //jq对象，要在那个html标签上显示
                        str: "+1", //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                        startSize: "0.16rem", //动画开始的文字大小
                        endSize: "0.4rem", //动画结束的文字大小
                        interval: 600, //动画时间间隔
                        color: "red", //文字颜色
                        callback: function () {
                        } //回调函数
                    }, options);
                    $("body").append("<span class='num'>" + options.str + "</span>");
                    var box = $(".num");
                    var left = options.obj.offset().left + options.obj.width() / 2;
                    var top = options.obj.offset().top - options.obj.height();
                    box.css({
                        "position": "absolute",
                        "left": left + "px",
                        "top": top + "px",
                        "z-index": 9999,
                        "font-size": options.startSize,
                        "line-height": options.endSize,
                        "color": options.color
                    });
                    box.animate({
                        "font-size": options.endSize,
                        "opacity": "0",
                        "top": top - parseInt(30) + "px"
                    }, options.interval, function () {
                        box.remove();
                        options.callback();
                    });
                }
            });
        })(jQuery);
    }
});

