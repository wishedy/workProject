<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <meetingLists></meetingLists>
    </section>
</template>
<script type="text/ecmascript-6">
    import meetingLists from "./components/meeting_detail.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        components: {
            meetingLists,
            WakeApp
        },
        data(){
            return {
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                }
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/meeting/meeting.scss";
</style>
