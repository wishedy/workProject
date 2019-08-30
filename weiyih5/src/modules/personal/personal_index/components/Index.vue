<template>
    <section>
        <headerBar></headerBar>
        <TabHeader></TabHeader>
        <index-list></index-list>
    </section>
</template>

<script>
    import TabHeader from "./TabHeader";
    import headerBar from "./HeaderBar";
    import indexList from "./indexList";
    export default {
        name: "index",
        components:{
            headerBar,
            TabHeader,
            indexList
        }
    }
</script>

<style scoped>

</style>