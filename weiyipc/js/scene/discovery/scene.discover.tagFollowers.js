/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/23
 * @author: sunhaibin
 */

$(function(){
    var ctrl ={
        opt:{
            cid:$('#sesCustomerId').val(),
            tagId:comm.getpara().tId
        },
        path:{
            getInfoByTagId:PC_CALL+'recommend/tag/resource/json_info/',
            doctorList:PC_CALL+"recommend/tag/resource/json_customers/",
            tagListUrl:PC_CALL+'comm/data/property/getMapList/'
        },
        param:{
            customerId:$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
            tagId: comm.getpara().tId,
            pageIndex:1,
            pageSize:20,
            scene:2
        },
        init:function(){
            var t=this;
            t.backBtn();
            t.getTagBaseInfo();
            t.commonSearch();
            t.getHotTags();
            t.addCase();
        },
        backBtn:function(){
            var t=this;
            $('.ev_backBtn').click(function(){
                g_sps.jump(null, "/pages/discover/discover_tagSubject.html#tId="+t.opt.tagId);
            });
        },
        //加载标签名称，资源总数，是否关注，关注人数，关注人头像
        getTagBaseInfo:function(x){
            var t=this;
            t.opt.cid = $('#sesCustomerId').val();
            var _params = {paramJson: $.toJSON({
                tagId: t.opt.tagId,
                scene:2,
                customerId: t.opt.cid!=undefined? t.opt.cid:0
            })};
            var callback =function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    if(x){//判断从发布登录重新获取资源
                        $(".al-release_popBox").attr('reloadData',1);
                    }
                    var item = d.responseObject.responseData.data_list[0];
                    if(item.propertyName==""){
                        g_sps.jump(null,"/");
                    }else{
                        var tagName=item.propertyName;
                        document.title='关注'+tagName+'标签的人－唯医,allinmd';
                        $('.ev_tagName').text(tagName);   //标签名称
                        $('.ev_tagCount').text(item.sourceNum);         //资源数
                        if(item.relationship==1){//0未关注，1已关注
                            $('.ev_followBtn').addClass('followedBtn').removeClass('followBtn').attr('isFollow',1);
                        }else{
                            $('.ev_followBtn').attr('isFollow',0);
                        }
                        $('.ev_followBtn').followTag({
                            refId: t.opt.tagId,
                            refName: item.propertyName,
                            canToggle:true,
                            followType:61,
                            needSure:true,
                            addSuc:function(){
                                t.commonSearch();
                            },
                            delSuc:function(){
                                t.commonSearch();
                            }
                        });
                    }
                }
            };
            comm.ajax.async(t.path.getInfoByTagId,_params,callback);
        },
        commonSearch:function(){
            var t=this;
            var callback =function(o){
                t.param.pageIndex=o;
                t.getDocList(function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:callback});
                });
            }  ;
            t.getDocList(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:callback});
            })
        },
        getDocList:function(fn){
            var t=this;
            var _params = {paramJson: $.toJSON(t.param)};
            var _callback = function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list;
                    var html=[];
                    var _temp='';
                    $.each(item,function(i,e){
                        _temp = module.resourceListTemplate({tempName:'userList'})({
                            cid: e.customerId,
                            customerId: t.opt.cid,
                            userName: e.customerName,
                            logoUrl: e.logoUrl,
                            state: 2,
                            medicalTitle:e.medicalTitle,
                            company:e.company,
                            contribuNum: e.contributNum,
                            reviewNum:e.reviewNum,
                            fansNum:e.fansNum,
                            relationship: e.relationship
                        });
                       html.push(_temp);
                       fn&&fn(Math.ceil(d.responseObject.responseData.total_count/ t.param.pageSize));
                    });
                    $('.ev_docListBox').html(html);
                }else{
                    $('.pager').empty();
                }
            };
            comm.ajax.async(t.path.doctorList,_params,_callback);
        },
        getHotTags:function(){
            var t=this;
            var _params = {paramJson: $.toJSON({
                customerId:(t.opt.cid!=''&& t.opt.cid!=undefined)? t.opt.cid:'',
                pageIndex:1,
                pageSize:10,
                visitSiteId:1
            })};
            var callback =function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.hot_list.length){
                    var item =d.responseObject.responseData.hot_list;
                    var html='';
                    $.each(item,function(i,ele){
                        html+='<li tagId="'+ele.propertyId+'">'+comm.getStrLen(ele.propertyName,20)+'</li>';
                    });
                    $('.ev_hotTags').html(html)
                        .find('li').on('click',function(){
                            var url='/pages/discover/discover_tagSubject.html#tId='+$(this).attr('tagId');
                            //TODO sps跳转
                            g_sps.jump($(this),url);
                        });

                }
            };
            comm.ajax.async(t.path.tagListUrl,_params,callback);
        },
        //补充病例
        addCase:function(){
            var t=this;
            $(".ev_addCase").on("click",function(){
                comm.ieAlert("/pages/singlePage/upload-case.html?tId="+t.opt.tagId);
            });
        }
    } ;
    ctrl.init();
    //顶部导航登录回调
    scene.TopHeadLoginCallback= function(){
        ctrl.getTagBaseInfo('reloadData');
        ctrl.commonSearch('reloadData');
    };
});