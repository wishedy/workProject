<template>
    <section class="update-box">
        <section class="update-top">
            <p class="upload-top-title">最近康复的怎么样？</p>
            <p class="upload-top-describe">说说您的生活、心态变化，症状变化，做些那些康复治疗等</p>
            <section class="upload-top-textarea">
                <pre><span>{{inputVal}}</span></pre>
                <textarea class="input-textArea"
                          name="question"
                          placeholder="请输入内容"
                          maxlength=-1
                          placeholder-style="color:#999999;font-size:17px"
                          v-model="inputVal"
                          @input="inputLimit"
                          autofocus="autofocus">
                </textarea>
                <!-- <textarea v-model="inputVal" name="" id="" maxlength=-1 placeholder-style="color:#999999;font-size:17px" auto-height placeholder="请输入" @input="inputLimit(value)"></textarea> -->
            </section>
        </section>
        <!-- 上传图片 -->
        <section class="update-content img">
            <p class="content-title">上传照片</p>
            <p class="content-describe">你可以上传康复中的生活照，如运动照、旅行照等</p>
            <section class="upload-box">
                <li class="upload-img-item" v-for="(item,index) in imageList" :key="index">
                    <img :src="item.blob" @click="showBigImg(item,index)">
                    <span class="delateBtn" v-if="!item.fail" @click="delateFn('1',item,index)"></span>
                    <span class="imgItem-cover" v-if="item.uploading"><span class="imgItem-loading"></span></span>
                    <figure class="imgItem-fail" v-if="item.fail"  @click="upLoadReload(index)">
                        <!-- <p class="imgItem-failText">上传失败</p> -->
                        <p class="imgItem-reloadText">点击重试</p>
                    </figure>
                </li>
                <!-- 图片组件 -->
                <upLoadPlugn
                    :isFailToast="true"
                    :propClass="'upLoadItem'"
                    :imgList="imageList"
                    :paramObj="{
                        limit:9,
                        singleNum:9,
                        maxSize:10,
                        overSingleTips:'一次最多上传9张图片',
                        overSizeTips:'图片不能超过10M',
                        compressRatio:0.8
                    }"
                    :loadTypeObj="{
                        loadType:'1',   //上传模块 1-康复日记 |
                        paramData:paramData
                    }"
                    @beforeUpload="beforeUploadFn"
                    @uploadDone="uploadDoneFn" v-if="imageList.length<9">
                </upLoadPlugn>
            </section>
        </section>
        <!-- 上传视频 -->
        <section class="update-content video">
            <p class="content-title">上传视频</p>
            <p class="content-describe">术后下地活动视频，日常锻炼小视频</p>
            <section class="upload-box">
                <li class="uploadvideo-item" v-for="(item, index) in videoList" :key="index" >
                     <div class="videoItem" v-if="!item.fail&&item.finish&&item.qiniuStatus=='2'" @click="videoPlay(item.attUrl)">
                        <img :src="item.imageUrl" alt="">
                        <span class="play-btn"></span>
                        <span class="video-time">{{item.playTime}}</span>
                    </div>
                    <!-- <video class="videoItem" v-if="!item.fail&&item.finish&&item.attUrl.length>0" :src="item.attUrl"></video> -->
                    <span class="delateVideoBtn" v-if="item.finish" @click="delateFn('2',item,index)"></span>
                    <!-- loading -->
                    <div class="upload-coverImg" v-if="!item.finish">
                        <div class="tc-videoLoadingImg">
                            <img src="https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png" alt="">
                        </div>
                        <p class="tc-videoLoadingText">上传中 {{upLoadPercent}} %...</p>
                    </div>
                    <!-- 暂无播放 -->
                    <div class="upload-success" v-if="item.finish&&!item.fail&&item.qiniuStatus!='2'">
                        <img src="https://m.allinmed.cn/static/image/mp/index/1.1.4/videoBanner.jpg" alt="">
                    </div>
                    <!-- 失败 -->
                    <div class="upload-fail" v-if="item.finish&&item.fail">
                        <span class="fail-first">上传失败</span><span class="fail-second">请重新上传</span>
                    </div>
                </li>
                
                <!-- 视频上传btn-->
                <section class="upLoadItem video" @click="selectVideo()" v-if="videoList.length<3"></section>
            </section>
        </section>
        <!-- 底部按钮 -->
        <section class="update-btnBox">
            <section class="btnBox-emailBtn" @click="saveLocal"><span class="email-iconbox"><span class="email-icon"></span>存草稿</span></section>
            <section class="btnBox-pushBtn" @click="publish"><span class="push-iconbox"><span class="push-icon"></span>发布</span></section>
        </section>
        <!-- toast -->
        <confirm :confirmParams="{
          'ensure':'取消',
          'cancel':'确定',
          'title':tipText,
          }" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()" @ensureClickEvent="cancelDeletePic()">
        </confirm>
    </section>
