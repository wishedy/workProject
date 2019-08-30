<template>
    <section :class="{'headerInfoContaner':isHeader}">
        <!-- 头部信息 -->
        <header class="al-indexHeader infoFixedHeader">
            <figure class="al-indexHeaderItem">
                <a class="ev_backBtn" href="javascript:history.back(-1);">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1 class="ev_backBtn myInfo" style="display: block">他的资料</h1>
            </figure>
            <figure class="al-indexHeaderItem ev-checkRule">

            </figure>
        </header>
        <section class="eventInfo baseEvent" v-if="eventList.length">
            <section class="eventTitle">
                <h2 class="infoBig">大事件</h2>
            </section>
            <ul class="eventContent">
                <li v-for="(item,index) in eventList" class="itemDetail" :class="item.event_type==1?'systemEvent':'userEvent'"><span class="itemDesc">{{item.event_name}}</span></li>
            </ul>
        </section>
        <!--其他个人信息-->
        <section data-alcode-mod="538">
            <other-msg></other-msg>
        </section>

        <!--其他个人信息 end-->

    </section>
</template>

<script type="text/ecmascript-6">
  import otherMsg from './otherMsg';
  import {mapGetters,mapActions} from "vuex";
  const path={
      reviseAuth:"/mcall/customer/revise/auth/getMapList/"
  };
  export default{
    data(){
      return {

      }
    },
      components:{
          otherMsg
      },
    computed:{
      ...mapGetters(['eventList','isHeader']),
    },
    methods:{
        ...mapActions(['getEvent']),
    },
    mounted(){
      this.getEvent({paramJson:JSON.stringify({customerId:this.$store.state.otherId})});
    },
    watch:{

    }
  }
</script>
<style lang="scss">
    @import 'scss/pages/authentication/personalNew';
</style>