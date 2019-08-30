function isPc(){
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPod");  
	var flag = true;  
	for (var v = 0; v < Agents.length; v++) {
	    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
	}  
	return flag;  
}
var WI_HR = window.location.hostname+window.location.pathname,
	m_hrefReg = /m.allinmd.cn/,
	pc_hrefReg = /www.allinmd.cn/;
if(isPc()){
	if(m_hrefReg.test(WI_HR)){
		WI_HR = WI_HR.replace(/m.allinmd.cn\/html/,"www.allinmd.cn/v2");
	}
}else{
	if(pc_hrefReg.test(WI_HR)){
		WI_HR = WI_HR.replace(/www.allinmd.cn/,"m.allinmd.cn/html");
	}
}

