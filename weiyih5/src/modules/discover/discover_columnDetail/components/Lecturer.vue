<template>
    <section class="boneClass">
        <a :href="'/dist/personal/others_index.html?cid='+item.customerId" v-show="noData">
            <aside class="recommendDoctor" data-alcode-mod="729">
                <div class="personal">
                    <div><img :src="item.logoUrl"></div>
                    <div><p>{{item.fullName,10 | cut }}<span>推荐医师</span></p><p>{{item.medicalTitle,14 | cut }}<span>{{item.company,18 | cut }}</span></p></div>
                </div>
                <div class="personalList">
                    <p class="info">{{item.summary}}</p>
                </div>
            </aside>
        </a>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import TempCache from "static/js/tempcache";

    const PATH = "/mcall/special/getRecommendAuthor/";
    const customerId = TempCache.getItem('userId')||"";
    const specialId = comm.getpara().columnId||"";
    export default {
        data(){
            return {
                ajaxing:false,
                item:{},
                noData:false
            }
        },
        methods:{
            lecturer(){
                this.ajaxing = true;
                axios({
                    url:PATH,
                    method:"POST",
                    data:{
                        customerId,
                        specialId
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    this.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData;
                        if(dataList.data_list.length){
                            this.noData = true;
                            this.item = res.data.responseObject.responseData.data_list[0];
                        }
                    }
                })
            }
        },
        mounted(){
            this.lecturer();
        },
        filters:{
            cut:(v1,v2)=>comm.getStrLen(v1,v2)
        },
        components:{
            Loading
        }
    }
</script>

<style  lang="scss">
    .recommendDoctor .personalList p{
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
    }
</style>