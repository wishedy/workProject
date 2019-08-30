<template>
    <section>
        <section class="al-indexRecommend" data-alcode-mod="384" v-if="isEntry">
            <figure class="al-indexRecommendItem" v-for="(v,i) in entryArr" :key="i" v-if="showLen(i,navigationType)" :class="swichClass(navigationType,entryArr.slice(0,4))"  @click="jumpEntry(v.navigationName,v.navigationSort)">
                <a :href="v.navigationPath">
                    <img :src="v.navigationLogo" alt="" />
                    <figcaption class="al-indexRecommendItemTitle">
                        <span>{{v.navigationName}}</span>
                    </figcaption>
                </a>
            </figure>
        </section>
        <swiper-entry :downList="downList"></swiper-entry>
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import SwiperEntry from './SwiperEntry.vue';
    const DynamicEntryUrl = '/mcall/navigation/scheduling/json_list/';
    export default {
        components: {SwiperEntry},
        props:['navigationType'],
        data(){
            return{
                entryArr: [],
                isEntry:false,
                downList:''
            }
        },
        methods:{
            entry(){
                    let t = this;
                    if(TempCache.getItem('entryData')&&TempCache.getItem('entryData')!='undefined'){
                        t.isEntry=true;
                        t.entryArr = JSON.parse(TempCache.getItem('entryData'));
                    }
                    t.$store.state.loading=true;
                    comm.ajax2({
                        url: DynamicEntryUrl,
                        type: "post",
                        data: {
                            paramJson:JSON.stringify({
                                navigationType: t.navigationType,
                                visitSiteId: 2,
                                sessionCustomerId:TempCache.getItem('userId')||"",
                                customerId:TempCache.getItem('userId')||"",
                                platformId:TempCache.getItem('department')||1
                            })
                        },
                        timeout: 30000,
                        success:function(res){
                            t.$store.state.loading=false;
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData){
                                if(t.navigationType==2){
                                    t.entryArr=res.responseObject.responseData.data_list;
                                }else if(t.navigationType==8 ||t.navigationType==5 ||t.navigationType==6){
                                    t.entryArr=res.responseObject.responseData.up_data_list;
                                    t.downList=res.responseObject.responseData.down_data_list;
                                }
                                if(t.entryArr){//有数据再存
									TempCache.setItem('entryData',JSON.stringify(t.entryArr));
                                }
                                t.isEntry=true;
                            }else {
                                t.isEntry=false;
                            }
                        }
                    });
                },
            showLen(i,type){
                if((parseInt(type,10)==2&&i<8) || ((parseInt(type,10)==8 || parseInt(type,10)==5 || parseInt(type,10)==6)&&i<4)){
                    return true
                }
            },
            swichClass(type,num){
                if(parseInt(type,10)==8||parseInt(type,10)==5 ||parseInt(type,10)==6){
                    let _cName='';
                    switch(num.length){
                        case 1:
                            _cName='oneItem';break;
                        case 2:
                            _cName='twoItem';break;
                        case 3:
                            _cName='threeItem';break;
                        case 4:
                            _cName='fourItem';break;
                    }
                   return _cName;
                }

            },
            jumpEntry(name,sortId){
                comm.creatEvent({
                    triggerType:'功能',
                    triggerName:'动态入口',
                    keyword:name,
                    location_id:sortId,
                    actionId:63
                });
            }
        },
        mounted(){
            this.entry();
        }
    }
</script>