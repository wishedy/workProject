<template>
    <header class="al-indexHeader" data-alcode-mod='401' id="header" :style="!backOnOff?'position:inherit':''">
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)" @click="backBtn"  v-show="backOnOff">
                <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
            </a>
        </figure>
        <figure class="al-indexHeaderItem">
            <h1>{{title}}</h1>
        </figure>
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)"  v-show="editOnOff" @click="compileBtn"><i></i>{{subhead}}</a>
        </figure>
    </header>
</template>

<script>
    import comm from "static/js/comm";
    import {mapActions} from "vuex";
    export default{
        data(){
            return {
                backOnOff:true,
                title:'消息',
                editOnOff:false,
                subhead:'编辑',
            }
        },
        methods:{
            backBtn(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                window.history.back();
            },
            compileBtn(){
                if(!this.$store.state.compileOrCancel){
                    this.subhead = '取消';
                    this.change(true);               //控制内容部分1.左右移动，显示勾选按钮，添加类  2.页脚显示与否
                    this.setAllDelete(false);        //控制全部选项，为false的时候置空
                }else{
                    this.subhead = '编辑';
                    this.change(false);
                    this.setAllDelete(true);
                }
            },
            ...mapActions(["change","headerBtn","setAllDelete","setHeaderHeight"])
        },
        mounted(){
            this.setHeaderHeight($('#header').height());
            let nowRouterName = (this.$route.path).substring(1, 100);
            let type = this.$store.state.pageType[nowRouterName];
            switch(type){
                case 0:
                    this.backOnOff = false;
                    this.title = '消息'; break;
                case 1:
                    this.backOnOff = true;
                    this.title = '关注提醒'; break;
                case 2:
                    this.backOnOff = true;
                    this.title = '提醒我看'; break;
                case 3:
                    this.backOnOff = true;
                    this.title = '赞了我的'; break;
                case 4:
                    this.backOnOff = true;
                    this.title = '评论我的'; break;
            }
        },
        watch:{
            $route(to,from){
                let nowRouterName = (this.$route.path).substring(1, 100);
                let type = this.$store.state.pageType[nowRouterName];
                switch(type){
                    case 0:
                        this.headerBtn(false);
                        this.backOnOff = false;
                        this.title = '消息'; break;
                    case 1:
                        this.backOnOff = true;
                        this.title = '关注提醒'; break;
                    case 2:
                        this.backOnOff = true;
                        this.title = '提醒我看'; break;
                    case 3:
                        this.backOnOff = true;
                        this.title = '赞了我的'; break;
                    case 4:
                        this.backOnOff = true;
                        this.title = '评论我的'; break;
                }
                this.change(false);
                this.subhead = '编辑';
            },
            "$store.state.isShowCompile"(){
                let state = this.$store.state.isShowCompile;
                if(state){
                    this.editOnOff = true;
                }else{
                    this.editOnOff = false;
                }
            }
        },
    }
</script>