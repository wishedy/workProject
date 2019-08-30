<template>
    <section class="rightInterestsTip">
        <!--弹层样式-->
        <section class="rightInterestsCont">
            <i>权益详解</i>
            <article class="rigthDesc">
                <ul>
                    <li v-for="(item,index) in dataList">
                        <span>{{item.title}}</span>
                        <p>{{item.desc}}</p>
                    </li>
                </ul>
            </article>
        </section>
        <span class="tipCloseBtn" @click.stop="openOrCloseTip"></span>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import comm from "static/js/comm.js"
    window.shareAll = shareAll;
    export default {
        props:{
            rightName:{
                default(){
                    return "";
                }
            }
        },
        components: {

        },
        data(){
            return {
                dataList:[],
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
            openOrCloseTip(){
              const _this = this;
              _this.$emit("closeBack");
            },
            getRightInfo(){
                let _this = this;
                $.ajax({
                    url: '/static/json/rightInterestsJson.json',
                    type: "get",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    success: function (data) {
                        if(data && data.dataList){
                            for (let i in data.dataList){
                                console.log(data.dataList[i].rightName+"==="+ _this.rightName);
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
<style lang="scss" scoped>
    @function rem3($px,$base-font-size:37.5px) {
        @return ($px / $base-font-size)*1rem;
    }
    .rightInterestsTip{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background:rgba(0,0,0,0.7);
        .rightInterestsCont{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: rem3(345px);
            height: rem3(400px);
            margin: 0 auto;
            background-color: #ffffff;
            background-size: contain;
            border-radius: rem3(12px);
            overflow: hidden;
            padding-bottom: rem3(30px);
            i{
                width: 100%;
                height: rem3(56px);
                background: url("/static/images/payDetail/tipBg.png") no-repeat center center;
                background-size: contain;
                display: inline-block;
                font-size:rem3(19px);
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(34,34,34,1);
                text-align: center;
                line-height: rem3(56px);
                margin-bottom: rem3(15px);
                position: fixed;
                top: 0;
                left: 0;
            }
            .rigthDesc{
                overflow-y: scroll;
                margin-top: rem3(70px);
                max-height: rem3(344px);
                li{
                    padding: 0 rem3(25px);
                    margin-bottom: rem3(15px);
                    span{
                        font-size:rem3(16px);
                        font-family:PingFangSC-Medium;
                        font-weight:500;
                        color:rgba(34,34,34,1);
                        line-height:rem3(22px);
                        margin-bottom: rem3(6px);
                        display: inline-block;
                        &:before{
                            content: '';
                            width:rem3(4px);
                            height:rem3(14px);
                            display: inline-block;
                            background:rgba(34,34,34,1);
                            margin-right: rem3(4px);
                        }
                    }
                    p{
                        font-size:rem3(15px);
                        font-family:PingFangSC-Regular;
                        font-weight:400;
                        color:rgba(85,85,85,1);
                        line-height:rem3(21px);
                    }
                }
            }
        }
        .tipCloseBtn{
            width: rem3(40px);
            height: rem3(40px);
            display: inline-block;
            background: url("//img50.allinmd.cn/index/close_small_popup.png") no-repeat center 50%;
            background-size: contain;
            margin: 0 auto;
            margin-top: rem3(29px);
            position: fixed;
            left: 50%;
            bottom: rem3(29px);
            transform: translate(-50%,0);
        }
    }
</style>
