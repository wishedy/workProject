<template>
    <section class="al-mainInner">
        <!--弹层样式-->
        <section class="rightInterestsCont">
                <!--<i>权益详解</i>-->
            <article class="rigthDesc">
                <ul>
                    <li v-for="(item,index) in dataList">
                        <span>{{item.title}}</span>
                        <p>{{item.desc}}</p>
                    </li>
                    </ul>
            </article>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import comm from "static/js/comm.js"
    window.shareAll = shareAll;
    export default {
        components: {

        },
        data(){
            return {
                dataList:[],
                rightName:comm.getpara().productName,
            }
        },
        beforeMount(){

        },
        computed:{

        },
        mounted(){
            this.getRightInfo()
        },
        methods: {
            getRightInfo(){
                let _this = this;
                $.ajax({
                    url: '/static/json/rightInterestsJson.json',
                    type: "get",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    success: function (data) {
                        if(data && data.dataList){
                            for (let i in data.dataList){
                                if(data.dataList[i].rightName == _this.rightName){
                                    _this.dataList = data.dataList[i].rightList;
                                }
                            }
                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('失败')
                    }
                })
            }
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/rightInterests/rightInterests.scss";
</style>
