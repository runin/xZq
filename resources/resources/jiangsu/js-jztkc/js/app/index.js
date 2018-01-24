(function($) {
    H.index = {
        time:null,
        ist:null,
        iet:null,
        day:null,
        isgetpic:false,
        isask:false,
        isEnd:getQueryString("end"),
        isLoad:false,
        inkBox:$(".ink-box p"),
        prog:0,
        init: function () {
            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
            this.event();
            //this.showinfo_port();
            //this.chk();
//          this.prereserve();
            this.loadimg(true);
            //this.isend();
        },
        event: function() {
            var me = this;
            //setTimeout(function () {
            //    $(".out-box").css({"-webkit-animation":"out-pop 2s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
            //        $(this).css({"-webkit-animation":""});
            //    });
            //    $(".btn-play").css({"opacity":"1","-webkit-animation":"in-pop 2s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
            //        $(".btn-play").css({"-webkit-animation":""});
            //    });
            //},500);
            $('body').delegate('.btn-info', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('info.html');
                }
            }).delegate('.btn-rule', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-play', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('comment.html');
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
                //$(".icon-logo-tips1").addClass("none");
                //$(".icon-logo-tips2").addClass("none");
                //$(".icon-logo-tips3").removeClass("none");
            }
        },
//      prereserve: function() {
//          var me = this;
//          $.ajax({
//              type : 'GET',
//              async : true,
//              url : domain_url + 'api/program/reserve/get' + dev,
//              data: {},
//              dataType : "jsonp",
//              jsonpCallback : 'callbackProgramReserveHandler',
//              success : function(data) {
//                  if (!data.reserveId) {
//                      return;
//                  }
//                  window['shaketv'] && shaketv.preReserve_v2({
//                      tvid:yao_tv_id,
//                      reserveid:data.reserveId,
//                      date:data.date},
//                  function(resp){
//                      if (resp.errorCode == 0) {
//                          $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
//                      } else {
//                          $("#btn-reserve").addClass('none');
//                      }
//                  });
//              }
//          });
//      },
        //showinfo_port: function() {
        //    $.ajax({
        //        type : 'GET',
        //        async : false,
        //        url : domain_url + 'api/common/servicetime' + dev,
        //        data: {},
        //        dataType : "jsonp",
        //        jsonpCallback : 'commonApiServicetimeHandler',
        //        timeout: 10000,
        //        complete: function() {
        //        },
        //        success : function(data) {
        //            if (data && data.st && data.pet && data.pbt && data.fq) {
        //                var allday = timeTransform(parseInt(data.st));
        //                var sshowTime = allday.split(" ")[0] + ' ' + data.pbt, eshowTime = allday.split(" ")[0] + ' ' + data.pet;
        //                var day = new Date(str2date(allday)).getDay().toString();
        //                if (day == '0') { day = '7'; }
        //                if (data.fq.indexOf(day) >= 0) {
        //                    if (comptime(eshowTime, allday) >= 0) {
        //                    } else {
        //                    }
        //                } else {
        //                }
        //            }
        //        },
        //        error : function(xmlHttpRequest, error) {
        //        }
        //    });
        //}
        chk: function () {
            getResult('api/common/time', {}, 'commonApiTimeHandler', true);
        },
        loadimg: function (type) {
            if(type){
                $(".ink-box p").before('<img class="index-in-bg" onload="H.index.loadprogress(31,true)" src="images/index-in-bg.jpg"/><div class="load"><img class="splash" src="images/splash.png" /> <img class="sword" onload="H.index.loadprogress(10)" src="images/sword.png"/><div class="loading"><img class="sword-light" onload="H.index.loadprogress(10)" src="images/sword-light.png"/></div></div>');
                $(".sword-light").width($(".load").width());
                $(".sword-light").height($(".load").width()*63/272);
                setTimeout(function () {if(!H.index.isLoad)$(".ink-box").css("opacity","1");},3000);
            }else{
//              $(".btn-play").before('<img class="round-bg" onload="H.index.loadprogress(20)" src="images/round-bg.png"/>');
                $(".fix-box").append('<img class="link-ink" onload="H.index.loadprogress(20)" src="images/link-ink.png"/>');
                $(".fix-box").append('<img class="tv-icon" onload="H.index.loadprogress(13)" src="images/tv-icon.png"/>');
//              $(".fix-box").append('<img class="tv-logo" onload="H.index.loadprogress(15)" src="images/tv-logo.png"/>');
                $(".move-box").append('<img class="index-down-bg" onload="H.index.loadprogress(16)" src="images/index-down-bg.jpg"/>');
            }
        },
        loadprogress: function (per,type) {
            var me = this;
            me.prog += per;
            $(".splash").css({'opacity':1,'left': me.prog-2+'%'})
            $(".loading").width(me.prog+'%');
            if(type){
                me.loadbox(1);
                me.loadimg(false);
            }
            me.inkBox.html('好故事即将开始...'+me.prog+"%");
            
            if(me.prog == 100) $(".splash").animate({'opacity':0},500,function(){
            	me.loadbox(2);
            });      
            
        },
        loadbox: function (type) {
            if(type == 1){
                $(".ink-box").css("opacity","1");
            }else{
                H.index.isLoad = true;
                $(".ink-box").animate({'opacity': '0'}, 1000, function() {
                    $(this).addClass('none');
                });
                $(".show-box").animate({'opacity': '1'}, 1000);
                $(".fix-box").animate({'opacity': '1'}, 500 , function () {
                    $(".link-ink").animate({'-webkit-transform': 'scale(3,3)',"opacity":"0"}, 1500, 'ease-out' , function () {
                        $(".link-ink").addClass('none');
                        $(".btn-play").addClass("bounceInLeft");
                    });
                });
                $(".move-box").css({"-webkit-animation":"mm 25s infinite","animation-timing-function":"ease","-webkit-animation-timing-function":"ease"});
            }
        }
    };
    W.callbackArticledetailListHandler = function(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                $(".btn-play").before('<img class="round-bg" onload="H.index.loadprogress(10)" src="' + (data.arts[0].img).toString() + '"/>');
                H.index.isgetpic = true;
            }else if(data.code == 1){
                if(H.index.isask == false){
                    getResult('api/article/list', {}, 'callbackArticledetailListHandler');
                    H.index.isask = true;
                }else{
                    hidenewLoading();
                    $(".btn-play").before('<img class="round-bg" onload="H.index.loadprogress(10)" src="' + (data.arts[0].img).toString() + '"/>');
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