/**
 * Created by lichunhui on 2018/7/9.
 * comm 公共方法
 */
const $ = require('jquery');
import axios from 'axios';
const comm={
    //axios VUE ajax 请求
    ajax(obj) {
        axios({
            url: obj.url,
            method: obj.method || 'get',
            data: obj.data,
            transformRequest: [function (data) {
                if (obj.paramJson) {
                    return 'paramJson=' + JSON.stringify(data)
                }
            }],
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
    //原生ajax请求
    ajax2(options) {
        options = options || {}
        options.type = (options.type || 'GET').toUpperCase()
        options.dataType = options.dataType || 'json'
        let params = formatParams(options.data)
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let status = xhr.status
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
            let arr = []
            for (let name in data) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
            }
            arr.push(('v=' + Math.random()).replace('.', ''))
            return arr.join('&')
        }

    },
    //参数:字符 字符串截取分隔符 截取分隔符类型 返回分隔类型
    cutLine(srcStr,cutType,type,callType){
        let oneStep=[];
        if(srcStr&&srcStr.lastIndexOf(cutType)>-1){
            oneStep = srcStr.split(cutType);
        }else{
            oneStep.push(srcStr);
        }
        let str="";

        for(let i=0;i<oneStep.length;i++){
            if(oneStep[i]){
                if(oneStep[i].split(type)[1]){
                    str+= oneStep[i].split(type)[1]+callType;
                }else{
                    str+= oneStep[i]+callType;
                }
            }
        }
        return str.substring(0,str.length-1);
    },
    /*
    * 截取字符长度
    * 调用方法 getStrByteLen(字符串,截取长度) //长度需要转换成字节即一个汉字两个字节
    * */
    getStrLen(str,len) {
        let newStr='',newLength=0;
        if(!str){//如果不存在
            return '';
        }
        for(let i=0;i<str.length;i++){
            if(str.charCodeAt(i)>128){
                newLength+=2;
            }else{
                newLength++;
            }
            if(newLength<=len){
                newStr=newStr.concat(str[i]);
            }else{
                break;
            }
        }
        if(newLength>len){
            newStr = newStr+"..."
        }
        return newStr;
    },
    //获取字符长度  区分中英文
    getByteLen(str){
        let newLength=0;
        if(!str){//如果不存在
            return 0;
        }
        for(let i=0;i<str.length;i++){
            if(str.charCodeAt(i)>128){
                newLength+=2;
            }else{
                newLength++;
            }
        }
        return newLength;
    },
    getParamFromUrl(url, name){
        const str = url.split('?');
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const r = str[1].match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    //截取链接参数的函数
    getpara(symbol){
        let t = this;
        let url=document.URL;
        let param={};
        let str,item;
        if(url.lastIndexOf(symbol?symbol:"?")>0) {
            str=url.substring(url.lastIndexOf(symbol?symbol:"?")+1,url.length);
            let arr=str.split("&");
            for(let i=0;i<arr.length;i++) {
                item =  arr[i].split("=");
                param[item[0]] = t.htmlToString(decodeURIComponent(item[1]));
            }
        }
        return param;
    },
    //空对象判断方法
    isEmptyObject(obj){
        for(let n in obj){return false}
        return true;
    },
    //判断返回对象responseData
    hasResponseData(r) {
        if (r && r.responseObject && r.responseObject.responseData && !this.isEmptyObject(r.responseObject.responseData)) {
            return true
        }
        return false
    },
    //判断返回对象responseData
    hasResponseData2(r) {
        if (r  && r.responseData && !this.isEmptyObject(r.responseData)) {
            return true
        }
        return false
    },
    //判断返回信息responseMessage
    hasResponseMessage(r) {
        if (r && r.responseObject && r.responseObject.responseMessage && !this.isEmptyObject(r.responseObject.responseMessage)) {
            return true
        }
        return false
    },
    //展示时把html标签转换成字符串显示
    htmlToString(str){
        let rstStr = (str+ '').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];});
        let tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");
        if(tempArr.length>=2){
            rstStr = tempArr.map(function(d,index) {
                let s =  d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2");
                s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>");
                s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2</a>");
                return s;
            }).join();
        }else{
            rstStr = (rstStr+'').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>"); /* 恢复文本中的提醒谁看的A链接*/
        }
        rstStr = rstStr.replace(/@@/g,"@");
        return rstStr;
    },
    //防止xss攻击进行标签转换字符串显示
    symbolToString(str){
        let rstStr = str.replace(/[<>]/g,function(c){return {'<':'&lt;','>':'&gt;'}[c];});
        let tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");
        if(tempArr.length>=2){
            rstStr = tempArr.map(function(d,index) {
                let s =  d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2");
                s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>");
                s =  s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,"<a href=\"$1\">$2</a>");
                return s;
            }).join();
        }else{
            rstStr = (rstStr+'').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,"<a href=\"$1\">$2</a>"); //恢复文本中的提醒谁看的A链接
        }
        rstStr = rstStr.replace(/@@/g,"@");
        return rstStr;
    },
    //特殊字符转义
    escapeReplace(str){
        return str.replace(/[+/?#&=!%]/g,function(c){return {'+':'%2B','/':'%2F','?':'%3F','#':'%23','&':'%26','=':'%3D','!':'%21','%':'%25'}[c];});
    },
    bodyScroll(){//禁止弹层底部滚动
        document.getElementsByTagName("body")[0].style.height="100%";
        document.getElementsByTagName("html")[0].style.height="100%";
        document.getElementsByTagName("body")[0].style.overflow="hidden";
        document.getElementsByTagName("html")[0].style.overflow="hidden";
    },
    bodyNoScroll(){//释放弹层底部滚动
        document.getElementsByTagName("body")[0].style.height="auto";
        document.getElementsByTagName("html")[0].style.height="auto";
        document.getElementsByTagName("body")[0].style.overflow="auto";
        document.getElementsByTagName("html")[0].style.overflow="auto";
    },
    //获取浏览器信息
    browser :{
        mozilla : /firefox/.test(navigator.userAgent.toLowerCase()),
        webkit : /webkit/.test(navigator.userAgent.toLowerCase()),
        opera : /opera/.test(navigator.userAgent.toLowerCase()),
        msie : /msie/.test(navigator.userAgent.toLowerCase()),
        versions: function () {
            let u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
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
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        isIe8:function(){
            let browser = navigator.appName;
            let b_version = navigator.appVersion;
            let version = b_version.split(";");
            let trim_Version = (version[1]!=undefined&&version[1]!="")?version[1].replace(/[ ]/g, ""):"";
            if (browser === "Microsoft Internet Explorer" && trim_Version=="MSIE8.0") {
                return true;
            } else {
                return false;
            }
        },
        isIe9:function(){
            let browser = navigator.appName;
            let b_version = navigator.appVersion;
            let version = b_version.split(";");
            let trim_Version = (version[1]!=undefined&&version[1]!="")?version[1].replace(/[ ]/g, ""):"";
            if (browser === "Microsoft Internet Explorer" && trim_Version=="MSIE9.0") {
                return true;
            } else {
                return false;
            }
        },
        isIeOrEdge:function() {
            let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                let fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return true;
                } else if(fIEVersion == 8) {
                    return true;
                } else if(fIEVersion == 9) {
                    return true;
                } else if(fIEVersion == 10) {
                    return true;
                } else {
                    return true;//IE版本<=7
                }
            } else if(isEdge) {
                return true;//edge
            } else if(isIE11) {
                return true; //IE11
            }else{
                return false;//不是ie浏览器
            }
        },
        isLessIe10:function() {
            let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                let fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return true;
                } else if(fIEVersion == 8) {
                    return true;
                } else if(fIEVersion == 9) {
                    return true;
                } else if(fIEVersion == 10) {
                    return true;
                } else {
                    return false;//IE版本<=7
                }
            } else if(isEdge) {
                return false;//edge
            } else if(isIE11) {
                return false; //IE11
            }else{
                return false;//不是ie浏览器
            }
        },
    },
    //设置cookie
    cookie : {
        set(key,val,time){//设置cookie方法
            let date=new Date(); //获取当前时间
            let expiresDays=time;  //将date设置为n天以后的时间
            date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
            document.cookie=key + "=" + val +";expires="+date+";domain=.allinmd.cn";  //设置cookie
        },
        get(key){//获取cookie方法
            /*获取cookie参数*/
            let getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
            let arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
            let tips;  //声明变量tips
            for(let i=0;i<arrCookie.length;i++) {   //使用for循环查找cookie中的tips变量
                let arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
                if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                    tips = arr[1];   //将cookie的值赋给变量tips
                    break;   //终止for循环遍历
                }
            }
            return tips;
        },
        delete(key) { //删除cookie方法
            if(this.get(key)){
                // document.cookie = key + "=; expires =-1;domain=.allinmd.cn;";//设置cookie
                this.set(key,'',-1)
            }
        }
    },
    //检测用户登录状态
    checkUser(){
        let userId = this.cookie.get("userId");
        let localUserId = localStorage.getItem("userId");
        if(!userId||userId==""){//退出登录 本地无用户ID
            window.location.href="//www.allinmd.cn?from=emr"
        }else if(userId!=localUserId){//cookie用户ID已经被修改
            location.reload();
        }
    }
};

export default comm;
