const actions = {
  startBatchControl: ({state, commit, rootState}, str) => {
    commit('startBatchControl');
  },
  endBatchControl: ({state, commit, rootState}, str) => {
    commit('endBatchControl');
  },
  changePageIndex: ({state, commit, rootState}, num) => {
    commit('changePageIndex', num);
  },
  changePageSize: ({state, commit, rootState}, num) => {
    commit('changePageSize', num);
  },
  saveDataList: ({state, commit, rootState}, data) => {
    commit('saveDataList', data);
  },
  changeBatchAudit: ({state, commit, rootState}, data) => {
    commit('changeBatchAudit', data);
  },
  changeOneselfAudit: ({state, commit, rootState}, data) => {
    commit('changeOneselfAudit', data);
  },
  batchAudit: ({state, commit, rootState}, type) => {
    commit('batchAudit', type);
  },
  changeSelectOnOff: ({state, commit, rootState}, onOff) => {
    commit('changeSelectOnOff', onOff);
  },
  resetAuditType: ({state, commit, rootState}) => {
    commit('resetAuditType');
  },
  resetAudit: ({state, commit, rootState}) => {
    commit('resetAudit');
  },
  changeSortType: ({state, commit, rootState}, type) => {
    commit('changeSortType', type);
  },
  changeTriggerGetList: ({state, commit, rootState}) => {
    commit('changeTriggerGetList');
  },
  saveGetListForm: ({state, commit, rootState}, data) => {
    commit('saveGetListForm', data);
  }
};
export default actions;
