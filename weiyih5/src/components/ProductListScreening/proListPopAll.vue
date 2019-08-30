<template>
    <section v-if="aPopIndex===1" class="al-typeFilterMainMask"
             :class="{'active':mNavBarOp.topTabFlag&&mNavBarOp.indexPop===aPopIndex}" data-role="type">
        <section class="al-twoFloorFilter" data-alcode-mod='404' data-alcode-item-selector="article">
            <article class="al-oneFloorFilterItem EV-filterType" :class="{'active':parseInt(typeVal)===0}" @click="typeClick(0,0)" data-type="0">全部渠道</article>
            <article class="al-oneFloorFilterItem EV-filterType" :class="{'active':parseInt(typeVal)===1}" @click="typeClick(1,1)" data-type="1">国产</article>
            <article class="al-oneFloorFilterItem EV-filterType" :class="{'active':parseInt(typeVal)===2}" @click="typeClick(2,2)" data-type="2">进口</article>
            <article class="al-oneFloorFilterItem EV-filterType" :class="{'active':parseInt(typeVal)===3}" @click="typeClick(3,3)" data-type="3">国外销售</article>
        </section>
    </section>
</template>
<script>
    /**
     * 功能描述：按 "全部渠道"（第二种）筛选弹层
     * 使用方法: <组件名 :navTwoNo="navTwoNo"></组件名>
     *          data(){
     *              return{
     *                  navBarOp:{
     *                      dataScene:4,//智能排序
                            typeVal:-1,//全部类型（上边两项传默认值就好，会在组件中进行相应的点击处理回传给父组件）
                            indexPop:0,
                            topTabFlag: false,
                            //navTwoNo:true
                        },
     *              }
     *          }
     * 注意事件： //navTwoNo:true//关于顶部类型的导航条，在弹层中不用传（传值也不影响），主要控制“全部类型的显示和隐藏”
     * 引入来源：
     * 作用：
     * Created by ZHD on 2019/07/12.
     */
    import comm from 'static/js/comm.js'
    export default {
        props: ['navBarOp'],
        data() {
            return {
                index: 0,
                typeVal: this.navBarOp.typeVal,//默认的筛选，全部
                mNavBarOp: this.navBarOp,
                aPopIndex: 1,//全部类型弹层默认index为1
            }
        },
        methods: {
            //判断有没有省略第二项全部类型
            navTNFun() {
                let t = this;
                if (t.mNavBarOp.navTwoNo) {
                    t.aPopIndex = 0;
                }
            },
            //点击类型进行筛选操作
            typeClick(k, val) {//k为当前点击项目的索引，val为当前点击项目的筛选类型
                let t = this;
                t.index = k;
                if (t.mNavBarOp.topTabFlag) {
                    t.mNavBarOp.topTabFlag = false;
                } else {
                    t.mNavBarOp.topTabFlag = true;
                }
                t.typeVal=val;
                // let _actionId=51;//全部
                // let _keyWord="全部";//全部
                // switch (val){
                //     case 1:
                //         _keyWord="视频";
                //         _actionId=53;
                //         break;
                //     case 2:
                //         _keyWord="文库";
                //         _actionId=54;
                //         break;
                //     case 4:
                //         _keyWord="话题";
                //         _actionId=55;
                //         break;
                //     case 7:
                //         _keyWord="病例";
                //         _actionId=52;
                //         break;
                // }
                comm.creatEvent({
                    triggerType:'全部渠道筛选项点击',
                    actionId:11724
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
                        typeVal:t.typeVal,
                        topTabFlag: t.mNavBarOp.topTabFlag,
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

