/**
 * Created by ALLIN on 2016/12/2.
 */
/**
 * Created by ALLIN on 2016/11/28.
 */
var creatCarousel2 = {};
$(document).ready(function(){
    var nowIndexNum2 = location.search.split('?')[1];
    var picData = sessionStorage.getItem("picUrl");//取回picUrl变量
    var data = JSON.parse(picData);
    creatCarousel2 = {
        creatHtml: function(data) {
            creatCarousel2.swiper();
            creatCarousel2.elseClick();
            creatCarousel2.creatSwitch(data);
        },
        swiper: function() {
            var windowHeight = $(window).height() - 293;
            //$('.swiper-container').height("auto");
            $('.swiper-wrapper img').css("max-height","none");
            $('.swiper-wrapper img').css("max-width","none");
            //$('.swiper-wrapper img').width(700);
            //$('.swiper-container').width(700);
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.al-quesPagination',
                paginationClickable: true,
                loop: true,
                noSwiping: true
            });
        },
        creatSwitch: function(data){
            for(var i = 0; i < data.length; i++){
                if(i == 0) {
                    var span = $("<span class='swiper-pagination-switch swiper-visible-switch swiper-active-switch'><img/></span>");
                    $(".al-quesPagination").append(span);
                } else {
                    var span = $("<span class='swiper-pagination-switch swiper-visible-switch'><img/></span>");
                    $(".al-quesPagination").append(span);
                }
                span.find('img').attr('src', data[i].src);
            }
            creatCarousel2.rightAddClass(nowIndexNum2, data);
            creatCarousel2.leftAddClass(nowIndexNum2, data);
            creatCarousel2.bigImg(nowIndexNum2 - 1, data);
            creatCarousel2.moveImg(nowIndexNum2, data.length);
            creatCarousel2.viewMoveImg(nowIndexNum2, data.length);
            $('.al-arrow-left').on('click', function(){
                creatCarousel2.leftClick(data);
            });
            $('.al-arrow-right').on('click', function(){
                creatCarousel2.rightClick(data);
            });
            $(".swiper-pagination-switch").unbind("click").bind("click", function(){
                nowIndexNum2 = $(this).index() + 1;
                creatCarousel2.moveImg(nowIndexNum2,data.length);
                for(var i = 0; i < data.length; i++){
                    $('.swiper-pagination-switch').removeClass('swiper-active-switch');
                }
                $(this).addClass('swiper-active-switch');
                creatCarousel2.viewMoveImg(nowIndexNum2, data.length);
                creatCarousel2.bigImg(nowIndexNum2 - 1, data);
            });
            $('.al-top_left').on('click', function(){
                creatCarousel2.leftClick(data);
            });
            $('.al-top_right').on('click', function(){
                creatCarousel2.rightClick(data);
            });
            //$('.swiper-pagination-switch').eq(data.length - 1).css({
            //    position: "absolute",
            //    bottom: '-70px',
            //    zIndex: 30,
            //});
        },
        elseClick: function(){
            $(".swiper-container").mouseover(function(){
                $(".al-arrow-left").css("display", 'block');
                $(".al-arrow-right").css("display", 'block');
            });
            $(".swiper-container").mouseout(function(){
                $(".al-arrow-left").css("display", 'none');
                $(".al-arrow-right").css("display", 'none');
            })
        },
        bigImg: function(index, data){
            $('.swiper-wrapper img').attr('src', data[index].src);
        },
        moveImg: function (index,len){
            if(index > 6&&index<len){
                $(".al-quesPagination").css({
                    left: -105 * (index - 6),
                    transition: "all 1s"
                })
            }else if(index==len){
                $(".al-quesPagination").css({
                    left: 50,
                    transition: "all 1s"
                })
            } else {
                $(".al-quesPagination").css({
                    left: 50,
                    transition: "all 1s"
                })
            }
        },
        viewMoveImg: function(index, len){
            if(index == len - 1 || index == len){
                $('.swiper-pagination-switch').eq(len - 1).css({
                    left: 0
                });
                index = 0;
            } else {
                $('.swiper-pagination-switch').eq(len - 1).css({
                    left: (index - 1) * 105 + 125
                })
            }
        },
        leftAddClass: function(index, data){
            index--;
            for(var i = 0; i < data.length; i++){
                $('.swiper-pagination-switch').removeClass('swiper-active-switch');
            }
            $('.swiper-pagination-switch').eq(index).addClass("swiper-active-switch");
        },
        rightAddClass: function(index, data){
            for(var i = 0; i < data.length; i++){
                $('.swiper-pagination-switch').removeClass('swiper-active-switch');
            }
            $('.swiper-pagination-switch').eq(index - 1).addClass("swiper-active-switch");
        },
        leftClick: function(data){
            nowIndexNum2 = $(".swiper-active-switch").index() + 1;
            nowIndexNum2--;
            if(nowIndexNum2 > 0){
                // nowIndexNum=data.length;
                creatCarousel2.leftAddClass(nowIndexNum2, data);
                creatCarousel2.moveImg(nowIndexNum2,data.length);
                creatCarousel2.viewMoveImg(nowIndexNum2, data.length);
                creatCarousel2.bigImg(nowIndexNum2 - 1, data);
            }
        },
        rightClick: function(data){
            nowIndexNum2 = $(".swiper-active-switch").index() + 1;
            nowIndexNum2++;
            if(nowIndexNum2 <= data.length){
                // nowIndexNum=1;
                creatCarousel2.rightAddClass(nowIndexNum2, data);
                creatCarousel2.moveImg(nowIndexNum2,data.length);
                creatCarousel2.viewMoveImg(nowIndexNum2, data.length);
                creatCarousel2.bigImg(nowIndexNum2 - 1, data);
            }
        }
    };
    creatCarousel2.creatHtml(data);
});