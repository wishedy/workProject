<template>
    <section v-if="remindingNum>0">
        <div class="applicationReminding">
            <div class="remindingCont">
                <div class="width1000">
                    <p class="remindingText">有<span>{{remindingNum}}</span>人申请加入团队</p>
                    <p class="remindingBtn" @click.stop="lookMoreCli" v-show="lookMore"><span>去查看</span><i></i></p>
                </div>
            </div>
        </div>
        <section class="newBloodPopup" v-show="popupList">
            <aside class="popupCont">
                <div class="popupTitle">
                    <h2>新成员管理</h2>
                    <i @click="remindingCloseCli" v-show="myCheckOnOff"></i>
                </div>
                <ul class="list">
                    <li v-for="(item,index) in dataList" :key="index" v-if="item.teamRole!=2">
                        <p class="userImg"><img
                            :src="item.url|getLogoUrl"/>
                        </p>
                        <p class="userName">{{item.authorName,5|dateNameChange}}</p>
                        <p class="userTitle">{{item.medicalTitle,5|dateNameChange}}</p>
                        <p class="userTitle">{{item.company,10|dateNameChange}}</p>
                        <div class="stateBtn">
                            <p v-for="(innerItem,indexIndex) in item.teamStatus" v-text="innerItem.text"
                               :key="indexIndex" v-show="innerItem.templateOnOff" :class="innerItem.className"
                               @click.stop="stateChange(innerItem,indexIndex,index)"></p>
                        </div>
                    </li>
                </ul>
            </aside>
        </section>
    </section>
</template>
<script>
    import comm from '../../../utils/comm.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'index-app',
        props:['teamId'],
        data() {
            return {
                myCheckOnOff: false,
                ApplicationState: 0 ,//0可选择状态，1已同意，2已拒绝
                dataList:'',
                StateOnOff:true,
                lookMore:true,// 去查看
                popupList:false,// 弹层开关
                needRequest:false,// 关闭弹窗检测是否需要重新请求成员列表
                needNewMember:false
            }
        },
        watch:{
        },
        computed:{
            ...mapGetters(['requestOnOff','pointerOnOff','remindingNum']),
        },
        methods: {
            ...mapActions(['ChangeRequestOnOff','ChangePointerOnOff','ChangeRemindingNum']),
            remindingCloseCli(){//关闭的点击事件
                let t = this;
                t.myCheckOnOff = false;
                t.popupList = false;
                if(t.needRequest){
                    t.ChangeRequestOnOff(true);
                }
                if(t.needNewMember){
                    t.getTeamNameAll(t.teamId);
                }
                let _f=0;
                for (let i = 0;i<t.dataList.length;i++) {
                    let items = t.dataList[i];
                    if(items.teamState == 0){
                        _f++;
                    }
                }
                if(!_f){
                    t.ChangeRemindingNum(0);
                }else{
                    t.ChangeRemindingNum(_f);
                }
            },
            lookMoreCli(){
                let t = this;
                t.lookMore = true;
                t.myCheckOnOff = true;
                t.popupList = true;
                t.getTeamNameAll(t.teamId);
            },
            stateChange(item,indexIndex,index) {
                let t = this;
                switch (parseInt(indexIndex)){
                    case 0://同意
                        t.dataList[index].teamStatus = t.changeTeamState(1);
                        t.dataList[index].teamState = 1;
                        comm.ajax2({
                            url: '/call/caseFolder/team_member/updateState/',
                            type: "post",
                            data: {
                                paramJson: JSON.stringify({
                                    memberIdList: t.dataList[index].memberId,
                                    stateType:1
                                })
                            },
                            success: function (res) {
                                if(res&&res.responseObject.responseStatus){
                                    t.needRequest = true;
                                }
                            }
                        })
                        break;
                    case 1://拒绝
                        t.dataList[index].teamStatus = t.changeTeamState(3);
                        t.dataList[index].teamState = 3;
                        comm.ajax2({
                            url: '/call/caseFolder/team_member/updateState/',
                            type: "post",
                            data: {
                                paramJson: JSON.stringify({
                                    memberIdList: t.dataList[index].memberId,
                                    stateType:3
                                })
                            },
                            success: function (res) {
                                if(res&&res.responseObject.responseStatus){
                                    t.needNewMember = true;
                                }
                            }
                        })
                        break;
                }
            },
            changeTeamState(state){
              let t = this;
                let resultList =  [
                    {
                        'text':'同意',
                        'className':'agree',
                        'templateOnOff':true
                    },
                    {
                        'text':'拒绝',
                        'className':'refuse',
                        'templateOnOff':true
                    }
                ];
                switch (parseInt(state)){
                    case 1://已同意，无拒绝按钮
                        resultList[0].text = '已同意';
                        resultList[0].className = 'stated';
                        resultList[1].templateOnOff = false;
                        break;
                    case 3://已拒绝，无已同意按钮
                        resultList[1].text = '已拒绝';
                        resultList[1].className = 'stated';
                        resultList[0].templateOnOff = false;
                        break;
                }
                return resultList;
            },
            //获取当前团队成员列表
            getTeamNameAll(teamId){
                let t = this;
                comm.ajax2({
                    url: '/call/caseFolder/team_member/getMapListByTeamId/',
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({
                            teamId: teamId,
                            sortType:2,
                            firstResult: 0,
                            maxResult: 100,
                            teamSelectType: 6,
                            isValid:1
                        })
                    },
                    success:function(res){
                        if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.ChangePointerOnOff(true);
                            let originalList = JSON.parse(JSON.stringify(res.responseObject.responseData.data_list));
                            for (let num = 0; num < originalList.length; num++) {
                                let item = originalList[num];
                                item.teamStatus = t.changeTeamState(parseInt(item.teamState));
                            }
                            t.dataList = originalList;
                        }else {
                            t.ChangePointerOnOff(false);
                        }

                    }
                })
            },
        },
        async mounted() {
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
                if(txt.length>num+1){
                    txt = txt.substring(0,num)+'...';
                    return txt;
                }else{
                    return txt;
                }
            },
            getLogoUrl(url){
                return url.replace("http:","").replace("https:","");
            }
        },
        metaInfo: {
            title: '团队设置'
        }
    }
</script>

