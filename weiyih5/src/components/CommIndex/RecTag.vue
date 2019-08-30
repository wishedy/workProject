<template>
    <section class="al-content al-tagsRecommend" data-index="tagNum" v-if="isTag">
        <h2 class="al-contentMainTitle al-contentHeaderIcon">标签推荐</h2>
        <ul>
            <li class="al-tagsRecommendItem" v-for="(v,i) in recTagArr" :key="i" v-if="(index==0&&i<6)||(index==1&&i>=6)">
                <a :href="reTagHerf(v.propertyId)" :tagId="v.propertyId" @click="creatEvent">{{getStrLen(v.propertyName, 18)}}</a>
            </li>
        </ul>
        <a class="al-allTags" href="/dist/discover/discover_tag.html">查看全部<i class="icon-circleArrowRight"></i></a>
    </section>

</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    const  RecTag = '/mcall/recommend/customer/tag/json_list/';
    export default {
        props:['tagNum','index'],
        data (){
            return {
                recTagArr:'',
                isTag:true
            }
        },
        methods :{
            RecTagAjax(){
                let t=this;
                t.$store.state.loading=true;
                comm.ajax2({
                    url: RecTag,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
                            pageIndex: t.tagNum+1,
                            pageSize: 12,
                            scene: 10,
                            flag:1,
                            score:t.$store.state.tagRecScore,
                            sessionCustomerId:TempCache.getItem("userId") || "",
                            platformId:TempCache.getItem('department')||1
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.$store.state.loading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.recTagArr = res.responseObject.responseData.data_list;
                            t.$store.state.recTagArr= res.responseObject.responseData.data_list;
                        }else {
                            t.isTag=false;
                        }
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.score_list&&res.responseObject.responseData.score_list.length>0){
                            let scoreList=res.responseObject.responseData.score_list;
                            for (let i in scoreList[0]){
                                if(i==1){
                                    t.$store.state.tagRecScore=scoreList[0][i];
                                }
                            }
                        }
                    }
                })
            },
            reTagHerf(propertyId){
                return "/dist/discover/discover_tagSubject.html?tId=" + propertyId ;
            },
            getStrLen(name,len){
                return comm.getStrLen(name,len)
            },
            creatEvent(e){
                let tagId=e.target.getAttribute('tagId')
                comm.creatEvent({
                    triggerType:'标签',
                    trigger_name:"标签",
                    keyword:tagId,
                    actionId:79,
                    async:false
                });
                comm.creatEvent({
                    triggerType:'广告',
                    keyword:e.target.innerText,
                    actionId:62,
                    pushMessageId:tagId,
                    refId:tagId
                });
            },

        },
        mounted (){
            if(this.index==0){
                this.$store.state.recTagArr='';
                this. RecTagAjax();
            }else {
                this.recTagArr=this.$store.state.recTagArr;
                if(this.$store.state.recTagArr.length<6){
                    this.isTag=false;
                }
            }
        }

    }
</script>

<style scoped>

</style>