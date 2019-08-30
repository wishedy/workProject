<template>
    <section class="billboard" v-cloak>
        <section class="billboardList al-rankContainer">

            <section class="billboardUser" v-if="myTopLen==1 && typeNum!=3">
                <a :href="'/dist/personal/personal_index.html?cid='+myTop.customerId">
                    <img :src='myTop.logoUrl' alt="">
                    <aside class="describe" v-if="typeNum==1">
                        <p>{{myTop.fullName}}</p>
                        <p>周贡献{{myTop.totalNum}}</p>
                        <p>{{message}}</p>
                    </aside>

                    <aside class="describe" v-if="typeNum==2">
                        <p>{{myTop.fullName}}</p>
                        <ul class="describeLi">
                            <li>评论<span>{{myTop.topicNum}}</span></li>
                            <li>分享<span>{{myTop.shareNum}}</span></li>
                            <li>浏览<span>{{myTop.browseNum}}</span></li>
                        </ul>
                        <p>{{message}}</p>
                    </aside>
                 </a>
                <figure :class="str">{{rank}}</figure>
            </section>

            <section class="billboardList recommendNoneWeight" :style="{'padding-bottom':isH}">
                <section class="titleCont"  v-if="billboard">
                    <section class="allTitle" :class="isType()" @click="isShow">
                        <span>{{all}}</span><i></i>
                    </section>
                    <aside class="titleList" v-show="recomRightList">
                        <ul data-alcode-mod='633'>
                            <li v-for="(v,i) in list" :style="{color:i === n ? '#2899E6': ''}" @click="toggle(i)">{{v}}</li>
                        </ul>
                    </aside>
                </section>
                <ul class="al-rankList" data-alcode-mod="624"  v-if="!billboard" v-show="rankLen!=0">
                    <li v-for="(val,index) in rankList" :data-userid="val.customerId">
                        <a :href="'/dist/personal/others_index.html?cid='+val.customerId">
                            <i class="placing" :class="{first:index==0,second:index==1,third:index==2}">{{index>2?val.customerRanking:''}}</i>
                            <img :src="val.logoUrl" alt="">
                            <aside class="describe">
                                <p :class="stateTitle(val.isNew,val.specialType)">{{val.fullName}}<i>{{val.isNew,val.specialType | showTitle}}</i></p>
                                <p>{{val.medicalTitleShow}}<span>{{val.company | cut}}</span></p>
                                <ul class="describeLi">
                                    <li>评论<span>{{val.reviewNum}}</span></li>
                                    <li>分享<span>{{val.shareNum}}</span></li>
                                    <li>浏览<span>{{val.browseNum}}</span></li>
                                </ul>
                            </aside>
                        </a>
                    </li>
                    <!--更多排名 去掉类名 up -->
                    <aside :class="{listMore:true,up:!addOnOff}" @click="pageAdd" v-show="topLen">{{addDes}}<i></i></aside>
                </ul>
                <ul class="recommend" data-alcode-mod="624" v-if="billboard">
                    <li v-for="(val,index) in rankList" :data-userid="val.customerPunditsEntity.customerId">
                        <a :href="'/dist/personal/others_index.html?cid='+val.customerPunditsEntity.customerId">
                            <i  class="placing" :class="{first:index==0,second:index==1,third:index==2}">{{index>2?val.other.customerRanking:''}}</i>
                            <img :src="val.customerAtt.logoUrl" alt="">
                            <aside class="describe">
                                <p>{{val.customerPunditsEntity.customerName}}</p>
                                <p>{{val.customerPunditsEntity.medicalTitleShow}}<span>{{val.customerPunditsEntity.company}}</span></p>
                                <ul class="describeLi">
                                    <li>贡献<span>{{val.customerStatistic.contributionCount|toWKH}}</span></li>
                                    <li>粉丝<span>{{val.customerStatistic.fansNum|toWKH}}</span></li>
                                    <li v-if="val.customerStatistic.topicNum!=0">评论<span>{{val.customerStatistic.topicNum|toWKH}}</span></li>
                                </ul>
                            </aside>
                        </a>
                        <aside class="crown" :class="val.other.isTopStatus==1? 'active' : ''" @click="praise(val.other.isTopStatus,val.customerPunditsEntity.customerName,val.customerPunditsEntity.customerId,index)"><i>顶</i>{{val.other.topNum | toWKH}}</aside>
                    </li>
                    <!--更多排名 去掉类名 up-->
                    <aside :class="{listMore:true,up:!addOnOff}" @click="pageAdd" v-show="topLen">{{addDes}}<i></i></aside>
                </ul>
                <ul v-show="nodata">
                    <li class="listNone"><img src="//img50.allinmd.cn/pages/discover/billboard/listNone.png"></li>
                </ul>
            </section>
        </section>
        <section class="iWant" v-if="billboard"><a href="/pages/discover/billboard/i_want.html">我要上榜</a></section>
        <Loading v-show="ajaxing"></Loading>
        <Popup :popup-config="popupConfig"></Popup>
        <Share :shareConfig.sync="shareConfig"  v-show="shareOnOff"></Share>
    </section>
