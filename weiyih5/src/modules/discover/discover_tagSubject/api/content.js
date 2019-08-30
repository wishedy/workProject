import VueDataLoading from 'components/scroll/vue-data-loading.vue'
import loading from "components/Loading/Loading.vue"
import comm from 'static/js/comm.js';
const xhrUrl = {
    "list":"/mcall/recommend/tag/resource/json_list/"
};
export default {
    data(){
        let t = this;
        return {
            msg:"welcomr",
            completed: false,
            loading:false,
            list:[],
            pageSize:20,
            pageIndex:1

        }
    },
    computed:{
        dataScene(){
            let t = this;
            return (t.$route.path).substring(1,100);
        },
        tagId(){
            let t = this;
          return (t.$store.state.tagId)  ;
        },
        dataType(){
            let t = this;
            return t.$store.state.dataType;
        }
    },
    mounted(){
        let t = this;
        t.getList();
    },
    methods:{
        widthStyle(v){
            return v/5*100;
        },
        "infiniteScroll"(){
            let t = this;
            t.loading = true;
            t.pageIndex++;
            setTimeout(() => {
                t.getList();
            }, 1000)
        },
        actualStart(num){
            if(num===0||num){
                return Math.ceil(num)-1;
            }else{
                return 0;
            }

        },
      starDom(ScoreNum, score){
        if (parseInt(ScoreNum) >= 10) {
          let str = ''
          let num = parseInt(score)
          let flot = (score - num) * 100 + '%'
          switch (num) {
            case 0:
              str = '<li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li><li></li>'
              break
            case 1:
              str = '<li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li>'
              break
            case 2:
              str = '<li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li>'
              break
            case 3:
              str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li>'
              break
            case 4:
              str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li>'
              break
            case 5:
              str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li>'
              break
          }
          return str
        }
      },
        getList(){
            let  t = this;
            const scene = {"release": "1", "comment": "2", "browse": "3"};
            const param = {
                "tagId": t.tagId,
                "pageSize": t.pageSize,
                "pageIndex": t.pageIndex,
                "dataScene": scene[t.dataScene],
                dataType:t.dataType,
                "scene": 2
            };
            comm.ajax({
                url: xhrUrl.list,
                method: "POST",
                paramJson: true,
                data: param,
                success: function (res) {
                    let options = {
                        success(res) {
                            t.loading = false;
                            if(t.pageIndex===1){
                                t.list = res.responseObject.responseData.data_list;

                            }else{
                                t.list = t.list.concat(res.responseObject.responseData.data_list);
                            }
                            if(res.responseObject.responseData.total_count===t.list.length){
                                t.unBindScroll();
                            }
                        },
                        failed() {
                            if(t.pageIndex===1&&t.dataType===0){
                                    t.$store.state.noData = true;
                            }
                            t.unBindScroll();
                        }
                    };
                    comm.successRequest(res.data, options);
                }
            })
        },
        unBindScroll(){
          let t = this;
            t.loading = false;
            t.completed = true;
            t['infiniteScroll'] = ()=>{
                return false;
            }
        },
        reallyUrl(v){
            if(v.indexOf("|")>-1){
                return v.split("|")[0];
            }else{
                return v;
            }
        },
        resetParam(){
            let t = this;
            t.pageIndex = 1;
            t.loading = true;
            //t.completed = false;
        }

    },
    watch:{
      "$route"(){
          let t = this;
          t.resetParam();
          t.getList();
      },
        dataType(){
          let t = this;
          t.resetParam();
          t.getList();
        },
        pageIndex(newIndex){
          let t = this;
            t.$store.state.goShare = ++(t.$store.state.goShare);
            t.$store.state.pageIndex = newIndex;
        }
    },
    filters:{
      toWKH:comm.toWKH,
      getOwnerName(ownerName){
          return comm.getStrLen(ownerName,16)
      }
    },
    components:{
        VueDataLoading,loading
    }
}