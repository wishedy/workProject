const actions = {
    showLoadi:({commit,state},flag)=>{
        commit('showLoadi',flag);
    },
    baseMust:({commit,state},str)=>{
        commit('baseMust',str);
    },
    chaPatientId:({commit,state},str)=>{
        commit('chaPatientId',str);
    },
    chaIsBlong:({commit,state},str)=>{
        commit('chaIsBlong',str);
    },
    chaBlongType:({commit,state},str)=>{
        commit('chaBlongType',str);
    },
    chaDoctorId:({commit,state},str)=>{
        commit('chaDoctorId',str);
    },
};
export default actions;
