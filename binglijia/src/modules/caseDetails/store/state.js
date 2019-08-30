const state = {
    showLoad:false,//loading是否显示
    baseMustInfo:'',//病历必填项---姓名，年龄，性别。
    patientId:'',//患者Id
    isBlong:false,//判断是否是所属病历
    belongType:0,//是否归属
    doctorId:0,//编辑病例时doctorId
};
export default state;
