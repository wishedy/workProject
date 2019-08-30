<template>
    <section class="al-elite-conferenceItem" v-if="!isEmptyObject(conferenceConfig)" @click.stop="openMeeting({
     conId:conferenceConfig.conId
    })" @mousedown.stop="trackAction(conferenceConfig)">
        <figure class="conferenceBg" :style="{background: 'url('+conferenceConfig.picUrl+') no-repeat center center/cover'}" v-if="!checkInvalid(conferenceConfig.picUrl)"></figure>
        <article class="conferenceInfo">
            <h1 class="conferenceTitle" v-text="conferenceConfig.conName" v-if="conferenceConfig.liveState!=2"></h1>
            <h1 class="conferenceTitle" v-if="conferenceConfig.liveState==2">
                <div class="live-state onLiving">
                    <div class="status">
                        <i class="icon"></i>
                        直播中
                    </div>

                </div>
                <span class="conName" v-text="conferenceConfig.conName" ></span>
            </h1>
            <h1 class="conferenceDetailInfo">
                <span class="icon"></span>
                <span class="address" v-text="conferenceConfig.conPlace"></span>
                <span class="dateIcon"></span>
                <span class="dateTime" v-text="formatStartTime(conferenceConfig.startTime)+'-'+formatStartTime(conferenceConfig.endTime)"></span>
            </h1>
        </article>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    import comm from 'static/js/comm.js';
    export default{
        props:{
            conferenceConfig:{
                default(){
                    return {};
                }
            }
        },
        methods:{
            openMeeting(config){
              EliteSdk.openMeeting(config);
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            checkInvalid(str){
                return comm.checkInvalid(str);
            },
            formatStartTime(str){
                let timeOriginal = str.split(' ');
                let date = timeOriginal[0].split("-");
                let myDate = new Date();
                let fullYear = myDate.getFullYear();
                if(parseInt(date[0],10)===fullYear){
                    return  date[1]+"/"+date[2];
                }else{
                    return date[0]+"/"+date[1]+"/"+date[2];
                }
            },
            trackAction(data){
                let _this = this;
                let routerName = _this.$route.name;
                let config = {};
                switch (routerName) {
                    case 'home':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会会议栏目-单个会议',
                            keyWord:'菁英会',
                            actionId:'11665',
                            refId:data.conId
                        };
                        break;
                    case 'conference':
                        config = {
                            browseName:'往届会议-菁英会',
                            actionName:'往届会议列表-单个会议',
                            keyWord:'菁英会',
                            actionId:'11680',
                            refId:data.conId
                        };
                        break;
                }
                console.log(JSON.stringify(config));
                EliteSdk.trackAction(config);
            },
        }
    }
</script>
