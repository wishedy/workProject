<template>
    <section class="al-searchItem" v-show="(list.length>0)&&showOnOff">
        <h2 class="al-searchTitle"><!--<i class="icon-historySearch"></i>-->历史搜索<p class="al-clearHistorySearch" @click="deleteHistory"><i class="deleteIcon"></i><span>清空历史</span></p></h2>
        <article class="al-historySearchContent" data-alcode-mod="456">
            <router-link to="/searchResult" class="al-historySearchItem"
                         :keyword="v.searchKey" v-for="(v,i) in list" :key="i" v-cloak tag="p"  @click.native="selectedWord(v.searchKey)">{{v.searchKey}}</router-link>
           <!-- <p class="al-historySearchItem" v-for="(v,i) in list" v-cloak @click="selectedKeyWord">{{v.keyWord}}</p>-->
           <!-- <p class="al-clearHistorySearch" @click="deleteHistory">清空历史</p>--></article>
    </section>
</template>
<script>
    import TempCache from "../../../../../static/js/tempcache";
    import comm from 'static/js/comm.js';
    import SearchCommon from  '../searchCommon/searchCommon';
    import {mapActions} from "vuex"
    import axios from "axios"
    let xhrUrl = {
        historySearchUrl:"/mcall/allsearch/searchHistory/",
        deleteHistory:"/mcall/allsearch/updateKeyword/"
    };
    export default {
        data(){
            return {
                list:[],
                showOnOff:true
            }
        },
        watch:{
            '$store.state.confirmOption'(string) {
                let t = this;
                if (parseInt(string, 10) === 1) {
                    t.layerEnsure();
                } else if (parseInt(string, 10) === 0) {
                    t.layerCancel();
                }
            },
            "$store.state.searchList"(){
                let t = this;
                if(t.$store.state.searchList.length!=0){
                    if((JSON.parse(t.$store.state.searchList)).length===0){
                        t.showOnOff = true;
                    }else{
                        t.showOnOff = false;
                    }
                }else{
                    t.showOnOff = true;
                }
            },
            '$store.state.platformType'(){
                let t = this;
                t.getHistory();
            }
        },
        computed:{
            customerId(){
                let t = this;
                return t.checkInvalid(t.$store.state.customerId)?"":t.$store.state.customerId;
            }
        },
        methods:{
            ...mapActions(["selectedKeyWord"]),
            selectedWord(searchKey){
                let t = this;
                t.$router.push({
                    path: "/searchResult"
                });
                t.selectedKeyWord({vm:t,keyVal:searchKey});
            },
            checkInvalid(val){
                return SearchCommon.checkInvalid(val);
            },
            deleteHistory(){
                let t = this;
                t.$store.state.confirmOption = JSON.stringify(
                    {
                        "title": "确定清空历史记录吗？",// 标题文本 {string}
                        "cancel": "取消", //取消按钮文本 {string}
                        "ensure": "确定"// 确认按钮文本 {string}
                    }
                );
            },
            layerEnsure(){
                let t = this;
                comm.cookie.delete("searchHistoryList"+t.customerId);
                t.list = [];
            },
            layerCancel(){
//                //console.log("取消弹窗触发函数")
            },
            getHistory(){
                let t = this;
                if(comm.cookie.get("searchHistoryList"+t.customerId)){
                    t.list = JSON.parse(comm.cookie.get("searchHistoryList"+t.customerId));
                }else{
                    t.list = [];
                }

            },
        },

        mounted(){
            let t = this;
           t.getHistory();
        }
    }
</script>