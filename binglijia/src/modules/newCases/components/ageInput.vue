<template>
    <div class="formInputAge formCommon" v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText"  :class="{'errorText':(testDes.length>0)&&checkAgeInput(0)}"><i v-if="isRequired">*</i>{{labelName?labelName:'年龄'}}</p>
        <div class="ageInput">
            <input class="inputText"  :class="{'error':testDes.length>0||(ageYearError&&loadEnd),'focusBorder':ageYearFocus}" type="text" v-model="ageYear"  @focus.stop="ageYearFocus=true" @blur.stop="ageYearFocus=false"/>
            <span>岁</span>
            <input class="inputText" type="text"  :class="{'error':testDes.length>0||(ageMonthError&&loadEnd),'focusBorder':ageMonthFocus}" v-show='mDTemplateOnOff' v-model="ageMonth"  @focus.stop="ageMonthFocus=true" @blur.stop="ageMonthFocus=false"/>
            <span  v-show='mDTemplateOnOff' >月</span>
            <input class="inputText" type="text"  :class="{'error':testDes.length>0||(ageDayError&&loadEnd),'focusBorder':ageDayFocus}"  v-show='mDTemplateOnOff' v-model="ageDay"  @focus.stop="ageDayFocus=true" @blur.stop="ageDayFocus=false"/>
            <span  v-show='mDTemplateOnOff' >天</span>
        </div>
        <p class="formError" v-text="testDes"></p>
    </div>
