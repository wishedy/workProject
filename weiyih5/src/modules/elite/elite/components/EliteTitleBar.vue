<template>
    <section class="al-elite-titleBar" v-if="config.title">
        <h1 class="title" v-text="config.title">
        </h1>
        <router-link tag="div" :to="{ name: config.routerPath}"  class="title-info" v-if="config.routerPath!='member'" @mousedown.native="trackAction">
            {{config.routerTitle}}
            <i class="icon" v-if="config.icon"></i>
        </router-link>
        <div  :to="{ name: config.routerPath}"  class="title-info" v-if="config.routerPath=='member'" @click.stop="jumpMemberList" @mousedown.stop="trackAction">
            {{config.routerTitle}}
            <i class="icon" v-if="config.icon"></i>
        </div>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        props:{
          config:{
              default(){
                  return {
                      title:'',
                      icon:false,
                      routerPath:'home',
                      routerTitle:''
                  }
              }
          }
        },
        methods:{
            jumpMemberList(){
                let _this = this;
                EliteSdk.jumpMemberList({
                    callBack(){
                        _this.$router.push({name:'member'});
                    }
                });
            },
            trackAction(){
                let _this = this;
                let routerPath = _this.config.routerPath;
                let config = {

                };
                switch (routerPath) {
                    case 'conference'://往届会议
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会会议栏目-更多',
                            keyWord:'菁英会',
                            actionId:'11663',
                            refId:14
                        };
                        break;
                    case 'member'://成员列表
                        config = {
                            browseName:'菁英会主页',
                            actionName:'组织成员-查看详细',
                            keyWord:'菁英会',
                            actionId:'11673',
                            refId:14
                        };
                        break;
                    case 'academic'://学术概况
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会近期报道-更多',
                            keyWord:'菁英会',
                            actionId:'11666',
                            refId:14
                        };
                        break;
                    case 'face'://菁英面对面
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会直播栏目-更多',
                            keyWord:'菁英会',
                            actionId:'11661',
                            refId:14
                        };
                        break;
                    case 'organization'://菁英面对面
                        config = {
                            browseName:'菁英会主页',
                            actionName:'宗旨-查看详细',
                            keyWord:'菁英会',
                            actionId:'11672',
                            refId:14
                        };
                        break;
                }
                EliteSdk.trackAction(config);
            }
        },
        name:'elite-titleBar'
    }
</script>