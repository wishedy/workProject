<template>
    <div class="chatInput chatInputFixed onChat" style="display: block;">
        <input type="text" class="ev-chatInput" placeholder="想说什么 ,想问什么快来加入聊天" :disabled="liveType!=0" v-model="localMsg">
        <span id="send-btn" @click.stop="sendMsg">发送</span>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import comm from 'static/js/comm.js';
    import AlLiveSdk from  '../untils/alLiveSdk';
    export default {
        data(){
          return {
              localMsg:""
          }
        },
         computed:{
             ...mapGetters(['liveType','chatTemMsg'])
         },
        methods:{
            ...mapActions(['changeChatMsg']),
            sendMsg(){
                let _this = this;
                comm.checkInvalid(_this.chatTemMsg)?'':AlLiveSdk.sendMsg(_this.chatTemMsg);
                _this.localMsg = '';
            }
        },
        watch:{
            localMsg(){
                let _this = this;
                _this.changeChatMsg(_this.localMsg);
            }
        }
    }
</script>