<template>
  <section>
    <section class="machine-message">
      <article class="main-message-box-item">
        <!--机器人-->
        <transition name="fade">
          <figure class="main-message-img" v-if="questionItem.questionDesc||questionItem.loading">
            <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="" class="message-logo">
            <p class="message-content" v-if="!questionItem.loading">{{questionItem.questionDesc}}<span class="text-tip"
                                                                                                       v-if="questionItem.questionType===2">（可多选）</span>
            </p>
            <p class="message-content message-loading" v-if="questionItem.loading">
              <span class="loading-text"></span>
              <span class="loading-text"></span>
              <span class="loading-text"></span>
            </p>
          </figure>
        </transition>
        <!--多选 单选//1单选，2多选-标签 3 input输入框 4图片 5长选择   1-单选2-多选3-进度条4-问答题5-多选&描述6-时间7-图片-->
        <!--多选 单选-->
        <transition name="fade">
          <figure class="select-container"
                  v-if="questionItem.questionType&&questionItem.questionType!== 4&&questionItem.questionType!== 6&&!(questionItem.imgList&&questionItem.imgList.length)&&!questionItem.answer">
            <p class="select-title">您可以点击标签快速回答：</p>
            <ul class="select-list">
              <li class="select-list-item"
                  v-for="(item,index) in questionItem.optionList"
                  :key="index"
                  :class="{
                  'active':item.isActive,
                  'item-block':questionItem.questionType===5
                }"
                  @click="itemSelect(index,item,questionItem.questionType)"
              >
                <!--<form @submit="formSubmit" report-submit="true">-->
                <!--<button class="item-text" type="submit"-->
                <!--formType="submit">{{item.optionDesc}}-->
                <!--</button>-->
                <!--</form>-->
                {{item.optionDesc}}
                <!--多选显示-->
                <i v-if="item.isActive&&(questionItem.questionType===2||questionItem.questionType===5)"
                   class="icon-select"></i>
              </li>
            </ul>
            <!--多选显示-->
            <form @submit="formSubmit" report-submit="true">
              <button
                type="submit"
                formType="submit"
                class="select-btn"
                v-if="questionItem.questionType===2||questionItem.questionType===5"
                :class="{'active':currentSelect.length>0}"
                @click="selectSubmit"
              >选好了
              </button>
            </form>
          </figure>
        </transition>
        <transition name="fade">
          <!--input输入框-->
          <figure class="input-container" v-if="questionItem.questionType===4&&!questionItem.answer">
            <input
              type="text"
              class="send-input"
              auto-focus="true"
              v-model.trim="questionItem.questionValue"
              maxlength="300"
              :class="{'inputMarBot':inputMarBot}"
              @focus="settingMbShow"
              @blur="settingMbNoShow"
            />
            <!--<textarea class="send-textarea" auto-height="true" auto-focus="true"-->
            <!--v-model.lazy.trim="questionItem.questionValue" maxlength="300"></textarea>-->
            <form @submit="formSubmit" report-submit="true">
              <button class="send-btn" @click="sendInput"
                      type="submit"
                      formType="submit"
                      :class="{'active':questionItem.questionValue.length,'inputMarBot':inputMarBot}">发送
              </button>
            </form>
          </figure>
        </transition>
        <!--图片上传态展示-->
        <transition name="fade">
          <figure class="img-container" v-if="questionItem.imgList&&questionItem.imgList.length&&!questionItem.answer">
            <ul class="img-list">
              <li class="img-list-item" v-for="(item,index) in questionItem.imgList" :key="index"
                  v-if="index<11||(questionItem.imgList.length===36&&index<=11)">
                <img :src="item.path" alt="" @click="previewImage(index)"/>
                <!--loading-->
                <span class="imgItem-cover" v-if="(!item.upload)&&(!item.attId)"><span
                  class="imgItem-loading"></span></span>
                <!--删除-->
                <i class="close-icon" @click.stop="imgDelToast(index)"></i>
                <!--上传失败-->
                <figure class="imgItem-fail" v-if="item.fail" @click.stop="upLoadPic(item,index)">
                  <p class="imgItem-failText">上传失败</p>
                  <p class="imgItem-reloadText">点击重试</p>
                </figure>
              </li>
              <li class="img-list-item wxChoseFileBtn" @click="addImg" v-if="questionItem.imgList.length<36">
                <img src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/upload-img.png"/>
                <p class="chose-text">上传照片</p>
              </li>
            </ul>
            <p class="tip-text">
              <span
                class="img-num">已上传{{questionItem.imgList.length}}张{{questionItem.imgList.length>11 ? '，':''}}</span>
              <span class="more-text" v-if="questionItem.imgList.length>11" @click="previewImage(0)">查看全部</span>
            </p>
            <form @submit="formSubmit" report-submit="true">
              <button class="img-submit" @click="imgSubmit" type="submit"
                      formType="submit">确认上传
              </button>
            </form>
          </figure>
        </transition>
      </article>
    </section>
    <!--患者-->
    <transition name="fade">
      <PatientMessage
        v-if="questionItem.answer&&questionItem.answer !=='其他'"
        :answer="questionItem.answer"
        :questionType="questionItem.questionType"
      ></PatientMessage>
    </transition>
    <!--疼痛程度-->
    <transition name="fade">
      <section class="pain-level-wrapper" @click.stop="vasShow=false" v-if="vasShow">
        <section class="pain-level-box" @click.stop="vasShow=true">
          <h3>
            <i class="icon-closePainLevel" @click.stop="closePainLevel"></i>
          </h3>
          <p class="pain-level-content">
            <!--<span class="pain-value-name"><i>疼痛程度:</i><i class="name-text">{{vasList[painValue].optionName}}</i></span>-->
            <span class="pain-value-name"><i>疼痛程度:</i><i class="name-text">{{painValue}}</i></span>
            <span class="pain-value-desc"> {{vasList[painValue]&&vasList[painValue].optionDesc}}</span>
          </p>
          <VAS @getSliderEvent="getPainValue"></VAS>
          <form @submit="formSubmit" report-submit="true">
            <button class="pain-level-ensure" type="submit"
                    formType="submit" @click="levelSure">确定
            </button>
          </form>
        </section>
      </section>
    </transition>
  </section>
