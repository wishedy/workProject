<template>
    <section class="al-elite-liveItem" v-if="config.liveState!==-1" @click.stop="openLiveTerminal(config)" @mousedown.stop="trackAction(config)">
        <section class="al-elite-liveCard" :style="{background: 'url('+config.picUrl+') no-repeat center center/cover'}">
            <div class="al-elite-liveStatus onLiving" :class="{'onLiving':config.liveState===2,'liveBack':config.liveState===4,'announce':config.liveState===1,'liveEnd':config.liveState===3}">
                <div class="status"><i class="icon" v-if="(config.liveState===1||config.liveState===2)"></i>{{config.liveDes}}</div>
                <div class="onLiveNum" :class="{'onLiveNum':config.liveState===4,'onLiveTime':config.liveState===1}" v-text="(config.liveState===1)?config.formatStartTime:config.livePeopleNum" v-if="(config.liveState===1||config.liveState===4)"></div>
            </div>
        </section>
        <article class="al-elite-liveDes" :class="{'onLivingLiveDes':config.liveState===2,'liveBackLiveDes':config.liveState===4,'announceLiveDes':config.liveState===1,'liveEndLiveDes':config.liveState===3}">
            <i class="dot"></i>
            <p class="content" v-text="config.liveName">
            </p>
        </article>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        props:{
            config:{
                default(){
                    return {
                        liveState:-1,
                        liveTime:'',
                        liveAudienceNum:'',
                        liveName:''
                    }
                }
            }
        },
        mounted(){
          setTimeout(()=>{
              $(".al-elite-liveDes .dot").each(function(){
                  let isThisElement = $(this);
                  isThisElement.width(isThisElement.height());
                  isThisElement.css({"borderRadius":'50%'});
              });
          },300);
        },
        methods:{
            trackAction(data){
                let _this = this;
                let routerName = _this.$route.name;
                let config = {};
                switch (routerName) {
                    case 'home':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会直播栏目-单个直播',
                            keyWord:'菁英会',
                            actionId:'11662',
                            refId:data.liveId
                        };
                        break;
                    case 'face':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会直播列表-单个直播',
                            keyWord:'菁英会',
                            actionId:'11688',
                            refId:data.liveId
                        };
                        break;
                }
                console.log(JSON.stringify(config));
                EliteSdk.trackAction(config);
            },
            openLiveTerminal(config){
                let liveJson = {
                    id:config.id,
                    playBackId:config.boradcastRecoderId,
                    authcode:config.boradcastAuthcode ,
                    conSubRoom:config.boradcastRoomNum,
                    liveId:config.liveId,
                    authority:config.authority,
                    userId:config.boradcastUserId,
                    liveState:config.liveState,
                    startTime:config.formatStartTime,
                    title:config.liveName
                };
                EliteSdk.openLiveTerminal(liveJson);
            }
        }
    }
</script>