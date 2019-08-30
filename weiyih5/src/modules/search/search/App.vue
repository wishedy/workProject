<template>
    <section>
        <section class="al-mainInner">
            <SearchBar></SearchBar>
            <AssociateResultBar></AssociateResultBar>
            <SearchContent></SearchContent>
        </section>
        <MonoLayer :confirmOption="confirmOption" @ensureClickEvent="ensure" @cancelClickEvent="cancel"></MonoLayer>
    </section>

</template>

<script type="text/ecmascript-6">
    import Global from "common/Global.vue";
    import Search from "components/Search/Search.vue"
    import searchBar from "./components/SearchBar.vue";
    import AssociateResultBar from "./components/AssociateResultBar.vue";
    import SearchContent from "./components/SearchContent.vue";
    import MonoLayer from "components/MonoLayer/MonoLayer.vue";
    import comm from 'static/js/comm.js';
    import {mapActions,mapGetters} from  "vuex";
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        components: {
            SearchBar:searchBar,
            AssociateResultBar:AssociateResultBar,
            SearchContent:SearchContent,
            MonoLayer:MonoLayer,
            Search
        },
        data(){
            return {
                confirmOption:"",
                routerName:"",
                shareData:{}
            }
        },
        beforeMount(){
            //this.share();
          let t = this;
          if(t.$store.state.selectedStr.length===0){
            t.$store.state.selectedStr = comm.getparaNew().keyword||"";
          }
        },
        computed:{
            customerId(){
                let t = this;
                return t.$store.state.customerId;
            }
        },
        methods: {
          ...mapActions(["selectedKeyWord"]),
            "ensure"() {
                let t = this;
                t.$store.state.confirmOption = "1";
            },
            "cancel"() {
                let t = this;
                t.$store.state.confirmOption = "0";
            }
        },
        watch:{
            "$store.state.confirmOption"(){
                let t = this;
                t.confirmOption = t.$store.state.confirmOption;
            },
            '$store.state.selectedStr'(newStr){
              let t = this;
              if(newStr.length){
                let routerName = (this.$route.path).substring(1,100);
                var goPath = '';
                if((routerName!=='searchIndex')){
                  goPath="/"+routerName;
                }else{
                  goPath = "/all";
                }
                t.$router.push({
                  path: goPath
                });
                t.selectedKeyWord({vm:t,keyVal:newStr})
              }
          },
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/search/search_index";
    .al-mainInner{
        .al-searchItem{
            margin: 0;
            border: none;
        }
        .al-searchItem .al-searchTitle{
            font-size: rem(32px);
            color: #000000;
            font-weight: bold;
            border: none;
            padding: rem(40px) rem(30px);
        }
        .al-hotSearchContent,.al-historySearchContent{
            padding: 0 rem(30px) rem(16px);
        }
        .al-hotSearchContent .al-hotSearchWord,.al-historySearchContent .al-historySearchItem{
            font-size: rem(32px);
            color: #333333;
            line-height: rem(48px);
            padding: rem(16px) rem(30px);
            background: #F6F6F6;
            border-radius: rem(4px);
            border: none;
            display: inline-block;
            width: auto;
            height: auto;
            vertical-align: middle;
            margin: 0 rem(24px) rem(24px) 0;
        }
        .al-clearHistorySearch{
            float: right;
            font-size: rem(30px);
            color: #626F8C;
            font-weight: normal;
            span{
                display: inline-block;
                vertical-align: middle;
            }
            .deleteIcon{
                display: inline-block;
                width: rem(32px);
                height: rem(32px);
                background: url("./assest/delete.png") no-repeat;
                background-size: contain;
                vertical-align: middle;
                margin-right: rem(7px);
            }
        }
    }

</style>
