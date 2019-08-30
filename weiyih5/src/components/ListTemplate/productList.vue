<template>
    <section class="productItem" v-if="item">
        <a :href="getHref(item)" @click="jumpUrl" class="jumpProDesc">
            <img class="proImg" :src= "item.attPath" alt="">
            <div class="proDesc">
                <span class="proItemTitle">{{item.productName}}</span>
                <span class="proItemName">{{item.brandName}}</span>
            </div>
        </a>
    </section>
</template>
<style lang="scss">
//公共方法模块调用
@import "scss/modules/_common-modules.scss";
.productItem{
    height: rem3(104px);
    border-bottom:rem3(1px) solid rgba(235,235,235,1);
    position: relative;
    .jumpProDesc{
        height: 100%;
        width: 100%;
        display: inline-block;
    }
    .proImg{
        width: rem3(60px);
        height: rem3(60px);
        border-radius: 50%;
        display: inline-block;
        margin: rem3(22px) rem3(14px) 0 0;
    }
    .proDesc{
        display: inline-block;
        width: rem3(260px);
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        .proItemTitle{
            font-size:rem3(17px);
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:rem3(24px);
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: rem3(13px);
        }
        .proItemName{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            font-size:rem3(14px);
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(119,119,119,1);
            line-height:rem3(20px);
        }
    }
}
</style>
<script>
    import  Vue from "vue";
    import comm from "static/js/comm.js"
    export default {
        props:['item'],
        data(){
            return {
                winWidth:window.innerWidth,
                ProId:item.ProId
            }
        },
        methods:{
            starDom(score){
                let _dom="";
                var num = parseInt(score);
                var flot =(score-num)*100+"%";
                if(num==0){
                    _dom='<li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li>';
                }else if(num==1){
                    _dom='<li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li>';
                }else if(num==2){
                    _dom='<li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li>';
                }else if(num==3){
                    _dom='<li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li>';
                }else if(num==4){
                    _dom='<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li>';
                }else if(num==5){
                    _dom='<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li>';
                }
                return _dom;
            },
            isValid(valid){
                if(valid==0||valid==2||valid==3){
                    return "isNotValid";
                }	else{
                    return "";
                }
            },
            isBookIcon(videoType){
                return (videoType==17||videoType==18||videoType==19)?'bookNameIcon':'icon-contentAuthor';
            },
            getPicUrl(picUrl){
                let picArr = picUrl.split('|');
                if(picArr.length==1){return picUrl;}
                if(/allinmd.cn/.test(picArr[0])){
                    return picArr[0];
                }else if(/allinmd.cn/.test(picArr[1])){
                    return picArr[1]
                }
            },
            //跳转到产品详情页
            getHref(item){
                if(item && item.productId){
                    return 'https://m.allinmd.cn/dist/medPlus/medPlus.html#/productDetail?productId='+ item.productId;
                }else{
                    return 'javaScript:;'
                }
            },
            //事件埋点
            jumpUrl(){
                comm.creatEvent({
                    triggerType:'产品列表-单个产品点击',
                    actionId:11727
                });
            }
        },
        filters:{
            getOwerName(owerName){
                return comm.getStrLen(owerName,16);
            }
        }
    }
    Vue.filter('toWKH', function(value) {
        return comm.toWKH(value);
    });

</script>
