<template>
    <section class="courseBanner">
        <img :src="bannerImg" alt="">
        <nav class="introduction">
            <ul data-alcode-mod="643" data-alcode-item-selector="li">
                <router-link tag="li" to="/produce" active-class="active" replace>
                    <span>介绍</span>
                </router-link>
                <router-link tag="li" to="/catalog" active-class="active" replace>
                    <span>目录</span>
                </router-link>
                <router-link tag="li" to="/related" active-class="active" replace>
                    <span>相关课程</span>
                </router-link>
            </ul>
        </nav>
    </section>
</template>
<script>

    import {mapActions} from "vuex"
    export default {
        data() {
            return {
                bannerImg:""
            }
        },
        mounted(){
            let t = this;
            t.getCourseInfo();
        },
        methods: {
            ...mapActions(["getCourseInfo"]),
        },
        watch:{
            "$store.state.courseInfo"(){
                let t = this;
                let temData = JSON.parse(t.$store.state.courseInfo);
                t.bannerImg = temData.courseCoverPicUrl;
            }
        }
    }
</script>