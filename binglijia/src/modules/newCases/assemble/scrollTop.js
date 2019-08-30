var four;
function Topfun(){
    four=setInterval(FourscrollBy,10);
}
function FourscrollBy(eachHeight){
    if(document.documentElement && document.documentElement.scrollTop) //IE
    {
        if(document.documentElement.scrollTop<=0){
            clearInterval(four);
        }else{
            window.scrollBy(0,-30);
        }
    }else{ //Chrome不支持documentElement.scrollTop
        if(document.body.scrollTop<=0){
            clearInterval(four);
        }else{
            window.scrollBy(0,-30);
        }
    }
}
export default Topfun;
