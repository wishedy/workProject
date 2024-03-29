/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/15.
 */
import Vue from 'vue'
import App from './imSceneAffirmOrder'

const app = new Vue(App);
app.$mount();

export default {
  config: {
    backgroundTextStyle: 'light',
    backgroundColor: "#000",
    navigationBarBackgroundColor: '#02BAAE',
    navigationBarTitleText: '支付订单',
    navigationBarTextStyle: '#333333'
  }
}

