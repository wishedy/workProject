<template>
    <section class="alLive-chatList" id="chatList" :class="{'chatListNothing':chatList.length===0}">
        <ul class="msg-list">
            <li v-for="(item,index) in chatList" :key="index" class="msg-item" :class="item.msgClassName">
                <div class="msg-user">
                    <em class="msg-time-tip" v-text="item.msgTime" v-if="item.msgTime"></em>
                    <i v-html="item.speakers"></i>
                </div>
                <div class="msg-content" v-html="item.msgContent"></div>
            </li>
            <li class="chat-nothing" v-if="chatList.length===0"></li>
        </ul>
    </section>
</template>
<script>
    import AlLiveSdk from  '../untils/alLiveSdk';
    import {mapGetters,mapActions} from 'vuex';
    export default {
        mounted(){
            let _this = this;

        },
        methods:{
            ...mapActions(['saveMessageItem','changeChatMsg'])
        },
        computed:{
            ...mapGetters(['documentType','chatList'])
        },
        watch:{
            chatList:{
              handler(){
                  let _this = this;
                  let ele = document.getElementById('chatList');
                  ele.scrollTop = 10000;
                  _this.changeChatMsg('');
              },
              deep:true
            },
            documentType(){//代表着直播第三方加载完毕后进行消息的接收
                let _this = this;
                AlLiveSdk.receiveMsg({
                    callBack(item){
                       // _this.saveMessageItem(item);
                    }
                });
            }
        }
    }
</script>