/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */
import api from "common/js/util/util";

import createJournalComment from "common/js/HttpRequest/createJournalComment";
import getCommentList from "common/js/HttpRequest/getCommentList";
import getJournalRecommendList from "common/js/HttpRequest/getJournalRecommentList";
import getDoctorFullMsg from "common/js/HttpRequest/getDoctorFullMsg";
import miniLogin from "common/js/miniUtil/miniLogin";
import updateCommentStatus from "common/js/HttpRequest/updateCommentStatus";
import updateBrowseAndShareNum from "common/js/HttpRequest/updateBrowseAndShareNum";

export default {
  //医生信息卡片
  getDoctorMessage: ({commit, state}, params) => {
    const _data = Object.assign({
      logoUseFlag: 3
    }, params);
    getDoctorFullMsg(_data).then(data => {

      if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
        const dataList = data.responseObject.responseData.dataList[0];

        const _doctorMessage = {
          name: dataList.authMap.fullName.length > 6 ? dataList.authMap.fullName.substring(0, 6) + "..." : dataList.authMap.fullName,
          title: dataList.authMap.medicalTitleShow,
          company: dataList.authMap.company,
          logoUrl: dataList.logoUrlMap.logoUrl
        };
        console.log(_doctorMessage);
        commit("setDoctorMessage", _doctorMessage);
      }
    })
  },
  //评论列表
  getCommentList: ({commit, state}, param) => {
    wx.stopPullDownRefresh();

    commit("setLoadingType", "loading");
    let params = {};
    if (param.getter) {
      commit("setLoadingStatus", true);
      if (param.type === "getAll") {
        // console.log(state.allTypePage)
        params = {

          resourceId: state.resourceId,
          firstResult: 0,
          maxResult: state.allTypePage * 10 + 10,
          authorId: state.authorCustomerId,
          dataType: 1,
          sortType: 1
        }
      } else {
        params = {
          resourceId: state.resourceId,
          firstResult: 0,
          maxResult: state.authorTypePage * 10 + 10,
          customerId: state.customerId,
          authorId: state.authorCustomerId,
          dataType: 2,
          sortType: 1
        }
      }
    } else {

      if (param.type === "getAll") {
        commit("setAllTypeLoading", true);
        if (param.pull) commit("setAllTypePage", state.allTypePage + 1);

        params = {
          resourceId: state.resourceId,
          firstResult: state.allTypePage * 10,
          authorId: state.authorCustomerId,
          maxResult: 10,
          dataType: 1,
          sortType: 1
        }
      } else {
        commit("setAuthorTypeLoading", true);
        if (param.pull) commit("setAuthorTypePage", state.authorTypePage + 1);
        params = {
          resourceId: state.resourceId,
          firstResult: state.authorTypePage * 10,
          maxResult: 10,
          authorId: state.authorCustomerId,
          customerId: state.customerId,
          dataType: 2,
          sortType: 1
        }
      }
    }


    getCommentList(params).then(data => {

      if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
        const _dataList = data.responseObject.responseData.dataList;
        if (param.getter) {
          commit("setLoadingStatus", false);
          if (param.type === "getAll") {
            const _num = data.responseObject.responseData.totalCount;
            commit("setCommentList", _dataList); //全部评论
            commit("setCommentNum", {
              all: parseInt(_num)
            });
          } else if (param.type === "getAuthor") {
            commit("setAuthorCommentList", _dataList);  //作者评论
          }
        } else {
          if (param.type === "getAll") {
            commit("setAllTypeLoading", false);
            const _num = data.responseObject.responseData.totalCount;
            commit("setCommentList", state.commentList.concat(_dataList)); //全部评论
            commit("setCommentNum", {
              author: parseInt(_num)
            });
          } else if (param.type === "getAuthor") {
            commit("setAuthorTypeLoading", false);
            commit("setAuthorCommentList", state.authorCommentList.concat(_dataList));  //作者评论

          }
        }


      } else {
        if (param.getter) {
          commit("setLoadingStatus", false);
          if (param.type === "getAll") {

            commit("setAllTypePageFinish", true);
            commit("setAllTypePage", 0);
            commit("setCommentList", "empty"); //全部评论
          } else if (param.type === "getAuthor") {
            commit("setAuthorTypePageFinish", true);
            commit("setAuthorTypePage", 0);
            commit("setAuthorCommentList", "empty");  //作者评论
          }
        } else {
          if (param.type === "getAll") {

            commit("setAllTypePageFinish", true);
            commit("setAllTypeLoading", true);
            // commit("setAllTypePage", 0);
          } else if (param.type === "getAuthor") {
            commit("setAuthorTypeLoading", true);
            commit("setAuthorTypePageFinish", true);
            // commit("setAuthorTypePage", 0);
          }
        }

        commit("setLoadingStatus", false);
      }
    }).catch(err => {
      console.log(err);
      commit("setLoadingType", "fail");
      setTimeout(() => {
        commit("setLoadingStatus", false);
        loadingFlag = false;
      }, 2000)
    })
  },
  //相关推荐
  getJournalRecommendList: ({commit, state}) => {
    getJournalRecommendList({}).then(data => {
      if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
        const _dataList = data.responseObject.responseData.dataList;
        commit("setJournalRecommendList", _dataList);
      }
    }).catch(err => {
      console.log(err);
    })
  },
  //评论Loading
  async changeCommentLoading({commit, state}, param) {
    state.commentLoadingParam = Object.assign(state.commentLoadingParam, param);
    if (param.hideDelay) {
      await new Promise((resolve) => {
        setTimeout(() => {
          state.commentLoadingParam = {
            type: '',
            icon: '',
            content: '',
            show: false,
            hideDelay: true
          };
          resolve();
        }, 2000)
      });
    }
  },
  //交互登录检测
  checkLogin({commit, state}, cb) {
    return new Promise((resolve, reject) => {
      miniLogin({
        successCallBack: (res) => {
          commit("setClickFlag", true);
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            //已绑定
            state.hasBind = true;
            commit("setMobile", res.data.responseObject.responseData.mobile);
            commit("setCustomerId", res.data.responseObject.responsePk);
            resolve(true);
          } else {
            // 未绑定
            state.hasBind = false;

            if (state.navigateFlag) {
              state.navigateFlag = false;
              wx.navigateTo({
                url: '/pages/login/login',
                success: () => {
                  state.navigateFlag = true;
                }
              });
            }

            resolve(false);
          }
        },
        failCallback: (err) => {
          commit("setClickFlag", true);
          reject(err);
        }
      })
    })
  },
  // 初始化登录检测
  initCheckLogin({commit, state}, cb) {
    return new Promise((resolve, reject) => {
      miniLogin({
        successCallBack: (res) => {
          commit("setClickFlag", true);
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            //已绑定
            state.hasBind = true;
            commit("setMobile", res.data.responseObject.responseData.mobile);
            commit("setCustomerId", res.data.responseObject.responsePk);
            resolve(true);
          } else {
            // 未绑定
            state.hasBind = false;
            commit("setMobile", "");
            commit("setCustomerId", res.data.responseObject.responsePk);
            resolve(false);
          }
        },
        failCallback: (err) => {
          commit("setClickFlag", true);
          reject(err);
        }
      })
    })
  },
  // Toast
  async showToast({commit, state}, content) {
    state.toastTips = content;
    state.toastShow = true;
    await new Promise((resolve) => {
      setTimeout(() => {
        state.toastShow = false;
        setTimeout(() => {
          state.toastTips = "";
          resolve();
        }, 100)
      }, 2000);
    });
  },
  // 创建评论
  createJournalComment({dispatch, commit, state}, params) {
    dispatch("changeCommentLoading", {
      type: 'rotate',
      icon: '/static/image/loading.png',
      content: '发布中',
      show: true
    });
    const _data = Object.assign({
      customerType: 0,
      resourceType: 1,
      reviewType: 1,
      visitSiteId: api.getSiteId(),
    }, params);


    return createJournalComment(_data)
  },
  // 删除评论
  async deleteCommentItem({dispatch, commit, state}, params) {
    commit("setLoadingStatus", true);
    commit("setLoadingType", "loading");
    updateCommentStatus({
      reviewId: state.deleteItem,
      isValid: 0,
      delCustomerId: state.customerId
    }).then(data => {
      commit("setClickFlag", true);
      if (data.responseObject.responseStatus) {
        dispatch("getCommentList", {
          type: "getAll",
          getter: true
        });
        dispatch("getCommentList", {
          type: "getAuthor",
          getter: true
        });
        commit("setDeleteCommentItem", {
          flag: false,
          item: ""
        })
      } else {
        console.log("删除失败")
        commit("setLoadingStatus", false);
        commit("setLoadingType", "success");
      }
    }).catch(err => {
      commit("setClickFlag", true);
      commit("setLoadingStatus", false);
      commit("setLoadingType", "fail");
    });
  },
  // 更新浏览数/评论数
  async updateBrowseAndShareNum({dispatch, commit, state}, params) {
    const _data = Object.assign({
      diaryId: state.resourceId
    }, params);
    updateBrowseAndShareNum(_data).then(data => {
      if (data.responseObject.responseStatus) {
        if (params.shareNum) {
          commit("setShareMessage", {
            num: parseInt(state.shareMessage.num) + 1
          });

        }
      }
    });
  },
  getSystomInfo({commit, state}) {
    wx.getSystemInfo({
      success: function (res) {
        commit("setSystemInfo", res);
        // console.log(state.systemInfo)
      }
    })
  },
  // 设置康复日记的视频的数量；
  setVideoNum({dispatch, commit, rootState},param){
    rootState.videoNum = param;
  },
}
