/**
 * 功能描述：自定义 router
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：配置 router 路径
 * Create by YaoQiao on 2018/8/30
 */

'use strict';

const homeRouter = {
  path: '/home',
  name: 'home',
  component: () => import('@/views/Home.vue')
};
const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/Login.vue')
};

// 主路由数组
const customRelation = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/memberAudit',
    name: 'memberAudit', // 会员审核列表页
    component: () => import('@/views/customRelation/memberAudit.vue')
  },
  {
    path: '/companyAudit',
    name: 'companyAudit', // 厂商审核列表页
    component: () => import('@/views/customRelation/companyAudit.vue')
  },
  {
    path: '/companyAuditDetail',
    name: 'companyAuditDetail', // 厂商审核详情页
    component: () => import('@/views/customRelation/companyAuditDetail.vue')
  },
  {
    path: '/companyAuditChangeDetail',
    name: 'companyAuditChangeDetail', // 厂商信息变更详情页
    component: () => import('@/views/customRelation/companyAuditChangeDetail.vue')
  },
  {
    path: '/boneCloud',
    name: 'boneCloud', // 骨人云
    component: () => import('@/views/boneCloudManager/boneCloud.vue')
  },
  {
    path: '/boneCloudBanner',
    name: 'boneCloudBanner', // 骨人云活动后台
    component: () => import('@/views/columnManager/boneCloudBannerColumn.vue')
  },
  {
    path: '/kitsList',
    name: 'kitsList', // 锦囊列表
    component: () => import('@/views/kitsList/kitsList.vue')
  },
  {
    path: '/manualPush',
    name: 'manualPush', // 添加手动推送
    component: () => import('@/views/manualPush/manualPushHome.vue')
  },
  {
    path: '/pushSetting',
    name: 'pushSetting', // 添加手动推送
    component: () => import('@/views/pushSetting/pushSetting.vue')
  },
  {
    path: '/manualPushManage',
    name: 'manualPushManage', // 添加手动推送
    component: () => import('@/views/manualPush/manualPushManage.vue')
  },
  {
    path: '/pushData',
    name: 'pushData', // 添加手动推送
    component: () => import('@/views/manualPush/pushData.vue')
  },
  {
    path: '/kitsEdit',
    name: 'kitsEdit', // 锦囊编辑页
    component: () => import('@/views/kitsList/kitsEdit.vue')
  },
  {
    path: '/wakeUpEdit',
    name: 'wakeUpEdit', // 锦囊召出词编辑页面
    component: () => import('@/views/kitsList/wakeUpEdit.vue')
  },
  {
    path: '/kitsQuestionList',
    name: 'kitsQuestionList', // 锦囊问题列表,锦囊详情页
    component: () => import('@/views/kitsList/kitsQuestionList.vue')
  },
  {
    path: '/questionInfo',
    name: 'questionInfo', // 锦囊问题详情
    component: () => import('@/views/kitsList/questionInfo.vue')
  },
  {
    path: '/questionEdit',
    name: 'questionEdit.vue', // 锦囊问题编辑页
    component: () => import('@/views/kitsList/questionEdit.vue')
  },
  {
    path: '/replyEdit',
    name: 'replyEdit.vue', // 锦囊回复编辑页
    component: () => import('@/views/kitsList/replyEdit.vue')
  },
  {
    path: '/memberAuditDetail',
    name: 'memberAuditDetail', // 会员审核详情页
    component: () => import('@/views/customRelation/memberAuditDetail.vue')
  },
  {
    path: '/memberAuditChangeDetail',
    name: 'memberAuditChangeDetail', // 信息变更详情页
    component: () => import('@/views/customRelation/memberAuditChangeDetail.vue')
  },
  {
    path: '/memberMerge',
    name: 'memberMerge', // 会员合并列表页
    component: () => import('@/views/customRelation/memberMerge.vue')
  },
  {
    path: '/memberMergeDetail',
    name: 'memberMergeDetail', // 会员合并详情页
    component: () => import('@/views/customRelation/memberMergeDetail.vue')
  },
  {
    path: '/informationMaintenance',
    name: 'informationMaintenance', // 认证信息维护页
    component: () => import('@/views/certificationRelation/informationMaintenance.vue')
  },
  {
    path: '/companyInformationMaintenance',
    name: 'companyInformationMaintenance', // 厂商认证信息维护页
    component: () => import('@/views/certificationRelation/companyInformationMaintenance.vue')
  },
  {
    path: '/videoNodesExamine',
    name: 'videoNodesExamine', // 视频笔记审核页
    component: () => import('@/views/videoNodesExamine/videoNodesExamine.vue')
  },
  {
    path: '/videoNodesDesc',
    name: 'videoNodesDesc', // 视频笔记审核页
    component: () => import('@/views/videoNodesExamine/videoNodesDesc.vue')
  },
  {
    path: '/patientEduList',
    name: 'patientEduList', // 患教手册列表
    component: () => import('@/views/patientEducationBook/patientEduList.vue')
  },
  {
    path: '/patientEduDesc',
    name: 'patientEduDesc', // 患教手册详情
    component: () => import('@/views/patientEducationBook/patientEduDesc.vue')
  },
  {
    path: '/patientEduView',
    name: 'patientEduView', // 患教手册详情展示页
    component: () => import('@/views/patientEducationBook/patientEduView.vue')
  },
  {
    path: '/userPatientEduList',
    name: 'userPatientEduList', // 用户患教手册列表页
    component: () => import('@/views/userPatientEducationBook/userPatientEduList.vue')
  },
  {
    path: '/userPatientEduEdit',
    name: 'userPatientEduEdit', // 用户患教手册修改页
    component: () => import('@/views/userPatientEducationBook/userPatientEduEdit.vue')
  },
  {
    path: '/userPatientEduView',
    name: 'userPatientEduView', // 用户患教手册展示页
    component: () => import('@/views/userPatientEducationBook/userPatientEduView.vue')
  },
  {
    path: '/asiaManager',
    name: 'asiaManager', // asia后台管理
    component: () => import('@/views/asiaManager/asiaManager.vue')
  },
  {
    path: '/recommendAdvertisement',
    name: 'recommendAdvertisement', // 首页--推荐广告管理
    component: () => import('@/views/recommendAdvertisement/recommendAdvertisement.vue')
  },
  {
    path: '/curriculumAdvertisement',
    name: 'curriculumAdvertisement', // 首页--课程广告管理
    component: () => import('@/views/curriculumAdvertisement/curriculumAdvertisement.vue')
  },
  {
    path: '/liveBroadcastAdvertisement',
    name: 'liveBroadcastAdvertisement', // 首页--直播广告管理
    component: () => import('@/views/liveBroadcastAdvertisement/liveBroadcastAdvertisement.vue')
  },
  {
    path: '/eliteClubAdvertisement',
    name: 'eliteClubAdvertisement', // 首页--精英会广告管理
    component: () => import('@/views/eliteClubAdvertisement/eliteClubAdvertisement.vue')
  },
  {
    path: '/allinmdSchoolAdvertisement',
    name: 'allinmdSchoolAdvertisement', // 首页--唯医学院广告管理
    component: () => import('@/views/allinmdSchoolAdvertisement/allinmdSchoolAdvertisement.vue')
  },
  {
    path: '/terminalAdvertisement',
    name: 'terminalAdvertisement', // 首页--终端页广告管理
    component: () => import('@/views/terminalAdvertisement/terminalAdvertisement.vue')
  },
  {
    path: '/patientsEvaluation',
    name: 'patientsEvaluation', //
    component: () => import('@/views/patientsEvaluation/index.vue')
  },
  {
    path: '/productAnchorPoint',
    name: 'productAnchorPoint', // 运营配置--产品锚点（列表页）
    component: () => import('@/views/productAnchorPoint/productAnchorPoint.vue')
  },
  {
    path: '/productPointDesc',
    name: 'productPointDesc', // 运营配置--产品锚点（详情页）
    component: () => import('@/views/productAnchorPoint/productPointDesc.vue')
  },
  {
    path: '/payCoursesIndex',
    name: 'payCoursesIndex', // 付费课程管理页首页
    component: () => import('@/views/payCourses/payCoursesIndex.vue')
  },
  {
    path: '/payCourseEdit',
    name: 'payCourseEdit', // 付费课程编辑页
    component: () => import('@/views/payCourses/payCourseEdit.vue')
  },
  {
    path: '/payCoursesContent',
    name: 'payCoursesContent', // 付费课程内容管理页
    component: () => import('@/views/payCourses/payCoursesContent.vue')
  },
  {
    path: '/couponBatchList', // 优惠券批次列表
    name: 'couponBatchList',
    component: () => import('@/views/couponManager/couponBatchList.vue')
  },
  {
    path: '/couponVoucherList', // 优惠券券号列表
    name: 'couponVoucherList',
    component: () => import('@/views/couponManager/couponVoucherList.vue')
  },
  {
    path: '/createCouponSelectList', // 创建优惠券-类型选择页
    name: 'createCouponSelectList',
    component: () => import('@/views/couponManager/createCouponSelectList.vue')
  },
  {
    path: '/generalCouponDetail', // 创建优惠券-通用优惠券
    name: 'generalCouponDetail',
    component: () => import('@/views/couponManager/generalCouponDetail.vue')
  },
  {
    path: '/commodityCouponDetail', // 创建优惠券-商品优惠券
    name: 'commodityCouponDetail',
    component: () => import('@/views/couponManager/commodityCouponDetail.vue')
  },
  {
    path: '/backgroundGrantDetail', // 后台发放优惠券详情页
    name: 'backgroundGrantDetail',
    component: () => import('@/views/couponManager/backgroundGrantDetail.vue')
  },
  {
    path: '/codeNumber',
    name: 'codeNumber', // 兑换码码号列表
    component: () => import('@/views/redeemCode/codeNumber.vue')
  },
  {
    path: '/codeBatch',
    name: 'codeBatch', // 兑换码批次列表
    component: () => import('@/views/redeemCode/codeBatch.vue')
  },
  {
    path: '/createCode',
    name: 'createCode', // 兑换码批次列表
    component: () => import('@/views/redeemCode/createCode.vue')
  },
  {
    path: '/registration',
    name: 'registration', // 预约挂号
    component: () => import('@/views/registration/registration.vue')
  },
  {
    path: '/accountManager',
    name: 'accountManager', // 账号管理
    component: () => import('@/views/accountManager/accountManager.vue')
  },
  {
    path: '/collegeClass',
    name: 'collegeClass', // 唯医学院频道
    component: () => import('@/views/collegeClass/collegeClass.vue')
  },
  {
    path: '/commodityOrderList',
    name: 'commodityOrderList', // 商品订单列表
    component: () => import('@/views/orderManager/commodityOrderList.vue')
  },
  {
    path: '/commodityOrderDetail',
    name: 'commodityOrderDetail', // 商品订单详情页
    component: () => import('@/views/orderManager/commodityOrderDetail.vue')
  },
  {
    path: '/commodityOrderList2',
    name: 'commodityOrderList2', // 商品订单列表 2.0
    component: () => import('@/views/orderManager/commodityOrderList2.vue')
  },
  {
    path: '/commodityOrderDetail2',
    name: 'commodityOrderDetail2', // 商品订单详情页 2.0
    component: () => import('@/views/orderManager/commodityOrderDetail2.vue')
  },
  {
    path: '/manufacturerProductList',
    name: 'manufacturerProductList', // 厂商关联产品列表页
    component: () => import('@/views/manufacturerProduct/manufacturerProductList.vue')
  },
  {
    path: '/manufacturerProductDesc',
    name: 'manufacturerProductDesc', // 厂商关联产品详情页
    component: () => import('@/views/manufacturerProduct/manufacturerProductDesc.vue')
  },
  {
    path: '/allinmdMoneyDetailList',
    name: 'allinmdMoneyDetailList', // 唯币流水管理
    component: () => import('@/views/allinmdMoneyDetailList/allinmdMoneyDetailList.vue')
  },
  {
    path: '/userAccountManager',
    name: 'userAccountManager', // 用户账户管理
    component: () => import('@/views/userAccountManager/userAccountManager.vue')
  },
  {
    path: '/rechargeOrder',
    name: 'rechargeOrder', // 唯币充值记录
    component: () => import('@/views/rechargeOrder/rechargeOrder.vue')
  },
  {
    path: '/rechargeOrderDesc',
    name: 'rechargeOrderDesc', // 唯币充值记录详情页
    component: () => import('@/views/rechargeOrder/rechargeOrderDesc.vue')
  },
  // 20190720 唯品汇-品牌专区
  {
    path: '/brandZone',
    name: 'brandZone',
    component: () => import('@/views/allinmdBrand/brandZone.vue')
  },
  {
    path: '/wphManage',
    name: 'wphManage',
    component: () => import('@/views/allinmdBrand/wphManage.vue')
  }
];

