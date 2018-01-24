(function($) {
    H.vote = {
     	guid :'',
        dec: 0,
        index:0,
        isCanVote :false,
        istrue: true,
        voteWheel:"",
        voteTimeList : [],
        nextTime :"",
        endTime:"",
		init: function () {
            this.getVoteinfo();
            this.event();
		},
		swiper: function() {
	         var swiper = new Swiper('.show', {
		        grabCursor: true,
		        centeredSlides: true,
		        slidesPerView: 'auto',
                slidesPerView: 1,
                paginationClickable: true,
                keyboardControl: true,
                spaceBetween: 20,
                speed: 600,
                effect: 'coverflow',
                coverflow: {
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    rotate: -40,
                    slideShadows : false
                },
                iOSEdgeSwipeDetection : true,
                preloadImages: false,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
		    });
			//swiper.slideTo(4, 1000, false);
		    $(".show").animate({'opacity':'1'},800);
		},
		event: function() {
			var me = this;
            $('body').delegate('.vo', 'click', function(e) {
                e.preventDefault();
                if ($('body').hasClass('over')) {
                    showTips('投票已结束');
                    return;
                }
                if ($(this).parents('.swiper-slide').hasClass('voted')) {
                    showTips('请不要重复投票');
                    return;
                }
                if ($(this).hasClass('voteOk')) {
                    showTips('请不要重复投票');
                    return;
                }
                if ($(this).hasClass('requesting')) return;
                if (!H.vote.isCanVote) {
                    showTips('不在投票时间段内');
                    return;
                }
                $(this).addClass('requesting');
                var votePuid =$(".show").find(".swiper-slide-active").attr("data-pid");
                var groupGuid = $(".show").attr("data-guid");
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer' + dev,
                    data: { yoi: openid, guid: groupGuid, pluids: votePuid},
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
                        $('.join-btn').removeClass('requesting');
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
                $(".pitems-"+votePuid).addClass("voted");
                var num = $(".votNum-"+votePuid).text();
                $(".votNum-"+votePuid).text(num*1+1);
                $(this).addClass('voteOk');
                showTips('谢谢您宝贵的一票');
            }).delegate('.fimg', 'click', function(event) {
                $('.pop .wrapper').html(ain[$(this).parents('.swiper-slide').attr('data-pid')]).parents('.pop').removeClass('none');
            });
            $('.btn-back').click(function(e) {
                e.preventDefault();
                toUrl('talk.html');
            });
            $('.btn-map').click(function(e) {
                e.preventDefault();
                toUrl('map.html');
            });
            $('.btn-close').click(function(e) {
                e.preventDefault();
                $('.pop').addClass('none').find('wrapper').html();
            });
            $('.btn-talk').click(function(e) {
                e.preventDefault();
                $('.footer').addClass('active');
                toUrl('talk.html');
            });
            $('.lotips').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('on')) {
                    toUrl('lottery.html?kfrom=talk');
                } else {
                    showTips('福袋亮起时点我摇奖');
                }
            });
		},
        getVoteinfo: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.items) {
                           H.vote.voteWheel= data
                           H.vote.fillVoteinfo(data);
                        }
                    } else {
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        fillVoteinfo: function(data) {	
            var me = this, t = simpleTpl(), items = data.items,voteSupportDelay = Math.ceil(700*Math.random() + 300);
            me.nextTime = data.nex;
            ain = {};
            if (items.length > 0) {
                for(var i = 0, len = items.length; i < len; i++) {
                	me.guid = items[i].guid;
                	t._('<div class="swiper-container show items-'+items[i].guid+'" data-guid="'+items[i].guid+ '">')
						._('<div class="swiper-wrapper">')
	                    if (items[i].pitems) {
	                    	var pitems = items[i].pitems;
	                        for(var h = 0, hLen = pitems.length; h < hLen; h++) {
                                ain[pitems[h].pid] = pitems[h].in;
	                            t._('<div class="swiper-slide pitems-'+pitems[h].pid+'" data-pid='+pitems[h].pid+'>')
		                            ._('<div class="vote-box" >')
					                	._('<img class="fimg" src="images/load-swiper.png" data-src='+pitems[h].im+' onload="$(this).attr(\'src\',$(this).attr(\'data-src\'))"/>')
					                	._('<div class="vote-info">')
					                		._('<p class="info">')
					                			._('<span class="name">'+pitems[h].na+'</span>')
					                			._('<span class="vot-num"><i class="vo"></i><span class="votNum-'+pitems[h].pid+'">0</span></span>')
					                		._('</p>')
					                	._('</div>')
					                ._('</div>')
				                ._('</div>')
	                        };
	                    }
	                	t._('</div>')
				    ._('</div>')
                };
                $('.main').append(t.toString());
                me.countdownInfo(data);
                me.swiper();
                H.vote.getVote();
               setTimeout(function() { me.voteSupport(); }, voteSupportDelay);
            }
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        getVote: function() {
        	var me = this;
            getResult('api/voteguess/isvote', { yoi: openid,guid: me.guid}, 'callbackVoteguessIsvoteHandler ');
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.items;
            H.vote.dec = new Date().getTime() - data.cud;
			voteTimeListLength =  me.voteTimeList.length;
			me.endTime =  me.voteTimeList[voteTimeListLength-1].get;
			//最后一轮投票结束	
        	if (comptime(me.voteTimeList[voteTimeListLength-1].get,nowTimeStr) >=0) { 
        		H.vote.guid = me.voteTimeList[voteTimeListLength-1].guid;
        		H.vote.change('port');
                return
        	};
        	for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].gst, endTimeStr = me.voteTimeList[i].get;
                 //活动正在进行
                if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){   
                	H.vote.index = i;
                	H.vote.nowCountdown(me.voteTimeList[i]);
                    return;
                }
                if(comptime(nowTimeStr,beginTimeStr) > 0){    //活动还未开始
                 	H.vote.index = i
                 	H.vote.beforeShowCountdown(me.voteTimeList[i]);
                    return;
                }
        	};
        },
        // 投票开启倒计时
        beforeShowCountdown: function(pra) {
            H.vote.isCanVote = false;
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.vote.dec;
            $(".countdown-tip1").html('距下轮投票开启还有 ');
            $('.detail-countdown1').attr('etime',beginTimeLong);
            H.vote.count_down();
            H.vote.istrue = true;
            H.vote.type = 1;
            H.vote.guid = pra.guid;
            if( $('.items-'+ H.vote.guid).prev(".swiper-container").length>0){
            	$('.items-'+ H.vote.guid).prev(".swiper-container").removeClass("none").addClass("show");
            }
            $(".join-btn").html("去摇奖").attr("data-href","lottery.html").removeClass('voteOk').removeClass("none");
            $(".arrow").removeClass("none");
            hidenewLoading();
        },
        // 投票结束倒计时
        nowCountdown: function(pra){
            H.vote.isCanVote = true;
            var endTimeStr = pra.get;
            var beginTimeLong = timestamp(endTimeStr);
      		beginTimeLong += H.vote.dec;
            $('.detail-countdown1').attr('etime',beginTimeLong);
            $(".countdown-tip1").html("距本轮投票结束还有");
            H.vote.count_down();
            H.vote.istrue = true;
            $(".time-box").removeClass("hidden");
            H.vote.type = 2;
            H.vote.guid = pra.guid;
            $(".swiper-container").removeClass("show").addClass("none");
            $('.items-'+ H.vote.guid).removeClass("none").addClass("show");	
            H.vote.swiper();
            $(".join-btn").html("给TA投票").attr("data-href","").removeClass("none");
            $(".arrow").removeClass("none");
            H.vote.index ++;
            hidenewLoading();
        },
         // 跨天摇奖开启倒计时
        nextCountdown: function(nextTime) {
            H.vote.isCanVote = false;
            H.vote.type = 4;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += H.vote.dec;
            $('.detail-countdown1').attr('etime',beginTimeLong).empty();
            $(".countdown-tip1").html('距下轮投票开始还有');
             H.vote.count_down();
            $('.items-'+ H.vote.guid).removeClass("none").addClass("show");
            $(".join-btn").html("去摇奖").attr("data-href","lottery.html").removeClass('voteOk').removeClass("none");
            $(".arrow").removeClass("none");
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown1').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.vote.istrue){
                        	H.vote.istrue = false;
                        	if (H.vote.type == 1) {   
                        		$(".countdown-tip1").html("请稍后");
                                H.vote.nowCountdown(H.vote.voteTimeList[H.vote.index]);
                            } else if (H.vote.type == 2) {
                                   //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                $(".countdown-tip1").html("请稍后");
	                            if(H.vote.index >= H.vote.voteTimeList.length){
	                                // 如果已经是最后一轮摇奖倒计时结束 则显示 今日所有投票结束
	                                $(".countdown-tip1").html("请稍后");
	                                H.vote.type = 3;
	                                H.vote.change('port');
	                                return;
	                            }
	                            H.vote.beforeShowCountdown(H.vote.voteTimeList[H.vote.index]);
	                           
                            } else if (H.vote.type == 4){
                            	 H.vote.getVoteinfo();
                            }
                        }
                            
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(data){
            $('body').addClass('over');
        	$(".countdown-tip1").html('本期活动已结束，请下期再来');
        }
	};

    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                $('.votNum-' + data.items[i].puid).text(data.items[i].cunt);
            };
        }
    };

    W.callbackVoteguessIsvoteHandler = function(data) {
        if (data.code == 0) {
            if (data.so) {
                var a = data.so.split(',');
                for (var i = 0; i < a.length; i++) {
                    $(".pitems-" + a[i]).addClass("voted");
                };
            }
        }
    };
})(Zepto);

$(function(){
    H.vote.init();
});