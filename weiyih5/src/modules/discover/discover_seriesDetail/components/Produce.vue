<template>
    <section class="introductionCont" v-cloak>
        <section class="introductionText"><p>{{courseInfo.courseName}}</p>
            <p style="">浏览：{{courseInfo.totalLearnNum|toWkh}}<span>共{{courseInfo.catalogNum}}节课</span></p></section>
        <section class="taecherIntroduction" style="">
            <aside class="title">讲师简介</aside>
            <ul>
                <li :data-href="'/dist/personal/others_index.html?cid='+item.customerId" v-for="item in courseInfo.data_list"><a
                        :href="'/dist/personal/others_index.html?cid='+item.customerId"><img
                        :src="item.logoUrl"
                        alt="">
                    <aside>
                        <p>{{item.name}}</p>
                        <p><span>{{item.medicalTitleShow}}</span><span>{{item.company | cut}}</span></p>
                    </aside>
                </a></li>
            </ul>
        </section>
    </section>
</template>
<script>
    import comm from 'static/js/comm'
    export default {
        data() {
            return {
                courseInfo:{}
            }
        },
        created(){
          let t = this;
            if(t.$store.state.courseInfo.length){
                t.courseInfo  = JSON.parse(t.$store.state.courseInfo)
            }
        },
        watch: {
            '$store.state.courseInfo'(){
                let t = this;
                let temData = JSON.parse(t.$store.state.courseInfo);
                t.courseInfo = temData;
            }
        },
        filters:{
            toWkh:comm.toWKH,
            cut:(data)=>comm.getStrLen(data,32)
        }
    }
</script>
<style scoped lang="scss">
    .courseMore i{
        background: url('//img50.allinmd.cn/classes/course_directory_unfold.png') no-repeat;
        background-size: contain;
    }
</style>