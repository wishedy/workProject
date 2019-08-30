<template>
    <section class="alEmr-mainIndex">
        <applicationReminding :teamId="appTeamId" v-show="ownerState"></applicationReminding>
        <aside class="teamSetting width1000" @click="teamNameOnOff=false">
            <div class="teamName">
                <div class="nameSelect" :class="{'error':changeNameError,'focus':patientNameFocus}">
                    <input type="text" v-model="selected" :readonly="!ownerState" v-on:blur="selectedBlur" @focus.stop="patientNameFocus=true" @blur.stop="patientNameFocus=false"/>
                    <p @click.stop="changeTeam" v-show="groupName.length>1">切换<i class="tabBtn"></i><i v-if="tabRedPoint>0" class="redPoint"></i></p>
                    <ul class="teamList" v-show="teamNameOnOff">
                        <li v-for="(item,index) in groupName" @click.stop="teamNameCli(item,index,item.teamId)">{{item.teamName}}
                            <i v-if="item.customerId==customerId&&item.memberTotalNum>0"></i></li>
                    </ul>
                    <div class="changeNameError" v-show="changeNameError">团队名称不能为空</div>
                </div>

                <div class="notApply" v-show="ownerState">
                    <div>不接受加入申请<p :class="{activation:isApply==0}" @click.stop="ifApply()"><i></i></p></div>
                    <span>开启后将不再接受加入申请</span>
                </div>
                <div class="createTeamBtn" @click="createCases" v-if="!assistantDoctor"><i></i><span>新建团队</span></div>
            </div>
            <div class="teamUserList">
                <div class="userTitleCont"><p>{{ownerTransform?'转让所有权':'团队成员'}}</p>
                    <p v-show="ownerState"><span @click="invite()">邀请成员</span><span
                        @click="ownerTransformCli">{{ownerTransform?'取消转让':'转让所有权'}}</span>
                    </p></div>
                <div class="memberNone" v-show="memberNone">
                    <img src="/static/images/pages/teamsetting/memberNone.png" />
                    <p>暂无成员</p>
                </div>
                <ul>
                    <!--<li v-for="(item,index) in userName">-->
                    <li v-for="(item,index) in getCustomerId" v-show="(item.teamRole==3)?((teamRole||item.teamRole != 2)&&(!ownerTransform)):(teamRole||item.teamRole != 2)">
                        <p class="userImg"><img :src="item.url|getLogoUrl"/>
                        </p>
                        <p class="userName">{{item.authorName}}</p>
                        <p class="userTitle">{{item.medicalTitle}}</p>
                        <p class="userHospital">{{item.company}}</p>
                        <div class="teamMember" :class="{'owner':item.teamRole == 0,'transfer':(item.teamRole == 1||item.teamRole == 0)}" @click.stop="(item.teamRole == 1||item.teamRole == 0)?stateChange(item,index):''"><span>{{(item.teamRole == 1||item.teamRole == 0)?(ownerTransform?'转让':'成员'):((item.teamRole==2)?'所有者':'医助')}}</span>
                            <div class='close' :class="{'inTransfer':ownerTransform}"
                                 v-if="(item.teamRole==3||item.teamRole == 1||item.teamRole == 0)&&ownerState" @click.stop="(item.teamRole == 1||item.teamRole == 0||item.teamRole == 3)?deletePopup(item,index):''">
                            </div>
                            <div class="deletePopup" v-show="item.choose&&tagShowFlag">
                                <p>
                                    {{!ownerTransform?'确定要将'+item.authorName+'从团队中移除吗？':'确定将所有者权限转交给'+item.authorName+'吗？'}}
                                </p>
                                <div v-show="ownerTransform" class="TransferTxt" style="">
                                    转让所有权后，你将失去团队的管理权限。
                                </div>
                                <div class="deleteBtn">
                                    <button @click.stop="!ownerTransform?deleteMemberCli(index):TransferClick(index)">确认</button>
                                    <button @click.stop.prevent="item.choose=!item.choose">取消</button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
        <pagination :pageIndex=pageIndex :pageSize=pageSize :total="Math.ceil(totalNum/pageSize)" @change="pageChange"></pagination>
    </section>
