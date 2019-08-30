<template>
    <section>
        <HeaderBar :header-config="headerConfig"></HeaderBar>
        <!--        暂无优惠券-->
        <section class="nothingCoupon" v-if="nothingCoupon">
            <i></i><span>暂无优惠券</span>
        </section>
        <section class="couponContent">
            <!--        可用优惠券-->
            <section v-if="dataList.availableDataList && dataList.availableDataList.length>0">
                <article class="couponTitle">可用券（{{dataList.availableDataList.length}}）</article>
                <ul class="couponList">
                    <li v-for="(item,index) in dataList.availableDataList" v-on:click.stop="chooseCouponItem(item,1)" :class="{active:item.isChoosed===1||item.couponId==couponId}">
                        <article class="couponInfo">
                            <p v-text="moneyFiter(1,item.useCondition)"></p>
                            <p>仅限于{{item.couponTypeName}}使用<i v-if="item.limitProduct && item.limitProduct.length>0" v-on:click.stop="showTipCont(item.limitProduct)"></i><span>剩余{{item.timeRemaining}}天</span></p>
                            <p>有效期至：{{timeFilter(item.startTime)}}-{{timeFilter(item.endTime)}}</p>
                        </article>
                        <article class="couponPrice">
                            <p>{{moneyFiter(2,item.couponDenomination)}}</p>
                            <!--应该没有这个样式-->
                            <!--<p>去使用</p>-->
                        </article>

                    </li>
                </ul>
            </section>
            <!--        可领取-->
            <section v-if="dataList.canCollectDataList && dataList.canCollectDataList.length>0">
                <article class="couponTitle">可领券（{{dataList.canCollectDataList.length}}）</article>
                <ul class="couponList">
                    <li v-for="(item,index) in dataList.canCollectDataList" v-on:click.stop="chooseCouponItem(item,2)" :class="{active:item.isChoosed===1||item.couponId===couponId}">
                        <article class="couponInfo">
                            <p>满{{item.useCondition}}可用</p>
                            <p>仅限于{{item.couponTypeName}}使用<i v-if="item.limitProduct && item.limitProduct.length>0" v-on:click.stop="showTipCont(item.limitProduct)"></i><span>剩余{{item.timeRemaining}}天</span></p>
                            <p>有效期至：{{timeFilter(item.startTime)}}-{{timeFilter(item.endTime)}}</p>
                        </article>
                        <article class="couponPrice">
                            <p>{{moneyFiter(2,item.couponDenomination)}}</p>
                            <p v-on:click.stop="getCouponFn(item)" v-show="(item.isGet!==1)||(!item.isGet)">领取</p>
                            <p v-if="item.isGet===1">已领取</p>
                        </article>
                    </li>
                </ul>
            </section>
            <!--        已过期、不可用、已使用-->
            <article class="openOrCloseBtn"  v-if="dataList.otherDataList && dataList.otherDataList.length>0" v-on:click="openOrCloseOther">
                {{openOtherFlag?'收起':'展开'}}历史优惠券<i :class="{active:openOtherFlag}"></i>
            </article>
            <section  v-if="(dataList.otherDataList && dataList.otherDataList.length>0)&&openOtherFlag">
                <ul class="couponList">
                    <li :class="{
                    unUsed:true,
                    alreadyDelay:item.displayStatus==2,
                    alreadyUsed:item.displayStatus==1,
                    canNotUse:item.displayStatus==0,
                    }" v-for="(item,index) in dataList.otherDataList">
                        <span>{{dataList.otherDataList.displayStatus}}</span>
                        <article class="couponInfo">
                            <p>满{{item.useCondition}}可用</p>
                            <p>仅限于{{item.couponTypeName}}使用<i v-if="item.limitProduct && item.limitProduct.length>0" v-on:click.stop="showTipCont(item.limitProduct)"></i><span>剩余{{item.timeRemaining}}天</span></p>
                            <p>有效期至：{{timeFilter(item.startTime)}}-{{timeFilter(item.endTime)}}</p>
                        </article>
                        <article class="couponPrice">
                            <p>{{moneyFiter(2,item.couponDenomination)}}</p>
                        </article>
                    </li>
                </ul>
            </section>
