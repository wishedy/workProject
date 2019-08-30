<template>
    <section class="al-alLive-innerContent">
        <ChatList></ChatList>
        <ChatInput></ChatInput>
    </section>
</template>
<script>
    import ChatInput from './ChatInput.vue';
    import ChatList from './ChatList.vue';
    export default {
        data(){
            return {
                "msg":''
            }
        },
        components:{
            ChatInput,
            ChatList
        }
    }
</script>