</template>
<script>
    import comm from '../../../utils/comm.js';
    import applicationReminding from './applicationReminding.vue';
    import pagination from "~components/pagination/pagination.vue";
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'index-app',
        data() {
            return {
                //获取当前用户所在团队
                // customerId: 1399252409974,//李春辉
                // customerId: 1512704670732, //彭丽媛姐姐
                customerId: comm.cookie.get("userId"),
                assistantDoctor:parseInt(comm.cookie.get("customerRole"))===13,
                groupName: [],//当前用户所在的小组
                tagShowFlag: false,
                tagShow: false,//弹出标签的控制阀门
                // noAcceptOnOff: false,
                teamNameOnOff: false,
                ownerTransform: false,
                ownerState: false,//判断当前用户在当前团队的身份（所有者/成员）
                selected: '',//初始团队名字
                isApply:1,//允许申请
                getTeamId:'',//初始化是的teamID
                getCustomerId:[],//获取团队成员id
                teamRole:true,//判断角色
                prevTeamId:'',//回显时候对比的teamId
                totalNum:'',//获取出来的分页条数
                memberNone:false, //团队成员是否为空
                teamNameNormal:'',//保存当前团队名
                appTeamId:'',
                pageIndex:0,
                pageSize:10,
                changeNameError:false,//修改团队名称时报错
                patientNameFocus:false,//激活输入框
                tabRedPoint:0,//切换上的小红点

            }
        },
        components: {
            applicationReminding,
            pagination,
        },
        //watch去监控弹窗里面的按钮选项
        watch: {
            "ownerTransform"(n) {
                this.getCustomerId.forEach((element) => {
                    this.$set(element, 'choose', false);
                })
            },
            "selected"() {
                this.getCustomerId.forEach((element) => {
                    this.$set(element, 'choose', false);
                })
            },
            /*点击重新请求审核列表*/
            requestOnOff() {
                let t = this;
                if (t.requestOnOff == true) {
                    t.getTeamName(t.getTeamId,1);
                    t.ChangeRequestOnOff(false);
                }
            },
            //判断未处理消息重新请求
            remindingNum(){
                let t=this;
                if(t.remindingNum==0){
                    t.groupList();
                }
            }
        },
        computed:{
            ...mapGetters(['teamId','requestOnOff','titleOnOFF','remindingNum']),
        },
        methods: {
            ...mapActions(['changeLoading','ChangeRequestOnOff','changeTitleOnOFF','ChangeRemindingNum']),
            pageChange(pageIndex){//切换页数，请求数据
                let t = this;
                t.getTeamName(t.getTeamId,pageIndex);
            },
            //删除（仅leader可见）
            stateChange(item, index) {
                if(this.ownerTransform){
                    this.getCustomerId.forEach((element) => {
                        this.$set(element, 'choose', false);
                    });
                    this.$set(item, 'choose', true);
                    this.tagShowFlag = true
                }
            },
            //失去焦点是保存团队名称
            selectedBlur(){
                let t = this;
                if(t.selected!=t.teamNameNormal){
                    if(t.selected == ''){
                        t.changeNameError = true;
                        setTimeout(function () {
                            t.changeNameError=false;
                            t.selected = t.teamNameNormal;
                        },3000);

                    }else {
                        t.changeLoading(true);
                        comm.ajax2({//开启关闭加入申请按钮
                            url: '/call/caseFolder/team_baseinfo/update/',
                            type: "post",
                            data: {
                                paramJson:JSON.stringify({
                                    teamId:t.getTeamId,
                                    teamName:t.selected,
                                })
                            },
                            success:function(res){
                                if (res&&res.responseObject) {
                                    t.changeLoading(false);
                                    for (let i=0;i<t.groupName.length;i++){
                                        if(t.groupName[i].teamId == t.getTeamId){
                                            t.groupName[i].teamName = t.selected;
                                            t.teamNameNormal = t.groupName[i].teamName;
                                        }
                                    };

                                }
                            }
                        })
                    }

                }
            },
            //删除成员点击
            deletePopup(item, index){
                this.getCustomerId.forEach((element) => {
                    this.$set(element, 'choose', false);
                });
                this.$set(item, 'choose', true);
                this.tagShowFlag = true
            },
            //切换按钮点击
            changeTeam(ev) {
                ev.preventDefault();
                this.teamNameOnOff = !this.teamNameOnOff;

            },
            invite() {
                this.$router.push({
                    path: 'createTeam',//跳转链接
                        query: { //链接后面的参数
                            teamId: this.getTeamId,
                        }
                })
                localStorage.setItem('teamId',this.getTeamId);
                this.changeTitleOnOFF(true);
            },
            createCases() {
                this.$router.push({
                    path: 'createTeam',//跳转链接
                })
            },
            //不接受加入申请
            ifApply() {
                let t=this;
                if(t.isApply==0){
                    t.isApply=1;
                }else {
                    t.isApply=0;
                }
                t.changeLoading(true);
                comm.ajax2({//开启关闭加入申请按钮
                    url: '/call/caseFolder/team_baseinfo/update/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            teamId:t.getTeamId,
                            teamName:t.selected,
                            customerId:t.customerId,
                            visitSiteId:1,
                            isApply:t.isApply,
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject) {
                            t.changeLoading(false);
                            t.tagShowFlag = false;
                            for (let i=0;i<t.groupName.length;i++){
                                let _kv=t.groupName[i];
                                if(t.getTeamId==_kv.teamId){
                                    _kv.isApply=t.isApply;
                                    break;
                                }
                            }
                        }
                    }
                })
            },
            //转让所有权的点击
            ownerTransformCli(){
                let t = this;
                t.ownerTransform=!t.ownerTransform
                t.teamRole=!t.teamRole;
                if(t.ownerTransform){
                    for (let i = 0;i<t.getCustomerId.length;i++){
                        if(t.getCustomerId[i].teamRole != 1){
                            t.memberNone = true;
                        }else {
                            t.memberNone = false;
                            break;
                        }
                    }
                }else {
                    t.memberNone = false;
                }

            },
            //确认移除成员
            deleteMemberCli(index){
                let t = this;
                t.changeLoading(true);
                comm.ajax2({
                    url: '/call/caseFolder/team_member/updateState/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            memberIdList:t.getCustomerId[index].memberId,
                            stateType:'4',
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject) {
                            t.changeLoading(false);
                            t.tagShowFlag = false;
                            t.getTeamName(t.getTeamId,1);
                        }
                    }
                })
            },
            //转让所有权
            TransferClick(index){
                let t = this;
                t.changeLoading(true);
                comm.ajax2({
                    url: '/call/caseFolder/team_member/updateTransfer/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            teamId:t.getCustomerId[index].teamId,
                            transferId:t.getCustomerId[index].customerId,
                            customerId:t.customerId,
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject) {
                            t.changeLoading(false);
                            t.tagShowFlag = false;
                            t.ownerTransform = !t.ownerTransform;
                            t.teamRole = !t.teamRole;
                            t.ownerState = false;
                            t.getTeamName(t.getCustomerId[index].teamId,1);
                        }
                    }
                })
            },
            //团队名切换
            teamNameCli(item,index,teamId) {
                let t=this;
                // t.changeLoading(true);
                t.selected = item.teamName;
                t.teamNameOnOff = false;
                t.pageIndex = 0;
                t.appTeamId=item.teamId;
                t.memberNone = false;
                t.ownerTransform = false;
                t.getCustomerId.teamRole = 2;
                t.teamRole = true;
                t.isApply=item.isApply;
                if(item.teamId != t.getTeamId){
                    t.getTeamBaseInfo(item.teamId);//获取团队基本信息
                    t.getTeamName(item.teamId,1);//获取团队成员
                }
                t.getTeamId = item.teamId;//将全局的teamId进行更改
                t.teamNameNormal = t.selected;//将全局的teamName进行更改
                t.ChangeRemindingNum(item.memberTotalNum);//新申请加入的成员列表
                //请求更新最后一次操作的团队
                comm.ajax2({//团队成员列表
                    url: '/call/caseFolder/team_baseinfo/createTeamMessage/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            teamId: item.teamId,
                            customerId:t.customerId,
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject) {
                            // t.changeLoading(false);
                        }
                    }
                })
            },
            //获取团队成员
            getTeamName(teamId,pageIndex){
                let t = this;
                t.changeLoading(true);
                comm.ajax2({//团队成员列表
                    url: '/call/caseFolder/team_member/getMapListByTeamId/',
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({
                            teamId: teamId,
                            sortType:1,
                            firstResult: (pageIndex?pageIndex-1:t.pageIndex)*t.pageSize,
                            maxResult: t.pageSize,
                            teamSelectType: 1,
                        })
                    },
                    success:function(res){
                        t.changeLoading(false);
                        t.pageIndex = pageIndex?pageIndex:1;
                        if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.getCustomerId = res.responseObject.responseData.data_list;
                            t.totalNum = res.responseObject.responseData.total_num;
                        }else {
                            t.getCustomerId = '';
                            t.totalNum = 0 ;
                        }
                    }
                })
            },
            //获取团队的基本信息
            getTeamBaseInfo(teamId){
                let t = this;
                t.changeLoading(true);
                comm.ajax2({//团队成员列表
                    url: '/call/caseFolder/team_baseinfo/getMapById/',
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({
                            teamId: teamId,
                            firstResult: 0,
                            maxResult: 10,
                            visitSiteId:1,
                            teamSelectType: 3})
                    },
                    success:function(res) {
                        if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.changeLoading(false);
                            let data = res.responseObject.responseData.data_list;
                            if (data && data.length > 0) {
                                if (t.customerId == data[0].customerId) {
                                    t.ownerState = true;
                                } else {
                                    t.ownerState = false;
                                }
                            }

                        }
                    }
                })
            },
            //获取此用户所在组群
            groupList() {
                let t=this;
                //获取上次操作的team，回显
                t.changeLoading(true);
                comm.ajax2({
                    url: '/call/caseFolder/team_baseinfo/getMessageMapByCustomerId/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            customerId:t.customerId,
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject) {
                            t.changeLoading(false);
                            t.prevTeamId = res.responseObject.responsePk;
                        }
                    }
                })
                comm.ajax2({//团队名称列表
                    url: '/call/caseFolder/team_baseinfo/getMapListByCustomerId/',
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({customerId: t.customerId,visitSiteId:1,isValid:1,firstResult:0, maxResult:1,teamSelectType:1})
                    },
                    success:function(res){
                        if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.groupName = res.responseObject.responseData.data_list;
                            let dfIndex=0;
                            for(let i = 0;i<t.groupName.length;i++){
                                if(t.groupName[i].customerId==comm.cookie.get("userId")){
                                    t.tabRedPoint+=t.groupName[i].memberTotalNum;
                                }
                                if(t.groupName[i].teamId == t.prevTeamId){
                                    dfIndex=i;
                                }
                            }
                            t.selected = t.groupName[dfIndex].teamName;
                            t.teamNameNormal = t.selected;
                            t.isApply = t.groupName[dfIndex].isApply;
                            t.getTeamId = t.groupName[dfIndex].teamId;
                            t.appTeamId=t.getTeamId;
                            t.getTeamBaseInfo(t.groupName[dfIndex].teamId);
                            t.getTeamName(t.getTeamId,1);
                            t.ChangeRemindingNum(t.groupName[dfIndex].memberTotalNum);
                            localStorage.removeItem('teamId')
                        }
                    }
                })
            },
        },
        mounted() {
            let t = this;
            t.groupList();

            document.addEventListener("click",()=>{
                t.tagShowFlag=false;//点击空白或者其他区域关闭自定义时间弹层
                t.teamNameOnOff = false;
            });
        },
        filters:{
            getLogoUrl(url){
                return url.replace("http:","").replace("https:","");
            }
        },
        metaInfo: {
            title: '团队设置'
        }
    }
</script>


