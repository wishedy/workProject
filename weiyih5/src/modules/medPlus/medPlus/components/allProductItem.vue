<template>
    <section class="all-product-item">
         <figure class="product-logo">
             <img :src="productAttUrl" alt="">
         </figure>
        <article class="product-info">
            <p class="content" v-text="productName"></p>
        </article>
    </section>
</template>
<script>
    export default {
        props:{
            productName:{
                default:'',
                type:String
            },
            productAttUrl:{
                default:'',
                type:String
            },
        }
    }
</script>