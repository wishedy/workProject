<template>
  <section class="comment-container" id="container">
    <nav class="comment-navBar">
      <section class="comment-navBar-item" :class="{'active':listType==='all'}" @click="changeCommentList('all')">全部评论
      </section>
      <section class="comment-navBar-item" :class="{'active':listType==='author'}" @click="changeCommentList('author')">
        只看作者
      </section>
    </nav>
    <!--All-->
    <section class="comment-content" v-show="listType==='all'">
      <CommentContent
        :reviewItem="item.reviewData"
        :refReviewItem="item.refReviewData"
        v-for="(item,index) in commentList"
        :key="index"
        v-if="item.reviewData&&item.reviewData.isValid==1&&commentList.length>0"
        :updateFlag.sync="updateFlag">
      </CommentContent>
      <article class="no-comment" v-if="commentList==='empty'">第一条评论是你的了~</article>
      <section class="extraLine" v-show="commentList!=='empty'&&allTypeLoading">{{allTypeFinish?'--到底了--':'正在加载..'}}</section>
    </section>
    <!--Author-->
    <section class="comment-content" v-show="listType==='author'">
      <CommentContent
        :reviewItem="item.reviewData"
        :refReviewItem="item.refReviewData"
        v-for="(item,index) in authorCommentList"
        :key="index"
        v-if="item.reviewData&&item.reviewData.isValid==1&&authorCommentList.length>0"
        :updateFlag.sync="updateFlag">
      </CommentContent>
      <article class="no-comment" v-if="authorCommentList==='empty'">暂无内容</article>
      <section class="extraLine" v-show="authorCommentList!=='empty'&&authorTypeLoading">{{authorTypeFinish?'--到底了--':'正在加载..'}}</section>
    </section>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12.
   */
  import CommentContent from "./commentContent";

  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "dataLog"

  const {mapActions, mapState, mapMutations} = createNamespacedHelpers('journal');
  export default {
    data() {
      return {
        type: "all",
        updateFlag: false
      }
    },
    methods: {
      ...mapActions(['getCommentList']),
      ...mapMutations(['setListType']),
      changeCommentList(type) {
        const _type = this.listType;
        this.setListType(type);
        console.log(this.listType)
        if (_type !== type) {
          if (type === "all") {
            this.getCommentList({
              type: "getAll",
              getter: true
            });
            dataLog.createTrack({
              actionId: 14127,
            });
          } else {
            this.getCommentList({
              type: "getAuthor",
              getter: true
            });
            dataLog.createTrack({
              actionId: 14128,
            });
          }
        }
      }
    },
    mounted() {

    },

    computed: {
      ...mapState(['commentList', 'authorCommentList', 'loading', 'listType', 'allTypePage', 'authorTypePage', 'authorTypeFinish', 'allTypeFinish','allTypeLoading','authorTypeLoading']),
    },

    components: {
      CommentContent
    }
  }
</script>

<style lang="scss">
  .comment-container {
    margin-top: 20px;
    background: #FFFFFF;
    margin-bottom: 89px;
  }

  .comment-navBar {
    text-align: left;
    font-size: 0;
    padding: 0 38px;
    height: 106px;
    line-height: 106px;
    border-bottom: 1px solid #EBEDF0;;
    box-sizing: border-box;
    &-item {
      display: inline-block;
      vertical-align: middle;
      margin-right: 50px;
      font-size: 30px;
      color: #555555;
      position: relative;
      /*transition: 0.2s ease-in-out all;*/
      &:before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 100%;
        width: 0;
        border-bottom: 6px solid #00B9AD;
        /*transition: 0.2s ease-in-out all;*/
      }
      &.active {
        font-size: 34px;
        font-weight: bold;
        color: #333333;
        &:before {
          width: 64px;
          left: 50%;
          margin-left: -32px;
        }
      }
      &.active ~ .comment-navBar-item:before {
        left: 0;
      }
    }
  }

  .comment-content {
    background-color: #fff;
    box-sizing: border-box;
    padding-bottom: 80px;
  }

  .no-comment {
    padding: 100px 0;
    text-align: center;
    font-size: 28px;
    color: #AAAAAA;
  }

  .extraLine {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #BDBDBD;
    margin-top: 40px;
    margin-bottom: 50px;
  }
</style>
