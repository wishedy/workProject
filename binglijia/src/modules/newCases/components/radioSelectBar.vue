<template>
    <section>
        <div class="formRadio formCommon formRadioFocus" :class="{'formRow':(radioListDemo.length>2)}" v-show="handlerOnOff">
            <p class="articleText"><i v-if="isRequired">*</i>{{radioLabelName}}</p>
            <div class="radioRight">
                <div class='radioIconNormal'  v-for="(item,index) in radioListDemo"   :class="{'active':(index!=rIndex)}" :key="index" @click="(index==0)&&(teamUnAble)?'':selectRadio(index)"><i></i><span  :style="{color:(index==0)&&teamUnAble?'#bbb':''}" v-text="item.radioName"></span></div>
            </div>
        </div>
        <div class="formSelect formCommon" v-show="(rIndex>0)&&handlerOnOff">
            <p class="articleText"><i>*</i>{{selectLabelName}}</p>
            <div class="selectCont" @click.stop="toggleSelect" ref="selectBar">
                <span v-text="(selectContent.length)?selectContent:'请选择'" class="formSelectItem"></span>
                <section class="lookMore" v-show="hoverContent.length" v-text="hoverContent" ref="hoverContent"></section>
                <ul class="selectOption" v-show="selectOnOff">
                    <li v-for="(item,index) in selectData" :key="index" v-text="item.selectName" @click.stop="changeSelect(index)"  @mouseover="hoverStart($event,item.selectName)" @mouseout="hoverEnd"></li>
                </ul>
            </div>
            <p class="formError" v-text="testDes" v-show="loadOnOff"></p>
        </div>
        <div class="formSelect formCommon" v-show="rIndex>0">
            <p class="articleText"><i>*</i>{{selectSecondLabelName}}</p>
            <div class="selectCont" @click.stop="toggleSecondSelect" ref="selectBar">
                    <span v-text="(selectSecondContent.length)?selectSecondContent:'请选择'" class="formSelectItem"></span>
                <section class="lookMore lookSecondMore" v-show="hoverSecondContent.length" v-text="hoverSecondContent" ref="hoverSecondContent"></section>
                <ul class="selectOption" v-show="selectSecondOnOff&&assistantDoctor&&handlerOnOff">
                    <li v-for="(item,index) in teamMember" :key="index" v-text="item.customerName" @click.stop="changeSecondSelect(index)"  @mouseover="hoverSecondStart($event,item.customerName)" @mouseout="hoverSecondEnd"></li>
                </ul>
            </div>
            <p class="formError" v-text="testSecondDes"></p>
        </div>
    </section>
