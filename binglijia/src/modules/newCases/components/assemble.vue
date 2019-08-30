<template>
    <section class="alEmr-indexInner" v-show="containerOnOff" :style="{paddingLeft:templateOnOff?'270px':''}">
        <section class="navLeftWidth">
            <h2 v-text="titleName"></h2>
            <aside id="assemble" ></aside>
            <ChangeIndex :class="{'caseBottomBtnW':templateOnOff}"></ChangeIndex>
        </section>
    </section>
</template>
<script>
    import assemblePage from '../assemble/assemblePage.js';
    import ChangeIndex from '../components/changeIndex.vue';
    import splitPageData from '../assemble/splitPageData.js';
    import copyPageData from '../assemble/copyPageData.js';
    import {mapGetters,mapActions} from 'vuex';
    const $  = require('jquery');
    import comm from '~utils/comm.js';
    import topfun from '../assemble/scrollTop.js';
    export default {
        mounted(){
            let t = this;
            t.changeTemplateId(false);
            if(t.tabList.length>0){
                t.rectifyIndex();
                t.updatePage();
            }
            /*if(t.subPageData.length===0){

            }else{
                t.mountPage(0,t.subPageData);
            }*/
        },
        data(){
          return{
              updateOnOff:false,
              containerOnOff:false,//当切换页面前先隐藏当前
              dynamicElement:null//动态vue对象，用来渲染动态页面
          }
        },
        components:{
            ChangeIndex
        },
        watch:{
            tabList(n){
              let t = this;
              if(n.length>0){
                  t.rectifyIndex();
                  if(!t.updateOnOff){
                      t.updatePage();
                  }
              }
            },
            subIndex(n,o){
              let t = this;
              if(o!=-1&&(parseInt(n,10)>=0)&&(t.subPageData[n])){
                  t.mountPage(n,t.subPageData);
              }
            },
            '$route':{
              handler(n,o){//主要是为了满足当触发历史回退或前进的时候重新整合动态页面
                  let t = this;
                  t.rectifyIndex();
              },
              deep:true
            },
            pageIndex(n,o){
                  let t = this;
                  if(o!=-1){
                      t.createPage();
                  }

            },
            pageInfo:{
              handler(){
              },
                deep:true
            },
            subPageData:{
                handler(){
                    //console.log('改变');
                },
                deep:true
            }
        },
        methods:{
            ...mapActions(['saveSubPageData','changeSubIndex','setTopNavTitle','saveCaseId','getBaseCaseInfo','saveCopyModelData','addSubPageData','addSubPage','changeIndex','showLoading','hideLoading','changeSaveStatus','changeUploadState','changeTemplateId','initUploadState']),
            mountPage(index,data){//新建病历动态创建页面核心所在，通过class动态生成一个vue对象，然后将其挂在到自定元素完成页面的动态渲染
                let t = this;
                let AssemblePage  = new assemblePage({templateIndex:index,data:data});
                t.dynamicElement =AssemblePage.createPage();
                t.dynamicElement.$mount("#assemble");
                t.containerOnOff = true;
            },
            rectifyIndex(){
                let t = this;
                let index = 0;
                for(let num = 0;num<t.tabList.length;num++){
                    if(parseInt(t.$route.params.menuId,10)===parseInt(t.tabList[num].menuId,10)){
                        index = num;
                    }
                }
                t.changeIndex({index:index});
            },
            updatePage(){
                let t = this;
                t.updateOnOff = true;
                if(t.tabList.length>0&&t.CaseId>0){
                    t.createPage();//assemble页面刷新或者刚进入的的时候触发
                }else{
                    if(sessionStorage.getItem('emrNewCaseCaseId')){
                        t.saveCaseId(sessionStorage.getItem('emrNewCaseCaseId'));
                        t.getBaseCaseInfo();
                    }else{
                        t.$router.push({
                            path: '/baseInfo'
                        });
                        t.changeIndex({index:-1});
                    }
                }
            },
            createPage(){
                let t = this;
                t.initUploadState();
                t.changeUploadState(true);
                t.changeSaveStatus(0);
                t.saveSubPageData([]);
                t.changeSubIndex({set:true,index:-1});//清空还原多页面的数据
                t.setTopNavTitle((t.tabList[t.pageIndex]&&t.tabList[t.pageIndex].menuName)?t.tabList[t.pageIndex].menuName:'');//在每一次渲染页面的时候改变该页面的标题以及顶部导航箭头的标题

                t.showLoading();
                //console.log(t.tabList.length>0&&t.CaseId>0);
                comm.ajax2({
                    type: 'POST',
                    url: '/call/caseFolder/template_structure/getTemplateDataList/',
                    data: {
                        paramJson:
                        JSON.stringify(
                            {
                            templateId:t.templateId,//	string	是			1531896527933
                            parentId:t.tabList[t.pageIndex].menuId,//	string	是			1531897817989
                            caseId:t.CaseId,//	string	是			""
                            visitSiteId:"1"//	string	是	站点
                        }
                        )

                    },
                    success:function(req){
                        {
                            if(req.responseObject.responseStatus){
                                t.hideLoading();
                            }
                            if(req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list){
                                if(req.responseObject.responseData.data_list.length>1){
                                    req.responseObject.responseData.data_list.splice(0,1);
                                    let CopyPageData = new copyPageData(req);
                                    t.saveCopyModelData(CopyPageData.copyData());
                                    let SplitPageData = new splitPageData(req);
                                    t.saveSubPageData(SplitPageData.splitData());
                                    t.mountPage(0,t.subPageData);
                                }else{
                                    let CopyPageData = new copyPageData(req);
                                    t.saveCopyModelData(CopyPageData.copyData());
                                    let SplitPageData = new splitPageData(req);
                                    t.saveSubPageData(SplitPageData.splitData());
                                    t.mountPage(0,t.subPageData);
                                }
                            }
                        }
                    }
                });
            }
        },
        computed:{
            ...mapGetters(['pageInfo','pageIndex','tabList','subIndex','subPageData','CaseId','titleName','templateId','baseInfo','copyModelData']),
            templateOnOff(){
                let t = this;
                return t.tabList.length>0&&t.tabList[t.pageIndex]&&(parseInt(t.tabList[t.pageIndex].isAdd)==1);
            }
        }

    }
</script>
