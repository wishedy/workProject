<template>
  <section class="content">
    <form @submit="formSubmit" report-submit="true">
      <section class="how">
        <h3><i></i>您是如何找到{{doctorName}}医生的？</h3>
        <!-- <form action="" @submit="formIdSubmit" report-submit="true"> -->
          <!-- <button class="formId-submit" type="submit" formType="submit"> -->
            <button class="submitformBtn" type="submit" formType="submit" @click="selectHow(1)"><i :class="{'actived':itemKey==1}"></i>亲戚/朋友介绍</button>
            <section class="input" v-show="itemKey==1">
              <input type="text" placeholder="请填写介绍人姓名" placeholder-style="font-size: 32rpx;color: #b2b2b2;opacity: 0.5;"
                    v-model="howSubmitData[0]" @input="write(40,'friend')" cursor-spacing="30">
            </section>
          <!-- </button> -->
          <!-- <button class="formId-submit" type="submit" formType="submit"> -->
            <button class="submitformBtn" type="submit" formType="submit" @click="selectHow(2)"><i :class="{'actived':itemKey==2}"></i>医生推荐</button>
            <section class="input" v-show="itemKey==2">
              <input type="text" placeholder="请填写医生姓名" placeholder-style="font-size: 32rpx;color: #b2b2b2;opacity: 0.5;"
                    v-model="howSubmitData[1]" @input="write(40,'doctor')" cursor-spacing="30">
            </section>
          <!-- </button> -->
          <!-- <button class="formId-submit" type="submit" formType="submit"> -->
            <button class="submitformBtn" type="submit" formType="submit" @click="selectHow(3)"><i :class="{'actived':itemKey==3}"></i>其他</button>
            <section class="descriptionOther" v-show="itemKey==3">
              <textarea placeholder="请填写" placeholder-style="font-size: 32rpx;color: #b2b2b2;opacity: 0.5;"
                        v-model="howSubmitData[2]" @input="write(40,'other')" cursor-spacing="50"></textarea>
            </section>
          <!-- </button> -->
        <!-- </form> -->
        <p class="bottomLine"></p>
      </section>

      <section class="help">
        <h3><i></i>您此次咨询想要得到的帮助是？</h3>
        <p @click="selectHelp(1)" :class="friend?'actived':''"><i></i>病例诊断并提供后续治疗方案</p>
        <p @click="selectHelp(2)" :class="doctor?'actived':''"><i></i>想找医生做手术</p>
        <p @click="selectHelp(3)" :class="other?'actived':''"><i></i>其他</p>
        <section class="descriptionOther" v-show="other?'actived':''">
          <textarea placeholder="请填写要得到的帮助" placeholder-class="placeholderClass" v-model="helpSubmitData[2]"
                    @input="write(1000,'helpParamsother')" cursor-spacing="50"></textarea>
        </section>
        <p class="bottomLine"></p>
      </section>

      <section class="desc">
        <h3><i></i>
          <p class="info">请详细描述您的病情，以便医生更好的帮助你<span>(描述主要症状，患病时长，治疗情况等信息)</span></p></h3>
        <section class="descriptionInfo">
          <textarea placeholder="例：颈椎病两周，在当地医院就诊…" placeholder-class="placeholderClass" :show-confirm-bar='false' v-model="descriptionData"
                    @input="write(1000,'description')" cursor-spacing=100></textarea>
        </section>
        <p class="bottomLine"></p>
      </section>

      <section>
        <h3><i></i>请将您已有的检查资料拍照上传</h3>
        <section class="uploadBox">
          <upLoadPic v-if="uploadShow" :uploadType="3"></upLoadPic>
        </section>
      </section>
      <button class="submitBtn" @click="submit" formType="submit" type="submit">提交</button>
    </form>
  </section>
</template>

