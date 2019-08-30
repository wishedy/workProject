<!--
 * @Description: 学院详情
 * @Author: 丁国庆
 * @Date: 2019-08-15 13:26:46
 * @LastEditTime: 2019-08-21 10:02:19
 * @LastEditors: 丁国庆
 -->
<template>
    <section class="college-detail">
        <WakeApp :options="wakeData"></WakeApp>
        <!-- 学院详情头部 -->
        <section class="college-detail-header" :style="{ backgroundImage: `url(${headerData.departmentCover})` }">
            <HeaderBar style="background: transparent;position: relative;" :headerConfig="headerConfig"></HeaderBar>
            <div class="college-detail-header-title">
                <span class="college-join-num">{{ headerData.joinCount }}人已加入</span>
                <span class="college-join-head" :style="{ background: `url(${headerData.headPic}) no-repeat center` }"></span>
            </div>
        </section>
        <!-- 优惠券 -->
        <section class="coupon-card" v-if="couponShow">
            <span class="coupon-title">{{ couponData.name }}</span>
            <span class="coupon-receive" v-if="!isHaveCoupon" @click="getCoupon">领取</span>
            <span class="coupon-have-receive" v-else>已领取</span>
        </section>
        <!-- 学院介绍 会员课程 手术实例 -->
        <section class="college-detail-infoBox">
            <div class="college-fixed-box">
                <div :class="isFixedTitle ? 'college-tab-fixed' : 'college-tab'" @click.stop="tabChange($event)">
                    <span class="tabOne"
                          v-for="(opt, index) in tabConfig"
                          :data-index="opt.index"
                          :class="opt.selected && opt.index === itemIn || !itemIn && Number(opt.index) === 1 ? 'tabActive' : ''"
                          :key="index">{{ opt.tagName }}</span>
                </div>
            </div>
            <!-- 学院介绍（类名不可更改）-->
            <section class="college-tab-college-info tag-scroll">
                <college-detail-info></college-detail-info>
            </section>
            <!-- 会员课程（类名不可更改） -->
            <section class="college-tab-vip-course tag-scroll">
                <h3>
                    <img src="/static/college/vip-recourse.png">
                    <span>会员课程</span>
                </h3>
                <ul class="latest-member-course-ul">
                    <li v-for="(opt, index) in vipCourseList" :key="index" v-if="Number(opt.courseType) !== 1" @click="openVipcourse(opt)">
                        <div class="latest-course-img">
                            <img :src="opt.image">
                            <span v-if="Number(opt.vipState) === 1"></span>
                        </div>
                        <div class="latest-course-info">
                            <p class="member-course-p1">{{ opt.title }}</p>
                            <p class="member-course-tip" v-if="Number(opt.courseType) === 2">{{ opt.desc }}</p>
                            <p class="member-course-tag" v-if="Number(opt.courseType) === 3">实操课</p>
                            <p class="member-course-p2">
                                <span>{{ opt.totalNum }}讲</span>
                                <span v-if="Number(opt.courseType) === 2">会员免费</span>
                                <button v-if="Number(opt.courseType) === 3">立即报名</button>
                            </p>
                        </div>
                    </li>
                </ul>
                <div class="future-ul">
                    <h6>即将更新</h6>
                    <div class="future-li" v-for="(item, key) in vipCourseList" :key="key" v-if="Number(item.courseType) === 1">
                        {{ item.title }}
                    </div>
                </div>
            </section>
            <!-- 手术案例（类名不可更改） -->
            <section class="college-tab-surgical-example tag-scroll">
                <h3>手术案例</h3>
                <h6>会员福利专区，海量手术视频持续更新</h6>
                <ul class="surgical-example-ul">
                    <li v-for="(opt, index) in surgicalExampleList" :key="index" @click="openExamplePage(opt)">
                        <div class="surgical-left" :style="{ background: `url(${opt.imgUrl}) no-repeat center` }">
                            <p>
                                <span class="surgical-example-play"></span>
                                <span class="surgical-example-time">{{ opt.playTime }}</span>
                            </p>
                        </div>
                        <div class="surgical-right">
                            <p class="surgical-title">{{ opt.title }}</p>
                            <div class="surgical-info">
                                <p class="surgical-info-1">
                                    <span>{{ opt.author }}</span>
                                </p>
                                <p class="surgical-info-2">
                                    <span>{{ opt.price }}元</span>
                                    <span>{{ opt.vipPrice }}元</span>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="course-tip">
                    <img src="/static/college/more_1.png">
                    <span>持续更新更多精彩课程</span>
                </div>
            </section>
        </section>
        <!-- 开通会员按钮 -->
        <section class="join-vip" v-if="Number(headerData.vipState) === 0">
            <div class="join-vip-left">
                <b>{{ headerData.vipDiscountPrice }}</b>
                <span>元/年</span>
                <span>限时特惠</span>
            </div>
            <div class="join-vip-right" @click="joinVip">
                <button>立即开通会员</button>
            </div>
        </section>
        <popups v-if="popShow"
                :productType="productType"
                :productId="productId"
                @pageTo="jumpPageTo"
                @close="closePopups">
        </popups>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
