<template>

    <section class="course">
        <section>
            <div class="course-header-pic"
                 :style="{background: 'url('+imageUrl+') no-repeat center center/cover'}"
                 v-show="imageUrl">
                <div class="course-back" @click="goBack()"></div>
                <div class="course-share"></div>
                <p class="course-auth-theme">
                    {{courseName}}
                </p>
            </div>
            <p class="course-coupons"
               v-show="(!isEmptyObject(couponInfo))&&(!checkInvalid(couponInfo.displayName))"
               @click.stop="getCouponEvent">
                <em></em>
                <span v-text="couponInfo.displayName"></span>
            </p>
            <!--<p class="course-coupons">-->
            <!--<em></em>-->
            <!--<span>优惠券优惠券优惠券优惠券</span>-->
            <!--</p>-->
            <div class="course-section">
                <nav class="course-section-tab"
                     :class="(!isEmptyObject(couponInfo))&&(!checkInvalid(couponInfo.displayName))?'course-section-tab-active1':'course-section-tab-active'">
                    <span @click.stop="changeTab(0)" :class="{'active':tabIndex===0}">
                        课程 <i>{{courseNum}}</i>
                       <em class="course-state onUpdate" v-if="(courseNum!==totalNum)&&(courseNum!==0)">持续更新</em>
                       <em class="course-state isEnd" v-if="(courseNum===totalNum)&&(courseNum!==0)">已完结</em>
                    </span>
                    <span @click.stop="changeTab(1)" :class="{'active':tabIndex===1}">
                        介绍
                    </span>
                    <span @click.stop="changeTab(2)" :class="{'active':tabIndex===2}">
                        交流 <i>{{communNums}}</i>
                    </span>
                </nav>
                <CourseList :relatedContent="scheduleList"
                            @scrollBottom="getCourseDetail"
                            v-show="scheduleList.length!==0&&tabIndex===0"
                            :loading="loading"
                            :completed="completed">

                </CourseList>
                <CourseProduce v-if="tabIndex===1" :courseId="courseId"></CourseProduce>
                <CourseChat v-show="tabIndex===2"
                            v-on:communNum="communNum"
                            :chatList="chatList"
                            :loadings="chatLoading"
                            :firstLoad="firstLoad"
                            :completeds="chatCompleted">

                </CourseChat>
            </div>
            <p class="course-price-tag"
               v-show="parseInt(payState,10)===0"
               @click.stop="getCouponEvents">
                购买课程: ￥{{coursePrice}}
            </p>
            <!--<loading v-show="loading"></loading>-->
        </section>

    </section>
