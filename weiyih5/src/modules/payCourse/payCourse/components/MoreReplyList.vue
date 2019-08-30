<template>
    <section>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum">
            <CourseChatItem v-for="(item,index) in chatList" :item="item" :key="index"></CourseChatItem>
        </vue-data-loading>
        <loading v-show="loading"></loading>
        <div class="no-data" v-show="firstLoad">
            <p></p>
            <p>暂无交流</p>
        </div>
    </section>
</template>
<script>
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import loading from "components/Loading/Loading.vue";
    const xhrUrl = {
        chatList:'/mcall/customer/review/json_list_v5/'
    };
    import formatData from '../untils/formatData';
    import CourseChatItem from './CourseChatItem'
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    export default {
        components: {
            VueDataLoading,
            loading,
            CourseChatItem
        },
        data() {
            return {
                firstLoad:false,
                pageIndex:0,
                pageSize:20,
                completed:false,
                loading:false,
                chatList:[],
                distanceNum: 100
            }
        },
        props: {
            // completed: {
            //     default: false,
            //     type: Boolean
            // },
            // loading: {
            //     default: false,
            //     type: Boolean
            // },
            // maxLen: {
            //     default: 100000,
            //     type: Number
            // },
            // relatedContent: {
            //     default: [],
            //     type: Array
            // }
        },
        mounted(){
            let _this = this;
            _this.getChatList();
        },
        methods: {
            getChatList(){
                let _this = this;
                axios.get(xhrUrl.chatList, {
                    params: {
                        pageIndex: 1,
                        pageSize: 20,
                        sortType: 1,
                        reviewStatus: 1,
                        attUseFlag: 3,
                        logoUseFlag: 3,
                        dataFlag: 1,
                        scene: 2,
                        reviewType: 1,
                        refId: comm.getparaNew().chatId,
                        isTotalCount: 1
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length){
                            let chatList = res.data.responseObject.responseData.dataList;
                            if((_this.pageIndex===1)&&(chatList.length===0)){
                                _this.firstLoad = true;
                            }
                            for(let num = 0;num<chatList.length;num++){
                                //console.log(num);
                                let dataItem = formatData.formatChatData(chatList[num]);
                                dataItem.childrenList = formatData.formatChildrenData(dataItem);
                                _this.chatList.push(dataItem);
                            }
                            //console.log(_this.chatList);
                            _this.completed=(chatList.length<_this.pageSize);
                            if(!_this.completed){
                                _this.pageIndex++;
                            }
                            //_this.formatChildrenData();
                        }else{
                            _this.completed = true;
                        }
                        _this.loading = false;
                    })
                    .catch(function (error) {

                        //////console.log(error);
                    });

            },
            "infiniteScroll"() {
                let t = this;
                setTimeout(() => {
                    if(!t.completed){
                        t.getChatList();
                    }else{
                        return false;
                    }
                }, 300)
            }
        }
    }
</script>
