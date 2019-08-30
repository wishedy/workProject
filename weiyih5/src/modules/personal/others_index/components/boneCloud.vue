<template>
   <section @click="callApp('更多动态')">
       <section class="boneCloud" v-for="(item,index) in boneList" @click="commCreatEvent({id:11264,locationId:item.resId})">
           <section class="boneAutor">
               <section class="autorHead">
                   <img :src="item.resCustomerLogo">
                   <figure class="autorInfo">
                       <span class="autorName">{{item.resCustomerName}}<i :class="{'autorIcon':item.resCustomerState==8}" v-if="item.resCustomerState==2||item.resCustomerState==8||item.resCustomerState==9||item.resCustomerState==7"></i></span>
                       <span class="autorMedical">{{item.resCustomerTitle}}&nbsp;</span>
                       <span class="autorHospital">{{item.resCustomerCompany}}</span>
                   </figure>
                   <p class="publicTime">{{dataTime(item.resCreateTime)}}</p>
               </section>
               <p class="autorDesc">{{getStrByteLen(item.resContent,100)}}</p>
               <p class="autorDescAll" v-if="getByteLen(item.resContent)>100">全文</p>
           </section>
           <section class="contentCon">
               <!--一张照片-->
               <section class="oneImgCon" v-if="item.resAttUrl.length==1&&item.resAttType!=1&&item.resType==22">
                   <img :src="eleItem.picUrl" v-for="(eleItem,eleIndex) in item.resAttUrl">
               </section>
               <!--多张照片-->
               <section class="moreImgCon" v-if="item.resAttUrl.length>1&&item.resAttType!=1&&item.resType==22">
                   <img :src="eleItem.picUrl" v-for="(eleItem,eleIndex) in item.resAttUrl">
               </section>
               <!--视频-->
               <section class="oneVideoCon" v-if="item.resAttType==1&&item.resType==22&&item.resAttUrl.length">
                   <img :src="item.resAttUrl[0].picUrl||'/static/images/personal/page-1-artboard.png'">
                   <span></span>
               </section>
               <!--笔记-->
               <section class="nodeCon" v-if="item.resType==21&&item.resAttUrl.length">
                   <img :src="item.resAttUrl[0].picUrl||'/static/images/personal/page-1-artboard.png'">
                   <span>笔记 | {{item.resAttUrl[0].playTime}}</span>
               </section>
           </section>
           <section class="boneFooter">
               <div class="boneTag" v-if="item.resType==22&&item.itemTitle" :class="{'disease':item.itemType==72,'warLock':item.itemType==71}">
                    <span>{{item.itemTitle}}</span>
               </div>
               <div class="nodeAuthor" v-if="item.resType==21">
                    <img :src="item.itemPicUrl"/>
                   <div class="nodeAuthorDesc">
                       <p class="descTitle">{{item.itemTitle}}</p>
                       <p class="descName">{{item.itemCustomerName}}</p>
                   </div>
               </div>
               <div class="boneNum">
                   <span class="reviewNum">{{toWKH(item.reviewNum,'评论')}}</span>
                   <span class="likeNum" :class="{'active':parseInt(item.upState)}">{{toWKH(item.upNum,'点赞')}}</span>
               </div>
           </section>
       </section>
       <section class="al-personalContributionNone" v-show="!boneList.length" @click.stop>
           <img src="/static/images/personal/nocontent.png" alt="">
           <p class="al-personalPushContribution">暂无云云</p>
       </section>
       <button class="moreBoneCloud" v-if="total>3" @click="commCreatEvent({id:11284})">查看更多</button>
       <section class="al-personalContributionOver" v-if="total<=3&&boneList.length">
           <span>~</span>没有更多了<span>~</span>
       </section>
   </section>
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import commDate from 'static/js/comm.date.js'
    const  bonePath={
        movement:'/mcall/customer/movement/getMapList/'
    };
    export default {
        name: "bone-cloud",
        data(){
            return{
                boneList:[
                ],
                authState:'',
                total:0
            }
        },
        computed:{
            ...mapGetters(["customerInfo"]),
        },
        methods:{
            ...mapActions(['callApp','changeIsAjax','commCreatEvent']),
            getByteLen(str){
              return comm.getByteLen(str)
            },
            getStrByteLen(str,len){
              return comm.getStrByteLen(str,len)
            },
            movement(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:bonePath.movement,
                    type:'post',
                    data:{paramJson:JSON.stringify({
                            "customerId":t.$store.state.otherId,
                            // "customerId":'1538991962016',
                            sortType:1,
                            isValid:1,
                            pageIndex:1,
                            pageSize:3
                        })},
                    success:(data)=>{
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.dataList){
                            t.boneList=data.responseObject.responseData.dataList;
                            t.total=data.responseObject.responseData.total;
                            t.$emit('boneTotal',data.responseObject.responseData.total)
                        }else {
                            t.$emit('boneTotal',0)
                        }
                    }
                })
            },
            toWKH(val,str){
                if(val>0){
                    return comm.toWKH(val)
                }else {
                    return str;
                }

            },
            dataTime(time){
                return commDate.diffDay_three(time,commDate.local_time())
            }
        },
        mounted(){
            this.movement();

        },
    }
</script>

<style scoped lang="scss">

</style>