<template>
    <section>
        <section class="al-personalContent">
            <!--有数据显示-->
            <section class="al-content al-doctorRecommend ev-hasList" v-show="!noData">
                <section class="ev-listCon" data-alcode-mod='469'>
                    <userList v-for="(value,key) in list" :item ="value" :key="key"></userList>
                </section>
            </section>
            <section class="al-personalContributionOver" v-if="!noData&&noMore">~  没有更多了  ~</section>

            <!--没有数据时推荐医师-->
            <section class="ev-noList" v-show="noData">
                <section class="al-personalNoneTipsImg">
                    <figure class="ev-imgPar" :style="style">
                        <img :src="noListImg" alt="" class="ev-noListImg">
                    </figure>
                </section>
                <section class="al-content al-doctorRecommend" v-show="!cId">
                    <header class="al-noContentTitle ev-noListTitle">{{noListTitle}}</header>
                    <section class="ev-reDoc">
                        <userList v-for="(value,key) in reList" :item ="value" :key="key"></userList>
                    </section>
                </section>
            </section>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>
<style>
    .al-personalContributionOver {
        text-align: center;
        padding-top: 0.66667rem;
        padding-bottom: 0.93333rem;
        font-size: 0.35rem;
        color: #626f8c;
        background-color: #eff4f8;
    }
