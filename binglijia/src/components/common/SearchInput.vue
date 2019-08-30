<template>
    <section class="alEmr-searchInput">
        <input type="text" placeholder="搜索病历信息" v-model="search" @keyup="keySearch">
        <b @click="searchInfo"></b>
    </section>
</template>
<script>
    import comm from '~utils/comm.js';
    export default {
        data(){
            return{
                search:''
            }
        },
        methods:{
            searchInfo(){
                if(this.search){
                    if(window.location.pathname!='/'){
                        window.location.href="/?q="+this.search;
                    }else {
                        this.$emit('searchVal',this.search)
                    }
                }else{
                    if(window.location.pathname=='/'){
                        this.$emit('searchVal',this.search);
                    }
                }
            },
            keySearch(ev){
                if(ev.keyCode==13){
                    this.searchInfo();
                }
            }
        },
        mounted(){
            let search = comm.getpara().q;
            this.search = search;
        }
    }
</script>
<style lang="scss">
    .alEmr-searchInput{
        float: left;
        margin: 18px 0;
        width: 180px;
        height: 44px;
        line-height: 44px;
        position: relative;
        box-sizing: border-box;
        background: #FFFFFF;
        border: 1px solid #A1ADBE;
        border-radius: 100px;
        input{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            border: none;
            height: 100%;
            width: 140px;
            margin-left: 20px;
            color: #333;
            font-size: 16px;
        }
        b{
            position: absolute;
            z-index: 3;
            top: 14px;
            right: 13px;
            width: 14px;
            height: 14px;
            background: transparent url(//img10.allinmd.cn/v3/message/top_search.png) center center no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }
    }
</style>
