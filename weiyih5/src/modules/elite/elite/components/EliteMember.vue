<template>
    <section class="al-elite-member">
        <HeaderBar :header-config="headerConfig"></HeaderBar>
        <!--<MemberTitle class="top-title" :config="config" v-if="!checkInvalid(config.title)"></MemberTitle>-->
        <EliteMemberTopListList :memberConfig="memberConfig" v-if="memberConfig.memberList.length" @follwedTopCustomer="follwedMemberListCustomer" class="al-elite-topList"></EliteMemberTopListList>
        <EliteMemberAssociation v-for="(item,index) in branchConfig.branchList" :associationConfig="item" :key="index" @follwedCustomer="follwedBranchCustomer" :listIndex="index"></EliteMemberAssociation>
        <EliteMemberRedundance :redundanceConfig="redundanceConfig" v-if="redundanceConfig.titleList.length" @follwedCustomer="follwedRedundanceListCustomer"></EliteMemberRedundance>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
          memberList:EliteSdk.memberList,
          followed:EliteSdk.followed
         };
    import axios from 'axios';
    import {mapActions,mapGetters} from 'vuex';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import MemberTitle from './EliteMemberTitle';
    import EliteMemberList from './EliteMemberList';
    import EliteMemberTopListList from './EliteMemberTopList';
    import EliteMemberAssociation from './EliteMemberAssociation';
    import EliteMemberRedundance from './EliteMemberRedundance';
    import TempCache from "../../../../../static/js/tempcache";
    let userId = TempCache.getItem('userId');
    export default {
        components:{
            HeaderBar,
            MemberTitle,
            EliteMemberAssociation,
            EliteMemberList,
            EliteMemberTopListList,
            EliteMemberRedundance
        },
        data(){
            return {
                headerConfig:{
                    title:"",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "93",
                            customerId:userId,
                            visitSiteId:2
                        },
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff:true
                },
                config:{
                    title:''
                },
                memberConfig:{
                    memberList:[]
                },
                branchConfig:{
                    branchList:[]
                },
                redundanceConfig:{
                    titleList:[]
                }
            }
        },
        methods:{
            follwedMemberListCustomer(config){
              let _this = this;
              let list = _this.memberConfig.memberList;
              for(let num = 0;num<list.length;num++){
                  let item = list[num];
                  let seList = item.memberList;
                  for(let seNum = 0;seNum<seList;seNum++){
                      let seItem = seList[seNum];
                      if(parseInt(seItem.customerId,10)===parseInt(config.cid,10)){
                          seItem.relationship = config.relationship;
                      }
                  }

              }
            },
            follwedRedundanceListCustomer(config){
                let _this = this;
                let list = _this.recentConfig.titleList;
                for(let num = 0;num<list.length;num++){
                    let item = list[num];
                    let thList = item.memberList;
                    for(let thNum = 0;thNum<thList.length;thNum++){
                        let thItem = thList[thNum];
                        if(parseInt(item.customerId,10)===parseInt(config.cid,10)){
                            thItem.relationship = config.relationship;
                        }
                    }


                }
            },
            follwedBranchCustomer(config){
                let _this = this;
                let list = _this.branchConfig.branchList;
                for(let num = 0;num<list.length;num++){
                    let item = list[num];
                    let seList = item.titleList;
                    for(let seNum = 0;seNum<seList.length;seNum++){
                        let seItem = seList[seNum];
                        let thList = seItem.memberList;
                        for(let thNum = 0;thNum<thList.length;thNum++){
                            let thItem = thList[thNum];
                            if(parseInt(item.customerId,10)===parseInt(config.cid,10)){
                                thItem.relationship = config.relationship;
                            }
                        }
                    }

                }
            },
            checkInvalid:(val)=>{
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            getMemberList(){
                let _this = this;
                axios.get(xhrUrl.memberList, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14,
                            // customerId:1477540724325
                            customerId:userId||''
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                            let memberData = res.data.responseObject.responseData;
                            console.log(memberData.totalCount);
                            _this.config.title = memberData.topList.length?memberData.topList[0].name:'';
                            _this.headerConfig.title = "成员"+memberData.totalCount;
                            _this.memberConfig.memberList = memberData.topList.length?memberData.topList:[];
                            _this.branchConfig.branchList = memberData.branchList;
                            _this.redundanceConfig.titleList = memberData.titleList;
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
        computed:{
            ...mapGetters(['organizationName'])
        },
        watch:{
            organizationName(){
                let _this = this;
                EliteSdk.setTitle({
                    seoTitle:_this.organizationName+`的学术报道-唯医骨科,allinmd`,
                    title:_this.organizationName
                });
            }
        },
        mounted(){
            let _this = this;
            _this.getMemberList();
            EliteSdk.setTitle({
                seoTitle:_this.organizationName+`的成员详情-唯医骨科,allinmd`,
                title:_this.organizationName
            });
        }
    }
</script>