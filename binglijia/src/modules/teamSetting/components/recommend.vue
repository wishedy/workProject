<template>

    <div class="recommend"  v-if="!recommendOnOff"><!--v-show="!recommendOnOff"-->
        <h4>为您推荐（{{recommendListNum}}）</h4>
        <ul>
            <li v-for="(person,index) in recommendList">
                <div>
                    <p class="userImg"><img :src="person.url|getLogoUrl"/> </p>
                    <p class="userName">{{person.authorName,5|dateNameChange}}</p>
                    <p class="userTitle">{{person.medicalTitle,4|dateNameChange}}</p>
                    <p class="userHospital">{{person.company,8|dateNameChange}}</p>
                </div>
                <p class="check" :class="{active:indexItem.indexOf(index)!=-1}"
                   @click.stop="itemCli({name:person.authorName,cid:person.customerId,index:index})"></p>
            </li>
        </ul>
    </div>

</template>
<script>
const $ = require('jquery');
import comm from '../../../utils/comm.js';
import {mapActions,mapGetters} from 'vuex';
export default {
    name: 'index-app',
    props:['nameDel'],
    data() {
        return {
            recommendOnOff:false,
            indexItem:[],
            nameItem:[],
            recommendList:[],
            customerId: comm.cookie.get("userId"),
            recommendListNum:'',//推荐人数
            ajaxing:false,//表示正在请求
            isNOne:false,//表示已经没有数据
            firstResult:0,
            maxResult:10
        }
    },
    components: {
    },
    watch:{
        nameDel(){
            let t=this;
            if(t.nameDel.flag){
                //选中元素
                for (let i=0;i<t.recommendList.length;i++){
                    if(t.nameDel.cid==t.recommendList[i].customerId){
                        t.indexItem.push(i);
                    }
                }
                t.nameItem.push(this.nameDel.cid);
            }else{
                if(t.nameItem.indexOf(t.nameDel.cid)!=-1){
                    t.indexItem.splice(t.nameItem.indexOf(t.nameDel.cid), 1);
                    t.nameItem.splice(t.nameItem.indexOf(t.nameDel.cid), 1);
                }
            }
        },
        titleOnOFF(){
            let t=this;
            if(!t.titleOnOFF) {//监听第二步骤开始再请求列表
                t.getRecommendList();
            }
        }
    },
    methods:{
        ...mapActions(['ChangeCliInputNone','changeLoading']),
        itemCli(obj){
            let t = this;
            t.ChangeCliInputNone(true);
            if(t.indexItem.indexOf(obj.index)!=-1){
                //移除元素
                t.indexItem.splice(t.indexItem.indexOf(obj.index), 1);
                t.nameItem.splice(t.indexItem.indexOf(obj.index), 1);
                t.$emit('PeopleList',{name:obj.name,add:false,cid:obj.cid});
            }else {
                //选中元素
                t.indexItem.push(obj.index);
                t.nameItem.push(obj.cid);
                t.$emit('PeopleList',{name:obj.name,add:true,cid:obj.cid});
            }
        },
        //获取推荐列表
        getRecommendList(){
            let t = this;
            t.ajaxing = true;
            t.changeLoading(true);
            comm.ajax2({
                url: '/call/customer/auth/getCasefolderRecommendCustomerList/',
                type: "get",
                data: {
                    paramJson: JSON.stringify({
                        "customerId": t.customerId,
                        "visitSiteId": 1,
                        "firstResult": t.firstResult*t.maxResult,
                        "maxResult": t.maxResult
                    })
                },
                success: function (res) {
                    t.ajaxing = false;
                    t.changeLoading(false);
                    if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                        $(window).off('scroll').on('scroll',function () {
                            let scrollTop = $(this).scrollTop();
                            let scrollHeight = $(document).height();
                            let windowHeight = $(this).height();
                            if (scrollTop + windowHeight == scrollHeight) {
                                if (!t.ajaxing && !t.isNOne) {
                                    t.getRecommendList();
                                }
                            }
                        });
                    }
                    if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                        // t.recommendList = res.responseObject.responseData.data_list;
                        t.recommendList = t.recommendList.concat(res.responseObject.responseData.data_list);
                        t.recommendListNum = res.responseObject.responseData.total_num;
                        t.firstResult++;
                        if(res.responseObject.responseData.data_list.length<t.maxResult){
                            t.isNOne = true;
                        }
                        t.recommendOnOff = false;
                    }else {
                        if(t.recommendList!=''){
                            t.isNOne = true;
                        }else{
                            t.recommendOnOff = true;
                        }
                    }
                }
            })
        },
    },
    computed:{
        ...mapGetters(['titleOnOFF','cliInputNone']),
    },
    filters:{
        dateTypeChange:function (date) {
            if(date){
                let newDate = date.split(",");
                newDate=newDate[0].split('_');
                return newDate[2];
            }
        },
        dateNameChange:function (txt,num) {
            return comm.getStrLen(txt,num*2);
        },
        getLogoUrl(url){
            return url.replace("http:","").replace("https:","");
        }
    },
    async mounted() {
        // this.getRecommendList();
        let t = this;

    },
    metaInfo: {
        title: '团队设置'
    }
}
</script>

