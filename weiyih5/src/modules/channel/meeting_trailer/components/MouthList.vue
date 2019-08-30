<template><!--会议预告页面顶部月份点击-->
    <section class="titleTab ev-titleTab">
        <ul>
            <li :class="isActive(v)" v-for="(v,i) in monthArr" :key="i" @click="mouthTab">{{v+'月'}}</li>
        </ul>
    </section>
</template>

<script>
    /*会议预告页面顶部月份点击*/
    import comm from 'static/js/comm.js'
    import {mapActions, mapGetters} from "vuex"
    export default {
        name: "mouth-list",
        data(){
          return {
              monthArr:[1,2,3,4,5,6,7,8,9,10,11,12],
              index:"",
          }
        },
        computed:{
            ...mapGetters(['nowMouth','meetingState']),//时间
        },
        methods:{
            ...mapActions(['nowMouthChange','meetingStateChange','subjectTeamIdChange',
                'shootStateChange','runStateChange','majorNameChange','stateNameChange',
                'isLiveChange']),
            isActive(index){
                if(this.nowMouth==index){
                    return 'active';
                }
            },
            mouthTab(e){
                let t=this;
                if(t.index!==parseInt(e.currentTarget.innerText,10)){
                    t.subjectTeamIdChange("");
                    t.runStateChange("");
                    t.shootStateChange("");
                    t.isLiveChange(false);
                    t.majorNameChange("专业");
                    t.stateNameChange("会议状态");
                }
                t.index=parseInt(e.currentTarget.innerText,10);
                t.nowMouthChange(t.index);
                let  targetParent=e.currentTarget.parentNode ,
                     halfWinWidth = window.innerWidth / 2,
                     ulWidth = targetParent.clientWidth,
                     liWidth = ulWidth / 12,
                     elScroll=t.$el.scrollLeft,
                     s=e.currentTarget.offsetLeft-elScroll +e.currentTarget.clientWidth,
                     _nowMonth = new Date().getMonth() + 1;
                    if (t.index !== _nowMonth) {//当前点击不是当前月分
                        t.meetingStateChange(false);
                    } else {//当前点击是当前月份
                        t.meetingStateChange(true);
                    }
                    //水平居中

                    if (e.currentTarget.offsetLeft + elScroll > halfWinWidth) {
                        jQuery(t.$el).scrollLeft(elScroll+s - halfWinWidth - liWidth / 2,0)
                    } else {
                        jQuery(t.$el).scrollLeft(0,0);
                    }
                    comm.creatEvent({
                        triggerType: '会议tab',
                        triggerName: "会议预告月份tab",
                        keyword: e.currentTarget.innerText,
                        actionId: 11013
                    });
            }
        }
    }
</script>

<style scoped>

</style>