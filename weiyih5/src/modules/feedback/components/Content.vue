<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <header class="al-indexHeader">
            <figure class="al-indexHeaderItem">
                <a class="Ev-SetBackBtn ev_digHole" href="javascript:;" @click="back">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>意见反馈</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                </a>
            </figure>
        </header>
        <section class="al-personalContent">
            <section class="al-tableModule">
                <article class="al-tableModuleItem">
                    <textarea name="" id="Ev-settingSuggest" cols="" rows="" placeholder="请告诉我们您的想法" max="500" v-model="message"></textarea>
                    <span id="Ev-settingSugNum" class="al-textareaInputNum" :class="{signColor:(500-message.length)<0}">
                        {{nowNum}}
                    </span>
                </article>
            </section>
            <section class="al-tableModule al-buttonBox">
                <article class="al-tableModuleItem">
                    <button class="btn-primary-lg  Ev-setSubmitBtn" :class="{'al-msgWriting':(message.length<10)}" data-flag="1" @click="submitMessage">提交</button>
                </article>
            </section>
        </section>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache.js";
    import comm from "static/js/comm.js";
    import commPopup from "static/js/commPopup.js";
    import axios from "axios";
    const xhrUrl = {
        suggest:"/mcall/customer/suggestion/create/"
    };
    export default {
        data(){
          return {
              message:""
          }
        },
        computed:{
          nowNum(){
              let t = this;
              return 500-t.message.length;
          }
        },
        methods:{
            back(){
                window.history.back();
            },
            submitMessage(){
                let t = this;
                let cid=TempCache.getItem("userId");
                let reg = /discover_series_details/;
                let courseid = document.referrer.match(/tId=.{13}/)&&document.referrer.match(/tId=.{13}/)[0].substr(4);
                let suggestionType = "";
                if(reg.test(document.referrer)){
                    suggestionType = 8;
                    const sourceId = courseid;
                }else{
                    suggestionType =  (comm.getpara().from=="search"?3:1)
                }
                if(t.message.length>=10){
                    axios({
                        url: xhrUrl.suggest,
                        method: "POST",
                        data: {
                            suggestion:t.message,
                            customerName:TempCache.getItem("trueName"),
                            suggestionType:suggestionType ,
                            visitSiteId:2,
                            sourceId:courseid,
                            customerId:cid
                        },
                        transformRequest: [function(data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(function(res){
                        let data = res.data;
                        if (data && data.responseObject && data.responseObject.responseStatus) {
                            commPopup.popup("感谢您的反馈，我们会尽快处理！");
                            setTimeout(function () {
                                if (document.referrer != "") {
                                    history.back(-1);
                                } else {
                                    g_sps.jump(null,'/');
                                }
                                $(".Ev-setSubmitBtn").attr("data-flag", "1");
                            }, 3000)
                        } else {
                            commPopup.popup("提交失败，请稍后重试！");
                            setTimeout(function () {
                                $(".Ev-setSubmitBtn").attr("data-flag", "1");
                            }, 3000)
                        }
                    });
                }else{
                    return false;
                }

            }
        }
    }
</script>
<style scoped lang="scss">
    .signColor{
        color: #ff0000;
    }
</style>