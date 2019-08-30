var social= social || {} ;
social.delete= function(options){
    var opts= {
        reviewId: 0,
        reviewStatus: 3,
        callback: null
    };

    $.extend(opts, options);

    var reviewUrl= M_CALL+'customer/review/delete/';
    var reviewParams= {
        paramJson: $.toJSON({id: opts.reviewId,reviewStatus: opts.reviewStatus})
    }

    $.ajax({
        url: reviewUrl,
        data: reviewParams,
        success: function(){
            opts.callback && opts.callback();
        }
    });
}

social.prefer= function(options) {
    var opts= {
        customerId: 0,
        sessionCustomerId: 0,
        usefulType: 0,
        upDownType: 0,
        refId: 0,
        callback: null
    }

    $.extend(opts, options);
    var preferUrl= '';
    if (opts.upDownType) preferUrl = M_CALL + "customer/prefer/create/";
        else preferUrl = M_CALL + "customer/prefer/delete/";

    var paramJson = {
        customerId: localStorage.getItem('userId'),//opts.customerId,
        usefulType: opts.usefulType,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例）',"+
        upDownType: opts.upDownType, //0-cai 1-zan
        refId: opts.refId //  资源ID
    }

    if(opts.sessionCustomerId != 0){
        paramJson.sessionCustomerId= opts.sessionCustomerId;
    }

    var preferParams= {};
    preferParams.paramJson= $.toJSON(paramJson);
    $.ajax({
        url: preferUrl,
        data: preferParams,
        success: function(){
            opts.callback && opts.callback();
        }
    });
}

social.collect= function(options) {
    var opts= {
        customerId: 0,
        refType: 0,
        isCollect: 0,
        refId: 0,
        callback: null
    }

    $.extend(opts, options);
    var collectUrl= '';

    if (opts.isCollect) collectUrl = M_CALL + "customer/collection/create/";
    else collectUrl = M_CALL + "customer/collection/delete/";

    var collectParams = {
        paramJson: $.toJSON({
            customerId: opts.customerId,
            collectionType: opts.refType,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例）',"+
            refId: opts.refId
        })
    }

    $.ajax({
        url: collectUrl,
        data: collectParams,
        success: function(){
            opts.callback && opts.callback();
        }
    });
}

social.more= function(){
    
}
