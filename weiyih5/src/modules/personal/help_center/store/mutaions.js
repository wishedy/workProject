const mutaions = {
    changeTitle(state,text){
        state.headerTitle = text;
        if(state.appOnOff){
            if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                appjs&&appjs.updateTitle(text);
            }
        }
    },
    feedBack(state){
        if(state.appOnOff){
            if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                appjs&&appjs.makeCustomerFeedBack($.toJSON({
                    type:13,
                    feedBackPlaceholder:'请告诉我们您的想法'
                }));
            }
        }else{
            window.location.href='/dist/feedback.html'
        }
    },
    changeScrollTop(state,num){
        state.scrollTop = num;
    }
};
export default mutaions;