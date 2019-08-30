<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <HeaderBar :header-config = "headerConfig"></HeaderBar>
        <section data-alcode-mod='481' data-alcode-item-selector=".al-personalBrowsedItem">
            <section class="al-personalBrowsedPart" style="display:none" v-show="loginOnOff">
                <section class="al-personalBrowsedItem ev-security" v-on:click="jumpSec()" ref="secE">
                    <a href="javascript:;">帐号安全</a>
                    <!-- <p>安全等级<span>低</span></p>-->
                </section>
            </section>
            <section class="al-personalBrowsedPart">
                <section class="al-personalBrowsedItem" v-on:click="jumpFee" ref="feedE">
                    <a href="javascript:;">意见反馈</a>
                </section>
                <section class="al-personalBrowsedItem" v-on:click="jumpAbo" ref="aboutE">
                    <a href="javascript:;">关于唯医</a>
                </section>
            </section>
        </section>
        <button class="al-userQuit" v-show="loginOnOff" v-on:click="quitLogin()" id="loginOut" style="display:none" data-alcode-mod='482' data-alcode='e78' ref="quitE">
            退出当前帐号
        </button>
    </section>
</template>

<script type="text/ecmascript-6">
	import axios from 'axios';
	import TempCache from "static/js/tempcache.js";
	import comm from 'static/js/comm.js';
	import user from "static/js/module.user.js";
	import customer from 'static/js/comm-customer.js';
	import HeaderBar from "components/HeaderBar/HeaderBar.vue";
	import Vue from 'vue';
    const xhrUrl = {//接口地址
        cancelTempBindUrl:'/mcall/wx/allin/interact/cancleTempStorage/',//取消临时绑定
    };

    export default {
        data(){
            return{
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                },
                loginOnOff:false,
                headerConfig: {
                    title: "设置",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    }
                },
            }
        },
        components:{
            HeaderBar
        },
        methods:{
            isLogin(){
                let t = this;
                if(TempCache.getItem("userId")){//登录
                    t.loginOnOff=true;
                }
            },
            quitLogin:function () {//退出登录
                // this.loading = true;
                let t = this;
                /*
                目前都是绑定，没有临时绑定状态了，不再取消临时绑定
                */
                // if(comm.isWeiXin()){
                //     axios({
                //         url: xhrUrl.cancelTempBindUrl,
                //         method: "POST",
                //         data: {
                //             customerId:t.param.sessionCustomerId,
                //         },
                //         transformRequest: [function (data) {
                //             return "paramJson=" + JSON.stringify(data);
                //         }],
                //         headers: {
                //             'X-Requested-With': 'XMLHttpRequest'
                //         },
                //         timeout: 30000
                //     }).then(function (res) {
                //         let options  = {
                //             success(data) {
                //                 t.loading = false;
                //             },
                //             failed(){
					// 			t.loading = false;
                //             }
                //         };
                //         comm.successRequest(res.data,options);
                //     });
                // }
                //$.setCookie("wxBrowseAccessLock", null);
                customer.asyncExecute("logout",null,function(re){
                    TempCache.clear();
                });
                comm.redirect("/");
            },
			jumpSec:function(){
            	let t =this;
				if(window.g_sps){
					g_sps.jump($(t.$refs.secE),"/dist/personal/personal_security.html");
				}else{
					setTimeout(function(){
						g_sps.jump($(t.$refs.secE),"/dist/personal/personal_security.html");
					},300)
				}
			},
			jumpAbo:function(){
				let t =this;
				if(window.g_sps){
					g_sps.jump($(t.$refs.aboutE),"/pages/personal/about.html");
				}else{
					setTimeout(function(){
						g_sps.jump($(t.$refs.aboutE),"/pages/personal/about.html");
					},300)
				}
			},
			jumpFee:function(){
				let t =this;
				if(window.g_sps){
					g_sps.jump($(t.$refs.feedE),"/dist/feedback.html");
				}else{
					setTimeout(function(){
						g_sps.jump($(t.$refs.feedE),"/dist/feedback.html");
					},300)
				}
			},
        },
        mounted(){
            let t = this;
            t.isLogin();//判断是否登录
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/personal/personal_config.scss";
</style>