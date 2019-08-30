<template>
    <div class="course-section-communication">
        <!--<CourseChatItem v-for="(item,index) in chatList" :item="item" :key="index"></CourseChatItem>-->
        <!--<infinite-loading @infinite="infiniteScroll" ref="infiniteLoading" :distance="distanceNum">-->
            <!--<span slot="no-more">正在加载...</span>-->
            <!--<span slot="no-resluts">没有更多了</span>-->
        <!--</infinite-loading>-->
        <CourseChatItem :relatedContent="chatList"
                        :more="more"
                        @scrollBottom="getChatList"
                        v-if="chatList.length!==0"
                        :loadings="loadings"
                        :completed="completeds"
        ></CourseChatItem>
        <div class="no-data" v-show="firstLoad&&chatList.length===0">
            <p></p>
            <p>暂无交流</p>
        </div>
    </div>
</template>
<script>
    const xhrUrl = {
      chatList:'/mcall/customer/review/json_list_v5/'
    };
    import comm from 'static/js/comm.js';
    import formatData from '../untils/formatData';
    import CourseChatItem from './CourseChatItem';
    import InfiniteLoading from 'vue-infinite-loading';
    import axios from 'axios';
    export default {
        components: {
            CourseChatItem,
            InfiniteLoading
        },
        props:{
            chatList:{
                default:[],
                type:Array
            },
            more:{
                default:false,
                type:Boolean
            },
            loadings: {
                default: false,
                type: Boolean
            },
            maxLen: {
                default: 100000,
                type: Number
            },
            completeds: {
                default: false,
                type: Boolean
            },
            firstLoad: {
                default: false,
                type: Boolean
            }
        },
        data() {
            return {
                $state:null,
                completed:false,
                pageIndex:1,
                pageSize:20,
                // chatList:[],
                list:[1,2],
                distanceNum:200,
                loading: false,
                moreOnOff: false,
                relatedContent: [],
                communNum:0
            }
        },
        methods:{
            getChatList(){
                this.$emit('communNum');
            }
            // unique(original) {
            //     let arr = JSON.parse(JSON.stringify(original));
            //     if (!Array.isArray(arr)) {
            //         //console.log('type error!');
            //         return
            //     }
            //     let arrry= [];
            //     let  obj = {};
            //     for (let i = 0; i < arr.length; i++) {
            //         if (!obj[arr[i].id]) {
            //             arrry.push(arr[i]);
            //             obj[arr[i].id] = 1
            //         } else {
            //             obj[arr[i].id]++
            //         }
            //     }
            //     return arrry;
            // },
            // // "infiniteScroll"($state) {
            // //     let t = this;
            // //     this.$state = $state;
            // //     setTimeout(() => {
            // //
            // //         if(!t.completed){
            // //             //console.log('从这里加载')
            // //             t.getChatList();
            // //         }else{
            // //             return false;
            // //         }
            // //
            // //
            // //     }, 1000)
            // // },
            // getChatList(){
            //     let _this = this;
            //     //console.log(_this.completed+'从这里开始');
            //     axios.get(xhrUrl.chatList, {
            //         params: {
            //             pageIndex: _this.pageIndex,
            //             pageSize: _this.pageSize,
            //             sortType: 1,
            //             reviewStatus: 1,
            //             attUseFlag: 3,
            //             logoUseFlag: 3,
            //             dataFlag: 1,
            //             scene: 2,
            //             reviewType: 1,//1
            //             refId: comm.getparaNew().courseId,
            //             isTotalCount: 1
            //         }
            //     })
            //         .then(function (res) {
            //             if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
            //                 _this.$emit('communNum',res.data.responseObject.responseData.totalCount)
            //
            //                 let chatList = res.data.responseObject.responseData.dataList;
            //                 if((_this.pageIndex===1)&&(chatList.length===0)){
            //                     _this.firstLoad = true;
            //                 }
            //                 for(let num = 0;num<chatList.length;num++){
            //                     //console.log(num);
            //                     let dataItem = formatData.formatChatData(chatList[num]);
            //                     dataItem.childrenList = formatData.formatChildrenData(dataItem);
            //                     _this.chatList.push(dataItem);
            //                 }
            //                 _this.chatList = _this.unique( _this.chatList);
            //                 if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length){
            //                     _this.completed=(res.data.responseObject.responseData.dataList.length<_this.pageSize);
            //                     if(!_this.completed){
            //                         _this.pageIndex++;
            //                     }
            //                 }else{
            //                     _this.completed = true;
            //                 }
            //                 setTimeout(()=>{
            //                     $(".infinite-status-prompt").html('没有更多了');
            //                 },1000);
            //                 //console.log(_this.chatList);
            //                 //_this.formatChildrenData();
            //             }
            //         })
            //         .catch(function (error) {
            //
            //             //////console.log(error);
            //         });
            //
            // }
        },
        mounted(){
            let _this = this;
            // _this.getChatList();
            //console.log('初始化加载界面');
            //console.log('chatList',_this.loadings);
        },
        watch:{
            // pageIndex(){
            //     //console.log('gaibianpageindex');
            //     this.$state.loaded();
            //     //this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            // },
            // completed(){
            //     //console.log('结束');
            //     this.$state.complete();
            //     //this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            // }
            firstLoad(n){
                //console.log("交流加载"+n);
            }
        }

    }
</script>
