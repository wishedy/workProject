<template>
  <div data-alcode-mod='715'>
    <section class="main-message-box">
    <article class="check-suggest-box">
      <header class="check-suggest-title">建议您进行以下检查，并上传检查资料，分诊将继续为您解答，并推荐对症专家</header>
      <section class="check-suggest-bg"></section>
      <section class="check-suggest-content">
        <ul class="check-suggest-list">
          <li class="check-suggest-item"
              :data-adviceid="item.adviceId"
              :data-advicetype="item.adviceType"
              v-for="(item, index) in tempSuggest"
              :key="index"
              :scrollToBottom="scrollToBottom"
              :scrollElement='scrollElement'
          >
            <span>{{item.adviceName}}</span>
          </li>
        </ul>
        <section class="more-box" v-if="moreBoxShow">
          <span class="more-box-btn more-btn" v-show="moreData" @click="moreDataShow($event)">查看更多</span>
          <span class="more-box-btn less-btn" v-show="!moreData" @click="lessDataShow($event)">收起</span>
        </section>
        <section data-alcode='e129' class="check-suggest-btn" data-role="videoTriage"
                    @click="goToUpload()">
          上传检查资料
        </section>
      </section>
      <section class="tips-content">
        重要提示：在线咨询不能代替面诊，医生建议仅供参考。
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
   * Created by lichenyang on 2017/8/21.
   */
import api from 'common/js/util/util';
// import store from "../store/store";
import dataLog from "dataLog";
import {createNamespacedHelpers} from "vuex";
const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');
export default {
  data() {
    return {
      moreBoxShow: false, //展开更多盒子是否显示
      moreData: false, //显示展开更多还是显示收起按钮
      tempSuggest: [], //展示的数组
      moreSuggest: [], //最多的数组
      lessSuggest: [], //五条建议的数据
      position: 0, //记录卡片的位置
      hasPosition: false, //卡片的位置是否已经记录
      paramsData: [] //上传检查检验的参数
    };
  },
  mounted() {
    console.log(this.checkSuggestMessage);
    this.initData();
  },
  methods: {
    ...mapMutations(['setToastTips', 'setToastShow', 'setUpload']),
    //初始化数据
    initData() {
      let that = this;
      //检查检验Imagetype手动改为3，与pc展示相对应
      that.paramsData = that.checkSuggestMessage.data;
      that.paramsData.map((item, index) => {
        Object.assign(item, { adviceType: 3 });
      });
      if (that.checkSuggestMessage.data.length > 5) {
        that.moreBoxShow = true;
        that.moreSuggest = that.checkSuggestMessage.data;
        that.lessSuggest = that.checkSuggestMessage.data.slice(0, 5);
        that.tempSuggest = that.lessSuggest;
        that.moreData = true;
      } else {
        that.moreBoxShow = false;
        that.tempSuggest = that.checkSuggestMessage.data;
      }
    },
    //展示更多
    moreDataShow(e) {
      let that = this;
      // if (!that.hasPosition) {
      //   that.position = e.path["4"].offsetTop;
      //   that.hasPosition = true;
      // }
      that.moreData = false;
      that.tempSuggest = that.moreSuggest;

    },
    //收起
    lessDataShow(e) {
      let that = this;
      // document.body.scrollTop = that.position;
      that.moreData = true;
      that.tempSuggest = that.lessSuggest;
      that.$nextTick(function () {
        // that.scrollElement($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      })
    },
    goToUpload() {
      dataLog.createTrack({
        actionId: 14173,
      });

      if (this.consultationState == 7 || this.consultationState == 1 || this.consultationState == 8) {
        this.setToastShow();
        this.setToastTips('分诊服务已结束')
      } else {
        // this.setUpload(this.paramsData);
        wx.setStorageSync("checkInspectLists",JSON.stringify(this.paramsData));
        wx.navigateTo({
          url:`/pages/upLoadImgCheck/upLoadImgCheck?caseId=${this.caseId}&from=im`,
        });
      }
    }
  },
  computed: {
    ...mapState(['consultationState',"caseId"]),
  },
  props: {
    checkSuggestMessage: {
      type: Object
    },
    scrollToBottom: {
      type: Function,
      default: null
    },
    scrollElement: {
      type: Function,
      default: null
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">

/*检查检验样式*/
.check-suggest-box {
  width: 690px;
  margin: 0 auto;
  .check-suggest-title {
    box-sizing: border-box;
    padding: 36px 36px 10px;
    background: #edeeee;
    color: #666666;
    font-size:28px;
    border: 1px solid #e4e9eb;
    border-radius: 12px 12px 0px 0px;
    border-bottom: none;
  }
  .check-suggest-bg {
    width: 690px;
    height: 54px;
    background: url("https://m.allinmed.cn/static/image/imScene/list_style@2x.png") no-repeat;
    background-size: cover;
  }
  .check-suggest-content {
    color: #333333;
    padding: 20px 0 70px;
    font-size:34px;
    background: #ffffff;
    border-left: 1px solid #e4e9eb;
    border-right: 1px solid #e4e9eb;
    // border-radius: 0px 0px 12px 12px;
    .check-suggest-list {
      .check-suggest-item {
        color: #222222;
        box-sizing: border-box;
        padding: 0px 58px;
        position: relative;
        font-weight: bold;
        &::before {
          content: "";
          width: 8px;
          height: 8px;
          display: inline-block;
          position: absolute;
          top: 50%;
          margin-top: -4px;
          left: 39px;
          background: #406181;
          border-radius: 4px;
        }
      }
      .check-suggest-item + .check-suggest-item {
        margin-top: 50px;
      }
    }
    .more-box {
      margin-top: 50px;
      font-size:28px;
      color: #909090;
      text-align: center;
      .more-box-btn {
        padding: 0px 50px 0px 10px;
      }
      .more-btn {
        background: url("https://m.allinmed.cn/static/image/imScene/under_arrow@2x.png")
          no-repeat top right;
        background-size: 32px 32px;
      }
      .less-btn {
        background: url("https://m.allinmed.cn/static/image/imScene/pack_up@2x.png")
          no-repeat top right;
        background-size: 32px 32px;
      }
    }
    .check-suggest-btn {
      background: #2fc5bd;
      border-radius: 999px;
      width: 560px;
      margin: 56px auto 0px;
      color: #ffffff;
      text-align: center;
      line-height: 1;
      font-size:36px;
      padding: 30px 0;
    }
  }

  .tips-content{
    padding:18px 36px;
    background: #FAFAFB;
    color: #97A8BA;
    font-size:26px;
    border: 1px solid  #e4e9eb;
    border-top: none;
    border-bottom-right-radius: 21px;
    border-bottom-left-radius: 21px;
  }
}
</style>
