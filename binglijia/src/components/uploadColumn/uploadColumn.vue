<template>
   <section class="uploadConier ev-uploadConier">
       <div class="uploadColumnCont">
           <div class="formSelect formCommon"><p class="articleText">{{uploadColumn.menuName}}</p>
               <ul class="uploadColumn uploadImg ev-uploadImgList"  @click.stop="viewBigImg">
                   <li class="ev-bigImg" :listId="Date.parse(new Date())+index" v-for="(item,index) in uploadColumn.ImgList" :data-id="item.id">
                       <img :src="item.imgSrc">
                       <span class="deleteImg"></span>
                       <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(item.remarks)}">
                           <i class="remarkMaskIcon"></i>
                           <article class="remarkMaskTitle">添加备注</article>
                           <div class="remarkMaskEditPanel" :remarkValue="item.remarks">
                             <textarea name="editRemark" class="editRemark" cols="30" rows="2" :value="item.remarks"></textarea>
                             <div class="recordPanel" v-text="item.remarks"></div>
                           </div>
                       </div>
                   </li>
                   <li @click="addFile('img')" class="ev-addImg"><i></i><p>添加图片</p></li>
               </ul>
           </div>
           <div class="formSelect formCommon formVideo"><p class="articleText"></p>
               <ul class="uploadColumn uploadVideo ev-uploadVideoList" @click="maskVideo">
                   <li class="ev-video" v-for="(item,index) in uploadColumn.VideoList" :data-path="item.videoPath" :data-id="item.id">
                       <img :src="item.imgSrc">
                       <span class="videoBtn" v-if="item.videoPath&&item.imgSrc.indexOf('/default/qiniu196_196.jpg')==-1"></span>
                       <span class="deleteImg"></span>
                       <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(item.remarks)}">
                           <i class="remarkMaskIcon"></i>
                           <article class="remarkMaskTitle">添加备注</article>
                           <div class="remarkMaskEditPanel" :remarkValue="item.remarks">
                               <textarea name="editRemark" class="editRemark" cols="30" rows="2" :value="item.remarks"></textarea>
                               <div class="recordPanel" v-text="item.remarks"></div>
                           </div>
                       </div>
                   </li>
                   <li @click="addFile('video')"  class="ev-addVideo"><i></i><p>添加视频</p></li>
               </ul>
               <videoPlayer :path="videoPath" :beginPlay="beginPlay" @beginFn="beginFn"></videoPlayer>
           </div>
           <div class="formSelect formCommon fromMars"><p class="articleText">备注</p>
               <div class="textarea"><textarea v-model="textModel"></textarea><i>{{uploadColumn.textAreaLimt-textModel.length}}</i></div>
           </div>
       </div>
       <div class="uploadCloud" v-if="isLayer">
           <div class="uploadLayers"></div>
           <div class="layersContent">
               <div class="layersTitle">
                   <h4 @click="backFirst" class="firstTitle">云资料库</h4>
                   <h4 v-if="!isFirst" class="secontMenu"><i></i>{{layerTitle}}</h4>
                   <span @click="closeLayer"></span>
               </div>
               <section class="listContainer">
                       <ul class="layerList" v-if="isFirst" :class="{'noFileList':!layerList.length&&!isLoading}"><!--item.noteName-->
                           <li v-for="(item,index) in layerList" @click="openFile(item)"><img src="/static/images/pages/uploadColumn/file.png"/><p v-text="getStrLen(item.noteName,18)"></p></li>
                           <div class="noFile" v-if="!layerList.length&&!isLoading">
                               <div class="imgCont">
                                   <img src="/static/images/pages/uploadColumn/empty_file.png"/>
                               </div>
                               <p>暂无文件</p>
                           </div>
                       </ul>
                       <ul class="imgList" v-else :class="{'noImgList':!layerImgList.length&&!isLoading}">
                           <li v-for="(item,index) in layerImgList" @click="selecImg(index,item)" :class="{'active':isImgSelect.indexOf(index)!=-1}">
                               <img :src="addFileType=='video'?item.videoPicAttUrl:item.attUrl"/>
                               <span v-if="addFileType=='video'" class="videoBtn"></span>
                               <i></i>
                           </li>
                           <div class="noImg" v-if="!layerImgList.length&&!isLoading">
                               <div class="imgCont">
                                   <img src="/static/images/pages/uploadColumn/empty_information.png"/>
                               </div>
                               <p>暂无资料</p>
                           </div>
                       </ul>
                   <div class="noContent">

                   </div>
               </section>
               <div class="layerFooter" :class="{'layerSet':!isFirst}">
                   <div :class="{'ev-uploadImgBtn seletImg':addFileType=='img'}">
                       <button class="selecFile" v-show="isFirst" :class="{'ev-uploadVideoBtn':addFileType=='video'}" :id="addFileType=='video'?'ev-uploadVideoBtn':''">选择本地文件</button>
                   </div>
                   <button class="selecSure" v-if="!isFirst" :class="{'noImgList':!layerImgList.length}" @click="selectSure">确定{{isImgSelect.length?'('+isImgSelect.length+')':''}}</button>
               </div>
           </div>
       </div>
       <section class="uploadCaseError" v-if="isUplaodError">
           <i></i><span>{{uploadErrorText}}</span>
       </section>
       <loading v-if="isLoading"></loading>
   </section>

