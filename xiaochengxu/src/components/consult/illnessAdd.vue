<template>
  <section class="illnessAddMain">
    <section class="illnessBox">
      <textarea class="illnessAddArea" focus="true" :placeholder="placeholder" v-model.trim="areaText" @input="inputFn()" maxlength=-1></textarea>
      <span class="inputCount">{{inputCount}}</span>
    </section>
    <section class="illnessAddBtnBox">
      <span class="illnessAddBtnCancle" @click="notSureGoBack">暂不补充</span>
      <span class="illnessAddBtnSure" @click="sureGoBack">确定</span>
    </section>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>


<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import Toast from "components/toast";
  import {mapMutations, mapState, mapActions} from "vuex";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        placeholder: "除已选部位外其他部位不适症状，发病诱因，病情加重或缓解情况，手术情况等可以在这里补充。",
        areaText: "",
        inputCount: ""
      };
    },

    onShow(){
      console.log(this.$root.$mp.query)
      this.areaText = this.patientMessage.descriptionDisease;
      if (this.$root.$mp.query.scene==="findDoctor"){
        dataLog.enterBrowse({
          browseType:"97",
          opDesc:"病情补充-找医生（小程序）"
        });
      }else{
        dataLog.enterBrowse({
          browseType:"113",
          opDesc:"病情补充-快速咨询（小程序）"
        });
      }
      this.areaText = this.patientMessage.descriptionDisease;
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods: {
      ...mapMutations(["setPatientMessage"]),
      ...mapActions(["showToast"]),
      sureGoBack() {
        if (this.areaText.length > 0) {
          this.setPatientMessage({descriptionDisease: this.areaText});
          wx.navigateBack({
            delta: 1
          })
        } else {
          this.showToast("请输入病情补充");
        }
      },
      notSureGoBack() {
        this.setPatientMessage({descriptionDisease: "暂不补充"});
        this.areaText = '';
        wx.navigateBack({
          delta: 1
        })
      },
      inputFn() {
        let _this = this;
        let _countObj = api.getStrInputCut(_this.areaText, 1000, 50);
        _this.areaText = _countObj.str;
        // console.log(_countObj)
        if (_countObj.outStatus) {
          _this.inputCount = _countObj.lastCount;
        } else {
          _this.inputCount = '';
        }
      }
    },
    components: {
      Toast
    },
    computed: {
      ...mapState(['patientMessage','toastContent', 'toastShow'])
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .illnessAddMain {
    width: 100%;
    height: 100%;
    background: #ffffff;
    padding-top: 90px;
    box-sizing: border-box;
    .illnessBox {
      position: relative;
      width: 634px;
      height: 240px;
      margin: 0 auto;
      .inputCount {
        position: absolute;
        bottom: 12px;
        right: 10px;
        font-size: 36px;
        color: #FE8178;
      }
      .illnessAddArea {
        display: block;
        width: 634px;
        height: 240px;
        padding: 30px 28px;
        font-size: 32px;
        line-height: 44px;
        color: #333333;
        border: 2px solid #cccccc;
        border-radius: 8px;
        box-sizing: border-box;
        &::-webkit-input-placeholder {
          color: #aaaaaa;
        }
      }
    }

    .illnessAddBtnBox {
      margin-top: 80px;
      .illnessAddBtnSure {
        display: inline-block;
        width: 300px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 34px;
        color: #ffffff;
        font-weight: bold;
        background: #00B9AD;
        border-radius: 100px;
      }
      .illnessAddBtnCancle {
        display: inline-block;
        width: 300px;
        height: 100px;
        margin:0 30px 0 60px;
        line-height: 100px;
        text-align: center;
        font-size: 34px;
        color: #00B9AD;
        background: #ffffff;
        border-radius: 100px;
        border: 1px solid #00B9AD;
      }
    }
  }
</style>
