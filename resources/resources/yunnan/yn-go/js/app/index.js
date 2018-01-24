(function($) {
    H.index = {
        init: function() {
            this.event();
            this.prereserve();
        },
        prereserve: function() {
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get' + dev,
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
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        event: function() {
            $('body').delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                var that = this;
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
                        $("#btn-reserve").addClass('none');
                    }
                });
                if (!$(this).hasClass('flag')) {
                    $(this).addClass('flag');
                    setTimeout(function(){
                        $(that).removeClass('flag');
                    }, 1000);
                };
            }).delegate('#btn-go', 'click', function(e) {
                e.preventDefault();
                if (!$(this).hasClass('flag')) {
                    $(this).addClass('flag');
                    toUrl('lottery.html');
                };
            });
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});