<template>
    <section class="al-middleTipsBox">
        <section class="al-middleTipsModal ev-commTips" :class="{show:config.seen}">
            <figure class="al-middleTipsModalText">
                <p class="tipText">{{config.msg}}</p>
            </figure>
        </section>
    </section>
</template>

<script>
    /**
     * @Desc：popup/popupFn方法
     * @Usage: 引用该组件，绑定自定义属性:popup-config="popupConfig"
     * this.popupConfig = JSON.stringify({
                                "msg":"已关注",
                                "seen":true,
                                "time":3000      //这里可以设置多少毫秒消失
                           })
     * @Notify：demo见发现页-特色栏目列表页
     * @Depend：
     *
     * Created by dinglindong on 17/11/30.
     *
     */
    export default {
        data(){
            return {
                config:{
                    seen:false,
                    msg:String,
                    time:Number
                },
            }
        },
        props:["popupConfig"],
        watch:{
            popupConfig(){
                if(JSON.parse(this.popupConfig).seen){
                    this.config = JSON.parse(this.popupConfig);
                    let t = this;
                    setTimeout(function() {
                        t.config.seen = false;
                    }, t.config.time)
                }
            }
        }
    }
</script>