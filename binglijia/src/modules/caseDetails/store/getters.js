const getters = {
    showLoad(state){
        return state.showLoad;//改变的值
    },
    baseMustInfo(state){
        return state.baseMustInfo;
    },
    patientId(state){
        return state.patientId;
    },
    isBlong(state){
        return state.isBlong;
    },
    belongType(state){
        return state.belongType;
    },
    doctorId(state){
        return state.doctorId;
    }
}
export default getters;
