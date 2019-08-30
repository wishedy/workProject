(function (doc, win) {
    var docEl = doc.documentElement,resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    function recalc(){
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 100 * (clientWidth / 320) + 'px';
    }
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);