</template>

<script>
    import axios from 'axios';
    import Loading from "components/Loading/Loading.vue";
    import Popup from "components/PopupLayer/PopupLayer";
    import comm from "static/js/comm";
    import TempCache from "static/js/tempcache";
    import Share from "components/Share/Share";
    import user from "static/js/module.user";
    const customer = TempCache.getItem('userId')||"";
    const department = TempCache.getItem('department')||1;
    const xhrUrl = {
        "content":"/mcall/customer/toplist/getTopList/",
        "contentRecom":"/mcall/customer/pundits/getPunditsCustomerList/",
        "praise":"/mcall/customer/prefer/createTop/"

    };


    export default {
        data(){
            return {
                myTop:{},       //我的上榜数据
                myTopLen:0,     //我的上榜数据是否存在
                rankList:[],    //排行数据
                rankLen:1,      //排行数据是否存在
                topLen:false,   //判断是否显示展开/收起[存储排行的数据布尔值<10=false,>10=true]
                pageIndex:1,    //分页请求存入储公共变量
                addOnOff:false,     //判断展开/收起'字符串'
                billboard:false,    //判断是在哪个页面展示对应的模板,贡献榜和活跃模块一致,推荐榜模块有差异[我要上榜，侧导航]
                recomRightList:true,    //推荐榜左侧列表是否显示
                all:'全部',   //推荐榜左侧导航全部标题
                list:['全部','关节','脊柱','创伤','其他'],    //推荐榜左侧导航内容
                n:0,    //推荐榜左侧导航记录下标
                ajaxing:false,   //判断loading是否显示
                isH:'',
                popupConfig:{},
                nodata:false,
                shareConfig:{},
                shareOnOff:false,
                shareData:{},
                sceneType:'',
                message:'',
                rank:'',
                str:'',
                typeNum:''
            }
        },
        components:{
            Loading,
            Popup,
            Share
        },
        methods:{
            //该方法用于点击加载更多
            pageAdd(){
                let t = this;
                if(t.typeNum==2){
                    comm.creatEvent({
                        triggerType:'榜单',
                        triggerName:'更多排名',
                        actionId:11060,
                        browType:177
                    });
                }
                if(t.addOnOff){
                    t.pageIndex++;
                    t.content();
                }else{
                    t.addOnOff = true;
                    t.pageIndex = 1;
                    t.rankList = t.rankList.slice(0,10);
                }
            },
            //该方法为主方法请求页面排行情况
            content(){
                let t = this;
                let typeNum = this.$route.name;
                this.typeNum = typeNum;
                if(typeNum == 1 || typeNum ==2){
                    t.billboard = false;
                    t.isH = '';
                    t.ajaxing = true;
                    axios({
                        url: xhrUrl.content,
                        method: "POST",
                        data:{
                            "platformId": department,
                            "toplistType": typeNum,
                            "customerId": customer,
                            "logoUseFlag":10,
                            "pageIndex":t.pageIndex,
                            "pageSize":10
                        },
                        transformRequest: [function(data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(res=>{
                        t.ajaxing = false;
                        if(comm.hasResponseData(res.data)){

                            t.myTop = res.data.responseObject.responseData.my_top_list;

                            //判断请求这个对象是否为空[是否显示该元素]
                            (Object.keys(t.myTop).length!=0) && (Object.keys(t.myTop.customerRanking).length!=0) ? t.myTopLen = 1 : t.myTopLen = 0;
                            if(Object.keys(t.myTop).length!=0 && Object.keys(t.myTop.customerRanking).length!=0){
                                if(t.myTop.customerRanking==0 || t.myTop.customerRanking>20){
                                    t.sceneType=75;
                                }else if(t.myTop.customerRanking<20){
                                    t.sceneType=74;
                                }
                            }else{
                                t.sceneType=75;
                            }
                            var rankLevel = parseInt(t.myTop.customerRanking);
                            if(typeNum==1){
                                if(rankLevel>20 || rankLevel==0){
                                    t.message="发布更多资源可跻身榜单";
                                    t.rank="未上榜";
                                    t.str='rankingNone';
                                }else{
                                    if(rankLevel==1){
                                        t.message="发布更多资源可保持排名";
                                        t.rank='第'+t.myTop.customerRanking+'名';
                                    }else{
                                        t.message="发布更多资源可提高排名";
                                        t.rank='第'+t.myTop.customerRanking+'名';
                                    }
                                    t.str='ranking';
                                }
                            }else if(typeNum==2){
                                if(rankLevel>20 || rankLevel==0){
                                    t.message="评论/分享/浏览更多资源可跻身榜单";
                                    t.rank="未上榜";
                                    t.str='rankingNone';
                                }else{
                                    if(rankLevel==1){
                                        t.message="评论/分享/浏览更多资源可保持排名";
                                        t.rank='第'+t.myTop.customerRanking+'名';
                                    }else{
                                        t.message="评论/分享/浏览更多资源可提高排名";
                                        t.rank='第'+t.myTop.customerRanking+'名';
                                    }
                                    t.str='ranking';
                                }
                            }
//
                            let dataList = res.data.responseObject.responseData.top_list;
                            if(dataList){
                                t.rankList =  t.rankList.concat(dataList);
                                //判断请求数据有没有长度[是否显示该元素]
                                t.rankList.length!=0 ? t.rankLen = 1 : t.rankLen = 0;
                                //判断是否展示更多元素
                                t.rankList.length<10 ? t.topLen = false : t.topLen = true;
                                //判断是展开还是收起
                                dataList.length<10 ? t.addOnOff = false : t.addOnOff = true;
                                t.share();
                                this.shareOnOff = true;
                            }else{
                                t.addOnOff = false;
                            }

                        }else{
                            t.shareOnOff = false;
                            t.nodata = true;
                        }

                    })
                }else if(typeNum == 3){
                    t.ajaxing = true;
                    t.nodata = false;
                    axios({
                        url: xhrUrl.contentRecom,
                        method: "POST",
                        data:{
                            "logoUseFlag":4,
                            "sortType":8,
                            "sessionCustomerId":customer,
                            "visitSiteId":1,
                            "platformId":department,
                            "punditsGroup":t.n == 0 ? "" :t.n,
                            "pageIndex":t.pageIndex,
                            "pageSize":10
                        },
                        transformRequest: [function(data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(res=>{
                        t.ajaxing = false;
                        t.recomRightList = true;
                        if(comm.hasResponseData(res.data)){

                            t.myTop = res.data.responseObject.responseData.my_top_list;
                            //判断请求这个对象是否为空[是否显示该元素]
                            (Object.keys(t.myTop).length!=0) && (Object.keys(t.myTop.customerRanking).length!=0)? t.myTopLen = 1 : t.myTopLen = 0;
                            if(Object.keys(t.myTop).length!=0 && Object.keys(t.myTop.customerRanking).length!=0){
                                if(t.myTop.customerRanking==0 || t.myTop.customerRanking>20){
                                    t.sceneType=75;
                                }else if(t.myTop.customerRanking<20){
                                    t.sceneType=74;
                                }
                            }else{
                                t.sceneType=75;
                            }

                            let dataList = res.data.responseObject.responseData.data_list;
                            t.rankList = t.rankList.concat(dataList);

                            //判断请求数据有没有长度[是否显示该元素]
                            t.rankList.length!=0 ? t.rankLen = 1 : t.rankLen = 0;
                            //判断是否展示更多元素
                            t.rankList.length<10 ? t.topLen = false : t.topLen = true;
                            //判断是展开还是收起
                            t.rankList.length==50 ? t.addOnOff = false : t.addOnOff = true;
                            t.billboard = true;
                            t.isH = '2rem';
                            t.share();
                            this.shareOnOff = true;
                        }else{
                            t.shareOnOff = false;
                            t.noData = true;
                        }
                    })
                }

            },
//            //该方法是推荐榜动态添加高度，因为推荐榜最下面有固定页脚[我要上榜]=>用
//            addHeight(){
//                let listType = this.$route.name;
//                if(listType == 3){  //贡献和活跃榜单执行列表
//                    return 'padding-bottom:2rem';
//                }else{
//                    return ''
//                }
//            },
            //判断推荐榜左侧是否显示
            isShow(){
                if(this.recomRightList){
                    this.recomRightList=false;
                }else{
                    this.recomRightList=true;
                }
            },
            //判断推荐榜左侧全部标题上下箭头
            isType(){
                let str = "";
                if(this.recomRightList){
                    str ="";
                }else{
                    str ="up";
                }
                return str;
            },
            //推荐榜左侧导航点击切换主方法
            toggle(num){
                let str = '';
                switch(parseInt(num)){
                    case 0:
                        str = '全部';break;
                    case 1:
                        str = '关节';break;
                    case 2:
                        str = '脊柱';break;
                    case 3:
                        str = '创伤';break;
                    case 4:
                        str = '其他';break;
                }
                comm.creatEvent({
                    triggerType:'榜单',
                    triggerName:'推荐榜筛选项',
                    keyword:str,
                    actionId:11061,
                    browType:178
                });
                this.all = this.list[num]; //更换标题内容
                this.n = num;   //获取当前点击下标
                this.recomRightList = false;    //每次点击使左侧隐藏
                this.rankList = [];
                this.topLen = false;
                this.isH = '';
                this.pageIndex = 1;
                this.content();     //执行页面排行主方法
            },
            praise(type,name,id,i) {
                let t = this;
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true ,
                    callback: function () {
                        if(type!==1){
                            comm.creatEvent({
                                triggerType:'榜单',
                                triggerName:'顶',
                                keyword:name,
                                actionId:11059,
                                browType:178
                            });
                            axios({
                                url: xhrUrl.praise,
                                method: "POST",
                                data:{
                                    "platformId": department,
                                    "customerId": customer,
                                    "usefulType":10,
                                    "upDownType":2,
                                    "refId":id,
                                    "visitSiteId":2
                                },
                                transformRequest: [function(data) {
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 1500
                            }).then(res=>{
                                t.rankList[i].other.topNum= t.rankList[i].other.topNum+1;
                                t.rankList[i].other.isTopStatus = 1;
                                t.popupConfig = JSON.stringify({
                                    "msg":"已点赞",
                                    "seen":true,
                                    "time":1500,
                                });
                                setTimeout(function () {
                                    t.popupConfig = JSON.stringify({
                                        "msg":"已点赞",
                                        "seen":false,
                                        "time":1500      //这里可以设置多少毫秒消失
                                    });
                                },100);
                            })
                        }else{
                            t.popupConfig = JSON.stringify({
                                "msg":"每天只能顶一次哦",
                                "seen":true,
                                "time":3000,
                            });
                            setTimeout(function () {
                                t.popupConfig = JSON.stringify({
                                    "msg":"每天只能顶一次哦",
                                    "seen":false,
                                    "time":3000      //这里可以设置多少毫秒消失
                                });
                            },100);
                        }
                    }
                });
            },
            stateTitle(n,s){
                let str = '';
                if(n==1){
                    str = 'new';
                }
                if(s>=5){
                    str = 'continuity';
                }
                if(n==1 && s>=5){
                    str = 'continuity';
                }
                return str;
            },
            share(){
                let t = this;
                t.shareConfig = {
                    initData:{noSelfInit:true},
                    shareData:{
                        "customerId":customer,
                        "sceneType":t.sceneType,
                        "resourceType":0,
                        "platformId":department,
                        "toplistType":t.typeNum,
                        "punditsGroup":t.n == 0 ? "" :t.n
                    }
                }
            },
        },
        mounted(){
            this.content();
        },
        computed:{
            addDes(){
                let t = this;
                return t.addOnOff?"更多排名":"收起排名";
            }
        },
        watch: {
            $route() {
                let t = this;
                t.myTop = {};
                t.rankList = [];
                t.topLen = false;
                t.isH = '';
                t.recomRightList = false;
                t.content()
            }
        },
        filters:{
            toWKH:value=>comm.toWKH(value),
            cut:(data)=>comm.getStrLen(data,30),
            showTitle:(n,s)=>{
                let str = '';
                if(n==1){
                    str = '最新';
                }
                if(s>=5){
                    str = '连续'+s+'周';
                }
                if(n==1 && s>=5){
                    str = '连续'+s+'周';
                }
                return str;
            }
        }
    }
</script>

<style scoped>
    [v-cloak]{
        display: none;
    }
    .billboard .billboardUser .ranking {
        background: url('//img50.allinmd.cn/pages/discover/billboard/bg-rank.png') no-repeat;
        background-size: contain;
    }
    .billboard .billboardList .listMore i {
        display: inline-block;
        width: 0.28rem;
        height: 0.16rem;
        vertical-align: middle;
        background: url('//img50.allinmd.cn/pages/discover/billboard/arrow_down.png') no-repeat;
        background-size: contain;
        margin-left: 0.10667rem;
    }
    .billboard .billboardList .listMore.up i {
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
    }
    .billboard .billboardList ul li .placing.first {
        background: url('//img50.allinmd.cn/pages/discover/billboard/Rank1.png') no-repeat;
        background-size: contain;
    }
    .billboard .billboardList ul li .placing.second {
        background: url('//img50.allinmd.cn/pages/discover/billboard/Rank2.png') no-repeat;
        background-size: contain;
    }
    .billboard .billboardList ul li .placing.third {
        background: url('//img50.allinmd.cn/pages/discover/billboard/Rank3.png') no-repeat;
        background-size: contain;
    }
    .billboard .billboardList ul li .describe .continuity i:before {
        content: '';
        display: inline-block;
        width: 0.37333rem;
        height: 0.37333rem;
        vertical-align: text-top;
        background: url('//img50.allinmd.cn/pages/discover/billboard/bg-rankconsecutive.png') no-repeat;
        background-size: contain;
        margin-right: 0.12533rem;
    }
    .allTitle i {
        display: inline-block;
        width: 0.28rem;
        height: 0.16rem;
        vertical-align: middle;
        background: url('//img50.allinmd.cn/pages/discover/billboard/icon_up.png') no-repeat;
        background-size: contain;
        margin-left: 0.10667rem;
    }
    .allTitle.up i {
        display: inline-block;
        width: 0.28rem;
        height: 0.16rem;
        vertical-align: middle;
        background: url('//img50.allinmd.cn/pages/discover/billboard/icon_down.png') no-repeat;
        background-size: contain;
        margin-left: 0.10667rem;
    }
    .billboard .billboardList ul li .describe .new i:before {
        content: "";
        display: inline-block;
        width: .37333rem;
        height: .37333rem;
        vertical-align: text-top;
        background: url('//img50.allinmd.cn/pages/discover/billboard/bg-ranknew.png') no-repeat;
        background-size: contain;
        margin-right: .12533rem;
    }
    .billboard .billboardUser .rankingNone {
        background: url('//img50.allinmd.cn/pages/discover/billboard/Star_Ranking_Grey.png') no-repeat;
        background-size: contain;
        width: 1.8rem;
        font-size: .4rem;
        color: #aaa;
    }
</style>