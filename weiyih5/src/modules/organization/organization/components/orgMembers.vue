<template>
    <section>
        <HeaderBar :header-config="headerConfig" style="position:fixed;top: 0;left: 0;z-index: 2"></HeaderBar>
        <section class="memberList">
            <section class="presidents" v-for="(item,index) in dataList">
                <div class="presidentsTitle">
                    <p>{{item.name}}<span>{{item.totalCount}}</span></p>
                </div>
                <ul class="meList">
                    <li v-for="(ite,inde) in item.memberList" :key="inde" @click.stop="jumpPerInd(ite.customerId)">
                        <div class="folImg">
                            <img :src="ite.logoUrl?ite.logoUrl:defaultImg" alt="">
                        </div>
                        <div class="folTxt">
                            <p class="folName"><span :class="{'al-vipUserV1':ite.authState==2,'al-vipUserV2':ite.authState==8}">{{getStrFn(ite.organizationMemberName,12)}}</span><span class="professional">{{getStrFn(ite.organizationMemberMedicalTitleShow,12)}}</span></p>
                            <p class="folDesc">{{getStrFn(ite.organizationMemberCompany,26)}}</p>
                        </div>
                        <div class="followBtn" v-if="ite.customerId&&ite.customerId!=cId">
                            <p class="eachFollow" v-if="ite.relationship==4" @click.stop>相互关注</p>
                            <p class="toFollow" v-show="ite.relationship==1||ite.relationship==''" @click.stop="follow(ite.customerId,index,inde)"><i></i>关注</p>
                            <p class="alFollw" v-show="ite.relationship==2||ite.relationship==3" @click.stop><img src="/static/images/organization/alFollow.png"></p>
                        </div>
                    </li>
                </ul>
            </section>
        </section>
        <section class="dataIsOver" v-if="noMore">~  没有更多了  ~</section>
    </section>
</template>
<script type="text/ecmascript-6">
    import axios from "axios";
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js';
    import user from 'static/js/module.user.js';
    import {mapActions,mapGetters} from "vuex";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import commPopup from 'static/js/commPopup.js';
    export default {
        components:{
            HeaderBar,
        },
        data(){
            return{
                path:{
                    getMember:'/mcall/organization/getMemberPager/',
                    followed:'/mcall/customer/follow/people/create/',//关注按钮
                },
                headerConfig:{
                    title: "成员",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    }
                },
                defaultImg:'//img00.allinmd.cn/default-user/new_default.jpg',//默认头像
                pageIndex:1,
                pageSize:10,
                dataList:[],
                dataListNew:[],
                ajaxing:false,
                noMore:false,
                totalCount:0,
                orgId:comm.getpara().orgId,//从导航上获取orgId
                cId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "0",
            }
        },
        computed:{
            ...mapGetters(['isLoading']),
        },
        filters:{

        },
        methods:{
            ...mapActions(["changeLoading"]),
            getMembers(){
                let t = this;
                t.changeLoading(true);
                t.ajaxing = true;
                comm.ajax2({
                    url: t.path.getMember,
                    data: {paramJson: JSON.stringify({
                            organizationId: t.orgId,
                            pageIndex:t.pageIndex,
                            pageSize:t.pageSize,
                            customerId:t.cId,
                        })},
                    dataType: 'json',
                    type: 'get',
                    success: function (res) {
                        t.changeLoading(false);
                        t.ajaxing = false;
                        if(comm.hasResponseData(res)){
                            // <!--ite.relationship:1-未关注，2-已关注，3-粉丝，4-相互关注-->
                            if(res.responseObject.responseData.dataList.length>0){//如果没有数据
                                t.pageIndex++;
                                if(res.responseObject.responseData.totalCount<=10){//如果总数小于10
                                    t.noMore = true;
                                }
                                t.dataListNew = res.responseObject.responseData.dataList;//将新请求的数据进行存储
                                if (t.dataList.length<=0){//如果是第一次请求的数据
                                    t.dataList = t.dataList.concat(t.dataListNew);
                                    t.headerConfig.title = '成员'+res.responseObject.responseData.totalCount;
                                }
                                else{
                                    let dataList=t.dataList;
                                    for(let i = 0;i<t.dataListNew.length;i++){//循环新请求的数据console.log(t.dataList.length)
                                        let jIndex=0;
                                        for(let j = 0;j<dataList.length;j++){//循环原来的数据
                                            if(t.dataListNew[i].id==dataList[j].id){//如果两个的id是相同的则表示是同一项下的数据，则将该id下的数据进行拼接
                                                t.dataList[j].memberList = t.dataList[j].memberList.concat(t.dataListNew[i].memberList);
                                                break;
                                            }else {
                                                jIndex++;
                                            }
                                        }
                                        if(jIndex==dataList.length){
                                            t.dataList = t.dataList.concat(t.dataListNew[i]);
                                        }
                                    }
                                }
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
                        if(!t.ajaxing && !t.noMore && location.hash.indexOf('#/orgMembers')>-1){
                            t.getMembers();
                        }
                    }
                }
            },
            getStrFn:function (txt,len) {
                return comm.getStrLen(txt, len)
            },
            //关注功能
            follow(id,parentIndex,index){
                let t = this;
                event.preventDefault();
                event.stopPropagation();
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        t.ajaxing = true;
                        axios({
                            url:t.path.followed,
                            method:"POST",
                            data:{
                                "dataFlag":2,
                                "refId":id
                            },
                            transformRequest: [data=>{
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(res=>{
                            t.ajaxing = false;
                            if(res.data.responseObject.responseStatus == true){
                                t.dataList[parentIndex].memberList[index].relationship = parseInt(res.data.responseObject.responseData.data_list[0].relationship);
                                comm.creatEvent({
                                    browType:364,
                                    triggerType: '组织-成员',
                                    triggerName: "关注组织粉丝",
                                    actionId: 11483,
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
                if(id){//如果存在他人中心则进行跳转
                    window.location.href='//m.allinmd.cn/dist/personal/others_index.html?cid='+id+'#/';
                }else{
                    commPopup.popup('暂无个人主页');
                }
            }
        },
        mounted(){
            let t = this;
            t.getMembers();
            t.scroll();
        }
    }
</script>
<style rel="stylesheet" lang="scss">
    @import "scss/pages/organization/news.scss";
</style>
