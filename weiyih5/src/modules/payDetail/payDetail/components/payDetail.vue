<template>
<!--    购买支付详情页-->
    <section class="al-mainInner">
        <HeaderBar :header-config="headerConfig"></HeaderBar>
        <section class="payDetailContent">
            <!--        购买项信息-->
            <section :class="{payHeaderInfo:true,vipBg:productType==3}">
                <img class="payImgInfo" :src="productType==='1'||productType==='4'?courseDataInfo.coursePicUrl:(productType==='2'?seriesDataInfo.seriesPicUrl:(productType==='3'?vipDataInfo.vipProductPicUrl:''))" alt="">
                <section class="payTextInfo">
                    <article class="payTitle" v-text="productType==='1'||productType==='4'?courseDataInfo.courseName:(productType==='2'?seriesDataInfo.seriesName:(productType==='3'?vipDataInfo.vipProductName:''))"></article>
                   <!--会员购买-->
                    <section class="payDescCont" v-if="vipDataInfo&&productType==='3'">
                        <article class="payVipDesc">
                            <span><i>￥</i>{{vipDataInfo.discountPrice}}</span>
                            <span class="">/年</span>
                            <span v-if="vipDataInfo.originalPrice!=vipDataInfo.discountPrice">¥{{vipDataInfo.originalPrice}}</span>
                            <i class="redTip" v-if="vipDataInfo.originalPrice!==vipDataInfo.discountPrice">限时特惠</i>
                        </article>
                        <!--<article class="payCourseDesc">-->
                            <!--<span>￥</span>-->
                            <!--<span>{{vipDataInfo.originalPrice}}</span>-->
                            <!--<span v-if="vipDataInfo.originalPrice!==vipDataInfo.discountPri">￥{{vipDataInfo.discountPrice}}</span>-->
                            <!--<i class="redTip" v-if="vipDataInfo.originalPrice!==vipDataInfo.discountPrice">限时特惠</i>-->
                        <!--</article>-->
                    </section>
                    <!--专栏购买-->
                    <section class="payDescCont" v-if="seriesDataInfo&&productType==='2'">
                        <article class="payCourseDesc">
                            <span>￥</span>
                            <span>{{seriesDataInfo.discountPrice}}</span>
                            <span v-if="seriesDataInfo.discountPrice!==seriesDataInfo.originalPrice">￥{{seriesDataInfo.originalPrice}}</span>
                            <i class="redTip" v-if="seriesDataInfo.discountPrice!==seriesDataInfo.originalPrice">{{seriesDataInfo.seriesHint}}</i>
                        </article>
                    </section>
                    <!--单视频&会员购买-->
                    <section class="payDescCont" v-if="courseDataInfo&&(productType==='1'||productType==='4')">
                        <article class="payCourseDesc">
                            <span>￥</span>
                            <span>{{courseDataInfo.discountPrice}}</span>
                            <span v-if="courseDataInfo.discountPrice!==courseDataInfo.originalPrice">￥{{courseDataInfo.originalPrice}}</span>
                            <i class="redTip" v-if="courseDataInfo.discountPrice!==courseDataInfo.originalPrice">{{courseDataInfo.courseHint}}</i>
                        </article>
                    </section>
                </section>
            </section>
            <span class="grayBgLine"></span>
            <!--            会员购买项：在购买单课、单课+会员-->
            <section class="vipPayItem" v-if="(productType==='1'||productType==='4')&&isAlreadyVip!=1">
                <img :src="vipDataInfo.equityIconPicUrl" alt="">
                <span class="vipPayItemInfo">{{vipDataInfo.equityTitle}}</span>
                <section>
                    <span class="vipOriginalPrice"><i>￥</i>{{vipDataInfo.discountPrice}}</span>
                    <span>/年</span>
                    <span v-on:click.stop="choosePayVip" :class="{active:isChooseVip}"></span>
                </section>
            </section>
            <span class="grayBgLine"></span>
<!--            购买权益:只有在购买会员时显示-->
            <section class="payRightInterests" v-if="productType==='3'">
                <article class="rightTitle">
                    <span>{{vipDataInfo.departmentName}}会员权益</span>
                    <span v-on:click="openOrCloseTip">权益详解 ></span>
                </article>
                <article class="rightItem">
                    <ul>
                        <li v-for="(item,index) in vipDataInfo.equityList">
                            <img :src="item.equityPicUrl" alt="">
                            <span>{{item.equityTitle}}</span>
                        </li>
                    </ul>
                </article>
            </section>
            <span class="grayBgLine"></span>
