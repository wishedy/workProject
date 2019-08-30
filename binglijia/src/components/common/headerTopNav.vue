<template>
    <section class="headerTopNav">
        <logo></logo>
        <aside class="crumbs">
            <span>{{crumbsTxt}}</span>
            <i v-show="pageType==1"></i>
            <span>{{navName}}</span>
        </aside>
        <!--新建比例相关右侧-->
        <aside class="saveBtn" v-show="pageType==1">
            <span v-show="saveStatus==0" @click="saveCaseInfo">保存并退出</span>                       <!--默认状态-->
            <ul v-show="saveStatus==1"><li></li><li></li><li></li></ul>         <!--loading-->
            <i v-show="saveStatus==2"></i>                                      <!--加载成功-->
        </aside>
        <!--搜索，用户-->
        <section class="alEmr-headerContainer" v-show="pageType==2">
            <section class="alEmr-headerInner">
                <SearchInput></SearchInput>
                <UserLogo></UserLogo>
            </section>
        </section>
    </section>
</template>
<script>
    import Logo from './Logo.vue';
    import SearchInput from './SearchInput.vue';
    import UserLogo from './UserLogo.vue';
    export default {
        props:{
            navName:{//面包屑名称
                type:String,
                default:''
            },
            crumbsTxt:{//当前页面
                type:String,
                default:''
            },
            pageType:{//页面类型
                type:Number,
                default:2
            },
            saveStatus:{//新建病历保存状态
                type:Number,
                default:0
            }
        },
        components:{
            Logo,
            UserLogo,
            SearchInput
        },
        watch:{

        },
        methods:{
          'saveCaseInfo'(){
              this.$emit('quitSaveCaseInfo');
          }
        },
        mounted(){
        }
    }
</script>
<style scoped lang="scss">
@import "../../assets/scss/components/headerTopNav.scss";
.alEmr-headerInner{
    float: right;
    display: inline;
    margin-right: 225px;
}
</style>
