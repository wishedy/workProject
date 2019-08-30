<template>
    <section class="al-tabBar">
        <section class="al-tab-item" :class="{'active':parseInt(tabIndex,10)<=0}" @click.stop="changeTab(0)">介绍</section>
        <section class="al-tab-item" :class="{'active':parseInt(tabIndex,10)===1}" @click.stop="changeTab(1)">课程<em>{{courseNum}}<i v-show="parseInt(courseTotal,10)!==parseInt(courseNum,10)">持续更新</i></em></section>
        <section class="al-tab-item" :class="{'active':parseInt(tabIndex,10)===2}" @click.stop="changeTab(2)">交流<em v-text="chatTotal"></em></section>
    </section>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from 'static/js/comm.js';
    import TempCache from "static/js/tempcache";
    let cid = TempCache.getItem('userId');
    let courseId = comm.getparaNew().courseId;
    export default {

        data(){
            let cid = TempCache.getItem('userId');
            let courseId = comm.getparaNew().courseId;
          return {
              cid:cid,
              courseId:courseId
          }
        },
        props:{
            tabIndex:{
                default(){
                    return 0;
                }
            }
        },
        computed:{
          ...mapGetters(['tabActiveIndex','chatTotal','courseTotal','courseNum'])
        },
        mounted(){
          const _this = this;
          setTimeout(()=>{
              console.log(_this.courseTotal,_this.courseNum);
          },2000);
        },
        methods:{
            ...mapActions(['changeActiveIndex']),
            changeTab(index){
                const _this = this;
                var param = `name$${_this.courseId}`;
                console.log(index+"==="+parseInt(_this.tabActiveIndex));
                if(index!==parseInt(_this.tabActiveIndex)){
                    switch (parseInt(index,10)) {
                        case 0:
                            comm.creatEvent({
                                triggerType:"课程详情页",
                                keyword:'点击课程导航',
                                browType:415,
                                actionId:11755,
                                refId:_this.courseId
                            });
                            break;
                        case 1:
                            comm.creatEvent({
                                triggerType:"课程详情页",
                                keyword:'点击介绍导航',
                                browType:415,
                                actionId:11756,
                                refId:_this.courseId
                            });
                            break;
                        case 2:
                            comm.creatEvent({
                                triggerType:"课程详情页",
                                keyword:'点击交流导航',
                                browType:415,
                                actionId:11757,
                                refId:_this.courseId
                            });
                            break;
                    }
                    _this.changeActiveIndex(index);
                }
            }
        }
    }
</script>
