<template>
    <section class="commentCollageNav" v-show="state">
        <!--无全书阅读-->
        <div class="noPandect" v-if="noBook">
            <p @click="comment"><i></i><span>评论</span></p>
            <p @click="collect"><i></i><span>{{collected?'已收藏':'收藏'}}</span></p>
        </div>

        <!--有全书阅读-->
        <div class="BookComment" v-if="haveBook">
            <p @click="comment"><i></i><span>评论</span></p>
            <p :class="{active:collected}" @click="collect"><i></i><span>{{collected?'已收藏':'收藏'}}</span></p>
        </div>
        <div class="BookFree" @click="callApp" v-if="haveBook">免费阅读</div>
    </section>
</template>

<script>
    import axios from 'axios';
    import user from 'static/js/module.user';
    import {mapActions} from "vuex";
    import commApp from "static/js/comm.app";
    import comm from "static/js/comm";
    import TempCache from "static/js/tempcache";
    const PATH = {
        collect:"/mcall/customer/collection/create/",         //收藏
        cancelCollect:"/mcall/customer/collection/delete/"    //取消收藏
    };
    export default {
        data(){
            return {
                collected:false,
                params:{
                    "collectionType":17,
                    "refId":this.$store.state.bId,
                    "customerId":this.$store.state.customerId
                },
                bookName:'',
                state:false,
                noBook:false,
                haveBook:false
            }
        },
        methods:{
            comment(){
                let t = this;
                user.privExecute({
                    operateType: 'auth',
                    callback:function(){
                        TempCache.setItem('commentFromPage', window.location.href);
                        let url = '/pages/common/comment.html?resourceId=' + t.params.refId + '&username=' + t.bookName + '&type=2&parentId=0&refCustomerId' + t.params.refId + '';
                        g_sps.jump(null,url);
                    },
                    noNeedBack:true
                })
            },
            collect(){
                let t = this;
                user.privExecute({
                    operateType: 'auth',
                    callback: function () {
                        if(t.collected) {
                            t.trigger(true);
                            axios({
                                url: PATH.cancelCollect,
                                method: "POST",
                                data: t.params,
                                transformRequest: [data => {
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res => {
                                t.trigger(false);
                                t.collected = false;
                            });
                        }else{
                            t.trigger(true);
                            axios({
                                url:PATH.collect,
                                method:"POST",
                                data:t.params,
                                transformRequest: [data=>{
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res=>{
                                t.trigger(false);
                                t.collected = true;
                            });
                        }
                    },
                    noNeedBack:true
                });
            },
            ...mapActions(["trigger"]),
            callApp(){
                let t = this;
                let amChannel = comm.getpara()._amChannel;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + t.params.refId + "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:" + t.params.refId + ",tplPath:286" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + t.params.refId + "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                commApp.appWakeUp("confirm", callAppOptions);//唤醒app弹层
            }
        },
        watch:{
            "$store.state.name"(){
                this.bookName = this.$store.state.name;
            },
            "$store.state.bookstate"(){
                let hasBook = this.$store.state.bookstate.hasBook;
                let hasArticle = this.$store.state.bookstate.hasArticle;
                if(hasBook ==1 && hasArticle ==1){
                    this.haveBook = true;
                }
                if(hasBook ==1 && hasArticle ==0){
                    this.haveBook = true;
                }
                if(hasBook ==0 && hasArticle ==1){
                    this.noBook = true;
                }
                if(hasBook ==0 && hasArticle ==0){
                    this.noBook = true;
                }
                this.state = true;
            }
        }
    }
</script>

<style scoped>
    [v-cloak]{
        display: none;
    }
    .commentCollageNav p:first-child i {
        width: .53333rem;
        height: .53333rem;
        background: url('//img50.allinmd.cn/v3/icon/toolbar_comment.png') no-repeat;
        background-size: contain;
        margin: 0 auto;
    }
    .commentCollageNav p:last-child i {
        width: .53333rem;
        height: .53333rem;
        background: url('//img50.allinmd.cn/v3/icon/toolbar_like.png') no-repeat;
        background-size: contain;
        margin: 0 auto;
    }
    .commentCollageNav p:last-child.active i {
        background: url('//img50.allinmd.cn/v3/icon/toolbar_liked.png') no-repeat;
        background-size: contain;
    }
</style>