/**
 * Created by Chris on 2016/4/21.
 */
var __ns = function( fullNs ) {
    var nsArray = fullNs.split( '.' );
    var evalStr = '';
    var ns = '';
    for ( var i = 0, l = nsArray.length; i < l; i++ ) {
        i !== 0 && ( ns += '.' );
        ns += nsArray[i];
        evalStr += '( typeof ' + ns + ' === "undefined" && (' + ns + ' = {}) );';
    }
    evalStr !== '' && eval( evalStr );
};
var W = W || window;
__ns('H');
(function($) {
    H.yaotv = {
        aniTrue:true,
        init: function(){
            var me = this;
            me.event();
            me.initDev();
            // me.swiper();
        },
        swiper: function(){
            var swiper = new Swiper('.swiper-container', {
                lazyLoading : true,
                lazyLoadingOnTransitionStart : true,
                pagination: '.swiper-pagination',
                grabCursor: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            });
        },
        initDev: function () {
            $.ajax({
                type : 'GET',
                async : false,
                url : 'http://test.holdfun.cn/portal/api/common/test',
                data: {
                    serviceNo:"tv_jxll_home",
                    tvStationUuid: '53dc672b238b4ed2bc3a2f6245882a15',
                    tvChannelUuid: "50daf4ba0679424baf8311759a3e9fc9",
                    dev:"home"
                },
                dataType : "jsonp",
                jsonp : 'callback',
                complete: function() {
                },
                success : function() {
                }
            });
        },
        event: function(){
            var me = this;
            $(".sense-dh .item-s").hover(function(){
                $(this).addClass("sense-hover");
            },function(){
                $(this).removeClass("sense-hover");
            });
            $(".t2o-dh .item-s").hover(function(){
                $(this).addClass("t2o-hover");
                $(this).find(".list-b").addClass("none");
            },function(){
                $(this).removeClass("t2o-hover");
                $(this).find(".list-b").removeClass("none");
            });
            $(".ni").click(function(){
                $(".ni").removeClass("selected");
                $(this).addClass("selected");
                var target = $(this).attr("data-target");
                $(".di").addClass("none");
                $("#"+target).removeClass("none")
            });
            $(".clickable").click(function(){
                if($(".dialog").hasClass("none"))
                $(".dialog").removeClass("none");
            });
            $(".close").click(function(){
                if(!$(".dialog").hasClass("none"))
                    $(".dialog").addClass("none");
            });
            $("#submit-btn").click(function(){
                if(me.check()){
                    var name = $("#name").val(),tel = $("#tel").val(),email = $("#email").val(),qq = $("#qq").val(),comp = $("#comp").val();
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : 'http://test.holdfun.cn/portal/api/entryinfo/save' + '?dev=home',
                        data: {
                            openid:"1",
                            phone: tel?tel:"",
                            name: name?encodeURIComponent(name):"",
                            profession:email?email:"",
                            address:qq?qq:"",
                            remark:comp?encodeURIComponent(comp):""
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackActiveEntryInfoSaveHandler',
                        complete: function() {
                        },
                        success : function(data) {
                        }
                    });
                    $("#submit-btn").addClass("none");
                    me.showTips("提交成功");
                    $(".dialog").addClass("none");
                }
            });
            $(".qrcode").click(function(){
                var img = $(this).attr("data-qrcode");
                if($(".qrcode-dialog").hasClass("none")){
                    $(".qrcode-img").attr("src","img/"+img);
                    $(".qrcode-dialog").removeClass("none");
                }
            });
            $(".qrcode-close").click(function(){
                if(!$(".qrcode-dialog").hasClass("none"))
                    $(".qrcode-dialog").addClass("none");
            });
            $(".user ul li div.normal").hover(function(){
                $(this).addClass("none");
                $(this).next().removeClass("none");
            },function(){});

            $(".user ul li div.hover").hover(function(){},function(){
                $(this).addClass("none");
                $(this).prev().removeClass("none");
            });
        },
        check:function(){
            var name = $("#name").val(),tel = $("#tel").val(),email = $("#email").val(),qq = $("#qq").val(),me = this;
            if(!name){
                me.showTips("请输入您的姓名");
                return false;
            }
            var vtel = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(tel);
            if(!tel || !vtel){
                me.showTips("请正确输入您的手机号");
                return false;
            }
            var vemail = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(email);
            if(email && !vemail){
                me.showTips("请正确输入您的邮箱");
                return false;
            }
            var vqq = RegExp(/^[1-9][0-9]{4,9}$/).test(qq);
            if(qq && !vqq){
                me.showTips("请正确输入您的QQ");
                return false;
            }
            return true;
        },
        showTips:function(word, pos, timer) {
            var me = this;
            if (me.aniTrue) {
                me.aniTrue = false;
                var pos = pos || '3.8', timer = timer || 1200;
                $('body').append('<div class="tips none"></div>');
                $('.tips').css({
                    'position': 'fixed' ,
                    'max-width': '80%' ,
                    'top': '60%' ,
                    'left': '50%' ,
                    'z-index': '999999999999' ,
                    'color': 'rgb(255, 255, 255)' ,
                    'padding': '12px 15px' ,
                    'font-size': '16px',
                    'border-radius': '3px' ,
                    'margin-left': '-120px' ,
                    'background': 'rgba(0, 0, 0, 0.7)' ,
                    'text-align': 'center'
                });
                $('.tips').html(word);
                var winW = $(window).width(), winH = $(window).height();
                $('.tips').removeClass('none').css('opacity', '0');
                var tipsW = $('.tips').width(), tipsH = $('.tips').height();
                $('.tips').css({'margin-left': -tipsW/2, '-webkit-transform': "translateY(" + (tipsH - winH)/(pos - 0.8) + "px)"}).removeClass('none');
                $('.tips').animate({'opacity': '1', '-webkit-transform': "translateY(" + (tipsH - winH)/pos + "px)"}, 300, function() {
                    setTimeout(function() {
                        $('.tips').animate({'opacity':'0'}, 200, function() {
                            $('.tips').addClass('none').css('-webkit-transform', "translateY(" + (tipsH - winH)/(pos - 0.8) + "px)");
                        });
                    }, timer);
                    setTimeout(function() {
                        $('.tips').remove();
                        me.aniTrue = true;
                    }, timer + 400);
                });
            };
        }
    };
})(jQuery);
$(function () {
    H.yaotv.init();
});