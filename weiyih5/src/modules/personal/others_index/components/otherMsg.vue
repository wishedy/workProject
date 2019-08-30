<template>
    <!--页面所有内容-->
    <section class="infoContanier">
        <section class="baseInfoCon al-tableModule">
            <h2 class="inforHead">基本信息</h2>
            <aside class="baseModuleItem">
                <h3 class="tableTitle">出生日期</h3>
                <p class="tabbleDesc">{{baseInfoData.birthYear?birthYear(baseInfoData.birthYear):'暂无'}}</p>
            </aside>
            <aside class="baseModuleItem">
                <h3 class="tableTitle">专业</h3>
                <p class="tabbleDesc">{{baseInfoData.platformId?(baseInfoData.platformId==1?'骨科':'手外科'):'暂无'}}</p>
            </aside>
            <aside class="baseModuleItem">
                <h3 class="tableTitle">专科</h3>
                <p class="tabbleDesc">{{baseInfoData.areasExpertiseShow?baseInfoData.areasExpertiseShow:'暂无'}}</p>
            </aside>
            <aside class="baseModuleItem">
                <h3 class="tableTitle">临床时间</h3>
                <p class="tabbleDesc" v-if="baseInfoData.clinicalYear"><span class="clinicalYear">{{baseInfoData.clinicalYear}}</span><span>至今</span></p>
                <p class="tabbleDesc" v-if="!baseInfoData.clinicalYear">暂无</p>
            </aside>
            <aside class="baseModuleItem">
                <h3 class="tableTitle">科室</h3>
                <p class="tabbleDesc">{{baseInfoData.department?baseInfoData.department:'暂无'}}</p>
            </aside>
        </section>
        <!--独立完成骨科病例数-->
        <section class="clinicInfoCon al-tableModule" v-if="(baseInfoData.precedingyearOperationNum+baseInfoData.yesteryearOperationNum).length||baseInfoData.expertise">
            <h2 class="inforHead">临床信息</h2>
            <aside class="baseModuleItem" v-if="(baseInfoData.precedingyearOperationNum+baseInfoData.yesteryearOperationNum).length">
                <h3 class="tableTitle">独立手术数</h3>
                <p class="tabbleDesc">{{baseInfoData.precedingyearOperationNum+baseInfoData.yesteryearOperationNum}}</p>
            </aside>
            <aside class="baseModuleItem" v-if="baseInfoData.expertise">
                <h3 class="tableTitle">擅长领域</h3>
                <p class="tabbleDesc">{{baseInfoData.expertise}}</p>
            </aside>
        </section>
        <!--个人信息-->
        <section class="personInfo al-tableModule" v-if="baseInfoData.summary">
            <h2 class="inforHead">个人信息</h2>
            <aside class="baseModuleItem" v-if="baseInfoData.summary">
                <p class="tabbleDesc summary">{{summaryMore?baseInfoData.summary:getStrByteLen(baseInfoData.summary,300)}}</p>
                <p class="moreSummary" v-if="getByteLen(baseInfoData.summary)>300" @click="moreSummary" :class="{'upmoreSum':summaryMore}"></p>
            </aside>
        </section>
        <!--工作-->
        <section class="al-tableModule" data-alcode-mod="541" data-alcode-item-selector="article" v-if="rowsData.length">
            <h2 class="inforHead">工作经历</h2>
            <section class="ev-occList">
                <article class="al-tableModuleContent" v-for="(item,index) in rowsData">
                    <div class="contentCon">
                        <p>{{htmlToString(item.unit)}}</p>
                        <p> {{medicalTitle(item.medicalTitle)}}</p>
                        <span class="al-timeRange">{{timeStr(item.startTime,item.endTime,item.upNow)}}</span>
                    </div>
                </article>
            </section>
        </section>
        <!--社会任职-->
        <section class="al-tableModule" data-alcode-mod="548" data-alcode-item-selector="article" v-if="socialData.length">
            <h2 class="inforHead">社会任职</h2>
            <section class="ev-socialList">
                <article class="al-tableModuleContent" v-for="(item,index) in socialData">
                    <div class="contentCon">
                        <p>{{item.organization}}</p>
                        <p>{{item.socialTitle}}</p>
                        <span class="al-timeRange">{{timeStr(item.startTime,item.endTime,item.upNow)}}</span>
                    </div>
                </article>
            </section>
        </section>
        <!--学历-->
        <section class="al-tableModule" data-alcode-mod="544" data-alcode-item-selector="article" v-if="educationData.length">
            <h2 class="inforHead">学历教育</h2>
            <section class="ev-eduList">
                <article class="al-tableModuleContent" v-for="(item,index) in educationData">
                    <div class="contentCon">
                        <p>{{(item.city ? htmlToString(item.city) + ' ' : '') + htmlToString(item.university)}}</p>
                        <p>{{(item.major ? htmlToString(item.major) + ' ' : '') + item.education}}</p>
                        <span class="al-timeRange">{{timeStr(item.startTime,item.endTime,item.upNow)}}</span>
                    </div>
                </article>
            </section>
        </section>
        <!--培训-->
        <section class="al-tableModule" data-alcode-mod="545" data-alcode-item-selector="article" v-if="ceducationData.length">
            <h2 class="inforHead">非学历经历</h2>
            <section class="ev-cEduList">
                <article class="al-tableModuleContent" v-for="(item,index) in ceducationData">
                    <div class="contentCon">
                        <p> {{htmlToString(item.organization)}}</p>
                        <p>{{htmlToString(item.cmeDesc)}}</p>
                        <span class="al-timeRange">{{timeStr(item.startTime,item.endTime,item.upNow)}}</span>
                        <p>{{htmlToString(item.certificate)}}</p>
                    </div>
                </article>
            </section>
        </section>
        <!--荣誉-->
        <section class="al-tableModule" data-alcode-mod="546" data-alcode-item-selector="article" v-if="honorData.length">
            <h2 class="inforHead">获得荣誉</h2>
            <section class="ev-honorList">
                <article class="al-tableModuleContent" v-for="(item,index) in honorData">
                    <div class="contentCon">
                        <p>{{htmlToString(item.honorName)}}</p>
                        <p>{{htmlToString(item.awardDepartment)}} </p>
                        <span class="al-timeRange">{{item.awardYear}}</span>
                    </div>
                </article>
            </section>
        </section>
        <!--科研-->
        <section class="al-tableModule" data-alcode-mod="547" data-alcode-item-selector="article" v-if="fundData.length">
            <h2 class="inforHead">科研基金</h2>
            <section class="ev-fundList">
                <article class="al-tableModuleContent" v-for="(item,index) in fundData">
                    <div class="contentCon">
                        <p>{{htmlToString(item.fundName)}}</p>
                        <p>{{htmlToString(item.fundCode)}}</p>
                        <span class="al-timeRange" v-if="item.approvalTime">{{ item.approvalTime.substring(0, 4)}}</span>
                    </div>
                </article>
            </section>
        </section>
        <!--学术-->
        <section class="al-tableModule" data-alcode-mod="549" data-alcode-item-selector="article" v-if="opusData.length">
            <h2 class="inforHead">学术专著</h2>
            <section class="ev-opusList">
                <article class="al-tableModuleContent" v-for="(item,index) in opusData">
                    <div class="contentCon">
                        <p>{{htmlToString(item.opusName)}}</p>
                        <p>{{authorName(item.authorType)}}</p>
                        <p>{{htmlToString(item.publisher)}}</p>
                        <span class="al-timeRange" v-if="item.publicationTime">{{item.publicationTime.substring(0, 4) + "/" + item.publicationTime.substring(5, 7)}}</span>
                        <p> {{htmlToString(item.information)}}</p>
                    </div>
                </article>
            </section>
        </section>
        <!--专利-->
        <section class="al-tableModule" data-alcode-mod="550" data-alcode-item-selector="article" v-if="patentData.length">
            <h2 class="inforHead">发明专利</h2>
            <section class="ev-patentList">
                <article class="al-tableModuleContent" v-for="(item,index) in patentData">
                    <div class="contentCon">
                        <p>{{htmlToString(item.patentName)}}</p>
                        <p>{{htmlToString(item.patentCode)}}</p>
                        <span class="al-timeRange" v-if="item.patentTime">{{item.patentTime.substring(0, 4) + "/" + item.patentTime.substring(5, 7)}}</span>
                        <p>{{item.country}}</p>
                    </div>
                </article>
            </section>
        </section>
    </section>
