const state = {
    tagArr: [],//筛选条件的列表
    itemsArr: [],//病历列表
    sexId: '',//性别id 20181214增加性别筛选项
    orderType: '0',//各项列表排序规则，默认更新时间由近及远
    sIdList: '',//筛选id列表，默认没有筛选（初步诊断）
    tNameList: '',//筛选id列表，默认没有筛选（标签）
    tIdList: '',//筛选id列表，默认没有筛选（归属）
    belongType: '',//点击归属个人
    searchKey: '',//搜索的关键词
    scrShowArr: [],//筛选条件的展示
    scrShowFlag: false,//筛选条件选中条件展示与否
    belongList: '',//归属选中的筛选列表
    belongBtn: false,//归属按钮的状态
    chooseTips: 0,//选择一个病历的归属病历提示 1-请选择一个病例！  2-请选择同一主管医生！
    allBtnFlag: false,//全选按钮选中标志
    teamNameList: [],//团队列表数组
    teamId: '',//选择好的团队id
    sTeamFlag: false,//选择团队列表的弹层显示开关
    teamSuccess: false,//团队转移成功
    teamSucInfo: [],//归属成功后提示信息
    alBelongFail: false,//团队转移失败标志
    infoList: [],//团队归属失败病历弹层列表信息
    noCListFlag: 4,//列表无数据组件显示控制，0：列表有数据，1：首页无数据（没有筛选和搜索）,2：筛选条件无数据，3：搜索结果无数据,4：默认不显示
    scrItemsFlag: false,//筛选条件列表是否展示
    pageIndex: 1,//分页
    pageSize: 10,//当前页多少条
    total: 0,//总条数
    loading: false,//病历列表全局loading状态
    scrLoading: false,//筛选条件接口loading状态
    teamFailPerson: false,//归属者不是当前团队的所有者
    bConBtn: false,//继续归属按钮是否可以继续归属
    editing: false,//选择归属的病历正在被编辑
    editingTxt: '',//归属的病历正在被编辑
    isTwo: false,//不能归属提示
    isTwoText: '',//不能归属提示话术
    noShowBelong: false,//默认不显示归属
    sureConBtn: false,//选择团队弹层确认按钮
    deleteBtn: false,//删除状态显示
    deleteId: '',//要删除的is
    caseEdit: false,//病例锁定
    forbidDelete: false,//不能删除,只有创建者才能删除
    passDelete: false,//通过
    ageMin: '',//年龄开始
    ageMax: '',//年龄结束
    notAgeFlag: false,//禁止编辑年龄
    createIdList: '',//筛选id列表，默认没有筛选（创建者）
    doctorIdList: '',//筛选id列表，默认没有筛选（主管医生）
    selectDoctorId:'',//选中的主管医生id处理
};

export default state;
