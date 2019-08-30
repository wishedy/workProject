<!--新闻公告-->
<template>
    <section>
        <HeaderBar :header-config="headerConfig" style="position:fixed;top: 0;left: 0;z-index: 2"></HeaderBar>
        <ul class="newsList">
            <li class="newsItem" v-for="item in dataList">
                <a :href="item.h5Url?item.h5Url:'javascript:;'" @click="jumpUrlCreat(item.id)">
                    <p>{{item.newsBody}}</p>
                    <span v-text="commdateFn(item.updateTime)"></span>
                </a>
            </li>
        </ul>
        <section class="dataIsOver" v-if="noMore">~  没有更多了  ~</section>
    </section>
</template>
<script type="text/ecmascript-6">
    const $ = require('jquery');
    import comm from 'static/js/comm.js';
    import commdate from 'static/js/comm.date.js';
    import {mapActions,mapGetters} from "vuex";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    export default {
        components:{
            HeaderBar
        },
        data(){
            return {
                headerConfig: {
                    title: "新闻公告",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    }
                },
                path: {
                    news:'/mcall/organization/getNewsPager/',//新闻公告列表
                },
                dataList:[],
                loading:false,
                ajaxing:false,
                noMore:false,
                orgId:comm.getpara().orgId,//从导航上获取orgId
                pageIndex:1,
                pageSize:10
            }
        },
        computed:{
            ...mapGetters(['isLoading']),
        },
        methods:{
            ...mapActions(["changeLoading","commCreateEvent"]),
            getNews(){
                let t = this;
                t.ajaxing = true;
                t.changeLoading(true);
                comm.ajax2({
                    url: t.path.news,
                    data: {paramJson: JSON.stringify({organizationId: t.orgId,
                            pageIndex:t.pageIndex,
                            pageSize:t.pageSize,
                        })},
                    dataType: 'json',
                    type: 'get',
                    success: function (res) {
                        t.pageIndex++;
                        t.changeLoading(false);
                        t.ajaxing = false;
                        if(comm.hasResponseData(res)){
                            if(res.responseObject.responseData.dataList.length>0){
                                if(res.responseObject.responseData.totalCount<=t.pageSize){
                                    t.noMore = true;
                                }
                                t.dataList = t.dataList.concat(res.responseObject.responseData.dataList);
                            }else{
                                t.noMore = true;
                            }
                        }else{//如果没有数据
                            t.noMore = true;
                        }
                    },
                    error:function () {
                        t.changeLoading(false);
                        t.noMore = true;
                    }
                })
            },
            commdateFn(date){
                if(date){
                    return commdate.diffDay_three(date,commdate.local_time())
                }else{
                    return ''
                }
            },
            jumpUrlCreat(id){
                //事件埋点
                comm.creatEvent({
                    browType:366,
                    triggerType: '组织-新闻列表',
                    triggerName: "点击新闻内容",
                    actionId: 11484,
                    refId: id,
                    refType: "组织"
                });
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore && location.hash.indexOf('#/orgNewsBulletin')>-1){
                            t.getNews();
                        }
                    }
                }
            },
        },
        mounted(){
            let t = this;
            t.getNews();
            t.scroll();
        }
    }
</script>
<style rel="stylesheet" lang="scss">
    @import "scss/pages/organization/news.scss";
</style>
