<template>
    <section v-if="isActive">
        <section v-for="(v,i) in topNList" :key="i" v-if="i==index" data-num="num" :actArr="actArr">
            <section class="al-contentPartModule ev_operate" itemType="13" :index="num+1" v-if="v.itemType == 12" @click="creatEvent">
               <section v-for="(w,j) in v.data_list" :key="j" :itemTitle="w.itemTitle" :itemUrl="w.itemUrl">
                   <figure class="al-contentSeminarImg">
                       <a :href="w.itemUrl">
                           <img :src="w.picUrl" alt="">
                           <i class="al-contentSeminarMark">
                               <img src="//img50.allinmd.cn/pages/index/mark_active.png" alt="">
                           </i>
                       </a>
                   </figure>
                   <section class="al-contentBottomPart">
                       <article class="al-contentText">
                           <a :href="w.itemUrl" class="al-contentTitle">{{w.itemTitle}}</a>
                       </article>
                       <figure class="al-contentSeminarJoin">
                           <a :href="w.itemUrl" class="btn-primary">
                               参与
                           </a>
                       </figure>
                   </section>
               </section>
            </section>
            <section class="al-contentPartModule ev_operate" :itemType="v.itemType" :index="num+1" v-else-if="v.itemType == 16 || v.itemType == 14" @click="creatEvent">
                <section v-for="(w,j) in v.data_list" :key="j" :itemTitle="w.itemTitle" :itemUrl="w.itemUrl">
                    <figure class="al-contentSeminarImg">
                        <a :href="w.itemUrl">
                            <img :src="w.picUrl" alt="">
                        </a>
                    </figure>
                    <section class="al-contentBottomPart">
                        <article class="al-contentText">
                            <a :href="w.itemUrl" class="al-contentTitle">{{w.itemTitle}}</a>
                        </article>
                    </section>
                </section>
            </section>
            <section class="al-videoAlbumRank al-content" v-else-if="v.itemType == 15">
                <h2 class="al-contentMainTitle">{{v.itemName}}</h2>
                <section class="al-videoAlbumRank" v-for="(e,j) in v.data_list" :key="j">
                     <section class="al-videoAlbumRankItem ev_operate" itemType="15" :index="num+1" @click="creatEvent">
                         <figure class="al-videoAlbumRankItemImg" :itemTitle="e.itemTitle" :itemUrl="e.itemUrl">
                             <a :href="e.itemUrl">
                                 <img :src="picUrlSplit(e.picUrl)" alt="">
                             </a>
                         </figure>
                         <figcaption class="al-videoAlbumRankItemName">
                             <a :href="e.itemUrl">{{e.itemTitle}}</a>
                            <span class="al-videoAlbumRankItemAuthor">{{e.itemTitle}}</span>
                         </figcaption>
                     </section>
                </section>
            </section>
            <section class="al-videoAlbum al-content" v-else-if="v.itemType == 13">
                 <h2 class="al-contentMainTitle">{{v.itemName}}</h2>
                    <section class="al-videoAlbumItem ev_operate" itemType="13" :index="num+1" @click="creatEvent" v-for="(e,j) in v.data_list" :key="j" v-if="j<9">
                         <figure class="al-videoAlbumItemImg" :itemTitle="e.itemTitle" :itemUrl="e.itemUrl">
                             <a :href="e.itemUrl">
                                 <img :src="picUrlSplit(e.picUrl)" alt="">
                             </a>
                             <i class="al-videoPlayBtn" v-if="e.itemType==1">
                                 <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                             </i>
                             <span class="al-videoTime" v-if="e.itemType==1">{{playTimeStr(e.playTime)}}</span>
                         </figure>
                         <figcaption class="al-videoAlbumItemName">
                             <a :href="e.itemUrl">{{getStrLen(e.itemTitle,46)}}</a>
                         </figcaption>
                    </section>
            </section>
            <section class="al-contentPartModule al-contentUpTitleDownImg ev_operate" itemType="3" :index="num+1" @click="creatEvent" v-else-if="v.itemType == 3">
                <article class="al-contentText" v-for="(w,j) in v.data_list" :key="j" :itemTitle="w.itemTitle" :itemUrl="'/dist/conference/meeting_detail.html?conId='+w.itemId+'&conName='+w.itemTitle">
                    <a :href="'/dist/conference/meeting_detail.html?conId='+w.itemId+'&conName='+w.itemTitle"  class="al-contentTitle">{{w.itemTitle}}</a>
                    <figure class="al-contentSeminarImg">
                        <a :href="'/dist/conference/meeting_detail.html?conId='+w.itemId+'&conName='+w.itemTitle">
                            <img :src="w.picUrl" alt="">
                            <i class="al-contentSeminarMark">
                                <img src="//img50.allinmd.cn/pages/index/mark_meeting.png" alt="">
                            </i>
                        </a>
                    </figure>
                    <p class="al-contentOtherMsg">
                        <span class="al-contentSeminarTime icon-contentSeminarTime">{{dateJoint(w.startTime,w.endTime,'/','-')}}</span>
                        <span class="icon-contentSeminarPlace">{{w.conLocation}}</span>
                    </p>
                </article>
            </section>
            <section  v-else-if="v.itemType == 1 || v.itemType == 2 || v.itemType == 4 || v.itemType == 7">
                <section class="al-contentPartModule al-contentUpTitleDownImg ev_operate" :itemType="v.itemType" :index="num+1" @click="creatEvent" v-if="v.data_list[0].tplPath==286">
                    <article class="al-contentText" v-for="(w,j) in v.data_list" :key="j" :itemTitle="w.itemTitle" :itemUrl="w.itemUrl">
                        <a :href="w.itemUrl" class="al-contentTitle">
                            {{w.itemTitle}}
                        </a>
                        <figure class="al-contentSeminarImg">
                            <a :href="w.itemUrl">
                                <img :src="picUrlSplit(w.picUrl)" alt="">
                            </a>
                        </figure>
                    </article>
                </section>
                <list-content v-else :v="dataList(v.data_list[0])" :isActivity="true"></list-content>
            </section>
        </section>

    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import  commdate from 'static/js/comm.date.js';
    import ListContent from './ListContent.vue';
    const TopNList = '/mcall/cms/resource/json_list/';
    export default {
        props:['index','num','actArr','channelId','flow'],
        data (){
            return {
                bArr:[0,1,2,3,4],
                topNList:[],
                isActive:true
            }
        },
        components:{
            ListContent:ListContent
        },
        methods :{
            topNListAjax(){
                let t=this;
                t.$store.state.loading=true;
                comm.ajax2({
                    url: TopNList,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            channelId: t.channelId,
                            pageIndex: t.num+1,
                            pageSize: 2,
                            sessionCustomerId:TempCache.getItem('userId')||"",
                            customerId:TempCache.getItem('userId')||"" ,
                            platformId:TempCache.getItem('department')||1
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.$store.state.loading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.topNList=res.responseObject.responseData.data_list;
                            t.$store.state.topNList=res.responseObject.responseData.data_list;
                            // t.$emit('child-say',res.responseObject.responseData.data_list[1]);
                        }else {
                            t.isActive=false;
                        }
                    }
                })
            },
            picUrlSplit(picUrl){
                if(picUrl){
                    return picUrl.split('|')[0];
                }
            },
            dataList(dataList){
                let  t=this,indexNum;
                if(dataList.tplPath!=286){
                    let attLength = dataList.picNum,
                        attUrl = '';
                    if (attLength != 0) {
                        attUrl = dataList.picUrl.split('|');
                        for(let j= 0,l=attUrl.length;j<l;j++){
                            if(attUrl[j].indexOf('http')==-1){
                                attUrl.splice(j,1);
                            }
                        }
                        attLength = attUrl.length;
                    }
                    if(t.index==0){
                        indexNum=t.num;
                    }else {
                        indexNum=t.num+1;
                    }
                    return {
                        refType: dataList.itemType,
                        resUrl: dataList.itemUrl,
                        resName: dataList.itemTitle,
                        resDesc: dataList.itemAbstract,
                        isAward: dataList.isAward,
                        isAttend: dataList.isAttend,
                        isNew: dataList.isNew,
                        isHot: dataList.isHot,
                        tplPath: dataList.tplPath,
                        resAuthor: dataList.ownerName,
                        resWatchCount:comm.toWKH(dataList.browseNum),
                        attUrl: attUrl,
                        attLength: attLength,
                        id: dataList.itemId,
                        playTime: dataList.playTime?dataList.playTime.substring(0,8):"",
                        videoType:dataList.videoType,
                        score:dataList.currentStarLevel,
                        scoreNum:dataList.currentScoreNum,
                        isShowActivityTag:dataList.isShowActivityTag,
                        activityTagName:dataList.activityTagName,
                        activityTagColor:dataList.activityTagColor,
                        index:indexNum,
                        flow:t.flow
                    };
                }
            },
            getStrLen(resName,lenth){
                return comm.getStrLen(resName, lenth)
            },
            dateJoint(ate1, date2, sign, middleJoint){
                return commdate.dateJoint(ate1, date2, sign, middleJoint);
            },
            playTimeStr(playTime){
                return playTime.substring(0,8);
            },
            creatEvent(e){
                e.preventDefault();
                e.stopPropagation();
                var pageIndex=e.currentTarget.getAttribute('index'),
                    itemType=e.currentTarget.getAttribute('itemType'),
                    contentTitle=e.currentTarget.children[0].getAttribute('itemTitle'),
                    itemUrl=e.currentTarget.children[0].getAttribute('itemUrl');
                comm.creatEvent({
                    triggerType:'广告',
                    locationId:pageIndex+"-"+(this.flow+2),
                    keyword:contentTitle,
                    actionId:62,
                    pushMessageId:'',
                    refType:itemType,
                    refId:""
                });
                g_sps.jump(null,itemUrl);
            }

        },
        mounted (){
            if(this.index==0){
                this.$store.state.topNList='';
                this.topNListAjax();
            }else {
                this.topNList=this.$store.state.topNList;
            }
        }

    }
</script>

<style scoped>

</style>