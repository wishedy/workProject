import global_ from 'common/Global';
import comm from 'static/js/comm.js';
import app from 'static/js/comm.app';
import TempCache from "static/js/tempcache.js";
let path = {
  customerInfo : "/mcall/customer/unite/getMapById/", //客户信息
    eventUrl:'/mcall/customer/event/getMapList/',//大事件
};
const mutaions = {
  setCID(state,data){
    state.cId= data;
  },
  showUpload(state,data){
    state.showUploadImg = data;
    if(state.showUploadImg==true){
      $(".al-appWakeUpFigure").hide();
    }else{
      $(".al-appWakeUpFigure").show();
    }
  },
  getInitPage(state){
      mutaions.changeAjax(state,true);
    comm.ajax2({
      type:"post",
      url:path.customerInfo,
      data:{paramJson: JSON.stringify({customerId: state.cId,"logoUseFlag": global_.UseFlag.d,isCustomer:1,vFlag:3})},
      success:function(res){
          mutaions.changeAjax(state,false);
        let options = {
          success(res){
            let responseData=res.responseObject.responseData.data_list[0];
            mutaions.setCustomerInfo(state,responseData);
          },
        };
        comm.successRequest(res,options);
      }
    })
  },
  changeUpload(state,data){
    state.uploadIng = data;
  },
  showUploadSuccess(state,data){
    state.uploadSuccess = data;
  },
  setLogoUrl(state,data){
    state.logoUrl = data;
  },
  setCustomerInfo(state,data){
    state.customerInfo = data;
  },
  setSpecialCount(state,data){
    state.specialCount = data;
  },
    setCustomerRole(state,num){
      state.customerRole = num;
        TempCache.setItem('customerRole',num);
    },
  callApp(state,opt){
      let amChannel = comm.getpara()._amChannel;
      if(parseInt(opt,10)===15){
          app.newReleaseBox({
              imgPath:"//img50.allinmd.cn/case/release.png",
              title:opt.text+"需使用唯医骨科App",
              solidBtnTitile:"立即使用",
              authNoneTitle:" ",
              data:{
                  el: ".solidBtn",
                  ios: "allinmdios://app.allinmd.cn/applinks.html",
                  ios9: "http://app.allinmd.cn/applinks.html",
                  android: "allin://com.allin.social:75235?data={}",
              }
          });
      }else{
          app.newReleaseBox({
              imgPath:"//img50.allinmd.cn/case/release.png",
              title:opt.text+"需使用唯医骨科App",
              solidBtnTitile:"立即使用",
              authNoneTitle:" ",
              data:{
                  el: ".solidBtn",
                  ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(localStorage.getItem('userId')?"&sourceId="+localStorage.getItem('userId'):'')+"&tplPath="+opt.tplPath + (amChannel?"&_amChannel="+amChannel:''),
                  ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(localStorage.getItem('userId')?"&sourceId="+localStorage.getItem('userId'):'')+"&tplPath="+opt.tplPath+ (amChannel?"&_amChannel="+amChannel:''),
                  android: "allin://com.allin.social:75235?data={scene:10"+(localStorage.getItem('userId')?",userId:"+localStorage.getItem('userId'):'')+",type:"+opt.type+(amChannel?",_amChannel:"+amChannel:'')+ "}",
              }
          });
          if(opt.type==13){
              let id='',browType='';
              switch (parseInt(opt.type)){
                  case 13:
                      id=11248;
                      browType=298;
                      break;
              }
              mutaions.commCreatEvent(state,{id:id,browType:browType})
          }
      }


  },
  getEvent(state,data){
      mutaions.changeAjax(state,true);
      comm.ajax2({
          url:path.eventUrl,
          type:'post',
          data:data,
          success:(req)=>{
              mutaions.changeAjax(state,false);
             if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.dataList){
                 state.eventList= req.responseObject.responseData.dataList;
             }
          }
      })
  },
  changeAjax(state,data){
      if(data){
          state.isAjax.push(data);
      }else {
          state.isAjax.pop();
      }
  },
  changeIscontentTab(state,data){
        state.iscontentTab=data;
  },
    changeIsHeader(state,data){
        state.isHeader=data;
    },
    //事件埋点
    commCreatEvent(state,option){
        let dataJson={
            "11244":{keyword:"我关注的人点击"},
            "11245":{keyword:"我的粉丝点击"},
            "11246":{keyword:"我的资源点击"},
            "11248":{keyword:"编辑主页点击"},
            "11255":{keyword:"专栏tab点击"},
            "11256":{keyword:"云云tab点击"},
            "11257":{keyword:"专栏筛选点击"},
            "11258":{keyword:"专栏筛选-全部点击"},
            "11259":{keyword:"专栏筛选-视频点击"},
            "11260":{keyword:"专栏筛选-病例点击"},
            "11261":{keyword:"专栏筛选-文库点击"},
            "11262":{keyword:"个人资料详情点击"},
            "11263":{keyword:"专栏内容点击"},
            "11264":{keyword:"云云内容点击"},
            "11294":{keyword:"信息完善入口"},
            "11295":{keyword:"个人主页入口"},
            "11425":{keyword:"申请变更"},
            "11426":{keyword:"证件信息"},
        },
            triggerType='个人主页';
        switch (parseInt(option.browType)){
            case 298:
                triggerType='个人主页';
                break;
            case 312:
                triggerType='我的';
                break;
            case 354:
                triggerType='我的资料-阅读';
                break;
        }
        if(option.id){
            comm.creatEvent({
                locationId:option.locationId||'',
                triggerType:triggerType,
                triggerName:dataJson[option.id].keyword,
                keyword:option.keyword||'',
                browType:option.browType,
                actionId:option.id
            });
        }

    }
};
export default mutaions;