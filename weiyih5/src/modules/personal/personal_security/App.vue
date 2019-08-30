<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <HeaderBar :header-config = "headerConfig"></HeaderBar>

        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem">
                <a href="javascript:void(0)">微信</a>
                <p class="weixin_status">{{bindWx()}}</p>
            </section>
            <section class="al-personalBrowsedItem noArrow">
                <a href="javascript:;">手机</a>
                <p class="mobile">
                    <span v-if="listData.mobile">{{listData.mobile.substr(0,3)+'****'+listData.mobile.substr(7)}}</span><button class="btn-done mobile_btn" v-if="listData.mobile">更换</button>
                    <button class="btn-done mobile_btn" v-if="!listData.mobile">绑定</button>
                </p>
            </section>
            <section class="al-personalBrowsedItem noArrow">
                <a href="javascript:;">邮箱</a>
                <p class="email">
                    <span v-text="getEmail(listData.email)"></span>
                    <button class="btn-done email_btn" @click.stop="jumpEma(listData.email)">{{listData.email?"更换":"绑定"}}</button>
                </p>
            </section>
            <!--<section class="al-personalBrowsedItem ev-bindCAOS">-->
                <!--<a href="javascript:;">CAOS帐号</a>-->
                <!--<p class="caos_status" v-text="getCaos(listData.uniteNameCaos)" v-on:click="jumpCaos(listData.uniteNameCaos)"></p>-->
            <!--</section>-->
        </section>
        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem ev-updatePassword" v-on:click="jumpPass()">
                <a href="javascript:;">修改密码</a>
            </section>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    import Loading from 'components/Loading/Loading.vue';
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm.js';
    import user from "static/js/module.user.js";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";

    const xhrUrl = {//接口地址
        bindSta:'/mcall/customer/unite/getCustomerUnite/',//判断绑定状态
    };

    export default {
        // props:['listData'],
        data(){
            return{
                wxState:'123',
                headerConfig: {
                    title: "帐号安全",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    },
                },
                listData:[]
            }
        },
        components:{
            HeaderBar
        },
        methods:{
            checkStu(){
                let t = this;
                axios({
                    url: xhrUrl.bindSta,
                    method: "POST",
                    data: {},
                    transformRequest: [function (data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function (rep) {
                    if(rep.data&&rep.data.responseObject&&rep.data.responseObject.responseMessage){
                        t.listData=rep.data.responseObject.responseMessage;
                        t.jumpMob();
                    }else{
                        t.listData = []
                    }
                });
            },
            jumpMob(){
                let t = this;
                document.getElementsByClassName('mobile_btn')[0].onclick=function () {
                    comm.redirect("/pages/personal/bindMobile.html");
                };
            },
            getEmail(ema){
                if (ema){
                    return ema.substr(0,2)+"****@***"+ema.substring(ema.length-3)
                }else{
                    return ''
                }
            },
            jumpEma(ema){
                if(ema){
                    comm.redirect("/pages/personal/updateEmail.html?email="+ema);
                }else{
                    comm.redirect("/pages/personal/bindEmail.html");
                }
            },
            jumpPass(){
                comm.redirect("/pages/personal/updatePassword.html");
            },
            //判断微信绑定状态
            isBindWeixin() {
                let t=this;
                comm.ajax2({
                    url: "/mcall/wx/customer/checkIfBind/",
                    type: "POST",
                    data: {},
                    async: false,
                    success: function (data) {
                        t.wxState=data.responseObject.responseStatus;

                    }
                });
            },
            bindWx(){
                if(this.wxState!='123'){
                    if(this.wxState){
                        return "已绑定";
                    }else {
                        return "未绑定";
                    }
                }

            }
        },
        mounted(){
            let t = this;
            t.checkStu();
            t.isBindWeixin();
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/personal/personal_safe.scss";
</style>