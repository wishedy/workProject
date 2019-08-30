import comm from "~utils/comm.js";
const mutaions = {
    showLoadi(state,flag){//改变值的方法
        state.showLoad = flag;
    },
    baseMust(state,data){
        state.baseMustInfo = data;
    },
    chaPatientId(state,data){
        state.patientId = data;
    },
    chaIsBlong(state,data){
        state.isBlong = data;
    },
    chaBlongType(state,data){
        state.belongType = data;
    },
    chaDoctorId(state,data){
        state.doctorId = data;
    },
};
export default mutaions;
