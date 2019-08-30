/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/15.
 */
import Vue from 'vue'
import App from './consultQuestionList'

const app = new Vue(App);
app.$mount();

export default {
  config: {
    backgroundTextStyle: 'light',
    backgroundColor: "#000",
    navigationBarBackgroundColor: '#02BAAE',
    navigationBarTitleText: '完善病情资料',
    navigationBarTextStyle: '#333333'
  }
}

