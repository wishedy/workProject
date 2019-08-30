<template>
  <div>
    <section class="main-message-box">
      <article class="patient-node-box" @click="goPatientNodeDetail()">
        <header class="patient-node-title">推荐您查看</header>
        <section class="patient-node-content">
          <div class="patient-node-top">
            <div class="patient-node-left">
              <h3 class="node-left-title">{{patientNodeContent.manualTitle}}</h3>
              <p class="node-left-num">包含{{patientNodeContent.educationCount}}篇内容</p>
            </div>
            <image :src="patientNodeContent.manualAttUrl" class="patient-node-right"></image>
          </div>
          <div class="patient-node-footer">分享自：{{targetMsg.nick}}<span class="doctor-split"></span>{{targetMsg.hospital}}</div>
        </section>
      </article>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/12/19.
   */
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from "vuex";

  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imSceneDoctor');

  export default {
    data() {
      return {
        clickFlag:true,
        patientNodeContent:{},
      }
    },
    mounted() {
      this.patientNodeContent = this.contentMessage.content.data[0];
      console.log(this.patientNodeContent);
    },
    computed: {
      ...mapState(['targetMsg']),
    },
    methods: {
      goPatientNodeDetail() {
        dataLog.createTrack({
          actionId: 14203,
          pushMessageId:this.patientNodeContent.manualId,
          keyword:this.patientNodeContent.manualTitle
        });
        if (!this.clickFlag) return;
        this.clickFlag = false;
        wx.getNetworkType({
          success: (res) => {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            let networkType = res.networkType;
            if (networkType === 'none') {
              wx.showToast({
                title: "网络中断，请检查您的网络状态",
                icon:'none',
              });
              this.clickFlag = true;
            } else {
              wx.navigateTo({
                url: `/packageF/patientNote/patientNote?manualId=${this.patientNodeContent.manualId}&shareDoctorId=${this.targetMsg.customerId}`,
                complete : () => {
                  this.clickFlag = true;
                },
              });
            }
          }
        });
      }
    },
    props: {
      contentMessage: {
        type: Object
      },
      caseId: {
        type: Number
      },
      patientId: {
        type: Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  //咨询单
  .patient-node-box {
    /*height: 302px;*/
    width: 690px;
    padding: 2px;
    box-sizing: border-box;
    margin: 0 auto;
    background-size: cover;
    overflow: hidden;
    background:linear-gradient(305deg,rgba(1,209,194,1) 0%,rgba(7,182,172,1) 100%);
    border-radius:24px;
    .patient-node-title {
      height: 68px;
      line-height: 68px;
      font-size:28px;
      padding-left: 72px;
      font-weight: 500;
      background: url("https://m.allinmed.cn/static/image/imScene/adviceIcon@2x.png") no-repeat 36px center;
      background-size: 22px 28px;
      color: #FFFFFF;
    }
    .patient-node-content {
      font-size:34px;
      padding: 32px 32px 0px;
      box-sizing: border-box;
      border-radius:0 0 22px 22px;
      background-color: #ffffff;
      line-height: 1;
      .patient-node-top{
        display: flex;
        .patient-node-left{
          flex: 1;
          align-items:center;
          .node-left-title{
            height: 96px;
            font-size:34px;
            font-weight:500;
            color:rgba(34,34,34,1);
            line-height:48px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .node-left-num{
            margin-top: 12px;
            font-size:30px;
            font-weight:400;
            color:rgba(153,153,153,1);
          }
        }
        .patient-node-right{
          width:132px;
          height:132px;
        }
      }
      .patient-node-footer {
        height: 88px;
        line-height: 88px;
        font-size:30px;
        margin-top: 32px;
        border-top: 1px solid rgba(234,237,243,0.4);
        color:rgba(153,153,153,1);
        padding-right: 64px;
        @include ellipsis();
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/im_more.png") no-repeat right center;
        background-size: 40px 40px;
        .doctor-split{
          display: inline-block;
          margin: 0 8px;
          width:2px;
          height:20px;
          background-color: rgb(7,182,172);
        }
      }
    }
  }
</style>
