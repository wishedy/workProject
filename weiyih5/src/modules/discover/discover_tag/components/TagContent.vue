<template>
    <section v-cloak v-show="showOnOff">
        <section class="al-searchContentInner ev-initList" data-alcode-mod="415">
            <section class="al-searchResult" v-for="(item,index) in rebuildTagList">
                <header class="al-searchResultTitle" :id="item.name">{{item.name}}</header>
                <a :href="'./discover_tagSubject.html?tId='+inItem.propertyId" class="al-searchResultItem" v-for="(inItem,inIndex) in item.list"  @mousedown.stop="batch(inItem.propertyName,inItem.propertyId)">{{inItem.propertyName}}</a>
            </section>
            </section>
        <aside class="al-searchTypeSelect" style="display: block;">
            <a href="javascript:void(0)" class="al-searchTypeSelectItem" :data-tooltips="item.name" v-for="(item,index) in rebuildTagList">{{item.name}}</a>
        </aside>
        <loading v-show="loading"></loading>
    </section>


</template>
<script>
    const xhrUrl = {
      list:"/mcall/comm/data/property/getMapList/"
    };
    import axios from "axios"
    import pinYin from 'static/js/pinying.js';
    import comm from 'static/js/comm.js';
    import loading from "components/Loading/Loading.vue"
    export default {
        data(){
            return {
                msg:"s",
                hotList:[],
                allTagList:[],
                rebuildTagList:[],
                pinYinList:{},
                loading:true
            }
        },
        components:{
            loading
        },
        computed:{
          showOnOff(){
              let t = this;
              return t.$store.state.searList.length===0
          },
            customerId(){
                let t = this;
                return t.$store.state.customerId;
            }
        },
        mounted(){
          let t = this;
          t.tagList();
        },
        methods:{
            batch(name,tid){
                comm.creatEvent({
                    triggerType:'标签',
                    trigger_name:"标签",
                    keyword:name,
                    refId:tid,
                    actionId:79,
                    async:false
                });
            },
            pinYinRebuild(data){
              let t = this;
              const rebuildData = {};
              for(var num = 0;num<data.length;num++){
                  if(rebuildData[data[num].pinYin]){
                      rebuildData[data[num].pinYin].count++;
                  }else{
                      rebuildData[data[num].pinYin] = {};
                      rebuildData[data[num].pinYin].list = [];
                      rebuildData[data[num].pinYin].count = 1
                  }
                  rebuildData[data[num].pinYin].list.push(data[num]);
              }
                var rebuildArr = [];
                for(var key in rebuildData){
                    let JsonData = {
                      name:key,
                      list:rebuildData[key].list
                    };
                    rebuildArr.push(JsonData);
                }
                rebuildArr.unshift({
                    name:"热",
                    list:t.hotList
                });
                t.rebuildTagList = JSON.parse(JSON.stringify(rebuildArr));
            },
            touchTag(){
                var aside = document.querySelector(".al-searchTypeSelect");


                $(".al-searchTypeSelect").on("touchend", function() {
                    $('.al-searchTypeSelectItem').removeClass('selected');
                });
                aside.addEventListener('touchmove', function(event) {
                    $('body').on("touchmove", function(e) {
                        e.preventDefault();
                    });
                    var element = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY - $(window).scrollTop());
                    $('.al-searchTypeSelectItem').removeClass('selected');
                    $(element).addClass('selected');
                    if (element.nodeName.toLowerCase() === "a") {
                        var tagFL = $(element).attr("data-toolTips"),
                            oT;
                        if (tagFL === "热") {
                            oT = $("#热").parent().offset().top;
                        } else {
                            oT = $("#" + tagFL + "").parent().offset().top;
                        }

                        $(window).scrollTop(oT-$(".al-searchHead").outerHeight());
                    }
                });
                aside.addEventListener('touchend', function() {
                    $('body').off("touchmove");
                });
            },
            pinYinSort(data){
//                console.log(data,data.length);
                let len = data.length;
              for(var num = 0;num<len;num++){
                  data[num].pinYin = pinYin.makePy(data[num].propertyName)[0][0];
              }
              this.pinYinRebuild(pinYin.sortList(data,"pinYin"));
//              console.log(data)
                this.touchTag();
            },
            tagList(){
                let t = this;
                let param = {
                    "pageIndex": 1,
                    "pageSize": 1000,
                    "visitSiteId": 2,
                    "resourceNum": 2,
                    "customerId": t.customerId,
                    "platformId": "1",
                    "sessionCustomerId": t.customerId
                };
                comm.ajax({
                    url:xhrUrl.list,
                    method:"POST",
                    paramJson:true,
                    data:param,
                    success:function(res){
                        t.loading = false;
                        t.hotList = res.data.responseObject.responseData.hot_list;
                        t.pinYinSort(res.data.responseObject.responseData.data_list);
                        t.allTagList = res.data.responseObject.responseData.data_list;
                    }
                })
            }
        }
    }
</script>