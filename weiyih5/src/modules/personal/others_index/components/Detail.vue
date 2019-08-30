<template>
   <section>
       <header class="al-personalHead homePersonCon al-personalHome" data-alcode-mod='561' id="al-personalHead">
           <section class="personFixed">
               <a class="ev_backBtn fixedBack" href="javascript:history.back(-1);" @click="hisBack">
                   <img src="/static/images/personal/return-White.png" alt="">
               </a>
               <span class="al-personalShare icon-shareWhite" v-show="item.isSuccess"></span>
           </section>
           <article class="al-personalBasicMsg">
               <figure class="al-personalImg ev-hasLogin" @click="isBigImg=true;">
                   <a href="javascript:;" class="ev-logoUrl">
                       <img :src="item.attrUrl">
                   </a>
               </figure>
               <figcaption class="al-personalBasicMsgContent ev-hasLogin">
                   <h2 :class="vipClass" class="doctorAuthor"><span class="ev-name doctorName" v-show="item.name">{{item.name}}</span></h2>
                   <div class="doctorDesc">
                       <p class="doctorMedical" v-if="item.msg">{{item.msg}}</p>
                       <p class="doctorHos" v-if="item.work">{{item.work}}</p>
                   </div>
               </figcaption>
               <button class="perBotton"  @click="follow" :class="state(item.followState)">{{item.followState | isFollow}}</button>
           </article>
           <ul class="ev-hasAuth al-personalSnsNumCon">
               <li class="al-personalSnsNum grandNum" v-if="item.customer_resource_browse>12000"><a href="javascript:;"><p class="ev-fansNum" :num="item.customer_resource_browse">{{item.customer_resource_browse}}</p><p class="numName">累计浏览</p></a></li>
               <li class="al-personalSnsNum"  :class="{'noGrandNum':item.customer_resource_browse<12000}" @click="commCreatEvent({id:11245})"><a href="javascript:;" @click="login('./sns.html?cid='+cid+'&action=fans')"><p class="ev-fansNum" :num="item.fansNum">{{item.fansNum}}</p><p class="numName">粉丝</p></a></li>
               <li class="al-personalSnsNum"  :class="{'noGrandNum':item.customer_resource_browse<12000}" @click="commCreatEvent({id:11244})"><a href="javascript:;" @click="login('./sns.html?cid='+cid+'&action=follow')"><p class="ev-followNum" :num="item.followOrgNum">{{item.followOrgNum}}</p><p class="numName">关注</p></a></li>
               <li class="al-personalSnsNum" @click="gototab"  :class="{'noGrandNum':item.customer_resource_browse<12000}"><a href="javascript:;"><p class="ev-upNum" :num="item.totalPostsNum">{{item.totalPostsNum}}</p><p class="numName">资源</p></a></li>
           </ul>
           <Loading v-show="ajaxing"></Loading>
       </header>
       <section v-if="isBigImg" class="logoBig">
           <figure class="hearTitle">
               <a class="scrollBack" href="javascript:;" @click="isBigImg=false">
                   <img src="/static/images/personal/return-White.png" alt="">
               </a>
               <span class="namecenter">头像大图</span>
           </figure>
           <img :src="getBigLogoUrl(item.attrUrl)" class="logoImg"/>
       </section>
   </section>
</template>

<script>
    import axios from "axios";
    import Loading from "components/Loading/Loading";
    import comm from "static/js/comm";
    import commPopup from "static/js/commPopup";
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
                isBigImg:false,
                url:'',
                flag:true,
                flagShow:false,
                ajaxing:false,
                type:{},
                vipClass:'',
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
            login(url){
                let t=this;
                user.privExecute({
                    callback: function() {
                        if(window.g_sps){
                            g_sps.jump(null,url);
                        }else{
                            setTimeout(function(){
                                g_sps.jump(null,url);
                            },200)
                        }

                    },
                    operateType: "login"
                })
            },
            getBigLogoUrl(logoUrl){
                let imgLogo='//img50.allinmd.cn/pages/personal/no_head.png';
                if(logoUrl){
                    if(logoUrl.indexOf('_c_p_150_150')>-1){
                        imgLogo=logoUrl.split('_c_p_150_150')[0]+logoUrl.split('_c_p_150_150')[1]
                    }else {
                        imgLogo=logoUrl;
                    }
                }
                return imgLogo;
            },
            hisBack(){
                if(!document.referrer){
                    if(window.g_sps){
                        g_sps.jump(null,'/');
                    }else{
                        setTimeout(function(){
                            g_sps.jump(null,'/');
                        },200)
                    }
                }
            },
            gototab(){
                $('html,body').animate({scrollTop: $('.ev-contentCon').offset().top-$('.al-personalScrollHead').height()},800);
                this.$emit('isResource',1);
                this.commCreatEvent({id:11246});
            },
            initDetail(){
                const t = this;
                t.ajaxing = true;
                axios({
                    url: path.info,
                    method: "POST",
                    data:{
                        "customerId":t.$store.state.otherId,
                        "logoUseFlag":4,
                        vFlag:3,
                        isCustomer:1
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
                            // t.$emit('detail',heig);
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
                                    // msg:'用户尚未认证',
                                    msg:medicalTitleHtml,
                                    work:companyHtml,
                                    isSuccess:false,
                                    customer_resource_browse:dataList[0].customer_resource_browse,
                                    totalPostsNum:csc.totalPostsNum
                                }
                                t.$store.state.issuccess=false;
                            }else{
                                let medicalTitleHtml="",companyHtml="";
                                if(auth.medicalTitleShow){
                                    medicalTitleHtml=auth.medicalTitleShow;
                                }
                                if(auth.workplace){
                                    companyHtml=auth.workplace;
                                }
                                if(auth.state==8){
                                    t.vipClass = "al-vipUserV2";  //V2显示
                                }
                                if(auth.state==2||auth.state==7||auth.state==9){
                                    t.vipClass = "al-vipUserV1";
                                }
                                t.item = {
                                    attrUrl:url,
                                    name:nickname,
                                    msg:medicalTitleHtml,
                                    work:companyHtml,
                                    isSuccess:true,
                                    customer_resource_browse:dataList[0].customer_resource_browse,
                                    totalPostsNum:csc.totalPostsNum

                                }
                                t.$store.state.issuccess=true;
                            }
                            t.item.fansNum = csc.fansNum;
                            t.item.followpeopleNum = csc.followpeopleNum;//老数据的关注数
                            t.item.followOrgNum = csc.followOrgNum;//加入组织后关注的总数
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
                        str = 'attention';break;
                    case 4:
                        str = 'doctorAttention';break;
                    default:
                        str = 'doctorOther';break;
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
                                    t.item.followState =res.data.responseObject.responseData.data_list[0].relationship;
                                }else {
                                    commPopup.popup(res.data.responseObject.responseMessage)
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
				if(location.hash.indexOf('indexHome')>-1){
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/indexHome';
				}else if(location.hash.indexOf('Info')>-1){
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/Info';
				}else{
					url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cid+'#/indexHome';
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
            ...mapActions(["change","changeEn","information","types","commCreatEvent"]),
        },
        components:{
            Loading
        },
        filters:{
            isFollow:function(v){
                let str = '';
                switch(parseInt(v)){
                    case 2://已关注
                        str = '';break;
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