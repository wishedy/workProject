<template>
    <section class="browserUpgrade" v-if="showAlertStatus">
        <aside class="content">
            <p class="close" @click="close"><span></span></p>
            <figure class="upgradeTip"><img src="//img10.allinmd.cn/v3/upload_case/unhappy.png"> </figure>
            <p class="upgradeText">您的浏览器版本过低，将无法上传图片或视频，可下载推荐浏览器后再发布</p>
            <ul class="upgradeCont">
                <li>
                    <a href="http://www.microsoft.com/zh-cn/download/Internet-Explorer-11-for-Windows-7-details.aspx" target="_blank">
                        <img src="//img10.allinmd.cn/v3/upload_case/ie.png">
                        <p>升级至新版本 IE 浏览器</p>
                    </a>
                </li>
                <li>
                    <a href="https://www.baidu.com/link?url=wkitDqmRRoU8ivb_fGcGfwSYMVqSY3bAP0T7Q8VvuuSHq1hG5gCBLm_BvvA15MdfLWIVxifS0ahk7xNueXChfa&wd=&eqid=e69ae8450002f802000000035b4f1fd5" target="_blank">
                        <img src="//img10.allinmd.cn/v3/upload_case/Google.png">
                        <p>使用Google Chrome 浏览器</p>
                    </a>
                </li>
                <li>
                    <a href="../newCases/index.html?edit=0#/baseInfo" target="_blank"  @click="newCaseclick">
                        <img src="//img10.allinmd.cn/v3/upload_case/nopicture.png">
                        <p>继续发布无图病历</p>
                    </a>
                </li>
            </ul>
        </aside>
    </section>
</template>

<script>
    export default {
        name: 'ieAlert',
        props:['showAlert'],
        data(){
            return {
                showAlertStatus:this.showAlert,
            }
        },
        watch:{
            showAlert(){
                if(this.showAlert){
                    this.showAlertStatus=this.showAlert;
                }
            }
        },
        methods:{
            close(){
                this.showAlertStatus=!this.showAlertStatus;
            },
            newCaseclick(){
                sessionStorage.removeItem("emrNewCaseCaseId");
                sessionStorage.setItem('newCasesSource',window.location.href);
                let t=this;
                setTimeout(function() {
                    t.close();
                },100)

            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
@import "../../assets/scss/components/ieAlert.scss";
</style>
