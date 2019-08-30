<template>
    <section class="al-content" data-alcode-mod="430">        
        <HotList v-for = "(item,key) in hotData" v-bind:item ="item" :key="key"></HotList>
        <section class="listNoMore" v-if="noData">~  没有更多了  ~</section>
        <Loading v-show="ajaxing"></Loading>
    </section>        
</template>
<script type="text/ecmascript-6">
import comm from "static/js/comm.js";
import Loading from "components/Loading/Loading.vue";
import HotList from "components/ListTemplate/OneImgList.vue";
import axios from "axios";
const url = "/mcall/resource/browse/json_list/";
export default {
    data() {
        return {
        noData:false,  
        hotData: [],
        pageIndex: 1,
        groupByFlag:comm.getpara().groupByFlag||1,
        platformId:localStorage.getItem('department')||1,
        dataType: comm.getpara().dataType||0,
        ajaxData:null,
        ajaxing:false
        };
    },
    components:{
        Loading,
        HotList
    },
    mounted() {
        this.getData();
        
    },    
    methods: {
		getData() {
            let t = this;
            t.ajaxData={
                groupByFlag: t.groupByFlag,
                dataType: t.dataType,
                visitSiteId: 2,
                scene: 1,
                pageIndex: t.pageIndex,
                pageSize: 20,
                platformId: t.platformId
            };            
            t.ajaxAction();
            let scrollTop = 0;
            window.addEventListener('scroll',function(){
                // console.log(t.pageIndex);
                scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                    if(!t.ajaxing && !t.noData)t.ajaxAction();
                }
            },false);
        },
        ajaxAction(){
            let t = this;
            t.ajaxing = true;    
            comm.ajax2({
                url:url,
                type:"post",
                dataType:"json",
                data:{paramJson:JSON.stringify(t.ajaxData)},
                success:function(res){
                    t.ajaxing = false;
                    if (comm.hasResponseData(res) && res.responseObject.responseData.data_list) {
                        var dataList = res.responseObject.responseData.data_list;
                        for(let i=0;i<dataList.length;i++){
                            if(dataList[i].itemType==1){//视频多作者
                                dataList[i].ownerName = dataList[i].ownerNameStr;
                            }
                        }
                        t.hotData = t.hotData.concat(dataList);
                        t.pageIndex++;
                        t.ajaxData.pageIndex = t.pageIndex;
                        if(dataList&&dataList.length<20){
                            t.noData = true;
                        }
                    }else{
                    	// t.hotData = [{}];
                    }
                },
                fail:function(){

                }
            });
        },
    
        
            
    }
    
};
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
