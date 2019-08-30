/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

import api from "common/js/util/util";
import localStorage from "localStorage";

export default {
  clickFlag:true, //点击限制
  navigateFlag:true,
  authStatus:false,
  customerId: localStorage.getItem("userId") || "",  //用户ID
  mobile:"",//用户手机号
  hasBind: false,  //是否已绑定
  loading: false, //loading
  loadingType: "loading",  //loading Icon类型
  listType: "all", //评论类别
  allTypePage: 0, //全部评论页码
  authorTypePage: 0, //作者评论页码
  allTypeFinish: false,  //全部类型加载完成
  authorTypeFinish: false, //作者评论加载完成
  allTypeLoading: false,
  authorTypeLoading: false,
  authorCustomerId: "",  //作者Id
  resourceId: "", //资源ID
  cachePosition: 0,
  canvasShow:false,
  journalMessage:{},
  doctorMessage: {  //医生基本信息
    name: "",
    title: "",
    company: "",
    logoUrl: ""
  },
  shareMessage: {
    num: -1,
    title: "",
    url: ""
  },
  deleteShowFlag: false,
  deleteItem: {},
  recommendList: [],
  commentList: [],
  authorCommentList: [],
  commentNum: {
    all: 0,
    author: 0
  },
  currentCommentId: "",
  currentCustomerId: "",
  showCommentWindow: false,
  showShareBox:false,
  toastTips: "",
  toastShow: false,
  ensureShow: false,
  commentLoadingParam: {
    type: '',
    icon: '',
    content: '',
    show: false,
    hideDelay: false
  },
  systemInfo: {}
}
