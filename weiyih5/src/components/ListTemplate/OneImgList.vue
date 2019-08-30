<template>
    <section class="al-contentPartModule">        
        <div class="al-resourceTypeBox" style=" margin-bottom:7px;" v-if="item&&item.currentScoreNum>9">
            <ul class="al-littleScoreStarBox" v-html="starDom(item.currentStarLevel)"></ul>
        </div>
        <section class="al-tableBox">
            <article class="al-contentText">
                <a :href= "item.itemUrl" class="al-contentTitle" v-bind:class="isValid(item.isValid)">{{(item.itemType==4&&item.itemTitle=="")?"话题医起聊":item.itemTitle}}</a>
                <p class="al-contentOtherMsg">
                    <span class="al-actTag" :class="{smallTag:winWidth<=640}" v-if="parseInt(item.isShowActivityTag)===1" :style="{'color':item.activityTagColor,
                    'border':'1px solid'+item.activityTagColor}">{{item.activityTagName}}</span>
                    <span class="al-contentAward" :class="{smallTag:winWidth<=640}" v-if="parseInt(item.isAward)===1||parseInt(item.resourceSign)===4">获奖</span>
                    <span class="al-contentJoin" :class="{smallTag:winWidth<=640}" v-else-if="parseInt(item.isAttend)===1||parseInt(item.resourceSign)===3">参赛</span>
                    <span class="al-contentHotest" :class="{smallTag:winWidth<=640}" v-else-if="parseInt(item.isHot)===1||parseInt(item.resourceSign)===2">最热</span>
                    <span class="al-contentNewest" :class="{smallTag:winWidth<=640}" v-else-if="parseInt(item.isNew)===1||parseInt(item.resourceSign)===1">最新</span>
                    <span class="al-contentPdf" :class="{smallTag:winWidth<=640}" v-else-if="parseInt(item.tplPath)===31||parseInt(item.tplPath)===32||parseInt(item.tplPath)===127">PDF</span>
                    <span class="al-contentAuthor" :class="isBookIcon(item.videoType)" v-if="item.ownerName!=''">{{item.ownerName|getOwerName}}</span>
                    <span class="icon-contentWatchedNum">{{item.browseNum|toWKH}}</span>
                    <span class="icon-tagComment" v-if="item.commentNum>=0">{{item.commentNum|toWKH}}</span>
                </p>
            </article>
            <figure class="al-contentImgBox" v-if="item.picNum>0">
                <a v-bind:href= "item.itemUrl">
                    <img v-bind:src="getPicUrl(item.picUrl)" alt="">
                    <i class="al-videoPlayBtn" v-if="item.itemType==1"><img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>
                    <span class="al-videoTime" v-if="item.itemType==1">{{item.playTime}}</span>
                </a>
            </figure>
        </section>
    </section>
</template>
<style>
    .al-contentText .al-contentTitle.isNotValid{
        color:#aaaaaa;
    }
    .al-actTag{
        padding:0 0.10667rem;
        margin-right: 0.26667rem;
        border-radius: 0.02667rem;
    }
    .smallTag{
        margin-bottom:0.2rem;
        display:inline-block;
    }
</style>
<script>
import  Vue from "vue";
import comm from "static/js/comm.js"
export default {
    props:['item'],
    data(){
        return {
            winWidth:window.innerWidth
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
