<template>
    <section class="course-1">
        <div class="course-section">
            <div class="course-section-communication active-course-1">
                <!--<MoreReplyList :relatedContent="relatedContent"-->
                               <!--:more="moreOnOff"-->
                               <!--@scrollBottom="getRelatedContent"-->
                               <!--v-if="relatedContent.length!==0"-->
                               <!--:loading="loading"-->
                               <!--:completed="completed">-->

                <!--</MoreReplyList>-->
                <MoreReplyList></MoreReplyList>
            </div>
        </div>
    </section>
</template>

<script>
    import CourseChatItem from './CourseChatItem'
    import MoreReplyList from './MoreReplyList'

    export default {
        components: {
            CourseChatItem,
            MoreReplyList
        },
        data() {
            return {
                // loading: false,
                // completed: false,
                // pageIndex: 0,
                // pageSize: 20,
                // moreOnOff: false,
                // relatedContent: [],
                // totalNum: 50,
                // bannerList: []
            }
        },
        methods:{
            getRelatedContent(){}
        },
        mounted(){
            let _this = this;
            _this.getRelatedContent();
        }

    }
</script>
