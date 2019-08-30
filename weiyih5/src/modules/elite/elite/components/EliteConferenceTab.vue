<template>
    <section class="al-elite-conferenceTab">
        <div class="conferenceTabItem" :class="{active:tabIndex===index}" v-for="(item,index) in majorList" :key="index" v-text="item.majorName" @click.stop="changeTabIndex(index)" @mousedown.stop="trackAction" v-if="checkEmpty(item)"></div>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        props:{
            recentConfig:{
                default(){
                    return {};
                }
            }
        },
        data(){
            return {
                tabIndex:-1,
                majorList:[
                    {
                       majorName:'关节专业',
                       conferenceType:2,
                       reportType:21904
                    },
                    {
                        majorName:'脊柱专业',
                        conferenceType:7,
                        reportType:21905
                    },
                    {
                        majorName:'创伤专业',
                        conferenceType:9,
                        reportType:22618
                    },
                    {
                        majorName:'运医专业',
                        conferenceType:8,
                        reportType:22619
                    }
                ]
            }
        },
        methods:{
            checkEmpty(item){
              let _this = this;
              let emptyList = _this.recentConfig.emptyType;
              let result = true;
              for(let num = 0;num<emptyList.length;num++){
                  let itemNum = emptyList[num];
                  if(parseInt(item[_this.recentConfig.typeName],10)===parseInt(itemNum,10)){
                      result = false;
                      break;
                  }
              }
              return result;
            },
            trackAction(){
                let _this = this;
                let typeName = _this.recentConfig.typeName;
                let config = {};
                switch (typeName) {
                    case 'conferenceType':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会会议栏目-专业切换',
                            keyWord:'菁英会',
                            actionId:'11664',
                            refId:14
                        };
                        break;
                    case 'reportType':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会近期报道-专业切换',
                            keyWord:'菁英会',
                            actionId:'11667',
                            refId:14
                        };
                        break;
                }
                EliteSdk.trackAction(config);
            },
            changeTabIndex(index){
                let _this = this;
                _this.tabIndex = parseInt(index,10);
            }
        },
        watch:{
            recentConfig:{
                handler(config)
                {
                    let _this = this;
                    let list = _this.majorList;
                    for (let num = 0; num < list.length; num++) {
                        let item = list[num];
                        if (parseInt(item[config.typeName], 10) === parseInt(config.recentType, 10)) {
                            _this.tabIndex = num;
                        }
                    }
                },
                deep:true
            },
            tabIndex(n){
                let _this = this;
                console.log(n);
                _this.$emit('changeTabIndex',_this.majorList[n]);
            }
        }
    }
</script>