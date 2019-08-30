class SearchCommon {
    checkInvalid(val) {
        if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
            return true;
        } else {
            return false;
        }
    }
    checkResData(data){
        if(data&&data.responseObject&&data.responseObject.responseData&&(!$.isEmptyObject(data.responseObject.responseData))&&(data.responseObject.responseData.dataList)&&(data.responseObject.responseData.dataList.length>0)){
            return true;
        }else{
            return false;
        }
    }
}
export default  new SearchCommon();