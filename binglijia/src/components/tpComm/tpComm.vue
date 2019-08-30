<template>
    <div class="alEmr-mainInner" @click="closeCall" :class="{'mainHide':ismainHide,'alEmr-mainCase':typeNameCase}">
        <NavSideBar v-if="!typeNameCase" :sideSetting="{index:2}"></NavSideBar>
        <TopHeader v-if="!typeNameCase"></TopHeader>
        <!--<header-top-nav v-if="typeNameCase" :navName="'选择病历模板'" :pageType="1" :crumbsTxt="crumbsText"></header-top-nav>-->
        <section class="alEmr-mainIndex">
            <section class="alEmr-innerLeft">
                <ul>
                    <li v-for="(item,index) in libDateList" :class="{'active':index==indexActive}" @click="majorList(index)">{{item.typeName}}</li>
                </ul>
            </section>
            <section class="alEmr-innerRight">
                <section class="alEmr-innerAll alEmr-moudel" v-for="(item,index) in libDateList" :class="majorColor(index)" v-if="indexActive==index||indexActive==0">
                    <h4 v-if="index!=0">{{item.typeName}}</h4>
                    <div v-if="!typeNameCase">
                        <div v-for="(itemL,indexI) in item.template_list" v-if="index!=0" :class="{'modelItem':itemL.isNew==='0' ,'modelItemNew':itemL.isNew==='1'}" @click="modelItem(itemL)"><span class="modelText">{{templateTitle(itemL.templateTitle)}}</span></div>
                    </div>
                    <div v-else>
                        <div v-for="(itemL,indexI) in item.template_list" v-if="index!=0"  @click.stop.prevent="modelItem(itemL,indexI,index)" :class="{'active':isSelectActive&&isSelectIndex==indexI&&isItemIndex==index,'modelItem':itemL.isNew==='0' ,'modelItemNew':itemL.isNew==='1'}"><span class="modelText">{{templateTitle(itemL.templateTitle)}}</span><i></i></div>
                    </div>
                </section>
                <p class="alEmr-innerMore">~更多模板正在准备中，尽请期待~</p>
                <section class="callOur">
                    <section :class="{'caseCallTop':typeNameCase}" class="callContent">
                        <span class="callText">没有需要的病历模板？</span>
                        <div class="callContainer">
                            <span class="callLink" @click.stop.prevent="callModule">告诉我们</span>
                            <transition name="fade">
                                <div class="callModule" v-if="isCallModule" @click.stop.prevent>
                                <span class="closeCall" @click="btnCancel"></span>
                                <div v-if="!submitSuccess" class="contentCon">
                                    <h4>请告诉我们您需要的病历模板</h4>
                                    <div class="textDiv">
                                        <textarea placeholder="请简单说明您需要的模板名称、主要内容等" v-model.trim="textVal"></textarea>
                                        <span v-if="500-textVal.length<=20">{{500-textVal.length}}</span>
                                    </div>
                                    <h4>您的联系方式</h4>
                                    <!--<textarea v-model.trim="inputVal" class="linkYour"/>-->
                                    <input v-model.trim="inputVal" class="linkYour"/>
                                    <div class="btnModule">
                                        <!--<button class="btnCancel" @click="btnCancel">取消</button>-->
                                        <button class="btnSubmit" @click="btnSubmit" :class="{'active':isBtnSubmit}">提交</button>
                                    </div>
                                </div>
                                <div v-else class="subSuccess">
                                    <div class="subText">
                                        <h2><i></i>提交成功</h2>
                                        <p>感谢您的宝贵建议，我们会尽快向您反馈处理结果</p>
                                    </div>
                                </div>
                            </div>
                            </transition>
                        </div>
                    </section>
                    <section v-if="typeNameCase" class="baseInfoCotainer">
                        <a href="#" class="baseInfoBack" @click.stop.prevent="baseInfoBack">返回基本信息</a>
                        <div class="btnBase" :class="{'active':isSelectActive}" @click.stop.prevent>
                            <button class="btnReview" @click="leftMenu(templateId)">预览</button>
                            <button class="BtnUse" @click="useBtn">使用</button>
                        </div>
                    </section>
                </section>
            </section>
        </section>
        <section class="alEmr-thickness" v-if="isThickness" @click.stop.prevent>
            <section class="thickMaster">
            </section>
            <section class="thickCotainer">
                <section class="thickTitle">
                    <p class="titleName">模板预览-{{thickTitle}}</p>
                    <p class="titleDesc">可根据需要选择对应的模板<i @click="closeThick"></i></p>
                </section>
                <section class="thickLeft">
                    <ul>
                        <li v-for="(item,index) in thickLeft" :class="thickLeftIndex==index?'active':''" @click="selectThick(index)">{{item.caseFolderTemplate.structureName}}</li>
                    </ul>
                </section>
                <section class="thickRight">
                    <section class="newCases thickCase">
                        <!--<aside class="casesWidth">-->
                        <section v-for="(item,index) in thickRight" :class="{'selectType':item.caseFolderTemplate.sideType}" :style="styleType(item)">
                            <!--1-单选-下拉列表 2-单选-下拉列表-其他3-多选-下拉列表4-多选-下拉列表-其他 5-时间控件（岁月天）6-时间控件（年月日）7-时间控件（月周天）8-文本9-数值10-视频/图片',-->
                            <div :is="currentView(item)" :data="item" @olderTag="olderTag" :olderTag="olderTagList"></div>
                        </section>
                        <!--</aside>-->
                    </section>
                </section>
                <section class="thickFooter" v-if="typeNameCase">
                    <button @click="useBtn">使用</button>
                </section>
            </section>
        </section>
        <loading v-if="isLoading"></loading>
    </div>
