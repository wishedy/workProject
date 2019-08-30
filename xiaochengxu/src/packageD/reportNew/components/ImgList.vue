<template>
  <section class="question-imgList" :class="{'imgList-more':imgList.imgSrcArr.length>=6}">
    <article class="question-title">
      {{imgList.title}}
      <p v-if="imgList.descShow" class="question-desc">{{imgList.descShow}}</p>
    </article>
    <ul class="img-list">
      <li v-for="(item,index) in imgList.imgSrcArr" :key="index" class="img-list-item">
        <img :src="item.path||item.caseAttUrl" @click="previewImage(index)"/>
        <span class="imgItem-cover" v-if="(!item.upload)&&(!item.attId)"><span class="imgItem-loading"></span></span>
        <i class="close-icon" @click.stop="imgDelToast(index)"></i>
        <figure class="imgItem-fail" v-if="item.fail" @click.stop="upLoadPic(item,index)">
          <p class="imgItem-failText">上传失败</p>
          <p class="imgItem-reloadText">点击重试</p>
        </figure>
      </li>
      <li @click="addImg" v-if="imgList.imgSrcArr.length<12" class="img-list-item wxChoseFileBtn">
      </li>
    </ul>
    <form action="" @submit="formSubmit" report-submit="true">
      <button class="question-next active"
              type="submit"
              formType="submit"
              :class="{'next-fixed':imgList.imgSrcArr.length<6}"
              @click="nextSubmit"
      >下一步</button>
    </form>
    <logo-loading v-if="isLoading"></logo-loading>
  </section>
</template>

