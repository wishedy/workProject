<template>
    <section class="al-scrollBox">
        <!-- 滚动距离时——顶部信息 -->
        <header class="al-tagScrollHead" data-alcode-mod="422" style="display: none;">
            <a href="javascript:;" data-alcode="e52" @click="returnBack">
                <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
            </a>
            <h2 class="EV-scrollTitle" v-text="ellipsis(propertyName)"></h2>
            <a href="javascript:void(0)" class="EV-scrollFollowBtn btn-primary" data-alcode="e53"  v-html="relation(relationship)" @click="wantFollow"></a>
        </header>
        <section class="al-tagSeminarChange">
            <section class="al-tagSeminarSelection" data-alcode-mod="424" data-alcode-item-selector="a" data-alcode-mod-max-idx="3">
                <router-link tag='a' to="/release" active-class="active" class="al-tagSeminarSelectionItem" data-role="relaese" data-flag="1" data-alcode-link="a2.201.424.1" replace>最新发布</router-link>
                <router-link tag='a' to="/comment" active-class="active" class="al-tagSeminarSelectionItem" data-role="comment" data-flag="2" data-alcode-link="a2.201.424.2"  replace>最多评论</router-link>
                <router-link tag='a' to="/browse" active-class="active" class="al-tagSeminarSelectionItem" data-role="browse" data-flag="3" data-alcode-link="a2.201.424.3"  replace>最多浏览</router-link>
            </section>
            <!--al-personalSelectorOn-->
            <section class="al-personalContributionSelector" :class="{'al-personalSelectorOn':toggleClass}">
                <h2 v-html="nowName" @click.stop="toggle"></h2>
                <ul data-alcode-mod="425" data-alcode-item-selector="li" data-alcode-mod-max-idx="4">
                    <li class="al-personalContributionSelectorItem" :data-type="item.type" :data-alcode-item="'a2.201.425.'+item.type" v-for="(item,index) in list" @click.stop="changeDataType(item.type,item.name)">{{item.name}}</li>

                </ul>
            </section>
        </section>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        data(){
            let t = this;
            return {
                allList:{
                  '0':"全部",
                  '1':"视频",
                  '7':"病例",
                  '2':"文库",
                },
                list:[],
                nowName:"全部",
                toggleClass:false
            }
        },
        computed:{
            nowDataType(){
                let t = this;
                return t.$store.state.dataType;
            },
            followInfo(){
                return this.$store.state.baseInfo;
            },
            propertyName(){
                let t = this;
                return (t.$store.state.propertyName)  ;
            },
            relationship(){
                let t = this;
                return t.$store.state.followState;
            }
        },
        methods:{
            ellipsis(v){
                return (v.length>10)?v.substring(0,9)+"...":v;
            },
            returnBack(){
                window.history.back();
            },
            wantFollow(){
                let t = this;
                t.$store.state.wantFollow = true;
            },
            relation(num){
                return (parseInt(num,10)===1)?"已关注":"关注";
            },
            toggle(){
              let t = this;
              t.toggleClass = !t.toggleClass;
            },
            changeDataType(index,name){
                let t = this;
                let actionId = {
                    '0':"51",
                    '7':"52",
                    '1':"53",
                    '2':"54",
                    '4':"55"
                };
                t.toggle();
                t.nowName = name;
                comm.creatEvent({
                    triggerType:'列表资源排序',
                    keyword:name,
                    actionId:actionId[''+index]
                });
                t.$store.state.dataType = index;
            }
        },
        watch:{
            followInfo(){
                let t = this;
                let baseInfo = JSON.parse(t.followInfo);
                let typeList = baseInfo.types.split(",");
                let lastList = [];
                for(let num = 0;num<typeList.length;num++){
                    lastList.push({
                        type:typeList[num],
                        name:t.allList[''+typeList[num]]
                    })
                }
                t.list =lastList;
            },
            '$store.state.dataType'(){
                window.scrollTo(0,0);
            },
            toggleClass(newState,oldState){
                let t = this;
                if(newState===false){
                    t.$store.state.goShare = ++(t.$store.state.goShare);
                }
            }
        }
    }
</script>