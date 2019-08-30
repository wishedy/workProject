<template>
    <vue-data-loading :loading="loading"
                      :completed="completed"
                      :listens="['infinite-scroll']"
                      @infinite-scroll="infiniteScroll"
                      :distance="distanceNum">
    <div class="course-section-communication" style="" :class="{'no-chatData':parseInt(totalCount,10)===0}">
        <h1 class="title">交流<em v-text="totalCount" v-if="totalCount"></em></h1>
        <section>
            <section v-for="(item,index) in contentList" :key="index">
                <div style="position:relative" v-show="!isEmptyObject(item)" class="al-chat-item">
                    <em :style="{background: 'url('+checkLogo(item.logoUrl)+') no-repeat center center',backgroundSize:'cover'}" @click.stop="jumpPersonal(item.customerId)" :class="{'vipUser':parseInt(teacherInfo.vipState,10)===1}"></em>
                    <p class="chat-item-one">
                        <span class="communication-person" v-text="getStrLen(item.username,10)" @click.stop="jumpPersonal(item.customerId)"></span>
                        <span class="communication-level" :class="{'communication-level-one':(parseInt(item.authState)===2)||(parseInt(item.authState)===7)||(parseInt(item.authState)===9),'communication-level-two':(parseInt(item.authState)===8)}" @click.stop="jumpPersonal(item.customerId)"></span>
                        <span class="communication-title"  v-show="parseInt(item.teacherInfo.teacher)" >讲师</span>
                        <span class="communication-num"  v-show="parseInt(item.teacherInfo.studentNum)"  v-text="'NO.'+item.teacherInfo.studentNum"></span>
                        <!--<i class="communication-time">{{item.publishTime}}</i>-->
                    </p>
                    <p class="person-remark">
                        <span v-text="item.medicalTitle"></span>
                        <span v-text="item.company"></span>
                    </p>
                    <div class="reply-content">
                        {{ parseInt(item.parentId,10)!==0?'回复'+item.refUsername:''}}{{item.reviewContent}}
                        <div class="pic-container">
                            <ul v-show="item.videoIsExist?item.imgsArr.length>0:item.imgsArr.length>1">
                                <li  v-for="(innerItem,innerIndex) in item.imgsArr.length>8?item.imgsArr.slice(0,8):item.imgsArr" :key="innerIndex" :style="{background: 'url('+(innerItem.attUrl)+') no-repeat center center',backgroundSize:'cover'}" >
                                </li>
                                <li :style="{background: 'url('+(item.videoLogoUrl)+') no-repeat center center',backgroundSize:'cover'}" v-if="item.videoIsExist">
                                    <i></i>
                                </li>
                                <li class="pic-last" v-if="item.videoIsExist?item.imgsArr.length>7:item.imgsArr.length>8">查看更多</li>
                            </ul>
                            <p class="pic-onlyOne"  :style="{background:'url('+checkOnlyOnAtt(item)+') no-repeat center center/cover'}" v-show="item.videoIsExist?item.imgsArr.length===0:item.imgsArr.length===1" @click.stop="getCouponEvent">
                                <i v-show="item.videoIsExist"></i>
                            </p>
                            <p class="pic-remark" v-show="item.refQuoteName" @click.stop="getCouponEvent">
                                <i class="pic-remark-icon"></i>
                                引用{{typeConvertWord(item.refQuoteType)}}《{{item.refQuoteName}}》
                            </p>
                        </div>

                    </div>
                    <div v-show="item.childrenList.length">
                        <p class="auth-reply" v-for="(replyItem,replyIndex) in item.childrenList" :key="replyIndex">
                            <!--<span class="first-auth">{{replyItem.username}}：</span>
                            {{replyItem.reviewContent}}-->
                            <span class="fans-reply">
                    <span class="fans" @click.stop="jumpPersonal(replyItem.customerId)">{{replyItem.username}}</span>
                    <span class="reply" v-if="(replyItem.parentCustomerId)&&(replyItem.parentCustomerId!=item.customerId)">回复</span>
                    <span class="auth" v-if="replyItem.parentCustomerId&&replyItem.parentCustomerName&&(replyItem.parentCustomerId!=item.customerId)" v-text="replyItem.parentCustomerName"  @click.stop="jumpPersonal(replyItem.parentCustomerId)"></span>
                :{{replyItem.reviewContent}}
                </span>
                            <span @click.stop="checkMoreReply()" class="reply-count" style="display: none">
                    共<i class="counts">{{item.childrenCount}}</i>条回复
                    <i class="reply-arrow"></i>
                </span>
                            <span class="reference-container" v-if="replyItem.imgIsExist||replyItem.videoIsExist||replyItem.quoteIsExist">
                    <span class="shadow" v-show="replyItem.imgIsExist||replyItem.videoIsExist"  @click.stop="getCouponEvent">
                    查看影像
                    <i></i>
                </span>
                    <span class="reference" v-show="replyItem.quoteIsExist" @click.stop="getCouponEvent">
                    查看引用
                    <i></i>
                </span>
                </span>
                        </p>
                        <p class="reply-count-bottom" @click.stop="checkMoreReply()">
                            共<i class="counts">{{item.childrenCount}}</i>条回复
                            <i class="reply-arrow"></i>
                        </p>
                        <p class="foot-reply">
                            <span v-show="parseInt(item.teacherInfo.teacherReply)" @click.stop="getCouponEvent">讲师回复了此发言</span>
                        </p>
                    </div>
                </div>
            </section>
        </section>
        <div class="no-data" v-show="parseInt(totalCount,10)===0"><p></p>
            <p>暂无交流</p></div>
    </div>
    </vue-data-loading>
