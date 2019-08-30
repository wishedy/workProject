/**
 * 功能描述：   查看原图
 * 使用方法:
 * 注意事件：
 * 引入来源：  依赖scrollbox 作用：
 *
 * Created by LiuYuTao on 2015/4/9.
 */

$(function () {
    var params = comm.getpara();
   /* if (!params.caseId || !params.caseCategoryId) {
        alert("参数不足");
        return;
    }*/
    module.viewOriginalImg({
        caseId: params.caseId,
        caseCategoryId: params.caseCategoryId,
        topicId:params.topicId,
        reviewId:params.reviewId,
        index: params.index,
        refId:params.refId,
        refType:params.refType
    });
});