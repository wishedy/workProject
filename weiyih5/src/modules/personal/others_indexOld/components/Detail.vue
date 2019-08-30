<template>
    <header class="al-personalHead" data-alcode-mod="561" id="al-personalHead">
        <p class="al-othersSnsBar">
            <span class="al-personalLike" id="ev-praise" @click="addPraise"><i class="icon-othersLike"></i><span class="ev-upNum">{{item.upNum}}</span></span>
            <span class="al-personalShare" v-show="item.isSuccess"><i class="icon-shareWhite"></i>分享</span>
        </p>
        <a href="javascript:history.back(-1);" class="al-othersBackToIndex"><i class="icon-othersToIndex"></i></a>
        <article class="al-personalBasicMsg">
            <figure class="al-personalImg" @click="bigLogo">
                <a href="javascript:void(0)" class="ev-logoUrl">
                    <img :src="item.attrUrl">
                </a>
            </figure>
            <figcaption class="al-personalBasicMsgContent">
                <h2 :class="item.isSuccess? 'al-vipUser':''"><span class="ev-name">{{item.name}}</span></h2>
                <article class="al-personalJobMsg ev-companymedical">
                    <button class="btn-deepMsg" v-if="item.msg">{{item.msg}}</button>
                    <button class="btn-deepMsg" v-if="item.work">{{item.work}}</button>
                </article>
                <ul class="ev-noAuth">
                    <li class="al-personalSnsNum"><a :href="'./sns.html?cid='+cid+'&action=fans'" class="ev-fansUrl">粉丝<span class="ev-fansNum">{{item.fansNum}}</span></a></li>
                    <li class="al-personalSnsNum"><a :href="'./sns.html?cid='+cid+'&action=follow'" class="ev-followUrl">关注<span class="ev-followNum">{{item.followpeopleNum}}</span></a></li>
                    <li class="al-personalSnsNum"><a :href="'./others_collection.html?cid='+cid" class="ev-collectUrl">收藏<span class="ev-collectionNum">{{item.collectionNum}}</span></a></li>
                </ul>
            </figcaption>
        </article>
        <button class="al-personalGoLogined al-whiteBtn" @click="follow">
            <span class="ev-followBtn" :class="state(item.followState)">{{item.followState | isFollow}}</span>
        </button>
        <section class="al-personalHeadImgWatcher" :class="{show:flagShow}" @click="onOff">
            <figure>
                <img class="ev-bigLogo" :src="url" alt="">
            </figure>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </header>
</template>

