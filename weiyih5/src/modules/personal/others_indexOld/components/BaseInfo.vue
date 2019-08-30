<template>
    <section class="al-personalContent al-personalIntro" data-role="intro">
        <section class="al-tableModule" v-if="publicData.name">
            <header class="al-personalContentTitle">
                <h2>基本信息</h2>
            </header>
            <article class="al-tableModuleContent">
                <p class="ev-nameSex">{{publicData.name}} {{publicData.sexId==1?'男':'女'}} {{publicData.birthday | birth}}</p>
                <p class="ev-platform" v-if="platformId">{{platformId==1?'骨科':'手外科'}}</p>
                <p class="ev-medicalTitle" v-if="publicData.medical">{{publicData.medical | cutLine}}</p>
                <p class="ev-company" v-if="publicData.company">{{publicData.company}}</p>
                <p class="ev-clinicalTime" v-if="publicData.time">{{publicData.time}}</p>
                <article class="al-basicMsgTag" v-if="publicData.tag">
                    <button v-for="(v,i) in publicData.tag" v-if="publicData.tag!=' '">{{v | cu}}</button>
                </article>
            </article>
        </section>
        <section class="al-tableModule ev-summaryPar" v-if="publicData.summary">
            <header class="al-personalContentTitle">
                <h2>个人简介</h2>
            </header>
            <article class="al-tableModuleContent">
                <span class="al-tableModuleContentText ev-summary">{{desContent}}<b class="al-contentShow" :class="{pickUp:!expansion}" v-show="upOnOff" @click="upDes">{{upStr}}</b></span>
            </article>
        </section>
        <section class="al-tableModule" v-if="workState">
            <header class="al-personalContentTitle">
                <h2>工作经历</h2>
            </header>
            <section class="ev-occList">
                <article class="al-tableModuleContent">
                    <p>{{workData.unit}} {{workData.address}}</p>
                    <p>{{workData.department}}</p>
                    <p>{{workData.medicalTitle | title}}</p>
                    <span class="al-timeRange">{{workData.startTime,workData.endTime,workData.upNow | time}}</span>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="eduState">
            <header class="al-personalContentTitle">
                <h2>教育背景</h2>
            </header>
            <section class="ev-eduList">
                <article class="al-tableModuleContent" v-for="(v,i) in eduData" :key="i">
                    <p>{{v.city?v.city+'':''}}{{v.university}}</p>
                    <p>{{v.major?v.major+'':''}}{{v.education}}</p>
                    <span class="al-timeRange">{{v.startTime,v.endTime,v.upNow | time}}</span>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="ceduState">
            <header class="al-personalContentTitle">
                <h2>继续教育</h2>
            </header>
            <section class="ev-cEduList">
                <article class="al-tableModuleContent" v-for="(v,i) in ceduData" :key="i">
                    <p>{{v.organization}}</p>
                    <p>{{v.cmeDesc}}</p>
                    <span class="al-timeRange">{{v.startTime,v.endTime,v.upNum | time}}</span>
                    <p>{{v.certificate}}</p>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="honorState">
            <header class="al-personalContentTitle">
                <h2>获得荣誉</h2>
            </header>
            <section class="ev-honorList">
                <article class="al-tableModuleContent" v-for="(v,i) in honorData" :key="i">
                    <p>{{v.honorName}}</p>
                    <p>{{v.awardDepartment}}</p>
                    <span class="al-timeRange">{{v.awardYear}}</span>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="fundState">
            <header class="al-personalContentTitle">
                <h2>科研基金</h2>
            </header>
            <section class="ev-fundList">
                <article class="al-tableModuleContent" v-for="(v,i) in fundData" :key="i">
                    <p>{{v.fundName}}</p>
                    <p>{{v.fundCode}}</p>
                    <span class="al-timeRange">{{v.approvalTime.substring(0,4)}}</span>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="socialState">
            <header class="al-personalContentTitle">
                <h2>社会任职</h2>
            </header>
            <section class="ev-socialList">
                <article class="al-tableModuleContent" v-for="(v,i) in socialData" :key="i">
                    <p>{{v.organization}}</p>
                    <p>{{v.socialTitle}}</p>
                    <span class="al-timeRange">{{v.startTime,v.endTime,v.upNum | time}}</span>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="opusState">
            <header class="al-personalContentTitle">
                <h2>学术专著</h2>
            </header>
            <section class="ev-opusList">
                <article class="al-tableModuleContent" v-for="(v,i) in opusData" :key="i">
                    <p>{{v.opusName}}</p>
                    <p>{{v.authorType}}</p>
                    <p>{{v.publisher}}</p>
                    <span class="al-timeRange">{{v.publicationTime | cut}}</span>
                    <p>{{v.information}}</p>
                </article>
            </section>
        </section>
        <section class="al-tableModule" v-if="patentState">
            <header class="al-personalContentTitle">
                <h2>发明专利</h2>
            </header>
            <section class="ev-patentList">
                <article class="al-tableModuleContent" v-for="(v,i) in patentData" :key="i">
                    <p>{{v.patentName}}</p>
                    <p>{{v.patentCode}}</p>
                    <span class="al-timeRange">{{v.patentTime | cut}}</span>
                    <p>{{v.country}}</p>
                </article>
            </section>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    const path = {
        occList: "/mcall/customer/occupation/json_list/",     //工作经历
        eduList: "/mcall/customer/education/json_list/",      //教育背景
        cEduList: "/mcall/customer/continue/education/json_list/",    //继续教育
        honorList: "/mcall/customer/honor/json_list/",        //获得荣誉
        fundList: "/mcall/customer/fund/json_list/",          //科研基金
        socialList: "/mcall/customer/social/json_list/",      //社会任职
        opusList: "/mcall/customer/opus/json_list/",          //学术专著
        patentList:  "/mcall/customer/patent/json_list/"      //发明专利
    };
    export default {
        data(){
            return {
                requestData:{
                    customerId:comm.getpara().cid,
                    languageFlag:0,
                    pageIndex:1,
                    pageSize:100
                },
                publicData:{},
                desContent:"",
                ajaxing:false,
                workData:{},
                workState:false,
                eduData:[],
                eduState:false,
                ceduData:[],
                ceduState:false,
                honorData:[],
                honorState:false,
                fundData:[],
                fundState:false,
                socialData:[],
                socialState:false,
                opusData:[],
                opusState:false,
                patentData:[],
                patentState:false,
                platformId:1,
            }
        },
        computed:{
            upStr(){
                return (this.expansion)?"展开":"收起";
            },
            upOnOff(){
                return comm.getByteLen(this.publicData.summary)>124;
            },
            expansion(){
                return this.desContent!==this.publicData.summary;
            }
        },
        mounted(){
        	if(this.requestData.customerId){
				this.work();
				this.edu();
				this.cedu();
				this.honor();
				this.fund();
				this.social();
				this.opus();
				this.patent();
            }
            this.platformId = this.$store.state.platformType;
            if(this.$store.state.public.summary!==undefined){
                this.changeDes();
            }
        },
        methods:{
            work(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.occList,
                    type: "POST",
                    data:t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.workData = dataList[0];
                                if(dataList.length){
                                    t.workState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            edu(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.eduList,
                    type: "POST",
                    data: t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.eduData = dataList;
                                if(dataList.length){
                                    t.eduState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            cedu(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.cEduList,
                    type: "POST",
                    data: t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.ceduData = dataList;
                                if(dataList.length){
                                    t.ceduState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            honor(){
                let t = this;
                t.ajaxing = true;
                let reData=t.requestData;
                reData.honorType=0;
                comm.ajax2({
                    url: path.honorList,
                    type: "POST",
                    data: reData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.honorData = dataList;
                                if(dataList.length){
                                    t.honorState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            fund(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.fundList,
                    type: "POST",
                    data: t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.fundData = dataList;
                                if(dataList.length){
                                    t.fundState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            social(){
                let t = this;
                t.ajaxing = true;
                let reData=t.requestData;
                reData.socialType=0;
                comm.ajax2({
                    url: path.socialList,
                    type: "POST",
                    data:reData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.socialData = dataList;
                                if(dataList.length){
                                    t.socialState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            opus(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.opusList,
                    type: "POST",
                    data: t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.opusData = dataList;
                                if(dataList.length){
                                    t.opusState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            patent(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: path.patentList,
                    type: "POST",
                    data: t.requestData,
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData.data_list;
                                t.patentData = dataList;
                                if(dataList.length){
                                    t.patentState = true;
                                }
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            upDes(){
              let t = this;
              if(t.expansion){
                  this.desContent = this.publicData.summary;
              }else{
                  t.changeDes();
              }
            },
            changeDes(){
                this.publicData = this.$store.state.public;
                let desStr = this.publicData.summary;
                if(comm.getByteLen(desStr)>124){
                    this.desContent =  comm.getStrLen(desStr,124);
                }else{
                    this.desContent =  desStr
                }
            }
        },
        components:{
            Loading
        },
        filters:{
            title:v=>{
                let medical = '';
                let str = v.indexOf(",")>0 ? v.split(",") : [v];
                $.each(str,function(j,n){
                    if(n){
                        medical+=(n.split("_")[1]+"、");
                    }
                });
                medical = medical.substring(0,medical.length-1);
                return medical;
            },
            time:(s,e,upNow)=>{
                let time = '';
                let sYear = s.substring(0,4);
                let sMonth = s.substring(5,7);
                let sDay = s.substring(8,10);
                if(upNow==1){
                    time = sYear+'/'+sMonth+'-至今';
                }else{
                    let eYear = e.substring(0,4);
                    let eMonth = e.substring(5,7);
                    let eDay = e.substring(8,10);
                    time = sYear+'/'+sMonth+'-'+eYear+'/'+eMonth;
                }
                return time;
            },
            cut:v=>{
                return v.substring(0,4)+"/"+v.substring(5,7)
            },
            birth:v=>{
                if(v){
                    return  v.substring(0,4)+"-"+v.substring(5,7)+"-"+v.substring(8,10);
                }
            },
            cutLine:v=>comm.cutLine(v, "_", "，"),
            cu:v=>{
                if (v) {
                    if (v.split("_")[1]) {
                        return  v.split("_")[1]
                    }
                }
            },
        },
        watch:{
            "$store.state.public"(){
                this.changeDes();
            },

        }
    };
</script>