<template>
  <section class="doctorHelpMain">
    <section class="illnessBox">
      <textarea class="doctorHelpArea" :placeholder="placeholder" v-model.trim="areaText" @input="inputFn()" maxlength=-1></textarea>
      <span class="inputCount">{{inputCount}}</span>
    </section>
    <figure class="doctorHelpRapid">
      <figcaption>点击标签快捷输入<span>(非必选)</span></figcaption>
      <ul class="rapidLists">
        <li class="rapidItem" v-for="(item,index) in rapidLists" @click="rapFn(item)" :key="index">{{item.title}}</li>
      </ul>
    </figure>
    <button class="doctorHelpSure" @click="sureGoBack">确定</button>
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
      placeholder: "可向医生咨询治疗方案、如何控制病情，是否可以手术等",
      rapidLists: [{
        title:"需要如何治疗",
        content:"我想咨询疾病需要如何治疗？"
      },{
        title:"检查报告解读",
        content:"想医生帮助检查报告解读。"
      },{
        title:"是否需要手术",
        content:"我想咨询是否需要手术？"
      },{
        title:"如何缓解疼痛",
        content:"我想咨询如何缓解疼痛？"
      }],
      areaText: "",
      inputCount:''
    };
  },
  onShow(){
    console.log(this.$root.$mp.query)
    this.areaText = this.patientMessage.needHelp;
    if (this.$root.$mp.query.scene==="findDoctor"){
      dataLog.enterBrowse({
        browseType:"98",
        opDesc:"想要医生的帮助-找医生（小程序）"
      });
    }else{
      dataLog.enterBrowse({
        browseType:"114",
        opDesc:"想要医生的帮助-快速咨询（小程序）"
      });
    }

  },
  onHide(){
    dataLog.leaveBrowse();
  },
  methods: {
    ...mapMutations(["setPatientMessage"]),
    ...mapActions(["showToast"]),
    sureGoBack() {
      if(this.areaText.length>0){
        this.setPatientMessage({needHelp: this.areaText});
        wx.navigateBack({
          delta: 1
        })
      }else{
        this.showToast("请输入想要医生提供的帮助");
      }
    },
    rapFn(item){
      this.areaText=this.areaText+item.content,
      this.inputFn();
    },
    inputFn(){
      let _this = this;
      let _countObj = api.getStrInputCut(_this.areaText, 1000, 50);
      _this.areaText = _countObj.str;
      if (_countObj.outStatus) {
        _this.inputCount = _countObj.lastCount;
      } else {
        _this.inputCount = '';
      }
    }
  },
  computed:{
    ...mapState(['patientMessage','toastContent', 'toastShow'])
  },
  components:{
    Toast
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.doctorHelpMain {
  width: 100%;
  height: 100%;
  padding: 90px 56px 0;
  box-sizing: border-box;
  background: #ffffff;
  .illnessBox {
    position: relative;
    .inputCount {
      position: absolute;
      bottom: 12px;
      right: 10px;
      font-size: 36px;
      color: #fe8178;
    }
    .doctorHelpArea {
      display: block;
      width: 100%;
      height: 240px;
      padding: 30px 28px;
      font-size: 32px;
      line-height: 44px;
      color: #333333;
      border: 1px solid #cccccc;
      border-radius: 8px;
      box-sizing: border-box;
      &::-webkit-input-placeholder {
        color: #aaaaaa;
      }
    }
  }
  .doctorHelpRapid {
    margin-top: 60px;
    figcaption {
      font-weight: bold;
      font-size: 34px;
      color: #444444;
      span{
        font-weight: normal;
        font-size: 30px;
        color: #333333;
      }
    }
    .rapidLists {
      margin-top: 12px;
      @include clearfix();
      li {
        float: left;
        padding: 24px 28px;
        margin: 28px 20px 0 0;
        text-align: center;
        background: #f5f6f9;
        border-radius: 8px;
        font-size: 32px;
        color: #444444;
        &:after{
          display: inline-block;
          content: "";
          width:32px;
          height:32px;
          background: url("https://m.allinmed.cn/static/image/img00/findDoctor/add_icon.png") no-repeat;
          background-size: 100% 100%;
          margin-left:10px;
          vertical-align:-4px;
        }
      }
    }
  }
  .doctorHelpSure {
    display: block;
    margin: 60px auto 0;
    width: 500px;
    height: 100px;
    letter-spacing: 2.12px;
    line-height: 100px;
    text-align: center;
    font-size: 34px;
    color: #ffffff;
    font-weight: bold;
    background: linear-gradient(-90deg, #3fe6bc 6%, #2EA9FE 95%);
    box-shadow: 0 20px 36px 0 rgba(30, 231, 187, 0.38);
    border-radius: 100px;
  }
}
</style>
