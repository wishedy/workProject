<template>
    <!--组织简介遮罩开始-->
    <section class="newsPopBox" v-if="newsPop">
        <aside class="al-orgIntroduce" :class="{popActiveBo:bottomPopFlag}">
            <h1 class="introTitle">简介<i @click="closeBtn"></i></h1>
            <section class="marginTopBox">
                <p class="titleAbstract" v-if="orgInfo" v-html="textFormat(orgInfo)"></p><!--{{orgInfo|textFormat}}-->
                <section class="ev-showBigImg">
                    <aside v-for="(items,i) in imgListArr" :key="i">
                        <p class="imgInfo" v-if="items.imgDescription" v-html="textFormat(items.imgDescription)"></p>
                        <figure class="imgBox ev-imgBig" v-if="items.imgUrl">
                            <img @click="showBigImage(i)" :src="items.imgUrl">
                        </figure>
                    </aside>
                </section>
            </section>
            <figure class="al-noNewsInfo" v-if="!orgInfo&&!imgListArr.length">
                <img src="/static/images/personal/nocontent.png" />
                <p>暂无简介~</p>
            </figure>
        </aside>
        <!--底部遮罩小弹层开始-->
        <section class="al-fixedTransPop" v-if="bottomPopFlag"></section>
        <!--底部遮罩小弹层结束-->
        <!--查看大图包裹区域开始-->
        <section class="bigImgContainer" v-if="bigImgFlag">
            <header><i class="bigImgClose" @click="closeBigImg"></i><span>查看大图</span></header>
            <figure>
                <img :src="bigImgUrl">
            </figure>
        </section>
        <!--查看大图包裹区域结束-->
    </section>

    <!--组织简介遮罩结束-->
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import comm from 'static/js/comm.js';
    const path={
        orgInfoUrl:"/mcall/organization/getIntroductionPager/",//组织详情
    };
    export default {
        name: "orgAbsPop",
        data(){
            return{
                orgId:comm.getpara().orgId?comm.getpara().orgId:"10001",//组织id
                orgInfo:"",//组织简介
                imgListArr:[],//组织图片
                bigImgUrl:"",//查看大图地址
                bigImgFlag:false,//大图显示标志
                bottomPopFlag:false,//判断底部标志是否显示
            }
        },
        watch:{
            newsPop(){
                let t=this;
                if(t.newsPop){//弹层显示，禁止底部滚动
                    comm.bodyScroll();
                }else {//恢复滚动
                    comm.bodyNoScroll();
                }
            }
        },
        computed:{
            ...mapGetters(['newsPop','isLoading'])
        },
        methods:{
            ...mapActions(["changeLoading",'changeNewsPop']),
            //简介格式转换
            textFormat(text){
                if (text) {
                    return text.replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;");
                }
            },
            //关闭按钮
            closeBtn(){
                let t=this;
                t.changeNewsPop(false);
            },
            //组织详情获取
            getInfoRender(){
                let t=this;
                comm.ajax2({
                    url: path.orgInfoUrl,
                    type: "get",
                    data: {paramJson:JSON.stringify({
                            organizationId:t.orgId,//组织id
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(comm.hasResponseData(res)&&res.responseObject.responseData.dataList
                        &&res.responseObject.responseData.dataList.length>0){
                            let item=res.responseObject.responseData.dataList[0];
                            t.orgInfo=item.introduction;//.replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;");
                            // t.imgListArr
                            if(item.introList&&item.introList.length>0){//图片描述存在
                                t.imgListArr=item.introList;
                            }
                        }else{
                            // popup("加载失败，请稍后重试！");
                        }
                    }
                });
            },
            //点击查看大图
            showBigImage(index){
                let t=this;
                t.bigImgUrl=t.imgListArr[index].imgUrl;
                t.bigImgFlag=true;//查看大图标志
            },
            // 关闭查看大图
            closeBigImg(){
                let t=this;
                t.bigImgFlag=false;//关闭查看大图标志
                t.bigImgUrl="";
            },
        },
        updated(){
            //判断底部遮罩是否显示
            let t=this;
            if($(".ev-imgBig").length){
                for (let i=0;i<$(".ev-imgBig").length;i++) {
                    let kv = $(".ev-imgBig img").eq(i);
                    let src = kv.attr("src");
                    let newImg = new Image();
                    newImg.src = src;
                    newImg.onload = function () {
                        //判断底部遮罩是否显示
                        let h1 = $(".ev-showBigImg").height();//图片文字区域
                        let h2 = $(".titleAbstract").height();//组织简介
                        let h3 = $(".introTitle").height();//简介、关闭
                        let boss = $(".al-orgIntroduce").height();//定位区域（上边三个的父层）的高度
                        if (h1 + h2 + h3 > boss) {//有滚动区域，显示底部遮罩
                            t.bottomPopFlag = true;
                        } else {//无滚动区域，显示底部遮罩
                            t.bottomPopFlag = false;
                        }
                    }
                }
            }else{
                //判断底部遮罩是否显示
                let h1 = $(".ev-showBigImg").height();//图片文字区域
                let h2 = $(".titleAbstract").height();//组织简介
                let h3 = $(".introTitle").height();//简介、关闭
                let boss = $(".al-orgIntroduce").height();//定位区域（上边三个的父层）的高度
                if (h1 + h2 + h3 > boss) {//有滚动区域，显示底部遮罩
                    t.bottomPopFlag = true;
                } else {//无滚动区域，显示底部遮罩
                    t.bottomPopFlag = false;
                }
            }
        },
        mounted(){
            let t=this;
            t.getInfoRender();
        }
    }
</script>

<style scoped>

</style>