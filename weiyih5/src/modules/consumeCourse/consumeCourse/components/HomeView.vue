<template>
    <section class="al-home-view">
        <TopHandleBar :style="{'visibility':index>-1?'visible':'hidden'}" :tabIndex="index"></TopHandleBar>
        <Banner :style="{'visibility':index>-1?'hidden':'visible'}"></Banner>
        <Coupon v-if="payStateOnOff"></Coupon>
        <TabBar :style="{'visibility':index>-1?'hidden':'visible'}" :tabIndex="index" class="al-original-tab"></TabBar>
        <Introduction></Introduction>
        <CourseList></CourseList>
        <ChatList></ChatList>
        <BuyVip></BuyVip>
        <RightDialog v-if="rightOnOff" @closeBack="closeDialog" :rightName="rightName"></RightDialog>
        <Popups v-if="showSuccess" @close="closeMask" :productType="courseData.productType" :productId="courseData.productId"></Popups>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache";
    import Banner from './BannerContent';
    import TopHandleBar from './TopHandleBar';
    import Coupon from './Coupon';
    import TabBar from './TabBar';
    import Introduction from './Introduction';
    import comm from 'static/js/comm.js';
    import CourseList from './CourseList';
    import ChatList from './ChatList';
    import BuyVip from './BuyVip';
    import {mapActions,mapGetters} from 'vuex';
    import RightDialog from "components/RightDialog/RightDialog.vue";
    import Popups from "components/Popups/Popups.vue";
    const $ = require("jquery");
    export default {
        components:{
            Banner,
            TabBar,
            Introduction,
            CourseList,
            ChatList,
            TopHandleBar,
            Coupon,
            BuyVip,
            RightDialog,
            Popups
        },
        data(){
            let courseId = comm.getparaNew().courseId;
          return {
              courseId:courseId,
              scrollTop:0,
              index:-1,
              buySuccessDialog:false,
              rightName:""
          }
        },
        mounted(){
            const _this = this;
            _this.listenScroll();
            _this.index = _this.activeIndex;
            setTimeout(()=>{
                _this.share();
            },2000);
            console.log(_this.payStateOnOff);
        },
        watch:{
            scrollTop(){
                const _this = this;
                _this.index = _this.activeIndex;
            },
            courseData(n){
              const _this = this;
              if(!_this.isEmptyObject(n)){
                  _this.rightName  =  n.departmentName;
                  if(localStorage.getItem("isShowVipPopup"+n.productId)){
                      localStorage.removeItem("isShowVipPopup"+n.productId);
                      _this.buySuccessDialog = true;
                  }else{
                      _this.buySuccessDialog = false;
                  }

              }
            },
            tabActiveIndex(n){
                const introduceTop = $('.al-original-tab').offset().top;
                const courseTop = $('.al-courseList').offset().top-$(".al-topHandleBar").height();
                const communicationTop = $('.course-section-communication').offset().top-$(".al-topHandleBar").height();
                const element = $('html,body');
                switch (parseInt(n,10)) {
                    case 0:
                        element.animate({scrollTop: introduceTop}, 300);
                        break;
                    case 1:
                        element.animate({scrollTop: courseTop+2}, 300);
                        break;
                    case 2:
                        element.animate({scrollTop: communicationTop+2}, 300);
                        break;
                }
            }
        },
        computed:{
            ...mapGetters(['tabActiveIndex','courseData','courseName','rightOnOff']),
            showSuccess(){
                const _this = this;
              return  (!_this.isEmptyObject(_this.courseData))&&_this.buySuccessDialog;
            },
            payStateOnOff(){
                const _this = this;
                console.log(_this.courseData,_this.courseData.payState);
                return (!_this.isEmptyObject(_this.courseData))&&(parseInt(_this.courseData.payState,10)===0);
            },
          activeIndex(){
              const _this = this;
              const introduceTop = $('.al-original-tab').offset().top;
              const courseTop = $('.al-courseList').offset().top-$(".al-topHandleBar").height();
              const communicationTop = $('.course-section-communication').offset().top-$(".al-topHandleBar").height();
              if(_this.scrollTop>introduceTop){
                  if(_this.scrollTop>courseTop){
                      if(_this.scrollTop>communicationTop){
                          return  2;
                      }else{
                          return  1;
                      }
                  }else{
                      return  0;
                  }
              }else{
                 return -1;
              }
          }
        },
        methods:{
            ...mapActions(['changeActiveIndex','setRightOnOff']),
            closeMask(){
              window.location.reload();
            },
            closeDialog(){
                const _this = this;
                _this.setRightOnOff(false);
            },
            createShareData() {
                let t = this;
                let json = {};
                json = {
                    sceneType: '99',
                    customerId: TempCache.getItem('userId') || '',
                    courseName: t.courseName,
                    teacherName: t.courseData.teacherName,
                    appCoverPicUrl: t.courseData.appCoverPicUrl,
                    courseId: (t.courseId+'')
                };
                return json;
            },
            share() {
                let t = this;
                let shareObj = {};
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 4,
                            shareContent: shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 1,
                                shareContent: shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 3,
                                shareContent: shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest: function () {
                        $.ajax({
                            url: "/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.createShareData())
                            },
                            type: "post",
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                if (comm.hasResponseData(data)) {
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        url:'',
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
                                    $(sList).each(function (index, element) {
                                        if (element.shareChannel === 'QZone') {
                                            shareObj.title = element.shareTitle;
                                            shareObj.summary = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'Sina') {
                                            shareObj.sinaTitle = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatFriend') {
                                            shareObj.wxTitle = element.shareTitle;
                                            shareObj.wxDesc = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatTimeline') {
                                            shareObj.timeLineTitle = element.shareTitle;
                                        }

                                    });

                                }
                            }
                        });
                        return shareObj;
                    }
                }, false, $('.al-share'));
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            listenScroll(){
                const _this = this;
                window.addEventListener('scroll',function(){
                    _this.scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                },false);
            }
        }
    }
</script>
