<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <banner :productAttachmentList="productAttachmentList" v-if="productAttachmentList.length!==0"></banner>
        <brandIntroduction class="paddingBottom" title="品牌介绍" :dataList="itemList" v-if="itemList.length!==0" type="1" :brandId="brandId" ></brandIntroduction>
        <allProduct class="borderTop" :dataList="brandList" @checkMore="checkAllBrand" :more="moreProduct" :maxLen="parseInt(moreProductLen,10)" v-if="brandList.length!==0":brandName="brandName" ></allProduct>
        <contactPhone :contactList="contactList" v-if="contactList.length" :limitNum="limitNum" @checkContact="checkContact" :isMore="isMore"></contactPhone>
        <productManual class="productParameters" :relatedContent="relatedContent" title="相关内容" :more="moreOnOff" :maxLen="parseInt(moreRelatedLen,10)" @checkMore="checkAllRelated"  v-if="relatedContent.length!==0"></productManual>
    </section>
</template>
<script>
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import banner from './banner';
    import TempCache from "static/js/tempcache.js";
    import app from 'static/js/comm.app.js';
    import productInfoBar from './productInfoBar';
    import productParameter from './productParameter';
    import brandIntroduction from './brandIntroduction';
    import contactPhone from './contactPhone';
    import productManual from './productManual';
    import allProduct from './allProduct';
    import comm from 'static/js/comm.js';
    import axios from "axios";
    export default {
        components:{
            HeaderBar,
            banner,
            productInfoBar,
            productParameter,
            brandIntroduction,
            productManual,
            allProduct,
            contactPhone
        },
        data(){
            let t = this;
            return {
                moreRelatedLen:5,
                moreProductLen:6,
                brandList:[],
                relatedContent:[],
                contactList:[],
                itemList:[],
                limitNum:3,
                isMore:0,
                productAttachmentList:[],
                headerConfig: {
                    title: t.brandName,
                    backOnOff: true,
                    share: {
                        title:"&nbsp;",
                        onOff: true,
                        params: {
                            "visitSiteId":2,
                            "customerId":TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
                            "brandId":t.brandId,
                            "brandName":'',
                            "sceneType": "89",
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
            t.headerConfig.share.params.brandId = t.brandId;

            if(t.brandName){
                document.title = t.cutStr(t.brandName,18);
                t.headerConfig.share.params.brandName = t.brandName;
                t.headerConfig.title = t.cutStr(t.brandName,18);
            }
            //console.log(t.brandName);
            t.getBrandInfo().getBrandList().getFactoryList().getRelatedContent().wakeUpApp();
        },
        methods:{
            checkContact(){
              let _this = this;
                _this.$router.push({path:'contactList',name:'contactList',query:{"brandId":_this.brandId}});
            },
            wakeUpApp(){
                let t = this;
                let androidParams = `{scene:3,type:88,sourceId:${t.brandId},tplPath:0}`;
                let iosParams = `?scene=brandDetailScene&brandId=${t.brandId}`;
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
            checkAllBrand(){
              let t = this;
                t.$router.push({path:'brandList',name:'brandList',query:{brandId:t.brandId}});
            },
            checkAllRelated(){
                let t = this;
                t.$router.push({path:'relateContent',name:'relateContent',query:{brandId:t.brandId}});
            },
            showBigImage(){
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
            },
            getFactoryList(){
                let t = this;
                axios.get('/mcall/med/brand/getBrandCustomerList/', {
                    params: {
                        paramJson: {
                            firstResult:'0',//		:'',//	Integer 分页参数	0
                            maxResult:'100',//		Integer 分页参数	10
                            searchType:0,//	Integer	是	0-默认1-更多	0
                            brandId:t.brandId,//
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            console.log(res.data.responseObject.responseData.dataList);
                            t.contactList = res.data.responseObject.responseData.dataList;
                            t.isMore = res.data.responseObject.responseData.isMore;
                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                return t;
            },
            getBrandList(){
                let t = this;
                axios.get('/mcall/med/product/getProductList/', {
                    params: {
                        paramJson: {
                            "brandId": t.brandId,
                            "firstResult":'0',
                            "maxResult":'10000'
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            let dataInfo = res.data.responseObject.responseData.dataList;
                            t.brandList = dataInfo;
                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                return t;
            },
            getBrandInfo(){
              let t = this;
                axios.get('/mcall/med/brand/getBrandDetail/', {
                    params: {
                        paramJson: {
                            "brandId":t.brandId
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            if (res.data.responseObject.responseData.dataList[0].isCooperate == '1') {
                                window.location.href = "https://m.allinmd.cn/dist/branUpgrade/branUpgrade.html?#/brands?brandId=" + res.data.responseObject.responseData.dataList[0].brandId
                            }
                           let dataInfo = res.data.responseObject.responseData.dataList[0];
                           t.productAttachmentList = dataInfo.brandAttImgList;
                           t.itemList = dataInfo.brandList;
                           if(!t.brandName){
                               document.title = t.cutStr(dataInfo.brandName,18);
                               t.headerConfig.share.params.brandName = dataInfo.brandName;
                               t.headerConfig.title = t.cutStr(dataInfo.brandName,18);
                           }
                           setTimeout(()=>{
                               t.showBigImage();
                           },300);
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
                axios.get('/mcall/med/recommend/resource/item/getRelationContent/', {
                    params: {
                        paramJson: {
                            "resourceType": "5",
                            "resourceId": t.brandId,
                            "firstResult":0,
                            "maxResult":20
                        }
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                            t.relatedContent = res.data.responseObject.responseData.dataList;
                        }
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
                return t;
            }
        },
        computed:{
            brandId(){
                let t = this;
                return comm.getpara().brandId;
            },
            brandName(){
                let t = this;
                return comm.getpara().brandName;
            },
            moreOnOff(){
                let t = this;
                return t.relatedContent.length>t.moreRelatedLen;
            },
            moreProduct(){
                let t = this;
                return t.brandList.length>t.moreProductLen;
            }
        }
    }
</script>
<style lang="scss">
    .borderTop{
        border-top:.0267rem solid rgba(227,229,233,1);
    }
    .paddingBottom{
        padding-bottom: .7467rem;
    }
</style>