<script>
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import createReport from "common/js/report/createReport";//完善保存信息
  import getReportList from "common/js/report/getReportList";//获取保存信息
  import logoLoading from 'components/LogoLoading';
  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  import updateLoad from "common/js/upLoadPic/upLoadComm";
  import util from "common/js/util/util";
  const xhr = {
    caseUrl:util.httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/",
  }
    export default {
      props:{
        imgList:{
          type:Object
        }
      },
      components:{
        logoLoading
      },
      data(){
        return{
          isLoading:0,
          isBtnClick:false,
          sortId:0
        }
      },
      computed:{
        ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
      },
      methods:{
        // 上传图片
        upLoadPic(item,index) {
          console.log(item)
          let _this=this;
          _this.sortId++;
          let _defaultData = {
            caseCategoryId: "", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
            imageType: "0",     //	string	是	资源类型		1-上传资料图片
            visitSiteId: "24",
            sortId:_this.sortId
          };
          // _this.isLoading++;
          _this.imgList.imgSrcArr[index].upload=false;
          _this.imgList.imgSrcArr[index].fail=false;
          wx.uploadFile({
            url: xhr.caseUrl,
            filePath:item.path,
            name: "file",
            formData: _defaultData,
            success: function (res) {
              // _this.isLoading--;
              _this.imgList.imgSrcArr[index].upload=true;
              if(res&&res.data){
                var _data = JSON.parse(res.data);
                console.log(_data);
                // 接口返回成功
                if (_data.responseObject.responsePk > 0) {
                  _this.imgList.imgSrcArr[index].fail=false;
                  _this.imgList.imgSrcArr[index].attId=_data.responseObject.responsePk;
                  console.log(_this.imgList.imgSrcArr)
                } else {
                  // 接口返回失败
                  _this.imgList.imgSrcArr[index].fail=true;
                }
              }else {
                _this.imgList.imgSrcArr[index].fail=true;
              }
              _this.$forceUpdate();
            },
            fail: function (err) {
              //微信接口调用失败
              _this.imgList.imgSrcArr[index].upload=true;
              _this.imgList.imgSrcArr[index].fail=true;
              _this.$forceUpdate();
            },
            complete: function () {
              //微信接口调用结束

            }
          });
        },
        /** 发送formId */
        formSubmit(e) {
          sendFormId(e.target.formId);
        },
        //删除图片确定模态
        imgDelToast(index){
          let _this = this;
          wx.showModal({
            // title: '确定删除图片吗？',
            content: '确定删除图片吗？',
            cancelText : '确定',
            cancelColor: '#00beaf',
            confirmText: '取消',
            confirmColor: '#00beaf',
            success: function(res) {
              if (res.confirm) {

              } else if (res.cancel) {
                _this.deleteImg(index);
              }
            }
          })
        },
        deleteImg(index){
          let _this = this;
          _this.isLoading++;
          updateLoad({
            id: _this.imgList.imgSrcArr[index].attId,
            isValid: "0"
          })
            .then(res => {
              _this.isLoading--;
              _this.imgList.imgSrcArr.splice(index,1);
            })
            .catch(err => {
              console.log(err);
            });

        },
        previewImage(index){
          let _this = this;
          let _imgurls = [];
          console.log(_this.imgList.imgSrcArr)
          _this.imgList.imgSrcArr.forEach((ele,index) =>{
            _imgurls.push(ele.path||ele.caseAttUrl);
          });
          wx.previewImage({
            current: _imgurls[index], // 当前显示图片的http链接
            urls: _imgurls // 需要预览的图片http链接列表
          })
        },
        //下一步
        nextSubmit(){
          if(!this.isBtnClick){
            let  _this=this,
              url=`/packageA/imSceneDoctor/imSceneDoctor?caseId=${_this.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&reportId=${_this.reportId}&from=report`,
              reportIsFinish=0,sortId,attIdList='',isAttId=true;
            _this.imgList.imgSrcArr.forEach((ele,index) =>{
              if(ele.attId){
                attIdList+=ele.attId+',';
              }else {
                isAttId=false;
                wx.showToast({
                  title:'图片正在上传中，请稍后',
                  icon:'none'
                });
              }
            });
            if(!isAttId){
              return false;
            }
            this.isBtnClick=true;
            _this.isLoading++;
            switch (this.imgList.questionType){
              case '1-2':
                sortId=5;
                url='/packageD/reportNew/clinicThree';
                break;
              case '1-3':
                sortId=8;
                url='/packageD/reportNew/clinicFour';
                break;
              case '1-5':
                sortId=15;
                reportIsFinish=1;
                    break;
              case '2-2':
                sortId=20;
                reportIsFinish=1;
                    break;
              case '2-4':
                sortId=27;
                reportIsFinish=1;
                console.log('wancheng');
                break;
            }
            let paramData={
              reportId:_this.reportId,
              sortId:sortId,
              patientId:_this.patientId,
              doctorId:_this.doctorCustomerId,
              reportIsFinish:reportIsFinish,
              reportContentList:[
                {id:'',reportValue:'1'},
              ],
              oldReportContentList:_this.imgList.imgReport,
              attIdList:attIdList.slice(0,attIdList.length-1)
            };
            console.log(paramData)
            createReport(paramData).then((res)=>{
              _this.isLoading--;
              _this.isBtnClick=false;
              if(res&&res.responseObject&&res.responseObject.responseStatus){
                if(reportIsFinish==1){
                  console.log('wanchengIM');
                  wx.setStorageSync("backIndex",true);
                  wx.reLaunch({
                    url:url
                  })
                }else {
                  wx.redirectTo({
                    url:url
                  })
                }
              }else {
                wx.showToast({
                  title:'保存失败，请重试',
                  icon:'none'
                });
              }
            });

          }
        },
        addImg(){
          let _this=this,count=12-_this.imgList.imgSrcArr.length;
          if(count>9){
            count=9;
          }
          wx.chooseImage({
            count: count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
              let len=_this.imgList.imgSrcArr.length,
                   tempFiles=_this.beforeImgLoad(res.tempFiles);
              _this.imgList.imgSrcArr=tempFiles.concat(_this.imgList.imgSrcArr);
              tempFiles.forEach((ele,index) =>{
                // _this.upLoadPic(ele,index+len);
                _this.upLoadPic(ele,index);
              });
              // tempFilePath可以作为img标签的src属性显示图片
              // const tempFilePaths = res.tempFilePaths
            }
          })
        },
        beforeImgLoad(arr){
          let newArr=arr;
          arr.forEach((ele,index)=>{
            if(ele.size>10*1024*1024){
              newArr.splice(index,1);
              wx.showToast({
                title:'图片不能大于10M',
                icon:'none'
              });
            }
          })
          return newArr;
        },
      },
      mounted(){
        console.log(this.imgList)
        let _this=this;
        _this.isLoading=0;
        _this.isBtnClick=false;
        _this.imgList.imgSrcArr=_this.beforeImgLoad(_this.imgList.imgSrcArr);
        _this.imgList.imgSrcArr.forEach((ele,index) =>{
          if(!ele.attId){
            _this.upLoadPic(ele,index);
          }
          if(ele.sortId&&(ele.sortId>_this.sortId)){
           _this.sortId=ele.sortId;
          }
        });
      }
    }
</script>

<style scoped lang="scss">
  .question-imgList{
    &.imgList-more{
      padding-bottom:80px
    }
    .question-title{
      margin-left: 30px;
      padding: 72px 0 66px;
      font-size:46px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:46px;
      .question-desc{
        width:690px;
        height:68px;
        background:rgba(88,128,237,0.08);
        border-radius:6px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:68px;
        padding-left: 20px;
        box-sizing: border-box;
        margin-top: 40px;
      }
    }
    .img-list{
      font-size: 0;
      margin-left: 30px;
      .img-list-item{
        display: inline-block;
        vertical-align: middle;
        width:216px;
        height:216px;
        /*border:1px solid rgba(47,197,189,1);*/
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        img{
          width: 100%;
          height: 100%;
        }
        .close-icon{
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: 44px;
          background: url('https://m.allinmed.cn/static/image/mp/index/1.1.4/delatebtn.png') no-repeat center;
          background-size: 100% 100%;
          z-index: 2;
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
            top: 62%;
            width: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &.wxChoseFileBtn{
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/camera2.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
    .question-next{
      width:560px;
      height:96px;
      background:rgba(204,204,204,1);
      border-radius:8px;
      font-size:36px;
      font-family:PingFangSC-Medium;
      margin:80px auto 0;
      font-weight:bold;
      color:rgba(255,255,255,1);
      border: none;
      outline: none;
      &.next-fixed{
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
      }
      &.active{
        background:rgba(0,185,173,1);
      }
      &:after {
        border: 0;
      }
    }
  }

</style>