</template>

<script>
  import PatientMessage from './PatientMessage'
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import updateLoad from "common/js/upLoadPic/upLoadComm";
  import util from "common/js/util/util";
  import VAS from "components/vasLevel";

  const casexhr = {
    createPicture: util.httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/",
  };
  export default {
    name: "machine-message",
    props: {
      questionItem: {
        type: Object,
      }, postData: {
        type: Array,
      },
      partId: {
        type: Number,
      }
    },
    data() {
      return {
        inputMarBot: false,
        currentIndex: 0,
        currentSelect: [],
        currentItem: [],
        sortId: 0,
        vasShow: false,
        vasList: [],
        painValue: -1,
      }
    },
    components: {
      PatientMessage,
      VAS
    },
    methods: {
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      // 评论输入框聚焦时，设置与底部的距离
      settingMbShow: function () {
        this.inputMarBot = true;
      },
      //  评论输入框失去聚焦时，设置与底部的距离（默认状态）
      settingMbNoShow: function () {
        this.inputMarBot = false;
      },
      //vasShow=false,疼痛等级关闭
      closePainLevel() {
        this.vasShow = false;
        this.painValue = -1;
        this.questionItem.optionList[this.currentIndex].isActive = false;
        let cIndex = this.currentSelect.indexOf(this.currentIndex);
        if (cIndex !== -1) {
          this.currentSelect.splice(cIndex, 1);
          this.currentItem.splice(cIndex, 1);
        }
      },
      //疼痛程度确认
      levelSure() {
        this.$nextTick(() => {
          this.vasShow = false;
          this.questionItem.optionList[this.currentIndex].optionDesc += '(' + this.painValue + ')';
        })

      },
      //获取当前疼痛程度
      getPainValue(value) {
        this.painValue = value;
      },
      //单选和多选点击
      itemSelect(index, item, type) {
        // 多选 单选//1单选，2多选-标签 3 input输入框 4图片 5长选择  1-单选2-多选3-进度条4-问答题5-多选&描述6-时间7-图片
        switch (type) {
          case 1:
            this.questionItem.optionList[index].isActive = true;
            setTimeout(() => {
              this.questionItem.answer = item.optionDesc;
              if (Number(item.isAttachment) === 1) {
                item.questionList = [
                  {
                    "questionDesc": "",
                    "questionId": "",
                    "isPopup": "0",
                    "popupPrompt": "",
                    "optionList": [
                      {
                        "optionDesc": "上传照片",
                        "optionId": "",
                        "optionName": "上传照片",
                        "questionList": [],
                        "isAttachment": "0"
                      },
                      {
                        "optionDesc": "暂不上传",
                        "optionId": "",
                        "optionName": "暂不上传",
                        "questionList": [],
                        "isAttachment": "0"
                      }
                    ],
                    "questionName": "take_an_xray_5.2",
                    "questionType": "7"
                  }];
              }
              this.postData.optionList.push({
                questionId: this.questionItem.questionId,
                optionIdList: item.optionId,
                optionDesc: this.questionItem.answer,
                partId: this.partId
              });
              if (item.questionList && item.questionList.length) {
                this.$emit('nextQuestion', item.questionList)
              } else {
                this.$emit('nextQuestion', false)
              }
            }, 100);
            break;
          case 7:
            this.questionItem.optionList[index].isActive = true;
            if (index === 0) {
              this.addImg();
            } else {
              setTimeout(() => {
                this.questionItem.answer = item.optionDesc;
                console.log({
                  questionId: this.questionItem.questionId,
                  optionIdList: item.optionId,
                  optionDesc: this.questionItem.answer,
                  questionName: this.questionItem.questionName,
                  refOptionId: this.questionItem.refOptionId,
                  partId: this.partId
                });
                if (this.questionItem.questionList && this.questionItem.questionList.length) {
                  this.$emit('nextQuestion', this.questionItem.questionList)
                } else {
                  this.$emit('nextQuestion', false)
                }
              }, 100);
            }
            break;
          case 2:
          case 5:
            let cIndex = this.currentSelect.indexOf(index)
            if (cIndex === -1) {
              this.currentSelect.push(index);
              this.currentItem.push(item);
              this.questionItem.optionList[index].isActive = true;
              if (
                type === 2 &&
                item.questionList &&
                item.questionList.length &&
                Number(item.questionList[0].questionType) === 3
              ) {
                this.currentIndex = index;
                this.vasShow = true;
                this.painValue = 2;
                this.vasList = item.questionList[0].optionList;
              }
            } else {
              this.currentSelect.splice(cIndex, 1);
              this.currentItem.splice(cIndex, 1);
              this.questionItem.optionList[index].isActive = false;
              if (
                type === 2 &&
                item.questionList &&
                item.questionList.length &&
                Number(item.questionList[0].questionType) === 3
              ) {
                let name = this.questionItem.optionList[index].optionDesc, nIndex = name.indexOf('(');
                if (nIndex !== -1) {
                  this.questionItem.optionList[index].optionDesc = name.slice(0, nIndex);
                }
              }
            }
            break;
          default:
            break;
        }

      },
      //多选确定
      selectSubmit() {
        if (this.currentItem.length) {
          let str = '', isElse = false, data = {}, postdata = {optionIdList: ''}, listItem;
          this.currentItem.map((value, index) => {
            if (value.questionList && value.questionList.length && value.optionDesc.indexOf('其他') !== -1) {
              isElse = true;
              data = value.questionList;
            } else {
              str += value.optionDesc + '、';
            }
            if (
              value &&
              value.questionList &&
              value.questionList.length &&
              Number(value.questionList[0].questionType) === 3 &&
              this.painValue !== -1
            ) {
              let optionList= value.questionList[0].optionList[this.painValue],optionId='',optionName='',optionDesc='';
              if(optionList){
                optionId=optionList.optionId;
                optionName=optionList.optionName;
                optionDesc=optionList.optionDesc;
              }
              listItem = {
                questionId: value.questionList[0].questionId,
                questionName: value.questionList[0].questionName,
                optionIdList: optionId,
                partId: this.partId,
                refOptionId: value.questionList[0].refOptionId,
                optionDesc: 'VAS评分' + optionName + optionDesc,
              };
            }
            postdata.optionIdList += value.optionId + ',';
            postdata.refOptionId = value.refOptionId;
          });
          this.questionItem.answer = str.slice(0, str.length - 1);
          postdata.questionId = this.questionItem.questionId;
          postdata.optionDesc = this.questionItem.answer;
          postdata.answer = this.questionItem.answer;
          postdata.questionName = this.questionItem.questionName;
          postdata.partId = this.partId;
          //数据传输
          console.log(postdata)
          this.postData.optionList.push(postdata);
          console.log(listItem)
          if (listItem) {
            this.postData.optionList.push(listItem);
          }
          console.log(this.painValue)
          if (!this.questionItem.answer) {
            this.questionItem.answer = '其他';
          }
          if (isElse) {
            this.$emit('nextQuestion', data)
          } else {
            this.$emit('nextQuestion', false)
          }
        }
      },
      //发送input事件
      sendInput() {
        if (this.questionItem.questionValue) {
          this.questionItem.answer = this.questionItem.questionValue;
          this.postData.optionList.push({
            questionId: this.questionItem.questionId,
            optionIdList: this.questionItem.optionList && this.questionItem.optionList.length && this.questionItem.optionList[0].optionId,
            optionDesc: this.questionItem.answer,
            questionName: this.questionItem.questionName,
            refOptionId: this.questionItem.refOptionId,
            partId: this.partId
          });
          if (this.questionItem.questionList && this.questionItem.questionList.length) {
            this.$emit('nextQuestion', this.questionItem.questionList)
          } else {
            this.$emit('nextQuestion', false)
          }


        }
      },
      //图片确认上传
      imgSubmit() {
        let _this = this;
        let _imgurls = [], successNum = 0, inspectionAttId = '';
        _this.questionItem.imgList.forEach((ele, index) => {
          if (ele.attId) {
            _imgurls.push(ele.path);
            // inspectionAttId.push(ele.attId);
            inspectionAttId += ele.attId + ',';
            successNum++;
          }
        });
        if (successNum === _this.questionItem.imgList.length) {
          this.questionItem.answer = _imgurls;
          this.postData.inspectionAttId = inspectionAttId;
          this.$emit('nextQuestion', false)
        } else {
          wx.showToast({
            title: '请确保图片全部上传成功',
            icon: 'none'
          });
        }

      },
      // 上传图片
      upLoadPic(item, index) {
        let _this = this;
        _this.sortId++;
        let _defaultData = {
          caseCategoryId: "", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
          imageType: "0",     //	string	是	资源类型		1-上传资料图片
          visitSiteId: "24",
          sortId: _this.sortId
        };
        _this.questionItem.imgList[index].upload = false;
        _this.questionItem.imgList[index].fail = false;
        wx.uploadFile({
          url: casexhr.createPicture,
          filePath: item.path,
          name: "file",
          formData: _defaultData,
          success: function (res) {
            _this.questionItem.imgList[index].upload = true;
            if (res && res.data) {
              var _data = JSON.parse(res.data);
              // 接口返回成功
              if (_data.responseObject.responsePk > 0) {
                _this.questionItem.imgList[index].fail = false;
                _this.questionItem.imgList[index].attId = _data.responseObject.responsePk;
                _this.questionItem.imgList[index].path = _data.responseObject.responseMessage.logoUrl;
              } else {
                // 接口返回失败
                _this.questionItem.imgList[index].fail = true;
              }
            } else {
              _this.questionItem.imgList[index].fail = true;
            }
            wx.pageScrollTo({
              scrollTop: 10000000,
              duration: 0
            })
            _this.$forceUpdate();
          },
          fail: function (err) {
            //微信接口调用失败
            _this.questionItem.imgList[index].upload = true;
            _this.questionItem.imgList[index].fail = true;
            _this.$forceUpdate();
          },
          complete: function () {
            //微信接口调用结束

          }
        });
      },
      //删除图片确定模态
      imgDelToast(index) {
        let _this = this;
        // wx.showModal({
        //   // title: '确定删除图片吗？',
        //   content: '确定删除图片吗？',
        //   cancelText: '确定',
        //   cancelColor: '#2ea9fe',
        //   confirmText: '取消',
        //   confirmColor: '#2ea9fe',
        //   success: function (res) {
        //     if (res.confirm) {
        //
        //     } else if (res.cancel) {
        //       _this.deleteImg(index);
        //     }
        //   }
        // })
        _this.deleteImg(index);
      },
      //删除图片api
      deleteImg(index) {
        let _this = this;
        if (!_this.questionItem.imgList[index].attId) {
          _this.questionItem.imgList.splice(index, 1);
          return;
        }
        updateLoad({
          id: _this.questionItem.imgList[index].attId,
          isValid: "0"
        })
          .then(res => {
            _this.questionItem.imgList.splice(index, 1);
          })
          .catch(err => {
            console.log(err);
          });

      },
      //图片预览
      previewImage(index) {
        let _this = this;
        let _imgurls = [];
        _this.questionItem.imgList.forEach((ele, index) => {
          _imgurls.push(ele.path);
        });
        wx.previewImage({
          current: _imgurls[index], // 当前显示图片的http链接
          urls: _imgurls // 需要预览的图片http链接列表
        })
      },
      //添加图片
      addImg() {
        let _this = this, count = 36 - _this.questionItem.imgList.length;
        if (count > 9) {
          count = 9;
        }
        wx.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            _this.questionItem.optionList[0].isActive = false;
            let tempFiles = _this.beforeImgLoad(res.tempFiles);
            _this.questionItem.imgList = tempFiles.concat(_this.questionItem.imgList);
            tempFiles.forEach((ele, index) => {
              _this.upLoadPic(ele, index);
            });
          },
          fail() {
            _this.questionItem.optionList[0].isActive = false;
            _this.$forceUpdate();
          }
        })
      },
      //图片上传前
      beforeImgLoad(arr) {
        let newArr = arr;
        arr.forEach((ele, index) => {
          if (ele.size > 10 * 1024 * 1024) {
            newArr.splice(index, 1);
            wx.showToast({
              title: '图片不能大于10M',
              icon: 'none'
            });
          }
        })
        return newArr;
      },
    },
    mounted() {

    },
    onLoad() {
      this.currentSelect = [];
      this.currentItem = [];
      this.currentIndex = 0;
      this.sortId = 0;
      this.vasShow = false;
      this.inputMarBot = false;
      this.vasList = [];
      this.painValue = -1;
    }
  }
