<template>
    <section class="al-mainInner">
        <!-- 头部信息 -->
        <header class="al-searchHead">
            <header class="al-indexHeader" data-alcode-mod='401'>
                <figure class="al-indexHeaderItem">
                    <a href="javascript:history.back(-1);" class="ev_digHole" data-alcode='e45'>
                        <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                    </a>
                </figure>
                <figure class="al-indexHeaderItem">
                    <h1>权威专家</h1>
                </figure>
                <figure class="al-indexHeaderItem">
                </figure>
            </header>
            <section class="al-searchInputBar" data-alcode-mod='418'>
                <i class="icon-searchWhite"></i>
                <input type="search" placeholder="请输入专家姓名" id="EV-SearchInput">
                <a class="al-searchCancel" data-alcode='e50'>
                    <i class="icon-searchCancel"></i> 取消
                </a>
            </section>
        </header>
        <section class="al-content al-doctorRecommend EV-searchResultBox">
            <section class="al-noContentTips" style="display:none">
                <figure>
                    <img src="//img50.allinmd.cn/pages/discover/no_master.png" alt="">
                </figure>
            </section>
            <section id="EV-searchResultContent" data-alcode-mod='420'></section>
        </section>
        <!-- 申请权威专家 -->
        <section class="al-content al-doctorRecommend EV-listResultBox" data-alcode-mod='419'>
        </section>
        <section class="al-applicaptionMaster" data-alcode-mod='421' data-alcode-item-selector="a">
            <i class="icon-aplMaster"></i>
            <p>申请权威专家，帮助更多的人</p>
            <a href="" class="EV-goToApplyMaster" data-alcode='e51'>立即申请</a>
        </section>
        <!-- 分享按钮 -->
        <section class="al-scrollShareBtn" data-alcode-mod='406'>
            <i class="icon-scrollShare" data-alcode="e46"></i>分享
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
  import TempCache from "static/js/tempcache.js"
  import comm from 'static/js/comm.js'
  import Loading from 'components/Loading/Loading'

  const path = {
    search: '/mcall/customer/pundits/getSearchPunditsCustomerName/',
    list: '/mcall/customer/pundits/getPunditsCustomerList/',
    share: '/mcall/comm/data/share/getMapList3/'
  };
  export default{
    data(){
      return {}
    },
    methods: {
      getUserList: function () {
        let t = this;
        comm.ajax2({

        });
      },
      //瀑布流
      scroll: function () {
        let t = this;
        window.onscroll = function () {
          let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
          let height = document.documentElement.clientHeight;//可视区高度
          let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
          if (top + height > scrollHeight - 100) {
            if (!t.ajaxing && !t.noMore) {
              t.getUserList();
            }
          }
        }
      },

    },
    mounted(){

    },
    components: {
      Loading
    },

  }
</script>