<template>
    <section class="al-searchInputBar" data-alcode-mod="414">
        <i class="icon-searchWhite"></i>
        <input type="text" placeholder="请输入标签关键词" id="EV-SearchInput" @focus="changeSearchState(true)" :class="{'focus':onSearch}" v-model="searchStr">
        <a class="al-searchCancel" :class="{'show':onSearch}" data-alcode="e49" @click="changeSearchState(false)">
            <i class="icon-searchCancel" :class="{'inlineShow':searchStr.length!==0}" @click.stop="clearContent"></i>取消
        </a>
    </section>
</template>
<script>
    const xhrUrl = {
        list:"/mcall/comm/data/property/getMapList/"
    };
    import {mapActions,mapGetters} from "vuex"
    import comm from 'static/js/comm.js'
    export default {
        data(){
          return {
              searchStr:"",
              list:[]

          }
        },
        computed:{
            pageIndex(){
              return this.$store.state.pageIndex;
            },
            pageSize(){
                return this.$store.state.pageSize;
            },
            onSearch(){
                return this.$store.state.onSearch
            }
            ,
            customerId(){
                let t = this;
                return t.$store.state.customerId;
            }
        },
        watch:{
            pageIndex(){
              let t = this;
              if(t.searchStr.length){
                  t.searchBegin();
              }
            },
            '$store.state.searchStr'(){
              let t = this;
              if(t.$store.state.searchStr.length===0){
                  t.searchStr = "";
              }
            },
            searchStr(newStr,oldStr){
                let t = this;
                t.$store.state.searchStr = t.searchStr;
                t.initLoading();
                if(t.searchStr.length){
                    if(oldStr.length===0){
                        this.$store.state.firstLoading = true;
                    }
                    t.searchBegin();
                }

            },
            list(){
                let t = this;
                t.$store.state.searList = JSON.stringify(t.list);
                if(t.$store.state.searchStr.length===0){
                    t.$store.state.searList = '';
                }
            }
        },
        methods:{
            ...mapActions(["changeSearchState",'initLoading']),
            searchBegin(){
                let t = this;
                comm.creatEvent({
                    triggerType:'搜索',
                    keyword:t.searchStr,
                    actionId:10
                });
                let param = {
                    "pageIndex": t.pageIndex,
                    "pageSize": t.pageSize,
                    "visitSiteId": 2,
                    "resourceNum": 2,
                    "customerId": t.customerId,
                    "platformId": "1",
                    "sessionCustomerId": t.customerId,
                    "propertyName": t.searchStr
                };
                t.$store.state.loading = true;
                comm.ajax({
                    url:xhrUrl.list,
                    method:"POST",
                    paramJson:true,
                    data:param,
                    success:function(res){
                        t.$store.state.loading = false;
                        t.$store.state.firstLoading = false;
                        if(res.data.responseObject.responseData){
                            if(res.data.responseObject.responseData.data_list&&t.$store.state.searchStr.length!==0){
                                if(res.data.responseObject.responseData.data_list.length>0){
                                    if(t.pageIndex===1){
                                        window.scrollTo(0,0);
                                        t.list = res.data.responseObject.responseData.data_list;
                                    }else{
                                        t.list = t.list.concat(res.data.responseObject.responseData.data_list);
                                    }
                                }else{
                                    t.list = [];
                                    t.$store.state.completed = true;
                                }
                                if(res.data.responseObject.responseData.data_list.length<t.pageSize){
                                    t.$store.state.completed = true;
                                }
                            }else{
                                t.list = [];
                                t.$store.state.completed = true;
                            }
                        }else{
                            t.list = [];
                            t.$store.state.completed = true;
                        }
                    }
                })
            },
            clearContent(){
                let t = this;
                t.searchStr = "";
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .inlineShow{
        display: inline !important;
    }
</style>