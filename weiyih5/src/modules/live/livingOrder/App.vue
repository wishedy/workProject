<template>
    <section class="al-mainInner">
        <orderLists></orderLists>
    </section>
</template>
<script type="text/ecmascript-6">
    import orderLists from "./components/orderList.vue";
    export default {
        components: {
            orderLists
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/living/personal_myLiving.scss";
</style>