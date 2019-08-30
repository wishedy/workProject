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
 * Created by LiChunHui on 2016/8/19.
 */
module.listTemplate=function(obj){
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
            if(kv.state==-1||kv.state==3||kv.state ==0 ||kv.state ==1){//未认证
                vipIcon='';
            }else{
                vipIcon='<i class="al-vipUser"></i>';
            }
            var medicalTitle=kv.medicalTitle;//职称
            var company=kv.company;//医院

            var relationship=kv.relationship?kv.relationship:0;//关注关系
            var html='<section class="al-doctorRecommendItem">'+
                '<figure class="al-doctorRecommendImg">'+
                '<figure class="al-doctorRecommendImg'+ (cid==0?' ev-noAllinDoctor':'')+'">'+
                '<a href="'+(cid&&cid!=0?'/pages/personal/others_contribution.html?cid='+cid:'javascript:;')+'">'+
                '<img src="'+kv.logoUrl+'" alt="">'+
                (kv.tips?'<i class="icon-newTips"></i>':'')+
                '</a>'+
                '</figure>'+
                '</figure>'+
                '<article class="al-doctorRecommendMsg">'+
                '<a class="al-doctorRecommendName'+ (cid==0?' ev-noAllinDoctor':'')+'" href="'+(cid&&cid!=0?'/pages/personal/others_contribution.html?cid='+cid:'javascript:;')+'">'+userName+vipIcon+'</a>'+
                (cid&&cid!=0?(medicalTitle?'<span class="al-doctorRecommendJob">'+medicalTitle+'</span><span class="al-doctorRecommendHospital">'+company+'</span>':'<span class="al-doctorRecommendJob">'+company+'</span>'):'')+
                ((kv.terminalFlag&&cid&&cid!=0)?"":'<p class="ev-followBtn"></p>')+
                '</article>'+
                ((kv.terminalFlag&&cid&&cid!=0)?'<aside class="al-fellowAuthor ev-followBtn"></aside>':"")+
                '</section>';

            var temp;
            if(cid == customerId || !kv.state || cid === null||cid==0){
                temp = $(html);
            }else{
                temp = $(html);
                temp.find(".ev-followBtn").follow({fStatus:relationship,fId:cid?cid:""});
            }
            return temp;
        }
    };
    return template.use(obj);
}
