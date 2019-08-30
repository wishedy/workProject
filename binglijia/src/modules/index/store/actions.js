const actions = {
    caseListInit: ({ commit, state }, str) => {
        commit('caseListInit', str);
    },
    tagArrChange: ({ commit, state }, str) => {
        commit('tagArrChange', str);
    },
    itemsArrChange: ({ commit, state }, str) => {
        commit('itemsArrChange', str);
    },
    orderTypeChange: ({ commit, state }, str) => {
        commit('orderTypeChange', str);
    },
    scrShowArrChange: ({ commit, state }, str) => {
        commit('scrShowArrChange', str);
    },
    sIdListChange: ({ commit, state }, str) => {
        commit('sIdListChange', str);
    },
    createIdListChange: ({ commit, state }, str) => {
        commit('createIdListChange', str);
    },
    doctorIdListChange: ({ commit, state }, str) => {
        commit('doctorIdListChange', str);
    },
    tNameListChange: ({ commit, state }, str) => {
        commit('tNameListChange', str);
    },
    tIdListChange: ({ commit, state }, str) => {
        commit('tIdListChange', str);
    },
    scrShowFlagChange: ({ commit, state }, str) => {
        commit('scrShowFlagChange', str);
    },
    belongListChange: ({ commit, state }, str) => {
        commit('belongListChange', str);
    },
    belongBtnChange: ({ commit, state }, data) => {
        commit('belongBtnChange', data);
    },
    chooseTipsChange: ({ commit, state }, str) => {
        commit('chooseTipsChange', str);
    },
    allBtnFlagChange: ({ commit, state }, str) => {
        commit('allBtnFlagChange', str);
    },
    belongAjax: ({ commit, state }, str) => {
        commit('belongAjax', str);
    },
    teamNameListChange: ({ commit, state }, str) => {
        commit('teamNameListChange', str);
    },
    teamIdChange: ({ commit, state }, str) => {
        commit('teamIdChange', str);
    },
    sTeamFlagChange: ({ commit, state }, str) => {
        commit('sTeamFlagChange', str);
    },
    teamSuccessChange: ({ commit, state }, str) => {
        commit('teamSuccessChange', str);
    },
    teamSucInfoChange: ({ commit, state }, str) => {
        commit('teamSucInfoChange', str);
    },
    alBelongFailChange: ({ commit, state }, str) => {
        commit('alBelongFailChange', str);
    },
    infoListChange: ({ commit, state }, str) => {
        commit('infoListChange', str);
    },
    isActiveChange: ({ commit, state }, str) => {
        commit('isActiveChange', str);
    },
    noCListFlagChange: ({ commit, state }, str) => {
        commit('noCListFlagChange', str);
    },
    scrItemsFlagChange: ({ commit, state }, str) => {
        commit('scrItemsFlagChange', str);
    },
    belongTypeChange: ({ commit, state }, str) => {
        commit('belongTypeChange', str);
    },
    pageIndexChange: ({ commit, state }, str) => {
        commit('pageIndexChange', str);
    },
    pageSizeChange: ({ commit, state }, str) => {
        commit('pageSizeChange', str);
    },
    totalChange: ({ commit, state }, str) => {
        commit('totalChange', str);
    },
    loadingChange: ({ commit, state }, str) => {
        commit('loadingChange', str);
    },
    searchKeyChange: ({ commit, state }, str) => {
        commit('searchKeyChange', str);
    },
    teamFailPersonChange: ({ commit, state }, str) => {
        commit('teamFailPersonChange', str);
    },
    belongCancel: ({ commit, state }, str) => {
        commit('belongCancel', str);
    },
    bConBtnChange: ({ commit, state }, str) => {
        commit('bConBtnChange', str);
    },
    scrLoadingChange: ({ commit, state }, str) => {
        commit('scrLoadingChange', str);
    },
    editingChange: ({ commit, state }, str) => {
        commit('editingChange', str);
    },
    editingTxtChange: ({ commit, state }, str) => {
        commit('editingTxtChange', str);
    },
    noShowBelongChange: ({ commit, state }, str) => {
        commit('noShowBelongChange', str);
    },
    sureConBtnChange: ({ commit, state }, str) => {
        commit('sureConBtnChange', str);
    },
    isTwoChange: ({ commit, state }, str) => {
        commit('isTwoChange', str);
    },
    isTwoTextChange: ({ commit, state }, str) => {
        commit('isTwoTextChange', str);
    },
    sexIdChange: ({ commit, state }, str) => {
        commit('sexIdChange', str);
    },
    deleteBtnChange: ({ commit, state }, str) => {
        commit('deleteBtnChange', str);
    },
    deleteIdChange: ({ commit, state }, str) => {
        commit('deleteIdChange', str);
    },
    forbidDeleteChange: ({ commit, state }, str) => {
        commit('forbidDeleteChange', str);
    },
    caseEditChange: ({ commit, state }, str) => {
        commit('caseEditChange', str);
    },
    passDeleteChange: ({ commit, state }, str) => {
        commit('passDeleteChange', str);
    },
    deleteStatus: ({ commit, state }, str) => {
        commit('deleteStatus', str);
    },
    deCancel: ({ commit, state }, str) => {
        commit('deCancel', str);
    },
    ageMinChange: ({ commit, state }, str) => {
        commit('ageMinChange', str);
    },
    ageMaxChange: ({ commit, state }, str) => {
        commit('ageMaxChange', str);
    },
    notAgeFlagChange: ({ commit, state }, str) => {
        commit('notAgeFlagChange', str);
    }
};
export default actions;