// 栏目后台相关路由
const columnManager = [
  {
    path: '/columnManager',
    name: 'columnManager', // 栏目后台页
    component: () => import('@/views/columnManager/columnManager.vue')
  },
  {
    path: '/courseTypeColumn',
    name: 'courseTypeColumn', // 课程型栏目后台
    component: () => import('@/views/columnManager/courseTypeColumn.vue')
  },
  {
    path: '/courseTypeVideoSelect',
    name: 'courseTypeVideoSelect', // 课程管理-选集视频
    component: () => import('@/views/columnManager/courseTypeVideoSelect.vue')
  },
  {
    path: '/videoTypeColumn',
    name: 'videoTypeColumn', // 视频聚合栏目后台
    component: () => import('@/views/columnManager/videoTypeColumn.vue')
  },
  {
    path: '/liveTypeColumn',
    name: 'liveTypeColumn', // 直播聚合类栏目后台
    component: () => import('@/views/columnManager/liveTypeColumn.vue')
  },
  {
    path: '/activityColumn',
    name: 'activityColumn', // 直播聚合类栏目后台
    component: () => import('@/views/columnManager/activityColumn.vue')
  }
];

// 首页固定栏/首页栏目排序/搜索相关
const fixedColumnEtc = [
  {
    path: '/speciality',
    name: 'speciality',
    component: () => import('@/views/operationalConfiguration/speciality.vue')
  },
  {
    path: '/indexBackground',
    name: 'indexBackground',
    component: () => import('@/views/indexBackground/indexBackground.vue')
  },
  {
    path: '/indexColumn',
    name: 'indexColumn',
    component: () => import('@/views/operationalConfiguration/indexColumn.vue')
  },
  {
    path: '/searchHotDict',
    name: 'searchHotDict',
    component: () => import('@/views/operationalConfiguration/searchManager/searchHotDict.vue')
  },
  {
    path: '/searchOpDict',
    name: 'searchOpDict',
    component: () => import('@/views/operationalConfiguration/searchManager/searchOpDict.vue')
  },
  {
    path: '/hotDictEdit',
    name: 'hotDictEdit',
    component: () => import('@/views/operationalConfiguration/searchManager/hotDictEdit.vue')
  },
  {
    path: '/opDictEdit',
    name: 'opDictEdit',
    component: () => import('@/views/operationalConfiguration/searchManager/opDictEdit.vue')
  },
  {
    path: '/searchComplexDict',
    name: 'searchComplexDict',
    component: () => import('@/views/operationalConfiguration/searchManager/searchComplexDict.vue')
  },
  {
    path: '/searchCorrectDict',
    name: 'searchCorrectDict',
    component: () => import('@/views/operationalConfiguration/searchManager/searchCorrectDict.vue')
  },
  {
    path: '/complexDictEdit',
    name: 'complexDictEdit',
    component: () => import('@/views/operationalConfiguration/searchManager/complexDictEdit.vue')
  },
  {
    path: '/correctDictEdit',
    name: 'correctDictEdit',
    component: () => import('@/views/operationalConfiguration/searchManager/correctDictEdit.vue')
  },
  {
    path: '/advertisingMaterials',
    name: 'advertisingMaterials',
    component: () => import('@/views/advertisingMaterials/advertisingMaterials.vue')
  },
  // 推送相关
  {
    path: '/autoReactivateList',
    name: 'autoReactivateList',
    component: () => import('@/views/pushManage/autoReactivateList.vue')
  },
  {
    path: '/autoPushList',
    name: 'autoPushList',
    component: () => import('@/views/pushManage/autoPushList.vue')
  },

  // 唯币管理
  {
    path: '/weiMoneyAdditionalOrder',
    name: 'weiMoneyAdditionalOrder',
    component: () => import('@/views/weiMoneyManage/weiMoneyAdditionalOrder.vue')
  },
  {
    path: '/weiMoneyAdjustment',
    name: 'weiMoneyAdjustment',
    component: () => import('@/views/weiMoneyManage/weiMoneyAdjustment.vue')
  },

  // 智能推荐管理
  {
    path: '/intelligentManage',
    name: 'intelligentManage',
    component: () => import('@/views/intelligentManage/intelligentManage.vue')
  },
  // 在线预约挂号科室信息-科室列表
  {
    path: '/orderSectionInfo',
    name: 'orderSectionInfo',
    component: () => import('@/views/orderSectionInfo/orderSectionInfo.vue')
  },
  // 在线预约挂号科室信息-科室列表编辑
  {
    path: '/orderSectionInfoEdit',
    name: 'orderSectionInfoEdit',
    component: () => import('@/views/orderSectionInfo/orderSectionInfoEdit.vue')
  }

];

// 所有定义过的路由都应该写入routers中
export const routers = [
  loginRouter,
  homeRouter,
  ...customRelation,
  ...columnManager,
  ...fixedColumnEtc
];
