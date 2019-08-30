const state = {
  triggerGetList: 0, // 主动触发获取数据列表的变量
  batchOnOff: false, // 控制多选展示与否
  selectOnOff: false, // 代表用户是否选择了table数据
  pageIndex: 1, // 分页索引
  pageSize: 20, // 每页条数
  dataList: [], // table列表数据
  auditData: [], // 审核数据
  auditType: -1, // 审核类型1通过，2屏蔽
  batchAuditOnOff: false, // 标识是否要批量审核,
  getListForm: {}, // 获取数据列表的提交数据
  sortType: 3
};
export default state;
