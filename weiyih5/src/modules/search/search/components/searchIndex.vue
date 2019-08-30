<template>
    <section class="al-searchResultContent active ev-main" data-role="main">
        <section class="al-searchInner">
            <HotBar></HotBar>
            <HistoryBar></HistoryBar>
        </section>
    </section>
</template>
<script>
    import HotBar from "./HotBar.vue"
    import HistoryBar from "./HistoryBar.vue"
    export default {
        data(){
            return {
                mag:"111"
            }
        },
        components:{
            HotBar:HotBar,
            HistoryBar:HistoryBar
        }
    }
</script>