$(function(){
    //权限
    user.privExecute({
        operateType: 'auth',   //'login','auth','conference'
        callback:function(){}
    });
    var opts={
        $context: $('.ev-list'),
        customerId: localStorage.getItem("userId")
    }
    module.reviewList(opts);
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
});
