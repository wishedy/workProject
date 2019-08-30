<template>
  <div :class="model">
    <section class="journal-container" id="journal-container">
      <section class="query-helper" id="queryHelper">
        <!--康复日记主体-->
        <JournalInfo></JournalInfo>
        <!--相关推荐-->
        <Recommend></Recommend>
      </section>
      <!--评论-->
      <GcList></GcList>
      <!--底部悬浮窗-->
      <BottomBar></BottomBar>

      <!--Toast-->
      <Toast :content="toastTips" v-if="toastShow"></Toast>
      <CommentLoading :param="{
        type:commentLoadingParam.type,
        icon:commentLoadingParam.icon,
        content:commentLoadingParam.content
      }" v-if="commentLoadingParam.show"></CommentLoading>
      <NormalLoading v-if="loading" :type="loadingType"></NormalLoading>
      <Confirm :confirmParams="{
          'ensure':'确定',
          'cancel':'取消',
          'title':'您确定要删除该回复吗？'
          }" v-if="deleteShowFlag" @cancelClickEvent="deleteCancel" @ensureClickEvent="deleteCommentItem">
      </Confirm>
      <EnsureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></EnsureConfirm>

    </section>
    <!--分享朋友圈-->
    <DrawShareImage v-if="canvasShow"></DrawShareImage>
    <!--评论窗口-->
    <CommentWindow></CommentWindow>
    <!--分享窗口-->
    <ShareBox></ShareBox>
    <!--黑名单-->
    <BlackList></BlackList>
  </div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12
   */
  import Recommend from "./components/recommend";
  import ShareBox from "./components/shareBox"
  import GcList from "./components/gcList";
  import BottomBar from "./components/bottomBar";
  import CommentWindow from "./components/commentWindow";
  import JournalInfo from "./components/journalInfo";
  import DrawShareImage from "./components/drawShareImage";
  import Toast from "components/toast";
  import Confirm from "components/confirm";
  import EnsureConfirm from "components/ensure";
  import CommentLoading from "./components/commentLoading";
  import NormalLoading from "components/loading";
  import localStorage from "localStorage";
  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "dataLog";
  import api from "common/js/util/util";
  import BlackList from "components/BlackList";

  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('journal');

  export default {
    data() {
      return {
        finish: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        model: "",
      }
    },
    // onPageScroll(){
    //   this.setCommentWindowShow(false);
    // },
    onPullDownRefresh() {
      this.getAllCommentItem();
    },
    onShow(options) {
      localStorage.setItem('diaryId', this.$root.$mp.query.rId);
      const query = this.$root.$mp.query;
      console.log(query)
      if (query.scene) {
        dataLog.enterBrowse({
          browseUrl: encodeURIComponent("packageF/journalDetail/journalDetail?scene=" + query.scene + "&from=qrCode")
        });
      } else {
        dataLog.enterBrowse();
      }

      if (localStorage.getItem("bindFinish")) {
        this.setCommentWindowShow(true);
        localStorage.removeItem("bindFinish")
      }
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onLoad(options) {
      api.getUserInfo().then(res => {
        this.setAuthStatus(true);
        this.initCheckLogin();
      }).catch(err => {
        this.setAuthStatus(false);
      });
      this.getShareTitle();
    },
    onUnload() {
      this.setCommentList([]); //全部评论
      this.setAuthorCommentList([]);  //作者评论
      this.setCommentNum({
        all: 0,
        author: 0
      });
      this.setShareMessage({
        num: 0
      });
      this.setCommentWindowShow(false);
      this.setShareShow(false);
      this.setAllTypePageFinish(false);
      this.setAuthorTypePageFinish(false);
      this.setLoadingStatus(false);
      this.setCanvasShow(false);
      this.setJournalMessage({
        authorName: "",
        authorLogoUrl: "",
        diaryName: "",
        fullName: "",
        customerLogo:"",
        medicalTitle: "",
        company: "",
        qrCode: ""
      });
      console.log(this.loading)
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      const page = getCurrentPages();
      const route = page[page.length - 1].options;
      let result = [];
      for (let i in route) {
        if (i != "from") {
          result.push(`${i}=${route[i]}`)
        }
      }
      let _path = `/pages/mIndex/mIndex?from=shareFriend&${result.join("&")}&path=${this.shareMessage.url}`;
      return {
        title: "唯医骨科康复日记",
        path: _path,
        success: (res) => {

          this.updateBrowseAndShareNum({
            shareNum: 1
          });
        }
      }
    },
    onReachBottom() {
      console.log("pull");


      if (this.loading) return;
      if (this.listType === "all" && !this.allTypeFinish) {
        this.getCommentList({
          type: "getAll",
          pull: true
        });
      } else if (this.listType === "author" && !this.authorTypeFinish) {
        console.log(this.listType)
        this.getCommentList({
          type: "getAuthor",
          pull: true
        })
      }
    },

    mounted() {
      const query = this.$root.$mp.query;
      this.getSystomInfo();
      this.setBaseMessage({
        resourceId: query.rId || query.scene || "",
        // authorCustomerId: query.aId
      });

      this.setListType('all');
      this.updateBrowseAndShareNum({
        browseNum: 1
      });
      this.model = this.systemInfo.model.toLowerCase().replace(" ", "");
    },
    computed: {
      ...mapState(['toastTips', 'toastShow', 'authorCustomerId', 'showCommentWindow', 'commentLoadingParam', 'ensureShow', 'loading', 'loadingType', 'deleteShowFlag', 'listType', 'allTypeFinish', 'authorTypeFinish', 'shareMessage', 'systemInfo', 'canvasShow'])
    },

    methods: {
      ...mapActions(['getCommentList', 'getJournalRecommendList', 'showToast', 'checkLogin', 'deleteCommentItem', 'getDoctorMessage', 'updateBrowseAndShareNum', 'getSystomInfo', 'initCheckLogin']),
      ...mapMutations(['setLoadingStatus', 'setBaseMessage', 'setEnsureShow', 'setDeleteCommentItem', 'setShareMessage', 'setCommentList', 'setAuthorCommentList', 'setCommentNum', 'setListType', 'setAllTypePageFinish', 'setAuthorTypePageFinish', 'setShareShow', 'setShareMessage', 'setCommentWindowShow', 'setClickFlag', 'setAuthStatus','setJournalMessage', 'setCanvasShow']),
      getImage(e) {
        const {detail} = e;
        console.log(e)
        wx.previewImage({
          current: e,
          urls: [e]
        })
      },
      goToSetting(e) {
        if (e.mp.detail.errMsg === "openSetting:ok") {
          this.setLoadingStatus(true);
          this.setEnsureShow(false);
          this.checkLogin().then((flag) => {
            // if (flag) {
            //   this.setCommentWindowShow(true);
            // }
            this.setLoadingStatus(false);
          }).catch(err => {
            console.log(err)
            this.setLoadingStatus(false);
          });
        } else {
          this.setEnsureShow(true);
        }
      },
      getShareTitle() {
        const page = getCurrentPages();

        const pageUrl = page[page.length - 1].route;
        const route = page[page.length - 1].options;
        let result = [];
        for (let i in route) {
          if (i != "from") {
            result.push(`${i}=${route[i]}`)
          }
        }
        this.setShareMessage({
          url: `/${pageUrl}?${result.join("&")}&from=share`
        });
      },
      getAllCommentItem() {
        this.getCommentList({
          type: "getAll",
          getter: true
        });
        this.getCommentList({
          type: "getAuthor",
          getter: true
        })
      },
      deleteCancel() {
        this.setDeleteCommentItem({
          'flag': false,
          'deleteItem': {}
        });
        this.setClickFlag(true);
      }
    },
    watch: {
      authorCustomerId(id) {
        this.getAllCommentItem();
      }
    },
    components: {
      Recommend,
      GcList,
      BottomBar,
      CommentWindow,
      CommentLoading,
      JournalInfo,
      Toast,
      Confirm,
      EnsureConfirm,
      NormalLoading,
      DrawShareImage,
      ShareBox,
      BlackList
    }
  }
</script>

<style lang="scss">
  page {
    background: #F2F4F7;
    height: auto;
  }

  div {

  }

  button::after {
    border: none;
  }

  input {
    outline: none;
    border: none;
    list-style: none;
  }

  .journal-container {
    height: 100%;
  }

  .iphonex {

  }
</style>