<script>
    import axios from "axios";
    import Loading from "components/Loading/Loading";
    import comm from "static/js/comm";
    import {mapActions} from "vuex";
    import user from "static/js/module.user";
    const path = {
        info:'/mcall/customer/unite/getMapById/',
        biglogo:'/mcall/comm/data/logourl/getMapById/',
        followed:'/mcall/customer/follow/people/create/',
        noFollow:'/mcall/customer/follow/people/delete/',
        praise:'/mcall/customer/prefer/create/',
        cancelPraise:'/mcall/customer/prefer/delete/'
    };
    export default {
        data(){
            return {
                item:{
                    followState:1
                },
                url:'',
                flag:true,
                flagShow:false,
                ajaxing:false,
                type:{},
                cid:this.$store.state.otherId,
                shareParams: {
                    "customerId":this.$store.state.otherId,
                    "logoUseFlag":4,
                    "pageIndex":1,
                    "pageSize":1,
                    "useFlag":1,
                    "sceneType":20,
                    "resourceType":9
                },
                noBigLogo:false
            }
        },
        mounted(){
            this.initDetail();
            let cid = this.$store.state.otherId;
            let uid = this.$store.state.customerId;
            let isSelf = false;
            /*if (cid === uid || location.pathname === "/dist/personal/personal_active.html") {
                isSelf = true;
                if (location.pathname !== "/dist/personal/personal_active.html") {
                    g_sps.jump(null,"/dist/personal/personal_active.html");
                }
            }*/
            this.share();
            //未登录
            if (isSelf && !uid) {
                $('.ev-list').append(module.listTemplate.notLoginTemplate());
            }
            let t=this;
            window.addEventListener('hashchange',function(){
            	t.share();
            });
        },
        methods:{
            initDetail(){
                const t = this;
                t.ajaxing = true;
                axios({
                    url: path.info,
                    method: "POST",
                    data:{
                        "customerId":t.$store.state.otherId,
                        "logoUseFlag":4
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        if(dataList.length>0){
                            let heig = document.getElementById('al-personalHead').clientHeight;
                            t.$emit('detail',heig);
                            let auth = dataList[0].customer_auth;
                            let info = dataList[0].customer_baseinfo;
                            let unit = dataList[0].customer_unite;
                            let follow= dataList[0].customer_follow_people;
                            let csc= dataList[0].customer_statistic;
                            let prefer= dataList[0].customer_prefer;
                            let url ='';
                            if(!dataList[0].customer_att.logoUrl){
                                url = '//img50.allinmd.cn/pages/personal/no_head.png';
                            }else{
                                url = dataList[0].customer_att.logoUrl;
                            }
                            let nickname = auth.lastName+auth.firstName||info.nickname;
                            if(nickname ==="") {
                                nickname = comm.getRegisterName(unit.email,unit.mobile);
                            }

                            if(auth.state==-1 || auth.state == 3 || auth.state ==0 || auth.state ==1){
                                t.item = {
                                    attrUrl:url,
                                    name:nickname,
                                    msg:'用户尚未认证',
                                    isSuccess:false
                                }
                            }else{
                                let medicalTitleHtml="",companyHtml="";
                                if(auth.medicalTitleShow){
                                    medicalTitleHtml=auth.medicalTitleShow;
                                }
                                if(auth.workplace){
                                    companyHtml=auth.workplace;
                                }
                                t.item = {
                                    attrUrl:url,
                                    name:nickname,
                                    msg:medicalTitleHtml,
                                    work:companyHtml,
                                    isSuccess:true
                                }
                            }
                            t.item.fansNum = csc.fansNum;
                            t.item.followpeopleNum = csc.followpeopleNum;
                            t.item.upNum = csc.othersUpNum;
                            t.item.collectionNum =csc.collectionNum;
                            t.item.followState = follow.relationship;
                            t.item.state = auth.state;
                            t.item.isValid = prefer.isValid;
                            if(prefer.isValid && csc.othersUpNum==0){//如果自己已点赞，但点赞数为0，置为1
								t.item.upNum = 1;
                            }
//                            this.status = true;
                            t.item.sexId =info.sexId;
                            t.item.birthday = auth.birthYear|| info.birthday;
                            t.item.medical = auth.medicalTitle;
                            t.item.company = auth.workplace;
                            if(auth.clinicalTime&&auth.clinicalTime!=0){
                                this.item.time = '临床时间'+auth.clinicalTime+'年';
                            }
                            t.item.tag = auth.areasExpertise.split(",");
                            t.item.summary = info.summary;
                            t.information(t.item);
                            t.type = {
                                videoNum:csc.videoNum,
                                docNum:csc.docNum,
                                topicNum:csc.topicNum,
                                caseNum:csc.caseNum
                            };
                            t.types(t.type);
                            document.title = '［'+nickname+'］的学术专栏－唯医,allinmd';
                            $('[name=description]').attr('content','［'+nickname+'］的学术专栏－唯医,allinmd');
                            $('[name=keywords]').attr('content','［'+nickname+'］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd');
                        }
                    }
                })
            },
            //查看大头像
            bigLogo(){
                const t = this;
                if(t.noBigLogo){//没有大图，不再做多次请求
                	return false;
                }
                if(this.flag){
                    t.ajaxing = true;
                    axios({
                        url: path.biglogo,
                        method: "POST",
                        data:{
                            refId:t.$store.state.otherId,
                            logoType:10,
                            logoUseFlag:2,
                            visitSiteId:2,
                        },
                        transformRequest: [data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(res=>{
                        t.ajaxing = false;
                        if(comm.hasResponseData(res.data)){
                            t.url = res.data.responseObject.responseData.data_list[res.data.responseObject.responseData.data_list.length-1].logoUrl;
                            t.flagShow = true;
                        }else{
                        	t.noBigLogo = true;
                        }
                    })
                }else{
                    t.flagShow = true;
                }
            },
            onOff(){
                if(this.flag){
                    this.flagShow = false;
                    this.flag = false;
                }else{
                    this.flagShow = false;
                }
            },
            state(s){
                let str = '';
                switch(parseInt(s)){
                    case 2:
                        str = 'icon-othersFollowed';break;
                    case 4:
                        str = '';break;
                    default:
                        str = 'icon-othersFollow';break;
                }
                return str;
            },
            //关注功能
            follow(id){
                let t = this;
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        if(t.item.followState!=2 && t.item.followState!=4){
                            t.ajaxing = true;
                            axios({
                                url:path.followed,
                                method:"POST",
                                data:{
                                    "dataFlag":2,
                                    "refId":t.$store.state.otherId
                                },
                                transformRequest: [data=>{
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res=>{
                                t.ajaxing = false;
                                if(res.data.responseObject.responseStatus == true){
                                    t.item.followState = 2;
                                }
                            })
                        }else{
                            t.change(true);
                        }
                    }
                });
            },
            //左上角点赞
            addPraise(){
                let t = this;
                let state = t.item.state;
                if(state==2||state==7||state==8||state==9){
                    //判断是否赞过，未赞过 则赞
                    if(this.item.isValid!=1){ //未赞过发送赞请求并＋1
                        t.ajaxing = true;
                        axios({
                            url:path.praise,
                            method:'POST',
                            data:{
                                "customerId": t.$store.state.customerId,
                                "usefulType":9,
                                "upDownType":1,
                                "refId": t.$store.state.otherId
                            },
                            transformRequest: [data=>{
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(res=>{
                            t.ajaxing = false;
                            if(res.data.responseObject.responseStatus){
                                t.item.upNum++;
                                t.item.isValid = 1;
                            }
                        });
                    }else{ //赞过取消点赞
                        t.ajaxing = true;
                        axios({
                            url:path.cancelPraise,
                            method:'POST',
                            data:{
                                "customerId": comm.getparaNew().cid&&comm.getparaNew().cid.replace(/"/g,""),
                                "usefulType":9,
                                "upDownType":1,
                                "refId": t.$store.state.customerId
                            },
                            transformRequest: [data=>{
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(res=>{
                            t.ajaxing = false;
                            if(res.data.responseObject.responseStatus){
                                t.item.upNum = t.item.upNum-1>0 ? t.item.upNum-1 : 0;
                                t.item.isValid = 0;
                            }
                        });
                    }
                }else{
                    user.privExecute({
                        operateType:'auth',
                        callback:function(){},
                        noNeedBack:true
                    });
                }
            },
            share(){
                let t = this;
                let shareObj ={};
				let url="";
				if(location.hash.indexOf('dynamic')>-1){
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/dynamic';
				}else if(location.hash.indexOf('baseInfo')>-1){
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/baseInfo';
				}else{
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/contribution';
				}
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:"",
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
                    triggerRequest:function(){
                        $.ajax({
                            url:"/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.shareParams)
                            },
                            async:false,
                            dataType:"json",
                            success:function(data){
                                if(comm.hasResponseData(data)){
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    shareObj.url = url;
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
                }, false, $('.al-personalShare'));
            },
            ...mapActions(["change","changeEn","information","types"]),
        },
        components:{
            Loading
        },
        filters:{
            isFollow:function(v){
                let str = '';
                switch(parseInt(v)){
                    case 2:
                        str = '已关注';break;
                    case 4:
                        str = '互相关注';break;
                    default:
                        str = '关注';break;
                }
                return str;
            }
        },
        watch:{
            "$store.state.isEnsure"(){
                if(this.$store.state.isEnsure){
                    this.ajaxing = true;
                    axios({
                        url:path.noFollow,
                        method:"POST",
                        data:{
                            "dataFlag":2,
                            "refId":this.$store.state.otherId
                        },
                        transformRequest:[data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers:{
                            'X-Request-Width':'XMLHttpRequest'
                        },
                        timeout:30000
                    }).then(res=>{
                        this.ajaxing = false;
                        if (res && res.data.responseObject && res.data.responseObject.responseStatus) {
                            this.item.followState = 1;
                        }
                        this.changeEn(false);
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>