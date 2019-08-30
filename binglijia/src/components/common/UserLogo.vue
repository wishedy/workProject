<template>
    <section class="alEmr-userLogo">
        <a :href="href">
            <img :src="logoUrl" alt="">
            <span>{{userName}}</span>
        </a>
    </section>
</template>
<script>
    import comm from "~utils/comm.js";
    import TempCache from '~utils/tempcache.js';
    import user from "~utils/user.js";
    export default {
        data(){
            return {
                href:"",
                userName:"",
                logoUrl:""
            }
        },
        methods:{
            getLogo(){
                let t=this;
                comm.ajax2({
                    url: '/call/commdata/getLogoUrlList/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            logoType:4,
                            logoSpec:2,
                            logoUseFlag:3,
                            refId:comm.cookie.get("userId")
                        })
                    },
                    success:function(res){
                        if(res && res.responseObject.length>0){
                            t.logoUrl=res.responseObject[0].logoUrl.replace("https:",'');
                        }
                    }
                })
            }
        },
        mounted(){
            let t=this;
            user.login({
                scene:0,
                callback(){
                    t.href="//www.allinmd.cn/pages/personal/personal_contribution.html";
                    t.userName = TempCache.getItem("userName");
                    t.getLogo();
                }
            });
        }
    }
</script>
<style lang="scss">
    .alEmr-userLogo{
        float: left;
        margin: 18px 0 18px 30px;
        img{
            display: inline-block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            float: left;
        }
        span{
            display: inline-block;
            height: 40px;
            color:#626F8C;
            vertical-align: middle;
            line-height: 40px;
            float: left;
            margin-left: 10px;
        }
        a{
            cursor:pointer;
            &:after {
                content: '';
                display: table;
                clear: both;
            }
        }
    }
</style>