</template>
<script>
    // <!--1-单选-下拉列表 2-单选-下拉列表-其他3-多选-下拉列表4-多选-下拉列表-其他 5-时间控件（岁月天）6-时间控件（年月日）7-时间控件（月周天）8-文本9-数值10-视频/图片',-->
    import headerTopNav from '~components/common/headerTopNav.vue';
    import NavSideBar from '~components/common/NavSideBar.vue';
    import TopHeader from '~components/common/TopHeader.vue';
    import loading from '~components/loading/loading';
    import formSelect from './component/formSelect';//1-单选-下拉列表 2-单选-下拉列表-其他3-多选-下拉列表4-多选-下拉列表-其他
    import formInputAge from './component/formInputAge';//5-时间控件（岁月天）
    import surgeryCure from './component/surgeryCure';//8-年月日控件
    import formSelectTime from './component/formSelectTime';//7-时间控件（月周天）
    import formInput from './component/formInput';//8-文本
    import formNumber from './component/formNumber';//9-数值
    import beforeSurgeryView from './component/beforeSurgeryView.vue';//10-视频/图片
    import formTag from './component/formTag';//11111-标签
    import comm from '../../utils/comm.js';
    const tpCommUrl={
        getMapList:'/call/caseFolder/template/getMapList/',//获取模板内容
        suggestion:'/call/customer/suggestion/create/',//提交反馈信息
        getTemplateDataList:'/call/caseFolder/template_structure/getTemplateDataList/',//获取模板

    };
    export default {
        props:['typeNameCase','crumbsText'],
        data() {
            return {
                // page: Number(new URLSearchParams(window.location.search).get('page')) || 1,
                topics: [],
                majorName:[],
                libDateList:[],
                majorClass:['orderMajor',' jointMajor','spineMajor'],
                indexActive:0,
                isCallModule:false,
                textVal:'',
                inputVal:'',
                isThickness:false,
                ismainHide:false,
                thickLeftIndex:0,
                thickLeft:[],
                thickTitle:'',
                thickRight:[],
                submitSuccess:false,
                isBtnSubmit:false,
                isSelectActive:false,
                isSelectIndex:0,
                isItemIndex:0,
                userId:comm.cookie.get("userId")||"",
                isLoading:false,
                templateId:'',
                locationData:{},
                setTime:'',
                olderTagList:[]
            }
        },
        components: {
            headerTopNav,
            NavSideBar,
            TopHeader,
            formSelect,
            formInputAge,
            surgeryCure,
            formSelectTime,
            formInput,
            formNumber,
            formTag,
            beforeSurgeryView,
            loading
        },
        watch:{
            textVal(){
                // console.log(this.textVal&&this.inputVal)
                if(this.textVal.length>500){
                    this.textVal=this.textVal.substr(0,500);
                }
                if(this.textVal){
                    this.isBtnSubmit=true;
                }else {
                    this.isBtnSubmit=false;
                }
            },
            // inputVal(){
            //     this.inputVal=this.inputVal.replace(/[\u4e00-\u9fa5]/g,'');//联系方式不允许输入汉字
            // }
        },
        methods:{
            styleType(data){
                // if(data.caseFolderTemplate.sideType==2)
                if(data.caseFolderTemplate.sideType==2&&data.commDataField.fieldType==9){
                    if(data.commDataThreshold.thresholdUnit&&comm.getByteLen(data.commDataThreshold.thresholdUnit)>8){
                        return {
                            'display': 'block',
                             'margin-left': '184px'
                        }
                    }
                }
            },
            olderTag(data){
                this.olderTagList=data;
            },
            currentView(item){
                let str='';
                // <!--1-单选-下拉列表 2-单选-下拉列表-其他3-多选-下拉列表4-多选-下拉列表-其他 5-时间控件（岁月天）6-时间控件（年月日）7-时间控件（月周天）8-文本9-数值10-视频/图片',-->
                switch (parseInt(item.commDataField&&item.commDataField.fieldType,10)){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        str= 'formSelect';
                        break;
                    case 5:
                        str= 'formInputAge';
                        break;
                    case 6:
                        str= 'surgeryCure';
                        break;
                    case 7:
                        str= 'formSelectTime';
                        break;
                    case 8:
                        str= 'formInput';
                        break;
                    case 9:
                        str= 'formNumber';
                        break;
                    case 10:
                        str= 'beforeSurgeryView';
                        break;
                    case 11111:
                        str= 'formTag';
                        break;
                    default:
                        break;
                }
                return str;
            },
            baseInfoBack(){
                if(this.$router){
                    if(!comm.browser.isIe9()&&!comm.browser.isIe8()){
                        history.replaceState(null, null, window.location.href+'hello');
                    }
                    this.$router.push({
                        path: 'baseInfo',
                    })
                }
                // history.go(-1);
            },
            templateTitle(title){

                // if(title.length>21){
                //     return title.slice(0,20)+'...'
                // }else {
                //     return title;
                // }
                return comm.getStrLen(title,45)
            },
            //获取左侧专业列表
            ajaxMajor(){
                let t=this;
                t.isLoading=true;
                comm.ajax2({
                    url: tpCommUrl.getMapList,
                    type: "GET",
                    data: {
                        paramJson:JSON.stringify({"customerId":t.userId})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.libDateList=[{'typeName':'全部'}];
                            t.libDateList=t.libDateList.concat(res.responseObject.responseData.data_list);
                        }

                    }
                })
            },
            //左侧专业列表
            majorList(index){
                this.indexActive=index;
            },
            //对右侧模板背景颜色循环处理
            majorColor(index){
                if(index==0){
                    return 'allMajor';
                }else if(index%3==0){
                    return  this.majorClass[2]
                }else {
                    return  this.majorClass[index%3-1]
                }
            },
            //告诉我们
            callModule(){
                if(this.isCallModule){
                    this.closeCall();
                }else {
                    this.isCallModule=true;
                    this.isSelectActive=false;
                }

            },
            //告诉我们 取消
            btnCancel(){
                this.isCallModule=false;
                this.textVal='';
                this.inputVal='';
                this.isCallModule=false;
                this.submitSuccess=false;
                if(this.setTime){
                    clearTimeout(this.setTime)
                }
            },
            //告诉我们 提交
            btnSubmit(){
                if(this.isBtnSubmit){
                    this.ajaxCallBtn(this.textVal+'&'+this.inputVal);
                    this.textVal='';
                    this.inputVal='';
                    this.submitSuccess=true;
                    let t=this;
                    this.setTime=setTimeout(function () {
                        t.isCallModule=false;
                        t.submitSuccess=false;
                    },3000);
                }

            },
            //上传反馈信息
            ajaxCallBtn(suggestion){
                let t=this;
                t.isLoading=true;
                comm.ajax2({
                    url: tpCommUrl.suggestion,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({"customerId":t.userId,'visitSiteId':'1',suggestion:suggestion,'suggestionType':11})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                    }
                })
            },
            //关闭弹窗
            closeCall(){
                this.btnCancel();
                if(this.typeNameCase){
                    this.isSelectActive=false;
                }

            },
            //模板预览
            modelItem(item,indexI,index){
                this.thickTitle=item.templateTitle||item;
                if(this.typeNameCase){
                    this.isSelectActive=true;
                    this.isSelectIndex=indexI;
                    this.isItemIndex=index;
                    this.btnCancel();
                    this.templateId=item.templateId;
                }else {
                    this.leftMenu(item.templateId);
                }

            },
            //获取左侧导航列表
            leftMenu(templateId){
                if(this.typeNameCase&&!this.isSelectActive){
                    return false;
                }
                let t=this;
                t.isThickness=true;
                t.ismainHide=true;
                t.isLoading=true;
                comm.ajax2({
                    // url: '/call/multicenter/major/case/getCaseMenu/',
                    url: tpCommUrl.getTemplateDataList,
                    type: "GET",
                    data: {
                        // paramJson:JSON.stringify({"majorId":"1520408589147"})
                        paramJson:JSON.stringify({
                            "templateId":templateId,
                            'visitSiteId':'1'
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                        t.thickLeft=[{caseFolderTemplate:{structureName:'基本信息'}}];
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.thickLeft=t.thickLeft.concat(res.responseObject.responseData.data_list[0]);
                        }
                        t.baseInfoMenu();
                    }
                })
            },
            //获取患者基本信息
            baseInfoMenu(){
                this.thickRight=[
                    {
                        "caseFolderTemplate":{
                            structureName:"姓名",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "8",
                        },
                        commDataThreshold:{
                            "thresholdValue": "0,20",
                        },
                        isRequire:1
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"性别",
                            isValid:1,
                            isBothSides:0
                        },
                        "caseFolderTemplateScope": [
                            {
                                "dictionaryName": "男",
                            },
                            {
                                "dictionaryName": "女",
                            }
                        ],
                        "commDataField": {
                            "fieldType": "1",
                        },
                        isRequire:1
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"年龄",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "5",
                        },
                        isRequire:1
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"电话",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "9",
                        },
                        caseFolderTemplateScope:[
                        ],
                        commDataThreshold:{
                            "thresholdValue": "0,50",
                        },
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"编号",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "9",
                        },
                        caseFolderTemplateScope:[
                            {'value':''},
                        ],
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"归属",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "1",
                        },
                        "caseFolderTemplateScope": [
                            {
                                "dictionaryName": "共享给团队",
                            },
                            {
                                "dictionaryName": "仅自己可见",
                            }
                        ],
                    },
                    {
                        "caseFolderTemplate":{
                            structureName:"标签",
                            isValid:1,
                            isBothSides:0
                        },
                        "commDataField": {
                            "fieldType": "11111"
                        },
                    },
                ];
            },
            //获取右侧内容区数据
            rightMenu(thickLeft,index){
                let t=this;
                t.isLoading=true;
                comm.ajax2({
                    url: tpCommUrl.getTemplateDataList,
                    type: "GET",
                    data: {
                        // paramJson:JSON.stringify({"majorId":"1520408589147","menuId":menuId})
                        paramJson:JSON.stringify({
                            "templateId":thickLeft.caseFolderTemplate.templateId,
                            parentId:thickLeft.caseFolderTemplate.structureId,
                            visitSiteId:1

                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.thickRight=res.responseObject.responseData.data_list[0];
                        }else {
                            t.thickRight=[];
                        }
                        t.locationData[index]=t.thickRight;
                    }
                })
            },
            //新建病历左侧导航
            selectThick(index){
                this.thickLeftIndex=index;
                if(index!=0){
                    if(this.locationData[index]){
                        this.thickRight=this.locationData[index]
                    }else {
                        this.rightMenu(this.thickLeft[index],index);
                    }

                }else {
                    this.baseInfoMenu();
                }
            },
            //模板预览关闭
            closeThick(){
                this.isLoading=false;
                this.isThickness=false;
                this.ismainHide=false;
                this.thickLeftIndex=0;
                this.locationData={};
            },
            //使用
            useBtn(){
                if(this.isSelectActive){
                    if(!comm.browser.isIe9()&&!comm.browser.isIe8()){
                        history.replaceState(null, null, window.location.href+'hello');
                    }
                    this.$emit('tpUse',this.templateId);
                }
            }

        },
        async mounted() {
            this.ajaxMajor();

        },
        // metaInfo: {
        //     title: '模板库'
        // }
    }
