import Vue from 'vue';
import "scss/base.scss";
import 'static/js/third-party/flexible.js'

import App from './App';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});