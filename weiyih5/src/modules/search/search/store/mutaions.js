const mutaions = {
    pushInfo(state,data){
        state.courseInfo = data;

       // //console.log("mutaions",data);
       // return state.courseInfo
    },
    setPreWord(state,keyWord){
        console.log(keyWord);
        state.preWord = keyWord;
    }
};
export default mutaions;