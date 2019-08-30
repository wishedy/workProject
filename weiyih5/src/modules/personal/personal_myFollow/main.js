import Vue from 'vue';
import App from './App.vue';
import FastClick from "fastclick";
import 'static/js/third-party/flexible.js'
import VueRouter from 'vue-router';
import weixinMethods from "static/js/weixinflag.js";
import followCase from './components/FollowCase.vue';
import followTopic from './components/FollowTopic.vue';
import followTag from './components/FollowTag.vue';

FastClick.attach(document.body);
weixinMethods.loginWeiXin();
class MyFollow{
	constructor() {
		this.init();
	}
	init(){
		Vue.use(VueRouter);
		this.routerStart();
		this.registerRouter();
		//Vue实例启动
		const app = new Vue({
			router: this.router,
			render: h => h(App)
		}).$mount("#app");
	}
	
	registerRouter() {
		const options = {
			duration: '0.3',              //转场动画时长，默认为0.3，单位秒
			firstEntryDisable: false,     //值为true时禁用首次进入应用时的渐现动画，默认为false
			firstEntryDuration: '.6',     //首次进入应用时的渐现动画时长，默认为.6
			forwardAnim: 'fadeInRight',   //前进动画，默认为fadeInRight
			backAnim: 'fadeInRight',       //后退动画，默认为fedeInLeft
			sameDepthDisable: false,      //url深度相同时禁用动画，默认为false
			tabs: [{
				name: 'followCase'
			}, {
				name: 'followTopic'
			},{
				name:'followTag'
			}],                       //默认为[]，name对应路由的name,以实现类似app中点击tab页面水平转场效果，如tab[1]到tab[0]，会使用backAnim动画，tab[1]到tab[2]，会使用forwardAnim动画
			tabsDisable: false,           //值为true时，tabs间的转场没有动画，默认为false
			disable: false,               //禁用转场动画，默认为false，嵌套路由默认为true
		};
		
		this.router = new VueRouter({
			routes: this.routes,
		});
	}
	
	routerStart() {
		this.routes = [{
			path: "/",
			redirect: "/followCase",
		}, {
			path: "/followCase",
			name: "followCase",
			component: followCase,
			meta:{
				keepAlive:true
			}
		}, {
			path: "/followTopic",
			name: "followTopic",
			meta: {
				keepAlive: true
			},
			component: followTopic
		}, {
			path: "/followTag",
			name: "followTag",
			component: followTag
		}]
	}
	
}
new MyFollow();