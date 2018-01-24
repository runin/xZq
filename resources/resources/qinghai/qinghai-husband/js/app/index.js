isgetpic = false;
(function($) {
	H.index = {
		from: getQueryString('from'),
		$btnRule: $('#btn-rule'),
		$btnAnswer: $('.btn-in'),
		$btnDeclaration: $('#btn-declaration'),
		$btnReserve: $('#btn-reserve'),
        istrue:true,
		init: function() {
			//if (!openid) {
			//	$('.join-box').addClass('none');
			//	return;
			//} else {
			//	$('.join-box').removeClass('none');
			//};
			this.event();
			this.loadShare();
			this.loadResize();
			this.prereserve();
            //this.current_time();
            $.ajax({
                type:"GET",
                url:domain_url+"api/article/list"+dev,
                dataType:"jsonp",
                jsonp: "callback",
                jsonpCallback:callbackArticledetailListHandler,
                async: false,
                data:{},
                error: function () {
                    if(isgetpic == false){
                        $("body").append('<img id="roundbg" class="roundbg" src="images/index-bg.jpg" />');
                        $(".talkbg").css("opacity","1");
                        //$("body").append('<div class="talkbg"></div>');
                        //$(".talkbg").css({"opacity":"1","background":"url(../images/index-bg.jpg) 0 0 no-repeat 100% 100%"});
                    }
                    //alert("请求数据失败，请刷新页面");
                }
            });
		},
        //current_time: function(){
        //    getResult('api/lottery/round','callbackLotteryRoundHandler',true);
        //},
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
			//this.$btnRule.click(function(e) {
			//	e.preventDefault();
			//	H.dialog.rule.open();
			//});
			//this.$btnAnswer.click(function(e) {
			//	e.preventDefault();
			//	shownewLoading();
			//	toUrl('talk.html');
			//});
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
		loadShare: function() {
            var me = this;
            if (me.from == 'share') {
                H.dialog.guide.open();
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
        //change : function(){
        //    $(".countdown").html('今日摇奖已结束，请明天再来');
        //},
        //currentPrizeAct:function(data){
        //
        //    //获取抽奖活动
        //    var prizeActListAll = data.la,
        //        nowTimeStr = H.index.now_time,
        //        prizeActList = [],
        //        me = this;
        //    var day = nowTimeStr.split(" ")[0];
        //    if(prizeActListAll&&prizeActListAll.length>0){
        //        for ( var i = 0; i < prizeActListAll.length; i++) {
        //            if(prizeActListAll[i].pd == day){
        //                prizeActList.push(prizeActListAll[i]);
        //            }
        //        }
        //    }
        //    prizeLength = prizeActList.length;
        //    if(prizeActList.length >0){
        //        //如果最后一轮结束
        //        if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
        //            H.index.change();
        //            return;
        //        }
        //        for ( var i = 0; i < prizeActList.length; i++) {
        //            var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
        //            var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
        //            //在活动时间段内且可以抽奖
        //            if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
        //                shownewLoading();
        //                $(".countdown").html('摇奖开启');
        //                toUrl("talk.html");
        //                return;
        //            }
        //            if(comptime(nowTimeStr,beginTimeStr) > 0){
        //                var beginTimeLong = timestamp(beginTimeStr);
        //                var nowTime = Date.parse(new Date())/1000;
        //                var serverTime = timestamp(nowTimeStr);
        //                if(nowTime > serverTime){
        //                    beginTimeLong += (nowTime - serverTime);
        //                }else if(nowTime < serverTime){
        //                    beginTimeLong -= (serverTime - nowTime);
        //                }
        //                $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
        //                H.index.count_down();
        //                return;
        //            }
        //
        //        }
        //    }else{
        //        H.index.change();
        //        return;
        //    }
        //},
        //// 倒计时
        //count_down : function() {
        //    $('.detail-countdown').each(function() {
        //        var $me = $(this);
        //        $(this).countDown({
        //            etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...结束
        //            stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%'+'<label class="dian"></label>', // 还有...开始
        //            sdtpl : '',
        //            otpl : '',
        //            otCallback : function() {
        //                if(H.index.istrue){
        //                    H.index.istrue = false;
        //                    $(".countdown").html("摇奖开启");
        //                    shownewLoading();
        //                    toUrl("lottery.html");
        //                }
        //            },
        //            sdCallback :function(){
        //            }
        //        });
        //    });
        //}
	};
    function callbackArticledetailListHandler(data){
        if(data == undefined){

        }else{
            if(data.code == 0){
                hidenewLoading();
                if(data.arts[0].t == "1"){
                    $("body").append('<img id="roundbg" class="roundbg" src="'+ data.arts[0].img +'" />');
                }else if(data.arts[1].t == "1"){
                    $("body").append('<img id="roundbg" class="roundbg" src="'+ data.arts[1].img +'" />');
                }else if(data.arts[2].t == "1"){
                    $("body").append('<img id="roundbg" class="roundbg" src="'+ data.arts[2].img +'" />');
                }else{
                    hidenewLoading();
                    $("body").append('<img id="roundbg" class="roundbg" src="images/index-bg.jpg" />');
                    $(".talkbg").css("opacity","1");
                }
                isgetpic = true;
                document.getElementById("talkbg").onload = function(){
                    $(".roundbg").css("opacity","1");
                }
            }else if(data.code == 1){
                hidenewLoading();
                $("body").append('<img id="roundbg" class="roundbg" src="images/index-bg.jpg" />');
                $(".talkbg").css("opacity","1");
            }
        }
    }

    //W.callbackLotteryRoundHandler = function(data){
    //    if(data.result == true){
    //        H.index.now_time = timeTransform(data.sctm);
    //        H.index.currentPrizeAct(data);
    //    }else{
    //        H.index.change();
    //    }
    //}
})(Zepto);

$(function() {
	H.index.init();
});