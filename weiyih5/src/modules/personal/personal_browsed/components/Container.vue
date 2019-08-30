<template>
    <section>
        <section class="al-noContentTips ev-noBrowse" v-show="noData">
            <figure>
                <img src="//img50.allinmd.cn/pages/personal/no_browsed.png" alt="">
            </figure>
        </section>
        <!-- 主内容区域 根据导航栏激活条目显示 -->
        <section class="al-recordListBox ev-browseRecordBox" data-alcode-mod='474'>
            <section class="al-recordList ev-cBrowse" v-for="item in groupData" :data-style="item.dataStyle" v-if="item.dataStatus">
                <header class="al-recordListTitle">{{item.dayDescription}}</header>
                <a v-for="list in item.list" :href="list.browseUrl">
                    <article class="al-recordListItem">
                        <span class="al-recordListItemType">{{list.browseType | getBrowseType}}</span>
                        <article>
                            <span class="al-recordListItemContent">{{list.refName | getStrLen(38) }}</span>
                        </article>
                        <i class="icon-arrowRight"></i>
                    </article>
                </a>
            </section>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    import commdate from 'static/js/comm.date.js'
    import Loading from 'components/Loading/Loading'

    const path={
        browse:'/mcall/log/customer/browse/json_list/'
    };
    export default{
        data(){
            return {
                data:{
                    browseTypes:"4,5,9,10",
                    customerId: TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
                    dataFlag:3,
                    groupType:1,
                    pageIndex:1,
                    pageSize: 20
                },
                groupData:[{dayDescription: "今天", dataStyle:"today",dataStatus: false, list: []},
                    {dayDescription: "昨天", dataStyle:"yesDay", dataStatus: false, list: []},
                    {dayDescription: "更早", dataStyle:"longAgo", dataStatus: false, list: []}],
                noData:false,
                noMore:false,
                ajaxing:false
            }
        },
        methods:{
            //获取浏览数据
            getBrowse(){
                let t=this;
                t.ajaxing=true;
                comm.ajax2({
                    url:path.browse,
                    type:"post",
                    data:t.data,
                    success:function(res){
                        t.ajaxing=false;
                        t.data.pageIndex++;
                        let options={
                            success(res){
                                if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                                    let result=res.responseObject.responseData.data_list;
                                    //计算今天日期     [{dayDescription : "今天",list: {数据}},]
                                    let currDate = commdate.local_time().substr(0, 10);
                                    for (let i = 0; i < result.length; i++) {

                                        let srcDate = result[i].openTime.substr(0, 10);
                                        if (currDate == srcDate) {//今天
                                            t.groupData[0].dataStatus = true;
                                            t.groupData[0].dayDescription = "今天";
                                            t.groupData[0].list.push(result[i]);
                                        } else if (Date.parse(currDate) - Date.parse(srcDate) == 86400000) { //昨天
                                            t.groupData[1].dataStatus = true;
                                            t.groupData[1].dayDescription = "昨天";
                                            t.groupData[1].list.push(result[i]);
                                        } else { //更早以前
                                            t.groupData[2].dataStatus = true;
                                            t.groupData[2].dayDescription = "更早";
                                            t.groupData[2].list.push(result[i]);
                                        }
                                    }
                                }else {
                                    if(t.data.pageIndex==2){
                                        t.noData=true;
                                    }
                                    t.noMore=true;
                                }

                            },
                            failed(){
                                if(t.data.pageIndex==2){
                                    t.noData=true;
                                }
                                t.noMore=true;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                })
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore){
                            t.getBrowse();
                        }
                    }
                }
            }
        },
        mounted(){
            this.getBrowse();
            this.scroll();
        },
        components:{
            Loading
        },
        filters:{
            getStrLen : function(str,len){
                return comm.getStrLen(str,len)
            },
            getBrowseType:function(type){
                let browseType="";
                switch (type){
                    case 4:
                        browseType='视频';
                        break;
                    case 5:
                        browseType='文库';
                        break;
                    case 9:
                        browseType='话题';
                        break;
                    case 10:
                        browseType='病例';
                        break;
                    default :
                        break;
                }
                return browseType;
            }
        }
    }
</script>