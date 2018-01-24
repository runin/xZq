/**
 * 中华好民歌--首页.
 */
(function($){
    H.index = {
        $btnRule: $('#btn-rule'),
        $btnReserve: $('#btn-reserve'),
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            this.resize();
            this.event();
            this.prereserve();
            this.slide();
        },
        resize: function(){
            var me = this;
            var win_h = $(window).height();
            $('.main').css('height',win_h+'px');
            var bg = 'images/bg.jpg';
            shownewLoading(null,'请稍等...');
            imgReady(bg, function() {
                hideLoading();
                $('body').css('background-image', 'url('+ bg +')');
                $('body').css('background-size', '100% 100%');
                $('.item-animate').removeClass('none').addClass('animated');
                hidenewLoading();
            });
        },
        slide: function(){
            window.onload = function(){
                var el = document.querySelector('.sj');
                var clientWidth = $(window).width();
                var clientHeight = $(window).height();
                var elStep = $(window).width() * 0.2;
                var startPosition, endPosition, deltaX, deltaY, moveLength;
                var ratio = 361/347;
                var isGo = false;

                el.addEventListener('touchstart', function (e) {
                    var touch = e.touches[0];
                    startPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    }
                });

                el.addEventListener('touchmove', function (e) {
                    var touch = e.touches[0];
                    endPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    };


                    deltaX = endPosition.x - startPosition.x;
                    deltaY = endPosition.y - startPosition.y;
                    moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));

                    console.log('moveLength='+moveLength+ '----deltaX='+deltaX+'----deltaY='+deltaY);
                    if(deltaX < 0 && deltaY < 0){
                        $(this).animate({
                            'width': '204px',
                            'height': '200px'
                        }, 150);
                        isGo = true;
                        setTimeout(function(){
                            if(isGo){
                                toUrl('yao.html');
                            }
                        }, 500);
                    }else{
                        $(this).animate({
                            'width': '88px',
                            'height': '85px'
                        }, 150);
                        isGo = false;
                    }
                });

                el.addEventListener('touchend', function (e) {
                    e.preventDefault();
                    if (isGo) {
                        shownewLoading();
                        toUrl('yao.html');
                        recordUserOperate(openid, "中华好民歌", "hb-folk-song-new");
                        recordUserPage(openid, "中华好民歌", 0);
                    }
                });

            }
        },
        // 是否配置了预约节目
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        },
        event: function(){
            var me = this;
            var timer = setTimeout(function(){
                $('.sj').animate({
                    'width': '204px',
                    'height': '200px'
                }, 150);
                toUrl('yao.html');

            },5000);
            this.$btnRule.click(function(e) {
                e.preventDefault();
                clearInterval(timer);
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                shownewLoading();
                H.dialog.rule.open();
            });
            this.$btnReserve.click(function(e) {
                e.preventDefault();
                clearInterval(timer);
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                        if(d.errorCode == 0){
                            H.index.$btnReserve.addClass('none');
                        }
                    });
            });
        }
    };
})(Zepto);
$(function(){
    H.index.init();
});