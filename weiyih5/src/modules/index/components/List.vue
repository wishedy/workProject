<template>
    <!-- 内容区 -->
    <section class="al-content ev_recBox" data-alcode-mod='386'>
        <section v-for="(v,i) in recomResArr" :key="i">
            <list-content :v="v"></list-content>
            <activity v-if="active(i)" :index="activeNum(i)" :num="parseInt((pageIndex-1)/2)"  :actArr="actArr"></activity>
            <rec-doctor v-if="doctor(i)" :docNum="docNum(i)"></rec-doctor>
            <rec-tag v-if="i -parseInt((i/10))*10==6" :tagNum="parseInt((pageIndex-1)/2)" :index="activeNum(i)"></rec-tag>
        </section>
        <section class="listNoMore" v-if="isNoMore">~  没有更多了  ~</section>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import ListContent from './ListContent.vue';
    import Activity from './Activity.vue';
    import RecDoctor from './RecDoctor.vue';
    import RecTag from './RecTag.vue';
    const GetRecomResUrl = '/mcall/customer/recommendResourceItem/json_list/';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        data (){
            return {
                recomResArr:[],
                ajaxing:true,
                noData:false,
                pageIndex:1,
                actArr:'',
                isNoMore:false
            }
        },
        components:{
            ListContent:ListContent,
            Activity:Activity,
            RecDoctor:RecDoctor,
            RecTag:RecTag
        },
        methods :{
            recomRes(isScore){
                let t=this;
                if(TempCache.getItem('firstListData')&&(!isScore)){
                    t.recomResArr = JSON.parse(TempCache.getItem('firstListData'));
                }
                t.ajaxing = true;
                t.$store.state.loading=true;
                comm.ajax2({
                    url: GetRecomResUrl,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "", //1399533638818,//1434505803474 ,//    用户ID
                            pageIndex: t.pageIndex,
                            pageSize: 10,
                            scene: 10, //场景（首页传10）    新增10 -  首页11 -  朋友圈12 -  个人主页13 -  发现
                            sessionCustomerId:TempCache.getItem("userId") || "",
                            platformId:TempCache.getItem('department')||1,
                            flag:1,
                            score:t.$store.state.contentScore
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.$store.state.loading=false;
                        t.ajaxing = false;
                        if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.data_list) {
                            let data_list=res.responseObject.responseData.data_list;
                            if(!isScore){
                                t.recomResArr=[];
                            }
                            for(let i=0,max=data_list.length;i<max;i++){
                                let attLength = data_list[i].picNum,
                                     attUrl = '';
                                if (attLength != 0) {
                                    attUrl = data_list[i].picUrl.split('|');
                                    for(let j= 0,l=attUrl.length;j<l;j++){
                                        if(attUrl[j].indexOf('http')==-1){
                                            attUrl.splice(j,1);
                                        }
                                    }
                                    attLength = attUrl.length;
                                }
                                t.recomResArr.push({
                                    refType: data_list[i].itemType,
                                    resUrl: data_list[i].itemUrl,
                                    resName: data_list[i].itemTitle,
                                    resDesc: data_list[i].itemAbstract,
                                    isAward: data_list[i].isAward,
                                    isAttend: data_list[i].isAttend,
                                    isNew: data_list[i].isNew,
                                    isHot: data_list[i].isHot,
                                    tplPath: data_list[i].tplPath,
                                    resAuthor: data_list[i].itemType==1?data_list[i].ownerNameStr:data_list[i].ownerName,
                                    resWatchCount:comm.toWKH(data_list[i].browseNum),
                                    attUrl: attUrl,
                                    attLength: attLength,
                                    id: data_list[i].itemId,
                                    playTime: data_list[i].playTime?data_list[i].playTime.substring(0,8):"",
                                    videoType:data_list[i].videoType,
                                    score:data_list[i].currentStarLevel,
                                    scoreNum:data_list[i].currentScoreNum,
                                    isShowActivityTag:data_list[i].isShowActivityTag,
                                    activityTagName:data_list[i].activityTagName,
                                    activityTagColor:data_list[i].activityTagColor
                                });
                            }
                            if(!isScore){
                                TempCache.setItem('firstListData',JSON.stringify(t.recomResArr));
                            }
                            t.pageIndex++;
                            // t.recomResArr=res.responseObject.responseData.data_list;
                        }else {
                            t.noData = true;
                            if(isScore){
                                t.isNoMore=true;
                            }
                        }
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.score_list&&res.responseObject.responseData.score_list.length>0){
                            let scoreList=res.responseObject.responseData.score_list;
                            for (let i in scoreList[0]){
                                if(i==1){
                                    t.$store.state.contentScore=scoreList[0][i];
                                }
                            }

                        }
                    }
                })
            },
            scroll(){
                let t = this,
                     scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData){
                            t.recomRes(true);
                        }
                    }
                },false);
            },
            // listenToMyBoy: function (somedata){
            //     this.childWords = somedata;
            //     this.actArr=[];
            //     this.actArr.push(somedata);
            // },
            doctor(index){
                if(((index+1)/10==2&&(index+1)%10==0) || (index/10>2&&(index-20+1)%15==0)){
                    return true;
                }
            },
            docNum(index){
                if((index+1)/10==2&&(index+1)%10==0){
                    return 1;
                }else if ( index/10>2&&(index-20+1)%15==0){
                    return (index-20+1)/15+1;
                }
            },
            active(index){
                if(index>20){
                    index=index-(parseInt(this.pageIndex/2)-1)*20;
                }
                if(index -parseInt((index/10))*10==3){
                    return true;
                }
            },
            activeNum(index){
                if(index>20){
                    index=index-(parseInt(this.pageIndex/2)-1)*20;
                }
                return parseInt((index/10));
            }

        },
        mounted (){
            this.recomRes();
            this.scroll();
        }

    }
</script>
