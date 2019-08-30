<template>
    <div class="formSelectS formCommon" v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText">
            <i v-if="isRequired">*</i>
            {{labelName}}
        </p>
        <div class="cont">
            <div class="selectCont" @click.stop="toggleSelect(0)"><span v-text="yearSelectContent"></span>
                <ul class="selectOption" v-show="yearSelectOnOff">
                    <!--<li>2014</li><li>2015</li><li>2013</li><li>2014</li>-->
                    <li v-for="(item,index) in dateData.yearTimeBox" :key="index" v-text="item" @click.stop="changeTime(0,item)"></li>
                </ul>
            </div>
            <b>年</b>
            <div class="selectCont width83" @click.stop="toggleSelect(1)"><span v-text="monthSelectContent"></span>
                <ul class="selectOption" v-show="monthSelectOnOff">
                    <li v-for="(item,index) in dateData.monthTimeBox" :key="index" v-text="item" @click.stop="changeTime(1,item)"></li>
                </ul>
            </div>
            <b>月</b>
            <div class="selectCont width83" @click.stop="toggleSelect(2)"><span v-text="daySelectContent"></span>
                <ul class="selectOption" v-show="daySelectOnOff">
                    <li v-for="(item,index) in dateData.dayTimeBox" :key="index" v-text="item" @click.stop="changeTime(2,item)"></li>
                </ul>
            </div>
            <b>日</b>
        </div>
        <p class="formError" v-text="testDes" v-show="!error"></p>
    </div>
</template>
<script>
    import getDateData from '../assemble/getDateData.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            HandleId:{
                default:0
            },
            reallyIsValid:{
                default:'1'
            },
            yearSelect:{
                default:''
            },
            monthSelect:{
                default:''
            },
            daySelect:{
                default:''
            },
            isRequired:{
                type:Boolean,
                default:false
            },
            relatedParentId:{
                default:0
            },
            associatedRole:{
                default:false
            },
            labelName:{
                type:String,
                default:''
            }
        },
        computed:{
            ...mapGetters(['Relationship','globalEvent','clickNum','pageInfo']),
            error(){
                let t = this;
                let error = true;
                if(((t.yearSelectContent=='')||(t.monthSelectContent=='')||(t.daySelectContent==''))&&((t.yearSelectContent>0)||(t.monthSelectContent>0)||(t.daySelectContent>0))){
                    error = false;
                }else{
                    error = true;
                    t.testDes = '';
                }
                //debugger;
                //console.log(error);
                return error;
            }
        },
        data(){
          return {
              yearSelectOnOff:false,
              yearSelectContent:'',
              monthSelectOnOff:false,
              monthSelectContent:'',
              daySelectOnOff:false,
              daySelectContent:'',
              dateData:{
                  dayTimeBox:[],
                  monthTimeBox:[],
                  yearTimeBox:[]
              },
              associatedState:false,
              HandleParentId:'',
              testDes:''
          }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult']),
            resetData(){
                let t = this;
                t.yearSelectContent = '';
                t.monthSelectContent = '';
                t.daySelectContent = '';
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
            toggleSelect(type){
              let t = this;
              ////console.log(type)
              switch (parseInt(type,10)){
                  case 0:
                      t.yearSelectOnOff = !t.yearSelectOnOff;
                      break;
                  case 1:
                      t.monthSelectOnOff = !t.monthSelectOnOff;
                      break;
                  case 2:
                      t.daySelectOnOff = !t.daySelectOnOff;
                      break;
              }
            },
            changeTime(type,item){
                let t = this;
                switch (type){
                    case 0:
                        t.yearSelectContent = item;
                        t.yearSelectOnOff = false;
                        break;
                    case 1:
                        ////console.log('选择')
                        t.monthSelectContent = item;
                        t.monthSelectOnOff = false;
                        break;
                    case 2:
                        t.daySelectContent = item;
                        t.daySelectOnOff = false;
                        break;
                }
            }
        },
        watch:{
            error(n){
              let t = this;
              if(n){
                  t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
              }else{
                  t.changeComponentTestResult({HandleId:t.HandleId,testResult:0});
              }
            },
            globalEvent(n){
                let t = this;
                t.yearSelectOnOff = false;
                t.monthSelectOnOff = false;
                t.daySelectOnOff = false;
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
                //console.log(t.error);
                if(!t.error){
                    t.testDes = `请输入正确的${t.labelName}`;
                }else{
                    t.testDes = '';
                }
            },
            associatedState(n){
                let t = this;
                if(!n){
                    t.resetData();
                }
            },
            yearSelectContent(newVal){
                let t = this;
                t.dayTimeBox = [];
                t.dayTimeBox = t.dateData.getDayDate(newVal,parseInt(t.monthSelectContent,10));
                t.daySelectContent = '';
                t.changeComponentData({HandleId:t.HandleId,yearSelect:newVal,monthSelect:t.monthSelectContent,daySelect:t.daySelectContent});

            },
            monthSelectContent(newVal){
                let t = this;
                t.dayTimeBox = [];
                t.dayTimeBox = t.dateData.getDayDate(parseInt(t.yearSelectContent,10),newVal);
                t.daySelectContent = '';
                t.changeComponentData({HandleId:t.HandleId,yearSelect:t.yearSelectContent,monthSelect:newVal,daySelect:t.daySelectContent});
            },
            yearSelect(n){
                let t = this;
                this.yearSelectContent = n;

            },
            monthSelect(n){
                let t = this;
                this.monthSelectContent = n;

            },
            daySelect(n){
                let t = this;
                this.daySelectContent = n;
            },
            daySelectContent(n){
                let t = this;
                t.changeComponentData({HandleId:t.HandleId,yearSelect:t.yearSelectContent,monthSelect:t.monthSelectContent,daySelect:n});
            },
            associatedRole(n){
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            }
        },
        mounted(){
            let t = this;
            t.dateData = new getDateData();
            t.yearSelectContent = t.yearSelect;
            t.monthSelectContent = t.monthSelect;
            setTimeout(()=>{
                t.daySelectContent = t.daySelect;
            },500);
            t.associatedState = !(t.associatedRole=='true');
            t.HandleParentId = t.relatedParentId;
            t.ensureRelationship();
        }
    }
</script>
