<template>
    <section class="al-topHandleBar">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail"></HeaderBar>
        <TabBar :tabIndex="tabIndex"></TabBar>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import TempCache from "static/js/tempcache";
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import TabBar from './TabBar';
    import {mapGetters} from 'vuex';
    export default {
        components:{
            HeaderBar,
            TabBar
        },
        props:{
            tabIndex:{
                default(){
                    return 0;
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            }
        },
        computed:{
          ...mapGetters(['courseName','courseData'])
        },
        watch:{
            courseName(n){
                const _this = this;
                _this.headerConfig.title = n;
            },
            courseData(n){
                const _this = this;
                if(!_this.isEmptyObject(n)){
                    _this.headerConfig.params = {
                        sceneType: '99',
                        customerId: TempCache.getItem('userId') || '',
                        courseName: _this.courseName,
                        teacherName: _this.courseData.teacherName,
                        appCoverPicUrl: _this.courseData.appCoverPicUrl,
                        courseId: (_this.courseId+'')
                    }
                }
            }
        },
        data(){
            let customerId = comm.checkInvalid(TempCache.getItem("userId"))?'':TempCache.getItem("userId");
            let courseId = comm.getparaNew().courseId;
            return {
                customerId:customerId,
                courseId:courseId,
                headerConfig: {
                    title: "",  //  *标题项
                    share: {            // ..自定义分享项
                        onOff: true,
                        params: {},
                        authority: 1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff: true,
                    editOnOff: false
                },
            }
        }
    }
</script>
<style lang="scss">
    .al-indexHeader .al-indexHeaderItem{
        &:nth-of-type(2){
            width: 6rem;
        }
    }
</style>