</script>
<style lang="scss">
    @import "../../assets/scss/base";
    @import "../../assets/scss/pages/newCases";
    @import "../../assets/scss/pages/templateLib";
    /*.caseTopNav{*/
        /*display: none;*/
    /*}*/
    .newCases.thickCase .articleText{
        text-align: right;
    }
    .selectType{
        display: inline-block;
        vertical-align: middle;
        margin-right: 30px;
    }
    .thickCase .inputCont ,.newCases.thickCase .formInputAge .inputText,.newCases.thickCase .selectCont,.newCases.thickCase .formNumber .inputCont{
        /*background: rgba(216,216,216,0.10);*/
    }
    .newCases.thickCase input{
        /*background: rgba(251, 251, 251,0.10);*/
    }
    .newCases.thickCase p.articleText{
        display: inline-block;
    }
    .thickCase .formTag{
        margin-bottom: 36px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all ease-in .5s;
        -moz-transition: all ease-in .5s; /* Firefox 4 */
        -webkit-transition: all ease-in .5s; /* Safari 和 Chrome */
        -o-transition: all ease-in .5s; /* Opera */
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
        /*transform: scale(0,0);*/
        /*transform-origin:90% 100%;*/

        /*-ms-transform: scale(0,0); 		!* IE 9 *!*/
        /*-ms-transform-origin:90% 100%; 		!* IE 9 *!*/

        /*-webkit-transform: scale(0,0);	!* Safari 和 Chrome *!*/
        /*-webkit-transform-origin:90% 100%;	!* Safari 和 Chrome *!*/

        /*-moz-transform: scale(0,0);		!* Firefox *!*/
        /*-moz-transform-origin:90% 100%;		!* Firefox *!*/

        /*-o-transform: scale(0,0);		!* Opera *!*/
        /*-o-transform-origin:90% 100%;		!* Opera *!*/
    }
</style>
