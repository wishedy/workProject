<template>
    <section class="al-help-container">
        <section class="al-help-module">
            <h1 class="al-help-title">
                <span class="icon"></span>
                <span class="smallTitle">使用帮助</span>
            </h1>
            <ul class="al-help-list">
                <router-link  tag="h1" :to='{name:"settled"}' class="al-help-item" @click.native="scrollStore">
                    <span>如何入驻</span>
                    <router-link tag="span"  :to='{name:"settled"}' class="icon"></router-link>
                </router-link>
                <router-link  tag="h1" :to='{name:"open"}' class="al-help-item" @click.native="scrollStore">
                    <span>如何开通在线咨询服务</span>
                    <router-link tag="span"  :to='{name:"open"}' class="icon"></router-link>
                </router-link>
                <router-link  tag="h1" :to='{name:"advisory"}' class="al-help-item" @click.native="scrollStore">
                    <span>如何使用在线咨询服务</span>
                    <router-link tag="span"  :to='{name:"advisory"}' class="icon"></router-link>
                </router-link>
                <router-link  tag="h1" :to='{name:"income"}' class="al-help-item" @click.native="scrollStore">
                    <span>如何获得收入</span>
                    <router-link tag="span"  :to='{name:"income"}' class="icon"></router-link>
                </router-link>
            </ul>
        </section>
        <section class="al-help-module">
            <h1 class="al-help-title secTitle">
                <span class="icon online"></span>
                <span class="smallTitle">在线咨询回复须知</span>
            </h1>
            <ul class="al-help-list">
                <router-link tag="li" :to='{name:"precautions"}' class="al-help-item" @click.native="scrollStore">
                    <span>回复注意事项</span>
                    <router-link   tag="span"  :to='{name:"precautions"}' class="icon"></router-link>
                </router-link>
                <router-link tag="li" :to='{name:"specification"}' class="al-help-item" @click.native="scrollStore">
                    <span>咨询回复规范</span>
                    <router-link  tag="span"  :to='{name:"specification"}' class="icon"></router-link>
                </router-link>
                <router-link tag="li" :to='{name:"standard"}' class="al-help-item" @click.native="scrollStore">
                    <span>医患流质量衡量标准</span>
                    <router-link tag="span"  :to='{name:"standard"}' class="icon"></router-link>
                </router-link>
            </ul>
        </section>
        <section class="al-help-module lastModule">
            <router-link   tag="h1"   :to='{name:"practiceIntroduction"}' class="al-help-title lastTitle" @click.native="scrollStore">
                <p class="lastBar"><span class="icon text"></span>
                    <span class="smallTitle">在线执业服务介绍</span></p>
                <router-link tag="i"   :to='{name:"practiceIntroduction"}'  class="jumpTo"></router-link>
            </router-link>
            <router-link   tag="h1"   :to='{name:"aboutUs"}'  class="al-help-title lastList" @click.native="scrollStore">
                <p class="lastBar"><span class="icon us"></span>
                    <span class="smallTitle">关于我们</span></p>
                <router-link tag="i"   :to='{name:"aboutUs"}'  class="jumpTo"></router-link>
            </router-link>
            <router-link   tag="h1"   :to='{name:"contactCustomerService"}'  class="al-help-title lastList" @click.native="scrollStore">
                <p class="lastBar"><span class="icon linkMe"></span>
                    <span class="smallTitle">联系客服</span></p>
                <router-link tag="i"   :to='{name:"contactCustomerService"}'  class="jumpTo"></router-link>
            </router-link>
        </section>
    </section>
</template>
<script>
    import  {mapActions} from 'vuex';
    export default {
        methods:{
            ...mapActions(['changeTitle','changeScrollTop']),
            scrollStore(){
                let t = this;
                t.changeScrollTop($(document).scrollTop());
            }
        },
        mounted(){
            let t = this;
            t.changeTitle('帮助中心');
        }
    }
</script>