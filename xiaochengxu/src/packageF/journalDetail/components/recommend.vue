<template>
  <section class="recommend-container" v-if="reLists.length>0">
    <header class="recommend-title">
      <h2>相关推荐</h2>
    </header>
    <ul class="recommend-list">
      <li class="recommend-item" v-for="(item,index) in reLists" :key="index"
          @click="clickStatus && goOtherJournal(item,index)">
        <i class="icon-recommend"></i>
        <p>{{item.diaryName}}</p>
      </li>
    </ul>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12.
   */
  import dataLog from "dataLog";
  import api from "common/js/util/util";

  const XHRList = api.httpEnv() + "/mcall/rehabilitative/diary/v1/getRecommendList/";
  export default {
    data() {
      return {
        reLists: [],
        clickStatus: true
      }
    },
    onLoad() {
      this.getRecommendList();
    },
    onUnload() {
      this.reLists = [];
      this.clickStatus = true;
    },
    methods: {
      getRecommendList() {
        let that = this;
        api.ajax({
          url: XHRList,
          method: "POST",
          data: {
            diaryIdNotIn: this.$root.$mp.query.rId||this.$root.$mp.query.scene,
            firstResult: "0",
            maxResult: "5",
            isValid: "1",
            visitSiteId: "24",
            sortType: "2"
          },
          done(res) {
            console.log(res)
            if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              that.reLists = res.responseObject.responseData.dataList;
            } else {
              that.reLists = [];
            }
          }
        })
      },
      goOtherJournal(obj, index) {
        this.clickStatus = false;
        setTimeout(() => {
          this.clickStatus = true;
        }, 500);
        dataLog.createTrack({
          actionId: 14131,
          pushMessageId: obj.diaryId,
          keyword: obj.diaryName,
          locationId: parseInt(index) + 1
        });
        wx.redirectTo({
          url: `/packageF/journalDetail/journalDetail?aId=${obj.authorId}&rId=${obj.diaryId}`
        })
      }
    }
  }
</script>

<style lang="scss">
  .recommend-container {
    padding: 20px 30px 16px;
    box-sizing: border-box;
    background: #ffffff;
    .recommend-title {
      font-size: 30px;
      font-weight: normal;
      color: #777777;
      margin-bottom:22px;
      h2 {
        display: inline-block;
        vertical-align: middle;
        &:before {
          display: inline-block;
          content: "";
          width: 4px;
          height: 26px;
          margin-right: 10px;
          background: #00B9AD;
          border-radius: 100px;
          vertical-align: -2px
        }
      }
    }
    .recommend-item {
      font-size: 32px;
      color: #333333;
      margin: 28px 0;
      .icon-recommend {
        width: 32px;
        height: 32px;
        display: inline-block;
        vertical-align: middle;
        background: url("https://m.allinmed.cn/static/image/mp/index/tuijian.png") no-repeat center center;
        background-size: contain;
        margin-right: 16px;
      }
      & > p {
        display: inline-block;
        vertical-align: middle;
        max-width: 544px;
        @include ellipsis();
      }

    }
  }
</style>
