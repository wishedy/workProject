<template>
    <section class="al-content al-doctorRecommend" data-docNum="docNum" v-if="isDoctor">
        <h2 class="al-contentMainTitle">推荐医师</h2>
        <section class="al-doctorRecommendItem" v-for="(v,i) in doctorArr" :key="i" @click="creatEvent" :cid="v.customerId" :cName="getStrLen(v.customerName,20)">
             <figure class="al-doctorRecommendImg">
                 <a :href="contribution(v.customerId)"><img :src="v.logoUrl" alt=""></a>
             </figure>
            <article class="al-doctorRecommendMsg">
                <h2 class="al-doctorRecommendName">
                    <a :href="contribution(v.customerId)">{{getStrLen(v.customerName,20)}}</a>
                </h2>
                <span class="al_doc_title">{{getStrLen(v.medicalTitle,12)}}</span>
                <span class="al_doc_company">{{getStrLen(v.company,20)}}</span>
                <p href="javascript:void(0)" class="ev_foll" :cid="v.customerId" :fStatus="v.relationship"> </p>
                <Follow :follow-config="followConfig(v)"></Follow>
            </article>
        </section>
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import Follow from "components/Follow/Follow.vue";
    const RecDoctor = '/mcall/recommend/customer/first/json_list3/';
    export default {
        props:['docNum'],
        components:{
            Follow:Follow
        },
        data (){
            return {
                doctorArr:'',
                isDoctor:true
            }
        },
        methods :{
            RecDoctorAjax(){
                let t=this;
                t.$store.state.loading=true;
                comm.ajax2({
                    url: RecDoctor,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
                            pageIndex: t.docNum,
                            pageSize: 3,
                            scene: 10,
                            flag:1,
                            score:t.$store.state.docRecScore,
                            sessionCustomerId:TempCache.getItem("userId") || "",
                            platformId:TempCache.getItem('department')||1
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.$store.state.loading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.doctorArr=res.responseObject.responseData.data_list;
                        }else {
                            t.isDoctor=false;
                        }
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.score_list&&res.responseObject.responseData.score_list.length>0){
                            let scoreList=res.responseObject.responseData.score_list;
                            for (let i in scoreList[0]){
                                if(i==1){
                                    t.$store.state.docRecScore=scoreList[0][i];
                                }
                            }

                        }
                    }
                })
            },
            contribution(customerId){
                if(customerId){
                    return "/dist/personal/others_index.html?cid="+customerId;
                }
            },
            getStrLen(name,len){
                return comm.getStrLen(name,len)
            },
            followConfig(v){
                return {
                    refId:v.customerId,
                    followState:v.relationship,
                    unFollow:false,
                    className:"ev_foll",
                }
            },
            creatEvent(e){
                let cid=e.currentTarget.getAttribute('cid'),cName=e.currentTarget.getAttribute('cName');
                comm.creatEvent({
                    triggerType:'广告',
                    keyword:cName,
                    actionId:62,
                    pushMessageId:cid,
                    refId:cid
                });
            }


        },
        mounted (){
            this.RecDoctorAjax();
        }

    }
</script>

<style scoped>

</style>