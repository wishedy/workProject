<template>
    <section class="al-coupon" v-if="couponOnOff">
        <span class="coupon-des" v-text="couponInfo.displayName"></span>
        <span class="get-coupon" :class="{'have-coupon':parseInt(couponInfo.applyStatus,10)}" @click.stop="getCoupon" v-text="parseInt(couponInfo.applyStatus,10)?'已领取':'领取'"></span>
    </section>
</template>
<script>
    const xhrUrl  = {
        coupon:'/allingateway/base-shopping-platform/coupon/getOneCoupon'
    };
    import comm from 'static/js/comm.js';
    import {mapGetters,mapActions} from 'vuex';
    import axios from 'axios';
    import user from 'static/js/module.user.js';
    export default {
        data(){
            let customerId = comm.checkInvalid(TempCache.getItem("userId"))?'':TempCache.getItem("userId");
            let courseId = comm.getparaNew().courseId;
          return {
              customerId:customerId,
              courseId:courseId
          }
        },
        computed:{
            ...mapGetters(['couponInfo']),
            couponOnOff(){
                const _this = this;
                return (!_this.isEmptyObject(_this.couponInfo))&&(!_this.checkInvalid(_this.couponInfo.displayName));
            }
        },
        methods:{
            ...mapActions(['changeCouponStatus']),
            getCoupon(){
                const _this = this;
                if(!_this.couponInfo.applyStatus){
                    var param = `name$${_this.courseId}`;
                    comm.creatEvent({
                        triggerType:"课程详情页",
                        keyword:'领取优惠券',
                        browType:415,
                        actionId:11754,
                        param:param
                    });
                    user.privExecute({
                        operateType: 'auth',
                        callback: function () {
                            axios.get(xhrUrl.coupon, {
                                params: {
                                    queryJson: (
                                        $.toJSON({
                                             customerId: _this.customerId,
                                            //customerId: '1554110996378',
                                            productId: _this.courseId,
                                            couponBatchId:_this.couponInfo.couponBatchId,
                                            productType:_this.couponInfo.productType
                                        })
                                    )
                                }
                            }).then(function (res) {
                                if(res&&res.data&&res.data.responseStatus){
                                    if(res.data.responseData.couponId){
                                        popup("领取成功");
                                        _this.changeCouponStatus(1);
                                    }
                                }else{

                                }

                            }).catch(function (error) {
                                //console.log(error);
                            });
                        }
                    });
                }
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            checkInvalid(str){
                return comm.checkInvalid(str);
            }
        }
    }
</script>