</template>
<script>
    import regularTest from '~utils/regularTest.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            contentYear:{
                type:String
            },
            contentMonth:{
                default:''
            },
            reallyIsValid:{
                default:'1'
            },
            contentDay:{
                default:''
            },
            HandleId:{
                default:0
            },
            isRequired:{
                type:Boolean,
                default:false
            },
            testYearRule:{
                type:String,
                default:''
            },
            testMonthRule:{
                type:String,
                default:''
            },
            testDayRule:{
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
                maxYear:5,
                loadEnd:false,
                ageYear:'',
                yearInputStart:false,
                ageYearFocus:false,
                ageMonth:'',
                monthInputStart:false,
                ageMonthFocus:false,
                ageDay:'',
                dayInputStart:false,
                ageDayFocus:false,
                associatedState:false,
                HandleParentId:'',
                testDes:'',
                ageYearError:true,
                ageMonthError:true,
                ageDayError:true

            }
        },
        computed:{
            ...mapGetters(['Relationship','clickNum','pageInfo']),
            passOnOff(){
                let t  = this;
                ////console.log(t.checkError());
                return (!t.checkAgeInput(0)?1:0);
            },
            mDTemplateOnOff(){
                let t = this;
                return t.ageYear.length>0&&t.ageYear<=t.maxYear;
            }
        },
        watch:{
            ageYear(newVal){
                let t = this;
                if(regularTest['isPInt'](newVal)&&newVal.length>0){
                    this.ageYear = newVal*1+'';
                }else if(newVal.length==0){
                    this.ageMonth = '';
                    this.ageDay = '';
                }
                t.checkAgeInput(0);
                t.clearError();
                (!t.yearInputStart)?(t.yearInputStart = true):'';
                //console.log(this.ageYear,this.ageMonth,this.ageDay);
                t.changeComponentData({HandleId:t.HandleId,contentYear:newVal,contentMonth:t.ageMonth,contentDay:t.ageDay});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
            },
            ageMonth(newVal){
                let t = this;
                if(regularTest['isPInt'](newVal)&&newVal.length>0){
                    this.ageMonth = newVal*1+'';
                }
                t.checkAgeInput(0);
                t.clearError();
                (!t.monthInputStart)?(t.monthInputStart = true):'';
                t.changeComponentData({HandleId:t.HandleId,contentYear:t.ageYear,contentMonth:newVal,contentDay:t.ageDay});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
            },
            ageDay(newVal){
                let t = this;
                ////console.log(t.checkError());
                if(regularTest['isPInt'](newVal)&&newVal.length>0){
                    this.ageDay = newVal*1+'';
                }
                (!t.dayInputStart)?(t.dayInputStart = true):'';
                t.checkAgeInput(0);
                t.clearError();
                t.changeComponentData({HandleId:t.HandleId,contentYear:t.ageYear,contentMonth:t.ageMonth,contentDay:newVal});
                t.changeComponentTestResult({HandleId:t.HandleId,testResult:t.passOnOff});
            },
            contentYear(n){
                this.ageYear = n.length>0&&(n*1+'')>=0?(n*1+''):'';
            },
            contentMonth(n){
                this.ageMonth = n.length>0&&(n*1+'')>=0?(n*1+''):'';
            },
            contentDay(n){
                this.ageDay = n.length>0&&(n*1+'')>=0?(n*1+''):'';
            },
            Relationship(n){//当接收到组件被操作的时候触发
                ////console.log(n);
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
            associatedRole(n){
                //////console.log('associatedRole',n);
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            ageDayFocus(n){
                if(!n){
                    let t = this;
                    t.clearError();

                }
            },
            ageMonthFocus(n){
                if(!n){
                    let t = this;
                    t.clearError();

                }
            },
            ageYearFocus(n){
                if(!n){
                    let t = this;
                    t.clearError();
                }

            },
            clickNum(n){
                let t = this;
                if(!t.ageYear&&!t.ageMonth&&!t.ageDay){
                    if(t.isRequired==1){
                        t.testDes = '请输入年龄';
                    }else{
                        t.testDes = '';
                    }
                }
                t.checkAgeInput(1);
            },
            mDTemplateOnOff(n){
                let t = this;
                if(!n){
                    t.ageDay = '';
                    t.ageMonth = '';
                }else{
                    //console.log(t.ageDay,t.ageMonth);
                }
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult']),
            resetData(){
              let t = this;
              t.ageYear = '';
              t.ageMonth = '';
              t.ageDay = '';
            },
            clearError(){
              let t = this;
                if(!t.checkAgeInput(0)){
                    t.ageYearError = false;
                    t.ageDayError = false;
                    t.ageMonthError = false;
                    t.testDes = '';
                }
            },
            checkAgeInput(type){
              let t = this;
              //type等于0只做校验不提示,等于1，校验加提示
              let ageDayError = true;
              let ageYearError = true;
              let ageMonthError = true;
                if(t.ageYear.length==0&&t.ageMonth.length==0&&t.ageDay.length==0&&(!t.isRequired)){
                    ageDayError= false;
                    ageYearError = false;
                    ageMonthError = false;
                    t.testDes = '';
                    //console.log(122);
                }else if(t.ageYear.length==0&&t.ageMonth.length==0&&t.ageDay.length==0&&(t.isRequired)){
                    ageDayError= true;
                    ageYearError = true;
                    ageMonthError = true;
                    type?t.testDes = '请输入'+t.labelName:'';
                    //console.log(222);
                }else if((t.ageYear.length>0&&t.ageYear!=0&&!(regularTest['isPInt'](t.ageYear)))||(t.ageMonth.length>0&&t.ageMonth!=0&&!(regularTest['isPInt'](t.ageMonth)))||(t.ageDay.length>0&&t.ageDay!=0&&!(regularTest['isPInt'](t.ageDay)))){
                    ageYearError = (t.ageYear.length>0&&!(regularTest['isPInt'](t.ageYear)));
                    ageMonthError = (t.ageMonth.length>0&&!(regularTest['isPInt'](t.ageMonth)));
                    ageDayError = (t.ageDay.length>0&&!(regularTest['isPInt'](t.ageDay)));
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                    //console.log(22);
                }else if(t.ageYear.length>0&&t.ageMonth.length>0&&t.ageDay.length>0&&t.ageYear==0&&t.ageMonth==0&&t.ageDay==0){
                    type?t.testDes = '请输入正确的'+t.labelName:'';
                    //console.log(11);
                    ageDayError= true;
                    ageYearError = true;
                    ageMonthError = true;
                    //console.log(322);
                }else if(t.ageYear.length>0&&t.ageYear==0&&t.ageMonth.length>0&&t.ageMonth!=0&&t.ageDay.length==0){
                    ageDayError= false;
                    ageYearError = false;
                    ageMonthError =t.testContent(t.testMonthRule,t.monthInputStart,t.ageMonth) ;
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                    //console.log(33);
                }else if(t.ageYear.length>0&&t.ageYear==0&&t.ageMonth.length>0&&t.ageMonth==0&&t.ageDay.length==0){
                    ageDayError= false;
                    ageYearError = false;
                    ageMonthError = false;
                    t.testDes = '';
                    //console.log(422);
                }else if(t.ageYear.length>0&&t.ageYear==0&&t.ageMonth.length==0&&t.ageDay.length==0){
                    ageDayError= true;
                    ageYearError = false;
                    ageMonthError = true;
                    type?t.testDes = '请输入'+t.labelName:'';
                }else if(t.ageYear.length>0&&t.ageYear!=0&&t.ageYear<=5&&t.ageMonth.length==0&&t.ageDay.length==0){
                    ageDayError= false;
                    ageYearError = false;
                    ageMonthError = false;
                    t.testDes = '';
                    //console.log(622);
                }else if(t.ageYear.length>0&&t.ageYear!=0&&t.ageYear<=5&&(t.ageMonth.length>0||t.ageDay.length>0)){

                    ageYearError = false;

                    if(t.ageMonth.length!=0){
                        if(t.ageMonth==0){
                            ageMonthError = false;
                        }else{
                            ageMonthError =t.testContent(t.testMonthRule,t.monthInputStart,t.ageMonth) ;
                        }

                    }else{
                        ageMonthError = false;
                    }
                    if(t.ageDay.length!=0){
                        if(t.ageDay==0){
                            ageDayError = false;
                        }else{
                            ageDayError= t.testContent(t.testDayRule,t.dayInputStart,t.ageDay);
                        }
                    }else{
                        ageDayError = false;
                    }
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                     //debugger;
                    //console.log(722);
                }else if(t.ageYear.length>0&&t.ageYear==0&&(t.ageMonth.length>0&&t.ageDay.length>0)){

                    ageYearError = false;

                    if(t.ageMonth.length!=0){
                        if(t.ageMonth==0){
                            ageMonthError = false;
                        }else{
                            ageMonthError =t.testContent(t.testMonthRule,t.monthInputStart,t.ageMonth) ;
                        }

                    }else{
                        ageMonthError = false;
                    }
                    if(t.ageDay.length!=0){
                        if(t.ageDay==0){
                            ageDayError = false;
                        }else{
                            ageDayError= t.testContent(t.testDayRule,t.dayInputStart,t.ageDay);
                        }
                    }else{
                        ageDayError = false;
                    }
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                    //debugger;
                    //console.log(722);
                }else if(t.ageYear.length>0&&t.ageYear!=0&&t.ageYear>5&&(t.ageMonth.length==0&&t.ageDay.length==0)){
                    ageDayError= false;
                    ageYearError = t.testContent(t.testYearRule,t.yearInputStart,t.ageYear);
                    ageMonthError = false;
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                    //console.log(55);
                }else if(t.ageYear.length>0&&t.ageYear==0&&t.ageMonth.length>0&&t.ageMonth==0&&regularTest['isPInt'](t.ageDay)){
                    if(t.ageDay==0){
                        ageDayError = true;
                    }else{
                        ageDayError= t.testContent(t.testDayRule,t.dayInputStart,t.ageDay);
                    }
                    ageYearError = false;
                    ageMonthError = false;
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                }else if(t.ageYear.length>0&&t.ageYear==0&&t.ageDay.length>0&&t.ageDay==0&&regularTest['isPInt'](t.ageMonth)){
                    if(t.ageMonth==0){
                        ageMonthError = true;
                    }else{
                        ageMonthError= t.testContent(t.testMonthRule,t.monthInputStart,t.ageMonth);
                    }
                    ageDayError = false;
                    ageYearError = false;
                    (ageDayError||ageYearError||ageMonthError)?t.testDes = '请输入正确的'+t.labelName:t.testDes='';
                }
                if(type==1){
                    t.ageDayError = ageDayError;
                    t.ageYearError = ageYearError;
                    t.ageMonthError = ageMonthError;
                    t.loadEnd = true;
                }
                //debugger;
                return (ageDayError||ageYearError||ageMonthError);
            },
            testContent(testRule,inputStart,inputContent){
                let errorOnOff = false;
                if(inputContent.length===0){
                    return false;
                }
                if(testRule.indexOf(',')>-1){
                    let rules = testRule.split(',');
                    let min  = rules[0];
                    let max  = rules[1];
                    errorOnOff  =  (!regularTest['isPInt'](inputContent))||(testRule)&&(!((parseInt(inputContent)>=min)&&(parseInt(inputContent)<=max)))&&(inputStart)&&inputContent.length>0;
                }else{
                    errorOnOff =   (!regularTest['isPInt'](inputContent))||(testRule)&&(!regularTest[testRule](inputContent))&&(inputStart)&&inputContent.length>0;
                }
                return errorOnOff;
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

            }
        },
        updated(){
          let t = this;
            if(!t.mDTemplateOnOff){
                t.ageMonth = '';
                t.ageDay = '';
            }
        },
        mounted(){
            let t = this;
            this.ageYear = (this.contentYear.length)>0&&(this.contentYear*1+'')>=0?this.contentYear*1+'':'';
            this.ageMonth = (this.contentMonth.length>0)&&(this.contentMonth*1+'')>=0?(this.contentMonth*1+''):'';
            this.ageDay = (this.contentDay.length>0)&&(this.contentDay*1+'')>=0?(this.contentDay*1+''):'';
            if(this.ageYear.length>0&&this.ageYear==0&&this.ageMonth.length>0&&this.ageMonth==0&&this.ageDay.length>0&&this.ageDay==0){
                this.ageYear ='';
                this.ageMonth = '';
                this.ageDay = '';
            }
            setTimeout(()=>{
               if(!t.mDTemplateOnOff){
                   t.ageMonth = '';
                   t.ageDay = '';
               }
            },300);
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            //this.checkStatus()
            this.ensureRelationship();
        }
    }
</script>
<style>
    .ageInput{
        display: inline-block;
        vertical-align: middle;
    }
</style>
