(function($) {
    H.index = {
        time:null,
        ist:null,
        iet:null,
        day:null,
        isgetpic:false,
        isask:false,
        isTVOpen:false,
        isTVReady:false,
        isInAni:false,
        toggle:true,
        isEnd:getQueryString("end"),
        init: function () {
            this.event();
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            //this.showinfo_port();
            //this.chk();
            this.prereserve();
            //this.isend();
        },
        event: function() {
            var me = this;
            $(".old-tv-in").append('<img class="old-tv-1" src="images/old-tv-1.png" /><img class="old-tv-2" src="images/old-tv-2.png" />');
            $(".old-tv-1").on("load", function () {
                if(me.isTVReady){
                    $(this).css("opacity","1");
                    $(".old-tv-2").css("opacity","1");
                    $(".old-tv-in").css({"-webkit-animation":"dispshow .6s"}).one("webkitAnimationEnd", function () {
                        $(".old-tv-in").css({"-webkit-animation":""});
                        if(me.isTVOpen){
                            $(".tv-info").css({"opacity":"1","-webkit-animation":"tv-info-show 2s"});
                        }else{
                            me.isTVOpen = true;
                        }
                    });
                }else{
                    me.isTVReady = true;
                }
            });
            $(".old-tv-2").on("load", function () {
                if(me.isTVReady){
                    $(this).css("opacity","1");
                    $(".old-tv-1").css("opacity","1");
                    $(".old-tv-in").css({"-webkit-animation":"dispshow .6s"}).one("webkitAnimationEnd", function () {
                        $(".old-tv-in").css({"-webkit-animation":""});
                        if(me.isTVOpen){
                            $(".tv-info").css({"opacity":"1","-webkit-animation":"tv-info-show 2s"});
                        }else{
                            me.isTVOpen = true;
                        }
                    });
                }else{
                    me.isTVReady = true;
                }
            });
            $(".btn-easterEgg").on("click", function () {
                if(!me.isInAni){
                    me.isInAni = true;
                    if(me.toggle){
                        $(".old-tv").css({"-webkit-animation":"disphide .6s"}).one("webkitAnimationEnd", function () {
                            $(this).css({"-webkit-animation":"","opacity":"0"});
                            me.isInAni = false;
                            me.toggle = false;
                        });
                    }else{
                        $(".old-tv").css({"-webkit-animation":"dispshow .6s"}).one("webkitAnimationEnd", function () {
                            $(this).css({"-webkit-animation":"","opacity":"1"});
                            me.isInAni = false;
                            me.toggle = true;
                        });
                    }
                }
            });
            $('body').delegate('.btn-info', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('info.html');
                }
            }).delegate('.btn-rule', 'click', function(e) {
                e.preventDefault();
                var me = this;
                if(!$(me).hasClass('requesting')){
                    $(me).addClass('requesting');
                    setTimeout(function(){
                        $(me).removeClass('requesting');
                    }, 700);
                }
                H.dialog.rule.open();
            }).delegate('.btn-play', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('talk.html');
                }
            }).delegate('.btn-net', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    shownewLoading(null, '请稍后...');
                    setTimeout(function(){
                        location.href = 'http://www.fjtv.net/3g/';
                    }, 1000);
                }
            }).delegate('#btn-reserve', 'click', function(e) {
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
        isend: function () {
            if(H.index.isEnd == "1"){
                $(".btn-net").removeClass("none");
                $(".btn-play").addClass("none");
            }
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
                        } else {
                            $("#btn-reserve").addClass('none');
                        }
                    });
                }
            });
        },
        chk: function () {
            getResult('api/common/time', {}, 'commonApiTimeHandler', true);
        }
    };
    W.callbackArticledetailListHandler = function(data){
        var me = H.index;
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                $(".old-tv-in").append("<img class='tv-info'" + " src="+ (data.arts[0].img?data.arts[0].img:"images/tv-info.png").toString() + " />");
                $(".tv-info").on("load", function () {
                    if(me.isTVOpen){
                        $(this).css({"opacity":"1","-webkit-animation":"tv-info-show 2s"}).one("webkitAnimationEnd", function () {
                            $(".tv-info").css({"-webkit-animation":""});
                        });
                    }else{
                        me.isTVOpen = true;
                    }
                });
                H.index.isgetpic = true;
            }else if(data.code == 1){
                if(H.index.isask == false){
                    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                    H.index.isask = true;
                }else{
                    hidenewLoading();
                    $(".tv-info").on("load", function () {
                        if(me.isTVOpen){
                            $(this).css({"opacity":"1","-webkit-animation":"tv-info-show 2s"}).one("webkitAnimationEnd", function () {
                                $(".tv-info").css({"-webkit-animation":""});
                            });
                        }else{
                            me.isTVOpen = true;
                        }
                    });
                }
            }
        }
    };
    W.commonApiTimeHandler = function(data) {
        if (data.t) {
            H.index.time = data.t;
            var allday = timeTransform(parseInt(data.t));
            H.index.day = new Date(str2date(allday)).getDay().toString();
            if (H.index.day == '0') { H.index.day = '7'; }
            getResult('api/common/servicetime', {}, 'commonApiServicetimeHandler');
        }
    };
    W.commonApiServicetimeHandler = function(data) {
        shownewLoading();
        var me = H.index;
        if (data.code == 0) {
            if(data.fq.match(H.index.day)){
                var d = new Date();
                var today = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate()+" ";
                me.ist = today + data.pbt;
                me.iet = today + data.pet;
                if((H.index.time>timestamp(me.ist))&&(H.index.time<timestamp(me.iet))){
                    //$(".icon-logo-tips1").addClass("none");
                    if(H.index.isEnd == "1"){

                    }else{
                        //$(".icon-logo-tips2").removeClass("none");
                    }
                }else{
                    if(H.index.isEnd == "1"){
                        $(".btn-net").addClass("none");
                    }else{
                        //$(".icon-logo-tips1").removeClass("none");
                    }
                    $(".btn-play").addClass("none");
                    $(".qrcode-box").removeClass("none");
                }
            }else{
                if(H.index.isEnd == "1"){
                    $(".btn-net").addClass("none");
                }else{
                    //$(".icon-logo-tips1").removeClass("none");
                }
                $(".btn-play").addClass("none");
                $(".qrcode-box").removeClass("none");
            }
        }
        hidenewLoading();
    };
})(Zepto);

$(function(){
    H.index.init();
});