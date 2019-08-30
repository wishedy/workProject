<template>
    <div class="alEmr-mainInner newCases">
        <input accept="video/mp4,video/quicktime,video/avi,video/x-ms-wmv,video/x-flv,flv" type="file"/>
        <input accept="video/mp4,video/quicktime,video/avi,video/x-ms-wmv" type="file"/>
       <upload-column :uploadColumn="uploadData" @uploadBackInfo="uploadBackInfo"></upload-column>
       <upload-column :uploadColumn="uploadData"></upload-column>
    </div>
</template>
<script>
    import uploadColumn from '~components/uploadColumn/uploadColumn'
    import comm from "../../utils/comm";
    export default {
        name: 'index-app',
        data() {
            return {
                uploadData:{
                    HandleId:'214213424',
                    detailId:'1511494149727',
                    caseId:'1531547831333',
                    structureId:'1531897817989',
                    groupId:'1',
                    ImgList:[
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312'
                        },
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312'
                        },
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312'
                        },
                    ],
                    VideoList:[
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312',
                            videoPath:''
                        },
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312',
                            videoPath:'https://vpro01.allinmd.cn/1528162686448_1280_720.mp4?1528162800'
                        },
                        {
                            imgSrc:'https://img05.allinmd.cn/public1/M01/13/5A/wKgBMFsrdDeAawYfAALjjAJhig4145_c_p_300_300.png',
                            id:'1212312',
                            videoPath:'https://vpro01.allinmd.cn/1528162686448_1280_720.mp4?1528162800'
                        },
                    ],
                    textVal:'dfdsfasdafdsfsfs',
                    menuName:'术后X片',
                    textAreaLimt:200
                }
            }
        },
        components: {
            uploadColumn,
        },
        methods:{
            uploadBackInfo(data){
                // console.log(data)
            },
            testJson(){
                let dataListArr=[];
                var dataList={};
                $.each(testJson,function(index,ele){
                    dataEach(ele,index);
                });

                function dataEach(ele,index){
                    dataList[index]=ele;
                    dataListArr.push(dataList);
                    // dataListArr.push(dataList);
                    dataList={};
                    if(ele.RadioList&&ele.RadioList.length>0){
                       $.each(ele.RadioList,function (is,es) {
                           if(es.associatedComponent){
                               $.each(es.associatedComponent,function (it,et) {
                                   dataEach(et,it);
                               })
                           }
                       })
                    }
                }
                // console.log(dataListArr)
            },
            testJsonD(){
                let dataListArr=[];
                var dataList={},dataIndex=0;
                // console.log(jsonList)
                let jsonList=testJsonD.responseObject.responseData.data_list;
                for (let i=0;i<jsonList.length;i++){
                    // console.log(jsonList[i].sonList&&i==4)
                    if(jsonList[i].sonList&&i==4){
                        dataEach(jsonList[i].sonList[0],i);
                    }

                }

                function dataEach(ele,index){
                    for(let i=0;i<ele.length;i++){
                        if(!comm.isEmptyObject(ele[i].caseFolderDetail)){
                            dataList[dataIndex+'_'+index+'_'+i]=ele[i].caseFolderDetail;
                            dataList[dataIndex+'_'+index+'_'+i].caseFolderTemplate=ele[i].caseFolderTemplate;
                            dataIndex++;
                            let type=parseInt(ele[i].caseFolderDetail.structureType);
                            if(type==1||type==2||type==3||type==4){
                                let scope=ele[i].caseFolderTemplateScope,contentId=ele[i].caseFolderDetail.content;
                                for(let j=0;j<scope.length;j++){
                                    if(scope[j].dictionaryId==contentId){
                                        if(scope[j].relationMap){
                                            // dataIndex++;
                                            dataEach(scope[j].relationMap,i)
                                        }else {
                                                // dataList[dataIndex+'_'+index+'_'+i].caseFolderTemplateScope=ele[i].caseFolderTemplateScope;
                                            // dataIndex++;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    // if(ele.RadioList&&ele.RadioList.length>0){
                    //     $.each(ele.RadioList,function (is,es) {
                    //         if(es.associatedComponent){
                    //             $.each(es.associatedComponent,function (it,et) {
                    //                 dataEach(et,it);
                    //             })
                    //         }
                    //     })
                    // }
                }
                // console.log(dataList)
                // console.log(dataListArr)
            },
            testJsonDL(){
                var dataList='',dataObj={},dataIndex=0;
                let jsonList=testJsonD.responseObject.responseData.data_list;
                for (let i=0;i<jsonList.length;i++){
                    if(jsonList[i].sonList&&i==4){
                        dataEach(jsonList[i].sonList[0],i,true);
                    }

                }

                function dataEach(ele,index,flag){
                    for(let i=0;i<ele.length;i++){
                        if(!comm.isEmptyObject(ele[i].caseFolderDetail)){
                            dataObj[dataIndex]=dataList;
                            if(flag){
                                dataIndex++;
                                dataList='';
                                dataList+=ele[i].caseFolderTemplate.structureName+'@=@';
                            }
                            let type=parseInt(ele[i].caseFolderDetail.structureType);
                            if(type==1||type==2||type==3||type==4){
                                dataList+=ele[i].caseFolderDetail.formatContent;
                                let scope=ele[i].caseFolderTemplateScope,contentId=ele[i].caseFolderDetail.content;
                                for(let j=0;j<scope.length;j++){
                                    if(scope[j].dictionaryId==contentId){
                                        if(scope[j].relationMap){
                                            dataEach(scope[j].relationMap,i,false)
                                        }
                                    }
                                }
                            }else {
                                dataObj[dataIndex]=dataList;
                                dataList+=ele[i].caseFolderDetail.content;
                            }

                        }


                    }
                }
                // console.log(dataObj)
                // console.log(dataList)
            },
        },
        async mounted() {

        },
        metaInfo: {
            title: '模块3'
        }
    }
</script>
<style lang="scss">
    @import "../../assets/scss/base.scss";
    @import "../../assets/scss/pages/newCases.scss";
    .newCases .uploadConier{
        margin: 0 auto;
    }
</style>