<!--            提示弹层-->
            <section class="popupTipCont" v-if="isShowTip">
                <section class="popupInner">
                    <p>可用于购买：</p>
                    <ul>
                        <li v-for="(item,index) in dataTipData">
                            <i></i>{{item.productName}}
                        </li>
                    </ul>
                    <span class="IKnowBtn" v-on:click="closeTipCont">知道了</span>
                    <i class="closeBtn" v-on:click="closeTipCont"></i>
                </section>
            </section>
        </section>
        <Loading v-show="isLoading"></Loading>
    </section>
</template>
<script>
    import comm from "static/js/comm.js";
    import TempCache from "static/js/tempcache.js";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import Loading from 'components/Loading/Loading'
    import axios from 'axios';
    const xhrUrl = {
        getMapList: '/allingateway/base-shopping-platform/coupon/couponList',//优惠券列表
        getCoupon:'/allingateway/base-shopping-platform/coupon/getOneCoupon',//领取优惠券
    };
    export default {
        components: {
            HeaderBar,
            Loading
        },
        data(){
            return{
                headerConfig: {//头部引用
                    title: "优惠券",
                    backOnOff: true,
                },
                isLoading:false,
                // customerId:TempCache.getItem("userId"),
                customerId:1397586888724,
                productType:comm.getpara().productType,
                productId:comm.getpara().productId,
                productVipId:comm.getpara().productVipId,
                dataList:[],
                nothingCoupon:false,//是否没有任何优惠券
                nothingCouponHasUsed:false,//没有任何优惠券，但是有其他优惠券，即已使用、不可用、已过期。
                isOpenOther:false,//是否展开其他优惠券
                openOtherFlag:true,//是否展开其他优惠券flag
                isShowTip:false,//是否展示提示弹层
                dataTipData:[],//优惠券提示弹层内容
                couponId:comm.getpara().couponId?comm.getpara().couponId:'',//获取已经选择的优惠券
            }
        },
        mounted() {
            //登录权限
            // user.privExecute({
            //     callback: function() {
                    this.getMapList();
            //     },
            //     operateType: "login"
            // })
        },
        methods:{
            //将事件进行格式化
            timeFilter(val){
                return val.replace(/-/g,'.')
            },
            //优惠金额格式化
            moneyFiter(type,val){
                if(type===1){//满100可用格式化
                    if(val===0){
                       return '无门槛'
                    }else{
                        return '满'+val+'可用'
                    }
                }else{
                    return val;
                }
            },
            //点击展开收起按钮
            openOrCloseOther(){
                this.openOtherFlag = !this.openOtherFlag;
                if(this.openOtherFlag){
                    comm.creatEvent({
                        browType:419,
                        triggerType: '支付详情',
                        triggerName: "展开历史优惠券",
                        actionId: 11799,
                    });
                }
            },
            //提示弹层
            showTipCont(itemArr){
                this.isShowTip = true;
                this.dataTipData = itemArr;
                comm.creatEvent({
                    browType:419,
                    triggerType: '支付详情',
                    triggerName: "优惠券说明",
                    actionId: 11800,
                });
            },
            //关闭弹层
            closeTipCont(){
                this.isShowTip = false;
                this.dataTipData = [];
                comm.creatEvent({
                    browType:419,
                    triggerType: '支付详情',
                    triggerName: "优惠券说明-知道了",
                    actionId: 11801,
                });
            },
            //选择优惠券
            chooseCouponItem(parentItem,type){
                if(type==1){//如果是可选择的优惠券
                    if(parentItem.isChoosed){
                        this.$set(parentItem,'isChoosed',0);
                    }else{
                        for(let item1 in this.dataList.availableDataList){
                            this.$set(this.dataList.availableDataList[item1],'isChoosed',0);
                        }
                        for(let item2 in this.dataList.canCollectDataList){
                            this.$set(this.dataList.canCollectDataList[item2],'isChoosed',0);
                        }
                        this.$set(parentItem,'isChoosed',1);
                    }
                }else{//如果是可领取的优惠券，并且已经领取
                    comm.creatEvent({
                        browType:419,
                        triggerType: '支付详情',
                        triggerName: "点击优惠券",
                        actionId: 11797,
                    });
                    if(parentItem.isGet==1){
                        if(parentItem.isChoosed){
                            this.$set(parentItem,'isChoosed',0);
                        }else{
                            for(let item1 in this.dataList.availableDataList){
                                this.$set(this.dataList.availableDataList[item1],'isChoosed',0);
                            }
                            for(let item2 in this.dataList.canCollectDataList){
                                this.$set(this.dataList.canCollectDataList[item2],'isChoosed',0);
                            }
                            this.$set(parentItem,'isChoosed',1);
                        }
                    }
                }
                // 跳转到支付详情页并且带入已选择的优惠券
                window.location.replace('//m.allinmd.cn/dist/payDetail/payDetail.html?couponId='+parentItem.couponId+'&couponPrice='+parentItem.couponDenomination+'&productType='+this.productType+'&productId='+this.productId)
                // window.location.href('//m.allinmd.cn/dist/payDetail/payDetail.html?couponId='+parentItem.couponId+'&couponPrice='+parentItem.couponDenomination+'&productType='+this.productType+'&productId='+this.productId)
                console.log('跳转到支付页面')
            },
            //领取优惠券
            getCouponFn(item){
                comm.creatEvent({
                    browType:419,
                    triggerType: '支付详情',
                    triggerName: "领取优惠券",
                    actionId: 11798,
                });
                let _this = this;
                let params = {
                    customerId:_this.customerId,
                    productType:_this.productType!=2?3:_this.productType,//带有可领
                    couponBatchId:item.couponBatchId,
                };
                comm.ajax2({
                    url: xhrUrl.getCoupon,
                    type:'GET',
                    data:{queryJson:JSON.stringify(params)},
                    success:function (res) {
                        _this.isLoading = false;
                        if(res && res.responseData && res.responseStatus){
                            _this.$set(item,'isGet',1);
                            _this.$set(item,'isChoosed',1);
                            window.location.replace('//m.allinmd.cn/dist/payDetail/payDetail.html?couponId='+res.responseData.couponId+'&couponPrice='+res.responseData.couponDenomination+'&productType='+_this.productType+'&productId='+_this.productId)
                        }else{
                            popup(res.responseMessage)
                        }
                    },
                    error:function () {
                        popup('优惠券领取失败')
                    }
                });
            },
            //获取优惠券列表
            getMapList(){
                let _this = this;
                _this.isLoading = true;
                let params = {
                    customerId:_this.customerId,
                    productType:(_this.productType!=2&&_this.productVipId)?3:_this.productType,//带有可领
                    productId:(_this.productType!=2&&_this.productVipId)?_this.productVipId:_this.productId,
                };
                comm.ajax2({
                    url: xhrUrl.getMapList,
                    type:'GET',
                    data:{queryJson:JSON.stringify(params)},
                    success:function (res) {
                        _this.isLoading = false;
                        if(res && res.responseData){
                            //没有可选择、可领取
                            if(res.responseData.availableDataList.length===0&&res.responseData.canCollectDataList.length===0){
                                _this.nothingCoupon = true;
                                //没有可其他优惠券
                                if(res.responseData.otherDataList.length===0){
                                    _this.nothingCouponHasUsed = true;
                                }
                            }else{
                                _this.dataList = res.responseData;
                            }
                        }else{
                            _this.nothingCoupon = true;
                        }
                    },
                    error:function () {
                        _this.isLoading = false;
                        _this.nothingCoupon = true;
                    }
                });
            }
        },
    }
</script>
