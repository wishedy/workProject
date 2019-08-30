import Vue from 'vue';
import VueRouter from 'vue-router';
import comm from 'static/js/comm.js';
import App from './App.vue';
import weixinMethods from "static/js/weixinflag.js";
import FastClick from "fastclick";
import 'static/js/third-party/flexible.js';
FastClick.attach(document.body);
weixinMethods.loginWeiXin();
class Collect{
	constructor(){
		this.init();
	}
	init(){
		const app = new Vue({
			router:this.router,
			render:h=>h(App)
		}).$mount('#app');
	}
}
new Collect();