<template>
    <section  v-show="associatedState" :style="{visibility:(parseInt(reallyIsValid,10)===0)?'hidden':''}">
        <upload-column :uploadColumn="uploadData"  @uploadBackInfo="uploadBackInfo" @changeItemRemarks="changeItemRemarks"></upload-column>
    </section>
</template>
<script>
    import uploadColumn from '~components/uploadColumn/uploadColumn';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            reallyIsValid:{
                default:'1'
            },
            labelName:{
                default:''
            },
            maxLen:{
                default:''
            },
            contentDes:{
                default:''
            },
            attVideoList:{
                default:[]
            },
            relatedParentId:{
                default:0
            },
            associatedRole:{
                default:false
            },
            attPicList:{
                default:[]
            },
            HandleId:{
                default:0
            },
            groupId:{
                default:''
            },
            detailId:{
                default:''
            },
            CaseId:{
                default:''
            },
            componentId:{
                default:''
            }

        },
        data() {
            let t = this;
            return {
                uploadData:{
                    ImgList:[],
                    VideoList:[],
                    textVal:'',
                    structureId:'',
                    menuName:'',
                    textAreaLimt:500,
                    associatedState:false,
                    caseId:'',
                    status:true,
                    HandleId:t.HandleId
                },
                copyData:{},
                associatedState:false,
                HandleParentId:''
            }
            },
        computed:{
            ...mapGetters(['Relationship','globalEvent','clickNum','pageInfo'])
        },
        watch:{
            labelName(n){
                let t = this;
                t.uploadData.menuName = n;
            },
            Relationship(n){//当接收到组件被操作的时候触发
                let t = this;
                //console.log(n.handleId,t.HandleParentId);
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
            maxLen(n){
                let t = this;
                t.uploadData.textAreaLimt = n;
            },
            contentDes(n){
                let t = this;
                t.uploadData.textVal = n;
            },
            attVideoList(n){
                let t = this;
                t.uploadData.VideoList = JSON.parse(n);
            },
            attPicList(n){
                let t = this;
                t.uploadData.ImgList = JSON.parse(n);
            },
            CaseId(n){
                let t = this;
                t.uploadData.caseId = n;
            }
        },
        components: {
            uploadColumn
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','changeUploadState','changeUploadError']),
            resetData(){
               let t = this;
               t.uploadData = t.copyData;
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
            checkInvalid(val){
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            uploadBackInfo(data){
                let t = this;
                console.log(data);
                let filterDeleteData = (copyList)=>{
                    let oriArr = JSON.parse(JSON.stringify(copyList));
                    let resultArr = [];
                    for(let num = 0;num<oriArr.length;num++){
                        if(oriArr[num].nodeId){
                            continue;
                        }else{
                            resultArr.push(oriArr[num]);
                        }
                    }
                    return resultArr;
                };
                let initRemarks = (list)=>{
                    let originalList = JSON.parse(JSON.stringify(list));
                    console.log(originalList);
                    for(let num = 0;num<originalList.length;num++){
                        let val = $("[data-id="+originalList[num]['id']+"]").find(".remarkMaskEditPanel").attr("remarkvalue");
                        console.log(originalList[num]['id']);
                        let remark = t.checkInvalid(val)?'':val;
                        console.log(remark);
                        if(t.checkInvalid(originalList[num]['remarks'])){
                            originalList[num]['remarks'] = remark;
                        }
                    }
                    return originalList;
                }
                t.changeUploadState({HandleId:data[0].uploadInfo.HandleId,status:data[2].uploadVideoStatus&&data[1].uploadImgStatus});
                //console.log(t.HandleId,data[0].uploadInfo.imgErrLength>0,data[0].uploadInfo.imgErrLength,data[0].uploadInfo);
                t.changeUploadError({HandleId:t.HandleId,type:'image',status:data[0].uploadInfo.imgErrLength>0});
                //console.log(t.HandleId,data[0].uploadInfo.videoErrLength>0,data[0].uploadInfo.videoErrLength,data[0].uploadInfo);
                t.changeUploadError({HandleId:t.HandleId,type:'video',status:data[0].uploadInfo.videoErrLength>0});
                if(data[2].uploadVideoStatus){
                    t.status = !data[2].uploadVideoStatus;
                    if(data[0].uploadInfo.validVideo.length){//添加用户上传视频
                        t.changeComponentData({HandleId:t.HandleId,handleContent:1,handleList:data[0].uploadInfo.validVideo,handleType:1});
                    }
                    if(data[0].uploadInfo.deletVideo.length){//删除用户选中的视频包含云资料
                        t.changeComponentData({HandleId:t.HandleId,handleContent:1,handleList:filterDeleteData(data[0].uploadInfo.deletVideo),handleType:0});
                    }
                }else{
                    t.status = data[2].uploadVideoStatus;
                }
                if(data[0].uploadInfo.noteImgid.length){//添加云资料相关图片
                    t.changeComponentData({HandleId:t.HandleId,handleContent:2,handleList:initRemarks(data[0].uploadInfo.noteImgid,1),handleType:1});
                }
                if(data[0].uploadInfo.noteVideoId.length){//添加云资料相关视频
                    t.changeComponentData({HandleId:t.HandleId,handleContent:3,handleList:initRemarks(data[0].uploadInfo.noteVideoId,2),handleType:1});
                }
                if(data[1].uploadImgStatus){
                    if(data[0].uploadInfo.validImg.length){//添加用户上传图片
                        t.changeComponentData({HandleId:t.HandleId,handleContent:0,handleList:data[0].uploadInfo.validImg,handleType:1});
                    }
                    if(data[0].uploadInfo.deletImg.length){//删除用户选中的图片包含云资料
                        t.changeComponentData({HandleId:t.HandleId,handleContent:0,handleList:filterDeleteData(data[0].uploadInfo.deletImg),handleType:0});
                    }
                    t.status = !data[1].uploadImgStatus;
                }else{
                    t.status = data[1].uploadImgStatus;
                }
                t.changeComponentData({HandleId:t.HandleId,handleContent:4,contentDes:data[0].uploadInfo.remarks});

            },
            changeItemRemarks(data){
                let t = this;
                t.changeComponentData({HandleId:t.HandleId,handleContent:5,remarksJson:data});
                console.log(data);
            }
        },
        mounted(){
            let t = this;

            t.uploadData.menuName = t.labelName;
            t.uploadData.structureId = t.componentId;
            t.uploadData.textAreaLimt = isNaN(parseInt(t.maxLen,10))?500:t.maxLen;
            t.uploadData.textVal = decodeURIComponent(t.contentDes);
            t.uploadData.caseId = t.CaseId;
            t.uploadData.VideoList = JSON.parse(t.attVideoList);
            t.uploadData.ImgList = JSON.parse(t.attPicList);
            t.copyData = JSON.parse(JSON.stringify(t.uploadData));
            this.associatedState = !(this.associatedRole=='true');
            this.HandleParentId = this.relatedParentId;
            t.ensureRelationship();
        }
    }
</script>
