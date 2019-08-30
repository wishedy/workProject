$(function(){
	if($('#sesCustomerId').val()){
		TempCache.setItem("readTrendTime",comm.date.local_time());	//进入朋友圈记录动态时间
	}else{
		user.login({
			callback: function () {
				location.reload();
			},
			scene: privilegeSceneConst.eSceneTypeLogin,
			onClose:function(){
                g_sps.jump(null,"/");
			},
			onAuthCancel:'stay'
		});
		return false;
	}
	TempCache.setItem('readTrendTime',comm.date.local_time());    //cookie记录上次查看收藏的时间
	//接入可能认识
	module.personYouKnow({
		container:$('.ev-discoverDoctor')
	});
});