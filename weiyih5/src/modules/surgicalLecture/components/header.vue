<template>
    <header class="al-indexHeader"  id="header">
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)" class="ev_backBtn" @click.stop="goBack">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAASlJREFUaAXtmDEOgjAUhiliHFwcZWIxId7BxUt4Gg/iMbyBJ3DXuOiCi3fA/yWITUPo0FYL+V/yh5aG5uv3BghJwqIBGqABGqABGhixgbquU6RAssEdE9A5ckakbshyMIcArMBfEL32vg+Q+t5Q9gNxjssJKWWuVaWN4xwKPGKaly4ckUmc1A0VAPvgp4QPZYDmQ5m17UvzNkOh1mk+lFnbvkM3L1+Vnw8zDNuSN2zcLynpDCCLFvk7eGA4s3UuinWAZoh8Ept1wA0VBaQNAqAlUpknwJyHsMnzus5OeNXpsBk74SDP66PshFedDpuNvhMObn77aE8ndr5JgvzYUkpdAbpFngbw2pjHPW06ccdV6oWs4ibuoAP0HNkgi45l3qIBGqABGvivgTdCZw6XTflZAQAAAABJRU5ErkJggg==" alt="">
            </a>
        </figure>
        <figure class="al-indexHeaderItem">
            <h1 v-text="title">&nbsp;</h1>
        </figure>
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)" class="share"  ref="evShare"><i></i></a>
        </figure>
    </header>
</template>
<script>
    const  $ =  require('jquery');
    import comm from 'static/js/comm.js';
    export default {
        props:['title'],
        methods:{
            goBack(){
                let t = this;
                if(t.$route.name==='surgicalPractice'){
                    g_sps.jump(null,'/');
                }else if(t.$route.name==='surgicalLecture'){
                    g_sps.jump(null,'/');
                }else if(t.$route.name==='surgicalLectureProduce'){
                    if(window.history.length>1){
                        t.$router.go(-1);
                    }else{
                        g_sps.jump(null,'/');
                    }
                }else if(t.$route.name==='courseProduce'){
                    if(window.history.length>1){

                        t.$router.go(-1);
                    }else{
                        g_sps.jump(null,'/');
                    }
                }
            },
            share(){
                let t = this;
                let shareObj ={};
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:"",
                            shareChannel: 4,
                            shareContent: shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 1,
                                shareContent: shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 3,
                                shareContent: shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest:function(){
                        $.ajax({
                            url:"/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.createShareData())
                            },
                            type: "post",
                            async:false,
                            dataType:"json",
                            success:function(data){
                                if(comm.hasResponseData(data)){
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    $(sList).each(function (index, element) {
                                        if (element.shareChannel === 'QZone') {
                                            shareObj.title = element.shareTitle;
                                            shareObj.summary = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'Sina') {
                                            shareObj.sinaTitle = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatFriend') {
                                            shareObj.wxTitle = element.shareTitle;
                                            shareObj.wxDesc = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatTimeline') {
                                            shareObj.timeLineTitle = element.shareTitle;
                                        }

                                    });

                                }
                            }
                        });
                        return shareObj;
                    }
                }, false, $(t.$refs.evShare));
            },
            createShareData(){
                let t = this;
                let json = {};
                let routeName = t.$route.name;
                switch (routeName) {
                    case 'surgicalPractice':
                        json = {
                            sceneType:'80',
                            columnId:t.columnId,
                            customerId:t.customerId,
                            columnType:'2'
                        };
                        break;
                    case 'surgicalLecture':
                        json = {
                            sceneType:'80',
                            columnId:t.columnId,
                            customerId:t.customerId,
                            columnType:'1'
                        };
                        break;
                    case 'surgicalLectureProduce':
                        json = {
                            sceneType:'81',
                            columnId:t.columnId,
                            customerId:t.customerId
                        };
                        break;
                    case 'courseProduce':
                        json ={
                            sceneType:'82',
                            columnId:t.columnId,
                            courseId:t.courseId,
                            customerId:t.customerId
                        };
                        break;
                }
                return json;
            }
        },
        computed:{
            columnId(){
                let t = this;
                return comm.getpara().columnId;
            },
            customerId(){
                return comm.getpara().customerId;
            },
            courseId(){
                let t = this;
                return comm.getpara().courseId;
            }
        },
        mounted(){
            let t = this;
            //console.log(t.title);
            //console.log(t.$route);
            //t.createShareData();
            t.share();
        }
    }
</script>
<style scoped lang="scss">
    .al-indexHeader{
        position: absolute;
        z-index: 2;
    }
</style>