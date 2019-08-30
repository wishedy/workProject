/*
* 使用方法  ymd({
*                year: $("#year01"),
				 month: $("#month01"),
				 day: $("#day01"),
 				 default1:1,//有默认选择项
                 defaultYear:默认年
                 defaultVal:"xxx" 默认值:比如请选择xxx,
                 latestYear:'2000'  截止年份，比如1900年到2000年
*             })
* */

function ymd(opt) {
    //出始化年
    var dDate = new Date(),
        dCurYear = opt.latestYear||dDate.getFullYear(),
        str = "";
    var yearStr="",monthStr="";
    if (opt.default1&&opt.year) {
        if(opt.defaultVal){
            opt.year.append('<option value='+opt.defaultVal+' selected=true>'+opt.defaultVal+'</option>');
        }else{
            opt.year.append('<option value="" selected=true disabled=""></option>');
        }

    }
    for (var i = dCurYear; i >= dCurYear - 100; i--) {
        if (opt.default1) {
            yearStr += "<option value=" + i + ">" + i + "</option>";
        } else {
            if (i == (opt.defaultYear ? opt.defaultYear : dCurYear)) {
                yearStr += "<option value=" + i + " selected=true>" + i + "</option>";
            } else {
                yearStr += "<option value=" + i + ">" + i + "</option>";
            }
        }
    }
    opt.year.append(yearStr);
    if(opt.month){
        updateMonth();
    }

    //调用函数出始化日
    if (opt.day) {
        TUpdateCal(opt, 1);
        opt.year.bind("change", function() {
            updateMonth();
            if (!opt.month.val()) {
                $("option", opt.month).removeAttr("selected");
                $("option", opt.month).eq(1).attr("selected", true);
            }
            if (!opt.day.val()) {
                $("option", opt.day).removeAttr("selected");
                $("option", opt.day).eq(1).attr("selected", true);
            }
            opt.year.parent().find("span,select").css("color", "#333");
            opt.month.parent().find("span,select").css("color", "#333");
            opt.day.parent().find("span,select").css("color", "#333");
            TUpdateCal(opt);
            opt.fn&&opt.fn();
        });
        opt.month.bind("change", function() {
            TUpdateCal(opt);
            updateDay();
            opt.fn&&opt.fn();
        });
    } else {
        opt.year.bind("change", function() {
            updateMonth();
            opt.year.parent().find("span,select").css("color", "#333");
            if(opt.month){
                opt.month.parent().find("span,select").css("color", "#333");
                if (!opt.month.val()) {
                    $("option", opt.month).removeAttr("selected");
                    $("option", opt.month).eq(1).attr("selected", true);
                }
            }

            opt.fn&&opt.fn();
        });
    }
    //月份的修改
    function updateMonth(){
        var selectYear=opt.year.find("option:selected").val();
        var maxMonth=12;
        var dayStr ='';
        if(selectYear==new Date().getFullYear()){
            maxMonth=dDate.getMonth() + 1;
        }
        opt.month&&opt.month.empty();
        if(opt.default1){
            if(opt.defaultVal){
                opt.month.append('<option value='+opt.defaultVal+' selected=true>'+opt.defaultVal+'</option>');
            }else {
                opt.month && opt.month.append('<option value="" selected=true disabled=""></option>');
            }
        }
        if(opt.month){
            for (var i = 1; i <= maxMonth; i++) {

                dayStr += "<option value=" + (i<10?"0"+i:i) + ">" + (i<10?"0"+i:i) + "</option>";


            }
            opt.month.append(dayStr);
        }
    }
    function updateDay(){
        var selectYear=opt.year.find("option:selected").val();
        var selY = selectYear==""?selectYear:parseInt(selectYear);
        var selectMonth= opt.month.find('option:selected').val();
        var selM = selectMonth==""?selectMonth:parseInt(selectMonth);
        var maxDay =31;
        if(selM==4||selM==6||selM==9||selM==11){
            maxDay = 30;
        }else if(selM==2){//2月
            if(selY%4==0){//闰年
                maxDay = 29;
            }else{
                maxDay = 28;
            }
        }
        var _dstr ="";
        if(selY == dDate.getFullYear() && selM==dDate.getMonth() + 1 ){//本年本月
            maxDay = dDate.getDate();
        }
        opt.day&&opt.day.empty();
        if(opt.default1){
            if(opt.defaultVal){
                opt.day.append('<option value='+opt.defaultVal+' selected=true>'+opt.defaultVal+'</option>');
            }else {
                opt.day && opt.day.append('<option value="" selected=true disabled=""></option>');
            }
        }
        if(opt.day){
            for(var j=1,l = maxDay;j<=l;j++){
                _dstr += "<option value='" + (j < 10 ? "0" + j : j) + "'>" + (j < 10 ? "0" + j : j) + "</option>";
            }
            opt.day.append(_dstr);
        }


    }
    function TGetDaysInMonth(year, month) {
        month = parseInt(month, 10);
        var dPrevDate = new Date(year, month, 0);
        return dPrevDate.getDate();
    }

    function TUpdateCal(opt, no) {
        var dDate = new Date(),
            daysInMonth = TGetDaysInMonth(opt.year.val(), opt.month.val()),
            str = "";
        n = "";
        $("option", opt.day).each(function(i, em) {
            if ($(em).attr("selected")) {
                n = $(em).val();
                if (n < 10) {
                    n = n.substring(1);
                }
                return;
            }
        });
        opt.day&&opt.day.empty();
        if (opt.default1&&opt.day) {
            opt.day.append('<option value="" selected=true disabled=""></option>');
        }
        for (var d = 1; d <= (parseInt(daysInMonth) ? parseInt(daysInMonth) : 30); d++) {
            if (no && opt.default1) { //初始化日
                str = "<option value=" + (d < 10 ? "0" + d : d) + ">" + (d < 10 ? "0" + d : d) + "</option>";
            } else { //dDate.getDate()
                if (d == (n ? n : 1)) {
                    str = "<option value=" + (d < 10 ? "0" + d : d) + " selected=true>" + (d < 10 ? "0" + d : d) + "</option>";
                    //str = "<option value=" + (d<10?"0"+d:d) + ">" + (d<10?"0"+d:d) + "</option>";
                } else {
                    str = "<option value=" + (d < 10 ? "0" + d : d) + ">" + (d < 10 ? "0" + d : d) + "</option>";
                }
            }

            opt.day.append(str);
        }
    }
}


//时间匹配
function gettime(obj, time, noUpnow) {
    if (time) {
        obj.find("option").each(function(i, val) {
            if ($(val).val() == "") {
                $(val).remove();
            }
            if ($(val).val() == time) {
                if (noUpnow) { //出生年月在手机上无法选中问题的解决
                    obj.find("option").removeAttr("selected");
                }
                $(val).attr("selected", "selected");
                obj.change();
                return;
            }
        });
    }

};
//时间判断
function checkEndTime(startTime, endTime) {
    if (startTime && endTime) {
        if (startTime.length < 8) {
            time1 = startTime + "-01";
        } else {
            time1 = startTime;
        }
        if (endTime.length < 8) {
            time2 = endTime + "-01";
        } else {
            time2 = endTime;
        }
        var start = new Date(time1.replace(/\-/g, "\/"));
        var end = new Date(time2.replace(/\-/g, "\/"));
        if (end < start) {
            return false;
        }
    }
    return true;
}
