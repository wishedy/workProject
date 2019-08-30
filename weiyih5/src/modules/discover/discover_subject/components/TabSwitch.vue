<template>
    <section class="subjectTab">
        <ul data-alcode-mod='410' data-alcode-item-selector="li">
            <li class="subjectTabItem" @click.stop="contentTab(i)" :class="{active:i==indexFlag}" v-for="(v,i) in itemArr" :key="i">{{v.groupName}}</li>
        </ul>
    </section>
</template>

<script>
    /*
        Change by HJ on 2019/01/17.
        动态获取专题列表的tab栏
    */
    import axios from "axios"
    import comm from "static/js/comm"
    import {mapGetters,mapActions} from "vuex"
    const path  = {
        list:'/mcall/cms/theme/getGroupList/'//动态获取专题的tab切换栏
    };
    export default{
        data(){
            return {
                itemArr:[{
                    "groupValue":'',
                    "groupName":'全部'
                }],
                indexFlag:0,//默认点亮全部
            }
        },
        computed:{
            ...mapGetters(['tabType']),
        },
        methods:{
            ...mapActions(['tabTypeChange']),
            //获取顶部tab
            tabRender(){
                let _this=this;
                axios({
                    url:path.list,
                    method:"get",
                    params:{
                        "firstResult":"0",
                        "maxResult":"99"
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    header:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    if(comm.hasResponseData(res.data)){
                        if(res.data.responseObject.responseData.dataList
                            &&res.data.responseObject.responseData.dataList.length){
                            let items = res.data.responseObject.responseData.dataList;
                            _this.itemArr=[{
                                "groupValue":'',
                                "groupName":'全部'
                            }];
                            for (let i = 0; i < items.length; i++) {
                                let kv=items[i];
                                let json={
                                    "groupValue":kv.groupValue,
                                    "groupName":kv.groupName
                                };
                                _this.itemArr.push(json);
                            }
                        }
                    }
                },r=>{
//                    console.log('失败·······')
                })
            },
            //点击tab切换
            contentTab(index){
                let _this=this;
                if(index==_this.indexFlag){
                    return
                }else{
                    _this.indexFlag=index;
                    _this.tabTypeChange(_this.itemArr[index].groupValue);
                }
            },
        },
        mounted(){
            let _this=this;
            _this.tabRender();//渲染tab栏
        }
    }
</script>
<style scoped lang="scss">
    .subjectTab{
        overflow: auto;
        white-space: nowrap;
        ul{
            font-size: 0;
            li{
                display: inline-block;
                float: none;
            }
        }
    }
</style>