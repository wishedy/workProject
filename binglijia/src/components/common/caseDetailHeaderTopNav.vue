<template>
    <div>
        <section class="headerTopNav caseTopHeader">
            <logo></logo>
            <aside class="crumbs">病历夹<i></i><span class="detailTxt">病历详情</span><span v-show="detailShow">{{baseMustInfo[0]}}</span><span v-show="detailShow">{{baseMustInfo[2]}}</span><span v-show="detailShow">{{baseMustInfo[1]}}</span></aside>
            <aside class="saveBtn editBtn" @click.stop="editBtnCli()" v-show="!(belongType==0&&assistantDoctor)">
                <span>编辑</span>
            </aside>
            <aside class="operationLog">
                <span @click.stop="operationLog()">操作日志</span>
            </aside>
            <aside class="logDetail" v-show="opeLogCli" @click.stop>
                <aside class="logTitle">
                    <p v-show="!noneOpeLog">操作日志</p>
                    <i @click.stop="quitPopup(1)"></i>
                </aside>
                <aside class="logDesc">
                    <!--操作日志-->
                    <ul v-show="haveOpeLog">
                        <li v-for="(item,inex) in listItem">
                            <div class="logLeft">
                                <img :src="item.customerLogo.replace('http:','')" />
                            </div>
                            <div class="logRight">
                                <p class="logRigTop">
                                    <span>{{item.customerName|nameSub}}</span>
                                    <span>{{item.opType|typeFilter}}病历</span>
                                    <span>{{item.createTime|dateFilter}}</span>
                                </p>
                                <p class="logRigBot">{{item.structureName}}</p>
                            </div>
                        </li>
                    </ul>
                    <!--无操作日志-->
                    <div class="noneLogImg" v-show="noneOpeLog&&!haveOpeLog">
                        <img src="/static/images/pages/caseDetail/logNone.png" alt="">
                    </div>
                    <div class="noneLogTxt" v-show="noneOpeLog">
                        暂无操作日志
                    </div>
                </aside>
            </aside>
            <aside class="editCont" v-show="editCont" @click.stop>
                <div class="editDesc" v-show="editing">
                    当前病历正在被其他团队成员编辑中
                    请稍后再试
                </div>
                <div class="editDesc" v-show="editQuit">
                    检测到异常退出，当前病历正在保护期
                    请稍后再试
                </div>
                <button @click.stop="quitPopup(2)">
                    知道了
                </button>
            </aside>
        </section>
    </div>
