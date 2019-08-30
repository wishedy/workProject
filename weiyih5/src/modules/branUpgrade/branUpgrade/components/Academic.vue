<template>
    <section class="academicContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <nav class="area-navbar">
            <ul data-alcode-mod='380' class="area-navbar-box">
                <li class="area-navbar-item" :class="{actives: index == activeItem}" @click.stop="activeChange(opt, index)" v-for="(opt, index) in tabsMenu" :key="index">
                    <div class="tab-name-item">{{ opt.propertyName }}</div>
                </li>
            </ul>
        </nav>
        <ul class="academic-article-box">
            <li v-for="(item, index) in academicList" :key="index" @click.stop="toAcademicDetail(item)">
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
                    <div class="academic-play-box" v-if="item.resourceType == 1">
                        <img class="academic-play" src="http://img50.allinmd.cn/v3/brands/play.svg">
                        <span class="academic-longtime">{{ item.playTime }}</span>
                    </div>
                </div>
            </li>
        </ul>
        <!-- <section class="listNoMore" v-if="noData">~  没有更多了  ~</section> -->
        <section class="listNoMore" v-if="noData"></section>
    </section>
</template>

<script>
import axios from "axios";
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
// import { clearTimeout } from 'timers';
const baseApi = {
    getTags: '/mcall/med/brand/getTags/',
    getList: '/mcall/med/brand/getResourceList/'
}
export default {
    data() {
        return {
            headerConfig: {
                title: "学术内容",
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
            academicList: [],
            noData: false,
            firstResult: 0,
            maxResult: 10,
            styleXScroll: null,
            triggerXScroll: false,
            propertyId: ''
        }
    },
    mounted() {
        document.title = '学术内容 | 唯品汇'
        this.getTags()
    },
    beforeUpdate() {
        if (!this.triggerXScroll) {
            this.styleXScroll = setTimeout(() => {
                if (this.tabsMenu.length !== 0) {
                    document.getElementsByClassName('area-navbar-box')[0].scrollLeft = document.getElementsByClassName('actives')[0].offsetLeft - document.getElementsByClassName('actives')[0].clientWidth;
                    this.triggerXScroll = true
                    clearTimeout(this.styleXScroll)
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
                        this.getAcademicList(this.$route.query.propertyId || this.propertyId)
                    }
                }
            }, false);
        },
        getTags() {
            axios.get(baseApi.getTags, {
                params: {
                    paramJson: {
                        moduleType: 4,
                        brandId: this.$route.query.brandId, // this.$route.query.brandId
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
                                this.activeItem = index
                            }
                        })
                        this.getAcademicList(this.$route.query.propertyId)
                    // 点击全部
                    } else {
                        this.getAcademicList(this.tabsMenu[0].propertyId)
                    }
                } else {
                    this.getAcademicList()
                }
                this.scroll()
            }).catch((err) => {
                // console.log(err)
            });
        },
        getAcademicList(propertyId) {
            axios.get(baseApi.getList, {
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
                if (res && res.data && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length !== 0) {
                    this.academicList = this.academicList.concat(res.data.responseObject.responseData.dataList)
                } else if (res.data.responseObject.responseData.dataList.length == 0) {
                    this.noData = true
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        activeChange(opt, index) {
            comm.creatEvent({
                triggerType:'相关内容页',
                triggerName:'tab切换',
                refId: opt.propertyId,
                actionId:11866,
                browType:374,
            });

            if (Number(opt.propertyId) !== Number(this.$route.query.propertyId)) {
                this.activeItem = index;
                this.$router.push({ path: 'academic', query: { brandId: this.$route.query.brandId, propertyId: opt.propertyId } })
                this.academicList = []
                // 重置分页
                this.firstResult = 0;
                this.maxResult = 10;
                this.noData = false
                this.getAcademicList(opt.propertyId)
            }
        },
        toAcademicDetail(item) {
            comm.creatEvent({
                triggerType: '相关内容页',
                triggerName: '查看相关内容',
                refId: item.resourceId,
                actionId:11501,
                browType:374,
            });
            setTimeout(fn => {
                window.location.href = item.pageStoragePath
            }, 300)
        }
    },
    components: {
        HeaderBar
    }
}
</script>

<style>

</style>
