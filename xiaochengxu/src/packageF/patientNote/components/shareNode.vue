<template>
  <section class="shareNodeCon" v-if="isshow">
    <canvas-creator :params="params"
                    ref="canvas" v-if="isshow" @success="onCreateSuccess" @fail="onFail">

    </canvas-creator>
    <section class="shareContent">
      <i class="closeShareCon" @click="closeShare"></i>
      <article class="shareTitle">
        <h2><i class="iconTitle"></i><span>{{shareMap.manualName}}</span></h2>
      </article>
      <article class="shareContainer">
       <div class="contenList">
         <h4>{{shareMap.manualNum>0?(shareMap.manualNum+'个内容'):''}}</h4>
         <p class="contentItem">{{shareMap.manualNum>=1?('- '+shareMap.educationNameList[0].educationName):''}}</p>
         <p class="contentItem">{{shareMap.manualNum>=2?('- '+shareMap.educationNameList[1].educationName):''}}</p>
         <p class="contentItem" v-if="shareMap.manualNum>2">…</p>
       </div>
        <div class="doctorCon" v-if="shareMap.customerName">
          <h4>来自</h4>
          <figure class="doctorInfo">
            <img :src="shareMap.logoUrl"/>
            <div class="doctorDesc">
              <p class="doctorName">{{shareMap.customerName}}</p>
              <p class="doctorCom"><span class="doctorMedical">{{shareMap.medicalTitle}}</span><span>{{shareMap.company}}</span></p>
            </div>
          </figure>
        </div>
      </article>
      <div class="shareFoot">
        <div class="imgContainer">
          <img :src="shareMap.ticketUrl"/>
          <p class="wxTipDesc">微信中识别小程序码<br/>免费查看所有内容</p>
        </div>
      </div>
      <div class="saveBtnCon">
        <button @click="saveImagePhoto">保存到手机</button>
      </div>
    </section>
    <EnsureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></EnsureConfirm>
  </section>
</template>