</script>

<style scoped lang="scss">
  .machine-message {
    margin-bottom: 32px;
    button {
      padding: 0;
      border: none;
      outline: none;
      color: #fff;
    }
    button {
      &:after {
        border: none;
      }
    }
    .main-message-img {
      .message-logo {
        width: 72px;
        height: 72px;
        vertical-align: top;
        margin-right: 18px;
      }
      .message-content {
        max-width: 482px;
        padding: 26px 24px;
        background: rgba(246, 246, 246, 1);
        border-radius: 0px 24px 24px 24px;
        display: inline-block;
        vertical-align: middle;
        font-size: 32px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(25, 25, 25, 1);
        line-height: 48px;
        .text-tip {
          color: #cccccc;
        }
        &.message-loading {
          padding: 32px 36px 32px 18px;
          .loading-text {
            width: 20px;
            height: 20px;
            background: rgba(185, 185, 185, 1);
            opacity: 1;
            display: inline-block;
            vertical-align: middle;
            margin-left: 18px;
            border-radius: 100%;
            &:first-child {
              animation: loading 1s infinite;
              animation-delay: 0ms;
            }
            &:nth-child(2) {
              animation: loading 1s infinite;
              animation-delay: 100ms;
            }
            &:last-child {
              animation: loading 1s infinite;
              animation-delay: 200ms;
            }
          }
          @keyframes loading {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              opacity: 0.4;
            }
          }
        }
      }
    }
    .select-container {
      .select-title {
        font-size: 26px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(46, 169, 254, 1);
        line-height: 26px;
        margin-left: 24px;
        margin-top: 40px;
        margin-bottom: 26px;
      }
      .select-list {
        font-size: 0;
        margin-left: 2px;
      }
      .select-list-item {
        display: inline-block;
        vertical-align: middle;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 8px 0px rgba(217, 223, 223, 0.55);
        border-radius: 36px;
        border: 1px solid #D9E0E4;
        line-height: 32px;
        padding: 20px 30px;
        margin-left: 22px;
        margin-bottom: 30px;
        font-size: 32px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(46, 169, 254, 1);
        background: #fff;
        .item-text {
          font-size: 32px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(46, 169, 254, 1);
          background: #fff;
          outline: none;
          border: none;
          line-height: 1;
          overflow: auto;
        }
        &.item-block {
          display: block;
        }
        &.active {
          background: rgba(46, 169, 254, 1);
          box-shadow: 0px 4px 8px 0px rgba(217, 223, 223, 0.65);
          position: relative;
          color: rgba(255, 255, 255, 1);
          .icon-select {
            position: absolute;
            width: 32px;
            height: 32px;
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/select-active.png") no-repeat;
            background-size: 32px 32px;
            top: -8px;
            right: -8px;
            z-index: 1;
          }
        }
      }
      .select-btn {
        width: 320px;
        height: 92px;
        background: rgba(204, 204, 204, 1);
        border-radius: 8px;
        font-size: 32px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 92px;
        margin-top: 100px;
        &.active {
          background: rgba(46, 169, 254, 1);
        }
      }
    }
    .input-container {
      position: fixed;
      bottom: 0;
      left: 0;
      margin-top: 40px;
      width: 750px;
      /*min-height:102px;*/
      background: rgba(246, 246, 246, 1);
      padding: 16px 18px 12px 20px;
      box-sizing: border-box;
      .send-input {
        width: 590px;
        height: 74px;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        border: 1px solid #DDE3E3;
        margin-right: 18px;
        display: inline-block;
        vertical-align: middle;
        padding: 0 24px;
        box-sizing: border-box;
        &.inputMarBot {
          margin-bottom: 20px;
        }
      }
      .send-textarea {
        width: 594px;
        min-height: 74px;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        border: 1px solid #DDE3E3;
        margin-right: 18px;
        display: inline-block;
        vertical-align: middle;
        padding: 10px 24px;
        box-sizing: border-box;
      }
      .send-btn {
        display: inline-block;
        vertical-align: middle;
        padding: 0;
        width: 100px;
        height: 68px;
        border-radius: 34px;
        border: 1px solid #DDDDDD;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(144, 144, 144, 1);
        line-height: 68px;
        &.inputMarBot {
          margin-bottom: 20px;
        }
        &.active {
          background: rgba(46, 169, 254, 1);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .img-container {
      width: 690px;
      background: rgba(215, 234, 253, 1);
      border-radius: 12px;
      border: 1px solid #D7EAFD;
      .img-list {
        font-size: 0;
        padding: 40px 12px 22px 30px;
      }
      .img-list-item {
        display: inline-block;
        vertical-align: middle;
        width: 144px;
        height: 144px;
        position: relative;
        margin-right: 18px;
        margin-bottom: 18px;
        img {
          width: 100%;
          height: 100%;
        }
        /*删除*/
        .close-icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 38px;
          height: 38px;
          background: url('https://m1.allinmed.cn/static/image/mp/index/1.6.0/img-delet.png') no-repeat center;
          background-size: 38px 38px;
          z-index: 2;
        }
        /*loading*/
        .imgItem-cover {
          display: inline-block;
          opacity: 0.83;
          background: #545454;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          .imgItem-loading {
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
        /*失败*/
        .imgItem-fail {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 1);
          opacity: 0.7;
          .imgItem-failText {
            font-size: 26px;
            color: #ffffff;
            position: absolute;
            width: 100%;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &.wxChoseFileBtn {
          box-sizing: border-box;
          background: rgba(255, 255, 255, 1);
          border: 1px dashed #979797;
          position: relative;
          padding-top: 20px;
          img {
            width: 62px;
            height: 62px;
            display: block;
            margin: auto;
          }
          .chose-text {
            text-align: center;
            font-size: 24px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(46, 169, 254, 1);
            line-height: 24px;
            margin-top: 12px;
          }
        }
      }
      .tip-text {
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
        margin-left: 36px;
        padding-bottom: 28px;
        border-bottom: 1px solid #CDE3FB;
        .more-text {
          color: rgba(46, 169, 254, 1);
        }
      }
      .img-submit {
        font-size: 32px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(46, 169, 254, 1);
        line-height: 92px;
        background: rgba(215, 234, 253, 1);
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }

  }

  .pain-level-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    z-index: 5;
  }

  .pain-level-box {
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    z-index: 5;
    position: absolute;
    width: 690px;
    left: 50%;
    margin-left: -345px;
    top: 50%;
    transform: translateY(-50%);
    .pain-level-content {
      .pain-value-name {
        display: block;
        text-align: center;
        margin-bottom: 24px;
        i {
          font-size: 34px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 34px;
          display: inline-block;
          vertical-align: middle;
        }
        .name-text {
          font-size: 48px;
          font-family: Arial-BoldMT;
          font-weight: bold;
          color: rgba(46, 169, 254, 1);
          line-height: 48px;
          margin-left: 6px;
        }
      }
      .pain-value-desc {
        display: block;
        font-size: 26px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(170, 170, 170, 1);
        line-height: 26px;
      }
    }
    .pain-level-ensure {
      text-align: center;
      color: #ffffff;
      font-size: 32px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 35px;
      width: 476px;
      height: 92px;
      background: rgba(46, 169, 254, 1);
      border-radius: 8px;
      line-height: 92px;

    }
    & > h3 {
      font-size: 30px;
      color: #909090;
      font-weight: normal;
      padding: 20px 40px 0;
      @include clearfix();
      span {
        float: left;
      }
      .icon-closePainLevel {
        float: right;
        width: 30px;
        height: 30px;
        background: url("https://m.allinmed.cn/static/image/img00/index/close.png") center center no-repeat;
        background-size: 30px 30px;
        padding: 20px;
        margin-right: -20px;
      }
    }
    .pain-level-progress {
      -webkit-appearance: none;
      position: relative;
      top: 67.5px;
      width: 682px !important;
      height: 116px;
      .vue-slider {
        background: none;
      }
      .vue-slider-process {
        background: none;
      }
      .vue-slider-piecewise {
        li {
          &:before {
            content: "";
            font-size: 24px;
            color: #aaaaaa;
            position: absolute;
            top: -180px;
            left: -15px;
            white-space: nowrap;
          }
          &:nth-child(1) {
            &:before {
              content: "不痛";
            }
          }
          &:nth-last-child(1) {
            &:before {
              content: "巨痛";
            }
          }
        }
      }
      .vue-slider-dot {
        width: 160px;
        height: 160px;
        box-shadow: none;
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression00@2x.png") no-repeat;
        background-size: contain;
      }
      &.pain0 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression00@2x.png") no-repeat;
          background-size: contain;
          position: absolute;
          top: 0;
        }
      }
      &.pain1 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale02@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression02@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain2 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale03@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression03@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain3 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale05@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression05@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain4 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale08@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression08@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain5 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale09@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression09@2x.png") no-repeat;
          background-size: contain;
        }
      }
    }
  }

  .vue-slider {
    background: none !important;
  }

  .pain-level-progress-tips {
    text-align: center;
    font-size: 0;
    position: relative;
    white-space: nowrap;
    left: 5%;
    margin-bottom: 20px;
    & > li {
      display: inline-block;
      font-size: 28px;
      padding-right: 39px;
      color: #909090;
      &.tips {
        position: relative;
        &:before {
          content: "";
          font-size: 24px;
          color: #aaaaaa;
          position: absolute;
          top: -35px;
        }
        &.first:before {
          content: "不痛";
          left: -25%;
        }
        &.last:before {
          content: "巨痛";
          left: -10%;
        }
      }
    }
  }

  .pain-level-title-content {
    background: #ffffff;
    border-radius: 9999px;
    width: 564px;
    margin: 0 auto;
    padding: 14px 16px;
    box-sizing: border-box;
    margin-top: 54px;
    &.pain .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression00@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain0 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression00@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain1 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression02@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain2 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression03@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain3 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression05@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain4 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression08@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain5 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression09@2x.png") no-repeat;
      background-size: contain;
    }

    & > .icon-pain-level-tips {
      width: 60px;
      height: 60px;
      display: inline-block;
      vertical-align: middle;
    }

    & > p {
      font-size: 32px;
      color: #222222;
      vertical-align: middle;
      display: inline-block;
      position: relative;
      width: 450px;
      &.choicePain:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -18px;
        @include square(36px);
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/arrow@2x.png");
        background-size: contain;
      }
      em {
        font-style: normal;
        vertical-align: middle;
      }
      span {
        @include ellipsis();
        color: #2EA9FE;
        width: 225px;
        display: inline-block;
        vertical-align: middle;

        &:after {
          content: "";
          display: inline-block;
          vertical-align: middle;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -18px;
          @include square(36px);
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/arrow@2x.png");
          background-size: contain;
        }
      }
    }
  }

</style>