</template>

<script>
    import comm from "static/js/comm";
    import {mapActions,mapGetters} from "vuex";
    const  msgPath={
                getInfo:'/mcall/customer/auth/getCustomerBaseinfo/',//获取个人信息·
                occList: "/mcall/customer/occupation/json_list/", //工作经历·
                eduList:  "/mcall/customer/education/json_list/", //教育背景·
                cEduList: "/mcall/customer/continue/education/json_list/", //继续教育·
                honorList: "/mcall/customer/honor/json_list/", //获得荣誉·
                fundList:  "/mcall/customer/fund/json_list/", //科研基金·
                socialList: "/mcall/customer/social/json_list/", //社会任职·
                opusList: "/mcall/customer/opus/json_list/", //学术专著·
                patentList:  "/mcall/customer/patent/json_list/",  //发明专利·
            };
    export default {
        data(){
            return{
                customerId:this.$store.state.otherId,
                baseInfoData:{},
                rowsData:[],
                socialData:[],
                educationData:[],
                ceducationData:[],
                honorData:[],
                fundData:[],
                opusData:[],
                patentData:[],
                summaryMore:false
            }
        },
        methods:{
            ...mapActions(["changeIsAjax"]),
            getByteLen(str){
                if(str){
                    return comm.getByteLen(str)
                }

            },
            getStrByteLen(str,len){
                if(str){
                    return comm.getStrByteLen(str,len)
                }

            },
            moreSummary(){
                // t.summary=getStrByteLen(t.baseInfoData.summary,320);
                let t=this;
                t.summaryMore=!t.summaryMore;

            },
            authorName(type){
                let  author = "";
                switch (type) {
                    case 1:
                        author = "第一作者";
                        break;
                    case 2:
                        author = "第一译者";
                        break;
                    case 3:
                        author = "联合作者";
                        break;
                    case 4:
                        author = "联合译者";
                        break;
                }
                return author;
            },
            timeStr(startTime,endTime,upNow){
                if(((upNow&&upNow==1)&&startTime)||(startTime&&endTime)){
                    let time='',
                        sYear = startTime.substring(0, 4),
                        sMonth = startTime.substring(5, 7),
                        sDay = startTime.substring(8, 10);
                    if (upNow == 1) {
                        time = sYear + '/' + sMonth + '-至今';
                    } else {
                        let  eYear = endTime.substring(0, 4),
                            eMonth = endTime.substring(5, 7),
                            eDay = endTime.substring(8, 10);
                        time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                    }
                    return time;
                }

            },
            medicalTitle(str){
                if(str){
                    let medicalTitle = "",
                        title = str.indexOf(",") > 0 ? str.split(",") : [str];
                    $.each(title, function(j, n) {
                        if (n) {
                            if(n.indexOf("_")!=-1){
                                medicalTitle += (n.split("_")[1] + "、");
                            }else {
                                medicalTitle += (n + "、");
                            }

                        }
                    });
                    return medicalTitle.substring(0, medicalTitle.length - 1)
                }
            },
            htmlToString(str){
              return comm.htmlToString(str) ;
            },
            //生日处理
            birthYear(data){
                if(data&&data.indexOf(' ')!=-1){
                    return data.split(' ')[0]
                }
            },
            //获取基本信息
            getBaseInfo(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.getInfo,
                    type:'GET',
                    data:{paramJson:JSON.stringify({customerId:t.customerId})},
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.baseInfoData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //获取工作经历
            getOccupation(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.occList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.rowsData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //社会任职列表
            getSocial(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.socialList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.socialData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //教育背景列表
            getEducation(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.eduList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.educationData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //非学历教育列表
            getcEdu(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.cEduList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.ceducationData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //获得荣誉列表
            getHonor(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.honorList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.honorData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //科研基金列表
            getFund(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.fundList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.fundData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //学术专著列表
            getOpus(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.opusList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.opusData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            },
            //发明专利列表
            getPatent(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:msgPath.patentList,
                    type:'POST',
                    data:{
                        customerId:t.customerId,
                        languageFlag:'0',
                        pageIndex:1,
                        pageSize:100
                    },
                    success:function (data) {
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                            t.patentData=data.responseObject.responseData.data_list;
                        }

                    }

                })
            }

        },
        mounted(){
            this.getBaseInfo();
            this.getOccupation();
            this.getSocial();
            this.getEducation();
            this.getcEdu();
            this.getHonor();
            this.getFund();
            this.getOpus();
            this.getPatent();
        }
    }
</script>

<style  lang="scss">

</style>