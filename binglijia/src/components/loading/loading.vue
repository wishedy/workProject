<template>
    <section class="alEmr-loading">
        <img src="/static/images/common/loading.gif">
    </section>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
.alEmr-loading{
    width:50px;
    height:50px;
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 5;
    opacity: 0.8;
    cursor:wait;
    img{
        width:100%;
        height:100%;
    }
}
</style>
