<template>
  <section class="videoContent">
    <!-- 术前 -->
    <section class="first-box">
      <section class="title-box">
        <p class="title-box-title"><span class="title-icon"></span>术前视频</p>
        <p class="title-box-describe">因肢体功能异常造成的生活和行动不便的视频</p>
      </section>
      <section class="videoBox" >
        <li class="videoList" v-for="(item, index) in videoList1" :key="index">
          <div class="videoItem" v-if="!item.fail&&item.finish&&item.imageUrl.length>0" @click="videoPlay(item.attUrl)">
            <img :src="item.imageUrl" alt="">
            <span class="play-btn"></span>
            <span class="video-time">{{item.playTime}}</span>
          </div>
          <span class="delateVideoBtn" v-if="item.finish" @click="delateFn('1',item,index)"></span>
          <!-- loading -->
          <div class="upload-coverImg" v-if="!item.finish">
             <div class="tc-videoLoadingImg" >
                <img src="https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png" alt="">
            </div>
            <p class="tc-videoLoadingText">上传中 {{upLoadPercent1}} %...</p>
          </div>
          <!-- 待转码 -->
          <div class="upload-success" v-if="item.finish&&!item.fail&&item.imageUrl.length==0">
            <img src="https://m.allinmed.cn/static/image/mp/index/1.1.4/videoBanner.jpg" alt="">
          </div>
          <!-- 失败 -->
          <div class="upload-fail" v-if="item.finish&&item.fail">
            <span class="fail-first">上传失败</span><span class="fail-second">请重新上传</span>
          </div>
        </li>
        <section class="wxChoseFileBtn" v-if="!videoUploading1&&videoList1.length<2" @click="wxChoseVideoFile('1')"></section>
      </section>
    </section>
    <!-- 术后 -->
    <section class="second-box">
      <section class="title-box">
        <p class="title-box-title"><span class="title-icon"></span>术后视频</p>
        <p class="title-box-describe">术后下地活动视频、日常锻炼小视频</p>
      </section>
      <section class="videoBox" >
        <li class="videoList" v-for="(item, index) in videoList2" :key="index">
          <div class="videoItem" v-if="!item.fail&&item.finish&&item.imageUrl.length>0" @click="videoPlay(item.attUrl)">
            <img :src="item.imageUrl" alt="">
            <span class="play-btn"></span>
            <span class="video-time">{{item.playTime}}</span>
          </div>
          <span class="delateVideoBtn" v-if="item.finish" @click="delateFn('2',item,index)"></span>
          <div class="upload-coverImg" v-if="!item.finish">
             <div class="tc-videoLoadingImg" >
                <img src="https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png" alt="">
            </div>
            <p class="tc-videoLoadingText">上传中 {{upLoadPercent2}} %...</p>
          </div>
          <!-- 暂无播放 -->
          <div class="upload-success" v-if="item.finish&&!item.fail&&item.imageUrl.length==0">
            <img src="https://m.allinmed.cn/static/image/mp/index/1.1.4/videoBanner.jpg" alt="">
          </div>
          <!-- 失败 -->
          <div class="upload-fail" v-if="item.finish&&item.fail">
            <span class="fail-first">上传失败</span><span class="fail-second">请重新上传</span>
          </div>
        </li>
        <section class="wxChoseFileBtn" v-if="videoList2.length<2&&!videoUploading2" @click="wxChoseVideoFile('2')"></section>
      </section>
    </section>
    <!-- 提交 -->
    <section class="videoBtn-box">
      <section class="videoBtn ensure" @click="videoEnsure"><span>完成</span></section>
      <section class="videoBtn later" @click="videoBack"><span>稍后上传</span></section>
    </section>
    <!-- toast -->
    <confirm :confirmParams="{
      'ensure':'取消',
      'cancel':'确定',
      'title':tipText,
      }" v-if="deleteVideoTip" :showFlag.sync="deleteVideoTip" @cancelClickEvent="ensureDeletePic()" @ensureClickEvent="cancelDeletePic()">
    </confirm>
  </section>
</template>

