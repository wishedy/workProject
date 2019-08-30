/**
 * 功能描述：快速失败 
 * 使用方法：comm.fastError.xxx(obj);
 *
 *
 * Created by QiaoLiang on 2015-04-07.
 */
comm.fastError = {
	missParams : function(obj,file){ //检测是否漏掉参数
		if(obj.destroy){return true;}
		for(var x in obj){
			if(obj[x]===null || obj[x]===""){ //|| obj[x]===0
				//console.error("参数不足!请参阅文件:"+file+"!"); 
				//return false;
			}
		}
	},
	loadData : function(obj,file){
		
	}
	
};