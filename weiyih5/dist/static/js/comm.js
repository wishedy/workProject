import TempCache from './tempcache.js'
import axios from 'axios'
import Log from './log.js'
window.version="2.7.1.0";//版本号
const comm = {
  ajax(obj) {//axios
    axios({
      url: obj.url,
      method: obj.method || 'get',
      data: obj.data,
      transformRequest: [
        function (data) {
          if (obj.paramJson) {
            return 'paramJson=' + JSON.stringify(obj.data)
          } else {
            return obj.data
          }
        }
      ],
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(function (res) {
        obj.success && obj.success(res)
      }).catch(function (err) {
      obj.fail && obj.fail(err)
    })
  },
  ajax2(options) {//原生
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'
    var params = formatParams(options.data)
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status
        if (status >= 200 && status < 300) {

          options.success && options.success(JSON.parse(xhr.responseText), xhr.responseXML)
        } else {
          options.fail && options.fail(status)
        }
      }
    }
    //连接 和 发送 - 第二步
    if (options.type == 'GET') {
      xhr.open('GET', options.url + '?' + params, true)
      xhr.send(null)
    } else if (options.type == 'POST') {
      xhr.open('POST', options.url, true)
      //设置表单提交时的内容类型
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(params)
    }

    //格式化参数
    function formatParams (data) {
      var arr = []
      for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
      }
      arr.push(('v=' + Math.random()).replace('.', ''))
      return arr.join('&')
    }

  },
  checkAccountType(account) {
    let type = ''
    // if (/^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(account)) {
    if (/^1\d{10}$/.test(account)) {
      type = 'mobile'
    }
    if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(account)) {
      type = 'email'
    }
    return type
  },
  htmlToString(str) {
    var rstStr = (str + '').replace(/[<>&]/g, function (c) {
      return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c]
    })
    var tempArr = rstStr.split('\&lt\;\/a\&gt\;&lt\;a')

    if (tempArr.length >= 2) {
      rstStr = tempArr.map(function (d, index) {
        var s = d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi, '<a href="$1">$2')
        s = s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi, ' href="$1">$2</a>')
        return s
      }).join('</a><a')
    } else {
      rstStr = (rstStr + '').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi, '<a href="$1">$2</a>')
      /* 恢复文本中的提醒谁看的A链接*/
    }
    rstStr = rstStr.replace(/@@/g, '@')
    return rstStr
  },
  cookie:{
    set:function(key,val,time){//设置cookie方法
        var date=new Date(); //获取当前时间
        var expiresDays=time;  //将date设置为n天以后的时间
        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date+";path=/;domain=.allinmd.cn";  //设置cookie
    },
    get:function(key){//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for(var i=0;i<arrCookie.length;i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete:function(key) { //删除cookie方法
        if(this.get(key)){
            // document.cookie = key + "=; expires =-1;domain=.allinmd.cn;";//设置cookie
            this.set(key,'',-1)
        }

    }
  },
  toWKH(v) {
    if (isNaN(parseInt(v))) return 0
    if (parseInt(v, 10) < 10000 && parseInt(v, 10) > 999) {
      return Math.floor(parseInt(v, 10) / 1000) + '千+'
    } else if (parseInt(v, 10) > 9999) {
      return Math.floor(parseInt(v, 10) / 10000) + '万+'
    } else {
      return v
    }
  },
  toW(v){
      if (isNaN(parseInt(v))) return 0;
      if (parseInt(v, 10) > 9999) {
          return (parseInt(v, 10) / 10000).toFixed(1) + '万'
      } else {
          return v
      }
  },
  successRequest(data, options) {
    let t = this
    const hasData = function (r) {
      if (r) {
        if (t.isEmptyObject(r.responseObject)) {
          return false
        } else {
          if (t.isEmptyObject(r.responseObject.responseData)) {
            return false
          } else {
            return true
          }
        }
      } else {
        return false
      }
    }
    let hasOnOff = hasData(data)
    if (hasOnOff) {
      let diyOnOff = false
      if (options.diyCheck) {
        diyOnOff = options.diyCheck(data)
      }
      let realNoData = ((data.responseObject.responseMessage) == 'NO DATA')
      let realStatus = data.responseObject.responseStatus
      let len = (data.responseObject.responseData.data_list) ? (data.responseObject.responseData.data_list.length == 0) : true
      if (realNoData || !realStatus || len || diyOnOff) {
        options.failed && options.failed(data)
      } else {
        options.success && options.success(data)
      }
    } else {
      options.failed && options.failed(data)
    }
  },
    searchRequest(data, options) {
        let t = this
        const hasData = function (r) {
            if (r) {
                if (t.isEmptyObject(r.responseObject)) {
                    return false
                } else {
                    if (t.isEmptyObject(r.responseObject.responseData)) {
                        return false
                    } else {
                        return true
                    }
                }
            } else {
                return false
            }
        }
        let hasOnOff = hasData(data)
        if (hasOnOff) {
            let diyOnOff = false
            if (options.diyCheck) {
                diyOnOff = options.diyCheck(data)
            }
            let realNoData = ((data.responseObject.responseMessage) == 'NO DATA')
            let realStatus = data.responseObject.responseStatus
            let len = (data.responseObject.responseData.dataList) ? (data.responseObject.responseData.dataList.length == 0) : true
            if (realNoData || !realStatus || len || diyOnOff) {
                options.failed && options.failed(data)
            } else {
                options.success && options.success(data)
            }
        } else {
            options.failed && options.failed(data)
        }
    },
  queryParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  getpara(symbol) { //获取参数的函数
    let param = {}
    let search = location.search.split('?')[1]
    let hash = location.hash
    if (search) {
      search = search.split('&')
      for (let i = 0; i < search.length; i++) {
        let item = search[i].split('=')
        if (item[1]) {
          param[item[0]] = decodeURIComponent(item[1].split('#/')[0])
        }
      }
    }
    if (hash) {
      let newarr = hash.split('?')
      for (let i = 0; i < newarr.length; i++) {
        let ii = newarr[i].split('&')
        for (let j = 0; j < ii.length; j++) {
          let item = ii[j].split('=')
          if (item[1]) {
            param[item[0]] = decodeURIComponent(item[1].split('#/')[0])
          }
        }

      }
    }
    return param
  },
  getparaNew() //获取参数的函数
  {
    return this.getpara()
  },
  shareLog(options) {
    let customerId = TempCache.getItem('userId')
    let conId = comm.getpara().conId
    let defaultOptions = {
      customerId: customerId,
      shareType: 3,
      resourceId: conId,
      resourceType: 3,
      refId: conId,
      isValid: 1,
      refUrl: window.location.href
    }
    //  shareType"));//1-视频，2-文库，3-会议 4-话题，7-病例，8－评论
    //  shareSence"));//分享场景24-会议直播页面-多会场 25-直播列表页面 26-会议回放页面
    //  shareChannel);//分享渠道（1-QQ空间，2-QQ好友，3-新浪微博，4-微信好友，5-微信朋友圈 ，6短信
    defaultOptions = $.extend(defaultOptions, options)

    this.ajax2({
      url: '/mcall/customer/share/createShareLog/',
      type: 'POST',
      data: {
        paramJson: JSON.stringify(defaultOptions)
      },
      success: function () {

      }
    })
  },
  /**$(".ev-follow").on('click', function () { //关注资源
                  comm.ajax2({
                    url: path.followCreate,
                    data: {paramJson: JSON.stringify({refId: t.para.refId, dataFlag: 2, followType: 7})},
                    type: 'POST',
                    success: function () {
                      popup('已成功关注');
                      $(".ev-follow").hide();
                    }
                  })
                });
   * 将超出长度的字符串加。。。
   * @param str
   * @param len
   * @returns {string}
   */
  getStrLen(str, len) {
    if (typeof str != 'undefined') {
      var strlen = 0,
        s = ''
      for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i)
        if (str.charCodeAt(i) > 128) {
          strlen = strlen + 2
          if (strlen >= len) {
            return s.substring(0, s.length - 1) + '...'
          }
        } else {
          strlen = strlen + 1
          if (strlen >= len) {
            return s.substring(0, s.length - 2) + '...'
          }
        }
      }
      return s
    }
  },
  /*
   * 截取字符长度
   * */
  getStrByteLen(str, len) {
    if (typeof str != 'undefined') {
      var newStr = '',
        newLength = 0
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
          newLength += 2
        } else {
          newLength++
        }
        if (newLength <= len) {
          newStr = newStr.concat(str[i])
        } else {
          break
        }
      }
      if (newLength > len) {
        newStr = newStr + '...'
      }
      return newStr
    }
  },
  /*
   *获取字符串长度
   */
  getByteLen(val) {
    var len = 0
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) !== null) // 全角
        len += 2
      else
        len += 1
    }
    return len
  },
  /**
   * js截取字符串，中英文都能用
   * @param str：需要截取的字符串
   * @param len: 需要截取的长度
   */
  cutstr(str, len, symbol) {
    let str_length = 0
    let str_len = 0
    let str_cut = new String()
    str_len = str.length
    for (var i = 0; i < str_len; i++) {
      let a = str.charAt(i)
      str_length++
      if (escape(a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_length++
      }
      str_cut = str_cut.concat(a)
      if (str_length >= len) {
        if (symbol) {
          str_cut = str_cut.concat('...')
        }
        return str_cut
      }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
      return str
    }
  },

  revCutstr(str, len, symbol) {
    function newCut (str, len) {
      let str_length = 0
      let str_len = 0
      let str_cut = new String()
      str_len = str.length - 1
      for (var i = str_len; i >= 0; i--) {
        let a = str.charAt(i)
        str_length++
        if (escape(a).length > 4) {
          //中文字符的长度经编码之后大于4
          str_length++
        }
        str_cut = str_cut.concat(a)
        if (str_length >= len) {
          if (symbol) {
            str_cut = str_cut.concat('...')
          }
          return str_cut
        }
      }
      //如果给定字符串小于指定长度，则返回源字符串；
      if (str_length < len) {
        return str
      }
    }

    var str = newCut(str, len)
    str_cut1 = new String()
    for (var i = str.length; i >= 0; i--) {
      a = str.charAt(i)
      str_cut1 = str_cut1.concat(a)
    }
    return str_cut1
  },
  redirect(href, paramTime, isLoading, loadingTxt) {
    //是否显示loading，默认显示
    var isL = true
    if (isLoading == false) {
      isL = isLoading
    }
    if (isL) {
      /*if (loadingTxt && loadingTxt != "") {
       $.mobile.loading("show", {text: loadingTxt, textVisible: true});
       } else {
       $.mobile.loading("show");
       }*/
    }
    var time = 1000,
      hash, temp
    if (paramTime != null && typeof paramTime != 'undefined') {
      time = paramTime
    }
    if (href.indexOf('#') > 0) {
      temp = href.split('#')
      href = temp[0]
      hash = temp[1]
    }

    /*  if(href.indexOf("?")>0){
     href += "&_=" + Math.random();
     }else{
     href += "?_=" + Math.random();
     }
     if(hash!="" && hash!=undefined){
     href = href+"#"+hash;
     }*/
    if (time > 0) {
      setTimeout(function () {
        //$.mobile.loading("hide");
          g_sps.jump(null,href);
      }, time)
    } else {
        g_sps.jump(null,href);
    }

  },
  browser: {
    mozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
    webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
    opera: /opera/.test(navigator.userAgent.toLowerCase()),
    msie: /msie/.test(navigator.userAgent.toLowerCase()),
    versions: function () {
      var u = navigator.userAgent,
        app = navigator.appVersion
      return { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
      }
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  },
  checkUrl: function (type, pra) {
    var urlInfoContainer = [
      {
        'regx': /html\/m\/video\//g,
        'type': '4',
        'name': '视频内容页',
        'urlLink': 'https://m.allinmd.cn/html/m/video/'
      },
      {'regx': /html\/m\/doc\//g, 'type': '5', 'name': '视频内容页', 'urlLink': 'https://m.allinmd.cn/html/m/doc/'},
      {
        'regx': /personal_index.*#\/index/g,
        'type': '312',
        'name': '我的首页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_index.html'
      },
        {
            'regx': /personal_index.*#\/IndexHome/g,
            'type': '298',
            'name': '个人主页',
            'urlLink': 'https://m.allinmd.cn/pages/personal/personal_index.html'
        },
        {
            'regx': /personal_index.*#\/Info/g,
            'type': '354',
            'name': '我的资料-阅读',
            'urlLink': 'https://m.allinmd.cn/pages/personal/personal_index.html'
        },
      {
        'regx': /personal_customerInfo/g,
        'type': '8',
        'name': '个人资料页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_customerInfo.html'
      },
      {
        'regx': /html\/m\/topic\//g,
        'type': '9',
        'name': '话题内容页',
        'urlLink': 'https://m.allinmd.cn/html/m/topic/'
      },
      {'regx': /html\/m\/case\//g, 'type': '10', 'name': '病例内容页', 'urlLink': 'https://m.allinmd.cn/html/m/case/'},
      {
        'regx': /details_content/g,
        'type': '12',
        'name': '评论内容页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/details_content.html'
      },
      {
        'regx': /video_index/g,
        'type': '17',
        'name': '视频列表页面',
        'urlLink': 'https://m.allinmd.cn/pages/video/video_index.html'
      },
      {
        'regx': /doc_index/g,
        'type': '18',
        'name': '文库列表页面',
        'urlLink': 'https://m.allinmd.cn/pages/doc/doc_index.html'
      },
      {
        'regx': /topic_index/g,
        'type': '19',
        'name': '话题列表页',
        'urlLink': 'https://m.allinmd.cn/pages/topic/topic_index.html'
      },
      {
        'regx': /case_index/g,
        'type': '20',
        'name': '病例列表页面',
        'urlLink': 'https://m.allinmd.cn/pages/case/case_index.html'
      },
      {
        'regx': /meeting-place/g,
        'type': '21',
        'name': '年会内容页面',
        'urlLink': 'https://m.allinmd.cn/pages/conference/meeting-place.html'
      },
      {
        'regx': /playBackId/g,
        'type': '26',
        'name': '会议回放页面',
        'urlLink': 'https://m.allinmd.cn/pages/conference/live-wrap.html'
      },
      {
        'regx': /conference\/live-wrap/g,
        'type': '24',
        'name': '会议直播页面-多会场',
        'urlLink': 'https://m.allinmd.cn/pages/conference/live-wrap.html'
      },
      {
        'regx': /live_list/g,
        'type': '25',
        'name': '直播列表页面',
        'urlLink': 'https://m.allinmd.cn/pages/conference/live_list.html'
      },
      {
        'regx': /send_email_input/g,
        'type': '29',
        'name': '找回密码页面',
        'urlLink': 'https://m.allinmd.cn/mcall/customer/reset/password/send_email_input/'
      },
      {'regx': /html\/m\/theme/g, 'type': '79', 'name': '专题页面', 'urlLink': 'https://m.allinmd.cn/html/m/theme/'},
      {
        'regx': /friends_circle/g,
        'type': '36',
        'name': '朋友圈',
        'urlLink': 'https://m.allinmd.cn/pages/personal/friends_circle.html'
      },
      {
        'regx': /tag_seminar/g,
        'type': '37',
        'name': '标签专题',
        'urlLink': 'https://m.allinmd.cn/pages/discover/tag_seminar.html'
      },
      {
        'regx': /newList.html?dateType=1/g,
        'type': '38',
        'name': '每日最新',
        'urlLink': 'https://m.allinmd.cn/pages/list/newList.html?dateType=1'
      },
      {
        'regx': /newList.html?dateType=2/g,
        'type': '39',
        'name': '每周最新',
        'urlLink': 'https://m.allinmd.cn/pages/list/newList.html?dateType=2'
      },
      {
        'regx': /hotList.html?groupByFlag=1/g,
        'type': '40',
        'name': '每日最热',
        'urlLink': 'https://m.allinmd.cn/pages/list/hotList.html?groupByFlag=1'
      },
      {
        'regx': /hotList.html?groupByFlag=5/g,
        'type': '41',
        'name': '每周最热',
        'urlLink': 'https://m.allinmd.cn/pages/list/hotList.html?groupByFlag=5'
      },
      {
        'regx': /meeting_index/g,
        'type': '42',
        'name': '会议列表页',
        'urlLink': 'https://m.allinmd.cn/pages/conference/meeting_index.html'
      },
      {
        'regx': /discover_index/g,
        'type': '43',
        'name': '发现首页',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_index.html'
      },
      {
        'regx': /discover_profession/g,
        'type': '44',
        'name': '按专业',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_profession.html'
      },
      {
        'regx': /discover_disease/g,
        'type': '45',
        'name': '按疾病',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_disease.html'
      },
      {
        'regx': /discover_operation/g,
        'type': '46',
        'name': '按术士',
        'urlLink': 'https://m.allinmd.cn//pages/discover/discover_operation.html'
      },
      {
        'regx': /discover_searchTag/g,
        'type': '47',
        'name': '按标签',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_searchTag.html'
      },
      {
        'regx': /discover_type/g,
        'type': '48',
        'name': '按类型',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_type.html'
      },
      {
        'regx': /discover_seminar/g,
        'type': '49',
        'name': '按专题',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_seminar.html'
      },
      {
        'regx': /discover_master/g,
        'type': '50',
        'name': '权威专家',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_master.html'
      },
      {
        'regx': /discover_activition/g,
        'type': '51',
        'name': '热门活动',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_activition.html'
      },
      {
        'regx': /activity_details/g,
        'type': '80',
        'name': '活动介绍',
        'urlLink': 'https://m.allinmd.cn/html/m/activity/'
      },
      {
        'regx': /personal_works/g,
        'type': '81',
        'name': '活动资源列表',
        'urlLink': 'https://m.allinmd.cn/html/m/activity/'
      },
      {
        'regx': /personal_center/g,
        'type': '82',
        'name': '活动-我的作品',
        'urlLink': 'https://m.allinmd.cn/html/m/activity/'
      },
      {
        'regx': /html\/m\/activity/g,
        'type': '52',
        'name': '活动内容',
        'urlLink': 'https://m.allinmd.cn/html/m/activity/'
      },
      {
        'regx': /message_main/g,
        'type': '53',
        'name': '消息列表',
        'urlLink': 'https://m.allinmd.cn/pages/message/message_main.html'
      },
      {
        'regx': /message_follow/g,
        'type': '54',
        'name': '关注提醒',
        'urlLink': 'https://m.allinmd.cn/pages/message/message_follow.html'
      },
      {
        'regx': /message_review/g,
        'type': '55',
        'name': '评论我的',
        'urlLink': 'https://m.allinmd.cn/pages/message/message_review.html'
      },
      {
        'regx': /message_remind/g,
        'type': '56',
        'name': '提醒我看',
        'urlLink': 'https://m.allinmd.cn/pages/message/message_remind.html'
      },
      {
        'regx': /message_praise/g,
        'type': '57',
        'name': '赞了我的',
        'urlLink': 'https://m.allinmd.cn/pages/message/message_praise.html'
      },
      {
        'regx': /personal_contribution/g,
        'type': '64',
        'name': '我的贡献',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_contribution.html'
      },
      {
        'regx': /personal_active/g,
        'type': '65',
        'name': '我的动态',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_active.html'
      },
      {
        'regx': /others_index.*#\/IndexHome/g,
        'type': '299',
        'name': '他人主页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/others_index.html'
      },
        {
            'regx': /others_index.*#\/contribution/g,
            'type': '299',
            'name': '他人主页',
            'urlLink': 'https://m.allinmd.cn/pages/personal/others_index.html'
        },
        {
            'regx': /others_index.*#\/Info/g,
            'type': '355',
            'name': '他人资料-阅读',
            'urlLink': 'https://m.allinmd.cn/pages/personal/others_index.html'
        },
      {
        'regx': /others_contribution/g,
        'type': '67',
        'name': '他的贡献',
        'urlLink': 'https://m.allinmd.cn/pages/personal/others_contribution.html'
      },
      {
        'regx': /others_baseInfo/g,
        'type': '68',
        'name': '他的简介',
        'urlLink': 'https://m.allinmd.cn/pages/personal/others_baseInfo.html'
      },
      {
        'regx': /search/g,
        'type': '78',
        'name': '搜索页',
        // "urlLink": "https://m.allinmd.cn/pages/search/search.html"
        'urlLink': 'https://m.allinmd.cn/dist/search/search.html'
      },
      {
        'regx': /case_upload/g,
        'type': '83',
        'name': '病例编辑页',
        'urlLink': 'https://m.allinmd.cn/pages/case/case_upload.html'
      },
      {
        'regx': /topic_upload/g,
        'type': '84',
        'name': '话题编辑页',
        'urlLink': 'https://m.allinmd.cn/pages/topic/topic_upload.html'
      },
      {
        'regx': /personal_draft/g,
        'type': '88',
        'name': '草稿页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_draft.html'
      },
      {
        'regx': /personal_collection/g,
        'type': '95',
        'name': '我的收藏',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_collection.html'
      },
      {
        'regx': /personal_collection/g,
        'type': '96',
        'name': 'TA的收藏',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_collection.html'
      },
      {
        'regx': /personal_myFollow/g,
        'type': '97',
        'name': '关注资源页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_myFollow.html'
      },
      {
        'regx': /personal_browsed/g,
        'type': '98',
        'name': '浏览记录页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_browsed.html'
      },
      {
        'regx': /personal_myComment/g,
        'type': '99',
        'name': '我的评论',
        'urlLink': 'https://m.allinmd.cn/pages/personal/personal_myComment.html'
      },
      {
        'regx': /customerInfoEdit/g,
        'type': '102',
        'name': '简介编辑页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/customerInfoEdit.html'
      },
      {
        'regx': /authInfo/g,
        'type': '103',
        'name': '认证信息编辑页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/authInfo.html'
      },
      {
        'regx': /setting/g,
        'type': '104',
        'name': '设置页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/setting.html'
      },
      {
        'regx': /securityAccount/g,
        'type': '105',
        'name': '帐号安全',
        'urlLink': 'https://m.allinmd.cn/pages/personal/securityAccount.html'
      },
      {
        'regx': /bindMobile/g,
        'type': '107',
        'name': '绑定手机',
        'urlLink': 'https://m.allinmd.cn/pages/personal/bindMobile.html'
      },
      {
        'regx': /bindEmail/g,
        'type': '108',
        'name': '绑定邮箱',
        'urlLink': 'https://m.allinmd.cn/pages/personal/bindEmail.html'
      },
      {
        'regx': /bindCAOS/g,
        'type': '109',
        'name': '绑定COAS',
        'urlLink': 'https://m.allinmd.cn/pages/personal/bindCAOS.html'
      },
      {
        'regx': /updatePassword/g,
        'type': '110',
        'name': '密码修改',
        'urlLink': 'https://m.allinmd.cn/pages/personal/updatePassword.html'
      },
      {
        'regx': /discover_sendMsg/g,
        'type': '112',
        'name': '专题反馈页',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_sendMsg.html'
      },
      {
        'regx': /feedBack/g,
        'type': '113',
        'name': '意见反馈页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/feedBack.html'
      },
      {
        'regx': /discover_addMaster/g,
        'type': '114',
        'name': '权威专家申请',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_addMaster.html'
      },
      {
        'regx': /friends_recommend/g,
        'type': '123',
        'name': '推荐医师',
        'urlLink': 'https://m.allinmd.cn/pages/personal/friends_recommend.html'
      },
      {
        'regx': /sns.html?action=fans/g,
        'type': '124',
        'name': '我的-粉丝列表',
        'urlLink': 'https://m.allinmd.cn/pages/personal/sns.html?action=fans'
      },
      {
        'regx': /others_sns.html?action=fans/g,
        'type': '125',
        'name': 'TA的粉丝列表',
        'urlLink': 'https://m.allinmd.cn/pages/personal/others_sns.html?action=fans'
      },
      {
        'regx': /sns.html?action=follow/g,
        'type': '126',
        'name': '关注医师列表',
        'urlLink': 'https://m.allinmd.cn/pages/personal/sns.html?action=follow'
      },
      {
        'regx': /sns.html?action=praise/g,
        'type': '127',
        'name': '点赞列表',
        'urlLink': 'https://m.allinmd.cn/pages/personal/sns.html?action=praise'
      },
      {
        'regx': /tag_followerList/g,
        'type': '130',
        'name': '关注此标签的人',
        'urlLink': 'https://m.allinmd.cn/pages/discover/tag_followerList.html'
      },
      {
        'regx': /education/g,
        'type': '133',
        'name': '教育背景页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/education.html'
      },
      {
        'regx': /cEducation/g,
        'type': '135',
        'name': '继续教育页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/cEducation.html'
      },
      {
        'regx': /honor/g,
        'type': '136',
        'name': '获得荣誉页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/honor.html'
      },
      {
        'regx': /fund/g,
        'type': '137',
        'name': '科研基金页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/fund.html'
      },
      {
        'regx': /social/g,
        'type': '138',
        'name': '社会任职页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/social.html'
      },
      {
        'regx': /opus/g,
        'type': '139',
        'name': '学术专著页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/opus.html'
      },
      {
        'regx': /patent/g,
        'type': '140',
        'name': '发明专利页',
        'urlLink': 'https://m.allinmd.cn/pages/personal/patent.html'
      },
      {
        'regx': /about/g,
        'type': '147',
        'name': '关于我们',
        'urlLink': 'https://m.allinmd.cn/pages/personal/about.html'
      },
      {
        'regx': /login_caos/g,
        'type': '148',
        'name': '联合登录-caos登录',
        'urlLink': 'https://m.allinmd.cn/pages/passport/login_caos.html'
      },
      {
        'regx': /living_watch/g,
        'type': '151',
        'name': 'UGC直播终端-直播中',
        'urlLink': 'https://m.allinmd.cn/pages/live/living_watch.html'
      },
      {
        'regx': /livingList/g,
        'type': '156',
        'name': 'UGC直播-直播列表',
        'urlLink': 'https://m.allinmd.cn/pages/live/live.html'
      },
      {
        'regx': /livingOrder/g,
        'type': '157',
        'name': 'UGC直播-我的预约',
        'urlLink': 'https://m.allinmd.cn/pages/live/livingOrder.html'
      },
      {
        'regx': /eBook_details/g,
        'type': '159',
        'name': '书籍主页',
        'urlLink': 'https://m.allinmd.cn/pages/eBook/eBook_details.html'
      },
      {
        'regx': /eBook_transformerList/g,
        'type': '163',
        'name': '译者列表页',
        'urlLink': 'https://m.allinmd.cn/pages/eBook/eBook_transformerList.html'
      },
      {
        'regx': /eBook_chapter/g,
        'type': '164',
        'name': '章节列表页',
        'urlLink': 'https://m.allinmd.cn/pages/eBook/eBook_chapter.html'
      },
      {
        'regx': /scoreDetails/g,
        'type': '167',
        'name': '评分详情界面',
        'urlLink': 'https://m.allinmd.cn/pages/scoringSystem/scoreDetails.html'
      },
      {
        'regx': /productListPage/g,
        'type': '74',
        'name': '相关产品',
        'urlLink': 'https://m.allinmd.cn/pages/scoringSystem/productListPage.html'
      },
      {
        'regx': /discover_series_course/g,
        'type': '199',
        'name': '体系化课程页',
        'urlLink': 'https://m.allinmd.cn/pages/discover/series/feedback.html'
      },
      {
        'regx': /discover_series_details/g,
        'type': '200',
        'name': '体系化课程资源页',
        'urlLink': 'https://m.allinmd.cn/pages/discover/series/discover_series_details.html'
      },
      {
        'regx': /meeting_fellow/g,
        'type': '211',
        'name': '我关注的会议',
        'urlLink': 'https://m.allinmd.cn/pages/channel/conference/meeting_follow.html'
      },
      {
        'regx': /meeting_trailer/g,
        'type': '212',
        'name': '会议预告',
        'urlLink': 'https://m.allinmd.cn/pages/channel/conference/meeting_trailer.html'
      },
      {
        'regx': /meeting_detail/g,
        'type': '94',
        'name': '会议终端页',
        'urlLink': 'https://m.allinmd.cn/pages/conference/meeting_detail.html'
      },
      {
        'regx': /auth\/auth.html/g,
        'type': '10001',
        'name': '认证-基本信息',
        'urlLink': 'https://m.allinmd.cn/pages/passport/auth/auth.html'
      },
      {
        'regx': /auth\/auth.html.*#secondStep/g,
        'type': '10014',
        'name': '认证-证件信息',
        'urlLink': 'https://m.allinmd.cn/pages/passport/auth/auth.html'
      },
      {
        'regx': /auth\/authInfo.html/g,
        'type': '10025',
        'name': '个人中心-其他个人信息-个人中心-证件信息',
        'urlLink': 'https://m.allinmd.cn/pages/passport/auth/authInfo.html'
      },
      {
        'regx': /nationalDayActivity/g,
        'type': '216',
        'name': '2017十一国庆活动页',
        'urlLink': 'https://m.allinmd.cn/pages/column/nationalDayActivity.html'
      },
      {
        'regx': /discover_feature_column/g,
        'type': '217',
        'name': '特色栏目',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_feature_column.html'
      },
      {
        'regx': /discover_feature_detail/g,
        'type': '218',
        'name': '特色栏目详情页',
        'urlLink': 'https://m.allinmd.cn/pages/discover/discover_feature_detail.html'
      }

    ]
    var urlOnOff = true
    var regx = /^(https|http):\/\/m.allinmd.cn\/$/
    if (type == 'type') {
      for (var uNum = 0; uNum < urlInfoContainer.length; uNum++) {
        if (urlInfoContainer[uNum].regx.test(pra)) {
          urlOnOff = false
          return urlInfoContainer[uNum].type
        }
      }
      if (urlOnOff) {
        //if (regx.test(pra)) {
        if (location.pathname=="/") {
          return '35'
        }
      }
    } else {
      for (var uNumT = 0; uNumT < urlInfoContainer.length; uNumT++) {
        if (urlInfoContainer[uNumT].type == pra) {
          return urlInfoContainer[uNumT].urlLink
        }
      }
      if (pra == '35') {
        if (regx.test(pra)) {
          return 'https://m.allinmd.cn'
        }
      }
    }

  },
  authFail() {
    var template = '<section class="al-authFailBox">' +
      '<header class="al-authFailTitle">' +
      '<h2>认证拒绝</h2>' +
      '</header>' +
      '<article class="al-authFailText">' +
      '<p>很抱歉！您提交的认证资料不符合要求，为了保证您的权益，请重新认证！</p>' +
      '</article>' +
      '<section class="al-authFailBtn">' +
      '<button class="btn-primary-lg" id="now_goAuth">' +
      '现在认证' +
      '</button>' +
      '<span class="al-authGiveUp">暂不认证</span>' +
      '</section>' +
      '</section>'
    if ($('.al-authFailBox').size() === 0) {
      $('body').append(template)

      setTimeout(function () {

        if (comm.browser.versions.ios) {
          $('.al-authFailBox').addClass('show')
          $('.al-mainInner').addClass('al-fullBlur')
          if ($('.content-page').size() !== 0) {
            $('.content-page').addClass('al-fullBlur')
          }
        } else {
          $('.al-authFailBox').addClass('al-fullBlurAndroid')
          $('.al-mainInner').addClass('al-fullBlurAndroid')
          if ($('.content-page').size() !== 0) {
            $('.content-page').addClass('al-fullBlurAndroid')
          }
        }
        if ($('.al-releasePageMask').size() !== 0) {
          $('.al-releasePageMask').removeClass('show')
        }
      }, 200)
    } else {
      if (comm.browser.versions.ios) {
        $('.al-authFailBox').addClass('show')
        $('.al-mainInner').addClass('al-fullBlur')
        if ($('.content-page').size() !== 0) {
          $('.content-page').addClass('al-fullBlur')
        }
      } else {
        $('.al-authFailBox').addClass('al-fullBlurAndroid')
        $('.al-mainInner').addClass('al-fullBlurAndroid')
        if ($('.content-page').size() !== 0) {
          $('.content-page').addClass('al-fullBlurAndroid')
        }
      }
      if ($('.al-releasePageMask').size() !== 0) {
        $('.al-releasePageMask').removeClass('al-fullBlurAndroid')
      }
    }
    Log.createBrowse(142, '认证拒绝提示页')

  },
  alertBox(options) {
    if ($('.al-alertModalMask').length === 0) {
      var template = '<section class="al-confirmModalMask al-alertModalMask">' +
        '<section class="al-confirmModal">' +
        '<article class="al-confirmModalContent">' +
        '<article>' +
        '<h2>' + (options.mTitle || '') + '</h2>' +
        '<p>' + (options.title || '') + '</p>' +
        '</article>' +
        '</article>' +
        '<footer class="al-confirmModalBtns">' +
        '<button class="al-confirmModalEnsureBtn" style="width:100%">' + (options.ensure || '') + '</button>' +
        '</footer>' +
        '</section>' +
        '</section>'
      $('body').append(template)

      setTimeout(function (e) {
        $('.al-alertModalMask').addClass('show')
      }, 50)

      $('body').on('click', '.al-confirmModalEnsureBtn', function () {
        options.ensureCallback && options.ensureCallback()
        $('.al-alertModalMask').removeClass('show')
        return false
      })
    } else {
      $('.al-alertModalMask').addClass('show')
    }
  },

  /**
   * Confirm模态框弹层
   *      @param options {obj}
   *          - title 标题文本 {string}
   *          - cancel 取消按钮文本 {string}
   *          - ensure 确认按钮文本 {string}
   *          - ensureCallback 确认执行回调 {Function}
   *          - cancelCallback 取消执行回调 {Function}
   *          - callBack   确认执行回调 {Function}（点击事件在callBack函数里）
   * @Author qiangkailiang
   */

  confirmBox(options) {
    if ($('.al-confirmModalMask').length === 0) {
      var template = '<section class="al-confirmModalMask">' +
        '<section class="al-confirmModal">' +
        '<article class="al-confirmModalContent">' +
        '<article>' +
          (options.topTitle?'<h3>'+options.topTitle+'</h3>':'')+
        '<p>' + options.title + '</p>' +
        '</article>' +
        '</article>' +
        '<footer class="al-confirmModalBtns">' +
        '<button class="al-confirmModalCancelBtn">' + options.cancel + '</button>' +
        '<button class="al-confirmModalEnsureBtn">' + options.ensure + '</button>' +
        '</footer>' +
        '</section>' +
        '</section>'
      $('body').append(template)

      setTimeout(function (e) {
        $('.al-confirmModalMask').addClass('show')
      }, 100)

      $('.al-confirmModalEnsureBtn').off('click').on('click', function () {
        options.ensureCallback && options.ensureCallback()
        $('.al-confirmModalMask').remove()
        return false
      })
      $('.al-confirmModalCancelBtn').off('click').on('click', function () {
        options.cancelCallback && options.cancelCallback()
        $('.al-confirmModalMask').remove()
        return false
      })
      options.callBack && options.callBack()
    } else {
      $('.al-confirmModalMask').addClass('show')
    }
  },
  /*20180806 v2认证用户申请变更提示弹层*/
  changeTipsV2(options){
      if ($('.al-authPopup_v2Tips').length === 0) {
          var htmlV2='<section class="al-authPopup_v2Tips" >' +
            '        <aside class="al-authPopupCont_v2">' +
            '            <figure class="v2_close ev-v2_close"><img src="//img50.allinmd.cn/authentication/auth/close_v2.png"></figure>' +
            '            <aside class="v2TipsImg"><img src="//img50.allinmd.cn/authentication/auth/v2_tipsImg.png"></aside>' +
            '            <article class="detailText">' +
            (options.title?options.title:'认证审核需要1-3个工作日<br/>在此期间您无法在线执业，是否继续变更')+
            '            </article>' +/*如果需要换行直接在文字中传<br/>即可*/
            '            <button class="v2_sureChange ev-v2_sureChange">'+(options.ensure?options.ensure:'立即变更')+'</button>' +
            '        </aside>' +
            '    </section>';
          $('body').append(htmlV2);
          setTimeout(function (e) {
              $('.al-authPopup_v2Tips').addClass('show')
          }, 100);

          $('.ev-v2_sureChange').off('click').on('click', function () {
              options.ensureCallback && options.ensureCallback();
              $('.al-authPopup_v2Tips').remove();
              return false;
          });
          $('.ev-v2_close').off('click').on('click', function () {
              options.cancelCallback && options.cancelCallback();
              $('.al-authPopup_v2Tips').remove();
              return false;
          });
          options.callBack && options.callBack()

      }else{
          $('.al-authPopup_v2Tips').addClass("show");
      }
  },

  confirmAuthBox(options) {
      $('.ev-guide').remove();
      if ($('.ev_authPopup').length === 0) {
          var template = '<section class="ToAuth ev_authPopup">' +
              '    <section class="ToAuthCont ToAuthInner">' +
              '        <span class="al-authHelpClose ev_authCancelBtn"></span>' +
              '        <img src="//img50.allinmd.cn/pages/personal/goAuth.png" alt="">' +
              '        <h2>认证后才能继续操作</h2>' +
              '        <button class="ev_authNowBtn">立即认证</button>' +
              '    </section>' +
              '</section>';
          $("body").append(template);
          //立即认证
          $(".ev_authNowBtn").off('click').on("click", function () {
              options.ensureCallback && options.ensureCallback();
              $(".ev_authPopup").remove();
              return false;
          });
          $(".ev_authCancelBtn").off('click').on("click", function () {
              options.cancelCallback && options.cancelCallback();
              $(".ev_authPopup").remove();
              return false;
          });
          options.callBack && options.callBack();
      }
  },
  //创建事件埋点
  creatEvent: function (opt) {
    var browTypeUrl
    if (opt.browTypeUrl) {
      browTypeUrl = opt.browTypeUrl
    } else {
      browTypeUrl = window.location.href.substr(0, 250)
    }
    var opDescs = [
      '消息推送的点击', '相关产品', '骨科&手外科切换(切换按钮点击)', '骨科&手外科切换(骨科按钮点击)', '关注--医生',
      '关注--话题', '关注--病例', '关注--标签', '搜索-首页', '搜索-发现',
      '专页搜索', '搜索-局部(PC)', '下载按钮', '下载功能按钮', '广告位-轮播图',
      '广告位-启动页', '登录按钮', '去登录按钮(个人中心)', '视频弹出去登录按钮', '微信登录',
      'CAOS登录', 'CAOS授权登录(立即登录)', '注册-创建帐号', '去认证', '认证-视频弹窗确定',
      '现在认证', '暂不认证', '认证-骨科', '认证-手外', '认证-下一步',
      '认证-提交', '评分功能', '发布', '发布-病例', '补充病例',
      '发布-话题', '发布-直播', '发布-草稿', '发布-视频(PC)', '浏览记录',
      '分享', '返回', '跳过', '关闭', '下一步', '取消',
      '智能排序', '最新发布', '最多浏览', '最多评论', '按专业-筛选',
      '全部类型 -全部', '全部类型 - 病例', '全部类型 - 视频', '全部类型 - 文库', '全部类型 - 话题',
      '相关性', '最新', '最热', '发布-文库(PC)', '热门搜索',
      '历史搜索', '运营手动插入广告位', '动态入口'

    ]
    var latitude = ''//经度
    var longitude = ''//维度
    function locationError (error) {
      latitude = ''
      longitude = ''
    }

    function locationSuccess (position) {
      var coords = position.coords
      latitude = coords.latitude
      longitude = coords.longitude
      localStorage.setItem('latitude', coords.latitude)
      localStorage.setItem('longitude', coords.longitude)
    }

    if (navigator.geolocation) {
      if (window.localStorage && !window.localStorage.getItem('latitude')) {
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAccuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 5000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 3000
        })
      } else {
        latitude = localStorage.getItem('latitude')
        longitude = localStorage.getItem('longitude')
      }
    } else {
      //alert("Your browser does not support Geolocation!");
    }

    function getOS () {
      //获取用户代理
      var ua = navigator.userAgent
      if (ua.indexOf('Windows NT 5.1') != -1) return 'Windows XP'
      if (ua.indexOf('Windows NT 6.0') != -1) return 'Windows Vista'
      if (ua.indexOf('Windows NT 6.1') != -1) return 'Windows 7'
      if (ua.indexOf('Windows NT 6.3') != -1) return 'Windows 8'
      if (ua.indexOf('Windows NT 6.4') != -1) return 'Windows 10'
      if (ua.indexOf('Windows NT 10.0') != -1) return 'Windows 10'
      if (ua.indexOf('(Macintosh;') != -1) return 'Macbook'
      if (ua.indexOf('iPhone') != -1) return 'iPhone'
      if (ua.indexOf('iPad') != -1) return 'iPad'
      if (ua.indexOf('Linux') != -1) {
        var index = ua.indexOf('Android')
        if (index != -1) {
          //os以及版本
          var os = ua.slice(index, index + 13)
          //手机型号
          var index2 = ua.indexOf('Build')
          var type = ua.slice(index + 1, index2)
          return type + os
        } else {
          return 'Linux'
        }
      }
      return '未知操作系统'
    }

    function getTimeZone () {
      var d = new Date()
      return d.getTimezoneOffset() / 60
    }
    var browType = opt.browType ? opt.browType : this.checkUrl('type', window.location.href)//当前页类型
    var browTypeSource = opt.browTypeSource ? opt.browTypeSource : this.checkUrl('type', document.referrer)//来源页类型
    var browTypeSourceUrl = opt.browTypeSourceUrl ? opt.browTypeSourceUrl : document.referrer//来源页url

    var local_time = function () {
      var local = new Date()
      var year = local.getFullYear()
      var month = local.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var day = local.getDate()
      if (day < 10) {
        day = '0' + day
      }
      var time = local.toTimeString().substr(0, 8)
      var local_time = year + '-' + month + '-' + day + ' ' + time
      return local_time
    }
    // console.log(browTypeUrl);
    var param = {
      siteId: 2,//站点Id
      opSource: 'web',//站点 端口
      createTime: local_time(),
      appVersion: window.version,
      osVersion: getOS(),// 系统型号
      tVersion: comm.isWeiXin() ? navigator.appCodeName + ' ' + navigator.appVersion + '_isWeiXin' : navigator.appCodeName + ' ' + navigator.appVersion,   // 浏览器版本
      latitude: latitude,//经度
      longitude: longitude,//维度
      timeZone: 'GMT ' + getTimeZone(),//时区

      customerId: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):'',//会员Id
      opUsr: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):'',//会员Id
      param: opt.param,//banner的链接
      locationId:(opt.locationId&&opt.locationId!=null&&opt.locationId!='null')?opt.locationId:0,//区块Id
      pushMessageId:(opt.pushMessageId&&opt.pushMessageId!=null&&opt.pushMessageId!='null')?opt.pushMessageId:0,//事件对于对象的ID 如：关注人时记录被关注人ID
      //adId:opt.adId,//广告位Id,
      //adPosition:opt.adPosition,//广告图片位置
      triggerType: opt.triggerType,//事件类型
      triggerName: opt.triggerName ? opt.triggerName : opDescs[opt.actionId],//事件名称
      keyword: opt.keyword,//关键词
      actionId: opt.actionId,//事件Id
      browseType: browType,//当前页面类型
      browseTypeUrl: browTypeUrl,//当前页面url
      browseTypeSource: browTypeSource,//来源页面类型
      browseTypeSourceUrl: browTypeSourceUrl,//来源页面URL
      refId: (opt.refId&&opt.refId!=null&&opt.refId!='null')?opt.refId:0,//资源ID
      refType: (opt.refType&opt.refType!=null&&opt.refType!='null')?opt.refType:0,//资源Type
      location_id:(opt.location_id&opt.location_id!=null&&opt.location_id!='null')?opt.location_id:0,            //发现页排序
      browsetype_url:(opt.browsetype_url&opt.browsetype_url!=null&&opt.browsetype_url!='null')?opt.browsetype_url:0,      //发现栏目ID、类型
      push_message_id:(opt.push_message_id&&opt.push_message_id!=null&&opt.push_message_id!='null')?opt.push_message_id:0     //发现页点击标签ID
    }
    if (typeof g_sps != 'undefined') {
      // param = $.extend(param,{
      //     sessionId:g_sps._$.sessionId + "_" + g_sps._$.sessionIndex,
      //     openedCount: g_sps._$.openedCount
      // })
      Object.assign(param, {
        sessionId: g_sps&&g_sps._$&&g_sps._$.sessionId?g_sps._$.sessionId + '_' + g_sps._$.sessionIndex:'',
        openedCount: g_sps&&g_sps._$&&g_sps._$.openedCount?g_sps._$.openedCount:''
      })
    }
    this.ajax2({
      type: 'POST',
      url: '/mcall/log/track/batchCreate/',
      data: {paramJson: JSON.stringify(param)},
      dataType: 'json',
      success: function (rep) {
        // console.log(param)
      },
      error: function () {
      }
    })
  },
  hasResponseData(r) {
    if (r && r.responseObject && r.responseObject.responseData && !this.isEmptyObject(r.responseObject.responseData)) {
      return true
    }
    return false
  },
  hasResponseMessage(r) {
    if (r && r.responseObject && r.responseObject.responseMessage && !this.isEmptyObject(r.responseObject.responseMessage)) {
      return true
    }
    return false
  },
  isEmptyObject(obj) {
    for (var n in obj) {
      return false
    }
    return true
  },
  isWeiXin() {
    let ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  cutDoctorTitle(arr) {
    let title = ''
    if (arr.length > 0) {
      let arrList = arr.split(',');
      let regExp = /(医师|医学生|护士|讲师)/g; //讲师在消息页医师列表容错
      for (let i = 0; i < arrList.length; i++) {
        if (regExp.test(arrList[i])) {
          title = arrList[i];
          break
        }
      }
    }
    return title
  },
  cutLine(srcStr, type, callType) {
    if (!srcStr) {
      return
    }
    let oneStep = srcStr.split(',')
    let str = ''
    for (let i = 0; i < oneStep.length; i++) {
      if (oneStep[i]) {
        if (oneStep[i].split(type)[1]) {
          str += oneStep[i].split(type)[1] + callType
        } else {
          str += oneStep[i] + callType
        }
      }
    }
    return str.substring(0, str.length - 1)
  },
  layerBottomFixed(obj){
    // let scrollTop = window.pageYOffset||document.documentElement.scrollTop;
    // document.querySelector('html').setAttribute('sT',scrollTop);
    // document.querySelector('html').style.marginTop = -scrollTop+"px";
    // document.querySelector('html').style.height = document.body.clientHeight+scrollTop+'px';
    // document.querySelector('body').style.height = document.body.clientHeight+scrollTop+'px';
    // document.querySelector('html').style.overflow = 'hidden';
    // document.querySelector('body').style.overflow = 'hidden';
    // obj.closeBtn.addEventListener('click',function(){
    // document.querySelector('html').style.marginTop = '';
    // document.querySelector('html').style.height ='';
    // document.querySelector('body').style.height = '';
    // document.querySelector('html').style.overflow = '';
    // document.querySelector('body').style.overflow = '';
    // document.body.scrollTop = scrollTop;
    // document.querySelector('html').removeAttribute('sT');
    //
    // },false)
    var scrollTop = $(window).scrollTop()
    // if (obj.layerDom.is(':visible')) {
     if(obj&&obj.layerDom&&obj.layerDom.is(':visible')){
      $('html').attr('sT', scrollTop).css('marginTop', -scrollTop)
      $('html,body').css({'height': $(window).height() + scrollTop, overflow: 'hidden'})
    }
      obj&&obj.closeBtn&&obj.closeBtn.off('click').click(function () {
      if (obj.isclose) {
        obj.layerDom.remove()
      }
      $('html').css('marginTop', '')
      $('html,body').css({'height': '', overflow: ''})
      $(window).scrollTop($('html').attr('sT'))
      $('html').removeAttr('sT')
    })
  },
  /**
   * 未认证用户显示邮箱或手机号码
   * */
  getRegisterName(email, mobile) {
    let count = '';
    if (email) {
        if(email.indexOf("@")<=1) {
            count=email.substr(0,1)+"****"+email.substring(email.lastIndexOf("@"));
        }else{
            count=email.substr(0,2)+"****"+email.substring(email.lastIndexOf("@"));
        }
    } else if (mobile) {
      count = mobile.substr(0, 3) + '****' + mobile.substring(mobile.length - 4)
    }
    return count
  },
  getFileSize(target) {
    let isIE = /msie/i.test(navigator.userAgent) && !window.opera
    let fileSize = 0
    if (isIE && !target.files) {
      //          var filePath = target.value;
      //          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   ／／IE需要安全配置
      //
      //          if(!fileSystem.FileExists(filePath)){
      //             alert("附件不存在，请重新输入！");
      //             return;
      //          }
      //          var file = fileSystem.GetFile (filePath);
      //          fileSize = file.Size;
    } else {
      fileSize = target.files[0].size
    }

    return fileSize
  },
    bodyScroll(){//禁止弹层底部滚动
        $("body,html,.al-mainInner").css({
            overflow:"hidden",
            height:"100%"
        });
    },
    bodyNoScroll(){//释放弹层底部滚动
        $("body,html,.al-mainInner").css({
            overflow:"auto",
            height:"auto"
        });
    }
}
export default comm;
//历史回退刷新问题
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload()
    }
};
window.comm = comm;
comm.players = [];
(function () {
  /**
   * 百度统计
   */
  (function () {
    if (/env=online/g.test(document.cookie)) {
      let hm = document.createElement("script");
      hm.src = "//hm.baidu.com/hm.js?71edc034f8bdd6704dbcdb7a5cdc79df";
      let s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    }
  })();
  //微信浏览器的返回如果没有来源页回到首页
  (function () {
    let isW = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
    if (isW && (location.host + location.pathname) != "m.allinmd.cn/" && document.referrer == '') {//在微信浏览器中，并且非首页
      let nowHref = location.href;
      if(history.state){
        history.replaceState({page: "backPage"}, null, '//m.allinmd.cn/');
        history.pushState({page1: "backPage1"}, null, nowHref);
      }
      window.addEventListener("popstate", function (e) {
        if (e.state && e.state.page == 'backPage') {
          location.reload();
        }
      }, false);
    }
  })();
  /*
   * 唯医通行证创建成功提示
   * */
  (function () {   //此处try catch为了防止微信浏览器清空缓存之后第一次js加载不出来Tempcache报错问题（不加载原因不详）
    try {
      if (TempCache.getItem('firstRegist') && window.location.href.indexOf('wanshanInfoConference') == -1) {//如果是第一次注册
        if (TempCache.getItem('needAuthCompleted') == 'needAuthCompleted') {    //需要认证权限 并且认证成功 弹一次注册通行证成功，清除localstorage
          TempCache.removeItem('firstRegist');
          TempCache.removeItem('fromPageN');
          TempCache.removeItem('needAuthRegist');
          TempCache.removeItem('needAuthCompleted');
        } else if (!TempCache.getItem('needAuthRegist')) {    //不需要认证权限 直接弹
          $('.ev-guide').hide();
          comm.alertBox({
            title: "成功创建唯医帐号",
            ensure: '知道了',
            ensureCallback: function () {
              $('.al-confirmModalMask').remove();
              $('.ev-guide').show();
            }
          });
          TempCache.removeItem('firstRegist');
          TempCache.removeItem('fromPageN');
          TempCache.removeItem('needAuthRegist');
        } else{
          TempCache.removeItem('firstRegist');
        }

      }
    } catch (e) {
      console.log('error');
    }
  })();
  if(window.location.pathname=='/'||window.location.pathname=='/index.html'){//表示如果是首页，则进行请求首屏认证弹层
      if(localStorage.getItem('userId')){
          comm.ajax2({
              url: '/mcall/customer/unite/isPopUpAuthFrame/',
              data: {paramJson: JSON.stringify({customerId:localStorage.getItem('userId'),visitSiteId:2})},
              dataType: 'json',
              type: 'get',
              success: function (res) {
                  if (res && res.responseObject && res.responseObject.responseData&&res.responseObject.responseData.isPopUp==1) {
                      $('body').append('<section class="ToAuth ev-toAuth" style="display: none">' +
                          '    <section class="ToAuthCont">' +
                          '        <span class="al-authHelpClose"></span>' +
                          '        <img src="/images/img50/pages/personal/goAuth.png" alt="">' +
                          '        <h2>立即认证，您将获得</h2>' +
                          '        <p>1.免费浏览与观看唯医所有资源</p>' +
                          '        <p>2.骨科医生专属工具使用资格</p>' +
                          '        <p>3.开启骨科在线执业</p>' +
                          '        <button><a href="/pages/passport/auth/auth.html">立即认证</a></button>' +
                          '    </section>' +
                          '</section>');
                      if(localStorage.getItem('indexBigAdDelivery')){
                          $('.ev-toAuth').show();
                      }
                      $('.al-authHelpClose').off('click').on('click',function () {
                          comm.ajax2({
                              url: '/mcall/customer/message/createInviteAuthMessage/',
                              data: {paramJson: JSON.stringify({customerId: localStorage.getItem('userId'),visitSiteId:2})},
                              dataType: 'json',
                              type: 'get',
                              success: function (res) {
                                  if (res && res.responseObject && res.responseObject.responseStatus) {
                                      $('.ev-toAuth').remove();
                                  }
                              }
                          })
                      })
                  }
              }
          })
      }
  }
}());
