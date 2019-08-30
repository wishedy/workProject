/**
 * @Desc：Hybrid交互架构
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/2.
 */


export default class HybridBriage {
  constructor(str) {
    this.setupWebViewBriage((bridge) => {
      this.bridge = bridge;
    })
  }

  // jsBridge注册
  setupWebViewBriage(callback) {
    //jsBridge注册...回调获取Bridge上下文对象
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    // Hybrid协议建立...
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }

  // 日志打印
  log(message, data) {
    let log = document.getElementById('log');
    let el = document.createElement('div');
    el.className = 'logLine';
    el.innerHTML = `${uniqueId++}.${message}<br/>${JSON.stringify(data)}`;
    if (log.children.length) {
      log.insertBefore(el, log.children[0])
    }
    else {
      log.appendChild(el)
    }
  }

  // APP>>>JS方法注册...由App向JS传值
  registerHandler(handlerName, cb) {
    console.log(handlerName);
    this.setupWebViewBriage((bridge) => {
      bridge.registerHandler(handlerName, (data, responseCallback) => { 
         cb && cb(data,responseCallback);
      });
    })
  }

//JS>>>APP方法注册...JS调用App方法并向App传值
  callHandler(handlerName, param, cb) {
    this.bridge.callHandler(handlerName, param, (response) => {
      cb && cb(response);
    });
  }
}
