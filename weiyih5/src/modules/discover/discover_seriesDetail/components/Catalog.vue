<template>
    <section class="catalogCont">
        <aside class="type">授课方式：<span v-show="videoNum>0">视频({{videoNum}})</span><span v-show="caseNum>0">病例({{caseNum}})</span><span
                v-show="docNum>0">文库({{docNum}})</span><span v-show="bookNum>0">电子书({{bookNum}})</span></aside>
        <section class="catalogList">
            <ul data-alcode-mod='645' v-for="(item,index) in catalogList">
                <li data-flag="2" :data-seriesid="item.catalogId" :class="{'up':item.toggleOnOff}"
                    @click="toggleSlide(index)">
                    <div class="catalogText">{{index+1}}.{{item.catalogName|getStrLen(36)}}<i></i></div>
                    <aside v-show="item.toggleOnOff" v-if="item.resourceList.length">
                        <div v-for="innerItem in item.resourceList">
                            <a :href="'//'+innerItem.webStoragePath"><span>{{innerItem.resourceType|resourceType}}</span>{{innerItem.resourceName|getStrLen(30)}}</a>
                        </div>
                    </aside>
                </li>
            </ul>
        </section>
    </section>
</template>
<script>
    import {mapActions} from "vuex";
    import comm from 'static/js/comm.js';
    export default {
        data() {
            return {
                catalogList: [],
                catalogIndex: 0,
                videoNum: 0,
                caseNum: 0,
                docNum: 0,
                bookNum: 0,
                courseList: [],
                toggleList: [],
                collectDes: "",
                indexDes: ""
            }
        },
        created() {
            let t = this;
            t.initPage();
        },
        mounted() {
            let t = this;
            t.getCatalog();

        },
        methods: {
            ...mapActions(["getCatalog"]),
            toggleSlide: function (index) {
                let t = this;
                t.catalogList[index].toggleOnOff = !t.catalogList[index].toggleOnOff;
            },
            initPage(){
                let t = this;
                if(t.$store.state.catalog.length){
                    let temData = JSON.parse(t.$store.state.catalog);
                    let list = temData.data_list;

                    list.forEach(function (v, i) {
                        if (i === 0) {
                            v.toggleOnOff = true;
                        } else {
                            v.toggleOnOff = false;
                        }
                    });
                    t.catalogList = list;
                    t.videoNum = temData.videoNum;
                    t.caseNum = temData.caseNum;
                    t.docNum = temData.docNum;
                    t.bookNum = temData.bookNum;
                }
            }
        },
        watch:{
            '$store.state.catalog'(){
                let t = this;
                t.initPage();
            }
        },
        filters: {
            resourceType(v) {
                let value = "";
                switch (parseInt(v, 10)) {
                    case 1:
                        value = "视频";
                        break;
                    case 2:
                        value = "文库 ";
                        break;
                    case 7:
                        value = "病例";
                        break;
                    case 17:
                        value = "电子书";
                        break;
                    case 18:
                        value = "文章";
                        break;
                }
                return value;
            },
            getStrLen:comm.getStrLen
        }

    }
</script>