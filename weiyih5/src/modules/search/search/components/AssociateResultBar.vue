<template>
    <section class="al-searchResult ev-lenovo" style="margin-top:0.3rem;" data-alcode-mod="457" v-show="list.length>0">
        <article class="al-searchResultItem lenovoword-iteam" :data-propertyId="0" v-for="(v,i) in list" v-html="replaceHtml(v.keyWord)" @click="selectedWord(v.keyWord)">
        </article>
    </section>
</template>
<script>
    import {mapActions} from "vuex"
    export default {
        data(){
            return {
                list:[],
                searchVal:''
            }
        },
        watch: {
            "$store.state.searchList"(val) {
                let t = this;
                if(t.$store.state.searchList.length){
                    t.list = (JSON.parse(t.$store.state.searchList)).responseObject.responseData.dataList;
                }else{
                    t.list = [];
                }
            },
            "$store.state.searchData":{
                handler(Data) {
                    let t = this;
                    let newData = JSON.parse(Data);
                    if(newData.searchStr){
                        if(!newData.associateOnOff){
                            t.list = [];
                        }
                        if(newData.searchStr.length===0){
                            t.list = [];
                        }
                        t.searchVal = newData.searchStr;
                    }else{
                        t.list = [];
                    }
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(["selectedKeyWord"]),
            selectedWord(searchKey){
                let t = this;
                t.$router.push({
                    path: "/searchResult"
                });
                t.selectedKeyWord({vm:t,keyVal:searchKey})
            },
            replaceHtml(value) {
                let t = this;
                let r = RegExp(t.searchVal,"g");
                return value.replace(r,"<em>"+t.searchVal+"</em>");

            }
        }
    }
</script>