<template>
    <section class="formCommonWrap" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <div class="formRadio formCommon formRadioFocus" :class="{'formRow':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput),'formContentLr':(isBothSides==1)}" v-show="associatedState" v-if="((radioListDemo.length<=maxItemNum)&&(!needInput)&&(isBothSides==0))">
            <p class="articleText" :class="{'selectText':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput)}"><i v-if="isRequired">*</i>{{labelName}}</p>
            <div class="radioRight">
                <div class='radioIconNormal'  v-for="(item,index) in radioListDemo"   v-show="(index<radioListDemo.length-1)" :class="{'active':index==radioIndex}" v-if='needInput' :key="index" @click="selectRadio(index)"><i></i><span  v-text="item.radioName"></span></div>
                <div class='radioIconNormal'  v-for="(item,index) in radioListDemo" v-if='!needInput' :class="{'active':index==radioIndex}" :key="index" @click="selectRadio(index)"><i></i><span  v-text="item.radioName"></span></div>
                <div  class='radioIconNormal'   :class="{'active':radioIndex==-2}" :key="-2" v-if="needInput"><i  @click="selectRadio(-2)"></i><span  >其他</span><input type="text" :placeholder="placeholder" :class="{'error':inputError,'focusBorder':inputFocus}" @focus.stop="inputFocus=true" @keydown.enter.stop='inputFocus=false' @blur.stop="inputFocus=false" v-model="inputContent" ref="inputBar"/></div>
            </div>
            <p class="formError" v-text="testDes"></p>
        </div>
        <div class="formInput formCommon"  :class="{'formContentLr':(isBothSides==1)}" v-if="(((radioListDemo.length)>maxItemNum&&!needInput)||needInput||(isBothSides==1))"   v-show="associatedState">
            <p class="articleText" v-show="sideType!=2"><i v-if="isRequired">*</i>{{labelName}}</p>
            <div class="inputCont">
                <span class="formSelectIcon"  v-text="sideType==1?'L':'R'"></span>
                <input type="text" placeholder="请选择" @click.stop="showDialog" v-model="radioContent"/>
            </div>
            <p class="formError" v-text="testDes"></p>
            <LayerComponent v-show="dialogOnOff" @closeDialog="cancelDialog" @submitDialog="ensureRadio">
                <div class="formRadio formCommon formRadioFocus" :class="{'formRow':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput)||(isBothSides==1)}" v-show="associatedState">
                    <p class="articleText marskText" :class="{'selectText':((((needInput)?1:0)+radioListDemo.length)>2)||(needInput)}"  v-if="!((((needInput)?1:0)+radioListDemo.length)>2)"><i v-if="isRequired">*</i>{{labelName}}</p>
                    <div class="radioRight">
                        <div class='radioIconNormal'  v-for="(item,index) in radioListDemo"   :class="{'active':index==radioIndex}" :key="index" @click="selectRadio(index)"><i></i><span  v-text="item.radioName"></span></div>
                        <div  class='radioIconNormal'   :class="{'active':radioIndex==-2}" :key="-2" v-if="needInput"><i  @click="selectRadio(-2)"></i><span v-text="checkInvalid(otherLabel)?'':otherLabel"></span><input type="text" :placeholder="placeholder" :class="{'error':inputError,'focusBorder':inputFocus}" @focus.stop="inputFocus=true"  @keydown.enter.stop='inputFocus=false' @blur.stop="inputFocus=false" v-model="inputContent" ref="inputBar"/></div>
                    </div>
                    <p class="formError formErrorTwo" v-text="testDes" :class="{'formErrorThree':!((((needInput)?1:0)+radioListDemo.length)>2)}"></p>
                </div>
            </LayerComponent>
        </div>
    </section>

