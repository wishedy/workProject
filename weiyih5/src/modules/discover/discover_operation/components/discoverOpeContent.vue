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
    import DiscoverPopScr from 'components/DiscoverScreening/discoverPopScreening.vue'
    import DiscoverNavBar from 'components/DiscoverScreening/discoverNavBar.vue'
    import DiscoverPopAll from 'components/DiscoverScreening/discoverPopAll.vue'
    import DiscoverPopOrd from 'components/DiscoverScreening/discoverPopOrder.vue'
    import Share from "components/Share/Share.vue"
    import comm from "static/js/comm.js";
    import WakeApp from  'components/WakeApp/WakeApp.vue';

    const xhrUrl = {
        getMapList: '/mcall/comm/data/filter/getMapList/',//弹层筛选分类列表接口
        getByProperty: '/mcall/discovery/search/getMapListByProperty/'//筛选列表请求接口
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
                typeVal: comm.getpara().type?parseInt(comm.getpara().type):-1,//全部类型
                indexPop: 0,//弹层
                topTabFlag: false,
                navBarOp: {
                    dataScene: comm.getpara().scene?comm.getpara().scene:4,//智能排序
                    typeVal:comm.getpara().type?parseInt(comm.getpara().type):-1,//全部类型
                    indexPop: 0,//展示哪一个弹层
                    topTabFlag: false,//是否展示弹层
                },
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                headerConfig: {//头部引用
                    title: "按术式",
                    backOnOff: true
                },
                popParam: {//筛选弹层的pop
                    indexPop: 0,
                    topTabFlag: false,//顶部切换tab,弹层是否显示
                    popFirList: [],//弹层筛选项一级菜单数据
                    popSecList: [],//弹层筛选项二级菜单数据
                    nowFirIndex: 0,//一级筛选菜单点击索引判断
                },
                listData: [],//列表筛选结果数据
                noMore: false,//无内容提示
                loading: false,//loading显示和隐藏
                completed: false,//是否加载完成
                tagId: comm.getpara().tId?comm.getpara().tId:0, //列表参数请求（筛选项的ID）
                dataScene: comm.getpara().scene?comm.getpara().scene:4, //列表参数请求（智能排序）
                dataType: comm.getpara().type?comm.getpara().type:0, //列表参数请求（全部类型）
                pageIndex: 1,
                pageSize: 20,
                allResource: [{refId: 0, refRename: "全部资源", nowSecIndex: 0}, {//二级菜单实际上的原始数据
                    refId: 0,
                    refRename: "精选",
                    addClass: true,
                    nowSecIndex: 0
                }],
                allResourceTran: [],//数据铺设中转数组
                listMarginTop: 0
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
                let code=location.origin+location.pathname+'?tId='+t.tagId+'&scene='+t.dataScene+'&type='+t.dataType;
                t.shareConfig = {
                    initData: {
                        url:code
                    },
                    shareData: {
                        "tagId": t.tagId,
                        "pageSize": 20,
                        "pageIndex": 1,
                        "dataScene": t.dataScene,
                        "dataType": t.dataType,
                        "scene": 2,
                        "sceneType": 22,
                        "sessionCustomerId": TempCache.getItem('userId') || '',
                        "platformId": TempCache.getItem('department') || 1
                    }
                };
            },
            //初始化页面筛选结构铺设
            popListFun() {
                let t = this;
                let cid = TempCache.getItem("userId");
                let tId=parseInt(comm.getpara().tId);
                t.listMarginTop = document.getElementsByClassName("al-headFilterBox")[0].offsetHeight;//获取高度
                t.loading = true;
                axios({
                    url: xhrUrl.getMapList,
                    method: "POST",
                    data: {
                        customerId: cid || "",
                        filterSence: 1,
                        filterSenceType: 2,
                        isValid: 1,
                        leFilterTreeLevel: 2,
                        sessionCustomerId: cid || "",
                        platformId: TempCache.getItem('department') || 1
                    },
                    transformRequest: [function (data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function (res) {
                    t.loading = false;
                    let data = res.data;
                    if (data && data.responseObject && data.responseObject.responseStatus) {
                        let popList = data.responseObject.responseData.data_list[0].childrenList;
                        for (let j = 0; j < popList.length; j++) {
                            let _items = popList[j];
                            for (let i = 0; i < popList[j].childrenList.length; i++) {
                                let item = popList[j].childrenList[i];
                                if (j === 0) {
                                    let _popList = {
                                        refId: item.refId,
                                        refRename: item.refRename,
                                        nowSecIndex: 0
                                    };
                                    t.allResource.push(_popList);//二级菜单数组重赋值了
                                    t.popParam.popSecList = t.allResource;//处理当默认打开时增加数据全部资源
                                    t.allResourceTran = t.allResource;
                                } else {
                                    item.nowSecIndex = -1;//二级筛选项里的增加判断条件
                                    t.allResourceTran = _items.childrenList;
                                }
                                if(tId){
                                    if (parseInt(item.refId)===tId&&j === 0||parseInt(item.refId)!==tId&&j === 0) {
                                        t.popParam.ftId=_items.refId;
                                        t.popParam.nowFirIndex=j;
                                    } else {
                                        if(parseInt(item.refId)===tId){
                                            t.popParam.ftId=_items.refId;
                                            t.popParam.popSecList=_items.childrenList;
                                            t.popParam.nowFirIndex=j;
                                        }
                                    }
                                }
                            }
                            let _popFirList = {
                                refId: _items.refId,
                                refRename: _items.refRename,
                                childrenList: t.allResourceTran
                            };
                            t.popParam.popFirList.push(_popFirList);//一级筛选菜单数组赋值，重新赋值
                        }
                        t.topTabFlag = true;
                    } else {
                        t.topTabFlag = false;
                    }
                });
            },
            //初始化页面结构列表html
            listContentFun() {
                let t = this;
                t.loading = true;
                let param = {
                    tagId: t.tagId,//筛选ID
                    pageIndex: t.pageIndex,
                    pageSize: t.pageSize,
                    dataScene: t.dataScene,//智能排序
                    dataType: t.dataType,//全部类型
                    scene: 2,//固定场景值，按专业
                    sessionCustomerId: TempCache.getItem('userId') || "",
                    platformId: TempCache.getItem('department') || 1
                };
                axios({
                    url: xhrUrl.getByProperty,
                    method: "POST",
                    data: param,
                    transformRequest: [function (data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function (res) {
                    t.loading = false;
                    if (res.data.responseObject.responseStatus) {
                        let item = res.data.responseObject.responseData.data_list;
                        t.noMore = false;
                        if (t.listDataFlag) {
                            t.listData = [];
                            document.documentElement.scrollTop = 0;
                        }
                        for (let i = 0; i < item.length; i++) {
                            let json = {
                                itemUrl: item[i].itemUrl,
                                itemTitle: item[i].itemTitle,
                                ownerName: item[i].itemType==1?item[i].ownerNameStr:item[i].ownerName,//视频多作者
                                browseNum: item[i].browseNum,
                                commentNum: item[i].reviewNum,
                                playTime: item[i].playTime,
                                currentStarLevel: item[i].currentStarLevel,
                                currentScoreNum: item[i].currentScoreNum,
                                videoType: item[i].videoType,
                                itemType: item[i].itemType,
                                picUrl: item[i].picUrl,
                                isShowActivityTag: item[i].isShowActivityTag ? item[i].isShowActivityTag : '',//活动相关标签展示
                                activityTagColor: item[i].activityTagColor ? item[i].activityTagColor : '',//活动相关标签展示
                                activityTagName: item[i].activityTagName ? item[i].activityTagName : '',//活动相关标签展示
                            };
                            if (item[i].picUrl) {
                                json.picNum = 1;
                            } else {
                                json.picNum = 0;
                            }
                            t.listData.push(json);
                        }
                        if (t.listData.length < res.data.responseObject.responseData.total_count) {
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
                }, function (res) {//请求失败的时候
                    t.listData = [];
                    t.noMore = true;
                    t.completed = false;
                    t.loading = false;
                    t.listDataFlag = true;
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
                if (param.typeVal || param.typeVal === 0) {
                    t.typeVal = param.typeVal;
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
                const {refType, tagId, dataScene,typeVal} = this;
                return{
                    refType,
                    tagId,
                    dataScene,
                    typeVal
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
            //参数全部类型
            typeVal() {
                let t = this;
                t.navBarOp.typeVal = t.typeVal;
                t.dataType = t.typeVal;
            },
            //参数智能排序
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
