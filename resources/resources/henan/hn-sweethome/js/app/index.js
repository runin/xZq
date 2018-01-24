(function($) {
    H.index = {
        from: getQueryString('from'),
        $btnRule: $('#btn-rule'),
        $btn_join: $('.btn-join'),
        $btnReserve: $('#btn-reserve'),
        $lfImg:$('.lf-img'),
        $yaoTheme:$('.yao-theme'),
        init: function() {
            this.event();
            this.loadResize();
            this.prereserve();
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get'+dev,
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
        event: function() {
            this.$btnRule.click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });

            this.$btn_join.click(function(e) {
                e.preventDefault();
                $(this).addClass("displayhide");
                $(this).on("webkitAnimationEnd",function()
                {
                    if(cb41faa22e731e9b)
                    {
                        toUrl('comment.html?cb41faa22e731e9b='+cb41faa22e731e9b);
                    }
                    else
                    {
                         toUrl('comment.html');
                    }
                    
                })
                
            });
            this.$btnReserve.click(function(e) {
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
                        if(d.errorCode == 0){
                            H.index.$btnReserve.addClass('none');
                        }
                    });
            });
        },
        loadResize: function() {
            var winW = $(window).width(),
                winH = $(window).height();
        }
    }
   
})(Zepto);

$(function() {
    H.index.init();
});