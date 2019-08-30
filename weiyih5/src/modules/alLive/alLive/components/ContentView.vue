<template>
    <section class="al-alLive-content">
        <LiveDocument v-show="tabIndex===0"></LiveDocument>
        <LiveAgenda v-show="tabIndex===1"></LiveAgenda>
        <LiveChat v-show="tabIndex===2"></LiveChat>
    </section>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';
    import LiveDocument from './LiveDocument';
    import LiveAgenda from './LiveAgenda';
    import LiveChat from './LiveChat';
    export default {
        computed:{
            ...mapGetters(['tabIndex'])
        },
        components:{
            LiveDocument,
            LiveAgenda,
            LiveChat
        }
    }
</script>