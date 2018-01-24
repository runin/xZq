(function($) {
	H.index = {
		slideTo: getQueryString('rp') || '',
		voiceFlag: true,
		init: function() {
			var me = this, delay = Math.ceil(5000*Math.random() + 1000), winW = $(window).width(), winH = $(window).height();
			this.event();
			this.swiperInit();
			this.showCover();
			setTimeout(function(){
				me.activePV_Port();
			}, delay);
			$('body').css({
				'width': winW,
				'height': winH
			});
		},
		event: function() {
			var me = this;
			$('.icon-voice').click(function(e) {
				e.preventDefault();
				if (H.index.voiceFlag) {
					H.index.voiceFlag = false;
					var cdVoice = document.getElementById("cd-voice");
					cdVoice.addEventListener('ended',
					function() {
						$('.cd-voice').removeClass('play');
						$('.cd-voice').get(0).pause();
						$('.cd-voice').get(0).currentTime = 0.0;
						$('.icon-voice').removeClass('icon-voice-play');
					},
					false);
				};
				if ($('.cd-voice').hasClass('play')) {
					$('.cd-voice').removeClass('play');
					$('.cd-voice').get(0).pause();
					$('.cd-voice').get(0).currentTime = 0.0;
					$('.icon-voice').removeClass('icon-voice-play');
				} else {
					$('.cd-voice').addClass('play');
					$('.cd-voice').get(0).play();
					$('.icon-voice').addClass('icon-voice-play');
				};
			});
		},
        activePV_Port: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
		swiperInit: function() {
			scaleW = window.innerWidth / 320;
			scaleH = window.innerHeight / 480;
			var resizes = document.querySelectorAll('.resize');
			for (var j = 0; j < resizes.length; j++) {
				resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
				resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
				resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
				resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
			};
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				onSlideChangeEnd: function(swiper) {
					var activeIndex = parseInt(mySwiper.activeIndex);
					if (activeIndex == 2) {
						if (!$('.cd-voice').hasClass('play')) {
							$('.icon-voice').trigger('click');
						}
					} else {
						if ($('.cd-voice').hasClass('play')) {
							$('.icon-voice').trigger('click');
						}
					}
					if (activeIndex == 3) {
						if (!$('.swiper-slide4').hasClass('load')) {
							$('.swiper-slide4').addClass('load')
						    shownewLoading($('.swiper-slide4'));
						    H.lottery.init();
						    wx.ready(function () {
						        wx.checkJsApi({
						            jsApiList: [
						                'addCard'
						            ],
						            success: function (res) {
						                var t = res.checkResult.addCard;
						                //判断checkJsApi 是否成功 以及 wx.config是否error
						                if(t && !H.lottery.isError){
						                    H.lottery.wxCheck = true;
						                }
						            }
						        });
						        //wx.config成功
						    });
						    wx.error(function(res){
						        H.lottery.isError = true;
						        //wx.config失败，重新执行一遍wx.config操作
						        //H.record.wxConfig();
						    });
						}
						if (H.lottery.safeMode) {
							H.lottery.isCanShake = true;
						} else {
                            if (H.lottery.type == 2 && $('body > .modal').length == 0) {
                                H.lottery.isCanShake = true;
                            } else {
                                H.lottery.isCanShake = false;
                            }
                        }
					} else {
						H.lottery.isCanShake = false;
					}
				}
			});
			if (H.index.slideTo == '1') {
				mySwiper.slideTo(3, 0, false);
				if (!$('.swiper-slide4').hasClass('load')) {
					$('.swiper-slide4').addClass('load')
				    shownewLoading($('.swiper-slide4'));
				    H.lottery.init();
				    wx.ready(function () {
				        wx.checkJsApi({
				            jsApiList: [
				                'addCard'
				            ],
				            success: function (res) {
				                var t = res.checkResult.addCard;
				                //判断checkJsApi 是否成功 以及 wx.config是否error
				                if(t && !H.lottery.isError){
				                    H.lottery.wxCheck = true;
				                }
				            }
				        });
				        //wx.config成功
				    });
				    wx.error(function(res){
				        H.lottery.isError = true;
				        //wx.config失败，重新执行一遍wx.config操作
				        //H.record.wxConfig();
				    });
				}
			}
		},
		showCover: function() {
			var day = timeTransform(new Date().getTime()).split(" ")[0], cover = ['2015-08-22','2015-08-23','2015-08-24','2015-08-25','2015-08-26','2015-08-27','2015-08-28','2015-08-29','2015-08-30'];
			if (cover.indexOf(day) >= 0) {
				var i = cover.indexOf(day) + 1;
				$('.cover').addClass('none');
				$('.cover' + i + '').removeClass('none');
				$('.cover-box .cover' + i + '').animate({'opacity':'1','-webkit-transform':'scale(1,1)'}, 2000, function(){
					$('.cover-box .cover' + i + ' .slogan, .cover-box .tips, .cover-box .sponsor-logo').animate({'opacity':'1'}, 1200);
				});
			} else {
				$('.cover').addClass('none');
				$('.cover1').removeClass('none');
				$('.cover-box .cover1').animate({'opacity':'1','-webkit-transform':'scale(1,1)'}, 2000, function(){
					$('.cover-box .cover1 .slogan, .cover-box .tips, .cover-box .sponsor-logo').animate({'opacity':'1'}, 1200);
				});
			}
		}
	};

    H.lottery = {
        isLottery: false,
        nowTime: null,
        isCanShake: false,
        times:0,
        isToLottey: true,
        isTimeOver: false,
        first: true,
        lotteryTime: getRandomArbitrary(1,2),
        yaoBg: [],
        canJump: true,
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        dec: 0,//服务器时间和本地时间的时差
        firstPra: null,//第一轮摇奖活动 用来重置倒计时
        leftPrizeCountTime: Math.ceil(7000*Math.random() + 8000),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        wxCheck: false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError: false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        pal: [],
        index: 0,
        type: 2,
        safeMode: false,
        firstScroll: true,
        init : function(){
            this.event();
            this.current_time();
            this.shake();
        },
        event: function() {
            $("#test").click(function(e){
                H.lottery.shake_listener();
            });
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        randomBg: function() {
            if(H.lottery.yaoBg.length > 0) {
                var i = Math.floor((Math.random()*H.lottery.yaoBg.length));
                $(".swiper-slide4").css("backgroundImage","url('" + H.lottery.yaoBg[i] + "')");
            }
        },
        shake_listener: function() {
            if(H.lottery.isCanShake){
                H.lottery.isCanShake = false;
            }else{
                return;
            }
            if (H.lottery.type != 2) {
                return;
            }
            H.lottery.times++;
            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            if(!$(".swiper-slide4").hasClass("yao")) {
                // $(".swiper-slide4 .m-f-b").css('-webkit-animation', 'mfoot 2s 1 ease');
                // $(".swiper-slide4 .m-t-b").css('-webkit-animation', 'mtop 2s 1 ease');
                $("#audio-a").get(0).play();
                $(".swiper-slide4 .m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".swiper-slide4 .m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    $(".swiper-slide4 .m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".swiper-slide4 .m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1200);
                $(".swiper-slide4").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);
                }, 2000);
            }else{
                if(!H.lottery.wxCheck){
                    //微信config失败
                    setTimeout(function(){
                        H.lottery.fill(null);
                    }, 2000);
                    return;
                }
                H.lottery.drawlottery();
            }
            if (H.lottery.safeMode) {
            	H.lottery.isToLottey = false;
            } else {
            	H.lottery.isToLottey = true;
            }
        },
        allRecord_Port: function(){
        	var bd, ed;
        	if (H.lottery.nowTime) {
        		bd = ed = H.lottery.nowTime.split(" ")[0];
        	} else {
        		bd = ed = timeTransform(new Date().getTime()).split(" ")[0];
        	}
            getResult('api/lottery/allrecord', { bd: bd, ed: ed, ol: 1 }, 'callbackLotteryAllRecordHandler');
        },
        // leftPrizeCount_Port:function(){
        //     getResult('api/lottery/leftDayCountRedpackPrize',{},'callbackLeftDayCountRedpackPrizeHandler');
        // },
        current_time: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {},
                success: function(data) {
                    if(data.result == true){
                        H.lottery.nowTime = timeTransform(data.sctm);
                    	var nowTime = new Date().getTime();
                        var serverTime = data.sctm;
                        H.lottery.dec = nowTime - serverTime;
                        H.lottery.currentPrizeAct(data);
                    }else{
                        if(H.lottery.repeat_load){
                            H.lottery.repeat_load = false;
                            setTimeout(function(){
                                H.lottery.current_time();
                            },500);
                        }else{
                            hidenewLoading($('.swiper-slide4'));
                            H.lottery.wxCheck = false;
                            H.lottery.safeMode = true;
                            H.lottery.isCanShake = true;
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    hidenewLoading($('.swiper-slide4'));
                    H.lottery.wxCheck = false;
                    H.lottery.safeMode = true;
                    H.lottery.isCanShake = true;
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = H.lottery.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll && prizeActListAll.length > 0) {
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day) {
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            H.lottery.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0) {
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et, nowTimeStr) >= 0) {	//如果最后一轮结束
                    H.lottery.change();
                    return;
                }
                //config微信jssdk
                H.lottery.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	H.lottery.getPort();
                        H.lottery.index = i;
                        H.lottery.nowCountdown(prizeActList[i]);
                        hidenewLoading($('.swiper-slide4'));
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.lottery.index = i;
                        H.lottery.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading($('.swiper-slide4'));
                        return;
                    }
                }
            }else{
                // toUrl('yaoyiyao.html');
                return;
            }
        },
        // 摇奖开启倒计时
        beforeShowCountdown: function(prizeActList) {
            H.lottery.isCanShake = false;
            H.lottery.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.lottery.dec;
            $(".countdown-tip").html('距离本轮摇奖开始还有');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.lottery.count_down();
            $('.countdown').removeClass('none');
            hidenewLoading($('.swiper-slide4'));
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            H.lottery.isCanShake = true;
            H.lottery.type = 2;
            if(prizeActList.bi.length > 0) {
                H.lottery.yaoBg = prizeActList.bi.split(",");
            }
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.lottery.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距离本轮摇奖结束还有");
            H.lottery.count_down();
            $(".countdown").removeClass("none");
            H.lottery.index ++;
            hidenewLoading($('.swiper-slide4'));
        },
        getPort: function() {
            var firstAllRecordTime = Math.ceil(3000*Math.random() + 2000);
            setTimeout(function(){
                H.lottery.allRecord_Port();
            }, firstAllRecordTime);
            setInterval(function(){
                H.lottery.allRecord_Port();
            },this.allRecordTime);
            // setInterval(function(){
            //     H.lottery.leftPrizeCount_Port();
            // },this.leftPrizeCountTime);
        },
        change: function(){
        	hidenewLoading($('.swiper-slide4'));
            $(".countdown-tip").html('今日摇奖已结束，请明天再来');
			$('.detail-countdown').html("");
        	$(".countdown").removeClass("none");
            H.lottery.isCanShake = false;
        },
        fillLotteryBg: function(){
            var t = simpleTpl();
            for(var i = 0; i < H.lottery.yaoBg.length; i++){ t._('<img class="preload" src="' + H.lottery.yaoBg[i] + '">')};
            $("body").append(t.toString());
        },
        count_down: function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '时' + '%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%' + '时' + '%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.lottery.type == 1){
                            //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                            if(!H.lottery.isTimeOver){
                                H.lottery.isTimeOver = true;
                                $('.countdown-tip').html('请稍后');
                                shownewLoading($('.swiper-slide4'));
                                setTimeout(function() {
                                    H.lottery.nowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        }else if(H.lottery.type == 2){
                            //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                            if(!H.lottery.isTimeOver){
                                H.lottery.isTimeOver = true;
                                if(H.lottery.index >= H.lottery.pal.length){
                                    H.lottery.change();
                                    H.lottery.type = 3;
                                    return;
                                }
                                $('.countdown-tip').html('请稍后');
                                shownewLoading($('.swiper-slide4'));
                                setTimeout(function() {
                                    H.lottery.beforeShowCountdown(H.lottery.pal[H.lottery.index]);
                                }, 1000);
                            }
                        }else{
                            H.lottery.isCanShake = false;
                        }
                        return;
                    },
                    sdCallback :function(){
                        H.lottery.isTimeOver = false;
                    }
                });
            });
        },
        drawlottery: function() {
            var me = this;
            var sn = new Date().getTime() + '';
            shownewLoading($('.swiper-slide4'));
            me.lotteryTime = getRandomArbitrary(1,2);
            me.times = 0;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid , sn : sn},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result){
                        if(data.sn == sn){
                            sn = new Date().getTime()+'';
                            H.lottery.lottery_point(data);
                        }
                    }else{
                        sn = new Date().getTime()+'';
                        H.lottery.lottery_point(null);
                    }
                },
                error : function() {
                    sn = new Date().getTime()+'';
                    H.lottery.lottery_point(null);
                }
            });
        },
        fill : function(data){
            setTimeout(function() {
                $(".swiper-slide4").removeClass("yao");
                $(".swiper-slide4 .m-f-b").css('-webkit-animation', 'none');
                $(".swiper-slide4 .m-t-b").css('-webkit-animation', 'none');
                $(".swiper-slide4 .m-f-b").removeAttr("style");
                $(".swiper-slide4 .m-t-b").removeAttr("style");
                H.lottery.randomBg();
            },300);
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                H.dialog.thanks.open();
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
            }

            if(data.pt == 7 || data.pt == 9){
                //卡券，外链
                H.dialog.lottery.open(data);
            }else if(data.pt == 4){
                //红包
                H.dialog.Redlottery.open(data);
            }

        },
        lottery_point : function(data){
            setTimeout(function(){
                H.lottery.fill(data);
                hidenewLoading($('.swiper-slide4'));
            },2000);
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        scroll: function(options) {
            $('.tips-prizeuser').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-26px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        }
    };

    H.dialog = {
        puid: 0,
        ci:null,
        ts:null,
        si:null,
        $container: $('body'),
        open: function() {
            var me = this;
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            this.$dialog.find('.dialog').addClass('bounceInDown');
            setTimeout(function(){
                me.$dialog.find('.dialog').removeClass('bounceInDown');
            }, 1000);
            H.dialog.relocate();
        },
        relocate : function(){
            var height = $(window).height(), width = $(window).width();
            $('.modal, .dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
        },
        lottery: {
            $dialog: null,
            url:null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
            name:'',
            mobile:'',
            open: function(data) {
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
                H.dialog.lottery.readyFunc();
                H.lottery.canJump = false;
            },
            close: function() {
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    recordUserOperate(openid, "关闭卡券弹层", "wxcard-close");
                    H.lottery.isCanShake = true;
                    H.lottery.canJump = true;
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-getluck').click(function(e) {
                    e.preventDefault();
                    if($("#lot-inp").hasClass("none") || me.check()){
                        H.lottery.isCanShake = false;
                        if(!$('#btn-getluck').hasClass("flag")){
                            $('#btn-getluck').addClass("flag");
                            if(me.pt == 7){
                                shownewLoading();
                                me.close();
                                me.sto = setTimeout(function(){
                                    H.lottery.isCanShake = true;
                                    hidenewLoading();
                                },15000);
                                $('#btn-getluck').text("领取中");
                                H.lottery.wxCheck = false;
                                setTimeout(function(){
                                    me.wx_card();
                                },1000);
                            }
                        }
                    }
                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        H.lottery.wxCheck = true;
                        H.lottery.canJump = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname,
                            rn: encodeURIComponent(me.name),
                            ph: me.mobile
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        H.lottery.isCanShake = true;
                        H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "wxcard-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.lottery.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    $(".lottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    if (data.tt) {
                        $(".lottery-dialog").addClass('tips').find(".award-luck").html(data.tt);
                    } else {
                        $(".lottery-dialog").removeClass('tips').find(".award-luck").html('恭喜您获得');
                    }
                    if(data.cu == 1){
                        $('.strick-box').css({
                            'top': ($(window).height()*0.18) / 2
                        });
                        $('#lot-inp .name').val(data.rn || '');
                        $('#lot-inp .phone').val(data.ph || '');
                        $("#lot-inp").removeClass("none");
                    }else{
                        $('.strick-box').css({
                            'top': ($(window).height()*0.32) / 2
                        });
                        $("#lot-inp").addClass("none");
                    }
                    if (data.pd && data.ru) {
                        $('.lottery-link').html(data.pd).attr('href', data.ru).removeClass('none');
                    } else {
                        $('.lottery-link').addClass('none');
                    }
                    if(data.pt == 7){
                        me.ci = data.ci;
                        me.ts = data.ts;
                        me.si = data.si;
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="lottery-dialog">')
                    ._('<div class="dialog lottery-dialog">')
                        ._('<div class="strick-box">')
                            ._('<a href="#" class="btn-close"></a>')
                            ._('<img src="./images/icon-dialog-header.png"><div class="box">')
                                ._('<div class="lott-box" id="lott">')
                                    ._('<p class="award-luck"></p>')
                                    ._('<img class="award-img" src="./images/blank.png">')
                                    ._('<div class="inp" id="lot-inp">')
                                        ._('<p class="ple">请填写您的联系方式 以便顺利领奖</p>')
                                        ._('<p><input class="name" placeholder="姓名:"></p>')
                                        ._('<p><input class="phone" type="tel" placeholder="电话:" maxlength="11"></p>')
                                    ._('</div>')
                                    ._('<a class="lottery-btn btn" id="btn-getluck" href="#" data-collect="true" data-collect-flag="getluck-btn" data-collect-desc="弹层卡券领取按钮">领&nbsp;&nbsp;取</a>')
                                    ._('<a class="lottery-link none" data-collect="true" data-collect-flag="link-btn" data-collect-desc="弹层外链点击按钮"></a>')
                                ._('</div>')
                            ._('</div><img src="./images/icon-dialog-footer.png">')
                        ._('<div>')
                      ._('</div>')
                    ._('</div>');
                return t.toString();
            },
            check:function(){
                var me = this;
                var $mobile = $('.phone'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                }else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                }
                me.name = name;
                me.mobile = mobile;
                return true;
            }
        },
        Redlottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                H.lottery.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                me.update(data);
                H.lottery.canJump = false;
            },
            close: function() {
                H.lottery.isCanShake = true;
                H.lottery.canJump = true;
                var me = this;
                this.$dialog.find('.dialog').addClass('bounceOutDown');
                setTimeout(function(){
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function() {
                var me = this;
                this.$dialog.find("#btn-red").click(function(e){
                    e.preventDefault();
                    if(!$('#btn-red').hasClass("requesting") && me.rp){
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('#btn-red').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },500);
                    }
                });
                this.$dialog.find(".strick-box .box").click(function(e){
                    e.preventDefault();
                    if(!$('#btn-red').hasClass("requesting") && !$('.strick-box .box').hasClass("requesting") && me.rp){
                        shownewLoading();
                        $('#btn-red').addClass("requesting");
                        $('.strick-box .box').addClass("requesting");
                        $('#btn-red').text("领取中");
                        setTimeout(function(){
                            location.href = me.rp;
                        },500);
                    }
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(data) {
                var me = this;
                if(data.result && data.pt == 4){
                    me.rp = data.rp;
                    $(".redlottery-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    if (data.tt) {
                        $(".redlottery-dialog").addClass('tips').find(".award-lpt").html(data.tt);
                    } else {
                        $(".redlottery-dialog").removeClass('tips').find(".award-lpt").html('恭喜您获得');
                    }
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<div class="modal modal-lottery" id="Redlottery-dialog">')
                    ._('<div class="dialog redlottery-dialog">')
                        ._('<div class="strick-box">')
                            ._('<a href="#" class="btn-close"></a>')
                            ._('<img src="./images/icon-dialog-header.png"><div class="box">')
                            ._('<p class="award-lpt"></p>')
                            ._('<img class="award-img" src="./images/blank.png">')
                            ._('<a class="lottery-btn" id="btn-red" data-collect="true" data-collect-flag="redbag-btn" data-collect-desc="弹层红包领取按钮">领&nbsp;&nbsp;取</a>')
                        ._('</div><img src="./images/icon-dialog-footer.png"></div>')
                    ._('</div>')
                ._('</div>');
                return t.toString();
            }
        },
        // 谢谢参与
        thanks: {
            $dialog: null,
            open: function () {
                var me = this;
                H.dialog.open.call(this);
                this.event();
            },
            close: function () {
                var me = this;
                this.$dialog.find('.dialog').removeClass('bounceInDown').addClass('bounceOutDown');
                setTimeout(function(){
                    H.lottery.isCanShake = true;
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                }, 1000);
            },
            event: function () {
                var me = this;
                this.$dialog.find('.thanks-close').click(function (e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function () {
                var t = simpleTpl();
                t._('<div class="modal modal-rul" id="thanks-dialog">')
                    ._('<div class="dialog thanks-dialog"><div class="thanks-box"><i class="thanks-close"></i><img src="./images/icon-thanks.png"></div></div>')
                ._('</div>');
                return t.toString();
            }
        }
    };

    W.commonApiSPVHander = function(data){
        if(data.code == 0){
        	if (data.c != 0) {
            	$(".join-pv label").html(data.c);
            	$(".join-pv").removeClass("none");
        	} else {
        		$(".join-pv").addClass("none");
        	}
        } else {
            $(".join-pv").addClass("none");
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length > 0){
        		$('.tips-prizename').addClass('tips-prizename-out');
                var con = "";
                for(var i = 0 ; i<list.length; i++) {
                    con += '<li>恭喜<label class="wx-username">' + (list[i].ni ? list[i].ni.substr(0,6) : '匿名用户') + '</label>获得<label class="wx-bigprize">' + (list[i].pn || '一汽丰田皇冠使用权') + '</label></li>';
                };
                if (list.length == 1) {
                    $('.tips-prizeuser').addClass('shine');
                    $(".tips-prizeuser").find("ul").html(con);
                } else {
                    var len = $(".tips-prizeuser").find("li").length;
                    if(len >= 500){
                        $(".tips-prizeuser").find("ul").html(con);
                    }else{
                        $(".tips-prizeuser").find("ul").append(con);
                    }
                    $('.tips-prizeuser').removeClass('shine');
                    if(H.lottery.firstScroll) {
                        H.lottery.firstScroll = false;
                        H.lottery.scroll();
                    }
                }
                $(".tips-prizeuser").removeClass("none");
            } else {
        		$('.tips-prizeuser').addClass('none');
        		$('.tips-prizename').removeClass('tips-prizename-out');
            }
        } else {
        	$('.tips-prizeuser').addClass('none');
        	$('.tips-prizename').removeClass('tips-prizename-out');
        }
    };

    // W.callbackLeftDayCountRedpackPrizeHandler = function(data){
    //     if(data.result){
    //         $(".tips-leftredbag").find("label").text(data.lc);
    //         if(data.lc == 0){
    //             $(".tips-leftredbag").css("opacity","0");
    //         }else{
    //             $(".tips-leftredbag").css("opacity","1");
    //         }
    //     }
    // };

	W.callbackLotteryAwardHandler = function(data) {};
})(Zepto);

$(function() {
	H.index.init();
});