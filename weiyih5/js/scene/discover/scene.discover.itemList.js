/**
 * Created by Administrator on 2017/9/28.
 */
module.indexListTem = {
    list: function (kv) {
        var isSmallPhone = $(window).width() <= 640;
        var _act = "";//获奖>参赛>最热>最新>pdf refType  resUrl  resName resDesc isAward isAttend isNew tplPath resAuthor resWatchCount attUrl playTime
        var _actTitle = '';
        if (kv.isShowActivityTag == 1) {
            var _color = kv.activityTagColor;
            _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">' + kv.activityTagName + '</span>';
        }
        if (kv.isAward == 1 || kv.resourceSign == 4) {
            _act = '<span class="al-contentAward">获奖</span>';
        } else if (kv.isAttend == 1 || kv.resourceSign == 3) {
            _act = '<span class="al-contentJoin">参赛</span>';
        } else if (kv.isHot == 1 || kv.resourceSign == 2) {
            _act = '<span class="al-contentHotest">最热</span>';
        } else if (kv.isNew == 1 || kv.resourceSign == 1) {
            _act = '<span class="al-contentNewest">最新</span>';
        } else if (kv.tplPath == 31 || kv.tplPath == 32 || kv.tplPath == 127) {
            _act = '<span class="al-contentPdf">PDF</span>';
        }
        if (kv.attLength == 1 && _act && _actTitle) {   //一个图片，并且有标签的，换行
            var _color = kv.activityTagColor;
            _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;display:inline-block;margin-bottom:0.2rem;">' + kv.activityTagName + '</span>';
            _act = _actTitle + _act + '<br/>';
        } else {
            _act = _actTitle + _act;
        }
        var type = 'al_flow_case';
        var name = "病例";
        switch (parseInt(kv.refType)) {
            case 2:
                type = 'al_flow_doc';
                var name = "文库";
                break;
            case 4:
                type = 'al_flow_topic';
                var name = "话题";
                break;
            default:
                type = 'al_flow_case';
                var name = "病例";
        }
        var score = "";
        if (kv.scoreNum >= 10) {
            var s = kv.score;
            var num = parseInt(s);
            var flot = (s - num) * 100 + "%";
            if (num == 0) {
                score = '<ul class="al-littleScoreStarBox"><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li><li></li></ul>';
            } else if (num == 1) {
                score = '<ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li></ul>';
            } else if (num == 2) {
                score = '<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li></ul>';
            } else if (num == 3) {
                score = '<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li></ul>';
            } else if (num == 4) {
                score = '<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li></ul>';
            } else if (num == 5) {
                score = '<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul>';
            }
        }
        var ev_operate = "";
        if (kv.ev_operate) {
            ev_operate = "ev_operate";
        }
        if (kv.refType == 4 && kv.resName == "") {
            kv.resName = '话题医起聊';
        }
        if (kv.refType == 1) {
            html = ' <section class="al-contentPartModule ev_flow ' + ev_operate + '" itemType="1">' +
            '<div class="al_flow_type"><span class="al_flow_span al_flow_video ' + (kv.videoType == 1 ? 'surgey">手术视频' : '">视频') + '</span>' + score + '</div>' +
            '      <section class="al-tableBox">' +
            '      <article class="al-contentText">' +
            '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
            '      <p class="al-contentOtherMsg">' +
            _act +
            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
            '      </p>' +
            '      </article>' +
            (kv.attLength > 0 ?
                ('      <figure class="al-contentImgBox">' +
                '      <a href="' + kv.resUrl + '">' +
                '      <img src="' + kv.attUrl[0] + '" alt="">' +
                '      <i class="al-videoPlayBtn">' +
                '      <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                '      </i>' +
                '      <span class="al-videoTime">' + kv.playTime.substring(0, 8) + '</span>') : "") +
            '  </a>' +
            '  </figure>' +
            '  </section>' +
            '  </section>';

        } else {
            var itemId = '';
            switch (parseInt(kv.refType)) {
                case 2:
                    itemId = 'docId';
                    break;
                case 4:
                    itemId = 'topicId';
                    break;
                case 7:
                    itemId = 'caseId';
                    break;
            }
            if (itemId === 'caseId' || itemId === 'topicId') {//病例，话题
                switch (kv.attLength) {
                    case 1: //病例1个图  只显示图，视频有无都不显示播放图标和时间
                        if (kv.playTime != 0) {
                            html = '<section class="al-contentPartModule ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '<section class="al-tableBox">' +
                            '      <article class="al-contentText">' +
                            '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + comm.getStrByteLen(kv.resName, 44) + '</a>' +
                            '  <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '  </p>' +
                            '  </article>' +
                            '  <figure class="al-contentImgBox" ' + itemId + '="' + kv.id + '">' +
                            '      <a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[0] + '" alt="">' +
                            '      <i class="al-videoPlayBtn">' +
                            '      <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '      </i>' +
                            '      <span class="al-videoTime">' + kv.playTime.substring(0, 8) + '</span>' +
                            '  </a>' +
                            '  </figure>' +
                            '  </section></section>';
                        } else {
                            html = '<section class="al-contentPartModule ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '<section class="al-tableBox">' +
                            '      <article class="al-contentText">' +
                            '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + comm.getStrByteLen(kv.resName, 44) + '</a>' +
                            '  <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '  </p>' +
                            '  </article>' +
                            '  <figure class="al-contentImgBox" ' + itemId + '="' + kv.id + '">' +
                            '      <a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[0] + '" alt="">' +
                            '  </a>' +
                            '  </figure>' +
                            '  </section></section>';
                        }

                        break;
                    case 0://病例0个图
                        html = '  <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                        '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                        '      <article class="al-contentText">' +
                        '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                        '  <article class="al-contentMainText">' +
                        '      <a href="javascript:void(0)">' + kv.resDesc.replace(/<\w+>/g, '').replace(/<\/\w+>/g, "") + '</a>' +
                        '  </article>' +
                        '  <p class="al-contentOtherMsg">' +
                        _act +
                        '      <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                        '      <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                        '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                        '      </p>' +
                        '      </article>' +
                        '      </section>';
                        break;
                    case 2 ://2个图
                        if (kv.playTime != 0) {//有视频
                            html = '<section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '     <article class="al-contentText">' +
                            '     <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                            ' <ul class="al-contentMiddleImg">' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[0] + '" alt="">' +
                            '      <i class="al-videoPlayBtn">' +
                            '      <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '      </i>' +
                            '      <span class="al-videoTime">' + kv.playTime.substring(0, 8) + '</span>' +
                            '     </a></li>' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[1] + '" alt="">' +
                            '     </a></li>' +
                            '     </ul>' +
                            '     <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '     </p>' +
                            '     </article>' +
                            '     </section>';
                        } else {
                            html = '<section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '     <article class="al-contentText">' +
                            '     <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                            ' <ul class="al-contentMiddleImg">' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[0] + '" alt="">' +
                            '     </a></li>' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[1] + '" alt="">' +
                            '     </a></li>' +
                            '     </ul>' +
                            '     <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '     </p>' +
                            '     </article>' +
                            '     </section>';
                        }
                        break;
                    default://多个图
                        if (kv.playTime != 0) {//有视频
                            html = '<section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '     <article class="al-contentText">' +
                            '     <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                            ' <ul class="al-contentMiddleImg">' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[0] + '" alt="">' +
                            '      <i class="al-videoPlayBtn">' +
                            '      <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '      </i>' +
                            '      <span class="al-videoTime">' + kv.playTime.substring(0, 8) + '</span>' +
                            '     </a></li>' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[1] + '" alt="">' +
                            '     </a></li>' +
                            '     <li><a href="' + kv.resUrl + '">' +
                            '     <img src="' + kv.attUrl[2] + '" alt="">' +
                            '     </a></li>' +
                            '     </ul>' +
                            '     <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '     </p>' +
                            '     </article>' +
                            '     </section>';
                        } else {
                            html = '<section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '     <article class="al-contentText">' +
                            '     <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                            '  <ul class="al-contentMiddleImg">' +
                            '      <li><a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[0] + '" alt="">' +
                            '      </a></li>' +
                            '      <li><a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[1] + '" alt="">' +
                            '      </a></li>' +
                            '      <li><a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[2] + '" alt="">' +
                            '      </a></li>' +
                            '      </ul>' +
                            '     <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '     </p>' +
                            '     </article>' +
                            '     </section>';
                        }


                }
            } else {
                switch (kv.attLength) {
                    case 1:
                        if (kv.playTime != 0) {
                            html = '<section class="al-contentPartModule ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '<section class="al-tableBox">' +
                            '      <article class="al-contentText">' +
                            '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + comm.getStrByteLen(kv.resName, 44) + '</a>' +
                            '  <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '  </p>' +
                            '  </article>' +
                            '  <figure class="al-contentImgBox" ' + itemId + '="' + kv.id + '">' +
                            '      <a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[0] + '" alt="">' +
                            '      <i class="al-videoPlayBtn">' +
                            '      <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '      </i>' +
                            '      <span class="al-videoTime">' + kv.playTime.substring(0, 8) + '</span>' +
                            '  </a>' +
                            '  </figure>' +
                            '  </section></section>';
                        } else {
                            html = '<section class="al-contentPartModule ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                            '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                            '<section class="al-tableBox">' +
                            '      <article class="al-contentText">' +
                            '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + comm.getStrByteLen(kv.resName, 44) + '</a>' +
                            '  <p class="al-contentOtherMsg">' +
                            _act +
                            '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                            '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                            '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                            '  </p>' +
                            '  </article>' +
                            '  <figure class="al-contentImgBox" ' + itemId + '="' + kv.id + '">' +
                            '      <a href="' + kv.resUrl + '">' +
                            '      <img src="' + kv.attUrl[0] + '" alt="">' +
                            '  </a>' +
                            '  </figure>' +
                            '  </section></section>';
                        }

                        break;
                    case 2:
                        html = '<section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                        '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                        '     <article class="al-contentText">' +
                        '     <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                        ' <ul class="al-contentMiddleImg">' +
                        '     <li><a href="' + kv.resUrl + '">' +
                        '     <img src="' + kv.attUrl[0] + '" alt="">' +
                        '     </a></li>' +
                        '     <li><a href="' + kv.resUrl + '">' +
                        '     <img src="' + kv.attUrl[1] + '" alt="">' +
                        '     </a></li>' +
                        '     </ul>' +
                        '     <p class="al-contentOtherMsg">' +
                        _act +
                        '     <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                        '     <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                        '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                        '     </p>' +
                        '     </article>' +
                        '     </section>';

                        break;
                    case 0:
                        html = '  <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                        '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                        '      <article class="al-contentText">' +
                        '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                        '  <article class="al-contentMainText">' +
                        '      <a href="javascript:void(0)">' + kv.resDesc.replace(/<\w+>/g, '').replace(/<\/\w+>/g, "") + '</a>' +
                        '  </article>' +
                        '  <p class="al-contentOtherMsg">' +
                        _act +
                        '      <span class="al-contentAuthor icon-contentAuthor">' + kv.resAuthor + '</span>' +
                        '      <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                        '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                        '      </p>' +
                        '      </article>' +
                        '      </section>';
                        break;
                    default :
                        html = ' <section class="al-contentPartModule al-contentUpTitleDownImg ev_flow ' + ev_operate + '" itemType="' + kv.refType + '">' +
                        '<div class="al_flow_type"><span class="al_flow_span ' + type + '">' + name + '</span>' + score + '</div>' +
                        '          <article class="al-contentText">' +
                        '      <a href="' + kv.resUrl + '" class="al-contentTitle">' + kv.resName + '</a>' +
                        '  <ul class="al-contentMiddleImg">' +
                        '      <li><a href="' + kv.resUrl + '">' +

                        '      <img src="' + kv.attUrl[0] + '" alt="">' +
                        '      </a></li>' +
                        '      <li><a href="' + kv.resUrl + '">' +
                        '      <img src="' + kv.attUrl[1] + '" alt="">' +
                        '      </a></li>' +
                        '      <li><a href="' + kv.resUrl + '">' +
                        '      <img src="' + kv.attUrl[2] + '" alt="">' +
                        '      </a></li>' +
                        '      </ul>' +
                        '      <p class="al-contentOtherMsg">' +
                        _act +
                        '      <span class="al-contentAuthor  icon-contentAuthor">' + kv.resAuthor + '</span>' +
                        '      <span class="icon-contentWatchedNum">' + kv.resWatchCount + '</span>' +
                        '     <span class="al-contentDelete" itemType="' + kv.refType + '" itemId="' + kv.id + '">x</span>' +
                        '      </p>' +
                        '      </article>' +
                        '      </section>';
                }
            }

        }
        return html;
    }
}