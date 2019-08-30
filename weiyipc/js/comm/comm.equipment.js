/**
 * 功能描述：设备检测
 * 使用方法：
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-04-30.
 */

comm.equipment = {
	IsPC : function(){  
           var userAgentInfo = navigator.userAgent;
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPod");  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  
           return flag;  
	}
};