<!--            购买类型&优惠-->
            <section class="payTypeCont">
                <ul>
                    <li class="payType">
                        <span>购买类型</span>
                        <span v-text="checkPayType()"></span>
                    </li>
                    <li class="payDiscount">
                        <span>优惠</span>
<!--                        具有可用的优惠券:没有最大可用，但存在可用-->
                        <span class="availableCoupon" v-on:click="jumpCoupon" v-if="!maxCoupon&&availableCoupon">{{availableCouponList.length}}个优惠<i>></i></span>
<!--                        具有可领取优惠券：不具有最大可用，不存在可用，存在可领取-->
                        <span class="canCollectCoupon" v-on:click="jumpCoupon" v-if="!maxCoupon&&!availableCoupon&&canCollectCoupon">{{canCollectCouponList.length}}个可领取优惠<i>></i></span>
<!--                        没有选择任何优惠券并且没有最大可用优惠券-->
                        <span class="nothingCoupon" v-on:click="jumpCoupon" v-if="!maxCoupon&&!availableCoupon&&!canCollectCoupon">暂无优惠<i>></i></span>
<!--                        选择了优惠券的样式：已经选择了优惠券/有最大可用优惠券-->
                        <span class="couponNum" v-on:click="jumpCoupon" v-if="isChooseCoupon || maxCoupon">-￥{{couponPrice}}<i>></i></span>
                    </li>
                </ul>
            </section>
            <span class="grayBgLine"></span>
<!--            支付方式-->
            <section class="payWayCont">
                <span class="payWayTitle">付款方式</span>
                <ul class="payWayItem">
                    <li>
                        <span></span>
                        <span>
                            微信支付
                        </span>
                        <span :class="{active:isChecked}"></span>
                    </li>
                </ul>
            </section>
<!--            提交按钮-->
            <section class="paySubmitBtn">
                <span>
                    ￥<i class="moneyNum">{{payAllPrice}}</i>
                    <i class="grayLine" v-if="isDisCount"></i>
                    <i class="discount" v-if="isDisCount" v-text="checkDiscountPrice()"></i>
                </span>
                <span v-on:click="paySubmitFn" class="submitBtn">
                    立即支付
                </span>
                <p class="vipTip" v-if="isChooseVip&&productType==='1'">含会员开通费¥{{parseFloat(vipDataInfo.discountPrice)-parseFloat(couponPrice)}}</p>
            </section>
        </section>
        <RightDialog v-if="rightOnOff" @closeBack="closeDialog" :rightName="rightName"></RightDialog>
        <Loading v-show="isLoading"></Loading>
    </section>
</template>

