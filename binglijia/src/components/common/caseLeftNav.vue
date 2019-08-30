<template>
    <section class="caseLeftNav" v-if="templateOnOff">
        <div class="addColumn" @click.stop="addSub">
            <i></i><span>添加</span>
        </div>
        <ul>
            <li v-for="(item,index) in subPageData" :key="index" @click.stop="changeSubIndex({set:false,index:index})" :class="{'active':subIndex==index}">{{titleName}}{{subPageData.length-index}}
                <!--<div class="delete">
                    <div class="deletePopup">
                        <p>您确定删除术后{{item.item.contentDes}}的全部内容吗</p>
                        <div class="deleteBtn">
                            <button>确认</button>
                            <button>取消</button>
                        </div>
                    </div>
                </div>-->
            </li>
            <!--<li class="active">第二次</li>-->
        </ul>
    </section>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import Logo from './Logo.vue';
    export default {
        props:['navName'],
        components:{
            Logo
        },
        watch:{
            navName(n,o){
                ////console.log('头部组件',this.navName,n,o)
            },
            subPageData(n){
                ////console.log('触发侧边栏');
                ////console.log(n.length);
            },
            pageIndex(n){
                let t = this;
                ////console.log(this.tabList[t.pageIndex].isAdd);
            }
        },
        methods:{
            ...mapActions(['changeSubIndex','addSubPage','toast']),
          'saveCaseInfo'(){
              this.$emit('quitSaveCaseInfo');
          },
            addSub(){
                let t = this;
                if(t.uploadState){
                    t.addSubPage();
                }else{
                    t.toast('您有内容正在上传中，请稍后');
                }

            }
        },
        computed:{
            ...mapGetters(['subPageData','subIndex','titleName','pageIndex','tabList','uploadState']),
            templateOnOff(){
                let t = this;
                return t.tabList.length>0&&t.tabList[t.pageIndex]&&(parseInt(t.tabList[t.pageIndex].isAdd)==1);
            }
        },
        mounted(){
            //console.log(this.uploadState);
            ////console.log('头部组件',this.navName)
        }
    }
</script>
<style scoped lang="scss">
@import "../../assets/scss/components/caseLeftNav.scss";
</style>
