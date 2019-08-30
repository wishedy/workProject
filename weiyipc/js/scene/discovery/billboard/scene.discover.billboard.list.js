/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/04/19
 * @author: zhangheng
 */
$(document).ready(function () {
    var tool = {
        "getUrlName": function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        }
    };
    var arrange = {
        opt: {
            url: PC_CALL + "",  //专家请求列表
            mayKnowUrl: PC_CALL + 'customer/pundits/getRecommendedmayKnowPundits/', //可能认识的专家
            applyAuth: PC_CALL + 'customer/pundits/apply/create/',               //申请权威专家
            searchByName: PC_CALL + "customer/pundits/getSearchPunditsCustomerName/",   //通过权威专家名称搜索结果
            doctorList: PC_CALL + "customer/pundits/getPunditsCustomerList/",       //专家列表
            getShareContent: PC_CALL + 'comm/data/share/getMapList3/'
        },
        authApplyProtext: function () {
            var t = this;
            var cid;
            $('.ev_applyNow').click(function () {
                cid = $('#sesCustomerId').val();
                user.login({
                    callback:function(){
						if (cid != undefined && cid != "") {//已登录
							if($("#sesAuth").val() == 2||$("#sesAuth").val()==7||$("#sesAuth").val()==8||$("#sesAuth").val()==9){

								$('.al-discoverZj_login').hide();
								$('.al-discover_sidebarMain').show();
								t.applyAuthorSubmit();
								t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
							}else{
								$('.al-discoverZj_login').hide().eq(1).show();
								if($("#sesAuth").val() == 1){//v1待审核
									$(".al-authState").html('<i></i>V1审核中');
								}
							}
							comm.Log.createBrowse({href: location.href, id: 179, name: '上榜申请'});
						} else {//未登录
							$('.al-discoverZj_login').hide().eq(2).show();
							$('.ev_loginNow').click(function () {//点击登录
								user.login({
									callback: function () {
										$('.al-discoverZj_login').hide();
										$('.al-discover_sidebarMain').show();
										t.applyAuthorSubmit();
										t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
									},
									onAuthCancel: function () {
										$('.module-user').remove();
										$('#lightbox').hide();
										$('.al-discoverZj_login').hide().eq(1).show();
									},
									privCheckFailed: function () {
										$('.module-user').remove();
										$('#lightbox').hide();
										$('.al-discoverZj_login').hide().eq(1).show();
									},
									scene: privilegeSceneConst.eSceneTypeAuth
								})
							});
						}
                    },
					scene:privilegeSceneConst.eSceneDoctorOnly
				});

            });
            $('.ev_authNow').on('click', function () {
                user.login({
                    callback:function(){
                        $('.al-discoverZj_login').hide();
                        $('.al-discover_sidebarMain').show();
                        t.applyAuthorSubmit();
                        t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
                    },
                    scene: privilegeSceneConst.eSceneTypeAuth,
                    onAuthCancel:function(){
                        $('.module-user').remove();
                        $('#lightbox').hide();
                        $('.al-discoverZj_login').hide().eq(1).show();
                    }
                });
            });

        },
        applyAuthorSubmit: function () {
            var t = this;
            var checkNumber = function (no) {
                if((/^1\d{10}$/.test(no))){
                    return true;
                }else{
                    return false;
                }
            };
            var applyCustomerName = '',
                applyMobile = '',
                applyReason = '',
                noEmpty = true;
            $('.ev_applicant').val(($.cookie('applyName') != "" && $.cookie('applyName') != undefined ? $.cookie('applyName') : $('#sesCustomerId').data('name')));//初始化名字，电话,如果有cookie,取cookie,没有取默认
            $('.ev_applicantNo').val(($.cookie('applyNumber') != "" && $.cookie('applyNumber') != undefined ? $.cookie('applyNumber') : $('#sesCustomerId').data('mobile')));
            $('.ev_tx').val(($.cookie('applyReason') != "" && $.cookie('applyReason') != undefined ? $.cookie('applyReason') : ""));
            function highlight(){
                var nameInfo = $(".ev_applicant").val();
                var phoneNum = $(".ev_applicantNo").val();
                var applyInfo = $(".ev_tx").val();
                var nameOnOff = false;
                var phoneOnOff = false;
                var nameTest = function(s){
                    if (s.length > 0) {
                        if (/^\s|^\.|^\▪|^\·|\s$|\.$|\▪$|\·$/.test(s)) {
                            nameOnOff = false;
                        } else {
                            if (/^[\u4e00-\u9fa5\s\.\▪\·]{1,25}$|^[A-Za-z\s\.\▪\·]{1,50}$|^([A-Za-z\s\.\▪\·]|[\u4e00-\u9fa5\s\.\▪\·]){1,50}$/.test(s)) {
                                for (var i = 0; i < s.length; i++) {
                                    if (s[i] == ' ' && s[i + 1] == ' ') {
                                        nameOnOff = false;
                                        return;
                                    }
                                }
                                nameOnOff = true;
                            } else {
                                nameOnOff = false;
                            }
                        }
                    } else {
                        nameOnOff = false;
                    }
                };
                nameTest(nameInfo);
                var testPh =    function(no){
                    if((/^1\d{10}$/.test(no))){
                        phoneOnOff = true;
                    }else{
                        phoneOnOff = false;
                    }
                };
                testPh(parseInt(phoneNum));
                var applyOnOff = applyInfo.length>0;

                if(nameOnOff&&phoneOnOff&&applyOnOff){
                    $(".al-applySubmit").removeClass("al-submit-invalid");
                }else{
                    $(".al-applySubmit").addClass("al-submit-invalid");
                }
                return nameOnOff&&phoneOnOff&&applyOnOff;

            }
            if(comm.browser.isIe8()){
                $(".ev_applicant").attr({"placeholder":""});
                $(".ev_applicantNo").attr({"placeholder":""});
                $(".ev_tx").attr({"placeholder":""});
            }
            $(".ev_applicant").off("input propertychange").on("input propertychange",function(){
                highlight();
            });
            $(".ev_applicantNo").off("input propertychange").on("input propertychange",function(){
                highlight();
            });
            $(".ev_tx").off("input propertychange").on("input propertychange",function(){
                highlight();
            });
            $('.ev_applySub').off('click').click(function () {
                if ($(this).attr('disable') == 'true') {
                    return false;
                } else {

                    noEmpty = true;
                    applyCustomerName = $.trim($('.ev_applicant').val());
                    applyMobile = $.trim($('.ev_applicantNo').val());
                    applyReason = $.trim($('.ev_tx').val());
                    $.each($('.ev_apply'), function (i, e) {
                        if ($(e).val() == "" || $(e).val() == "请描述你的优势") {
                            noEmpty = false;
                            $(e).focus();
                            return;
                        }
                    });
                    if (!checkNumber(applyMobile)) {
                        $('.ev_applicantNo').focus();
                        noEmpty = false;
                    }
                    var _params = {
                        customerId: $('#sesCustomerId').val(),
                        customerName: $('#sesCustomerId').data('name'),
                        applyCustomerName: applyCustomerName,
                        applyMobile: applyMobile,
                        applyReason: applyReason,
                        updatePlatformId: $('#sesDepartment').val() || 1
                    };

                    if (noEmpty === true) {
                        comm.LightBox.showloading();
                         comm.creatEvent({
                            triggerType:'榜单',
                            triggerName:'发送',
                             browType:179,
                            actionId:11062
                        });
                        $('.ev_applySub').attr('disable', 'true');
                        $.ajax({
                            url: t.opt.applyAuth,
                            type: "post",
                            data: {paramJson: $.toJSON(_params)},
                            dataType: 'json',
                            success: function (d) {
                                comm.LightBox.hideloading();
                                $('.ev_applySub').attr('disable', 'false');
                                $('.ev_tx').val("");
                                $('.al-discover_sidebarMain').hide();
                                $('.al-discoverZj_login').hide().eq(0).show();
                                $.topTip({mark: "success", showTime: 2, content: "发送成功，请静候佳音"});
                                $.removeCookie('applyName');
                                $.removeCookie('applyNumber');
                                $.removeCookie('applyReason');
                            },
                            error: function () {
                                comm.LightBox.hideloading();
                                $('.ev_applySub').attr('disable', 'false');
                            }
                        });
                    }
                }
            });
            $('.ev_cancelApply').off('click').click(function () {
                applyCustomerName = $.trim($('.ev_applicant').val());
                applyMobile = $.trim($('.ev_applicantNo').val());
                applyReason = $.trim($('.ev_tx').val());
                if (applyCustomerName != "" || applyMobile != "" || applyReason != "") {
                    $.makeSurePopup({
                        title: "放弃编辑",//弹窗标题
                        content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                        content: "",//弹窗内容
                        url: "",//ajax请求接口（可不传，不传就不发请求）
                        param: "",//ajax请求参数(可不传)
                        toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                        callback: function () {
                            $('.ev_tx').val("");
                            $('.al-discover_sidebarMain').hide();
                            $('.al-discoverZj_login').hide().eq(0).show();
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error: function () {
                        }//ajax请求失败后执行的方法(可不传)
                    });
                } else {
                    $('.al-discover_sidebarMain').hide();
                    $('.al-discoverZj_login').hide().eq(0).show();
                }
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "申请上榜取消",
                    browType: 114,
                    actionId: 45
                });
            })
        },
        authApplyLeave: function () {
            var t = this;
            var applyCustomerName = $.trim($('.ev_applicant').val());
            var applyMobile = $.trim($('.ev_applicantNo').val());
            var applyReason = $.trim($('.ev_tx').val());
            var leaveApply = function(){
                if($(".al-discover_sidebarMain").css("display")=="block"){
                    $(".ev_cancelApply").trigger("click");
                }
            };
            $(".ev-tabRank").off("mousedown").on("mousedown",function(){
                leaveApply();
            });
            $(".ev-recommendTabRank").off("mousedown").on("mousedown",function(){
                leaveApply();
            });
            $('body a').not('.ev_applySub, .ev_cancelApply, .ev_applyNow, .ev_authNow').on('click', function (e) {
                if ($('.ev_apply').is(':visible')) {
                    if (!$(this).hasClass('al-followBtn') && $(this).attr('target') != '_blank') {//不是关注按钮
                        var href = $(this).attr('href');
                        if (applyCustomerName != "" || applyMobile != "" || applyReason != "") {
                            $.makeSurePopup({
                                title: "放弃编辑",//弹窗标题
                                content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                                content: "",//弹窗内容
                                url: "",//ajax请求接口（可不传，不传就不发请求）
                                param: "",//ajax请求参数(可不传)
                                toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                                callback: function () {
                                    $.topTip({mark: "success", showTime: 2, content: "您的申请信息已被保存，下次可以继续编辑"});
                                    $.cookie('applyName', $.trim($('.ev_applicant').val()), {expires: 365});
                                    $.cookie('applyNumber', $.trim($('.ev_applicantNo').val()), {expires: 365});
                                    $.cookie('applyReason', $.trim($('.ev_tx').val()), {expires: 365});
                                    setTimeout(function () {
                                        g_sps.jump(null, href);
                                    }, 2000);

                                },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                                error: function () {
                                }//ajax请求失败后执行的方法(可不传)
                            });
                            return false;
                        } else {
                            //return false;
                        }
                    }
                    //e.preventDefault();
                }
            });

        },
        ele: {
            "describe": "页面初始化存在的静态元素",
            "rule": $(".ev-checkRule"),//查看规则按钮
            "tab": $(".ev-tabRank"),//顶部个榜单tab栏
            "contributionsTitle":$(".al-contributions .title"),
            "contributions": $(".al-contributions ul"),
            "recommendTab": $(".ev-recommendTabRank"),//推荐榜单下面的分类tab栏
            "allContent":$(".contributionLeft"),
            "rankContainer": $(".al-rankContainer .al-rankList"),//榜单html容器
            "banner": $(".al-rankBanner"),
            "customerObj": $("#sesCustomerId"),
            "auth": $("#sesAuth"),
            "praise": null,
            "myRank":$(".ranking"),
            "returnBack": $(".al-returnBack a")
        },
        template: {
            "describe": "页面所有逻辑使用的字符串模板",
            produce: function (type, data) {
                /*
                 * 函数名称：produce
                 * 描述：产生html字符串，不做任何逻辑判断
                 * 参数说明：
                 * -------1、type,规定要产生的模板类型，string,必须
                 * -------2、data，动态数据，array,必须
                 * 返回值说明：
                 *  -------1、htmlStr，返回相应类型的html字符串，string
                 * */
                //调用示例：produce("pay",data)
                var str = "";
                for (var typeNum = 0; typeNum < type.length; typeNum++) {
                    str += this.demo[type[typeNum]];
                }
                String.prototype.temp = function (obj) {
                    return this.replace(/\$\w+\$/gi, function (matchs) {
                        var returns = obj[matchs.replace(/\$/g, "")];
                        return (returns + "") == "undefined" ? "" : returns;
                    });
                };
                var htmlStr = "";
                for (var i = 0; i < data.length; i++) {
                    htmlStr += str.temp(data[i]);
                }
                return htmlStr;
            },
            "demo": {
                listNone:'<li class="listNone">'+
                '                        <img src="/images/img10/v3/discover/billboard/listNone.png">'+
                '                    </li>',
                "rules": "<section class=\"rule\" style=\"display:block;\" >" +
                "<section class=\"illustrate\">" +
                "<aside class=\"title\">规则说明<i class=\"al-close-rule\"></i></aside>" +
                "<section class=\"illustrateCont\">" +
                "<aside class=\"illustrateText\">明星榜单是唯医全面医师排行的权威榜单，以真实数据为依据，通过专业的计分规则和多样的参与机制对医师进行综合排名，下设贡献榜、活跃榜和推荐榜三个维度。</aside>" +
                "<article class=\"illustrateTitle\"><i>1.上榜人员原则</i></article>" +
                "<ul>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		贡献榜<span>活跃榜</span>" +
                "	</p>" +
                "	<p>" +
                "		所有唯医认证医师、医学生、护士均有上榜资格" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		推荐榜" +
                "	</p>" +
                "	<p>" +
                "		自主申请上榜的用户经工作人员审核资格后可上榜" +
                "	</p>" +
                "	</li>" +
                "</ul>" +
                "<article class=\"illustrateTitle\"><i>2.榜单周期</i></article>" +
                "<ul>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		贡献榜<span>活跃榜</span>" +
                "	</p>" +
                "	<p>" +
                "		每周一的0:00开始累积数据，每周日24:00截止统计，然后进入下一周的计分周期" +
                "	</p>" +
                "	<p style=\"margin-top: 15px\">" +
                "		每周一4:00发布上周榜单" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		推荐榜" +
                "	</p>" +
                "	<p>" +
                "		每小时更新榜单排名；工作人员每月第一个工作日调整上榜名单" +
                "	</p>" +
                "	</li>" +
                "</ul>" +
                "<article class=\"illustrateTitle\"><i>3.计分规则</i></article>" +
                "<ul>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		贡献榜" +
                "	</p>" +
                "	<em>贡献榜最终得分，主要由贡献量计算，当贡献量相同时，通过被浏览计算</em>" +
                "	<p class=\"smallText\">" +
                "		<span>贡献量：</span><b>指医师在平台发布并审核通过的视频、文库数量和医师在平台发布的病例、话题数量，其中视频和文库按照通过审核时间计算计分周期</b>" +
                "	</p>" +
                "	<p class=\"smallText\">" +
                "		<span>被浏览量：</span>指医师贡献的资源被浏览的人次" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		活跃榜" +
                "	</p>" +
                "	<em>活跃榜最终得分，由评论量、分享量和浏览量综合计算</em>" +
                "	<p class=\"smallText\">" +
                "		评论量：指医师在平台发布评论的数量" +
                "	</p>" +
                "	<p class=\"smallText\">" +
                "		分享量：指医师在平台分享资源的数量，分享到站内和站外都计入分享量" +
                "	</p>" +
                "	<p class=\"smallText\">" +
                "		浏览量：指医师在平台浏览的资源数量，一个计分周期中多次浏览同一资源仅计一次分" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		推荐榜" +
                "	</p>" +
                "	<em>最终得分，由用户被顶次数计算<span>*每名用户每天仅能为推荐用户顶一次</span></em>" +
                "	</li>" +
                "</ul>" +
                "<article class=\"illustrateTitle\"><i>4.计分方式</i></article>" +
                "<ul>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		贡献榜" +
                "	</p>" +
                "	<em>每个贡献计1分</em>" +
                "	<p class=\"smallText\">" +
                "		贡献量相同时，以当前计分周期内新贡献资源被浏览数量排序" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		活跃榜" +
                "	</p>" +
                "	<em>活跃分值为评论量*3分+分享量*2分+浏览量*0.5分</em>" +
                "	<p class=\"smallText\">" +
                "		示例" +
                "	</p>" +
                "	<p class=\"smallText\">" +
                "		A用户贡献了3个视频，其中2个通过审核，贡献了2个病例，则这个用户贡献榜计4分" +
                "	</p>" +
                "	<p class=\"smallText\">" +
                "		B用户浏览了114个资源，发出7条评论，分享8次，则这个用户活跃榜计114*0.5+7*3+8*2=94分" +
                "	</p>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		推荐榜" +
                "	</p>" +
                "	<em>每次被顶计1分</em>" +
                "	</li>" +
                "</ul>" +
                "<article class=\"illustrateTitle\"><i>5.特殊标识</i></article>" +
                "<ul>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		新上榜<span class=\"upToDate\">最新</span>" +
                "	</p>" +
                "	<em>历史第一次上榜用户会展示新上榜标识</em>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		连续N周<span class=\"continuityWeek\">连续5周</span>" +
                "	</p>" +
                "	<em>连续5周以上上榜用户会展示连续n周上榜标识</em>" +
                "	</li>" +
                "	<li><i></i>" +
                "	<p class=\"column\">" +
                "		奖牌" +
                "	</p>" +
                "	<p class=\"firstImg\">" +
                "		<img src=\"/images/img10/v3/discover/billboard/first.png\">" +
                "	</p>" +
                "	<em>排行榜冠亚季军排名旁对应展示红橙黄奖牌标志</em>" +
                "	</li>" +
                "</ul>" +
                "<article class=\"illustrateTitle\"><i>6.扣分</i></article>" +
                "<ul>" +
                "	<li><i></i><span class=\"other\">用户删除贡献、评论，或被管理员屏蔽的贡献、评论会在被删除／屏蔽时间当前计分周期内扣除得分</span>" +
                "	</li>" +
                "</ul>" +
                "<i class=\"lineBorder\"></i>" +
                "<section class=\"reward\">" +
                "<aside class=\"rewardTitle\">贡献榜、活跃榜冠军奖励</aside>" +
                "<article class=\"rewardText\">" +
                "<ul>" +
                "	<li><i>1</i>周榜冠军将制作精美海报，获得独家封面曝光机会。</li>" +
                "	<li><i>2</i>连续四周上榜用户可获得神秘礼品一份。（详情请咨询唯医微信官方客服小唯：allinmd2014）</li>" +
                "	<li style='margin: 22px 0 0 43px;'>更多精彩福利请随时关注唯医最新动态</li>" +
                "</ul>" +
                "</article>" +
                "</section>" +
                "</section>" +
                "</section>" +
                "</section>",
                "contributions": "<li class='$typeClass$' data-contributeId='$id$' data-href='$pageStoragePath$'> " +
                "   <a href='$linkUrl$' target='_blank'> <figure class='al-list-logoUrl'>" +
                "    <img src=\"$imgSrc$\" alt=\"\" /><b></b>" +
                "   </figure> " +
                "   <aside> " +
                "    <p>$title$</p> " +
                "    <figure>" +
                "     <p class=\"userName\" ownerNameStr='$ownerNameOnOff$'><i></i>$name$</p>" +
                "     <p class=\"num\"><i></i>$reviewNum$</p>" +
                "    </figure> " +
                "   </aside> </a>"+
                "</li>",
                "describe1": "    <ul>" +
                "     <li class=\"week\">评论 <span>$discussNum$</span></li>" +
                "     <li class=\"week\">分享 <span>$shareNum$</span></li>" +
                "     <li class=\"week\">浏览 <span>$reviewNum$</span></li>" +
                "    </ul> " +
                "   </div> </li>",
                "rank": "<li data-userId='$userId$'> <i class=\"placing $rankIconClass$ $rankIcon$\">$rankLevel$</i> " +
                "   <figure>" +
                "    <a href='$linkUrl$'><img src=\"$headSrc$\" alt=\"\" /></a>" +
                "   </figure> " +
                "   <div> " +
                "    <article class=\"describe\"> " +
                "     <!--连续几周 引用类名  continuity  --> " +
                "     <p class=\"userName $rankStateClass$\"><a href='$linkUrl$'>$name$</a> <span><i></i>$rankStateDes$</span></p> " +
                "     <p class=\"userType\">$job$</p> " +
                "     <p class=\"userHospital\">$hospital$</p> " +
                "    </article> ",
                "describe2": "<aside class=\"crown $praiseState$\"  data-userId='$userId$'>$praise$<i>顶</i></aside>" +
                "   </div> </li>",
                "describe0": "    <ul>" +
                "     <li class=\"week\">周贡献 <span>$weekContribution$</span></li>" +
                "     <li>被浏览数 $browsed$</li>" +
                "    </ul> " +
                "   </div> </li>",
                "recommend": "<li data-userId='$userId$'> <i class=\"placing $rankIconClass$ $rankIcon$\">$rankLevel$</i> " +
                "   <figure>" +
                "    <a href='$linkUrl$'><img src=\"$headSrc$\" alt=\"\" /></a>" +
                "   </figure> " +
                "   <div> " +
                "    <article class=\"describe\"> " +
                "     <!--连续几周 引用类名  continuity  --> " +
                "     <p class=\"userName $rankStateClass$\"><a href='$linkUrl$'>$name$</a> <span><i></i>$rankStateDes$</span></p> " +
                "     <p class=\"userType\">$job$</p> " +
                "     <p class=\"userHospital\">$hospital$</p> " +
                "<ul class='userContribution'>" +
                "     <li>贡献 <b>$weekContribution$</b></li>" +
                    "     <li>粉丝 <b>$fansNum$</b></li>" +
                "     <li>评论<b class='recommend-discuss'>$discussNum$</b></li>" +
                "    </ul> "+
                "    </article> "
            }
        },
        ajaxPort: {
            "describe": "整个页面使用到的接口",
            "share":PC_CALL + 'comm/data/share/getMapList3/',//分享接口
            // "banner": "banner.json",
            "banner":"/call/customer/toplist/getToplistBanner/",
            //"list":"list.json",
            "list": "/call/customer/toplist/getTopList/",
            // "praise": "praise.json",
            "praise":"/call/prefer/createTop/",
            // "scrollList": "scroll.json",
            "contributions":"/call/customer/resource/toplist/getResTopList/",
            // "contributions": "contributions.json"
        },
        parameter: {
            shareUrl:["m.allinmd.cn/dist/discover/discover_billboard.html","m.allinmd.cn/dist/discover/discover_billboard.html#/activity","m.allinmd.cn/dist/discover/discover_billboard.html#/recommend"],
            customerRole:0,
            "describe": "整个页面使用到的全局变量",
            "sceneType":"75",
            "indexType": parseInt(tool.getUrlName("listType")),//展示界面类型，0贡献榜，1，活跃榜，2，推荐榜
            adPositionId:0,
            "recommendType": 0,//推荐榜界面类型，0全部，1关节，2脊柱，3创伤，4其他,
            "rankData": [],
            scrollOnOff:["enabled","enabled","enabled","enabled","enabled"],
            "recommendData": [[], [], [], [], []],
            "pageIndex":  [0, 0, 0, 0, 0],
            "rankPageIndex":0,
            "pageSize":10,
            "contributions": [],
            "platformId": $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val(),
            "customerId": $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : "",
            "bannerSrc": "/images/img10/v3/discover/billboard/ads.jpg"
            //"loginState":this.ele.customerObj.val().length>0,//用户的登录状态
            //"approveState":(this.ele.auth.val().length>0)?parseInt(this.ele.auth.val()):-1//用户的认证状态值
        },
        tool: {
            "describe": "整个页面纯方法型函数",
            shareAction: function (param) {
                var t = arrange;
                var o = $.extend(param, {"sceneType": t.parameter.sceneType});
                var sinaTitle="";var qqTitle="";var qZoneTitle="";
                module.share({
                    container: $(".ev-shareContainer"),// 存放分享组件的父级
                    type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                    url: document.location.href,// 分享链接， 默认取当前页链接
                    h5Url: t.parameter.shareUrl[t.parameter.indexType],//h5页面的链接会生成微信二维码
                    title: "",// 分享标题
                    shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                    trendUrl: '',// 分享到站内动态的接口
                    data: {},// 分享到站内动态的接口参数
                    callback: function () {},// 分享到站内动态成功后回调函数
                    triggerRequest:function(content){//事件点击
                        $.ajax({
                            url: t.ajaxPort.share,
                            type: "post",
                            data: {paramJson: $.toJSON(o)},
                            dataType: 'json',
                            async:false,
                            success: function (d) {
                                if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                    var item = d.responseObject.responseData.data_list[0];
                                    content.pic = item.share_comm.shareImageUrl;
                                    content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                    $.each(item.share_channel,function(i,el){
                                        if(el.shareChannel=='Sina'){
                                            sinaTitle=content.sinaTitle=el.shareDesc;
                                        }else if(el.shareChannel=="QQFriend"){
                                            qqTitle=content.qqTitle = el.shareTitle;
                                            content.qqSummary = el.shareDesc;
                                        }else if(el.shareChannel=="QZone"){
                                            qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                            content.qqZoneSummary = el.shareDesc;
                                        }
                                    });
                                }
                            }

                        });
                    },
                    shareSinaSuc: function () {
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
                    shareQQSuc: function () {
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
                    shareQzoneSuc: function () {
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
            },
            offScroll:function(onOff){
                var t = arrange;
                t.ele.allContent.attr({"scrollpagination":"disabled"});
                comm.LightBox.hideloading();
                t.parameter.scrollOnOff[parseInt(t.parameter.recommendType)] = "disabled";
                if(!onOff){
                    t.ele.allContent.off("scroll");
                }
            },
            "scrollPage": function () {
                var t = arrange;
                var postData = {};
                var punditsGroup = "";
                if (t.parameter.indexType > 1) {
                    t.ajaxPort.list = "/call/customer/pundits/getPunditsCustomerList/";
                    if (parseInt(t.parameter.recommendType) != 0) {
                        punditsGroup = t.parameter.recommendType;
                    }
                    postData = {
                        'logoUseFlag': 4,
                        'sessionCustomerId': t.parameter.customerId,
                        'visitSiteId': 1,
                        "platformId": t.parameter.platformId,
                        'toplistType': t.parameter.indexType+1,  //榜单类型，1-贡献
                        'punditsGroup': punditsGroup        //专家分类（0-未选择、1-关节、2-脊柱、3-创伤、4-其他）,要获取全部分类的
                    };
                } else {
                    postData = {
                        "firstResult": t.parameter.rankPageIndex*t.parameter.pageSize,
                        "maxResult": t.parameter.pageSize,
                        'platformId': t.parameter.platformId,  //平台id，1-骨科，1-手外
                        'toplistType': t.parameter.indexType+1,  //榜单类型，1-贡献
                        'customerId': t.parameter.customerId, //用户id
                        'logoUseFlag': 10  //固定传10就好
                    }
                }
                var scrollOption = {
                    /*请求地址*/
                    'contentPage': t.ajaxPort.list,
                    /*refid习题id*/
                    'contentData': $.extend(postData, {
                        "maxResult": function(){
                            return t.parameter.pageSize;
                        },
                        "firstResult":function(){
                            var isPage = 0;
                            var nowIndex = t.parameter.indexType;
                            var nowInnerIndex = t.parameter.recommendType;
                            if (nowIndex > 1) {
                                isPage = t.parameter.pageIndex[nowInnerIndex];
                            } else {
                                isPage = t.parameter.rankPageIndex;
                            }
                            return isPage*t.parameter.pageSize;
                        }
                    }),
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 1000,
                    'type': "POST",
                    'beforeLoad': function () {
                        var nowIndex = t.parameter.indexType;
                        var nowInnerIndex = t.parameter.recommendType;
                        if (nowIndex > 1) {
                            (t.parameter.pageIndex[nowInnerIndex])++;
                        } else {
                            (t.parameter.rankPageIndex)++;
                        }
                        comm.LightBox.showloading();
                    },
                    'afterLoad': function (elementsLoaded) {
                        comm.LightBox.hideloading();
                        $(".listNone").remove();
                    },
                    'loader': function (data) {
                        //活跃榜滚动加载的时候添加
                        if(t.parameter.indexType==1){
                            comm.creatEvent({
                                triggerType:'榜单',
                                triggerName:'更多排名',
                                actionId:11060
                            });
                        }
                        //t.manageData.storeData(data);
                        /*t.tool.exhibition();*/
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        if (realNoData || !realStatus){
                            if(t.parameter.indexType > 1){
                                t.tool.offScroll(true);
                            }else{
                                t.tool.offScroll(false);
                            }
                        }else{
                            var describeType = t.parameter.indexType;
                            var recommendType = t.parameter.recommendType;
                            var newArray = [];
                            if(t.parameter.indexType > 1){
                                if(data.responseObject.responseData.data_list.length<t.parameter.pageSize){
                                    t.tool.offScroll(true);
                                }
                            }else{
                                if(data.responseObject.responseData.top_list.length<t.parameter.pageSize){
                                    t.tool.offScroll(false);
                                }
                            }
                            if (t.parameter.indexType > 1) {

                                newArray = t.parameter.recommendData[recommendType].concat(t.manageData.localRecommend(data.responseObject.responseData.data_list));
                                var nowLen = $(".al-rankList li[data-userid]").length;
                                t.parameter.recommendData[recommendType] = t.manageData.unique(newArray, "userId");
                                var demoList = $(t.template.produce(["recommend", "describe" + describeType], t.manageData.localRecommend(data.responseObject.responseData.data_list,nowLen)));
                                demoList.find(".placing").each(function(i){
                                    $(this).html(i+nowLen+1);
                                });
                                demoList.find(".describe .userContribution li").each(function () {
                                    if (parseInt($(this).find(".recommend-discuss").html()) == 0) {
                                        $(this).remove();
                                    }
                                });
                                t.ele.rankContainer.append(demoList);
                                t.parameter.customerRole = data.responseObject.responseData.my_top_list.customerRole;
                                t.handle.praise();
                            } else {
                                newArray = t.manageData.localRank(data.responseObject.responseData.top_list);
                                t.parameter.rankData = t.manageData.unique(newArray, "userId");
                                t.ele.rankContainer.append(t.template.produce(["rank", "describe" + describeType], t.parameter.rankData));
                                t.handle.myTopList(data.responseObject.responseData.my_top_list);
                            }
                            //t.handle.jumpPerson();
                        }

                    }
                };
                t.ele.allContent.off("scroll");
                t.ele.allContent.scrollPagination(scrollOption);
            },
            "exhibition": function () {
                /*
                 * 函数名称：exhibition
                 * 描述：根据榜单的点击展示不同的界面
                 * 参数说明：
                 * -------1、type,展示榜单界面的类型,number,必须
                 * 返回值说明：
                 *  无返回值
                 *  */
                //调用示例：
                //exhibition(0)
                var t = arrange;
                var postData = {};
                var punditsGroup = "";
                if (t.parameter.indexType > 1) {
                    t.ajaxPort.list = "/call/customer/pundits/getPunditsCustomerList/";
                    if (parseInt(t.parameter.recommendType) != 0) {
                        punditsGroup = t.parameter.recommendType;
                    }
                    postData = {
                        'logoUseFlag': 4,
                        'sessionCustomerId': t.parameter.customerId,
                        'visitSiteId': 1,
                        "firstResult": t.parameter.rankPageIndex*t.parameter.pageSize,
                        "maxResult": t.parameter.pageSize,
                        'toplistType': t.parameter.indexType+1,  //榜单类型，1-贡献
                        "platformId": t.parameter.platformId,
                        'punditsGroup': punditsGroup        //专家分类（0-未选择、1-关节、2-脊柱、3-创伤、4-其他）,要获取全部分类的
                    };
                } else {
                    postData = {
                        "firstResult": t.parameter.rankPageIndex*t.parameter.pageSize,
                        "maxResult": t.parameter.pageSize,
                        'platformId': t.parameter.platformId,  //平台id，1-骨科，1-手外
                        'toplistType': t.parameter.indexType+1,  //榜单类型，1-贡献
                        'customerId': t.parameter.customerId, //用户id
                        'logoUseFlag': 10  //固定传10就好
                    }
                }
                t.manageData.applyData({
                    port: t.ajaxPort.list,
                    postData: postData,
                    success: function (data) {
                        var len = 0;
                        var describeType = t.parameter.indexType;
                        if (t.parameter.indexType > 1) {
                            t.parameter.recommendData[0] = t.manageData.localRecommend(data.responseObject.responseData.data_list);
                            len = data.responseObject.responseData.data_list.length;
                            if(len == 0){
                                t.ele.rankContainer.html(t.template.demo.listNone).show();
                            }
                            var demoList = $(t.template.produce(["recommend","describe" + describeType], t.parameter.recommendData[0]));
                            demoList.find(".describe .userContribution li").each(function () {
                                if (parseInt($(this).find(".recommend-discuss").html()) == 0) {
                                    $(this).remove();
                                }
                            });
                            t.parameter.customerRole = data.responseObject.responseData.my_top_list.customerRole;
                            if(parseInt(data.responseObject.responseData.my_top_list.customerRanking)!=0&&(!isNaN(data.responseObject.responseData.my_top_list.customerRanking))){
                                t.parameter.sceneType = 74;
                            }
                            // //console.log(t.parameter.sceneType)
                            t.handle.share();
                            t.ele.rankContainer.html(demoList);
                            t.handle.praise();
                        } else {
                            if(data.responseObject.responseData.top_list.length>0){
                                len = data.responseObject.responseData.top_list.length;
                                t.parameter.rankData = t.manageData.localRank(data.responseObject.responseData.top_list);
                                t.ele.rankContainer.html(t.template.produce(["rank", "describe" + describeType], t.parameter.rankData)).show();
                            }else{
                                t.ele.rankContainer.html(t.template.demo.listNone).show();
                            }
                            t.handle.myTopList(data.responseObject.responseData.my_top_list);
                        }
                        //t.handle.jumpPerson();
                        if(len<10){
                            if( t.parameter.indexType>1){
                                t.tool.offScroll(true);
                            }else{
                                t.tool.offScroll(false);
                            }
                        }else{
                            t.tool.scrollPage();
                        }
                    },
                    failed:function(){
                        t.ele.rankContainer.html(t.template.demo.listNone).show();
                        t.tool.offScroll(false);
                    }
                });
                return t;
            },
            "theirCon": function () {
                var t = arrange;
                t.manageData.applyData({
                    port: t.ajaxPort.contributions,
                    postData: {
                        "platformId": t.parameter.platformId,  //平台id，1-骨科，1-手外
                        "toplistType": t.parameter.indexType+1,  //榜单类型，1-贡献
                        "customerId": t.parameter.customerId //用户id
                    },
                    success: function (data) {
                        t.parameter.contributions = t.manageData.localCon(data.responseObject.responseData.data_list);
                        var demoList = $(t.template.produce(["contributions"], t.parameter.contributions));
                        demoList.each(function(){
                            if($(this).hasClass("resourseNoneImg")){
                                $(this).find(".al-list-logoUrl").remove();
                            }
                            if(!$(this).hasClass("resourseVideo")){
                                $(this).find(".al-list-logoUrl b").remove();
                            }
                            if($(this).find(".userName").attr('ownerNameStr')&&$(this).find(".userName").attr('ownerNameStr').length){
                                $(this).find(".userName").remove();
                            }
                        });
                        t.ele.contributions.html(demoList);
                        $(".contributionRight").show();
                    },
                    failed:function(){
                        $(".contributionRight").hide();
                        t.ele.contributions.parent().hide();
                    }
                });
                return t;
            },
            cutStr:function(str,num){
                if(str){
                    var len = str.length;
                    var returnStr = "";
                    if(len>num){
                        returnStr =str.substring(0,num)+"...";
                        return returnStr;
                    }else{
                        return str;
                    }
                }else{
                    return "";
                }
            }

        },
        handle: {
            "describe": "整个页面操作型函数",
            "setBanner": function () {
                var t = arrange;
                t.manageData.applyData({
                    port: t.ajaxPort.banner,
                    get:true,
                    postData: {
                        "customerId": t.parameter.customerId,
                        "isValid": 1,
                        "toplistType": t.parameter.indexType+1,         //榜单类型1-贡献，2-活跃，3-推荐
                        "platformId": t.parameter.platformId,           //所属平台1-骨科，2-手外
                        adPositionId: t.parameter.adPositionId
                    },
                    success: function (req) {
                        var praiseOnOff = req.responseObject.responseStatus;
                        if (praiseOnOff) {
                            var bannerInfo = req.responseObject.responseData.data_list[0].ad_profile_attachment[0];
                            var pathUrl = bannerInfo.adAttUrl;
                            var linkUrl = bannerInfo.linkUrl;
                            var adId = bannerInfo.id;
                            t.parameter.bannerSrc = pathUrl;
                            var day = new Date();
                            var today = 7-day.getDay();
                            if(t.parameter.bannerSrc.length>0){
                                t.ele.banner.attr({
                                    "data-href": linkUrl,
                                    "data-adId": adId
                                }).find("img").attr({"src": t.parameter.bannerSrc});
                                t.ele.banner.show().off("click").on("click",function(){
                                    var reg = /http|https|www/ig;
                                    var linkUrl = $(this).attr("data-href");
                                    if (reg.test(linkUrl)) {
                                        g_sps.jump($(this),linkUrl);
                                    }else{
                                        ////////console.log("地址不对");
                                    }
                                }).find("figcaption i").html(today+1)
                            }else{
                                t.ele.banner.hide();
                            }

                        }

                    },
                    failed:function(){
                        t.ele.banner.hide();
                    }
                });
                return t;

            },
            adPositionId:function(){
              var t = arrange;
              if(parseInt(t.parameter.platformId)==1){
                    switch (t.parameter.indexType){
                        case 0:
                            /*线下
                            骨科贡献榜-3244，手外贡献榜-3255，骨科活跃榜-3248，手外活跃榜-3249，骨科推荐榜-3250，手外推荐榜-3251；*/
                            /*
                            * 线上441,442,443,462,463,464
                            * */
                            t.parameter.adPositionId = 441;
                            break;
                        case 1:
                            t.parameter.adPositionId = 442;
                            break;
                        case 2:
                            t.parameter.adPositionId = 443;
                            break;
                        default:
                            break;
                    }
              }else{
                  switch (t.parameter.indexType){
                      case 0:
                          t.parameter.adPositionId = 462;
                          break;
                      case 1:
                          t.parameter.adPositionId = 463;
                          break;
                      case 2:
                          t.parameter.adPositionId = 464;
                          break;
                      default:
                          break;
                  }
              }
              return t;
            },
            "checkRule": function () {
                var t = arrange;
                t.ele.rule.off("click").on("click", function () {
                    //查看规则
                    $("body").append(t.template.demo.rules).css({"overflow": "hidden"});
                    $(".al-close-rule").off("click").on("click", function () {
                        $(".rule").remove();
                        $("body").css({"overflow": "auto"});
                    });
                });
                return t;
            },
            "share":function(){
                var t = arrange;
                var shareData = {
                    "sceneType": t.parameter.sceneType,          // 74代表本人已上榜分享，75本人未上榜分享
                    "resourceType": 0,          //资源类型传0，代表所有类型
                    "platformId": t.parameter.platformId,            //1-骨科，2-手外
                    "toplistType": t.parameter.indexType+1,            //1-贡献榜，2-活跃榜，3-推荐榜
                    "visitSiteId": 1,           //1-PC
                    'sessionCustomerId': t.parameter.customerId,
                    customerId:t.parameter.customerId
                };
                t.tool.shareAction(shareData);
                return t;
            },
            jumpLink: function () {
                var t = arrange;
                $("[data-href]").off("click").on("click", function () {
                    //window.location.href = $(this).attr("data-href");
                    //TODO sps跳转
                    g_sps.jump($(this),$(this).attr("data-href"));
                });
                return t;
            },
            "changeRecommend": function () {
                var t = arrange;
                t.ele.recommendTab.off("click").on("click", function () {
                    var describeType = t.parameter.indexType;//推荐榜indexType值为2
                    var recommendType = t.parameter.recommendType;//获取此时的推荐类型
                    var len = 0;
                    if (recommendType === parseInt($(this).attr("data-recommendType"))) {
                        return false;
                    } else {
                        t.parameter.recommendType = parseInt($(this).attr("data-recommendType"));
                        t.ele.allContent.attr({"scrollpagination":t.parameter.scrollOnOff[parseInt(t.parameter.recommendType)]});
                        $(".ev-recommendTabRank.active").removeClass("active");
                        $(this).addClass("active");
                        if (t.parameter.recommendData[t.parameter.recommendType].length > 0) {
                            var demoList = $(t.template.produce(["recommend", "describe" + describeType], t.parameter.recommendData[t.parameter.recommendType]));
                            demoList.find(".placing").each(function(i){
                                if(i>3){
                                    $(this).html(i+1);
                                }

                            });
                            demoList.find(".describe .userContribution li").each(function(){
                                if(parseInt($(this).find(".recommend-discuss").html())==0){
                                    $(this).remove();
                                }
                            });
                            t.ele.rankContainer.html(demoList);
                            //t.handle.jumpPerson();
                            t.handle.praise();
                            } else {
                            var punditsGroup = "";
                            if (parseInt(t.parameter.recommendType) != 0) {
                                punditsGroup = t.parameter.recommendType;
                            }
                            var postData = {
                                'logoUseFlag': 4,
                                'sessionCustomerId': t.parameter.customerId,
                                'visitSiteId': 1,
                                "firstResult": t.parameter.pageIndex[parseInt(t.parameter.recommendType)]*t.parameter.pageSize,
                                "maxResult": t.parameter.pageSize,
                                'toplistType': t.parameter.indexType+1,  //榜单类型，1-贡献
                                "platformId": t.parameter.platformId,
                                'punditsGroup': punditsGroup        //专家分类（0-未选择、1-关节、2-脊柱、3-创伤、4-其他）,要获取全部分类的
                            };
                            t.manageData.applyData({
                                port: t.ajaxPort.list,
                                postData: postData,
                                success: function (data) {
                                    var newArray = t.parameter.recommendData[t.parameter.recommendType].concat(t.manageData.localRecommend(data.responseObject.responseData.data_list));
                                    len = data.responseObject.responseData.data_list.length;
                                    t.parameter.recommendData[t.parameter.recommendType] = t.manageData.unique(newArray, "userId");
                                    var demoList = $(t.template.produce(["recommend", "describe" + describeType], t.parameter.recommendData[t.parameter.recommendType]));
                                    demoList.find(".describe .userContribution li").each(function () {
                                        if (parseInt($(this).find(".recommend-discuss").html()) == 0) {
                                            $(this).remove();
                                        }
                                    });
                                    t.ele.rankContainer.html(demoList);
                                    if(len<10){
                                        t.tool.offScroll(true);
                                    }else{
                                        t.tool.scrollPage();
                                    }
                                    //t.handle.jumpPerson();
                                    t.handle.praise();
                                },
                                failed:function(){
                                    //alert(t.ele.rankContainer)
                                    // //console.log(t.template.demo.listNone)
                                    t.ele.rankContainer.html(t.template.demo.listNone);
                                    t.tool.offScroll(true);
                                }
                            });
                        }
                        //t.handle.jumpPerson();
                        t.handle.praise();
                        //console.log(t.parameter.recommendType);
                        var str = '';
                        switch(parseInt(t.parameter.recommendType)){
                            case 0:
                                str = '全部';break;
                            case 1:
                                str = '关节';break;
                            case 2:
                                str = '脊柱';break;
                            case 3:
                                str = '创伤';break;
                            case 4:
                                str = '其他';break;
                        }
                        comm.creatEvent({
                            triggerType:'榜单',
                            triggerName:'推荐榜筛选项',
                            keyword:str,
                            actionId:11061
                        });
                    }
                });
                return t;
            },
            reviewLog:function(){
              var t = arrange;
              /*switch (t.parameter.indexType){
                  case 0:
                      comm.Log.createBrowse({href: location.href, id:176, name: "榜单贡献榜",platformId: $('#sesDepartment').val()});
                      break;
                  case 1:
                      comm.Log.createBrowse({href: location.href, id:177, name: "榜单活跃榜",platformId: $('#sesDepartment').val()});
                      break;
                  case 2:
                      comm.Log.createBrowse({href: location.href, id:178, name: "榜单推荐榜",platformId: $('#sesDepartment').val()});
                      break;
                  default:
                      break;
              }*/
              return t;

            },
            myTopList:function (data) {
              var t = arrange;
                if($('#sesCustomerId').val() != undefined && $('#sesCustomerId').val() != ""){
                    if(parseInt(data.isAuthed)==1){
                        t.ele.myRank.find(".userName a").html(data.fullName)/*.off("click").on("click",function(){
                         $(".al-navIndex").trigger("click");
                         });*/
                        t.ele.myRank.find("img").attr({"src":data.logoUrl})/*.off("click").on("click",function(){
                         $(".al-navIndex").trigger("click");
                         });*/
                        //t.ele.myRank.find(".describeText  b").html(data.totalNum);
                        t.ele.myRank.find(".discussNum").html("评论"+"<b>"+data.reviewNum+"</b>");
                        t.ele.myRank.find(".shareNum").html("分享"+"<b>"+data.shareNum+"</b>");
                        t.ele.myRank.find(".reviewNum").html("浏览"+"<b>"+data.browseNum+"</b>");
                        var rankLevel = parseInt(data.customerRanking);
                        var pushStr = "";
                        t.parameter.customerRole = data.customerRole;
                        if(rankLevel!=0){
                            t.parameter.sceneType = 74;
                            if(rankLevel>20){
                                if(t.parameter.indexType==0){
                                    pushStr = "发布更多资源可跻身榜单";
                                }else{
                                    pushStr = "评论/分享/浏览更多资源可跻身榜单";
                                }

                            }else{
                                if(t.parameter.indexType==0){
                                    if(rankLevel==1){
                                        pushStr = "发布更多资源可保持排名";
                                    }else{
                                        pushStr = "发布更多资源可提高排名";
                                    }

                                }else{
                                    if(rankLevel==1){
                                        pushStr = "评论/分享/浏览更多资源可保持排名";
                                    }else{
                                        pushStr = "评论/分享/浏览更多资源可提高排名";
                                    }
                                }
                            }
                            if(t.parameter.indexType==0){
                                t.ele.myRank.find(".describeText").html("周贡献 <b>"+data.totalNum.toWKH()+"</b><i>"+pushStr+"</i>");
                            }else{
                                t.ele.myRank.find(".describeText").html("<i>"+pushStr+"</i>");
                            }
                            t.ele.myRank.find("span").eq(0).html(data.customerRanking);
                            t.ele.myRank.find("aside").removeClass("none").html("第"+data.customerRanking+"名");
                        }else{
                            if(t.parameter.indexType==0){
                                pushStr = "发布更多资源可跻身榜单";
                            }else{
                                pushStr = "评论/分享/浏览更多资源可跻身榜单";
                            }
                            if(t.parameter.indexType==0){
                                t.ele.myRank.find(".describeText").html("周贡献 <b>"+data.totalNum.toWKH()+"</b><i>"+pushStr+"</i>");
                            }else{
                                t.ele.myRank.find(".describeText").html("<i>"+pushStr+"</i>");
                            }
                            t.ele.myRank.find("span").eq(0).html(data.customerRanking);
                            t.ele.myRank.find("span").eq(0).html("-");
                            t.ele.myRank.find("aside").html("未上榜");
                        }
                        t.ele.myRank.show();
                    }else{
                        t.ele.myRank.hide();
                    }

                }else{
                    t.ele.myRank.hide();
                }
                t.handle.share()
            },
            jumpPerson:function(){
              var t = arrange;
              $("li[data-userid]").off("click").on("click",function(e){
                  if($(e.target).attr("src")){
                      var href = "/pages/personal/others_contribution.html?cid="+$(this).attr("data-userid")+"";
                      g_sps.jump(null,href);
                  }
                  if($(e.target).hasClass("userName")){
                      var href = "/pages/personal/others_contribution.html?cid="+$(this).attr("data-userid")+"";
                      g_sps.jump(null,href);
                  }
              })

            },
            "praise": function () {
                var t = arrange;
                t.ele.praise = $(".crown");
                t.ele.praise.off("click").on("click", function () {
                    var isThis = $(this);
                    comm.creatEvent({
                        triggerType:'榜单',
                        triggerName:'顶',
                        keyword:isThis.prev().children('.userName').text(),
                        actionId:11059
                    });
                    var activeTop = function(){
                        t.manageData.applyData({
                            port: t.ajaxPort.praise,
                            postData: {
                                "customerId": t.parameter.customerId,
                                "usefulType": 10,            //赞类型（1-视频，2-文库，3-会议， 10-顶人）
                                "upDownType": 2,           //赞、踩 类型(0踩,1赞,2顶)
                                "refId": isThis.attr("data-userid"),                //被顶人的id
                                "visitSiteId": 1,
                                "platformId": t.parameter.platformId
                            },
                            success: function (data) {
                                var praiseOnOff = data.responseObject.responseStatus;
                                if (praiseOnOff) {
                                    var resultNum = upNum + 1;
                                    var testRex = /[\u4e07]|[\u5343]/g;
                                    var testStr = isThis.addClass("active").html();
                                    if(testRex.test(testStr)){
                                        isThis.addClass("active");
                                    }else{
                                        isThis.addClass("active").html('' + resultNum + '<i>顶</i>');
                                    }
                                    $.each(t.parameter.recommendData,function(oi,ov){
                                        $.each(ov,function(i,v){
                                            if(parseInt(isThis.attr("data-userid"))==parseInt(v.userId)){
                                                v.praiseState = "active";
                                                v.praiseNum++;
                                                v.praise = v.praiseNum.toWKH()
                                            }
                                        });
                                    });

                                }

                            }
                        });
                    };
                    var upNum = parseInt($(this).text());
                    if (isThis.hasClass("active")) {
                        $.topTip({
                            mark: "warn",
                            content: "每日只能顶一次哦",
                            showTime: 10
                        })
                    } else {
                        user.login({
                            callback: function () {
                                activeTop();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth
                        })
                    }

                });
                return t;
            }
        },
        manageData: {
            "describe": "整个页面操作数据型函数",
            "applyData": function (options) {
                /*
                 * 函数名称：applyData
                 * 描述：关于ajax参数请求的二次封装
                 * 参数说明：
                 * -------1、options是一个对象
                 * options字段说明：
                 * -------1、get,请求方式，boolean,可选，不传默认为get方式
                 * -------2、port,请求接口，string,必须，
                 * -------3、postData,请求参数，json,必须，
                 * -------4、failed,请求失败的回调，function,可选，
                 * -------5、success,请求成功的回调，function,可选，
                 * 返回值说明：
                 *  无返回值
                 *  */
                //调用示例：
                // t.applyData({
                //     port: port,
                //     postData: option.initData,
                //     success: function (data) {
                //     },
                //     failed: function () {
                //     }
                // });
                var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                var postData = {"paramJson": $.toJSON(options.postData)};
                $.ajax({
                    url: options.port,    //请求的url地址
                    dataType: "json",   //返回格式为json
                    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                    data: postData,    //参数值
                    type: postType,   //请求方式
                    beforeSend: function () {
                        //请求前的处理
                    },
                    success: function (data) {
                        //请求成功时处理
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        var len  =(data.responseObject.responseData.data_list)?(data.responseObject.responseData.data_list.length==0):false;
                        if (realNoData || !realStatus||len) {
                            options.failed && options.failed();
                        } else {
                            options.success && options.success(data);
                        }

                    },
                    complete: function () {
                        //请求完成的处理
                    },
                    error: function () {
                        //请求出错处理
                    }
                });
            },
            "unique": function (arrOr, key) {
                /*
                 * 函数名称：unique
                 * 描述：这个方法试用于数组下面每项均为json，json内有唯医键值来标识该项，依赖此唯一键值对其进行去重
                 * 参数说明：
                 * -------1、arr,准备去重的数组，array，必须
                 * -------2、key，依赖的键名，string,必须
                 * 返回值说明：
                 *  -------1、array,返回一个去重就得新数组
                 * */
                var preArr = JSON.parse(JSON.stringify(arrOr));
                var arr = [];
                $.each(preArr,function(i,v){
                   if(v){
                       arr.push(v);
                   }
                });
                //调用示例：
                var newArr = [];
                var len = arr.length;
                var isRepeat;

                for (var i = 0; i < len; i++) {  //第一次循环
                    isRepeat = false;
                    for (var j = i + 1; j < len; j++) {  //第二次循环
                        if (arr[i][key] === arr[j][key]) {
                            isRepeat = true;
                            break;
                        }
                    }
                    if (!isRepeat) {
                        newArr.push(arr[i]);
                    }
                }
                return newArr;
            },
            "localRank": function (data) {
                var returnData = [];
                var t = arrange;
                $.each(data, function (i, v) {
                    var rankState = "";
                    var rankStateClass = "";
                    if(parseInt(v.isNew)==1){
                        rankState = "新上榜";
                        rankStateClass = "new";
                    }
                    if(parseInt(v.specialType)==0){
                        rankState = "未上榜";
                    }
                    if(parseInt(v.specialType)>4){
                        rankState = "连续" + v.specialType + "周";
                        rankStateClass = "continuity";
                    }
                    var rankIcon = "";
                    var rankIconClass = "";
                    switch (parseInt(v.customerRanking)) {
                        case 1:
                            rankIcon = "first";
                            rankIconClass = "placingIcon";
                            break;
                        case 2:
                            rankIcon = "second";
                            rankIconClass = "placingIcon";
                            break;
                        case 3:
                            rankIcon = "third";
                            rankIconClass = "placingIcon";
                            break;
                        default:
                            break;

                    }
                    var dataJson = {
                        "name": v.fullName,
                        "job": v.medicalTitleShow||(t.manageData.filtrateMedicalTitle(v.medicalTitle)),
                        "hospital": t.tool.cutStr(((v.company.length>0)?(v.company):(v.workplace)),18),
                        "rankIcon": rankIcon,
                        "rankIconClass": rankIconClass,
                        "rankState": v.specialType,
                        "rankStateClass": rankStateClass,
                        "rankStateDes": rankState,
                        "rankTime": v.createTime,
                        "rankLevel": v.customerRanking,
                        "headSrc": v.logoUrl,
                        "weekContribution": (v.totalNum).toWKH(),
                        "browsed": v.browseNum.toWKH(),
                        "userId": v.customerId,
                        "linkUrl":"/pages/personal/others_contribution.html?cid="+v.customerId,
                        "shareNum": v.shareNum.toWKH(),
                        "reviewNum": v.browseNum.toWKH(),
                        "discussNum": v.reviewNum.toWKH()
                    };
                    returnData.push(dataJson);

                });
                return returnData;
            },
            localCon:function(data){
              var returnData = [];
              var t = arrange;
              $.each(data,function(i,v){
                  if(i<10){
                      var typeClass = "";
                      /*1-视频,2-文库,4-话题,7-病例*/
                      switch (parseInt(v.itemType)){
                          case 1:
                              if(v.picUrl.length==0){
                                  typeClass = "resourseNoneImg ";
                              }
                              typeClass+= "resourseVideo";
                              break;
                          case 2:
                              if(v.picUrl.length==0){
                                  typeClass = "resourseNoneImg ";
                              }
                              typeClass+= "resourseDoc";
                              break;
                          case 4:
                              if(v.picUrl.length==0){
                                  typeClass = "resourseNoneImg ";
                              }
                              typeClass+= "resourseTopic";
                              break;
                          case 7:
                              if(v.picUrl.length==0){
                                  typeClass = "resourseNoneImg ";
                              }
                              typeClass+= "resourseCase";
                              break;
                      }
                      var nameStr = v.ownerName;
                      if(v.ownerName.length>4){
                          nameStr=(v.ownerName).substring(0,2)+"...";
                      }
                      var ownerNameStr = (v.ownerNameStr)?v.ownerNameStr:nameStr;
                      var ownerNameOnOff = '';
                      if(ownerNameStr.indexOf(',')>-1){
                        ownerNameOnOff = ownerNameStr;
                      }
                      var dataJson = {
                          "playTime": v.playTime,
                          "name": nameStr,
                          "ownerNameOnOff":ownerNameOnOff,
                          "linkUrl":v.itemUrl.replace("https:",""),
                          "customerId": v.ownerId,
                          "typeClass": typeClass,
                          "title": t.tool.cutStr(v.itemTitle, 14),
                          "id": v.itemId,
                          "imgSrc": v.picUrl,
                          "reviewNum": v.browseNum.toWKH(),
                          "pageStoragePath": v.itemUrl.replace("https:","")
                      };
                      returnData.push(dataJson);
                  }
              });
              return returnData;
            },
            filtrateMedicalTitle: function(str){
                if(str){
                    var returnStr = "";
                    if(str.indexOf(",")>-1){
                        returnStr = str.split(",")[0].split("_")[1];
                    }else{
                        if(str.indexOf("_")>-1){
                            returnStr = str.split("_")[1];
                        }else{
                            returnStr = str;
                        }
                    }
                    return returnStr;
                }else{
                    return "";
                }


            },
            "localRecommend": function (data) {
                var t = arrange;
                var nowIndex = parseInt(t.parameter.recommendType);
                var returnData = [];
                $.each(data, function (i, v) {
                    var infoData = v.customerPunditsEntity;
                    var numInfo = v.customerStatistic;
                    var indexInfo = v.other;
                    var rankIcon = "";
                    var rankIconClass = "";
                    var praiseState = "";
                    if(t.parameter.recommendData[nowIndex].length==0){
                        switch (parseInt(i)) {
                            case 0:
                                rankIcon = "first";
                                rankIconClass = "placingIcon";
                                break;
                            case 1:
                                rankIcon = "second";
                                rankIconClass = "placingIcon";
                                break;
                            case 2:
                                rankIcon = "third";
                                rankIconClass = "placingIcon";
                                break;
                            default:
                                break;

                        }
                    }
                    if((parseInt(indexInfo.isTopStatus)==1)&&parseInt(t.parameter.customerRole)!=3 ){
                        praiseState = "active";
                    }
                    var dataJson = {
                        "name": infoData.customerName,
                        "job": infoData.medicalTitleShow||t.manageData.filtrateMedicalTitle(infoData.medicalTitle),
                        "hospital":t.tool.cutStr(((infoData.company.length>0)?(infoData.company):(infoData.workplace)),18) ,
                        "rankIcon": rankIcon,
                        "rankIconClass": rankIconClass,
                        "rankState": "",
                        "rankStateClass": "",
                        "rankStateDes": "",
                        "fansNum":(numInfo.fansNum).toWKH(),
                        "rankTime": indexInfo.createTime,
                        "rankLevel": i+1,
                        "linkUrl":"/pages/personal/others_contribution.html?cid="+infoData.customerId,
                        "praiseState":praiseState,
                        "headSrc": v.customerAtt.logoUrl,
                        "weekContribution": numInfo.contributionCount,
                        "browsed": (numInfo.reviewNum+"").toWKH(),
                        "userId": infoData.customerId,
                        "shareNum":( numInfo.shareNum+"").toWKH(),
                        "reviewNum": ("").toWKH(),
                        "discussNum": (numInfo.reviewNum+"").toWKH(),
                        "praiseNum": parseInt(indexInfo.topNum)
                    };
                    dataJson.praise = (indexInfo.topNum+"").toWKH();
                    returnData.push(dataJson);
                });
                return returnData;
            }
        },
        init: function () {

            var t = this;
            t.authApplyProtext();   //申请权威专家
            t.applyAuthorSubmit();
            (document.referrer) ? t.ele.returnBack.attr({"href": document.referrer}) : "//www.allinmd.cn/";
            if(t.parameter.indexType<2){
                t.tool.theirCon();//他们贡献
            }
            t.handle.adPositionId();
            t.handle.checkRule().handle.reviewLog().handle.setBanner().tool.exhibition().handle.changeRecommend().handle.jumpLink();
            //初始化展示榜单，查看规则注册事件，顶部tab切换注册事件，推荐榜单注册事件;

        }
    };
    arrange.init();
});