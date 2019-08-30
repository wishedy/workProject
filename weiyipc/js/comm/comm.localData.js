comm.localData = {
    pageName: function (path) {
        var a = window.location.href;
        var b = a.split("/");
        var c = b.slice(b.length - 1, b.length).toString(String).split(".");
        var resultStr = "";
        resultStr = c.slice(0, 1).join();
        if (resultStr) {
            return comm.localData.strToHexCharCode(resultStr+path);
        } else {
            return comm.localData.strToHexCharCode("root"+path);

        }
    },
    storeLocalData:function(key,data){
        var t = this;
        var keyStr = t.pageName(key);
		TempCache.setItem(keyStr,JSON.stringify(data));
    },
    getLocalData: function (options) {
        var t = this;
        var localData = TempCache.getItem(t.pageName(options.path));
        if(localData){
            options.exhibitionData&&options.exhibitionData(JSON.parse(localData));
            options.requestData&&options.requestData();
            return localData;
        }else{
            options.requestData&&options.requestData();
            return false;
        }
    },
    strToHexCharCode: function (str) {
        if (str === "")
            return "";
        var hexCharCode = [];
        hexCharCode.push("0x");
        for (var i = 0; i < str.length; i++) {
            hexCharCode.push((str.charCodeAt(i)).toString(16));
        }
        return hexCharCode.join("");
    }
};