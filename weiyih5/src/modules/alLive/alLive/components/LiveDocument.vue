<template>
    <section class="al-alLive-innerContent">
        <section  :id="parseInt(liveType,10)===0?'drawPanel':'playbackPanel'"></section>
    </section>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        data(){
            return {
                mag:''
            }
        },
        computed:{
            ...mapGetters(['liveType'])
        }
    }
</script>
