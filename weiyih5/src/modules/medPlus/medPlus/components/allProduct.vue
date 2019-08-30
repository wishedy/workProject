<template>
    <section class="all-product">
        <h1 class="titleBar">
            <span>旗下产品</span>
            <span class="more" @click.stop="checkAllBrand" v-show="more">更多</span>
        </h1>
        <section class="all-product-list">
            <allProductItem v-for="(item,index) in dataList" :key="index" :productName="item.productName" :productAttUrl="item.productAttUrl||'//img10.allinmd.cn/v3/terminal/productListNoImg.png'" v-if="(index+1)<=maxLen" @click.native="gotoProductDetail(index)"></allProductItem>
        </section>
    </section>
</template>
<script>
    import allProductItem from  './allProductItem';
    export default {
        components:{
            allProductItem
        },
        props:{
            dataList:{
                default:[],
                type:Array
            },
            more:{
                default: false,
                type:Boolean
            },
            maxLen:{
                default:100000,
                type:Number
            }
        },
        methods:{
            gotoProductDetail(index){
              let t = this;
              //console.log(t.dataList[index]['productId']);
                t.$router.push({path:'productDetail',name:'productDetail',query:{
                        productId:t.dataList[index]['productId']
                    }});
            },
            checkAllBrand(){
                let t = this;
                t.$emit('checkMore');
            }
        }
    }
</script>