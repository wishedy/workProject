<template>
    <section class="brands-container" :style="{ 'background-image': `linear-gradient(${linearGradient})`}">
        <WakeApp :options="wakeData" style="margin-bottom: 0;"></WakeApp>
        <!-- 品牌基本介绍 -->
        <section class="brands-info-box" :style="{ background: 'url(' + backgroundImg + ') no-repeat' }">
            <HeaderBar style="background: transparent; padding: 0" :headerConfig="headerConfig"></HeaderBar>
            <h1 class="brand-header-name">{{ headerInfo.headerName }}</h1>
            <div class="brand-info-gallery">
                <div class="brand-info" @click="releaseCallApp(11496, '查看品牌介绍内容')">
                    <p class="brand-info-1">介绍</p>
                    <p class="brand-info-2"><img src="http://img50.allinmd.cn/v3/brands/introduction.svg"></p>
                </div>
                <div class="brand-gallery">
                    <div class="swiper-container banner-container">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="(item, index) in headerInfo.bannerList" @click="buriedPoint(11502, '点击查看banner图片', index)" :key="index">
                                <img :src="item.imageUrl">
                                <!-- <img src="/static/images/buyHelp/2.png"> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination banner-pagination"></div>
        </section>
        <!-- 最新动态 -->
        <section class="latest-news" v-if="hotTopicShow">
            <div class="level-title">
                <div>最新动态</div>
                <div @click="toAlLatestNews">{{ newActiviesCount }}个动态
                    <img src="http://img50.allinmd.cn/v3/brands/more.svg">
                </div>
            </div>
            <ul class="topic-container">
                <li v-for="(opt, index) in hotTopicList" :key="index" @click="activiesJumpLink(opt)">
                    <p class="topic-bg">
                        <img :src="opt.imgUrl">
                        <!-- <img src="/static/images/buyHelp/2.png"> -->
                        <span :class="opt.state == 4 ? 'activeEndState' : 'activeState' " v-if="opt.state !== 0 && opt.state !== ''">{{ opt.state | activeState }}</span>
                    </p>
                    <p class="topic-title-scroll">{{ opt.anthologyName }}</p>
                </li>
            </ul>
        </section>
        <!-- 旗下产品 -->
        <section class="its-products" v-if="itsProductShow">
            <div class="level-title">
                <div>旗下产品</div>
                <div @click="toItsProduct">全部
                    <img src="http://img50.allinmd.cn/v3/brands/more.svg">
                </div>
            </div>
            <div class="touch-tags">
                <p class="touch-tag-item" v-for="(item, index) in itsTags" :key="index" @click="selectProduct(item)">
                    <span>{{ item.propertyName }}</span>
                </p>
            </div>
            <ul class="its-product-box">
                <!-- <li v-for="(opt, index) in itsProducts" @click.stop="toProductDetail(opt)" :class="index < 4 ? 'bot_28' : ''" :key="index"> -->
                <li v-for="(opt, index) in itsProducts" @click.stop="toProductDetail(opt)" class="bot_28" :key="index">
                    <p class="cat-1">
                        <img :src="opt.productAttUrl">
                        <!-- <img src="/static/images/test/1.png"> -->
                    </p>
                    <p class="cat-2" :style="{ textAlign: opt.productName && opt.productName.length < 6 ? 'center' : 'left' }">
                        <span class="cat-2-span">{{ opt.productName }}</span>
                    </p>
                </li>
            </ul>
        </section>
        <!-- 学术内容 -->
        <section class="academic-content" v-if="academicShow">
            <div class="level-title">
                <div>学术内容</div>
                <div @click="toAcademic">全部
                    <img src="http://img50.allinmd.cn/v3/brands/more.svg">
                </div>
            </div>
            <div class="touch-tags">
                <p class="touch-tag-item" v-for="(item, index) in academicTags" :key="index" @click="selectAcademic(item)">
                    <span>{{ item.propertyName }}</span>
                </p>
            </div>
            <ul class="academic-article">
                <li v-for="(item, index) in academicList" :key="index" @click="toAcademicDetail(item)">
                    <div class="academic-article-left">
                        <p class="academic-article-left-title">{{ item.resourceName }}</p>
                        <p class="academic-article-left-views">
                            <span class="academic-article-left-author" v-if="item.resourceAuthor">{{ item.resourceAuthor }}</span>
                            <span class="academic-article-left-viewNum">{{ item.browseNum }}浏览</span>
                        </p>
                    </div>
                    <div class="academic-article-right">
                        <img class="academic-cover" v-if="item.resourceLogoUrl" :src="item.resourceLogoUrl">
                        <span class="academic-cover-default" v-else></span>
                        <div class="academic-play-box" v-if='item.resourceType == 1'>
                            <img class="academic-play" src="http://img50.allinmd.cn/v3/brands/play.svg">
                            <span class="academic-longtime">{{ item.playTime }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <!-- 留言 -->
        <section class="leaveMessage">
            <div class="leave-box" @click="releaseCallApp(11861, '反馈')">
                <img class="leave-img" src="http://img50.allinmd.cn/v3/brands/leave-tip.svg">
                <div class="leave-text">没有找到想要的，可以点击这里留言！</div>
            </div>
        </section>
        <!-- 联系厂商 -->
        <section style="display: block;" @click="contactBrand" :class=" isScroll ? 'contact-brand-hind' : 'contact-brand'">
            <!-- <div :style="{ background: 'url(' + contactBg + ')' }" class="contactBlur"></div> -->
            <div :style="{ background: contactBgColor }" class="contactBlur"></div>
            <span>联系品牌</span>
        </section>
    </section>
</template>

<script>
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
import WakeApp from  'components/WakeApp/WakeApp.vue';
import comm from 'static/js/comm';
import App from 'static/js/comm.app.js';
import axios from "axios";
import TempCache from "static/js/tempcache.js"
const baseApi = { // 接口地址：http://wiki.dr-ing.com/pages/viewpage.action?pageId=15728871
    getBrandInfo: '/mcall/med/brand/getBrandDetail/', // 1.头部信息
    getNewActivies: '/mcall/column/config/resource/brandDynamics/', // 最新动态
    getAcademicList: '/mcall/med/brand/getIndexResourceList/', // 学术内容
    underProductList: '/mcall/med/product/getProductByBrandId/' // 旗下产品
}
export default {
    data() {
        return {
            headerConfig: {
                title: "",
                backOnOffWhite: true,
                showSearchWhite: {
                    onOrOff: true,
                    eventId: '11880',
                    sourceId:this.$route.query.brandId
                },
                share:{             //..自定义分享项
                    onOff:true,
                    shareWhiteBtn:true,//是否显示白色分享按钮
                    params: {
                        "sceneType": "104",
                        customerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                        "brandId": this.$route.query.brandId,//品牌id
                        "columnId": 1563551999999//栏目id
                    }
                },
                backFn: () => {
                    // this.$router.push({ path: '/brands', query: { brandId: this.$route.query.brandId } })
                    console.log(sessionStorage.getItem('isFromConvergence'))
                    if (sessionStorage.getItem('isFromConvergence')) {
                        window.location.href = 'https://m.allinmd.cn/dist/convergence/convergence.html#/convergence'
                    } else {
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
                    sessionStorage.removeItem('isFromConvergence')
                }
            },
            linearGradient: '',
            backgroundImg: '',
            wakeData:{
                el: ".al-newWakeUpAppBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html",
                ios9: "http://app.allinmd.cn/applinks.html",
                android: "allin://com.allin.social:75235?data={}"
            },
            headerInfo:  {
                headerName: '',
                bannerList: []
            },
            newActiviesCount: 0,
            hotTopicList: [],
            itsTags: [],
            itsProducts: [],
            academicTags: [],
            academicList: [],
            contactBg: '',
            contactBgColor: '',
            hotTopicShow: true,
            itsProductShow: true,
            academicShow: true,
            isScroll: false
        }
    },
    filters: {
        activeState: function(state) {
            let stateItem = '';
            switch (state) {
                case 1:
                    stateItem = '最热'
                    break;
                case 2:
                    stateItem = '最新'
                    break;
                case 3:
                    stateItem = '进行中'
                    break;
                case 4:
                    stateItem = '已结束'
                    break;
            }
            return stateItem;
        }
    },
    created() {
        this.getBrandInfo()
        this.underProductList()
    },
    mounted() {
        this.newActivies()
        this.getAcademicList()
        this.headerInfo.bannerList.length > 0 ? this.initSwiper() : '';
        window.addEventListener('scroll', this.handleScroll)
    },
    watch: {
        'headerInfo.bannerList': {
            handler: function() {
                setTimeout(() => {
                    this.initSwiper();
                }, 300);
            },
            deep: true
        }
    },
    methods: {
        handleScroll() {
            let scroll = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            // if (scroll > 1) {
            //     this.isScroll = true
            // } else {
            //     this.isScroll = false
            // }
        },
        contactBtnBgColor(value) {
            let imgUrl = '';
            switch (value) {
                case 1:
                    imgUrl = '#8e2624'
                    break;
                case 2:
                    imgUrl = 'rgb(156, 80, 52)'
                    break;
                case 3:
                    imgUrl = 'rgb(179, 132, 52)'
                    break;
                case 4:
                    imgUrl = 'rgb(25, 140, 158)'
                    break;
                case 5:
                    imgUrl = 'rgb(30, 133, 175)'
                    break;
                case 6:
                    imgUrl = 'rgb(26, 80, 142)'
                    break;
                case 7:
                    imgUrl = 'rgb(57, 57, 132)'
                    break;
                case 8:
                    imgUrl = 'rgb(123, 107, 96)'
                    break;
                default:
                    iimgUrl = 'rgb(123, 107, 96)'
                    break;
            }
            // return `#${imgUrl}`;
            return imgUrl;
        },
        contactBtnBg(value) {
            let imgUrl = '';
            switch (value) {
                case 1:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/1.png'
                    break;
                case 2:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/2.png'
                    break;
                case 3:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/3.png'
                    break;
                case 4:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/4.png'
                    break;
                case 5:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/5.png'
                    break;
                case 6:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/6.png'
                    break;
                case 7:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/7.png'
                    break;
                case 8:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/8.png'
                    break;
                default:
                    imgUrl = 'http://img50.allinmd.cn/v3/brands/contact/8.png'
                    break;
            }
            return imgUrl;
        },
        linearGradientFilter(type) { // 1-红 2-橙 3-黄 4-绿 5-蓝 6-靛 7-紫 8-灰
            let linearColor = '';
            type = parseInt(type ,10);
            switch (type) {
                case 1:
                    linearColor = '180deg, #7F2422 0%, #6A1C1B 100%'
                    break;
                case 2:
                    linearColor = '180deg, #9A4D31 0%, #6A3725 100%'
                    break;
                case 3:
                    linearColor = '180deg, #9A722E 0%, #9A722E 100%'
                    break;
                case 4:
                    linearColor = '180deg, #1C8798 0%, #0F5965 100%'
                    break;
                case 5:
                    // linearColor = '180deg, #2085AE 0%, #2085AE 100%'
                    linearColor = '180deg, #3295bc, #004866'
                    break;
                case 6:
                    linearColor = '180deg, #274C76 0%, #1F3A5D 100%'
                    break;
                case 7:
                    linearColor = '180deg, #303062 0%, #282851 100%'
                    break;
                case 8:
                    linearColor = '180deg, #6C5E55 0%, #4D4744 100%'
                    break;
                default:
                    linearColor = '180deg, #6C5E55 0%, #4D4744 100%'
                    break;
            }
            console.log(linearColor)
            return linearColor;
        },
        // 去掉其它
        rmOther(list) {
            let newList = [];
            list.forEach((opt, index) => {
                if (opt.propertyName !== '其它') {
                    newList.push({
                        propertyId: opt.propertyId,
                        propertyName: opt.propertyName
                    })
                }
            })
            return newList
        },
        //
        initSwiper(){
            let mySwiper = new Swiper('.banner-container', {
                autoplay: 3000,
                loop: false,
                pagination: '.banner-pagination',
                slidesPerView: 'auto',
                paginationClickable: true,
                onSlideChangeEnd: function(data) {
                    // var lastSwiper = document.getElementsByClassName()
                }
            });
        },
        getBrandInfo() {
            axios.get(baseApi.getBrandInfo, {
                params: {
                    paramJson: {
                        brandId: this.$route.query.brandId, // 1457586820707
                    }
                }
            }).then((res) => {
                // console.log(res)
                this.headerInfo.headerName = res.data.responseObject.responseData.dataList[0].brandName
                this.headerInfo.bannerList = res.data.responseObject.responseData.dataList[0].brandAttImgList
                this.backgroundImg = res.data.responseObject.responseData.dataList[0].backgroundImg
                this.linearGradient = this.linearGradientFilter(res.data.responseObject.responseData.dataList[0].colorType)
                // this.contactBg = this.contactBtnBg(parseInt(res.data.responseObject.responseData.dataList[0].colorType, 10))
                this.contactBgColor = this.contactBtnBgColor(parseInt(res.data.responseObject.responseData.dataList[0].colorType, 10))
                document.title = this.headerInfo.headerName;
                if (res.data.responseObject.responseData.dataList[0].isCooperate == '0') {
                    window.location.href = "https://m.allinmd.cn/dist/medPlus/medPlus.html#/brandDetail?brandId=" + res.data.responseObject.responseData.dataList[0].brandId + "&brandName=" + res.data.responseObject.responseData.dataList[0].brandName
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        newActivies() {
            axios.get(baseApi.getNewActivies, {
                params: {
                    paramJson: {
                        brandId: this.$route.query.brandId,
                        columnId: 1563551999999,
                        firstResult: 0,
                        maxResult: 8
                    }
                }
            }).then((res) => {
                console.log(res)
                this.hotTopicList = res.data.responseObject.responseData.dataList
                this.newActiviesCount = res.data.responseObject.responseData.totalCount
                if (res.data.responseObject.responseData.dataList.length === 0) {
                    this.hotTopicShow = false
                } else {
                    this.hotTopicShow = true
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        // 学术内容
        getAcademicList() {
            axios.get(baseApi.getAcademicList, {
                params: {
                    paramJson: {
                        brandId: this.$route.query.brandId,
                        columnId: 1563551999999,
                        firstResult: 0,
                        maxResult: 3
                    }
                }
            }).then((res) => {
                this.academicList = res.data.responseObject.responseData.dataList
                this.academicTags = this.rmOther(res.data.responseObject.responseData.propertyList)
                if (res.data.responseObject.responseData.dataList.length === 0) {
                    this.academicShow = false
                } else {
                    this.academicShow = true
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        toAcademicDetail(item) {
            comm.creatEvent({
                triggerType:'品牌详情页',
                triggerName: '查看相关内容',
                refId: item.resourceId,
                actionId:11498,
                browType:372,
            });
            setTimeout(fn => {
                window.location.href = item.pageStoragePath
            }, 300)
        },
        // 旗下产品
        underProductList() {
            axios.get(baseApi.underProductList, {
                params: {
                    paramJson: {
                        firstResult: 0,
                        maxResult: 6,
                        brandId: this.$route.query.brandId
                    }
                }
            }).then((res) => {
                console.log(res)
                this.itsProducts = res.data.responseObject.responseData.dataList
                this.itsTags = this.rmOther(res.data.responseObject.responseData.propertyList)
                if (res.data.responseObject.responseData.dataList.length === 0) {
                    this.itsProductShow = false
                } else {
                    this.itsProductShow = true
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        toProductDetail(opt) {
            comm.creatEvent({
                triggerType:'品牌详情页',
                triggerName:'查看产品内容',
                refId: opt.productId,
                actionId:11497,
                browType:372,
            });
            setTimeout(fn => {
                window.location.href = 'https://m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?productId=' + opt.productId
            }, 300)
        },
        selectProduct(opt) {
            console.log(opt) // propertyId /branUpgrade/branUpgrade.html#/underProduct
            this.buriedPoint(11862, '旗下产品-点击分类');
            this.$router.push({ path: 'underProduct', query: { brandId: this.$route.query.brandId, propertyId: opt.propertyId } })
        },
        selectAcademic(opt) {
            console.log(opt) // propertyId /branUpgrade/branUpgrade.html#/underProduct
            this.buriedPoint(11863, '学术内容-点击分类');
            this.$router.push({ path: 'academic', query: { brandId: this.$route.query.brandId, propertyId: opt.propertyId } })
        },
        bannerCreateLog(e) {
            let t=this,
            param=e.currentTarget.getAttribute("href")+"$"+e.currentTarget.getAttribute("adId");
            comm.creatEvent({
                triggerType: '广告位',
                keyword: "广告位-轮播图(会议)-" + e.target.getAttribute('alt'),
                actionId: 14,
                param:param,
                locationId: parseInt(e.currentTarget.getAttribute('index'),10)+1,
                refId: e.currentTarget.getAttribute("href")
            });
        },
        activiesJumpLink(item) {
            comm.creatEvent({
                triggerType: '品牌详情页',
                triggerName: '查看最新动态',
                refId: item.refId,
                actionId:11882,
                browType:372,
            });
            setTimeout(fn => {
                window.location.href = item.h5LinkUrl;
            }, 300)
        },
        toAlLatestNews() {
            this.buriedPoint(11859, '更多-动态');
            this.$router.push({ path: '/latestNews', query: { brandId: this.$route.query.brandId } })
        },
        toItsProduct() {
            this.buriedPoint(11499, '更多-产品');
            this.$router.push({ path: '/underProduct', query: { brandId: this.$route.query.brandId } })
        },
        toAcademic() {
            this.buriedPoint(11858, '更多-内容');
            this.$router.push({ path: '/academic', query: { brandId: this.$route.query.brandId } })
        },
        contactBrand() {
            this.releaseCallApp(11860, '品牌页-联系品牌按钮')
        },
        buriedPoint(openId, description, index) {
            let amChannel = comm.getpara()._amChannel;
                comm.creatEvent({
                triggerType: '品牌详情页',
                triggerName: description,
                brandId: this.$route.query.brandId, // 品牌ID
                locationId: index,
                actionId:openId,
                browType: 372
            });
        },
        releaseCallApp(openId, description) {
            this.buriedPoint(openId, description);
             let amChannel = comm.getpara()._amChannel;
            let openAppParmas = {};//打开app弹层数据
            App.newReleaseBox({
                imgPath:"//img50.allinmd.cn/case/release.png",
                title:"查看更多内容，请使用唯医骨科App",
                solidBtnTitile:"立即使用",
                authNoneTitle:"暂不使用",
                data:{
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:11,type:51,"+(amChannel?",_amChannel:"+amChannel:'')+ "}"
                }
            });
            return false;
        }
    },
    components: {
        HeaderBar,
        WakeApp
    }
}
</script>
