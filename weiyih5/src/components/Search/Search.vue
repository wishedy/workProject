<template>
    <section class="searchCont">
        <aside class="searchInput" @click="enterSearch"><i></i><span v-for="(v,i) in item" :key="i">{{v.searchKey,i | cut}}</span></aside>
        <button @click="checkSearch">搜索</button>
    </section>
</template>

<script>
    /**
     * @Desc：各页面顶部公共搜索框
     * @Usage: 直接添加使用该组件
     * @Notify：
     * @Depend：
     *
     * Created by dinglindong on 17/11/23.
     *
     */
    import axios from "axios";
    import comm from "static/js/comm.js";
    let xhrUrl = {
        hotSearchUrl:"//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList"
    };
    const path = "//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList";
    export default{
        data(){
            return {
                item:[]
            }
        },
        mounted(){
            this.search();
        },
        methods:{
            checkInvalid(val) {
                if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                    return true;
                } else {
                    return false;
                }
            },
            checkResData(data){
                if(data&&data.responseObject&&data.responseObject.responseData&&(!$.isEmptyObject(data.responseObject.responseData))&&(data.responseObject.responseData.dataList)&&(data.responseObject.responseData.dataList.length>0)){
                    return true;
                }else{
                    return false;
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
            search(){
                let t = this;
                // axios.get(xhrUrl.hotSearchUrl, {
                axios.get(path, {
                    params: {"sortType":2}
                })
                    .then(function (response) {
                        let list = [{searchKey:"搜索"}];
                        if(t.checkResData(response.data)){
                            console.log(t.checkResData(response.data));
                            //存在数据
                            //console.log(response.data);
                            let dataList=response.data.responseObject.responseData.dataList;
                            let preList=t.correctRecommendType(response.data.responseObject.responseData.preList);
                            if(preList[0]&&!t.checkInvalid(preList[0]['searchKey'])){
                                list[0]['searchKey'] = preList[0]['searchKey'];
                            }else{
                                //没有数据
                            }
                        }else{
                            //没有数据
                        };
                        t.item = list;
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                /*axios({
                    url:path,
                    method:"POST",
                    data:{
                        "pageIndex":1,
                        "pageSize" : 2,
                        "groupByFlag":1,
                        "platformId":1,
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    if(res.data.responseObject.responseStatus){
                        t.item = res.data.responseObject.responseData.data_list;
                    }
                })*/
            },
            checkSearch(){
              let t = this;
                if(!t.checkInvalid(t.item[0].searchKey)){
                    t.enterSearch();
                }
            },
            enterSearch(){
                comm.creatEvent({
                    triggerType:'搜索',
                    actionId:9,
                    async:false
                });
                g_sps.jump(null,'/dist/search/search.html');
            }
        },
        filters:{
            cut:(v,i)=>{
                let str = comm.htmlToString(v)+"";
                let cytStr = String;
                if(i==2){
                    cytStr = str.substr(0,str.length-3);
                }else{
                    cytStr =str;
                }
                return comm.getStrByteLen(cytStr,40);
            }
        }
    }
</script>
