/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/15.
 */
import Vue from 'vue'
import App from './consultAddPatient'

const app = new Vue(App);
app.$mount();

export default {
  config: {
    backgroundTextStyle: 'light',
    backgroundColor: "#000",
    navigationBarBackgroundColor: '#02BAAE',
    navigationBarTitleText: '选择就诊人',
    navigationBarTextStyle: '#333333'
  }
}

