<template>
    <section class="al-transformerListBox">
        <header class="al-personalContributionHeader ev-subNav">
            <h2 class="al-personalContributionTitle">
                <span class="labelsType">{{nowIndex | judge}}{{nowIndex==0?'译者':''}}{{'  '+count}}</span><span class="contributionNum"></span>
            </h2>
            <section class="al-personalContributionSelector" :class="unfold?'al-personalSelectorOn':''" v-show="count>0">
                <h2 @click="toggle()">全部</h2>
                <ul data-alcode-mod='443' data-alcode-item-selector="li">
                    <li class="al-personalContributionSelectorItem" :class="v==nowIndex?'active':''" v-for="(v,i) in item" @click="changeIndex(v)">{{v | judge}}</li>
                </ul>
            </section>
        </header>
        <section class="al-content al-doctorRecommend" data-alcode-mod='444'>
             <section class="al-doctorRecommendItem" v-for="(v,i) in nowConentList">
                <figure class="al-doctorRecommendImg">
                    <figure class="al-doctorRecommendImg">
                        <a href="javascript:;" @click="jump(v.customerId,v.state)">
                            <img :src="v.url" alt="">
                        </a>
                    </figure>
                </figure>
                <article class="al-doctorRecommendMsg">
                    <a class="al-doctorRecommendName" href="javascript:;"  @click="jump(v.customerId,v.state)">{{v.authorName}}<i v-if="grade(v.state)" class="al-vipUser"></i></a>
                    <span class="al-doctorRecommendJob" v-if="v.medicalTitle">{{v.medicalTitle}}</span>
                    <span class="al-doctorRecommendHospital">{{v.company}}</span>
                </article>
                <aside class="al-fellowAuthor ev-followBtn" v-if="v.customerId!=0">
                    <a href="javascript:;" v-if="v.customerId!==requestParam.customerId" @click="follow(v.relationship,v.customerId,i)" :class="sty(v.relationship)" style="cursor:pointer;" >{{v.relationship | compile}}</a>
                </aside>
            </section>
            <section class="lastTime" v-show="nodata&&!noTranslator">~  没有更多了  ~</section>
            <div class="al-eBookNoContent" v-show="noTranslator">
                <img src="//img50.allinmd.cn/pages/eBook/eBookNoContentImg.png" alt="">
            </div>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import TempCache from "static/js/tempcache";
    import user from "static/js/module.user";
    import axios from "axios";
    import commPopup from "static/js/commPopup";
    const PATH = "/mcall/cms/doc/getMapAuthorList/";
    const TID = comm.getpara("?").bookId || "";
    const CUSTOMERID = TempCache.getItem('userId') || "";
    export default{
        data(){
            return {
                requestData:{
                    "docId":TID,
                    "logoUseFlag":4,
                    "visitSiteId":2,
                    "pageIndex":1,
                    "pageSize":99,
                    "authorType":0,
                    "customerId":CUSTOMERID
                },
                requestParam:{
                    tagId: TID,
                    pageIndex: 1,
                    pageSize: 20,
                    customerId: CUSTOMERID,
                    scene: 2,
                },
                item:[],
                nowIndex:Number,
                resourceList:[],
                nowConentList:[],
                count:'',
                unfold:true,
                ajaxing:false,
                nodata:false,
                noTranslator:false,
                typeName:'全部译者'
            }
        },
        mounted(){
            this.dataList();
        },
        watch:{
            nowIndex(newNum,oldNum){
                this.clickSwitch(newNum);
            }
        },
        methods:{
            changeIndex(v){
                let t =this;
                t.unfold = false;
                t.ajaxing = true;
                t.nodata = false;
                t.nowIndex = parseInt(v,10);
            },
            dataList(){
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: PATH,
                    type: "post",
                    data: {paramJson: JSON.stringify(t.requestData)},
                    dataType: "json",
                    success: function (res) {
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                            	if(comm.hasResponseData(res)){
									t.item = (0+","+res.responseObject.responseData.authorType).split(",");
									t.count = res.responseObject.responseData.total_count;
									let data = res.responseObject.responseData.data_list;

									let allData = {
										authorType:0,
										authorTypeName: "全部",
										data_list:[]
									};
									for(let num = 0;num<data.length;num++){
										allData.data_list = allData.data_list.concat(data[num].data_list);
									}
									data.push(allData);
									t.resourceList = data;
									t.nowIndex = 0;
									t.nodata = true;
									t.requestData.pageIndex++;
                                }else{
                            		t.noTranslator = true;
                            		t.count=0;
									t.nowIndex = 0;
                                }

//                                if(dataList.length<6){
//                                    t.noData = true;
//                                }

                            },
                            failed() {

                               if(t.requestData.pageIndex>1){
                                   t.noData = true;
                               }else{
                                   //console.log('这里无文章应该配置默认图');
								   t.noTranslator = true;
								   t.count=0;
								   t.nowIndex = 0;
                               }
                               return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                });
            },
            clickSwitch(v){
                let t = this;
                for(let num = 0;num<t.resourceList.length;num++){
                    if(parseInt(v,10)===parseInt(t.resourceList[num].authorType,10)){
                        t.nowConentList  = t.resourceList[num].data_list;
                        t.count = t.resourceList[num].data_list.length;
                        break;
                    }
                }
                setTimeout(function(){
                    t.ajaxing = false;
                    t.nodata = true;
                },500);
            },
            toggle(){
                this.unfold = !this.unfold;
            },
            follow(isfo,id,i){
                let t = this;
                user.privExecute({
                    operateType:'auth',
                    callback:function(){
                        if(isfo!=2){
                            t.ajaxing = true;
                            axios({
                                url:'/mcall/customer/follow/people/create/',
                                method:"POST",
                                data:{
                                    "dataFlag":2,
                                    "refId":id
                                },
                                transformRequest: [data=>{
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res=>{
                                t.ajaxing = false;
                                if(res.data.responseObject.responseStatus){
                                    t.nowConentList[i].relationship = 2;
                                }
                            })
                        }
                    },
                    noNeedBack:true
                });
            },
            sty(v){
                if(v==2){
                    return 'al-doctorRecommendFollowed btn-done';
                }else if(v=='' || v==1){
                    return 'al-doctorRecommendFollow btn-primary';
                }
            },
            grade(state){
                if(state==2||state==7||state ==8 ||state ==9){//认证
                    return true;
                }else{
                    return false;
                }
            },
            jump(id,state){
                if(id==0||typeof id=='undefined'){//不存在
                    commPopup.popup('该用户尚未注册唯医');
                }else{
                    g_sps.jump(null,'//m.allinmd.cn/dist/personal/others_index.html?cid='+id);
                }
            }
        },
        components:{
            Loading
        },
        filters:{
            judge:v=>{
               let str = '';
               switch(parseInt(v)){
                   case 2:
                       str = '主译'; break;
                   case 0:
                       str = '全部'; break;
                   case 6:
                       str = '副主译'; break;
                   case 7:
                       str = '终审'; break;
                   case 8:
                       str = '二校'; break;
                   case 9:
                       str = '一校'; break;
                   case 10:
                       str = '翻译'; break;
                   case 15:
                       str = '主编'; break;
                   case 16:
                       str = '副主编'; break;
                   case 17:
                       str = '编者'; break;
                   case 11:
                       str = '参编助理'; break;
               }
               return str;
            },
            compile:v=>{
                if(v==2){
                    return '已关注';
                }else if(v=='' || v==1){
                    return '关注';
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .al-personalSelectorOn{
        .al-personalContributionSelectorItem{
            display:block;
        }
    }
    .al-mainInner{
        overflow: visible;
    }
    .lastTime {
        font-size: .4rem;
        color: #626f8c;
        padding: .58667rem 0;
        text-align: center;
        background-color: #eff4f8;
    }
    .al-doctorRecommend{
        padding-left:0;
    }
    .al-doctorRecommendItem{
        padding-left:0.4rem;
    }
</style>