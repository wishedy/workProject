<template>
    <section class="al-product-list">
        <section class="al-searchProduct-item" v-for="(v,i) in productList" @click.stop="jumpProduct(v)">
            <figure class="searchProduct-logo"  :style="{background: 'url('+checkUrl(v.attPath)+') no-repeat center center/cover'}" >
                <span class="icon" v-if="((parseInt(v.operationType,10)===2)&&(userId==v.customerId)&&(v.customerId!=0))">我的</span>
<!--                <span class="iconVendor" v-if="((parseInt(v.operationType,10)===3))">推广</span>-->
            </figure>
            <section class="searchProduct-detail">
                <div class="searchProduct-title" v-text='cutStr(v.productName,46)'></div>
                <div class="searchBrand-title" v-text="v.brandName"></div>
            </section>
        </section>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache.js";
    import productItem from './productItem';
    import comm from 'static/js/comm.js';
    import axios from "axios"
    export default  {
        data(){
            return {
                productList:[],
                userId:TempCache.getItem('userId')
            }
        },
        props:{
            resourceType:{
                default:'1',
                type:String
            },
            resourceId:{
                default:'',
                type:String
            }
        },
        components:{
            productItem
        },
        mounted(){
            let t = this;
            t.getProductList();
        },
        methods:{
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            checkUrl(linkUrl){
              let t = this;
              if(t.checkInvalid(linkUrl)){
                  return '//img10.allinmd.cn/v3/terminal/productListNoImg.png';
              }else{
                  return linkUrl;
              }
            },
            checkInvalid(val){
              return comm.checkInvalid(val);
            },
            jumpProduct(v){
                let t = this;
                g_sps.jump(null,`/dist/medPlus/medPlus.html?#/productDetail?productId=${v.productId}`);
            },
            goToProductDetail(index){
                let t = this;
                /*this.$router.push({path:'xxx',query:{aa:xx, bb: xx}});*/
                t.$router.push({path:'productDetail',name:'productDetail',query:{
                        productId:t.productList[index]['productId']
                    }});
            },
            getProductList(){
                let t = this;
                axios.get('/mcall/cms/resourceCategory/getMapList/', {
                    params: {
                        paramJson: {
                            "resourceType": t.resourceType,
                            "resourceId": t.resourceId  ,
                            "categoryType": 4,
                            "pageIndex": 1,
                            "pageSize": 10000,
                            "isValid": 1,
                            "sortType": 5,
                            "vFlag": "3.8"
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.data_list&&res.data.responseObject.responseData.data_list.length>0){
                            t.productList = res.data.responseObject.responseData.data_list;
                            //console.log(res.data.responseObject.responseData.data_list);
                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
            }
        }
    }
</script>