<template>
    <section class="al-indexHeader">
        <figure class="al-indexHeaderItem">
            <i class="icon"></i>
        </figure>
        <figure class="al-indexHeaderItem title">会议</figure>
        <figure class="al-indexHeaderItem">
            <!--<span class="al-wakeApp-icon"></span>
            <span class="al-wakeApp-btn" @click.stop="awakeApp">打开APP</span>-->
        </figure>
    </section>
</template>
<script>
    export default {
        data(){
            return {
                msg:''
            }
        },
        methods:{
            awakeApp(){
                let _this = this;
                _this.$emit("awakeApp");
            }
        }
    }
</script>