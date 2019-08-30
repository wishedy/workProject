<template>
    <section class="al-courseList">
        <h1 class="title">课程记录</h1>
        <section>
            <ul>
                <li v-for="(item,index) in relatedContent" :key="index+'test'">
                    <a :href="checkInvalid(item.webStoragePath)?'javascript:void(0)':item.webStoragePath" @click.mounsedown="logEvent">
                        <p>{{item.videoName}}</p>
                        <div class="foot-list">
                            <span class="checkAuth">{{getStrLen(item.videoAuthor,10)}}</span>
                            <span class="checkNum">{{item.playNum}}浏览</span>
                            <i class="noPay" v-if="parseInt(item.payType,10)===1">免费</i>
                        </div>
                        <div class="course-replying">
                            <em class="icon"></em>
                            观看
                        </div>

                    </a>
                </li>
            </ul>
            <section class="more" v-if="loadEnd&&relatedContent.length!=totalNum">
                <i class="icon"></i>
                <div class="des">更多精彩课程正在加紧打磨</div>
            </section>
        </section>
    </section>
</template>
<script>
    import user from 'static/js/module.user.js';
    const xhrUrl = {
        videoList: "/allingateway/base-resource-platform/college/course/getCourseDetail",
        coupon: '/mcall/coupon/getMaxReceivableCoupon/'
    };
    import {mapActions,mapGetters} from 'vuex';
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import TempCache from "static/js/tempcache";

    export default {
        data() {
            let cid = TempCache.getItem('userId');
            let courseId = comm.getparaNew().courseId;
            return {
                cid: cid,
                courseId: courseId,
                relatedContent: [],
                loadEnd: false,
                imageUrl: '',
                courseName: "",
                teacherName: "",
                appCoverPicUrl: "",
                coursePrice: "",
                courseDesc: "",
                payState: "",
                courseNum: "",
                totalNum: "",
                loading:false
            }
        },
        computed:{
          ...mapGetters(['courseData'])
        },
        methods: {
            ...mapActions(["saveCoupon",'setCourseTotal','setCourseNum','setCourseName','setCourseCover','saveCourseData']),
            checkInvalid(str) {
                return comm.checkInvalid(str);
            },
            getStrLen(str, num) {
                if(comm.checkInvalid(str)){
                    return  "";
                }else{
                    return comm.getStrLen(str, num);
                }
            },
            logEvent(){
              const _this = this;
              console.log("点击视频");
                comm.creatEvent({
                    triggerType:"课程详情页",
                    keyword:'视频点击',
                    browType:415,
                    actionId:11758,
                    refId:_this.courseId
                });
            },
            getCoupon() {
                let _this = this;
                axios.get(xhrUrl.coupon, {
                    params: {
                        paramJson: (
                            $.toJSON({
                                // customerId: _this.customerId,
                                 customerId: _this.cid,
                                // productId: _this.courseId
                                 productId: _this.courseId,
                                productType:_this.courseData.productType
                            })
                        )
                    }
                }).then(function (res) {
                    let data = res.data;
                    if (data && data.responseObject && data.responseObject.responseData) {
                        _this.saveCoupon(data.responseObject.responseData);
                    }
                }).catch(function (error) {
                    //console.log(error);
                });
            },
            getCourseList() {
                //获取课程列表
                let _this = this;
                _this.loading = true;
                axios.get(xhrUrl.videoList, {
                    params: {
                        customerId: _this.cid,
                        //customerId: '1477540724325',
                        courseId: _this.courseId
                        //courseId:1
                    }
                }).then(function (res) {
                    //console.log('课程视频列表', res);
                    let obj = {
                        res,
                        data: res.data,
                        responseData: res.data.responseData,
                        dataList: res.data.responseData.dataList,
                        dataLen: res.data.responseData.dataList.length,
                        totalCount: res.data.responseData.totalCount
                    };
                    _this.loadEnd = true;
                    _this.imageUrl = obj.responseData.appBannerUrl;
                    _this.setCourseCover(_this.imageUrl);
                    _this.courseName = (obj.responseData.courseName);
                    _this.setCourseName(_this.courseName);
                    _this.teacherName = (obj.responseData.teacherName);
                    _this.appCoverPicUrl = (obj.responseData.appCoverPicUrl);
                    _this.coursePrice = (obj.responseData.coursePrice);
                    _this.courseDesc = (obj.responseData.courseDesc);
                    _this.payState = obj.responseData.payState;
                    _this.courseNum = obj.responseData.newestNum;
                    _this.totalNum = obj.responseData.totalNum;
                    _this.saveCourseData(res.data.responseData);
                    _this.setCourseTotal(_this.totalNum);
                    // _this.share();
                    if (parseInt(_this.payState, 10) === 0) {
                        _this.getCoupon();
                    }
                    if (obj.res && obj.data&&obj.responseData && obj.dataList && obj.dataLen) {
                        _this.relatedContent = obj.dataList;
                    }
                    console.log(_this.relatedContent);
                    _this.setCourseNum(_this.relatedContent.length);



                }).catch(function (error) {
                    //console.log(error);
                });
            }
        },
        mounted() {
            const _this = this;
            user.privExecute({//web跳转登录页面
                operateType: 'login',
                callback: function () {
                    _this.getCourseList();
                }
            });
        }
    }
</script>
