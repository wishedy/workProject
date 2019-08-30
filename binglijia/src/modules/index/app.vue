<template>
    <div class="alEmr-mainInner">
        <NavSideBar :sideSetting="{index:1}"></NavSideBar>
        <TopHeader @searchVal="searchVal"></TopHeader>
        <section class="alEmr-mainIndex">
            <section class="alEmr-indexInner" :class="{indexEditStatus:belongBtn}">
                <!--默认无病历开始-->
                <IndexNoCase></IndexNoCase>
                <!--默认无病历结束-->
                <!--搜索无结果开始-->
                <SearchNoList></SearchNoList>
                <!--搜索无结果结束-->
                <!--筛选条件开始-->
                <ScreeningItems></ScreeningItems>
                <!--筛选条件结束-->
                <!--筛选条件展示开始-->
                <ScreItemsShow></ScreItemsShow>
                <!--筛选条件展示结束-->
                <!--筛选无结果开始-->
                <ScreeningNoList></ScreeningNoList>
                <!--筛选无结果结束-->
                <!--病历列表开始-->
                <CaseList></CaseList>
                <!--病历列表结束-->
                <!--分页开始 v-if="noCListFlag==0"-->
                <pagination :pageIndex="pageIndex" :pageSize="pageSize" :total="Math.ceil(total/pageSize)"
                            @change="pageChange"></pagination>
                <!--分页结束-->
                <!--loading组件开始-->
                <Loading v-show="loading||scrLoading"></Loading>
                <!--loading组件结束-->
            </section>
        </section>
        <!--归属遮罩开始-->
        <BelongOpPop></BelongOpPop>
        <!--归属遮罩结束-->
        <!--归属成功提示遮罩开始-->
        <SucPop></SucPop>
        <!--归属成功提示遮罩结束-->

        <!--归属当前用户不是该团队的所有者时遮罩开始-->
        <FailPop></FailPop>
        <!--归属当前用户不是该团队的所有者时结束-->

        <!--病历不能被归属提示开始-->
        <NotBelongPop></NotBelongPop>
        <!--病历不能被归属提示结束-->
        <!--病历归属选择团队开始-->
        <SelectTeamPop></SelectTeamPop>
        <!--病历归属选择团队结束-->
        <!--病历正在被编辑-->
        <Popup :editing="editing" :editingTxt="editingTxt" :isTwo="isTwo" :isTwoTxt="isTwoText"
               @popupFn="popupFn"></Popup>
        <!--病历正在被编辑结束-->
        <!--删除遮罩开始-->
        <DeleteOpPop></DeleteOpPop>
        <!--删除遮罩开始-->
        <!--提示选择一个病例或者是请选择同一主管医生开始-->
        <p class="popup" v-if="chooseTips!==0">{{chooseTips===0?"":(chooseTips===1?"请选择一个病例！":"请选择同一主管医生！")}}</p>
        <!--提示选择一个病例或者是请选择同一主管医生结束-->
    </div>
