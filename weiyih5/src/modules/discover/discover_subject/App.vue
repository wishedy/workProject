<template>
    <section class="al-mainInner">
        <header class="al-searchHead" id="header" v-show="head" style="position: inherit;">
            <my-header :header-config="headerConfig"></my-header>
            <tabSwitch></tabSwitch>
        </header>
        <my-search></my-search>
        <Content-body></Content-body>
        <section class="al-searchFocusMask al-searchFocusMaskShow" v-show="layer"></section>
    </section>
</template>
<script>
    import myHeader from "components/HeaderBar/HeaderBar";
    import TabSwitch from "./components/TabSwitch.vue";
    import mySearch from "./components/Search.vue";
    import ContentBody from "./components/Content.vue";
    import comm from "static/js/comm";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import bus from "./assets/eventBus"
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        data(){
            return {
                height:'',      //初始化布局存入公共变量
                high:'',        //初始化布局
                head:true,      //头部隐藏
                layer:false,    //弹层是否显示
                headerConfig:{
                    title:'专题',
                    backOnOff:true,
                    backFn:function(){
                        g_sps.jump(null,'/dist/discover/discover_index.html');
                    }
                }
            }
        },
        methods:{
            layout() {
                this.height = document.getElementById('header').offsetHeight;
                this.high = this.height;
            }
        },
        components:{
            myHeader,
            TabSwitch,
            mySearch,
            ContentBody,
            WakeApp
        },
        mounted(){
            this.layout();
            let  t = this;
            bus.$on("cancelLayer",()=>{
                t.layer = false;        //搜索成功与失败隐藏弹层
            })
        },
        watch:{
            "$store.state.search"(){
                if(this.$store.state.search==1){    //点击状态
                    this.head = false;
                    this.layer = true;
                    this.high = 0;
                }else{      //取消还原状态
                    this.head = true;
                    this.layer = false;
                    this.high = this.height;
                }
            }
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/discover/discover_seminar";
</style>
