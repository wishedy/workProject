<template>
  <div>
    <section class="comment-content-item">
      <header class="comment-content-item-title">
        <figure class="comment-content-item-logo" v-if="reviewItem">
          <img :src="reviewItem.headLogo" alt="">
        </figure>

        <section class="comment-content-item-base" v-if="reviewItem">
          <h4 class="name" v-if="reviewItem.nickName&&reviewItem.nickName.length>0">{{reviewItem.nickName}} <span
            v-if="reviewItem.isAuthor==1">（作者）</span></h4>
          <p class="time">{{formatTime}}</p>
        </section>
      </header>

      <section class="comment-content-item-article">
        <article class="comment-content-item-mainText">
          <p class="content" v-html="formatContent" v-if="reviewItem.isValid==1"></p>
          <p class="content" v-if="reviewItem.isValid==0">该评论已删除</p>

          <span class="toggle" @click="contentToggle=false"
                v-if="reviewItem.isValid==1&&contentToggleShow&&contentToggle">展开</span>
          <span class="toggle hide" @click="contentToggle=true"
                v-if="reviewItem.isValid==1&&contentToggleShow&&!contentToggle">收起</span>
        </article>
        <figure class="comment-content-img-box" v-if="reviewItem&&reviewItem.isValid==1&&reviewItem.attList[0]">
          <img :src="reviewItem.attList[0]&&reviewItem.attList[0].attUrl" alt=""
               @click="previewImage(reviewItem.attList)">
        </figure>
      </section>
      <section class="comment-content-item-quote" v-if="refReviewItem">
        <article class="comment-content-item-quote-article">
          <p class="content"
             v-if="refReviewItem.isValid==1&&refReviewItem.status==1&&refReviewItem.reviewContent.length>0">
            <span v-html="formatQuote"></span>
          </p>
          <p class="content"
             v-if="refReviewItem.isValid==1&&refReviewItem.status==1&&refReviewItem.reviewContent.length===0&&refReviewItem.attList.length>0">
            <span class="quote">引用 {{(refReviewItem.nickName&&refReviewItem.nickName.length>0)?refReviewItem.nickName:""}}{{isAuthor}}的评论：</span>图片评论
          </p>
          <p class="content" v-if="refReviewItem.isValid==0||refReviewItem.status==0">
            <span class="quote">引用 {{(refReviewItem.nickName&&refReviewItem.nickName.length>0)?refReviewItem.nickName:""}}{{isAuthor}}的评论：</span>该评论已删除
          </p>
          <article v-if="refReviewItem.isValid==1&&quoteToggleShow">
            <span v-if="quoteToggle" @click.stop="quoteToggle=false">展开</span>
            <span v-else @click.stop="quoteToggle=true" style="margin-bottom: -28rpx;">收起</span>
          </article>
        </article>
        <figure class="comment-content-quote-img-box"
                v-if="refReviewItem&&refReviewItem.isValid==1&&refReviewItem.status==1&&refReviewItem.attList[0]">
          <figure class="list">
            <img :src="refReviewItem.attList[0]&&refReviewItem.attList[0].attUrl" alt=""
                 @click="previewImage(refReviewItem.attList)">
          </figure>
        </figure>
      </section>
      <section class="comment-content-controller" v-if="reviewItem.isValid==1">
        <section class="delete" @click="deleteEvent" v-if="reviewItem.customerId==customerId">
          <i class="icon-delete"></i>
          <span>删除</span>
        </section>
        <button class="reply" open-type="getUserInfo" @getuserinfo="replyCurrentComment">
          <i class="icon-replay"></i>
          <span>回复</span>
        </button>
      </section>
    </section>
  </div>
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
  import api from "common/js/util/util";
  import {createNamespacedHelpers} from 'vuex';

  const {mapMutations, mapActions, mapState} = createNamespacedHelpers('journal');
  export default {
    data() {
      return {
        contentToggleShow: false,
        contentToggle: true,
        quoteToggleShow: false,
        quoteToggle: true,
      }
    },
    props: {
      reviewItem: {
        type: Object,
        default: {}
      },
      refReviewItem: {
        type: Object,
        default: {}
      }
    },
    computed: {
      ...mapState(['customerId', 'authorCustomerId', 'clickFlag']),
      formatContent() {
        if (!this.reviewItem || !this.reviewItem.reviewContent) return "";

        if (api.getByteLen(this.reviewItem.reviewContent) > 130) {
          this.contentToggleShow = true;
          if (this.contentToggle) {
            return api.getStrByteLen(this.reviewItem.reviewContent, 125) + "...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
          } else {

            return this.reviewItem.reviewContent + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
          }

        } else {
          this.contentToggleShow =false;
          return this.reviewItem.reviewContent;
        }
      },
      formatQuote() {
        if (!this.refReviewItem || !this.refReviewItem.reviewContent) return "";
        if (api.getByteLen("引用" + this.refReviewItem.nickName + "的" + this.refReviewItem.reviewContent + "评论") > 50) {
          this.quoteToggleShow = true;
          if (this.quoteToggle) {
            return `<span class="quote">引用 ${(this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0) ? this.refReviewItem.nickName : ""}${this.isAuthor}的评论：</span> ${api.getStrByteLen(this.refReviewItem.reviewContent, (35 - `引用${this.refReviewItem.nickName}的评论`.length))}...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
          } else {
            return `<span class="quote">引用 ${(this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0) ? this.refReviewItem.nickName : ""}${this.isAuthor}的评论：</span> ${this.refReviewItem.reviewContent}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
          }

        } else {
          return `<span class="quote">引用 ${(this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0) ? this.refReviewItem.nickName : ""}${this.isAuthor}的评论：</span> ${this.refReviewItem.reviewContent}`;
        }
      },
      formatTime() {
        if (!this.reviewItem || !this.reviewItem.reviewTime) return "";
        return this.reviewItem.reviewTime.substring(0, 10).replace(/-/g, ".");
      },
      isAuthor() {
        if (!this.refReviewItem) return "";
        if (this.refReviewItem.isAuthor == 1) {
          return "（作者）"
        } else {
          return "";
        }
      }
    },
    methods: {
      ...mapMutations(['setCommentWindowShow', 'setCurrentCommentId', 'setLoadingStatus', 'setDeleteCommentItem', 'showBigImg', 'setClickFlag','setEnsureShow']),
      ...mapActions(['checkLogin']),
      previewImage(list) {
        let _list = [];
        list.forEach((e, i) => {
          _list.push(e.attUrl)
        });

        wx.previewImage({
          current: list[0].attUrl,
          urls: _list
        });
      },
      replyCurrentComment(e) {
        if (!this.clickFlag) return false;
        this.setClickFlag(false);
        console.log(this.clickFlag)
        console.log(this.reviewItem);
        this.setLoadingStatus(true);
        if (e.target.userInfo) {
          //已授权...
          if (this.customerId) {
            this.setCommentWindowShow(true);
            this.setCurrentCommentId({
              reviewId: this.reviewItem.reviewId,
              refCustomerId: this.reviewItem.customerId
            })
            this.setLoadingStatus(false);
            this.setClickFlag(true);
          } else {
            this.checkLogin().then(status => {
              this.setClickFlag(true);
              //  是否绑定手机？
              // 已绑定...
              if (status) {
                this.setCommentWindowShow(true);
                this.setCurrentCommentId({
                  reviewId: this.reviewItem.reviewId,
                  refCustomerId: this.reviewItem.customerId
                })
              }
              this.setLoadingStatus(false);
              //未绑定...前往绑定
            });
          }
        } else {
          this.setEnsureShow(true);
          this.setLoadingStatus(false);
          this.setClickFlag(true);
          this.setCurrentCommentId({
            reviewId: this.reviewItem.reviewId,
            refCustomerId: this.reviewItem.customerId
          })
        }

      },
      deleteEvent() {
        if (!this.clickFlag) return false;
        this.setClickFlag(false);
        this.setDeleteCommentItem({
          flag: true,
          item: this.reviewItem.reviewId
        })
      }
    },

    mounted() {
      // console.log(this.reviewItem)
    },
  }
