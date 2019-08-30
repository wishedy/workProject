<template>
    <section class="productItem" v-if="!isEmptyObject(config)">
        <figure class="product-logo">
            <img :src="attPath" alt="">
        </figure>
        <article class="product-info">
            <h1 class="title" v-text="productName" :style="{marginBottom:(brandName.length===0)?'0':'0.21333rem'}"></h1>
            <p class="label" v-text="brandName" v-if="brandName.length"></p>
        </article>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
            productName:{
                default:'',
                type:String
            },
            attPath:{
                default:'//img10.allinmd.cn/v3/terminal/productListNoImg.png',
                type:String
            },
            brandName:{
                default:'',
                type:String
            },
            config:{
                default(){
                    return {};
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            }
        }
    }
</script>