</style>
<script type="text/ecmascript-6">
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    import Loading from 'components/Loading/Loading'
    import userList from 'components/ListTemplate/UserList'

    const path={
        getSpecialCount:"/mcall/customer/message/getSpecialCount/",//获取粉丝，赞的数量
        customerInfo : "/mcall/customer/unite/json_list/",//客户信息
        fansList : "/mcall/customer/follow/fans/json_list/",//粉丝列表
        followList : "/mcall/customer/follow/people/json_list/", //关注列表
        praiseList : "/mcall/customer/prefer/json_list/",//赞列表
        reDoc : "/mcall/customer/auth/getRecommendList/"//推荐医师
    };
    export default{
        data(){
            return {
                cId:comm.getpara().cid,
                pageIndex:1,
                type:"fans",
                style:'',
                list:[],
                reList:[],
                noData:false,
                noMore:false,
                ajaxing:false,
                newFansNum:0,//新增粉丝数
                newUpNum:0,//新增点赞数
                noListTitle:'',
                noListImg:''
            }
        },
        methods:{
            //参数配置
            getParam:function(){
                let t =this;
                let data={};
                let customerId = TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'';
                if(t.cId){//是他人粉丝、关注
                  customerId = t.cId;
                }
                if(t.type!=="praise"){
                    data.customerId=customerId;
                    data.sessionCustomerId= customerId;
                    data.dataFlag=3;
                    data.useFlag=t.GLOBAL.UseFlag.c;
                    data.logoUseFlag=3;
                    data.pageIndex=t.pageIndex;//第几页
                    data.pageSize= 10;//每一页的数量
                    if(t.type=="follow"){//如果是粉丝列表
                        data.followTypeFlag=31
                    }
                }else{ //赞方式
                    data.upDownType=1;
                    data.usefulType = 9;
                    data.refId=customerId;
                    data.dataFlag=1;
                    data.attUseFlag=8;
                    data.useFlag=t.GLOBAL.UseFlag.c;
                    data.logoUseFlag=3;
                    data.pageIndex=t.pageIndex;//第几页
                    data.pageSize= 10;//每一页的数量
                }
                return data;
            },
            getSpecialCount :function(){
                let t=this;
                t.ajaxing=true;
                let data={};
                data.readTrendTime = TempCache.getItem("readTrendTime");
                data.readFansTime = TempCache.getItem("readFansTime");
                data.readPreferTime = TempCache.getItem("readPreferTime");
                data.platformId= TempCache.getItem("department");
                let param={};
                param.paramJson= JSON.stringify(data);
                comm.ajax2({
                    type : "post",
                    url : path.getSpecialCount,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData){
                            if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                                let specialList=rep.responseObject.responseData.data_list[0];
                                t.newFansNum=specialList.fansNum;//新增粉丝数
                                t.newUpNum=specialList.preferNum;//新增赞数
                                t.getUserList();
                            }
                        }
                    },
                    error:function(){}
                });
            },
            getUserList:function(){
                let t=this;
                let url="";
                let num=0;
                switch (t.type){
                    case "praise"://赞
                        url= path.praiseList;
                        t.noListTitle="多与大家互动，让更多人认识你";
                        t.noListImg="//img50.allinmd.cn/pages/index/no_like.png";
                        num=this.newUpNum;
                        this.style="width:2.44rem;height:4.22667rem";
                        break;
                    case "fans"://粉丝
                        url= path.fansList;
                        t.noListTitle="先关注别人";
                        t.noListImg="//img50.allinmd.cn/pages/index/no_fans.png";
                        num=this.newFansNum;
                        break;
                    case "follow"://关注
                        url= path.followList;
                        t.noListTitle="他们有很多病例";
                        t.noListImg="//img50.allinmd.cn/pages/index/no_follow.png";
                        this.style="width:3.84rem;height:4.2rem";
                        break;
                }
				t.ajaxing=true;
                comm.ajax2({
                    type : "post",
                    url : url,
                    data : t.getParam(),
                    dataType : "json",
                    success : function(rep){
                        let options = {
                            success(rep){
                                t.ajaxing=false;
                                let item =rep.responseObject.responseData.data_list;
                                for(let i=0; i<item.length; i++){
                                    let json = {};
                                    let logo, auth, base, fans, statistic;
                                    if(item[i].customer_att){
                                        logo=item[i].customer_att;
                                    }
                                    if(item[i].customer_auth){
                                        auth=item[i].customer_auth;
                                    }
                                    if(item[i].customer_baseinfo){
                                        base=item[i].customer_baseinfo;
                                    }
                                    if(item[i].customer_statistic){
                                        statistic=item[i].customer_statistic;
                                    }
                                    fans=item[i].customer_fans?item[i].customer_fans:item[i].customer_people;
                                    if(t.type === "praise"){ //赞时customerId从auth中取
                                        fans = {};
                                        fans.relationship = item[i].customer_relationship;
                                        base.customerId = item[i].customer_auth.customerId;
                                    }
                                    json.userName=auth.lastName?auth.lastName+auth.firstName:"";
                                    json.medicalTitle=auth.medicalTitleShow;//auth.medicalTitle?comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",",")):"";
                                    json.company=auth.workplace;
                                    json.relationship=fans.relationship;
                                    json.cid=base.customerId;
                                    json.customerId=TempCache.getItem("userId");
                                    json.logoUrl=logo.logoUrl;
                                    json.state=auth.state;
                                    json.tips=i<num?1:0;
                                    json.followType=(auth.followType==1||auth.followType==2)?auth.followType:'';//如果返回了followType并且为1或2则是关注列表
                                    json.fullName=auth.fullName?auth.fullName:'';//组织全名
                                    json.orgCompany = auth.company;//组织简介;
                                    json.OrgId = auth.id;//组织id
                                    if(item[i].state==-1||item[i].state==3||item[i].state ==0){
                                        json.vipIcon=0;
                                    }else{
                                        json.vipIcon=1;
                                    }
                                    t.list.push(json);
                                }
                                t.pageIndex++;
                                if(item.length<10){
                                    t.noMore=true;
                                }
                            },
                            failed(){
                                t.ajaxing=false;
                                t.noMore=true;
                                if(t.list.length){
                                    return false;
                                }else{
                                    if(t.pageIndex==1){//第一页无数据
                                        t.list = [];
                                        t.noData=true;
                                        if(!t.cId){
                                          t.getReDoc();//推荐用户
                                        }
                                    }
                                }

                            }
                        };
                        comm.successRequest(rep,options);
                    },
                    error:function(){}
                });
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore){
                        	t.ajaxing = true;
                            t.getUserList();
                        }
                    }
                }
            },
            //推荐用户
            getReDoc:function(){
                let t=this;
                let data={};
                let param={};
                data.sessionCustomerId=TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'';
                data.sortType=4;
                data.recommendAreasExpertiset= t.areasExpertise;
                data.recommendCompany= t.company;
                data.logoUseFlag=3;
                data.pageIndex=1;
                data.pageSize=6;
                param.paramJson= JSON.stringify(data);
                comm.ajax2({
                    type : "post",
                    url : path.reDoc,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        let options={
                          success(rep){
                              let rows=rep.responseObject.responseData.data_list;
                              for(let i=0;i<rows.length;i++){
                                  let json = {};
                                  let logo, user, statistic;
                                  if(rows[i].customer_att){
                                      logo=rows[i].customer_att;
                                  }
                                  if(rows[i].customer_doctor){
                                      user=rows[i].customer_doctor;
                                  }
                                  if(rows[i].customer_statistic){
                                      statistic=rows[i].customer_statistic;
                                  }

                                  json.userName=user.last_name?user.last_name+user.first_name:"";
                                  json.medicalTitle=user.medicalTitle?comm.cutDoctorTitle(comm.cutLine(user.medicalTitle,"_",",")):"";
                                  json.company=user.workplace;
                                  json.relationship=rows[i].relationship;
                                  json.cid=user.customer_id;
                                  json.customerId=TempCache.getItem("userId");
                                  json.logoUrl=logo.logoUrl;
                                  json.state=user.state;
                                  if(rows[i].state==-1||rows[i].state==3||rows[i].state ==0){
                                      json.vipIcon=0;
                                  }else{
                                      json.vipIcon=1;
                                  }
                                  t.reList.push(json);
                              }
                          }
                        };
                        comm.successRequest(rep,options);
                    }
                });
            }
        },
        mounted(){
            let para=comm.getpara();
            if(para.action){
                this.type=para.action;
            }
            if(this.cId) {//是他人粉丝、关注
              this.getUserList();
            }else{
              this.getSpecialCount();
            }

            this.scroll();
        },
        components:{
            Loading,
            userList
        },

    }
</script>