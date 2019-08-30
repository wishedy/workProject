<template>
  <section class="report-inner">
    <section class="healthCooperationHeader">
      <h1 class="logo"></h1>
      <span>美年大健康体检报告</span>
    </section>
    <section class="healthCooperationImages" @click.stop="checkAttachment" v-if="physicalAttList.length">
      <span class="imageNumber">
        <i class="icon"></i>
        <i>影像检测图片（共{{physicalAttList.length}}张图）</i>
      </span>
      <span class="check-btn">查看</span>
    </section>
    <section class="healthCooperationReportList" v-if="reportList.length">
      <article class="healthCooperationReportItem" v-for="(item,index) in reportList" :key="index">
        <section v-for="(innerItem,innerKey) in item" :key="innerKey">
          <h1 class="title" v-text="innerKey"></h1>
          <article class="bodyParts" v-for="(innerListItem,innerIndex) in innerItem" :key="innerIndex">
            <h3 class="subTitle">
              <i></i>
              <span v-text="innerListItem.inspectionItem"></span>
            </h3>
            <article class="reportDescribe">
              <h3 class="describeTitle">
                <i></i>
                <span>描述</span>
              </h3>
              <p class="describeContent" v-text="innerListItem.inspectionDesc">
              </p>
            </article>
            <article class="reportDescribe">
              <h3 class="describeTitle">
                <i></i>
                <span>检查结果</span>
              </h3>
              <p class="describeContent" v-text="innerListItem.inspectionResult">
              </p>
            </article>
          </article>
        </section>

      </article>
    </section>
    <section class="footer-btn" @click.stop="consultDoctor" v-if="checkDoctor">
      <i class="icon"></i>
      免费咨询医生
    </section>
  </section>
</template>
<style lang="scss">
  @import "healthCooperation";
</style>
<script type="text/ecmascript-6">
  /**
   * @Desc：美年大合作问诊流程
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by zhangheng on 2018/11/1.
   */
  import localStorage from "localStorage";
  import {createNamespacedHelpers} from "vuex";
  const {mapGetters,mapActions} = createNamespacedHelpers('meinian');
  export default {
    data() {
      return {
        checkDoctor:false,
        from:'meinian'
      }
    },
    methods: {
      ...mapActions(['consultDoctor','getReportDetail','changeIdentityCardNum','changeName']),
      checkAttachment(){
        let t = this;
        wx.navigateTo({
          url: '/packageA/meinian/imageList'
        });
      }
    },
    onLoad(option){
      let t = this;
      if(option.from){
        t.from = option.from;
        t.nav = option.nav;
      }
      if((t.from&&t.from==='medical')){
        t.checkDoctor = false;
        t.changeIdentityCardNum(option.certificateCode);
        t.changeName(option.patientName);
        t.getReportDetail({from:'other',physicalNo:option.physicalNo});
      }else{
        t.checkDoctor = true;
      }

    },
    onShow () {
      if (!this.checkDoctor) {
        if(this.from && this.from === 'medical') {
          this.checkDoctor  =false;
        } else {
          this.checkDoctor = true;
        }
      }
    },
    onUnload(){
      let t = this;
      console.log(t.nav);
      if(t.from==='meinian'&&t.nav==0){
        if(localStorage.getItem('backIndex')){
          return false;
        }
        wx.navigateTo({
          url: '/packageA/meinian/patientList'
        });
      }
      t.from = '';
    },
    mounted() {
      console.log(this.reportData);
    },
    computed: {
      ...mapGetters(['reportData']),
      physicalAttList(){
        let t = this;
        if(t.reportData&&t.reportData.responseData&&t.reportData.responseData.dataList&&t.reportData.responseData.dataList[0].physicalAttList){
          return  t.reportData.responseData.dataList[0].physicalAttList;
        }else{
          return [];
        }
      },
      reportList(){
        let t = this;
        if(t.reportData&&t.reportData.responseData&&t.reportData.responseData.dataList&&t.reportData.responseData.dataList[0].physicalResultList){
          return  t.reportData.responseData.dataList[0].physicalResultList;
        }else{
          return [];
        }
      }
    }
  }
</script>
