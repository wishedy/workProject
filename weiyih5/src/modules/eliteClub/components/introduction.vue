<template>
    <section class="al-router-view" >
        <!--<header class="al-indexHeader" data-alcode-mod='401' id="header">
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>中国骨科菁英会</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>&nbsp;</h1>
            </figure>
        </header>-->
        <section class="al-introduction">
            <article class="al-introduction-item">
                <h3 class="small-title pro-title">简介</h3>
                <p class="paragraph-content">
                    中国骨科菁英会是由中国人民解放军总医院骨科主任王岩教授于2014年创始的骨科青年菁英协会。
                </p>
                <p class="paragraph-content">
                    菁英会旨在通过专业知识的分享与传递，领导力的培养，不断发掘和培养中国骨科未来的领军人才，带领中国骨科走向更高层次的国际舞台，使中国骨科成为世界舞台上不可或缺的重要力量。
                </p>
                <p class="paragraph-content">
                    菁英会以打造中国骨科阶梯式的人才队伍与菁英社团为使命，旨在引领中国骨科未来发展的全新模式，建立高层次全方位的国内与国际的骨科交流平台。
                </p>
            </article>
            <article class="al-introduction-item">
                <h3 class="small-title">组织结构</h3>
                <article class="structure">
                    <div class="Top-level">菁英会-主席</div>
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
                                    执行委员
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
                                    执行委员
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
                                    执行委员
                                    <i></i>
                                </b>
                            </em>
                            <i class="small-line"></i>
                        </p>
                        <p class="item">
                            ···
                            <i class="small-line"></i>
                        </p>
                        <p class="item">
                            总干事
                            <i class="small-line"></i>
                        </p>
                        <p class="item">
                            秘书处
                        </p>
                    </div>
                </article>
            </article>
            <article class="al-introduction-item">
                <h3 class="small-title">规章办法</h3>
                <ul class="regulation">
                    <li class="regulation-item">
                        <router-link tag="span" :to="{name:'charter'}"   @click.native="scrollStore" class="name">中国骨科菁英会总章程</router-link>
                        <router-link tag="span" :to="{name:'charter'}"  @click.native="scrollStore" class="learn">查看</router-link>
                    </li>
                    <li class="regulation-item">
                        <router-link tag="span" :to="{name:'management'}"   @click.native="scrollStore" class="name">中国骨科菁英会会员管理办法</router-link>
                        <router-link tag="span" :to="{name:'management'}"  @click.native="scrollStore" class="learn">查看</router-link>
                    </li>
                    <li class="regulation-item">
                        <router-link tag="span" :to="{name:'election'}"   @click.native="scrollStore" class="name">中国骨科菁英会活动举办办法</router-link>
                        <router-link tag="span"  :to="{name:'election'}"  @click.native="scrollStore" class="learn">查看</router-link>
                    </li>
                </ul>
            </article>
        </section>
    </section>
</template>
<style scoped lang="scss">
    @import "scss/pages/eliteClub/eliteClub";
</style>
<script>
    const $ = require('jquery');
    import {mapGetters,mapActions} from  'vuex';
    export default {
        mounted(){
         /*   if(!((typeof  appjs)==='undefined')){
                appjs.updateTitle('中国骨科菁英会组织结构');
            } */
         let t = this;
            if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                appjs&&appjs.updateTitle('中国骨科菁英会组织结构');
            }
            $(".al-mainInner").scrollTop(t.scrollTop);
            $('html,body',document,".al-mainInner").animate({scrollTop: t.scrollTop}, 0);
        },
        computed:{
            ...mapGetters(['scrollTop'])
        },
        methods:{
            ...mapActions(['changeScrollTop']),
            scrollStore(){
                let t = this;
                t.changeScrollTop($(document).scrollTop());
            }
        }
    }
</script>
