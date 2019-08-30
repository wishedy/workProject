<template>
    <section class="al-mainInner">
        <livingList></livingList>
    </section>
</template>

<script type="text/ecmascript-6">
    import livingList from "./components/livingList.vue";
    export default {
        components: {
            livingList
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    /*@import "../../../../css/pages/living/personal_livingList";*/
    @import "scss/pages/living/personal_livingList.scss";
</style>