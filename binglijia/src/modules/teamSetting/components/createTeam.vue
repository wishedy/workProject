<template>

    <section class="alEmr-mainIndex">

        <aside class="teamSetting width450">
            <div class="title">
                <p>1.创建团队</p>
                <p :class="{notActive:titleOnOFF}">2.邀请成员</p>
            </div>
            <!--跳过-->
            <div class="skipBtn" v-show="!titleOnOFF&&jumpSecond" @click="skipBtn">跳过</div>
            <!--创建-->
            <div class="teamSetInput" :class="{'error':errorTextOnOff,'focus':patientNameFocus}" v-show="titleOnOFF">
                <input type="text" placeholder="请为团队起一个名字" v-model.trim="establishText" @focus.stop="patientNameFocus=true" @blur.stop="patientNameFocus=false"/>
                <div class="formError" v-show="errorTextOnOff">{{errorText}}</div>
            </div>

            <!--邀请成员-->
            <div class="teamSetInput teamNameInput" :class="{'error':errorTextOnOff,'focus':patientNameFocus}" v-show="!titleOnOFF" ref="elememt" @click="patientNameOnfocus">
                <div class="memberOverflow">
                    <span v-for="(val,i) in memberList" class="searchListLi"><b>{{val.name}}</b><i @click="findMemberCloseCli({index:i,cid:val.cid})"></i></span>
                    <input ref="inFocus" type="text" :placeholder="pHolder?'请添加团队成员':''" v-model.trim="addMember" @focus.stop="patientNameFocus=true" @blur.stop="patientNameFocus=false"/>
                    <div class="formError" v-show="errorTextOnOff">{{errorText}}</div>
                    <div class="notFound" v-show="checkNoneOnOff" ref="associationNone">没有找到“{{searchNoData}}”</div>
                    <ul class="searchUserList" v-show="checkOnOff" ref="association">
                        <li v-for="(user,i) in searchUserList" @click="findMemberCli({name:user.customer_auth.lastName+user.customer_auth.firstName,cid:user.customer_auth.customerId})">
                            <div class="">
                                <p class="userImg"><img :src="user.customer_att.logoUrl|getLogoUrl"/> </p>
                                <p class="userName">{{user.customer_auth.lastName+user.customer_auth.firstName,5|dateNameChange}}</p>
                                <p class="userTitle">{{user.customer_auth.medicalTitleShow,4|dateNameChange}}</p>
                                <p class="userHospital">{{user.customer_auth.company?user.customer_auth.company:user.customer_auth.schoolName,14|dateNameChange}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="establishBtn" @click="establishBtn">{{titleOnOFF?'创建':'发送邀请'}}</div>
            <teamDescription v-show="titleOnOFF"></teamDescription>
            <recommend v-show="!titleOnOFF" @PeopleList="PeopleList"  :nameDel="nameDelItem"></recommend>
            <toastTip v-show="showToast" :text="toastText"></toastTip>
        </aside>
    </section>
</template>
<script>
const $ = require('jquery');
import comm from '../../../utils/comm.js';
import recommend from './recommend.vue';
import teamDescription from './teamDescription.vue';
import toastTip from '~components/toastTip/toastTip.vue';
import {mapActions,mapGetters} from 'vuex';
export default {
    name: 'index-app',
    props:[''],
    data() {
        return {
            customerId: comm.cookie.get("userId"),
            establishText:'',//创建团队名称默认值
            errorText:'',//报错的文案
            addMember:'',//邀请成员默认值
            checkOnOff:false,
            checkNoneOnOff:false,//联想无数据开关
            patientNameError:false,//报错框
            patientNameFocus:false,//获取焦点
            memberList:[],//
            peopleList:[],
            IdList:[],
            searchUserList:[],
            borderHeight:'74',
            responsePk:'',
            customerIdAry:[],//cid数组
            nameDelItem:'',
            searchNoData:'',//联想无数据
            timer:'',
            cliOnOff:true,//阻止多次点击
            jumpSecond:true,//第二次邀请成员不显示跳过
            errorTextOnOff:false,//报错信息是否显示
            ajaxing:false,//表示正在请求
            isNOne:false,//表示已经没有数据
            showToast:false,//toast提示
            toastText:"网络错误，请检查您的网络设置",
            pHolder:true,//placeholder占位标识显示
        }
    },
    components: {
        recommend,
        teamDescription,
        toastTip
    },
    computed:{
        onOff(){
            return (this.establishText.length===0&&this.checkOnOff)
        },
        ...mapGetters(['teamId','titleOnOFF','showLoading','cliInputNone']),


    },
    watch:{
        memberList(){
            let t=this;
            if(t.memberList.length>0){
                $(t.$refs.inFocus).focus();
                t.patientNameFocus=true;
                t.pHolder=false;
            }else{
                $(t.$refs.inFocus).blur();
                t.patientNameFocus=false;
                t.pHolder=true;
            }
        },
        patientNameFocus(){
        },
        establishText(newVal,oldVal){
            let t =this;
            t.errorTextOnOff = false;
            if(t.establishText.length>25){
                t.establishText=t.establishText.substr(0,25);
            }
        },
        addMember(){
            // clearTimeout(timer);
            let t=this;
            $(t.$refs.association).scrollTop(0);
            if(t.addMember==''){
                t.checkNoneOnOff = false;
                t.checkOnOff=false;
                t.changeLoading(false)
            }else {
                t.checkOnOff=false;
                t.changeLoading(true)
                clearTimeout(t.timer);
                t.timer = setTimeout(function () {
                    if(t.addMember.length>0){
                        let data = {
                            pageIndex: 1,
                            pageSize: 10,
                            sortType: 1,
                            searchParam: t.addMember,
                            attUseFlag: 3,
                            logoUseFlag: 3,
                            opUsr: t.customerId,
                            dataFlag: 2,
                            platformId:1,
                            isValid: 1,
                            searchType:1
                        };
                        //真实搜索用户
                        comm.ajax2({
                            url: '/call/search/searchUser/',
                            type: "post",
                            data: data,
                            success:function(res){
                                if (res&&res.responseObject) {
                                    t.changeLoading(false)
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    t.searchUserList=res.responseObject.responseData.data_list;
                                    t.checkNoneOnOff = false;
                                    t.checkOnOff=true;
                                }else {
                                    t.checkNoneOnOff = true;
                                    t.searchNoData = t.addMember;
                                }
                                }
                            }
                        })
                    }
                },1000)}

        },
        titleOnOFF(newVal){
            let t = this;
            if(!newVal){
                $(t.$refs.association).css('top',$(t.$refs.elememt).outerHeight());
            }
        },
        /*点击推荐清空输入框*/
        cliInputNone(){
            let t = this;
            if (t.cliInputNone == true){
                t.addMember='';
                t.ChangeCliInputNone(false);
        }
    }
    },
    updated(){
        let t = this;
        $(t.$refs.association).css('top',$(t.$refs.elememt).outerHeight());//获取联想列表宽给下拉的top -有数据
        $(t.$refs.associationNone).css('top',$(t.$refs.elememt).outerHeight());//获取联想列表宽给下拉的top -无数据
    },
    methods:{
        ...mapActions(['changeTeamId','changeTitleOnOFF','changeLoading','ChangeCliInputNone']),
        formInputCheck(){
            this.onOff=true
        },
        patientNameOnfocus(){
            this.patientNameFocus=true;
            this.$refs.inFocus.focus();
        },
        establishBtn () {//点击创建
            let t = this;
            if(t.titleOnOFF){
                if(!t.cliOnOff){
                    return false;
                }
                t.cliOnOff = true;
                if(t.establishText.length<=0){
                    // t.checkOnOff=true;
                    if(!t.errorTextOnOff){
                        t.errorTextOnOff = true;
                        t.errorText='请添加团队名称';
                        setTimeout(function () {
                            t.errorTextOnOff=false;
                        },3000);
                    }
                }else {
                    t.changeLoading(true)
                    comm.ajax2({
                        url: '/call/caseFolder/team_baseinfo/create/',
                        type: "post",
                        data: {
                            paramJson:JSON.stringify({"teamName":t.establishText,"customerId":t.customerId,"visitSiteId":1})
                        },
                        success:function(res){
                            t.changeLoading(false);
                            if (res&&res.responseObject) {
                                // t.listItem = res.responseObject.responseData.data_list[0];
                                t.changeTeamId(res.responseObject.responsePk)
                                if (res.responseObject.responseStatus) {
                                    t.cliOnOff = true;
                                    t.checkOnOff = false;
                                    t.changeTitleOnOFF(false);
                                    t.btnText = '发送邀请';
                                }
                            }
                        },
                        fail:()=>{
                            t.changeLoading(false);
                            t.showToast = true;
                            setTimeout(()=>{
                                t.showToast = false;
                            },3000)
                        }
                    });
                }
            }else {
                if(!t.cliOnOff){
                    return false;
                }
                t.cliOnOff = true;
                if(t.memberList.length<=0){
                    if(!t.errorTextOnOff){
                        t.errorTextOnOff=true;
                        t.errorText='请至少添加一位团队成员';
                        setTimeout(function () {
                            t.errorTextOnOff=false;
                        },3000);
                    }
                }else {
                    t.addMember='';
                    t.checkNoneOnOff = false;
                    t.changeLoading(true)
                    let cidList='',memberTeamId = '';
                    if(this.$route.query.teamId){
                        memberTeamId = localStorage.getItem('teamId');
                    }else {
                        memberTeamId = t.teamId;
                    }
                    for (let i=0;i<t.memberList.length;i++){
                        cidList = cidList+t.memberList[i].cid+',';
                    };

                    comm.ajax2({
                        url: '/call/caseFolder/team_member/createMember/',
                        type: "post",
                        data: {
                            paramJson:JSON.stringify({createType:2,customerIdList:cidList.substring(0,cidList.length-1),teamId:memberTeamId})
                        },
                        success:function(res){
                            if (res&&res.responseObject) {
                                localStorage.removeItem('teamId')
                                if (res.responseObject.responseStatus == true) {
                                    t.cliOnOff = true;
                                    t.changeLoading(false);
                                    t.$router.push({
                                        path: 'teamSetting',//跳转链接
                                    })
                                }
                            }

                        }
                    })
                }
            }


        },
        skipBtn() {//跳过点击
            let t = this;
            t.$router.push({
                path: 'teamSetting',//跳转链接
            })
        },
        findMemberCli(obj){//联想搜索添加成员
            let t = this;
            if(obj.cid==t.customerId){
                t.errorTextOnOff = true;
                t.checkOnOff = false;
                t.addMember='';
                t.errorText='您已加入团队了';
                setTimeout(function () {
                    t.errorTextOnOff = false;
                },3000)
                return false;
            }
            for(let i=0;i<t.memberList.length;i++){
                if(t.memberList[i].cid==obj.cid){
                    t.errorTextOnOff = true;
                    t.checkOnOff = false;
                    t.addMember='';
                    t.errorText='该成员已被选中，无法再次添加';
                    setTimeout(function () {
                        t.errorTextOnOff = false;
                    },3000)
                    return false;
                }
            }
            t.memberList.push({name:obj.name,cid:obj.cid});
            t.nameDelItem={cid:obj.cid,flag:true};
            t.addMember='';
            t.checkOnOff=false;
            t.changeLoading(false)
        },
        findMemberCloseCli(obj){//删除成员
            let t = this;
            for(let i=0;i<t.memberList.length;i++){
                if(t.memberList[i].cid==obj.cid){
                    t.memberList.splice(i, 1)
                }
            }
            t.nameDelItem={cid:obj.cid,flag:false};
        },
        PeopleList(data){
            if(data.add){
                this.memberList.push(data)
            }else {
                for(let i=0;i<this.memberList.length;i++){
                    if(this.memberList[i].cid==data.cid){
                        this.memberList.splice(i, 1)
                    }
                }
            }
        },
    },
    async mounted() {
        let t=  this;
        if(this.$route.query.teamId){
            t.changeTitleOnOFF(false);
            t.jumpSecond = false;

        }else {
            t.changeTitleOnOFF(true);
        }
        if(t.titleOnOFF){
            t.btnText='创建';
        }else {
            t.btnText='发送邀请';
        }



        document.addEventListener("click",()=>{

            t.checkOnOff=false;//点击空白或者其他区域关闭自定义时间弹层
            t.checkNoneOnOff = false;
            t.addMember='';
        });


    },
    filters:{
        dateTypeChange:function (date) {
            if(date){
                let newDate = date.split(",");
                newDate=newDate[0].split('_');
                return newDate[2];
            }
        },
        dateNameChange:function (txt,num) {
            return comm.getStrLen(txt,num*2);
        },
        getLogoUrl(url){
            return url.replace("http:","").replace("https:","");
        }
    },
    metaInfo: {
        title: '团队设置'
    },
}
</script>
<style lang="scss">

</style>

