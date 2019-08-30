/**
 * @name:   你可能认识的人，权威专家，应用位置：发现首页，朋友圈
 * @desc:
 * @example:
 * @depend:  页面要引用/js/modules/personYouKnow/module.personYouKnow.css
 * @date: 2016/8/9
 * @author: sunhaibin
 */

module.personYouKnow = function(obj){
    var container={
        path:{
            mayKnowUrl:obj.url!=undefined?obj.url:PC_CALL+'customer/pundits/getRecommendedmayKnowPundits/' //可能认识的专家
        },
        template:function(kv){
            var temp='';
            var html='';
            temp = '<div class="al-discover_knowZj">'+
            '<a href="/pages/personal/others_contribution.html?cid='+kv.cid+'" target="_blank" class="al-discover_ZjUser">'+
            '<img src="'+kv.cIcon+'" alt=""/>'+
            '</a>'+
            '<figure class="al-discover_ZjDetail">'+
            '<a href="/pages/personal/others_contribution.html?cid='+kv.cid+'" target="_blank">'+kv.cName+'</a>'+
            '<p>'+ ((kv.cTitle!=undefined&&kv.cTitle!="")?kv.cTitle:"")+'</p>'+
            '<p class="al-dis-company">'+kv.cCompany+'</p>'+
            '<div class="follow"></div>'+
            '</figure>'+
            '</div> ';
            var html =$(temp);
            html.find('.follow').follow({fId:kv.cid,fStatus:kv.relation,picStyle:5,canToggle:false});
            return html;
        },
        opts : {
            container : ""
        },
        init:function(obj){
            var t = this;
            $.extend(t.opts,obj);
            this.youMayKnow();
        },
        youMayKnow:function(){
            var t=this;
            var params={};
            var _param = obj.params!=undefined?obj.params:{
                sessionCustomerId:$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():'',   //会员id
                pageIndex:1,  //页码
                pageSize:5,    //显示条数
                logoUseFlag:10,
                platformId: $("#sesDepartment").val(),
                sortType:$('#sesCustomerId').val()!=undefined?4:''
            };
            params.paramJson= $.toJSON(_param);
            var callback=function(da){      // discover-expert 你可能认识的人
                if(da&&!$.isEmptyObject(da.responseObject.responseData)&&da.responseObject.responseData.data_list){
                    var item =da.responseObject.responseData.data_list;
                    var arr=[];
                    var li=''
                    var _it;
                    $.each(item,function(j,je){//customerPunditsEntity
                        _it = je.recommCustomerPundits;
                        li = t.template({
                            cid:_it.customerId,
                            cIcon:je.customerAtt.logoUrl,
                            cName:_it.customerName,
                            cTitle:_it.medicalTitleShow,
                            cCompany:_it.company,
                            relation:_it.relationship
                        });
                        arr.push(li);
                    });
                    t.opts.container.html(arr);
                }else{
                    t.opts.container.html('<section class="al-noFollowTips">'+
                    '<a href="/pages/personal/customerInfo.html" style="width:100%;height:100%;display:inline-block;text-align:center;padding:50px 0">'+
                    '<img src="//img10.allinmd.cn/v3/friends/msg_no_perfect.png" alt="">'+
                    '</a>'+
                    '</section>');
                }
            };
            var callback2 = function(d){    //discover-index 权威专家
                if(d&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list){
                    var item2 =d.responseObject.responseData.data_list;
                    var arr2=[];
                    var li2=''
                    var _it2;
                    $.each(item2,function(i,el){//customerPunditsEntity
                        _it2 = el.customerPunditsEntity;
                        li2 = t.template({
                            cid:_it2.customerId,
                            cIcon:el.customerAtt.logoUrl,
                            cName:_it2.customerName,
                            cTitle:_it2.medicalTitleShow,
                            cCompany:_it2.company,
                            relation:_it2.relationship
                        });
                        arr2.push(li2);

                    });

                    t.opts.container.html(arr2);
                }
            };
            var _callback=callback;
                if(/customer\/pundits\/getPunditsCustomerList\//.test(obj.url)){        //如果是dicover-index 页面的权威专家，则使用callback2
                    _callback =callback2;
                }
            comm.ajax.async(t.path.mayKnowUrl,params,_callback);

        }
    };
    container.init(obj);
};