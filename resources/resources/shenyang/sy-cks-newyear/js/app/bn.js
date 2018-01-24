(function($) {

    H.stars = {
        $uiBox: $('.ui-box'),
        $stars: $('#stars'),
        $vip: $('#vip'),
        $btn_card: $('#btn-card'),
        expires: {expires: 7},
        init: function() {

            H.utils.resize();
            this.event();

            var t = simpleTpl(),
                v = simpleTpl(),
                stars = W['stars'] || [];

            for (var i = 0, len = stars.length; i < len; i++) {
                if(typeof stars[i].level == "undefined"){
                    t._('<dd data-type="'+ stars[i].type +'" data-id="'+ (i + 1) +'" data-wish="'+ stars[i].wish +'">')
                    if (stars[i].type == 'audio') {
                        t._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>');
                    }
                    t._('<div class="avatar">')
                        ._('<img src="'+ (stars[i].avatar || './images/blank.gif') +'" />')
                        ._('</div>')
                        ._('<span>'+ stars[i].name +'</span>')
                        ._('</dd>');
                }else{
                    v._('<dd data-type="'+ stars[i].type +'" data-id="'+ (i + 1) +'" data-wish="'+ stars[i].wish +'">')
                    if (stars[i].type == 'audio') {
                        v._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>');
                    }
                    v._('<div class="avatar">')
                        ._('<img src="'+ (stars[i].avatar || './images/blank.gif') +'" />')
                        ._('</div>')
                        ._('<span>'+ stars[i].name +'</span>')
                        ._('</dd>');
                }
            }
            this.$vip.html(v.toString());
            this.$stars.html(t.toString());
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function() {
            var me = this;
            this.$stars.delegate('dd', 'click',function(e) {
                var $tg = $(this),
                    $siblings = $tg.siblings('dd'),
                    type = $tg.attr('data-type');

                if (type == 'audio') {
                    if ($siblings.hasClass('scale')) {
                        return;
                    }
                    $siblings.removeClass('selected');
                    $(this).addClass('selected scale');
                    me.$stars.find('dt').remove();

                    var $audio = $(this).find('audio');
                    $audio.get(0).play();
                    $audio.on('playing', function() {
                    }).on('ended', function() {
                        $audio.get(0).pause();
                        $tg.removeClass('scale');
                    });
                }
            });
            this.$vip.delegate('dd', 'click',function(e) {
                var $tg = $(this),
                    $siblings = $tg.siblings('dd'),
                    type = $tg.attr('data-type');

                if (type == 'audio') {
                    if ($siblings.hasClass('scale')) {
                        return;
                    }
                    $siblings.removeClass('selected');
                    $(this).addClass('selected scale');
                    me.$stars.find('dt').remove();

                    var $audio = $(this).find('audio');
                    $audio.get(0).play();
                    $audio.on('playing', function() {
                    }).on('ended', function() {
                        $audio.get(0).pause();
                        $tg.removeClass('scale');
                    });
                }
            });

            this.$btn_card.click(function(e) {
                e.preventDefault();

                toUrl("index.html");
            });
        }
    };

    H.utils = {
        $main: $('#main'),
        resize: function() {
            var me = this,
                width = $(window).width(),
                height = $(window).height();

            this.$main.css('minHeight', height);
        }
    };

})(Zepto);

$(function(){
    H.stars.init();
});
var stars = [
    {
        id: 1,
        level:1,
        name: '蔡昊',
        avatar: 'images/head/caihao.jpg',
        type: 'audio',
        wish: 'images/audio/caihao.mp3'
    },
    {
        id: 2,
        name: '丁浩',
        avatar: 'images/head/dinghao.jpg',
        type: 'audio',
        wish: 'images/audio/dinghao.mp3'
    },
    {
        id: 3,
        name: '杜凯',
        avatar: 'images/head/dukai.jpg',
        type: 'audio',
        wish: 'images/audio/dukai.mp3'
    },
    {
        id: 4,
        name: '高雅宁',
        avatar: 'images/head/gaoyaning.jpg',
        type: 'audio',
        wish: 'images/audio/gaoyaning.mp3'
    },
    {
        id: 5,
        name: '宫正',
        avatar: 'images/head/gongzheng.jpg',
        type: 'audio',
        wish: 'images/audio/gongzheng.mp3'
    },
    {
        id: 6,
        name: '蒋义',
        avatar: 'images/head/jiangyi.jpg',
        type: 'audio',
        wish: 'images/audio/jiangyi.mp3'
    },
    {
        id: 7,
        name: '婕妤',
        avatar: 'images/head/jieyu.jpg',
        type: 'audio',
        wish: 'images/audio/jieyu.mp3'
    },
    {
        id: 8,
        name: '晋然',
        avatar: 'images/head/jinran.jpg',
        type: 'audio',
        wish: 'images/audio/jinran.mp3'
    },
    {
        id: 9,
        name: '连城',
        avatar: 'images/head/liancheng.jpg',
        type: 'audio',
        wish: 'images/audio/liancheng.mp3'
    },
    {
        id: 10,
        name: '孟丹凤',
        avatar: 'images/head/mengdanfeng.jpg',
        type: 'audio',
        wish: 'images/audio/mengdanfeng.mp3'
    },
    {
        id: 11,
        name: '潘洋',
        avatar: 'images/head/panyang.jpg',
        type: 'audio',
        wish: 'images/audio/panyang.mp3'
    },
    {
        id: 12,
        name: '苏倩',
        avatar: 'images/head/suqian.jpg',
        type: 'audio',
        wish: 'images/audio/suqian.mp3'
    },
    {
        id: 13,
        name: '孙宁',
        avatar: 'images/head/sunning.jpg',
        type: 'audio',
        wish: 'images/audio/sunning.mp3'
    },
    {
        id: 14,
        name: '王欣',
        avatar: 'images/head/wangxin.jpg',
        type: 'audio',
        wish: 'images/audio/wangxin.mp3'
    },
    {
        id: 15,
        name: '译丘',
        avatar: 'images/head/yiqiu.jpg',
        type: 'audio',
        wish: 'images/audio/yiqiu.mp3'
    },
    {
        id: 16,
        name: '奕彤',
        avatar: 'images/head/yitong.jpg',
        type: 'audio',
        wish: 'images/audio/yitong.mp3'
    },
    {
        id: 17,
        name: '英娜',
        avatar: 'images/head/yingna.jpg',
        type: 'audio',
        wish: 'images/audio/yingna.mp3'
    },
    {
        id: 18,
        name: '张猛',
        avatar: 'images/head/zhangmeng.jpg',
        type: 'audio',
        wish: 'images/audio/zhangmeng.mp3'
    },
    {
        id: 19,
        name: '张帅',
        avatar: 'images/head/zhangshuai.jpg',
        type: 'audio',
        wish: 'images/audio/zhangshuai.mp3'
    },
    {
        id: 20,
        name: '赵睿男',
        avatar: 'images/head/zhaoruinan.jpg',
        type: 'audio',
        wish: 'images/audio/zhaoruinan.mp3'
    },
    {
        id: 21,
        name: '竹青',
        avatar: 'images/head/zhuqing.jpg',
        type: 'audio',
        wish: 'images/audio/zhuqing.mp3'
    }
];