</template>
<script>
    const $ = require('jquery');
    import regularTest from '~utils/regularTest.js';
    import {mapActions,mapGetters} from 'vuex';
    import LayerComponent from './LayerComponent.vue';
    export default {
        props:{
            reallyIsValid:{
                default:'1'
            },
            RadioList:{
                type:String
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
            HandleId:{
                default:0
            },
            isRequired:{
                type:Boolean,
                default:false
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
                radioIndex:-1,
                inputContent:'',
                rowOnOff:false,
                associatedState:false,
                HandleParentId:'',
                testDes:'',
                dialogOnOff:false,
                restore:{
                    radioIndex:-1,
                    inputContent:''
                }
            }
        },
        components:{
            LayerComponent
        },
        computed:{
            ...mapGetters(['Relationship','clickNum','pageInfo']),
            inputError(){
                return (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart);
            },
            radioListDemo(){
                let t = this;
                return JSON.parse(t.RadioList);
            },
            radioContent(){
                let t = this;
                if(t.radioIndex>=0){
                    return t.radioListDemo[t.radioIndex].radioName;
                }else if(t.radioIndex==-2){
                    if(t.checkInvalid(t.inputContent)){
                        return '其他';
                    }else{
                        return t.inputContent;
                    }
                }else{
                    return '';
                }
            }
        },
        watch:{
            inputFocus(n){
              let t = this;
              if(n){
                  t.radioIndex = -2;
                  /*if((t.radioIndex==-2)&&(t.inputContent.length==0)){
                      t.testDes = '请输入其他';
                  }*/
              }
            },
            Relationship(n){//当接收到组件被操作的时候触发
              let t = this;
                if(n.handleId==t.HandleParentId){//执行的父组件是我的父组件
                    // debugger;
                    let hasHandle = false;
                    for(let num = 0;num<n.relationId.length;num++){
                        if(n.relationId[num]==t.HandleId){
                            //console.log(t.HandleId);
                            hasHandle = true;
                        }
                    }
                    t.associatedState = hasHandle;
                }
                t.ensureRelationship();
            },
            inputContent(n){
                let t = this;
                (!t.inputStart)?(t.inputStart = true):'';
                t.changeComponentData({HandleId:t.HandleId,contentDes:n,index:t.radioIndex});
                n.length>0?t.testDes='':'';
                if(t.HandleId>0){
                    if(t.radioIndex==-1){
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:-1});
                    }else{
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                    }
                }

            },
            contentDes(n){
                this.inputContent = n;
            },
            index(n){
                this.radioIndex = n;
            },
            associatedState(n){
              let t = this;
              if(!n){
                  t.resetData();
              }
            },
            radioIndex(n){
                let t = this;
                if(n==-2){
                    t.inputFocus=true;
                    if(n==-2){
                        $(this.$refs.inputBar).trigger("focus");
                    }
                }
                t.changeComponentData({HandleId:t.HandleId,index:n,contentDes:t.inputContent});
                if(t.HandleId>0){
                    if(n==-1){
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:-1});
                    }else{
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                    }
                }
                t.changeRelationship(t.radioIndex);
                n>=0?t.testDes='':'';

            },
            templateAssemblePageOnOff(n){
                let t = this;
              if(n&&t.radioIndex!=-1){
                  t.changeRelationship(t.radioIndex);
              }
            },
            associatedRole(n){
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            clickNum(n){
                let t = this;
                if(t.radioIndex<0){
                    if(t.isRequired){
                        t.testDes = '请输入'+t.labelName;
                    }
                }
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','checkRelationship']),
            resetData(){
              let t = this;
              t.radioIndex = -1;
              t.inputContent = '';

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
            checkInvalid:(val)=>{
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            changeRelationship(n){
              let t = this;
                if((t.radioListDemo[n])&&t.radioListDemo[n].relationId){
                    //console.log(t.radioListDemo[n].relationId);
                    t.checkRelationship({
                        relationId:t.radioListDemo[n].relationId,
                        handleId:t.HandleId
                    });

                }else if(n==-2){
                    let lastOne = t.radioListDemo.length-1;
                    if((t.radioListDemo[lastOne])&&t.radioListDemo[lastOne].relationId){
                        t.checkRelationship({
                            relationId:t.radioListDemo[lastOne].relationId,
                            handleId:t.HandleId
                        });
                    }
                }else if(n==-1){
                    t.checkRelationship({
                        relationId:[],
                        handleId:t.HandleId
                    });
                }

            },
            restoreData(){
              let t = this;
                 t.radioIndex=t.restore.radioIndex;
                 t.inputContent=t.restore.inputContent;
            },
            cancelDialog(){
             let t = this;
             t.restoreData();
             t.hideDialog();
            },
            ensureRadio(){
                let t = this;
                t.hideDialog();
            },
            hideDialog(){
              let t = this;
                t.dialogOnOff = false;
            },
            showDialog(){
                let t = this;
                t.restore.radioIndex = t.radioIndex;
                t.restore.inputContent = t.inputContent;
                t.dialogOnOff = true;
            },
            selectRadio(index){
                let t = this;
                if(t.labelName!='性别'&&this.radioIndex == index){
                    this.radioIndex = -1;
                }else{
                    this.radioIndex = index;
                }
            }
        },
        mounted(){
            let t = this;
            this.radioIndex = this.index;
            this.inputContent = t.checkInvalid(this.contentDes)?"":this.contentDes;
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
    .newCases .formRadio.formRadioFocus .radioRight div input{
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
        &.selectText{
            vertical-align: top;
            line-height: 17px;
        }
        &.marskText{
            width: auto;
            max-width: 145px;
        }
    }
    /*.formErrorThree{*/
        /*margin-left: 270px;*/
    /*}*/

</style>