<script>
  import CanvasCreator from "components/canvasCreator/canvasCreator2";
  import api from 'common/js/util/util';
  import EnsureConfirm from "components/ensure";
  // let getShareTicket='http://10.1.8.5:8080/static/js/jourList4.json';//手册详情--分享接口
  let getShareTicket=api.httpEnv() +'/mcall/cms/patienteducation/v1/getShareTicket/';//手册详情--分享接口
    export default {
      props:{
        manualId:{
          type:String
        },
        doctorId:{
          type:String
        }
      },
      data(){
       return{
         isshow:false,
         params:{},
         shareImg:'',
         shareMap:{},
         ensureShow:false,
         ensureParams: {
           content: "唯医骨科需获取您的授权信息，以方便您后续使用",
           ensure: "确定",
           type: "openSetting"
         },
       }
      },
        name: "share-node",
      methods:{
        closeShare(){
          this.$emit('shareClose',false);
        },
        goToSetting(e){
          if (e.mp.detail.errMsg==="openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']){
            this.ensureShow = false;
            this.saveImage();
          }else{
            this.ensureShow = false;
          }
        },
        saveImagePhoto(){
          let _this=this;
          wx.getSetting({
            success: (res) => {
              if (res.authSetting['scope.writePhotosAlbum']) {//授权成功
                _this.saveImage();
              }else {//授权失败
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: function (res) {//写入成功
                    _this.saveImage();
                  },
                  fail:function (err) {//写入失败
                    wx.showToast({
                      title:'微信授权失败，请重试',
                      icon:'none'
                    });
                    _this.ensureShow = true;
                  }
                })
              }
            },
            fail: (err) => {
              wx.showToast({
                title:'微信授权失败，请重试',
                icon:'none'
              });
            }
          });
        },
        saveImage() {
          if(this.shareImg){
            wx.saveImageToPhotosAlbum({
              filePath: this.shareImg,
              success: (res) => {
                wx.showModal({
                  title: "图片已保存至手机相册",
                  content: '快去分享给朋友们吧',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#00BEAF'
                });
              },
              fail: (() => {
                wx.getSetting({
                  success: (res) => {
                    if (res.authSetting['scope.writePhotosAlbum']) {
                      this.saveImage();
                    }else {
                      this.ensureShow = true;
                    }
                  },
                  fail: (err) => {
                    console.log(err);
                  }
                });
              })
            })
          }else {
            wx.showToast({
              title: '图片生成失败，请关闭卡片重试',
              icon: 'none',
              duration: 2000
            })
          }

        },
        onCreateSuccess(e) {
          wx.hideLoading();
          this.shareImg = e;
        },
        onFail(e){
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
            duration: 2000
          })
        },
        getCanvasMessage(){
          let t=this;
          if (!this.shareMap.customerName) {
            this.params = {
              width: 628,
              height: 642,
              backgroundColor: '#fff',
              debug: false,
              texts: [
                {
                  x: 90,
                  y: 52,
                  baseLine: 'middle',
                  text: this.shareMap.manualName?this.shareMap.manualName:'',
                  lineNum: 2,
                  fontSize: 38,
                  width: 494,
                  color: 'white',
                  lineHeight: 44,
                  zIndex: 1
                },
                {
                  x: 46,
                  y: 212,
                  baseLine: 'middle',
                  text: `${this.shareMap.manualNum>0?(this.shareMap.manualNum+'个内容'):''}`,
                  fontSize: 34,
                  width: 532,
                  color: '#333333',
                  lineHeight: 34,
                  fontWeight:'bold',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 280,
                  baseLine: 'middle',
                  width: 532,
                  text: `${this.shareMap.manualNum>=1?('- '+this.shareMap.educationNameList[0].educationName):''}`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 338,
                  baseLine: 'middle',
                  width: 532,
                  text: `${this.shareMap.manualNum>=2?('- '+this.shareMap.educationNameList[1].educationName):''}`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 382,
                  baseLine: 'middle',
                  text: `${this.shareMap.manualNum>2?'…':''}`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 520,
                  baseLine: 'middle',
                  text: '微信中识别小程序码 ',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 555,
                  baseLine: 'middle',
                  text: '免费查看所有内容',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
              ],
              images: [
                {
                  width: 628,
                  height: 642,
                  x: 0,
                  y: 0,
                  url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_small.png',
                  zIndex: 0,
                  backgroundColor: '#000000'
                },
              ]
            };
          } else{
            this.params = {
              width: 628,
              height: 862,
              backgroundColor: '#fff',
              debug: false,
              texts: [
                {
                  x: 90,
                  y: 52,
                  baseLine: 'middle',
                  text: this.shareMap.manualName?this.shareMap.manualName:'',
                  lineNum: 2,
                  fontSize: 38,
                  width: 494,
                  color: 'white',
                  lineHeight: 44,
                  zIndex: 1
                },
                {
                  x: 46,
                  y: 212,
                  baseLine: 'middle',
                  // text: `${this.shareMap.manualNum}个内容`,
                  text: `${this.shareMap.manualNum>0?(this.shareMap.manualNum+'个内容'):''}`,
                  fontSize: 34,
                  width: 532,
                  color: '#333333',
                  lineHeight: 34,
                  fontWeight:'bold',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 280,
                  width: 532,
                  baseLine: 'middle',
                  text: `${this.shareMap.manualNum>=1?('- '+this.shareMap.educationNameList[0].educationName):''}`,
                  // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 338,
                  width: 532,
                  baseLine: 'middle',
                  text: `${this.shareMap.manualNum>=2?('- '+this.shareMap.educationNameList[1].educationName):''}`,
                  // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 382,
                  baseLine: 'middle',
                  text: `${this.shareMap.manualNum>2?'…':''}`,
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 44,
                  y: 452,
                  baseLine: 'middle',
                  text: '来自',
                  fontSize: 34,
                  color: '#333333',
                  zIndex: 1
                },
                {
                  x: 168,
                  y: 540,
                  baseLine: 'middle',
                  width: 404,
                  text: `${this.shareMap.customerName?this.shareMap.customerName:''}`,
                  // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
                  fontSize: 32,
                  color: '#333333',
                  zIndex: 1
                },
                {
                  x: 168,
                  y: 586,
                  baseLine: 'middle',
                  width: 404,
                  text: `${this.shareMap.medicalTitle?this.shareMap.medicalTitle:''} ${this.shareMap.company?this.shareMap.company:''}`,
                  // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
                  fontSize: 26,
                  color: '#888888',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 738,
                  baseLine: 'middle',
                  text: '微信中识别小程序码 ',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 770,
                  baseLine: 'middle',
                  text: '免费查看所有内容',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
              ],
              images: [
                {
                  width: 628,
                  height: 862,
                  x: 0,
                  y: 0,
                  url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_big.png',
                  zIndex: 0,
                  backgroundColor: '#000000'
                },
              ]
            };
          }

          if(this.shareMap.ticketUrl){//有二维码
            //默认有医生二维码位置
            let ticketUrlObj={
                width: 126,
                height: 126,
                x: 44,
                y: 696,
                url:this.shareMap.ticketUrl,
                // url:'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_big.png',
                zIndex: 1,
              };
            if(!this.shareMap.customerName){//没有医生
              //没有医生二维码位置
              ticketUrlObj={
                width: 126,
                height: 126,
                x: 44,
                y: 476,
                url:this.shareMap.ticketUrl,
                zIndex: 1,
              };
            }else {//有医生
              if(this.shareMap.logoUrl){//有医生头像
                this.params.images.push({
                  width: 88,
                  height: 88,
                  x: 64,
                  y: 520,
                  url: this.shareMap.logoUrl,
                  circle:1,
                  zIndex: 1,
                })
              }
            }
            //添加二维码
            this.params.images.push(ticketUrlObj);
          }

          t.isshow=true;
          this.$nextTick(() => {
            this.$refs.canvas.onCreate();
          })
        },
        //手册详情--分享接口
        getShareMap(){
          let t=this;
          wx.showLoading({
            title: '加载中',
          });
          api.ajax({
            url:getShareTicket,
            method: 'post',
            data: {
              manualId:t.manualId,
              doctorId:t.doctorId
            },
            timeout: 30000,
            done(response) {
              wx.hideLoading();
              if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.dataList){
                let dataList=response.responseObject.responseData.dataList;
                if(dataList.length&&JSON.stringify(dataList[0])!='{}'){
                  t.shareMap=dataList[0];
                  t.getCanvasMessage();
                }else {
                  t.$emit('shareClose',false);
                  wx.showToast({
                    title: '分享信息获取失败',
                    icon: 'none',
                    duration: 2000
                  })
                }


              }else {
                t.$emit('shareClose',false);
                wx.showToast({
                  title: '分享信息获取失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        },
      },
      mounted(){
        this.getShareMap();
      },
      components: {
        CanvasCreator,
        EnsureConfirm
      }
    }
</script>

<style scoped lang="scss">
.shareNodeCon{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background:rgba(0,0,0,.85);
  .shareContent{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 624px;
    .closeShareCon{
      position: absolute;
      background: url("https://m.allinmed.cn/static/image/mp/index/canvasClose.png") center center no-repeat;
      background-size: contain;
      top: -30px;
      right: -30px;
      width: 60px;
      height: 60px;
      z-index: 2;
    }
    .shareTitle{
      background:linear-gradient(314deg,rgba(0,209,181,1) 0%,rgba(0,185,173,1) 100%);
      border-radius:20px 20px 0px 0px;
      h2{
        text-align: left;
        font-size:38px;
        font-family:PingFangSC-Semibold;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:38px;
        padding: 48px 44px 42px;
        position: relative;
        .iconTitle{
          width: 34px;
          height: 36px;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/zhinan_icon.png") center center no-repeat;
          background-size: contain;
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
          position: absolute;
          top:54px;
        }
        span{
          display: inline-block;
          vertical-align: middle;
          width: 494px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 44px;
          margin-left: 46px;
        }
      }
    }
    .shareContainer{
      background:rgba(255,255,255,1);
      /*border-radius:0px 0px 20px 20px;*/
      padding: 0 44px;
      .contenList{
        h4{
          padding-top: 44px;
          padding-bottom: 40px;
          font-size:34px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:34px;
        }
        .contentItem{
          margin-bottom: 32px;
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(119,119,119,1);
          text-overflow: ellipsis;
          white-space: nowrap;
          /*width: 502px;*/
          overflow: hidden;
          width: 100%;
          line-height:32px;
        }
      }
      .doctorCon{
        h4{
          padding-top: 14px;
          padding-bottom: 40px;
          font-size:34px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:34px;
        }
        .doctorInfo{
          width:510px;
          /*height:120px;*/
          background:rgba(245,250,248,1);
          border-radius:8px;
          padding: 16px 18px;
          font-size: 0;
          img{
            width: 88px;
            height: 88px;
            vertical-align: middle;
            margin-right: 16px;
          }
          .doctorDesc{
            display: inline-block;
            vertical-align: middle;
            .doctorName{
              font-size:32px;
              font-family:PingFangSC-Medium;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:32px;
              margin-bottom: 14px;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 405px;
              overflow: hidden;
            }
            .doctorCom{
              width: 405px;
              font-size:26px;
              font-family:PingFangSC-Light;
              font-weight:300;
              color:rgba(136,136,136,1);
              line-height:28px;
              text-overflow: ellipsis;
              white-space: nowrap;
              /*width: 502px;*/
              overflow: hidden;
              .doctorMedical{
                margin-right: 12px;
              }
            }
          }
        }
      }
      padding-bottom: 1px;
    }
    .shareFoot{
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/Group 17 Copy.png") center center no-repeat;
      background-size: contain;
      width: 624px;
      height: 236px;
      margin-top: -1px;
      .imgContainer{
        font-size: 0;
        padding-top: 78px;
        img{
          width: 136px;
          height: 136px;
          vertical-align: middle;
          margin-right: 30px;
          margin-left: 44px;
        }
        .wxTipDesc{
          display: inline-block;
          vertical-align: middle;
          width: 300px;
          color: #818181;
          font-size: 26px;
        }
      }
    }
    .saveBtnCon{
      text-align: center;
      margin-top: 60px;
      button{
        width:280px;
        height:90px;
        background:rgba(255,253,250,1);
        border-radius:8px;
        font-size:32px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(7,182,172,1);
        line-height: 90px;
      }
    }
  }
}
</style>
