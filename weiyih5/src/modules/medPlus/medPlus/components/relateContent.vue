<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <productManual :relatedContent="relatedContent"  :more="moreOnOff" @scrollBottom="getRelatedContent" v-if="relatedContent.length!==0" :loading="loading" :completed="completed"></productManual>
    </section>
</template>
<script>
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import productManual from './productManual';
    import comm from 'static/js/comm.js';
    import axios from "axios";
    export default {
        data(){
            return {
                loading:false,
                completed:false,
                pageIndex:0,
                pageSize:20,
                moreOnOff:false,
                relatedContent:[],
                headerConfig: {
                    title: "相关内容",
                    backOnOff: true,
                    share: {
                        onOff: false,
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        components:{
            HeaderBar,
            productManual
        },
        methods:{
            getRelatedContent(){
                let t = this;
                if(!t.loading){
                    t.loading = true;
                    axios.get('/mcall/med/recommend/resource/item/getRelationContent/', {
                        params: {
                            paramJson: {
                                "resourceType": "5",
                                "resourceId": t.brandId,
                                "firstResult":t.pageIndex*t.pageSize,
                                "maxResult":t.pageSize
                            }
                        }
                    })
                        .then(function (res) {
                            if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                                t.relatedContent = t.relatedContent.concat(res.data.responseObject.responseData.dataList);
                                console.log(t.relatedContent);
                                t.completed=(t.relatedContent.length<t.pageSize);
                                if(!t.completed){
                                    t.pageIndex++;
                                }
                            }else{
                                t.completed = true;
                            }
                            t.loading = false;
                        })
                        .catch(function (error) {
                            //console.log(error);
                        });
                }

            }
        },
        computed:{
            brandId(){
                let t = this;
                return comm.getpara().brandId;
            }
        },
        mounted(){
            let t = this;
            document.title = '相关内容';
            t.getRelatedContent();
        }
    }
</script>