import axios from 'axios';
import comm from 'static/js/comm';
import commapp from 'static/js/comm.app';
import App from 'static/js/comm.app.js';
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
import WakeApp from  'components/WakeApp/WakeApp.vue';
import CollegeDetailInfo from './CollegeDetailInfo.vue';
import Popups from '@/components/Popups/Popups';
// import TempCache from "static/js/tempcache";
import Loading from "@/components/Loading/Loading";
import $ from 'jquery';
const Api = {
    headerInfo: '/allingateway/base-resource-platform/college/department/getDepartHead/', // 学院头部信息
    getCoupon: '/allingateway/base-shopping-platform/coupon/getOneCoupon/', // 领取优惠券
    vipCourseList: '/allingateway/base-resource-platform/college/department/getCourseInfo/', // 会员课程
    exampleList: '/allingateway/base-resource-platform/college/department/getCaseInfo/' // 手术案例
}
export default {
    data() {
        let androidParam = `{scene:3,type:109,sourceId:${this.$route.query.departmentId}}`;
        let iosParam = `scene=3&type=109&sourceId=${this.$route.query.departmentId}`;
        return {
            headerConfig: {
                title: "",
                backOnOffWhite: true,
                share:{             //..自定义分享项
                    onOff: true,
                    shareWhiteBtn: true,//是否显示白色分享按钮
                    params: {
                        // sceneType: "40",
                        // customerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):''
                    }
                },
                backFn: () => {
                    if (window.history.length>1) {
                        if (this.$router) {
                            this.$router.go(-1);
                        } else {
                            window.history.back(-1);
                        }
                    } else {
                        g_sps.jump(null,'/');
                    }
                }
            },
            headerData: {
                joinCount: 0,
                headPic: ''
            },
            couponData: {
                name: '',
                fetched: false
            },
            isHaveCoupon: false,
            couponShow: true,
            isFixedTitle: false,
            tabConfig: [{
                tagName: '学院介绍',
                index: 1,
                selected: true
            }, {
                tagName: '会员课程',
                index: 2,
                selected: false
            }, {
                tagName: '手术实例',
                index: 3,
                selected: false
            }],
            vipCourseList: [],
            surgicalExampleList: [],
            tabTopList: [], // 用于存储每个需要滚动模块距离顶部的值
            animateTime: 300, // 控制动画的时间
            itemIn: 0,
            popShow: false,
            wakeData: {
                el: ".al-newWakeUpAppBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam
            },
            pageConfig: {
                offset: 0,
                limit: 20
            },
            noData: false,
            ajaxing: false,
            loading: false,
            productType: 3,
            productId: 0,
            appPort: false,
            customerId: ''
        }
    },
    watch: {
        productId(val, oldVal) {
            console.log(val)
        }
    },
    mounted() {
        let t = this;
        window.addEventListener('scroll', this.handleScroll);
        this.getHeaderInfo();
        this.getVipCourseList();
        this.getExampleList();
        this.$nextTick(() => {
            let tagItemScroll = document.getElementsByClassName('tag-scroll');
            let tagItems = Array.from(tagItemScroll);
            for (let item = 0,len = tagItems.length; item < len; item++) {
                this.tabTopList.push(tagItems[item].offsetTop + offsetTop)
            }
            console.log(this.tabTopList)
        })
        if (t.appPort) {
            let coustomId = (appjs && appjs.getAuthorCustomerId());
            if (!coustomId) {
                appjs && appjs.myWorksPermission();
            }
        } else {
            user.privExecute({
                operateType: 'login',
                callback: function () {
                    // t.getBannerList();
                }
            });
        }
    },
    destroyed(){
        window.removeEventListener('scroll', this.handleScroll);
        localStorage.removeItem('isShowVipPopup');
        localStorage.removeItem('productId');
	},
    methods: {
        checkApp() {
            let _this = this;
            if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                _this.appPort = true;
                _this.customerId = appjs.getAuthorCustomerId();
                return
            } else {
                _this.appPort = false;
                _this.customerId = localStorage.getItem('userId');
                return
            }
        },
        handleScroll () {
            // 滚动吸顶
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (!!document.querySelector('.college-detail-infoBox')) {
                let offsetTop = document.querySelector('.college-detail-infoBox').offsetTop;
                if (Number(scrollTop) > Number(offsetTop)) {
                    this.isFixedTitle = true
                } else {
                    this.isFixedTitle = false
                }
            }
            // 方式一
            let tabScollTopList = []
            let tagItemScroll = document.getElementsByClassName('tag-scroll');
            let fixHeaderHeight = $('.college-fixed-box').get(0).offsetHeight;
            let tagItems = Array.from(tagItemScroll);
            for (let item = 0,len = tagItems.length; item < len; item++) {
                tabScollTopList.push(Math.floor(tagItems[item].getBoundingClientRect().top) - fixHeaderHeight)
            }
            // console.log(tabScollTopList)
            let lastArr = []
            tabScollTopList.forEach((opt, index) => {
                if (opt <= 0) {
                    lastArr.push(index)
                }
            })
            this.itemIn = lastArr.length
            // 方式二
            // let fixHeaderHeight = $('.college-fixed-box').get(0).offsetHeight;
            // for (let i = 0,len = this.tabTopList.length; i < len; i++) {
            //     if (scrollTop > (this.tabTopList[i] - fixHeaderHeight - 10) && scrollTop <= this.tabTopList[i+1]) {
            //         this.itemIn = i+1;
            //     } else if (scrollTop > (this.tabTopList[len-1] - fixHeaderHeight - 60)) {
            //         this.itemIn = len;
            //     }
            // }
            for (let j = 0, leng = this.tabConfig.length; j < leng; j++) {
                this.tabConfig[j].selected = false
                if (Number(this.itemIn) === Number(this.tabConfig[j]['index'])) {
                    this.tabConfig[this.itemIn-1].selected = true
                }
            }
        },
        scroll () {
            let that = this,
            scrollTop = 0;
            window.addEventListener('scroll', () => {
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if(scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 1) {
                    if (!that.noData) {
                        console.log('到达底部')
                        this.ajaxing = true;
                        that.pageConfig.offset += 10;
                        that.getExampleList()
                    }
                }
            }, false);
        },
        getHeaderInfo () {
            axios.get(Api.headerInfo, {
                params: {
                    departmentId: this.$route.query.departmentId,
                    opUsr: localStorage.getItem("userId")
                }
            }).then((res) => {
                if (res && res.data && res.data.responseData.headInfo) {
                    this.headerData = res.data.responseData.headInfo
                    document.title = res.data.responseData.headInfo.departmentName
                    this.headerConfig.share.params.keyword = this.headerData.departmentName
                    this.headerConfig.share.params.sceneType = '40'
                    this.headerConfig.share.params.customerId = localStorage.getItem('userId')!=undefined?localStorage.getItem('userId'):''
                    if (res.data.responseData.headInfo) {
                        if (localStorage.getItem('isShowVipPopup') && localStorage.getItem('productId')) {
                            this.popShow = true
                            this.productId = res.data.responseData.headInfo.productId
                            setTimeout(() => {
                                localStorage.removeItem('isShowVipPopup')
                                localStorage.removeItem('productId')
                            },100)
                        }
                    }
                }
                if (res && res.data && res.data.responseData.coupon) {
                    this.couponData = res.data.responseData.coupon
                    this.isHaveCoupon = res.data.responseData.coupon.fetched
                } else if (res.data.responseData.coupon === null) {
                    this.couponShow = false
                }
            })
        },
        getVipCourseList () {
            axios.get(Api.vipCourseList, {
                params: {
                    departmentId: this.$route.query.departmentId,
                    opUsr: localStorage.getItem('userId')
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data && res.data.responseData && res.data.responseData.courseList) {
                    this.vipCourseList = res.data.responseData.courseList
                }
            })
        },
        getExampleList () {
            axios.get(Api.exampleList, {
                params: {
                    departmentId: this.$route.query.departmentId,
                    opUsr: localStorage.getItem('userId'),
                    offset: this.pageConfig.offset,
                    limit: this.pageConfig.limit
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data && res.data.responseData && res.data.responseData.dataList && res.data.responseData.dataList.length !== 0) {
                    this.surgicalExampleList = this.surgicalExampleList.concat(res.data.responseData.dataList)
                    this.scroll()
                } else if (res.data.responseData.dataList && res.data.responseData.dataList.length === 0) {
                    this.noData = true
                }
                this.ajaxing = false;
            })
        },
        getCoupon () {
            axios.get(Api.getCoupon, {
                params: {
                    queryJson: {
                        customerId: localStorage.getItem('userId'),
                        couponBatchId: this.couponData.couponBatchId,
                        productType: 3
                    }
                }
            }).then((res) => {
                if (res && res.data && res.data.responseData && res.data.responseStatus && res.data.responseData !== null) {
                    this.isHaveCoupon = true
                    popup("领取成功");
                    this.buriedPoint(11754, '二级学院领取优惠券', '', this.headerData.departmentName)
                }
            })
        },
        tabChange (event) {
            console.log(event.target.dataset.index);
            if (event.target.dataset.index) {
                this.tabConfig.forEach((item, key) => {
                    if (Number(event.target.dataset.index) === Number(item.index)) {
                        item.selected = true
                    } else {
                        item.selected = false
                    }
                })
                let tagOption = '';
                let fixHeaderHeight = $('.college-fixed-box').get(0).offsetHeight;
                let colInfoTag = $('.college-tab-college-info').offset().top; // 学院介绍
                let colVipTag = $('.college-tab-vip-course').offset().top; // 会员课程
                let colExaTag = $('.college-tab-surgical-example').offset().top; // 手术实例
                switch (Number(event.target.dataset.index)) {
                    case 1:
                        tagOption = colInfoTag
                        this.buriedPoint(11887, '二级学院点击学院介绍导航', '', this.headerData.departmentName)
                        break;
                    case 2:
                        this.buriedPoint(11888, '二级学院点击会员课程导航', '', this.headerData.departmentName)
                        tagOption = colVipTag
                        break;
                    case 3:
                        this.buriedPoint(11889, '二级学院点击手术实例导航', '', this.headerData.departmentName)
                        tagOption = colExaTag
                        break;
                }
                $('html, body').animate({scrollTop: `${tagOption - fixHeaderHeight + 5}px`}, this.animateTime);
            }
        },
        openVipcourse (opt) {
            // 正常售卖会员课
            if (Number(opt.courseType) === 2) {
                console.log(opt.courseId)
                this.buriedPoint(11885, '二级学院点击会员课', '', this.headerData.departmentName, opt.courseId)
                setTimeout(() => {
                    window.location.href = 'https://m.allinmd.cn/dist/consumeCourse/consumeCourse.html#/home?courseId=' + opt.courseId
                }, 300)
            // 实操课报名
            } else if (Number(opt.courseType) === 3) {
                this.buriedPoint(11890, '二级学院点击线下实操', '', this.headerData.departmentName)
                setTimeout(() => {
                    window.location.href = 'https://m.allinmd.cn/dist/operateSignUp/operateSignUp.html'
                }, 300)  
            }
        },
        openExamplePage (opt) {
            this.buriedPoint(11886, '二级学院点击手术实例视频', '', this.headerData.departmentName, '', opt.h5VideoUrl)
            setTimeout(() => {
                window.location.href = opt.h5VideoUrl
            }, 300)
        },
        joinVip () {
            let _this = this
            this.buriedPoint(11895, '二级学院吸底开通会员按钮点击', '', this.headerData.departmentName)
            if (!comm.isWeiXin()) {
                this.releaseCallApp()
            } else {
                if (_this.appPort) {
                    let coustomId = (appjs && appjs.getAuthorCustomerId());
                    if (!coustomId) {
                        appjs && appjs.myWorksPermission();
                    }
                } else {
                    let role = parseInt(localStorage.getItem('customerRole'), 10);
                    //1-系统、2-组织、3-厂商、5-普通医生、6-认证医生、7-住陪学员、11-执业医师、12-护理、13-医助、14-厂商未认证、15-厂商已认证
                    let roleOnOff = role===5||role===6||role===7||role===11||role===12;
                    if(roleOnOff){//医务人员，医生，护士，医学生
                        _this.auth();
                    }else{
                        console.log('认证权限不够不可以购买')
                        //不可以购买
                    }
                }
            }
        },
        auth(){
            let _this = this;
            switch (parseInt(localStorage.getItem('auth').state)) {
                case -1:
                case 3:
                case 0:
                case 1:
                    user.privExecute({
                        operateType: 'auth',
                        noNeedBack:false,
                        noAuthTip:1,
                        callback: function () {}
                    });
                    break;
                case 2://可以购买
                case 7://可以购买
                case 8://可以购买
                case 9://可以购买
                    comm.loginInit();//静默登录，用来获取openId
                    setTimeout(() => {
                        window.location.href = `https://m.allinmd.cn/dist/payDetail/payDetail.html?productId=${this.headerData.productId}&productType=3`
                    }, 300)
                    break;
            }
        },
        releaseCallApp (openId, description) {
            this.buriedPoint(openId, description);
            let amChannel = comm.getpara()._amChannel;
            // let openAppParmas = {};//打开app弹层数据
            App.newReleaseBox({
                imgPath:"//img50.allinmd.cn/case/release.png",
                title:"请在APP或微信浏览器中支付",
                solidBtnTitile:"立即使用",
                authNoneTitle:"暂不使用",
                data:{
                    el: ".al-newWakeUpAppBtn",
                    ios: `allinmdios://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
                    ios9: `http://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
                    android: `allin://com.allin.social:75235?data={scene:3,type:109,sourceId:${this.$route.query.departmentId}}`
                }
            });
            return false;
        },
        buriedPoint (openId, description, index, keyword, refId, browseTypeUrl) {
            // let amChannel = comm.getpara()._amChannel;
            let paramsData = {
                triggerType: '二级学院',
                triggerName: description,
                locationId: index,
                actionId:openId,
                browType: 413
            }
            if (keyword) {
                paramsData.keyword = keyword
            }
            if (refId) {
                paramsData.refId = refId
            }
            if (browseTypeUrl) {
                paramsData.browseTypeUrl = browseTypeUrl
            }
            console.log(paramsData)
            comm.creatEvent(paramsData);
        },
        jumpPageTo () {
            this.buriedPoint(11898, '加入会员弹层点击二级学院主页按钮', '', this.headerData.departmentName);
            // commapp.bindCallApp({
            //     el: ".al-newWakeUpAppBtn",
            //     ios: `allinmdios://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
            //     ios9: `http://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
            //     android: `allin://com.allin.social:75235?data={scene:3,type:109,sourceId:${this.$route.query.departmentId}}`
            // });
            commApp.appWakeUp("confirm", {
                runAtOnce: false,
                ios: `allinmdios://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
                ios9: `http://app.allinmd.cn/applinks.html?scene=3&type=109&sourceId=${this.$route.query.departmentId}`,
                android: `allin://com.allin.social:75235?data={scene:3,type:109,sourceId:${this.$route.query.departmentId}}`
            });//唤醒app弹层
        },
        closePopups () {
            this.popShow = false
        }
    },
    components: {
        WakeApp,
        Loading,
        Popups,
        HeaderBar,
        CollegeDetailInfo
    }
}
</script>
