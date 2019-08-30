<template>
    <div class="formTag formCommon">
        <p class="articleText" v-if="labelName.length" v-text="labelName"></p>
        <div class="tagCont">
            <ul>
                <li v-for="(sortItem,sortIndex) in sortTagList" :class="{'addTag':sortItem.selectOnOff}" @click.stop="changeSortState(sortIndex)">{{sortItem.tagName}}</li>
                <!--<li @click.stop="changeState(defaultIndex)" v-for="(defaultItem,defaultIndex) in defaultList"  :class="{'addTag':defaultItem.addTag}">{{defaultItem.tagName}}</li>
                <li v-for="(item,index) in tagList"  :class="{'addTag':item.isSelect}" :tag="item.isSelect" :key="item.id" @click.stop="removeTagList(1,index)" >{{item.tagName}}</li>-->
            </ul>
            <div class="addTagBtn" v-show="!addOnOff" @click="inputTag"><i></i></div>
            <div class="tagInput"  v-show="addOnOff">
                <div class="tagInputCont"> <input type="text" @focus.stop="inputFocus = true;" @blur.stop="inputFocus = false;" placeholder="输入新标签" v-model="appendTagName" @keydown.enter="appendTagList"/><i v-text="(maxLen-appendTagName.length)"></i></div>
                <p @click.stop="appendTagList" :class="{'active':appendTagName.length}">添加</p>
            </div>
            <p class="formError" v-text="testDes"></p>
        </div>
    </div>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from '~utils/comm.js';
    const $ = require('jquery');
    export default {
        props:
            {
                contentTagList:{
                    type:String,
                    default:'[]'
                },
                labelName:{
                    type:String,
                    default:''
                },
                maxLen:{
                    default:''
                },
                HandleId:{
                    default:0
                }
            },
        data(){
            return{
                addOnOff:false,
                tagList:[],
                sortTagList:[],
                defaultList:[],
                appendTagName:'',
                inputFocus:false,
                loadEnd:false
            }
        },
        methods:{
            ...mapActions(['changeComponentData','changeComponentTestResult','saveTagId','updateTagId','saveBaseInfoTagIdSelectList','saveTagIdSelectList']),
            saveUserTag(tagType,tagName,callBack,tagItem){
                let t = this;
                comm.ajax2({
                    url: "/call/comm/tag/saveUserTag/",
                    type: "POST",
                    data: {
                        paramJson:JSON.stringify({
                            tagType:tagType,
                            isDelete:'0',
                            tagName:tagName,
                            customerId:comm.cookie.get("userId")
                        })
                    },
                    success:function(res){
                        callBack&&callBack(res);
                        let tagId = res.responseObject.responseData.tagData.tagId;
                        comm.ajax2({
                            url: "/call/caseFolder/tag/create/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify({
                                    caseId:t.CaseId,//	string	是	病历Id
                                    tagId:res.responseObject.responseData.tagData.tagId,//string	是	标签ID
                                    tagType:tagType,
                                    tagName:tagName,
                                    customerId:comm.cookie.get("userId")
                                })
                            },
                            success:function(res){
                                if(res.responseObject.responseStatus){
                                    let id = res.responseObject.responsePk;
                                    tagItem?tagItem.id = id:t.tagList[t.tagList.length-1].id = id;
                                    t.saveTagIdSelectList({type:'add',tagId:tagId});
                                    t.saveTagId(id);
                                }
                            }
                        })
                    }
                })
            },
            changeSortState(index){
                let t = this;
                let tagType = t.sortTagList[index].tagType;
                let tagId = t.sortTagList[index].tagId;
                let tagIndex = 0;
                t.sortTagList[index].selectOnOff = !(t.sortTagList[index].selectOnOff);
                let checkIndex = (list)=>{
                    for(let num = 0;num<list.length;num++){
                        if(list[num].tagId==tagId){
                            tagIndex =num;
                            break;
                        }
                    }
                };
                if(tagType==1){
                    //系统标签
                    checkIndex(t.defaultList);
                    t.changeState(tagIndex)

                }else{
                    checkIndex(t.tagList);
                    //用户自定义标签
                    t.removeTagList(1,tagIndex);

                }
            },
            cancelTag(options){
                let t = this;
                if(t.CaseId>0&&options.id){
                    comm.ajax2({
                        url: "/call/caseFolder/tag/update/",
                        type: "POST",
                        data: {
                            paramJson:JSON.stringify({
                                isValid:0,//	string	是	病历Id
                                id:options.id//string	是	标签ID
                            })
                        },
                        success:function(res){
                            t.updateTagId(options.id);
                            t.saveTagIdSelectList({type:'delete',tagId:options.tagId});
                        }
                    })
                }
            },
            appendTagList(){
                let t = this;
                $('.tagInputCont input').trigger("blur");
                if(t.Trim(t.appendTagName,'g').length){
                    if(t.error){
                        t.saveUserTag(
                            2,
                            t.appendTagName,
                            function(res){
                                if(t.appendTagName.length){
                                    let json = res.responseObject.responseData.tagData;
                                    let jsonSort = JSON.parse(JSON.stringify(json));
                                    json.isMe = true;
                                    json.isSelect = true;
                                    jsonSort.selectOnOff = true;
                                    t.tagList.push(json);
                                    t.sortTagList.push(jsonSort);
                                    t.appendTagName = '';
                                }
                            });
                    }
                }else{
                    t.appendTagName = '';
                }

            },
            Trim(str,is_global) {
                let result;
                result = str.replace(/(^\s+)|(\s+$)/g,"");
                if(is_global.toLowerCase()=="g")
                {
                    result = result.replace(/\s/g,"");
                }
                return result;
            },
            getTagList(){
                let t = this;
                t.saveBaseInfoTagIdSelectList({type:'clear'});
                comm.ajax2({
                    url: "/call/comm/tag/searchTagList/",
                    type: "POST",
                    data: {
                        paramJson:
                            JSON.stringify(
                                {
                                    tagType:2,
                                    customerId:comm.cookie.get("userId")
                                }
                            )
                    },
                    success:function(res){
                        let sysTagList = [];
                        let userTagList = [];
                        let sortTagList = [];
                        if(res&&res.responseObject&&res.responseObject.responseData){
                            if(res.responseObject.responseData.sysTagList){
                                sysTagList =res.responseObject.responseData.sysTagList;
                            }
                            if(res.responseObject.responseData.userTagList){
                                userTagList = res.responseObject.responseData.userTagList;
                            }
                            if(res.responseObject.responseData.sortTagList){
                                sortTagList = res.responseObject.responseData.sortTagList;
                            }
                        }
                        for(let num = 0;num<userTagList.length;num++){
                            userTagList[num].isMe = true;
                        }
                        for(let num = 0;num<sysTagList.length;num++){
                            sysTagList[num].addTag = false;
                        }
                        t.defaultList = sysTagList;
                        t.tagList = t.updateTagList(userTagList,sortTagList);

                    }
                });
            },
            changeState(index){
                let t = this;
                t.defaultList[index].addTag = !t.defaultList[index].addTag;
                let tagId = t.defaultList[index].tagId;
                if(!t.defaultList[index].addTag){
                    t.defaultList[index].selectOnOff = false;
                    if(t.CaseId>0&&t.defaultList[index].id){
                        comm.ajax2({
                            url: "/call/caseFolder/tag/update/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify({
                                    isValid:0,//	string	是	病历Id
                                    id:t.defaultList[index].id//string	是	标签ID
                                })
                            },
                            success:function(res){
                                t.updateTagId(t.defaultList[index].id);
                                t.saveTagIdSelectList({type:'delete',tagId:tagId});
                            }
                        })
                    }
                }else{
                    if(t.CaseId>0){
                        t.defaultList[index].selectOnOff = true;
                        comm.ajax2({
                            url: "/call/caseFolder/tag/create/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify({
                                    caseId:t.CaseId,//	string	是	病历Id
                                    tagId:t.defaultList[index].tagId,//string	是	标签ID
                                    tagType:1,
                                    tagName:t.defaultList[index].tagName,
                                    customerId:comm.cookie.get("userId")
                                })
                            },
                            success:function(res){
                                if(res.responseObject.responseStatus){
                                    t.defaultList[index].id = res.responseObject.responsePk;
                                    t.saveTagId(t.defaultList[index].id);
                                    t.saveTagIdSelectList({type:'add',tagId:t.defaultList[index].tagId});
                                }
                            }
                        })
                    }
                }
            },
            inputTag(){
                this.addOnOff = !this.addOnOff;
            },
            removeTagList(type,index){
                let t = this;
                let tagType = 1;
                let tagId = 0;
                let id = '';
                let tagName = '';
                if(type==1){
                    tagType = 2;
                    tagId = t.tagList[index].tagId;
                    tagName = t.tagList[index].tagName;
                    id = t.tagList[index].id;
                    if(t.tagList[index].isMe){
                        //debugger;
                        t.tagList[index].isSelect = !(t.tagList[index].isSelect);
                        if(t.tagList[index].isSelect){
                            t.saveUserTag(
                                2,
                                tagName,
                                function(res){

                                },
                                t.tagList[index]
                            );
                        }else{
                            t.cancelTag(
                                {
                                    id:id,
                                    tagId:tagId
                                }
                            );
                        }
                    }else{
                        let sortIndex = 0;
                        for(let num = 0;num<t.sortTagList.length;num++){
                            if(t.sortTagList[num].tagId==tagId){
                                sortIndex =num;
                                break;
                            }
                        }
                        t.sortTagList.splice(sortIndex,1);
                        t.tagList.splice(index,1);
                        t.cancelTag(
                            {
                                id:id,
                                tagId:tagId
                            }
                        );
                    }
                }

            },
            updateTagList(list,sortList){
                let t = this;
                let sortTagList = JSON.parse(JSON.stringify(sortList));
                for(let num = 0;num<sortTagList.length;num++){
                    sortTagList[num].selectOnOff = false;
                }
                let tagList = (!comm.isEmptyObject(this.baseInfo)&&this.baseInfo.tagList)?JSON.parse(JSON.stringify(this.baseInfo.tagList)):[];
                let myTagList = JSON.parse(JSON.stringify(list));
                for(let num = 0;num<tagList.length;num++){
                    for(let innerNum = 0;innerNum<t.defaultList.length;innerNum++){
                        if((t.defaultList[innerNum].tagId==tagList[num].tagId)&&(tagList[num].tagType==1)){
                            t.defaultList[innerNum].addTag = true;
                            t.saveBaseInfoTagIdSelectList({type:'add',tagId:tagList[num].tagId});
                            t.defaultList[innerNum].id = tagList[num].id;
                        }
                        t.defaultList[innerNum].selectOnOff = false;
                    }
                }

                for(let listNum = 0;listNum<myTagList.length;listNum++){
                    let hasOnOff = true;
                    for(let num = 0;num<tagList.length;num++){
                        if((myTagList[listNum].tagId==tagList[num].tagId)&&(tagList[num].tagType==2)){
                            tagList[num].isMe = true;
                            tagList[num].isSelect = true;
                            t.saveBaseInfoTagIdSelectList({type:'add',tagId:tagList[num].tagId});
                            hasOnOff = false;
                            myTagList[listNum] = tagList[num];
                        }
                    }
                    if(hasOnOff){
                        myTagList[listNum].isSelect = false;
                    }
                }
                let checkList = JSON.parse(JSON.stringify(myTagList));
                for(let tagListNum = 0;tagListNum<tagList.length;tagListNum++) {
                    let hasOnOff = true;
                    for(let listNum = 0;listNum<checkList.length;listNum++){
                        if ((checkList[listNum].tagId == tagList[tagListNum].tagId) && (checkList[listNum].tagType == 2)) {
                            hasOnOff = false;
                            myTagList[listNum].isSelect = true;
                            t.saveBaseInfoTagIdSelectList({type:'add',tagId:tagList[tagListNum].tagId});
                        }
                    }
                    if((tagList[tagListNum].tagType == 2)&&(hasOnOff)){
                        tagList[tagListNum].isMe = false;
                        tagList[tagListNum].isSelect = true;
                        t.saveBaseInfoTagIdSelectList({type:'add',tagId:tagList[tagListNum].tagId});
                        myTagList.push(tagList[tagListNum]);
                    }
                }
                for(let defaultNum = 0;defaultNum<t.defaultList.length;defaultNum++){
                    if(t.defaultList[defaultNum].addTag){
                        for(let num = 0;num< sortTagList.length;num++) {
                            if (( sortTagList[num].tagId == t.defaultList[defaultNum].tagId) && ( sortTagList[num].tagType == 1)) {
                                sortTagList[num].selectOnOff = true;
                            }
                        }
                    }
                }
                for(let defaultNum = 0;defaultNum<myTagList.length;defaultNum++){
                    if(myTagList[defaultNum].isSelect){
                        for(let num = 0;num< sortTagList.length;num++) {
                            if (( sortTagList[num].tagId == myTagList[defaultNum].tagId) && ( sortTagList[num].tagType == 2)) {
                                sortTagList[num].selectOnOff = true;
                            }
                        }
                    }
                }
                t.sortTagList = JSON.parse(JSON.stringify(sortTagList));
                return myTagList;
            }
        },
        watch:{
            appendTagName(newVal){
                let t = this;
                ((newVal.length>t.maxLen)&&(t.maxLen))?(t.appendTagName = (t.appendTagName).substring(0,t.maxLen)):'';
            },
            contentTagList(n){
                //this.tagList = JSON.parse(n);
            },
            tagList:{
                handler(n){
                    let t = this;
                    //console.log('检测列表');
                    t.changeComponentData({HandleId:t.HandleId,contentTagList:JSON.stringify(n)});
                },
                deep:true

            },
            baseInfo(n){
                let t = this;
                t.getTagList();
            },
            defaultList:{
                handler(n){
                    let t = this;
                    t.changeComponentData({HandleId:t.HandleId,defaultTagList:JSON.stringify(n)});
                },
                deep:true
            },
            error(n){
                let t = this;
                if(!n){
                    t.changeComponentTestResult({HandleId:t.HandleId,testResult:0});
                }else{
                    t.changeComponentTestResult({HandleId:t.HandleId,testResult:1});
                }
            },
            inputFocus(n){
                let t = this;
                if(!n){
                    t.loadEnd = true;
                }
            }
        },
        mounted(){
            let t = this;
            if(!(t.CaseId>0)){
                t.getTagList();
            }
        },
        computed:{
            ...mapGetters(['baseInfo','CaseId']),
            testDes(){
                let t = this;
                let testDes = '';
                if(t.loadEnd){
                    if(!t.error){
                        if(t.appendTagName.length===0){
                            if(t.isRequired){
                                testDes = '请输入'+t.labelName;
                            }
                        }else{
                            testDes = '请勿包含数字或特殊字符';
                        }
                    }else{
                        testDes = '';
                    }
                }
                return testDes;
            },
            error(){
                let t = this;
                return t.appendTagName.length==0?true:/^[a-zA-Z\u4e00-\u9fa5]+$/.test(t.appendTagName);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .alEmr-indexInner .formCommon .articleText {
        vertical-align: top;
        line-height: 22px;
    }
</style>
