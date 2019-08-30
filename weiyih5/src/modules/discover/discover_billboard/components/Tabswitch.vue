<template>
        <section class="billboard">
            <ul class="headerNav" data-alcode-mod='625' data-alcode-item-selector="li">
                <!--<router-link tag="li" to="/listType/1" active-class="active">贡献榜</router-link>-->
                <router-link tag="li" to="/activity" active-class="active" replace>活跃榜</router-link>
                <router-link tag="li" to="/recommend" active-class="active" replace>推荐榜</router-link>
            </ul>
            <figure class="ads al-rankBanner" v-if="bannerLength!=0">
                <a :href="bannerInfo.linkUrl">
                    <img :src="bannerInfo.adAttUrl"/>
                </a>
                <figcaption><i></i>{{time}}</figcaption>
            </figure>
            <Loading v-show="ajaxing"></Loading>
        </section>
</template>

<script>
    import axios from 'axios';
    import Loading from "components/Loading/Loading.vue";
    import TempCache from "static/js/tempcache";
    import comm from "static/js/comm";
    const xhrUrl = {
        "banner":"/mcall/customer/toplist/getToplistBanner/"
    };
    export default {
        data(){
            return {
                bannerInfo:[],
                bannerLength:0,
                ajaxing:false,
                time:''
            }
        },
        components:{
            Loading
        },
        methods:{
            tabList(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url: xhrUrl.banner,
                    method: "POST",
                    data:{
                        "customerId":TempCache.getItem('userId') || "",
                        "isValid":1,
                        "toplistType":t.$route.params.name,
                        "platformId":TempCache.getItem('department') || 1,
                        "adPositionId":t.param()
                    },
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let date = new Date();
                        let updateTime = 7-date.getDay()+1;
                        switch(parseInt(t.$route.params.name)){
                            case 1:
                                t.time = '贡献榜将于'+updateTime+'天后更新'; break;
                            case 2:
                                t.time = '活跃榜将于'+updateTime+'天后更新'; break;
                            case 3:
                                t.time = '推荐榜整点更新排名'; break;
                        }
                        t.bannerInfo = res.data.responseObject.responseData.data_list[0][0];
                    }
                })
            },
            param(){
                let listType = this.$route.name;
                let department = TempCache.getItem('department') || 1;
                let parameter = 0;
                if(listType==1 && department==1){
                    parameter=444;
                }else if(listType==1 && department==2){
                    parameter=459;
                }else if(listType==2 && department==1){
                    parameter=445;
                }else if(listType==2 && department==2){
                    parameter=460;
                }else if(listType==3 && department==1){
                    parameter=446;
                }else if(listType ==3 && department==2){
                    parameter=461;
                }
                return parameter;
            }
        },
        mounted(){
            this.tabList();
        },
        watch: {
            $route() {
                let t = this;
                t.bannerInfo = [];
                t.tabList();
            }
        }
    }
</script>

<style>

</style>