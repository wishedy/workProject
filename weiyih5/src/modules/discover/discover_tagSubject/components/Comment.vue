<template>
    <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="100">
        <div slot="pull-down-ready">ready to refresh</div>
    <section class="al-content active" style="margin-top:0" data-role="comment" data-alcode-mod="426"
             scrollpagination="enabled">

        <section class="al-contentPartModule" v-for="(item,index) in list">
            <div v-if="!(parseInt(item.currentScoreNum,10)<10)" class="al-resourceTypeBox" style="margin-bottom:7px;">
                <ul class="al-littleScoreStarBox" v-html="starDom(item.currentScoreNum,item.currentStarLevel)">

                </ul>
            </div>
            <section class="al-tableBox">
                <article class="al-contentText"><a
                        :href="item.itemUrl" class="al-contentTitle"><span>{{item.itemTitle}}</span></a>
                    <p class="al-contentOtherMsg">
                        <span v-if='item.isShowActivityTag==1' style="padding:0 0.10667rem;margin-right: 0.20667rem;border-radius: 0.02667rem;" :style='{color:item.activityTagColor,border:"1px solid"+item.activityTagColor}' v-text="item.activityTagName
"></span>
                        <span class="al-contentAuthor icon-contentAuthor" v-if="item.itemType==1?item.ownerNameStr:item.ownerName">{{item.itemType==1?item.ownerNameStr:item.ownerName|getOwnerName}}</span>
                        <span class="icon-contentWatchedNum">{{item.browseNum|toWKH}}</span>
                        <span class="icon-tagComment">{{item.reviewNum|toWKH}}</span></p>
                </article>
                <figure class="al-contentImgBox" v-if="item.picUrl.length>0"><a
                        :href="item.itemUrl"><img
                        :src="reallyUrl(item.picUrl)"
                        alt=""><i class="al-videoPlayBtn" v-if="item.itemType==1"><img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png"
                                                               alt=""></i><span class="al-videoTime"  v-if="item.itemType==1">{{item.playTime}}</span></a>
                </figure>
            </section>
        </section>
    </section>
        <div slot="infinite-scroll-loading">loading...</div>
        <loading v-show="loading"></loading>
    </vue-data-loading>
</template>
<script>
    import content from "../api/content.js"
    export default content;
</script>