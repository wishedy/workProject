<template>
    <section class="al-mainInner">
        <!-- 头部信息开始 -->
        <section class="al-headFilterBox">
            <HeaderBar :header-config="headerConfig"></HeaderBar>
            <ProductNavBar :navBarOp="navBarOp" @param-change="paramChange"></ProductNavBar>
            <!--筛选弹层开始-->
            <ProductPopScr :pop-param="popParam" @param-change="paramChange"></ProductPopScr>
            <!--筛选弹层结束-->
            <!--全部类型弹层开始-->
            <ProductPopAll :navBarOp="navBarOp" @param-change="paramChange"></ProductPopAll>
            <!--全部类型弹层结束-->
            <!--智能排序弹层开始-->
            <ProductPopOrd :navBarOp="navBarOp" @param-change="paramChange"></ProductPopOrd>
            <!--智能排序弹层结束-->
        </section>
        <!-- 头部信息结束 -->
        <!-- 列表内容开始 -->
        <section class="al-content" style="margin-top:0">
            <section class="al-discoverMask" :class="{'show':topTabFlag}"></section>
            <!--瀑布流组件开始-->
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="EV-discoverProfessionFilter produtListCont" :style="{marginTop:listMarginTop+'px'}"
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
<!--        &lt;!&ndash; 分享按钮开始 &ndash;&gt;-->
<!--        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>-->
<!--        &lt;!&ndash;分享按钮结束&ndash;&gt;-->
    </section>
