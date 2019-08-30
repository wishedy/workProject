<template>
    <section class="alEmr-indexInner">
        <section class="navLeftWidth">
            <h2 v-text="titleName"></h2>
            <aside class="casesWidth"><!--//报错时添加error  获取焦点添加focus-->
                <InputBar  testRule="testName" isRequired labelName="姓名" placeholder="请输入" :HandleId="nameHandleId" :contentDes="nameContent" maxLen="20"></InputBar>
                <RadioBar :RadioList='sexRadioList' :index="patientSex" isRequired  labelName="性别" :HandleId="sexHandleId"></RadioBar>
                <AgeInput maxLen="20"   testYearRule="0,120" testMonthRule="0,12" testDayRule="0,30" isRequired labelName="年龄" :HandleId="ageHandleId" :contentYear="contentYear" :contentMonth="contentMonth"  :contentDay="contentDay" testResult="-1"></AgeInput>
                <InputBar :maxLen="test"   testRule="testPhoneNum"  labelName="电话" placeholder="请输入中国大陆电话号码" unitName="" :contentDes="patientMobile" :HandleId="phoneNumHandleId"></InputBar>
                <SelectInput :SelectInputList='selectList' :contentDes="numberContent_0" :index="numberType_0"   labelName="编号1"   testRule="testNum" :HandleId="numberHandleId_0" v-if="numberModuleCount>=1" :addOnOff="numberModuleCount===1" @addSelectInputItem="changeNumberModuleCount"></SelectInput>
                <SelectInput :SelectInputList='selectList' :contentDes="numberContent_1" :index="numberType_1"   labelName="编号2"   testRule="testNum" :HandleId="numberHandleId_1" v-if="numberModuleCount>=2" :addOnOff="numberModuleCount===2" @addSelectInputItem="changeNumberModuleCount"></SelectInput>
                <SelectInput :SelectInputList='selectList' :contentDes="numberContent_2" :index="numberType_2"   labelName="编号3"   testRule="testNum" :HandleId="numberHandleId_2" v-if="numberModuleCount>=3" :addOnOff="numberModuleCount===3" @addSelectInputItem="changeNumberModuleCount"></SelectInput>
                <SelectInput :SelectInputList='selectList' :contentDes="numberContent_3" :index="numberType_3"   labelName="编号4"   testRule="testNum" :HandleId="numberHandleId_3" v-if="numberModuleCount>=4" :addOnOff="numberModuleCount===4" @addSelectInputItem="changeNumberModuleCount"></SelectInput>
                <SelectInput :SelectInputList='selectList' :contentDes="numberContent_4" :index="numberType_4"   labelName="编号5"   testRule="testNum" :HandleId="numberHandleId_4" v-if="numberModuleCount>=5" :addOnOff="false" @addSelectInputItem="changeNumberModuleCount"></SelectInput>
                <radioSelectBar :RadioList='belongRadioList'   v-show="(ownerCheck)" radioLabelName="归属" selectLabelName="归属团队" :SelectList="teamSelectList" selectSecondLabelName="主管医生" :radioIndex="belongType"  :HandleId="belongHandleId" :selectIndex="teamNumberType"></radioSelectBar>
                <TagList :contentTagList='tagList' maxLen="20" labelName="标签" :HandleId="tagListHandleId"></TagList>
            </aside>
            <ChangeIndex></ChangeIndex>
        </section>
    </section>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';
    import regularTest from '~utils/regularTest.js';
    import comm from '../../../utils/comm.js';
    import SelectInput from '../components/selectInput.vue';
    import radioSelectBar from '../components/radioSelectBar.vue';
    import InputBar from '../components/InputBar.vue';
    import AgeInput from '../components/ageInput.vue';
    import TagList from '../components/tagList.vue';
    import ChangeIndex from '../components/changeIndex.vue';
    import RadioBar from '../components/radioboxBar.vue';
    import SelectBar from '../components/selectBar.vue';
    //Vue.component('Aaa',Aaa);
    export default {
        data(){
          return{
              cid:comm.cookie.get("userId"),
              nameContent:'',
              numberContent:'',
              numberContent_0:'',
              numberContent_1:'',
              numberContent_2:'',
              numberContent_3:'',
              numberContent_4:'',
              "contentYear":'',
              "contentMonth":"",
              "contentDay":"",
              patientSex:-1,
              doctorId:0,
              teamNumberType:0,//所属团队的index值
              numberType:-1,
              numberType_0:0,
              numberType_1:0,
              numberType_2:0,
              numberType_3:0,
              numberType_4:0,
              belongType:0,//病历归属，默认归属为个人
              patientMobile:'',//病人手机号
              nameHandleId:0,//操控姓名数据的id
              ageHandleId:0,
              sexHandleId:0,
              phoneNumHandleId:0,
              numberHandleId:0,
              numberId_0:'',
              numberId_1:'',
              numberId_2:'',
              numberId_3:'',
              numberId_4:'',
              numberHandleId_0:0,
              numberHandleId_1:0,
              numberHandleId_2:0,
              numberHandleId_3:0,
              numberHandleId_4:0,
              belongHandleId:0,
              belongTeamHandleId:0,
              tagListHandleId:0,
              teamSelect:{
                  "componentId":"",
                  "componentType":"1",
                  "labelName":"归属团队",
                  "isRequired|0-1":0,
                  "selectList":'[]',
                  "index|0-3":0,
                  "testResult":-1
              },
              test:11,/*1-住院号2-床位号3-病历号4-身份证号5-军官号*/
              sexRadioList:JSON.stringify([{'radioName':'男'},{'radioName':'女'}]),
              belongRadioList:JSON.stringify([{'radioName':'共享给团队'},{'radioName':'仅自己可见'}]),
              selectList:JSON.stringify([{'selectName':'住院号','testRule':'testNum'},{'selectName':'床位号','testRule':'testNum'},{'selectName':'病历号','testRule':'testNum'},{'selectName':'身份证号','testRule':'testID'},{'selectName':'军官号','testRule':'testNum'}]),
              teamSelectList:JSON.stringify([]),
              'tagList':'[]',
              'defaultTagList':'[]'
          }
        },
        mounted(){
            let t = this;
            t.initUploadState();
            t.changeTemplateId(false);
            t.changeUploadState(true);
            t.changeSaveStatus(0);
            if(!comm.isEmptyObject(t.baseInfo)){
                //初始化首页的前端基本数据结构,带数据的
                t.emptyNumberList();
                //t.initBasePageData(t.baseInfo);
                t.changeTeamPanel();
            }
            setTimeout(()=>{
                console.log(t.numberModuleCount);
            },5000);
        },
        created(){
            this.setTopNavTitle('填写患者基本信息');
            //在此处发送动态请求;
        },
        computed:{
            ...mapGetters(['baseInfo','editType','teamId','titleName','teamList','teamId','ownerCustomerId','CaseId','teamCustomerId','CaseBelongType','numberModuleCount','assistantDoctor']),
            ownerCheck(){
                let t = this;
                if(t.CaseId>0&&t.teamId!=0){
                    console.log(t.CaseBelongType);
                    if(t.CaseBelongType==0){
                        return t.ownerCustomerId == t.cid;
                    }else if(t.CaseBelongType==1){
                        if(t.assistantDoctor){
                            return true
                        }else{
                            if((typeof t.teamCustomerId =='string'&&t.teamCustomerId.length==0)||t.teamCustomerId==0){
                                return true;
                            }else{
                                return (t.teamCustomerId==t.cid);
                            }
                        }
                    }
                }else{
                    return true;
                }
            }

        },
        components:{
            InputBar,
            AgeInput,
            RadioBar,
            SelectInput,
            TagList,
            ChangeIndex,
            SelectBar,
            radioSelectBar
        },
        watch:{
            editType(newVal){
                let t = this;
                /*如果监听到editType值为0就初始化首页的前端基本数据结构*/
              if(parseInt(newVal,10)===0){
                  //获取这个编辑病历的基本信息,基本信息是在store中请求的
                  t.initBasePageData();
              }
            },
            teamId(n){
              if(n>0){
                  let t = this;
                  //console.log(t.baseInfo.teamId);
                  t.changeTeamPanel();
              }
            },
            teamList(n){
              if(n.length>0){
                  let t = this;
                  t.changeTeamPanel();
              }
            },
            baseInfo(newVal){
                let t = this;
                if(!comm.isEmptyObject(newVal)){
                    //初始化首页的前端基本数据结构,带数据的
                    t.emptyNumberList();
                    t.initBasePageData(newVal);
                }
            }
        },
        methods:{
            ...mapActions(['getBaseCaseInfo','setTopNavTitle','savePageData','getTeamList','changeSaveStatus','changeUploadState','changeTemplateId','initUploadState','changeNumberModuleCount','setNumberModuleCount','emptyNumberList']),
            changeTeamPanel(){
                let t = this;
                //debugger;
                let list = t.teamList;
                let arr = [];
                for(let i = 0;i<list.length;i++){
                    arr.push({
                        "selectName":list[i].teamName,
                        "selectId":list[i].teamId
                    });
                    if(t.assistantDoctor){
                        t.belongType = 1;
                    }else{
                        if(list[i].teamId==t.baseInfo.teamId){
                            if(t.belongType>0){
                                t.teamNumberType = i;
                                t.belongType = 1;
                            }
                        }
                    }
                }
                t.teamSelectList=  JSON.stringify(arr);
            },
            initBasePageData(data){
                let t = this;
                let dataJson = {};
                t.patientAge = (data&&data.patientAge&&!comm.isEmptyObject(data.patientAge))?data.patientAge.split(','):['','',''];
                t.nameContent = ((data)&&(data.patientName)&&!comm.isEmptyObject(data.patientName))?data.patientName:'';
                t.numberContent = ((data)&&(data.numberContent)&&!comm.isEmptyObject(data.numberContent))?data.numberContent:'';
                t.contentYear=t.patientAge[0].length>0&&(t.patientAge[0]*1+'')>=0?t.patientAge[0]:'';
                //debugger;
                t.contentMonth=t.patientAge[1]*1+'';
                t.contentDay=t.patientAge[2]*1+'';
                if(data&&data.numberList&&data.numberList.length>0){
                    t.setNumberModuleCount(data.numberList.length);
                }else{
                    t.setNumberModuleCount(1);
                }
                let getNumberInfo = (num,infoName)=>{
                    if(data&&data.numberList&&data.numberList.length>0&&data.numberList[num]&&(!isNaN(data.numberList[num].numberType))){
                        if(infoName==='numberType'){
                            return parseInt(data.numberList[num][infoName],10)-1;
                        }else if(infoName==='numberContent'){
                            return data.numberList[num][infoName];
                        }else if(infoName==='numberId'){
                            return data.numberList[num][infoName]+'';
                        }
                    }else{
                        if(infoName==='numberType'){
                            return 0;
                        }else if(infoName==='numberContent'){
                            return '';
                        }else if(infoName==='numberId'){
                            return '';
                        }
                    }
                }
                //console.log(t.contentMonth,t.contentDay);
                t.patientSex = (data&&!isNaN(data.patientSex))?data.patientSex>0?0:1:-1;
                t.doctorId = (data&&!isNaN(data.doctorId))?data.doctorId:0;
                t.patientMobile = (data&&data.patientMobile&&!comm.isEmptyObject(data.patientMobile))?data.patientMobile:'';
                t.numberType_0 = getNumberInfo(0,'numberType');
                t.numberId_0 = getNumberInfo(0,'numberId');
                t.numberContent_0 = getNumberInfo(0,'numberContent');
                t.numberType_1 = getNumberInfo(1,'numberType');
                t.numberId_1 = getNumberInfo(1,'numberId');
                t.numberContent_1 = getNumberInfo(1,'numberContent');
                t.numberType_2 = getNumberInfo(2,'numberType');
                t.numberId_2 = getNumberInfo(2,'numberId');
                t.numberContent_2 = getNumberInfo(2,'numberContent');
                t.numberType_3 = getNumberInfo(3,'numberType');
                t.numberId_3 = getNumberInfo(3,'numberId');
                t.numberContent_3 = getNumberInfo(3,'numberContent');
                t.numberType_4 = getNumberInfo(4,'numberType');
                t.numberId_4 = getNumberInfo(4,'numberId');
                t.numberContent_4 = getNumberInfo(4,'numberContent');
                t.belongType = (t.assistantDoctor)?1:((data&&data.belongType)?data.belongType:0);
                console.log(t.assistantDoctor);
                let dataList = [
                    {
                        "componentId":"",
                        "componentType":"0",
                        "labelName":'姓名',
                        "isRequired":1,
                        "contentDes":t.nameContent,
                        "placeholder":'请输入',
                        // "maxLen":20,
                        "testRule":"testName",
                        "unitName":'',
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":"6",
                        "labelName":"性别",
                        "isRequired":1,
                        "RadioList":[
                            {
                                "radioName":"男",
                                "radioId":"1"
                            },
                            {
                                "radioName":"女",
                                "radioId":"0"
                            }
                        ],
                        "index":parseInt(t.patientSex),
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":"4",
                        "labelName":"年龄",
                        "isRequired":1,
                        "contentYear":t.contentYear,
                        "contentMonth":t.contentMonth>=0?t.contentMonth:'',
                        "contentDay":t.contentDay>=0?t.contentDay:'',
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":"0",
                        "labelName":"电话",
                        "isRequired":0,
                        "contentDes":t.patientMobile,
                        "placeholder":'请输入中国大陆电话号码',
                        "testRule":"testPhoneNum",
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":2,
                        "labelName":"编号1",
                        "isRequired":0,
                        'inBaseInfoPage':'1',
                        "contentDes":t.numberContent_0,
                        "numberId":t.numberId_0,
                        "placeholder":"请您输入",
                        "SelectInputList":[
                            {
                                "selectName":"住院号",
                                "selectId":"1",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"床位号",
                                "selectId":"2",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"病历号",
                                "selectId":"3",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"身份证号",
                                "selectId":"4",
                                "testRule":'testID'
                            },{
                                "selectName":"军官号",
                                "selectId":"5",
                                "testRule":'testNum'
                            }
                        ],
                        "index":t.numberType_0,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":2,
                        "labelName":"编号2",
                        "isRequired":0,
                        'inBaseInfoPage':'1',
                        "contentDes":t.numberContent_1,
                        "numberId":t.numberId_1,
                        "placeholder":"请您输入",
                        "SelectInputList":[
                            {
                                "selectName":"住院号",
                                "selectId":"1",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"床位号",
                                "selectId":"2",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"病历号",
                                "selectId":"3",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"身份证号",
                                "selectId":"4",
                                "testRule":'testID'
                            },{
                                "selectName":"军官号",
                                "selectId":"5",
                                "testRule":'testNum'
                            }
                        ],
                        "index":t.numberType_1,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":2,
                        "labelName":"编号3",
                        "isRequired":0,
                        'inBaseInfoPage':'1',
                        "contentDes":t.numberContent_2,
                        "numberId":t.numberId_2,
                        "placeholder":"请您输入",
                        "SelectInputList":[
                            {
                                "selectName":"住院号",
                                "selectId":"1",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"床位号",
                                "selectId":"2",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"病历号",
                                "selectId":"3",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"身份证号",
                                "selectId":"4",
                                "testRule":'testID'
                            },{
                                "selectName":"军官号",
                                "selectId":"5",
                                "testRule":'testNum'
                            }
                        ],
                        "index":t.numberType_2,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":2,
                        "labelName":"编号4",
                        "isRequired":0,
                        'inBaseInfoPage':'1',
                        "contentDes":t.numberContent_3,
                        "numberId":t.numberId_3,
                        "placeholder":"请您输入",
                        "SelectInputList":[
                            {
                                "selectName":"住院号",
                                "selectId":"1",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"床位号",
                                "selectId":"2",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"病历号",
                                "selectId":"3",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"身份证号",
                                "selectId":"4",
                                "testRule":'testID'
                            },{
                                "selectName":"军官号",
                                "selectId":"5",
                                "testRule":'testNum'
                            }
                        ],
                        "index":t.numberType_3,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "componentId":"",
                        "componentType":2,
                        "labelName":"编号5",
                        "isRequired":0,
                        'inBaseInfoPage':'1',
                        "contentDes":t.numberContent_4,
                        "numberId":t.numberId_4,
                        "placeholder":"请您输入",
                        "SelectInputList":[
                            {
                                "selectName":"住院号",
                                "selectId":"1",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"床位号",
                                "selectId":"2",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"病历号",
                                "selectId":"3",
                                "testRule":'testNum'
                            },
                            {
                                "selectName":"身份证号",
                                "selectId":"4",
                                "testRule":'testID'
                            },{
                                "selectName":"军官号",
                                "selectId":"5",
                                "testRule":'testNum'
                            }
                        ],
                        "index":t.numberType_4,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {//单选下拉框
                        "labelName":'',
                        "componentId":"",
                        "componentType":"12",
                        "radioLabelName":"归属",
                        "isRequired":0,
                        "selectLabelName":"归属团队",
                        "radioIndex":t.assistantDoctor?1:t.belongType,
                        "selectIndex":t.teamNumberType,
                        "SelectList":[],
                        'doctorId':t.doctorId,
                        "RadioList":[
                            {
                                "radioName":"个人",
                                "radioId":"0"
                            },
                            {
                                "radioName":"团队",
                                "radioId":"1"
                            }
                        ],
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    },
                    {
                        "labelName":"标签",
                        "componentId": "",
                        "componentType": "11",
                        'contentTagList':[],
                        'defaultTagList':t.defaultTagList,
                        testResult:-1//-1代表为空0，代表错误，1代表正确
                    }
                ];
                let handleBox = [
                    'nameHandleId',
                    'sexHandleId',
                    'ageHandleId',
                    'phoneNumHandleId',
                    'numberHandleId_0',
                    'numberHandleId_1',
                    'numberHandleId_2',
                    'numberHandleId_3',
                    'numberHandleId_4',
                    'belongHandleId',
                    'tagListHandleId'
                ];
                for(let i = 0;i<dataList.length;i++){
                    let dataItem = dataList[i];
                    let timestamp = Date.parse(new Date())+i;
                    dataJson[timestamp]=dataItem;
                    t[handleBox[i]] = timestamp;
                }
                t.savePageData(dataJson);
            }
        }
    }
</script>
<style lang="scss">
    @import "../../../assets/scss/modules/common-modules";
    .alEmr-indexInner{
        padding: 270px 0 57px;
    }
    .newCases{

        .casesWidth{
            /*width: 550px;*/
            margin: 50px auto 0;
           /* padding-bottom: 125px;*/
            .articleText{
                display: inline-block;
                vertical-align: middle;
                //font-size: 18px;
                //color: #333333;
                @include fontSize(18px,#333);
                width: 72px;
                text-align: center;
                margin-right: 22px;
                i{
                    //font-size: 16px;
                    //color: #F34B4B;
                    @include fontSize(16px,#F34B4B);
                    margin-right: 6px;
                }
            }
        }
    }

</style>
