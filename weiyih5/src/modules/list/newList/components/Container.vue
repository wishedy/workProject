<template>
    <section class="al-content " data-alcode-mod='431'>
        <List v-for = "(item,key) in list" v-bind:item ="item" :key="key"></List>
        <section class="ev_scrollPage">
            <section class="listNoMore" v-show="noMore">~  没有更多了  ~</section>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    import Loading from 'components/Loading/Loading'
    import List from 'components/ListTemplate/OneImgList'

    const path={
        timeHot:'/mcall/customer/trends/getMapListByTime/'
    };
    export default{
        data(){
            let t=this;
            return {
                param:{
                    sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                    opId:0,             //0只查询发布状态的
                    dateType:2,         //1-每日最新 2-每周最新
                    trendTypes:'1,2,4,7',  		//	全部时传1,2,4,7
                    logoUseFlag:3,
                    attUseFlag:t.GLOBAL.AttUseFlag.e,
                    pageIndex:1,
                    pageSize:20,
                    platformId:TempCache.getItem('department')||1
                },
                list:[],
                noMore:false,
                ajaxing:false,
            }
        },
        methods:{
            setParams:function(){   //通过传参设置不同页面及请求
                let t=this;
                let _a = comm.getpara().trendTypes;
                let trendType=_a!=undefined?_a:0;           //	全部时传1,2,4,7
                let _b =comm.getpara().dateType;
                let dateType =_b!=undefined?_b:1;          //1-每日最新 2-每周最新
                let _tType;let attUseFlag=t.GLOBAL.AttUseFlag.c;
                switch(parseInt(trendType)){
                    case 1://视频
                        _tType =1;
                        attUseFlag=t.GLOBAL.AttUseFlag.c;
                        break;
                    case 2:
                        _tType=2;
                        break;
                    case 4:
                        _tType=4;
                        break;
                    case 7:
                        _tType=7;
                        break;
                    default:
                        _tType ="1,2,4,7";
                }
                t.param = $.extend(t.param,{
                    trendTypes: _tType,
                    dateType:dateType,
                    attUseFlag:attUseFlag
                });
            },
            getResource:function(){
                let t=this;
                t.ajaxing=true;
                axios({
                    url: path.timeHot,
                    method: "POST",
                    data: t.param,
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    let options = {
                        success(res){
                            t.ajaxing=false;
                            let item =res.responseObject.responseData.data_list;
                            for(let i=0;i<item.length;i++){
                                let json={};
                                json.itemType = item[i].customer_trends_type;
                                let trend = item[i].customer_trends;
                                let c_auth = item[i].customer_auth;
                                if(json.itemType==1){
                                    json.picUrl = item[i].cms_video_attachment_logo==""?"":item[i].cms_video_attachment_logo.videoAttUrl;
                                }else if(json.itemType==2){
                                    json.picUrl = item[i].cms_doc_attachment_logo==""?"":item[i].cms_doc_attachment_logo.docAttUrl;
                                }else if(json.itemType==4){
                                    json.picUrl = item[i].cms_topic_attachment_logo==""?"":item[i].cms_topic_attachment_logo.topicAttUrl;
                                }else if(json.itemType==7){
                                    json.picUrl = item[i].case_attachment_logo==""?"":item[i].case_attachment_logo.attUrl;
                                }
                                if(json.picUrl){
                                    json.picNum=1;
                                }else{
                                    json.picNum=0;
                                }
                                json.itemUrl=trend.resourceUrl;
                                json.itemTitle=trend.resourceName;
                                json.ownerName=json.itemType==1?c_auth.ownerNameStr:c_auth.lastName+c_auth.firstName;//视频多作者
                                json.browseNum=item[i].resource_valid.browseNum;
                                json.playTime=item[i].resource_valid.playTime;
                                json.currentScoreNum=item[i].currentStarLevel;
                                json.currentScoreNum=item[i].currentScoreNum;
                                json.videoType=item[i].videoType;
                                t.list.push(json);
                            }
                            t.param.pageIndex++;
                            if(item.length<t.param.pageSize){
                                t.noMore=true;
                            }
                        },
                        failed(){
                            t.ajaxing=false;
                            t.noMore=true;
                            if(t.list.length){
                                return false;
                            }else{
                                if(t.param.pageIndex==1){
                                    t.list = [];
                                }
                            }

                        }
                    };
                    comm.successRequest(res.data,options);
                });

            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore){
                            t.getResource();
                        }
                    }
                }
            }
        },
        mounted(){
            this.setParams();
            this.getResource();
            this.scroll();
        },
        components:{
            Loading,
            List
        },
        filters: {
            toWK:comm.toWKH
        }
    }
</script>