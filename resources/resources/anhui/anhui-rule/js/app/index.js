(function($) {
   H.index = {
        init: function () {
            var me = this;
            me.TSystem();
        },
       TSystem: function() {
           var startPosition, endPosition, moveLength, targetLength = 30,
               el = document.querySelector('.btn-join');
           el.addEventListener('touchstart', function (e) {
               e.preventDefault();
               var touch = e.touches[0];
               startPosition = {
                   x: touch.pageX,
                   y: touch.pageY
               }
           });
           el.addEventListener('touchmove', function (e) {
               e.preventDefault();
               var touch = e.touches[0];
               endPosition = {
                   x: touch.pageX,
                   y: touch.pageY
               };
               moveLength = endPosition.y - startPosition.y;
               if (moveLength >= 0) {
                   $('.btn-join').css('-webkit-transform', 'translateY(' + moveLength/2 + 'px)');
               };
           });
           el.addEventListener('touchend', function (e) {
               e.preventDefault();
               if (moveLength/2 < targetLength) {
                   $('.btn-join').animate({'-webkit-transform' : 'translateY(0)'}, 200);
               } else {
                   toUrl('barrage.html');
                   $('.btn-join').animate({'-webkit-transform' : 'translateY(0)'}, 200);
               }
           });
           $(".btn-play").click(function(e){
               e.preventDefault();
               $('body').addClass('touch-none');
               toUrl('barrage.html');
           });
       }
   }
})(Zepto);
$(function () {
    var hei = $(window).height();
    $("body").css("height",hei+"px");
   H.index.init();
});
