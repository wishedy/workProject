<template>
    <div class="formInput formCommon" :class="{'formInput112':unitName,'formContentLr':(isBothSides==1)}"  v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText" :class="{'errorText':inputError&&loadEnd}"  v-show="sideType!=2"><i v-if="isRequired">*</i>{{labelName}}</p>
        <div class="inputCont" :class="{'error':inputError&&loadEnd,'focusBorder':inputFocus}">
            <span class="formSelectIcon" v-text="sideType==1?'L':'R'"></span>
            <input type="text" :placeholder="placeholder" v-model="inputContent"  @focus.stop="inputFocus=true" @blur.stop="inputFocus=false"/>
            <i v-text="maxLen-inputContent.length" v-if="maxLen" v-show="(unitName.length===0)&&maxLen>50"></i>
        </div>
        <span v-text="unitName" v-show="unitName"></span>
        <p class="formError" v-text="testDes"></p>
    </div>
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
            HandleId:{
              default:0
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
            isRequired:{
                type:Boolean,
                default:false
            },
            testRule:{
                type:String,
                default:''
            },
            labelName:{
                type:String,
                default:''
            },
            unitName:{
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
                inputFocusTime:0,
                inputStart:false,
                inputFocus:false,
                inputContent:'',
                associatedState:false,
                HandleParentId:'',
                inputError:true,
                loadEnd:false
            }
        },
        created(){
            let t = this;
            this.inputContent = ((this.contentDes)&&((typeof this.contentDes)=='string'&&this.contentDes.length>0))?this.contentDes:'';
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            t.ensureRelationship();
        },
        methods:{
            ...mapActions(['setTopNavTitle','changeComponentData','changeComponentTestResult']),
            resetData(){
                let t = this;
                t.inputContent = '';
            },
            checkInputStatus(){
                let t = this;
                if(this.testRule.indexOf(',')>-1){
                    let rules = this.testRule.split(',');
                    let min  = rules[0];
                    let max  = rules[1];
                    t.inputError  =  (this.testRule)&&(!(((this.inputContent*1)>=min)&&((this.inputContent*1)<=max)))&&(this.inputStart)&&this.inputContent.length>0;
                }else{
                    t.inputError  = (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart)&&this.inputContent.length>0;
                }
                t.loadEnd = true;
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

            }
        },
        computed:{
            ...mapGetters(['titleName','changePageOnOff','Relationship','clickNum','pageInfo']),
            passOnOff(){
                let errorOnOff = false;
                if(this.inputContent.length===0){
                    return 0;
                }
                if(this.testRule.indexOf(',')>-1){
                    let rules = this.testRule.split(',');
                    let min  = rules[0];
                    let max  = rules[1];
                    errorOnOff  =  (this.testRule)&&(!(((this.inputContent*1)>=min)&&((this.inputContent*1)<=max)))&&(this.inputStart)&&this.inputContent.length>0;
                }else{
                    errorOnOff =   (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart)&&this.inputContent.length>0;
                }
                return (errorOnOff)?0:1;
            },
            testDes(){
                let t = this;
                let testDes = '';
                if(t.loadEnd){
                    if(!t.inputError){
                        if(t.inputContent.length===0){
                            if(t.isRequired==1){
                                testDes = '请输入'+t.labelName;
                            }
                        }else{
                            testDes = '';
                        }
                    }else{
                        if(t.testRule&&t.testRule=='testPhoneNum'){
                            testDes = '请输入正确的手机号码';
                        }else if(t.testRule&&t.testRule=='testID'){
                            testDes = '请输入正确的身份证号';
                        }else if(t.testRule.indexOf(',')>-1){
                            let rules = this.testRule.split(',');
                            let min  = rules[0];
                            let max  = rules[1];
                            if(regularTest['decimals'](t.inputContent)||regularTest['testNum'](t.inputContent)||regularTest['minus'](t.inputContent)){
                                testDes = '请输入'+min+'-'+max+'之间的数字';
                            }else{
                                testDes = `请输入正确的`+t.labelName;
                            }
                        }else if(t.testRule&&t.testRule=='testName'){
                            testDes = '请勿包含数字或特殊字符';
                        }else if(t.testRule.indexOf(',')>-1){
                            testDes = '请勿包含数字或特殊字符';
                        }
                        else{
                            testDes = '请勿包含数字或特殊字符';
                        }

                    }
                }
                return testDes;
            }
        },
        watch:{
            Relationship(n){//当接收到组件被操作的时候触发
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
                ((newVal.length>t.maxLen)&&(t.maxLen))?(t.inputContent = (t.inputContent).substring(0,t.maxLen)):'';

                //console.log(newVal);
                t.changeComponentData({HandleId:t.HandleId,contentDes:newVal});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
                if(!t.inputFocus){
                    t.checkInputStatus();
                }
                if(newVal.length===0){
                    t.changeComponentTestResult({HandleId:t.HandleId,testResult:-1});
                }
            },
            contentDes(n){
                this.inputContent = ((n)&&((typeof n)=='string'&&n.length>0))?n:'';
            },
            passOnOff(n){
                //let t  = this;
                //console.log('改变了对错判断');
            },
            associatedRole(n){
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            clickNum(n){
                let t = this;
                if(t.isRequired&&(t.inputContent.length==0)){
                    t.checkInputStatus();
                }
            },
            testDes(n){
              //console.log(n);
            },
            inputError(n){
                let t = this;
                //console.log(n);

            },
            inputFocus(n){
                let t = this;
                if(!n){
                    t.checkInputStatus();
                }
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
<style scoped lang="scss">
    .newCases{
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
            .formInput112{
                .inputCont{
                    width: 159px;
                    .formSelectIcon{
                        margin: 0;
                    }
                    input{
                        width: 57%;
                       // padding-left: 55px;
                    }
                }
            }
        }
    }
</style>
