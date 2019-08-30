<template>
  <section class="comment-loading-container">
    <section class="comment-loading">
      <figure class="comment-loading-content">
        <img :src="param.icon" alt="" :class="{'rotate':param.type==='rotate'}">
        <p>{{param.content}}</p>
      </figure>
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
   * Created by Hallmader on 2018/8/14.
   */
  export default {
    name: "comment-loading",
    data() {
      return {}
    },
    methods: {},
    mounted() {

    },
    computed: {},
    props: {
      param: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style lang="scss">
.comment-loading-container{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
}
  .comment-loading{
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);
    background-color: rgba(0,0,0,0.7);
  }
  .comment-loading-content{
    padding: 40px 60px;
    box-sizing: border-box;
    text-align: center;
    & > img{
      width: 60px;
      height: 60px;
      vertical-align: top;
      &.rotate{
        animation:rotate 1s linear forwards infinite ;
      }
    }
    & > p{
      margin-top: 22px;
      font-size: 30px;
      color: #FFFFFF;
    }
  }

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
