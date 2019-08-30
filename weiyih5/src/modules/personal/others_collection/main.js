import Vue from 'vue';
import VueRouter from 'vue-router';
import comm from 'static/js/comm.js';
import App from './App.vue';
import weixinMethods from "static/js/weixinflag.js";
import FastClick from "fastclick";
import 'static/js/third-party/flexible.js';
import collectBook from './components/CollectBook';
import collectCase from './components/CollectCase';
import collectVideo from './components/CollectVideo';
import collectTopic from './components/CollectTopic';
import collectDoc from './components/CollectDoc';
import collectComment from './components/CollectComment';
import collectCourse from './components/CollectCourse';
FastClick.attach(document.body);
weixinMethods.loginWeiXin();
class Collect{
	constructor(){
		this.init();
	}
	init(){
		Vue.use(VueRouter);
		this.startRouter();
		this.registRouter();
		const app = new Vue({
			router:this.router,
			render:h=>h(App)
		}).$mount('#app');
	}
	registRouter(){
		this.router = new VueRouter({
			routes:this.routes,
			
		})
	}
	startRouter(){
		this.routes = [
		{
			path: "/",
			
		},
			{
			path:'/collectCase',
			component:collectCase,
			name:"collectCase"
		},{
			path:'/collectVideo',
			component:collectVideo,
			name:"collectVideo"
		},{
			path:'/collectTopic',
			component:collectTopic,
			name:"collectTopic"
		},{
			path:'/collectDoc',
			component:collectDoc,
			name:"collectDoc"
		},{
			path:'/collectComment',
			component:collectComment,
			name:"collectComment"
		},{
			path:'/collectBook',
			component:collectBook,
			name:"collectBook"
		},{
			path:'/collectCourse',
			component:collectCourse,
			name:"collectCourse"
		}
		];
	}
}
new Collect();