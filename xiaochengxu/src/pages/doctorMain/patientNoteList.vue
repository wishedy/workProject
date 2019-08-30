<template>
  <ul class="doc-guide-list">
    <li class="doc-guide-item" v-for="(item,index) in doctorGuideList" :key="index" @click="goPatientNodeDetail(item)">
      <div class="doc-guide-left">
        <img :src="item.coverUrl" alt="图片加载失败" class="node-img">
      </div>
      <div class="doc-guide-middle">
        <h3 class="guide-title">{{item.manualName}}</h3>
        <p class="guide-content">共{{item.articleNum}}篇</p>
      </div>
      <div class="doc-guide-right"></div>
    </li>
  </ul>
</template>
<NormalLoading v-if="loading"></NormalLoading>

<script type="text/ecmascript-6">
  import NormalLoading from "components/loading";
  import dataLog from "dataLog";
  import getPagesParam from "common/js/getPagesParam/getPagesParam";
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapGetters, mapActions, mapState} = createNamespacedHelpers('doctorMain');
  export default {
    data() {
      return {
        clickFlag:true,
        loading:false,
      };
    },
    mounted() {

    },
    onLoad(option){

    },
    onShow(){
      dataLog.enterBrowse({
        browseType:"136",
        opDesc:"医生主页-专家指南列表页"
      })
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    components: {
      NormalLoading,
    },
    computed: {
      ...mapState(['doctorGuideList']),
    },
    methods: {
      // 患者手册列表
      goPatientNodeDetail(item) {
        dataLog.createTrack({
          actionId: 14210,
          pushMessageId:item.manualId,
          keyword:item.manualName,
        });
        if (!this.clickFlag) return;
        this.clickFlag = false;
        let pagesParam= getPagesParam.getPageInfo('patientNote');
        if(pagesParam.hasName){//有相同的
          wx.setStorageSync('nodeManualId', item.manualId);
          wx.navigateBack({
            delta: pagesParam.backNum
          });
          this.clickFlag = true;
        }else {//没有相同的历史
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
                  url: `/packageF/patientNote/patientNote?manualId=${item.manualId}`,
                  success : () => {
                    this.clickFlag = true;
                  },
                  fail : () => {
                    this.clickFlag = true;
                  },
                });
              }
            }
          });
        }
      },
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .doc-guide-list{
    padding: 20px 40px 40px;
    .doc-guide-item{
      display: flex;
      align-items: center;
      .doc-guide-left{
        width: 148px;
        height: 136px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/notebookDefault.png") no-repeat center;
        background-size: 100% 100%;
        .node-img{
          width: 136px;
          height: 136px;
        }
      }
      .doc-guide-middle{
        flex: 1;
        margin: 0 24px;
        .guide-title{
          max-height: 96px;
          font-size:34px;
          font-weight:500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          color:rgba(51,51,51,1);
        }
        .guide-content{
          margin-top: 10px;
          font-size:26px;
          font-weight:400;
          color:rgba(153,153,153,1);
        }
      }
      .doc-guide-right{
        width: 28px;
        height: 28px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/arrow_right.png") no-repeat center;
        background-size: 100% 100%;
      }
      + .doc-guide-item {
        margin-top: 42px;
      }
    }
  }
</style>
