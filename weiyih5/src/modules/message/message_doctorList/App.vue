<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <header class="al-indexHeader" data-alcode-mod='448'>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)" data-alcode='e58' @click="backBtn">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1><span>{{peopleNum}}</span>{{title}}</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                </a>
            </figure>
        </header>
        <!--主体列表-->
        <section class="al-personalContent">
            <section class="al-content al-doctorRecommend" data-alcode-mod='451'>
                <vue-data-loading :loading="loading" :completed="noData" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="0">
                    <section class="al-doctorRecommendItem" v-for="(v,i) in dataList">
                        <figure class="al-doctorRecommendImg">
                            <a :href="'/personal/others_index.html?cid='+v.customer_auth.customerId">
                                <img :src="v.customer_att.logoUrl" alt="">
                            </a>
                        </figure>
                        <article class="al-doctorRecommendMsg">
                            <a class="al-doctorRecommendName" :href="'/personal/others_index.html?cid='+v.customer_auth.customerId">
                                {{v.customer_auth.customerName}}<i class="al-vipUser"></i>
                            </a>
                            <span class="al-doctorRecommendJob"><a :href="'/personal/others_index.html?cid='+v.customer_auth.customerId">{{v.customer_auth.medicalTitle | cut}}</a></span>
                            <span class="al-doctorRecommendHospital"><a :href="'/personal/others_index.html?cid='+v.customer_auth.customerId">{{v.customer_auth.company | length}}</a></span>
                            <p class="ec-followBtn">
                                <a href="javascript:void(0)" :class="styles(v.customer_auth.relation)" @click="followBtn(v.customer_auth.relation,i,v.customer_auth.customerId)">
                                    {{v.customer_auth.relation | filter}}
                                </a>
                            </p>
                        </article>
                    </section>
                </vue-data-loading>
            </section>
            <FollowLayer @ensureClickEvent="ensure" @cancelClickEvent="cancel" :followLayer='followLayer'></FollowLayer>
            <Loading v-show="loading"></Loading>
        </section>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading.vue";
    import {mapActions} from "vuex";
    import FollowLayer from "components/FollowLayer/FollowLayer.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    const PATH = {
        list:"/mcall/customer/message/getPeopleList/", //请求医师列表
        followed:'/mcall/customer/follow/people/create/',
        noFollow:'/mcall/customer/follow/people/delete/',
    };
    export default{
        data(){
            return {
                loading:false,
                flag:comm.getpara().flag,
                reT:'',
                rId:'',
                opT:'',
                cST:'',
                pageIndex:1,
                pageSize:10,
                title:'',
                peopleNum:'',
                dataList:[],
                followLayer:{
                    title:'确定不再关注此人？'
                },
                id:'',
                i:'',
                noData:false,
            }
        },
        mounted(){
            this.mesDocListAjax();
        },
        methods:{
            "infiniteScroll"(){             //滚动组件配置选项
                let t = this;
                t.loading = true;
                t.pageIndex++;
                setTimeout(() => {
                    t.mesDocListAjax();    //获取当前页面数据列表
                }, 1000)
            },
            mesDocListAjax() {
                let t = this;
                if(t.flag==1){
                    t.reT = comm.getpara().reT;
                    t.rId = comm.getpara().rId;
                }else{
                    t.reT = comm.getpara().reT;
                    t.rId = comm.getpara().rId;
                    t.opT = comm.getpara().opT;
                    t.cST = comm.getpara().cST;
                }
                let param = {};
                param.logoUseFlag = 3;
                param.pageIndex = t.pageIndex;
                param.pageSize = t.pageSize;
                param.resourceType = t.reT;
                param.refId = t.rId;
                param.dataFlag = 2;
                param.messageType = 1;
                if(t.opT){//赞了我的
                    param.opType = t.opT;
                    param.opTypeRules = 2;
                    param.comparMessageSrcTime=t.cST;
                }else{  //提醒我看
                    param.opTypeRules = 1;
                    param.comparMessageSrcTime="";
                }
                t.loading = true;
                axios({
                    url: PATH.list, //请求医师列表
                    method: "POST",
                    data: param,
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    t.loading = false;
                    if(comm.hasResponseData(res.data)){
                        var items = res.data.responseObject.responseData.data_list;
                        let optext = '';
                        if(t.opT){               //赞了我的
                            optext = t.getOpConText(t.opT);
                        }else{                      //提醒我看
                            optext = "评论了";
                        }
                        t.peopleNum = comm.getpara().count?comm.getpara().count+'人':'';
                        t.title = optext;
                        t.dataList = t.dataList.concat(items);
                        if(items.length<10){
                            t.noData = true;        //小于10显示没有更多了
                        }
                    }else{
                        t.noData = true;            //第一次加载以外没有数据显示没有更多了
                    }
                });
            },
            getOpConText(e) {
                var conText = "";
                switch (parseInt(e)) {
                    case 0:
                        conText = "发布了";
                        break;
                    case 1:
                        conText = "评论了";
                        break;
                    case 2:
                        conText = "转发了";
                        break;
                    case 3:
                        conText = "收藏了";
                        break;
                    case 4:
                        conText = "分享了";
                        break;
                    case 5:
                        conText = "赞了";
                        break;
                    case 6:
                        conText = "更新了";
                        break;
                }
                return conText;
            },
            styles(v){
                let str = '';
                switch (parseInt(v)) {
                    case 1:
                        str = "al-doctorRecommendFollow btn-primary";
                        break;
                    case 2:
                        str = "al-doctorRecommendFollowed btn-done";
                        break;
                    case 3:
                        str = "al-doctorRecommendFollow btn-primary ";
                        break;
                    case 4:
                        str = "al-doctorRecommendFollowBtn btn-dobule";
                        break;
                    default:
                        str = "al-doctorRecommendFollow btn-primary";
                }
                return str;
            },
            followBtn(v,i,id){
                let t = this;
                t.id = id;
                t.i = i;
                if(v!=2 && v!=4){
                    t.loading = true;
                    axios({
                        url:PATH.followed,
                        method:"POST",
                        data:{
                            "dataFlag":2,
                            "refId":t.id
                        },
                        transformRequest: [data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(res=>{
                        t.loading = false;
                        if(res.data.responseObject.responseStatus == true){
                            t.dataList[t.i].customer_auth.relation = res.data.responseObject.responseData.data_list["0"].relationship;
                        }
                    })
                }else{
                    t.change(true);
                }
            },
            "ensure"() {
                this.changeEn(true);
                this.change(false);
            },
            "cancel"() {
                this.change(false);
            },
            backBtn(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                window.history.back();
            },
            ...mapActions(["change","changeEn"]),
        },
        components:{
            Loading,
            FollowLayer,
            VueDataLoading
        },
        filters:{
            cut:v=>(/(医师|讲师)/.test(v)) ? comm.cutDoctorTitle(comm.cutLine(v, "_", ",")) : v,
            length:v=>comm.getStrLen(v,26),
            filter:v=>{
                let param =v?v:0; //关注关系
                let str = '';
                switch (parseInt(param)) {
                    case 1:
                        str = "关注";
                        break;
                    case 2:
                        str = "已关注";
                        break;
                    case 3:
                        str = "关注";
                        break;
                    case 4:
                        str = "相互关注";
                        break;
                    default:
                        str = "关注";
                }
                return str;
            }
        },
        watch:{
            "$store.state.isEnsure"(){
                if(this.$store.state.isEnsure){
                    let t = this;
                    t.loading = true;
                    axios({
                        url:PATH.noFollow,
                        method:"POST",
                        data:{
                            "dataFlag":2,
                            "refId":t.id
                        },
                        transformRequest:[data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers:{
                            'X-Request-Width':'XMLHttpRequest'
                        },
                        timeout:30000
                    }).then(res=>{
                        t.loading = false;
                        if (res && res.data.responseObject && res.data.responseObject.responseStatus) {
                            t.dataList[t.i].customer_auth.relation = 1;
                        }
                        t.changeEn(false);
                    })
                }
            }
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/message/message_likeUsers";
</style>