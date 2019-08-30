<template>
    <section class="al-mainInner">
        <!-- 头部信息开始 -->
        <section class="al-headFilterBox">
            <HeaderBar :header-config="headerConfig"></HeaderBar>
            <DiscoverNavBar :navBarOp="navBarOp" @param-change="paramChange"></DiscoverNavBar>
            <!--筛选弹层开始-->
            <DiscoverPopScr :pop-param="popParam" @param-change="paramChange"></DiscoverPopScr>
            <!--筛选弹层结束-->
            <!--全部类型弹层开始-->
            <DiscoverPopAll :navBarOp="navBarOp" @param-change="paramChange"></DiscoverPopAll>
            <!--全部类型弹层结束-->
            <!--智能排序弹层开始-->
            <DiscoverPopOrd :navBarOp="navBarOp" @param-change="paramChange"></DiscoverPopOrd>
            <!--智能排序弹层结束-->
        </section>
        <!-- 头部信息结束 -->
        <!-- 列表内容开始 -->
        <section class="al-content" style="margin-top:0">
            <section class="al-discoverMask" :class="{'show':topTabFlag}"></section>
            <!--瀑布流组件开始-->
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="EV-discoverProfessionFilter" :style="{marginTop:listMarginTop+'px'}"
                         data-alcode-mod='400'>
                    <ListContent v-for="(item,key) in listData" :item="item" :key="key"></ListContent>
                </section>
            </vue-data-loading>
            <!--瀑布流组件结束-->
            <section class="ev_noContent" v-if="noMore">
                <img src="//img50.allinmd.cn/pages/discover/noActivity.png" alt=""
                     style="position:relative;margin-top:40%;left:50%;margin-left:-56px;"/>
            </section>
        </section>
        <!-- 列表内容结束 -->
        <Loading v-show="loading"></Loading>
        <!-- 分享按钮开始 -->
        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>
        <!--分享按钮结束-->
    </section>
