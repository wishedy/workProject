const commPopup = {
    popup(s) {
        if ($(".ev-commTips").length == 0) {

            $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-commTips"><figure class="al-middleTipsModalText"><p class="tipText">' + s + '</p> </figure></section></section>');

            setTimeout(function() {
                $(".ev-commTips").addClass('show')
            }, 100);
        } else {
            $(".ev-commTips").addClass('show');
            $(".tipText").text(s);
        }
        setTimeout(function() {
            $(".ev-commTips").removeClass('show');
        }, 3000)
    },
    popupFn(s,time,fn){
        if ($(".ev-commTips").length == 0) {

            $("body").append('<section class="al-middleTipsBox"><section class="al-middleTipsModal ev-commTips"><figure class="al-middleTipsModalText"><p class="tipText">' + s + '</p> </figure></section></section>');

            setTimeout(function() {
                $(".ev-commTips").addClass('show')
            }, 100);
        } else {
            $(".ev-commTips").addClass('show');
            $(".tipText").html(s);
        }
        setTimeout(function() {
            $(".ev-commTips").removeClass('show');
            fn&&fn();
        }, time?time:3000);
    }
};
export default  commPopup;
window.popup = commPopup.popup;
window.popupFn = commPopup.popupFn;
