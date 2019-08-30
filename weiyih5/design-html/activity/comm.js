/**
 * Created by Yangmiaomiao on 2017/6/29.
 */
$(function(){
    $('.screenList li').attr('data-flag','0')
    $('.screenList li').on('click',function(){
        if($(this).attr('data-flag') == 0){
            $(this).addClass('active');
            $(this).children('.menuSecond').show()
            $(this).attr('data-flag','1')
            $(this).siblings().attr('data-flag','0');
            $(this).siblings().children('.menuSecond').hide()
            $(this).siblings().removeClass('active');
        }else{
            $(this).removeClass('active');
            $(this).children('.menuSecond').hide()
            $(this).attr('data-flag','0')
        }
    })

    $('.menuSecond div').attr('data-flag','0')
    $('.menuSecond div').on('click',function(e){
        if($(this).attr('data-flag') == 0){
            $(this).addClass('active');
            $(this).children('.menuThird').show()
            $(this).attr('data-flag','1')
            $(this).siblings().attr('data-flag','0');
            $(this).siblings().children('.menuThird').hide()
            $(this).siblings().removeClass('active');
            $(this).find('p').eq(0).find('b').addClass('not')
        }else{
            $(this).removeClass('active');
            $(this).children('.menuThird').hide()
            $(this).attr('data-flag','0')
            $(this).find('p').eq(0).find('b').removeClass('not')
        }
        e.stopPropagation();
    })
    /*var dataFlag = 0;
     $('.menuThird p').on('click',function(){
     if(dataFlag == 0){
     $(this).children('b').addClass('onclick');
     dataFlag = 1;
     }else{
     $(this).children('b').removeClass('onclick');
     dataFlag = 0
     }

     })*/
    /*$('.menuThird p').attr('data-flag','0')
     $('.menuThird p').on('click',function(e){
     if($(this).attr('data-flag')==0){
     $(this).children('b').addClass('onclick');
     $(this).attr('data-flag','1')
     $(this).siblings().attr('data-flag','0');
     //$(this).siblings().children('b').hide()
     $(this).siblings().removeClass('onclick');
     }else{
     $(this).children('b').removeClass('onclick');
     $(this).attr('data-flag','0')
     }
     e.stopPropagation();
     })*/

    $('.menuThird p').on('click',function(e){

        if($(this).find('b').hasClass('onclick')){
            $(this).children('b').removeClass('onclick');
        }else{
            $(this).children('b').addClass('onclick');
        }
        if($(this).index() == 0  ){
            if($(this).find('b').hasClass('onclick')){
                $(this).nextAll().find('b').addClass('onclick')
            }else{
                $(this).nextAll().find('b').removeClass('onclick')
            }
        }

        var actualLen = $(this).parent().find('p').length - 1;
        var clickLen = $(this).parent().find('.onclick:not(.not)').length;
        if(actualLen == clickLen){
            $(this).parent().find('p').eq(0).find('b').addClass('onclick')
        }else{
            $(this).parent().find('p').eq(0).find('b').removeClass('onclick')
        }
    })
})