<script>
/**
 *  日记上传视频组件
 * 
 *  create by JK on 2018/11/28
 */

  import api from 'common/js/util/util';
  import localStorage from "localStorage";
  import getQiniuToken from "common/js/HttpRequest/getQiniuToken";
  import confirm from "components/confirm";

  import getJourDetail from "common/js/journal/getDiaryDetails";
  import saveVideoInfo from "common/js/journal/saveVideo";
  import createSupplementRecord from "common/js/journal/createSupplementRecord";

  export default {
    name: 'attachment',
    data() {
      return {
        diaryId:'',               //主日记ID

        upLoadType:'',     //上传类型  1-术前 2-术后
        tokenObj:{},          //七牛 token 对象

        videoList1:[],         //视频列表
        videoList2:[],

        videoUploading1: false,
        videoUploading2: false,

        videoObj1: {},         //本地文件对象
        videoObj2: {},

        videoSubmitParam1 : [], //提交参数
        videoSubmitParam2 : [],

        upLoadPercent1:'',      //视频上传进度
        upLoadPercent2:'',      //视频上传进度

        deleteVideoTip:false,
        tipText:'',
        
        delVideoList1:[],           // 视频删除list
        delVideoList2:[],


        delateType: '',      //删除类型
        delIndex :'',           //删除索引
        delItem :{},           //删除项
      } 
    },
    onLoad(option){
      this.videoList1=[];             //视频列表
      this.videoList2=[];
      this.delVideoList1=[];       // 视频删除list
      this.delVideoList2=[];
      this.videoSubmitParam1 =[]; //提交参数
      this.videoSubmitParam2 =[];
      this.diaryId = option.diaryId   //日记ID
    },
    onShow(){},
    mounted() {
      this.getQiniuTokenFn();  //获取token
      this.getJourDetails();      //获取详情
    },
    computed: {},
    watch: {},
    components: {
      confirm
    },
    methods: {
      //主日记详情
      getJourDetails(){
        let _this = this;
        getJourDetail({
          sortType:'',                        //string	是	排序		
          imgUseFlag:'5',                     //string	是	图片规格尺寸	  5
          videoUseFlag:'8',                   //	string	是	图视频规格尺寸	  8
          diaryId:_this.diaryId,              //	string	是	日记id
        }).then(res=>{
          console.log(res)
          if (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList) {
              let _data = res.responseObject.responseData.dataList[0];
              let _beforeOperationVideoList = _data.beforeOperationVideoList?_data.beforeOperationVideoList:'';
              let _afterOperationVideoListt = _data.afterOperationVideoList?_data.afterOperationVideoList:'';
              if(_beforeOperationVideoList.length>0){
                _beforeOperationVideoList.forEach(element => {
                  _this.videoList1.push(Object.assign(element,{
                    fail:false,
                    finish:true,
                  }))
                });
              }
              if(_afterOperationVideoListt.length>0){
                _afterOperationVideoListt.forEach(element => {
                  _this.videoList2.push(Object.assign(element,{
                    fail:false,
                    finish:true,
                  }))
                });
              }
          }
        }).catch(err=>{
            console.log(err)
        })
      },
      //获取七牛token
      getQiniuTokenFn(){
        let _this = this;
        getQiniuToken().then( (result) => {
          _this.tokenObj = result.responseObject;
        });
      },
      //视频上传
      wxChoseVideoFile(index){
        let _this = this;
        _this.upLoadType = index;
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
                    //上传前
                    if (index=='1') {
                      _this.videoUploading1 = true;              //上传中
                      _this.videoObj1 = res;                            //本地文件对象
                      _this.videoList1.push({
                        fail:false,      //是否上传失败
                        finish:false,   //是否上传完成
                      })
                    } else {
                      _this.videoUploading2 = true;              //上传中
                      _this.videoObj2 = res;                            //本地文件对象
                      _this.videoList2.push({
                        fail:false,       //是否上传失败
                        finish:false,    //是否上传完成
                      })
                    }
                    //七牛上传
                    const uploadTask = wx.uploadFile({
                        url: 'https://up-z1.qbox.me',            //如果是华北一请用up-z1.qbox.me
                        filePath: res.tempFilePath,
                        name: 'file',
                        formData: {
                            'key': _this.tokenObj.key,
                            'token': _this.tokenObj.uptoken,
                        },
                        success: function(response) {
                            let data = JSON.parse(response.data);
                            _this.getQiniuTokenFn();                    //获取token
                            //本地视频链接
                            if (index=='1') {
                              _this.videoUploading1 = false;        //上传完成
                              _this.videoSubmitParam1.push(data);   //提交参数
                              _this.saveVideoFn({
                                name:'',                  //文件名
                                key:data.key,         //token
                                persistentId:data.persistentId,   //七牛Id 
                                type:'7',
                                callBack:backData=>{
                                  _this.videoList1[_this.videoList1.length-1]={
                                    fail:false,
                                    finish:true,
                                    attUrl	:res.tempFilePath,            //	播放地址
                                    qiniuId	:data.persistentId,          //	七牛ID
                                    attType	:'',          //2    
                                    qiniuStatus	:	'',     //视频状态 2-转码成功  
                                    imageUrl	:	'',       //封面图    http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                                    playTime	:	'',       //视频时长  00:00:21
                                    id:backData       //视频保存成功 responsePk
                                  }
                                  _this.upLoadPercent1 = 0;             //上传进度
                                  _this.$forceUpdate();
                                }
                              })
                            } else {
                              _this.videoUploading2 = false;                 //上传完成
                              _this.videoSubmitParam2.push(data);    //提交参数
                               _this.saveVideoFn({
                                name:'',                //文件名  "fad9a9cc561513f....mp4",
                                key:data.key,       //token
                                persistentId:data.persistentId,   //七牛Id 
                                type:'8',
                                callBack:backData=>{
                                  _this.videoList2[_this.videoList2.length-1]={
                                    fail:false,
                                    finish:true,
                                    attUrl	:res.tempFilePath,    //	http://vpro.allinmed.cn/1544261651797_480_320.mp4
                                    qiniuId	:data.persistentId,    //	z1.5c0b904dc0ebc160e492b42c 
                                    attType	:'',          //2    
                                    qiniuStatus	:	'',     //2  
                                    imageUrl	:	'',       //http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                                    playTime	:	'',       //00:00:21
                                    id:backData       //"4321"
                                  }
                                  _this.upLoadPercent2 = 0;             //上传进度
                                  _this.$forceUpdate();
                                }
                              })
                            }
                        },
                        fail(error) {
                            console.log(error)
                            if (index=='1') {
                              _this.videoUploading1 = false;        //上传完成
                              _this.upLoadPercent1 = 0;               //上传进度
                              _this.videoList1[_this.videoList1.length-1]={
                                fail:true,
                                finish:true,
                              }
                            } else {
                              _this.videoUploading2 = false;        //上传完成
                              _this.upLoadPercent2 = 0;               //上传进度
                              _this.videoList2[_this.videoList2.length-1]={
                                fail:true,
                                finish:true,
                              }
                            }
                        },
                        complete(res) {
                            // console.log(res)
                        }
                    });
                    // 上传进度
                    uploadTask.onProgressUpdate((res) => {
                        // console.log('上传进度');
                        if (index=='1') {
                          _this.upLoadPercent1 = res.progress;
                        } else {
                          _this.upLoadPercent2 = res.progress;
                        }
                    })
            },
            fail : err => {
                console.log(err);
            }
        })
      },
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
            _param.callBack(res.responseObject.responsePk)   //回调 
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 点击完成
      videoEnsure(){
        if (this.videoList1.length==0&&this.videoList2.length==0) {
          this.showTips({
            type:'2',
            content:'您还未上传视频'
          })
        }else{
          this.saveVideo()             //保存视频     
        }
      },
      // 点击返回
      videoBack(){
        wx.navigateBack({
          delta:'1'
        })
      },
      //提交上传并返回
      saveVideo(){
        let _this = this;
        let _beforContentList =_this.getContentList();    // 术前
        let _diarySupplementAttList =_this.getAttList();  // 术后
        let _param = {
          "diaryId":_this.diaryId,
          "isVideoFlag":1,
          "diarySupplementContentList":JSON.stringify(_beforContentList),
          "diarySupplementAttList":JSON.stringify(_diarySupplementAttList),
          "isDraftFlag":0,
          "visitSiteId":api.getSiteId()
        }
        createSupplementRecord(_param).then(res=>{
          if (res&&res.responseObject&&res.responseObject.responseStatus) {
            localStorage.setItem("isReflesh",true)              //保存成功 需要刷新页面
            wx.navigateBack({
                delta:'1'
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      //拼接问题Id list
      getContentList(){
        let _this = this;
        let _data = [];
        let _qiniuID1 = '';
        let _qiniuID2 = '';
        _this.videoList1.forEach(item=>{
          _qiniuID1+=item.qiniuId+','
        })
        _data.push({
          "supplementQuestion":"术前视频",
          "supplementContent":_qiniuID1.substring(0, _qiniuID1.length-1),
          "supplementType":"7",
          "sortId":1
        })
        _this.videoList2.forEach(item=>{
          _qiniuID2+=item.qiniuId+','
        })
        _data.push({
          "supplementQuestion":"术后视频",
          "supplementContent":_qiniuID2.substring(0, _qiniuID2.length-1),
          "supplementType":"8",
          "sortId":1
        })
        return _data;
      },
      //拼接视频Id list
      getAttList(){
        let _this = this
        let _data = [];
        _this.videoList1.forEach(element => {
          _data.push({
            "id":element.id,
            "qiniuId":element.qiniuId,
            "supplementType":"7",
            "isValid":1
          })
        });
        _this.videoList2.forEach(element => {
          _data.push({
            "id":element.id,
            "qiniuId":element.qiniuId,
            "supplementType":"8",
            "isValid":1
          })
        });
        _this.delVideoList1.forEach(element => {
          _data.push({
            "id":element.id,
            "qiniuId":element.qiniuId,
            "supplementType":"7",
            "isValid":0
          })
        });
        _this.delVideoList2.forEach(element => {
          _data.push({
            "id":element.id,
            "qiniuId":element.qiniuId,
            "supplementType":"8",
            "isValid":0
          })
        });
        return _data;
      },
      // toast取消删除
      cancelDeletePic() {
          this.deleteVideoTip = false;
      },
      // toast确认删除
      ensureDeletePic() {
          switch (this.delateType){
              case '1':
                  if(!this.delItem.fail){
                    //非上传失败
                    this.delVideoList1.push(this.videoList1[this.delIndex])     //记录删除ID
                    this.videoSubmitParam1.splice(this.delIndex,1)
                  }
                  this.videoList1.splice(this.delIndex, 1);    //数组删除item
                  this.deleteVideoTip = false;
                  break;
              case '2':
                  if(!this.delItem.fail){
                    //非上传失败
                    this.delVideoList2.push(this.videoList2[this.delIndex])     //记录删除ID
                    this.videoSubmitParam2.splice(this.delIndex,1)
                  }
                  this.videoList2.splice(this.delIndex, 1);
                  this.deleteVideoTip = false;
                  break;
          }
      },
      // 视频删除
      delateFn(type,item,index){
        this.deleteVideoTip = true;
        this.tipText = '确定删除视频吗？';
        this.delateType = type;
        this.delIndex = index;
        this.delItem = item;
      },
      // 视频播放 
      videoPlay(path) {
        const _url = `/packageA/videoPlayer/videoPlayer?videoUrl=${encodeURIComponent(path)}`;
        wx.navigateTo({
          url: _url
        });
      },
      // toast提示
      showTips(option){
        let _this = this;
        switch (option.type) {
          case '1':
            wx.showToast({
              title: '您还未上传视频',
              icon:'none',
            })
            break;
          case '2':
            wx.showModal({
              title: '',
              content: option.content,
              showCancel:false,
              confirmText:"我知道了"
            })
            break;
          default:
            break;
        }
      }
    }
  }
</script>
<style lang="scss">
.videoContent{
  .title-box{
    padding: 0 30px;
    .title-box-title{
      font-size:38px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(34,34,34,1);
      position: relative;
      padding-left: 50px;
      .title-icon{
        position: absolute;
        display: inline-block;
        width: 60px;
        height: 60px;
        background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/smile.png') no-repeat center;
        background-size: 100% 100%;
        top: 50%;
        margin-top:-30px;
        left: -10px;
      }
    }
    .title-box-describe{
      background:rgba(88,128,237,0.08);
      border-radius:6px;
      padding: 14px 20px;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(102,102,102,1);
      margin: 40px 0;
    }
  }
  .first-box{
    margin-top:20px; 
  }
  .second-box{
    margin-top: 58px;
  }
  .videoBox{
    padding:0 40px 40px;
    @include clearfix();
    .videoList{
      width: 216px;
      height: 162px;
      float: left;
      margin-right: 20px;
      margin-top: 10px;
      position: relative;
      .videoItem{
        width: 216px;
        height: 162px;
        position: relative;
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
        margin-right: 20px;
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
    .wxChoseFileBtn{
      width: 216px;
      height: 162px;
      margin: 10px 0;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/uploadvideo@2x.jpg") no-repeat center;
      background-size: 100% 100%;
      float: left;
    }
  }
  .videoBtn-box{
    padding-top: 50px;
    bottom: 100px;
    width: 100%;
    padding-bottom: 100px;
    .videoBtn{
      text-align: center;
      font-size: 28px;
      margin-bottom: 20px;
      &.ensure{
        span{
          display: inline-block;
          width:560px;
          height:96px;
          background:rgba(0,185,173,1);
          border-radius:8px;
          color: #ffffff;
          line-height: 96px;
          font-size: 36px;
        }
      }
      &.later{
        span{
          display: inline-block;
          width: 120px;
          text-align: center;
          color: #888888;
          font-size: 30px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
