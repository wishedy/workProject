/**
 * 功能描述： 发现—— 按标签搜索
 * 使用方法:
 * 注意事件： 目前条目首字母分类功能依赖插件实现，该插件字库约为20000个，超出字库涵盖范围的生僻字可能会引起未知问题  
 * 引入来源：  
 * 作用：
 *
 * Created by QiangKaiLiang on 2016/08/22.
 */


$(function() {
    var DiscoverSearchTag = function() {
        var that = this;
        this.XHRList = {
            list: '/mcall/comm/data/property/getMapList/'
        };
    };

    DiscoverSearchTag.prototype = {
        // 预加载
        init: function() {
            //window.onload = Log.createBrowse(47, '发现按标签');
            var that = this;
            that.backBtn();

            this.getTagResult({
                title: "热门",
                container: $(".ev-initList")
            });
            this.layout();
            this.keypressSearch();
            this.firstLetterPosition();
            this.execOutsideSUBFn();
            this.eventTrack();
        },
        eventTrack:function(){
            $('.ev-initList,.ev-searchList').on('click','a',function(){
                comm.creatEvent({
                    triggerType:'标签',
                    trigger_name:"标签",
                    keyword:$(this).text(),
                    refId:$(this).attr('href').split('tId=')[1],
                    actionId:79,
                    async:false
                });
            })  ;
        },
        backBtn: function() {
            $('.ev_backBtn').off('click').click(function(e) {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if (document.referrer != undefined) { //document.referrer.indexOf('personal') != -1
                    if (document.referrer.indexOf('personal') != -1 || document.referrer.indexOf('index') != -1 || /m.allinmd.cn\/?$/.test(document.referrer)) {
                      g_sps.jump(null,document.referrer);
                    } else {
                      g_sps.jump(null,'/pages/discover/discover_index.html');
                    }
                } else {
                  g_sps.jump(null,'/pages/discover/discover_index.html');
                }
            });
        },
        // 布局相关
        layout: function() {
            this.fH = $(".al-searchHead").outerHeight();

            $(".al-mainInner").css("marginTop", '2.7rem');
        },
        // 获取标签列表
        getTagResult: function(iObj) {
            var that = this;
            var dTemplateList = "",
                hTemplateList = "";
            var data = {
                pageIndex: 1,
                pageSize: 1000,
                visitSiteId: 2,
                resourceNum: 2,
                customerId:TempCache.getItem('userId')||"",
                platformId:TempCache.getItem('department')||1,
                sessionCustomerId:TempCache.getItem('userId')||"",
                platformId:TempCache.getItem('department')||1
            };
            if (typeof(iObj.propertyName) !== 'undefined') {
                data.propertyName = iObj.propertyName;
            }
            $.ajax({
                    url: that.XHRList.list,
                    type: 'POST',
                    dataType: "json",
                    timeout: 10000,
                    async: false,
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function() {
                        comm.loading.show();
                    }
                })
                .done(function(data) {
                    iObj.container.children().remove();
                    $(".al-searchFocusMask").removeClass('al-searchFocusMaskShow');

                    var hList = data.responseObject.responseData.hot_list,
                        sList = data.responseObject.responseData.data_list,
                        hTemplate = '',
                        dTemplate = '',
                        dList = [];
                    $(hList).each(function(index, element) {
                        hTemplateList += '<a href="/pages/discover/discover_tagSubject.html?tId=' + encodeURI(element.propertyId) + '" class="al-searchResultItem">' + element.propertyName + '</a>';
                    });
                    $(sList).each(function(index, element) {
                        dTemplateList += '<a href="/pages/discover/discover_tagSubject.html?tId=' + encodeURI(element.propertyId) + '" class="al-searchResultItem">' + element.propertyName + '</a>';
                    });
                    hTemplate = '<section class="al-searchResult">' +
                        '<header class="al-searchResultTitle" id="热门">' + iObj.title + '</header>' +
                        hTemplateList +
                        '</section>';
                    dTemplate = '<section class="al-searchResult">' +
                        '<header class="al-searchResultTitle">' + iObj.title + '</header>' +
                        dTemplateList +
                        '</section>';
                    var dListItem;
                    $(sList).each(function(index, element) {
                        dListItem = {
                            name: element.propertyName,
                            id: element.propertyId
                        };
                        dList.push(dListItem);
                    });
                    if (iObj.container.hasClass('ev-initList')) {
                        iObj.container.append(hTemplate);
                        that.getSortByFirstLetter(dList);
                    } else {
                        iObj.container.append(dTemplate);
                        if ($.isEmptyObject(data.responseObject.responseData)) {
                            $('.al-noContentTips').show();
                            $('.ev-searchList').hide();
                        } else {
                            $(".ev-searchList").show();
                            $('.al-noContentTips').hide();
                        }
                    }
                    comm.loading.hide();
                    that.searchResultHighLight();
                    that.v1 = that.v2;

                    that.execOutsideSUBFn();
                })
                .fail(function() {
                    console.log("XHR error...");
                });
        },
        // 搜索结果高亮显示
        searchResultHighLight: function() {
            $(".ev-searchList .al-searchResultItem").each(function(index, ele) {
                var input = $('#EV-SearchInput').val(),
                    place1 = $(ele).text().toLowerCase().indexOf(input.toLowerCase()),
                    replace1 = $(ele).text().splice(place1, 0, '<em>'),
                    result = replace1.splice(place1 + 4 + input.length, 0, '</em>');
                $(ele).html(result);
            });
        },
        // 输入搜索
        keypressSearch: function() {
            var that = this,
                i;
            // 函数节流
            var flag = true;
            $("#EV-SearchInput").bind('compositionstart',function(){
                flag = false;
            });
            $("#EV-SearchInput").bind('compositionend',function(){
                flag = true;
            });
            $("#EV-SearchInput").on("input propertychange", function(e) {

                var t = this;
                clearTimeout(i);
                i = setTimeout(function() {
                    if(flag){
                        comm.creatEvent({
                            triggerType:'搜索',
                            keyword:$(t).val(),
                            actionId:10
                        });
                        that.getTagResult({
                            resourceNum: 2,
                            propertyName: $(t).val(),
                            title: "匹配标签",
                            container: $(".ev-searchList")
                        });
                    }
                    $(".ev-initList").hide();
                    $(".al-searchTypeSelect").hide();
                }, 100);
            });

            comm.inputFocus({
                focusCallback: function() {

                    $(".al-searchFocusMask").addClass('al-searchFocusMaskShow');

                    $(".al-mainInner").css("marginTop", '1.5rem');

                    if ($(".ev-searchList .al-searchResultItem").length === 0 && $(".al-searchInputBar input").val().length !== 0) {
                        $('.al-noContentTips').show();
                        $(".ev-initList").hide();

                    }
                    if ($('.al-noContentTips').is(':visible')) {
                        return;
                    } else {
                        $(".ev-searchList").show();
                    }
                },

                emptyCallback: function() {
                    $(".ev-searchList").children().remove();
                    $(".icon-searchCancel").hide();
                    $(".ev-initList").show();
                    $(".al-searchFocusMask").addClass('al-searchFocusMaskShow');
                },
                clearCallback: function() {
                    $(".ev-searchList").children().remove();
                    $('.al-noContentTips').hide();
                    $(".al-searchFocusMask").addClass('al-searchFocusMaskShow');
                    $(".ev-initList").show();
                    $(".al-searchTypeSelect").show();
                },
                cancelCallback: function() {
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"取消",
                        actionId:45
                    });
                    $('.ev-initList').show();
                    $('.ev-searchList').hide();
                    $('.al-noContentTips').hide();
                    $(".al-mainInner").css("marginTop", "3rem");
                    $(".al-searchHead").removeClass('.al-searchHeadShow');
                    $(".al-searchFocusMask").removeClass('al-searchFocusMaskShow');
                    $("#EV-SearchInput").val("");
                    $(".icon-searchCancel").hide();
                    $(".al-searchTypeSelect").show();
                }
            });
        },
        // 依首字母分类
        getSortByFirstLetter: function(list) {
            var SortList = list.sort(this.sortRule);
            var SortBox = $(".ev-initList");
            var initials = [];
            var num = 0;
            $(SortList).each(function(i, el) {
                var initial = makePy(el.name.charAt(0))[0].toUpperCase();

                if (initial >= 'A' && initial <= 'Z') {
                    if (initials.indexOf(initial) === -1)
                        initials.push(initial);
                } else {
                    num++;
                }
            });
            $.each(initials, function(index, value) { //添加首字母标签
                SortBox.append('<section class="al-searchResult"><header class="al-searchResultTitle" id=' + value + '>' + value + '</header></section>');
            });
            if (num !== 0) {
                SortBox.append('<header class="al-searchResultTitle" id="default">#</header>');
            }
            for (var i = 0; i < SortList.length; i++) { //插入到对应的首字母后面
                var letter = makePy(SortList[i].name.charAt(0))[0].toUpperCase();

                switch (letter) {
                    case "A":

                        $('#A').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='A']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="A">A</a>')
                        }
                        break;
                    case "B":
                        $('#B').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='B']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="B">B</a>');
                        }
                        break;
                    case "C":
                        $('#C').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='C']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="C">C</a>');
                        }
                        break;
                    case "D":
                        $('#D').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='D']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="D">D</a>');
                        }
                        break;
                    case "E":
                        $('#E').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='E']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="E">E</a>');
                        }
                        break;
                    case "F":
                        $('#F').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='F']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="F">F</a>');
                        }
                        break;
                    case "G":
                        $('#G').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='G']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="G">G</a>');
                        }
                        break;
                    case "H":
                        $('#H').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='H']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="H">H</a>');
                        }
                        break;
                    case "I":
                        $('#I').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='I']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="I">I</a>');
                        }
                        break;
                    case "J":
                        $('#J').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='J']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="J">J</a>');
                        }
                        break;
                    case "K":
                        $('#K').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='K']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="K">K</a>');
                        }
                        break;
                    case "L":
                        $('#L').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='L']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="L">L</a>');
                        }
                        break;
                    case "M":
                        $('#M').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='M']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="M">M</a>');
                        }
                        break;
                    case "N":
                        $('#N').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='N']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="N">N</a>');
                        }
                        break;
                    case "O":
                        $('#O').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='O']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="O">O</a>');
                        }
                        break;
                    case "P":
                        $('#P').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='P']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="P">P</a>');
                        }
                        break;
                    case "Q":
                        $('#Q').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='Q']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="Q">Q</a>');
                        }
                        break;
                    case "R":
                        $('#R').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='R']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="R">R</a>');
                        }
                        break;
                    case "S":
                        $('#S').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='S']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="S">S</a>');
                        }
                        break;
                    case "T":
                        $('#T').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='T']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="T">T</a>');
                        }
                        break;
                    case "U":
                        $('#U').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='U']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="U">U</a>');
                        }
                        break;
                    case "V":
                        $('#V').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='V']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="V">V</a>');
                        }
                        break;
                    case "W":
                        $('#W').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='W']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="W">W</a>');
                        }
                        break;
                    case "X":
                        $('#X').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='X']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="X">X</a>');
                        }
                        break;
                    case "Y":
                        $('#Y').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='Y']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="Y">Y</a>');
                        }
                        break;
                    case "Z":
                        $('#Z').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='Z']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="Z">Z</a>');
                        }
                        break;
                    default:
                        $('#default').after($('<a class="al-searchResultItem" href="/pages/discover/discover_tagSubject.html?tId=' + SortList[i].id + '">' + SortList[i].name + '</a>'));
                        if ($(".al-searchTypeSelect [data-toolTips='#']").size() === 0) {
                            $(".al-searchTypeSelect").append('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="#">#</a>');
                        }
                        break;
                }
            }
            $(".al-searchTypeSelect").prepend('<a href="javascript:void(0)" class="al-searchTypeSelectItem" data-toolTips="热">热</a>');
        },
        sortRule: function(a, b) {
            return makePy(b.name.charAt(0))[0].toUpperCase() < makePy(a.name.charAt(0))[0].toUpperCase() ? 1 : -1;
        },
        firstLetterPosition: function() {
            var that = this;
            var aside = document.querySelector(".al-searchTypeSelect");

            
            $(".al-searchTypeSelect").on("touchend", function() {
                $('.al-searchTypeSelectItem').removeClass('selected');
            });
            aside.addEventListener('touchmove', function(event) {
                $('body').on("touchmove", function(e) {
                    e.preventDefault();
                });
                var element = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY - $(window).scrollTop());
                $('.al-searchTypeSelectItem').removeClass('selected');
                $(element).addClass('selected');
                if (element.nodeName.toLowerCase() === "a") {
                    var tagFL = $(element).attr("data-toolTips"),
                        oT;
                    if (tagFL === "热") {
                        oT = $("#热门").parent().offset().top;
                    } else {
                        oT = $("#" + tagFL + "").parent().offset().top;
                    }

                    $(window).scrollTop(oT - that.fH);
                }
            });
            aside.addEventListener('touchend', function() {
                $('body').off("touchmove");
            });

        },
        execOutsideSUBFn: function() {
            if (getpara().search == 'active') {
                $(".al-searchInputBar input").click();
            }
        }
    };

    var discoverSearchTag = new DiscoverSearchTag();


    discoverSearchTag.init();

});
