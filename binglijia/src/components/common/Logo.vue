<template>
    <section class="alEmr-logo"><a href="/"></a> </section>
</template>
<script>
    export default {}
</script>
<style lang="scss">
    .alEmr-logo{
        width: 143px;
        height: 37px;
        /*padding-top: 51px;*/
        margin: 51px auto 0 auto;
        background: url("/static/images/common/logo.png") no-repeat center 50%;
        cursor: pointer;
        a{
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
    @media screen and (max-width:1540px){
        .alEmr-logo{
            background: url("/static/images/common/logoSmall.png") no-repeat center 50%;
            width: 37px;
            height: 37px;
        }
    }
</style>
