<template>
    <aside class="caseHistoryMsg formCommon"   :class="{'formContentLr':(isBothSides==1)}" v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <h3 v-if="title.length" v-text="title"></h3>
        <article v-text="titleDes" v-show="titleDes.length"></article>
        <p class="articleText" v-text="labelName"   v-if="sideType!=2" v-show="labelName.length"></p>
        <div class="textarea"  :class="{'focusBorder':inputFocus}">
            <span class="formSelectIcon" v-text="sideType==1?'L':'R'"></span>
            <textarea  :placeholder="placeholder" v-model="inputContent"  @focus.stop="inputFocus=true" @blur.stop="inputFocus=false"></textarea>
            <i  v-text="maxLen-inputContent.length" v-show="maxLen-inputContent.length<=20" :style="{'color':(maxLen-inputContent.length==0)?'red':''}"></i>
        </div>
    </aside>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import regularTest from '~utils/regularTest.js';
    export default {
        props:{
            maxLen:{
                default:''
            },
            reallyIsValid:{
                default:'1'
            },
            titleDes:{
                type:String,
                default:''
            },
            title:{
                type:String,
                default:''
            },
            HandleId:{
                default:0
            },
            subTitle:{
                type:String,
                default:''
            },
            contentDes:{
                type:String,
                default:''
            },
            isBothSides:{
                default:0
            },
            sideType:{
                default:1
            },
            testRule:{
                type:String,
                default:''
            },
            labelName:{
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
            }
        },
        data(){
            return{
                inputStart:false,
                //inputError:false,
                inputFocus:false,
                inputContent:'',
                associatedState:false,
                HandleParentId:'',
                inputFocusTime:0
            }
        },
        mounted(){
            let t = this;
            ////console.log(this.maxLen,this.contentDes.length)
            this.inputContent = decodeURIComponent(t.contentDes);
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            t.ensureRelationship();
        },
        methods:{
            ...mapActions(['setTopNavTitle','changeComponentData','changeComponentTestResult']),
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
            resetData(){
                let t = this;
                t.inputContent = '';
            }
        },
        computed:{
            ...mapGetters(['titleName','Relationship','pageInfo']),
            inputError(){
                ////console.log(regularTest[this.testRule])
                if(this.testRule.indexOf(',')>-1){
                    let rules = this.testRule.split(',');
                    let min  = rules[0];
                    let max  = rules[1];
                    return (this.testRule)&&(!((parseInt(this.inputContent)>=min)&&(parseInt(this.inputContent)<=max)))&&(this.inputStart);
                }else{
                    return (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart);
                }
            },
            passOnOff(){
                return (!this.inputError)?1:0;
            }
        },
        watch:{
            Relationship(n){//当接收到组件被操作的时候触发
                ////console.log('我是文本层');
                let t = this;
                if(n.handleId==t.HandleParentId){//执行的父组件是我的父组件
                   // debugger;
                    let hasHandle = false;
                    for(let num = 0;num<n.relationId.length;num++){
                        if(n.relationId[num]==t.HandleId){
                            hasHandle = true;
                        }
                    }
                    t.associatedState = hasHandle;
                }
            },
            contentDes(n){
                this.inputContent = n;
            },
            inputContent(newVal){
                let t = this;
                ////console.log(t.titleName);
                //t.setTopNavTitle(newVal);
                (!t.inputStart)?(t.inputStart = true):'';
                (newVal.length>t.maxLen)?(t.inputContent = (t.inputContent).substring(0,t.maxLen)):'';
                t.changeComponentData({HandleId:t.HandleId,contentDes:newVal});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
            },
            associatedRole(n){
                ////console.log('associatedRole',n);
                this.associatedState = !(n=='true');
            },
            associatedState(n){
                let t = this;
                if(!n){
                    t.resetData();
                }
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            inputFocus(n){
                let t = this;
                if(n){
                    t.inputFocusTime++;
                }
                if(t.inputFocusTime==1){
                    if(t.inputContent.length==0&&t.placeholder.length>0&&t.placeholder.indexOf('请输入')==-1){
                        t.inputContent = t.placeholder;
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .newCases{
        .alEmr-indexInner{
            .formContentLr{
                .textarea{
                    width: 309px;
                    height: 82px;
                    .formSelectIcon{
                        display: inline-block;
                        width:48px;
                        height:82px;
                        text-align: center;
                        line-height: 40px;
                        border-right:1px solid #c8c8c8;
                        position: absolute;
                        top: 0;
                        left: 0;
                        font-size: 14px;
                    }
                    textarea{
                        padding-left: 50px;
                        width: 85%;
                    }
                }
                &:nth-child(2){
                    margin-left: 50px;
                }
            }
        }
    }
    .alEmr-indexInner .formCommon .articleText {
         vertical-align: top;
    }
</style>
