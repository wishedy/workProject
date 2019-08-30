<template>
    <p @click="follow" :class="followConfig.className" v-cloak style="display: inline-block">
        <a href="javascript:;"
           :class='{
           "al-doctorRecommendFollow btn-primary":state==1||state==3,//1.未关注
           "al-doctorRecommendFollowed btn-done":state==2,//关注
           "al-doctorRecommendFollowBtn btn-dobule":state==4//相互关注
           }'
           style="cursor:pointer;">{{msg}}</a>
    </p>
</template>
<script>
    const xhrUrl = {
      create:'/mcall/customer/follow/people/create/'
    };
    import user from 'static/js/module.user'
    import axios from "axios"
    import comm from 'static/js/comm'
    export default {
        data(){
          return {
              state:1
          }
        },
        computed:{
            msg(){
                let msg;
                if(this.state==1||this.state==3){
                    msg="关注";
                }else if(this.state==2){
                    msg="已关注";
                }else if(this.state==4){
                    msg="相互关注";
                }
                return msg;
            }
        },
        mounted(){
          let t = this;
            this.state = this.followConfig.followState;
        },
        methods:{
            follow(){
                let t = this;
                let param = t.followConfig;
                let refId = param.refId;
                const  createFocus = function(){
                    axios({
                        url: xhrUrl.create,
                        method: "POST",
                        data: {
                            dataFlag: 2,
                            refId: refId
                        },
                        transformRequest: [function (data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(function (res) {
                        if(res.data.responseObject.responseStatus){
                            t.state = 2;
                        }
                    });
                };
                if(this.state==2||this.state==4){
                    return false
                }else{
                    user.privExecute({
                        callback: function() {
                            comm.creatEvent({
                                triggerType:'关注',
                                pushMessageId:refId,
                                actionId:4
                            });
                            createFocus();
                        },
                        operateType: "auth",
                        noNeedBack:true
                    })
                }



            }
        },
        watch:{
            state:{
                handler(){

                },
                deep:true
            }
        },
        props:["followConfig"]
    }
</script>
<style lang="scss" scoped>
    .al-doctorRecommendFollow.btn-primary{
        padding: 0;
    }
    .al-doctorRecommendFollow.btn-done{
        padding: 0;
    }
</style>