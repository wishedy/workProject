<template>
    <section class="al-alLive-innerContent">
        <aside class="scheduleList" v-for="(item,key) in agendaList" :key="key">
            <div class="listLi">
                <div class="scheduleContDate">
                    <div class="scheduleTime"></div>
                    <div class="scheduleTitle" v-text="key"></div>
                </div>
                <div class="scheduleCont" v-for="(innerItem,index) in item" :key="key+index">
                    <div class="scheduleTime" v-text="formatTime(innerItem)"></div>
                    <div class="scheduleTitle" @click.stop="jumpVideoUrl(innerItem)"><p class="gray" v-text="innerItem.topic"></p>
                        <p v-text="'主讲人：'+innerItem.lecturer"></p></div>
                </div>
            </div>
        </aside>
        <div class="small-agenda-list" v-show="agendaOnOff">
            <ul class="list-info" v-for="(item,key) in agendaList" :key="'agenda-list'+key">
                <li class="list-item" v-text="formatDate(key)"></li>
            </ul>
        </div>
    </section>
</template>
<script>
    import {mapGetters} from 'vuex';
    import comm from 'static/js/comm.js';
    export default {
        data(){
            return {
                "msg":''
            }
        },
        computed:{
            ...mapGetters(['agendaList','agendaOnOff'])
        },
        watch:{
            agendaList(n){
                console.log(n);
            }
        },
        methods:{
          formatTime(item){
             return  item.startTime.substring(item.startTime.indexOf(' '), item.startTime.length).substring(0, 6);
          },
            formatDate(key){
                let dateListItem = key.split('-');

                return parseInt(dateListItem[1],10)+'月'+parseInt(dateListItem[2],10)+'日';
            },
            jumpVideoUrl(item){
              let _this = this;
              if(comm.checkInvalid(item.videoUrl)){
                  return false;
              }else{
                  //跳转视频终端
                  g_sps.jump(null,"/html/m/" + item.videoUrl);
              }
            }
        },
        mounted(){
            let _this = this;
            console.log(_this.agendaList)
        }
    }
</script>