<template>
    <section class="homeContainer">
        <section class="vip-shopping">
            <p class="vip-shopping-bg"></p>
            <HeaderBar style="background: transparent;position: relative;" :headerConfig="headerConfig"></HeaderBar>
            <div class="vip-header-box">
                <div class="vip-header-box-top">
                    <div class="vip-header-2">
                        <img src="http://img50.allinmd.cn/v3/vipShop/weipinhui.png">
                    </div>
                    <div class="vip-header-3">
                        <span>荟聚骨科品牌 助力医生成长</span>
                    </div>
                </div>
                <div class="entry-product">
                    <div v-for="(opt, index) in brandsList" :key="index" @click="toAllBrands(opt, index)" class="entry-product-item">
                        <img class="entry-product-search" :src="opt.brandImage">
                        <p>{{ opt.brandName }}</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- 热门专题 -->
        <section class="hot-topic">
            <div class="level-title">
                <div>热门专题</div>
                <div @click.stop="toAllAreas">全部
                    <img src="http://img50.allinmd.cn/v3/vipShop/arrow.png">
                </div>
            </div>
            <ul class="topic-container">
                <li v-for="(opt, index) in hotTopicList" :key="index" @click="toSpacialTopicDetail(opt, index)">
                    <p class="topic-bg">
                        <img :src="opt.imgUrl">
                    </p>
                    <p class="topic-title-scroll">{{ opt.anthologyName }}</p>
                </li>
            </ul>
        </section>
        <!-- 全部活动 -->
        <section class="hot-activities">
            <div class="level-title">
                <div>活动专区</div>
                <div @click="toAllActivies">全部
                    <img src="http://img50.allinmd.cn/v3/vipShop/arrow.png">
                </div>
            </div>
            <ul class="topic-container">
                <li v-for="(opt, index) in allActiviesList" :key="index" @click="toActiviesPage(opt, index)">
                    <p class="topic-bg" :style="{ background: 'url(' + opt.picUrl + ')' }">
                        <b :class="opt.state == 4 ? 'topic-tip-end' : 'topic-tip' " v-if="opt.state !== 0">{{ opt.state | activeState }}</b>
                    </p>
                    <p class="topic-title">{{ opt.name }}</p>
                </li>
            </ul>
        </section>
        <!-- 产品分类 -->
        <section class="product-cate">
            <div class="level-title">
                <div>产品分类</div>
                <div @click="toProductCate">全部
                    <img src="http://img50.allinmd.cn/v3/vipShop/arrow.png">
                </div>
            </div>
            <ul>
                <li v-for="(opt, index) in allProductList" :class="index < 4 ? 'bot_28' : ''" :key="index" @click="toProductDetail(opt, index)">
                    <p class="cat-1">
                        <img :src="opt.icon">
                    </p>
                    <p class="cat-2">{{ opt.catName }}</p>
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
import axios from 'axios';
import comm from 'static/js/comm';
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
import TempCache from "static/js/tempcache.js"
import { clearTimeout } from 'timers';
const baseApi = {
    getListWeiPinHui: '/mcall/med/brand/getListWeiPinHui/', // 品牌
    getSpacialTopic: '/mcall/column/config/resource/themeList/', // 专题
    getActiviesList: '/mcall/column/config/resource/activityList/', // 活动
}
export default {
    data() {
        return {
            headerConfig: {
                title: "",
                backOnOffWhite: true,
                showSearchWhite: {
                    onOrOff: true,
                    eventId: 8
                },
                // backFn: () => {
                //     console.log(window.history)
                //     console.log('*********')
                //     console.log(this.$router)
                //     // this.$router.push({ path: '/convergence' })
                // },
                share:{             //..自定义分享项
                    onOff:true,
                    shareWhiteBtn:true,//是否显示白色分享按钮
                    params: {
                        "sceneType": "105",
                        customerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                        "resourceType": 0,//固定传0
                        "columnId": 1563551999999//栏目id
                    }
                },
            },
            hotTopicList: [],
            allActiviesList:[],
            allProductList: [{
                catName: '人工关节',
                productId: 1499,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/1.png'
            }, {
                catName: '脊柱产品',
                productId: 1501,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/2.png'
            }, {
                catName: '创伤产品',
                productId: 1502,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/3.png'
            }, {
                catName: '运动医学',
                productId: 1500,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/4.png'
            }, {
                catName: '骨科药品',
                productId: 1498,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/5.png'
            }, {
                catName: '骨科设备',
                productId: 1507,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/6.png'
            }, {
                catName: '移植材料',
                productId: 1505,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/7.png'
            }, {
                catName: '康复产品',
                productId: 1503,
                icon: 'http://img50.allinmd.cn/v3/vipShop/product-cate/8.png'
            }],
            brandsList: []
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
    mounted() {
        document.title = '唯品汇'
        this.getListWeiPinHui()
        this.getSpacialTopic()
        this.getActiviesList()
    },
    methods: {
        buriedPoint(actionId) {
            let amChannel = comm.getpara()._amChannel;
            comm.creatEvent({
                triggerType:'宣传页',
                triggerName:'入驻唯医按钮点击',
                actionId:actionId,
                browType:397,
            });
        },
        getListWeiPinHui() {
            axios({
                url: baseApi.getListWeiPinHui,
                method: "get",
                params: {}
            }).then((res) => {
                // console.log(res)
                this.brandsList = res.data.responseObject.responseData.dataList.concat({brandName: '全部', brandImage: 'http://img50.allinmd.cn/v3/vipShop/header-all.png'})
            }).catch((err) => {
                console.log(err)
            });
        },
        getSpacialTopic() {
            axios({
                url: baseApi.getSpacialTopic,
                method: "get",
                params: {
                    paramJson: {
                        columnType: 1,
                        firstResult: 0,
                        maxResult: 8
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData.dataList) {
                    this.hotTopicList = res.data.responseObject.responseData.dataList
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        getActiviesList() {
            axios({
                url: baseApi.getActiviesList,
                method: "get",
                params: {
                   paramJson: {
                        columnType: 1,
                        firstResult: 0,
                        maxResult: 4
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData.dataList) {
                    this.allActiviesList = res.data.responseObject.responseData.dataList
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        toActiviesPage(opt, index) {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'热门活动点击',
                locationId: index,
                actionId:11849,
                browType:432,
            });
            setTimeout(fn => {
                window.location.href = opt.h5LinkUrl;
            }, 300)
        },
        toAllBrands(opt, index) {
            if (index === this.brandsList.length - 1) {
                comm.creatEvent({
                    triggerType:'品牌点击',
                    triggerName:'品牌专区点击',
                    actionId:11846,
                    browType:432,
                });
                this.$router.push({ path: '/allBrands' });
            } else {
                comm.creatEvent({
                    triggerType:'唯品汇',
                    triggerName:'品牌专区点击',
                    actionId:11845,
                    locationId: index,
                    browType:432,
                });
                console.log(opt)
                // this.$router.push({ path: 'https://m.allinmd.cn/dist/branUpgrade/branUpgrade.html?#/brands', query: { brandId: opt.brandId } })
                if (opt.cooperate) {
                    setTimeout(fn => {
                        window.location.href = 'https://m.allinmd.cn/dist/branUpgrade/branUpgrade.html?#/brands?brandId=' + opt.brandId
                    }, 300)
                    sessionStorage.setItem('isFromConvergence', true)
                } else {
                    setTimeout(fn => {
                        window.location.href = "https://m.allinmd.cn/dist/medPlus/medPlus.html#/brandDetail?brandId=" + opt.brandId + "&brandName=" + opt.brandName
                    }, 300)
                }
            }
        },
        toSpacialTopicDetail(opt, index) {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'热门专题点击',
                actionId:11847,
                locationId: index,
                browType:432,
            });
            setTimeout(fn => {
                window.location.href = opt.h5LinkUrl;
            }, 300)
        },
        toAllAreas() {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'全部专题按钮点击',
                actionId:11848,
                browType:432,
            });

            this.$router.push({ path: '/allAreas', query: { brandId: this.$route.query.brandId } });
        },
        toAllActivies() {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'全部活动按钮点击',
                actionId:11850,
                browType:432,
            });
            this.$router.push({ path: '/allActivies', query: { brandId: this.$route.query.brandId }});
        },
        toProductCate() {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'全部产品分类按钮点击',
                actionId:11852,
                browType:432,
            });
            setTimeout(fn => {
                window.location.href = 'https://m.allinmd.cn/dist/productClassify/productClassify.html?#/'
            }, 300)

            // http://10.1.8.44:8080/productClassify/productClassify.html#/?tId=206
            // this.$router.push({ path: '/dist/productClassify/productClassify.html?#/' })
        },
        toProductDetail(opt, index) {
            comm.creatEvent({
                triggerType:'唯品汇',
                triggerName:'产品分类点击',
                keyword: opt.catName,
                locationId: index,
                actionId:11851,
                browType:432,
            });
            setTimeout(fn => {
                window.location.href = 'https://m.allinmd.cn/dist/productClassify/productClassify.html?#/?tId=' + opt.productId + '&proName=' + opt.catName
            }, 300)

            // this.$router.push({ path: '/dist/medPlus/medPlus.html?#/productDetail?productId=' + opt.productId }) // tId=192&proName=药品
            // this.$router.push({ path: '/dist/productClassify/productClassify.html?#/?tId=' + opt.productId + '&proName=' + opt.catName })
        }
    },
    components:{
        HeaderBar
    }
}
</script>
