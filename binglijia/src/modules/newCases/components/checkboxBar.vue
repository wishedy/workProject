<template>
    <section class="formCommonWrap" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <div class="formRadio formCommon formCheck" :class="{'formRow':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput),'formContentLr':(isBothSides==1)}" v-if="((radioListDemo.length)<=maxItemNum&&(!needInput)&&(isBothSides==0))"  v-show="associatedState">
            <p class="articleText"><i v-if="isRequired">*</i>{{labelName}}</p>
            <div class="radioRight">
                <div class='radioIconNormal'  v-for="(item,index) in radioListDemo"   :class="{'active':item.checkOnOff}" :key="index" @click.stop="selectCheck(index)"><i></i><span  v-text="item.checkboxName"></span></div>
                <div  class='radioIconNormal'   :class="{'active':inputCheck}" v-if="needInput" :key="-2" @click="selectInput"><i></i><span  >其他</span><input type="text" :placeholder="placeholder" :class="{'error':inputError,'focusBorder':inputFocus}" @focus="inputFocus=true" @blur="inputFocus=false" v-model="inputContent" @click.stop="inputCheck=true"  ref="inputBar"/></div>
            </div>
            <p class="formError" v-text="testDes"></p>
        </div>
        <div class="formInput formCommon"  :class="{'formContentLr':(isBothSides==1)}" v-if="((radioListDemo.length)>maxItemNum&&!needInput)||needInput||(isBothSides==1)"   v-show="associatedState" :tag="associatedState">
            <p class="articleText"  v-show="sideType!=2" :class="{'selectText':((radioListDemo.length)>maxItemNum&&!needInput)||needInput}"><i v-if="isRequired">*</i>{{labelName}}</p>
            <div class="inputCont">
                <span class="formSelectIcon" v-text="sideType==1?'L':'R'"></span>
                <input type="text" placeholder="请选择" @click.stop="showDialog" v-model="checkContent"/>
            </div>
            <p class="formError" v-text="testDes"></p>
            <LayerComponent v-show="dialogOnOff"  @closeDialog="cancelDialog" @submitDialog="ensureCheck">
                <div class="formRadio formCommon formCheck" :class="{'formRow':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput)||(isBothSides==1)}">
                    <p class="articleText" v-if="!((((needInput)?1:0)+radioListDemo.length)>2)"><i v-if="isRequired">*</i>{{labelName}}</p>
                    <div class="radioRight">
                        <div class='radioIconNormal'  v-for="(item,index) in radioListDemo"   :class="{'active':item.checkOnOff}" :key="index" @click.stop="selectCheck(index)"><i></i><span  v-text="item.checkboxName"></span></div>
                        <div  class='radioIconNormal'   :class="{'active':inputCheck}" v-if="needInput" :key="-2" @click="selectInput"><i></i><span v-text="checkInvalid(otherLabel)?'':otherLabel"></span><input type="text" :placeholder="placeholder" :class="{'error':inputError,'focusBorder':inputFocus}" @focus="inputFocus=true" @blur="inputFocus=false" v-model="inputContent" @click.stop="inputCheck=true"  ref="inputBar"/></div>
                    </div>
                    <p class="formError formErrorTwo" v-text="testDes"></p>
                </div>
            </LayerComponent>
        </div>
    </section>

