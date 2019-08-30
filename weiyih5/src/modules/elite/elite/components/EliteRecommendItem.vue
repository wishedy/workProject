<template>
    <section class="al-elite-recommendItem" v-if="!isEmptyObject(config)"   @click.stop="openPersonal({
        cid:config.customerId
        })" @mousedown.stop="trackAction">
            <figure class="al-elite-doctorLogo" :style="{background: 'url('+checkLogo(config.logoUrl)+') no-repeat center center',backgroundSize:'cover'}"></figure>
            <article class="al-elite-doctorInfo" :class="{'top':config.isTop===1}">
                <div class="doctorNameInfo">
                   <span class="doctorName" v-text="config.organizationMemberName"></span>
                   <span class="doctorPosition" :class="'doctorPosition'+config.organizationTitleName.length" v-text="config.branchName+config.organizationTitleName" v-if="(config.isTop==0)&&(config.organizationMemberName!=='王岩')"></span>
                    <span class="doctorPosition doctorPositionChairMan"  v-text="config.branchName+config.organizationTitleName" v-if="(config.isTop==1)"></span>
                    <!--<span class="doctorPosition doctorPositionChairMan" v-text="config.organizationTitleName" v-if="config.organizationMemberName=='王岩'"></span>-->
                </div>
                <div class="doctorCompanyInfo">
                    <span class="doctorMedicalTitle" v-text="config.organizationMemberMedicalTitleShow"></span>
                    <span class="doctorHospital" v-text="config.organizationMemberCompany"></span>
                </div>
            </article>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    import comm from 'static/js/comm.js';
    export default {
        props:{
            config:{
                default(){
                    return{}
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            checkLogo(logoUrl){
                let _this = this;
                return _this.checkInvalid(logoUrl)?'//img00.allinmd.cn/default-user/new_default.jpg':logoUrl;
            },
            formatStartTime(str){
                let timeOriginal = str.split(' ');
                let date = timeOriginal[0].split("-");
                return date[1]+"/"+date[2];
            },
            openPersonal(config){
                console.log(config.cid);
                EliteSdk.openPersonal({
                    cid:config.cid
                });
            },
            checkInvalid(str){
                return comm.checkInvalid(str);
            },
            trackAction(){
                let _this = this;
                let config = {
                    browseName:'菁英会主页',
                    actionName:'菁英会专家推荐-单个专家',
                    keyWord:'菁英会',
                    actionId:'11669',
                    refId:_this.config.customerId
                };
                console.log(JSON.stringify(config));
                EliteSdk.trackAction(config);
            },
            checkLen(str){
                return comm.getByteLen(str);
            }
        },
        mounted(){
        }
    }
</script>