const TempCache = {
    cache: function(value) {
        localStorage.setItem("EasyWayTempCache", value);
    },
    getCache: function() {
        return localStorage.getItem("EasyWayTempCache");
    },
    setItem: function(key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function(key) {
        var item = localStorage.getItem(key);
        if (key && key == "fromPage") // 来源页面只能获取一次
            localStorage.removeItem(key);
        return item;
    },
    removeItem: function(key) {
        return localStorage.removeItem(key);
    },
    clear: function() {
        // 清除缓存
        /* storage = window.localStorage;
         while (storage.key(storage.length - 1).indexOf(keyword) === 0) {
         storage.removeItem(storage.key(storage.length - 1))
         }*/
        // TODO:2017/10/18 郑辉修改，微信授权逻辑错误
        //var wxBrowseAccessLockOn = localStorage.getItem("wxBrowseAccessLockOn");
        localStorage.clear();
        //localStorage.setItem("wxBrowseAccessLockOn", wxBrowseAccessLockOn);
    }
};
export  default  TempCache;