</template>
<script>
    import regularTest from '~utils/regularTest.js';
    import {mapActions,mapGetters} from 'vuex';
    const $ = require('jquery');
    import LayerComponent from './LayerComponent.vue';
    export default {
        props:{
            checkBoxList:{
                type:String
            },
            reallyIsValid:{
                default:'1'
            },
            index:{
                default:'-1'
            },
            isBothSides:{
                default:0
            },
            sideType:{
                default:1
            },
            isRequired:{
                type:Boolean,
                default:false
            },
            HandleId:{
                default:0
            },
            labelName:{
                type:String,
                default:''
            },
            row:{
                type:Boolean,
                default:false
            },
            needInput:{
                type:Boolean,
                default:false
            },
            otherCheckOnOff:{
                default:false
            },
            testRule:{
                type:String,
                default:''
            },
            contentDes:{
                type:String,
                default:''
            },
            relatedParentId:{
                default:0
            },
            associatedRole:{
                default:false
            },
            placeholder:{
                type:String,
                default:''
            },
            otherLabel:{
                type:String,
                default:''
            }
        },
        data(){
            return {
                maxItemNum:6,
                inputStart:false,
                inputFocus:false,
                inputCheck:false,
                inputContent:'',
                radioListDemo:[],
                associatedState:false,
                HandleParentId:'',
                //testDes:'',
                dialogOnOff:false,
                restore:{
                    radioListDemo:'',
                    inputContent:''
                }
            }
        },
        computed:{
            ...mapGetters(['Relationship','clickNum','templateAssemblePageOnOff','pageInfo']),
            inputError(){
                ////console.log(regularTest[this.testRule])
                return (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart);
            },
            checkContent(){
                let t = this;
                let str = '';
                for(let num = 0;num<t.radioListDemo.length;num++){
                    if(t.radioListDemo[num].checkOnOff){
                        str+=`；${t.radioListDemo[num].checkboxName}`;
                    }
                }
                if(t.checkInvalid(t.inputContent)){
                    if(t.inputCheck){
                        str+='；其他';
                    }
                }else{
                    str+= "；"+t.inputContent;
                }
                //str+=t.checkInvalid(t.inputContent)?'':'；'+t.inputContent;
                t.checkStatus();
                return (str.indexOf('；')==0)?str.substring(1,100000000):str;
            },
            testDes(){
                let t = this;
                if(!t.inputFocus){
                    if((t.inputCheck)&&(t.inputContent.length===0)){
                        return '';
                    }else{
                        return '';
                    }
                }
            }
        },
        components:{
            LayerComponent
        },
        watch:{
            Relationship(n){//当接收到组件被操作的时候触发
                //console.log(n);
                let t = this;
                if(n.handleId==t.HandleParentId){//执行的父组件是我的父组件
                    let hasHandle = false;
                    for(let num = 0;num<n.relationId.length;num++){
                        if(n.relationId[num]==t.HandleId){
                            hasHandle = true;
                        }
                    }
                    t.associatedState = hasHandle;
                }
            },
            associatedState(n){
                let t = this;
                if(!n){
                    t.resetData();
                }
            },
            inputContent(newVal){
                let t = this;
                (!t.inputStart)?(t.inputStart = true):'';
                t.changeComponentData({HandleId:t.HandleId,contentDes:newVal});
            },
            inputFocus(n){
              let t = this;
              n?t.inputCheck = true:'';
                t.checkStatus();
            },
            checkBoxList(n){
                this.radioListDemo = JSON.parse(n);
            },
            otherCheckOnOff(n){
              this.inputCheck =  (n==='true')?true:false;
            },
            contentDes(n){
                this.inputContent = n;
            },
            templateAssemblePageOnOff(n){
                let t = this;
                if(n){
                    t.changeRelationship();
                }
            },
            radioListDemo:{
                handler(n){
                    let t = this;
                    t.changeComponentData({HandleId:t.HandleId,checkBoxList:n,contentDes:t.inputContent});
                    t.changeRelationship();
                },
                deep:true
            },
            associatedRole(n){
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            clickNum(){
                let t = this;

            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','checkRelationship']),
            resetData(){
                let t = this;
                for(let num = 0;num<t.radioListDemo.length;num++){
                    t.radioListDemo[num].checkOnOff = false;
                }
                t.inputContent = '';
                t.inputCheck = false;
            },
            ensureRelationship(){
                let t = this;
                let parentData =this.pageInfo.pageData[t.HandleParentId];
                if(parentData&&parentData.checkBoxList){
                    //多选
                    let  checkBoxList = parentData.checkBoxList;
                    for(let i = 0;i<checkBoxList.length;i++){
                        if(checkBoxList[i].checkOnOff&&checkBoxList[i].relationId&&checkBoxList[i].relationId.length>0){
                            for(let innerNum = 0;innerNum<checkBoxList[i].relationId.length;innerNum++){
                                if(t.HandleId==checkBoxList[i].relationId[innerNum]){
                                    t.associatedState = true;
                                }
                            }
                        }
                    }
                }else if(parentData&&parentData.RadioList){
                    //单选
                    let RadioList =   parentData.RadioList;
                    let index = parentData.index;
                    if(index!=-1) {
                        if ( RadioList[index]&&RadioList[index].relationId && RadioList[index].relationId.length > 0) {
                            for (let innerNum = 0; innerNum < RadioList[index].relationId.length; innerNum++) {
                                if (t.HandleId == RadioList[index].relationId[innerNum]) {
                                    t.associatedState = true;
                                }
                            }
                        }
                    }
                }

            },
            changeRelationship(){
              let t = this;
                let relationIdBox = [];
                for(let i = 0;i<t.radioListDemo.length;i++){
                    if(t.radioListDemo[i].checkOnOff&&t.radioListDemo[i].relationId&&t.radioListDemo[i].relationId.length>0){
                        relationIdBox = relationIdBox.concat(t.radioListDemo[i].relationId);
                    }
                }
                t.checkRelationship({
                    relationId:relationIdBox,
                    handleId:t.HandleId
                });
              /*setTimeout(function(){

              },300)*/
            },
            checkInvalid:(val)=>{
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            selectInput(){
                let t = this;
                t.inputCheck = !t.inputCheck;
                t.inputCheck?$(t.$refs.inputBar).trigger("focus"):'';
                t.checkStatus();
                t.changeComponentData({HandleId:t.HandleId,otherCheckOnOff:t.inputCheck,contentDes:t.inputContent});
              //多选联调
            },
            selectCheck(index){
                let t = this;
                t.radioListDemo[index].checkOnOff = !t.radioListDemo[index].checkOnOff;
                t.checkStatus();
                t.changeComponentData({HandleId:t.HandleId,checkBoxList:t.radioListDemo,contentDes:t.inputContent});
            },
            cancelDialog(){
                let t = this;
                t.restoreData();
                t.hideDialog();
            },
            restoreData(){
              let t = this;
                t.radioListDemo = JSON.parse(t.restore.radioListDemo);
                t.inputContent = t.restore.inputContent;
            },
            ensureCheck(){
                let t = this;
                t.hideDialog();
            },
            hideDialog(){
                let t = this;
                t.dialogOnOff = false;
            },
            showDialog(){
                let t = this;
                t.restore.radioListDemo = JSON.stringify(t.radioListDemo);
                t.restore.inputContent = t.inputContent;
                t.dialogOnOff = true;
            },
            checkStatus(){
                let t = this;
                let sumLen = 0;
                if(t.HandleId){
                    if(t.needInput){
                        if(t.inputCheck){
                            t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                            /*if(t.checkInvalid(t.inputContent)){
                                t.changeComponentTestResult({HandleId:t.HandleId,testResult:0});
                            }else{
                                t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                            }*/
                        }else{
                            t.changeComponentTestResult({HandleId:t.HandleId,testResult:sumLen>0?1:-1});
                        }
                    }else{
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:sumLen>0?1:-1});
                    }
                }
            }
        },
        mounted(){
            let t = this;
            this.inputContent = t.checkInvalid(this.contentDes)?'':this.contentDes;
            this.radioListDemo = JSON.parse(t.checkBoxList);
            this.inputCheck = (t.otherCheckOnOff==='true')?true:false;
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            t.ensureRelationship();
        }
    }
</script>
<style lang="scss" scoped>
    .alEmr-mainInner{
        .alEmr-indexInner{
            .navLeftWidth{
                .formCommonLrContainer{
                    .formCommonWrap:nth-child(2){
                        .formContentLr{
                            margin-left: 50px;
                        }
                    }
                }
            }
        }
    }
    .alEmr-indexInner{
        .formContentLr{
            .inputCont{
                width: 247px;
                position: relative;
                .formSelectIcon{
                    display: inline-block;
                    width:44px;
                    height:40px;
                    text-align: center;
                    line-height: 40px;
                    border-right:1px solid #c8c8c8;
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-size: 14px;
                }
                input{
                    display: inline-block;
                    width: 70%;
                    padding-left: 55px;
                }
            }
        }
    }
    .newCases .formRadio.formCheck .radioRight div input{
        &.focusBorder{
            background: #FFFFFF;
            border: 1px solid #2888FF;
            box-shadow: 0 0 4px 0 rgba(67,130,241,0.47);
            border-radius: 4px;
        }
        &.error {
            background: #FFFFFF;
            border: 1px solid #F34B4B;
            box-shadow: 0 0 4px 0 rgba(243, 75, 75, 0.59);
            border-radius: 4px;
        }
    }
    .alEmr-indexInner .formCommon .articleText {
        vertical-align: top;
        &.selectText{
            vertical-align: middle;
            /*line-height: 32px;*/
        }

    }
</style>
