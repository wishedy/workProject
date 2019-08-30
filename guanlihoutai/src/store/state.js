/**
 * 功能描述：
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2018/9/7
 */

'use strict';

const state = {
  /**
   * 基本信息 登录后获得
   */
  userLoginName: '',
  userName: '',
  // 权限相关
  menuList: null,

  checkList: [], // 检查

  // 审核详情页数据
  memberAuditSearchData: {},

  // 厂商审核管理数据
  ComponyAuditSearchData: {},

  // 合并详情页数据
  memberMergeData: {
    tableData: [],
    isAdmin: false, // 具有管理员权限/对应处理人
    currentPage: 1, // 第几页
    pageSize: 10 // 每页几条
  },
  memberMergeIndex: null, // 当前合并的索引
  currentMergeRow: {}, // 当前合并帐户行
  mergeList: [], // 当前合并的列表
  mergePageIndex: 0, // 当前合并的页数
  certImgShowActiveIndex: 0, // 当前页上slider选中图片的索引
  mergeMode: null,

  requests: [] // 请求队列

};

export default state;