</template>
<script>
    import app from 'static/js/comm.app';
    import comm from 'static/js/comm.js';
    import TempCache from "static/js/tempcache";
    import axios from 'axios';
    import CourseChat from './CourseChat';
    import CourseList from './CourseList';
    import CourseProduce from './CourseProduce';
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import loading from "components/Loading/Loading.vue";
    import formatData from '../untils/formatData';
    import user from 'static/js/module.user.js';

    const xhrUrl = {
        //videoList: '/mock/mcall/college/course/getVideoList/',
        videoList: '/mcall/college/course/getVideoList/',

        //coupon: '/mock/mcall/coupon/maxReceivableCoupon'
        coupon: '/mcall/coupon/getMaxReceivableCoupon/',
        chatList: '/mcall/customer/review/json_list_v5/'
    };
    export default {
        components: {
            CourseChat,
            CourseList,
            CourseProduce,
            VueDataLoading,
            loading
        },
        data() {
            let courseId = (comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"");
            return {
                firstLoad:false,
                chatCompleted:false,
                completed: false,
                chatLoading: false,
                loading: false,
                couponInfo: {},
                scheduleList: [],
                payState: 0,
                courseDesc: '',
                coursePrice: '',
                courseName: '',
                imageUrl: '',
                pageIndex: 0,
                courseIndex:0,
                pageSize: 20,
                tabIndex: 0,
                courseId: courseId,
                teacherName: '',
                appCoverPicUrl: '',
                communNums: 0,
                courseNum: 0,
                totalNum:0,
                chatList: [],
                appPort: false,
                customerId: ''

            }
        },
        watch:{
            completed(n){
                let _this = this;
                if(n&&parseInt(_this.tabIndex,10)===0){
                    //console.log('课程加载完成',$(".loading-footer"));
                    _this.showLoadingFooter();
                }
            },
            tabIndex(n){
                let _this = this;
                if(n===0&&_this.completed){
                    _this.showLoadingFooter();
                }
            }
        },
        mounted() {
            document.title = '课程详情';
            let _this = this;
            _this.checkApp();
            // _this.courseId = comm.getparaNew().courseId;
            // _this.getCourseDetail(comm.getparaNew().courseId)
            // _this.share();
            _this.getChatList();
            if (_this.appPort) {
                let coustomId = (appjs && appjs.getAuthorCustomerId());//获取app内登录的CustomerId
                if (!coustomId) {
                    appjs && appjs.myWorksPermission();//app内跳转登录页面
                } else {
                    _this.courseId = (comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"");
                    _this.getCourseDetail(_this.courseId);
                    _this.share();
                    _this.getChatList();
                }
            } else {
                /*user.privExecute({//web跳转登录页面
                    operateType: 'login',
                    callback: function () {
                        _this.courseId = (comm.getparaNew().courseId+'').match(/\d+/)[0];
                        _this.getCourseDetail(_this.courseId);
                        _this.share();
                        _this.getChatList();
                    }
                });*/
                _this.courseId = (comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"");
                _this.getCourseDetail(_this.courseId);
                _this.share();
                _this.getChatList();
            }

        },
        methods: {
            showLoadingFooter(){
              let _this = this;
                setTimeout(()=>{
                    $(".loading-footer").each(function(){
                        //console.log($(this).css("display"));
                        let element = $(this);
                        let footerOnOff = element.css("display")==='block';
                        if(footerOnOff){
                            let overOnoff = _this.scheduleList.length===parseInt(_this.totalNum,10);
                            if(overOnoff){
                                element.html(
                                    `
                                      <div class="loading-end">
                                        - 已完结 -
                                      </div>
                                    `
                                );
                            }else{
                                element.html(
                                    `
                                      <div class="loading-end">
                                        <i class="icon"></i>
                                        更多精彩课程，正加紧打磨中
                                      </div>
                                    `
                                );
                            }

                        }
                    });
                },300);
            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                    _this.customerId = appjs.getAuthorCustomerId();
                    return
                } else {
                    _this.appPort = false;
                    _this.customerId = TempCache.getItem('userId');
                    return
                }
            },
            getCouponEvent() {
                let _this = this;
                let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${(comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"")}}`;
                let iosParam = `scene=3&type=101&tplPath=0&keyword=${(comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"")}`;
                $(".al-appWakeUpFigure").remove();
                let callAppOptions = {
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                    android: "allin://com.allin.social:75235?data=" + androidParam
                };

                if (_this.appPort) {
                    let coustomId = (appjs && appjs.getAuthorCustomerId());
                    if (!coustomId) {
                        appjs && appjs.myWorksPermission();
                    } else {
                        app.newReleaseBox({
                            imgPath: "//img50.allinmd.cn/case/release.png",
                            title: "更多大额优惠券，打开唯医骨科app查看",
                            solidBtnTitile: "立即打开",
                            authNoneTitle: " ",
                            data: callAppOptions
                        });
                    }
                } else {
                    user.privExecute({
                        operateType: 'auth',
                        callback: function () {
                            app.newReleaseBox({
                                imgPath: "//img50.allinmd.cn/case/release.png",
                                title: "更多大额优惠券，打开唯医骨科app查看",
                                solidBtnTitile: "立即打开",
                                authNoneTitle: " ",
                                data: callAppOptions
                            });
                        }
                    });
                }
            },
            getCouponEvents() {
                let _this = this;
                let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${(comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"")}}`;
                let iosParam = `scene=3&type=101&tplPath=0&keyword=${(comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"")}`;
                $(".al-appWakeUpFigure").remove();
                let callAppOptions = {
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                    android: "allin://com.allin.social:75235?data=" + androidParam
                };
                console.log(callAppOptions);
                if (_this.appPort) {
                    let coustomId = (appjs && appjs.getAuthorCustomerId());
                    if (!coustomId) {
                        appjs && appjs.myWorksPermission();
                    } else {
                        app.newReleaseBox({
                            imgPath: "//img50.allinmd.cn/case/release.png",
                            title: "打开唯医骨科app，尽享唯医学院精品内容",
                            solidBtnTitile: "立即打开",
                            authNoneTitle: " ",
                            data: callAppOptions
                        });
                    }
                } else {
                    user.privExecute({
                        operateType: 'auth',
                        callback: function () {
                            app.newReleaseBox({
                                imgPath: "//img50.allinmd.cn/case/release.png",
                                title: "打开唯医骨科app，尽享唯医学院精品内容",
                                solidBtnTitile: "立即打开",
                                authNoneTitle: " ",
                                data: callAppOptions
                            });
                        }
                    });
                }
            },
            checkInvalid(str) {
                return comm.checkInvalid(str);
            },
            isEmptyObject(obj) {
                return comm.isEmptyObject(obj);
            },
            getCoupon(productId) {
                let _this = this;
                axios.get(xhrUrl.coupon, {
                    params: {
                        paramJson: (
                            $.toJSON({
                                customerId: _this.customerId,
                                productId: productId
                            })
                        )
                    }
                }).then(function (res) {
                    let data = res.data;
                    if (data && data.responseObject && data.responseObject.responseData) {
                        _this.couponInfo = data.responseObject.responseData;
                    }
                }).catch(function (error) {
                    //console.log(error);
                });
            },
            getCourseDetail(courseId) {
                let _this = this;
                _this.loading = true;
                axios.get(xhrUrl.videoList, {
                    params: {
                        paramJson: $.toJSON({
                            customerId: _this.customerId,
                            courseId: _this.courseId,
                            firstResult: _this.courseIndex * _this.pageSize,
                            maxResult: _this.pageSize
                        })
                    }
                }).then(function (res) {
                    //console.log('课程视频列表', res);
                    let obj = {
                        res,
                        data: res.data,
                        responseObject: res.data.responseObject,
                        responseData: res.data.responseObject.responseData,
                        dataList: res.data.responseObject.responseData.dataList,
                        dataLen: res.data.responseObject.responseData.dataList.length,
                        totalCount: res.data.responseObject.responseData.totalCount
                    };
                    if(parseInt(_this.courseIndex,10)===0){
                        _this.imageUrl = obj.responseData.appBannerUrl;
                        _this.courseName = (obj.responseData.courseName);
                        _this.teacherName = (obj.responseData.teacherName);
                        _this.appCoverPicUrl = (obj.responseData.appCoverPicUrl);
                        _this.coursePrice = (obj.responseData.coursePrice);
                        _this.courseDesc = (obj.responseData.courseDesc);
                        _this.payState = obj.responseData.payState;
                        _this.courseNum = obj.responseData.newestNum;
                        _this.totalNum = obj.responseData.totalNum;
                    }
                    // _this.share();
                    if (parseInt(_this.payState, 10) === 0) {
                        _this.getCoupon(_this.courseId);
                    }
                    if (obj.res && obj.data && obj.responseObject && obj.responseData && obj.dataList && obj.dataLen) {
                        if(_this.scheduleList.length===parseInt(_this.totalNum,10)){
                            _this.completed = true;//数据取满的时候停止接口请求
                        }else{
                            _this.scheduleList = _this.scheduleList.concat(obj.dataList);
                            _this.completed = (obj.dataLen < _this.pageSize);
                            if (!_this.completed) {
                                //_this.pageIndex++;
                                _this.courseIndex++;
                            }
                        }
                    } else {
                        _this.completed = true;
                    }
                    _this.loading = false;

                }).catch(function (error) {
                    //console.log(error);
                });
            },
            unique(original) {
                let arr = JSON.parse(JSON.stringify(original));
                if (!Array.isArray(arr)) {
                    //console.log('type error!');
                    return
                }
                let arrry = [];
                let obj = {};
                for (let i = 0; i < arr.length; i++) {
                    if (!obj[arr[i].id]) {
                        arrry.push(arr[i]);
                        obj[arr[i].id] = 1
                    } else {
                        obj[arr[i].id]++
                    }
                }
                return arrry;
            },
            getChatList() {
                let _this = this;
                _this.chatLoading = true;

                axios.get(xhrUrl.chatList, {
                    params: {
                        firstResult: _this.pageIndex * _this.pageSize,
                        maxResult: _this.pageSize,
                        sortType: 1,
                        reviewStatus: 1,
                        attUseFlag: 3,
                        logoUseFlag: 3,
                        dataFlag: 1,
                        scene: 2,
                        reviewType: 24,//付费课
                        isDeleteShow: 1,
                        refId: (comm.getparaNew().courseId+'').match(/\d+/)[0],
                        isTotalCount: 1
                    }
                }).then(function (res) {
                    _this.chatLoading = true;
                    _this.firstLoad = true;
                    let obj = {
                        res,
                        data: res.data,
                        responseObject: res.data.responseObject,
                        responseData: res.data.responseObject.responseData,
                        dataList: res.data.responseObject.responseData.dataList,
                        dataLen: res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList?res.data.responseObject.responseData.dataList.length:0,
                        totalCount: res.data.responseObject.responseData.totalCount
                    };
                    if (obj.res && obj.data && obj.responseObject && obj.responseData && obj.dataList) {
                        _this.communNums = obj.responseData.totalCount;
                        let chatList = obj.dataList;
                        if ((_this.pageIndex === 0) && (chatList.length === 0)) {
                            _this.firstLoad = true;
                        }
                        for (let num = 0; num < chatList.length; num++) {
                            let dataItem = formatData.formatChatData(chatList[num]);
                            dataItem.childrenList = formatData.formatChildrenData(dataItem);
                            _this.chatList.push(dataItem);
                        }
                        _this.chatList = _this.unique(_this.chatList);
                        if (obj.res && obj.data && obj.responseObject && obj.responseData && obj.dataList && obj.dataLen) {
                            _this.chatCompleted = (obj.dataLen < _this.pageSize);
                            if (!_this.chatCompleted) {
                                _this.pageIndex++;
                            }
                        } else {
                            _this.chatCompleted = false;
                        }
                    }

                }).catch(function (error) {

                    //console.log(error);
                });

            },

            gotoDetail(title) {
                this.$router.push({
                    path: `payQuestionsDetails`,
                    query: {title: title}
                });
            },
            changeTab(index) {
                //console.log('点击');
                let _this = this;
                //console.log(_this.courseId);
                _this.tabIndex = index;
            },

            goBack() {
                this.$router.back(-1);
            },

            share() {
                let t = this;
                let shareObj = {};
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 4,
                            shareContent: shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 1,
                                shareContent: shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 3,
                                shareContent: shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest: function () {
                        $.ajax({
                            url: "/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.createShareData())
                            },
                            type: "post",
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                if (comm.hasResponseData(data)) {
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        url:'',
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
                                    $(sList).each(function (index, element) {
                                        if (element.shareChannel === 'QZone') {
                                            shareObj.title = element.shareTitle;
                                            shareObj.summary = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'Sina') {
                                            shareObj.sinaTitle = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatFriend') {
                                            shareObj.wxTitle = element.shareTitle;
                                            shareObj.wxDesc = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatTimeline') {
                                            shareObj.timeLineTitle = element.shareTitle;
                                        }

                                    });

                                }
                            }
                        });
                        return shareObj;
                    }
                }, false, $('.course-share'));
            },
            createShareData() {
                let t = this;
                let json = {};
                let routeName = t.$route.name;
                json = {
                    sceneType: '99',
                    customerId: TempCache.getItem('userId') || '',
                    courseName: t.courseName,
                    teacherName: t.teacherName,
                    appCoverPicUrl: t.appCoverPicUrl,
                    courseId: (comm.getparaNew().courseId+'').match(/\d+/)[0]
                };
                // switch (routeName) {
                //     case 'collegeProduce':
                //         json = {
                //             sceneType:'98',
                //             customerId:t.customerId
                //         };
                //         break;
                //     case 'payCourse':
                //         json = {
                //             sceneType:'99',
                //             customerId:TempCache.getItem('userId'),
                //             courseName:t.courseName,
                //             teacherName:t.teacherName,
                //             appCoverPicUrl:t.appCoverPicUrl
                //         };
                //         break;
                //     case 'payQuestionsDetails':
                //         json = {
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                //     case 'OpenInvoiceDetails':
                //         json ={
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                //     case 'AbnormalViewDetails':
                //         json ={
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                //     case 'PayZhiFuBaoDetails':
                //         json ={
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                //     case 'RefundDetails':
                //         json ={
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                //     case 'PayWeChatDetails':
                //         json ={
                //             sceneType:'101',
                //             customerId:t.customerId,
                //             questionTitle:'',
                //             questionType:''
                //         };
                //         break;
                // }
                return json;
            },
            communNum() {
                this.getChatList();
            },
            // 获取url参数
            getParams() {
                return new Promise((resolve, reject) => {
                    let url = location.href; //获取url中"?"符后的字串
                    let obj = {};
                    if (url.indexOf('?') !== -1) {
                        let params = url.split('?')[1];
                        for (let i = 0; i < params.length; i++) {
                            obj[params.split('=')[0]] = params.split('=')[1];
                        }
                        resolve(obj);
                    } else {
                        reject();
                    }
                })
            }
        }
    }
</script>
