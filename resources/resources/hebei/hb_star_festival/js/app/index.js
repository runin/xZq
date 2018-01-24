/**
 * 明星同乐会-首页
 */
(function($) {
    H.index = {
        from: getQueryString('from'),
        $btnRule: $('#btn-rule'),
        $btnJoin: $('#btn-join'),
        $btnReserve: $('#btn-reserve'),
        $is_openid: $('.is-openid'),
        request_cls: 'requesting',
        init: function() {
            this.event();
            this.prereserve();
            this.scrollRay();
            if (this.from) {
                setTimeout(function() {
                    H.dialog.guide.open();
                }, 1000);
            };
            var winW = $(window).width(),
                winH = $(window).height();
            $('body, .bg').css({
                'width': winW,
                'height': winH,
                'overflow': 'hidden'
            });
            // getResult("reunion/info", 'callbackReunionInfo',true);
        },

        // 是否配置了预约节目
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function(resp){
                        if (resp.errorCode == 0) {
                            me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId);
                        }
                    });
                }
            });
        },

        event: function() {
            var me = this;
            this.$btnRule.click(function(e) {
                e.preventDefault();

                H.dialog.rule.open();
            });
            this.$btnJoin.click(function(e) {
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
            });

            this.$btnReserve.click(function(e) {
                e.preventDefault();

                var reserveId = $(this).attr('data-reserveid');
                if (!reserveId) {
                    return;
                }
                shaketv.reserve(yao_tv_id, reserveId, function(data){});
            });

            if(openid){
                this.$btnJoin.attr('href', 'answer.html');
            }else{
                this.$btnJoin.addClass(this.request_cls);
            }

            this.$is_openid.click(function(e){
                e.preventDefault();
                if($(this).hasClass(me.request_cls)){
                    alert('拼命加载中....');
                }
            });
        },

        scrollRay: function() {
            var me = this;
            var el = document.querySelector('.line');
            var elStep = $(window).width() * 0.1;
            var startPosition, endPosition, deltaX, deltaY, moveLength;
            var clientHeight = $(window).height();
            var lineHeight = $('#line').height() * 0.5;
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
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
                if(deltaX > 0) {
                    moveLength = 0 - lineHeight;
                    deltaX = 0;
                } else {
                    moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)) - lineHeight;
                };
                console.log('moveLength:' + moveLength + '  deltaX:' + deltaX + '   lineHeight:' + lineHeight + '  elStep:' +elStep);
                if (moveLength >= -lineHeight) {
                    if (deltaX < 0) {
                        $('#line').css('top', moveLength);
                        if (moveLength/(clientHeight*0.2 - lineHeight) > 0.2) {
                            $('.bg').css('opacity', 2 - moveLength/(clientHeight*0.2 - lineHeight));
                        };
                        if (moveLength >= clientHeight*0.2 - lineHeight) {
                            toUrl('answer.html');
                        };
                    };
                };
            });
            el.addEventListener('touchend', function (e) {
                e.preventDefault();
                var winW = $(window).height();
                if (moveLength > -lineHeight) {
                    if (moveLength < clientHeight*0.2 - lineHeight) {
                        $('#line').animate({'top':'-50%'}, 350);
                        $('.bg').animate({'opacity':'0.2'}, 350);
                    };
                };
            });
        }
    };
    // W.callbackReunionInfo = function(data) {
    //     if(data.code == 0){
    //         $('.index-center').css({
    //             'background': 'url('+data.si+')',
    //             "background-size": "cover"
    //         });
    //     }
    // }
})(Zepto);

$(function() {
    H.index.init();
});