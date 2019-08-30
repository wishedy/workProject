<!--新闻公告-->
<template>
    <section>
        <HeaderBar :header-config="headerConfig" style="position:fixed;top: 0;left: 0;z-index: 2"></HeaderBar>
        <ul class="followList">
            <li class="followItem user" v-for="(item,index) in dataList" @click.stop="jumpPerInd(item.customer_baseinfo.customerId)">
                <div class="folImg">
                    <img :src="item.customer_att.logoUrl?item.customer_att.logoUrl:defaultImg" alt="">
                </div>
                <div class="folTxt">
                    <p class="folName"><span :class="{'al-vipUserV1':item.customer_auth.state==2,'al-vipUserV2':item.customer_auth.state==8}">{{getStrFn(item.customer_auth.fullName,12)}}</span><span class="professional">{{getStrFn(item.customer_auth.medicalTitleShow,12)}}</span></p>
                    <p class="folDesc">{{getStrFn(item.customer_auth.company,28)}}</p>
                </div>
                <div class="followBtn" v-if="item.customer_auth.customerId&&item.customer_auth.customerId!=cId">
                    <p class="eachFollow" v-if="item.customer_fans.relationship==4" @click.stop>相互关注</p>
                    <p class="toFollow" v-show="item.customer_fans.relationship==1" @click.stop="follow(item.customer_auth.customerId,index)"><i></i>关注</p>
                    <p class="alFollw" v-show="item.customer_fans.relationship==2||item.customer_fans.relationship==3" @click.stop><img src="/static/images/organization/alFollow.png"></p>
                </div>
            </li>
        </ul>
        <section class="dataIsOver" v-if="noMore">~  没有更多了  ~</section>
        <loading v-show="loading"></loading>
    </section>
</template>
<script type="text/ecmascript-6">
    import axios from "axios";
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js';
    import user from 'static/js/module.user.js';
    import {mapActions,mapGetters} from "vuex";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import loading from "components/Loading/Loading.vue";
    import commPopup from 'static/js/commPopup.js';
    export default {
        components:{
            HeaderBar,
            loading
        },
        data(){
            return{
                path:{
                    getFollow:'/mcall/customer/follow/fans/json_list/',
                    followed:'/mcall/customer/follow/people/create/',//关注按钮
                },
                headerConfig:{
                    title: "粉丝",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    }
                },
                defaultImg:'//img00.allinmd.cn/default-user/new_default.jpg',//默认头像
                dataList:[],
                loading:false,
                ajaxing:false,
                noMore:false,//没有更多数据
                orgId:comm.getpara().orgId,//从导航上获取orgId
                pageIndex:1,
                pageSize:10,
                cId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "0",
            }
        },
        computed:{
            ...mapGetters(['isLoading']),//获取组织的名字
        },
        methods:{
            ...mapActions(["changeLoading"]),
            getFollowsFn(){
                let t = this;
                t.ajaxing = true;
                t.changeLoading(true);
                comm.ajax2({
                    url: t.path.getFollow,
                    data: {
                            pageIndex:t.pageIndex,
                            pageSize:t.pageSize,
                            customerId:t.orgId,
                            sessionCustomerId:t.orgId,
                            dataFlag:3,
                            useFlag:3,
                            logoUseFlag:3,
                            followType:2
                        },
                    dataType: 'json',
                    type: 'post',
                    success: function (res) {
                        t.pageIndex++;
                        t.changeLoading(false);
                        t.ajaxing = false;
                        if(comm.hasResponseData(res)){
                            t.headerConfig.title = '粉丝';
                            if(res.responseObject.responseData.data_list.length>0){//如果没有数据
                                if(res.responseObject.responseData.new_num<=t.pageSize){
                                    t.noMore = true;
                                }
                                //item.customer_fans.relationship:1-未关注，2-已关注，3-粉丝，4-相互关注
                                t.dataList = t.dataList.concat(res.responseObject.responseData.data_list);
                            }else{
                                t.noMore = true;
                            }
                        }else{//如果没有数据
                            t.noMore = true;
                        }
                    },
                    error:function () {
                        t.changeLoading(false);
                        t.noMore = true;
                    }
                })
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore && location.hash.indexOf('#/orgFollow')>-1){
                            t.getFollowsFn();
                        }
                    }
                }
            },
            getStrFn:function (txt,len) {
                return comm.getStrLen(txt, len)
            },
            //关注功能
            follow(id,index){
                let t = this;
                let dataJson = '';
                event.preventDefault();
                event.stopPropagation();
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        dataJson={
                            "dataFlag":2,
                            "refId":id,
                        };
                        // if(type==1){//表示是关注组织,删除了，粉丝中组织不能关注组织
                        //     dataJson.followType=2
                        // }
                        axios({
                            url:t.path.followed,
                            method:"POST",
                            data:dataJson,
                            transformRequest: [data=>{
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(res=>{
                            t.ajaxing = false;
                            if(res.data.responseObject.responseStatus == true){//关注成功后显示已关注或者相互关注
                                t.dataList[index].customer_fans.relationship = parseInt(res.data.responseObject.responseData.data_list[0].relationship);
                                //事件埋点
                                comm.creatEvent({
                                    browType:365,
                                    triggerType: '组织-粉丝',
                                    triggerName: "关注成员",
                                    actionId: 11482,
                                    refId: id,
                                    refType: "组织"
                                });
                            }else {
                                commPopup.popup(res.data.responseObject.responseMessage)
                            }
                        })
                    }
                });
            },
            //跳转个人中心
            jumpPerInd(id){
                event.preventDefault();
                event.stopPropagation();
                //如果是他人中心判断是否存在cid不存在则进行提示
                if(id){
                    window.location.href='//m.allinmd.cn/dist/personal/others_index.html?cid='+id+'#/';
                }else{
                    commPopup.popup('暂无个人主页');
                }
            }
        },
        mounted(){
            let t = this;
            t.getFollowsFn();
            t.scroll();
        }
    }
</script>
<style rel="stylesheet" lang="scss">
    @import "scss/pages/organization/news.scss";
</style>
