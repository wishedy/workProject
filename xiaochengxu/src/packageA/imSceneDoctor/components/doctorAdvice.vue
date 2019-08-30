<template>
  <section class="advice-box">
    <figcaption class="advice-title">
      <section class="advice-top">
        <h3 class="advice-title">医嘱提醒</h3>
      </section>
      <ul class="advice-content">
        <li class="content-top" v-if="adviceContent.length">
          <section class="content-top-left">医嘱内容</section>
          <section class="content-top-right">{{adviceContent}}<span v-if="moreShowFlag" class="more"
                                                                    @click="showMore()"></span></section>
        </li>
        <li class="content-bottom" @click="goKnowledge($event)">请及时查看<span>{{contentData.educationTitle}}</span><span
          class="more"></span></li>
      </ul>
    </figcaption>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/7/5.
   */
  import api from "common/js/util/util";

  export default {
    data() {
      return {
        contentData: {},
        moreShowFlag: false,
        adviceContent: '',
        adviceContentMore: "",
      };
    },
    mounted() {
      console.log(this.reportId)
      this.contentData = this.contentMessage.content.data[0];
      if (api.getByteLen(this.contentData.toleContent) > 24) {
        this.moreShowFlag = true;
        this.adviceContentMore = this.contentData.toleContent;
        this.adviceContent = api.getStrByteLen(this.contentData.toleContent, 22) + "...";
      } else {
        this.adviceContent = this.contentData.toleContent
      }
      console.log(this.contentData);
    },

    methods: {
      showMore() {
        this.adviceContent = this.adviceContentMore;
        this.moreShowFlag = false;
      },
      // 去患教
      goKnowledge(e) {
        console.log(encodeURIComponent(this.contentData.educationUrl))
        wx.navigateTo({
          url: `/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=${encodeURIComponent(this.contentData.educationUrl+"&type=1&shareDoctorId="+this.contentData.customerId)}`
        });
      }
    },
    props: {
      contentMessage: {
        type: Object
      },
      reportId: {
        type: Number
      },
      doctorCustomerId: {
        type: Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .advice-box {
    margin: 35px 0;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 0;
    & > .advice-title {
      border-radius:24px;
      overflow: hidden;
      color: #222222;
      width: 690px;
      padding: 2px;
      background:linear-gradient(305deg,rgba(1,209,194,1) 0%,rgba(7,182,172,1) 100%);
      width: 690px;
      margin: 0 auto;
      font-size: 34px;
      word-break: break-all;
      box-sizing: border-box;
      .advice-top {
        height: 68px;
        line-height: 68px;
        .advice-title {
          font-weight: normal;
          font-size: 28px;
          color: #FFFFFF;
          &::before {
            content: "";
            display: inline-block;
            width: 22px;
            height: 28px;
            background: url("https://m.allinmed.cn/static/image/imScene/adviceIcon@2x.png") no-repeat;
            background-size: cover;
            vertical-align: -2px;
            margin: 0 12px 0 38px;
          }
        }
      }
      .advice-content {
        border-radius:0 0 22px 22px;
        background: #ffffff;
        padding: 32px;
        .content-top {
          display: flex;
          font-size: 32px;
          padding-bottom: 30px;
          position: relative;
          .content-top-left {
            width: 160px;
            color: #888888;
          }
          .content-top-right {
            flex: 1;
            color: #222222;
            position: relative;
            .more {
              display: block;
              width: 22px;
              height: 12px;
              position: absolute;
              background: url("https://m.allinmed.cn/static/image/imScene/more-bottom@2x.png") no-repeat;
              background-size: cover;
              right: 0;
              top: 18px;
              &::after{
                position: absolute;
                top: -15px;
                left: -15px;
                right: -15px;
                bottom: -15px;
                content: '';
              }
            }
          }
        }
        .content-bottom {
          font-size: 34px;
          color: #888888;
          position: relative;
          padding-right: 60px;
          .more {
            position: absolute;
            width: 40px;
            height: 40px;
            right: 0;
            top: 4px;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/im_more.png") no-repeat;
            background-size: cover;
          }
          span {
            color: #2EA9FE;
          }
        }
        li + li.content-bottom {
          padding-top: 30px;
          border-top: 1px solid #EAEDF3;
          .more {
            top: 34px;
          }
        }
      }
    }
  }
</style>
