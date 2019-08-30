<template>
    <section class="allAreasContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <section class="brand-card-box activeLine">
            <!-- :style="{marginRight: (index%2 !== 0 ? '0' : '0.45rem')}" -->
            <ul>
                <li v-for="(opt, index) in allBrandCardsList" :key="index" @click.stop="toActiviesPage(opt, index)">
                    <div class="active-banner-box">
                        <img class="brand-card-banner" v-if="opt.picUrl" :src="opt.picUrl">
                        <span class="brand-card-banner-default" v-else></span>
                    </div>
                    <p class="brand-card-title">{{ opt.name }}</p>
                    <span :class="opt.state == 4 ? 'brand-card-end-status' : 'brand-card-status'" v-if="opt.state !== 0">{{ opt.state | activeState }}</span>
                </li>
            </ul>
        </section>
        <section class="listNoMore" v-if="noData"></section>
    </section>
</template>

<script>
import axios from 'axios';
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
const baseApi = {
    getActiveList: '/mcall/column/config/resource/activityList/', // 活动列表
}
export default {
    data() {
        return {
            activeItem: 0,
            headerConfig: {
                title: "全部活动",
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
            allBrandCardsList: [],
            noData: false,
            firstResult: 0,
            maxResult: 10
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
        document.title = '全部活动'
        this.getActiveList()
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
                        that.getActiveList()
                    }
                }
            }, false);
        },
        getActiveList() {
            axios({
                url: baseApi.getActiveList,
                method: "get",
                params: {
                   paramJson: {
                        columnType: 1,
                        firstResult: this.firstResult,
                        maxResult: this.maxResult
                    }
                }
            }).then((res) => {
                console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length !== 0) {
                    this.allBrandCardsList = this.allBrandCardsList.concat(res.data.responseObject.responseData.dataList)
                    this.scroll()
                } else if (res.data.responseObject.responseData.dataList.length == 0) {
                    this.noData = true
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        toActiviesPage(opt, index) {
            comm.creatEvent({
                triggerType:'全部活动',
                triggerName:'活动点击',
                locationId: index,
                actionId:11856,
                browType:435,
            });
            setTimeout(fn => {
                window.location.href = opt.h5LinkUrl;
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
