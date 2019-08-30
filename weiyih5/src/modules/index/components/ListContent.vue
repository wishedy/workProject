<template>
    <section class="al-contentPartModule ev_flow"  itemType="1" v-if="v.refType==1">
        <div class="al_flow_type">
                      <span class="al_flow_span al_flow_video" :class="v.videoType == 1 ? 'surgey':''">
                          {{v.videoType == 1 ? '手术视频':'视频'}}
                      </span>
            <ul class="al-littleScoreStarBox" v-if="v.scoreNum >= 10">
                <li v-for="(w,j) in bArr" :key="j">
                    <b :style="setWith(v.score)" v-if="j<parseInt(v.score)"></b>
                </li>
            </ul>
        </div>
        <section class="al-tableBox">
            <article class="al-contentText">
                <a :href="v.resUrl" class="al-contentTitle">{{resName(v.refType,v.resName)}}</a>
                <p class="al-contentOtherMsg">
                    <span v-html="act(v)"></span>
                    <span v-html="uNameOrBName(v.resAuthor,v.videoType)"></span>
                    <span class="icon-contentWatchedNum">{{v.resWatchCount}}</span>
                    <span class="al-contentDelete" :itemType="v.refType" :itemId="v.id" @click="dislikeAction" :ref="'delete'+v.id">x</span>
                </p>
            </article>
            <figure class="al-contentImgBox" v-if="v.attLength > 0">
                <a :href="v.resUrl">
                    <img :src="v.attUrl[0]" alt="">
                    <i class="al-videoPlayBtn">
                        <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                    </i>
                    <span class="al-videoTime">{{v.playTime.substring(0, 8)}}</span>
                </a>
            </figure>
        </section>
    </section>
    <section v-else>
        <section v-if="v.attLength==0">
            <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow" :itemType="v.refType">
                <div class="al_flow_type">
                    <span class="al_flow_span" :class="typeName(v.refType).type">{{typeName(v.refType).name}}</span>
                    <ul class="al-littleScoreStarBox" v-if="v.scoreNum >= 10">
                        <li v-for="(w,j) in bArr" :key="j">
                            <b :style="setWith(v.score)" v-if="j<parseInt(v.score)"></b>
                        </li>
                    </ul>
                </div>
                <article class="al-contentText">
                    <a :href="v.resUrl" class="al-contentTitle">{{resName(v.refType,v.resName)}}</a>
                    <article class="al-contentMainText">
                        <a href="javascript:void(0)">{{v.resDesc.replace(/<\w+>/g, '').replace(/<\/\w+>/g, "")}}</a>
                    </article>
                    <p class="al-contentOtherMsg">
                        <span v-html="act(v)"></span>
                        <span v-html="uNameOrBName(v.resAuthor,v.videoType)"></span>
                        <span class="icon-contentWatchedNum">{{v.resWatchCount}}</span>
                        <span class="al-contentDelete" :itemType="v.refType" :itemId="v.id" @click="dislikeAction">x</span>
                    </p>
                </article>
            </section>
        </section>
        <section v-else-if="v.attLength==1">
            <section class="al-contentPartModule ev_flow" :itemType="v.refType">
                <div class="al_flow_type">
                    <span class="al_flow_span" :class="typeName(v.refType).type">{{typeName(v.refType).name}}</span>
                    <ul class="al-littleScoreStarBox" v-if="v.scoreNum >= 10">
                        <li v-for="(w,j) in bArr" :key="j">
                            <b :style="setWith(v.score)" v-if="j<parseInt(v.score)"></b>
                        </li>
                    </ul>
                </div>
                <section class="al-tableBox">
                    <article class="al-contentText">
                        <a :href="v.resUrl" class="al-contentTitle">{{getStrByteLen(resName(v.refType,v.resName))}}</a>
                        <p class="al-contentOtherMsg">
                            <span v-html="act(v)"></span>
                            <span v-html="uNameOrBName(v.resAuthor,v.videoType)"></span>
                            <span class="icon-contentWatchedNum">{{v.resWatchCount}}</span>
                            <span class="al-contentDelete" :itemType="v.refType" :itemId="v.id" @click="dislikeAction">x</span>
                        </p>
                    </article>
                    <figure class="al-contentImgBox"  :itemId="itemId(v.refType,v.id)">
                        <a :href="v.resUrl">
                            <img :src="v.attUrl[0]" alt="">
                            <i class="al-videoPlayBtn" v-if="v.playTime != 0">
                                <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                            </i>
                            <span class="al-videoTime" v-if="v.playTime != 0">{{v.playTime.substring(0, 8)}}</span>
                        </a>
                    </figure>
                </section>
            </section>
        </section>
        <section v-else-if="v.attLength==2">
            <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow " :itemType="v.refType">
                <div class="al_flow_type">
                    <span class="al_flow_span" :class="typeName(v.refType).type">{{typeName(v.refType).name}}</span>
                    <ul class="al-littleScoreStarBox" v-if="v.scoreNum >= 10">
                        <li v-for="(w,j) in bArr" :key="j">
                            <b :style="setWith(v.score)" v-if="j<parseInt(v.score)"></b>
                        </li>
                    </ul>
                </div>
                <article class="al-contentText">
                    <a :href="v.resUrl" class="al-contentTitle">
                        {{resName(v.refType,v.resName) }}
                    </a>
                    <ul class="al-contentMiddleImg">
                        <li>
                            <a :href="v.resUrl">
                                <img :src="v.attUrl[0]" alt="">
                                <i class="al-videoPlayBtn" v-if="v.playTime != 0">
                                    <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                                </i>
                                <span class="al-videoTime" v-if="v.playTime != 0">{{v.playTime.substring(0, 8)}}</span>
                            </a>
                        </li>
                        <li>
                            <a :href="v.resUrl">
                                <img :src="v.attUrl[1]" alt="">
                            </a>
                        </li>
                    </ul>
                    <p class="al-contentOtherMsg">
                        <span v-html="act(v)"></span>
                        <span v-html="uNameOrBName(v.resAuthor,v.videoType)"></span>
                        <span class="icon-contentWatchedNum">{{v.resWatchCount}}</span>
                        <span class="al-contentDelete" :itemType="v.refType" :itemId="v.id" @click="dislikeAction">x</span>
                    </p>
                </article>
            </section>
        </section>
        <section v-else>
            <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow " :itemType="v.refType">
                <div class="al_flow_type">
                    <span class="al_flow_span" :class="typeName(v.refType).type">{{typeName(v.refType).name}}</span>
                    <ul class="al-littleScoreStarBox" v-if="v.scoreNum >= 10">
                        <li v-for="(w,j) in bArr" :key="j">
                            <b :style="setWith(v.score)" v-if="j<parseInt(v.score)"></b>
                        </li>
                    </ul>
                </div>
                <article class="al-contentText">
                    <a :href="v.resUrl" class="al-contentTitle">
                        {{resName(v.refType,v.resName) }}
                    </a>
                    <ul class="al-contentMiddleImg">
                        <li>
                            <a :href="v.resUrl">
                                <img :src="v.attUrl[0]" alt="">
                                <i class="al-videoPlayBtn" v-if="v.playTime != 0">
                                    <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                                </i>
                                <span class="al-videoTime" v-if="v.playTime != 0">{{v.playTime.substring(0, 8) }}</span>
                            </a>
                        </li>
                        <li>
                            <a :href="v.resUrl">
                                <img :src="v.attUrl[1]" alt="">
                            </a>
                        </li>
                        <li>
                            <a :href="v.resUrl">
                                <img :src="v.attUrl[2]" alt="">
                            </a>
                        </li>
                    </ul>
                    <p class="al-contentOtherMsg">
                        <span v-html="act(v)"></span>
                        <span v-html="uNameOrBName(v.resAuthor,v.videoType)"></span>
                        <span class="icon-contentWatchedNum">{{v.resWatchCount}}</span>
                        <span class="al-contentDelete" :itemType="v.refType" :itemId="v.id" @click="dislikeAction">x</span>
                    </p>
                </article>
            </section>
        </section>
    </section>
