<template>
    <nav class="al-typeFilterNavbar" data-alcode-mod='402' data-alcode-item-selector="span">
        <section class="al-typeFilterNavbarItem" :class="{'active':index===0&&mNavBarOp.topTabFlag}"
                 @click="navBarClick(0)"
                 :style="{width:widths+'%'}" data-role="filter">
            <!--<span>{{mNavBarOp}}</span>-->
            <span v-text="mNavBarOp.screeName?(mNavBarOp.screeName.length>5?(mNavBarOp.screeName).substring(0,4)+'...':mNavBarOp.screeName):'全部分类'"></span>
        </section>
        <section v-if="!navBarOp.navTwoNo" class="al-typeFilterNavbarItem"
                 :class="{'active':index===1&&mNavBarOp.topTabFlag}" @click="navBarClick(1)"
                 :style="{width:widths+'%'}" data-role="type">
            <span>{{mNavBarOp.typeVal|typeName}}</span>
        </section>
        <section class="al-typeFilterNavbarItem" :class="{'active':index===indexParam&&mNavBarOp.topTabFlag}"
                 @click="navBarClick(indexParam)"
                 :style="{width:widths+'%'}" data-role="sort">
            <span>{{mNavBarOp.dataScene,mNavBarOp.navTwoNo|OrderName}}</span>
        </section>
    </nav>
</template>
<script>
    /**
     * 功能描述： 按产品、全部渠道、排序的筛选头部
     * 使用方法: <组件名 :navTwoNo="navTwoNo"></组件名>
     *          data(){
     *              return{
     *                  navBarOp:{
     *                      dataScene:4,//智能排序
                            typeVal:-1,//全部类型
                            //indexPop:0,
                            topTabFlag: false,
                            navTwoNo:true
                        },
     *              }
     *          }
     * 注意事件： 排除“全部类型”一项，如果不需要排除该项，组件中和data不传参数navTwoNo即可
     *           //indexPop:0,//关于顶部导航条此项不用传（传值也不影响）,主要控制弹层的显示和隐藏
     * 引入来源：
     * 作用：
     * Created by ZHD on 2019/07/12.
     */
    export default {
        props: ['navBarOp'],
        data() {
            return {
                indexParam:2,
                index: 0,//默认点击打开筛选
                widths: 33.33,
                mNavBarOp: this.navBarOp,
            }
        },
        methods: {
            //判断宽度，当缺少一项时
            widthCom() {
                let t = this;
                if (t.navBarOp.navTwoNo) {
                    t.widths = 50;
                    t.indexParam=1;
                }
            },
            //点击事件class
            navBarClick(i) {
                let t = this;
                if(t.index===i){
                    if (t.mNavBarOp.topTabFlag) {
                        t.mNavBarOp.topTabFlag = false;
                    } else {
                        t.mNavBarOp.topTabFlag = true;
                    }
                    let param = {
                        indexPop: t.index,
                        topTabFlag: t.mNavBarOp.topTabFlag
                    };
                    t.$emit('param-change', param);
                }else{
                    t.index = i;
                }
                switch (parseInt(i)) {
                    case 0:
                        comm.creatEvent({
                            triggerType:'全部类别筛选',
                            actionId:11721
                        });
                        break;
                    case 1:
                        comm.creatEvent({
                            triggerType:'全部渠道筛选',
                            actionId:11723
                        });
                        break;
                    case 2:
                        comm.creatEvent({
                            triggerType:'产品排序',
                            actionId:11725
                        });
                        break;
                }
            }
        },
        watch: {
            index(){//监听检测，如果点击的索引变了进行判断修改topTabFlag,来控制展开收起筛选弹层
                let t=this;
                if(!t.mNavBarOp.topTabFlag){
                    t.mNavBarOp.topTabFlag = true;
                }
                let param = {
                    indexPop: t.index,
                    topTabFlag: t.mNavBarOp.topTabFlag
                };
                t.$emit('param-change', param);
            }
        },
        mounted() {
            this.widthCom();
        },
        filters:{
            typeName(type){
                let str = String;
                switch (parseInt(type)){
                    case 0:
                        str='全部渠道';
                        break;
                    case 1:
                        str='国产';
                        break;
                    case 2:
                        str='进口';
                        break;
                    case 3:
                        str='国外销售';
                        break;
                    default:
                        str='全部渠道';
                        break;
                }
                return str;
            },
            OrderName(naType,navTwoNo){
                let str = String;
                if(navTwoNo){
                    switch (parseInt(naType)){
                        case 6:
                            str='A-Z排序';
                            break;
                        case 4:
                            str='最多浏览';
                            break;
                        case 2:
                            str='最新发布';
                            break;
                        default:
                            str='A-Z排序';
                            break;
                    }
                }else{
                    switch (parseInt(naType)){
                        case 6:
                            str='A-Z排序';
                            break;
                        case 4:
                            str='最多浏览';
                            break;
                        case 2:
                            str='最新发布';
                            break;
                        default:
                            str='A-Z排序';
                            break;
                    }
                }

                return str;
            }
        }
    }
</script>

