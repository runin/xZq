(function($){
    H.index = {
        request_cls: 'requesting',
        from: getQueryString('from'),
        init: function(){
            if(this.from){
                H.dialog.guide.open();
            } else {
                $('.logo').addClass('rubberBand');
                setTimeout(function() {
                    $('.logo').removeClass('rubberBand');
                }, 2800);
            }
            this.prereserve();
            this.scrollChalk();
            this.resize();
            this.event();
        },
        event: function(){
            var me = this;
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                H.dialog.rule.open();
            });
            $('#btn-reserve').click(function(e) {
                e.preventDefault();
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
                    });
            });
            $('.logo').click(function(e) {
                e.preventDefault();
                if ($('.logo').hasClass('rubberBand2')) {
                    return;
                } else {
                    $('.logo').addClass('rubberBand2');
                    setTimeout(function() {
                        $('.logo').removeClass('rubberBand2');
                    }, 1300);
                }
            });
            $('#btn-go2record').click(function(e) {
                e.preventDefault();
                toUrl('record.html');
            });
        },
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
                                $('#btn-reserve').removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        },
        resize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            $('body').css({
                'width': winW,
                'height': winH
            });
        },
        scrollChalk: function() {
            var el = document.querySelector('.chalk');
            var elStep = $(window).width() * 0.1;
            var allStep = $(window).width() * 0.7;
            var startPosition, endPosition, deltaX, deltaY, moveLength;
            var clientWidth = $(window).width();
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
                if(deltaX < 0) {
                    moveLength = 0 + elStep;
                } else if (deltaX > 0) {
                    moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)) + elStep;
                };
                if (moveLength >= 0) {
                    $('.chalk').css('right', (85 - (moveLength/allStep*100)) + '%');
                };
            });
            el.addEventListener('touchend', function (e) {
                e.preventDefault();
                var winW = $(window).width();
                if ((85 - (moveLength/allStep*100)) > 50) {
                    $('.chalk').animate({'right' : '70%'}, 100);
                } else {
                    $('.honor').css('z-index', '5').addClass('honor-ani');
                    $('.chalk').animate({'right' : '5%'}, 800, function(){
                        toUrl('vote.html');
                        recordUserOperate(openid, "为母校而战首页进入互动", "tv_dongnan_fight_school");
                        recordUserPage(openid, "为母校而战首页进入互动", 0);
                    });
                }
            });
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});