</template>
<script>
    import comm from '~utils/comm.js';
    const $ = require('jquery');
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            RadioList:{
                type:String
            },
            SelectList:{
              type:String
            },
            radioIndex:{
                default:'-1'
            },
            selectIndex:{
                default:'0'
            },
                HandleId:{
                    default:0
                },
            isRequired:{
                type:Boolean,
                default:false
            },
            radioLabelName:{
                type:String,
                default:''
            },
            selectLabelName:{
                type:String,
                default:''
            },
            selectSecondLabelName:{
                type:String,
                default:''
            },
        },
        data(){
            return {
                cid:comm.cookie.get("userId"),
                rIndex:-1,
                sIndex:0,
                sMIndex:0,
                testDes:'',
                testSecondDes:'',
                selectOnOff:false,
                selectSecondOnOff:false,
                selectData:[],
                hoverContent:'',
                hoverSecondContent:'',
                radioListDemo:[],
                associatedState:false,
                HandleParentId:'',
                teamMember:[],
                handlerOnOff:true,
                loadOnOff:false,
                dId:(comm.getParamFromUrl(document.URL,'doctorId')||'0').replace(/[^0-9]/ig,"")
            }
        },
        computed:{
            ...mapGetters(['clickNum','globalEvent','teamId','teamList','CaseBelongType','assistantDoctor','customerName','temTeamData','doctorId','teamCustomerId','CaseId']),
            selectContent(){
                let t = this;
                if((parseInt(t.sIndex,10))>=0&&t.selectData.length>0){
                    if(parseInt(t.sIndex,10)>=0){
                        comm.ajax2({
                            url: "/call/caseFolder/team_member/getDoctorListByTeamId/",
                            type: "POST",
                            data: {
                                paramJson: JSON.stringify({
                                    customerId: comm.cookie.get("userId"),
                                    teamId:t.selectData[t.sIndex].selectId
                                })
                            },
                            success:function(res){
                                t.teamMember = res.responseObject.responseData.data_list;
                                t.checkSmIndex();

                            }
                        });
                    }
                    console.log(t.sIndex+'@@@@@@@@@@');
                    return (parseInt(t.sIndex,10)<0)?'':(t.selectData[t.sIndex]&&t.selectData[t.sIndex].selectName)?t.selectData[t.sIndex].selectName:'';
                }else{
                    return '';
                }
            },
            selectSecondContent(){
                let t = this;
                if(t.assistantDoctor){
                    if((parseInt(t.sMIndex,10))>=0&&t.teamMember.length>0){
                        t.changeComponentData({
                            HandleId: t.HandleId,
                            radioIndex: t.rIndex,
                            SelectList: t.selectData,
                            selectIndex: t.sIndex,
                            doctorId:t.teamMember[t.sMIndex]['customerId']
                        });
                        return (parseInt(t.sMIndex,10)<0)?'':(t.teamMember[t.sMIndex]&&t.teamMember[t.sMIndex].customerName)?t.teamMember[t.sMIndex].customerName:'';
                    }else{
                        return '';
                    }
                }else{
                    if(parseInt(t.rIndex,10)){
                        t.changeComponentData({
                            HandleId: t.HandleId,
                            radioIndex: t.rIndex,
                            SelectList: t.selectData,
                            selectIndex: t.sIndex,
                            doctorId:comm.cookie.get("userId")
                        });
                        if(parseInt(t.sIndex,10)>=0){
                            t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                        }
                    }
                    return t.customerName;
                }
            },
            teamUnAble(){
                let t = this;
                return (t.rIndex==0&&t.selectData.length==0);
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','getTeamList','changeCaseBelong','changeCaseBelongCid','changeTemTeam','saveDoctorId']),
            sureHandler(){
              let _this = this;
              if(!_this.assistantDoctor){
                  //医生
                  if((parseInt(_this.teamCustomerId,10)!==parseInt(_this.cid,10))&&(parseInt(_this.CaseId,10)>1000)){
                      if(parseInt(_this.CaseBelongType,10)===1){
                          _this.handlerOnOff = false;
                      }
                  }
              }
            },
            toggleSelect(){
                let t = this;
                t.selectOnOff = !t.selectOnOff;
            },
            toggleSecondSelect(){
                let t = this;
                t.selectSecondOnOff = !t.selectSecondOnOff;
            },
            selectRadio(index){
                let t = this;
                if(!t.assistantDoctor){
                    if(index==0){
                        t.rIndex = 1;
                    }else{
                        t.rIndex = 0;
                    }
                }
            },
            changeSelect(index){
                let t = this;
                t.sIndex = index;
                t.selectOnOff = false;
            },
            changeSecondSelect(index){
                let t = this;
                t.sMIndex = index;
                t.selectSecondOnOff = false;
            },
            checkStatus(){
                let t = this;
                if(t.rIndex==1&&t.sIndex<0){
                    t.testDes = '请输入归属团队';
                }else{
                    t.testDes = '';
                }
            },
            checkSecondStatus(){
                let t = this;
                if((parseInt(t.doctorId,10)<=0)&&(t.checkInvalid(t.selectSecondContent))){
                    t.testSecondDes = '请输入主管医生';
                }else{
                    t.testSecondDes = '';
                }
            },
            hoverStart(e,str){
                let t = this;
                $(".lookMore").css({'top':($(e.target).offset().top-$(t.$refs.selectBar).offset().top-13)+'px'});
                if(comm.getByteLen(str)>58){
                    t.hoverContent = str;
                }else{
                    t.hoverContent = '';
                }
            },
            hoverSecondStart(e,str){
                let t = this;
                $(".lookSecondMore").css({'top':($(e.target).offset().top-$(t.$refs.selectBar).offset().top-13)+'px'});
                if(comm.getByteLen(str)>58){
                    t.hoverSecondContent = str;
                }else{
                    t.hoverSecondContent = '';
                }
            },
            hoverEnd(){
                let t = this;
                t.hoverContent = '';
            },
            hoverSecondEnd(){
                let t = this;
                t.hoverSecondContent = '';
            },
            checkSmIndex(){
                let t = this;
                for(let num = 0;num<t.teamMember.length;num++){
                    t.teamMember[num]['customerId']==t.doctorId?t.sMIndex=num:'';
                }
            },
            checkInvalid(val){
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
        },
        watch:{
            sMIndex(n){
              let t = this;
                if(t.HandleId) {
                    if (n >= 0) {
                        t.changeComponentData({
                            HandleId: t.HandleId,
                            radioIndex: t.rIndex,
                            SelectList: t.selectData,
                            selectIndex: t.sIndex,
                            doctorId:t.teamMember[n]['customerId']
                        });
                    }
                }
            },
            doctorId(n){
               let t = this;
               if(parseInt(n,10)===0){
                   t.changeComponentTestResult({HandleId:t.HandleId,testResult:0});
               }
               t.checkSmIndex();
            },
            temTeamData(n){
                let t = this;
                if (n){
                    if(!t.checkInvalid(n.teamId)){
                        /*comm.ajax2({
                            url: "/call/caseFolder/team_member/getDoctorListByTeamId/",
                            type: "POST",
                            data: {
                                paramJson: JSON.stringify({
                                    customerId: comm.cookie.get("userId"),
                                    teamId:n.teamId
                                })
                            },
                            success:function(res){
                                t.teamMember = res.responseObject.responseData.data_list;
                                t.checkSmIndex();

                            }
                        });*/
                    }
                }
            },
            rIndex(n){
                let t = this;
                //t.sIndex = -1;
                if(t.HandleId){
                    if(n>=0){
                        t.changeComponentData({HandleId:t.HandleId,radioIndex:n,SelectList:t.selectData,selectIndex:t.sIndex});
                    }else{
                        t.changeComponentData({HandleId:t.HandleId,radioIndex:n,SelectList:t.selectData,selectIndex:t.sIndex});
                    }
                    if(n==0){
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                        t.changeComponentData({
                            HandleId: t.HandleId,
                            radioIndex: t.rIndex,
                            SelectList: t.selectData,
                            selectIndex: t.sIndex,
                            doctorId:''
                        });
                    }else if((n==1&&t.sIndex<0)||(n==1&&(parseInt(t.doctorId,10)<=0))){
                        t.changeComponentTestResult({HandleId:t.HandleId,testResult:0});
                    }
                    t.changeCaseBelong(n);
                }
            },
            CaseBelongType(n){
              let t = this;
              if(parseInt(n,10)===0){
                  t.changeCaseBelongCid(comm.cookie.get("userId"));
              }else{
                  t.changeTemTeam(t.teamList[0]);
              }
              //console.log(t.teamList);
            },
            teamId(n){
                let t = this;
                for(let num = 0;num<t.teamList.length;num++){
                    if(n==t.teamList[num].teamId){
                        t.sIndex = num;
                    }
                }
            },
            teamList(n){
                let t = this;
                for(let num = 0;num<n.length;num++){
                    if(t.teamId==n[num].teamId){
                        t.sIndex = num;
                    }
                }

            },
            RadioList(n){
                let t = this;
                this.radioListDemo = JSON.parse(n);
            },
            selectIndex(n){
                let t = this;
                this.sIndex = n;
            },
            clickNum(n){
              let t = this;
              t.checkStatus();
              t.checkSecondStatus();
            },
            sIndex(n){
              let  t = this;
              t.changeTemTeam(t.teamList[n]);
              t.checkStatus();
              t.checkSecondStatus();
              t.changeComponentData({HandleId:t.HandleId,selectIndex:n,SelectList:t.selectData});
              n>=0?t.changeComponentTestResult({HandleId:t.HandleId,testResult:1}):'';
            },
            SelectList(n){
                let t = this;
                this.selectData=JSON.parse(n);
            },
            selectData(n){
               let t = this;
                t.changeComponentData({HandleId:t.HandleId,SelectList:n,selectIndex:t.sIndex});
            },
            radioIndex(n){
                let t = this;
                this.rIndex = n;/*(n>0)?0:1*/
            },
            globalEvent(n){
                this.selectOnOff = false;
            }
        },
        updated(){
          let t = this;
            t.checkStatus();
            t.sureHandler();
            t.checkSecondStatus();
            let moreElement = $(".lookMore");
            moreElement.css({'top':parseInt(moreElement.css('top'))-$(t.$refs.hoverContent).height()/2-2});
        },
        mounted(){
            let t = this;
            if(parseInt(t.dId,10)){
                t.saveDoctorId(parseInt(t.dId,10));
            }else{
                t.saveDoctorId('');
            }
            t.getTeamList(()=>{
              t.loadOnOff = true;
            });
            t.radioListDemo = JSON.parse(t.RadioList);
            t.selectData=JSON.parse(t.SelectList);
            t.sIndex = t.selectIndex;
            t.rIndex = (t.radioIndex);
            setTimeout(()=>{
                t.selectData.length===0?t.sIndex=-1:'';
            },300);
        }
    }
</script>
