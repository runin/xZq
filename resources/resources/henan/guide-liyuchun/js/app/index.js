var scale;
var autoScale = function() {
    var page = $(".page"),
        ratio = 1334/750,
        winW = document.documentElement.clientWidth,
        winH = document.documentElement.clientHeight,
        ratio2 = winW/winH;
        if (ratio < ratio2) {
            scale = (winH/750).toString().substring(0, 6);
        } else {
            scale = (winW/750).toString().substring(0, 6);
        }
    var css = '-webkit-transform: scale('+ scale +'); -webkit-transform-origin:top;transform: scale('+ scale +'); transform-origin:top;';
    page.each(function(e){
        $(this).attr('style', css);
    });
    $('.scroll').css('height', ($(window).height() - $('.ime').height())/scale);
};
setTimeout(function() {
    if (document.documentElement.clientWidth/document.documentElement.clientHeight !== 1334/750) autoScale();
}, 300);
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", autoScale , false);

$(function() {
    autoScale();
    $('#add, .page1').addClass('show');

    $('#add button').bind('touchstart',function(event){
        event.preventDefault();
        $(this).addClass('hover');
    });

    $('#add button').bind('touchend',function(event){
        event.preventDefault();
        if (!openid) return;
        $(this).removeClass('hover');
        $('#add, .page1').addClass('hide');
        $('#apply, .page2').addClass('show');
        fillUser();
    });

    $('#apply button').bind('touchstart',function(event){
        event.preventDefault();
        $(this).addClass('hover');
    });

    $('#apply button').bind('touchend',function(event){
        event.preventDefault();
        sound('add');
        $(this).removeClass('hover');
        $('#apply, .page2').addClass('hide');
        $('#chat, .page3').addClass('show');
        $('.ime').css('opacity', '1');
        $('.scroll').css('height', ($(window).height() - $('.ime').height())/scale);
        fillUser();
        setTimeout(function(){
            $('#chat .list li').eq(0).show();
            setTimeout(function(){
                $('.select1').show();
                resizeScroll();
            }, 500);
        }, 500);
    });

    $('.select p').bind('touchstart',function(event){
        event.preventDefault();
        $(this).addClass('hover');
    });

    $('.select1 p').bind('touchend',function(event){
        event.preventDefault();
        sound('send');
        modeChange('on');
        $('.select1').hide();
        resizeScroll()
        $('#chat .list').append('<li class="user animated fadeIn"><img src="' + (headimgurl || 'images/head-shadow.png') + '" class="head"><div class="detail"><p>' + $(this).html() + '</p></div></li><li class="animated fadeIn"><img src="images/head-liyuchun.jpg" class="head"><div class="detail"><p>' + $(this).attr('data') + '</p></div></li>');
        
        $('#chat .list li').eq(1).show();
        $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
        setTimeout(function(){
            sound('recive');
            modeChange();
            $('#chat .list li').eq(2).show();
            $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
            setTimeout(function(){
                $('.select2').show();
                resizeScroll()
            }, 500);
        }, 2e3);
    });

    $('.select2 p').bind('touchend',function(event){
        event.preventDefault();
        sound('send');
        modeChange('on');
        $('.select2').hide();
        resizeScroll()
        var data = $(this).attr('data').split(';'), t = '';
        t = '<li class="user animated fadeIn"><img src="' + (headimgurl || 'images/head-shadow.png') + '" class="head"><div class="detail"><p>' + $(this).html() + '</p></div></li>';
        for (var i = 0; i < data.length; i++) {
            t += '<li class="animated fadeIn"><img src="images/head-liyuchun.jpg" class="head"><div class="detail"><p>' + data[i] + '</p></div></li>';
        };
        t += '<li class="animated fadeIn"><img src="images/head-liyuchun.jpg" class="head"><div class="detail"><p>我为你准备了下月演唱会的门票，一定要来</p></div></li>';
        $('#chat .list').append(t);

        $('#chat .list li').eq(3).show();
        $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
        setTimeout(function(){
            sound('recive');
            modeChange();
            setTimeout(function(){modeChange('on');}, 500);
            $('#chat .list li').eq(4).show();
            $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
            setTimeout(function(){
                sound('recive');
                modeChange();
                setTimeout(function(){modeChange('on');}, 500);
                $('#chat .list li').eq(5).show();
                $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
                setTimeout(function(){
                    sound('recive');
                    modeChange();
                    $('#chat .list li').eq(6).show();
                    $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
                    setTimeout(function(){
                        $('.select3').show();
                        resizeScroll()
                    }, 500);
                }, 2e3);
            }, 2e3);
        }, 2e3);
    });

    $('.select3 p').bind('touchend',function(event){
        event.preventDefault();
        sound('send');
        modeChange('on');
        $('.select3').hide();
        resizeScroll()
        $('#chat .list').append('<li class="user animated fadeIn"><img src="' + (headimgurl || 'images/head-shadow.png') + '" class="head"><div class="detail"><p>一定的！</p></div></li><li class="animated fadeIn"><img src="images/head-liyuchun.jpg" class="head"><div class="detail"><div class="card" data-url="https://statics.holdfun.cn/fandom/fenyou_v2/index.html?from=share&pay=true#!/zhongchou/landing/b23b73b34f00461fa510568903603b8f"><h5>【线上直播众筹】in-Music群星盛典</h5><h6><span>一大波玉米在路上</span><img src="images/share.jpg"></h6></div></div></li>');
        bindCard();

        $('#chat .list li').eq(7).show();
        $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
        setTimeout(function(){
            sound('recive');
            modeChange();
            $('#chat .list li').eq(8).show();
            $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
        }, 2e3);
    });
});

function fillUser() {
    $('#apply p span').html(nickname);
    $('#chat .list li .detail p span').html(nickname);
    if (headimgurl) $('#chat .list li.user img.head').attr({'src':headimgurl});
};

function sound(flag) {
    if (!flag) return;
    $('#audio-' + flag)[0].pause();
    $('#audio-' + flag)[0].currentTime = 0;
    $('#audio-' + flag)[0].play();
};

function bindCard() {
    $('.card').bind('touchstart',function(event){
        event.preventDefault();
        $(this).addClass('hover');
    });
    $('.card').bind('touchend',function(event){
        event.preventDefault();
        location.href = $(this).attr('data-url');
    });
};

function modeChange(flag) {
    if (flag == 'on') {
        document.title = '对方正在输入...';
    } else {
        document.title = wTitle;
    }

    var $iframe = $('<iframe src="images/hm.png" class="preload"></iframe>');
    $iframe.on('load',function() {
        setTimeout(function() {
            $iframe.off('load').remove();
        }, 0);
    }).appendTo($('body'));
};

function resizeScroll() {
    $('.scroll').css('height', ($(window).height() - $('.ime').height())/scale);
    $('#chat .scroll').scrollTop( $('#chat .scroll')[0].scrollHeight );
};