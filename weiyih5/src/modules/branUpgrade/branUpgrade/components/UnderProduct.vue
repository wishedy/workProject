<template>
    <section class="underProductContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <nav class="area-navbar">
            <ul data-alcode-mod='380' class="area-navbar-box">
                <li class="area-navbar-item"
                    :class="{actives: index == activeItem}"
                    @click.stop="activeChange(opt, index)"
                    v-for="(opt, index) in tabsMenu"
                    :key="index">
                    <div class="tab-name-item">{{ opt.propertyName }}</div>
                </li>
            </ul>
        </nav>
        <ul class="under-msg-box">
            <li class="under-msg-item" v-for="(opt, index) in underProductList" @click="toProductDetail(opt)" :key="index">
                <img class="under-msg-banner" :src="opt.productAttUrl">
                <span class="under-msg-content">{{ opt.productName }}</span>
            </li>
        </ul>
        <!-- <section class="listNoMore" v-if="noData">~  没有更多了  ~</section> -->
        <section class="listNoMore" v-if="noData"></section>
    </section>
</template>

<script>
import axios from "axios";
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
import { setTimeout } from 'timers';
const baseApi = {
    getUnderProductList: '/mcall/med/product/getProductList/',
    getTags: '/mcall/med/brand/getTags/'
}
export default {
    data() {
        return {
            headerConfig: {
                title: "旗下产品",
                backOnOff: true,
                share: {
                    onOff: false
                },
                showSearchBlack: {
                    onOrOff: true,
                    eventId: '11880'
                },
                feedback: {
                    onOff: false
                },
                backFn: () => {
                    this.$router.push({ path: '/brands', query: { brandId: this.$route.query.brandId } })
                }
            },
            activeItem: 0,
            tabsMenu: [],
            underProductList: [],
            noData: false,
            firstResult: 0,
            maxResult: 10,
            styleXScroll: null,
            triggerXScroll: false,
            propertyId: ''
        }
    },
    created() {
        
        },
    mounted() {
        document.title = '旗下产品 | 唯品汇'
        this.getTags()
    },
    beforeUpdate() {
        if (!this.triggerXScroll) {
            this.styleXScroll = setTimeout(() => {
                if (this.tabsMenu.length !== 0) {
                    document.getElementsByClassName('area-navbar-box')[0].scrollLeft = document.getElementsByClassName('actives')[0].offsetLeft - document.getElementsByClassName('actives')[0].clientWidth;
                    clearTimeout(this.styleXScroll)
                    this.triggerXScroll = true
                }
            },100)
        }
    },
    methods: {
        scroll() {
            let that = this,
            scrollTop = 0;
            window.addEventListener('scroll', () => {
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if(scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 1) {
                    if (!this.noData) {
                        console.log('到达底部')
                        this.firstResult += 10;
                        this.getUnderProductList(this.$route.query.propertyId || this.propertyId)
                    }
                }
            }, false);
        },
        getTags() {
            var that = this;
            axios.get(baseApi.getTags, {
                params: {
                    paramJson: {
                        brandId: this.$route.query.brandId,
                        moduleType: 3
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList.length !== 0) {
                    this.tabsMenu = res.data.responseObject.responseData.dataList
                    this.propertyId = res.data.responseObject.responseData.dataList[0].propertyId
                    // 某个tag进来
                    if (this.$route.query && this.$route.query.propertyId) {
                        this.tabsMenu.forEach((opt, index) => {
                            if (opt.propertyId == this.$route.query.propertyId) {
                                that.activeItem = index
                            }
                        })
                        this.getUnderProductList(this.$route.query.propertyId)
                    // 点击全部
                    } else {
                        this.getUnderProductList(this.tabsMenu[0].propertyId)
                    }
                // 没有tag的情况下 默认请求其他，propertyId传空
                } else {
                    this.getUnderProductList()
                }
                this.scroll()
            }).catch((err) => {
                // console.log(err)
            });
        },
        getUnderProductList(propertyId) {
            axios.get(baseApi.getUnderProductList, {
                params: {
                    paramJson: {
                        brandId: this.$route.query.brandId,
                        propertyId: propertyId,
                        firstResult: this.firstResult,
                        maxResult: this.maxResult
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseMessage === 'success') {
                    this.underProductList = this.underProductList.concat(res.data.responseObject.responseData.dataList)
                } else if (res.data.responseObject.responseMessage === 'nodata') {
                    this.noData = true
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        toProductDetail(opt) {
            comm.creatEvent({
                triggerType: '旗下产品页',
                triggerName: '查看产品内容',
                refId: opt.productId,
                actionId:11500,
                browType:373,
            });
            setTimeout(fn => {
                window.location.href = 'https://m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?productId=' + opt.productId
            }, 300)
        },
        activeChange(opt, index) {
            comm.creatEvent({
                triggerType: '旗下产品页',
                triggerName: 'tab切换',
                refId: opt.propertyId,
                actionId:11865,
                browType:373,
            });

            if (Number(opt.propertyId) !== Number(this.$route.query.propertyId)) {
                this.activeItem = index;
                this.$router.push({ path: 'underProduct', query: { brandId: this.$route.query.brandId, propertyId: opt.propertyId } })
                this.underProductList = []
                // 重置分页
                this.firstResult = 0;
                this.maxResult = 10;
                this.noData = false
                this.getUnderProductList(opt.propertyId)
            }

        }
    },
    components: {
        HeaderBar
    }
}
</script>

<style>

</style>
