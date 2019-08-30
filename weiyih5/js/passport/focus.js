$(function(){
   $("#expertList li").on("vclick",function(){
      $(this).toggleClass("selected");
   });

    $("#expertList li").height( $("#expertList li:eq(0)").width());


});