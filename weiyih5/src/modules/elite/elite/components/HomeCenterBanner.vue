<template>
    <section class="al-elite-homeCenterBanner">
        <section class="homeCenterBanner-content">
            <section class="al-elite-content">
                <router-link tag="article"  :to="{ name: 'group'}" class="al-elite-contentItem" @mousedown.native="trackAction({
            browseName:'菁英会主页',
            actionName:'组织概况-菁英会',
            keyWord:'组织概况-菁英会',
            actionId:'11657',
            refId:'14'
        })">
                  <figure class="al-elite-icon organization"></figure>
                  <h3 class="al-elite-title">组织概况</h3>
              </router-link>
                <router-link tag="article"   class="al-elite-contentItem"  :to="{ name: 'conference'}"  @mousedown.native="trackAction({
            browseName:'菁英会主页',
            actionName:'往届会议-菁英会',
            keyWord:'往届会议-菁英会',
            actionId:'11658',
            refId:'14'
        })">
                    <figure class="al-elite-icon conference"></figure>
                    <h3 class="al-elite-title">往届会议</h3>
                </router-link>
                <router-link tag="article"   class="al-elite-contentItem"  :to="{ name: 'academic'}"  @mousedown.native="trackAction({
            browseName:'菁英会主页',
            actionName:'学术报道-菁英会',
            keyWord:'学术报道-菁英会',
            actionId:'11659',
            refId:'14'
        })">
                    <figure class="al-elite-icon academicReport"></figure>
                    <h3 class="al-elite-title">学术报道</h3>
                </router-link>
            </section>
            <ImageSwiper :config="swiperConfig"></ImageSwiper>
        </section>

    </section>
</template>
<script>
    import ImageSwiper from './ImageSwiper';
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        name:'homeCenterBanner',
        components:{
            ImageSwiper
        },
        props:{
            swiperConfig:{
                default:[]
            }
        },
        methods:{
            trackAction(config){
                EliteSdk.trackAction(config);
            }
        }
    }
</script>