<template>
    <section class="allAreasContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <nav class="area-navbar">
            <ul data-alcode-mod='380' class="area-navbar-box">
                <li class="area-navbar-item" :class="{actives: index == activeItem}" @click.stop="activeChange(opt, index)" v-for="(opt, index) in tabsMenu" :key="index">
                    <div class="tab-name-item">{{ opt.groupName }}</div>
                </li>
            </ul>
        </nav>
        <section class="brand-card-box">
            <ul>
                <li v-for="(opt, index) in allBrandCardsList" :key="index" @click="toSpacialTopic(opt)">
                    <img class="brand-card-banner" :src="opt.imgUrl">
                    <p class="brand-card-title">{{ opt.anthologyName }}</p>
                </li>
            </ul>
        </section>
        <section class="listNoMore" v-if="noData"></section>
        <!-- <section class="listNoMore" v-if="noData">~  没有更多了  ~</section> -->
    </section>
</template>

<script>
import axios from 'axios';
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
const baseApi = {
    getGroupList: '/mcall/column/config/resource/groupList/', // 专题tags
    getList: '/mcall/column/config/resource/themeList/' // 专题列表
}
export default {
    data() {
        return {
            headerConfig: {
                title: "全部专题",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                },
                backFn: () => {
                    this.$router.push({ path: '/convergence' })
                }
            },
            activeItem: 0,
            tabsMenu: [],
            allBrandCardsList: [],
            noData: false,
            firstResult: 0,
            maxResult: 10,
            groupValueAll: ''
        }
    },
    mounted() {
        document.title = '全部专题'
        this.getGroupList()
    },
    methods: {
        scroll() {
            let that = this,
            scrollTop = 0;
            window.addEventListener('scroll', () => {
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if(scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 1) {
                    if (!this.noData) {
                        console.log('底部');
                        that.firstResult += 10;
                        that.getList(this.$route.query.groupValue || this.groupValueAll)
                    }
                }
            }, false);
        },
        getGroupList() {
            axios({
                url: baseApi.getGroupList,
                method: "get",
                params: {
                    paramJson: {
                        columnType: 1,
                        groupType: 2
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData.dataList) {
                    this.tabsMenu = res.data.responseObject.responseData.dataList
                    this.groupValueAll = res.data.responseObject.responseData.dataList[0].groupValue
                    this.scroll()
                    if (this.$route.query && this.$route.query.groupValue) {
                        this.tabsMenu.forEach((opt, index) => {
                            if (opt.groupValue == this.$route.query.groupValue) {
                                this.activeItem = index
                            }
                        })
                        this.getList(this.$route.query.groupValue)
                    // 上一页点击全部
                    } else {
                        this.getList(res.data.responseObject.responseData.dataList[0].groupValue)
                    }
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        getList(groupValue) {
            axios({
                url: baseApi.getList,
                method: "get",
                params: {
                    paramJson: {
                        columnType: 1,
                        groupValue: groupValue,
                        firstResult: this.firstResult,
                        maxResult: this.maxResult
                    }
                }
            }).then((res) => {
                // console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length !== 0) {
                    this.allBrandCardsList = this.allBrandCardsList.concat(res.data.responseObject.responseData.dataList)
                } else if (res.data.responseObject.responseData.dataList.length == 0) {
                    this.noData = true
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        toSpacialTopic(opt) {
            comm.creatEvent({
                triggerType:'全部专题',
                triggerName:'专题点击',
                keyword: this.tabsMenu[this.activeItem].groupName,
                actionId:11855,
                browType:434,
            });
            setTimeout(fn => {
                window.location.href = opt.h5LinkUrl
            }, 300)
        },
        activeChange(opt, index) {
            comm.creatEvent({
                triggerType:'全部专题',
                triggerName:'tab点击',
                actionId:11854,
                browType:434,
            });

            if (Number(opt.groupValue) !== Number(this.$route.query.groupValue)) {
                this.activeItem = index;
                this.$router.push({ path: 'allAreas', query: { brandId: this.$route.query.brandId, groupValue: opt.groupValue } })
                this.allBrandCardsList = []
                // 重置分页
                this.firstResult = 0;
                this.maxResult = 10;
                this.noData = false
                this.getList(opt.groupValue)
            }
        },
        backHome() {
            this.$router.push('/convergence');
        }
    },
    components: {
        HeaderBar
    }
}
</script>

<style>

</style>
