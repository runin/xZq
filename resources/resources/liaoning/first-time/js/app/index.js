/**
 * 第一时间--首页
 */
(function($){
    H.index = {
        init: function(){
            this.dom_resize();
            this.event();
            this.jump();
            this.rule();
        },
        dom_resize: function(){
            $('section.index').css('height',$(window).height());
            $('section.guid').css('height',$(window).height());
        },
        rule: function(){
            getResult('api/common/rule', {}, 'commonApiRuleHandler', true);
        },
        ple_animate: function(){
          $('.index-log').removeClass('none').addClass('fadeInDown');
          $('.arc-bg').removeClass('none').addClass('zoomIn');
          $('.arc').removeClass('none');
          $('header a').removeClass('none').addClass('animated zoom-in');
          $('footer a.new').removeClass('none').addClass('fadeInLeft');
          $('footer a.answer').removeClass('none').addClass('fadeInRight');
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.index;
            $(document).one("touchstart", function() {
                $('.guid').addClass('shade');
                setTimeout(function(){
                    $('.guid').addClass('none');
                    me.ple_animate();
                },1100);
                recordUserOperate(openid, "第一时间", "first-time");
                recordUserPage(openid, "第一时间", 0);
            });
            $('.user').click(function(e){
                e.preventDefault();
                $(this).removeClass('animated zoom-in');
                me.btn_animate($(this));
                toUrl('user.html');
            });
            $('.new').click(function(e){
                e.preventDefault();
                $(this).removeClass('fadeInLeft');
                me.btn_animate($(this));
                toUrl('comments.html');
            });
            $('.answer').click(function(e){
                e.preventDefault();
                $(this).removeClass('fadeInRight');
                me.btn_animate($(this));
                toUrl('answer.html');
            });
            $(".rule-open").click(function(e){
                e.preventDefault();
                $(this).removeClass('animated zoom-in');
                me.btn_animate($(this));
                $('.rule-first').removeClass('bounceOutUp').addClass('bounceInDown');
                $('.rule-section').removeClass('none');

            });
            $(".rule-close").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));

                $('.rule-first').removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    $('.rule-section').addClass('none');
                },1300);
            });
        }
    };
    W.commonApiPromotionHandler = function(data){
        var me = H.index;
        if(data.code == 0){
            if(data.url && data.desc){
                $('.outer').text(data.desc).attr('href', (data.url || '')).removeClass('none');
            }
        }
    };
    W.commonApiRuleHandler = function(data) {
        if (data.code == 0) {
            $('.con-htm').html(data.rule);
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});