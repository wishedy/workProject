<template>
    <div class="formNumber formCommon" v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText"  :class="{'errorText':checkMyHandleNumber()?!checkMyHandleNumber():inputError&&loadEnd}"><i v-if="isRequired">*</i>{{labelName}}</p>
        <div class="selectCont selectContChange" @click.stop="toggleSelect" :class="{'selectContError':testDes.length>0}">
            <span v-text="(selectContent.length)?selectContent:'请选择'"  class="formInputSelectItem"></span>
            <ul class="selectOption" v-show="selectOnOff">
                <li v-for="(item,index) in selectInputData" :key='index' v-text="(item&&item.selectName?item.selectName:'')"  @click.stop="changeSelect(index)" class="formInputSelectItem"></li>
            </ul>
        </div>
        <input class="inputCont inputContChange" type="text" placeholder="请输入" v-model="inputContent" :class="{'error':checkMyHandleNumber()?!checkMyHandleNumber():inputError&&loadEnd,'focusBorder':inputFocus}"  @focus.stop="inputFocus=true" @blur.stop="inputFocus=false"/>
        <div class="formInputAdd" v-if="addOnOff" @click.stop="addSelectInput"></div>
        <p class="formError" v-text="testDes"></p>
    </div>
</template>
<script>
    import regularTest from '~utils/regularTest.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            SelectInputList:{
                type:String
            },
            reallyIsValid:{
                default:'1'
            },
            index:{
                default:'-1'
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
            addOnOff:{
                default:false
            }
        },
        data(){
            return{
                mySelfIndex:0,
                repetitionError:false,
                loadEnd:false,
                selectOnOff:false,
                inputContent:'',
                inputFocus:false,
                inputStart:false,
                selectIndex:-1,
                testRule:'',
                testDes:'',
                associatedState:false,
                HandleParentId:'',
                inputError:false
            }
        },
        computed: {
            ...mapGetters(['globalEvent', 'pageInfo', 'numberList', 'numberTrigger', 'clickNum','selectIndexJson']),
            selectInputData() {
                return JSON.parse(this.SelectInputList);
            },
            selectContent() {
                let t = this;
                return (parseInt(t.selectIndex, 10) < 0) ? '' : ((t.selectInputData[t.selectIndex] && t.selectInputData[t.selectIndex].selectName) ? t.selectInputData[t.selectIndex].selectName : '');
            },
            passOnOff() {
                let t = this;
                let result = 1;
                if (t.checkMyHandleNumber()) {
                    result = (!t.checkMyHandleNumber()) ? 1 : 0;
                } else {
                    let checkContentStr = t.trim(this.inputContent);
                    result = !(((this.testRule) && (!regularTest[this.testRule](checkContentStr)) && (this.inputStart) && (checkContentStr.length > 0))) ? 1 : 0;
                }
                return result;
            },
        },
        watch:{
            globalEvent(n){
                let t = this;
                t.selectOnOff = false;
                t.checkInputStatus();
            },
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
            clickNum(){
              let t = this;
              t.changeNumberTrigger();
            },
            inputContent(n){
                let t = this;
                if(t.testRule=='testID'){
                    ((n.length>18))?(t.inputContent = (t.inputContent).substring(0,18)):'';
                }
                ////console.log(regularTest[this.testRule](this.inputContent));
                (!t.inputStart)?(t.inputStart = true):'';
                t.changeComponentData({HandleId:t.HandleId,index:t.selectIndex,contentDes:n});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
                if(!t.inputFocus){
                    t.checkInputStatus();
                }
            },
            selectIndexJson(n){
                let t = this;
                if(t.checkInvalid(JSON.stringify(n))){
                   if(parseInt(n.HandleId)!==0){
                       if(n.HandleId!=t.HandleId){
                           t.selectOnOff = false;
                       }
                   }
                }
            },
            numberTrigger(n){
                let t = this;
                t.checkInputStatus();
            },
            index(n){
                this.selectIndex = n;
            },
            contentDes(n){
                this.inputContent = (this.checkInvalid(n)?n:'');
            },
            selectIndex(n){
                let t = this;
                t.changeNumberTrigger();
                t.changeComponentData({HandleId:t.HandleId,index:n,contentDes:t.inputContent});
                t.testRule = (t.selectInputData[n]&&t.selectInputData[n].testRule)?t.selectInputData[n].testRule:'';
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
            inputError(n){
                let t = this;
                t.ensureDes();
            },
            inputFocus(n){
                let t = this;
                t.checkInputStatus();
                if(!n){
                    t.changeNumberTrigger();
                }
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','changeNumberTrigger','changeSelectIndexJson']),
            trim(s){
                return s.replace(/(^\s*)|(\s*$)/g, "");
            },
            checkMyHandleNumber(){
                let t = this;
                let repetitionOnOff = false;
                let numberList = t.checkNumberList();
                for (let key in numberList) {
                    let arrList = numberList[key];
                    if (arrList.length > 1) {
                        for (let num = 0; num < arrList.length; num++) {
                            //console.log(parseInt(t.HandleId, 10) +"==="+ parseInt(numberList[key][num]['timestamp'], 10))
                            if (parseInt(t.HandleId, 10) === parseInt(arrList[num]['timestamp'], 10)) {
                                repetitionOnOff = true;
                            }
                        }
                    }
                }
                return repetitionOnOff;
            },
            ensureDes(){
              let t = this;
                if(t.inputError){
                    if(t.checkMyHandleNumber()){
                        t.testDes = '编号字段重复请重新选择';
                    }else if(t.testRule&&t.testRule=='testPhoneNum'){
                        t.testDes = '请输入正确的手机号码';
                    }else if(t.testRule&&t.testRule=='testID'){
                        t.testDes = '请输入正确的身份证号';
                    }else if(t.testRule&&t.testRule=='testNum'){
                        t.testDes = '请输入正确的'+t.selectContent;
                    }
                    else{
                        t.testDes = '请勿包含数字或特殊字符';
                    }

                }else{
                    t.testDes = '';
                }
            },
            addSelectInput(){
              let t = this;
              t.$emit('addSelectInputItem');
            },
            resetData(){
                let t = this;
                t.selectIndex = -1;
                t.inputContent = '';
            },
            toggleSelect(){
                let t = this;
                this.selectOnOff = !this.selectOnOff;
                if(t.selectOnOff){
                    t.changeSelectIndexJson({
                        HandleId:t.HandleId
                    });
                }
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
            changeSelect(index){
                let t = this;
                //console.log(index);
                t.selectIndex = index;
                t.selectOnOff = false;
            },
            checkInvalid:(val)=>{
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return false;
                }else{
                    return true;
                }
            },
            checkNumberList(){
                let t = this;
                let list = JSON.parse(JSON.stringify(t.numberList));
                let num = 0;
                let checkList = {};
                for(let key in list){
                    let dataItem = list[key];
                    if(t.checkInvalid(dataItem['contentDes'])){
                        if(checkList[dataItem['index']+'']){
                            dataItem.timestamp = key;
                            checkList[dataItem['index']+''].push(dataItem);
                        }else{
                            checkList[dataItem['index']+''] = [];
                            dataItem.timestamp = key;
                            checkList[dataItem['index']+''].push(dataItem);
                        }
                    }
                    num++;
                }
                return checkList;
            },
            checkInputStatus(){
                let t = this;
                let checkContentStr = t.trim(this.inputContent);
                if(t.checkMyHandleNumber()){
                    t.inputError=t.checkMyHandleNumber();
                }else{
                    t.inputError= ((this.testRule)&&(!regularTest[this.testRule](checkContentStr))&&(this.inputStart)&&(checkContentStr.length>0));
                }
                t.loadEnd = true;
            }
        },
        updated(){
          let t = this;
          if(!t.inputFocus){
              t.checkInputStatus();
              t.changeNumberTrigger();
          }
            t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
          t.ensureDes();
        },
        mounted(){
            let t = this;
            this.selectIndex = this.index;
            this.inputContent = (this.checkInvalid(this.contentDes)?this.contentDes:'');
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            t.ensureRelationship();
        }
    }
</script>
<style lang="scss">
    .newCases{
        .formNumber{
            .selectCont{
                &.selectContChange{width:78px;}
                &.selectContError{
                    box-shadow:0px 0px 4px 0px rgba(243,75,75,0.59);
                    border-radius:4px;
                    border:1px solid rgba(243,75,75,1);
                }
            }
            .inputCont{
                &.inputContChange{
                    width: 232px;
                }
            }
        }
    }
    .formCommon{
        .selectCont{
            .selectOption{
                display: block;
            }

        }
        .formInputAdd{
            vertical-align: middle;
            margin-left: 20px;
            display: inline-block;
            width: 65px;
            height: 40px;
            background:rgba(233,243,255,1);
            border-radius:4px;
            background: url("/static/images/pages/newCases/add.png") no-repeat center center;
            background-size: cover;
            cursor: pointer;
        }

    }

</style>