</template>


<script>
/**
 * 日记更新页
 * 
 * create by JK on 2018/11/28
 */
import api from 'common/js/util/util';
import upLoadPlugn from 'components/upLoadPic/upLoadPlugn';
import getQiniuToken from "common/js/HttpRequest/getQiniuToken";
import confirm from "components/confirm";
import localStorage from "localStorage";


import getDiaryUpdate from "common/js/journal/getDiaryUpdate";
import createUpdateId from "common/js/journal/createUpdateId";
import recordUpdate from "common/js/journal/recordUpdate";

import createSupplementRecord from "common/js/journal/createSupplementRecord";
import saveVideoInfo from "common/js/journal/saveVideo";


export default {
    data(){
        return{
            tokenObj:'',             //token
            inputVal:'',               //输入框
            imageList:[],            //图片list
            deleteSAttId:[],       //删除图片list

            failImgList:[],             //缓存图片
            imageCacheList:[],
            deletePic:{},             //删除图片
            deleteVideo:{},        //删除视频
            delateType:'',           //删除类型 string 1-图片 2-视频
            deletePicTip:false,    //删除弹层
            tipText:'',                     //删除文案

            isReadyLoad: false, //是否有上传失败图片
            reload: false,

            videoList:[],                 //视频列表
            deleteVideoIdList:[],  //删除视频ID list

            videoUploading: false,
            videoObj: {},
            videoSubmitParam : [],
            upLoadPercent:'',       //视频上传进度

            diaryId:'',                     //日记ID
            supplementId:'',         //版本ID
            newSupId:'',                //新版本ID

            paramData:{
                uploadStyle:'weixin',	   //string	是	上传方式，默认值：weixin		
                // mediaId:'',	       //string	是	媒体id,(上传方式为：weixin )		
                attType:'1',	         //string	是	类型：1-图片,2-视频,4-视频缩略图,5-语音,6-封面图片		
                sortId:'',	                 //string	是	顺序号		
                fileContent	:'',        //string	是	文件base64编码,(上传方式为：base64)		
                fileName:'',	         //string	 是	文件名,(上传方式为：base64)		
                extName:'',	            //string	是	后缀,(上传方式为：base64)		
                diaryId:'',	                //string	是	日记id		
                visitSiteId:api.getSiteId(),	   //string	是	站点id		
                attName:'',	            //string	是	附件说明		
                // sourceType:'9',	   //string	是	来源类型（1-我的心声2-患病经历3-入院治疗4-出院康复历程5-术前图片6-术后图片7-术前视频8-术后视频9-更新日记）
            } ,
        }
    },
    onShow(){},
    onLoad(option){
        console.log(option)
        this.inputVal = '';
        this.imageList = [];
        this.deleteSAttId = [];
        this.videoList = [];
        this.deleteVideoIdList = [];
        this.supplementId = '';

        this.diaryId = option.diaryId;
        this.paramData.diaryId = this.diaryId;
        if (option.newSupplementId) {
            //无更新数据时 创建新的更新日记使用
            this.supplementId = option.newSupplementId;
        }      
    },
    mounted() {
        let _this = this;
        _this.getQiniuTokenFn();    // 如果是上传视频，则获取七牛 token
        this.innit();
    },
    components:{
        upLoadPlugn,
        confirm
    },
    methods:{
        innit(){
            let _this = this;
            _this.getJourUpdateDetail();
        },
        // get token
        getQiniuTokenFn(){
            let _this = this;
            getQiniuToken().then( (result) => {
                _this.tokenObj = result.responseObject;
            });
        },
         //获取更新日记详情
        getJourUpdateDetail(){
            let _this = this;
            getDiaryUpdate({
                supplementType:9,                   //string	是	补充日记类型（9-更新日记）
                statusIn:'1,2,4',                   //string	是	审核状态（审核状态 1-草稿2-待审核3-审核通过4-审核失败）			
                imgUseFlag:'5',                     //string	是	图片规格尺寸		5
                videoUseFlag:'8',                   //	string	是	图视频规格尺寸		8
                diaryId:_this.diaryId,              //	string	是	日记id		
                sourceType:'1',                     // 来源类型  0-主日记更新  1-部分更新
                isValid:"1",                        //是否有效
                firstResult:'0',
                maxResult:'1'

            }).then(res=>{
                console.log(res)
                if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList) {  
                    let _data = res.responseObject.responseData.dataList[0];
                    _this.supplementId = _data.supplementId;    //版本ID
                    if (_data.status=='4') {
                        // 更新日记审核失败 创建ID
                        _this.createUpdateId()
                    }
                    //赋值
                    if (_data.updateDiaryList&&_data.updateDiaryList.length>0) {
                        _this.inputVal = _data.updateDiaryList[0].supplementContent;
                    }
                    if (_data.updateDiaryAttList&&_data.updateDiaryAttList.length>0) {
                        _data.updateDiaryAttList.forEach((item,index)=>{                        
                            _this.imageList.push({
                                blob:item.attUrl,
                                imgId:item.id,
                                uploading: false,
                                fail: false,
                                finish: true
                            })  
                        })
                    }
                    if (_data.updateDiaryVideoList&&_data.updateDiaryVideoList.length>0) {
                        _data.updateDiaryVideoList.forEach((item,index)=>{                        
                            _this.videoList.push({
                                fail:false,
                                finish:true,

                                attUrl	:(item.qiniuStatus!=1? item.attUrl:''),   //	http://vpro.allinmed.cn/1544261651797_480_320.mp4
                                qiniuId	:item.qiniuId,              //	z1.5c0b904dc0ebc160e492b42c 
                                attType	:'',                        //2    
                                qiniuStatus	:	item.qiniuStatus,   //2  
                                imageUrl	:	item.imageUrl ||'', //http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                                playTime	:	item.playTime,      //00:00:21
                                id:item.id
                            })  
                        })
                    }
                } else {
                    // 无更新数据
                    if (_this.supplementId.length==0) {
                        //H5 取缓存
                        _this.supplementId = localStorage.getItem("newSupplementId");    // 批次更新 （已发布的日记 没有更新数据时 ）
                    }
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //创建新的批次号
        createUpdateId(){
            let _this = this;
            createUpdateId({
                diaryId:_this.diaryId,	//  string	是	日记id		
                isValid:'0',	        //	string	是	有效无效（0-无效1-有效）
                sourceType:'1',         //来源类型  0-主日记更新  1-部分更新		
                status:'0',	            //  日记状态（1-草稿2-待审核3-审核通过4-审核失败）
            }).then(res=>{
                console.log(`--------创建新的批次号-----------`)
                if (res&&res.responseObject&&res.responseObject.responseStatus) {
                    _this.newSupId=res.responseObject.responsePk;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        // 输入框输入
        inputLimit(e){
            console.log(this.inputVal)
            let _number=api.getStrInputCut(this.inputVal,2000,2);
            console.log(_number)
            this.inputVal = _number.str;
        },
        // 图片上传前
        beforeUploadFn(data){
            console.log(data)
            let _this = this;
             _this.imageList = data.imgUrl;
             _this.failImgList.unshift(data.failParam);
        },
        // 图片上传完成
        uploadDoneFn(dataItem){
            console.log(dataItem)
        },
        //失败重传图片
        upLoadReload(index) {
            let _this = this;
            if (!_this.reload) {
                _this.reload = true;     //禁止上传
                api.reloadFile({
                    param: _this.failImgList[index],
                    uploadBefor: (_data) => {
                    _this.imageList[index].uploading = true;
                    _this.imageList[index].fail = false;
                    _this.imageList[index].finish = false;
                    _this.$forceUpdate();
                    },
                    uploadDoneFn: _data => {
                    _this.reload = false;
                    if (_data.fail) {
                        _this.imageList[index].uploading = false;
                        _this.imageList[index].fail = true;
                        _this.imageList[index].finish = true;
                        _this.$forceUpdate();
                    } else {
                        _this.imageList[index].imgId = _data.imgId;
                        _this.imageList[index].uploading = false;
                        _this.imageList[index].fail = false;
                        _this.imageList[index].finish = true;
                        _this.$forceUpdate();
                        _this.isExistUpLoadFail();
                    }
                    }
                });
            } else {
            //禁止上传toast
            }
        },
        //是否存在上传失败图片
        isExistUpLoadFail() {
            let _this = this, _failNum = 0;
            this.imageList.forEach((item, index) => {
                if (item.fail) {
                    _failNum++;
                }
            });
            if (_failNum > 0) {
                _this.isReadyLoad = false;
            } else {
                _this.isReadyLoad = true;
            }
        },
        // 选择视频 
        selectVideo () {
            let _this = this;
            wx.chooseVideo({
                sourceType: ['album','camera'],
                maxDuration: 60,
                camera: 'back',
                success: function(res) {
                    console.log(res);
                    if (res.size >= 62914560) {
                        _this.showTips({
                            type:'1',
                            title:'视频不能超过60M，请重新上传'
                        })
                        return;
                    }
                    _this.videoList.push({
                        fail:false,                 //是否上传失败
                        finish:false,              //是否上传完成
                    })
                    _this.videoUploading = true;           //上传中
                    const uploadTask = wx.uploadFile({
                        url: 'https://up-z1.qbox.me',        //如果是华北一请用up-z1.qbox.me
                        filePath: res.tempFilePath,
                        name: 'file',
                        formData: {
                            'key': _this.tokenObj.key,
                            'token': _this.tokenObj.uptoken,
                        },
                        success: function(response) {
                            let data = JSON.parse(response.data);
                            _this.videoUploading = false;         //上传完成
                            _this.videoObj = res;                        //本地文件对象
                            _this.videoSubmitParam.push(data);   //提交参数
                            _this.getQiniuTokenFn();
                            _this.saveVideoFn({
                                name:'',             //文件名     "fad9a9cc561513f....mp4",
                                key:data.key,   //token
                                persistentId:data.persistentId,   //七牛ID
                                type:'8',
                                callBack:backData=>{
                                  _this.videoList[_this.videoList.length-1]={
                                    fail:false,
                                    finish:true,
                                    attUrl	:res.tempFilePath,      //	http://vpro.allinmed.cn/1544261651797_480_320.mp4
                                    qiniuId	:data.persistentId,     //	z1.5c0b904dc0ebc160e492b42c 
                                    attType	:'',                    //2    
                                    qiniuStatus	:	'',             //2  
                                    imageUrl	:	'',             //http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                                    playTime	:	'',             //00:00:21
                                    id:backData
                                  }
                                  _this.upLoadPercent = 0;             //上传进度
                                  _this.$forceUpdate();
                                }
                            })
                        },
                        fail(error) {
                            console.log(error)
                            _this.videoUploading = false;        //上传完成
                            _this.upLoadPercent = 0;               //上传进度
                            _this.videoList[_this.videoList.length-1]={
                                fail:true,
                                finish:true,
                            }
                        },
                        complete(res) {
                            // console.log(res)
                        }
                    });
                    // 上传进度
                    uploadTask.onProgressUpdate((res) => {
                        // console.log('上传进度');
                        _this.upLoadPercent = res.progress;
                    })
                },
                fail : err => {
                    console.log(err);
                }
            })
        },
        // 保存视频
        saveVideoFn(_param){
            let _this = this;
            saveVideoInfo({
                "videoName":_param.name,    //"fad9a9cc561513f....mp4",
                "key":_param.key,
                "persistentId":_param.persistentId,
                "diaryId":_this.diaryId,
                "sourceType":_param.type,
                "isValid":0,
                "refType":4
            }).then(res=>{
                // console.log(res)
                if (res&&res.responseObject&&res.responseObject.responseStatus) {
                    _param.callBack(res.responseObject.responsePk)
                }
            }).catch(err=>{
                 console.log(err)
            })
        },
        //资源ID 获取
        getImgId(){
            let _imgIdList = [];
            //视频
            this.videoList.forEach((item,index)=>{
                _imgIdList.push({
                    "id":item.id,
                    "supplementType":"11",
                    "isValid":1,
                    "qiniuId":item.qiniuId
                })
            })
             //视频
            this.deleteVideoIdList.forEach((item,index)=>{
                _imgIdList.push({
                    "id":item.id,
                    "supplementType":"11",
                    "isValid":0,
                    "qiniuId":item.persistentId
                })
            })
            //图片
            this.imageList.forEach((item,index)=>{
                _imgIdList.push({
                    "id":item.imgId,
                    "supplementType":"10",
                    "isValid":1
                })
            })
            // 删除图片
            this.deleteSAttId.forEach((item,index)=>{
                _imgIdList.push({
                    "id":item.imgId,
                    "supplementType":"10",
                    "isValid":0
                })
            })
            return _imgIdList;
        },
        getContentId(type){
            console.log(type);
            let _imgIdList = [];
            let _idList = '';
            let _supplementQuestion = '';
            if (type=='1') {
                _supplementQuestion="更新日记视频"
                //视频
                this.videoList.forEach((item,index)=>{
                    _idList+=item.qiniuId+',';
                })
            } else {
                _supplementQuestion="更新日记图片";
                //图片
                this.imageList.forEach((item,index)=>{
                    _idList+=item.imgId+',';
                })
            }
            _imgIdList={
                "supplementQuestion":_supplementQuestion,
                "supplementContent":_idList.substring(0,_idList.length-1),
                "supplementType":type=='1'?"11":'10',
                "sortId":1
            }
            return _imgIdList;
        },
        // 存草稿
        saveLocal(){
            let _this = this;
            if (_this.inputVal.length==0 && _this.imageList.length==0 && _this.videoList.length==0) {
                _this.showTips({
                    type:'1',
                    title:'请填写更新内容'
                })
            }else{
                console.log(`------存草稿------`)
                let _inputListArr=[];
                let _inputValue = {
                    "supplementQuestion":"最近康复的怎么样？",
                    "supplementContent":_this.inputVal,
                    "supplementType":"9",
                    "sortId":1
                }
                _inputListArr.push(_inputValue);
                _inputListArr.push(_this.getContentId('1'));
                _inputListArr.push(_this.getContentId('2'));

                let _params={
                    diaryId:_this.diaryId,              //	string	是	日记id		
                    diarySupplementContentList:JSON.stringify(_inputListArr),    //string	是	日记内容（见详细说明）		
                    diarySupplementAttList:JSON.stringify(_this.getImgId()),     //string	是	日记图片List		
                    supplementId:_this.newSupId.length>0?_this.newSupId:_this.supplementId,    //		string	是	补充id（当前日记状态为草稿时传）		
                    isDraftFlag:'1',                    //		string	是	当前日记状态是否草稿（0-否1--是）		
                    visitSiteId:api.getSiteId(),        //		string	是	站点id		
                    isVideoFlag:'0',                    //	    string	是	是否术前术后视频（0-否1-是
                    supplementType:'9',
                }
                let _upParam={
                    id:'',                              //	string	是	主键id 1-草稿 | 2-待审核 中 ===》（审核失败| 审核通过）不传		
                    diaryId:_this.diaryId,              //	string	是	日记id		
                    supplementId:_this.newSupId.length>0?_this.newSupId:_this.supplementId,    //	string	是	版本号ID  规则同主键ID
                    isValid:'1',             //	string	是	有效无效（0-无效1-有效） 
                    status:'1',                // 日记状态（1-草稿2-待审核3-审核通过4-审核失败）发布时传2，删除时不传
                }
                _this.saveDateFn({
                    params:_params,
                    callBack:res=>{
                        _this.updateDateFn({
                            type:'草稿',
                            upParam:_upParam
                        });
                    }
                })
            }
        },
        // 发布
        publish(){
            let _this = this;
            if (_this.inputVal.length==0) {
                _this.showTips({
                    type:'1',
                    title:'请填写更新内容'
                })
            }else{
                console.log(`------发布------`)
                let _inputListArr=[];
                let _inputValue = {
                    "supplementQuestion":"最近康复的怎么样？",
                    "supplementContent":_this.inputVal,
                    "supplementType":"9",
                    "sortId":1
                }
                _inputListArr.push(_inputValue);
                _inputListArr.push(_this.getContentId('1'));
                _inputListArr.push(_this.getContentId('2'));
                let _params={
                    diaryId:_this.diaryId,              //	string	是	日记id		
                    diarySupplementContentList:JSON.stringify(_inputListArr),                  //		string	是	日记内容（见详细说明）		
                    diarySupplementAttList:JSON.stringify(_this.getImgId()),                   //		string	是	日记图片List		
                    supplementId:_this.newSupId.length>0?_this.newSupId:_this.supplementId,    //		string	是	补充id（当前日记状态为草稿时传）		
                    isDraftFlag:'1',                    //		string	是	当前日记状态是否草稿（0-否1--是）		
                    visitSiteId:api.getSiteId(),        //		string	是	站点id		
                    isVideoFlag:'0',                    //	    string	是	是否术前术后视频（0-否1-是
                    supplementType:'9',
                }
                let _upParam={
                    id:'',  //	string	是	主键id		
                    diaryId:_this.diaryId,  //	string	是	日记id		
                    supplementId:_this.newSupId.length>0?_this.newSupId:_this.supplementId,       //	string	是	是否有效（0-无效1-有效2-用户删除）  传2
                    isValid:'1',             //	string	是	有效无效（0-无效1-有效）
                    status:'2',             // 日记状态（1-草稿2-待审核3-审核通过4-审核失败）发布时传2，删除时不传
                }
                _this.saveDateFn({
                    params:_params,
                    callBack:res=>{
                        _this.updateDateFn({
                            type:'发布',
                            upParam:_upParam
                        });
                    }
                })
            }
        },
        //保存数据
        saveDateFn(param){
            let _this = this;
            createSupplementRecord(param.params).then(res=>{
                if (res&&res.responseObject&&res.responseObject.responseStatus) {
                    param.callBack()
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        // 视频播放 
        videoPlay(path) {
            const _url = `/packageA/videoPlayer/videoPlayer?videoUrl=${encodeURIComponent(path)}`;
            wx.navigateTo({
                url: _url
            });
        },
        //更新数据状态
        updateDateFn(submitData){
            let _this = this;
            recordUpdate(submitData.upParam).then(res=>{
                // console.log(res)
                if (res&&res.responseObject&&res.responseObject.responseStatus) {
                    //存草稿 发布成功
                    if (submitData.type=='草稿') {
                        _this.showTips({
                            title:"更新内容保存成功",
                            type:'1'
                        })        
                    }else{
                         _this.showTips({
                            title:"更新内容发布成功，待审核",
                            type:'1'
                        })
                    }
                    wx.setStorageSync('isRefresh',true)   //返回刷新
                    //跳发布页面     
                    setTimeout(() => {
                        wx.navigateBack({
                            delta:'1'
                        })
                    },2000)
                } else {
                    console.log('更新失败')
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //查看大图
        showBigImg(item, index, type) {
            let _imgArr = [];
            this.imageList.forEach((item, index) => {
                _imgArr.push(item.blob);
            });
            api.showBigImg({
                index: index,
                imgArr: _imgArr
            });
        },
        cancelDeletePic() {
            this.deletePic.index = "";
            this.deletePicTip = false;
        },
        ensureDeletePic() {
            let _this = this;
            switch (this.delateType){
                case '1':
                    let _deletePic = this.deletePic;
                    if (!this.imageList[_deletePic.index].fail) { 
                        _this.deleteSAttId.push({
                            imgId:this.imageList[_deletePic.index].imgId,
                        }) 
                    }
                    this.imageList.splice(_deletePic.index, 1);
                    this.failImgList.splice(_deletePic.index, 1);
                    this.deletePicTip = false;
                    break;
                case '2':
                    let _deleteVideo = this.deleteVideo;
                    //记录删除视频
                    if (!this.videoList[_deleteVideo.index].fail) {
                        _this.deleteVideoIdList.push({
                            id: this.videoList[_deleteVideo.index].id,
                            persistentId: this.videoList[_deleteVideo.index].qiniuId
                        })
                    }
                    //删除项
                    this.videoList.splice(_deleteVideo.index, 1);
                    this.deletePicTip = false;
                    break;
            }
        },
        // 删除Fn
        delateFn(type,item,index){
            let _this = this;
            _this.deletePicTip = true;
            _this.delateType = type;   //删除类型
            console.log(type,item,index)
            switch (type){
                case '1':
                    _this.tipText = '确定删除图片吗？';
                    _this.deletePic.index = index;
                    break;
                case '2':
                    _this.tipText = '确定删除视频吗？';
                    _this.deleteVideo.index = index;
                    break;
            }
        },
        // toast提示
        showTips(option){
            let _this = this;
            switch (option.type) {
                case '1':
                    wx.showToast({
                        title: option.title,
                        icon:'none',
                    })
                    break;
                case '2':
                    wx.showModal({
                        title: '',
                        content: '您还未上传视频',
                        showCancel:false,
                        confirmText:"我知道了"
                    })
                    break;
            }
      }
    }
}
</script>

<style lang="scss">
.update-box{
    .update-top{
        .upload-top-title{
            font-size:38px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(0,0,0,1);
            padding-left: 36px;
            margin-bottom: 20px;
            margin-top: 50px;
        }
        .upload-top-describe{
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(136,136,136,1);
            padding:0 36px;
        }
        .upload-top-textarea{
            margin: 52px 30px 0 30px;
            border: 1px solid #999999;
            padding: 28px 20px;
            position: relative;
            max-height: 271px;
            pre {
                display: block;
                visibility: hidden;
                font-size:28px;
                width: 100%;
                padding-left: 20px;
                padding-right: 20px;
                padding-top: 15px;
                box-sizing: border-box;
                min-height: 72px;
            }
            .input-textArea {
                width: 100%;
                padding-left: 20px;
                padding-right: 20px;
                padding-top: 15px;
                font-size:34px;
                line-height: 48px;
                color: #444444;
                border: 0 solid #e8ecef;
                box-sizing: border-box;
                min-height: 60px;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
            }
        }
    }
    .update-content{
        margin-top: 92px;
        .content-title{
            font-size:38px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(0,0,0,1);
            padding-left: 36px;
            margin-bottom: 16px;
        }
        .content-describe{
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(136,136,136,1);
            padding:0 36px;
            margin-bottom: 12px;
        }
        .upload-box{
            padding:0 0 0 36px;
            @include clearfix();
            .upload-img-item{
              width: 216px;
              height: 216px;
              float: left;
              margin-top: 20px;
              margin-right: 20px;
              position: relative;
              img{
                  width: 100%;
                height: 100%;
                vertical-align: top;
              }
              .delateBtn{
                  display: inline-block;
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 44px;
                  height: 44px;
                  background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/delatebtn.png') no-repeat center;
                  background-size: 100% 100%;
                  z-index: 1;
              }
              .imgItem-cover{
                display: inline-block;
                opacity: 0.83;
                background: #545454;
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                .imgItem-loading{
                    display: inline-block;
                    position: absolute;
                    width: 38px;
                    height: 38px;
                    background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png") no-repeat center;
                    background-size: 38px 38px;
                    top: 50%;
                    left: 50%;
                    margin-left: -19px;
                    margin-top: -19px;
                    animation: submitIng 1s linear infinite;
                    -webkit-animation: submitIng 1s linear infinite;
                    @keyframes submitIng {
                        0% {
                            -webkit-transform: rotate(0deg);
                        }
                        100% {
                            -webkit-transform: rotate(360deg);
                        }
                    }
                 }
                }
                .imgItem-fail{
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    opacity: 0.83;
                    background: #545454;
                    .imgItem-failText{
                        font-size:24px;
                        color: #ffffff !important;
                        text-align: center;
                        position: absolute;
                        top: 35%;
                        width: 100%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .imgItem-reloadText{
                        font-size:24px;
                        color: #ffffff !important;
                        text-align: center;
                        position: absolute;
                        top: 50%;
                        width: 100%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
               }
            }
            .uploadvideo-item{
                width: 216px;
                height: 162px;
                float: left;
                // background: url("../../../static/image/v1.1.4/videopic.jpg") no-repeat center;
                background-size: 100% 100%;
                margin-right: 20px;
                margin-top: 20px;
                position: relative;
                .videoItem{
                    width: 100%;
                    height: 100%;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .play-btn{
                        position: absolute;
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        top: 50%;
                        left: 50%;
                        margin-top: -30px;
                        margin-left: -30px;
                        // margin: 0 auto;
                        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/playbtn.png") no-repeat center;
                        background-size: 100% 100%;
                    }
                    .video-time{
                        position: absolute;
                        right: 4px;
                        bottom: 4px;
                        font-size:24px;
                        color: #ffffff;
                    }
                }
                .delateVideoBtn{
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 44px;
                    height: 44px;
                    background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/delatebtn.png') no-repeat center;
                    background-size: 100% 100%;
                    z-index: 2;
                }
                .upload-coverImg{
                    width: 216px;
                    height: 162px;
                    float: left;
                    // margin-right: 20px;
                    // margin-top: 30px;
                    background: #545454;
                    .tc-videoLoadingImg {
                        padding-top: 28px;
                        img {
                            margin: 0 auto;
                            width: 50px;
                            height: 50px;
                            display: block;
                            animation: rotate 1s linear forwards infinite;
                        }
                    }
                    .tc-videoLoadingText {
                        padding-top: 20px;
                        font-size: 28px;
                        color: #ffffff;
                        text-align: center;
                    }
                }
                .upload-success{
                    width: 216px;
                    height: 162px;
                    float: left;
                    margin-right: 20px;
                    img{
                    width:100%;
                    height: 100%;
                    }
                }
                .upload-fail{
                    width: 100%;
                    height: 100%;
                    background: #545454;
                    position: relative;
                    font-size: 28px;
                    color: #ffffff;
                    .fail-first{
                    display: inline-block;
                    width: 100%;
                    position: absolute;
                    top: 30%;
                    text-align: center
                    }
                    .fail-second{
                    display: inline-block;
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    text-align: center
                    }
                }
            }
            
            .upLoadItem{
              box-sizing: border-box;
              width: 216px;
              height: 216px;
              text-align: center;
              position: relative;
              display: inline-block;
              float: left;
              vertical-align: top;
              margin-top: 20px;
              background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/camera2.png") no-repeat center;
              background-size: 100% 100%;
              &.video{
                width: 216px;
                height: 162px;
                background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/uploadvideo@2x.jpg") no-repeat center;
                background-size: 100% 100%;
              }
            }
        }
    }
    .update-btnBox{
        @include clearfix();
        text-align: center;
        padding: 100px 60px;
        .btnBox-emailBtn{
            width:296px;
            height:88px;
            line-height: 88px;
            background:rgba(0,185,173,1);
            border-radius:8px;
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            float: left;
            margin-right: 38px;
            .email-iconbox{
                position: relative;
                padding-left: 60px;
                .email-icon{
                    position: absolute;
                    display: inline-block;
                    width: 60px;
                    height: 58px;
                    background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/emali.png') no-repeat center;
                    background-size: 100% 100%;
                    top: 50%;
                    margin-top: -29px;
                    left: 0;
                }
            }
        }
        .btnBox-pushBtn{
            width:296px;
            height:88px;
            line-height: 88px;
            background:rgba(0,185,173,1);
            border-radius:8px;
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            float: left;
            .push-iconbox{
                position: relative;
                padding-left: 60px;
                .push-icon{
                    position: absolute;
                    display: inline-block;
                    width: 60px;
                    height: 58px;
                    background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/push.png') no-repeat center;
                    background-size: 100% 100%;
                    top: 50%;
                    margin-top: -29px;
                    left: 0px;
                }
            }
        }
    }
}
</style>
