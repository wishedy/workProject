<template>
    <section class="al-buyVip" :class="{'al-buyColumn':columnOnOff}"  v-show="payStateOnOff&&(vipOnOff||columnOnOff)">
        <span class="see-right" v-show="vipOnOff" @click.stop="checkRight">查看权益</span>
        <span class="price-bar" v-show="columnOnOff">
            <em v-text="courseData.discountPrice"></em>
            <em class="price-unit">元</em>
            <em class="original-price">{{courseData.coursePrice}}元</em>
            <em class="reducedPrice">限时特惠</em>
        </span>
        <span class="openVipBtn" v-show="vipOnOff" @click.stop="checkState">开通会员，解锁6大课程</span>
        <span class="openVipBtn" v-show="columnOnOff" @click.stop="checkState">立即购买</span>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import {mapGetters,mapActions} from 'vuex';
    import TempCache from "static/js/tempcache.js";
    import axios from "axios";
    import user from 'static/js/module.user.js';
    export default {
        computed:{
            ...mapGetters(['courseData']),
            columnOnOff(){
                const _this = this;
                return (!_this.isEmptyObject(_this.courseData))&&((parseInt(_this.courseData.productType,10)===2));
            },
            vipOnOff(){
                const _this = this;
                return (!_this.isEmptyObject(_this.courseData))&&((parseInt(_this.courseData.productType,10)===3));
            },
            payStateOnOff(){
                const _this = this;
                console.log(_this.courseData,_this.courseData.payState,_this.courseData.productType);
                return (!_this.isEmptyObject(_this.courseData))&&(parseInt(_this.courseData.payState,10)===0);
            }
        },
        watch:{
            courseData(n){
                console.log('数据更新了');
            }
        },
        data(){
            let customerId = comm.checkInvalid(TempCache.getItem("userId"))?'':TempCache.getItem("userId");
            let courseId = comm.getparaNew().courseId;
          return {
              onPaying:true,
              courseId:courseId,
              customerId:customerId
          }
        },
        methods:{
            ...mapActions(['setRightOnOff']),
            checkRight(){
                const _this = this;
                var param = `name$${_this.courseId}`;
                comm.creatEvent({
                    triggerType:"课程详情页",
                    keyword:'查看权益',
                    browType:415,
                    actionId:11891,
                    refId:_this.courseId
                });
                _this.setRightOnOff(true);
            },
            checkAuthority(){
                let _this = this;
                let role = parseInt(_this.customerRole,10);
                //1-系统、2-组织、3-厂商、5-普通医生、6-认证医生、7-住陪学员、11-执业医师、12-护理、13-医助、14-厂商未认证、15-厂商已认证
                let roleOnOff = role===5||role===6||role===7||role===11||role===12;
                if(roleOnOff){//医务人员，医生，护士，医学生

                    _this.auth();
                }else{
                    //除以上身份以外的身份，其他身份不可以购买
                }
            },
            login(){
                user.weixinLogin();
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
                                TempCache.setItem('fromPage', location.href);

                            }
                        });
                        break;
                    case 2://可以购买
                    case 7://可以购买
                    case 8://可以购买
                    case 9://可以购买
                        _this.buyCourse();
                        break;
                }
            },
            weChatBuy(){
                let _this = this;
                comm.redirect(`/dist/payDetail/payDetail.html?productId=${_this.courseId}&productType=${_this.courseData.productType}`);
            },
            buyCourse(){
                let _this = this;
                console.log('购买课程');
                //购买课程前首先判断该用户是否购买过该课程
                let url = '/mcall/college/course/getCustomerPurchasedList/';
                let Data = {
                    "courseId": _this.courseId,
                    "customerId": _this.customerId,
                    "isValid": 1
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
                    _this.onPaying = true;
                    let totalCount = datas.data.responseObject.responseData && datas.data.responseObject.responseData.totalCount;
                    if (parseInt(totalCount,10)===0) {//如果没有购买过课程
                        _this.weChatBuy();
                    }else{
                        //如果用户已经购买过课程
                        _this.wakeApp();
                    }
                });

            },
            wakeApp(){
                let _this = this;
                let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${_this.courseId}}`;
                let iosParam = `scene=3&type=101&tplPath=0&keyword=${_this.courseId}`;
                let callAppOptions = {
                    el: ".openVipBtn",
                    runAtOnce: false,
                    ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                    android: "allin://com.allin.social:75235?data=" + androidParam
                };
                commApp.appWakeUp('confirm',callAppOptions);
            },
            checkState(){
                let _this = this;
                if(_this.onPaying){
                    if(comm.isWeiXin()){
                        if(_this.customerId){
                            var param = `name$${_this.courseId}`;
                            comm.creatEvent({
                                triggerType:"课程详情页",
                                keyword:'购买按钮',
                                browType:415,
                                actionId:11753,
                                refId:_this.courseId
                            });
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
                                    _this.onPaying =false;
                                    _this.checkAuthority();
                                }
                            });
                        }else{
                            _this.login();
                        }
                    }else{
                        //_this.wakeApp();
                        let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${_this.courseId}}`;
                        let iosParam = `scene=3&type=101&tplPath=0&keyword=${_this.courseId}`;
                        let callAppOptions = {
                            el: ".openVipBtn",
                            runAtOnce: false,
                            ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                            ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                            android: "allin://com.allin.social:75235?data=" + androidParam
                        };
                        comm.newReleaseBox({
                            imgPath:"//img50.allinmd.cn/case/release.png",
                            title:"请用app/微信浏览器支付",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不发布",
                            data:callAppOptions
                        });
                    }
                }

            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            }
        }
    }
</script>
