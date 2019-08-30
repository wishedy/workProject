<template>
    <div class="container-rank">
        <ul class="rank-list">
            <li  v-for="(item, index) in rankList" :class="[item.belongType == 1 ? 'highlight' : '']" :key="index" v-show="index<3">
                <p class="rank-title" >{{item.hospitalName}}</p>
                <p class="join-info">{{item.customerNum}}人参与</p>
            </li>
            <li v-show="((rankList.length===3)&&(belong==0))"><p class="update-rank" v-text="des"></p></li>
            <li v-show="((rankList.length===3)&&(belong==1))"><p class="update-rank" v-text="hospitalDes"></p></li>
            <li v-if="(rankList.length===4)"><p class="update-rank">{{rankList[3].hospitalName}}</p></li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from "axios";
    import TempCache from "static/js/tempcache.js";
    export default {
        props:{
            customerId: String
        },
        data () {
            return {
                hospitalDes:"恭喜您的医院上榜!",
                des:'快为自己的医院助力!',
                rankList: [],
                belong:0
            }
        },
        mounted () {
            this.getRankList()
        },
        computed:{

        },
        methods: {
            belongCheck(){
                let _this = this;
                let belong = 0;
                for(let num = 0;num<_this.rankList.length;num++){
                    if(parseInt(_this.rankList[num].belongType,10)){
                        belong = 1;
                    }
                }
                console.log(belong+'+++++');
                _this.belong =  belong;
            },
            getRankList () {
                let that = this;
                setTimeout(()=>{
                    let url = '/mcall/customer/invitation/getHospitalRankList/';
                    let Data = {
                        paramJson: JSON.stringify({"customerId": TempCache.getItem("userId")?TempCache.getItem("userId"):''})
                    };
                    axios.get(url,{params:Data}).then(function (datas) {
                        if(datas && datas.data && datas.data.responseObject && datas.data.responseObject.responseData && datas.data.responseObject.responseData.dataList){
                            let dataList =  datas && datas.data && datas.data.responseObject && datas.data.responseObject.responseData && datas.data.responseObject.responseData.dataList;
                            /*dataList = dataList ? dataList : []
                            let len = 4 - dataList.length
                            for (let i = 0; i < len; i++){
                                dataList.push({update:1})
                            }*/
                            that.rankList = dataList;
                            console.log(that.rankList)
                            that.belongCheck();

                        }
                    })
                },2000);


            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


