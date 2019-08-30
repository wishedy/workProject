/**
 * 功能描述：
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2018/9/7
 */

'use strict';
const mutations = {
  setUserLoginName(state, value) {
    state.userLoginName = value;
  },
  setUserName(state, value) {
    state.userName = value;
  },
  setMenuList(state, value) {
    state.menuList = value;
  },
  setCurrentMergeRow(state, value) { // 当前合并Id
    state.currentMergeRow = Object.assign(state.currentMergeRow, value);
  },
  setCheckList(state, value) { // 检查
    state.checkList = value;
  },
  setMergeList(state, value) { // 当前合并的列表
    state.mergeList = value;
  },
  setMergePageIndex(state, value) { // 当前合并的页数
    state.mergePagIndex = value;
  },
  setCertImgShowActiveIndex(state, value) {
    state.certImgShowActiveIndex = value;
  },
  setMergeMode(state, value) {
    state.mergeMode = value;
  },
  setMergeType(state, value) {
    state.mergeType = value;
  },
  /*
    * 审核列表
    * */
  // 表单搜索参数设置
  setMemberAuditSearchData(state, value) {
    state.memberAuditSearchData = value;
  },
  /**
   * 厂商审核管理
   */
  setComponyAuditSearchData(state, value) {
    state.ComponyAuditSearchData = value;
  }

};

export default mutations;