</template>
<script>
    const xhrUrl = {
        chatList:'/mcall/customer/review/json_list_v5/'
    };
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import TempCache from "static/js/tempcache";
    import app from 'static/js/comm.app';
    import formatData from '../untils/formatData';
    import {mapActions} from 'vuex';
    export default {
        data(){
            let cid = TempCache.getItem('userId');
            let courseId = (comm.getparaNew().courseId+'').replace(/[^0-9]/ig,"");
            return {
                customerId: cid,
                courseId: courseId||19,
                totalCount:0,
                pageIndex: 0,
                pageSize: 20,
                distanceNum:20,
                contentList:[],
                loading:false,
                completed:false
            }
        },
        components:{
            VueDataLoading
        },
        mounted(){
          const _this = this;
          _this.getChatList();
        },
        watch:{
            totalCount(n){
                const _this = this;
                _this.setTotal(n);
            }
        },
            methods:{
                ...mapActions(['setTotal']),
                getStrLen(str,num){
                    return comm.getStrLen(str,num);
                },
                checkMoreReply(item){
                    let _this = this;
                    let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${_this.courseId}}`;
                    let iosParam = `scene=3&type=101&tplPath=0&keyword=${_this.courseId}`;
                    $(".al-appWakeUpFigure").remove();
                    let callAppOptions = {
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                        ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                        android: "allin://com.allin.social:75235?data=" + androidParam
                    };
                    app.newReleaseBox({
                        imgPath:"//img50.allinmd.cn/case/release.png",
                        title:"查看更多交流需使用唯医骨科App",
                        solidBtnTitile:"立即使用",
                        authNoneTitle:" ",
                        data:callAppOptions
                    });
                },
                getCouponEvent(){
                    let _this = this;
                    let androidParam = `{scene:3,type:101,tplPath:0,sourceId:${_this.courseId}}`;
                    let iosParam = `scene=3&type=101&tplPath=0&keyword=${_this.courseId}`;
                    $(".al-appWakeUpFigure").remove();
                    let callAppOptions = {
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                        ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                        android: "allin://com.allin.social:75235?data=" + androidParam
                    };
                    app.newReleaseBox({
                        imgPath:"//img50.allinmd.cn/case/release.png",
                        title:"获取优惠券需使用唯医骨科App",
                        solidBtnTitile:"立即使用",
                        authNoneTitle:" ",
                        data:callAppOptions
                    });
                },
                jumpPersonal(customerId){
                    let _this = this;
                    let cid = TempCache.getItem('userId');
                    if(parseInt(cid,10)===0){
                        return false;
                    }else{
                        if(parseInt(cid,10)===parseInt(customerId,10)){
                            g_sps.jump(null,`//m.allinmd.cn/dist/personal/personal_index.html`);
                        }else{
                            g_sps.jump(null,`//m.allinmd.cn/dist/personal/others_index.html?cid=${_this.item.customerId}`);
                        }
                    }
                },
                checkLogo(logoUrl){
                    let _this = this;
                    return _this.checkInvalid(logoUrl)?'//img00.allinmd.cn/default-user/new_default.jpg':logoUrl;
                },
                checkOnlyOnAtt(item){
                    if(item.videoIsExist){
                        return item.videoLogoUrl;
                    }else{
                        if(item.imgsArr&&item.imgsArr.length){
                            return item.imgsArr[0].attUrl;
                        }else{
                            return   '' ;
                        }
                    }
                },
                typeConvertWord: function(type,tpl_Path){ //kv
                    if(typeof type != "number"){
                        if(type.parentId==0){
                            type= parseInt(type.reviewType);
                        }else{
                            type= 8;
                        }
                    }
                    var word= '';
                    switch(type){
                        case 1: word= '视频'; break;
                        case 2:
                            if(tpl_Path==286){
                                word= '书籍';
                            }else if(tpl_Path==287){
                                word= '文章';
                            }else{
                                word= '文库';
                            }

                            break;
                        case 4: word= '话题'; break;
                        case 7: word= '病例'; break;
                        case 8: word= '评论'; break;
                        case 17:word = "书籍";break;
                        case 18:word ='文章';break;
                        case 19:word ="电子书视频";break;
                        default:
                    }
                    return word;
                },
                checkInvalid(str){
                    return comm.checkInvalid(str);
                },
                isEmptyObject(obj){
                    return comm.isEmptyObject(obj);
                },
                unique(original) {
                    let arr = JSON.parse(JSON.stringify(original));
                    console.log(arr);
                    if (!Array.isArray(arr)) {
                        //console.log('type error!');
                        return
                    }
                    let arrry = [];
                    let obj = {};
                    for (let i = 0; i < arr.length; i++) {
                        if (!obj[arr[i].id]) {
                            arrry.push(arr[i]);
                            obj[arr[i].id] = 1
                        } else {
                            obj[arr[i].id]++
                        }
                    }

                    return arrry;
                },
                "infiniteScroll"() {
                    const _this = this;
                    setTimeout(() => {
                        console.log(_this.contentList.length+"<"+_this.totalCount);
                        if(!_this.completed){
                            console.log('从这里触发');
                            _this.getChatList();
                        }else
                        {
                            return  false;
                        }
                    }, 2000)
                },
                getChatList(){
                    const _this = this;
                    _this.loading = true;
                    axios.get(xhrUrl.chatList, {
                        params: {
                            firstResult: _this.pageIndex * _this.pageSize,
                            maxResult: _this.pageSize,
                            sortType: 1,
                            reviewStatus: 1,
                            attUseFlag: 3,
                            logoUseFlag: 3,
                            dataFlag: 1,
                            scene: 2,
                            reviewType: 24,//付费课
                            isDeleteShow: 1,
                            refId: _this.courseId,
                            isTotalCount: 1
                        }
                    }).then(function (res) {
                        _this.loading = false;
                        let obj = {
                            res,
                            data: res.data,
                            responseObject: res.data.responseObject,
                            responseData: res.data.responseObject.responseData,
                            dataList: res.data.responseObject.responseData.dataList,
                            dataLen: res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList?res.data.responseObject.responseData.dataList.length:0,
                            totalCount: res.data.responseObject.responseData.totalCount
                        };
                        if (obj.res && obj.data && obj.responseObject && obj.responseData && obj.dataList&&obj.dataList.length) {
                            _this.totalCount = obj.responseData.totalCount;
                            let chatList = obj.dataList;
                            for (let num = 0; num < chatList.length; num++) {
                                let dataItem = formatData.formatChatData(chatList[num]);
                                dataItem.childrenList = formatData.formatChildrenData(dataItem);
                                _this.contentList.push(dataItem);
                            }
                            console.log('逻辑到这里');
                            _this.contentList = _this.unique(_this.contentList);
                            console.log(_this.contentList,_this.totalCount);
                            if(_this.contentList.length===parseInt(_this.totalCount,10)){
                                //数据加载完毕
                                _this.completed = true;
                            }else{
                                //数据没有加载完毕
                                _this.completed = false;
                                _this.pageIndex++;
                            }
                        }else{
                            _this.completed = true;
                        }

                    }).catch(function (error) {

                        //console.log(error);
                    });
                }
            }
    }
</script>
