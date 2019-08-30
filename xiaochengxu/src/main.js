import Vue from 'vue'
import App from './App'
import store from "./store/store"

Vue.config.productionTip = false;
App.mpType = 'app';
App.store = store;
const app = new Vue(App);
app.$mount();

export default {
  config: {
    usingComponents: {
      // 'painter': '/static/painter/painter'
    },
    window: {
      backgroundTextStyle: 'light',
      backgroundColor: "#000",
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '唯医骨科',
      navigationBarTextStyle: 'black',
    },
    networkTimeout:{
      "request":30000,
    },
    "permission": {
      "scope.userLocation": {
        "desc": "位置信息将用于推荐医生，请先授权"
      }
    },
    navigateToMiniProgramAppIdList:[
      "wxa188055d5e77a7fb"  //AI智能化度图
    ]
  }
}
