<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum">
        <section class="al-product-list">
            <productItem v-for="(item,index) in brandList" :key="index" :productName="cutStr(item.productName,60)" :attPath="item['productAttUrl']||'//img10.allinmd.cn/v3/terminal/productListNoImg.png'" @click.native="goToProductDetail(index)" :config="item" :brandName="brandName"></productItem>
        </section>
        </vue-data-loading>
        <loading v-show="loading"></loading>
    </section>
</template>
<script>

    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    import productItem from './productItem';
    import comm from 'static/js/comm.js';
    import axios from "axios"

    export default  {
        data(){
            return {
                loading:false,
                completed:false,
                pageIndex:0,
                pageSize:20,
                distanceNum:100,
                brandList:[],
                headerConfig: {
                    title: "旗下产品",
                    backOnOff: true,
                    share: {
                        onOff: false,
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        components:{
            productItem,
            HeaderBar,
            VueDataLoading,
            loading
        },
        computed:{
            brandId(){
                let t = this;
                return comm.getpara().brandId;
            },
            brandName(){
                let t = this;
                return comm.getpara().brandName;
            }
        },
        mounted(){
            let t = this;
            document.title = '旗下产品';
            t.getProductList();
        },
        methods:{
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            goToProductDetail(index){
                let t = this;
                t.$router.push(
                    {path:'productDetail',name:'productDetail',query:{
                        productId:t.brandList[index]['productId']
                    }
                }
                );
            },
            "infiniteScroll"(){
                let t = this;
                setTimeout(() => {
                    if(!t.completed){
                        t.getProductList();
                    }else{
                        return false;
                    }
                }, 300)
            },
            getProductList(){
                let t = this;
                if(!t.loading){
                    t.loading = true;
                    axios.get('/mcall/med/product/getProductList/', {
                        params: {
                            paramJson: {
                                "brandId": t.brandId,
                                "firstResult":t.pageIndex*t.pageSize,
                                "maxResult":t.pageSize
                            }
                        }
                    })
                        .then(function (res) {
                            if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                                t.brandList = t.brandList.concat(res.data.responseObject.responseData.dataList);
                                t.completed=(t.brandList.length<t.pageSize);
                                if(!t.completed){
                                    t.pageIndex++;
                                }
                                //console.log(res.data.responseObject.responseData.dataList);
                                //console.log('djdjdjdjdjj');
                            }else{
                                t.completed = true;
                            }
                            t.loading = false;
                        })
                        .catch(function (error) {
                            //console.log(error);
                        });
                }

            }
        }
    }
</script>