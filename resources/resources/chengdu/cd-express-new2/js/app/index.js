(function($) {
    H.index = {
        from: getQueryString('from'),
        $btnRule: $('#btn-rule'),
        $btn_join: $('.btn-join'),
        $btnDeclaration: $('#btn-declaration'),
        $btnReserve: $('#btn-reserve'),
        istrue: true,
        init: function() {
            this.event();
            //this.loadShare();
            this.tv_name();
            this.loadResize();
            this.prereserve();
        },

        prereserve: function() {
            var me = this;
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'api/program/reserve/get' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackProgramReserveHandler',
                success: function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid: yao_tv_id,
                            reserveid: data.reserveId,
                            date: data.date
                        },
                        function(resp) {
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        },
        event: function() {
            this.$btnRule.click(function(e) {
                e.preventDefault();
                $(this).addClass("joinscale-btn");
                $(this).on("webkitAnimationEnd", function() {
                    $(this).removeClass("joinscale-btn");
                    H.dialog.rule.open();
                })

            });
            this.$btn_join.click(function(e) {
                e.preventDefault();
                $(this).addClass("joinscale-btn");
                toUrl('yaoyiyao.html');
            });
            this.$btnReserve.click(function(e) {
                e.preventDefault();
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                        tvid: yao_tv_id,
                        reserveid: reserveId,
                        date: date
                    },
                    function(d) {
                        if (d.errorCode == 0) {
                            H.index.$btnReserve.addClass('none');
                        }
                    });
            });
        },
        tv_name: function() {
            shownewLoading();
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
        },
        loadShare: function() {
            var me = this;
            if (me.from == 'share') {
                H.dialog.guide.open();
            } else {
                $(".logo").addClass("index-bounce");
                $(".tv-name").addClass(" bounce-btn");
            }
        },
        loadResize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
            $('html, body, .main').css({
                'height': winH,
                'width': winW
            });
        }
    }
    W.callbackArticledetailListHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".content").append('<img class="ad" src="' + (data.arts[0].img?data.arts[0].img:"images/tv-info.png").toString() + '" />');
            }else if(data.code == 1){
            }
        }
        hidenewLoading();
    }
})(Zepto);

$(function() {
    H.index.init();
});
