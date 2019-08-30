const getters = {
  batchOnOff(state) {
    return state.batchOnOff;
  },
  pageIndex(state) {
    return state.pageIndex;
  },
  pageSize(state) {
    return state.pageSize;
  },
  dataList(state) {
    let orijinalList = JSON.parse(JSON.stringify(state.dataList));
    let resultList = [];
    for (let num = 0; num < orijinalList.length; num++) {
      let item = orijinalList[num];
      item.id = parseInt(item.id, 10);
      resultList.push(item);
    }
    return orijinalList;
  },
  triggerGetList(state) {
    return state.triggerGetList;
  },
  auditData(state) {
    let listData = state.auditData;
    let resultJson = {
      status: state.auditType
    };
    let consultationId = '';
    for (let num = 0; num < listData.length; num++) {
      let dataItem = listData[num];
      consultationId += dataItem.consultationId + ',';
    }
    let consultationIdResult = consultationId.substring(0, consultationId.length - 1);
    if (consultationIdResult.length > 0) {
      resultJson.consultationId = consultationIdResult;
    }
    return resultJson;
  },
  auditDataLen(state) {
    return state.auditData.length;
  },
  auditType(state) {
    return state.auditType;
  },
  selectOnOff(state) {
    return state.selectOnOff;
  },
  batchAuditOnOff(state) {
    return state.batchAuditOnOff;
  },
  sortType(state) {
    return state.sortType;
  },
  getListForm(state) {
    let resultJson = JSON.parse(JSON.stringify(state.getListForm));
    resultJson.pageNum = state.pageIndex;
    resultJson.pageSize = state.pageSize;
    resultJson.sortType = state.sortType;
    return resultJson;
  }
};
export default getters;
