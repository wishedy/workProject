<template>
    <section class="boneClass">
        <aside class="title"><p>{{item.specialTitle}}</p><p class="Ev-FollowBtn" :class="item.followState==1?'active' :'' " @click="follow(item.followState,item.specialTitle)">{{item.followState==1?'已关注':'关注'}}<span class="promptBoneClass" v-show="item.hasAnyFollow==0? true:false" @click.stop><img src="//img50.allinmd.cn/v3/discover/prompt02.png"></span></p></aside>
        <aside class="viewNum"><p><span>{{item.browseNum}}</span><span>人浏览</span></p><p><span class="Ev-followNum">{{item.followNum}}</span><span>人关注</span></p></aside>
        <aside class="introduction">{{content(item.specialContent)}}<a v-show="more" @click="moreLoad">更多信息</a></aside>
        <!--简介展开全部-->
        <section class="introductionBg" :style="parentLayer">
            <section class="introductionMore" :style="{height:highparam}">
                <i @click="close"></i>
                <p>{{item.specialContent}}</p>
            </section>
        </section>
        <!--简介展开全部 End-->
        <Loading v-show="ajaxing"></Loading>
        <Popup :popup-config="popupConfig"></Popup>
    </section>
</template>

<script>
    import axios from "axios";
    import Loading from "components/Loading/Loading";
    import Popup from "components/PopupLayer/PopupLayer";
    import comm from "static/js/comm";
    import TempCache from "static/js/tempcache";
    import user from "static/js/module.user";
    import {mapActions} from "vuex";

    const path = {
        info:"/mcall/special/getSpecialInfo/",
        follow:"/mcall/customer/follow/resource/create/",        //关注按钮
        cancelFollow:"/mcall/customer/follow/resource/delete/",  //取消关注
    };
    const param = {
        customerId:TempCache.getItem('userId')||"",
        platformId:TempCache.getItem('department')||1,
        specialId:comm.getpara().columnId||""
    };
    export default {
        data(){
            return {
                ajaxing:false,
                item:[],
                sceneType:Number,
                more:false,
                highparam:"",
                parentLayer:{
                    display:'none'
                },
                popupConfig:{},
                state:true,
                confirmOption:"",
                keyword:""
            }
        },
        methods:{
            detail(){
                this.ajaxing = true;
                axios({
                    url:path.info,
                    method:"POST",
                    data:{
                        customerId:param.customerId,
                        specialId:param.specialId,
                        visitSiteId:2
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    this.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let item = res.data.responseObject.responseData.data_list[0];
                        this.item = item;//初始化seo
                        if(item.seoName){
                            document.title=item.seoName+'-唯医,allinmd';
                        }else{
                            document.title=item.specialTitle+'-唯医,allinmd';
                        }
                        if(item.specialTitle){
                            let str = comm.getStrLen(item.specialTitle,14)
                            document.querySelector('.seoName').innerHTML = str;
                        }
                        if(item.seoKeyword){
                            document.getElementsByTagName('meta')['keywords'].setAttribute("content",""+item.seoKeyword+"");
                        }
                        if(item.seoDescribe){
                            document.getElementsByTagName('meta')['description'].setAttribute("content",""+item.seoDescribe+"");
                        }
                        //end
                        //处理背景图
                        let url = '';
                        if(item.linkUrl){
                            url = item.linkUrl;
                        }
                        document.querySelector('.boneClassCont').setAttribute('style','background:#fff url('+url+') no-repeat;background-size:100% 6.4rem;');
                        //end
                        if(item.specialType){
                            switch (parseInt(item.specialType)){
                                case 1:
                                    this.sceneType = 77; break;
                                case 2:
                                    this.sceneType = 76; break;
                                case 3:
                                    this.sceneType = 78; break;
                            }
                            let type = this.sceneType;
                            this.scene({type});
                        }
                    }
                })
            },
            moreLoad(){
                let h1rem = window.screen.availHeight-260;
                function rem(opx) {
                    var px = parseInt(opx);
                    return (px / 75) + 'rem';
                }
                this.highparam = rem(h1rem);
                this.parentLayer = {
                    'display':'block',
                    'overflow':'auto',
                }
                //document.querySelector('.boneClassCont').setAttribute('style','overflow:hidden,height:window.height()');
                comm.creatEvent({
                    triggerType:'功能按钮',
                    keyword:'栏目介绍-更多信息',
                    browsetype_url:param.specialId,
                    actionId:11041,
                    browsetype:218
                });

                $("body,html").css({
                    overflow:"hidden",
                    height:"100%"
                });
                $('.boneClassCont').css('overflow','hidden').css('height',$(window).height());
            },
            close(){
                this.parentLayer = {'display': 'none'};

                $("body,html").css({
                    overflow:"",
                    height:""
                });
                $('.boneClassCont').css('overflow','').css('height','');
                //document.querySelector('.boneClassCont').setAttribute('style',"");
            },
            content(v1){
                if(v1){
                    if(comm.getByteLen(v1)>66){
                        this.more = true;
                    }
                    return comm.getStrLen(v1,68)
                }
            },
            follow(follow,keyword){
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
                    user.privExecute({
                        operateType: 'auth',
                        noNeedBack: true,
                        callback: function () {
                            t.keyword = keyword;
                            if (follow != 1) {
                                t.ajaxing = true;
                                comm.creatEvent({
                                    triggerType: '关注',
                                    keyword: t.keyword,
                                    actionId: 11022,
                                    push_message_id: param.specialId,
                                    browsetype: 218
                                });
                                axios({
                                    url: path.follow,
                                    method: "POST",
                                    data: {
                                        refId: param.specialId,
                                        followType: "8",
                                        refName: t.keyword,
                                        customerId: param.customerId
                                    },
                                    transformRequest: [data => {
                                        return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {'X-Requested-With':'XMLHttpRequest'},
                                timeout: 30000
                                }).then(res => {
                                    t.ajaxing = false;
                                    if (res && res.data.responseObject.responseStatus == true) {
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
                                        t.item.followState = 1;
                                        t.item.hasAnyFollow = 1;
                                        t.item.followNum = t.item.followNum + 1;
                                    }
                                })
                            } else {
                                t.cancel()
                            }
                        }
                    });
                }
            },
            cancel(){
                this.$store.state.confirmOption = JSON.stringify(
                    {
                        "title": "是否取消关注？",// 标题文本 {string}
                        "cancel": "取消", //取消按钮文本 {string}
                        "ensure": "确定"// 确认按钮文本 {string}
                    }
                );
            },
            layerEnsure(){
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
                    t.ajaxing = true;
                    comm.creatEvent({
                        triggerType: '关注',
                        keyword: t.keyword,
                        actionId: 11022,
                        push_message_id: param.specialId,
                        browsetype: 218
                    });
                    axios({
                        url: path.cancelFollow,
                        method: "POST",
                        data: {
                            refId: param.specialId,
                            followType: "8",
                            refName: t.keyword,
                            customerId: param.customerId
                        },
                        transformRequest: [data => {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {'X-Requested-With':'XMLHttpRequest'},
                        timeout: 30000
                    }).then(res => {
                        t.ajaxing = false;
                        if (res && res.data.responseObject.responseStatus == true) {
                            t.item.followState = 0;
                            t.item.followNum = t.item.followNum - 1;
                        }
                    })
                }
            },
            layerCancel(){

            },
            ...mapActions(["firstTag","secondTag","scene"]),
        },
        mounted(){
            this.detail()
        },
        filters:{
            toWKH:value=>comm.toWKH(value),
        },
        components:{
            Loading,
            Popup,
        },
        watch:{
            '$store.state.confirmOption'(string) {
                let t = this;
                if (parseInt(string, 10) === 1) {
                    t.layerEnsure();
                } else if (parseInt(string, 10) === 0) {
                    t.layerCancel();
                }
            }
        },
    }
</script>