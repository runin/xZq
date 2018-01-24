(function($) {
    H.index = {
        init: function () {
            this.event();
            this.showinfo_port();
            this.prereserve();
            $.fn.cookie('jumpNum', 0, {expires: -1});
        },
        event: function() {
            var me = this;
            $('.btn-play').tap(function(e){
                e.preventDefault();
                if(!$('.btn-play').hasClass('requesting')){
                    $('.btn-play').addClass('requesting');
                    if ($('.btn-play').hasClass('over')) {
                        cookie4toUrl('over.html');
                    } else {
                        cookie4toUrl('vote.html');
                    }
                }
            });
            $("#btn-rule").tap(function(e) {
                e.preventDefault();
                if(!$(this).hasClass('flag')){
                    $(this).addClass('flag');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            });
            $("#btn-reserve").tap(function(e) {
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
            });
        },
        prereserve: function() {
            var me = this;
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
        showinfo_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/servicetime' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiServicetimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if (data && data.st && data.pet && data.pbt && data.fq) {
                        var allday = timeTransform(parseInt(data.st));
                        var sshowTime = allday.split(" ")[0] + ' ' + data.pbt, eshowTime = allday.split(" ")[0] + ' ' + data.pet;
                        var day = new Date(str2date(allday)).getDay().toString();
                        if (day == '0') { day = '7'; }
                        if (data.fq.indexOf(day) >= 0) {
                            if (comptime(eshowTime, allday) >= 0) {
                                $('.btn-play').addClass('over');
                            } else {
                                $('.btn-play').removeClass('over');
                            }
                        } else {
                            $('.btn-play').addClass('over');
                        }
                    } else {
                        if (H.index.showinfoFlag) {
                            H.index.showinfoFlag = false;
                            H.index.showinfo_port();
                        } else {
                            $('.btn-play').removeClass('over');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('.btn-play').removeClass('over');
                }
            });
        }
    };
})(Zepto);

$(function(){
    H.index.init();
});