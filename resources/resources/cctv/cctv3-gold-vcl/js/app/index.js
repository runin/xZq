(function($) {
	H.index = {
        dec: 0,
        lotteryDec: 0,
        index: 0,
        voteTimeList: [],
        roundData:null,
        lotteryNowTime: null,
        repeat_load: true,
        pid: null,
        guid: null,
        nowTime: null,
        endTime: null,
        isTimeOver: false,
        showFlag: false,    //showFlag:true 显示商品价格  showFlag:false 不显示商品价格
        showEtime: null,
        inforoudPortFlag: true,    //主活动信息服务接口的标识，true为可以在上次接口回调失败中再调一次接口，false为不能再调用接口
        fromURL: getQueryString('fromURL'),
        swiperPlayer: null,
        playerPid: null,
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
        canJump:true,
		init: function() {
            var me = this, delay = Math.ceil(700*Math.random() + 300), winW = $(window).width(), winH = $(window).height();
			this.event();
			this.initResize();
			this.swiperInit();
			this.getVoteinfo();
            this.prereserve();
            if (me.fromURL == 'lottery') {
                me.hideCover();
            } else {
                me.showCover();
            }
		},
		initResize: function() {
			var me = this, winW = $(window).width(), winH = $(window).height();
			$('body, .cover-box').css({'width': winW, 'height': winH});
            $('#article, #comments').css('height', Math.ceil(winH * 0.68));
            $('.avatar-comment').attr('src', headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg');
            $('.ctrls .input-box input').css('width', winW - 130);
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
            }).delegate('.btn-like', 'click', function(e) {
				e.preventDefault();
                if ($(this).hasClass('disabled-liked')) {
                    showTips('活动还未开始<br><p style="font-size:16px;font-weight:bolder;">每周日21:00准时收看</p>');
                    return;
                }
                if ($(this).hasClass('off-liked')) {
                    showTips('还未开始呢~请稍等');
                    return;
                }
                if ($(this).hasClass('over-liked')) {
                    showTips('为出场选手点赞吧~');
                    return;
                }
                if ($(this).hasClass('query-liked')) {
                    showTips('系统正在查询中~请稍等');
                    return;
                }
                if ($(this).hasClass('liked')) {
                    showTips('您已经赞过了~');
                    return;
                }
                getResult('api/voteguess/guessplayer', { yoi: openid, guid: $(this).parent('.swiper-slide').attr('data-guid'), pluids: $(this).parent('.swiper-slide').attr('data-pid') }, 'callbackVoteguessGuessHandler');
                $(this).addClass('liked').html('已&nbsp;&nbsp;&nbsp;赞');
                var nowVotes = parseInt($(this).parent('.swiper-slide').find('.like-num label').text()) || 0;
                $(this).addClass('liked').parent('.swiper-slide').find('.like-num label').html(nowVotes + 1);
                me.canJump = false;
                $('.luck-box').removeClass('none');
                me.playerPid = $(this).attr('data-pid');
			}).delegate('#btn-comment', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                var comment = $.trim($("#input-comment").val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if (len < 1) {
                    showTips('说说你的看法吧~');
                    $("#input-comment").focus();
                    return;
                } else if (len > 21) {
                    showTips('看法不能超过20字哦~');
                    $("#input-comment").focus();
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '发送中...');
                setTimeout(function(){
                    $("#btn-comment").removeClass('requesting');
                    showTips('发送成功');
                    var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                    barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                    $('.isme').parent('div').addClass('me');
                    $("#input-comment").removeClass('error').val('');
                    hidenewLoading();
                }, 300);
                // shownewLoading();
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : '',
                        headimgurl: headimgurl ? headimgurl : ''
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                    },
                    success : function(data) {
                    }
                });
            }).delegate('.btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                cookie4toUrl('lottery.html');
            }).delegate('.cover-box', 'click', function(e) {
                e.preventDefault();
                me.hideCover();
            }).delegate('.icon-giftbox-before', 'click', function(e) {
                e.preventDefault();
                $('.icon-giftbox-before, .icon-boxdoll').addClass('none');
                $('.icon-giftbox-after').removeClass('none');
                // $(this).animate({'opacity': '0'}, 400);
                // $('.icon-giftbox-after').animate({'opacity': '1'}, 50);
                $('.fly-box').addClass('on').animate({'opacity': '1', '-webkit-transform': 'scale(1.3)'}, 500);
                if(!openid || openid=='null'){
                    me.voteLottery_show(null);
                }else{
                    // if(!me.wxCheck){
                    //     //微信config失败
                    //     me.voteLottery_show(null);
                    //     return;
                    // }
                    me.voteLottery_port();
                }
            });
		},
        voteLottery_port: function() {
            var me = this, sn = new Date().getTime() + '';
            if (me.playerPid) {
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/lottery/luck4Vote' + dev,
                    data: { oi: openid , sn : sn, sau: me.playerPid },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                    timeout: 10000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.flow && data.flow == 1){
                            sn = new Date().getTime() + '';
                            me.voteLottery_show(null);
                            return;
                        }
                        if(data.result){
                            if(data.sn == sn){
                                sn = new Date().getTime() + '';
                                me.voteLottery_show(data);
                            }
                        }else{
                            sn = new Date().getTime() + '';
                            me.voteLottery_show(null);
                        }
                    },
                    error : function() {
                        sn = new Date().getTime() + '';
                        me.voteLottery_show(null);
                    }
                });
            } else {
                sn = new Date().getTime() + '';
                me.voteLottery_show(null);
            }
        },
        voteLottery_show: function(data) {
            if(data == null || data.result == false || data.pt == 0){
                H.dialog.thanks4vote.open();
                return;
            }else{
                $("#audio-b").get(0).play();
            }
            if (data.pt == 1) {
                H.dialog.shiwuLottery4vote.open(data);
            } else if (data.pt == 7) {
                H.dialog.wxcardLottery4vote.open(data);
            } else {
                H.dialog.thanks4vote.open();
            }
        },
		swiperInit: function() {
            var me = this, resizes = document.querySelectorAll('.resize'), scaleW = window.innerWidth / 320, scaleH = window.innerHeight / 480;
			for (var j = 0; j < resizes.length; j++) {
				resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
				resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
				resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
				resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px';
			};
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				parallax: true,
        		speed: 600,
				onSlideChangeEnd: function(swiper) {
				}
			});
            if (me.fromURL == 'lottery') {
                mySwiper.slideTo(1, 1000, false);
            }
		},
		swiperPlayerInit: function(flag) {
            var me = this, swiper = new Swiper('.swiper-container-player', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                spaceBetween: 5
            });
            me.swiperPlayer = swiper;
            swiper.slideTo(flag, 1000, false);
            $('.swiper-container-player').animate({'opacity':'1'}, 500);
		},
		showCover: function() {
			shownewLoading();
			var me = this, Img = new Image();
			Img.src = 'images/bg-cover.jpg';
			Img.onload = function (){
				hidenewLoading();
				setTimeout(function() {
					me.hideCover();
				}, 3000);
			};
		},
		hideCover: function(){
			$('.cover-box').animate({'opacity': '0', '-webkit-transform': 'scale(.6)'}, 500, function(){
				$('.cover-box').addClass('none');
			});
		},
        lotteryRound_port: function(){
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.index.lotteryNowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        H.index.lotteryDec = nowTimeStemp - data.sctm;
                        H.index.roundData = data;
                        H.index.currentPrizeAct(data);
                    }else{
                        if(H.index.repeat_load){
                            H.index.repeat_load = false;
                            setTimeout(function() {
                                H.index.lotteryRound_port();
                            }, 500);
                        }else{
                            $('.btn-go2lottery').addClass('none');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    $('.btn-go2lottery').addClass('none');
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.index.nowTime,
                prizeActList = [],
                me = this;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    $('.btn-go2lottery').addClass('none');
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                H.index.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                H.index.lastRound = false;
                                H.index.nextPrizeAct = prizeActList[i+1];
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            H.index.endType = 1;
                            H.index.lastRound = true;
                        }
                        H.index.nowCountdown(prizeActList[i]);
                        $('.btn-go2lottery').removeClass('none');
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        $('.btn-go2lottery').addClass('none');
                        return;
                    }

                }
            }else{
                toUrl('yaoyiyao.html');
                return;
            }
        },
        getVoteinfo: function() {
        	var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud' + dev,
                data: { yoi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.items) {
                            me.pid = data.pid;
                            me.nowTime = timeTransform(parseInt(data.cud));
                            me.dec = new Date().getTime() - parseInt(data.cud);
                            me.voteData = data;
                            me.countdownInfo(data);
                        } else {
                        	me.safeMode(JSON.stringify(data));
                        }
                    } else {
                        if (me.inforoudPortFlag) {
                            me.inforoudPortFlag = false;
                            setTimeout(function(){
                                me.getVoteinfo();
                            }, 2000);
                        } else {
                        	// me.safeMode(JSON.stringify(data));
                            // cookie4toUrl('yaoyiyao.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	me.safeMode(JSON.stringify(error));
                }
            });
        },
        safeMode: function(data) {
        	alert(data || 'undefined error!');
	        // cookie4toUrl('lottery.html');
        },
        getVote: function() {
            getResult('api/voteguess/isvoteall', { yoi: openid }, 'callbackVoteguessIsvoteAllHandler');
        },
        fillVoteinfo: function(data, flag) {
            var me = this, t = simpleTpl(), items = data.items, voteSupportDelay = Math.ceil(700*Math.random() + 300), detailContent = '';
            if (items.length > 0) {
                for(var i = 0, len = items.length; i < len; i++) {
                    if (items[i].pitems) {
                        if (i < flag) {
                            likeStatus = ' over-liked';
                            likeTips = '已结束';
                        } else if (i == flag) {
                            likeStatus = '';
                            likeTips = '点&nbsp;&nbsp;&nbsp;赞';
                        } else if (i > flag) {
                            likeStatus = ' off-liked';
                            likeTips = '未开始';
                        } else {
                            likeStatus = ' query-liked';
                            likeTips = '查询中';
                        }
                        for(var h = 0, hLen = items[i].pitems.length; h < hLen; h++) {
                            var rdTickes = getRandomArbitrary(9157,21388);
                            t._('<section id="player' + (i + 1) + '" class="swiper-slide" data-guid="' + items[i].guid + '" data-pid="' + items[i].pitems[h].pid + '">')
                                ._('<section class="player-box">')
                                    ._('<section class="info-box">')
                                        ._('<h5 class="like-num none" id="like-num-' + items[i].pitems[h].pid + '"><label>' + rdTickes + '</label>票</h5>')
                                        ._('<p class="playername">' + items[i].pitems[h].na + '</p>')
                                        ._('<p class="age">年龄：' + items[i].pitems[h].ni + '</p>')
                                        ._('<p class="description">' + items[i].pitems[h].in + '</p>')
                                    ._('</section>')
                                    ._('<img src="./images/icon-loader.png" data-src="' + items[i].pitems[h].im + '" class="swiper-lazy">')
                                ._('</section>')
                                ._('<section class="swiper-lazy-preloader swiper-lazy-preloader-white"></section>')
                                ._('<a href="javascript:void(0);" class="btn-go2lottery none">赶紧去摇奖</a>')
                                ._('<a href="javascript:void(0);" id="like-' + items[i].pitems[h].pid + '" data-pid="' + items[i].pitems[h].pid + '" class="btn-like none' + likeStatus + '">' + likeTips + '</a>')
                           ._('</section>')
                        };
                    }
                };
                $('.swiper-container-player').find('.swiper-wrapper').html(t.toString());
                me.swiperPlayerInit(flag);
                me.getVote();
                me.voteSupport();
                H.comment.init();
            } else {
                cookie4toUrl('lottery.html');
            }
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.items;
            console.log(me.voteTimeList);
            me.dec = new Date().getTime() - data.cud;
            me.updateDec();
            voteTimeListLength =  me.voteTimeList.length;
            me.endTime =  me.voteTimeList[voteTimeListLength-1].get;
            //最后一轮结束
            if (comptime(me.voteTimeList[voteTimeListLength-1].get, nowTimeStr) >=0) { 
                me.guid = me.voteTimeList[voteTimeListLength-1].guid;
                me.change();
                return;
            };
            //第一轮开始之前
            if(comptime(me.voteTimeList[0].gst, nowTimeStr) < 0) {
                me.index = 0;
                me.guid = me.voteTimeList[0].guid;
                me.showEtime = me.voteTimeList[0].get;
                me.fillVoteinfo(data);
                me.lotteryCountdown(me.voteTimeList[0]);
                me.showFlag = true;
                me.tttj();
                $('.btn-like').removeClass('query-liked').addClass('disabled-liked').html('活动未开始');
                $.fn.cookie('jumpNum', 0, {expires: -1});
                return;
            }
            for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].gst, endTimeStr = me.voteTimeList[i].get;
                 //活动正在进行
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    me.index = i;
                    me.showFlag = false;
                    me.fillVoteinfo(data, i);
                    me.nowCountdown(me.voteTimeList[i]);
                    me.guid = me.voteTimeList[i].guid;
                    me.tttj();
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){    //活动还未开始
                    me.index = i;
                    me.showFlag = true;
                    me.fillVoteinfo(data, i);
                    me.beforeShowCountdown(me.voteTimeList[i]);
                    me.guid = me.voteTimeList[i].guid;
                    me.tttj();
                    $('.swiper-container-player .btn-like').removeClass('disabled-liked').addClass('off-liked').html('未开始');
                    if (!$('#player' + (me.index)).hasClass('liked')) {
                        $('#player' + (me.index)).find('.btn-like').removeClass('disabled-liked, off-liked').addClass('over-liked').html('已结束');
                    }
                    setTimeout(function(){
                        $('.btn-go2lottery').removeClass('none');
                    }, 200);
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    return;
                }
            };
        },
        updateDec: function() {
            var delay = Math.ceil(60000 * 5 * Math.random() + 60000 * 3);
            setInterval(function() {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'commonApiTimeHandler',
                    timeout: 10000,
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.t){
                            H.index.dec = new Date().getTime() - data.t;
                        }
                    },
                    error: function(xmlHttpRequest, error) {
                    }
                });
            },delay);
        },
        // 摇奖开启倒计时
        lotteryCountdown: function(pra) {
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.index.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.index.count_down();
            $(".countdown-tip label").html('距离节目开始还有');
            H.index.guid = pra.guid;
            hidenewLoading();
            $('.countdown').removeClass('none');
        },
        // 开启倒计时
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.index.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.index.count_down();
            $(".countdown-tip label").html('距离本轮投票开始还有');
            H.index.guid = pra.guid;
            // H.index.index++;
            hidenewLoading();
            $('.countdown').removeClass('none');
        },
        // 结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.get;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.index.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.index.count_down();
            $(".countdown-tip label").html("距离本轮投票结束还有");
            H.index.guid = pra.guid;
            $(".time-box").removeClass("hidden");
            H.index.index++;
            hidenewLoading();
            $('.countdown').removeClass('none');
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/allplayertickets', { periodUuid: me.pid }, 'callbackVoteguessAllplayerticketsHandler');
        },
        count_down : function() {
            var that = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%' + '<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%'+'<i>秒</i>',
                    stpl : '<span class="fetal-H">%H%' + '<i>时</i></span>' + '%M%' + '<i>分</i>' + '%S%'+'<i>秒</i>',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(that.canJump) {
                            if(!that.isTimeOver){
                                that.isTimeOver = true;
                                if (that.index == that.voteTimeList.length) {
                                    that.change();
                                    return;
                                }
                                if (that.showFlag) {
                                    $(".countdown-tip label").html('距离本轮投票结束还有');
                                    console.log(that.voteTimeList);
                                    $('.detail-countdown').attr('etime', timestamp(that.voteTimeList[that.index].get) + that.dec);
                                    // if (!$('.swiper-container-player .btn-like').hasClass('over-liked')) {
                                    //     $(this).removeClass('disabled-liked').addClass('off-liked').html('未开始');
                                    // }
                                    $('.swiper-container-player .btn-like').each(function(index, el) {
                                        if (!$(this).hasClass('over-liked')) {
                                            $(this).removeClass('disabled-liked').addClass('off-liked').html('未开始');
                                        }
                                    });
                                    if (!$('#player' + (that.index + 1)).hasClass('liked')) {
                                        $('#player' + (that.index + 1)).find('.btn-like').removeClass('disabled-liked, off-liked').html('点&nbsp;&nbsp;&nbsp;赞');
                                    }
                                    that.index++;
                                    $('.btn-go2lottery').animate({'opacity':'0'}, 300, function(){
                                        $('.btn-go2lottery').addClass('none');
                                    });
                                    that.showFlag = false;
                                } else {
                                    // $('.swiper-container').animate({'opacity':'0'}, 500);
                                    // toUrl('lottery.html');
                                    $(".countdown-tip label").html('距离本轮投票开始还有');
                                    console.log(that.voteTimeList[that.index].gst);
                                    $('.detail-countdown').attr('etime', timestamp(that.voteTimeList[that.index].gst) + that.dec);
                                    $('.swiper-container-player .btn-like').each(function(index, el) {
                                        if (!$(this).hasClass('liked')) {
                                            $(this).removeClass('disabled-liked').addClass('off-liked').html('未开始');
                                        }
                                    });
                                    that.swiperPlayer.slideTo(that.index, 1000, false);
                                    setTimeout(function(){
                                        $('.btn-go2lottery').removeClass('none').animate({'opacity':'1'}, 300);
                                    }, 1000);
                                    that.showFlag = true;
                                }
                            }
                        }
                        return;
                    },
                    sdCallback :function(){
                        that.isTimeOver = false;
                    }
                });
            });
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        change: function() {
            $('.swiper-container').animate({'opacity':'0'}, 800);
            cookie4toUrl('over.html');
        }
	};

    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),  
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            getResult('api/comments/room?temp=' + new Date().getTime(), {
                anys: H.index.guid,
                ps: me.pageSize,
                maxid: me.maxid
            }, 'callbackCommentsRoom');
        }
    };

    W.callbackCommentsRoom = function(data) {
        if (data.code == 0) {
            H.comment.maxid = data.maxid;
            var items = data.items || [];
            for (var i = 0, len = items.length; i < len; i++) {
                var hmode = "<div class='c_head_img'><img src='./images/avatar/default-avatar.jpg' class='c_head_img_img'></div>";
                if (items[i].hu) {
                    if (items[i].hu.indexOf('.jpg') || items[i].hu.indexOf('.jepg') || items[i].hu.indexOf('.png')) {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + " class='c_head_img_img'></div>";
                    } else {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img'></div>";
                    }
                }
                barrage.pushMsg(hmode + items[i].co);
            };
        }
    };
    
    W.callbackVoteguessGuessHandler = function(data) {};

    W.callbackVoteguessIsvoteAllHandler = function(data) {
        if (data.code == 0) {
            if (data.items) {
                var items = data.items, length = data.items.length;
                for (var i = 0; i < length; i++) {
                    if (data.items[i].so) {
                        var soList = data.items[i].so.split(',');
                        var soLength = soList.length;
                        for (var j = 0; j < soLength; j++) {
                            $('#like-' + soList[j]).removeClass('disabled-liked').addClass('liked').html('已&nbsp;&nbsp;&nbsp;赞');
                            if (j == soLength - 1) {
                                $('.btn-like').removeClass('none');
                            }
                        };
                    } else {
                        $('.btn-like').removeClass('none');
                    }
                };
            } else {
                $('.btn-like').removeClass('none');
            }
        } else {
            $('.btn-like').removeClass('none');
        }
    };

    W.callbackVoteguessAllplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                $('#like-num-' + data.items[i].puid).removeClass('none').find('label').html(data.items[i].cunt);
            };
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                shownewLoading(null, '请稍后...');
                location.href = data.url;
            });
        } else {
            $('#tttj').remove();
        };
    };
})(Zepto);

$(function() {
	H.index.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.index.isError){
                    H.index.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.index.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});