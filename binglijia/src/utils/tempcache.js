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
        localStorage.clear();
    }
};
export default TempCache;