<script>
  import api from "common/js/util/util";
  import upLoadPic from "../upLoadPic/upLoadPic";
  import dataLog from "common/js/dataLog/dataLog";
  import localStorage from "localStorage";
  import {createNamespacedHelpers} from "vuex";
  import sendFormId from "common/js/HttpRequest/sendFormId";

  const {mapMutations, mapState} = createNamespacedHelpers('questionDesc');

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
  };
  export default {
    data() {
      return {
        doctorName: '',
        itemKey: 0,
        friend: false,
        doctor: false,
        other: false,
        howSubmitData: ['', '', ''],
        helpSubmitData: ['', '', ''],
        descriptionData: '',
        submitData: {},
        formSubmitList: '',
        uploadShow: false,
        isOldData: false,
        clickFlag:true
      }
    },
    methods: {
      ...mapMutations(['getQueryObject', 'emptyQueryObject']),
      /** 发送formId */
      // formSubmit(e) {
      //   sendFormId(e.target.formId);
      // },
      selectHow(num) {
        let that = this;
        that.howSubmitData[0] = '';
        that.howSubmitData[1] = '';
        that.howSubmitData[2] = '';
        that.itemKey = num;
      },
      selectHelp(num) {
        let that = this;
        switch (parseInt(num)) {
          case 1:
            that.friend = !that.friend;
            if (that.friend) {
              that.helpSubmitData[0] = '病例诊断并提供后续治疗方案'
            } else {
              that.helpSubmitData[0] = ''
            }
            break;
          case 2:
            that.doctor = !that.doctor;
            if (that.doctor) {
              that.helpSubmitData[1] = '想找医生做手术'
            } else {
              that.helpSubmitData[1] = ''
            }
            break;
          case 3:
            that.helpSubmitData[2] = '';
            that.other = !that.other;
            break;
        }
      },
      submit() {
        dataLog.createTrack({
          actionId: 14084,
        });
        if (localStorage.getItem("failUploadNum")) {
          let _failNum = localStorage.getItem("failUploadNum");
          if (_failNum>0) {
             this.toastFn(`${_failNum}张图片上传失败，点击重新上传后再次提交`);
             this.clickFlag = true;
          }else{
            this.nextPageGo()
          }
        }else{
          this.nextPageGo()
        }
      },
      nextPageGo(){
        let that = this;
        let index = that.itemKey - 1;

        //1.get First Question Params
        let firstData = '';
        switch (index) {
          case 0:
            if (that.howSubmitData[index]) {
              firstData = 1 + '_亲戚/朋友介绍_' + that.howSubmitData[index];
            } else {
              firstData = 1 + '_亲戚/朋友介绍';
            }
            break;
          case 1:
            if (that.howSubmitData[index]) {
              firstData = 2 + '_医生推荐_' + that.howSubmitData[index];
            } else {
              firstData = 2 + '_医生推荐';
            }
            break;
          case 2:
            if (that.howSubmitData[index]) {
              firstData = 0 + '_' + that.howSubmitData[index];
            } else {
              firstData = 0;
            }
            break;
        }
        // console.log(firstData);

        //2.get Second Question Params
        let secondData = '';

        console.log(that.helpSubmitData);
        that.helpSubmitData.forEach(function (item, index) {
          if (item) {
            if (index == 2) {
              secondData = secondData + ',' + 0 + '_' + item;
            } else if (secondData.length == 0) {
              secondData = (parseInt(index) + 1) + '_' + item;
            } else {
              secondData = secondData + ',' + (parseInt(index) + 1) + '_' + item;
            }
          }
        });
        console.log(secondData);

        //3.get Three Question Params
        let threeData = '';
        // threeData = 1+'_'+that.descriptionData;
        threeData = that.descriptionData;


        if (that.descriptionData) {
          if (that.other) {
            if (that.helpSubmitData[2] != '') {
              that.request(firstData, secondData, threeData);
            } else {
              that.popou();
            }
          } else {
            that.request(firstData, secondData, threeData);
          }
        } else {
          that.popou();
        }
      },
      request(firstData, secondData, threeData) {

        if (!this.clickFlag) return false;
        this.clickFlag=false;

        let _this = this;
        api.ajax({
          url: XHRList.sendMessage,
          method: "POST",
          data: {
            openId: localStorage.getItem('openId'),
            formId: _this.formSubmitList
          },
          done(res) {
          }
        });
        let _data = {
          reportType: '3',
          reportAssist: encodeURIComponent(secondData.replace(/\"/g, "\\\"")),
          reportPersonCondition: encodeURIComponent(threeData.replace(/\"/g, "\\\"")),
          finishTime: 1,
          siteId: api.getSiteId()
        };

        if (firstData) {
          _data.reportChannel = encodeURIComponent(firstData.replace(/\"/g, "\\\""));
        }

        if (localStorage.getItem('reportId').trim().length > 0) {
          _data.reportId = localStorage.getItem('reportId');
        }

        let patientId = '';
        if (localStorage.getItem('patientInfo').trim().length > 0) {
          let _patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
          if (_patientInfo.patientId && _patientInfo.patientId.length > 0) {
            patientId = _patientInfo.patientId;
            localStorage.setItem('patientId', patientId);
          }
          _data.patientName = _patientInfo.patientName;
        }

        if (localStorage.getItem('attIds').toString().trim().length > 0) {
          _data.attIds = localStorage.getItem('attIds');
        }
        if (_this.isOldData) {
          _data.delAttIds = '';
        } else {
          _data.delAttIds = localStorage.getItem('delAttIds');
        }
        api.ajax({
          url: api.httpEnv() + '/mcall/patient/report/improvement/v1/saveReportInfo/',
          method: "POST",
          data: Object.assign(_data,{
            consultationType: 1,
            consultationState: 0,
            caseType:14,
            consultationFrequency: 50,
            visitSiteId: api.getSiteId(),
          }),
          done(res) {
            if (res.responseObject.responseStatus) {
              console.log('请求成功跳转IM~');
              localStorage.removeItem('attIds');
              let reportId = localStorage.getItem('reportId');
              let caseId = res.responseObject.responsePk;
              let doctorCustomerId = localStorage.getItem('doctorId');
              localStorage.removeItem("qrHasClosed");
              localStorage.setItem('caseId', caseId);
              localStorage.setItem("patientId", patientId);
              _this.itemKey = 0;
              _this.friend = false;
              _this.doctor = false;
              _this.other = false;
              _this.howSubmitData = ['', '', ''];
              _this.helpSubmitData = ['', '', ''];
              _this.descriptionData = '';
              _this.submitData = {};

              _this.uploadShow = false;
              _this.clickFlag=true;
              setTimeout(() => {
                _this.uploadShow = true;
                _this.$emit("setUpTab");
                wx.navigateTo({
                  url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + caseId + '&doctorCustomerId=' + doctorCustomerId + '&patientId=' + patientId + '&reportId=' + reportId + '&from=report'
                });
              }, 100);
            }
          },fail(err){
            _this.clickFlag=true;
          }
        })
      },
      popou(msg) {
        wx.showToast({
          title: '您还有问题未完善',
          icon: 'none',
          duration: 2000,
        })
        this.clickFlag = true;
      },
      write(limit, ele) {
        let that = this;
        switch (ele) {
          case 'friend':
            this.howSubmitData[0] = api.getStrByteLimit(this.howSubmitData[0], limit);
            break;
          case 'doctor':
            this.howSubmitData[1] = api.getStrByteLimit(this.howSubmitData[1], limit);
            break;
          case 'other':
            this.howSubmitData[2] = api.getStrByteLimit(this.howSubmitData[2], limit);
            break;
          case 'helpParamsother':
            this.helpSubmitData[2] = api.getStrByteLimit(this.helpSubmitData[2], limit);
            if (!that.other) {
              that.helpSubmitData[2] = ''
            }
            break;
          case 'description':
            this.descriptionData = api.getStrByteLimit(this.descriptionData, limit);
        }
      },
      formSubmit(e) {
        if (this.formSubmitList.length == 0) {
          this.formSubmitList = e.target.formId
        } else {
          this.formSubmitList = this.formSubmitList + ',' + e.target.formId;
        }
      },
      getDefaultData() {
        let _this = this;
        this.$nextTick(() => {
          if (this.queryObject.reportType == 3) {
            let _imgurls = this.queryObject.attList;
            if (_imgurls && _imgurls.length > 0) {
              _this.setDelAttIds(_imgurls);
              _this.isOldData = true;   //存在历史图片
            } else {
              _this.removeDelAttIds();
            }
          } else if (this.queryObject.reportType == 0) {
            _this.removeDelAttIds();
          }
        })
      },
      setDelAttIds(imgurls) {
        let _keys = '';
        imgurls.forEach(function (item, index) {
          //ID
          if (_keys != '') {
            _keys = _keys + "," + item.id
          } else {
            _keys = item.id
          }
        });
        localStorage.setItem("delAttIds", _keys);
      },
      removeDelAttIds() {
        let _delAttIds = localStorage.getItem('delAttIds');
        if (_delAttIds && _delAttIds.toString().length > 0) {
          localStorage.removeItem("delAttIds");
        }
      },
      /** toast提示 */
      toastFn(param){
        wx.showToast({
          title: param,
          icon: 'none',
          duration: 2000
        })
      },
    },
    components: {
      upLoadPic
    },
    computed: {
      ...mapState(['queryObject', 'scene']),
    },
    onLoad() {
      this.getDefaultData();
    },
    mounted() {

      this.uploadShow = true;
      this.doctorName = localStorage.getItem('doctorName');
      if (localStorage.getItem("alreadyCreateIm")) {
        wx.showModal({
          title: '提示',
          content: '您的报到单已提交,无需重复操作',
          cancelText: "返回首页",
          confirmText: "继续",
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.navigateTo({
                url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + localStorage.getItem('caseId') + '&doctorCustomerId=' + localStorage.getItem('doctorId') + '&patientId=' + localStorage.getItem('patientId') + '&reportId=' + localStorage.getItem('reportId') + '&from=report'
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
              wx.reLaunch({
                url: '/pages/mIndex/mIndex'
              });
              localStorage.removeItem("alreadyCreateIm")
            }
          }
        })
      }
    },
    onUnload() {
      this.itemKey = 0;
      this.friend = false;
      this.doctor = false;
      this.other = false;
      this.howSubmitData = ['', '', ''];
      this.helpSubmitData = ['', '', ''];
      this.descriptionData = '';
      this.submitData = {};
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  .content {
    background-color: #f2f4f7;
    padding-bottom: 2px;
  }

  /*所有标题样式*/
  h3 {
    margin-left: 40px;
    padding-top: 50px;
    font-size: 40px;
    color: #222222;
    letter-spacing: 0;
    line-height: 1.5;
    font-weight: bold;
    i {
      display: inline-block;
      height: 16px;
      width: 16px;
      background: #2FC5BD;
      border-radius: 1000px;
      vertical-align: 8px;
      margin-right: 30px;
    }
  }

  /*如何找到and需要帮助模块的样式*/
  .how {
    font-weight: bold;
    .submitformBtn {
      margin-left: 96px;
      margin-top: 50px;
      font-size: 32px;
      color: #444444;
      line-height: 1.2;
      background: #f2f4f7;
      text-align: left;
      i {
        width: 32px;
        height: 32px;
        border-radius: 32px;
        border: 2px solid #909090;
        display: inline-block;
        margin-right: 28px;
        vertical-align: top;
      }
    }
  }

  .how {
    .submitformBtn{
      i.actived {
        background: url("https://m.allinmed.cn/static/image/mp/questionDesc/single_election.png") no-repeat;
        background-size: cover;
        border: 0;
        width: 32px;
        height: 32px;
        border-radius: 32px;
      }
    }
    .formId-submit{
      padding: 0;
      line-height: 1.5;
    }
  }

  .help {
    font-weight: bold;
    p {
      margin-left: 96px;
      margin-top: 50px;
      font-size: 32px;
      color: #444444;
      line-height: 32px;
      i {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid #909090;
        display: inline-block;
        margin-right: 28px;
        vertical-align: top;
      }
    }
  }

  .help {
    p.actived {
      color: #2EA9FE;
      i {
        background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/multi_selection.png") no-repeat;
        background-size: cover;
        border: 0;
        width: 36px;
        height: 36px;
        border-radius: 8px;
      }
    }
  }

  /*描述信息*/
  .desc {
    h3 {
      p {
        vertical-align: top;
        display: inline-block;
        width: 592px;
        font-size: 40px;
        span {
          font-size: 32px;
          color: #666666;
          letter-spacing: 0;
          line-height: 40px;
          font-weight: normal;
        }
      }
    }
  }
  /*最后的按钮样式*/
  .submitBtn {
    width: 504px;
    height: 100px;
    margin: 60px auto;
    background-image: linear-gradient(-90deg, #3FE6BC 6%, #07B6AC 95%);
    box-shadow: 0 20px 36px 0 rgba(30, 231, 187, 0.38);
    border-radius: 200px;
    font-size: 36px;
    color: #FFFFFF;
    line-height: 100px;
    font-weight: bold;
    &::after {
      display: none;
    }
  }

  /*详情框*/
  .descriptionInfo {
    background-color: #ffffff;
    border-radius: 10px;
    border: 2px solid #C9C9C9;
    width: 576px;
    height: 136px;
    margin: 56px auto 0;
    textarea {
      font-weight: normal;
      padding: 15px;
      font-size: 32px;
      line-height: 32px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    .placeholderClass {
      font-size: 32px;
      line-height: 60px;
      color: #b2b2b2;
      opacity: 0.5;
    }
  }

  /*单个选框使用input*/
  .input {
    //border:2px solid #C9C9C9;
    font-weight: normal;
    width: 478px;
    height: 60px;
    padding: 15px;
    margin-left: 156px;
    margin-top: 30px;
    background: #fff;
    /*box-shadow: 0 0 18px 0 rgba(0,0,0,0.06);*/
    border: 1px solid #C9C9C9;
    border-radius: 10px;
    input {
      font-size: 32px;
      width: 100%;
      height: 100%;
    }
  }

  /*其他信息弹框*/
  .descriptionOther {
    border: 1px solid #C9C9C9;
    background: #FFFFFF;
    /*border: 0 solid #C9C9C9;*/
    /*box-shadow: 0 0 18px 0 rgba(0,0,0,0.06);*/
    border-radius: 10px;
    width: 448px;
    height: 136px;
    margin-top: 30px;
    margin-left: 156px;
    textarea {
      padding: 15px;
      line-height: 32px;
      font-size: 32px;
      width: 100%;
      height: 100%;
      font-weight: normal;
      box-sizing: border-box;
    }
    .placeholderClass {
      font-size: 32px;
      line-height: 32px;
      color: #b2b2b2;
      opacity: 0.5;
    }
  }

  /*分割线*/
  .bottomLine {
    width: 578px;
    height: 2px;
    background: #E2E2E2;
    margin: 0 auto;
    margin-top: 50px;
  }

  /*上传样式*/
  .uploadBox {
    padding: 60px 40px 0px 72px;
  }
</style>