</template>
<script>
    import axios from 'axios';
    import TempCache from "static/js/tempcache.js"
    import Loading from 'components/Loading/Loading.vue'
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import ListContent from "components/ListTemplate/OneImgList.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue'
    import DiscoverPopScr from 'components/DiscoverScreening/discoverPopScreenType.vue'
    import DiscoverNavBar from 'components/DiscoverScreening/discoverNavBar.vue'
    import DiscoverPopAll from 'components/DiscoverScreening/discoverPopAll.vue'
    import DiscoverPopOrd from 'components/DiscoverScreening/discoverPopOrder.vue'
    import Share from "components/Share/Share.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import comm from "static/js/comm.js"

    const xhrUrl = {
        getMapList: '/mcall/comm/data/filter/getMapList/',//弹层筛选分类列表接口
        getByProperty: '/mcall/discovery/search/getMapByType/'//筛选列表请求接口
    };
    export default {
        components: {
            HeaderBar,//头部
            ListContent,//主内容列表
            Loading,//loading事件
            VueDataLoading,//瀑布流
            DiscoverPopScr,//筛选弹层组件
            DiscoverPopAll,//全部类型弹层
            DiscoverPopOrd,//智能排序弹层
            DiscoverNavBar,//顶部条，筛选、全部类型、智能排序
            Share,//分享按钮
            WakeApp
        },
        data() {
            return {
                listDataFlag: true,//判断列表数组是push还是清空
                shareOnOff: true,//分享
                shareConfig: Object,//分享
                indexPop: 0,//弹层
                topTabFlag: false,
                navBarOp: {
                    dataScene: comm.getpara().scene?comm.getpara().scene:5,//智能排序
                    indexPop: 0,//展示哪一个弹层
                    topTabFlag: false,//是否展示弹层
                    navTwoNo: true,//不要全部类型
                },
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                headerConfig: {//头部引用
                    title: "按类型",
                    backOnOff: true
                },
                popParam: {//筛选弹层的pop
                    indexPop: 0,
                    topTabFlag: false,//顶部切换tab,弹层是否显示
                    popFirList: [],//弹层筛选项一级菜单数据
                    nowFirIndex: 0,//一级筛选菜单点击索引判断
                },
                listData: [],//列表筛选结果数据
                noMore: false,//无内容提示
                loading: false,//loading显示和隐藏
                completed: false,//是否加载完成
                refType: comm.getpara().type?comm.getpara().type:1,//一级点击参数默认视频
                tagId: comm.getpara().sType?comm.getpara().sType:0, //列表参数请求（筛选项的ID）//二级默认点击参数，默认全部视频
                dataScene: comm.getpara().scene?comm.getpara().scene:5, //列表参数请求（智能排序）
                pageIndex: 1,
                pageSize: 20,
                allResource: [],//二级菜单实际上的原始数据
                listMarginTop: 0,
            }
        },
        methods: {
            //瀑布流方法
            "infiniteScroll"() {
                let t = this;
                t.listDataFlag = false;
                t.loading = true;
                t.pageIndex++;
                setTimeout(() => {
                    t.listContentFun();
                }, 1000);
            },
            //分享方法
            share() {
                let t = this;
                let code=location.origin+location.pathname+'?type='+t.refType+'&sType='+t.tagId+'&scene='+t.dataScene;
                t.shareConfig = {
                    initData: {
                        url:code
                    },
                    shareData: {
                        "refType": t.refType,
                        "refSecondType": t.tagId === 0 ? '' : t.tagId,
                        "pageSize": 20,
                        "pageIndex": 1,
                        "sortType": t.dataScene,
                        "sceneType": 14,
                        "themeType": 0,
                        "resourceType": 0,
                        "attUseFlag": 3,
                        "logoUseFlag": 3
                    }
                };
            },
            //初始化页面筛选结构铺设
            popListFun() {
                let t = this;
                let cid = TempCache.getItem("userId");
                let type=parseInt(comm.getpara().type);
                t.listMarginTop = document.getElementsByClassName("al-headFilterBox")[0].offsetHeight;//获取高度
                t.loading = true;
                comm.ajax2({
                    url: xhrUrl.getMapList,
                    type: "GET",
                    data: {
                        paramJson: JSON.stringify({
                            filterSence: 2,
                            filterSenceType: 0,
                            isValid: 1,
                            leFilterTreeLevel: 2,
                        })
                    },
                    success: function (res) {
                        t.loading = false;
                        let data = res;
                        if (data && data.responseObject && data.responseObject.responseStatus) {
                            let popList = data.responseObject.responseData.data_list[0].childrenList;
                            let _arrL = [];
                            for (let j = 0; j < popList.length; j++) {
                                let _items = popList[j];
                                switch (parseInt(_items.refType)) {
                                    case 1:
                                        _arrL[0] = _items;
                                        break;
                                    case 2:
                                        _arrL[2] = _items;
                                        break;
                                    case 4:
                                        _arrL[3] = _items;
                                        break;
                                    case 7:
                                        _arrL[1] = _items;
                                        break;
                                }
                            }
                            for (let k = 0; k < _arrL.length; k++) {
                                let _items = _arrL[k];
                                switch (parseInt(_items.refType)) {
                                    case 1:
                                        t.allResource = [{
                                            refType: 1,
                                            refSecondType: 0,
                                            refRename: "全部视频",
                                            nowSecIndex: 0
                                        }];
                                        break;
                                    case 2:
                                        t.allResource = [{
                                            refType: 2,
                                            refSecondType: 0,
                                            refRename: "全部文库",
                                            nowSecIndex: -1
                                        }];
                                        break;
                                    case 4:
                                        t.allResource = [{
                                            refType: 4,
                                            refSecondType: 0,
                                            refRename: "全部话题",
                                            nowSecIndex: -1
                                        }];
                                        break;
                                    case 7:
                                        t.allResource = [{
                                            refType: 7,
                                            refSecondType: 0,
                                            refRename: "全部病例",
                                            nowSecIndex: -1
                                        }];
                                        break;
                                }
                                for (let i = 0; i < _items.childrenList.length; i++) {
                                    let item = _items.childrenList[i];
                                    let _popList = {
                                        refType: item.refType,
                                        refSecondType: item.refSecondType,
                                        refRename: item.refRename,
                                        nowSecIndex: _items.refType === 1 ? 0 : -1
                                    };
                                    t.allResource.push(_popList);//二级菜单数组重赋值了
                                }
                                let _popFirList = {
                                    refType: _items.refType,
                                    refRename: _items.refRename,
                                    childrenList: t.allResource
                                };
                                if(type){
                                    if(type===parseInt(_items.refType)){
                                        t.popParam.nowFirIndex=k;
                                    }
                                }
                                t.popParam.popFirList.push(_popFirList);//一级筛选菜单数组赋值，重新赋值巡皇
                            }
                            t.topTabFlag = true;

                        } else {
                            t.topTabFlag = false;
                        }
                    }
                });
            },
            //初始化页面结构列表html
            listContentFun() {
                let t = this;
                t.loading = true;
                let param = {
                    refType: t.refType,//一级
                    refSecondType: t.tagId === 0 ? '' : t.tagId,//二级点击
                    sortType: t.dataScene,//智能排序
                    attUseFlag: 3,//固定值
                    logoUseFlag: 3,//固定值
                    pageIndex: t.pageIndex,
                    pageSize: t.pageSize,
                    themeType: 0,//固定值
                    useFlag: 12,//固定值
                };

                comm.ajax2({
                    url: xhrUrl.getByProperty,
                    type: "GET",
                    data: {paramJson: JSON.stringify(param)},
                    success: function (res) {
                        t.loading = false;
                        if (res.responseObject.responseStatus) {
                            let item = res.responseObject.responseData.data_list;
                            t.noMore = false;
                            if (t.listDataFlag) {
                                t.listData = [];
                                document.documentElement.scrollTop = 0;
                            }
                            let val = "";
                            let json;
                            for (let i = 0; i < item.length; i++) {
                                val = item[i];
                                switch (parseInt(t.refType)) {
                                    case 1:
                                        json = {
                                            itemUrl: val.cms_video.webStoragePath,
                                            itemTitle: val.cms_video.videoName,
                                            browseNum: val.cms_video.playNum,
                                            commentNum: val.cms_video.reviewNum,
                                            playTime: val.cms_video.playTime,
                                            ownerName: val.cms_video.ownerNameStr,//视频多作者
                                            currentStarLevel: val.currentStarLevel ? val.currentStarLevel.currentStarLevel : "",
                                            currentScoreNum: val.currentStarLevel ? val.currentStarLevel.currentScoreNum : '',
                                            itemType: t.refType,
                                            picUrl: val.cms_video_attachment_logo.videoAttUrl,
                                            videoType: val.cms_video.videoType,
                                            isShowActivityTag: val.isShowActivityTag ? val.isShowActivityTag : '',//活动相关标签展示
                                            activityTagColor: val.activityTagColor ? val.activityTagColor : '',//活动相关标签展示
                                            activityTagName: val.activityTagName ? val.activityTagName : '',//活动相关标签展示
                                        };
                                        if (val.cms_video_attachment_logo.videoAttUrl) {
                                            json.picNum = 1;
                                        } else {
                                            json.picNum = 0;
                                        }
                                        break;
                                    case 2:
                                        json = {
                                            itemUrl: val.customer_doc.webStoragePath,
                                            itemTitle: val.customer_doc.docName,
                                            browseNum: val.customer_doc.browseNum,
                                            commentNum: val.customer_doc.reviewNum,
                                            ownerName: val.customer_auth.lastName + val.customer_auth.firstName,
                                            currentStarLevel: val.currentStarLevel ? val.currentStarLevel.currentStarLevel : "",
                                            currentScoreNum: val.currentStarLevel ? val.currentStarLevel.currentScoreNum : '',
                                            itemType: t.refType,
                                            picUrl: val.cms_doc_attachment_logo.docAttUrl,
                                            videoType: val.customer_doc.docType,
                                            isShowActivityTag: val.isShowActivityTag ? val.isShowActivityTag : '',//活动相关标签展示
                                            activityTagColor: val.activityTagColor ? val.activityTagColor : '',//活动相关标签展示
                                            activityTagName: val.activityTagName ? val.activityTagName : '',//活动相关标签展示
                                        };
                                        if (val.cms_doc_attachment_logo.docAttUrl) {
                                            json.picNum = 1;
                                        } else {
                                            json.picNum = 0;
                                        }

                                        break;
                                    case 4:
                                        json = {
                                            itemUrl: val.cms_topic.webStoragePath,
                                            itemTitle: val.cms_topic.topicName,
                                            browseNum: val.cms_topic.browseNum,
                                            commentNum: val.cms_topic.reviewNum,
                                            ownerName: val.cms_topic_customer_auth.lastName + val.cms_topic_customer_auth.firstName,
                                            currentStarLevel: val.currentStarLevel ? val.currentStarLevel.currentStarLevel : "",
                                            currentScoreNum: val.currentStarLevel ? val.currentStarLevel.currentScoreNum : '',
                                            itemType: t.refType,
                                            picUrl: val.cms_topic_attachment.topicAttUrl,
                                            isShowActivityTag: val.isShowActivityTag ? val.isShowActivityTag : '',//活动相关标签展示
                                            activityTagColor: val.activityTagColor ? val.activityTagColor : '',//活动相关标签展示
                                            activityTagName: val.activityTagName ? val.activityTagName : '',//活动相关标签展示
                                        };
                                        if (val.cms_topic_attachment.topicAttUrl) {
                                            json.picNum = 1;
                                        } else {
                                            json.picNum = 0;
                                        }
                                        break;
                                    case 7:
                                        json = {
                                            itemUrl: val.case_baseinfo.webStoragePath,
                                            itemTitle: val.case_baseinfo.caseName,
                                            browseNum: val.case_baseinfo.browseNum,
                                            commentNum: val.case_baseinfo.reviewNum,
                                            ownerName: val.case_customer_auth.lastName + val.case_customer_auth.firstName,
                                            currentStarLevel: val.currentStarLevel ? val.currentStarLevel.currentStarLevel : "",
                                            currentScoreNum: val.currentStarLevel ? val.currentStarLevel.currentScoreNum : '',
                                            itemType: t.refType,
                                            picUrl: val.case_attachment.attUrl,
                                            isShowActivityTag: val.isShowActivityTag ? val.isShowActivityTag : '',//活动相关标签展示
                                            activityTagColor: val.activityTagColor ? val.activityTagColor : '',//活动相关标签展示
                                            activityTagName: val.activityTagName ? val.activityTagName : '',//活动相关标签展示
                                        };
                                        if (val.case_attachment.attUrl) {
                                            json.picNum = 1;
                                        } else {
                                            json.picNum = 0;
                                        }
                                        break;
                                }
                                t.listData.push(json);
                            }
                            if (t.listData.length < res.responseObject.responseData.total_count) {
                                t.completed = false;
                            } else {
                                t.completed = true;
                            }
                            t.listDataFlag = true;
                        } else {//请求无数据
                            if (t.pageIndex === 1) {//第一页请求的时候
                                t.listData = [];
                                t.noMore = true;
                            }
                            t.listDataFlag = true;
                            t.completed = false;
                            t.loading = false;
                        }
                    },
                    fail: function (status) {
                        t.listData = [];
                        t.noMore = true;
                        t.completed = false;
                        t.loading = false;
                        t.listDataFlag = true;
                    }
                });
            },
            //检测参数是否改变
            paramChange(param) {
                let t = this;
                if (param.tagId || param.tagId === 0) {
                    t.tagId = param.tagId;
                }
                t.topTabFlag = param.topTabFlag;
                if (param.indexPop || param.indexPop === 0) {
                    t.indexPop = param.indexPop;
                }
                if (param.refType || param.refType === 0) {
                    t.refType = param.refType;
                }
                if (param.dataScene) {
                    t.dataScene = param.dataScene;
                }
            },
            //判断禁用
            bodyOverflow() {
                let t = this;
                if (t.topTabFlag === true) {
                    comm.bodyScroll();
                } else {
                    comm.bodyNoScroll();
                }
            },
        },
        computed: {
            listParamChange() {
                let t = this;
                const {refType, tagId, dataScene} = this;
                return {
                    refType,
                    tagId,
                    dataScene
                }
            }
        },
        //监听数据data
        watch: {
            //检测顶部弹层标志变化
            topTabFlag() {
                let t = this;
                t.navBarOp.topTabFlag = t.topTabFlag;
                t.popParam.topTabFlag = t.topTabFlag;
                t.bodyOverflow();
            },
            //检测应该显示哪一个弹层
            indexPop() {
                let t = this;
                t.navBarOp.indexPop = t.indexPop;
                t.popParam.indexPop = t.indexPop;
            },
            dataScene() {
                let t = this;
                t.navBarOp.dataScene = t.dataScene;
            },
            //检测请求参数变化
            listParamChange: {
                handler: function () {
                    let t = this;
                    t.pageIndex = 1;
                    t.listContentFun();
                    t.share();
                },
                deep: true
            },
        },
        mounted() {
            let t = this;
            t.popListFun();
            t.listContentFun();
            t.bodyOverflow();
            t.share();
        }
    }
</script>
