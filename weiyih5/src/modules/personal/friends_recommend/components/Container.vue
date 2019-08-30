<template>
    <section>
        <section class="al-content al-doctorRecommend al-personalContent ev-reDoc" data-alcode-mod="493">
            <userList v-for="(value,key) in list" :item ="value" :key="key"></userList>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    import Loading from 'components/Loading/Loading'
    import userList from 'components/ListTemplate/UserList'

    const path={
      reDoc:"/mcall/recommend/customer/first/json_list3/"
    };
    export default{
        data(){
            return {
                pageIndex:1,
                style:'',
                list:[],
                noData:false,
                noMore:false,
                ajaxing:false,
                params:{
                    sessionCustomerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",
                    customerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",
                    pageIndex:1,
                    pageSize:10,
                    scene:10,
                    isHome:1,
                    platformId:TempCache.getItem('department'),
                    flag:1,
                    score:0
                }
            }
        },
        methods:{
            getList(){
              let t=this;
              t.ajaxing=true;
              comm.ajax2({
                type : "post",
                url : path.reDoc,
                data : {paramJson:JSON.stringify(t.params)},
                dataType : "json",
                success : function(rep){
                  let options={
                    success(rep){
                      t.ajaxing=false;
                      let rows=rep.responseObject.responseData.data_list;
                      let scoreList = rep.responseObject.responseData.score_list;
                      if(scoreList&&scoreList[0]){
                        for(let _i in scoreList[0]){
                          if(_i==1){
                            t.params.score = scoreList[0][1];
                          }
                        }
                      }
                      for(let i=0;i<rows.length;i++){
                        let json = {};
                        json.userName=rows[i].customerName;
                        json.medicalTitle=rows[i].medicalTitle;
                        json.company=rows[i].workplace;
                        json.relationship=rows[i].relationship;
                        json.cid=rows[i].customerId;
                        json.customerId=TempCache.getItem("userId");
                        json.logoUrl=rows[i].logoUrl;
                        json.state=2;
                        json.vipIcon=1;
                        t.list.push(json);
                      }
                      t.params.pageIndex++;
                      if(rows.length<10){
                        t.noMore=true;
                      }
                    },
                    failed(){
                      t.ajaxing=false;
                      t.noMore=true;
                      if(t.list.length){
                        return false;
                      }else{
                        if(t.params.pageIndex==1){//第一页无数据
                          t.list = [];
                          t.noData=true;
                        }
                      }

                    }
                  };
                  comm.successRequest(rep,options);
                }
              });
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
                            t.getList();
                        }
                    }
                }
            },

        },
        mounted(){
            this.getList();
            this.scroll();
        },
        components:{
            Loading,
            userList
        },

    }
</script>