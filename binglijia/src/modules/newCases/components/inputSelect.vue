<template>
    <div class="formSelect formCommon"  v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText" :class="{'errorText':loadEnd&&inputError}"><i v-if="isRequired">*</i>{{labelName}}</p>
        <div class="inputSelect">
            <input type="text"  :class="{'focusBorder':inputFocus,'error':loadEnd&&inputError}" @focus.stop="inputFocus=true;" @blur.stop="inputFocus=false" v-model="inputContent"/>
            <div class="SelectCont" @click.stop="toggleSelect"><span  v-text="(selectContent.length)?selectContent:''" class="formInputSelectItem"></span>
                <ul class="selectOption" v-show="selectOnOff">
                    <li v-for="(item,index) in inputSelectData" v-text="(item&&item.selectName)?item.selectName:''" :key="index"  @click.stop="changeSelect(index)" class="formInputSelectItem"></li>
                    <!--<li>天</li> <li>周</li> <li>月</li> <li>年</li> <li>小时</li>-->
                </ul>
            </div>
        </div>
        <p class="formError" v-text="testDes" v-show="loadEnd&&inputError"></p>
    </div>
</template>
<script>
    import regularTest from '~utils/regularTest.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            InputSelectList:{
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
            needInput:{
                type:Boolean,
                default:false
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
            }
        },
        data(){
            return{
                inputSelectData:'',
                selectOnOff:false,
                inputContent:'',
                inputFocus:false,
                loadEnd:false,
                inputStart:false,
                selectIndex:-1,
                testRule:'',
                associatedState:false,
                HandleParentId:'',
                testDes:'',
                inputError:false
            }
        },
        computed: {
            ...mapGetters(['globalEvent','clickNum','pageInfo','Relationship']),
            selectContent(){
                let t = this;
                return (parseInt(t.selectIndex,10)<0)?'':((t.inputSelectData[t.selectIndex]&&t.inputSelectData[t.selectIndex].selectName)?(t.inputSelectData[t.selectIndex].selectName):'');
            },
            passOnOff(){
                return (!(this.checkError()))?1:0;
            }
        },
        watch:{
            globalEvent(n){
                this.selectOnOff = false;
            },
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
            inputContent(n){
                let t = this;
                if(!t.checkError()){
                    t.inputError = t.checkError();
                    t.testDes = '';
                }
                t.changeComponentData({HandleId:t.HandleId,index:t.selectIndex,contentDes:n});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
                (!t.inputStart)?(t.inputStart = true):'';
            },
            associatedState(n){
                let t = this;
                if(!n){
                    t.resetData();
                }
            },
            InputSelectList(n){
                this.inputSelectData = n;
            },
            index(n){
                this.selectIndex = n;
            },
            contentDes(n){
                //console.log(n);
                this.inputContent = (this.checkInvalid(n)?'':n);
            },
            selectIndex(n){
                let t = this;
                t.changeComponentData({HandleId:t.HandleId,index:n,contentDes:t.inputContent});
                t.loadEnd = true;
                if(!t.checkError()){
                    t.inputError = t.checkError();
                    t.testDes = '';
                }
                t.testRule = t.inputSelectData[n]&&t.inputSelectData[n].testRule;
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
            },
            associatedRole(n){
                ////console.log('associatedRole',n);
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            inputFocus(n){
                let t = this;
                if(!n){
                    t.loadEnd = true;
                    if(!t.checkError()){
                        t.inputError = t.checkError();
                        t.testDes = '';
                    }
                }

            },
            clickNum(){
                let t = this;
                t.inputError = t.checkError();
                t.checkTest();
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult']),
            resetData(){
                let t = this;
                t.selectIndex = -1;
                t.inputContent = '';
            },
            toggleSelect(){
                this.selectOnOff = !this.selectOnOff;
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
                    if(index!=-1){
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
            checkError(){
                let t = this;
                if(t.selectIndex>=0){
                    if(t.testRule&&t.testRule.indexOf(',')>-1){
                        //console.log(t.inputContent.length);
                        if(t.inputContent.length==0){
                            return true
                        }else{
                            let errorOnOff = false;
                            let rules = t.testRule.split(',');
                            let min  = rules[0];
                            let max  = rules[1];
                            errorOnOff  =  (!regularTest['isPInt'](t.inputContent))||(t.testRule)&&(!((parseInt(t.inputContent)>=min)&&(parseInt(t.inputContent)<=max)))&&(t.inputStart)&&t.inputContent.length>0;
                            return errorOnOff;
                        }

                    }else{
                        return (this.testRule)&&(!regularTest[this.testRule](this.inputContent))&&(this.inputStart)&&(this.inputContent.length>0)&&t.selectIndex>=0;
                    }
                }else{
                    if(t.inputContent.length){
                        return true;
                    }else{
                        return false;
                    }

                }
            },
            checkTest(){
              let t = this;
                let str = '';
                if(t.inputFocus){
                    //console.log(t.inputError);
                    if(!t.inputError){
                        str = '';
                    }else{
                        str = '请输入正确的'+t.labelName;
                    }
                }else{
                    if(t.inputError){
                        str = '请输入正确的'+t.labelName;
                    }
                }
                t.testDes = str;
            },
        changeSelect(index){
            let t = this;
            t.selectIndex = index;
            t.selectOnOff = false;
          },
            checkInvalid:(val)=>{
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return false;
                }else{
                    return true;
                }
            }
        },
        mounted(){
            this.inputSelectData =  JSON.parse(this.InputSelectList);
            this.selectIndex = this.index;
            this.inputContent = (this.checkInvalid(this.contentDes)?this.contentDes:'');
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            this.ensureRelationship();
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../assets/scss/modules/common-modules";
    .formCommon {
        .articleText{
            width: 145px;
            text-align: right;
            display: inline-block;
            margin-right: 39px;
            &.errorText{
                color: #F34B4B;
            }
        }
        .inputSelect{
            display: inline-block;
            vertical-align: middle;
            @include clearfix();
            input{
                float: left;
                width: 50px;
                height: 64px;
                line-height: 64px;
                padding-left: 20px;
                //font-size: 18px;
                //color: #000000;
                @include fontSize();
                border: 1px solid #C8C8C8;
                border-radius: 4px;
                margin-right: 20px;
                &.error{
                    background: #FFFFFF;
                    border: 1px solid #F34B4B;
                    box-shadow: 0 0 4px 0 rgba(243,75,75,0.59);
                    border-radius: 4px;
                }
            }
            .focusBorder{
                background: #FFFFFF;
                border: 1px solid #2888FF;
                box-shadow: 0 0 4px 0 rgba(67,130,241,0.47);
                border-radius: 4px;
            }
            .SelectCont{
                float: left;
                width: 60px;
                height: 64px;
                border: 1px solid #C8C8C8;
                border-radius: 4px;
                display: inline-block;
                vertical-align: middle;
                position: relative;
                //font-size: 18px;
                //color: #000000;
                @include fontSize(18px,#999);
                line-height: 64px;
                padding-left: 20px;
                &:after {
                    width: 0;
                    height: 0;
                    position: absolute;
                    content: "";
                    border-color: rgba(0, 0, 0, 0.5) transparent transparent;
                    border-style: solid;
                    border-width: 6px;
                    top: 29px;
                    right: 20px;
                }
                .selectOption {
                    position: absolute;
                    top: 66px;
                    padding: 10px;
                    left: 0;
                    width: 60px;
                    //font-size: 18px;
                    //color: #333333;
                    @include fontSize(18px,#333);
                    line-height: 40px;
                    max-height: 271px;
                    background: #FFFFFF;
                    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    display: block;

                    li{
                        padding-left: 6px;
                        cursor: pointer;
                        &:hover{
                            background: rgba(40,136,255,0.1);
                            border-radius: 2px;
                        }
                    }
                }
            }
        }

    }
</style>
