/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

export default {
  setClickFlag(state, flag) {
    state.clickFlag = flag;
  },
  setBaseMessage(state, param) {
    state.resourceId = param.resourceId || "";
    state.authorCustomerId = param.authorCustomerId || "";
  },
  setJournalMessage(state, param) {
    state.journalMessage = Object.assign(state.journalMessage, param);
  },
  setCanvasShow(state, flag) {
    state.canvasShow = flag;
  },
  setMobile(state, num) {
    state.mobile = num;
  },
  setCustomerId(state, id) {
    state.customerId = id;
  },
  setAllTypePage(state, page) {
    state.allTypePage = page;
  },
  setSystemInfo(state, obj) {
    state.systemInfo = obj;
  },
  setShareMessage(state, param) {
    state.shareMessage = Object.assign(state.shareMessage, param);
  },
  setAuthorTypePage(state, page) {
    state.authorTypePage = page;
  },
  setListType(state, type) {
    state.listType = type;
  },
  setAllTypePageFinish(state, flag) {
    state.allTypeFinish = flag;
  },
  setAuthorTypePageFinish(state, flag) {
    state.authorTypeFinish = flag;
  },
  setDeleteCommentItem(state, param) {
    state.deleteShowFlag = param.flag;
    state.deleteItem = param.item
  },
  setCommentWindowShow(state, flag) {
    if (flag) {
      const query = wx.createSelectorQuery();
      query.select('#journal-container').boundingClientRect();
      query.selectViewport().scrollOffset();

      query.exec((res) => {
        console.log(res)
        state.cachePosition = res[1].scrollTop;
        state.showCommentWindow = flag;
      });
    } else {
      state.showCommentWindow = flag;

    }
  },
  setShareShow(state, flag) {
    state.showShareBox = flag;
  },
  setLoadingStatus(state, flag) {
    state.loading = flag;
  },
  setLoadingType(state, type) {
    state.loadingType = type;
  },
  setAllTypeLoading(state, type) {
    state.allTypeLoading = type;
  },
  setAuthorTypeLoading(state, type) {
    state.authorTypeLoading = type;
  },
  setCommentNum(state, num) {
    state.commentNum = Object.assign(state.commentNum, num);
  },
  setCommentList(state, list) {
    state.commentList = list ? list : "empty";
  },
  setAuthorCommentList(state, list) {
    state.authorCommentList = list ? list : "empty";
  },
  setJournalRecommendList(state, list) {
    state.recommendList = list;
  },
  setDoctorMessage(state, msg) {
    state.doctorMessage = msg;
  },
  setCurrentCommentId(state, params) {
    state.currentCommentId = params.reviewId;
    state.currentCustomerId = params.refCustomerId;
  },
  showBigImg(state, param) {
    console.log(param.imageList, param.img)
    const _imageList = [];
    param.imageList.forEach((e, i) => {
      _imageList.push(e.blob);
    });
    wx.previewImage({
      current: param.img,
      urls: _imageList //这里就将[]去掉
    });
  },
  setEnsureShow(state, flag) {
    state.ensureShow = flag;
  },
  setAuthStatus(state, flag) {
    state.authStatus = flag;
  }
}
