<template>
    <section class="collection" data-alcode-mod="647" data-alcode="e117" @click="collectTrigger">{{des}}</section>
</template>
<script>
    import comm from 'static/js/comm'
    import user from 'static/js/module.user'
    const courseId = comm.queryParam("tId");
    import TempCache from "static/js/tempcache.js"
    const  xhrUrl = {
        deleteCollect:"/mcall/customer/collection/delete/",
        createCollect:"/mcall/customer/collection/create/"
    };
    export default {
        data(){
            return {
                state:0
            }
        },
        computed:{
            courseInfo(){
                return this.$store.state.courseInfo
            },
            des(){
                let t = this;
                return (t.state===0)?"收藏":"已收藏";
            }
        },
        methods:{
            collectTrigger(){
                let t = this;
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        if (TempCache.getItem("customerRole") == 2 || TempCache.getItem("customerRole") == 3 || TempCache.getItem("customerRole") == 4) {

                        } else {
                            if (t.state === 0) {
                                $.ajax({
                                    url: xhrUrl.createCollect,
                                    data: {
                                        paramJson: $.toJSON({
                                            "collectionType": "18",
                                            "refId": courseId,
                                            "customerId": TempCache.getItem("userId")
                                        })
                                    },
                                    success: function (data) {
                                        if (data.responseObject.responseStatus == true) {
                                            t.$store.state.popupConfig = JSON.stringify({
                                                "msg":"收藏成功",
                                                "seen":true,
                                                "time":1500      //这里可以设置多少毫秒消失
                                            });
                                            t.state =1;
                                        }
                                    }
                                });
                            } else {
                                $.ajax({
                                    url: xhrUrl.deleteCollect,
                                    data: {
                                        paramJson: $.toJSON({
                                            "collectionType": "18",
                                            "refId": courseId,
                                            "customerId": TempCache.getItem("userId")
                                        })
                                    },
                                    success: function (data) {
                                        if (data.responseObject.responseStatus == true) {
                                            t.$store.state.popupConfig = JSON.stringify({
                                                "msg":"取消收藏成功",
                                                "seen":true,
                                                "time":1500      //这里可以设置多少毫秒消失
                                            });
                                            t.state =0;
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        },
        watch:{
            courseInfo(){
                let  t = this;
                let nowData = JSON.parse(t.$store.state.courseInfo);
                t.state = parseInt(nowData.isCollected,10);
            }
        }
    }
</script>