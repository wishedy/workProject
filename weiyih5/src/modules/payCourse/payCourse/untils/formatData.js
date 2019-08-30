import comm from 'static/js/comm.js';
import commdate from 'static/js/comm.date.js';
class formatData{
    constructor(){
        let _this = this;
        _this.formatChatData = _this.formatChatData.bind(this);
        _this.formatChildrenData = _this.formatChildrenData.bind(this);
    }
    formatChatData(data){
        let _this = this;
        let  reviewData= data.customer_review;
        let children_list = [];
        // //console.log(data);
        if(data.children_list){
            for(let num = 0;num<data.children_list.length;num++){
                let dataItem = _this.formatChatData(data.children_list[num]);
                children_list.push(dataItem);
            }
        }
        return {
            refLogoUrl: data.customer_review_insite_attachment.length>0?data.customer_review_insite_attachment[0].attUrl:'//img10.allinmd.cn/default/loading/225_150.jpg',
            refId: reviewData.refId, //资源id
            logoUrl: data.customer_att.logoUrl, //评论人头像
            username: data.customer_auth.fullName, //评论人名字
            medicalTitle: data.customer_auth.medicalTitleShow, //职称
            company: comm.htmlToString(data.customer_auth.company), //公司
            publishTime: commdate.diffDay_one(reviewData.publishTime,commdate.local_time()), //评论时间
            reviewContent: comm.htmlToString(reviewData.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>'), //评论的内容 .replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")
            collectState: data.customer_collection.isValid, //收藏状态
            reviewType: reviewData.reviewType,//被回复的资源类型
            id: reviewData.id,//当前评论id
            refUrlPc: reviewData.refUrlPc, //资源地址

            isSelf: $("#sesCustomerId").val()==reviewData.customerId,//判断是不是自己reviewData.customerId评论人的id,张恒20180629修改
            uid:$("#sesCustomerId").val(), //当前人id
            customerId: data.customer_auth.customerId,//评论人id
            refCustomerId: reviewData.refCustomerId,//资源人id，
            refCustomerIdStr: reviewData.refCustomerIdStr,//多资源人id，
            refQuoteUrl: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].pageStoragePath: '', //引用的资源地址
            refQuoteName: data.customer_quote&&data.customer_quote[0]?comm.htmlToString(data.customer_quote[0].refQuoteName):'',  //引用的资源标题*!/
            videoLogoUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attLogoUrl:'', //视频缩略图地址
            imgIsExist: data.customer_review_insite_attachment.length>0, //是否存在图片
            imgsArr: data.customer_review_insite_attachment, //图片集 //子集数组
            quoteIsExist: data.customer_quote&&data.customer_quote.length>0, //是否存在引用
            refQuoteType: data.customer_quote&&data.customer_quote[0]?data.customer_quote[0].refQuoteType:'', //引用的资源类型
            parentCustomerId:data.parent_customer_auth.customerId,
            parentCustomerName:data.parent_customer_auth.fullName,
            parentId: reviewData.parentId,//评论的父评论id 不存在为0*!/
            videoSrcUrl: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].attUrl:'', //视频源地址
            videoState: data.customer_review_insite_attachment_video[0]?data.customer_review_insite_attachment_video[0].qiniuStatus:'', //视频处理状态
            reviewStatus: reviewData.reviewStatus,
            childrenList:children_list,
            authState:data.customer_auth.state,
            teacherInfo:data.college_course_info?data.college_course_info:{},
            isValid: 1,
            videoIsExist: data.customer_review_insite_attachment_video.length>0, //是否存在礼频
            childrenCount:data.childrenCount,
            resourceIsValid:1,
            onlyAllinCircle:1//只分享到唯医朋友圈
        };
    }
    formatChildrenData(dataJson){
        let _this = this;
        let itemData=[];
        if(dataJson.childrenList){
            dataJson.childrenList.map((item,index)=>{
                itemData.push(item)
                if(_this.formatChildrenData(item).length){
                    itemData=itemData.concat(_this.formatChildrenData(item))
                }

            })
        }
        return itemData;
    }
}
export default new formatData();
