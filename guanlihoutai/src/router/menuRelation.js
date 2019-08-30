/**
 * 功能描述：菜单栏与router对照关系
 * 使用方法：
 * 注意事项：menuId 在设置时，可从用户登录时获取菜单相关数据，三级菜单中可 menuId
 * 引入来源：
 * 作用：根据后端返回的 menuId 来配置对应的 router 地址
 * Create by YaoQiao on 2018/9/8
 */

'use strict';

const relation = [
  {
    menuId: 10651, // 菜单id
    router: '/memberAudit', // 路由地址
    icon: 'icon-home-01.png', // 菜单icon
    desc: '审核管理' // 说明
  },
  {
    menuId: 10652,
    router: '/memberAudit',
    icon: 'icon-home-02.png',
    desc: '审核查询'
  },
  {
    menuId: 10653,
    router: '/memberMerge',
    icon: 'icon-home-03.png',
    desc: '会员合并'
  },
  {
    menuId: 10654,
    router: '/memberMerge',
    icon: 'icon-home-01.png',
    desc: '合并查询'
  },
  {
    menuId: 10703,
    router: '/informationMaintenance',
    icon: 'icon-home-02.png',
    desc: '认证提示'
  },
  {
    menuId: 10751,
    router: '/speciality',
    icon: 'icon-home-01.png',
    desc: '专业入口'
  },
  {
    menuId: 10752,
    router: '/indexColumn',
    icon: 'icon-home-02.png',
    desc: '首页栏目'
  },
  {
    menuId: 10754,
    router: '/columnManager',
    icon: 'icon-home-01.png',
    desc: '栏目管理'
  },
  {
    menuId: 10801,
    router: '/boneCloud',
    icon: 'icon-home-03.png',
    desc: '骨人云'
  },
  {
    menuId: 10755,
    router: '/boneCloudBanner',
    icon: 'icon-home-02.png',
    desc: '骨人云活动后台'
  },
  {
    menuId: 10802,
    router: '/videoNodesExamine',
    icon: 'icon-home-01.png',
    desc: '视频笔记'
  },
  {
    menuId: 10803,
    router: '/kitsList',
    icon: 'icon-home-02.png',
    desc: '锦囊管理'
  },
  {
    menuId: 10753,
    router: '/searchHotDict',
    icon: 'icon-home-03.png',
    desc: '热词管理'
  },
  {
    menuId: 10756,
    router: '/searchComplexDict',
    icon: 'icon-home-01.png',
    desc: '搜索词管理'
  },
  {
    menuId: 10851,
    router: '/patientEduList',
    icon: 'icon-home-01.png',
    desc: '患教手册'
  },
  {
    menuId: 10852,
    router: '/userPatientEduList',
    icon: 'icon-home-03.png',
    desc: '用户患教手册'
  },
  {
    menuId: 10656,
    router: '/asiaManager',
    icon: 'icon-home-03.png',
    desc: 'Asia会员管理'
  },
  {
    menuId: 10757,
    router: '/indexBackground',
    icon: 'icon-home-01.png',
    desc: '首页背景图'
  },
  {
    menuId: 10951,
    router: '/patientsEvaluation',
    icon: 'icon-home-01.png',
    desc: '患者端管理-患者评价'
  },
  {
    menuId: 13007,
    router: '/accountManager',
    icon: 'icon-home-01.png',
    desc: '患者端管理-新大一账号管理'
  },
  {
    menuId: 13008,
    router: '/registration',
    icon: 'icon-home-01.png',
    desc: '患者端管理-预约挂号'
  },
  {
    menuId: 14001,
    router: '/orderSectionInfo',
    icon: 'icon-home-01.png',
    desc: '重庆唯医骨科医院-小程序-在线预约挂号科室信息'
  },
  {
    menuId: 10901,
    router: '/advertisingMaterials',
    icon: 'icon-home-01.png',
    desc: '广告管理-广告物料'
  },
  {
    menuId: 10902,
    router: '/recommendAdvertisement',
    icon: 'icon-home-02.png',
    desc: '广告管理-首页-推荐广告管理'
  },
  {
    menuId: 10903,
    router: '/curriculumAdvertisement',
    icon: 'icon-home-03.png',
    desc: '广告管理-首页-课程广告管理'
  },
  {
    menuId: 10904,
    router: '/liveBroadcastAdvertisement',
    icon: 'icon-home-01.png',
    desc: '广告管理-首页-直播广告管理'
  },
  {
    menuId: 10905,
    router: '/eliteClubAdvertisement',
    icon: 'icon-home-03.png',
    desc: '广告管理-首页-直播广告管理'
  },
  {
    menuId: 10758,
    router: '/productAnchorPoint',
    icon: 'icon-home-03.png',
    desc: '运营配置-产品锚点'
  },
  {
    menuId: 10708,
    router: '/companyInformationMaintenance',
    icon: 'icon-home-01.png',
    desc: '资源管理>认证资源>厂商认证提示'
  },
  {
    menuId: 10657,
    router: '/companyAudit',
    icon: 'icon-home-02.png',
    desc: '客户关系管理>用户管理>厂商审核管理'
  },
  {
    menuId: 13004,
    router: '/payCoursesIndex',
    icon: 'icon-home-02.png',
    desc: 'CMS管理-运营配置-付费课程管理'
  },
  {
    menuId: 13005,
    router: '/collegeClass',
    icon: 'icon-home-03.png',
    desc: 'CMS管理-运营配置-唯医学院频道'
  },
  {
    menuId: 10956,
    router: '/allinmdSchoolAdvertisement',
    icon: 'icon-home-01.png',
    desc: 'CMS管理-广告管理-唯医学院广告管理'
  },
  {
    menuId: 10957,
    router: '/terminalAdvertisement',
    icon: 'icon-home-02.png',
    desc: 'CMS管理-广告管理-终端页广告管理'
  },
  {
    menuId: 13001,
    router: '/createCode',
    icon: 'icon-home-03.png',
    desc: '营销工具-兑换码-兑换码创建'
  },
  {
    menuId: 13002,
    router: '/codeBatch',
    icon: 'icon-home-01.png',
    desc: '营销工具-兑换码-兑换码批次查询'
  },
  {
    menuId: 13003,
    router: '/codeNumber',
    icon: 'icon-home-02.png',
    desc: '营销工具-兑换码-兑换码码号查询'
  },
  {
    menuId: 12001,
    router: '/createCouponSelectList',
    icon: 'icon-home-03.png',
    desc: '营销工具-优惠券-优惠券创建'
  },
  {
    menuId: 12002,
    router: '/couponBatchList',
    icon: 'icon-home-01.png',
    desc: '营销工具-优惠券-优惠券批次查询'
  },
  {
    menuId: 12003,
    router: '/couponVoucherList',
    icon: 'icon-home-02.png',
    desc: '营销工具-优惠券-优惠券券号查询'
  },
  {
    menuId: 11001,
    router: '/commodityOrderList',
    icon: 'icon-home-03.png',
    desc: '交易-订单-商品订单1.0'
  },
  {
    menuId: 13006,
    router: '/manufacturerProductList',
    icon: 'icon-home-02.png',
    desc: '交易-订单-厂商关联产品管理'
  },
  {
    menuId: 11002,
    router: '/commodityOrderList2',
    icon: 'icon-home-01.png',
    desc: '交易-订单-商品订单2.0'
  },
  {
    menuId: 11003,
    router: '/rechargeOrder',
    icon: 'icon-home-03.png',
    desc: '交易-订单-唯币充值订单'
  },
  {
    menuId: 11004,
    router: '/allinmdMoneyDetailList',
    icon: 'icon-home-03.png',
    desc: '财务-账户管理-唯币流水明细'
  },
  {
    menuId: 11005,
    router: '/userAccountManager',
    icon: 'icon-home-01.png',
    desc: '财务-账户管理-用户账户管理'
  },
  {
    menuId: 11006,
    router: '/weiMoneyAdditionalOrder',
    icon: 'icon-home-02.png',
    desc: '交易-运营-唯币补单充值'
  },
  {
    menuId: 11007,
    router: '/weiMoneyAdjustment',
    icon: 'icon-home-03.png',
    desc: '交易-运营-唯币调整'
  },
  {
    menuId: 13010,
    router: '/pushSetting',
    icon: 'icon-home-03.png',
    desc: '推送设置-push-推送设置'
  },
  {
    menuId: 13011,
    router: '/manualPush',
    icon: 'icon-home-02.png',
    desc: '推送设置-push-添加手动推送'
  },
  {
    menuId: 13014,
    router: '/manualPushManage',
    icon: 'icon-home-02.png',
    desc: '推送设置-push-手动推送列表'
  },
  {
    menuId: 13012,
    router: '/autoPushList',
    icon: 'icon-home-03.png',
    desc: '推送设置-push-自动推送列表'
  },
  {
    menuId: 13013,
    router: '/pushData',
    icon: 'icon-home-02.png',
    desc: '推送设置-push-推送整体数据'
  },
  {
    menuId: 13015,
    router: '/autoReactivateList',
    icon: 'icon-home-02.png',
    desc: '推送设置-push-自动召回列表'
  },
  {
    menuId: 13018,
    router: '/intelligentManage',
    icon: 'icon-home-01.png',
    desc: 'CMS管理-患者端管理-智能推荐管理'
  },
  // 20190720 唯品汇-品牌专区 需要menuId
  {
    menuId: 10781,
    router: '/brandZone',
    icon: 'icon-home-03.png',
    desc: 'CMS管理-唯品汇-品牌专区'
  }
];

export default relation;
