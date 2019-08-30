<template>
    <nav class="al-tagSeminarFollowMsg" v-cloak v-show="followNum!==0">
        <h3 class="al-tagSeminarFollowNum">已有<span>{{followNum}}</span>人关注</h3>
        <ul class="al-tagSeminarFollowList EV-tagSeminarFollowList" data-alcode-mod="423">

            <li class="al-tagSeminarFollowListItem" v-for="(item,index) in list"  v-if="index<5">
                <a :href="hrefFilter(tagId,name)">
                    <img :src="item" alt=""/>
                </a>

            </li>
            <li class="al-tagSeminarFollowListItem" v-if="list.length>5"><a :href="hrefFilter(tagId,name)">···</a></li>
        </ul>
    </nav>
</template>
<script>
    export default {
        data(){
            return {
                list:[],
                name:"",
                followNum:0

            }
        },
        methods:{
          hrefFilter(tagId,name){
              return './discover_tagFollowers.html?tId='+tagId+'&title='+name;
          }
        },
        computed:{
            followInfo(){
                return this.$store.state.baseInfo;
            },
            tagId(){
                return this.$store.state.tagId;
            }
        },
        watch:{
            followInfo(){
                let t = this;
                let baseInfo = JSON.parse(t.followInfo);
                t.list = baseInfo.logoUrl.split("|");
                t.name = baseInfo.propertyName;
                t.followNum = baseInfo.followNum;
            }
        }
    }
</script>