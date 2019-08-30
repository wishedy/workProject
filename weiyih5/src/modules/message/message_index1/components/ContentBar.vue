<template>
    <!--列表数据盒子-->
    <section data-alcode-mod="447" :class="deleteState?'al-msgListConfigType':''" :style="{'margin-top':heig}">
        <vue-data-loading :loading="loading" :completed="noData" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="0" v-if="firstNoData">
            <!--[关注提醒]、[赞了我的]模板-->
            <section class="al-msgListItem" v-for="(item,index) in list" @click="deleteClm(index)" :class="isdelete(item.sureDelete,listTrue)" v-if="nowPageType==1 ||nowPageType==3">
                <header class="al-msgListTitle">
                    <figure class="al-msgListHeadImg" style="position: relative;" v-if="item.customer_Count==1">
                        <a class="Ev-mesPersonalCenter" :href="'/dist/personal/others_index.html?cid='+item.customer_List">
                            <img :src="item.logo_url_list[0].logoUrl?item.logo_url_list[0].logoUrl:'//img50.allinmd.cn/pages/personal/no_head.png'">
                            <i class="icon-newTips" v-if="item.customer_count==1&&item.isRead==0"></i>
                        </a>
                    </figure>
                    <article class="al-msgListTitleContent " :class="userNews(item.customer_count,item.isRead)">
                        <a href="javascript:void(0)" @click="multiplayer(nowPageType,item)">{{item.logo_url_CustomerName,item.customer_Count | count }}<i class="al-vipUser" v-if="item.customer_Count==1"></i></a>
                            <span class="al-msgListStatus">{{item.opType | getOpConText}}</span>
                        <span class="al-msgListTime">{{item.messageTime|msgTime}}</span>
                    </article>
                </header>
                <article class="al-msgListItemContent" :class="styleType(item.resourceType,item.messageIsValid)">
                    <a :href="skip(nowPageType,item.resourceWebUrl,item.refType,item.resourceName,item.refName,item.reviewId,item.refReviewId,item.customer_review,item.resourceId,item.resourceType)">
                        <p>{{nowPageType,item.resourceType,item.refType,item.messageIsValid | resourceType}}{{nowPageType,item.resourceType,item.refType,item.messageIsValid,item.messageName | strType}}</p>
                    </a>
                </article>
            </section>
            <!--[提醒我看]模板-->
            <section class="al-msgListItem" v-for="(item,index) in list" @click="deleteClm(index)" :class="isdelete(item.sureDelete,listTrue)" v-if="nowPageType==2">
                <header class="al-msgListTitle">
                    <figure class="al-msgListHeadImg" style="position: relative;">
                        <a class="Ev-mesPersonalCenter" :href="'/dist/personal/others_index.html?cid='+item.sendCustomerId">
                            <img :src="item.logoUrl?item.logoUrl:'//img50.allinmd.cn/pages/personal/no_head.png'">
                            <i class="icon-newTips" v-if="item.customer_count==1&&item.isRead==0"></i>
                        </a>
                    </figure>
                    <article class="al-msgListTitleContent">
                        <a href="javascript:void(0)" :href="'/dist/personal/others_index.html?cid='+item.sendCustomerId">{{item.sendCustomerName}}<i class="al-vipUser"></i></a>
                        <span class="al-msgListStatus">提醒我看</span>
                        <span class="al-msgListTime">{{item.messageSrcTime|msgTime}}</span>
                    </article>
                </header>
                <article class="al-msgListItemContent" :class="styleTypeTwo(item.refType,item.isValid,item.attachment_resource)">
                    <a :href="skipTwo(item.attachment_resource,item.refId,item.resourceType,item.refReviewId,item.refName,item.refUrl,item.refType)">
                        <p>{{item.refType,item.isValid,item.attachment_resource | getResourceCon}}{{item.refType,item.isValid,item.attachment_resource,item.messageName,item.messageBody | readType}}</p>
                    </a>
                </article>
            </section>
            <!--[评论我的]模板-->
            <section class="al-msgListItem" v-for="(item,index) in list" @click="deleteClm(index)" :class="isdelete(item.sureDelete,listTrue)" v-if="nowPageType==4">
                <header class="al-msgListTitle">
                    <figure class="al-msgListHeadImg" style="position: relative;">
                        <a class="Ev-mesPersonalCenter" :href="'/dist/personal/others_index.html?cid='+item.sendCustomerId">
                            <img :src="item.logoUrl?item.logoUrl:'//img50.allinmd.cn/pages/personal/no_head.png'">
                            <i class="icon-newTips" v-if="item.customer_count==1&&item.isRead==0"></i>
                        </a>
                    </figure>
                    <article class="al-msgListTitleContent">
                        <a href="javascript:void(0)" :href="'/dist/personal/others_index.html?cid='+item.sendCustomerId">{{item.sendCustomerName}}<i class="al-vipUser"></i></a>
                        <span class="al-msgListStatus">评论了</span>
                        <span class="al-msgListTime">{{item.messageSrcTime|msgTime}}</span>
                    </article>
                </header>
                <article class="al-msgListItemContent" :class="styleTypeReview(item.showTitleType,item.srcReviewStatus)">
                    <a :href="skipReview(item.showTitleType,item.refId,item.resourceType,item.refReviewId,item.messageName,item.refUrl,item.refName,item.attachment_resource)">
                        <p>{{item.attachment_resource,item.messageBody | message}}</p>
                    </a>
                </article>
                <!--[评论我的]比[提醒我看]模板-->
                <article class="al-msgListItemMyContent" style="word-break:break-all;">
                    <p>
                        <a :href="skipReview(item.showTitleType,item.refId,item.resourceType,item.refReviewId,item.messageName,item.refUrl,item.refName,item.attachment_resource)">
                            <span class="al-msgListItemMyType">{{item.showTitleType,item.isValid,item.attachment_resource.customer_review_parent | reviewType}}</span>
                            <span class="al-msgListItemMyText">{{item.showTitleType,item.isValid,item.attachment_resource.customer_review_parent,item.messageName | reviewText}}</span>
                        </a>
                    </p>
                </article>
            </section>
        </vue-data-loading>
        <!--无内容时展示盒子-->
        <section class="al-noContentTips Ev-mesNoList" v-show="initNoData">
            <figure>
                <img src="//img50.allinmd.cn/pages/message/remind_no_msg.png" alt="">
            </figure>
        </section>
        <Loading v-show="loading"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import comm from 'static/js/comm';
    import commdate from 'static/js/comm.date';
    import axios from "axios";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import Loading from "components/Loading/Loading.vue";
    import {mapActions,mapGetters} from "vuex";

    export default {
        data() {
            return {
                msg: "welcome",
                pageIndex:1,
                pageSize:10,
                sortType:2,
                list:[],
                initNoData:false,
                loading:false,
                noData:false,
                firstNoData:true,
                deleteState:false,
                deleteColumn:false,
                messageArr:[],//存放点击条目ID
                newArr:[], //新数组 ，去重的id值
                listTrue:false,
                heig:''  //头部高度
            }
        },
        methods:{
            "infiniteScroll"(){     //滚动组件配置选项
                let t = this;
                t.loading = true;
                t.pageIndex++;
                setTimeout(() => {
                    t.getList();    //获取当前页面数据列表
                }, 1000)
            },
            getList(){  //获取页面数据列表
                let t = this;
                t.loading = true;
                axios({
                    url: t.port,
                    method: "POST",
                    data: t.postData,
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    t.loading = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        t.list = t.list.concat(dataList);
                        t.headerBtn(true);          //请求成功显示编辑按钮
                        if(dataList.length<10){
                            t.noData = true;        //小于10显示没有更多了
                        }
                    }else{
                        if(t.pageIndex==1){
                            t.initNoData = true;    //首次没有数据添加默认图
                            t.firstNoData = false;  //首次没有数据隐藏滚动组件(其实想隐掉没有更多了)
                            t.headerBtn(false);     //首次没有数据隐藏编辑按钮
                        }else{
                            t.noData = true;        //第一次加载以外没有数据显示没有更多了
                        }
                    }

                    //不是首页，不存在默认图 就设定高度
                    if(t.nowPageType!=0 && !t.initNoData){
                        t.heig = t.$store.state.headerHeight+'px';
                    }
                });
            },
            //[关注消息]使用
            userNews(nums,isRead){
                let str = '';
                if(nums==1){
                    str = '';
                }else if(nums>3){
                    str = isRead==0?'al-msgListManyUserNews':'';
                }else{
                    str = isRead==0?'al-msgListManyUserNews':'';
                }
                return str;
            },
            //源文件需求用于1和3页面类型
            styleType(resourceType,messageIsValid){
                if(resourceType!=8){    //资源
                    if(messageIsValid!=1&& messageIsValid!=""){//屏蔽的资源
                        return 'al-msgHasDeletedOrShield';

                    }else{  //正常的资源
                        return '';
                    }
                }else{
                    if(messageIsValid!=1&& messageIsValid!=""){//屏蔽的资源
                        return 'al-msgHasDeletedOrShield';

                    }else{  //正常的资源
                        return '';
                    }
                }
            },
            //源文件需求用于2页面类型
            styleTypeTwo(refType,isValid,attachment_resource){
                if(refType!=8){    //资源
                    if(isValid!=1&& isValid!=""){//屏蔽的资源
                        return 'al-msgHasDeletedOrShield';

                    }else{  //正常的资源
                        return '';
                    }
                }else{
                    if(attachment_resource.customer_review.reviewStatus!=1){//屏蔽的资源
                        return 'al-msgHasDeletedOrShield';

                    }else{  //正常的资源
                        return '';
                    }
                }
            },
            //[评论我的]使用
            styleTypeReview(showTitleType,srcReviewStatus){
                let mBClass ='';
                if(showTitleType!=8){//非评论
                    if(srcReviewStatus!=1){//屏蔽的messageBody
                        mBClass='al-msgHasDeletedOrShield';
                    }else{//正常的资源
                        mBClass='';
                    }
                }else{//评论
                    if(srcReviewStatus!=1){//屏蔽的messageBody
                        mBClass='al-msgHasDeletedOrShield';
                    }else{//正常的资源
                        mBClass='';
                    }
                }
                return mBClass;
            },
            //用于1和3跳转
            skip(flag,e,refType,resourceName,refName,reviewId,refReviewId,customer_review,resourceId,resourceType){
                if(flag == 1){
                    if(e){
                        return e+"#replyAnchor";
                    }else{
                        return 'javascript:;';
                    }
                }else if(flag == 3){
                    let content = '';
                    if(refType==8){
                        let name,reId;
                        name = resourceName?resourceName:refName;
                        reId = reviewId?reviewId:refReviewId;
                        if(customer_review && customer_review.parentId!=0){//跳转到讨论页面
                            content = '/dist/personal/details_discuss.html?refId='+resourceId+'&refType='+resourceType+
                                '&reviewId='+ reviewId+'&refName='+resourceName+'&refUrl='+e;
                        }else{//父层是资源，跳转到正文页面
                            content = '/dist/personal/details_content.html?refId='+resourceId+'&refType='+resourceType+
                                '&reviewId='+ reId+'&refName='+name+'&refUrl='+e;
                        }
                    }
                    if(e){
                        if(refType!=8){
                            return e;
                        }else{
                            return content;
                        }
                    }else{
                        return 'javascript:;';
                    }
                }
            },
            skipTwo(attachment_resource,refId,resourceType,refReviewId,refName,refUrl,refType){
                let content = '';
                var _p = attachment_resource;
                if(_p&&!$.isEmptyObject(_p)&&_p.customer_review&&!$.isEmptyObject(_p.customer_review)&&_p.customer_review.parentId!=0){//跳转到讨论页面
                    content='/dist/personal/details_discuss.html?refId='+refId+'&refType='+resourceType+
                        '&reviewId='+refReviewId+'&refName='+ refName.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'&refUrl='+refUrl;
                }else{//父层是资源，跳转到正文页面
                    content='/dist/personal/details_content.html?refId='+refId+'&refType='+resourceType+
                        '&reviewId='+refReviewId+'&refName='+ refName.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'&refUrl='+refUrl;
                }
                if(refUrl){
                    if(refType!=8){
                        return refUrl;
                    }else{
                        return content;
                    }
                }else{
                    return 'javascript:;';
                }
            },
            skipReview(showTitleType,refId,resourceType,refReviewId,messageName,refUrl,refName,cReview){
                let reviewResUrl = '';
                let resourceName = '';
                let message = messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");//replace(/</g,"&lt;").replace(/>/g,"&gt;");
                if(showTitleType!=8){   //非评论
                    reviewResUrl='/personal/details_content.html?refId='+refId+'&refType='+resourceType+'&reviewId='+refReviewId+'&refName='+message+'&refUrl='+refUrl+'';
                }else{                  //评论
                    resourceName = refName?refName:"";
                    if(cReview&&!$.isEmptyObject(cReview)&&cReview.customer_review&&!$.isEmptyObject(cReview.customer_review)&&cReview.customer_review.parentId!=0){//跳转到讨论页面
                        reviewResUrl='/dist/personal/details_discuss.html?refId='+refId+'&refType='+resourceType+
                            '&reviewId='+refReviewId+'&refName='+resourceName+'&refUrl='+refUrl+'';
                    }else{//父层是资源，跳转到正文页面
                        reviewResUrl='/dist/personal/details_content.html?refId='+refId+'&refType='+resourceType+
                            '&reviewId='+refReviewId+'&refName='+resourceName+'&refUrl='+refUrl+'';
                    }
                }
                return reviewResUrl;
            },
            deleteClm(i){   //点击勾选列表事件
                let t = this;
                let num = t.$store.state.count;
                if(t.list[i].sureDelete!=true){
                    t.list[i].sureDelete = true;                   //点击没有勾选的[勾选上]
                    //console.log(t.list[i].messageId);
                    t.messageArr.push(t.list[i].messageId);     //记录勾选id值
                    num++;                                      //记录勾选数量
                }else{
                    t.list[i].sureDelete = false;                       //有点击勾选的[取消勾选]
                    for(let e=0,le=t.messageArr.length;e<le;e++){
                        if(t.messageArr[e]!=t.list[i].messageId){
                            t.newArr.push(t.messageArr[e]);         //循环删除点击取消的ID值
                        }
                    }
                    t.messageArr = t.newArr;
                    t.newArr = [];
                    //console.log(t.list[i].messageId);
                    (num--);                                        //记录勾选数量
                }

                //把勾选数量存入公共变量,footer部分引用
                t.changCount(num);

                //相等就变更[取消全选]，不相等就是[全选]
                if(num == t.list.length){
                    t.setCheckall(true);
                    t.setAllDelete(true);
                }else{
                    t.setCheckall(false);
                }

                //把获取的id处理，处理之后存入公共变量，用于确认删除请求
                var messageIdListParam = t.messageArr.join("").substring(0,t.messageArr.join(""));
                var str = '';
                if(t.nowPageType==4){
                    str = messageIdListParam;
                }else{
                    str = messageIdListParam.lastIndexOf(",");
                }

                t.getDeleteListId(str);
                //给当前数据从新赋值连接
                t.list = t.list.concat([]);
            },
            isdelete(target,deleteStatus){
                if(target && deleteStatus){
                    return 'al-msgListItemDeleteSelected delete';
                }else if(target){
                    return 'al-msgListItemDeleteSelected';
                }else{
                    return '';
                }
            },
            multiplayer(flag,item){
                //评论页有时间messageSrcTime
                let timeParam = item.messageSrcTime?item.messageSrcTime:'';
                let str = '';
                if(item.customer_Count==1){
                    str = '/dist/personal/others_index.html?cid='+item.customer_List+'';
                }else if(item.customer_Count>3){
                    str = '/dist/message/message_doctorList.html?reT='+item.resourceType+'&rId='+item.resourceId+'&opT='+item.opType+'&cST='+timeParam+'&count='+item.customer_Count+'&flag='+flag+'';
                }else{
                    str = '/dist/message/message_doctorList.html?reT='+item.resourceType+'&rId='+item.resourceId+'&opT='+item.opType+'&cST='+timeParam+'&count='+item.customer_Count+'&flag='+flag+'';
                }
                g_sps.jump(null,str);
            },
            ...mapActions(["headerBtn","changCount","getDeleteListId","setDelete","change","setCheckall","setAllDelete"])
        },
        filters:{
            //[关注提醒]使用
            count(cusName,cusCount){
            	let _cusName = comm.getStrLen(cusName,20);
                let cusNameText = '';
                if(cusCount ==1){
                    cusNameText = _cusName;
                }else if(cusCount >3){
                    cusNameText = _cusName+"等"+cusCount+"人";
                }else{
                    cusNameText = _cusName;
                }
                return cusNameText;
            },
            //操作类型文本，点赞了，评论了，该过滤器使用opType进行过滤，两个页面使用一样
            getOpConText(e) {
                let conText = "";
                switch (parseInt(e)) {
                    case 0:
                        conText = "发布了";
                        break;
                    case 1:
                        conText = "评论了";
                        break;
                    case 2:
                        conText = "转发了";
                        break;
                    case 3:
                        conText = "收藏了";
                        break;
                    case 4:
                        conText = "分享了";
                        break;
                    case 5:
                        conText = "赞了";
                        break;
                    case 6:
                        conText = "更新了";
                        break;
                }
                return conText;
            },
            //时间处理public
            msgTime(e){
                return e?commdate.diffDay_one(e.substr(0,19),commdate.local_time()):""
            },
            //这个过滤器应用[关注提醒flag=1,攒了我的flag=3]两个页面
            resourceType(flag,rescourceType,refType,messageIsValid){
                let conText = String;
                if(flag == 1){
                    if(rescourceType!=8){
                        if(messageIsValid!=1 && messageIsValid!=""){
                            conText = "";
                        }else{
                            switch (parseInt(rescourceType)) {
                                case 1:
                                    conText = "视频: ";
                                    break;
                                case 2:
                                    conText = "文库: ";
                                    break;
                                case 4:
                                    conText = "话题: ";
                                    break;
                                case 7:
                                    conText = "病例: ";
                                    break;
                                case 8:
                                    conText = "评论: ";
                                    break;
                            }
                            return conText;
                        }
                    }
                }else if(flag == 3){
                    if(messageIsValid!=1 && messageIsValid!=""){
                        conText = "";
                    }else{
                        switch (parseInt(refType)){
                            case 1:
                                conText="我的视频: ";
                                break;
                            case 2:
                                conText="我的文库: ";
                                break;
                            case 4:
                                conText="我的话题: ";
                                break;
                            case 7:
                                conText="我的病例: ";
                                break;
                            case 8:
                                conText="我的评论: ";
                                break;
                        }
                        return conText;
                    }
                }
            },
            //这个过滤器应用[关注提醒flag=1,攒了我的flag=3]两个页面
            strType(flag,rescourceType,refType,messageIsValid,name){
                let messageNameA = '《'+ name.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'》';//返回带了a标签，资源
                let messageNameB = name.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");//评论
                if(flag==1){
                    if(rescourceType!=8){   //资源
                        if(messageIsValid!=1 && messageIsValid!=""){//屏蔽的资源
                            return messageNameB;
                        }else{              //正常的资源
                            return messageNameA;
                        }
                    }
                }else if(flag==3){
                    if(refType!=8){
                        if(messageIsValid!=1 && messageIsValid!=""){//屏蔽的资源
                            return messageNameB;
                        }else{              //正常的资源
                            return messageNameA;
                        }
                    }else{
                        if(messageIsValid!=1 && messageIsValid!=""){//屏蔽的资源
                            return messageNameB;
                        }else{              //正常的资源
                            return messageNameB;
                        }
                    }
                }
            },
            //[提醒我看]类型使用
            getResourceCon(refType,isValid,attachment_resource){
                let conText = '';
                if(refType!=8){    //资源
                    if(isValid!=1&& isValid!=""){//屏蔽的资源

                    }else{  //正常的资源
                        switch (parseInt(refType)) {
                            case 1:
                                conText = "视频: ";
                                break;
                            case 2:
                                conText = "文库: ";
                                break;
                            case 4:
                                conText = "话题: ";
                                break;
                            case 7:
                                conText = "病例: ";
                                break;
                            case 8:
                                conText = "评论: ";
                                break;
                        }
                        return conText;
                    }
                }else{
                    if(attachment_resource.customer_review.reviewStatus!=1){//屏蔽的资源

                    }else{  //正常的资源
                        switch (parseInt(refType)) {
                            case 1:
                                conText = "视频: ";
                                break;
                            case 2:
                                conText = "文库: ";
                                break;
                            case 4:
                                conText = "话题: ";
                                break;
                            case 7:
                                conText = "病例: ";
                                break;
                            case 8:
                                conText = "评论: ";
                                break;
                        }
                        return conText;
                    }
                }
            },
            //[提醒我看]内容使用
            readType(refType,isValid,attachment_resource,messageName,messageBody){
                let nameA = messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                let nameB = '《'+ messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'》';//返回带了a标签，资源
                let message = '';
                if(refType==8){//评论
                    if(messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")!=""){
                        message=messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                    }else{
                        if(attachment_resource.customer_review.reviewContent!=""){
                            message= attachment_resource.customer_review.reviewContent
                        }else{
                            message='【影像】';
                        }
                    }
                }
                if(refType!=8){    //资源
                    if(isValid!=1&& isValid!=""){//屏蔽的资源
                        return nameA;

                    }else{  //正常的资源
                        return nameB;
                    }
                }else{
                    if(attachment_resource.customer_review.reviewStatus!=1){//屏蔽的资源
                        return message;

                    }else{  //正常的资源
                        return comm.cutstr(message,90,1);
                    }
                }
            },
            //评论使用的过滤器
            message(cReview,messageBody){
                let message = '';
                if(cReview.customer_review.reviewStatus==1){
                    message = cReview.customer_review.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                }else{
                    message = messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                }
                let str = comm.cutstr(message,80,1).replace(/"/g,'').replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href=/g,"data-ajax=false style='color:#2899e6;' href=/dist/personal/others_contribution.html?cid=");

                return str;
            },
            reviewType(showTitleType,isValid,cReviewP){
                let conText = '';
                if(showTitleType!=8){//非评论
                    if(isValid!=1&& isValid!=""){//屏蔽的资源

                    }else{//正常的资源
                        switch (parseInt(showTitleType)){
                            case 1:
                                conText="我的视频: ";
                                break;
                            case 2:
                                conText="我的文库: ";
                                break;
                            case 4:
                                conText="我的话题: ";
                                break;
                            case 7:
                                conText="我的病例: ";
                                break;
                            case 8:
                                conText="我的评论: ";
                                break;
                        }
                        return conText;
                    }
                }else{
                    if(cReviewP.reviewStatus!=1){//屏蔽的评论

                    }else{//正常的评论
                        switch (parseInt(showTitleType)){
                            case 1:
                                conText="我的视频: ";
                                break;
                            case 2:
                                conText="我的文库: ";
                                break;
                            case 4:
                                conText="我的话题: ";
                                break;
                            case 7:
                                conText="我的病例: ";
                                break;
                            case 8:
                                conText="我的评论: ";
                                break;
                        }
                        return conText;
                    }
                }
            },
            reviewText(showTitleType,isValid,cReviewP,messageName){
                let nameA = messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                let nameB = '《'+ messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'》';//返回带了a标签，资源
                let messageNameContent = '';
                if(showTitleType!=8){//非评论
                    if(isValid!=1&& isValid!=""){//屏蔽的资源
                        messageNameContent = nameA;
                    }else{//正常的资源
                        messageNameContent = nameB;
                    }
                }else{
                    if(cReviewP.reviewStatus!=1){//屏蔽的评论
                        messageNameContent = nameA;
                    }else{//正常的评论
                        messageNameContent = nameA;
                    }
                }
                return messageNameContent;
            }
        },
        computed: {
            ...mapGetters(['pageType']),
            nowPageType() {     //获取页面请求type类型，存在vuex中自取
                let nowRouterName = (this.$route.path).substring(1, 100);
                return this.pageType[nowRouterName];
            },
            port(){     //获取页面请求地址
              let port = '';
              let t = this;
              switch (t.nowPageType){
                  case 1:
                      port = "/mcall/customer/message/json_remindGroupList/";
                      break;
                  case 2:
                      port = "/mcall/customer/message/getMapList3/";
                      break;
                  case 3:
                      port = "/mcall/customer/message/json_preferList/";
                      break;
                  case 4:
                      port = "/mcall/customer/message/getMapList3/";
                      break;
              }
              return port;
            },
            postData(){     //获取页面请求参数
                let t = this;
                let dataJson = {
                    "dataFlag": 2,
                    "pageIndex": t.pageIndex,
                    "pageSize": t.pageSize,
                    "logoUseFlag": 3,
                    "sortType": 2,
                    'messageType':1,
                };
                switch (t.nowPageType){
                    case 1:
                        dataJson.groupDateType = 1;
                        break;
                    case 2:
                        dataJson.isRemind = 1;
                        dataJson.isShowRef = 1;
                        dataJson.isRemindOrReply = 2;
                        dataJson.isShowAtt = 1;
                        break;
                    case 3:
                        dataJson.groupDateType = 2;
                        break;
                    case 4:
                        dataJson.attUseFlag = 3;
                        dataJson.refType = 8;
                        dataJson.scene = 3;
                        dataJson.isRemind = 0;
                        dataJson.isShowRef = 1;
                        dataJson.isShowAtt = 1;
                        dataJson.isShowNoReadCount = 1;
                        dataJson.isRemindOrReply = 1;
                }
                return dataJson;
            }
        },
        components:{
            VueDataLoading,
            Loading
        },
        mounted() {
//            console.log(this.nowPageType);
            let t = this;
            let title = '';
            switch(parseInt(t.nowPageType)){
                case 0:
                    title = '消息'; break;
                case 1:
                    title = '关注提醒'; break;
                case 2:
                    title = '提醒我看'; break;
                case 3:
                    title = '赞了我的'; break;
                case 4:
                    title = '评论我的'; break;
            }
            document.title = title+'－唯医,allinmd';

            t.getList();

            if(!this.$store.state.isAllDelete){
                for(let i=0,le=this.list.length;i<le;i++){
                    this.list[i].sureDelete = 1;
                }
                this.changCount(0);
                this.list = this.list.concat([]);
            }
        },
        watch:{
            "$store.state.compileOrCancel"(){        //监听[取消<=>编辑]
                if(!this.$store.state.compileOrCancel){
                    this.deleteState = false;   //内容整体左←移动(正常显示)
                }else{
                    this.deleteState = true;    //内容整体右→移动(可以点击勾选)
                }
            },
            "$store.state.isAllDelete"(){      //监听[全部按钮]是否变化
                let sum  = 0;
                if(this.$store.state.isAllDelete){        //如果为真，让它们全部勾选、获取勾选数量、获取勾选ID集合
                    for(let i=0,le=this.list.length;i<le;i++){
                        this.list[i].sureDelete = true;
                        sum++;
                        this.messageArr.push(this.list[i].messageId);
                    }
                }else{                                    //如果为假，让它们全部取消勾选，勾选数量为0，勾选ID集合为空[]
                    for(let i=0,le=this.list.length;i<le;i++){
                        this.list[i].sureDelete = false;
                        this.messageArr = [];
                    }
                    sum = 0;
                    this.setCheckall(false);   //清空的时候让全部也初始化
                }
                //处理获取ID，把处理好的ID存放公共变量getDeleteListId
                var messageIdListParam = this.messageArr.join("").substring(0,this.messageArr.join("").lastIndexOf(","));
                this.getDeleteListId(messageIdListParam);
                //把总数存放在公共变量changCount
                this.changCount(sum);
                //给当前数据从新赋值连接
                this.list = this.list.concat([]);
            },
            "$store.state.isDelete"(){          //是否点击删除，默认位false
                let t = this;
                if(t.$store.state.isDelete){    //如果点击则删除
                    t.listTrue = true;              //1.先添加类别隐藏
                    let countSum = 0;
                    let listData = [];
                    for(let i=0,le=t.list.length;i<le;i++){
                        if(t.list[i].sureDelete){
                            countSum++
                        }else{
                            listData.push(t.list[i]);
                        }
                    }
                    let flag = false;
                    if(t.list.length==countSum){    //在下面t.list = listData赋值之前做一个判断看是否是全选
                        flag = true;
                    }else{
                        flag = false;
                    }
                    t.list = listData;
                    setTimeout(function() {         //2.在定时删除
                        $(".loading-content .al-msgListItemDeleteSelected").remove();
                    }, 200);
                    t.setDelete(false);                   //状态存放公共变量

                    //判断如果全部列表的数量==点击计数的数量视为全部点击  ||  判断点击的是否是全部删除 t.list.length==t.$store.state.count ||
                    if(flag || this.$store.state.isAllDelete){
                        t.initNoData = true;            //删除全部加载默认图
                        t.firstNoData = false;          //隐藏没有更多了[整个滚动结构隐藏]
                        t.headerBtn(false);             //让头部编辑按钮隐藏
                        t.change(false);                //让footer部分隐藏
                    }
                    t.changCount(0);                    //仅仅代表删除按钮置空 删除（1）=>删除
                }else{
                    t.listTrue = false;                 //1.不添加隐藏类别
                }
            },
            "$store.state.isLoading"(){
                if(this.$store.state.isLoading){
                    this.loading = true;
                }else{
                    this.loading = false;
                }
            },
        }
    }
</script>
<style scoped>
    .al-noContentTips {
        background-color: #eff4f8;
    }
    .al-msgListPart.al-msgListConfigType {
         padding-bottom: 0;
    }
</style>