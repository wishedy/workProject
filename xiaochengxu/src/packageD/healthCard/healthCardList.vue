<template>
  <section class="healthCard-main">
    <!-- <section class="healthCard-title"></section> -->
    <section class="healthCard-list">
      <section class="healthCard-item" v-for="(item,index) in cardList" :key="index" @click="goToDetail(item)"> 
        <section class="healthCard-title">居民健康卡</section>
        <section class="healthCard-info">
          <section class="healthCard-name">
            <span class="healthCard-name-one">姓名：</span>
            <span class="healthCard-name-two">**杰</span>
          </section>
          <section class="healthCard-sex">
            <span class="healthCard-sex-one">性别：</span>
            <span class="healthCard-sex-two">男</span>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
/*
 * @Desc: 居民健康卡列表
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/4/2
 *
 */
export default {
    data(){
        return{
            cardList:['','','','','',]
        }
    },
    methods:{
        goToDetail(item){
            console.log(item)
            wx.navigateTo({
                url:"/packageD/healthCard/healthCardDetail"
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.healthCard-main {
  .healthCard-list {
    padding-top: 40px;
    padding-bottom: 60px;
    .healthCard-item {
      width: 100%;
      height: 218px;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/bg_01.png")
        no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 42px;
      transition: all 0.7s linear;

      .healthCard-title {
        font-size: 36px;
        color: #222222;
        text-align: center;
        padding-top: 40px;
        font-weight: bold;
      }
      .healthCard-info {
        @include clearfix();
        padding: 50px 114px 0;
        .healthCard-name {
          font-size: 34px;
          color: #222222;
          float: left;
          .healthCard-name-one {
            font-weight: bold;
          }
        }
        .healthCard-sex {
          font-size: 34px;
          float: left;
          color: #222222;
          padding-left: 104px;
          .healthCard-sex-one {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
