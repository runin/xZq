/**
 * Created by shang on 2015/5/4.
 */

$(function() {
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
var __noop = function() {};
var W = W || window;
__ns('H');

var simpleTpl = function( tpl ) {
    tpl = $.isArray( tpl ) ? tpl.join( '' ) : (tpl || '');

    return {
        store: tpl,
        _: function() {
            var me = this;
            $.each( arguments, function( index, value ) {
                me.store += value;
            } );
            return this;
        },
        toString: function() {
            return this.store;
        }
    };
};

    H.index = {
        init : function() {
            var me = this;
            me.showLoading();
            //存储图片链接信息的关联数组
            var sources = {
                bg1 : "images/bg1.jpg",
                bg1_logo : "images/bg1-logo.png",
                bg1_logo1 : "images/bg1-logo1.png"
            };

            //调用图片预加载函数，实现回调函数
            me.loadImages(sources, function(images){
                me.hideLoading();
                me.fill();
            });
            me.audio();
        },
        fill : function(){
            var me = this;
            me.target(1).show();
            me.target(1).find('img:first-child').addClass('anima');
            me.target(1).find('img:nth-child(2)').addClass('anima');
            me.target(1).find('div:last-child').addClass('anima');
            $('.pages').parallax({
                direction: 'vertical', 	// horizontal (水平翻页)
                swipeAnim: 'cover', 	// cover (切换效果)
                drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                loading:   false,		// 有无加载页
                indicator: false,		// 有无指示点
                arrow:     true,		// 有无指示箭头
                onchange: function(index, element, direction) {
                    var $target = $(element);
                    if (direction != 'stay') {
                        var $next = $('.page').eq(index + 1);
                        if ($next.length > 0) { me.add_animation($next); }
                        if($('.page').eq(14).hasClass('current')){
                            me.target(15).show();
                            me.target(15).addClass('anima');
                        }
                    }
                }
            });
        },
        loadImages : function(sources, callback){
            //实现一系列图片的预加载
            //参数sources:图片信息关联数组
            //参数callback:回调函数——图片预加载完成后立即执行此函数。
                var count = 0,
                    images ={},
                    imgNum = 0;
                for(src in sources){
                    imgNum++;
                }
                for(src in sources){
                    images[src] = new Image();
                    images[src].onload = function(){
                        if(++count >= imgNum){
                            callback(images);
                        }
                    }
                    images[src].src = sources[src];
                }
        },
        audio: function(){
            var $audio = $('#ui-audio').audio({
                auto: true,			// 是否自动播放，默认是true
                stopMode: 'pause',	// 停止模式是stop还是pause，默认stop
                audioUrl: './audio/tour.mp3',
                steams: ["<img src='./images/icon-musical-note.png' />", "<img src='./images/icon-musical-note.png' />"],
                steamHeight: 150,
                steamWidth: 44
            });
        },
        showLoading : function($container){
            var t = simpleTpl(),
                $container = $container || $('body'),
                $spinner = $container ? $container.find('.spinner') : $('body').children('.spinner');

            if ($spinner.length > 0) {
                $spinner.show();
            } else {
                t._('<div class="spinner">')
                    ._('<div class="spinner-wrapper">')
                    ._('<div class="spinner-container container1">')
                    ._('<div class="circle1"></div>')
                    ._('<div class="circle2"></div>')
                    ._('<div class="circle3"></div>')
                    ._('<div class="circle4"></div>')
                    ._('</div>')
                    ._('<div class="spinner-container container2">')
                    ._('<div class="circle1"></div>')
                    ._('<div class="circle2"></div>')
                    ._('<div class="circle3"></div>')
                    ._('<div class="circle4"></div>')
                    ._('</div>')
                    ._('<div class="spinner-container container3">')
                    ._('<div class="circle1"></div>')
                    ._('<div class="circle2"></div>')
                    ._('<div class="circle3"></div>')
                    ._('<div class="circle4"></div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</div>');

                var width = $(window).width(),
                    height = $(window).height(),
                    spinnerSize = 50;
                $spinner = $(t.toString()).css({'left': (width - spinnerSize) / 2, 'top': (height - spinnerSize) / 2});
                $container.append($spinner);
            }
        },
        hideLoading : function($container){
            if ($container) {
                $container.find('.spinner').hide();
            } else {
                $('body').children('.spinner').hide();
            }
        },
        target : function(index){
            return $target_index = $('.page'+ index +'-con');
        },
        add_animation : function(element) {
            var me = this, $target = $(element).attr('data-id')- 1;
            for(var i = 1; i < 16; i++){ $('.page'+ i +'-con').hide(); }
            //console.log('$target-data-id='+$target);
            switch ($target){
                case 1:
                    me.target(1).show();
                    me.target(1).find('img:first-child').addClass('anima');
                    me.target(1).find('img:nth-child(2)').addClass('anima');
                    me.target(1).find('div:last-child').addClass('anima');
                    break;
                case 2:
                    me.target(2).show();
                    me.target(2).find('h2').addClass('anima');
                    me.target(2).find('img').addClass('anima');
                    break;
                case 3:
                    me.target(3).show();
                    me.target(3).find('font').addClass('anima');
                    me.target(3).find('ul li:first-child').addClass('anima');
                    me.target(3).find('ul li:nth-child(2)').addClass('anima');
                    me.target(3).find('ul li:nth-child(3)').addClass('anima');
                    me.target(3).find('ul li:last-child').addClass('anima');
                    break;
                case 4:
                    me.target(4).show();
                    me.target(4).find('b').addClass('anima');
                    me.target(4).find('img').addClass('anima');
                    me.target(4).find('ul').addClass('anima');
                    break;
                case 5:
                    me.target(5).show();
                    me.target(5).find('b').addClass('anima');
                    me.target(5).find('img').addClass('anima');
                    me.target(5).find('ul').addClass('anima');
                    me.target(5).find('label').addClass('anima');
                    break;
                case 6:
                    me.target(6).show();
                    me.target(6).find('img').addClass('anima');
                    me.target(6).find('ul li:first-child').addClass('anima');
                    me.target(6).find('ul li:nth-child(2)').addClass('anima');
                    me.target(6).find('ul li:nth-child(3)').addClass('anima');
                    break;
                case 7:
                    me.target(7).show();
                    me.target(7).addClass('anima'); break;
                case 8:
                    me.target(8).show();
                    me.target(8).find('img').addClass('anima');
                    me.target(8).find('ul li:first-child').addClass('anima');
                    me.target(8).find('ul li:nth-child(2)').addClass('anima');
                    me.target(8).find('ul li:nth-child(3)').addClass('anima');
                    me.target(8).find('ul li:nth-child(4)').addClass('anima');
                    me.target(8).find('ul li:last-child').addClass('anima');
                    break;
                case 9:
                    me.target(9).show();
                    me.target(9).find('img').addClass('anima');
                    me.target(9).find('ul li:first-child').addClass('anima');
                    me.target(9).find('ul li:nth-child(2)').addClass('anima');
                    break;
                case 10:
                    me.target(10).show();
                    me.target(10).find('img').addClass('anima');
                    me.target(10).find('ul li:first-child').addClass('anima');
                    me.target(10).find('ul li:nth-child(2)').addClass('anima');
                    me.target(10).find('dl:nth-child(3)').addClass('anima');
                    me.target(10).find('dl:nth-child(4)').addClass('anima');
                    me.target(10).find('dl:nth-child(5)').addClass('anima');
                    me.target(10).find('dl:nth-child(6)').addClass('anima');
                    me.target(10).find('dl:nth-child(7)').addClass('anima');
                    me.target(10).find('dl:last-child').addClass('anima');
                    break;
                case 11:
                    me.target(11).show();
                    me.target(11).find('img.logo:first-child').addClass('anima');
                    me.target(11).find('ul li img:first-child').addClass('anima');
                    me.target(11).find('ul li div').addClass('anima');
                    break;
                case 12:
                    me.target(11).show();
                    me.target(11).find('img.logo:first-child').addClass('anima');
                    me.target(11).find('ul li img:first-child').addClass('anima');
                    me.target(11).find('ul li div').addClass('anima');
                    break;
                case 13:
                    me.target(13).show();
                    me.target(13).find('ul li:first-child').addClass('anima');
                    me.target(13).find('ul li:nth-child(2)').addClass('anima');
                    me.target(13).find('ul li:last-child').addClass('anima');
                    break;
                case 14:
                    me.target(14).show();
                    me.target(14).find('img:first-child').addClass('anima');
                    me.target(14).find('ul:nth-child(2) li:first-child').addClass('anima');
                    me.target(14).find('ul:nth-child(2) li:last-child').addClass('anima');
                    break;
                default:
            }
        }
    };

});

$(function() {
    var share_img = "http://cdn.holdfun.cn/resources/images/4160bcaf21e9495f9cf17fe9689f5bbb/2015/05/07/68672675286840e3a469fe2062ad909a.jpg";
    var share_title = "邀请函";
    var share_desc = "旅游卫视同光华管理学院邀您加入首届”中国旅游行业领军人才管理与发展高级课程“研修班";
    var share_url = window.location.href;
    var share_group = share_title;
    window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, share_url.replace(/[^\/]*\.html/i, 'index.html'));
    H.index.init();
});