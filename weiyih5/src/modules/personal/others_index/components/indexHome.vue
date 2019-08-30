<template>
    <section>
        <my-detail></my-detail>
       <section @click="gotoInfo" class="eventContainer">
           <section class="personalInfo" v-if="!eventList.length">
               <p>个人资料信息</p>
           </section>
           <section class="eventInfo" v-else>
               <section class="eventTitle">
                   <h2>大事件</h2>
                   <span>详情</span>
               </section>
               <ul class="eventContent">
                   <li v-for="(item,index) in eventList" class="eventItem" v-if="index<4" :class="item.event_type==1?'systemEvent':'userEvent'">{{item.event_name}}</li>
               </ul>
           </section>
       </section>
        <section class="contentCon ev-contentCon" :class="{'contentTabFix':iscontentTab}">
            <section class="contentTab">
              <p class="tabItem" @click="tabChange(1)" :class="{'active':isResurce==1}">专栏<span>{{conNumber>0?conNumber:''}}</span></p>
              <p class="tabItem tabItemNew" @click="tabChange(2)" :class="{'active':isResurce==2}">云云<span>{{boneNumber>0?boneNumber:''}}</span></p>
            </section>
            <contribution v-show="isResurce==1" @totalCount="totalCount" :isResurce="isResurce"></contribution>
            <bone-cloud v-show="isResurce==2" @boneTotal="boneTotal"></bone-cloud>
        </section>
    </section>
</template>

<script>
    import myDetail from "./Detail";
    import Contribution from "./Contribution";
    import boneCloud from "./boneCloud";
    import {mapActions,mapGetters} from "vuex";
    export default {
        name: "index-home",
        data(){
          return{
              isResurce:1,
              conNumber:'',
              boneNumber:'',
              pevconNumber:'',
              pevboneNumber:'',
              isBoneTotal:false,
              isTotalCount:false
          }
        },
        components:{
            myDetail,
            Contribution,
            boneCloud
        },
        computed:{
            ...mapGetters(['eventList','iscontentTab']),
        },
        methods:{
            ...mapActions(['getEvent','commCreatEvent']),
            tabChange(index){
              this.isResurce=index;
              if(index==1){
                  this.commCreatEvent({id:11255});
              }else {
                  this.commCreatEvent({id:11256});
              }
            },
            gotoInfo(){
                this.commCreatEvent({id:11262});
                this.$router.push({
                    path:'Info'
                })
            },
            isResource(data){
                this.isResurce=data;
            },
            totalCount(data){
                this.conNumber=data;
                // if(data==0){
                //     this.isResurce=2;
                // }else {
                //     this.isResurce=1;
                // }
                if(!this.isTotalCount){
                    this.tabNumberChange();
                    this.isTotalCount=true;
                }

            },
            boneTotal(data){
                this.boneNumber=data;
                if(!this.isBoneTotal){
                    this.tabNumberChange();
                    this.isBoneTotal=true;
                }

            },
            tabNumberChange(){
                if(this.conNumber){
                    this.isResurce=1;
                }else {
                    if(this.boneNumber){
                        this.isResurce=2;
                    }else {
                        this.isResurce=1;
                    }
                }
            }
        },
        mounted(){
            this.getEvent({paramJson:JSON.stringify({customerId:this.$store.state.otherId})})
        }
    }
</script>

<style scoped lang="scss">


</style>