/**
 * @name: 不喜欢
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/2
 * @author: sunhaibin
 */
module.dislikeAction = function(){
    $('.al-unlikeBtn').on('click',function(eve){
        $('.dislikeDialog').remove();
        var cid = $('#sesCustomerId').val();
        var self =$(this);
        var itemType = self.attr('itemType');
        var itemId =self.attr('itemId');
        if($(this).parents('.al-contentOtherMsg').find('.dislikeDialog').length>0){
            return false;
        }else{
            var cancelHtml = ' <section class="dislikeDialog">'+
                    '<img src="/js/modules/dislikeAction/images/triangle.png" ></img>'+
               '<span class="des" style="">不感兴趣后，将减少此类推荐</span>'+
                    '<span class="dislikeBtn ev_dislikeBtn" style="">确定</span>'+
                '       </section>';
            $(this).parents('.al-contentOtherMsg').append(cancelHtml);
        }
        $(".ev_dislikeBtn").on("click", function(event) {
            if(cid!=undefined&&cid!=""){//登录情况下
                $.ajax({
                    url:PC_CALL+"customer/recommendResourceItem/deleteByKey/",
                    type:"post",
                    data:{paramJson: $.toJSON({
                        customerId:cid,
                        itemType:itemType,
                        itemId:itemId,
                        visitSiteId:1,
                        platformId: $('#sesDepartment').val()
                    })},
                    dataType:'json',
                    success:function(d){
                        if(d&& d.responseObject.responseStatus==true){
                            $(".dislikeDialog").remove();
                            self.parents('.ev_flow').remove();
                        }
                    },
                    error:function(){
                        $(".dislikeDialog").remove();
                    }
                });
            }else{//未登录情况下，直接删除，不做记录，下次还能刷新出来
                $(".dislikeDialog").remove();
                self.parents('.ev_flow').remove();
            }
            event.stopPropagation();
        });
        $('body').not(".dislikeDialog").on("click", function(ev) {
            $(".dislikeDialog").remove();
            cancelBubble = true;
            ev.stopPropagation();
            $('body').not(".dislikeDialog").off('click');
        });
        return false;
    });
};
