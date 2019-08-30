<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <banner :productAttachmentList="productAttachmentList" v-if="productAttachmentList.length!==0"></banner>
        <productInfoBar  :productName="cutStr(productName,80)" :brandName="brandName" @brandDetail="goToBrandDetail" v-if="productName.length!==0||brandName.length!==0"></productInfoBar>
        <productParameter class="productParameters"
                          :attentionParamList="attentionParamList"
                          :baseParamList="baseParamList"
                          :scopeParamList="scopeParamList"
                          :specTypeParamList="specTypeParamList"
                          v-if="(attentionParamList.length!==0)||(baseParamList.length!==0)||(scopeParamList.length!==0)||(specTypeParamList.length!==0)"
        ></productParameter>
        <brandIntroduction class="productParameters paddingBottomProduct" title="产品手册" type="0" :dataList="itemList" v-if="itemList.length!==0" :productName="productName" :productId="productId"></brandIntroduction>
        <productManual class="productParameters" :relatedContent="relatedContent" @scrollBottom="getRelatedContent" title="相关内容" :loading="loading" :completed="completed" v-if="relatedContent.length!==0"></productManual>
    </section>
</template>
<script>
    const $ = require('jquery');
    import TempCache from "static/js/tempcache.js";
    import app from 'static/js/comm.app.js';
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import banner from './banner';
    import productInfoBar from './productInfoBar';
    import productParameter from './productParameter';
    import brandIntroduction from './brandIntroduction';
    import productManual from './productManual';
    import comm from 'static/js/comm.js';
    import axios from "axios";
    export default {
        components:{
            HeaderBar,
            banner,
            productInfoBar,
            productParameter,
            brandIntroduction,
            productManual
        },
        data(){
            let t = this;
            return {
                loading:false,
                completed:false,
                pageIndex:0,
                pageSize:20,
                relatedContent:[],
                itemList:[],
                productName:'',
                brandName:'',
                brandId:'',
                attentionParamList:[],
                productAttachmentList:[],
                baseParamList:[],
                scopeParamList:[],//适用范围
                specTypeParamList:[],//规格型号
                headerConfig: {
                    title: "产品详情",
                    backOnOff: true,
                    share: {
                        title:"&nbsp;",
                        onOff: true,
                        params: {
                            "visitSiteId":2,
                            "customerId":TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
                            'productName':t.productName,
                            'productId':t.productId,
                            "sceneType": "88",
                            "platformId": 1
                        }
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        mounted(){
          let t = this;
          t.headerConfig.share.params.productId = t.productId;
          //console.log(t.headerConfig.share.params.productId);
          //console.log(t.productId);
            document.title = '产品详情';
          t.getProductInfo().productManual().getRelatedContent();
        },
        methods:{
            wakeUpApp(){
              let t = this;
                let androidParams = `{scene:3,type:87,sourceId:${t.productId},tplPath:0}`;
                let iosParams = `?scene=productDetailScene&productId=${t.productId}`;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html"+iosParams,
                    android: "allin://com.allin.social:75235?data="+androidParams,
                    ios9: "http://app.allinmd.cn/applinks.html"+iosParams,
                    runAtOnce: false
                };
                setTimeout(()=>{
                    app.appWakeUp("callBackAppend", callAppOptions,{dom:$('.al-medPlus-banner')},function(tpl){
                        $('.al-medPlus-header').after(tpl);
                    });//唤醒app弹层
                },300);
            },
            goToBrandDetail(){
              let t = this;
              //console.log('点击有效');
                t.$router.push({path:'brandDetail',name:'brandDetail',query:{brandId:t.brandId,'brandName':t.brandName}});
            },
            productManual(){
             let t= this;
                axios.get('/mcall/med/doc/getProductBook/', {
                    params: {
                        paramJson: {
                            "productId":t.productId,
                            "firstResult":'0',
                            "maxResult":'10000',
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            t.itemList = res.data.responseObject.responseData.dataList;

                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                return t;
            },
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            getRelatedContent(){
              let t = this;
              if(!t.loading){
                  t.loading = true;
                  //console.log(t.loading);
                  axios.get('/mcall/med/recommend/resource/item/getRelationContent/', {
                      params: {
                          paramJson: {
                              "resourceType": "4",
                              "resourceId": t.productId,
                              "firstResult":t.pageIndex*t.pageSize,
                              "maxResult":t.pageSize
                          }
                      }
                  })
                      .then(function (res) {
                          if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                              t.relatedContent = t.relatedContent.concat(res.data.responseObject.responseData.dataList);
                              t.completed=(t.relatedContent.length<t.pageSize);
                              if(!t.completed){
                                  t.pageIndex++;
                              }
                          }else{
                              t.completed = true;
                          }
                          //console.log(t.loading);
                          t.loading = false;
                          //console.log(t.loading);

                      })
                      .catch(function (error) {
                          //console.log(error);
                      });
              }
                return t;
            },
            getProductInfo(){
                let t = this;
                axios.get('/mcall/med/product/getProductDetail/', {
                    params: {
                        paramJson: {
                            "productId":t.productId
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            let productInfo = res.data.responseObject.responseData.dataList[0];
                            t.brandName = productInfo.brandName;
                            t.brandId = productInfo.brandId;
                            t.productName = productInfo.productName;
                            t.attentionParamList = productInfo.attentionParamList;
                            t.productAttachmentList = productInfo.productAttachmentList;
                            //console.log(t.productAttachmentList);
                            t.baseParamList = productInfo.baseParamList;
                            t.scopeParamList = productInfo.scopeParamList;//适用范围
                            t.specTypeParamList =productInfo.specTypeParamList;//规格型号\
                            t.wakeUpApp();
                            setTimeout(()=>{
                                t.showBigImage(t.productAttachmentList.length);
                            },300);
                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                return t;
            },
            showBigImage(num){
                bigPicShow.init({
                    /**
                     * 指定多个class|| ID
                     * */
                    domIdList:[".al-medPlus-banner"],
                    topSwiperOptions:{
                        // loop: false, // 开启循环模式,必须设置loopedSlides
                        // loopedSlides: num, //looped slides should be the same
//            autoplay : 5000,//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                        preventClicks:false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                        pagination : '.swiper-pagination', //分页器
                        paginationFractionRender: function (swiper, current, total) {
                            var _inf = $(swiper.wrapper).find('.swiper-slide').eq(swiper.activeIndex).find('img').attr('alt');
                            return '<span class="' + current + '"></span>' +
                                ' / ' +
                                '<span class="' + total + '"></span>'+
                                '<div class="ev-imgInfo imgInfo_text">'+ (_inf!=undefined?_inf:"")+'</div>';
                        },
                        onInit:function(){
                            //console.log("sipwer初始化完成!,回调函数，初始化后执行。")
                        },
                        onTap:function(swiper,event){
                        },

                        onSlideChangeStart:function(swiper){
                        },
                        zoom:true
                    },
                    bottomSwiperOptions:{
                        // loop: true, // 开启循环模式,必须设置loopedSlides
                        // loopedSlides: num, //looped slides should be the same
//            isInit:false
                    },
                    imgClickCallBack:function(){
                        $('html').attr('sT',$(window).scrollTop());
                        $('html,body').css({height:'100%',overflow:'hidden'});
                    },
                    /**
                     * 关闭按钮回调函数
                     * */
                    closeCallBack:function(){
                        $('html,body').css({height:'auto',overflow:'auto'});
                        $(window).scrollTop($('html').attr('sT')||0);
                        $('html').removeAttr('sT');
                    },
                    topTitle:{
                        isInit:true,
                        title:""
                    },
//        zoom:true,
                    theme:'dark'
                });
            }
        },
        computed:{
            productId(){
                let t = this;
                return comm.getpara().productId;
            }
        }
    }
</script>
<style lang="scss">
    .productParameters{
        border-top:.213rem solid rgba(240,241,242,1);
    }
    .paddingBottomProduct{
        padding-bottom: .8533rem;
    }
</style>