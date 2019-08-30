<template>
    <section class="al-doctorRecommendItem">
        <figure class="al-doctorRecommendImg">
            <figure class="al-doctorRecommendImg" v-bind:class="{'ev-noAllinDoctor':item.cid==0}">
                <a :href="getHref((item.followType==2?item.OrgId:item.cid),(item.followType==2?1:''))">
                    <img :src="item.logoUrl" alt="">
                    <i class="icon-newTips" v-if="item.tips&&item.tips>0"></i>
                </a>
            </figure>
        </figure>

        <!--关注列表中关注的人-->
        <article class="al-doctorRecommendMsg" v-if="item.followType==1">
            <!--关注的人begin，需添加type类型的v-if判断v-if="item.customer_auth.followType==1"-->
            <a class="al-doctorRecommendName" v-bind:class="{'ev-noAllinDoctor':item.cid==0}" :href="getHref(item.cid)">{{item.userName|getName}}<i class="al-vipUser" v-if="item.vipIcon"></i></a>
            <span class="al-doctorRecommendJob" v-if="item.cid && item.cid!=0 && item.medicalTitle">{{item.medicalTitle}}</span>
            <span class="al-doctorRecommendHospital" v-if="item.cid && item.cid!=0 && item.medicalTitle">{{item.company|strLen(20)}}</span>
            <span class="al-doctorRecommendJob" v-if="item.cid && item.cid!=0 && item.medicalTitle==''">{{item.company|strLen(20)}}</span>
            <!--关注的人end-->
            <Follow :followConfig={refId:item.cid,followState:item.relationship}></Follow>
        </article>

        <!--关注列表中关注的组织-->
        <article class="al-doctorRecommendMsg" v-if="item.followType==2">
            <!--关注的组织begin v-if="item.customer_auth.followType==2"-->
            <a class="al-doctorRecommendName" v-bind:class="{'ev-noAllinDoctor':item.cid==0,'al-organizationName':item.fullName}" :href="getHref(item.OrgId,1)">{{item.fullName|strLen(26)}}</a>
            <span class="al-doctorRecommendJob" v-if="item.orgCompany">{{item.orgCompany|strLen(26)}}</span>
            <!--关注的组织end-->
            <Follow :followConfig={refId:item.cid,followState:item.relationship}></Follow>
        </article>

        <!--粉丝列表中人-->
        <article class="al-doctorRecommendMsg" v-if="!item.followType">
            <a class="al-doctorRecommendName" v-bind:class="{'ev-noAllinDoctor':item.cid==0}" :href="getHref(item.cid)">{{item.userName|getName}}<i class="al-vipUser" v-if="item.vipIcon"></i></a>
            <span class="al-doctorRecommendJob" v-if="item.cid && item.cid!=0 && item.medicalTitle">{{item.medicalTitle}}</span>
            <span class="al-doctorRecommendHospital" v-if="item.cid && item.cid!=0 && item.medicalTitle">{{item.company|strLen(20)}}</span>
            <span class="al-doctorRecommendJob" v-if="item.cid && item.cid!=0 && item.medicalTitle==''">{{item.company|strLen(20)}}</span>
            <Follow :followConfig={refId:item.cid,followState:item.relationship}></Follow>
        </article>
    </section>
</template>
<script>
    import Vue from "vue";
    import comm from "static/js/comm.js";
    import Follow from 'components/Follow/Follow';
    export default {
        props:['item'],
        methods:{
            getHref(cid,type){
                if(type&&type==1){//传入1表示是组织跳转
                    return (cid&&cid!=0)?'/dist/organization/organization.html?orgId='+cid+'#/':'javascript:;';
                }else{
                    return (cid&&cid!=0)?'/dist/personal/others_index.html?cid='+cid+'#/contribution':'javascript:;';
                }
            }
        },
        components:{
            Follow
        },
        filters:{
          getName(name){
            return name?comm.getStrLen(name,22):"";
          }
        }
    }
    Vue.filter('strLen',function(str,len){
        if(str){
            return comm.getStrLen(str.toString().trim().replace(/\s/g,""),len);
        }
    });
</script>