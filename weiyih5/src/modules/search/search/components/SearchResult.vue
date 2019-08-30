<template>
    <section  v-show="showOnOff">
        <!-- 主导航栏 -->
        <nav class="al-indexNavbar" >
            <ul data-alcode-mod="460" data-alcode-item-selector="li">
                <router-link v-for="(item,i) in typeArr" tag="li" :to="'/'+item.type" :data-role="item.type" v-cloak active-class="active" :key="i">
                    <a href="javascript:void(0)">
                        <span>{{item.name}}</span>
                    </a>
                </router-link>
            </ul>
            <div style="padding-bottom: 40px;"></div>
        </nav>
        <nav class="al-correct-word" v-if="($route.fullPath==='/all')&&(!checkInvalid(mistakeWords))">
            <section class="container">
                <i class="icon"></i>
                 <span v-text="mistakeWords"></span>
            </section>
        </nav>
        <nav class="al-sortItems" v-if="$route.fullPath==='/all'||$route.fullPath==='/case'||$route.fullPath==='/video'">
            <ul data-alcode-mod="459" data-alcode-item-selector="li">
                <li :class="{sortActive:nowIndex===1}" searchsort="1" @click="changeSortType(1)">综合排序</li>
                <li  :class="{sortActive:nowIndex===2}" searchsort="2" @click="changeSortType(2)">最新</li>
                <li  :class="{sortActive:nowIndex===3}" searchsort="3" @click="changeSortType(3)">最热</li>
                <li  :class="{sortActive:nowIndex===4}" searchsort="3" @click="changeSortType(4)" v-if="$route.fullPath==='/video'">手术视频</li>
            </ul>
        </nav>
        <router-view></router-view>
    </section>
</template>
<script>
    import SearchCommon from  '../searchCommon/searchCommon';
    import comm from 'static/js/comm';
    import {mapGetters} from 'vuex';
    import axios from "axios"
    export default {
        data() {
            return {
                typeArr: [
                    {"name": "全部", type: "all"},
                    {"name": "视频", type: "video"},
                    {"name": "病例", type: "case"},
                    {"name": "文库", type: "doc"},
                    {"name": "医师", type: "doctor"},
                    {"name": "会议", type: "meeting"},
                    {"name": "产品", type: "product"}
                ],
                nowIndex:1,
                showOnOff:true
            }
        },
        computed:{
            ...mapGetters(['mistakeWords'])
        },
        methods:{
            checkInvalid(val){
                return SearchCommon.checkInvalid(val);
            },
            changeSortType(v){
                let t = this;
                let nowSortType = v;
                let routerName = (this.$route.path).substring(1,100);
                let jumpSortType = this.$store.state[routerName+"SortType"];
                if(nowSortType===jumpSortType){
                    return false
                }else{
                    comm.creatEvent({
                        triggerType:'搜索资源排序',
                        keyword:t.$store.state.selectedStr,
                        actionId:56
                        });
                        this.$store.state[routerName+"SortType"] = v;
                        this.nowIndex= v;
                }
            }
        },
        watch:{
            "$route"(n){
                this.nowIndex = 1;
            },
            "$store.state.searchList"(){
                let t = this;
                if(t.$store.state.searchList.length!=0){
                    if((JSON.parse(t.$store.state.searchList)).length===0){
                        t.showOnOff = true;
                    }else{
                        t.showOnOff = false;
                    }
                }else{
                    t.showOnOff = true;
                }
            }
        }
    }
</script>