</template>
<!--demo 祥见src/modules/uploadDemo/app.vue-->
<script>

    import videoPlayer from '~components/videoPlayer/videoPlayer'
    import viewBigImgAll from '../../utils/view-big-img/module.view-big-img.js'
    import loading from '~components/loading/loading';
    import comm from '../../utils/comm.js';
    const uploadUrl={
        caseNote:'/call/caseFolder/case_note/getMapList/',//获取云资料文件夹名称
        caseScond:'/call/caseFolder/case_note_attachment/getNoteArrachmentMapList/',//获取某个云资料文件夹下的内容
        uploadImg:'/call/caseFolder/case_folder_attachment/upload/',//上传图片
        getQiniuToken:"/call/qiniu/storage/getQiniuToken/",//获取七牛token
        saveBatchVideoInfo:"/call/qiniu/storage/saveVideoInfo/",//保存视频
    };
    export default {
        name: "upload-column",
        props:['uploadColumn'],
        data(){
            return{
                remarksHtml:'<div class="remarkMask"><i class="remarkMaskIcon"></i><article class="remarkMaskTitle">添加备注</article><div class="remarkMaskEditPanel">\n' +
                    '                       <textarea name="editRemark" class="editRemark" cols="30" rows="2"></textarea>\n' +
                    '                       <div class="recordPanel"></div>\n' +
                    '                   </div></div>',
                beginPlay:false,//是否播放视频
                isFirst:true,//选择云资料的时候是否是第一级文件夹
                isImgSelect:[],//云图片多选控制
                itemList:[],//云图片确定的URL
                layerTitle:'',
                layerList:[],//云资料文件夹名称
                layerImgList:[],//云资料某个文件夹内容图片名称
                isLayer:false,
                addFileType:'',
                textModel:this.uploadColumn.textVal,
                videoPath:'',
                isUplaodError:false,
                uploadErrorText:'',
                userId:comm.cookie.get("userId")||"",
                sortIdImg:1,
                sortIdVideo:1,
                selectImgLenth:0,
                uploadSuc:0,
                uploadError:0,
                selecImgSrc:'',
                selecImNode:'',
                uploadImgStatus:true,//上传图片的状态：false正在上传中
                uploadVideoStatus:true,//上传视频的转态：false正在上传中
                uploadStatrus:true,//判断视频是否过大或者符合规格
                isLoading:false,
                context:'',
                uploadInfo:{
                    validImg:[],//图片上传
                    deletImg:[],//图片删除
                    noteImgid:[],//云资料图片
                    validVideo:[],//视频上传
                    deletVideo:[],//视频删除
                    noteVideoId:[],//云资料视频
                    uploadImgStatus:true,//上传图片的状态：false正在上传中
                    uploadVideoStatus:true,//上传视频的转态：false正在上传中
                    remarks:this.uploadColumn.textVal,//备注
                    imgErrLength:0,
                    videoErrLength:0,
                    HandleId:this.uploadColumn.HandleId
                }
            }
        },
        components:{
            videoPlayer,
            loading
        },
        computed: {
            textVal() {
                return this.uploadColumn.textVal
            },
            HandleId(){
                return this.uploadColumn.HandleId
            }
        },
        watch:{
            textVal(data){
                this.textModel=data;
                this.uploadInfo.remarks=data;
            },
            HandleId(data){
                this.uploadInfo.HandleId=data;
            },
            textModel(){
                if(this.textModel.length>this.uploadColumn.textAreaLimt){
                    this.textModel=this.textModel.substr(0,this.uploadColumn.textAreaLimt);
                }
                this.uploadInfo.remarks=this.textModel;
            },
            uploadInfo: {
                handler(cval) {
                    this.$emit('uploadBackInfo',[{'uploadInfo':cval},{uploadImgStatus:this.uploadImgStatus},{uploadVideoStatus:this.uploadVideoStatus}]);
                },
                deep: true
            },

        },
        methods:{
            //云资料返回上一级
            backFirst(){
                this.isImgSelect=[];
                this.isFirst=true;
                $('.moxie-shim').show();
            },
            //播放视频
            beginFn(flag){
                this.beginPlay = flag;
            },
            //视频操作删除和播放
            maskVideo(e){
                let t = this;
                e.stopPropagation();
                e.preventDefault();
                var videoLi=$(e.target).parents('.ev-video'),
                    dataId=videoLi.attr("data-id"),
                    dataNoteId=videoLi.attr('data-noteId'),
                    dataIndex=videoLi.attr('data-index'),
                    isError=videoLi.attr('isError'),
                    imgSrc=videoLi.find('img').attr('src'),
                    path=videoLi.attr("data-path");
                if($(e.target).hasClass('deleteImg')){
                    if(isError){
                        this.uploadInfo.videoErrLength--;
                    }
                    if(dataNoteId){
                        this.uploadInfo.deletVideo.push({
                            imgSrc:imgSrc,
                            id:dataId,
                            videoPath:path,
                            nodeId:dataNoteId
                        })
                    }else {
                        this.uploadInfo.deletVideo.push({
                            imgSrc:imgSrc,
                            id:dataId,
                            videoPath:path
                        })
                    }

                    if(!videoLi.attr('data-upload')){
                        // this.uploadInfo.deletVideo.push({
                        //     imgSrc:imgSrc,
                        //     id:dataId,
                        //     videoPath:path
                        // })
                    }else {
                        this.deleArr(this.uploadInfo.validVideo,dataId);
                        this.deleArr(this.uploadInfo.noteVideoId,dataId,dataIndex);
                    }
                    videoLi.remove();
                }else if($(e.target).hasClass('remarkMask')||$(e.target).hasClass('remarkMaskIcon')||$(e.target).hasClass('remarkMaskTitle')||$(e.target).hasClass('remarkMaskEditPanel')||$(e.target).hasClass('editRemark')||$(e.target).hasClass('recordPanel')){
                    console.log('编辑备注');
                    if($(e.target).hasClass('remarkMask')){
                        t.editRemark($(e.target));
                    }else{
                        t.editRemark($(e.target).parents('.remarkMask'));
                    }
                }else {
                    if(path){
                        this.videoPath=path;
                        this.beginPlay=true;
                    }
                }
            },
            initRemark(){
                let t = this;// @click.stop="editRemark($event)"
                let imgList = $(".ev-bigImg,.ev-video");
                console.log(imgList);
                imgList.hover(function(){
                    let _isThis = $(this);
                    if(!t.checkInvalid(_isThis.attr("data-id"))){
                        t.showRemark(_isThis,1);
                    }
                },function(){
                    let _isThis = $(this);
                    t.showRemark(_isThis,0);
                });
            },
            showRemark(item,v){
              let t = this;
              let element = item.find(".remarkMask");
                element.each(function(){
                   let _isThis = $(this);
                    let nowVal = _isThis.find(".remarkMaskEditPanel").attr("remarkValue");
                    let hasData = t.checkInvalid(nowVal);
                    if(parseInt(v,10)){
                        if(hasData){
                            _isThis.find(".recordPanel").html('');

                            _isThis.hasClass("remarkMaskOnEdit")?_isThis.attr({"class":"remarkMask remarkMaskOnEdit"}):_isThis.attr({"class":"remarkMask remarkMaskActive"});
                        }else{
                            _isThis.hasClass("remarkMaskOnEdit")?_isThis.attr({"class":"remarkMask remarkMaskOnEdit"}):_isThis.attr({"class":"remarkMask remarkMaskReady"});
                            ($.trim(_isThis.find(".recordPanel").html())===$.trim(nowVal))?"":_isThis.find(".recordPanel").html(nowVal);
                        }
                    }else{
                        if(hasData){
                            _isThis.find(".recordPanel").html('');
                            _isThis.hasClass("remarkMaskOnEdit")?_isThis.attr({"class":"remarkMask remarkMaskOnEdit"}):_isThis.attr({"class":"remarkMask"});
                        }else{
                            _isThis.hasClass("remarkMaskOnEdit")?_isThis.attr({"class":"remarkMask remarkMaskOnEdit"}):_isThis.attr({"class":"remarkMask remarkMaskReady"});
                            $.trim(_isThis.find(".recordPanel").html())===$.trim(nowVal)?"":_isThis.find(".recordPanel").html(nowVal);
                        }
                    }
                });
                element.each(function(){
                   let _isThis = $(this);
                   _isThis.off("mousedown").on("mousedown",function(){
                      t.editRemark(_isThis);
                      console.log('点击');
                      return false;
                   });
                });
            },
            checkInvalid(val){
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            getStrLen(str,len) {
                let newStr='',newLength=0;
                if(!str){//如果不存在
                    return '';
                }
                for(let i=0;i<str.length;i++){
                    if(str.charCodeAt(i)>128){
                        newLength+=2;
                    }else{
                        newLength++;
                    }
                    if(newLength<=len){
                        newStr=newStr.concat(str[i]);
                    }else{
                        break;
                    }
                }
                return newStr;
            },
            editRemark(element){
                let t = this;
                element.attr({"class":"remarkMask remarkMaskOnEdit"});
                let inputPanel = element.find(".editRemark");
                inputPanel.trigger("focus");
                let containerItem = inputPanel.parents("[data-id]");
                let id = containerItem.attr("data-id");
                let  noteid = containerItem.attr("data-noteid");
                let attType = containerItem.hasClass('ev-bigImg')?1:2;//1图片，2视频
                inputPanel.off("input").on("input",function(){
                    let _isThis = $(this);
                    _isThis.val(t.getStrLen(_isThis.val(),32));
                    _isThis.parent().attr({"remarkValue":_isThis.val()});
                    t.$emit("changeItemRemarks",{id:parseInt(id,10),val:_isThis.val(),noteid:t.checkInvalid(noteid)?"":parseInt(noteid,10),attType:attType});
                })
            },
            //图片操作删除和查看大图
            viewBigImg(e){
                let t = this;
                e.stopPropagation();
                e.preventDefault();
                var imgList=[],
                    bigImg=$(e.target).parents('.ev-bigImg'),
                    id=bigImg.attr("listId"),
                    dataId=bigImg.attr('data-id'),
                    imgSrc=bigImg.find('img').attr('src'),
                    dataNoteId=bigImg.attr('data-noteId'),
                    isError=bigImg.attr('isError'),
                    dataIndex=bigImg.attr('data-index'),
                     container=$(e.target).parents("ul");
                if($(e.target).hasClass('deleteImg')){//当删除图片点击的是图片的删除按钮
                    if(isError){
                        this.uploadInfo.imgErrLength--;
                    }
                    if(dataNoteId){
                        this.uploadInfo.deletImg.push({
                            imgSrc:imgSrc,
                            id:dataId,
                            nodeId:dataNoteId
                        });
                    }else {
                        this.uploadInfo.deletImg.push({
                            imgSrc:imgSrc,
                            id:dataId
                        });
                    }

                    if(!bigImg.attr('data-upload')){
                        // this.uploadInfo.deletImg.push({
                        //     imgSrc:imgSrc,
                        //     id:dataId
                        // })
                    }else {
                        this.deleArr(this.uploadInfo.validImg,dataId);
                        this.deleArr(this.uploadInfo.noteImgid,dataId,dataIndex);
                    }
                    bigImg.remove();

                }else if($(e.target).hasClass('remarkMask')||$(e.target).hasClass('remarkMaskIcon')||$(e.target).hasClass('remarkMaskTitle')||$(e.target).hasClass('remarkMaskEditPanel')||$(e.target).hasClass('editRemark')||$(e.target).hasClass('recordPanel')){
                    console.log('编辑备注');
                    if($(e.target).hasClass('remarkMask')){
                        t.editRemark($(e.target));
                    }else{
                        t.editRemark($(e.target).parents('.remarkMask'));
                    }
                }else {
                    if(id){
                        $('.ev-bigImg',container).each(function(i,em){
                            imgList.push({id:$(em).attr("listid"),url:$(em).find("img").attr("src")});
                        });
                        viewBigImgAll({
                            container:container,
                            typeTitle: "",
                            imgListType:'caze',
                            id: id,
                            imgList:imgList,
                            srcSplit:true
                        });
                    }
                }



            },
            //删除数据
            deleArr(arr,id,index){
                if(arr.length>0){
                    for(let i=0;i<arr.length;i++){
                        if(index){
                            if(arr[i].id==id&&index==arr[i].index){
                                arr.splice(i,1);
                                return arr;
                            }
                        }else {
                            if(arr[i].id==id){
                                arr.splice(i,1);
                                return arr;
                            }
                        }

                    }
                }

            },
            //添加图片、视频
            openFile(item){
                this.layerTitle=item.noteName;
                this.isFirst=false;
                $('.moxie-shim').hide();
                this.getCaseSecond(item.noteId);
                // this.getCaseSecond('1531830776250');
                // this.getCaseSecond('1531901242724');
            },
            //选择云图片
            selecImg(index,itemSrc){
                let delIndex=this.isImgSelect.indexOf(index);
                if(delIndex!=-1){
                    //移除元素
                    this.isImgSelect.splice(delIndex, 1);
                    this.itemList.splice(delIndex, 1);
                }else {
                    //选中元素
                    this.isImgSelect.push(index);
                    //选中元素
                    this.itemList.push({
                        id:itemSrc.id,
                        noteId:itemSrc.noteId,
                        attUrl:itemSrc.attUrl,
                        sortId:itemSrc.sortId,
                        fileContent:itemSrc.fileContent,
                        videoPicAttUrl:itemSrc.videoPicAttUrl,
                        extName:itemSrc.extName,
                    });
                }
            },
            //确定选择云图片
            selectSure(e){
                e.stopPropagation();
                e.preventDefault();
                let t=this;
                if(this.itemList.length){
                    this.closeLayer();
                    if(this.addFileType=='img'){
                        var str='',noteImgLen=t.uploadInfo.noteImgid.length;
                        $.each(this.itemList,function (index,ele) {
                            index=parseInt(noteImgLen+index,10)
                            str+= '<li class="ev-bigImg" listid="'+Date.parse(new Date())+index+'" data-upload="true" data-id="'+ele.id+'" data-noteId="'+ele.noteId+'" data-index="'+index+'">'+
                                '                        <img src="'+ele.attUrl+'">'+
                                '                        <div class="imgPopup" style="display: none">'+
                                '                            <p class="uploadPending">上传中...</p>'+
                                '                            <p class="uploadFail" style="display: none">上传失败<span>点击重试</span></p>'+
                                '                        </div>'+
                                t.remarksHtml+
                                '                        <span class="deleteImg"></span> '+
                                '                     </li>';
                            t.uploadInfo.noteImgid.push({
                                id:ele.id,
                                noteId:ele.noteId,
                                imgSrc:ele.attUrl,
                                index:t.uploadColumn.ImgList.length+t.sortIdImg+index
                            });

                        });
                        $('.ev-uploadImgList .ev-addImg',$(e.target).parents(".ev-uploadConier")).before(str);
                        t.initRemark();

                    }else {
                        var str='';
                        $.each(this.itemList,function (index,ele) {
                            str+= '<li class="ev-video" data-path="'+ele.attUrl+'" data-upload="true" data-id="'+ele.id+'" data-noteId="'+ele.noteId+'" data-index="'+index+'">'+
                                '                        <img src="'+ele.videoPicAttUrl+'">'+
                                '                         <span class="videoBtn"></span>'+
                                '                        <div class="imgPopup" style="display: none">'+
                                '                            <p class="uploadPending">上传中...</p>'+
                                '                            <p class="uploadFail" style="display: none">上传失败<span>点击重试</span></p>'+
                                '                        </div>'+
                                t.remarksHtml+
                                '                        <span class="deleteImg"></span> '+
                                '                     </li>';
                            t.uploadInfo.noteVideoId.push({
                                id:ele.id,
                                noteId:ele.noteId,
                                imgSrc:ele.videoPicAttUrl,
                                videoPath:ele.attUrl,
                                index:index+t.uploadColumn.VideoList.length+t.sortIdVideo
                            });
                        });
                        t.sortIdVideo+=this.itemList.length;
                        $('.ev-uploadVideoList .ev-addVideo',$(e.target).parents(".ev-uploadConier")).before(str);
                        t.initRemark();
                    }


                }

            },
            //添加图片或者视频图标
            addFile(type){
                if((!this.uploadImgStatus)&&(type=='video')){
                    this.uplaodErrorTip("图片未上传完毕");
                    return false;
                }
                this.isLayer=true;
                this.itemList=[];
                this.selecImgSrc='';
                if(type=='img'){
                    this.addFileType='img';
                    this.uploadImg();
                }else {
                    this.addFileType='video';
                    this.uploadVideo();
                }
                this.getCaseNode();
            },
            //关闭云资料弹层
            closeLayer(){
                this.isLayer=false;
                this.isImgSelect=[];
                this.isFirst=true;
                $('.moxie-shim').show();
            },
            //上传图片
            uploadImg(){
                let t=this;
                $.getScript(window.paasFilePathObj.js,function() {
                    window.uploadCount = t.sortIdImg || 0;
                    $('.ev-uploadImgBtn').each(function (index,ele) {
                        var _t = $(this);
                        _t.uploadImg({
                            ajaxData: {
                                url: uploadUrl.uploadImg
                            },
                            multiple: true,
                            // fileName:'fileContent',
                            inputStyle: {
                                'width': '148px',
                                'height': '44px',
                                'z-index': 1,
                                  'opacity': 0,
                                top:'30px'
                            },
                            formData: {
                                caseId: t.uploadColumn.caseId||'',
                                structureId: t.uploadColumn.structureId||'',
                                detailId: t.uploadColumn.detailId||'',
                                groupId: t.uploadColumn.groupId||'',
                                sortId: t.sortIdImg||'',
                                attSpec:1,
                                visitSiteId:1,
                                isValid:0,

                            },
                            fileChange: function (data) {
                               // console.log(data.files.length)
                               //  t.selectImgLenth=data.files.length;
                                if(t.selectImgLenth){
                                    t.selectImgLenth+=data.files.length;
                                }else {
                                    t.selectImgLenth=data.files.length;
                                }

                            },
                            fileSelected: function (file) {
                                var type = file.type;
                                if ((/(jpg)|(jpeg)|(png)$/i.test(type))) {
                                    var fileSize = file.size;
                                    if (fileSize > 10 * 1048576) {
                                        t.uplaodErrorTip("图片过大，请联系在线客服寻求帮助");
                                        $(".ev-uploadImgBtn input").val("");
                                        t.uploadError++;
                                        t.uploadImgS();
                                        return false;
                                    }
                                } else {
                                    t.uplaodErrorTip("格式不支持，请选择jpg、png、jpeg");
                                    $(".ev-uploadImgBtn input").val("");
                                    t.uploadError++;
                                    t.uploadImgS();
                                    return false;
                                }
                                t.closeLayer();
                                var $ul = _t.parents(".ev-uploadConier").find('.ev-uploadImgList .ev-addImg');
                                var html = '<img src="' + t.localURL(file) + '">' +
                                    '<div class="imgPopup" style="display: none">' +
                                    '  <p class="uploadPending" style="display: none"><i></i><span>0%</span></p>' +
                                    '  <p class="uploadFail" style="display: none">上传失败<br/><span>请重新上传</span></p>' +
                                    '</div>' +
                                    t.remarksHtml+
                                    '<span class="deleteImg ev-imgDel" style="display:none;"></span>';
                                var data = {};
                                data.context = $('<li class="ev-bigImg" data-upload="true" data-Img="true"></li>').append(html);
                                $ul.before(data.context);//图片通过input选择上传渲染出元素
                                file.context = data.context;
                                t.uploadInfo.uploadImgStatus=false;
                                t.uploadImgStatus=false;
                                t.sortIdImg++;
                                window.uploadCount = t.sortIdImg || 0;
                            },
                            uploadBefore: function (file) {//上传进度展示
                                var node = $(file.context);
                                node.find(".imgPopup,.imgPopup .uploadPending").show();//黑色背景显示,loading图进行显示
                                file.progress = 0;
                                var step = 10;
                                var count = 90;
                                if (file.size > 4 * 1024 * 1024) {
                                    step = 1;
                                    count = 99;
                                } else if (file.size > 2 * 1024 * 1024) {
                                    step = 5;
                                    count = 90;
                                }
                                file.timer = setInterval(function () {
                                    if (file.progress < count) {
                                        file.progress += step;
                                        node.find('.uploadPending span').text(file.progress + "%");
                                    } else {
                                        clearInterval(file.timer);
                                    }
                                }, 50);
                            },
                            uploadSuccess: function (data, file) {
                                let response = data,
                                    node = $(file.context);
                                node.find(".uploadPending span").html('100%');
                                node.find(".imgPopup,.imgPopup .uploadPending").hide();//黑色背景隐藏
                                node.find(".deleteImg").show();//删除按钮显示
                                if (response && response.responseObject && response.responseObject.responseStatus) {//图片上传成功
                                    t.uploadSuc++;
                                    var responsePk=response.responseObject.responsePk;
                                    node.attr("listId", responsePk).attr("data-id", responsePk);
                                    // data-Img
                                    t.uploadInfo.validImg=[];
                                    $.each(node.parents(".ev-uploadImgList").find('li'),function (i,e) {
                                        if($(e).attr('data-Img')){
                                            t.uploadInfo.validImg.push({
                                                id:$(e).attr('data-id'),
                                                imgSrc:$(e).find('img').attr('src'),
                                                index:i+1
                                            });
                                        }

                                    });//图片上传成功,增添数据添加
                                    t.initRemark();
                                    // t.uploadInfo.validImg.push({
                                    //     id:responsePk,
                                    //     imgSrc:node.find('img').attr('src')
                                    // });
                                } else {
                                    node.attr("isError", 1);
                                    t.uploadError++;
                                    t.uploadInfo.imgErrLength++;
                                    t.uplaodErrorTip("图片上传失败,请重新上传");
                                    node.find(".imgPopup,.imgPopup .uploadFail").show();//黑色背景显示,上传失败显示
                                }
                                t.uploadImgS();
                            },
                            uploadFail: function (data) {
                                t.uploadError++;
                                let  node = $(data.context);
                                t.uplaodErrorTip("图片上传失败,请重新上传");
                                t.uploadInfo.imgErrLength++;
                                node.attr("isError", 1);
                                node.find(".imgPopup .uploadPending").hide();//上传失败后loading隐藏
                                node.find(".imgPopup,.imgPopup .uploadFail").show();//黑色背景显示,,上传失败显示
                                node.find(".deleteImg").show();//删除按钮显示
                                t.uploadImgS();
                            }
                        });
                    })
                });

            },
            //图片状态
            uploadImgS(){
                let t=this;
                if(t.uploadSuc+t.uploadError==t.selectImgLenth){
                    t.uploadInfo.uploadImgStatus=true;
                    t.uploadImgStatus=true;
                    t.uploadSuc=0;
                    t.uploadError=0;
                    t.selectImgLenth=0;
                }
            },
            //上传视频
            uploadVideo:function(){
                var t=this;
                t.context='';
                $.getScript(window.paasFilePathObj.js,function() {
                    var obj=$(".ev-uploadVideoBtn");
                    var video=videoUpload({
                        obj:"#"+obj.attr("id"),
                        flash_swf_url:'//paas.allinmd.cn/modules/video_upload/plupload/Moxie.swf',
                        dragdrop:true,
                        max_file_size:80,
                        uptoken_url:uploadUrl.getQiniuToken+'?paramJson=%7B%22waterType%22:0%7D',
                        domain:'//www.allinmd.cn',
                        pluploadEach:function(file){//每个文件添加队列后执行
                            if (!t.uploadStatrus) {
                                return;
                            }
                            var html = '<li class="imagesUploadBtn ev-uploadVideoLi ev-video" data-upload="true">' +
                                '<img src="" class="ev-uploadVideoPath">' +
                                '<div class="imgPopup" style="display: none">' +
                                '  <p class="uploadPending" style="display: none"><i></i><span></span></p>' +
                                '  <p class="uploadFail" style="display: none">上传失败<br/><span>点击重试</span></p>' +
                                '</div>' +
                                t.remarksHtml+
                                '<span class="deleteImg ev-imgDel" style="display: none"></span>'+
                                '</li>';
                            $(obj).parents(".ev-uploadConier").find('.ev-uploadVideoList .ev-addVideo').before(html);
                            var videoList=$(obj).parents(".ev-uploadConier").find('.ev-uploadVideoList li');
                            file.context=videoList.eq(videoList.length-2);
                            t.uploadInfo.uploadVideoStatus=false;
                            t.uploadVideoStatus=false;

                        },
                        beforeUpload:function(file){//文件上传之前
                            t.uploadStatrus=true;
                            var name = t.getName(file.name);
                            var fileName = name.fileName;
                            var suffix = name.suffixName;
                            if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
                                // var fileSize = file.size;
                                // if (fileSize > 80 * 1048576) {
                                // // if (fileSize > 1) {
                                //     t.uplaodErrorTip("视频过大，请联系在线客服寻求帮助");
                                //     video.uploader.removeFile(video.uploader.getFile(file.id));
                                //     t.uploadStatrus=false;
                                //     return false;
                                // }
                            } else {
                                t.uplaodErrorTip("格式不支持，请选择mov、mp4、avi、wmv、flv");
                                video.uploader.removeFile(video.uploader.getFile(file.id));
                                t.uploadStatrus=false;
                                return false;
                            }
                            t.closeLayer();
                            $(obj).parents(".ev-uploadConier").find('.ev-uploadVideoList .ev-addVideo').hide();//隐藏上传视频按钮
                            obj.data("videoName", (fileName.length > 15 ? fileName.substring(0, 15) + '...' + '.' + suffix : fileName + '.' + suffix));
                        },
                        uploadProgress:function(file){//上传进度条
                            var context=file.context;
                            t.context=context
                            $(".imgPopup, .uploadPending",context).show();//显示进度
                            $(".uploadPending span",context).text(file.percent + "%");
                            if (file.percent == 100) {
                                $(".uploadPending,.imgPopup",context).remove();
                            }
                        },
                        fileUploaded:function(dataJson,file){//上传成功
                            var context=file.context;
                            context.attr('key',dataJson.key);
                            $(".ev-uploadVideoPath",context).attr("src", "//img10.allinmd.cn/default/qiniu196_196.jpg");
                            $(context).parents(".ev-uploadConier").find('.ev-uploadVideoList .ev-addVideo').show();
                            context.find('.ev-imgDel').show();
                            t.saveVideo({
                                videoName:obj.data("videoName"),
                                key:dataJson.key,
                                persistentId:dataJson.persistentId,
                                sortId:t.sortIdVideo,
                                domLi:context,
                                imgSrc:'//img10.allinmd.cn/default/qiniu196_196.jpg'
                            });//视频上传成功
                            //t.initRemark();
                            t.sortIdVideo++;
                        },
                        fileUploadError:function(file){//上传失败
                            t.uplaodErrorTip("视频上传失败");
                            if(t.context){
                                t.uploadInfo.videoErrLength++;
                            }
                            $(".uploadPending,.imgPopup .uploadPending",t.context).remove();
                            $(t.context).attr("isError", 1);
                            $(t.context).find('.ev-imgDel,.uploadFail').show();
                            $(t.context).parents(".ev-uploadConier").find('.ev-uploadVideoList .ev-addVideo').show();
                            t.uploadInfo.uploadVideoStatus=true;
                            t.uploadVideoStatus=true;
                        }
                    })
                })

            },
            //错误提示
            uplaodErrorTip(text){
                let t=this;
                t.isUplaodError=true;
                t.uploadErrorText=text;
                setTimeout(function () {
                    t.isUplaodError=false;
                },3000);
            },
            //获取文件名
            getName(obj) {
                var path = obj//obj.val();
                var pos1 = path.lastIndexOf('/');
                var pos2 = path.lastIndexOf("\\");
                var pos3 = Math.max(pos1, pos2);
                var pos4 = path.lastIndexOf(".");
                var fileName = path.substring(pos3 + 1, pos4);
                var suffixName = path.substring(pos4 + 1, path.length);
                return {
                    "fileName": fileName,   //文件名
                    "suffixName": suffixName //文件后缀
                };
            },
            //本地路径
            localURL:function(file){
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;//     eg:     blob:http://localhost/671c3409-0047-44ec-bcba-89d63a439231
            },
            //获取云资料文件夹列表
            getCaseNode(){
                let t=this;
                t.isLoading=true;
                t.layerList=[];
                comm.ajax2({
                    url:uploadUrl.caseNote,
                    type: "GET",
                    data: {
                        paramJson:JSON.stringify({"customerId":t.userId,isValid:1,firstResult:0,maxResult:999,sortType:1,})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                                t.layerList=res.responseObject.responseData.data_list;
                        }

                    }
                })
            },
            //获取指定云资料文件夹的数据
            getCaseSecond(noteId){
                let t=this;
                t.isLoading=true;
                t.layerImgList=[];
                comm.ajax2({
                    url:uploadUrl.caseScond,
                    type: "GET",
                    data: {
                        paramJson:JSON.stringify({"customerId":t.userId,isValid:1,noteId:noteId,visitSiteId:1,attUseFlag:5,firstResult:0,maxResult:999})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.isLoading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            let dataList=res.responseObject.responseData.data_list;
                            for(let i=0;i<dataList.length;i++){
                                //筛选图片和视频
                                if((dataList[i].attType==1&&t.addFileType=='img'&&dataList[i].attUrl)||(dataList[i].attType==2&&t.addFileType=='video'&&dataList[i].attUrl)){
                                    t.layerImgList.push(dataList[i]);
                                }
                            }

                        }

                    }
                })
            },
            //保存视频
            saveVideo(option){
                let t=this;
                comm.ajax2({
                    url:uploadUrl.saveBatchVideoInfo,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            videoName:option.videoName,
                            key:option.key,
                            persistentId:option.persistentId,
                            refType:12,
                            sortId:option.sortId,
                            caseId:t.uploadColumn.caseId,
                            groupId:t.uploadColumn.groupId,
                            structureId:t.uploadColumn.structureId,
                            detailId:t.uploadColumn.detailId,
                            visitSiteId:1,
                            isValid:0
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.uploadInfo.uploadVideoStatus=true;
                        t.uploadVideoStatus=true;
                        if(res&&res.responseObject&&res.responseObject.responsePk){
                            let responsePk=res.responseObject.responsePk;
                            $(option.domLi).attr('data-id',responsePk);
                            t.uploadInfo.validVideo.push({
                                id:responsePk,
                                imgSrc:option.imgSrc,
                                videoPath:'',
                                index:option.sortId+t.uploadColumn.VideoList.length
                            });
                            t.initRemark();
                        }


                    }
                })
            }

        },
        updated(){
          let t = this;
          t.initRemark();
        },
        mounted(){
            let t = this;
            $("body").on("mousedown",function(e){
               let targetElement = $(e.target);
               if(targetElement.hasClass('remarkMask')||targetElement.hasClass('remarkMaskIcon')||targetElement.hasClass('remarkMaskTitle')||targetElement.hasClass('remarkMaskEditPanel')||targetElement.hasClass('editRemark')||targetElement.hasClass('recordPanel')){
               }else{
                   let element = $(".remarkMask");
                   element.each(function(){
                       let _isThis = $(this);
                       let nowVal = _isThis.find(".remarkMaskEditPanel").attr("remarkValue");
                       let hasData = t.checkInvalid(nowVal);
                       _isThis.removeClass("remarkMaskOnEdit");
                       if(!hasData){
                           _isThis.addClass('remarkMaskReady');
                           _isThis.find(".recordPanel").html(nowVal);
                       }
                   });

               }
            });
            t.initRemark();

        }
    }
