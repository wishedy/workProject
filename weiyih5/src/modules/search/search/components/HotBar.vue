<template>
    <section class="al-searchItem" v-show="showOnOff">
        <h2 class="al-searchTitle"><!--<i class="icon-hotSearch"></i>-->热门搜索</h2>
        <article class="al-hotSearchContent" data-alcode-mod="455">
            <span   class="al-hotSearchWord"
                         :keyword="v.searchKey" v-for="(v,i) in list" v-cloak   :key="i"  @click.stop="selectedWord(v.searchKey,i,v)" :class="{'recommend':v.recommendType==1,'preRecommend':v.recommendType==2}"><i class="icon"></i>{{v.searchKey}}</span>
        </article>
    </section>
</template>
<script>
    import {mapActions} from "vuex"
    import comm from 'static/js/comm.js';
    import axios from "axios";
    import SearchCommon from '../searchCommon/searchCommon';
    let xhrUrl = {
        hotSearchUrl:"//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList"
    };
    export default {
        data(){
            return {
                list:[],
                showOnOff:true,
                hotNum:10
            }
        },
        computed:{
            customerId(){
                let t = this;
                return t.$store.state.customerId;
            }
        },
        methods:{
            ...mapActions(["selectedKeyWord",'setPreWord']),
            selectedWord(searchKey,index,item){
                console.log(item);
                let t = this;
                comm.creatEvent({
                    triggerType:'热门搜索',
                    keyword:searchKey,
                    locationId:index,
                    actionId:60
                });
                if(t.checkInvalid(item.type)){
                    t.selectedKeyWord({vm:t,keyVal:searchKey});
                    t.$router.push({
                        path: "/searchResult"
                    });
                }else{
                    if(parseInt(item.type,10)===31){
                        g_sps.jump(null,`/dist/medPlus/medPlus.html#/productDetail?productId=${item.keyword}`);
                    }else if(parseInt(item.type,10)===32){
                        g_sps.jump(null,`/dist/medPlus/medPlus.html#/brandDetail?brandId=${item.keyword}&brandName=${item.name}`);
                    }
                }

            },
            correctRecommendType:function(list){
                let t = this;//之所以写这个方法是因为正常的预填充词recommendType为2，但是后台将这个字段写死为0，前端过滤纠正一下，方便判断
                let originalList = JSON.parse(JSON.stringify(list));
                for(let i = 0;i<originalList.length;i++){
                    originalList[i]['recommendType']=2;
                }
                return originalList;
            },
            checkInvalid(val){
                return SearchCommon.checkInvalid(val);
            },
            getHot(){
                let t = this;
                axios.get(xhrUrl.hotSearchUrl, {
                    params: {"sortType":1}
                })
                    .then(function (response) {
                        if(SearchCommon.checkResData(response.data)){
                            //存在数据
                            //console.log(response.data);
                            let dataList=response.data.responseObject.responseData.dataList;
                            let preList=t.correctRecommendType(response.data.responseObject.responseData.preList);
                            if(preList[0]&&!t.checkInvalid(preList[0]['searchKey'])){
                                t.setPreWord(preList[0]['searchKey']);
                            }else{
                                t.setPreWord('搜索');
                            }
                            t.list=dataList.slice(0,t.hotNum);
                        }else{
                          //没有数据
                            t.setPreWord('搜索');
                        };
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
            }
        },
        watch:{
          "$store.state.searchList"(){
              let t = this;
              if(t.$store.state.searchList.length!=0){
                  if((JSON.parse(t.$store.state.searchList)).length===0){
                      t.showOnOff = true;
                  }else{
                      t.showOnOff = false;
                  }
              }else{
                  t.showOnOff = true;
              }
//              //console.log(t.showOnOff)
          },
            '$store.state.platformType'(){
                let t = this;
                t.getHot();
            }
        },
        mounted(){
            let t = this;
            t.getHot();
        }
    }
</script>