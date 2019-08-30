<template>
    <section class="al-elite-organization">
        <HeaderBar :header-config="headerConfig" v-if="headerOnOff"></HeaderBar>
        <section class="al-introduction">
            <article class="al-introduction-item jianjieTitle">
                <h3 class="small-title pro-title">简介</h3>
                <p class="paragraph-content" v-text="introductionContent"></p>
                <div class="introduction-imageList-wrap">

                </div>
                <!--<p class="paragraph-content">
                    菁英会旨在通过专业知识的分享与传递，领导力的培养，不断发掘和培养中国骨科未来的领军人才，带领中国骨科走向更高层次的国际舞台，使中国骨科成为世界舞台上不可或缺的重要力量。
                </p>
                <p class="paragraph-content">
                    菁英会以打造中国骨科阶梯式的人才队伍与菁英社团为使命，旨在引领中国骨科未来发展的全新模式，建立高层次全方位的国内与国际的骨科交流平台。
                </p>-->
            </article>
            <ul class="introduction-imageList" v-if="introList.length">
                <section class="image-item" v-for="(config,index) in introList" :key="index" v-if="(!checkInvalid(config.imgUrl))&&(parseInt(config.isValid,10)===1)">
                    <figure class="introduction-logo" :style="{background: 'url('+config.imgUrl+') no-repeat center center/cover',backgroundSize:'cover'}" ></figure>
                    <h1 class="introduction-title" v-text="config.imgDescription" v-if="!checkInvalid(config.imgDescription)"></h1>
                </section>
            </ul>
            <article class="al-organization-structure">
                <h3 class="small-title small-structure-title">组织结构</h3>
                <section class="al-introduction-item structure">
                    <article class="structure">
                        <div class="Top-level">菁英会创始人</div>
                        <div class="second-line">
                            <span></span>
                        </div>
                        <div class="second-level">
                            <p class="item">
                                脊柱
                                <em class="small-structure">
                                    <b>
                                        主席
                                        <i></i>
                                    </b>
                                    <b>
                                        副主席
                                        <i></i>
                                    </b>
                                    <b>
                                        执行<br/>委员
                                        <i></i>
                                    </b>
                                    <b>
                                        会员
                                        <i></i>
                                    </b>
                                </em>
                            </p>
                            <p class="item">
                                关节
                                <em class="small-structure">
                                    <b>
                                        主席
                                        <i></i>
                                    </b>
                                    <b>
                                        副主席
                                        <i></i>
                                    </b>
                                    <b>
                                        执行<br/>委员
                                        <i></i>
                                    </b>
                                    <b>
                                        会员
                                        <i></i>
                                    </b>
                                </em>
                                <i class="small-line"></i>
                            </p>
                            <p class="item">
                                创伤
                                <em class="small-structure">
                                    <b>
                                        主席
                                        <i></i>
                                    </b>
                                    <b>
                                        副主席
                                        <i></i>
                                    </b>
                                    <b>
                                        执行<br/>委员
                                        <i></i>
                                    </b>
                                    <b>
                                        会员
                                        <i></i>
                                    </b>
                                </em>
                                <i class="small-line"></i>
                            </p>
                            <p class="item">
                                运动<br/>医学
                                <em class="small-structure">
                                    <b>
                                        主席
                                        <i></i>
                                    </b>
                                    <b>
                                        副主席
                                        <i></i>
                                    </b>
                                    <b>
                                        执行<br/>委员
                                        <i></i>
                                    </b>
                                    <b>
                                        会员
                                        <i></i>
                                    </b>
                                </em>
                                <i class="small-line"></i>
                            </p>
                            <p class="item">
                                总干事
                                <i class="small-line"></i>
                            </p>
                            <p class="item">
                                秘书处
                                <i class="small-line"></i>
                            </p>
                            <p class="item">
                                Elite<br/>PLUS
                            </p>
                        </div>
                    </article>
                </section>
            </article>
            <!--<article class="al-introduction-item">
                <h3 class="small-title">规章办法</h3>
                <ul class="regulation">
                    <li class="regulation-item">
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/charter"     @click.stop="scrollStore" class="name" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">中国骨科菁英会总章程</a>
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/charter"  @click.stop="scrollStore" class="learn" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">查看</a>
                    </li>
                    <li class="regulation-item">
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/management"    @click.stop="scrollStore" class="name" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">中国骨科菁英会会员管理办法</a>
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/management"  @click.stop="scrollStore" class="learn" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">查看</a>
                    </li>
                    <li class="regulation-item">
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/election"     @click.stop="scrollStore" class="name" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">中国骨科菁英会活动举办办法</a>
                        <a href="//m.allinmd.cn/dist/eliteClub.html#/election"   @click.stop="scrollStore" class="learn" @mousedown.stop="trackAction({
                        browseName:'菁英会主页',
                            actionName:'规章办法',
                            keyWord:'菁英会',
                            actionId:'11674',
                            refId:14
                        })">查看</a>
                    </li>
                </ul>
            </article>-->
        </section>

    </section>
</template>
<script>
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import EliteSdk from '../untils/eliteCommSdk';
    import {mapActions,mapGetters} from 'vuex';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import TempCache from "../../../../../static/js/tempcache";
    let userId = TempCache.getItem('userId');
    const xhrUrl = {
        introduction:EliteSdk.introduction
    };
    export default {
        components:{
            HeaderBar
        },
        data()
        {
            return {
                introList:[],
                introductionContent:'',
                headerConfig:{
                    title:"组织详情",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "91",
                            customerId:userId,
                            visitSiteId:2
                        },
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff:true
                }
            }
        },
        methods:{
            ...mapActions(['changeScrollTop']),
            scrollStore(){
                let _this = this;
                _this.changeScrollTop($(document).scrollTop());
            },
            checkInvalid(val){
                return comm.checkInvalid(val);
            },
            getIntroduction(){
                let _this = this;
                axios.get(xhrUrl.introduction, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList){
                            _this.introductionContent = res.data.responseObject.responseData.dataList[0].introduction;
                            _this.introList = res.data.responseObject.responseData.dataList[0].introList;
                        }

                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            },
            trackAction(config){
                EliteSdk.trackAction(config);
            }
        },
        computed:{
            ...mapGetters(['scrollTop','organizationName']),
            headerOnOff(){
                return !EliteSdk.appPort;
            }
        },
        watch:{
            organizationName(){
                let _this = this;
                EliteSdk.setTitle({
                    seoTitle:_this.organizationName+`的学术报道-唯医骨科,allinmd`,
                    title:_this.organizationName
                });
            }
        },
        mounted(){
            let _this = this;
            $('html,body',document).animate({scrollTop: _this.scrollTop}, 0);
            EliteSdk.setTitle({
                seoTitle:_this.organizationName+`的组织详情-唯医骨科,allinmd`,
                title:'组织详情'
            });
            _this.getIntroduction();
        }
    }
</script>