</template>

<script>
    import comm from 'static/js/comm';
    export default {
        props:['v'],
        data(){
           return {
               bArr:[0,1,2,3,4]
           }
        },
        name: "list-content",
        methods:{
            setWith(score){
                return {
                    'width':(score-parseInt(score)* 100)+'%'
                }
            },
            act(kv){
                let _act = "",//获奖>参赛>最热>最新>pdf refType  resUrl  resName resDesc isAward isAttend isNew tplPath resAuthor resWatchCount attUrl playTime
                    _actTitle = '';
                if (kv.isShowActivityTag == 1) {
                    var _color = kv.activityTagColor;
                    _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">' + kv.activityTagName + '</span>';
                }
                if (kv.isAward == 1 || kv.resourceSign == 4) {
                    _act = '<span class="al-contentAward">获奖</span>';
                } else if (kv.isAttend == 1 || kv.resourceSign == 3) {
                    _act = '<span class="al-contentJoin">参赛</span>';
                } else if (kv.isHot == 1 || kv.resourceSign == 2) {
                    _act = '<span class="al-contentHotest">最热</span>';
                } else if (kv.isNew == 1 || kv.resourceSign == 1) {
                    _act = '<span class="al-contentNewest">最新</span>';
                } else if (kv.tplPath == 31 || kv.tplPath == 32 || kv.tplPath == 127) {
                    _act = '<span class="al-contentPdf">PDF</span>';
                }
                if (kv.attLength == 1 && _act && _actTitle) {   //一个图片，并且有标签的，换行
                    var _color = kv.activityTagColor;
                    _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;display:inline-block;margin-bottom:0.2rem;">' + kv.activityTagName + '</span>';
                    _act = _actTitle + _act + '<br/>';
                } else {
                    _act = _actTitle + _act;
                }
                return _act;
            },
            itemId(refType,id){
                let itemId = '';
                switch (parseInt(refType)) {
                    case 2:
                        itemId = 'docId';
                        break;
                    case 4:
                        itemId = 'topicId';
                        break;
                    case 7:
                        itemId = 'caseId';
                        break;
                }
                return itemId + '='+id;
            },
            typeName(refType){
                let type = 'al_flow_case';
                let name = "病例";
                switch (parseInt(refType)) {
                    case 2:
                        type = 'al_flow_doc';
                        name = "文库";
                        break;
                    case 4:
                        type = 'al_flow_topic';
                        name = "话题";
                        break;
                    default:
                        type = 'al_flow_case';
                        name = "病例";
                }
                return {
                    type:type,
                    name:name
                }
            },
            getStrByteLen(resName){
                return comm.getStrByteLen(resName, 44)
            },
            resName(refType,resName){
                if(refType==4&&resName==""){
                    return '话题医起聊';
                }else {
                    return resName;
                }
            },
            uNameOrBName(resAuthor,videoType){
                //列表验证用户名和书籍名称
                let uNameOrBName="";
                if(resAuthor){
                    if(videoType&&(videoType==17||videoType==18||videoType==19)){
                        uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+resAuthor+'</span>';
                    }else{
                        uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+resAuthor+'</span>';//icon-contentAuthor
                    }
                }else{
                    uNameOrBName="";
                }
                return uNameOrBName;
            },
            dislikeAction:function (e) {
                let storeState=this.$store.state;
                storeState.isWholeLine = e.target.parentNode.offsetWidth>window.innerWidth*0.8;
                storeState.target=e.target;
                storeState.contentDelete=true;
                storeState.el=this.$el;
                this.$nextTick(function () {
                    let pT = storeState.target.offsetTop+storeState.el.parentNode.offsetTop- window.pageYOffset;
                    if (window.innerHeight - pT < 150) { //如果下方空间不足，上面显示
                        storeState.setTop= {
                            'top':(pT - 150)+'px'
                        }
                    } else {
                        storeState.setTop={
                            'top':(pT + 150)+'px'
                        }
                    }
                });
                document.body.style.overflow='hidden';

            }
        },
    }
</script>

<style scoped>

</style>