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
                    if (!data.reserveId) return;
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('hide').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
        event: function() {
            $('#btn-reserve').click(function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
                if ($(this).hasClass('hide')) return;
                if (!reserveId || !date) return;
                window['shaketv'] && shaketv.reserve_v2({
                    tvid: yao_tv_id,
                    reserveid: reserveId,
                    date: date},
                function(d){
                    if(d.errorCode == 0){
                        $("#btn-reserve").addClass('hide');
                    }
                });
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(that).removeClass('requesting');
                    }, 1000);
                };
            });
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    H.dialog.rule.open();
                };
            });
            $('#btn-go').click(function(e) {
                e.preventDefault();
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    toUrl('talk.html');
                };
            });
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});