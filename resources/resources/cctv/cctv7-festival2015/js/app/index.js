(function($) {
    H.index = {
        showinfoFlag: true,
        showoverFlag: getQueryString('showoverFlag'),
        init: function() {
            this.event();
            this.prereserve();
            this.showinfo_port();
            if (this.showoverFlag == 'on') {
                $('body').addClass('showover');
            } else {
                $('body').removeClass('showover');
            }
        },
        event: function() {
            var me = this;
            $('body').delegate('#btn-reserve', 'click', function(e) {
                e.preventDefault();
                var that = this, reserveId = $(this).attr('data-reserveid'), date = $(this).attr('data-date');
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
                if (!$(this).hasClass('requesting')) {
                    $(this).addClass('requesting');
                    setTimeout(function(){
                        $(that).removeClass('requesting');
                    }, 1000);
                };
            }).delegate('#btn-rule', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading();
                    H.dialog.rule.open();
                }
            }).delegate('#btn-go2vote', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    shownewLoading();
                    if ($(me).hasClass('end')) {
                        $('body').addClass('showover');
                        hidenewLoading();
                    } else {
                        $('body').removeClass('showover');
                        toUrl('vote.html');
                    }
                }
            }).delegate('#btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    shownewLoading();
                    if ($(me).hasClass('end')) {
                        $('body').addClass('showover');
                        hidenewLoading();
                    } else {
                        $('body').removeClass('showover');
                        toUrl('lottery.html');
                    }
                }
            }).delegate('#btn-go2headline', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    shownewLoading();
                    toUrl('headline.html');
                }
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
                        $("#btn-reserve").addClass('none');
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                        tvid:yao_tv_id,
                        reserveid:data.reserveId,
                        date:data.date},
                    function(resp){
                        if (resp.errorCode == 0) {
                            $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        } else {
                            $("#btn-reserve").addClass('none');
                        }
                    });
                }
            });
        },
        showinfo_port: function() {
            var me = this;
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
                                $('.btn-go2lottery').addClass('end');
                            } else {
                                $('.btn-go2lottery').removeClass('end');
                            }
                        } else {
                            $('.btn-go2lottery').addClass('end');
                        }
                    } else {
                        if (me.showinfoFlag) {
                            me.showinfoFlag = false;
                            me.showinfo_port();
                        } else {
                            $('.btn-go2lottery').removeClass('end');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('.btn-go2lottery').removeClass('end');
                }
            });
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});