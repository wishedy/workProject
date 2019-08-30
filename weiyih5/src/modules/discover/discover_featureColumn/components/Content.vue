<template>
    <section class="discoverV2 characteristicColumn" data-alcode-mod="728">
        <section class="goingActivity" v-for="(v,i) in item" v-show="item.length!=0" :key="i">
            <section class="columnLeftRight">
                <figure class="ads"><a :href="'./discover_columnDetail.html?columnId='+v.specialId"><img :src="v.attUrl"></a></figure>
                <aside class="textCont">
                    <div>
                        <a :href="'./discover_columnDetail.html?columnId='+v.specialId"><span>{{v.specialTitle}}</span></a>
                        <button class="Ev-FollowBtn" :class="v.followState==1?'active' :''" @click="follow(v.followState,v.specialSubTitle,v.specialId,i)">{{v.followState==1?'已关注':'关注'}}</button>
                    </div>
                    <p class="describe"><a :href="'./discover_columnDetail.html?columnId='+v.specialId">{{v.specialSubTitle}}</a></p>
                    <p class="introduction"><a :href="'./discover_columnDetail.html?columnId='+v.specialId">{{v.specialContent,28 | cut}}</a></p>
                </aside>
            </section>
            <aside class="goingTime">
                <!--<ul class="text">-->
                <!--<li class="timer"><i></i>{{time modifyTime}}</li>-->
                <!--</ul>-->
            </aside>
        </section>
        <section class="lastTime" v-show="noData">~  到底了  ~</section>
        <Loading v-show="ajaxing"></Loading>
        <Popup :popup-config="popupConfig"></Popup>
    </section>
</template>

<script>
    import axios from "axios";
    import Loading from "components/Loading/Loading";
    import comm from "static/js/comm";
    import Popup from "components/PopupLayer/PopupLayer";
    import TempCache from "static/js/tempcache";
    import {mapActions} from "vuex";
    import user from "static/js/module.user"
    const path = {
        list: "/mcall/special/getSpecialList/",
        follow: "/mcall/customer/follow/resource/create/",       //关注
        cancelFollow:"/mcall/customer/follow/resource/delete/"  //取消关注
    };
    const customerId = TempCache.getItem('userId')||"";
    const platformId = TempCache.getItem('department')||1;
    export default {
        data(){
            return {
                item:[],
                itemLen:'',
                ajaxing:true,
                noData:false,
                index:1,
                i:'',
                id:'',
                refName:'',
                popupConfig:{}    //该对象存储弹层信息
            }
        },
        methods:{
            columnList(){
                this.ajaxing = true;
                axios({
                    url:path.list,
                    method:"POST",
                    data:{
                        customerId,
                        "sortType":"1",
                        "isValid":"1",
                        platformId,
                        "pageIndex":this.index,
                        "pageSize":10
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data)
                    }],
                    header:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    this.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        this.item  = this.item.concat(dataList);
                        this.index++;
                        if(dataList.length<10){
                            this.noData = true;
                        }
                    }else{
                        this.noData = true;
                    }
                }).catch(r=>{
//                    console.log('错误····');
                })
            },
            scroll(){
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData){
                            t.columnList();
                        }
                    }
                },false);
            },
            follow(follow,refName,id,i){
                let t = this;
                t.refName = refName;
                t.id=id;
                t.i = i;
                if (follow != 1) {
                    user.privExecute({
                        operateType: 'auth',
                        noNeedBack:true,
                        callback: function () {
                            t.ajaxing = true;
                            comm.creatEvent({
                                triggerType: '关注',
                                refName:t.refName,
                                actionId: 11022,
                                push_message_id: t.d,
                                browsetype: 43
                            });
                            axios({
                                url: path.follow,
                                method: "POST",
                                data: {
                                    refId: id,
                                    followType: "8",
                                    refName:t.refName,
                                    customerId
                                },
                                transformRequest: [data=>{
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res => {
                                t.ajaxing = false;
                                if (res && res.data.responseObject.responseStatus == true) {
                                    t.popupConfig = JSON.stringify({
                                        "msg":"已关注",
                                        "seen":true,
                                        "time":1500      //这里可以设置多少毫秒消失
                                    });
                                    setTimeout(function () {
                                        t.popupConfig = JSON.stringify({
                                            "msg":"已关注",
                                            "seen":false,
                                            "time":1500      //这里可以设置多少毫秒消失
                                        });
                                    },100);
                                    t.item[t.i].followState = 1;
                                }
                            })
                        }
                    });

                } else {
                    this.change(true);
                }
            },
            ...mapActions(["change","changeEn"]),
        },
        mounted(){
            this.columnList();
            this.scroll();
        },
        components:{
            Loading,
            Popup
        },
        watch:{
            "$store.state.isEnsure"(){
                this.ajaxing = true;
                comm.creatEvent({
                    triggerType: '关注',
                    refName:this.refName,
                    push_message_id: this.id,
                    actionId: 11022,
                    browsetype: 43
                });
                axios({
                    url:path.cancelFollow,
                    method:"POST",
                    data:{
                        refId: this.id,
                        followType: "8",
                        refName:this.refName,
                        customerId
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
                        this.item[this.i].followState = 0;
                    }
                    this.changeEn(false);
                })
            }
        },
        filters:{
            cut:(v1,v2)=>comm.getStrLen(v1,v2),
        }
    }
</script>