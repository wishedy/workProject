/*
* create By ZhangHeng on 2018/1/22
*/

var ccChat = {
    data: {
        regionEmotion: "//img10.allinmd.cn/v3/conference/ccEmotion/",//表情包路径
        emotion: {'png': 20},//目前只能加载20个png表情
        emotionBox:{
            emotionList:[]
        },//固定不动
        emotionOff:true,
        userName:$("#sesNickname").val(),
        userId: comm.getpara().userId,
        backOnOff: parseInt(comm.getpara().back, 10) === 1//是否是回播
    },
    element: {
        emotionContainer: $("#phizList"),//表情包ul的父元素
        inputBar:  $("#chat-area"),//聊天信息输入栏，要求是一个可编辑的元素，而不是input
        msgContainer: $(".msg-list"),//消息加载的ul盒子
        sendBtn: $("#chat-submit"),//发送按钮
        sendRole: $("#selectedUser"),//显示目前的聊天对象
        toggleTeacher: $("#chatto-box"),
        teacherBox: $("#chatto-list"),//显示讲师列表的ul
        phizBtn: $(".phiz-btn"),//表情包按钮
        phizList: $("#phizList")//表情包ul
    },
    placeHolder:{
        'template':"<i class=\"msg-placeholder\">想说什么,想问什么快来加入聊天</i>",
        initLength:99,
        initPlace:function(){
            var t = this;
            ccChat.element.inputBar.html(t.template);
        }
    },
    methods: {
        hideOtherPanel: function () {
            //当点击其他界面时把表情包，在线的人员列表收起来
            var t = ccChat;
            $("body").on("mousedown", function (e) {
                e.stopPropagation();
                var element = $(e.target);
                var isNotTarget = element.hasClass("teacher-list") || element.hasClass("phiz-list") || element.hasClass("name")||element.hasClass("phiz-btn");
                if (!isNotTarget) {
                    t.element.teacherBox.hide(400);
                    t.element.phizList.hide(400);
                }
                /*return false;*/
            });
        },
        analysisMsg: function (msg) {
            //解析接收到的消息
            var t = ccChat;
            var str = '';
            var lastResult = '';
            if ((msg.indexOf("[") > -1) && (msg.indexOf("]") > -1)) {
                str = msg.replace(/\[/g, '[]').replace(/\[\]/g, '&').replace(/\]/g, '[]').replace(/\[\]/g, '&');
                var dataList = str.split('&');
                for (var num = 0; num < dataList.length; num++) {
                    var item = dataList[num];
                    if (item.length) {
                        if ((item.indexOf("em") > -1) || (item.indexOf("em2") > -1) ) {
                            var imgNum = item.split("_")[1];
                            imgNum = (parseInt(imgNum,10)<10)?'0'+parseInt(imgNum,10):imgNum;
                            if((item.indexOf("em2") > -1) ){
                                lastResult += '<img src="' + t.data.regionEmotion+imgNum+".png" + '" style="width:20px;height:20px;"/>';
                            }else{
                                lastResult += '<img src="' + t.data.regionEmotion+imgNum+".gif" + '" style="width:20px;height:20px;/>';
                            }

                        } else {
                            lastResult += item;
                        }
                    }
                }
            } else {
                lastResult = msg;
            }
            return lastResult;
        },
        toggleTeacherList: function () {
            //展示讲师列表
            var t = ccChat;
            t.element.toggleTeacher.off("click").on("click", function (e) {
                e.stopPropagation();
                if($(e.target).hasClass("al-live-msgRole")){
                    t.element.teacherBox.toggle(400);
                }
                return false;
            });
            t.element.teacherBox.find("li").off("mousedown").on("mousedown", function (e) {
                var item = $(this);
                t.element.teacherBox.hide(400);
                t.element.sendRole.html(item.text()).attr({
                    "data-role": item.attr("data-role"),
                    'data-id': item.attr("data-id")
                });
                e.stopPropagation();
                //return false;
            });
            return t;
        },
        editInit:function(){
            // 定义最后光标对象
            var lastEditRange;

            /*// 编辑框点击事件
            document.getElementById('chat-area').onclick = function() {
                // 获取选定对象
                var selection = getSelection()
                // 设置最后光标对象
                lastEditRange = selection.getRangeAt(0)
            }*/

            // 编辑框按键弹起事件
            document.getElementById('chat-area').onkeyup = function() {
                // 获取选定对象
                var selection = getSelection()
                // 设置最后光标对象
                lastEditRange = selection.getRangeAt(0)
            }

        },
        phizInit: function () {
            //展示比起表情包
            var t = ccChat;
            t.element.phizBtn.off("click").on("click", function (e) {
                e.stopPropagation();
                t.element.phizList.toggle(400);
                return false;
            });
        },
        sendMsg:function(){
            var t = ccChat;
            //发送消息
            function sendBegin(){
                var sendTxt = t.element.inputBar.html();
                var sendOnOff = sendTxt.length;//有消息的时候才发送
                if (sendOnOff) {
                    var str= t.methods.filterHtml(sendTxt).replace(/\ +/g,"") //去掉空格方法
                    var str1= str.replace(/[ ]/g,"")//去掉空格
                    var str2= str1.replace(/[\r\n]/g,"")//去掉回车换行
                    var str3 = '<i>'+str2+'</i>';
                    var str4 = $(str3).text();
                    t.methods.chatSend(str4);
                }else{
                    t.element.inputBar.html("");//将输入栏清空
                }

            }
            t.element.sendBtn.off("click").on("click", function () {
                sendBegin();
            });
            t.element.inputBar.html("");
            t.element.inputBar.off("keyup").on("keyup",function(e){
                var targetObj = $(this);
               if(e.keyCode===13){
                   sendBegin();
               }else{

               }
            });
        },
        produceEmotion:function(){
            //生成表情包数据
            var arr = [];
            for(var key in ccChat.data.emotion){
                for(var i = 0;i<ccChat.data.emotion[key];i++){
                    if(i<9){
                        arr.push("0"+(i+1)+"."+key);
                    }else{
                        arr.push(""+(i+1)+"."+key);
                    }

                }
            }
            return arr;

        },
        assembleEmotion: function () {
            //将表情域名和名字链接起来
            var t = ccChat;
            var arr = [];
            t.data.emotion.emotionList = t.methods.produceEmotion(50,20);
            $.each(t.data.emotion.emotionList, function (index, val) {
                val = t.data.regionEmotion + val;
                arr.push(val);
            });
            return arr;
        },
        chatSend: function (msg) {
            //发送消息，调用cc的api
            var t = ccChat;
            if(msg.length){
                t.data.userName =  $("#sesNickname").val();
                var username = t.data.userName;
                // ////console.log(typeof  username)
                if(((username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                    t.data.userName = '游客';
                }
                if((typeof  username==='string')&&(username.length===0)){
                    t.data.userName = '游客';
                }
                var lastMsg = t.data.userName+":"+msg;
                var role = parseInt(t.element.sendRole.attr("data-role"), 10);
                if(msg.length>260){
                    $.topTip({mark: "warn", content: "聊天不能超过260个字符！"});

                }else{
                    if (role === 0) {
                        //发送公聊
                        DWLive.sendPublicChatMsg(lastMsg);
                    } else {
                        //发送私聊
                        DWLive.sendPrivateChatMsg(t.element.sendRole.attr("data-id"), t.element.sendRole.text(), lastMsg);
                    }
                    t.element.inputBar.html("");//将输入栏清空
                }
                $(".chat-cnt").animate({scrollTop: '1000000px'}, 400);
            }else{
                t.element.inputBar.html("");//将输入栏清空
                //$.topTip({mark: "warn", content: "聊天不能为空！"});
            }

        },
        emotionInit: function () {
            //初始化表情包
            var t = ccChat;
            t.data.emotionBox.emotionList = t.methods.assembleEmotion();
            var myTemplate = Handlebars.compile($("#al-tpl-emotion").html());
            t.element.phizList.html(myTemplate(t.data.emotionBox));
            t.methods.selectEmotion();
        },
        selectEmotion: function () {
            //选中表情后的操作
            var t = ccChat;

            function produceEmotion(data, index) {
                return '<img src="' + data + '" data-resource="' + index + '">';
            }

            $(".phiz-item").off("mousedown").on("mousedown", function () {
                var element = $(this);
                var index = element.index();
                t.element.inputBar.append(produceEmotion(t.data.emotionBox.emotionList[index], index));
            })
        },
        templateMsgItem: function (msg) {
            //渲染本条消息数据
            var t = ccChat;
            var produceContent = function(arr){
                var  str = '';
                if(arr.length>1){
                    for(var num = 0;num<arr.length;num++){
                        if(num!=0){
                            str+=arr[num];
                        }
                    }
                    return str;
                }else{
                    return arr[0];
                }

            };
            var nameDes = function(username){
                if(((typeof  username)==="string")&&(username.length===0) ){
                    username = '游客';
                }
                if(((username == null)||(username == "null")||(typeof username == "null")||(username == "undefined")||(typeof username == "undefined"))){
                    username = '游客';
                }
                return username;
            };
            var username = nameDes($("#sesNickname").val());
            var allMsg = msg.msg.split(":");
            var msgContent = produceContent(allMsg);
            var time = msg.time;
            var timeClass = (time.length) ? "" : "hide";
            var itemClassName = '';
            var talkOrder = false;
            var orderStr = '';
            var teacherName = '';
            var talkerName = '';
            switch (msg.msgType){
                case 0://我说的
                    itemClassName = 'al-single-me';
                    talkerName = username+'(我)';
                    break;
                case 1://别人说的
                    itemClassName = 'al-single-other';
                    talkerName = nameDes(allMsg[0]);
                    break;
                case 2://讲师说的
                    itemClassName = 'al-single-teacher';
                    talkerName = nameDes(msg.username)+'(主讲)';
                    break;
                case 5://讲师说的
                    itemClassName = 'al-single-teacher';
                    talkerName = nameDes(msg.username)+'(嘉宾)';
                    break;
                case 3://我对讲师说的
                    itemClassName = 'al-single-talk';
                    talkerName = username+'(我)';
                    teacherName = nameDes(msg.tousername)+'(主讲)';
                    break;
                case 4://讲师对我说的
                    itemClassName = 'al-single-talk';
                    teacherName = username+'(我)';
                    talkerName = nameDes(msg.fromusername)+'(主讲)';
                    talkOrder = true;
                    break;
            }
            if(talkOrder){
                orderStr = '<span class="al-msg-you">'+talkerName+'</span>'+
                    '<span class="al-msg-to">对</span>'+
                    '                        <span class="al-msg-my">'+teacherName+'</span>';
            }else{
                orderStr = '                        <span class="al-msg-my">'+talkerName+'</span>'+
                    '                        <span class="al-msg-to">对</span>'+
                    '                        <span class="al-msg-you">'+teacherName+'</span>';
            }

            var itemStr = '<li class="al-msg-item '+itemClassName+'"><!--只有我说：al-single-me-->'+
                '                      <div class="al-msg-user">'+
                orderStr+
                '                        <span>:</span>'+
                '                      </div>'+
                '                      <div class="al-msg-content">'+t.methods.analysisMsg(msgContent) +'</div>'+
                '                      <div class="al-msg-time '+timeClass+'">'+time+'</div>'+
                '              </li>';
            return itemStr;
        },
        receiveMsg: function () {
            //不管是回播还是直播都播放数据
            var t = ccChat;
            var msgAppend = function (m) {
                var data = JSON.parse(m);
                t.element.msgContainer.append(t.methods.templateMsgItem(data));
                $(".chat-cnt").animate({scrollTop: '1000000px'}, 400);
            };
            var  talkUserId =$("#sesCustomerId").val();
            if (t.data.backOnOff) {
                window.on_cc_live_chat_msg_sync = function (msg) {
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        if(item.userRole=='publisher'){
                            item.msgType = 2;
                        }else if(item.userRole==='teacher'){
                            item.msgType = 5;
                        }else{
                            if(item.userId==talkUserId){
                                item.msgType = 0;
                            }else{
                                item.msgType = 1;
                            }
                        }

                        msgAppend(JSON.stringify(item));
                    }

                };
                window.on_cc_live_qa_question = function (msg) {
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        item.msg = item.content;
                        item.msgType = 3;
                        msgAppend(JSON.stringify(item));
                    }
                };
                window.on_cc_live_qa_answer = function(msg){
                    for (var num = 0; num < msg.length; num++) {
                        var item = msg[num];
                        item.msg = item.content;
                        item.msgType = 4;
                        msgAppend(JSON.stringify(item));
                    }
                }
            } else {

                DWLive.onPublicChatMessage = function (msg) {
                    ////console.log(msg);
                    //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
                    var resourceMsg = JSON.parse(msg);
                    // ////console.log(resourceMsg);
                    if(resourceMsg.userrole==='publisher'||resourceMsg.userrole==='host'){
                        resourceMsg.msgType = 2;
                    }else if(resourceMsg.userrole==='teacher'){
                        resourceMsg.msgType = 5;
                    }else{
                        if(resourceMsg.userid==talkUserId){
                            resourceMsg.msgType = 0;
                        }else{
                            resourceMsg.msgType = 1;
                        }
                    }
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);

                };

                DWLive.onPrivateAnswer = function (msg) {
                    var resourceMsg = JSON.parse(msg);
                    // ////console.log(resourceMsg);
                    resourceMsg.msgType = 4;
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);
                };
                DWLive.onPrivateChatMessage = function (msg) {
                    var resourceMsg = JSON.parse(msg);
                    // ////console.log(resourceMsg);
                    resourceMsg.msgType = 3;
                    var msgContent = JSON.stringify(resourceMsg);
                    msgAppend(msgContent);
                };
            }

            return t;
        },
        filterHtml: function (str) {
            //过滤发送的消息
            var reTag = /<img(?:.|\s)*?>/g;
            var machResult = str.match(reTag);
            var lastResult = {};
            var contentPara = [];
            if (machResult) {
                for (var num = 0; num < machResult.length; num++) {
                    var l = machResult[num];
                    var r = RegExp(l ,"g");
                    str = str.replace(r, "$" + l + '$');
                }
                var arr = (str.replace(/\$+/g, "$")).split("$");
                for (var innerNum = 0; innerNum < arr.length; innerNum++) {
                    if (arr[innerNum].indexOf("img") > -1) {
                        contentPara.push($(arr[innerNum]).attr("src"));
                    } else {
                        var item = $('<p>' + arr[innerNum] + '</p>').text();
                        if (item.length) {
                            contentPara.push(item);
                        }

                    }
                }
                lastResult = {
                    type: 1,
                    contentData: contentPara
                }

            } else {
                lastResult = {
                    type: 0,
                    contentData: [str]
                };
            }
            var lastResultStr = '';
            $.each(lastResult.contentData, function (i, v) {
                if ((v.indexOf("img") > -1) || (v.indexOf("gif") > -1) || (v.indexOf("png") > -1) || (v.indexOf("jpg") > -1) || (v.indexOf("jpeg") > -1)) {
                    var num = v.substring(v.lastIndexOf("/") + 1, v.lastIndexOf("."))
                    if (v.indexOf("gif") > -1) {

                        lastResultStr += '[em_' + num + ']';
                    } else {
                        lastResultStr += '[em2_' + num + ']';
                    }

                } else {
                    lastResultStr += v;
                }
            });
            return lastResultStr;
        },
        init: function () {
            //初始化聊天逻辑
            var t = ccChat;
            t.methods.receiveMsg();
            if(t.data.backOnOff){
                return false
            }else{
                DWLive.onOnlineTeachers = function (data) {//获取讲师列表
                    var myTemplate = Handlebars.compile($("#al-tpl-teachers").html());
                    var template = '<li style="font-weight: bold" class="all-people" data-role="0"><a href="javascript:;">所有人</a></li>';
                    t.element.teacherBox.find('ul').html(template + myTemplate(data));
                    t.methods.toggleTeacherList();
                };
                t.methods.editInit();
                t.methods.hideOtherPanel();
                t.methods.phizInit();
                t.methods.emotionInit();
                t.methods.sendMsg();
            }
        }
    }
};

