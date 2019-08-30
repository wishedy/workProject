<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <banner></banner>
        <productInfoBar></productInfoBar>
        <productParameter></productParameter>
        <productManual></productManual>
        <productList></productList>
        <brandIntroduction></brandIntroduction>
        <allProduct></allProduct>
    </section>
</template>
<script>
    import FastClick from "fastclick";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    window.FastClick = FastClick;
    FastClick.attach(document.body);
    import productInfoBar from './productInfoBar';
    import banner from './banner';
    import productParameter from './productParameter';
    import productManual from './productManual';
    import brandIntroduction from './brandIntroduction';
    import allProduct from './allProduct';
    import productList from './productList';
    export default {
        components:{
            HeaderBar,
            banner,
            productInfoBar,
            productParameter,
            productManual,
            brandIntroduction,
            allProduct,
            productList
        },
        data(){
            return {
                headerConfig: {
                    title: "相关产品",
                    backOnOff: true,
                    share: {
                        onOff: false,
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        }
    }
</script>
