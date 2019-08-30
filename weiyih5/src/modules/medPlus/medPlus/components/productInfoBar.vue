<template>
    <section class="productInfoBar">
        <h1 class="title" v-text="productName"></h1>
        <p class="brand-info">
            <span class="product-brand">所属品牌：</span>
            <span class="product-brand-name" v-text="brandName" @click="clickBrand"></span>
        </p>
    </section>
</template>
<script>
    export default {
        props:{
            productName:{
                default:'',
                type:String
            },
            brandName:{
                default:'',
                type:String
            }
        },
        methods:{
            clickBrand(){
               let t = this;
               //console.log('点击');
               t.$emit('brandDetail');
            }
        }
    }
</script>