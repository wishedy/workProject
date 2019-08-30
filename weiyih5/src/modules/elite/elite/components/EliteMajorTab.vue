<template>
    <section class="al-elite-majorTab">
        <div class="al-elite-majorItem" v-for="(item,index) in majorList" v-text="item.majorName" :class="{'active':tabIndex===index}" @click.stop="changeTabIndex(index)" @mousedown.stop="trackAction(index)" ></div>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        data(){
            return {
                tabIndex:0,
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
        watch:{
            tabIndex(n){
                let _this = this;
                _this.$emit('changeTabIndex',_this.majorList[n]);
            }
        },
        methods:{
            changeTabIndex(index){
                let _this = this;
                _this.tabIndex = parseInt(index,10);
            },
            trackAction(index){
                let _this = this;
                let typeName = _this.recentConfig.typeName;
                let config = {};
                let actionName = '';
                let actionId = '';
                switch (typeName) {
                    case 'conferenceType':
                        switch (parseInt(index,10)) {
                            case 0:
                                actionName = '关节专业';
                                actionId = '11676';
                                break;
                            case 1:
                                actionName = '脊柱专业';
                                actionId = '11677';
                                break;
                            case 2:
                                actionName = '创伤专业';
                                actionId = '11678';
                                break;
                            case 3:
                                actionName = '运动医学专业';
                                actionId = '11679';
                                break;
                        }
                        config = {
                            browseName:'往届会议-菁英会',
                            actionName:actionName,
                            keyWord:'菁英会',
                            actionId:actionId,
                            refId:14
                        };
                        break;
                    case 'reportType':
                        switch (parseInt(index,10)) {
                            case 0:
                                actionName = '关节专业';
                                actionId = '11682';
                                break;
                            case 1:
                                actionName = '脊柱专业';
                                actionId = '11683';
                                break;
                            case 2:
                                actionName = '创伤专业';
                                actionId = '11684';
                                break;
                            case 3:
                                actionName = '运动医学专业';
                                actionId = '11685';
                                break;
                        }
                        config = {
                            browseName:'学术报到-菁英会',
                            actionName:actionName,
                            keyWord:'菁英会',
                            actionId:actionId,
                            refId:14
                        };
                        break;
                }
                EliteSdk.trackAction(config);
            },
        }
    }
</script>