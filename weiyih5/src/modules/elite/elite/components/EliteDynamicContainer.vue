<template>
    <section class="al-elite-dynamicContainer">
        <EliteDynamicItem v-for="(item,index) in dynamicConfig.dynamicList"  :key="index" :imageUrl="item.imageUrl" v-if="index<limitNum"  :h5Url="item.h5Url" :id="item.id"></EliteDynamicItem>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
      dynamic:EliteSdk.dynamic
    };
    import axios from 'axios';
    import EliteDynamicItem from './EliteDynamicItem'
    export default {
        components:{
            EliteDynamicItem
        },
        data(){
          return {
              dynamicConfig:{
                  dynamicList:[]
              },
              limitNum:2
          }
        },
        methods:{
          getDynamicList(){
              let _this = this;
              axios.get(xhrUrl.dynamic, {
                  params: {
                      paramJson:JSON.stringify({
                          organizationId:14,
                          firstResult:0,
                          maxResult:10
                      })
                  }
              })
                  .then(function (res) {
                      if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                          _this.dynamicConfig.dynamicList= res.data.responseObject.responseData.dataList[0]['resultList'];
                          _this.$emit('setTitle',res.data.responseObject.responseData.dataList[0]['title']);
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
            _this.getDynamicList();
        }
    }
</script>