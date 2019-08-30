

/**
 * @desc 是否江浙沪
 * @return {Boolean}
 * */
/*
 comm.checkJiangZheHu = function () {
	if (this.cache!=undefined) {
		return this.cache;
	} else {
		var rst = false;
		var cookieLogin = $.cookie("accessLoginVersion");
		if (cookieLogin =="" || cookieLogin == null) {
			$.ajax({
				url: PC_CALL+"log/op/location/getIpArea/",
				async: false,
				success: function (data) {
					if (data && data.responseObject && data.responseObject.responseData) {
						//if ("zhejiang,jiangsu,shanghai".indexOf(data.responseObject.responseData.city.toLowerCase()) > 0) {
						if (data.responseObject.responseData.isNew=="1") {
							rst = true;
							$.cookie("accessLoginVersion", "planB");
						} else {
							$.cookie("accessLoginVersion", "planA");
						}

					}
				}
			});
		}else{
			if(cookieLogin == "planB"){
				rst = true;
			}
		}
		this.cache = rst;
		return rst;
	}
};*/