</script>

<style lang="scss">
  .comment-content {

  }

  .comment-content-item {
    padding: 38px 0;
    box-sizing: border-box;
    padding-left: 30px;
    position: relative;
    &:before {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      background: #EBEDF0;;
      width: 640px;
      height: 2px;
    }
  }

  .comment-content-item-title {
    text-align: left;
    font-size: 0;
    .comment-content-item-logo {
      width: 68px;
      height: 68px;
      display: inline-block;
      vertical-align: top;
      border-radius: 50%;
      & > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        vertical-align: top;
      }
    }
    .comment-content-item-base {
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      .name {
        font-size: 28px;
        color: #777777;
        max-width: 300px;
        @include ellipsis()
      }
      .time {
        font-size: 24px;
        color: #AAAAAA;
      }
    }
  }

  .comment-content-item-article {
    margin-top: 16px;
    margin-left: 88px;
    margin-right: 54px;

    .comment-content-item-mainText {
      position: relative;
      word-break: break-all;
      .lineHelper {
        opacity: 0;
        visibility: hidden;
        position: absolute;
      }
      .content {
        font-size: 34px;
        &.contentHide {
          @include ellipsis(4);
        }

      }
      .toggle {
        font-size: 34px;
        color: #00B9AD;
        position: absolute;
        right: 0;
        bottom: 0;
        &.hide{
          bottom: -20px;
        }
      }
      & > article {
        text-align: right;
        font-size: 0;
        span {
          font-size: 32px;
          display: inline-block;
          margin-left: 20px;
        }
      }
    }
  }

  .comment-content-img-box {
    font-size: 0;
    margin-top: 14px;
    img {
      width: 280px;
      height: 280px;
      display: inline-block;
      vertical-align: top;
    }
  }

  .comment-content-item-quote {
    padding:20px;
    box-sizing: border-box;
    background: #F0F5F4;
    border-radius: 4px;
    position: relative;
    margin-left: 88px;
    margin-right: 54px;
    margin-top: 30px;
    &-article {
      font-size: 30px;
      word-break: break-all;
      position: relative;
      .content {
        color: #101010;
        .quote {
          color: #777777;
        }
      }
      & > article {
        text-align: right;
        font-size: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        span {
          display: inline-block;
          vertical-align: middle;
          font-size: 30px;
          color: #00B9AD;
        }
      }
    }
  }

  .comment-content-quote-img-box {
    font-size: 0;
    margin-top: 20px;
    img {
      width: 160px;
      height: 160px;
      vertical-align: top;

    }
    & > article {
      font-size: 0;
      text-align: right;
      span {
        font-size: 30px;
        margin-left: 20px;
      }
    }
  }

  .comment-content-controller {
    margin-top: 30px;
    text-align: right;
    font-size: 0;
    margin-right: 54px;
    .reply{
      padding:0 !important;
      line-height: normal;
      margin-bottom: -10px;
    }
    .delete, button {
      display: inline-block;
      margin-left: 26px;
      border: none;
      background: none;
      i {
        width: 34px;
        height: 34px;
        display: inline-block;
        margin-bottom: -6px;
        margin-right: 10px;
      }
      .icon-delete {
        background: url("https://m.allinmed.cn/static/image/mp/index/dele.png") no-repeat center center;
        background-size: contain;
      }
      .icon-replay {
        background: url("https://m.allinmed.cn/static/image/mp/index/reply.png") no-repeat center center;
        background-size: contain;
        margin-bottom: -8px;
      }
      span {
        font-size: 28px;
        color: #909090;
        display: inline-block;
        // vertical-align: middle;
      }

    }
  }
</style>
