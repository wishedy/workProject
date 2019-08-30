<template>
    <section class="al-searchContentInner ev-searchList" data-alcode-mod="416" v-show="list.length>0" v-cloak>
        <section class="al-searchResult">
            <header class="al-searchResultTitle">匹配标签</header>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="100">
                <div slot="pull-down-ready">ready to refresh</div>
            <a :href="'/dist/discover/discover_tagSubject.html?tId='+item.propertyId"
               class="al-searchResultItem" v-for="(item,index) in list" v-html="rebuildTag(item.propertyName)" @mousedown.stop="batch(item.propertyName,item.propertyId)"></a>
                <div slot="infinite-scroll-loading">loading...</div>
                <loading v-show="loading"></loading>
            </vue-data-loading>
        </section>
    </section>
</template>
<script>
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    import comm from 'static/js/comm.js';
    export default {
        computed:{
            completed(){
              return this.$store.state.completed;
            },
            loading(){
                return this.$store.state.loading;
            },
            list(){
                if(this.$store.state.searList.length===0){
                    return [];
                }else{
                    return JSON.parse(this.$store.state.searList);
                }
            },
            searchStr(){
                return this.$store.state.searchStr;
            }
        },
        components:{
            VueDataLoading,loading
        },
        methods:{
            "infiniteScroll"(){},
            scrollBegin(){
                let t = this;
                t.$store.state.loading = true;
                setTimeout(() => {
                    t.$store.state.pageIndex =++(t.$store.state.pageIndex);
                }, 1000)
            },
            batch(name,tid){
                comm.creatEvent({
                    triggerType:'标签',
                    trigger_name:"标签",
                    keyword:name,
                    refId:tid,
                    actionId:79,
                    async:false
                });
            },
            rebuildTag(val){
                let t = this;
                return val.replace(t.searchStr,'<em>'+t.searchStr+'</em>');
            }
        },
        mounted(){
          this.infiniteScroll = this.scrollBegin;
        },
        watch:{
            completed(newState){
              let t  = this;
              if(newState){
                  this.infiniteScroll = ()=>{
                      return false;
                  }
              }else{
                  this.infiniteScroll = this.scrollBegin;
              }

            },
            searchStr(newStr,oldStr){
                if(newStr.length===0){
                    this.$store.state.searList = '';
                }
            }
        }
    }
</script>