</template>
<script>
    import Logo from './Logo.vue';
    import comm from "~utils/comm.js";
    import loading from '~components/loading/loading.vue';
    import {mapActions,mapGetters} from 'vuex';
    const $ = require('jquery');
    export default {
        data(){
            return {
                opeLogCli:false,//表示点击操作日志
                haveOpeLog:false,//表示有操作日志
                noneOpeLog:false,//没有操作日志
                editCont:false,//点击编辑
                editing:false,//正在编辑
                editQuit:false,//异常退出
                // caseId:1532051698149,
                caseId:comm.getpara().caseId,
                listItem:[],//操作日志所有数据
                // cId:1505888492588,
                cId:comm.cookie.get('userId'),
                firstResult:0,
                maxResult:10,
                isNOne:false,//没有更多的操作日志
                ajaxing:false,//操作日志正在请求中
                caseFlag:false,//标识病历没有被锁定
                detailShow:false,//是否显示顶部信息
                templateId:comm.getpara().templateId,//获取到templateId
                assistantDoctor:parseInt(comm.cookie.get("customerRole"))===13,
            };
        },
        components:{
            Logo,
            loading
        },
        computed:{
            ...mapGetters(["showLoad","baseMustInfo",'isBlong','belongType','doctorId'])
        },
        methods:{
            ...mapActions(['showLoadi','baseMust','chaDoctorId']),
            operationLog(){//操作日志点击
                let t=this;
                if(t.opeLogCli){
                    t.opeLogCli=false;//表示点击操作日志
                }else{
                    t.opeLogCli=true;//表示点击操作日志
                }
                if(t.listItem==''){
                    t.waterfall();
                }
            },
            waterfall(){
                let t = this;
                t.ajaxing=true;
                comm.ajax2({
                    url: '/call/caseFolder/log_case_customerOperation/getMapList/',
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({firstResult:t.firstResult*t.maxResult,maxResult:t.maxResult,caseId:t.caseId})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.ajaxing=false;
                        t.showLoadi(false);
                        if(res&&res.responseObject&&res.responseObject.responseStatus){//有操作日志
                            if(!res.responseObject.responseData.data_list&&t.listItem==''){//第一次请求时没有操作日志
                                t.noneOpeLog=true;//没有操作日志
                                t.isNOne = true;
                            }else if(res.responseObject.responseData.data_list){//不是第一次请求时获取操作日志不为空
                                t.firstResult++;
                                t.haveOpeLog=true;
                                t.noneOpeLog = false;
                                t.listItem=t.listItem.concat(res.responseObject.responseData.data_list);
                                if(res.responseObject.responseData.data_list.length<t.maxResult){
                                    t.isNOne = true;
                                }
                            }else{
                                t.isNOne = true;
                            }
                        }else{
                            t.haveOpeLog=false;//有操作日志
                            t.noneOpeLog=true;//没有操作日志
                            t.isNOne = true;
                        }
                    }
                });
            },
            //点击退出弹层
            quitPopup(type){
                let t = this;
                if(type==1){//表示是点击操作日志'X'
                    if(t.opeLogCli){
                        t.opeLogCli=false;//表示点击操作日志
                    }else{
                        t.opeLogCli=true;//表示点击操作日志
                    }
                }else{//表示点击被保护弹层'知道了'
                    t.editCont=false;//点击编辑
                    t.editing=false;//正在编辑
                    t.editQuit=false//异常退出
                }
            },
            editBtnCli(){//点击编辑
                let t = this;
            //    调用接口看看是否可以进行编辑页面
                t.showLoadi(true);
                comm.ajax2({
                    url: '/call/caseFolder/baseinfo/update/',
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({customerId:t.cId,caseId:t.caseId,updateFlag:0})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.showLoadi(false);
                        if(res&&res.responseObject&&res.responseObject.responseStatus){
                            switch (parseInt(res.responseObject.responseCode)) {
                                case 0://未锁定
                                    sessionStorage.removeItem('emrNewCaseCaseId');
                                    sessionStorage.setItem('newCasesSource',window.location.href);
                                    if(!t.templateId||t.templateId==0){
                                        window.location.href = '/newCases/index.html?caseId='+ t.caseId +'&edit=0&doctorId='+t.doctorId+'#tplate';
                                    }else{
                                        window.location.href = '/newCases/index.html?caseId=' + t.caseId + '&edit=1&doctorId='+t.doctorId;
                                    }
                                    break;
                                case 1301://正在编辑
                                case 1303://正在编辑
                                    t.editCont = true;
                                    t.editing=true;//正在编辑
                                    t.editQuit=false;//异常退出
                                    break;
                                case 1302://异常退出
                                    t.editCont = true;
                                    t.editQuit=true;//点击编辑
                                    t.editing=false;//正在编辑
                                    break;
                            }
                        }
                    }
                });
            },
        },
        filters:{
            nameSub(txt){
                if(txt&&txt.length>6){
                    return txt.substring(0,5)+'...';
                }else{
                    return txt;
                }
            },
            dateFilter(txt){
                if(txt){
                    return txt.substring(0,txt.lastIndexOf('.'));
                }
            },
            typeFilter(type){
                switch (type){
                    case 1:
                        return '创建';
                    // case 2:
                    //     return '新增';
                    case 3:
                        return '编辑';
                }
            },
            ymdFilter(data){
                if(data){
                    data = (data.substring(0,data.length-1)).split(',');
                    let newData = '';
                    if(data[0]){
                        newData += data[0]+'岁';
                    }
                    if(data[1]){
                        newData += data[1]+'月'
                    }
                    if(data[2]){
                        newData += data[2]+'天'
                    }
                    return newData;
                }
            }
        },

        mounted(){
            let t = this;
            // if(t.isBlong){
                document.addEventListener("click",()=>{
                    t.opeLogCli=false;//点击空白或者其他区域关闭自定义时间弹层
                    t.editCont=false;
                });
                $('.logDesc').scroll(function() {
                    //console.log($('.logDesc').scrollTop());
                    //console.log($('.logDesc ul li').last()[0].offsetTop-260);
                    if($('.logDesc').scrollTop()>$('.logDesc ul li').last()[0].offsetTop-260){
                        if(!t.ajaxing&&!t.isNOne){
                            t.waterfall();
                        }
                    }
                });
            // }
            window.onscroll = function(){
                if(window.pageYOffset==0){//滑动到顶部
                    t.detailShow = false;
                }else{
                    t.detailShow = true;
                }
            }

        }
    }
</script>
<style lang="scss">
@import "../../assets/scss/components/headerTopNav.scss";
</style>
