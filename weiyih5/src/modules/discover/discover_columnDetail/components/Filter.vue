<template>
    <section class="boneClass" id="nav">
        <section :style="{height:placeholder}"></section>
        <section :style="fixed">
            <aside class="boneClassNav">
                <aside class="boneClassNavCont">
                    <ul>
                        <li v-for="(v,i) in category" :class="{'active':v.categoryId===cacheId}" @click="firstFilter(v.categoryId,i,v.categoryName)">{{v.categoryName}}</li>
                    </ul>
                </aside>
            </aside>
            <aside class="tagList" v-show="cacheId!=0">
                <ul :class="!up?'oneColumn':'moreMaxHeight'" id="secondData" :style="{height:high}">
                    <li v-for="(val,ind) in sonCategory" :class="{'active':ind===sonIndex}" @click="secondFilter(val.sonCategoryId,ind)">{{val.sonCategoryName,18 | cut}}<span>{{val.resourceNum}}</span></li>
                </ul>
                <div class="packUp" :style="up?'borderTop:1px solid #e2e2e2':''"><p @click="unfold" v-show="un">展开</p><span @click="packUp" v-show="up">收起</span></div>
            </aside>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import Vue from "vue";
    import axios from "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import TempCache from "static/js/tempcache";
    import {mapActions} from "vuex";
    const path = "/mcall/special/getSpecialCategoryList/";
    const customerId = TempCache.getItem('userId')||"";
    const specialId = comm.getpara().columnId||"";
    export default {
        data(){
            return {
                category:[],
                sonCategory:[],
                nowIndex:0,
                sonIndex:0,
                ajaxing:false,
                un:true,
                up:false,
                fixed:{},
                placeholder:'',
                public:{},
                cacheId:'',
                high:'',
            }
        },
        methods:{
            tagData(){
                this.ajaxing = true;
                axios({
                    url:path,
                    method:"POST",
                    data:{
                        customerId,
                        specialId,
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data)
                    }],
                    headers:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    this.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        if(dataList.length){
                            this.category = dataList;
                            //this.$nextTick();
                        }
                    }
                })
            },
            firstFilter(id,index,keyword){
                this.cacheId = id;
                this.nowIndex = index;
                this.firstTag({id});
                this.un = true;
                this.up = false;
                comm.creatEvent({
                    triggerType:'筛选排序',
                    trigger_name:"一级筛选",
                    keyword,
                    browsetype_url:specialId,
                    push_message_id:id,
                    actionId:11038,
                    browsetype:218
                });
                this.high = '';
            },
            secondFilter(id,index){
                this.sonIndex = index;
                this.secondTag({id});
                this.un = true;
                this.up = false;
                this.high = '';
                $('#secondData').scrollTop(0);
            },
            unfold(){
                let t = this;
                this.un = false;
                this.up = true;
                comm.creatEvent({
                    triggerType:'展开',
                    actionId:11024
                });
                setTimeout(function(){
                    let element = document.querySelector('.moreMaxHeight');
                    let high  = parseInt(element.offsetHeight/75);
                    if(high>6.94){
                        t.high = '6.94rem';
                    }else{
                        t.high = '';
                    }
                },50);
            },
            packUp(){
                this.un = true;
                this.up = false;
                this.high = '';
                //  $('#secondData').scrollTop(0);
            },
            ...mapActions(["firstTag","secondTag"]),
        },
        mounted(){
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem(specialId)){
                var _tempData = JSON.parse(TempCache.getItem(specialId));
                this.category = _tempData.data;
                this.cacheId =  _tempData.id;
                if(this.category[_tempData.index].sonCategoryList){
                    this.sonCategory = this.category[_tempData.index].sonCategoryList;
                }

                let data = this.sonCategory;
                let str = '';
                for(var i=0,le=data.length;i<le;i++){
                    str += data[i].sonCategoryName
                }
                if(str.length){
                    if(str.length<10){
                        this.un = false;
                    }
                }
            }else{
                this.tagData();
            }
        },
        //监听数据data
        watch:{
            nowIndex(){
                if(this.category[this.nowIndex].sonCategoryList){
                    this.sonCategory=this.category[this.nowIndex].sonCategoryList;
                }

                let data = this.sonCategory;
                let str = '';
                for(let i=0,le=data.length;i<le;i++){
                    str += data[i].sonCategoryName
                }
                if(str.length){
                    if(str.length<10){
                        this.un = false;
                    }
                }

                this.public.id = this.category[this.nowIndex].categoryId;
                this.public.index = this.nowIndex;
                this.public.data = this.category;

                TempCache.setItem(specialId,JSON.stringify(this.public));

//                this.cacheId = this.public.id;
                this.sonIndex = 0;
            },
            "$store.state.nav"(string){
                if (parseInt(string, 10) === 1) {
                    this.fixed = {
                        "position": "fixed",
                        "top": 0,
                        "left": 0,
                        "right": 0,
                        "background": "#fff",
                        "z-index": 2,
                        "margin-top":0
                    }
                    this.placeholder = '3rem';
                }else if(parseInt(string, 10) === 0){
                    this.fixed = {};
                    this.placeholder = '';
                }
            }
        },
        components:{
            Loading
        },
        filters:{
            cut:(v1,v2)=>comm.getStrLen(v1,v2)
        }
    }
</script>

<style>
    .tagList p:after {
        content: '';
        display: inline-block;
        background: url(//img50.allinmd.cn/classes/course_directory_unfold.png) no-repeat;
        width: 0.26667rem;
        height: 0.26667rem;
        background-size: contain;
        vertical-align: middle;
        margin-left: 0.08rem;
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }.tagList .packUp span:after {
         content: '';
         display: inline-block;
         background: url(//img50.allinmd.cn/classes/course_directory_unfold.png) no-repeat;
         width: 0.26667rem;
         height: 0.26667rem;
         background-size: contain;
         vertical-align: middle;
         margin-left: 0.08rem;
         -webkit-transform: rotate(180deg);
         -ms-transform: rotate(180deg);
         transform: rotate(180deg);
     }
    .tagList ul.moreMaxHeight {
        height: auto;
        overflow: auto;
    }

</style>