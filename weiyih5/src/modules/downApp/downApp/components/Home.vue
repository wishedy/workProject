<template>
    <section class="al-downLoad-container">
        <section class="al-down-header">
            <div class="logo"></div>
            <div class="downBtn" @click.stop="downLoadApp">一键下载</div>
        </section>
        <section class="al-down-content index">

        </section>
        <section class="al-down-content college">
            <div class="title">遍邀顶尖专家亲自授课<br/> 独家课程学以致用</div>
        </section>
        <section class="al-down-content surgery">
            <div class="title">体系化课程全新上线<br/> 精品内容精心打造</div>
        </section>
        <section class="al-down-content cases">
            <div class="title">电子病历及患者管理<br/> 办公内容掌上呈现</div>
        </section>
        <section class="al-down-footer">
            <div class="logo"></div>
            <div class="downBtn" @click.stop="downLoadApp">一键下载</div>
        </section>
    </section>
</template>
<script>
    const xhrUrl = {
      AndroidDownLoadUrl:''
    };
    import {mapGetters} from 'vuex';
    import axios from "axios";
    import comm from 'static/js/comm.js';
    export default {
        computed:{
            ...mapGetters(['isWeiXin',"isIOS"])
        },
        methods:{
            downLoadApp(){
                let _this = this;
                console.log(_this.isWeiXin,_this.isIOS);
                if(_this.isWeiXin){
                    _this.$router.push({path:'/weixinReminder'});
                }else{
                    if (_this.isIOS){
                        comm.creatEvent({
                            triggerType:'H5下载页',
                            triggerName:'点击iOS下载',
                            keyword:'唯医app下载',
                            actionId:'11879',
                            browType:'438'
                        });
                        window.location.href = 'https://apps.apple.com/cn/app/%E5%94%AF%E5%8C%BB%E9%AA%A8%E7%A7%91-%E9%AA%A8%E7%A7%91%E5%8C%BB%E7%94%9F%E5%B7%A5%E4%BD%9C%E5%B9%B3%E5%8F%B0/id986266583';
                    }else{
                        comm.creatEvent({
                            triggerType:'H5下载页',
                            triggerName:'点击安卓下载',
                            keyword:'唯医app下载',
                            actionId:'11879',
                            browType:'438'
                        });
                        //alert("allin://com.allin.social:75235?data={}");
                        window.location.href = "allin://com.allin.social:75235?data={}";
                        setTimeout(()=>{
                            //window.location.href = "http://d.allinmd.cn:18181/app/Allinmd.apk";//线上
                            window.location.href = _this.androidUrl;//线下
                        },1000);
                    }
                }
            }
        },
        data(){
          return {
              androidUrl:"https://d.allinmd.cn:18181/app/Allinmd.apk"
          }
        },
        mounted(){
            let _this = this;
            axios.get('/mcall/h5/config/getConfig/')
                .then(function (response) {
                    console.log(response);
                    _this.androidUrl = response.data.responseObject[0]['linkUrl']
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
</script>
