<template>
    <header class="al-tagSeminarHeader" data-alcode-mod="422" v-cloak>
        <a href="javascript:;" data-alcode="e52" class="ev-digHole" @click="returnBack">
            <img src="//img50.allinmd.cn/pages/personal/others_back.png" alt="">
        </a>
        <section class="al-tagSeminarHeaderContent">
            <article class="al-tagSeminarHeaderTitle EV-tagTitleMessage">
                <h2 class="al-tagSeminarTitle EV-tagTitle">{{info.propertyName}}</h2>
                <article class="al-tagSeminarNumMsg">
                    <span>共<em>{{info.sourceNum}}</em>个资源</span>
                    <a href="javascript:;" class="ev_digHole1" @click="supplementCase">
                        <i class="icon-tagConfig"></i>补充病例
                    </a>
                </article>
            </article>
            <figure class="al-tagSeminarFollow EV-follow" :class="{'EV-follow':relationship!=1,'EV-followed':relationship==1}" @click="followTag">
                <button class="al-whiteBtn" data-alcode="e53" v-html="relation(relationship)"></button>
            </figure>
        </section>
        <Popup :popup-config="popupConfig"></Popup>
    </header>
</template>
<script>
    import comm from 'static/js/comm.js';
    import app from 'static/js/comm.app';
    import user from 'static/js/module.user.js';
    import TempCache from "static/js/tempcache.js";
    import Popup from "components/PopupLayer/PopupLayer";

    const xhrUrl = {
        "info":"/mcall/recommend/tag/resource/json_info/",
        create:"/mcall/customer/follow/resource/create/"
    };
    export default {
        data(){
            return {
                info:Object,
                popupConfig:Object
            }
        },
        mounted(){
          this.getInfo();
        },
        components:{
            Popup
        },
        watch:{
            propertyName(){
                let t = this;
                var keywords = t.propertyName + '，关注标签，' + t.propertyName + '病例，' + t.propertyName + '视频，' + t.propertyName + '文库，' + t.propertyName + '话题，唯医,allinmd';
                document.title = t.propertyName + "－关注标签,资源更新提醒,唯医,allinmd"
                $("meta[name='keywords']").attr("content", keywords);
            },
            wantFollow(){
                let t = this;
                if(t.wantFollow){
                    t.followTag();
                }
            }
        },
        computed:{
            wantFollow(){
              let t = this;
              return t.$store.state.wantFollow;
            },
            relationship(){
                let t = this;
                return t.$store.state.followState;
            },
            tagId(){
                let t = this;
                return (t.$store.state.tagId)  ;
            },
            propertyName(){
                let t = this;
                return (t.$store.state.propertyName)  ;
            },
            customerId(){
                let t = this;
                return t.$store.state.customerId;
            }
        },
        methods:{
            supplementCase(){
                if(TempCache.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        let androidParam = `{}`;
                        let iosParam = ``;
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    let t = this;
                    if (TempCache.getItem('auth') && TempCache.getItem('auth') != null) {
                        var state = JSON.parse(TempCache.getItem('auth')).state;
                        if (state != 2 && state != 7 && state != 8 && state != 9) {
                            user.privExecute({
                                operateType: 'auth',
                                callback: function () {
                                },
                                noNeedBack: true
                            })
                            return false;
                        }
                    }
                    comm.creatEvent({
                        triggerType: '发布',
                        keyword: t.tId,
                        actionId: 34,
                        refId: t.tId,
                        async: false
                    });
                    let amChannel = comm.getpara()._amChannel;
                    app.newReleaseBox({
                        imgPath: "//img50.allinmd.cn/case/release.png",
                        title: "补充病例需使用唯医骨科App",
                        solidBtnTitile: "立即使用",
                        authNoneTitle: "暂不使用",
                        data: {
                            el: ".solidBtn",
                            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId=" + t.tId + (amChannel ? "&_amChannel=" + amChannel : ''),
                            android: "allin://com.allin.social:75235?data={scene:3,type:54,sourceId=" + t.tId + (amChannel ? ",_amChannel:" + amChannel + "}" : ''),
                            ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId=" + t.tId + (amChannel ? "&_amChannel=" + amChannel : ''),
                        }
                    });
                }
            },
            returnBack(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
              window.history.back();
            },
            followTag() {
                if(TempCache.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        let androidParam = `{}`;
                        let iosParam = ``;
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    let t = this;
                    let nowState = parseInt(t.relationship, 10);
                    let param = {
                        "followType": 61,
                        "customerId": t.customerId,
                        "refId": t.tagId,
                        "refName": t.info.propertyName
                    };
                    if (nowState === 0) {
                        comm.creatEvent({
                            triggerType: '关注',
                            pushMessageId: t.tagId,
                            refId: t.tagId,
                            actionId: 7
                        });
                        user.privExecute({
                            callback: function () {
                                comm.creatEvent({
                                    triggerType: '关注',
                                    pushMessageId: t.tId,
                                    actionId: 4
                                });
                                comm.ajax({
                                    url: xhrUrl.create,
                                    method: "POST",
                                    paramJson: true,
                                    data: param,
                                    success: function (res) {
                                        if (res.data.responseObject.responseStatus) {
                                            t.popupConfig = JSON.stringify({
                                                "msg": "已关注",
                                                "seen": true,
                                                "time": 1500      //这里可以设置多少毫秒消失
                                            });
                                            setTimeout(function () {
                                                t.popupConfig = JSON.stringify({
                                                    "msg": "已关注",
                                                    "seen": false,
                                                    "time": 1500      //这里可以设置多少毫秒消失
                                                });
                                            }, 100);
                                            t.$store.state.followState = 1;
                                        }
                                    }
                                });
                            },
                            operateType: "auth",
                            noNeedBack: true
                        })

                    } else {
                        comm.creatEvent({
                            triggerType: '取消关注',
                            pushMessageId: t.tagId,
                            refId: t.tagId,
                            actionId: 69
                        });
                        t.$store.state.confirmOption = true;
                    }
                }
            },
            relation(num){
              return (parseInt(num,10)===1)?"已关注":"关注";
            },
            getInfo(){
                let t = this;
                const param = {
                    "tagId": t.tagId,
                    "scene": 2,
                    "customerId": null,
                    "customerNum": 6
                };
                comm.ajax({
                    url: xhrUrl.info,
                    method: "POST",
                    paramJson: true,
                    data: param,
                    success: function (res) {
                        let options = {
                            success(res) {
                                t.info = res.responseObject.responseData.data_list[0];
                                t.$store.state.followState = parseInt(t.info.relationship,10);
                                t.$store.state.baseInfo = JSON.stringify(t.info);
                                t.$store.state.propertyName = t.info.propertyName;
                            },
                            failed() {

                            }
                        };
                        comm.successRequest(res.data, options);
                    }
                })
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .al-tagSeminarHeaderTitle{
        .al-tagSeminarTitle{
            font-size: .42rem;
        }
    }

</style>
