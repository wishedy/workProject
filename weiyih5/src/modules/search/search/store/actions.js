import comm from 'static/js/comm.js'
import axios from "axios"
import SearchCommon from  '../searchCommon/searchCommon';
import Global from "common/Global.vue";
import TempCache from "../../../../../static/js/tempcache";
const $ = require('jquery');
const xhrUrl = {
    searchUrl:"//gateway.allinmd.cn/base-customer-platform/cms/search/keyword/getMapListV3",
    "createTxt":"/mcall/log/customer/keyword/createKeyword/"
};
function searchInfoData(commit, state,str){
    axios.get(xhrUrl.searchUrl, {
        params: {"searchParam":str}
    })
        .then(function (response) {
            if(SearchCommon.checkResData(response.data)){
                //存在数据
                state.searchList = JSON.stringify(response.data);
            }else{
                //没有数据
                state.searchList = "";
            };
        })
        .catch(function (error) {
            state.searchList = "";
            //console.log(error);
        });
}
const actions = {
    searchInfo:({commit, state}, str)=>{
        searchInfoData(commit, state,str);
    },
    shareInit:({commit, state}, typeName)=>{
        let hrefName = location.origin+location.pathname;
        let router = location.hash;
        const resourceType = {"all":0,"case":7,"meeting":3,"video":1,"doc":2,"doctor":9,"topic":4};
        let data = {
            attUseFlag:Global.AttUseFlag.h,
            isValid:1,
            logoUseFlag:4,
            resourceType:resourceType[typeName],
            scene:10,
            sceneType:1,
            searchParam:state.selectedStr,
            sessionCustomerId:state.customerId,
            visitSiteId:5,
            platformId:$('.platformSelect').attr('data-platformId'),
            sortType:$('.sortActive').attr('searchSort'),
            searchType:2,
            opUsr:state.customerId
        };
        state.shareConfig = {
            shareData:data,
            initData:{url:hrefName+"?keyword="+encodeURIComponent(state.selectedStr)+"&"+router}
        };
    },
    setPreWord:({commit,state},keyword)=>{
      commit("setPreWord",keyword)  ;
    },
    selectedKeyWord:({commit, state}, options)=>{
        state.searchData = JSON.stringify({"searchStr":options.keyVal,"associateOnOff":false});
        state.selectedStr = options.keyVal;
        let customerId = SearchCommon.checkInvalid(state.customerId)?'':state.customerId;
        let updateHistoryList=(keyWord)=>{
            let t = this;
            let searchHistoryList = comm.cookie.get("searchHistoryList"+customerId);
            let list = [];
            if(searchHistoryList&&(JSON.parse(searchHistoryList)).length>0){
                let hasData = true;
                list = JSON.parse(searchHistoryList);
                for(let num = 0;num<list.length;num++){
                    if($.trim(keyWord)===$.trim(list[num]['searchKey'])){
                        hasData = false;
                    }
                }
                if(hasData){
                    list.unshift({
                        searchKey:keyWord
                    });
                }
            }else{
                list = [
                    {
                        searchKey:keyWord
                    }
                ];
            }
            comm.cookie.set("searchHistoryList"+customerId,JSON.stringify(list),365*5);
        };
        document.title="搜索：［"+options.keyVal+"］- 唯医,allinmd";
        $("meta[name=Keywords]").attr("content","［"+options.keyVal+"］,［"+options.keyVal+"］视频,［"+options.keyVal+"］文章,病例,唯医,allinmd");

        comm.ajax2({
            url: '//gateway.allinmd.cn/base-search-service/search/mistakeWords',
            type: "GET",
            data: {
                "searchParam": options.keyVal
            },
            timeout: 30000,
            success: function (res) {
                let options = {
                    success(res) {
                        if (res.responseObject.responseData.dataList.length) {
                            state.mistakeWords = res.responseObject.responseData.dataList[0]['realSearchParam'];
                           // console.log(state.mistakeWords);
                        } else {
                            state.mistakeWords = '';
                        }
                    },
                    failed() {
                        state.mistakeWords = '';
                    }
                };
                comm.searchRequest(res, options);
            }
        });
        updateHistoryList(options.keyVal);
        /*axios({
            url: xhrUrl.createTxt,
            method: "POST",
            data: {
                keyWord: options.keyVal,
                searchUrl: window.location.href,
                opUsr:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
            },
            transformRequest: [function(data) {
                return "paramJson=" + JSON.stringify(data);
            }],
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 30000
        }).then(function(res){

        });*/
        //searchInfoData(commit, state,str);

    }

};
export default actions;