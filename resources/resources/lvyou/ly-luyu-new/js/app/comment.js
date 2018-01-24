(function($) {
	H.comments = {
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:10,
		item_index : 0,
		commActUid: "",
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
        hotIsZ:[],
        attrUuid: null,
		init : function(){
            H.comments.resize();
        },
        resize: function () {
            var winW = $(window).width(),winH=$(window).height();
            $("header").css({"top":(winH *.06+28)+"px","height":(winH *.85-68)+"px"});
            H.comments.event_handler();
        },
		event_handler: function() {
			var me = this;
			$('body').delegate('.show-all', 'click', function(e) {
				e.preventDefault();
				var $class_all = $(this).parent('div').find('.all-con');
				$class_all.find('span').toggleClass('all');
				if( $class_all.find('span').hasClass('all')){
					$(this).text('^显示全部');
				}else{
					$class_all.css('height','auto');
					$(this).text('^收起');
				}
			}).delegate('.baoliao', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('clue.html');
                }
            }).delegate('.countdown', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });

			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					$fix.removeClass('none');
					$(".top-back").removeClass('none');
				}else if(scroH == 0){
					$fix.addClass('none');
					$(".top-back").addClass('none');
				}
			});
			
			var range = 2, //距下边界长度/单位px
			maxpage = 100, //设置加载最多次数
			totalheight = 0;
			$('header').scroll(function(){
			    var srollPos = $('header').scrollTop();
			    totalheight = parseFloat($('header').height()) + parseFloat(srollPos);
				if (($('#sx-ul').height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {
					if ($('#qy_loading').length > 0) {
						return;
					}
					H.comments.getList(H.comments.page);
			    }
            });
			
			$("#send").click(function(){
                if($.trim($("#comments-info").val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim($("#comments-info").val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim($("#comments-info").val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                }
				//if(!$.trim($("#comments-info").val())){
				//	showTips('请填写评论');
				//	$("#comments-info").focus();
				//	return;
				//}
				if(openid != null){
					$("#send").attr("disabled","disabled");
					$("#comments-info").attr("disabled","disabled");
					if(headimgurl != null && headimgurl.indexOf("./images/avatar.png") > 0){
						headimgurl='';
					}
					getResult('api/comments/save', {
						co:encodeURIComponent($("#comments-info").val()),
						op:openid,
						tid:H.comments.commActUid, 
						ty:1,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
			$("#back-index").click(function(e){
				e.preventDefault();
				toUrl("index.html");
			});
		},
		getList:function(page){
			if(page - 1  == this.beforePage){
				getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList', true);
			}
		},
		bindZanClick: function(cls){
			$("."+cls).click(function(){
                var isHotZaned = false;
				if($(this).hasClass('z-ed')){ return; }
                for(var i=0;i<H.comments.hotIsZ.length;i++){
                    if(H.comments.hotIsZ[i] == $(this).parent().parent().attr("data-uuid")){isHotZaned=true}
                }
                //if($(this).parent().parent().attr("data-uuid")){
                //
                //}
                $(this).addClass("curZan").addClass('z-ed');
                if(isHotZaned){
                    $(".curZan").text($(".curZan").text()*1 + 1);
                    $(".curZan").removeClass("curZan");
                    showTips('您已经给这条评论点过赞了');
                    return;
                }else{
                    H.comments.hotIsZ.push($(this).parent().parent().attr("data-uuid"));
                }
				getResult('api/comments/praise', {
					uid:$(this).parent().parent().attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise');
			});
		},
		is_show: function(i){
			var $all_con = $('#all-con' + i);
			var height = $all_con.height(),
				inner_height = $all_con.find('span').height();
			if(inner_height > height){
				$all_con.find('span').addClass('all');
				$('#show-all' + i).removeClass('none');
			}
		},
		tpl: function(data) {
			var me = this, t = simpleTpl(),item = data.items || [],len = item.length,  $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
            if(data.kind == 1){
                if(len>4)len = 4;
            }
            for (var i = 0; i < len; i++) {
				try{
                    var isZan = item[i].isp ? "z-ed":"";
                }catch(e){}
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<section class="avatar"><img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.png')+'"/></section>')
					._('<div>')
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
					._('</div>')
					._('</li>');
				++ me.item_index;
			}
			if(data.kind == 1){
				$top_comment.append(t.toString());
			}else{
				$nor_comment.append(t.toString());
			}
			// for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			H.comments.bindZanClick("zan");
		},
		currentComments : function(commActUid) {
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,dt:1,zd:0,kind:1}, 'callbackCommentsList',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,dt:0,zd:0,kind:0}, 'callbackCommentsList');
            getResult('api/comments/count', {anys:H.comments.commActUid}, 'callbackCommentsCount', true);
        }
	};


	W.callbackCommentsList = function(data){
		if(data.code == 0){
			if (data.items.length < H.comments.pageSize && data.kind == 0) {
				H.comments.loadmore = false;
			}
			if(data.items.length == H.comments.pageSize){
				if(H.comments.page == 0){
					H.comments.beforePage = 1;
					H.comments.page = 2;
				}else{
					H.comments.beforePage = H.comments.page;
					H.comments.page++ ;
				}
			}
			H.comments.tpl(data);

            $('#nor-comment li').unbind('click');
            $('#nor-comment li').click(function(e) {
                e.preventDefault();
                var me = this;
                //if ($(me).hasClass('big')) {
                //    $(me).removeClass('big');
                //} else {
                //    $('#nor-comment li').removeClass('big');
                //    $(me).addClass('big');
                //}
            });
		}else {
		}
	};
	
	W.callbackCommentsSave = function(data){
		if(data.code == 0 ){
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.png';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl(),$nor_comment = $('#nor-comment');
			t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
			._('<section class="avatar"><img src="'+ headImg +'"/></section>')
			._('<div>')
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				// ._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示">^显示全部</a>')
			._('</div>')
			._('</li>');

			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}
			H.comments.is_show(data.uid);
			$("#comments-info").val("");
			H.comments.bindZanClick("zan-"+data.uid);
			$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);

			var navH = $("#"+data.uid).offset().top;
			$(window).scrollTop(navH);
			
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			showTips('评论失败');
			// $("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}

        $('#nor-comment li').unbind('click');
        $('#nor-comment li').click(function(e) {
            e.preventDefault();
            var me = this;
            //if ($(me).hasClass('big')) {
            //    $(me).removeClass('big');
            //} else {
            //    $('#nor-comment li').removeClass('big');
            //    $(me).addClass('big');
            //}
        });
	};
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};

	W.callbackVoteguessInfoHandler = function(data){
		if(data.code == 0){
            H.comments.commActUid = data.pid;
            H.comments.currentComments();
        }
	};

	W.callbackCommentsCount = function(data){
		if(data.code == 0){
            $(".tt-numb").removeClass('none');
            $(".tt-numb>p").html((data.tc?data.tc:'0')+"评论");
        }
	};

    H.lottery = {
        dec: 0,
        sau: 0,
        type: 2,
        index: 0,
        times: 0,
        endType: 1,
        pal: null,
        nowTime: null,
        pingFlag: null,
        roundData: null,
        nextPrizeAct: null,
        canJump: true,
        wxCheck: false,
        isError: false,
        safeFlag: false,
        lastRound: false,
        isToLottey: true,
        isCanShake: false,
        isTimeOver: false,
        repeat_load: true,
        recordFirstload: true,
        sponsorDetailFlag: false,
        lotteryImgList: [],
        lotteryTime: getRandomArbitrary(1,3),
        allRecordTime: Math.ceil(40000*Math.random() + 100000),
        init: function() {
            this.event();
            //this.resize();
            //this.getUserinfo_port();
            this.getSau_port();
            this.lotteryRound_port();
            //this.shake();
        },
        resize: function() {
            var me = this, winW = $(window).width(), winH = $(window).height();
            if(!is_android()){
                $(".main-top").css("height", (winH / 2) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2) + "px").css('bottom', '0');
            } else {
                $(".main-top").css("height", (winH / 2 + 0.5) + "px").css('top', '0');
                $(".main-foot").css("height", (winH / 2 + 0.5) + "px").css('bottom', '0');
            }
        },
        event: function() {
        },
        getSau_port: function() {
            getResult("api/linesdiy/info", {}, "callbackLinesDiyInfoHandler");
        },
        getUserinfo_port: function() {
            getResult("api/user/info_v2", {oi: openid}, "callbackUserInfoHandler");
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        ping: function() {
            var me = this;
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
                        me.safeLotteryMode('off');
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        checkPing: function() {
            var me = this, delay = Math.ceil(60000*2*Math.random() + 60000*1);
            me.pingFlag = setTimeout(function(){
                clearTimeout(me.pingFlag);
                me.ping();
                me.checkPing();
            }, delay);
        },
        lotteryRound_port: function() {
            var me = this;
            shownewLoading();
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTimeStemp = new Date().getTime();
                        me.dec = nowTimeStemp - data.sctm;
                        me.roundData = data;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.lotteryRound_port();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error: function(xmlHttpRequest, error) {
                    me.safeLotteryMode('on');
                }
            });
        },
        safeLotteryMode: function(flag) {
            var me = this;
            if (flag == 'on') {
                me.checkPing();
                $('.countdown, .icon-lotterytip').addClass('none');
                me.safeFlag = true;
            } else if (flag == 'off') {
                clearTimeout(me.pingFlag);
                me.pingFlag = null;
                me.lotteryRound_port();
                $('.countdown, .icon-lotterytip').removeClass('none');
                me.safeFlag = false;
            } else {
                me.safeLotteryMode('off');
            };
            hidenewLoading();
        },
        imgMath: function() {//随机背景
            var me = this;
            if(me.lotteryImgList.length >0){
                var i = Math.floor((Math.random()*me.lotteryImgList.length));
                $("body").css("background","url('" + me.lotteryImgList[i] + "') no-repeat center center");
            }
        },
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        account_num: function(){
            getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
        },
        downloadImg: function(){
            var me = this, t = simpleTpl();
            if($(".preImg")){
                $(".preImg").remove();
            }
            for(var i = 0;i < me.lotteryImgList.length;i++){
                t._('<img class="preload preImg" src="'+me.lotteryImgList[i]+'">')
            };
            $("body").append(t.toString());
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.endType = 3;
                    me.change();
                    return;
                }
                //config微信jssdk
                //me.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeActList.length - 1){
                            var nextBeginTimeStr = prizeActList[i + 1].pd + " " + prizeActList[i + 1].st;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                                me.lastRound = false;
                                me.nextPrizeAct = prizeActList[i+1];
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                            me.lastRound = true;
                        }
                        me.nowCountdown(prizeActList[i]);
                        //$.fn.cookie('jumpNum', 0, {expires: -1});
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                }
            }else{
                me.safeLotteryMode('on');
                return;
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.isCanShake = false;
            me.type = 1;
            var beginTimeStr = prizeActList.pd+" "+prizeActList.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html('距摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('none');
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.isCanShake = true;
            me.type = 2;
            var endTimeStr = prizeActList.pd+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).empty();
            $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $('.countdown').removeClass('none');
            me.index++;
            me.canJump = true;
            if(prizeActList.bi.length > 0){
                me.lotteryImgList = prizeActList.bi.split(",");
            }
            me.downloadImg();
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                        if(me.canJump){
                            if(me.type == 1){
                                //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    setTimeout(function() {
                                        me.nowCountdown(me.pal[me.index]);
                                    }, 1000);
                                }
                            }else if(me.type == 2){
                                //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                if(!me.isTimeOver){
                                    me.isTimeOver = true;
                                    if(me.index >= me.pal.length){
                                        me.change();
                                        me.type = 3;
                                        return;
                                    }
                                    $('.countdown-tip').html('请稍后');
                                    shownewLoading(null,'请稍后...');
                                    var i = me.index - 1;
                                    if(i < me.pal.length - 1){
                                        var endTimeStr = me.pal[i].pd + " " + me.pal[i].et;
                                        var nextBeginTimeStr = me.pal[i + 1].pd + " " + me.pal[i + 1].st;
                                        if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                            me.endType = 2;
                                        } else {
                                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                            me.endType = 1;
                                        }
                                    }
                                    setTimeout(function(){
                                        if(me.endType == 2){
                                            me.nowCountdown(me.pal[me.index]);
                                        }else if(me.endType == 1){
                                            me.beforeCountdown(me.pal[me.index]);
                                        } else {
                                            me.change();
                                        }
                                    },1000);
                                }
                            }else{
                                me.isCanShake = false;
                            }
                        }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        },
        wxConfig: function() {
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType: "jsonp",
                jsonpCallback: 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success: function(data) {
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
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        change: function() {
            this.isCanShake = false;
            $(".countdown").removeClass('none').find(".countdown-tip").html('本期摇奖已结束');
            $('.detail-countdown').html("");
            hidenewLoading();
        }
    };

    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.lottery.sau = data.tid;
        }
    };

})(Zepto);

$(function(){
    getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
    H.comments.init();
    H.lottery.init();
});