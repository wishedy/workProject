<template>
    <section class="al-searchInputBar" data-alcode-mod='411' v-show="status" :class="{alZindex:cancel} ">
        <i class="icon-searchWhite"></i>
        <input type="text" placeholder="请输入标签关键词" id="EV-SearchInput" :class="{focus:cancel}" @click="clickSearch" v-model="data" @compositionstart="isLoad(false)" @compositionend="isLoad(true)" @input="search(data)">

        <a class="al-searchCancel" data-alcode='e47' :style="{display:cancel?'inline':''}" @click.stop="searchCancel">
            <i class="icon-searchCancel" :style="{display:closeShow?'inline':''}" @click.stop="close"></i>取消
        </a>
    </section>
</template>

<script>
    import axios from "axios"
    import {mapGetters,mapActions} from "vuex"
    import comm from "static/js/comm"
    import bus from "../assets/eventBus"
    import Log from "static/js/log"
    const path = "/mcall/cms/theme/getMapList3/";
    export default{
        data(){
            return {
                status:true,            //是否显示搜索框
                cancel:false,           //判断页面内容隐藏显示
                closeShow:false,        //搜索框内小x号隐藏显示
                data:'',                //input框value值
                flag:false,             //中英文是否开始、结束标记
                index:1
            }
        },
        methods:{
            clickSearch(){
                //Log.createBrowse(173,'专题-搜索');
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId: 435})
                    }
                },2200);
                this.cancel = true;     //使当前页面隐藏元素隐藏
                this.changeEn(1);       //使content页隐藏内容隐藏
            },
            searchCancel(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"取消",
                    actionId:45
                });
                this.cancel = false;    //使当前页面显示元素显示
                this.changeEn(0);       //使content页显示内容显示
                this.data = "";         //清空v-model值
                bus.$emit("cancel")     //使content页内容从新加载主方法
            },
            isLoad(v){                  //中英文输入开始结束判断方法
                if(v){
                    this.flag = false;
                }else{
                    this.flag = true;
                }
            },
            search(data){
                let t = this;
                if(data && data.length && !this.flag){
                    comm.creatEvent({
                        triggerType: '搜索',
                        keyword: t.data,
                        actionId: 10
                    });
                    this.closeShow = true;
                    axios({
                        url:path,
                        method:"POST",
                        data:{
                            sortType: 5,
                            pageIndex: t.index,
                            pageSize: 20,
                            themeGroup:"",
                            searchKeyword:t.data
                        },
                        transformRequest:[data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        header:{
                            "X-Requested-with":"XMLHttpRequest"
                        },
                        timeout:30000
                    }).then(res=>{
                        bus.$emit("cancelLayer")    //搜索成功是否有数据取消弹层显示
                        if(comm.hasResponseData(res.data)){
                            bus.$emit("successData",res)        //请求数据之后向content组件发射变量
                            t.shareEn(t.data);
                        } else{
                            bus.$emit("successData",res);
                            t.shareEn('');
                        }
                    })
                }
            },
            close(){                        //搜索x号点击
                this.data = "";             //v-model数据清空
                this.closeShow = false;     //关闭小按钮隐藏
                bus.$emit("close");         //清空数据、匹配成功、无数据图片
            },
            ...mapActions(["change","changeEn","shareEn"])
        },
        computed:{
            ...mapGetters(['tabType']),
        },
        watch:{
            tabType(){
                if(this.tabType!=""){
                    this.status = false;
                }else{
                    this.status = true;
                }
            },
           /* "$store.state.typeName"(){      //判断是否是全部页，是否展示搜搜
                if(!this.$store.state.typeName){
                    this.status = true;
                }else{
                    this.status = false;
                }
            }*/
        }

    }
</script>

<style scoped>
    .icon-searchWhite:before {
        content: "";
        width: .4rem;
        height: .4rem;
        display: inline-block;
        vertical-align: middle;
        margin-top: .04rem;
        background: url('//img50.allinmd.cn/pages/personal/icon_searchWhite.png') center center no-repeat;
        background-size: 100% 100%;
        margin-right: .13333rem;
    }
    .icon-searchCancel:before {
        content: "";
        width: .37333rem;
        height: .37333rem;
        display: inline-block;
        vertical-align: middle;
        margin-top: 0.33333rem;
        background: url('//img50.allinmd.cn/pages/personal/icon_searchCancel.png') center center no-repeat;
        background-size: 100% 100%;
    }
</style>