<script>
    import axios from 'axios';
    import TempCache from "static/js/tempcache.js"
    import Loading from 'components/Loading/Loading.vue'
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import comm from "static/js/comm.js"
    import RightDialog from "components/RightDialog/RightDialog.vue";
    const path={
        // getPrepayDetail:'/mock/college/getPrepayDetail',//获取支付详情页数据
        getPrepayDetail:'/allingateway/base-resource-platform/college/prepay/detail',
        // getPrepayDetail:'/allingateway/base-resource-platform/college/getPrepayDetail',//获取支付详情页数据
        getCouponList:'/allingateway/base-shopping-platform/coupon/couponList',
        createOrder:'/allingateway/base-shopping-platform/shoppingOrder/createOrderV2',//创建订单接口
        // createOrder:'http://dev-gateway.allinmd.cn/base-shopping-platform/shoppingOrder/createOrderV2',//创建订单接口

    };
    export default{
        components:{
            HeaderBar,
            Loading,
            RightDialog
        },
        data(){
            return{
                headerConfig: {//头部引用
                    title: "支付详情",
                    backOnOff: true,
                },
                isLoading:false,
                loadingNum:0,//loading的个数
                isChecked:true,//是否已经选择了微信支付
                isShowTip:false,//是否显示弹层
                isChooseCoupon:false,//是否显示了优惠券
                isChooseVip:true,//是否选择会员
                nothingCoupon:false,//是否没有任何优惠券
                isAlreadyVip:0,//默认不是会员（0不是，1是）

                maxCoupon:false,//是否存在最大可用优惠券集合
                maxCouponInfo:'',//最大优惠券的金额、id信息
                availableCoupon:false,//存在可用优惠券
                availableCouponList:[],//可用集合
                canCollectCoupon:false,//存在可领取优惠券
                canCollectCouponList:[],//可领取集合
                productType:comm.getpara().productType,
                productId:comm.getpara().productId,//产品id
                vipProductId:'',//会员id
                couponId:comm.getpara().couponId?comm.getpara().couponId:'',//优惠券id
                couponPrice:comm.getpara().couponPrice?comm.getpara().couponPrice:0,//优惠券价格
                allDiscountPrice:0,//已经优惠的价格
                payAllPrice:0,//实际支付价格
                isDisCount:false,//已经进行了优惠，用来判断是否显示已优惠文案
                vipPrice:0,//会员价格

                // customerId:TempCache.getItem("userId")?TempCache.getItem("userId"):'',
                customerId:1397586888724,
                dataInfo:'',//总数据
                vipDataInfo:'',//支付详情页会员数据
                seriesDataInfo:'',//专栏
                courseDataInfo:'',//课程

                detailIsFinished:false,//详情请求完成
                popupIsFinish:false,//优惠券请求完成

                payType:1,//购买类型

                productList:[],//订单list

            //    权限
                authState:0,
                customerRole:0,
                openId:comm.getpara().openId?comm.getpara().openId:0,

                rightOnOff:false,
                rightName:''
            }
        },
        mounted(){
            if(comm.isWeiXin()){
                this.getPayDetailInfo();//支付详情信息
            }else{
                let id = TempCache.getItem('userId')||'';
                let amChannel = comm.getpara()._amChannel;
                comm.newReleaseBox({
                    imgPath:"//img50.allinmd.cn/case/release.png",
                    title:"请在APP或微信浏览器中支付",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:"暂不发布",
                    data:{
                        el: ".submitBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=3&type=102" +(amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene=3&type=102" +(amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:3,type:102,userId:"+id + (amChannel?",_amChannel:"+amChannel:'')+ "}"
                    },
                    // authNoneCallBack:function () {
                    //     window.location.href='//m.allinmd.cn/dist/college/college.html#/collegeHome'
                    // }
                });
            }
        },
        methods: {
            closeDialog(){
                this.rightOnOff = false;
                comm.creatEvent({
                    browType:418,
                    triggerType: '支付详情',
                    triggerName: "权益详解关闭按钮",
                    actionId: 11897,
                });
            },
            //校验登陆权限
            checkState(){
                let _this = this;
                if(comm.isWeiXin()){
                    if(_this.customerId){
                        let url = '/mcall/customer/unite/getMapById/';
                        let Data = {
                            "customerId": _this.customerId,
                            "logoUseFlag": 4,
                            "isCustomer": 1,
                            "vFlag": 3
                        };
                        axios({
                            url: url,
                            method: "POST",
                            data: Data,
                            transformRequest: [function(data) {
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(function(datas){
                            console.log('请求成功');
                            let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0];
                            if (dataList) {
                                let customerAuth = dataList.customer_auth;
                                _this.authState = customerAuth.state;
                                _this.customerRole = dataList.customer_unite.customerRole;
                                //0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师 14厂商未注册
                                _this.checkAuthority();
                            }
                        });
                    }else{
                        user.weixinLogin();
                    }
                }else{
                    let id = TempCache.getItem('userId')||'';
                    let amChannel = comm.getpara()._amChannel;
                    comm.newReleaseBox({
                        imgPath:"//img50.allinmd.cn/case/release.png",
                        title:"请在APP或微信浏览器中支付",
                        solidBtnTitile:"立即使用",
                        authNoneTitle:"暂不发布",
                        data:{
                            el: ".submitBtn",
                            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=3&type=102" +(amChannel?"&_amChannel="+amChannel:''),
                            ios9: "http://app.allinmd.cn/applinks.html?scene=3&type=102" +(amChannel?"&_amChannel="+amChannel:''),
                            android: "allin://com.allin.social:75235?data={scene:3,type:102,userId:"+id + (amChannel?",_amChannel:"+amChannel:'')+ "}"
                        }
                    });
                }
            },
            checkAuthority(){
                let _this = this;
                let role = parseInt(_this.customerRole,10);
                //1-系统、2-组织、3-厂商、5-普通医生、6-认证医生、7-住陪学员、11-执业医师、12-护理、13-医助、14-厂商未认证、15-厂商已认证
                let roleOnOff = role===5||role===6||role===7||role===11||role===12;
                if(roleOnOff){//医务人员，医生，护士，医学生
                    _this.auth();
                }else{
                    console.log('认证权限不够不可以购买')
                    //不可以购买
                }
            },
            auth(){
                let _this = this;
                switch (parseInt(_this.authState)) {
                    case -1:
                    case 3:
                    case 0:
                    case 1:
                        user.privExecute({
                            operateType: 'auth',
                            noNeedBack:false,
                            noAuthTip:1,
                            callback: function () {
                                // TempCache.setItem('fromPage', location.href);
                            //TODO：回调
                            }
                        });
                        break;
                    case 2://可以购买
                    case 7://可以购买
                    case 8://可以购买
                    case 9://可以购买
                        comm.loginInit();//静默登录，用来获取openId
                        this.getPayDetailInfo();//支付详情信息
                        break;
                }
            },
            //购买逻辑
            toPayVipOrCourse(){
                let _this = this;
                let params = {
                    customerId:_this.customerId,
                    couponId:_this.couponId?_this.couponId:undefined,
                    payType:7,
                    sourceType:3,
                    productList:_this.productList,
                    purchaseType:_this.payType,
                    realPrice:_this.payAllPrice,
                    // openid:_this.openId,
                    openid:'o1GqIt05zvT_cG7ovxCRr-7j4XyA'
                };
                console.log(params);
                axios.post(path.createOrder, params)
                    .then(function (res) {
                        if(res && res.data && res.data.responseStatus){
                            let weChatData = res.data.responseData.wechatPayResult;
                            console.log(weChatData);
                            comm.weChatPay({
                                data:{
                                    timeStamp:weChatData.timeStamp,//时间戳
                                    nonceStr:weChatData.nonceStr,//随机码
                                    prepayId:res.data.responseData.payOrderNumber,//订单号
                                    sign:weChatData.sign//签名
                                },
                                successCallBack:function(){
                                    //当购买成功后在本地缓存显示vip购买成功弹层，在显示后将弹层缓存进行清除
                                    if(_this.productType!=2){
                                        TempCache.setItem('isShowVipPopup',true);
                                        TempCache.setItem('productId',_this.vipProductId);
                                    }
                                    popup('购买成功');
                                    history.back(-1);
                                },
                                cancelCallback:function () {
                                    popup('取消购买');
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000)
                                },
                                faileCallback:function () {
                                    popup('购买失败');
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000)
                                }
                            });
                        }else{
                            comm.alertBox({
                                "title":res.data.responseMessage,
                                "ensure":"知道了",
                                ensureCallback:function(){
                                    window.location.reload();
                                }
                            })
                        }
                    })
                    .catch(function (error) {
                        comm.alertBox({
                            "title":'下单失败，请重新下单',
                            "ensure":"知道了",
                            ensureCallback:function(){
                                window.location.reload();
                            }
                        })
                    });
            },
            //跳转优惠券页面
            jumpCoupon(){
                var _this = this;
                if(_this.detailIsFinished && _this.popupIsFinish){
                    comm.creatEvent({
                        browType:418,
                        triggerType: '支付详情',
                        triggerName: "选择优惠券",
                        actionId: 11789,
                        refId:_this.productId
                    });
                    //购买会员并且已经选了会员
                    if(_this.productType!=2&&_this.isChooseVip){
                        window.location.replace('//m.allinmd.cn/dist/couponList/couponList.html?productType='+this.productType+'&productId='+this.productId+(this.productType!=2?'&productVipId='+this.vipProductId:'')+(this.couponId?'&couponId='+this.couponId:'')+'&jumpFrom='+window.location.href)
                    }else{
                        window.location.replace('//m.allinmd.cn/dist/couponList/couponList.html?productType='+this.productType+'&productId='+this.productId+(this.couponId?'&couponId='+this.couponId:'')+'&jumpFrom='+window.location.href)
                    }
                }else{
                    popup('数据获取失败')
                }
            },
        //    关闭弹窗显示
            openOrCloseTip(){
                this.rightOnOff = true;
                comm.creatEvent({
                    browType:418,
                    triggerType: '支付详情',
                    triggerName: "权益详解按钮点击",
                    actionId: 11896,
                });
            },
        //    选择购买会员
            choosePayVip(){
                let _this = this;
                this.isChooseVip = !this.isChooseVip;
                if(!this.isChooseVip){//没有选择会员则单视频不可以用优惠券
                    this.payType = this.productType;
                    popup('单独购买视频恢复原价￥'+this.courseDataInfo.originalPrice);
                    this.vipPrice = 0;
                    this.couponPrice = 0;
                    this.canCollectCoupon = false;
                    this.maxCoupon = false;
                    this.availableCoupon = false;
                    this.courseDataInfo.oldDiscountPrice = this.courseDataInfo.discountPrice;//将打折价格进行保存
                    this.courseDataInfo.discountPrice = this.courseDataInfo.originalPrice;
                    this.checkDiscountPrice();
                    this.checkPayPrice();
                    this.checkIsDisCount();
                }else {
                    this.payType = 4;
                    this.vipPrice = this.vipDataInfo.discountPrice;
                    this.courseDataInfo.discountPrice = this.courseDataInfo.oldDiscountPrice;
                    this.getCouponList();
                }
                comm.creatEvent({
                    browType:418,
                    triggerType: '支付详情',
                    triggerName: "单课+会员页面二级学院会员勾选/反选",
                    actionId: 11899,
                    keyWord:_this.rightName
                });
                //校验产品列表list
                this.checkProductList();
            },
            //校验优惠金额
            checkDiscountPrice(){
                let _this = this;
                switch (parseFloat(this.productType)) {
                    //1-单课视频，2-个人专栏，3-学院会员，4-学院会员+特惠视频
                    case 1:
                        _this.allDiscountPrice = parseFloat(_this.courseDataInfo.originalPrice) - parseFloat(_this.courseDataInfo.discountPrice) + parseFloat(_this.couponPrice);
                        break;
                    case 2:
                        _this.allDiscountPrice = parseFloat(_this.seriesDataInfo.originalPrice) - parseFloat(_this.seriesDataInfo.discountPrice) +parseFloat(_this.couponPrice);
                        break;
                    case 3:
                        _this.allDiscountPrice = parseFloat(_this.vipDataInfo.originalPrice) - parseFloat(_this.vipDataInfo.discountPrice) +parseFloat(_this.couponPrice);
                        break;
                    default:
                        _this.allDiscountPrice = 0;
                }
                return '已优惠¥'+_this.allDiscountPrice;
            },
            //真正支付金额
            checkPayPrice(){
                let _this = this;
                switch (parseFloat(this.productType)) {
                    //1-单课视频，2-个人专栏，3-学院会员，4-学院会员+特惠视频
                    case 1:
                        _this.payAllPrice = parseFloat(_this.courseDataInfo.discountPrice) - parseFloat(_this.couponPrice) + parseFloat(_this.vipPrice);
                        break;
                    case 2:
                        _this.payAllPrice = parseFloat(_this.seriesDataInfo.discountPrice) - parseFloat(_this.couponPrice);
                        break;
                    case 3:
                        _this.payAllPrice = parseFloat(_this.vipDataInfo.discountPrice) - parseFloat(_this.couponPrice);
                        break;
                    default:
                        _this.payAllPrice = 0;
                }
                let a = _this.payAllPrice.toString().split('.');
                let len = a[1];
                let b = len/10;
                let c = len%10;
                if(!len){
                    _this.payAllPrice = _this.payAllPrice
                } else {
                    if((b==0&&c!=0)||(b!=0&&c!=0)){
                        _this.payAllPrice = _this.payAllPrice.toFixed(2);
                    }else if(b!=0&&c==0){
                        _this.payAllPrice = _this.payAllPrice.toFixed(1);
                    }
                }
                return _this.payAllPrice;
            },
            //校验已经有优惠，用来决定是否显示付款栏显示已优惠
            checkIsDisCount(){
                let _this  = this;
                switch (parseFloat(this.productType)) {
                    //1-单课视频，2-个人专栏，3-学院会员，4-学院会员+特惠视频
                    case 1:
                        if(_this.courseDataInfo.originalPrice !== _this.courseDataInfo.discountPrice || _this.couponPrice!=0){
                           _this.isDisCount = true;
                        }else{
                            _this.isDisCount = false;
                        }
                        break;
                    case 2:
                        if(_this.seriesDataInfo.originalPrice !== _this.seriesDataInfo.discountPrice|| _this.couponPrice!=0){
                            _this.isDisCount = true;
                        }else{
                            _this.isDisCount = false;
                        }
                        break;
                    case 3:
                        if(_this.vipDataInfo.originalPrice !== _this.vipDataInfo.discountPrice|| _this.couponPrice!=0){
                            _this.isDisCount = true;
                        }else{
                            _this.isDisCount = false;
                        }
                        break;
                    default:
                        _this.isDisCount = false;
                }
                return _this.isDisCount;
            },
            checkPayType(){
                let _this = this;
                switch (parseFloat(this.productType)) {
                    //1-单课视频，2-个人专栏，3-学院会员，4-学院会员+特惠视频
                    case 1:
                        if(_this.isChooseVip){
                            return '学院会员+特惠视频';
                        }else{
                            return '单课视频';
                        }
                    case 2:
                        return '个人专栏';
                    case 3:
                        return '学院会员';
                    default:
                        return '单课视频';
                }
            },
            //获取优惠券列表
            getCouponList(){
                let _this = this;
                _this.isLoading = true;
                _this.loadingNum++;
                let params = {
                    customerId:_this.customerId,
                    productType:_this.productType!=2?3:_this.productType,
                    productId:_this.productType==2?_this.productId:_this.vipProductId,
                };
                comm.ajax2({
                    url: path.getCouponList,
                    type:'GET',
                    data:{queryJson:JSON.stringify(params)},
                    success:function (res) {
                        _this.loadingNum--;
                        if(_this.loadingNum==0){
                            _this.isLoading = false;
                        }
                        /*
                        * 优惠券：
                            1，判断是否有最大优惠券。
                            2，如果没有是否有可用的----如果有可用的显示多少个优惠。
                            3，如果没有是否觉有可领取----多少可领取优惠。
                            4，如果没有----暂无可用。
                        * */
                        if(res && res.responseData){
                            _this.popupIsFinish = true;
                            if(!comm.isEmptyObject(res.responseData.maxCoupon)){//是否具有可用的最大优惠券
                                _this.maxCoupon = true;
                                _this.couponPrice = res.responseData.maxCoupon.couponDenomination;
                                _this.couponId = res.responseData.maxCoupon.couponId;
                            }else {
                                _this.maxCoupon = false;//没有最大可用集合，显示无可用优惠券
                                //判断是否存在可用优惠券
                                if(res.responseData.availableDataList && res.responseData.availableDataList.length>0){
                                    _this.availableCoupon = true;//有可用优惠券
                                    _this.availableCouponList = res.responseData.availableDataList;
                                }else{
                                    _this.availableCoupon = false;
                                    if(res.responseData.canCollectDataList && res.responseData.canCollectDataList.length>0){
                                        _this.canCollectCoupon = true;//有可领取的优惠券
                                        _this.canCollectCouponList = res.responseData.canCollectDataList;
                                    }else{
                                        _this.canCollectCoupon = false;
                                    }
                                }
                            }
                            if(_this.detailIsFinished && _this.popupIsFinish){
                                _this.checkDiscountPrice();
                                _this.checkPayPrice();
                                _this.checkIsDisCount();
                                _this.checkProductList();//产品列表
                            }
                        }else{
                            _this.maxCoupon = false;
                            _this.popupIsFinish = true;
                            if(_this.detailIsFinished && _this.popupIsFinish){
                                _this.checkDiscountPrice();
                                _this.checkPayPrice();
                                _this.checkIsDisCount();
                                _this.checkProductList();//产品列表
                            }
                            popup('优惠券数据获取失败')
                        }
                    },
                    error:function () {
                        _this.loadingNum--;
                        if(_this.loadingNum==0){
                            _this.isLoading = false;
                        }
                        popup('优惠券数据获取失败')
                    }
                });
            },
        //    支付按钮
            paySubmitFn(){
                let _this = this;
                if(comm.isWeiXin()){
                    // console.log('是微信');
                    // comm.loginInit();//静默登录，用来获取openId
                    comm.creatEvent({
                        browType:418,
                        triggerType: '支付详情',
                        triggerName: "确认支付",
                        actionId: 11791,
                        refId:_this.productId
                    });
                    comm.creatEvent({
                        browType:418,
                        triggerType: '支付详情',
                        triggerName: "微信支付",
                        actionId: 11792,
                        refId:_this.productId
                    });
                    _this.toPayVipOrCourse();
                }else{
                    let id = TempCache.getItem('userId')||'';
                    let amChannel = comm.getpara()._amChannel;
                    comm.newReleaseBox({
                        imgPath:"//img50.allinmd.cn/case/release.png",
                        title:"请在APP或微信浏览器中支付",
                        solidBtnTitile:"立即使用",
                        authNoneTitle:"暂不发布",
                        data:{
                            el: ".submitBtn",
                            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                            ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                            android: "allin://com.allin.social:75235?data={scene:11,type:51,userId:"+id + (amChannel?",_amChannel:"+amChannel:'')+ "}"
                        },
                        // authNoneCallBack:function () {
                        //     window.location.href='//m.allinmd.cn/dist/college/college.html#/collegeHome'
                        // }
                    });
                    console.log('不是微信')
                }
            },
            //订单列表
            checkProductList(){
                let _this  = this;
                _this.productList = [];
                switch (parseFloat(this.productType)) {
                    //1-单课视频，2-个人专栏，3-学院会员，4-学院会员+特惠视频
                    case 1:
                        _this.productList.push({
                            productId:_this.courseDataInfo.courseId,
                            productType:1,
                        });
                        //选择了vip则将vip信息添加
                        if(this.isChooseVip){
                            _this.productList.push({
                                productId:_this.vipDataInfo.id,
                                productType:3,
                            });
                        }
                        break;
                    case 2:
                        _this.productList.push({
                            productId:_this.seriesDataInfo.seriesId,
                            productType:2,
                        });
                        break;
                    case 3:
                        _this.productList.push({
                            productId:_this.vipDataInfo.id,
                            productType:3,
                        });
                        break;
                    default:
                        _this.productList = []
                }
                return _this.productList;
            },
        //    支付详情页
            getPayDetailInfo(){
                let _this = this;
                _this.isLoading = true;
                _this.loadingNum++;
                let params ={
                    //1,46
                    //2,172
                    //3,188
                    //4,4
                    productId:this.productId,
                    productType:this.productType,
                    customerId:this.customerId,
                };
                comm.ajax2({
                    url: path.getPrepayDetail,
                    type:'GET',
                    data:params,
                    success:function (res) {
                        _this.loadingNum--;
                        if(_this.loadingNum==0){
                            _this.isLoading = false;
                        }
                        if(res && res.responseData){
                            _this.detailIsFinished = true;
                            _this.dataInfo = res.responseData;
                            _this.isAlreadyVip = res.responseData.vipState;//是否是会员
                            // _this.isAlreadyVip = 1;//是否是会员
                            _this.rightName = res.responseData.vipProduct.departmentName;
                            // _this.rightName = '关节学院';
                            if(_this.isAlreadyVip==1){//已经购买了会员则不需要重新购买
                                _this.isChooseVip = false;
                            }else{
                                _this.payType = 4;
                            }
                            //会员信息
                            if(res.responseData.vipProduct){
                                _this.vipDataInfo = res.responseData.vipProduct;
                                _this.vipProductId = res.responseData.vipProduct.id;//会员id
                                _this.vipPrice = parseFloat(res.responseData.vipProduct.discountPrice);//会员价格

                            }
                            //专栏
                            if(res.responseData.series){
                                _this.seriesDataInfo =  res.responseData.series;
                            }
                            //课程
                            if(res.responseData.course){
                                _this.courseDataInfo =  res.responseData.course;
                            }
                            //如果是从优惠券页面返回来的
                            if(!comm.getpara().couponPrice&&_this.isAlreadyVip!=1){
                                _this.getCouponList();//获取优惠券列表
                            }else{
                                _this.maxCoupon = true;
                                _this.popupIsFinish = true;
                                if(_this.detailIsFinished && _this.popupIsFinish){
                                    _this.checkDiscountPrice();
                                    _this.checkPayPrice();
                                    _this.checkIsDisCount();
                                    _this.checkProductList();//产品列表
                                }
                            }
                        }else{
                            _this.dataInfo = '';
                            popup('支付详情数据获取失败');
                            // setTimeout(function () {
                            //     history.back(-1);
                            // },1000)
                        }
                    },
                    error:function () {
                        _this.loadingNum--;
                        if(_this.loadingNum==0){
                            _this.isLoading = false;
                        }
                        popup('支付详情数据获取失败');
                        // setTimeout(function () {
                        //     history.back(-1);
                        // },1000)
                    }
                });
            }
        }
    }
</script>
