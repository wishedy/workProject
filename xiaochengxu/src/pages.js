/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/7/5.
 */
// 调试环境下不考虑分包加载结构，默认配置全部为false
const subPackage = true;

module.exports = [
  // 主包
  {
    path: 'pages/mIndex/mIndex',
    config: {
      enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark"
    }
  },
  {
    path: 'pages/doctorHome/doctorHome',
  },
  {
    path: 'pages/consultIntro/consultIntro',
  },
  {
    path: 'pages/imSceneDoctor/imSceneDoctor',
  },
  {
    path: 'pages/imScene/imScene',
  },
  {
    path: 'pages/changeName/changeName',
  },
  {
    path: 'pages/personalDetail/personalDetail',
  },
  {
    path: 'pages/patientComment/patientComment',
  },
  {
    path: 'pages/jumper/jumper',
  },
  {
    path: 'pages/cropper/cropper',
  },
  {
    path: 'pages/doctorList/doctorList',
    config: {
      navigationBarTitleText: '找名医',
    }
  },
  {
    path: 'pages/history/history',
  },
  {
    path: 'pages/listResult/listResult',
  },
  {
    path: 'pages/indexHistory/indexHistory',
  },
  {
    path: 'pages/report/report',
  },
  {
    path: 'pages/indexSearch/indexSearch',
  },
  {
    path: 'pages/loginRule/loginRule',
  },
  {
    path: 'pages/login/login',
  },
  {
    path: 'pages/personal/personal',
    config: {
      backgroundColor: "#fff",
    }
  },
  {
    path: 'pages/doctorMain/doctorMain',
  },
  {
    path: 'pages/doctorMain/doctorInfoMore',
  },
  {
    path: 'pages/doctorMain/doctorMainAffirmOrder',
  },
  {
    path: 'pages/doctorMain/inviteContent',
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#02BAAE',
      navigationBarTitleText: '邀请开诊登记',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'pages/doctorMain/patientNoteList',
    config: {
      navigationBarTitleText: '专家指南',
    }
  },
  {
    path: 'pages/doctorMain/doctorMainAddPatient',
  },
  {
    path: 'pages/doctorMain/doctorMainPatientList',
  },
  {
    path: 'pages/upLoadGuide/upLoadGuide',
  },
  {
    path: 'pages/upLoadImgCheck/upLoadImgCheck',
  },
  //个人主页的三个页面
  {
    path: 'pages/feedback/feedback',
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#FFFFFF',
      navigationBarTitleText: '建议反馈',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'pages/myConsult/myConsult',
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '消息',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true,
      backgroundColor: "#eeeeee",
      backgroundTextStyle: "dark"
    }
  },
  {
    path: 'pages/healthKnowledge/healthKnowledge',
  },
  {
    path: 'pages/healthKnowledgeDetail/healthKnowledgeDetail',
  },

  /****************分包B 轻症咨询***************/
  {
    path: 'packageB/consultIntro/consultIntro',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#48BAFB',
      navigationBarTitleText: '服务介绍',
      navigationBarTextStyle: 'white'
    }
  },
  {
    path: 'packageB/consultPatientList/consultPatientList',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '选择就诊人',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: 'packageB/consultAddPatient/consultAddPatient',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '添加就诊人',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageB/consultSelectPart/consultSelectPart',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '选择不适部位',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageB/consultQuestionList/consultQuestionList',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善病情资料',
      navigationBarTextStyle: 'black'
    }
  },


  /****************分包A IM通讯***************/
  {
    path: 'packageA/imScene/imScene',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    }
  },
  {
    path: 'packageA/uploadList/uploadList',
    subPackage
  },
  {
    path: 'packageA/imSceneAffirmOrder/imSceneAffirmOrder',
    subPackage
  },
  {
    path: 'packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder',
    subPackage
  },
  {
    path: 'packageA/triageDetail/triageDetail',
    subPackage
  },
  {
    path: 'packageA/imSceneDoctor/imSceneDoctor',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true,
    }
  },
  {
    path: 'packageA/meinian/meinian',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '填写个人信息',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: 'packageA/meinian/imageList',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '影像检测图片',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: 'packageA/meinian/healthReport',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '体检报告详情',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: 'packageA/meinian/patientList',
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '美年咨询人信息',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: 'packageA/meinian/consultIntro',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#02A8AD',
      navigationBarTitleText: '服务介绍',
      navigationBarTextStyle: 'black',
    }
  },
  {
    path: '/packageA/medicalReportDetail/medicalReportDetail',
    subPackage,
  },
  {
    path: 'packageA/nameAuthentication/nameAuthentication',
    subPackage
  },
  {
    path: 'packageA/outpatientCalender/outpatientCalender',
    subPackage
  },
  {
    path: 'packageA/outpatientOrder/outpatientOrder',
    subPackage
  },
  {
    path: 'packageA/videoPlayer/videoPlayer',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#000',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'white',
    }
  },

  /****************分包C 咨询内容各子页***************/

  /****************分包D 患者报到***************/
  {
    path: 'packageD/doctorHome/doctorHome',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#DBFBFF',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/doctorOutPatient',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#DBFBFF',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/reportRegister',
    subPackage,
    config: {
      navigationBarTitleText: '唯医骨科',
    }
  },
  {
    path: 'packageD/reportNew/reportPatientList',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '选择就诊人',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/reportAddPatient',
    subPackage
  },
  {
    path: 'packageD/reportNew/doctorEvaluate',
    subPackage
  },
  {
    path: 'packageD/reportNew/doctorEvaluateEnd',
    subPackage
  },
  {
    path: 'packageD/reportNew/patientInfo',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '就诊人信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicOne',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicTwo',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicTwoA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicTwoB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicThree',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicThreeA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicThreeB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFour',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFourA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFourB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFourC',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFive',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/clinicFiveA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalOne',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalTwo',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalTwoA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalTwoB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalThree',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalThreeA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalThreeB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalFour',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalFourA',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/hospitalFourB',
    subPackage,
    config: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善信息',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageD/reportNew/reportUploadImg',
    subPackage,
    config: {
      navigationBarTitleText: "唯医骨科",
    }
  },
  {
    path: 'packageD/healthCard/healthRegister',
    subPackage,
    config: {
      navigationBarTitleText: "领取居民健康卡",
    }
  }, {
    path: 'packageD/healthCard/healthCardRecognition',
    subPackage,
    config: {
      navigationBarTitleText: "领取居民健康卡",
    },
  }, {
    path: 'packageD/healthCard/healthCardList',
    subPackage,
    config: {
      navigationBarTitleText: "我的健康卡",
    },
  }, {
    path: 'packageD/healthCard/healthCardDetail',
    subPackage,
    config: {
      navigationBarTitleText: "我的健康卡",
      navigationBarBackgroundColor: '#f8f9e9'
    },
  },
  // 预约
  {
    path: 'packageD/registration/orderSuccess',
    subPackage,
    config: {
      navigationBarTitleText: "预约成功",
      navigationBarBackgroundColor: '#ffffff',
      disableScroll: true
    },
  },{
    path: 'packageD/registration/myOrderList',
    subPackage,
    config: {
      backgroundColor: '#F2F5F7',
      navigationBarTitleText: "我的预约挂号",
      navigationBarBackgroundColor: '#F2F5F7'
    },
  },
  // 预约挂号ljx
  {
    path: 'packageD/registration/orderDepartment',
    subPackage,
    config: {
      navigationBarTitleText: "预约挂号",
      navigationBarBackgroundColor: '#48bafb',
      navigationBarTextStyle: "white",
      disableScroll: true
    }
  },
  {
    path: 'packageD/registration/orderRule',
    subPackage,
    config: {
      navigationBarTitleText: "预约须知",
      backgroundColor: '#ffffff',
    }
  },
  {
    path: 'packageD/registration/orderTime',
    subPackage,
    config: {
      navigationBarTitleText: "预约挂号",
      backgroundColor: "#ffffff"
    }
  },
  {
    path: 'packageD/registration/orderDoctor',
    subPackage,
    config: {
      navigationBarTitleText: "预约挂号",
      navigationBarBackgroundColor: '#f2f5f7',
      backgroundColor: "#f1f4f6"
    }
  },
  {
    path: 'packageD/registration/orderPerson',
    subPackage,
    config: {
      backgroundColor: '#F2F5F7',
      navigationBarTitleText: "预约详情",
      navigationBarBackgroundColor: '#f2f5f7',
      enablePullDownRefresh: false,
      disableScroll: true
    }
  },
  {
    path: 'packageD/registration/orderEditPerson',
    subPackage,
    config: {
      backgroundColor: '#FFF',
      navigationBarTitleText: "编辑就诊人",
      enablePullDownRefresh: false,
      disableScroll: true
    }
  },
  {
    path: 'packageD/registration/orderAddPerson',
    subPackage,
    config: {
      backgroundColor: '#FFF',
      navigationBarTitleText: "添加就诊人",
      enablePullDownRefresh: false,
      disableScroll: true
    }
  },
  /****************分包E 找医生***************/
  {
    path: 'packageE/findDoctorAddPatient/findDoctorAddPatient',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '添加就诊人',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageE/findDoctorAffirmOrder/findDoctorAffirmOrder',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '咨询单确认',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageE/findDoctorPatientList/findDoctorPatientList',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '选择就诊人',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageE/findDoctorSelectPart/findDoctorSelectPart',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '选择不适部位',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageE/findDoctorQuestionList/findDoctorQuestionList',
    subPackage,
    config: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '完善病情资料',
      navigationBarTextStyle: 'black'
    }
  },
  {
    path: 'packageE/intelligentTriage/intelligentTriage',//智能分诊
    subPackage,
    config: {
      backgroundTextStyle: "dark",
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      navigationBarTitleText: '唯医骨科',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: false,
    }
  },
  /****************分包F 优惠券***************/
  {
    path: "packageF/journalDetail/journalDetail",
    subPackage,
    config: {
      enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/patientNote/patientNote",
    subPackage,
    config: {
      navigationBarTitleText: '专家指南',
      backgroundColor: "#ffffff",
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: "#00B9AD",
      backgroundTextStyle: "light",
    }
  },
  {
    path: "packageF/patientNote/detailVideo",
    subPackage,
    config: {
      navigationBarTitleText: '专家指南',
      navigationBarTextStyle: 'white',
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#00B9AD",
      backgroundTextStyle: "light",
    }
  },
  {
    path: "packageF/journal/journalEditor",
    subPackage,
    config: {
      // enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/journal/publish",
    subPackage,
    config: {
      navigationBarTitleText: '唯医骨科',
      // enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/journal/journalList",
    subPackage,
    config: {
      // enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/journal/journalSpread",
    subPackage,
    config: {
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/journal/journalStatus",
    subPackage,
    config: {
      // enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
    }
  },
  {
    path: "packageF/journal/uploadVideo",
    subPackage,
    config: {
      // enablePullDownRefresh: true,
      backgroundColor: "#ffffff",
      navigationBarBackgroundColor: "#ffffff",
      backgroundTextStyle: "dark",
      navigationBarTitleText: '术前术后对比视频',
    }
  },
];
