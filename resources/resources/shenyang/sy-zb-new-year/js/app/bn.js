(function($) {

    H.stars = {
        $stars: $('#stars'),
        $btn_card: $('#btn-card'),
        expires: {expires: 7},
        init: function() {

            H.utils.resize();
            this.event();

            var t = simpleTpl(),
                stars = W['stars'] || [];

            for (var i = 0, len = stars.length; i < len; i++) {
                t._('<dd data-type="'+ stars[i].type +'" data-id="'+ (i + 1) +'" data-wish="'+ stars[i].wish +'">')
                if (stars[i].type == 'audio') {
                    t._('<audio preload="auto" class="audio none" src="'+ stars[i].wish +'"></audio>');
                }

                t._('<div class="avatar">')
                    ._('<i></i><img src="'+ (stars[i].avatar || './images/blank.gif') +'" />')
                    ._('</div>')
                    ._('<span>'+ stars[i].name +'</span>')
                    ._('</dd>');
            }
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
                        console.log('playing')
                    }).on('ended', function() {
                        console.log('ended');
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
        name: '晋然',
        avatar: 'images/stars/images/1jinran.jpg',
        type: 'audio',
        wish: 'images/stars/audio/1jinran.mp3'
    },
    {
        id: 2,
        name: '连城',
        avatar: 'images/stars/images/2liancheng.jpg',
        type: 'audio',
        wish: 'images/stars/audio/2liancheng.mp3'
    },
    {
        id: 3,
        name: '潘洋',
        avatar: 'images/stars/images/3panyang.jpg',
        type: 'audio',
        wish: 'images/stars/audio/3panyang.mp3'
    },
    {
        id: 4,
        name: '奕彤',
        avatar: 'images/stars/images/4yitong.jpg',
        type: 'audio',
        wish: 'images/stars/audio/4yitong.mp3'
    },
    {
        id: 5,
        name: '蔡昊',
        avatar: 'images/stars/images/5caihao.jpg',
        type: 'audio',
        wish: 'images/stars/audio/5caihao.mp3'
    },
    {
        id: 6,
        name: '杜凯',
        avatar: 'images/stars/images/6dukai.jpg',
        type: 'audio',
        wish: 'images/stars/audio/6dukai.mp3'
    },
    {
        id: 7,
        name: '高雅宁',
        avatar: 'images/stars/images/7gaoyaning.jpg',
        type: 'audio',
        wish: 'images/stars/audio/7gaoyaning.mp3'
    },
    {
        id: 8,
        name: '宫正',
        avatar: 'images/stars/images/8gongzheng.jpg',
        type: 'audio',
        wish: 'images/stars/audio/8gongzheng.mp3'
    },
    {
        id: 9,
        name: '蒋义',
        avatar: 'images/stars/images/9jiangyi.jpg',
        type: 'audio',
        wish: 'images/stars/audio/9jiangyi.mp3'
    },
    {
        id: 10,
        name: '婕妤',
        avatar: 'images/stars/images/10jieyu.jpg',
        type: 'audio',
        wish: 'images/stars/audio/10jieyu.mp3'
    },
    {
        id: 11,
        name: '孟丹凤',
        avatar: 'images/stars/images/11megndanfeng.jpg',
        type: 'audio',
        wish: 'images/stars/audio/11megndanfeng.mp3'
    },
    {
        id: 12,
        name: '苏倩',
        avatar: 'images/stars/images/12suqian.jpg',
        type: 'audio',
        wish: 'images/stars/audio/12suqian.mp3'
    },
    {
        id: 13,
        name: '孙宁',
        avatar: 'images/stars/images/13sunning.jpg',
        type: 'audio',
        wish: 'images/stars/audio/13sunning.mp3'
    },
    {
        id: 14,
        name: '王欣',
        avatar: 'images/stars/images/14wangxin.jpg',
        type: 'audio',
        wish: 'images/stars/audio/14wangxin.mp3'
    },
    {
        id: 15,
        name: '译丘',
        avatar: 'images/stars/images/15yiqiu.jpg',
        type: 'audio',
        wish: 'images/stars/audio/15yiqiu.mp3'
    },
    {
        id: 16,
        name: '英娜',
        avatar: 'images/stars/images/16yingna.jpg',
        type: 'audio',
        wish: 'images/stars/audio/16yingna.mp3'
    },
    {
        id: 17,
        name: '张猛',
        avatar: 'images/stars/images/17zhnagmeng.jpg',
        type: 'audio',
        wish: 'images/stars/audio/17zhnagmeng.mp3'
    },
    {
        id: 18,
        name: '张帅',
        avatar: 'images/stars/images/18zhangshuai.jpg',
        type: 'audio',
        wish: 'images/stars/audio/18zhangshuai.mp3'
    },
    {
        id: 19,
        name: '赵睿男',
        avatar: 'images/stars/images/19zhaoruinan.jpg',
        type: 'audio',
        wish: 'images/stars/audio/19zhaoruinan.mp3'
    },
    {
        id: 20,
        name: '竹青',
        avatar: 'images/stars/images/20zhuqing.jpg',
        type: 'audio',
        wish: 'images/stars/audio/20zhuqing.mp3'
    },
    {
        id: 21,
        name: '丁浩',
        avatar: 'images/stars/images/21dinghao.jpg',
        type: 'audio',
        wish: 'images/stars/audio/21dinghao.mp3'
    }
];