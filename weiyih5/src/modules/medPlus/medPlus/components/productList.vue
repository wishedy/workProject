<template>
    <section class="al-product-list">
        <productItem v-for="(item,index) in productList" :key="index" :productName="cutStr(item.productName,60)" :brandName="item.brandName" :attPath="item.attPath||'//img10.allinmd.cn/v3/terminal/productListNoImg.png'" @click.native="goToProductDetail(index)" :config="item"></productItem>
    </section>
</template>
<script>
    import productItem from './productItem';
    import comm from 'static/js/comm.js';
    import axios from "axios"
    export default  {
        data(){
          return {
              productList:[]
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
                            "sortType": 5
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