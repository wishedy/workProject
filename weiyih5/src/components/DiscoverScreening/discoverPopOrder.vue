<template>
    <section class="al-typeFilterMainMask" :class="{'active':mNavBarOp.topTabFlag&&mNavBarOp.indexPop===aPopIndex}">
        <section class="al-twoFloorFilter" data-alcode-mod='405' data-alcode-item-selector="article">
            <article class="al-oneFloorFilterItem EV-filterScene" :class="{'active':parseInt(dataScene)===(aPopIndex===1?5:4)}" @click="typeClick(0,aPopIndex===1?5:4)">智能排序</article>
            <article class="al-oneFloorFilterItem EV-filterScene" :class="{'active':parseInt(dataScene)===(aPopIndex===1?2:1)}" @click="typeClick(1,aPopIndex===1?2:1)">最新发布</article>
            <article class="al-oneFloorFilterItem EV-filterScene" :class="{'active':parseInt(dataScene)===(aPopIndex===1?4:3)}" @click="typeClick(2,aPopIndex===1?4:3)">最多浏览</article>
            <article class="al-oneFloorFilterItem EV-filterScene" :class="{'active':parseInt(dataScene)===(aPopIndex===1?3:2)}" @click="typeClick(3,aPopIndex===1?3:2)">最多评论</article>
        </section>
    </section>
</template>
<script>
    /**
     * 功能描述：按专业/疾病/术式/类型的  "智能排序"筛选弹层
     * 使用方法: <组件名 :navTwoNo="navTwoNo"></组件名>
     *          data(){
     *              return{
     *                  navBarOp:{
     *                      dataScene:4,//智能排序
                            typeVal:-1,//全部类型（上边两项传默认值就好）
                            indexPop:0,
                            topTabFlag: false,
                            //navTwoNo:true
                        },
     *              }
     *          }
     * 注意事件： //navTwoNo:true//关于顶部类型的导航条，在弹层中不用传（传值也不影响），主要控制“全部类型的显示和隐藏”
     * 引入来源：
     * 作用：
     * Created by HJ on 2017/11/30.
     */
    import comm from 'static/js/comm.js'
    export default {
        props: ['navBarOp'],
        data() {
            return {
                index: 0,
                mNavBarOp: this.navBarOp,
                aPopIndex:2,//只能排序默认index为2
                dataScene:this.navBarOp.dataScene,
            }
        },
        methods: {
            //判断有没有省略第二项全部类型
            navTNFun(){
                let t=this;
                if(t.mNavBarOp.navTwoNo){
                    t.aPopIndex=1;
                }
            },
            //点击类型进行筛选操作
            typeClick(k, val) {//k为当前点击项目的索引，val为当前点击项目的筛选类型
                let t = this;
                t.dS="";
                t.index = k;
                if (t.mNavBarOp.topTabFlag) {
                    t.mNavBarOp.topTabFlag = false;
                } else {
                    t.mNavBarOp.topTabFlag = true;
                }
                t.dataScene=val;
                let str = "智能排序";
                if( t.aPopIndex===1){
                    switch (val){
                        case 2:
                            str='最新发布';
                            break;
                        case 3:
                            str='最多评论';
                            break;
                        case 4:
                            str='最多浏览';
                            break;
                        case 5:
                            str='智能排序';
                            break;
                        default:
                            str='智能排序';
                            break;
                    }
                }else{
                    switch (val){
                        case 1:
                            str='最新发布';
                            break;
                        case 2:
                            str='最多评论';
                            break;
                        case 3:
                            str='最多浏览';
                            break;
                        case 4:
                            str='智能排序';
                            break;
                        default:
                            str='智能排序';
                            break;
                    }
                }
                comm.creatEvent({
                    triggerType:'列表资源排序',
                    keyword:str,
                    actionId:k+46
                });
            }
        },
        computed: {
            topTabFlagChange() {
                return this.mNavBarOp.topTabFlag;
            }
        },
        watch: {
            topTabFlagChange() {//监听顶部点击标志
                let t = this,
                    param = {
                        dataScene:t.dataScene,
                        topTabFlag: t.mNavBarOp.topTabFlag
                    };
                t.$emit('param-change', param);
            }
        },
        mounted() {
            let t = this;
            t.navTNFun();
        }
    }
</script>

