var loadHandle= {
    init: function(){
        //用于处理是否切换到移动端
        this.toggleToMobile();
    },
    isPC: function(){
        var userAgentInfo= navigator.userAgent;
        var Agents= new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPod");
        var flag= true;
        for(var v = 0; v < Agents.length; v++) {
            if(userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    toggleToMobile: function() {
        if (!this.isPC()) {
            var o= location.href;
            o.indexOf("www.allinmd.cn") > -1 && (location.href = o.replace("www.allinmd.cn", "m.allinmd.cn").replace("/html/", "/html/m/"));
        }
    }
}

loadHandle.init();