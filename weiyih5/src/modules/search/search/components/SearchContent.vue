<template>
    <section class="ev-mainInner">
        <router-view></router-view>
    </section>
</template>
<script>
    import SearchIndex from "./searchIndex.vue"
    export default {
        components:{
            SearchIndex:SearchIndex
        }
    }
</script>