</template>
<script>
    import NavSideBar from '~components/common/NavSideBar.vue';
    import TopHeader from '~components/common/TopHeader.vue';
    import IndexNoCase from './components/indexNoCase.vue';
    import SearchNoList from './components/searchNoList.vue';
    import ScreeningItems from './components/screeningItems.vue';
    import ScreItemsShow from './components/screItemsShow.vue';
    import ScreeningNoList from './components/screeningNoList.vue';
    import CaseList from './components/caseList.vue';
    import SelectTeamPop from './components/selectTeamPop.vue';
    import NotBelongPop from './components/notBelongPop.vue';
    import BelongOpPop from './components/belongOpPop.vue';
    import SucPop from './components/belongSuccessPop.vue';
    import FailPop from './components/belongFailPop.vue';
    import pagination from '~components/pagination/pagination.vue';
    import Loading from '~components/loading/loading.vue';
    import comm from '~utils/comm.js';
    import Popup from '~components/popupTip/popupTip.vue';
    import { mapActions, mapGetters } from 'vuex';
    import DeleteOpPop from './components/deleteOpPop.vue';

    export default {
        name: 'index-app',
        data() {
            return {
                nowSearch: ''//当年页面的搜索值
            };
        },
        components: {
            NavSideBar,//侧边连
            TopHeader,//顶部栏
            pagination,//分页
            IndexNoCase,//首页默认无病历
            SearchNoList,//搜索无结果
            ScreeningItems,//筛选条件的选项
            ScreItemsShow,//筛选条件选中的展示
            ScreeningNoList,//筛选无结果
            CaseList,//病历列表
            SelectTeamPop,//选择团队列表弹层
            NotBelongPop,//病历不能被归属弹层
            BelongOpPop,//病历归属操作弹层
            SucPop,//归属成功提示弹层
            Loading,//loading
            FailPop,//失败提示组件
            Popup,//正在被编辑状态弹层
            DeleteOpPop//删除弹层
        },
        computed: {
            ...mapGetters(['orderType', 'sIdList', 'tNameList', 'tIdList', 'createIdList', 'doctorIdList', 'belongType',
                'pageIndex', 'pageSize', 'total', 'loading', 'searchKey', 'belongBtn', 'scrShowFlag', 'sTeamFlag',
                'teamFailPerson', 'teamSuccess', 'alBelongFail', 'scrLoading', 'editing', 'editingTxt',
                'isTwo', 'isTwoText', 'sexId', 'ageMin', 'ageMax', 'deleteBtn','chooseTips'])
        },
        methods: {
            ...mapActions(['caseListInit', 'pageIndexChange', 'searchKeyChange', 'allBtnFlagChange', 'orderTypeChange',
                'sIdListChange', 'tNameListChange', 'ageMinChange', 'ageMaxChange', 'sexIdChange', 'tIdListChange', 'belongTypeChange',
                'scrShowArrChange', 'scrShowFlagChange', 'belongCancel', 'editingChange', 'deCancel', 'notAgeFlagChange',
            ]),
            //病历正在被编辑提示弹层
            popupFn(flag) {
                this.editingChange(flag);
            },
            //分页点击变化
            pageChange(pageIndex) {
                let t = this;
                t.pageIndexChange(pageIndex);
                t.caseListInit();
                t.allBtnFlagChange(false);//下一页的全选置为未激活
            },
            //当前页面搜索参数获取
            searchVal(data) {
                let t = this;
                t.nowSearch = data;
                t.searchKeyChange(data);
            },
            //跳转页面搜索参数获取
            searchParam() {
                let t = this;
                if (!t.nowSearch) {//如果当前页面的搜索不存在，查找链接的搜索
                    if (comm.getpara().q) {
                        t.searchKeyChange(comm.getpara().q);
                    } else {//如果连接中没有搜索参数，进行列表请求
                        t.caseListInit();
                    }
                }
            },
            //执行恢复默认列表的样式 操作方法调用
            resetFn() {
                let t = this;
                t.pageIndexChange(1);//筛选和搜索操作
                t.caseListInit();
                if (t.belongBtn) {//如果有归属操作 归属操作取消
                    t.belongCancel();//执行取消选中按钮同步操作，选中列表状态取消
                }
                if (t.deleteBtn) {//如果有删除的操作，删除操作取消
                    t.deCancel();//执行删除取消操作步骤
                }
            }
        },
        watch: {
            orderType() {//排序
                let t = this;
                t.pageIndexChange(1);//排序 筛选和搜索操作
                t.caseListInit();
            },
            sIdList() {//初步诊断
                let t = this;
                t.resetFn();
            },
            createIdList() {//创建者id
                let t = this;
                t.resetFn();
            },
            doctorIdList() {//主管医生id
                let t = this;
                t.resetFn();
            },
            tNameList() {//标签
                let t = this;
                t.resetFn();
            },
            sexId() {//性别
                let t = this;
                t.resetFn();
            },
            ageMin() {//年龄开始
                let t = this;
                t.resetFn();
            },
            tIdList() {//归属
                let t = this;
                t.resetFn();
            },
            belongType() {//归属个人
                let t = this;
                t.resetFn();
            },
            searchKey() {//搜索变化
                let t = this;
                t.pageIndexChange(1);//筛选和搜索操作
                if (t.orderType == 0) {
                    t.caseListInit();
                } else {
                    t.orderTypeChange(0);//排序默认
                }
                if (t.belongBtn) {//如果有归属操作 归属操作取消
                    t.belongCancel();//执行取消选中按钮同步操作，选中列表状态取消
                }
                if (t.deleteBtn) {//如果有删除的操作，删除操作取消
                    t.deCancel();//执行删除取消操作步骤
                }
                if (t.scrShowFlag) {//如果有筛选条件，筛选条件取消
                    t.sIdListChange({ val: '', flag: false });//初步诊断为空
                    t.tNameListChange({ val: '', flag: false });//标签为空
                    t.ageMinChange('');//年龄为空
                    t.ageMaxChange('');//年龄为空
                    t.sexIdChange('');//性别为空
                    t.notAgeFlagChange(false);//年龄允许编辑重启
                    t.tIdListChange({ val: '', flag: false });//归属团队列表
                    t.belongTypeChange('');//归属个人点击
                    t.scrShowFlagChange(false);//筛选条件没有激活
                    t.scrShowArrChange({ val: '', flag: false });//筛选条件展示数组
                }
            },
            sTeamFlag() {//选择团队弹层显示隐藏
                if (this.sTeamFlag) {
                    comm.bodyScroll();
                } else {
                    comm.bodyNoScroll();
                }
            },
            teamFailPerson() {//不是当前团队的所有者弹层显示
                if (this.teamFailPerson) {
                    comm.bodyScroll();
                } else {
                    comm.bodyNoScroll();
                }
            },
            teamSuccess() {//归属成功弹层
                if (this.teamSuccess) {
                    comm.bodyScroll();
                } else {
                    comm.bodyNoScroll();
                }
            },
            alBelongFail() {//有不能归属的病历
                if (this.alBelongFail) {
                    comm.bodyScroll();
                } else {
                    comm.bodyNoScroll();
                }
            }
        },
        mounted() {
            let t = this;
            t.searchParam();
        },
        metaInfo: {
            title: '全部病历'
        }
    };
</script>
<style lang="scss">
    @import '../../assets/scss/pages/index.scss';
</style>
