<template>
    <section class="courseCont">
        <ul data-alcode-mod='646' v-for="item in courseList">
            <li>
                <a :href="'/dist/discover/discover_seriesDetail.html?tId='+item.courseId">
                    <img :src="item.courseCoverPicUrl">
                </a>
                <aside>
                    <p>
                        <a :href="'/dist/discover/discover_seriesDetail.html?tId='+item.courseId" v-text="item.courseName"></a>
                    </p>
                    <p><i></i>{{item.totalLearnNum}}<span>{{item.catalogNum}}节课</span></p>
                </aside>
            </li>
        </ul>

    </section>
</template>
<script>
    import {mapActions} from "vuex"
    export default {
        data(){
            return {
                courseList:[]
            }
        },
        mounted(){
          let t = this;
          t.getRelated();
        },
        created(){
            let t = this;
            if(t.$store.state.related.length){
                let temData = JSON.parse(t.$store.state.related);
                t.courseList = temData.data_list;
            }
        },
        methods: {
            ...mapActions(["getRelated"]),
        },
        watch:{
            "$store.state.related"(){
                let t = this;
                let temData = JSON.parse(t.$store.state.related);
                t.courseList = temData.data_list;
            }
        }

    }
</script>