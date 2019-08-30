/**
 * Created by Yangmiaomiao on 2017/6/29.
 */
$(function(){
    //资源列表获取数据
    var resourcesList = function(){
        //console.log(1225)
        $.ajax({
            url : 'resources.json',
            type : "get",
            data : {},
            async : false,
            time : 5000,
            success : function(req){
                //console.log(req)
                var dataList = req.responseObject.responseData.data_list;
                var num = '';
                $.each(dataList,function(i,v){
                    //console.log(i,v)

                    var listTitle = v.listTitle;
                    if(listTitle.length > 20){
                        listTitle = listTitle.substring(0,20)+ '...'
                    }

                    var resText = v.listText;
                    if(resText.length > 55){
                        resText = resText.substring(0,55)+ '...'
                    }

                    num += '<li>'+
                    '                    <aside class="resourseText">'+
                    '                        <a><span>'+listTitle+'</span><i class="resPraise"><b></b>已赞</i></a>'+
                    '                        <p class="resTextCont">'+resText+'</p>'+
                    '                        <aside class="contentOtherMsg">'+
                    '                            <span class="recourseType">'+v.resType+'</span>'+
                    '                            <span class="al-contentAuthorBox"><i class="al-contentAuthor"></i>'+v.author+'</span>'+
                    '                            <span><i class="al-contentWatchedNum"></i>'+v.view+'</span>'+
                    '                            <span><i class="commentNum"></i>'+v.comments+'</span>'+
                    '                            <span class="recourseTime">'+v.time+'</span>'+
                    '                        </aside>'+
                    '                    </aside>'+
                    '                    <aside class="resourseImg">'+
                    '                        <a target="_blank">'+
                    '                            <img src="'+v.imgUrl+'" alt="">'+
                    '                            <i class="al-contentVideoBtn">'+
                    '                                <img src="/images/img10/v3/common/icon/video_btn.png" alt="">'+
                    '                            </i>'+
                    '                            <i class="al-contentVideoTime">'+v.videoTime+'</i>'+
                    '                        </a>'+
                    '                    </aside>'+
                    '                </li>';;

                })
                //console.log(num)
                $('.resourseList').html(num)
                priseOnclick();
            },
            error : function(){}
        });
    }



//点击最后一层筛选
    var menuFour = function () {
        $('.menuThird p').off("click").on('click', function (e) {
            var t = $(this);

            if(t.hasClass('active')){
                t.removeClass('active')
            }else{
                t.addClass('active')
                t.siblings().removeClass('active')
            }
            e.stopPropagation()

console.log(123)
            resourcesList()

            /*var sjLen = t.parent().find('p').length-1;
            var dqLen = t.parent().find('.active:not(.not)').length;
            console.log(sjLen,dqLen)
            if(sjLen == dqLen){
                t.parent().find('p').eq(0).addClass('active')
            }else{
                t.parent().find('p').eq(0).removeClass('active')
            }*/

        })
    }
//点击第三层筛选
    var menuThird = function(){
        $('.menuSecond div').on('click',function(e){
            e.stopPropagation()
            var t = $(this);
            $.ajax({
                url : 'menuThird.json',
                type : "get",
                data : {},
                async : false,
                time : 5000,
                success : function(req){
                    //console.log(req)
                    var dataListSecond = req.responseObject.responseData.data_list;
                    var str = '';

                    $.each(dataListSecond,function(i,v){
                        //console.log(i,v)
                        str += '<p>'+ v.listName+'<span>（'+ v.num+'）</span></p>';

                    })

                    if(t.find('.menuThird').length == 0){
                        t.append('<aside class="menuThird"><p>全部</p>' + str + '</aside>')
                    }
                    //console.log(str)
                    if(t.hasClass('active')){
                        t.removeClass('active')
                        t.find('.menuThird').hide()
                        t.find('p').eq(0).removeClass('not')
                    }else{
                        t.find('.menuThird').show()
                        t.addClass('active')
                        //console.log(t.siblings())
                        t.siblings().removeClass('active').children('.menuThird').hide()
                        t.find('p').eq(0).addClass('not')
                    }
                    menuFour();



                },
                error : function(){}
            });
            return false;
        })
    }

    //点击第一层筛选
    var openLi = function(){
        $('.screenList li').on('click',function(e){
            e.stopPropagation()
            var t = $(this);
                $.ajax({
                    url : 'menuSecond.json',
                    type : "get",
                    data : {},
                    async : false,
                    time : 5000,
                    success : function(req){
                        //console.log(req)
                        var dataListSecond = req.responseObject.responseData.data_list;
                        var str = '';

                        $.each(dataListSecond,function(i,v){
                            //console.log(i,v)
                            str += '<div>'+ v.listName+'<span>（'+ v.num +'）</span><i></i></div>';;

                        })
                        //console.log(t)
                        if(t.find('.menuSecond').length == 0){
                            t.append('<aside class="menuSecond"><div>全部</div>' + str + '</aside>')
                        }

                        if(t.find('.menuFirst').hasClass('active')){
                            t.find('.menuFirst').removeClass('active').next().hide()
                        }else{
                            t.find('.menuSecond').show()
                            t.find('.menuFirst').addClass('active')
                            t.siblings().find('.menuFirst').removeClass('active').next().hide()
                        }
                        menuThird()

                    },
                    error : function(){}
                });
        })

    }



    //第一层筛选的数据加载
    $.ajax({
        url : 'data.json',
        type : "get",
        data : {},
        async : false,
        time : 5000,
        success : function(req){
            //console.log(req)
            var dataList = req.responseObject.responseData.data_list;
            var num = '';
            var sumNum = 0;
            $.each(dataList,function(i,v){
                //console.log(i,v)
                sumNum += parseInt(v.num)
                num += '<li>'+
                '                    <div class="menuFirst">'+ v.listName+'<span>（'+ v.num +'）</span><i></i></div>'+
                '                </li>';

            })
            //console.log(num)
            $('.screenList').html('<li><div class="menuFirst">全部<span>（'+sumNum+'）</span></div></li>' + num)
            openLi();
        },
        error : function(){}
    });



    //点赞按钮的状态切换
    var priseOnclick = function(){
        $('.resPraise').on('click',function(){
            var t = $(this);
            if(t.hasClass('onclick')){

                t.removeClass('onclick').html('<b></b>'+'点赞')
            }else{

                t.addClass('onclick').html('<b></b>'+'已赞')
            }
        })
    }




    resourcesList();

})