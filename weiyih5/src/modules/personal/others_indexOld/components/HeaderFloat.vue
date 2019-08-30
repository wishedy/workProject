<template>
    <header class="al-personalScrollHead al-personalHeadFixed" id="floatHeader">
        <h2><a href="javascript:history.back(-1);"><i class="icon-backArrow"></i></a><span class="ev-name">{{name}}</span></h2>
    </header>
</template>

<script>
    import comm from "static/js/comm";
    export default {
    	data(){
    		return {
    			name:''
            }
        },
        watch:{
            "$store.state.public"(){
                let str = this.$store.state.public.name;
                this.name = comm.getStrLen(str,20);
            }
        }
    }
</script>

<style>

</style>