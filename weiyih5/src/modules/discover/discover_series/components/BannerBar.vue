<template>
    <section class="courseBanner">
        <section class="banner">
            <a :href="linkUrl" @mousedown="bannerEventCreate"><img :src="bannerImg"></a>
            <p v-if="isGetLatestRecord"><i @click="closeRecord"></i>浏览历史<span @click.stop="creatEventRecord"><a :href="newData.webStoragePath">{{newData.resourceName}}</a></span></p>
        </section>  <!--<p><i></i>发现浏览历史<span>发现浏览历史</span></p>-->
            <nav>
            <ul class="tabtitle"  data-alcode-mod='639' data-alcode-item-selector="li">
                <router-link tag="li" to="/type0" active-class="active" replace>
                    <span>推荐</span>
                </router-link>
                <router-link tag="li" to="/type9" active-class="active" replace>
                    <span>创伤</span>
                </router-link>
                <router-link tag="li" to="/type7" active-class="active" replace>
                    <span>脊柱</span>
                </router-link>
                <router-link tag="li" to="/type2" active-class="active" replace>
                    <span>关节</span>
                </router-link>
            </ul>
        </nav>
    </section>
</template>
<script>
    import axios from "axios";
    import comm from "static/js/comm.js";
    const xhrUrl = {
        "banner":"/mcall/cms/course/getBannerList/",
        getLatestRecord:'/mcall/cms/course/getLatestRecord/'//浏览历史
    };
    export default {
        data() {
            return {
                bannerImg:"",
                linkUrl:'',
                isGetLatestRecord:false,
                newData:''
            }
        },
        mounted(){
            let t = this;
            t.bannerShow();
            if(localStorage.getItem('userId')){
                t.getLatestRecord();
            }
        },
        methods: {
            bannerEventCreate(){
              let t = this;
                comm.creatEvent({
                    triggerType:'广告位',
                    triggerName:'广告位-轮播图',
                    keyword:"广告位-轮播图-系列课",
                    actionId:14
                });
            },
            bannerShow(){
                let t = this;
                axios({
                    url: xhrUrl.banner,
                    method: "POST",
                    data: {"isValid":1,"channelId":149},
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    let dataItem  = res.data.responseObject.responseData.data_list[0];
                    t.bannerImg = dataItem.ad_profile_attachment[0].adAttUrl;
                    t.linkUrl = (dataItem.ad_profile_attachment[0].linkUrl&&dataItem.ad_profile_attachment[0].linkUrl.length)?dataItem.ad_profile_attachment[0].linkUrl:"javascript:;";
                });
            },
            getLatestRecord(){
                let t = this;
                axios({
                    url: xhrUrl.getLatestRecord,
                    method: "GET",
                    data: {"isValid": 1, "sortType": 2},
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    let data=res.data;
                    if (comm.hasResponseData(data)){
                        var newData = data.responseObject.responseData.data_list;
                        var s = comm.getStrLen(newData.resourceName,22);
                        newData.resourceName = s;
                        if(s){
                            t.isGetLatestRecord=true;
                            t.newData={
                                webStoragePath:newData.webStoragePath,
                                resourceName:newData.resourceName
                            };
                            setInterval(function () {
                                $('.banner p').animate({"margin-left": "-100%"}, 500);
                            }, 5000);
                        }


                    }
                });
            },
            closeRecord(){
                $('.banner p').animate({"margin-left": "-100%"}, 500);
            },
            creatEventRecord(){
                comm.creatEvent({
                    triggerType:'功能按钮',
                    triggerName:'发现浏览历史',
                    keyword:"系列课-发现浏览历史",
                    actionId:11006
                });
            }
        }
    }
</script>