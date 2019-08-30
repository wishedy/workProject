<template>
    <section class="al-elite-recommendList">
        <EliteRecommendItem v-for="(item,index) in recommendList" :config="item" :key="index" v-if="index<limitNum"></EliteRecommendItem>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
      recommend:EliteSdk.recommend
    };
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import EliteRecommendItem from './EliteRecommendItem'
    export default {
        components:{
            EliteRecommendItem
        },
        data(){
          return {
              recommendList:[],
              limitNum:4
          }
        },
        methods:{
            checkInvalid(str){
                return comm.checkInvalid(str);
            },
            getRecommendList(){
                let _this = this;
                axios.get(xhrUrl.recommend, {
                    params: {
                        paramJson:JSON.stringify({
                            firstResult:0,
                            maxResult:10
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){

                            _this.recommendList= res.data.responseObject.responseData.dataList[0]['resultList'];
                            _this.title= _this.checkInvalid(res.data.responseObject.responseData.dataList[0]['title'])?"":res.data.responseObject.responseData.dataList[0]['title'];
                            _this.$emit("setTitle",_this.title);
                            //存在数据
                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            }
        },
        mounted(){
            let _this = this;
            _this.getRecommendList();
        }
    }
</script>