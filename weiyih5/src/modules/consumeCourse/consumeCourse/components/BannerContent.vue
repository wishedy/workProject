<template>
    <section class="al-banner" :style="{background: 'url('+courseCover+') no-repeat center center/cover'}" >
        <HeaderBar></HeaderBar>
        <h1 class="al-course-title" v-text="courseName"></h1>
    </section>
</template>
<script>
    import HeaderBar from './HeaderBar';
    import {mapGetters} from 'vuex';
    export default {
        components:{
            HeaderBar
        },
        computed:{
            ...mapGetters(['courseName','courseCover'])
        }
    }
</script>
