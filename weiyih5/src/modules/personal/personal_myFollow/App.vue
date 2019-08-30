<template>
	<section class="al-mainInner">
		<HeaderBar :header-config = "headerConfig"></HeaderBar>
		<nav class="al-personalNavbar ev-followNav" data-alcode-mod="472" data-alcode-item-selector="figure" data-alcode-mod-max-idx="3">
			<router-link to="/followCase" replace tag="figure" class="al-personNavbarItem">
				<figcaption>病例</figcaption>
			</router-link>
			<router-link to="/followTopic" replace tag="figure" class="al-personNavbarItem">
				<figcaption>话题</figcaption>
			</router-link>
			<router-link to="/followTag" replace tag="figure" class="al-personNavbarItem">
				<figcaption>标签</figcaption>
			</router-link>
		</nav>
		<router-view></router-view>
	</section>
</template>
<style lang="scss" rel = "stylesheet/scss ">
	@import "scss/base.scss";
	@import "scss/pages/personal/personal_myFollow.scss";
	.al-personalNavbar .al-personNavbarItem {
		color: #777777;
		margin: 0 0.6rem;
		text-align: center;
		padding: 0 0.2rem;
		padding-bottom: 0.16rem;
		border-box: border-box;
	}
	.icon-contentWatchedNum {
		margin-right: 0.53333rem;
	}
	.icon-contentWatchedNum:before {
		content: "";
		display: inline-block;
		width: 0.38667rem;
		height: 0.25333rem;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAATCAMAAABbR/ZNAAAAnFBMVEUAAAC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSkZPKXAAAAM3RSTlMAAQMEBg8QFhgZHDIzNDdCSExOVGRmaGxwc3WDmJmgoq+yxsnM0NLT2tvf4OHk5fLz9PZwUSWrAAAA4UlEQVQoz4VS2RaCIBRES4vcKs0lt1ITlyi0//+3FChTjyceuAPDXQcAPkvch3n7avNwL4LpWp2q0jegDA2/qE6rMakhdBQ4Fg450n5Jrzn/hhPPxBsO0V2lQDZdU6ZIqSP+fH1FWwocksQJcSjeZNc19bykEiOx3u06ZrSUXnrvADFSJjq1OmHBpVsAgP3YsQRmwstITGYhtsHT4pduzEHscmA9gY3hgu/uYXd5bwt5UfC35q7fbDPrd4tYv/2samUyK/UeDaP1yGTOjTfWKD98NTqisUZU34LrW870Xfgbb2STFQHe7MBlAAAAAElFTkSuQmCC') center center no-repeat;
		background-size: 100% 100%;
		vertical-align: -0.02rem;
		margin-right: 0.13333rem;
	}
	.al-personNavbarItem.router-link-active{
		color: #3598bd;
		border-bottom: 0.05333rem solid #3598db;
	}

</style>
<script>
	import comm from "static/js/comm.js";
	import HeaderBar from "components/HeaderBar/HeaderBar.vue";
	import List from "components/ListTemplate/OneImgList.vue";
	import router from 'vue-router';
	import user from 'static/js/module.user.js';
	import followCase from './components/FollowCase.vue';
	import FastClick from "fastclick";
	window.FastClick = FastClick;
	FastClick.attach(document.body);
	export default{
		data(){
			return{
				headerConfig:{
					title:"关注的",
					backOnOff:true,
					backFn:function(){
						history.back();
					},
					share: {
						onOff: false,
					},
					feedback: {
						onOff: false
					},
				},
				activeNum:0
			}
		},
		components:{
			HeaderBar,List
		},
		beforeMount(){
			this.$router.replace({
				path:'/followCase',
			});
		},
		mounted(){
			user.privExecute({
				operateType:'auth',
				callback:function(){}
			});
		},
		methods:{

		},
		watch:{

		}
	}
</script>

