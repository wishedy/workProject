<template>
    <section class="al-indexRecommend" data-alcode-mod="384" v-if="isEntry">
        <figure class="al-indexRecommendItem" v-for="(v,i) in entryArr" :key="i" v-if="i<8">
            <a :href="v.navigationPath">
                <img :src="v.navigationLogo" alt="" />
                <figcaption class="al-indexRecommendItemTitle">
                    <span>{{v.navigationName}}</span>
                </figcaption>
            </a>
        </figure>
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    const DynamicEntryUrl = '/mcall/navigation/scheduling/json_list/';
    export default {
        data(){
            return{
                entryArr: [],
                isEntry:false
            }
        },
        methods:{
                entry(){
                    let t = this;
                    if(TempCache.getItem('entryData')){
                        t.isEntry=true;
                        t.entryArr = JSON.parse(TempCache.getItem('entryData'));
                    }
                    t.$store.state.loading=true;
                    comm.ajax2({
                        url: DynamicEntryUrl,
                        type: "post",
                        data: {
                            paramJson:JSON.stringify({
                                navigationType: 2,
                                visitSiteId: 2,
                                sessionCustomerId:TempCache.getItem('userId')||"",
                                customerId:TempCache.getItem('userId')||"",
                                platformId:TempCache.getItem('department')||1
                            })
                        },
                        timeout: 30000,
                        success:function(res){
                            t.$store.state.loading=false;
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                                t.entryArr=res.responseObject.responseData.data_list;
                                TempCache.setItem('entryData',JSON.stringify(t.entryArr));
                                t.isEntry=true;
                            }else {
                                t.isEntry=false;
                            }
                        }
                    });
                }
            },
        mounted(){
            this.entry();
        }
    }
</script>