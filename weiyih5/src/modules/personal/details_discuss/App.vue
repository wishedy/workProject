<template>
    <section class="al-mainInner">
        <ReviewTemplate :config="{'name':'discuss'}"></ReviewTemplate>
    </section>
</template>

<script type="text/ecmascript-6">
    import ReviewTemplate from "components/ReviewTemplate/ReviewTemplate"
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        data(){
            return {}
        },
        components:{
          ReviewTemplate
        },
        methods: {

        },
        mounted(){

        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base.scss";
    @import "scss/pages/personal/personal_myComment.scss";
    @import "scss/pages/details/details_content.scss";
</style>