</template>
<script>
    import axios from 'axios';
    import TempCache from "static/js/tempcache.js"
    import Loading from 'components/Loading/Loading.vue'
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import ListContent from "components/ListTemplate/productList.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue'
    import ProductPopScr from 'components/ProductListScreening/proListPopScreening.vue'
    import ProductNavBar from 'components/ProductListScreening/proListNavBar.vue'
    import ProductPopAll from 'components/ProductListScreening/proListPopAll.vue'
    import ProductPopOrd from 'components/ProductListScreening/proListPopOrder.vue'
    import Share from "components/Share/Share.vue"
    import comm from "static/js/comm.js"

    const xhrUrl = {
        getMapList: '/mcall/comm/data/filter/getMapList/',//弹层筛选分类列表接口
        getByProperty: '/mcall/discovery/search/getMapListByProperty/',//筛选列表请求接口
        getScreeList: '/mcall/med/product/getPropertySourceSortNew/',//弹层筛选接口
        getResourceList: '/mcall/med/product/getSearchProductList/',//获取产品列表数据
    };
    export default {
        components: {
            HeaderBar,//头部
            ListContent,//主内容列表
            Loading,//loading事件
            VueDataLoading,//瀑布流
            ProductPopScr,//筛选弹层组件
            ProductPopAll,//全部类型弹层
            ProductPopOrd,//智能排序弹层
            ProductNavBar,//顶部条，筛选、全部类型、智能排序
        },
        data() {
            return {
                listDataFlag: true,//判断列表数组是push还是清空
                typeVal: comm.getpara().type?parseInt(comm.getpara().type):0,//全部类型
                indexPop: 0,//弹层
                topTabFlag: false,
                navBarOp: {
                    dataScene: comm.getpara().scene?comm.getpara().scene:6,//A-Z排序
                    typeVal: comm.getpara().type?parseInt(comm.getpara().type):0,//全部类型
                    indexPop: 0,//展示哪一个弹层
                    topTabFlag: false,//是否展示弹层
                    screeName:comm.getpara().proName?comm.getpara().proName:'全部分类'
                },
                headerConfig: {//头部引用
                    title: "产品分类",
                    backOnOff: true,
                    showSearch:{
                        onOrOff:true,
                        eventId:8
                    },
                },
                popParam: {//筛选弹层的pop
                    indexPop: 0,
                    topTabFlag: false,//顶部切换tab,弹层是否显示
                    popFirList: [],//弹层筛选项一级菜单数据
                    popSecList: [],//弹层筛选项二级菜单数据
                    nowFirIndex: 0,//一级筛选菜单点击索引判断
                    screeName:'',//筛选显示的名称
                },
                listData: [],//列表筛选结果数据
                noMore: false,//无内容提示
                loading: false,//loading显示和隐藏
                completed: false,//是否加载完成
                tagId: comm.getpara().tId?comm.getpara().tId:0, //列表参数请求（筛选项的ID）
                dataScene: comm.getpara().scene?comm.getpara().scene:6, //列表参数请求（A-Z排序）
                dataType: comm.getpara().type?comm.getpara().type:0, //列表参数请求（全部渠道）
                screeName:'',
                pageIndex: 1,
                pageSize: 10,
                allResource: [
                //     {refId: 0, refRename: "全部资源", nowSecIndex: 0}, {//二级菜单实际上的原始数据
                //     refId: 0,
                //     refRename: "精选",
                //     addClass: true,
                //     nowSecIndex: 0
                // }
                ],
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
            popListFun() {
                let t = this;
                let cid = TempCache.getItem("userId");
                let tId=parseInt(comm.getpara().tId);
                t.listMarginTop = document.getElementsByClassName("al-headFilterBox")[0].offsetHeight;//获取高度
                t.loading = true;
                axios({
                    url: xhrUrl.getScreeList,
                    method: "POST",
                    data: {},
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
                    if (data && data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData &&data.responseObject.responseData.dataList) {
                        let popList = data.responseObject.responseData.dataList.productCategories;
                        for (let j = 0; j < popList.length; j++) {
                            let _items = popList[j];
                            if(popList[j].childrenList.length>0){
                                for (let i = 0; i < popList[j].childrenList.length; i++) {
                                    let item = popList[j].childrenList[i];
                                    if (j === 0) {
                                        let _popList = {
                                            propertyId: item.propertyId,
                                            propertyName: item.propertyName,
                                            parentId: item.parentId,
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
                                        if (parseInt(item.propertyId)===tId&&j === 0||parseInt(item.propertyId)!==tId&&j === 0) {
                                            t.popParam.ftId=_items.propertyId;
                                            t.popParam.nowFirIndex=j;
                                            t.screeName = _items.propertyName;
                                            // t.popParam.screeName = _items.propertyName;
                                            // t.navBarOp.screeName = _items.propertyName;
                                            // console.log(t.navBarOp)
                                        } else {
                                            if(parseInt(item.propertyId)===tId){
                                                t.popParam.ftId=_items.propertyId;
                                                t.popParam.popSecList=_items.childrenList;
                                                t.popParam.nowFirIndex=j;
                                                // t.popParam.screeName = _items.propertyName;
                                                t.popParam.parentId = _items.parentId;
                                                t.screeName = _items.propertyName;
                                                // t.navBarOp.screeName = _items.propertyName;
                                                // console.log(t.navBarOp.screeName)
                                            }
                                        }
                                    }
                                }
                            }
                            let _popFirList = {
                                propertyId: _items.propertyId,
                                propertyName: _items.propertyName,
                                parentId: _items.parentId,
                                childrenList: t.allResourceTran
                            };
                            t.popParam.popFirList.push(_popFirList);//一级筛选菜单数组赋值，重新赋值
                        }
                        // t.topTabFlag = true;//默认展开
                        if(!comm.getpara().proName){
                            t.screeName = data.responseObject.responseData.dataList.productCategories[0].propertyName;//默认显示第一个筛选项
                        }else{
                            t.screeName = comm.getpara().proName;//默认显示第一个筛选项
                        }
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
                    firstResult: (t.pageIndex-1)*t.pageSize,
                    maxResult: t.pageSize,
                    dataType:1,
                    productPropertyId:t.tagId,
                    sortType:t.dataScene,//6：A-Z；4：最多；2：最新；
                    channelType:t.dataType,//0全部；1国产；2进口；3国外销售；
                };
                comm.ajax2({
                    url: xhrUrl.getResourceList,
                    type:'GET',
                    data:{paramJson:JSON.stringify(param)},
                    success:function (res) {
                        t.loading = false;
                        if (res && res.responseObject && res.responseObject.responseStatus && res.responseObject.responseData && res.responseObject.responseData.dataList) {
                            let item = res.responseObject.responseData.dataList;
                            t.noMore = false;
                            if (t.listDataFlag) {
                                t.listData = [];
                                document.documentElement.scrollTop = 0;
                            }
                            for (let i = 0; i < item.length; i++) {
                                let json = {
                                    attPath: item[i].attPath,
                                    brandId: item[i].brandId,
                                    brandName: item[i].brandName,
                                    productId: item[i].productId,
                                    id: item[i].id,
                                    productName: item[i].productName,
                                };
                                t.listData.push(json);
                            }
                            if (t.listData.length < res.responseObject.responseData.total) {
                                t.completed = false;//还有数据
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
                    error:function () {
                        t.listData = [];
                        t.noMore = true;
                        t.completed = false;
                        t.loading = false;
                        t.listDataFlag = true;
                    }
                })
            },
            //检测参数是否改变
            paramChange(param) {
                let t = this;
                if (param.tagId || param.tagId === 0) {
                    t.tagId = param.tagId;
                }
                t.topTabFlag = param.topTabFlag;//控制弹层展开收起
                if (param.indexPop || param.indexPop === 0) {
                    t.indexPop = param.indexPop;
                }
                if (param.typeVal || param.typeVal === 0) {
                    t.typeVal = param.typeVal;
                }
                if (param.dataScene) {
                    t.dataScene = param.dataScene;
                }
                if (param.screeName) {
                    t.screeName = param.screeName;
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
                const {
                    refType,
                    tagId,
                    dataScene,
                    typeVal
                } = this;
                return{
                    refType,
                    tagId,
                    dataScene,
                    typeVal,
                }
            }
        },
        //监听数据data
        watch: {
            //监听名称变化（隐患：如果名称的第一级不一样，第二级名称相同，可能会出现不更新状态，不过名称相同不更新也无所谓）
            screeName() {
                this.navBarOp.screeName = this.screeName;
                this.popParam.screeName = this.screeName;
            },
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
                },
                deep: true
            },
        },
        mounted() {
            let t = this;
            t.popListFun();
            t.listContentFun();
            t.bodyOverflow();
        }
    }
</script>
