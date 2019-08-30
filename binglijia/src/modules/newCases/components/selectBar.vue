<template>
    <div class="formSelect formCommon formContentLr" v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <p class="articleText"><i v-if="isRequired">*</i>{{labelName}}</p>
        <div class="selectCont" @click.stop="toggleSelect" ref="selectBar">
            <span class="formSelectIcon">R</span>
            <span v-text="(selectContent.length)?selectContent:'请选择'" class="formSelectItem"></span>
            <section class="lookMore" v-show="hoverContent.length" v-text="hoverContent" ref="hoverContent"></section>
            <ul class="selectOption" v-show="selectOnOff">
                <li v-for="(item,index) in selectData" :key="index" v-text="item.selectName" @click.stop="changeSelect(index)" @mouseover="hoverStart($event,item.selectName)" @mouseout="hoverEnd"></li>
            </ul>
        </div>
        <p class="formError" v-text="testDes"></p>
    </div>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';
    const $ = require('jquery');
    export default {
        props:{
            SelectList:{
                type:String
            },
            reallyIsValid:{
                default:'1'
            },
            index:{
                default:'-1'
            },
            HandleId:{
              default:''
            },
            isRequired:{
                type:Boolean,
                default:false
            },
            labelName:{
                type:String,
                default:''
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
            }
        },
        data(){
            return {
                selectOnOff:false,
                selectIndex:-1,
                selectData:'[]',
                hoverContent:'',
                associatedState:false,
                HandleParentId:'',
                testDes:''
            }
        },
        computed: {
            ...mapGetters(['clickNum','globalEvent']),
            selectContent(){
                let t = this;
                return (parseInt(t.selectIndex,10)<0)?'':(t.selectData[t.selectIndex]&&t.selectData[t.selectIndex].selectName)?t.selectData[t.selectIndex].selectName:'';
            }
        },
        updated(){
            let t = this;
            let moreElement = $(".lookMore");
            moreElement.css({'top':parseInt(moreElement.css('top'))-$(t.$refs.hoverContent).height()/2-2})
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
            associatedState(n){
                let t = this;
                if(!n){
                    t.resetData();
                }
            },
            selectIndex(n){
                let t = this;
                //console.log(n);
                if(n>=0){
                    n>0?t.testDes='':'';
                    t.changeComponentData({HandleId:t.HandleId,index:n});
                    t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                }
            },
            hoverContent(){
                ////console.log($(this.$refs.hoverContent).height());
            },
            index(n){
                this.selectIndex = n;
            },
            SelectList(n){
                //console.log(n);
                this.selectData=JSON.parse(n);
            },
            associatedRole(n){
                this.associatedState = !(n=='true');
            },
            relatedParentId(n){
                this.HandleParentId = n;
            },
            clickNum(){
                let t = this;
                if(t.selectIndex<0&&t.isRequired){
                    t.testDes = '请输入'+t.labelName;
                }

            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult']),
            resetData(){
                let t = this;
                t.selectIndex = -1;
            },
            toggleSelect(){
                let t = this;
                t.selectOnOff = !t.selectOnOff;
            },
            changeSelect(index){
                let t = this;
                //console.log(index);
                t.selectIndex = index;
                t.selectOnOff = false;
            },
            hoverStart(e,str){
                let t = this;
                $(".lookMore").css({'top':($(e.target).offset().top-$(t.$refs.selectBar).offset().top-13)+'px'});
                if(str.length>8){
                    t.hoverContent = str;
                }else{
                    t.hoverContent = '';
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
            hoverEnd(){
                let t = this;
                t.hoverContent = '';
            }
        },
        mounted(){
            let t = this;
            t.selectIndex = t.index;
            this.selectData=JSON.parse(this.SelectList);
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
           // t.ensureRelationship();
        }
    }
</script>
<style scoped lang="scss">
    .alEmr-indexInner{
        .formContentLr{
            .selectCont{
                padding-left: 0;
                width: 247px;
                .formSelectIcon{
                    display: inline-block;
                    width:44px;
                    height:40px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    text-align: center;
                    line-height: 40px;
                    border-right:1px solid #c8c8c8;
                }
                .formSelectItem{
                    width: 73%;
                    padding-left: 55px;
                }
                .selectOption{
                    left: 44px;
                    width: 183px;
                }
            }
        }
    }

</style>
