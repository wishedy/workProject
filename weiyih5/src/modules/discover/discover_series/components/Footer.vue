<template>
    <section class="popularLecturer" v-show="list.length>0">
        <aside class="title">受欢迎讲师</aside>
        <aside class="list swiper-container swiper-container-horizontal swiper-container-free-mode">
            <ul class="swiper-wrapper " data-alcode-mod="641" style="transform: translate3d(0px, 0px, 0px);">
                <li class="swiper-slide swiper-slide-active" v-for="(i,v) in list"><a
                        :href="'/dist/personal/others_index.html?cid='+i.customerId"> <img
                        :src="i.logoUrl"
                        alt=""> </a>
                    <p>{{i.name}}</p></li>

            </ul>
        </aside>
    </section>
</template>
<script>
    import {mapActions} from "vuex"
    export default {
        watch: {
            $route() {
                let t = this;
                t.routeParam = t.$route.params;
                if ((t.$store.state[t.courseRecommendTeacher[t.routeParam.typeNum + ""]]).length) {
                    let temData = JSON.parse(t.$store.state[t.courseRecommendTeacher[t.routeParam.typeNum + ""]]);
                    t.list = temData.data_list;
                }else{
                    t.getAuthorInfo({"type":t.routeParam.typeNum});
                }
                t.swipe();
            },
            "$store.state.recommendTeacher"(){
                let t = this;
                t.initPage(0);
            },
            "$store.state.woundTeacher"(){
                let t = this;
                t.initPage(9);
            },
            "$store.state.spineTeacher"(){
                let t = this;
                t.initPage(7);
            },
            "$store.state.jointTeacher"(){
                let t = this;
                t.initPage(2);
            },
        },
        methods:{
            ...mapActions(["getAuthorInfo"]),
            initPage(type){
                let t = this;
                let temData = JSON.parse(t.$store.state[t.courseRecommendTeacher[type + ""]]);
                t.list = temData.data_list;
                t.swipe();
            },
            swipe(){
                let t = this;
                //4.受欢迎讲师start滑动
                let swiper = new Swiper('.swiper-container', {
                    slidesPerView: "auto",
                    paginationClickable: true,
                    freeMode: true,
                    observer: true
                });
            }
        },
        data(){
          return {
              routeParam:"",
              list:[],
              courseRecommendTeacher:{"0": "recommendTeacher", "9": "woundTeacher", "7": "spineTeacher", "2": "jointTeacher"}
          }
        },
        mounted(){
            let t = this;
            t.routeParam = t.$route.params;
            t.getAuthorInfo({"type":t.routeParam.typeNum});
        }
    }
</script>

