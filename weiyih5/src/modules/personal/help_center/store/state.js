import comm from "static/js/comm";

let appOnOff = false;
if(typeof appjs == "undefined" || appjs == null || appjs == ""){
    appOnOff = false;//H5端
}else{
    appOnOff = true;//app端
}
let feedBackState = parseInt(comm.getpara().feedBackOnOff,10);
let linkMe = parseInt(comm.getpara().linkMe,10)===1;
let feedBackOnOff =  (!isNaN(feedBackState))&&(feedBackState===1);
const state = {
    headerTitle:'帮助中心',
    appOnOff:appOnOff,
    linkMe:linkMe,
    scrollTop:0,
    feedBackOnOff:feedBackOnOff&&appOnOff
};
export default  state;