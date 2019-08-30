<template>
    <section class="caseTopNav" ref="topNav">
        <ul>
            <!--to="/baseInfo"-->
            <li   :class="{'active':pageIndex==-1}" @click.stop="jumpPage({index:-1})" v-show="$route.path.replace('/','')!=='tplate'" :style="styleWidth(tabList,0)">
                <span >基本信息</span>
            </li>
            <!--:to="'/assemble/'+item.menuId"-->
            <li v-for="(item,index) in tabList"   :class="{'active':pageIndex==index}"  :key="index" @click.stop="jumpPage({index:index})" :style="styleWidth(tabList,index)">
                <span v-text="item.menuName"></span>
            </li>
        </ul>
    </section>
</template>
<script>
    const $ = require('jquery');
    import Logo from './Logo.vue';
    import comm from '~utils/comm.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        components:{
            Logo
        },
        updated(){
            let t = this;
            t.saveNavTopHeight($(this.$refs.topNav).height());
        },
        watch:{
            tabList(newVal){
                let t = this;
                if(t.$route.params.menuId){
                    for(let num = 0;num<newVal.length;num++){
                        if(t.$route.params.menuId==newVal[num].menuId){
                            t.changeIndex({
                                index:num
                            });
                            break;
                        }
                    }
                }else{
                    //console.log(t.$route.path.replace('/',''));
                    if(t.$route.path.replace('/','')==='tplate'){
                        t.changeIndex({
                            index:0
                        });
                    }
                }

            },
            pageIndex(newVal){//监听带有tab时候的页面索引值，在索引值修改的时候，跳转页面
                let t = this;
                if(newVal>=0){
                    t.$router.push({
                        name: 'assemble',
                        params: {
                            menuId: parseInt(t.tabList[parseInt(newVal)].menuId)
                        }
                    })
                }else{
                    t.$router.push({
                        path: '/baseInfo'
                    });
                }

            }
        },
        methods:{
            ...mapActions(['saveNavTopHeight','changeIndex','showLayer','examineBasePageData','wantChangePageIndex','clickChangeBtn','checkChangeState','toast','changeHandleType','changeBaseHandleType']),
            jumpPage(options){
                let t = this;
                let routerJump = (index)=>{
                    if(index<0){
                        t.$router.push({
                            path: '/baseInfo',
                            name:'baseInfo'
                        });
                    }else{
                        t.changeHandleType({
                            index:t.pageIndex,
                            onOff:false
                        });
                        t.$router.push({
                            path: '/assemble',
                            name:'assemble',
                            params:{
                                menuId:t.tabList[index].menuId
                            }
                        });
                    }
                };
                if(t.imageErrorState||t.videoErrorState){
                    if(t.imageErrorState){
                        t.toast('图片上传失败');
                        return false;
                    }
                    if(t.videoErrorState){
                        t.toast('视频上传失败');
                        return false;
                    }
                }else if(t.uploadState){
                    if(t.pageIndex<0){
                        t.checkChangeState(0);
                    }else{
                        t.checkChangeState(1);
                    }
                    if(t.isChangeOnOff){
                        comm.ajax2({
                            url: "/call/caseFolder/baseinfo/update/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify(
                                    {
                                        customerId:comm.cookie.get("userId"),
                                        caseId:t.CaseId,
                                        updateFlag:0,
                                        lockedFlag:1
                                    }
                                )

                            },
                            success:function(res){
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    if(res.responseObject.responseCode==1302){
                                        t.showLayer(2);
                                    }else if(res.responseObject.responseCode==0){
                                        if(t.pageIndex<0){
                                            t.changeBaseHandleType(false);
                                        }else{
                                            t.changeHandleType({
                                                index:parseInt(t.pageIndex,10),
                                                onOff:false
                                            });
                                        }
                                        routerJump(options.index);
                                    }
                                }
                            }
                        });
                    }else{
                        t.wantChangePageIndex(options.index);
                        t.examineBasePageData();
                        t.clickChangeBtn();
                        if(t.changePageOnOff){
                            t.showLayer(5);
                        }
                    }
                }else{
                    t.toast('您有内容正在上传中，请稍后');
                }


            },
            styleWidth(tab,index){
                if(tab.length<=9){//一行以内
                    return {
                        'width':(100/(tab.length+1))+'%'
                    }
                }else if(tab.length>9){//多行
                    let tabRow=parseInt((tab.length-9)/10+1),tabLow=(tab.length-9)%10;
                    if(index+2<tabRow*10){
                        return {
                            'width':'10%'
                        }
                    }else if (index+2>tabRow*10&&index+2<=tabRow*10+tabLow){
                        return {
                            'width':100/tabLow+'%'
                        }
                    }

                }else{//只有基本信息
                    return {
                        'width':'100%'
                    }
                }
            }
        },
        computed:{
            ...mapGetters(['CaseId','tabList','pageIndex','templateId','changePageOnOff','isChangeOnOff','uploadState','imageErrorState','videoErrorState'])
        }
    }
</script>
<style scoped lang="scss">
@import "../../assets/scss/components/caseTopNav.scss";
</style>