</script>

<style  lang="scss">
    @import "../../utils/view-big-img/module.view-big-img.css";
    @import "../../assets/scss/modules/common-modules";
    @import "../../assets/scss/modules/utilities/utilities";
    .uploadConier{
        width: 1000px;
        /*margin: 0 auto;*/
        /*padding-bottom: 26px;*/
        .uploadColumnCont{
            /*&:after{*/
                /*content: '';*/
                /*display: block;*/
                /*width: 814px;*/
                /*height: 1px;*/
                /*background: #DFDFDF;*/
                /*margin-left: 184px;*/
            /*}*/
        }
        .formCommon{
            .articleText{
                /*vertical-align: top;*/
            }
            &.formVideo,&.fromMars{
                margin-top: -12px;
            }
        }
        .uploadImg{
            li{
                position: relative;
                .imgPopup{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    top: 0;
                    p{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);
                        -moz-transform:translate(-50%,-50%);
                        -webkit-transform: translate(-50%,-50%);
                        -o-transform:translate(-50%,-50%);
                        font-size: 13px;
                        color: #fff;
                    }
                    .uploadPending{
                        i{
                            display: block;
                            width: 28px;
                            height: 28px;
                            background: url(/static/images/pages/uploadColumn/loading.png) no-repeat;
                            margin: 0 auto 5px;
                            animation: rotate 1s linear infinite;
                            -webkit-animation: rotate 1s linear infinite;
                        }
                    }
                    .uploadFail{
                        font-size: 14px;
                        white-space: nowrap;
                    }
                }
                .deleteImg{
                    position: absolute;
                    width: 26px;
                    height: 26px;
                    right: 0;
                    top: 0;
                    background: url("/static/images/pages/uploadColumn/upClose.png") 100% 100% no-repeat;
                    cursor: pointer;
                }
            }
            li:last-child{
                cursor: pointer;
                i{
                    @include iconImgI(inline-block,38px,31px);
                    background: url("/static/images/pages/newCases/camera.png") no-repeat;
                    margin: 45px 0 6px 0;
                }
            }
        }
        .uploadVideo{
            li{
                position: relative;
                .videoBtn{
                    background: url("/static/images/common/icon/PlayIcon.png") 100% 100% no-repeat;
                    width: 55px;
                    height: 55px;
                    position:absolute ;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    -ms-transform: translate(-50%,-50%);
                    -moz-transform:translate(-50%,-50%);
                    -webkit-transform: translate(-50%,-50%);
                    -o-transform:translate(-50%,-50%);
                }
                .imgPopup{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    top: 0;
                    p{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);
                        -moz-transform:translate(-50%,-50%);
                        -webkit-transform: translate(-50%,-50%);
                        -o-transform:translate(-50%,-50%);
                        font-size: 13px;
                        color: #fff;
                    }
                    .uploadPending{
                        i{
                            display: block;
                            width: 28px;
                            height: 28px;
                            background: url(/static/images/pages/uploadColumn/loading.png) no-repeat;
                            margin: 0 auto 5px;
                            animation: rotate 1s linear infinite;
                            -webkit-animation: rotate 1s linear infinite;
                        }
                    }
                    .uploadFail{
                        font-size: 14px;
                        white-space: nowrap;
                    }
                }
                .deleteImg{
                    position: absolute;
                    width: 26px;
                    height: 26px;
                    right: 0;
                    top: 0;
                    background: url("/static/images/pages/uploadColumn/upClose.png") 100% 100% no-repeat;
                    cursor: pointer;
                }
            }
            li:last-child{
                cursor: pointer;
                i{
                    @include iconImgI(inline-block,38px,31px);
                    background: url("/static/images/pages/newCases/video.png") no-repeat;
                    margin: 45px 0 6px 0;
                }
            }
        }
        .uploadColumn{
            display: inline-block;
            vertical-align: top;
            width: 814px;
            li{
                width: 140px;
                height: 140px;
                border-radius: 4px;
                display: inline-block;
                vertical-align: top;
                text-align: center;
                margin: 0 12px 12px 0;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
                &:last-child{
                    border: 1px dashed #c8c8c8;
                    border-radius: 4px;

                    p{
                        @include fontSize(14px,#aaa);
                    }
                }

            }


        }
    }
    .uploadCloud{
        position: fixed;
        top: 0;
        bottom: 0;
        left:0;
        right: 0;
        z-index: 5;
        .uploadLayers{
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0.7;
            background: #0A1E2B;
        }
        .layersContent{
            width: 800px;
            height: 574px;
            /*padding: 40px 30px;*/
            padding: 20px 0 20px 30px;
            box-sizing: border-box;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            -moz-transform:translate(-50%,-50%);
            -webkit-transform: translate(-50%,-50%);
            -o-transform:translate(-50%,-50%);
            /*overflow: auto;*/
            .listContainer{
                overflow: auto;
                height: 75%;
            }
            .imgList{
                &.noImgList{
                    position: relative;
                    height: 100%;
                }
                li{
                    display: inline-block;
                    margin:0 20px 20px 0;
                    position: relative;
                    &.active{
                        i{
                            background: url("/static/images/pages/uploadColumn/select.png") 100% 100% no-repeat;
                        }
                    }
                    img{
                        width: 126px;
                        height: 126px;
                    }
                    .videoBtn{
                        background: url("/static/images/common/icon/PlayIcon.png") 100% 100% no-repeat;
                        width: 55px;
                        height: 55px;
                        position:absolute ;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);
                        -moz-transform:translate(-50%,-50%);
                        -webkit-transform: translate(-50%,-50%);
                        -o-transform:translate(-50%,-50%);
                    }
                    i{
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 31px;
                        height: 31px;
                        background: url("/static/images/pages/uploadColumn/unselect.png") 100% 100% no-repeat;
                        cursor: pointer;
                    }

                }
                .noImg{
                    text-align: center;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -15px;
                    transform: translate(-50%,-50%);
                    -ms-transform: translate(-50%,-50%);
                    -moz-transform:translate(-50%,-50%);
                    -webkit-transform: translate(-50%,-50%);
                    -o-transform:translate(-50%,-50%);
                    .imgCont{
                        /*background: rgba(255,85,0,0.30);*/
                        display: inline-block;
                    }
                    p{
                        margin-top: 18px;
                        font-size: 15px;
                        color: #333333;
                    }
                }
            }
            .layersTitle{
                @include clearfix();
                padding-bottom: 30px;
                margin-left: -10px;
                h4{
                    font-size: 20px;
                    color: #666666;
                    float: left;
                    font-weight: normal;
                    &.firstTitle{
                        cursor: pointer;
                    }
                    &.secontMenu{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 630px;
                        i{
                            background: url("/static/images/pages/uploadColumn/rightArrow.png") 100% 100% no-repeat;
                            width: 10px;
                            height: 18px;
                            display: inline-block;
                            margin: 0 12.5px;
                        }
                    }
                }
                span{
                    float: right;
                    width: 20px;
                    height: 20px;
                    background: url("/static/images/pages/templateLib/close.png") 100% 100% no-repeat;
                    margin-right: 15px;
                    cursor: pointer;
                }
            }
            .layerList{
                /*overflow: auto;*/
                /*height: 75%;*/
               &.noFileList{
                   position: relative;
                   height: 100%;
               }
                li{
                    display: inline-block;
                    margin:0 50px 40px 0;
                    cursor: pointer;
                    vertical-align: top;
                    text-align: center;
                    p{
                        font-size: 14px;
                        color: #555555;
                        line-height: 14px;
                        margin-top: 14px;
                        width: 72px;
                        word-wrap: break-word;
                    }
                }
                .noFile{
                    text-align: center;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -15px;
                    transform: translate(-50%,-50%);
                    -ms-transform: translate(-50%,-50%);
                    -moz-transform:translate(-50%,-50%);
                    -webkit-transform: translate(-50%,-50%);
                    -o-transform:translate(-50%,-50%);
                    .imgCont{
                        /*background: rgba(255,85,0,0.30);*/
                        display: inline-block;
                    }
                    p{
                        margin-top: 18px;
                        font-size: 15px;
                        color: #333333;
                    }
                }
            }
            .layerFooter{
                position: absolute;
                bottom: 0;
                line-height: 85px;
                border-top: 1px solid #DFDFDF;
                left: 0;
                right: 0;
                padding-left: 30px;
                background: #fff;
                &.layerSet{
                    text-align: right;
                    padding-right: 40px;
                }
                .seletImg{
                    position: relative;
                    width: 148px;
                }
                .selecFile{
                    border: 1px solid #2888FF;
                    border-radius: 2px;
                    width: 148px;
                    line-height: 44px;
                    text-align: center;
                    background: #fff;
                    font-size: 14px;
                    color: #2888FF;
                    position: relative;
                    cursor: pointer;
                    input{
                        cursor: pointer;
                    }
                    .uploadVideo{
                        width: 148px;
                        height: 44px;
                        z-index: 1;
                        top: 0;
                        left: 0;
                        position: absolute;
                        opacity: 0;
                        &.unLoad{
                            display: none;
                        }
                    }
                }
                .selecSure{
                    padding: 0 34px;
                    line-height: 44px;
                    font-size: 16px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    text-align: center;
                    background: #2888FF;
                    border-radius: 2px;
                    cursor: pointer;
                    &.noImgList{
                        background: #AAAAAA;
                        color: #FFFFFF;
                    }
                }
            }
        }
    }
    .uploadCaseError{
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 7;
        transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -moz-transform:translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
        width: 340px;
        height: 46px;
        text-align: center;
        line-height: 46px;
        background: #fce3e3;
        border: 1px solid #feb5b5;
        border-radius: 2px;
        font-size: 16px;
        color: #333;
        padding: 0 30px;
        i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(/static/images/pages/uploadColumn/caution.png) no-repeat;
            vertical-align: middle;
            margin-right: 6px;
        }
    }
    .newCases .uploadConier .formCommon .articleText{
        vertical-align: top;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
            -ms-transform: rotate(0);
            -moz-transform:rotate(0);
            -webkit-transform: rotate(0);
            -o-transform:rotate(0);
        }

        100% {
            transform: rotate(360deg);
            -ms-transform:rotate(360deg);
            -moz-transform:rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform:rotate(360deg);
        }
    }

    @-webkit-keyframes rotate {
        0% {
            transform: rotate(0);
            -ms-transform: rotate(0);
            -moz-transform:rotate(0);
            -webkit-transform: rotate(0);
            -o-transform:rotate(0);
        }

        100% {
            transform: rotate(360deg);
            -ms-transform:rotate(360deg);
            -moz-transform:rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform:rotate(360deg);
        }
    }
    .uploadConier .uploadImg,.uploadConier .uploadVideo{
        .remarkMask{
            width:140px;
            height:34px;
            background:rgba(0,0,0,0.8);
            border-radius:0px 0px 4px 4px;
            position: absolute;
            bottom:-34px;
            left: 0;
            right:0;
            transition: all ease-in .5s;
            &.remarkMaskActive{
                bottom:0;
                display: block;
                transition: all ease-in .3s;
                .remarkMaskIcon{
                    display: block;
                    transition: all ease-in .3s;
                }
            }
            i.remarkMaskIcon{
                display: block;
                float: left;
                margin-top: 10px;
                width: 14px;
                height: 14px;
                background: url("/static/images/pages/uploadColumn/editIcon.png") no-repeat center center;
                background-size: cover;
                margin-left: 13px;
                margin-right: 6px;
                transition: all ease-in .5s;
            }
            .remarkMaskTitle{
                display: block;
                float: left;
                line-height: 34px;
                height: 14px;
                color:rgba(185,185,185,1);
                font-size:14px;
            }
            &.remarkMaskOnEdit,&.remarkMaskReady{
                height: 53px;
                bottom:0;
                .remarkMaskIcon{
                    display: none;
                }
                .remarkMaskTitle{
                    display: none;
                }
                .remarkMaskEditPanel{
                    width: 140px;
                    height: 53px;
                    .recordPanel{
                        display: none;
                    }
                    .recordPanel,.editRemark{
                        background: none;
                        resize: none;
                        height: 39px;
                        width: 122px;
                        padding:7px 9px;
                        font-size:14px;
                        color:rgba(255,255,255,1);
                        outline: none;
                        border: none;
                        overflow: auto;
                        word-break: break-all; //解决兼容问题
                        text-align: left;
                    }
                }
            }
            &.remarkMaskReady{
                bottom:0;
                height: auto;
                .remarkMaskEditPanel{
                    height: auto;
                    .editRemark{
                        display: none;
                    }
                    .recordPanel{
                        cursor: pointer;
                        display: block;
                        height: auto;
                        line-height: 17px;
                    }
                }

            }
        }
    }


</style>
