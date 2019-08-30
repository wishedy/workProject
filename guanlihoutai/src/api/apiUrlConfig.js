// import { get } from "http";

/**
 * 功能描述：接口路径配置文件
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by Liuyutao on 2018/9/5
 */

export const API_HOST = '//gateway.allinmd.cn';

export default {
  // 工具类
  getIp: {// 获取ip
    type: 'get',
    url: API_HOST + '/services/getIp'
  },
  // 常量类
  imgServer_img05: {
    url: 'http://img05.allinmd.cn/'
  },
  // // 获取 token
  // getZuulToken: {
  //   type: 'get',
  //   url: API_HOST + '/services/getZuulToken'
  // },
  // 添加手动推送 - 获取推送场景Select list
  getSelectList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cmsAdvertisement/getAdTypeList'
  },

  // 添加手动推送 - 提交推送
  manualPushCreate: {
    type: 'post',
    url: API_HOST + '/base-message-platform/crm/push/config/create'
  },

  // 添加手动推送 - 用户分组 - 获取每个分组集合
  getManualUserGroups: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/push/group/info/get'
  },

  // 添加手动推送 - 计算选择完标签后的用户数量
  mulTagUserCount: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/push/customer/group/getCount'
  },

  // 添加手动推送 - 获取用户粉丝数目
  getFansCount: {
    type: 'get',
    url: API_HOST + '/services/customer/follow/fans/getCount'
  },

  // 添加手动推送 - 获取分组
  getCustomerGroupList: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/specPush/getCustomerGroupList'
  },

  // 推送数据 - 获取推送数据查询list
  getStatDailyList: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/pushStat/getStatDailyList'
  },

  // 手动推送列表 - 获取列表
  getManageList: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/push/getManageList'
  },

  // 手动推送列表 - 导出
  exportManageList: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/push/exportManageList'
  },

  // 导入模板 - test
  pushUpload: {
    type: 'post',
    url: API_HOST + '/base-message-platform/crm/push/upload'
  },

  // 手动推送管理 - 单条推送/取消推送
  updatePushStatus: {
    type: 'put',
    url: API_HOST + '/base-message-platform/crm/push/updatePushStatus'
  },

  // 推送设置 - 获取推送
  getPushConfigInfo: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/configPush/getPushConfigInfo'
  },

  // 推送设置 - 设置推送
  pushSetting: {
    type: 'post',
    url: API_HOST + '/base-message-platform/crm/configPush/createPushConfig'
  },

  // 推送数据 - 导出
  exportStatDailyList: {
    type: 'get',
    url: API_HOST + '/base-message-platform/crm/pushStat/exportStatDailyList'
  },

  loginAPI: {type: 'post', url: API_HOST + '/services/tb/web/sys/user/getAllLoginInfo'},
  exitAPI: {type: 'post', url: API_HOST + '/services/tb/web/sys/user/logout'},
  //  厂商审核列表
  companyAuditList: {type: 'get', url: API_HOST + '/base-customer-platform/customer/audit/v3/getMapList'},
  //  厂商详情页面
  getCompanyAuditDetail: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/auth/v3/getManufacturerCustomerAuth'
  },
  //  厂商详情更改页面
  getCompanyAuditChangeDetail: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/auth/revise/v3/getCustomerAuthRevise'
  },
  //  厂商详情添加企业接口
  addCompany: {type: 'post', url: API_HOST + '/_gateway_api_medplus_services/services/med/company/create'},
  //  厂商详情添加品牌接口
  addBrand: {type: 'post', url: API_HOST + '/_gateway_api_medplus_services/services/med/brand/create'},
  //  厂商根据企业名称
  getCompany: {type: 'get', url: API_HOST + '/_gateway_api_medplus_services/services/med/company/getList'},
  //  厂商品牌查找相关信息
  getBrandName: {type: 'get', url: API_HOST + '/_gateway_api_medplus_services/services/med/brand/getList'},

  //  审核列表
  memberAuditList: {type: 'get', url: API_HOST + '/base-customer-platform/customer/audit/v3/getMapList'},
  //  获取认证审核基本信息
  getMemberAuditDetail: {type: 'get', url: API_HOST + '/base-customer-platform/customer/auth/v3/getCustomerAuth'},
  //  审核-信息变更
  getCustomerAuthRevise: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/auth/revise/v3/getCustomerAuthRevise'
  },
  //  审核信息变更 - 获取 职称下拉框
  getMedicalTitle: {type: 'get', url: API_HOST + '/services/comm/data/medicalTitle/v3/getMapList'},
  //  v1、v2审核通过/拒绝
  updateAuthState: {type: 'post', url: API_HOST + '/base-customer-platform/customer/auth/v3/updateAuthState'},
  //  审核变更_v1、v2审核通过/拒绝
  updateAudit: {type: 'post', url: API_HOST + '/base-customer-platform/customer/audit/v3/updateAudit'},

  // 认证审核_医生头像上传图片
  memberAuditDetailLogoUrl: {type: 'post', url: API_HOST + '/image-api/comm/data/logo/url/v1/create'},
  // 认证审核_四证上传图片 (非变更)
  memberAuditDetailFourCardImgUpload: {type: 'post', url: API_HOST + '/image-api/customer/auth/attachment/v1/create'},

  // 图片上传  审核变更上传
  memberAuditDetailCardImgUpload: {type: 'post', url: API_HOST + '/image-api/case/attachment/v1/handleImage'},
  // 认证审核_变更图片替换图片
  memberAuditDetailFourCardImgChange: {
    type: 'put',
    url: API_HOST + '/base-customer-platform/customer/attachment/revise/v1/update'
  },

  /*
  * 会员合并相关接口
  * */
  //  合并列表
  getMergeAccountList: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/merge/v3/getMapList'
  },

  //  合并详情
  getMergeAccountDetail: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/merge/v3/getMapById'
  },

  updateMergeState: {
    type: 'put',
    url: API_HOST + '/base-customer-platform/customer/merge/v3/updateMergeState'
  },

  // 获取要合并的优惠券列表
  getMergeCouponList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/getCustomerNewAndOldCouponById'
  },

  // 获取要合并的课程列表
  getMergeCourseList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/course/customer/getMergeCourseList'
  },

  // 获取新老钱包
  getNewAndOldBalance: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/getNewAndOldBalance'
  },
  /*
  * 合并相关接口end
  * */
  // 认证相关信息维护-获取认证证件页提示
  getCertTipInfo: {type: 'get', url: API_HOST + '/base-customer-platform/comm/data/prompt/v3/getMapList'},
  // 认证相关信息维护-更新认证证件页提示
  updateCertTipInfo: {type: 'put', url: API_HOST + '/base-customer-platform/comm/data/prompt/v3/update/'},
  // 认证相关信息维护-获取认证证件展示数据
  getCertSortInfo: {type: 'get', url: API_HOST + '/services/comm/data/role/config/v3/getMapList'},
  updateCertSortInfo: {type: 'put', url: API_HOST + '/services/comm/data/role/config/v3/update'},
  // 企业认证相关信息维护-修改认证证件展示数据
  updateCompanyCertInfo: {type: 'put', url: API_HOST + '/services/comm/data/role/config/v3/update'},
  // 获取认证拒绝原因
  getRefuseMapList: {type: 'get', url: API_HOST + '/base-customer-platform/comm/data/prompt/v3/getRefuseMapList'},
  // 获取视频笔记
  getVideoNodesList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/video/node/getAllNodes'},
  // 获取视频笔记详情
  getVideoNodesDetail: {type: 'get', url: API_HOST + '/base-resource-platform/cms/video/node/getNodeDetail'},
  // 点击进入审核
  createUserNode: {type: 'post', url: API_HOST + '/base-resource-platform/cms/video/node/createUserNode'},
  // 退出审核
  finishVerify: {type: 'post', url: API_HOST + '/base-resource-platform/cms/video/node/finishVerify'},
  // 获取未完成审核笔记的数量
  getUserNodeNum: {type: 'get', url: API_HOST + '/base-resource-platform/cms/video/node/getUserNodeNum'},
  // 锦囊上传图片
  attachment: {type: 'post', url: API_HOST + '/image-api/case/attachment/v1/handleImage'},
  // 锦囊保存图片
  saveAttachment: {type: 'post', url: API_HOST + '/base-resource-platform/cms/brochure/attachment/v4/create'},
  // 审核通过/拒绝笔记
  updateNodeState: {type: 'put', url: API_HOST + '/base-resource-platform/cms/video/node/update'},
  // 锦囊删除图片
  deleteAttachment: {type: 'put', url: API_HOST + '/base-resource-platform/cms/brochure/attachment/v4/update'},
  // 获取七牛token
  getQiniuToken: {type: 'get', url: API_HOST + '/services/qiniu/storage/v4/getToken'},
  // 保存视频: PC_CALL  + 'qiniu/storage/saveVideoInfo/',
  videoInfo: {type: 'post', url: API_HOST + '/services/qiniu/storage/v4/createVideoInfo'},

  // ****** 3.0
  // 发布专业-固定栏
  specialityPublish: {type: 'post', url: API_HOST + '/base-resource-platform/comm/data/navigation/v4/batchUpdate'},
  // 首页背景图-获取
  indexBackgroundGet: {type: 'get', url: API_HOST + '/base-resource-platform/cms/background/getDataByType'},
  // 首页背景图-新增/修改/删除
  indexBackgroundSave: {type: 'post', url: API_HOST + '/base-resource-platform/cms/background/saveOrUpdate'},
  // 获取专业-固定栏列表
  specialityList: {type: 'get', url: API_HOST + '/base-resource-platform/comm/data/navigation/v4/getFixedPositionList'},
  // 上传图片
  uploadImg: {type: 'post', url: API_HOST + '/image-api/case/attachment/v1/handleImage'},
  // 获取栏目列表
  indexColumnList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/v4/getHomePageConfigList'},
  // 发布栏目
  publishColumn: {type: 'post', url: API_HOST + '/base-resource-platform/cms/column/config/v4/saveHomePageConfig'},
  // 搜索词列表  热词/运营词
  searchDictList: {type: 'get', url: API_HOST + '/base-customer-platform/cms/search/hotkey/getPageListV3'},
  // 获取单搜索词信息
  dictDetail: {type: 'get', url: API_HOST + '/base-customer-platform/cms/search/hotkey/getById'},
  // 编辑搜索词
  updateDict: {type: 'put', url: API_HOST + '/base-customer-platform/cms/search/hotkey/update'},
  // 新增搜索词
  createDict: {type: 'post', url: API_HOST + '/base-customer-platform/cms/search/hotkey/create'},
  // 校验搜索词是否存在
  existDict: {type: 'get', url: API_HOST + '/base-customer-platform/cms/search/hotkey/exist'},
  // 纠正词搜索列表 不传为列表，传值为搜索
  correctSearchList: {type: 'get', url: API_HOST + '/base-resource-platform/searchMistakeWords/queryByCondition'},
  // 删除搜索-纠正词
  deleteDictCorrect: {type: 'post', url: API_HOST + '/base-resource-platform/searchMistakeWords/del'},
  // 获取单个纠正词信息
  correctDetail: {type: 'get', url: API_HOST + '/base-resource-platform/searchMistakeWords/getById'},
  // 保存及修正纠正词
  updateCorrectDict: {type: 'post', url: API_HOST + '/base-resource-platform/searchMistakeWords/saveOrUpdate'},
  // 复合词列表及查询
  complexList: {type: 'get', url: API_HOST + '/base-resource-platform/searchAssociateWords/queryByCondition'},
  // 复合搜索词-添加或修改
  updateComplexDict: {type: 'post', url: API_HOST + '/base-resource-platform/searchAssociateWords/saveOrUpdate'},
  // 复合词-删除
  delComplexDict: {type: 'post', url: API_HOST + '/base-resource-platform/searchAssociateWords/del'},
  // 获取单条复合词
  complexDetail: {type: 'get', url: API_HOST + '/base-resource-platform/searchAssociateWords/getById'},

  // 直播聚合列表
  liveList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getLiveHomeList'},
  // 单条直播详情
  liveDetail: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getLiveHomeById'},

  // 发布/编辑 及删除直播 同一个接口
  publishLive: {type: 'post', url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/saveLiveHome'},
  // 根据用户ID获取用户信息
  getCustomerById: {type: 'get', url: API_HOST + '/base-customer-platform/customer/auth/v2/getMapById'},

  // 锦囊后台部分
  // 获取锦囊列表
  kitsListUrl: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/v4/getPageList'},
  // 保存锦囊
  saveBrochure: {type: 'post', url: API_HOST + '/base-resource-platform/cms/brochure/v4/saveBrochure'},
  // 专科列表
  professList: {type: 'get', url: API_HOST + '/services/comm/data/tag/v2/getMapList'},
  // 锦囊召出词保存
  keyWordSave: {type: 'post', url: API_HOST + '/base-resource-platform/searchBrochureWords/saveOrUpdate'},
  // 锦囊召出词获取
  keyWordGet: {type: 'get', url: API_HOST + '/base-resource-platform/searchBrochureWords/getById'},

  // 锦囊详情页（锦囊详情）~~~获取锦囊信息(编辑锦囊时用)
  kitsInfo: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/v4/getBrochure'},
  // 锦囊详情页（问题列表）
  kitsQueList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/question/v4/getPageList'},
  // 获取问题信息(编辑问题时用)——————问题详情页（问题详情公用）
  getQueInfo: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/question/v4/getBrochureQuestion'},
  // 保存问题
  saveQuestion: {type: 'post', url: API_HOST + '/base-resource-platform/cms/brochure/question/v4/saveBrochureQuestion'},

  // 问题详情页（列表）
  getAnswerList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/answer/v4/getAnswerList'},
  // 保存回复
  saveAnswer: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/brochure/answer/v4/saveOrUpdateQuestionAnswer'
  },
  // 检索锚点和资源名称
  getResourceInfo: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/answer/v4/getResourceInfo'},
  // 获取回复的相关信息
  getAnswerById: {type: 'get', url: API_HOST + '/base-resource-platform/cms/brochure/answer/v4/getAnswerById'},

  // 栏目后台部分
  // 新增/编辑栏目发布
  saveColumn: {type: 'post', url: API_HOST + '/base-resource-platform/cms/column/config/v4/saveColumn'},
  // 栏目列表
  getColumnTableList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/v4/getPageList'},
  // 栏目上架/下架
  updateColumnValid: {type: 'put', url: API_HOST + '/base-resource-platform/cms/column/config/v4/update'},
  // 获取栏目详细数据
  getColumnDetailData: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/v4/getColumnDataById'},
  // 获取活动列表
  getActivityList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v5/getConfigResAndThemeList'
  },
  // 获取活动分组
  getActivityGroupList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/group/getList'
  },
  // 获取活动详情
  getActivityDetail: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getActivityConfigById'
  },
  // 保存活动详情
  saveActivity: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/saveActivityConfig'
  },

  // 新增/编辑课程型栏目发布
  saveColumnCourse: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/course/v4/saveColumnCourse'
  },
  // 课程列表
  getCourseTableList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/column/config/course/v4/getPageList'},
  // 课程上架/下架
  updateCourseValid: {type: 'put', url: API_HOST + '/base-resource-platform/cms/column/config/course/v4/update'},
  // 获取课程详细数据
  getCourseDetailData: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/course/v4/getColumnCourseDataById'
  },
  // 新增/编辑课程型栏目-视频选集发布
  saveCourseTypeVideo: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/saveCourseVideo'
  },
  // 选集列表
  getCourseTypeVideoTableList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getPageList'
  },
  // 获取选集详细数据
  getCourseTypeVideoDetailData: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getCourseVideoById'
  },

  /*
   * 视频栏目管理
   */
  // 栏目表格列表
  getTableListVideoTypeColumn: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getPageList'
  },
  // 视频聚合栏目-编辑获取数据
  getColumnVideoByIdVideoTypeColumn: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/getColumnVideoById'
  },
  // 根据视频id获取视频名称/用户
  getVideoContentByVideoIdVideoTypeColumn: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/video/v4/getVideoContentByVideoId'
  },
  // 上下架操作
  saveColumnVideoVideoTypeColumn: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/v4/saveColumnVideo'
  },

  /*
   * 骨人云
   */
  // 获取表格列表
  boneCloudGetMapList: {type: 'get', url: API_HOST + '/base-social-platform/customer/movement/getMapList'},
  // 拉取评论数据
  boneCloudGetReviewData: {type: 'get', url: API_HOST + '/base-customer-platform/customer/review/v3/getSocialMapList'},
  // 获取点赞数据
  boneCloudGetLikeData: {type: 'get', url: API_HOST + '/base-social-platform/customer/prefer/getPreferMapList'},
  // 修改上架下架状态
  boneCloudYunYunChangeState: {type: 'put', url: API_HOST + '/base-social-platform/customer/movement/update'},
  // 评论上下架操作
  boneCloudUpdataReviewState: {type: 'put', url: API_HOST + '/base-customer-platform/customer/review/update'},

  /*
  * 骨人云活动管理
  * */
  // 获取表格列表
  boneCloudBannerGetMapList: {
    type: 'get',
    url: API_HOST + '/base-social-platform/customer/movement/activity/getMovementActivityList'
  },
  // 保存骨人云活动
  boneCloudSaveActivity: {type: 'put', url: API_HOST + '/base-social-platform/customer/movement/activity/save'},
  // 获取点赞数据
  boneCloudUploadPic: {type: 'post', url: API_HOST + '/base_image_platform/case/attachment/v1/handleImage'},
  // 修改上架下架状态
  boneCloudSavePic: {
    type: 'post',
    url: API_HOST + '/base-social-platform/customer/movement/activity/attachment/create'
  },
  // 获取活动详情
  boneCloudGetMovementDetail: {
    type: 'put',
    url: API_HOST + '/base-social-platform/customer/movement/activity/getMovementById'
  },

  /* 患教手册管理 */
  // 请求患教手册列表
  getManualList: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getManualPageList'},
  // 获取基础信息
  manualBaseInfo: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getMapById'},
  // 请求选中的专业和疾病
  getLabelUrl: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getLabelMessageList'},
  // 请求添加的内容
  getConUrl: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getContentList'},
  // 请求专业全部
  getLabelList: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getLabelList'},
  // 全部专业列表修改
  getLabelListNew: {type: 'get', url: API_HOST + '/comm/data/label/v1/getPageList'},
  // 选择内容列表
  getEducationList: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getEducationList'},
  // 提交数据内容
  submitInfo: {type: 'post', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/saveOrUpdateManual'},
  // 患教中心上传图片
  uploadImgPat: {type: 'post', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/upload'},
  // 用户患教手册提交数据
  userSubmitInfo: {type: 'post', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/saveUserManual'},
  // 用户患教手册列表获取
  userManualList: {type: 'get', url: API_HOST + '/base_patienteducation_platform/web/cms/manual/getUserManualPageList'},

  // 获取省市区
  getRegion: {type: 'get', url: API_HOST + '/services/comm/data/region/v3/getMapList/'},
  // 获取医院等级
  getHospitalLevel: {type: 'get', url: API_HOST + '/services/comm/data/hospital/level/v3/getMapList'},
  // 添加医院
  submitHospital: {type: 'post', url: API_HOST + '/services/comm/data/hospital/v3/create'},
  // 添加资格证书
  uploadQualification: {type: 'put', url: API_HOST + '/services/comm/data/hospital/attachment/v3/uplodAttachment'},
  //  联想医院
  getHospital: {type: 'get', url: API_HOST + '/services/comm/data/hospital/v2/getMapList'},

  /*
  * 广告管理
  * */
  // 获取广告类型接口（筛选条件）
  getAdTypeList: {type: 'get', url: API_HOST + '/base-resource-platform/cmsAdvertisement/getAdTypeList'},
  // 获取列表信息（广告管理）
  getAdList: {type: 'get', url: API_HOST + '/base-resource-platform/cmsAdvertisement/getAdList'},
  // 获取列表信息（广告物料）
  getAdMaterialList: {type: 'get', url: API_HOST + '/base-resource-platform/cmsAdvertisement/getAdMaterialList'},
  // 根据广告类型和资源ID获取资源配图&资源标题（广告物料）
  getImgByResIdAndAdType: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cmsAdvertisement/getImgByResIdAndAdType'
  },
  // 新后台新广告&广告物料新增/编辑接口保存（广告管理）
  cmsAdvertisementSave: {type: 'post', url: API_HOST + '/base-resource-platform/cmsAdvertisement/saveOrUpdate'},
  // 新后台新广告新增/编辑接口保存（广告物料）
  saveOrUpdateMaterial: {type: 'post', url: API_HOST + '/base-resource-platform/cmsAdvertisement/saveOrUpdateMaterial'},
  // 新后台终端页广告管理获取定向标签
  getProfessionalTags: {type: 'post', url: API_HOST + '/base-resource-platform/commDataProperty/getProfessionalTags'},

  /**
   * 营销->优惠券
   */
  // 营销-优惠券-优惠券批次列表页
  getCouponBatchList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/getPageList'
    // url:'/base-shopping-platform/bg/coupon/getPageList',
    // url: '/mock/3_7/getCouponBatchList',// mock 联调阶段删除
    // url:'
  }, // 营销-优惠券-优惠券券号列表页
  getPageCouponDetailList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/getPageCouponDetailList'
    // url:'/mock/3_7/getCouponVoucherList',// mock 联调阶段删除
  }, // 营销-优惠券-创建优惠券（通用优惠券/商品优惠券共用一个接口）
  createCoupon: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/coupon/createCoupon'
    // url:'/base-shopping-platform/bg/coupon/createCoupon'
  }, // 营销-优惠券-批次明细页面查询接口
  getCouponById: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/getCouponById'
  }, // 营销-优惠券-批次状态修改接口
  updateBatchState: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/coupon/updateBatchState'
  }, // 营销-优惠券-优惠券名称修改接口
  updateCouponNameById: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/coupon/updateCouponNameById'
  }, // 营销-优惠券-优惠券券号导出
  exportVoucherDetailList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/exportDetailList'
  }, // 营销-优惠券-优惠券后台发放
  publishCoupon: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/coupon/publishCoupon'
  }, // 营销-优惠券-优惠券后台发放记录
  getCouponPublishList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/coupon/getCouponPublishList'
  },

  /**
   * 交易->订单相关
   */
  // 交易-订单-商品订单列表页
  getShopOrderList: {
    type: 'get',
    // url: '/bgShoppingOrder/getShopOrderList'
    // url: '/mock/3_7/getShopOrderList',// mock 联调阶段删除
    url: API_HOST + '/base-shopping-platform/bgShoppingOrder/getShopOrderList'
  },
  // 导出订单
  exportShopOrderList: {
    type: 'get',
    // url:'http://10.0.4.224:18080/base-shopping-platform/shoppingOrder/exportShopOrderList'
    // url: '//msa.allinmd.cn:16001/base-shopping-platform/bgShoppingOrder/exportShopOrderList'
    url: API_HOST + '/base-shopping-platform/bgShoppingOrder/exportShopOrderList'
  }, // 获取订单详情
  getShopOrderDetailById: {
    type: 'get',
    // url: '/bg/shopping/order/getShopOrderDetailById'
    url: API_HOST + '/base-shopping-platform/bg/shopping/order/getShopOrderDetailById'
  }, // 申请退款接口
  createOrderReturnApply: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/shopping/order/return/apply/createOrderReturnApply'
  }, // 开通服务
  accessCourseRight: {
    type: 'post',
    // url: '/bgShoppingOrder/accessCourseRight' // 本地接口
    url: API_HOST + '/base-shopping-platform/bgShoppingOrder/accessCourseRight' //
  },
  // 充值列表
  getOrderList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/charge/order/getList'
  },
  // 充值总数
  getStatistics: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/charge/order/getStatistics'
  },
  // 充值列表导出
  orderExportList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/charge/order/exportList'
  },
  // 充值订单详情页
  getOrderDetail: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/charge/order/getDetail'
  },
  // 唯币流水
  getFlowDetailList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/wallet/flow/getFlowDetailList'
  },
  // 唯币流水导出列表
  exportWalletMoneyList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/wallet/flow/exportWalletFlowData'
  },
  // 用户账户管理列表
  getWalletDetailList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/getWalletDetailList'
  },
  // 用户账户管理余额统计
  walletStatistics: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/walletStatistics'
  },
  // 用户账户管理冻结/恢复
  accountFreeze: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/wallet/accountFreeze'
  },
  // 用户账户管理导出余额列表
  exportWalletDetail: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/exportWalletDetail'
  },
  /*
  *   运营配置--产品锚点
  * */
  // 获取新后台锚点资源列表/详情页搜索视频也用这个接口
  getVideoList: {type: 'get', url: API_HOST + '/base-resource-platform/cms/video/node/getVideoList'},
  // 详情页保存锚点修改信息
  getVideoListSave: {type: 'post', url: API_HOST + '/base-resource-platform/cms/video/node/save'},
  // 根据产品和品牌查询产品列表
  getProductMapList: {type: 'get', url: API_HOST + '/medplus-resource-platform/med/product/getProductMapList'},

  /*
   * ASIA用户后台
   * */
  getAsiaTableList: {type: 'get', url: API_HOST + '/pay/manager/getMemberList'},
  asiaSendMail: {type: 'post', url: API_HOST + '/pay/manager/sendEmail'},
  asiaEditMemberInfo: {type: 'post', url: API_HOST + '/pay/manager/updateMember'},
  asiaAddMemberInfo: {type: 'post', url: API_HOST + '/pay/manager/addMember'},

  /*
  * 付费课程专栏
  * */
  // 获取课程列表
  getCoursesList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/course/getPaymentColumnList'
  },
  // 获取付费课程详情
  getCourseDetail: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/course/getPaymentColumnDetailById'
  },
  // 新增或更新课程详情
  addOrUpdatePaymentColumn: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/college/course/addOrUpdatePaymentColumn'
    // url: '/base-resource-platform/college/course/addOrUpdatePaymentColumn'
  },
  /* 更新课程状态 */
  updateCourseState: {
    type: 'put',
    url: API_HOST + '/base-resource-platform/college/course/updatePaymentSorted'
  },
  // 获取课程内容列表
  getCourseContentList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/course/resource/getContentListByCourseId'
  },
  // 更新课程内容状态
  updateCourseContentState: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/college/course/resource/addOrUpdateContentInfo'
    // url:'/base-resource-platform/college/course/resource/addOrUpdateContentInfo'
  },
  // 搜索讲师列表
  searchTeacherList: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/auth/getCustomerList'
  },
  // 搜索内容列表
  searchContentList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/course/resource/getAddContentList'
  },

  // 保存付费课程图片基本内容
  addPaymentAttachment: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/college/course/attachment/addPaymentAttachment'
  },
  // 保存付费课程图片基本内容
  deletePaymentAttachment: {
    type: 'put',
    url: API_HOST + '/base-resource-platform/college/course/attachment/deletePaymentAttachment'
  },
  // 学院频道相关接口
  // 上传图片到OSS
  generalOSS: {
    type: 'post',
    url: API_HOST + '/image-api/oss/image/general/handleImage'
  },
  // 学院频道页-获取添加课程专栏列表
  getStayAddThemeCourseList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/theme/getStayAddThemeCourseList'
  },
  // 学院频道页-更新(添加、修改)学院信息
  addOrUpdateTheme: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/college/theme/addOrUpdateTheme'
  },
  // 学院频道页-获取学院课程列表
  getThemeCourseList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/college/theme/getThemeCourseList'
  },
  // 学院频道页-删除学院课程列表
  deleteThemeById: {
    type: 'put',
    url: API_HOST + '/base-resource-platform/college/theme/deleteThemeById'
  },
  // 学院频道end

  //  兑换码相关接口
  // 兑换码创建/编辑
  createRedeemCode: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/redeemCode/createRedeemCode'
  },
  // 兑换码码号冻结/解冻
  updateRedeemCodeState: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/redeemCodeDetail/updateRedeemCodeState'
  },
  // 兑换码码号列表
  getRedeemCodeItemList: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/redeemCodeDetail/getRedeemCodeItemList'
  },
  // 兑换码批次导出卡号/导出全部信息
  exportRedeemDate: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/redeemCode/exportRedeemDate'
  },
  // 兑换码批次冻结/解冻
  frozenOrThaw: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/redeemCodeDetail/frozenOrThaw'
  },
  // 兑换码批次列表
  getRedeemCodeList: {
    type: 'GET',
    url: API_HOST + '/base-shopping-platform/bg/redeemCode/getRedeemCodeList'
  },
  // 兑换码批次是否有未使用码号
  checkHaveNoUse: {
    type: 'GET',
    url: API_HOST + '/base-shopping-platform/bg/redeemCodeDetail/checkHaveNoUse'
  },
  // 兑换码批次详情
  getRedeemCodeById: {
    type: 'GET',
    url: API_HOST + '/base-shopping-platform/bg/redeemCode/getRedeemCodeById'
  },
  //  兑换码相关接口end
  //  厂商关联产品列表页
  getCmsResourceCategoryList: {
    type: 'GET',
    url: API_HOST + '/base-resource-platform/category/getCmsResourceCategoryList'
  },
  //   厂商关联产品详情列表
  getRelateProductList: {
    type: 'GET',
    url: API_HOST + '/base-resource-platform/category/getRelateProductList'
  },
  //   厂商关联内容类型接口
  getResourceTypeEnumList: {
    type: 'GET',
    url: API_HOST + '/base-resource-platform/category/getResourceTypeEnumList'
  },
  // 新大一账号管理
  // 账号管理列表
  getUserList: {
    type: 'GET',
    url: API_HOST + '/region-manager-platform/server/user/getUserList'
  },
  // 账号管理--添加账号
  addUser: {
    type: 'post',
    url: API_HOST + '/region-manager-platform/server/user/addUser'
    // url: '/region-manager-platform-32/server/user/addUser'
  },

  // 新大一账号管理end
  //  预约挂号
  // 获取专业信息
  getDeptList: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/chongqing/register/getHospitalDeptList'
  },
  //  获取列表信息
  registerList: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/customer/register/list'
  },
  //  预约挂号end

  // crm 智能推荐管理
  // 2019-07-08
  // crm智能推荐管理医生列表
  getDoctorList: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/recommend/customer/getCustomerList'
  },
  // crm查看已有标签
  getMapListByLevel: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/comm/data/part/v1/getMapListByLevel'
  },
  // cmr搜索医生
  getDoctorSreachData: {
    type: 'get',
    url: API_HOST + '/base-customer-platform/customer/auth/recommend/getCustomerList'
  },
  // crm修改医生信息（标签，评分，状态）
  updateDoctor: {
    type: 'post',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/recommend/customer/update'
  },
  // crm添加医生信息
  addDoctor: {
    type: 'post',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/recommend/customer/create'
  },
  // crm删除医生信息
  delDoctor: {
    type: 'post',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/recommend/customer/delete'
  },

  // 自动推送与自动召回列表
  // 自动推送
  autoPushList: {
    type: 'get',
    url: API_HOST + '/message-api/customerPushBaseInfo/getList'
  },
  // 自动召回
  autoReactivateList: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/customer/register/list'
  },
  // 更新推送状态
  updatePushMessageState: {
    type: 'post',
    url: API_HOST + '/message-api/customerPushBaseInfo/update'
  },
  // 编辑推送内容
  updatePushMessageTemplate: {
    type: 'post',
    url: API_HOST + '/message-api/customerPushMsgTemplate/updateBatch'
  },

  //  补单 与 调整唯币
  // 补单较验
  orderValidation: {
    type: 'get',
    url: API_HOST + '/base-shopping-platform/bg/wallet/charge/order/orderValidation'
    // url: 'http://10.0.1.89:18080/bg/wallet/charge/order/orderValidation'
  },
  // 充值
  weiMoneyRecharge: {
    type: 'post',
    url: API_HOST + '/base-shopping-platform/bg/wallet/updateRecharge'
  },
  // 重庆小程序在线科室详情
  deptDetail: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/dept/getDepartmentDetail'
  },
  // 重庆小程序HIS科室选择
  deptSelect: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/chongqing/register/getDeptList'
  },
  // 重庆小程序在线科室详情保存
  deptIntroduceSave: {
    type: 'post',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/dept/saveDept'
  },
  // 重庆小程序在线预约挂号科室信息
  getChongqingSectionList: {
    type: 'get',
    // url: API_HOST + '/_gateway_api_allinmed_services/services/chongqing/register/getHospitalDeptList'
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/dept/getDepartmentList'
  },

  // 重庆小程序在线预约挂号科室信息列表修改状态
  chongqingupdcateDeptState: {
    type: 'post',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/dept/updateDeptState'
  },

  // 重庆小程序在线预约挂号科室选择医生
  getchongqingDoctorList: {
    type: 'get',
    url: API_HOST + '/_gateway_api_allinmed_services/services/tocure/dept/getDoctorList'
  },
  // 3.10 品牌专区
  // 列表
  getBrandList: {
    type: 'get',
    url: API_HOST + '/medplus-resource-platform/med/brand/getWeiPinList'
  },
  // 编辑
  updateBrandList: {
    type: 'post',
    url: API_HOST + '/medplus-resource-platform/med/brand/updateBrand'
  },
  // 3.10 唯品会栏目
  // 列表
  getResourceList: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/getWeiPinResouceList'
  },
  // 查询资源
  getResource: {
    type: 'get',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/getResouce'
  },
  // 新增
  addResource: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/addWeiPinResource'
  },
  // 编辑
  editResource: {
    type: 'post',
    url: API_HOST + '/base-resource-platform/cms/column/config/resource/updateWeiPinResource'
  }
};
