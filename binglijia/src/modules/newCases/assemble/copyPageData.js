class copyPageData {
    constructor(props){
        //console.log('进入');
        this.originalData = JSON.parse(JSON.stringify(props));
    }
    copyData(){
        let t = this;
        let deleteDetails = (data)=>{
            for(let num = 0;num<data.length;num++){
                let itemData = data[num];
                if(itemData.commDataField.fieldType==1){
                    delete itemData.caseFolderDetail;
                    for(let innerNum = 0;innerNum<itemData.caseFolderTemplateScope.length;innerNum++){
                        if(itemData.caseFolderTemplateScope[innerNum].relationMap){
                            deleteDetails(itemData.caseFolderTemplateScope[innerNum].relationMap);
                        }
                    }
                }else{
                    delete itemData.caseFolderDetail;
                }
            }
        };
        let dataList = (t.originalData.responseObject.responseData&&t.originalData.responseObject.responseData.data_list)?t.originalData.responseObject.responseData.data_list:[];
        let resultArr = [];
        deleteDetails(dataList[0]);
        resultArr.push(dataList[0]);
        //console.log(resultArr);
        t.originalData.responseObject.responseData.data_list = resultArr;
        return t.originalData;
    }
}
export default copyPageData;
