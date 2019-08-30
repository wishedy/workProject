/**
 * jQuery :  城市联动插件
 * @author   lichunhui
 *			 
 * @example  $("#test").ProvinceCity();
 * @params   暂无
 * 
 * 扩展选中返回值
 */
$.fn.ProvinceCity = function(options){
	options = $.extend({
		 addDiv:0,
		 title:"",
		 province:"",
		 city:"",
		 district:"",
		 provinceChange:function(){},
		 cityChange:function(){},
		 districtChange:function(){}
	},options);
	
	var _self = this;
	var provinceId=0;
	var cityId=0;
	var districtId=0;
	//定义3个默认值
	//_self.data("province",["请选择", "请选择"]);
	//_self.data("city",["请选择", "请选择"]);
	//_self.data("district",["请选择", "请选择"]);
	//插入3个空的下拉框
	_self.empty();
	_self.append(""+(options.addDiv?"<div class='p_c_baseinfo_time01'><div class='p_c_baseinfo_div01'>":"")+"<select class='province' name='"+options.title+"province'></select>"+(options.addDiv?"</div></div>":"")+"");
	_self.append(""+(options.addDiv?"<div class='p_c_baseinfo_time01'><div class='p_c_baseinfo_div01'>":"")+"<select class='city select02' name='"+options.title+"city'></select>"+(options.addDiv?"</div></div>":"")+"");
	_self.append(""+(options.addDiv?"<div class='p_c_baseinfo_time01'><div class='p_c_baseinfo_div01'>":"")+"<select class='district select02' name='"+options.title+"district'></select>"+(options.addDiv?"</div></div>":"")+"");
	//分别获取3个下拉框
	var $sel1 = _self.find("select").eq(0);
	var $sel2 = _self.find("select").eq(1);
	var $sel3 = _self.find("select").eq(2);
	//默认省级下拉
	/*if(_self.data("province")){
		$sel1.append("<option value=''>"+_self.data("province")[0]+"</option>");
	}*/
	$.ajax({
		url:PC_CALL+"comm/data/region/json_list/",
		dataType:"json",
		type:"POST",
		data:{treeLevel:2,pageIndex:1,pageSize:100},
		success:function(data){
			if(data.responseObject.responseData.data_list){
				$.each(data.responseObject.responseData.data_list , function(i,val){
					if(options.province){
						if(val.regionId==options.province){
							$sel1.append("<option value='"+val.regionName+"' provinceid='"+val.regionId+"' selected='selected'>"+val.regionName+"</option>");
						}else{
							$sel1.append("<option value='"+val.regionName+"' provinceid='"+val.regionId+"'>"+val.regionName+"</option>");	
						}	
					}else{
						$sel1.append("<option value='"+val.regionName+"' provinceid='"+val.regionId+"'>"+val.regionName+"</option>");	
					}
				});	
				
				dataAfter();
				
			}
				
		}
	});
	
	function dataAfter(){
		//默认的1级城市下拉
		/*if(_self.data("city")){
			$sel2.append("<option value=''>"+_self.data("city")[0]+"</option>");
		}
		//默认的2级城市下拉
		if(_self.data("district")){
			$sel3.append("<option value=''>"+_self.data("district")[0]+"</option>");
		}*/
		//省级联动 控制
		var index1 = "" ;
		$sel1.bind("change",function(){
			//清空其它2个下拉框
			cityId=0;
			$sel2[0].options.length=0;
			$sel3[0].options.length=0;
			index1 = this.selectedIndex;
			provinceId=$sel1.find("option").eq(index1).attr("provinceid")||'';
			
			/*if(index1==0){	//当选择的为 “请选择” 时
				if(_self.data("city")){
					$sel2.append("<option value=''>"+_self.data("city")[0]+"</option>");
				}
				if(_self.data("district")){
					$sel3.append("<option value=''>"+_self.data("district")[0]+"</option>");
				}
			}else{*/
				$.ajax({
					url:PC_CALL+"comm/data/region/json_list/",
					dataType:"json",
					type:"POST",
					data:{treeLevel:3,parentId:provinceId,pageIndex:1,pageSize:100},
					success:function(data){
						if(data.responseObject.responseData.data_list){
							$.each(data.responseObject.responseData.data_list, function(i,val){
								if(options.city){
									if(val.regionId==options.city){
										$sel2.append("<option value='"+val.regionName+"' cityid='"+val.regionId+"' selected='selected'>"+val.regionName+"</option>");
										cityId= val.regionId;
									}else{
										$sel2.append("<option value='"+val.regionName+"' cityid='"+val.regionId+"'>"+val.regionName+"</option>");	
									}	
								}else{
									$sel2.append("<option value='"+val.regionName+"' cityid='"+val.regionId+"'>"+val.regionName+"</option>");	
								}
								if(!cityId){
									cityId= $sel2.find("option").eq(0).attr("cityid");	
								}
							});
							
							$.ajax({
								url:PC_CALL+"comm/data/region/json_list/",
								dataType:"json",
								type:"POST",
								data:{treeLevel:4,parentId:cityId,pageIndex:1,pageSize:100},
								success:function(data){
									if(data.responseObject.responseData.data_list){
										$sel3[0].options.length=0;
										$.each(data.responseObject.responseData.data_list, function(i,val){
									
											if(options.district){
												if(val.regionId==options.district){
													$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"' selected='selected'>"+val.regionName+"</option>");
												}else{
													$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"'>"+val.regionName+"</option>");	
												}	
											}else{
												$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"'>"+val.regionName+"</option>");	
											}	
											
										});	
									}	
									options.provinceChange();
								}
							});
						}
						
					}
				});
				
			//}
		}).change();
		
		//城市联动 控制
		var index2 = "" ;
		$sel2.bind("change",function(){
			$sel3[0].options.length=0;
			index2 = this.selectedIndex;
			cityId= $sel2.find("option").eq(index2).attr("cityid");
			/*if(index1==0){	//当选择的为 “请选择” 时
				if(_self.data("district")){
					$sel3.append("<option value=''>"+_self.data("district")[0]+"</option>");
				}
			}else{*/
			if(cityId!=null){
				$.ajax({
					url:PC_CALL+"comm/data/region/json_list/",
					dataType:"json",
					type:"POST",
					data:{treeLevel:4,parentId:cityId,pageIndex:1,pageSize:100},
					success:function(data){
						if(data.responseObject.responseData.data_list){
							$.each( data.responseObject.responseData.data_list , function(i,val){
								if(options.district){
									if(val.regionId==options.district){
										$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"' selected='selected'>"+val.regionName+"</option>");
									}else{
										$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"'>"+val.regionName+"</option>");	
									}	
								}else{
									$sel3.append("<option value='"+val.regionName+"' districtid='"+val.regionId+"'>"+val.regionName+"</option>");	
								}
							});	
						}
						options.cityChange();		
					}
				});
			}
			//}
		});
		
		$sel3.bind("change",function(){
			options.districtChange();		
		});	
	}
	
	
	return _self;
};