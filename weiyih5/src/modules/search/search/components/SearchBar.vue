<template>
    <section class="al-searchInputBar" data-alcode-mod="454">
        <!--<i class="icon-searchWhite"></i>-->
        <div class="searchCancel" @click="returnBack()"></div>
        <form action="javascript:;">
                <!--<span class="platformSelect searchText30" :data-platformid="platform" @click.stop="changePlatform()">{{des}}</span>-->
            <input class="searchText" type="search" :placeholder="preWord" max="35" v-model="searchStr" @keydown="changeInput($event,searchStr)">
            <section class="al-personalContributionSelector ev_switchPlatform" :class="{'al-personalSelectorOn':showPlatform}">
                <ul>
                    <li class="al-personalContributionSelectorItem " :class="{activeP:switchP}" data-platformid="1" @click.stop="setPlatForm(1)">骨科</li>
                    <li class="al-personalContributionSelectorItem" :class="{activeP:!switchP}" data-platformid="2" @click.stop="setPlatForm(2)">手外科</li>
                </ul>
            </section>
        </form>
        <i class="icon-searchCancel"></i>
        <!--<button class="al-searchCancel" data-alcode="e75">
            取消
        </button>-->
        <button class="searchBtn" @click="selectedWord">搜索</button>
    </section>
</template>
<script>
    import {mapActions,mapGetters} from "vuex";
    import comm from "static/js/comm.js";
    export default {
        data(){
            return {
                selectedKey:"",
                searchStr:"",
                showPlatform:false,
                switchP:true,
            }
        },
        beforeMount(){
          this.searchStr = decodeURIComponent(comm.getparaNew().keyword||"");
        },
        mounted(){
            let t = this;
            let body = document.querySelector('body');
            body.addEventListener('click',(e)=>{
                t.showPlatform = false;
            },false);
            if(t.$store.state.platformType==1){
                this.switchP = true;
            }else if(t.$store.state.platformType==2){
                this.switchP = false;
            }
        },
        computed:{
            ...mapGetters(['preWord']),
            searchKey(){
                let t = this;
                return JSON.parse(t.$store.state.searchData);
            },
            des(){
                let t = this;
                return (parseInt(this.$store.state.platformType,10)===1)?"骨科":"手外科";
            },
            platform(){
                let t = this;
                return parseInt(this.$store.state.platformType,10)
            }
        },
        watch:{
            "searchStr"(newStr){
                let t = this;
              let lastData = JSON.parse(t.$store.state.searchData);
                t.$store.state.searchData =JSON.stringify({"searchStr":newStr,"associateOnOff":lastData.associateOnOff}) ;
            },
            "$store.state.selectedStr"(newStr){
                let t = this;
                t.searchStr = newStr;
            },
            "$store.state.searchData":{
                handler(Data) {
                    let t = this;
                    let newData = JSON.parse(Data);
                    if(newData.searchStr&&newData.searchStr.length&&newData.associateOnOff){
                        t.searchInfo(newData.searchStr);
                    }else{
                        t.$store.state.searchList = "";
                    }
                },
                deep: true
            }
        },
        methods:{
            ...mapActions(["searchInfo","selectedKeyWord","shareInit"]),
            changePlatform(id){
              let t = this;
                t.showPlatform = !t.showPlatform;
            },
            setPlatForm(id){
              let t = this;
                t.$store.state.platformType = id;
                t.showPlatform = false;
                t.switchP =!t.switchP;
            },
            returnBack(){
                if(localStorage.getItem("searchOriginal")){
                    g_sps.jump(null,localStorage.getItem("searchOriginal"));
                }else{
                    g_sps.jump(null,'/');
                }

            },
            selectedWord(){
                let t = this;
                if((t.searchStr.length===0)&&(t.preWord!="搜索")&&(t.preWord.length!==0)){
                    t.searchStr = t.preWord;
                }
                t.$router.push({
                    path: "/searchResult"
                });
                t.selectedKeyWord({vm:t,keyVal:t.searchStr});
            },
            changeInput(e,searchKey){
                let t = this;
//                //console.log("进入",parseInt(e.keyCode,10))
                if (parseInt(e.keyCode,10) === 13) {
                    t.$router.push({
                        path: "/searchResult"
                    });
                    t.selectedKeyWord({vm:t,keyVal:searchKey});
                } else {
                    let lastData = JSON.parse(t.$store.state.searchData);
                    t.$store.state.searchData =JSON.stringify({"searchStr":lastData.searchStr,"associateOnOff":true}) ;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "scss/pages/search/search_index";
    @import "scss/base";
    .al-searchInputBar{
        font-size: 0;
        border-bottom: solid 1px  #D7DBDE;
        .platformSelect{
            position: relative;
        }
        .al-personalContributionSelectorItem{
            font-size: rem(34px);
        }
        .al-personalContributionSelectorItem.activeP{
            font-weight: bold;
        }
        .al-personalContributionSelector ul:before{
            left: 50%;
        }
    }
    .al-mainInner .al-searchInputBar{
        .searchText30{
            font-size: rem(30px);
        }
        .searchText{
            font-size: rem(32px);
            padding-left: 5%;
            float: left;
            width: 94%;
        }
    }
    .al-mainInner .al-searchInputBar input::-webkit-input-placeholder { /* WebKit browsers */
        font-size: rem(32px);
    }
    .al-mainInner .al-searchInputBar input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        font-size: rem(32px);
    }
    .al-mainInner .al-searchInputBar input::-moz-placeholder { /* Mozilla Firefox 19+ */
        font-size: rem(32px);
    }
    .al-mainInner .al-searchInputBar input:-ms-input-placeholder { /* Internet Explorer 10+ */
        font-size: rem(32px);
    }
    .searchBtn{
        display: inline-block;
        vertical-align: middle;
        background: #3CAEFA;
        border-radius: 0 6px 6px 0;
        width: 1.4rem;
        height: 1.12rem;
        line-height: 1.12rem;
        font-size: 0.4rem;
        color: #FFFFFF;
    }
    .al-searchInputBar form{
        background: rgba(205, 205, 205, 0.2) url(//img50.allinmd.cn/index/searchBorder.png) no-repeat;
        background-size: cover;
        width: 71%;
        display: inline-block;
        vertical-align: middle;
        float: none;
        input{
            width: rem(355px);
            padding: 0;
            display: inline-block;
            background: none;
            border: none;
        }
    }
    .searchCancel{
        display: inline-block;
        vertical-align: middle;
        @extend %al-arrowIcon;
        margin-right: rem(45px);
    }
</style>
