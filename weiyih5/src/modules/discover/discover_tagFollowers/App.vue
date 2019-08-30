<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <my-header :header-config="headerConfig"></my-header>
        <section class="al-content al-doctorRecommend" data-alcode-mod='429' v-for="(v,i) in followList">
            <section class="al-doctorRecommendItem">
                <figure class="al-doctorRecommendImg">
                    <figure class="al-doctorRecommendImg">
                        <a :href="sr(v.state,v.customerId)">
                            <img :src="v.logoUrl" alt="">
                        </a>
                    </figure>
                </figure>
                <article class="al-doctorRecommendMsg">
                    <a class="al-doctorRecommendName" :href="sr(v.state,v.customerId)">
                        {{v.customerName}} <i :class="auth(v.state)"></i>
                    </a>
                    <span class="al-doctorRecommendJob" v-if="v.medicalTitle!=''">{{v.medicalTitle | cut }}</span>
                    <span class="al-doctorRecommendHospital">{{v.company | cutWords}}</span>
                    <p class="ev-followBtn">
                        <a href="javascript:;" v-if="v.customerId!==requestParam.customerId" @click="follow(v.relationship,v.customerId,i)" :class="sty(v.relationship)" style="cursor:pointer;" >{{v.relationship | compile}}</a>
                    </p>
                </article>
            </section>
        </section>
        <section class="lastTime" v-show="noData">~  没有更多了  ~</section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import axios from "axios";
    import TempCache from "static/js/tempcache";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import myHeader from "components/HeaderBar/HeaderBar";
    import user from 'static/js/module.user.js';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    window.user = user;
    const PATH = '/mcall/recommend/tag/resource/json_customers/';
   const TID = comm.getpara("?").tId;
    // const TID = 1;
    const CUSTOMERID = TempCache.getItem('userId') || "";
    export default{
        data(){
            return {
                requestParam:{
                    tagId: TID,
                    pageIndex: 1,
                    pageSize: 20,
                    customerId: CUSTOMERID,
                    scene: 2,
                },
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                ajaxing:false,
                noData:false,
                followList:[],
                state:"",
                headerConfig:{
                    title:"关注此标签的人",
                    backOnOff:true
                },
            }
        },
        mounted(){
            this.tagFollow();
            this.setSeo();
            this.scroll();
        },
        methods:{
            tagFollow(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url:PATH,
                    method:"POST",
                    data:t.requestParam,
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        t.followList = t.followList.concat(dataList);
                        t.requestParam.pageIndex++;
                        if(dataList.length<20){
                            t.noData = true;
                        }
                    }else{
                        t.noData = true;
                    }
                })
            },
            scroll(){
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 50){
                        if(!t.ajaxing && !t.noData){
                            t.tagFollow();
                        }
                    }
                },false);
            },
            auth:v=>{
                let vipIcon = '';
                if(v==-1||v==3||v==0 ||v==1){//未认证
                    vipIcon='';
                }else{
                    vipIcon='al-vipUser';
                }
                return vipIcon;
            },
            sr:(v,id)=>{
                let link ='';
                if(v && v!=0){
                    link = '/dist/personal/others_index.html?cid='+id
                }else{
                    link = 'javascript:;'
                }
                return link;
            },
            setSeo:function(){
                document.title="关注"+comm.getpara("?").title+"标签的人－唯医,allinmd";
            },
            follow(isfo,id,i){
                let t = this;
                let auth = localStorage.getItem('auth');
                let state;
                if(auth&&auth!=null&&auth!='null'){
                	state = JSON.parse(auth).state;
                }
                if(state==2||state==7||state==8||state==9){//已登录+认证
					if(isfo!=2 && isfo!=4){
						t.ajaxing = true;
						axios({
							url:'/mcall/customer/follow/people/create/',
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
							if(res.data.responseObject.responseStatus){
								t.followList[i].relationship = 2;
							}
						})
					}
                }else{
                	user.privExecute({
						operateType:'auth',
                        noNeedBack:true,
                        callback:function(){}
                    });
                }

            },
            sty(v){
                let str ='';
                if(v==1){
                    str ='al-doctorRecommendFollow btn-primary';
                }else if(v==2){
                    str ='al-doctorRecommendFollowed btn-done';
                }else if(v==4){
                    str = 'al-doctorRecommendFollowBtn btn-dobule';
                }
                return str;
            }
        },
        components:{
            Loading,
            myHeader,
            WakeApp
        },
        filters:{
            cut: v=>{
                return comm.cutLine(comm.cutDoctorTitle(v),"_",",")
            },
            compile: v=>{
                let html ='';
                if(v==1){
                    html ='关注';
                }else if(v==2){
                    html ='已关注';
                }else if(v==4){
                    html = '相互关注';
                }
                return html;
            },
			cutWords:v=>{
            	return comm.getStrLen(v,20);
            }
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/discover/tag_followerList";
    .lastTime {
        font-size: .4rem;
        color: #626f8c;
        margin: .58667rem 0;
        text-align: center;
    }
</style>
