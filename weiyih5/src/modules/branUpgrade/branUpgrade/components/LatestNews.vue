<template>
    <section class="latestNewsContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <nav class="area-navbar">
            <ul data-alcode-mod='380' class="area-navbar-box">
                <li class="area-navbar-item"
                    :class="{actives: index == activeItem}"
                    @click.stop="activeChange(opt, index)"
                    v-for="(opt, index) in tabsMenu"
                    :key="index">
                    <div class="tab-name-item">{{ opt.groupName }}</div>
                </li>
            </ul>
        </nav>
        <section class="brand-card-box">
            <ul>
                <li v-for="(opt, index) in allBrandCardsList" :key="index" @click="toNewPage(opt)">
                    <p class="brand-card-banner">
                        <img :src="opt.imgUrl">
                        <span :class="opt.state == 4 ? 'activeEndState' : 'active-state' " v-if="opt.state !== 0 && opt.state !== ''">{{ opt.state | activeState }}</span>
                    </p>
                    <p class="brand-card-title">{{ opt.anthologyName }}</p>
                </li>
            </ul>
        </section>
        <!-- <section class="listNoMore" v-if="noData">~  没有更多了  ~</section> -->
        <section class="listNoMore" v-if="noData"></section>
    </section>
</template>

<script>
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
import axios from "axios";
const baseApi = {
    getList: '/mcall/column/config/resource/recommendList/', // 最新动态列表
    getTags: '/mcall/column/config/resource/groupList/' // 获取标签列表
}
export default {
    data() {
        return {
            headerConfig: {
                title: "最新动态",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                },
                backFn: () => {
                    this.$router.push({ path: '/brands', query: { brandId: this.$route.query.brandId } })
                    // window.history.go()
                }
            },
            activeItem: 0,
            tabsMenu: [],
            allBrandCardsList: [],
            noData: false,
            firstResult: 0,
            maxResult: 10,
            groupValue: ''
        }
    },
    // watch: {
    //     $route(to) {
    //         console.log(to.query)
    //         console.log(this.$router)
    //         console.log('&&&&&&&')
    //         window.history.replaceState({page: 3},'我是新的title','latestNews')
    //     }
    // },
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
        document.title = '最新动态 | 唯品汇'
        this.getTags()
    },
    // updated() {
    //     this.scroll()
    // },
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
                        that.getList(this.$route.query.groupValue || this.groupValue)
                    }
                }
            }, false);
        },
        getTags() {
            axios.get(baseApi.getTags, {
                params: {
                    paramJson: {
                        columnType: 1,
                        brandId: this.$route.query.brandId, // this.$route.query.brandId
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
                    this.tabsMenu = res.data.responseObject.responseData.dataList
                    this.groupValue = res.data.responseObject.responseData.dataList[0].groupValue
                    this.scroll()
                    // 已选择某个标签刷新继续找到这个标签
                    console.log(this.$route.query)
                    if (this.$route.query && this.$route.query.groupValue) {
                        this.tabsMenu.forEach((opt, index) => {
                            if (opt.groupValue == this.$route.query.groupValue) {
                                this.activeItem = index
                            }
                        })
                        this.getList(this.$route.query.groupValue)
                    // 上一页点击全部
                    } else {
                        this.getList(this.tabsMenu[0].groupValue)
                    }
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        getList(groupValue) {
            axios.get(baseApi.getList, {
                params: {
                    paramJson: {
                        columnId: 1563551999999, // 写死 1563551999999
                        brandId: this.$route.query.brandId,
                        groupValue: groupValue,
                        firstResult: this.firstResult,
                        maxResult: this.maxResult
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length !== 0) {
                    this.allBrandCardsList = this.allBrandCardsList.concat(res.data.responseObject.responseData.dataList)
                } else if (res.data.responseObject.responseData.dataList.length == 0) {
                    this.noData = true
                }
            }).catch((err) => {
                // console.log(err)
            });
        },
        activeChange(opt, index) {
            comm.creatEvent({
                triggerType: '品牌动态',
                triggerName:'tab点击',
                keyWord: opt.groupName,
                actionId:11864,
                browType:435,
            });

            if (Number(opt.groupValue) !== Number(this.$route.query.groupValue)) {
                this.activeItem = index;
                this.$router.push({ path: 'latestNews', query: { brandId: this.$route.query.brandId, groupValue: opt.groupValue } })
                this.allBrandCardsList = []
                // 重置分页
                this.firstResult = 0;
                this.maxResult = 10;
                this.noData = false
                this.getList(opt.groupValue)
            }

        },
        toNewPage(opt) {
            window.location.href = opt.h5LinkUrl
        }
    },
    components: {
        HeaderBar
    }
}
</script>

<style>

</style>
