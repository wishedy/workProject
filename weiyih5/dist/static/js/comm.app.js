/*
 *   created by sunhaibin on 2017/12/20
 */
import comm from 'static/js/comm.js'
const $ = require('jquery');
const App = {
  showAppDownload: function (page, zIndex) {
    comm.getAppLogin()
    if (localStorage.getItem('appLogin') == 1) { //在app上登录过过不继续往下执行
      return
    }
    var userAgentInfo = navigator.userAgent
    var isIphone = false
    if (userAgentInfo.indexOf('iPhone') > 0) {
      isIphone = true
    }
    var isWeixin = (userAgentInfo.indexOf('MicroMessenger') > 0)
    if (typeof zIndex === 'undefined') {
      index = 5
    }
    if (!page) {
      return
    }

    //alert(isWeixin);
    var sesName = 'DownAppClosed_' // + page;
    var sess
    var link
    /*if (window.sessionStorage) {
     sess = sessionStorage.getItem(sesName);
     } else {
     sess = $.cookie(sesName);
     }*/

    sess = $.cookie(sesName)
    if (!sess) { // 未关闭过
      $('body').find('.mo-download-app').remove()
      if (isIphone) {
        if (isWeixin) {
          link = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social'
        } else {
          link = 'https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583'
        }
      } else {
        link = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social'
      }

      $('body').append('<div class="mo-download-app">' +
        '<div class="app_position_close"><img src="//img50.allinmd.cn/app/colse.png" /></div>' +
        '<div class="app_position_logo"><img src="//img50.allinmd.cn/app/allin_logo.png" /></div>' +
        '<div class="app_position_text"><img src="//img50.allinmd.cn/app/app_text_' + page + '.png" /></div>' +
        '<div class="app_position_down"><a href="' + link + '" data-ajax="false">' +
        '   <img src="//img50.allinmd.cn/app/downland.png" /></a></div>' +
        '</div>')
      $('.mo-download-app').css('zIndex', zIndex)
      $('.app_position_close').on('vclick', function () {
        $('.mo-download-app:last').remove()
        /* if (window.sessionStorage) {
         sessionStorage.setItem(sesName, 1);
         } else {
         $.cookie(sesName, 1);
         }*/

        $.cookie(sesName, 1, {expires: 1, path: '/'})
      })

      /* if (isWeixin) {
       $(".app_position_down").on("vclick", function () {
       $("body").append(' <div class="app_popup_wx"></div>' +
       '              <div class="app_popup_wx_img"><img src="/images/img50/app/popup_wx.png" /></div>');
       $(".app_popup_wx_img").off("vclick").on("vclick", function () {
       $(".app_popup_wx,.app_popup_wx_img").remove();
       return false;
       })
       });
       }*/

    }

  },
  //检验是否在app上登录过
  getAppLogin: function () {
    if (!localStorage.getItem('appLogin') && localStorage.getItem('userId')) { //在登录时只会请求一次
      $.ajax({
        type: 'post',
        url: '/mcall/log/customer/login/getIsLogin/',
        data: {'paramJson': $.toJSON({'dataFlag': 2, pageIndex: 1, pageSize: 10})},
        async: false,
        dataType: 'json',
        success: function (rep) {
          if (rep.responseObject && rep.responseObject.responseMessage) {
            localStorage.setItem('appLogin', rep.responseObject.responseMessage.isLogin) //0:未登录过,1:登录过
          }
        },
        error: function () {
        }
      })
    }
  },

  /**
   * 识别链接是否从APP中分享而来 若是则显示弹层 强制去引导打开APP   ，用户不能关闭
   * @return {boolean} 是否为分享链接
   * */
  recognizeAppShareLink: function (callAppOptions) {
    /*if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")) {

     var $content = $(".content-page");
     if ($content.size() == 0) {
     $content = $("body");
     }
     $content.append("<div class='app_download_wx_jump_app'><div class='bg'></div><div class='center'><img src='//img50.allinmd.cn/callApp/share-app-popup.png' alt='' ></div></div>");

     var vp = document.querySelector('meta[name="viewport"]').getAttribute('content');

     var scale = vp.match(/initial\-scale=([\d\.]+)/) || vp.match(/maximum\-scale=([\d\.]+)/);
     if (scale != null && parseInt(scale[1]) == 1) {
     $(".app_download_wx_jump_app").addClass("viewport-small");
     }
     $("video,input,select,textarea,object").hide(); // 隐藏某些不受z-index控制的元素。    当前层 z-index 10050

     // 扩展之前页面上已存在的唤醒参数
     if (typeof callAppOptions != "undefined") { // 若存在定义
     callAppOptions = $.extend(callAppOptions, { el: ".app_download_wx_jump_app .center" });
     } else {
     var callAppOptions = {
     el: ".app_download_wx_jump_app .center",
     ios: "allinmdios://",
     ios9: "http://app.allinmd.cn/applinks.html",
     android: "allin://com.allin.social:75235"
     }
     }
     comm.bindCallApp(callAppOptions);

     $("body").css("overflow", "hidden").on("mousemove touchmove", function(e) {
     return false;
     });
     return true; // 分享的链接          7-26      http://cooperation.allinmd.cn/redmine/issues/14431
     } else {
     return false; // 非分享的链接         7-26
     }*/
  },

  /**
   * @example Common.bindCallApp({ios:"",android:"",element,callback:function(){},reCallBack:function(){}});
   * @desc 绑定唤醒APP的按钮
   * @param  options {Object,runAtOnce:true，android,ios,ios9,el} 表示地址。必须至少包含一个属性：ios,或 android,
   * 修改本函数，需连同allin/personal/app/scripts/services/mainService.js 此文件中同名函数一同修改。
   * */
  bindCallApp: function (options) {
    if (typeof options != 'object') {
      log()
      return
    }

    if (!options.hasOwnProperty('ios') && !options.hasOwnProperty('android')) {
      log()
      return
    }
    var u = window.navigator.userAgent
    var isWeixin = /MicroMessenger/.test(u)
    var isIOS9 = false
    var isIOS9_0_or_1 = false

    isIOS9 = Boolean(navigator.userAgent.match(/OS ([9]_[2-9]|[10|11][_\d])[_\d]* like Mac OS X/i)) // ios9.2之前的版本，
    isIOS9_0_or_1 = Boolean(navigator.userAgent.match(/OS ([9]_[0-1])[_\d]* like Mac OS X/i)) // ios9.2之前的版本，

    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1

    var isIphone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1
    var isWeibo = u.indexOf('weibo') > -1 || u.indexOf('Weibo') > -1
    var isQQBrowser = u.indexOf('QQ') > -1 && u.indexOf('NetType') > -1//qq内置浏览器
    var StartTime
    var elements
    var timeoutsArr = []
    var url = getUrl()
    if(options.ios9.lastIndexOf("?")>-1){
      options.ios9+="&title="+document.title;
    }else{
      options.ios9+="?title="+document.title;
    }
    /**
     *  获取对应版本的 schema 地址
     * */
    function getUrl () {
      var url = ''
      var u = navigator.userAgent
      if (isAndroid) {
        if (options.android != undefined) {
          url = options.android
        }
      }

      if (isIphone) {
        if (options.ios != undefined) {
          url = options.ios
        }
      }
      if(url.lastIndexOf("?")>-1){
        url+="&title="+document.title;
      }else{
        url+="?title="+document.title;
      }
      return url
    }

    $(window).on('blur pagehide beforeunload', clearTimeouts)

    function clearTimeouts () {
      timeoutsArr.forEach(window.clearTimeout)
      timeoutsArr = []
    }

    // 针对ios9 如果跳至中转页面,返回后仍然没有打开.则尝试用schema再打开一次,若再打不开,再跳转至下载页
    if (typeof comm.getparaNew().ios9 != 'undefined') {
      tryOpen(url)
    }
    /*尝试直接打开*/
    if (typeof options.runAtOnce == 'boolean' && options.runAtOnce) {
      if (isIOS9) {
        locationOpen(options.ios9)
      } else {
        tryOpen(url)
      }

    }

    /* 需要绑定按钮 */
    if (typeof options.el == 'string') {
      elements = options.el
      bindIng(options.callback, options.reCallBack)
    }

    function bindIng (callback, reCallBack) {
      if (isAndroid) {
        /*  alert(isAndroid + "isAndroid")
         alert(isWeixin + "isWeixin")
         alert(isWeibo + "isWeibo")
         alert(isQQBrowser + "isQQBrowser")*/
        if (isWeixin || isWeibo) {/* || isQQBrowser*/
          $(elements).on('click', function () {
            showWeixinGuide('android', callback, reCallBack)
          })
        } else {
          bindOpen()
        }
      }
      if (isIphone) {
        if (isIOS9) { // ios9直接显示加链接
          bindOpen(options.ios9)
        } else { //ios9以下 的话;          */
          if (isWeixin || isWeibo) {
            $(elements).on('click', function () {
              showWeixinGuide('ios', callback, reCallBack)
            })
          } else {
            bindOpen(options.ios)
          }
        }
      }
    }

    function bindOpen (url) {
      $(elements).off('click').on('click', {url: url || ''}, function (event) {
        var url = event.data.url
        StartTime = +(new Date)
        if (!url) {
          var url = getUrl()
        }
        tryOpen(url)
        comm.creatEvent({
          triggerType: '产品引流',
          triggerName: '打开APP',
          keyword: 'H5端引导用户打开APP按钮',
          actionId: 11029
        })
      })
    }

    /*尝试去打开*/
    function tryOpen (url) {
      if (!url) return
      if (isIOS9) {
        locationOpen(url)
      } else {
        var u = url
        window.setTimeout(function () {
          if (isIOS9_0_or_1) {
            locationOpen(u)
          } else {
            iframeOpen(u)
          }

        }, 0)
      }
      checkIfFail()
    }

    function iframeOpen (url) {
      var iframe = document.createElement('iframe')
      iframe.src = url
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      setTimeout(function () {
        document.body.removeChild(iframe)
        iframe = null
      }, 0)
    }

    function locationOpen (url) {
      window.location.href = url;
    }

    /**
     *  在不支持统一链接的微信内的话显示引导界面
     * */
    function showWeixinGuide (type, callback, reCallBack) {
      var imgPath
      if (type == 'android') {
        imgPath = '//img50.allinmd.cn/callApp/android.jpg'
      } else {
        imgPath = '//img50.allinmd.cn/callApp/ios.png'
      }
      var $content = $('.content-page')
      if ($content.length > 0) {
        $content.append('<div class=\'app_download_wx\'><img src=\'' + imgPath + '\' /></div>')
      } else {
        $('body').append('<div class=\'app_download_wx\'><img src=\'' + imgPath + '\' /></div>')
      }
      callback && callback()
      $('body').css('overflow', 'hidden').bind('touchmove', function (eve) {
        eve.preventDefault()
      })
      $('.app_download_wx').on('click', function () {
        $(this).remove()
        $('body').css('overflow', 'auto').unbind('touchmove')
        reCallBack && reCallBack()
      })
      comm.creatEvent({
        triggerType: '产品引流',
        triggerName: '打开APP',
        keyword: 'H5端引导用户打开APP按钮',
        actionId: 11029
      })
    }

    /**
     * 检测是否失败
     * 失败后跳转到APP 下载
     * */
    function checkIfFail () {

      if (isAndroid) {
        timeoutsArr.push(window.setTimeout(function () {
          if (+(new Date) - StartTime < 3100) {
            let url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social'; // app download url
              g_sps.jump(null,url);
          }
        }, 3e3))
      } else {
        timeoutsArr.push(window.setTimeout(function () {
          console.log(Date.now() - StartTime)
          if (Date.now() - StartTime < 3100) {
            let url= '';
            if (isWeixin) {
              url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social' // app download url
            } else {
              url = 'https://itunes.apple.com/cn/app/wei-yi-gu-ke-yi-sheng-ji-xu/id986266583' // app download url
            }
              g_sps.jump(null,url);
          }
        }, 3e3))
      }

    }

    function log () {
      console.log('请传入要跳转的APP地址的参数对象，如：{ios:"allinmdios://meettingBroadcast/meetInfo",android:"\'allin://com.allin.social:75235?data=mydata"}')
    }
  },
  appWakeUp: function (pattern, callAppOptions, position,callBack) {
    var t = this
    this.callAppOptions = callAppOptions
    var template = '    <section class="al-appWakeUpFigure">' +
      '        <figure class="al-appWakeUpImg">' +
      '            <img src="//img50.allinmd.cn/pages/index/logo.png" alt="">' +
      '            <figcaption>' +
      '                <h2>唯医骨科APP</h2>' +
      '                <p>通过APP浏览医学资源，更省流量</p>' +
      '            </figcaption>' +
      '        </figure>' +
      '        <button class="al-appWakeUpFigureBtn ev-openAppBtn">' +
      '            打开APP' +
      '        </button>' +
      '    </section>'
    var bTemplate = '<button class="al-appWakeUpBtn icon-appWakeUp ev-openAppBtn"><span>打开APP</span></button>'
    if (pattern === 'figure') {
      if($('.al-appWakeUpFigure').length === 0){
        $('body').prepend(template)
      }
      appWakeUpCallback('.ev-openAppBtn')
    } else if (pattern === 'btn') {
      //TODO 新增打开app按钮追加位置
      if (position && position.dom) {
        position.dom.append(bTemplate)
      } else {
        $('.al-indexHeaderItem').filter(':first').append(bTemplate)
      }
      appWakeUpCallback('.ev-openAppBtn')
    } else if(pattern==='callBackAppend'){
      //可以完全自定义模板添加方式20181129张恒
        callBack(template);
        appWakeUpCallback('.ev-openAppBtn');
    }else if (pattern === 'confirm') {

      comm.confirmBox({
        title: '在"唯医应用"中打开链接吗？',
        cancel: '取消',
        ensure: '打开',
        callBack: function () {
          appWakeUpCallback('.al-confirmModalEnsureBtn')
        },
        cancelCallback: function () {
          return false
        }
      })

      /*$(".al-confirmModal").css({
       width: "30rem",
       marginLeft: "-15rem"
       });

       $(".al-confirmModalContent").css({
       fontSize: "2em"
       })*/
      $('.al-confirmModalCancelBtn').css({
        border: 'none',
        borderRight: '1px solid #e4e9ed'
      })
    }

    function appWakeUpCallback (el) {
      if (typeof t.callAppOptions != 'undefined') { // 若存在定义
        var callAppOptions = $.extend(t.callAppOptions, {el: el})
      } else {
        var amChannel = comm.getpara()._amChannel;
        var callAppOptions = {
          el: el,
          ios: "allinmdios://",
          ios9: "http://app.allinmd.cn/applinks.html"+(amChannel!=undefined&&amChannel!=""?"?_amChannel="+amChannel:''),
          android: "allin://com.allin.social:75235"+(amChannel!=undefined&&amChannel!=""?"?data={_amChannel:"+amChannel+"}":'')
        }
      }
      App.bindCallApp(callAppOptions)
    }
  },
  //发布唤醒app弹层方法
  newReleaseBox(options){
    if ($('.ev_authPopup').length === 0) {
      var template ='<section class="authPopup ev_authPopup">\n' +
        '        <aside class="authPopupCont">\n' +
        '            <figure class="ev_authPopClose"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
        '           <aside class="exhibitionImg authTip"><img src="'+(options.imgPath?options.imgPath:'//img50.allinmd.cn/authentication/auth/attestation.png')+'"></aside>' +
        '            <article class="titleText"></article>' +
        '            <article class="detailText color333">'+(options.title?options.title:'认证后才能继续操作<br>是否前往认证？')+'</article><!--色值为#777777 浅色-->\n' +
        '            <button class="solidBtn">'+(options.solidBtnTitile?options.solidBtnTitile:'前往认证')+'</button><!--实心按钮-->\n' +
        '                    <article class="authNone">'+(options.authNoneTitle?options.authNoneTitle:'暂不认证')+'</article>' +
        '        </aside>\n' +
        '    </section>';
      $("body").append(template);
      comm.layerBottomFixed({
          layerDom:$('.ev_authPopup'),
          closeBtn:$('.authNone,.ev_authPopClose')
      });
      this.bindCallApp(options.data);

      $(".authNone,.ev_authPopClose").off('click').on("click", function () {
        options.authNoneCallBack && options.authNoneCallBack();
        $(".ev_alertBox").removeClass('show');
        $(".ev_authPopup").remove();
		  $('html').css('marginTop', '')
		  $('html,body').css({'height': '', overflow: ''})
		  $(window).scrollTop($('html').attr('sT'))
		  $('html').removeAttr('sT')
        return false;
      });
    }
  },
}
export default App







