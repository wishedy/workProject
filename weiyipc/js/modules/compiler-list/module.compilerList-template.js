/**
 * 功能描述：  列表模板
 * 使用方法:   module.listTemplate({tempName:"userList"})({
                cid:"",//用户id
                customerId: "",//当前人ID
                tips:0,//是否有徽标
                userName:"",//用户名
                logoUrl:"",//头像
                state:auth.state,//认证状态
                medicalTitle:medicalTitle,//职称
                company:company,//医院
                relationship:fans.relationship//关注关系
             })
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2017/11/14.
 */
module.compilerList=function(obj){
    var template={};
    template={
        use : function(obj){
            var str = obj.tempName,len = str.indexOf(">");
            if(len > -1) return this[str.substring(0,len)][str.substring(len+1)];
            else return this[str];
        },
        userList:function(obj){
            var kv = $.extend(kv,obj);
            var cid=kv.cid;
            var customerId=kv.customerId;//本人id
            var userName=kv.userName;
            var medicalTitle=kv.medicalTitle;//职称
            var company=kv.company;//医院
            var relationship=kv.relationship?kv.relationship:0;//关注关系
            var html="";
            html='<section class="al-translatorIntrItem">'+
                '<a'+ (cid==0?' class="ev-noAllinDoctor"':'')+' href="'+(cid!=0?'//www.allinmd.cn/pages/personal/others_contribution.html?cid='+cid:'javascript:;')+
                '" target="_blank">'+
                '<img src="'+kv.logoUrl+'" data-original="'+kv.logoUrl+'" alt=""/>'+
                '</a>'+
                '<figure class="al-translatorInfo">'+
                '<div class="al-translatorInfoContent">'+
                '<div class="al-translatorUserText">' +
                '<a'+ (cid==0?' class="ev-noAllinDoctor"':'')+' href="'+(cid!=0?'//www.allinmd.cn/pages/personal/others_contribution.html?cid='+cid:'javascript:;')+
                '" target="_blank">'+userName+'</a>'+
                (cid!=0?'<p>'+
                    '<span class="al-translatorTitle">'+medicalTitle+'</span>'+
                    '<span class="al-translatorUnit">'+company+'</span>'+
                    '</p>':'')+
                '</div>'+
                (cid!=0?'<button class="fellowBtn ev-followBtn"></button>':'')+
                '</div>'+
                '</figure>'+
                '</section>';

            var temp;
            if(cid == customerId || !kv.state || cid === null||cid==0){
                temp = $(html);
            }else{
                temp = $(html);
                temp.find(".ev-followBtn").follow({fStatus:relationship,fId:cid?cid:"",picStyle: 4,canToggle:false});
            }
            return temp;
        }
    };
    return template.use(obj);
};
