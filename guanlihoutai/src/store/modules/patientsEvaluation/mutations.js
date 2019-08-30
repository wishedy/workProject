const mutations = {
  startBatchControl(state) {
    state.batchOnOff = true;
  },
  endBatchControl(state) {
    state.batchOnOff = false;
  },
  changePageIndex(state, num) {
    state.pageIndex = num;
  },
  changePageSize(state, num) {
    state.pageSize = num;
  },
  saveDataList(state, data) {
    state.dataList = data;
  },
  changeBatchAudit(state, config) {
    state.auditData = config.auditData;
  },
  batchAudit(state, config) {
    state.auditType = config.type;
    state.batchAuditOnOff = true;
  },
  closeBatchAudit(state) {
    state.batchAuditOnOff = false;
  },
  changeOneselfAudit(state, config) {
    state.batchAuditOnOff = false;
    state.auditData = [config.auditData];
    state.auditType = config.auditType;
  },
  changeSelectOnOff(state, onOff) {
    state.selectOnOff = onOff;
  },
  resetAudit(state) {
    state.batchOnOff = false;
    state.dataList = [];// table列表数据
    state.auditData = [];// 审核数据
    state.auditType = -1;// 审核类型1通过，2屏蔽
    state.batchAuditOnOff = false;// 标识是否要批量审核
    // state.pageIndex!=1?state.pageIndex = 1:"";//分页索引
    // state.pageSize!= 20?state.pageSize= 20:'';//每页条数
  },
  changeTriggerGetList(state) {
    state.triggerGetList++;
  },
  changeSortType(state, type) {
    state.sortType = type;
  },
  resetAuditType(state) {
    state.auditType = -1;
  },
  saveGetListForm(state, data) {
    state.getListForm = data;
  }
};
export default mutations;
