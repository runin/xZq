(function($) {
	H.acts = {
		au: getQueryString('au') || '',
		userName: getQueryString('uname') || '',
		destOpenid: getQueryString('destOpenid') || '',
		dec: 0,
		uuid: null,
		mainIMG: null,
		repeatCheck: true,
        locals: window.localStorage,
		init: function () {
    		this.event();
            if (!is_android()) $('body').addClass('is-ios');
    		if (this.au && this.destOpenid) {
                if (matk) {
                    getResult('api/collectcard/activity/round', {matk: matk}, 'callbackCollectCardRoundHandler', true);
                } else {
                    showLoading();
                    setTimeout(function(){
                        getResult('api/collectcard/activity/round', {matk: matk}, 'callbackCollectCardRoundHandler', true);
                    }, 3e3);
                }
    		} else {
                $('body').append('<h6><p>分享已失效</p><p><span class="itime">5</span>s后进入卡片互动</p></h6><p class="errcode">x_9</p>');
    			$('.container').addClass('none');
                var stime = setInterval(function(){
                    if ($('.itime').text()*1 == 0) {
                        toUrl('act.html');
                        clearInterval(stime);
                        stime = null;
                        return;
                    }
                    $('.itime').text($('.itime').text()*1 - 1);
                }, 1e3);
    		}
    	},
		event: function() {
			var me = this;
            $('.btn-help').click(function(e) {
				e.preventDefault();
				if ($(this).hasClass('bend')) {
                    showTips('不能重复帮助哦，<br>自己也来参加试试手气吧！');
                    return;
                }
				if (me.destOpenid == openid) {
					showTips('自己不能帮助自己哦~');
					return;
				}
				showLoading(null, '正在帮忙中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/collectcard/activity/gather' + dev,
                    data: {destOpenid: me.destOpenid, matk: matk, au: me.au},
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCollectCardGatherHandler',
                    timeout: 5000,
                    complete: function() {
                    	hideLoading();
                    },
                    success : function(data) {
                    	if (data.result && data.cud) {
                    		$('.btn-help').addClass('bend');
                    		me.locals.setItem(openid + '_' + me.destOpenid + '_card_' + me.au, true);
                    		$('[data_id="' + data.cud + '"]').addClass('light');
                    		if ($('.light').length == $('.img-mask i').length) $('.act-btn-chenggong').removeClass('none');
                    		setTimeout(function(){
	                    		showTips('成功解锁一块拼图~');
                    		}, 1e3);
                    	}
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            });

            $('.btn-join').click(function(e) {
				e.preventDefault();
				toUrl('act.html');
            });
		},
		preFill: function(data) {
			var me = this,
				maskWidth = this.resizeMask(data.cn),
				nowTimeStr = timeTransform(parseInt(data.cud)),
                beginTimeStr = data.st,
                endTimeStr = data.et;
            $('.container').removeClass('none');
            if(comptime(nowTimeStr, beginTimeStr) <0 && comptime(nowTimeStr, endTimeStr) >=0) {
                me.countdown(endTimeStr);
                getResult('api/collectcard/activity/result', {openid: me.destOpenid, au: me.au}, 'callbackCollectCardResultHandler');
                if (me.locals.getItem(openid + '_' + me.destOpenid + '_card_' + me.au)) $('.btn-help').addClass('bend');
                $('.mainer').attr('src', me.mainIMG);
                if (me.userName) $('.mfr label').text(' ' + me.userName + ' ');
                for (var i = 0; i < data.ca.length; i++) $('.img-mask').append('<i data_id="' + data.ca[i].cud + '" style="width:' + maskWidth + '%"></i>');
            } else {
                me.shareOver();
            }
		},
		checkVote: function(data) {
			for (var i = 0; i < data.ca.length; i++) {
				$('[data_id="' + data.ca[i].cud + '"]').attr('style', 'animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;-webkit-animation-delay:' + (0.3 + i*0.3).toFixed(2) + 's;').addClass('light');
			};
			if (data.cn == data.ca.length) {
				setTimeout(function(){
					$('.act-btn-chenggong').removeClass('none');
				}, (data.ca.length - 1) * 0.5 * 1000);
				$('.btn-help').addClass('bend');
			}
		},
		resizeMask: function(n) {
			if (!n) return;
			return Math.floor((100 / n).toFixed(2) * 10) / 10;
		},
        countdown: function(endTimeStr){
        	if (!endTimeStr) return;
            $('.detail-countdown').attr('etime', timestamp(endTimeStr) + this.dec);
            this.count_down();
            $(".countdown-tip").text("据本次助力结束还有").parents(".countdown").removeClass("none");
            this.repeatCheck = true;
        },
        count_down: function() {
        	var that = this;
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<label>%H%</label>' + '<span>:</span>'+'<label>%M%</label>' + '<span>:</span>' + '<label>%S%</label>' + '', // 还有...结束
                    stpl : '<label>%H%</label>' + '<span>:</span>'+'<label>%M%</label>' + '<span>:</span>' + '<label>%S%</label>' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(that.repeatCheck){
	                        that.repeatCheck = false;
	                        that.actOver();
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        actOver: function() {
            var me = this;
			$('.countdown').addClass('none');
			$('.jieshu').removeClass('none');
			$('.img-wrapper').addClass('over-mask');
            setTimeout(function(){
                me.shareOver();
            }, 2e3);
        },
        shareOver: function() {
            $('body').append('<h6><p>来晚啦！活动已结束</p><p><span class="itime">5</span>s后进入幸福剧场</p></h6><p class="errcode">x_7</p>');
            $('.container').addClass('none');
            var stime = setInterval(function(){
                if ($('.itime').text()*1 == 0) {
                    toUrl('index.html');
                    clearInterval(stime);
                    stime = null;
                    return;
                }
                $('.itime').text($('.itime').text()*1 - 1);
            }, 1e3);
        }
	};

	W.callbackCollectCardRoundHandler = function(data){
		var me = H.acts;
		hideLoading();
		if (data.result) {
			if (data.ca && data.ca[0] && data.ca[0].cbp) {
				if (data.cn == data.ca.length) {
					$('.container, .icon-reserve').removeClass('none');
	                me.dec = new Date().getTime() - parseInt(data.cud);
					me.mainIMG = data.ca[0].cbp;
					me.uuid = data.ud;
					if (me.au == data.ud) {
						me.preFill(data);
					} else {
						$('body').append('<h6><p>当前分享失效</p><p><span class="itime">5</span>s后进入新分享活动</p></h6><p class="errcode">x_5</p>');
		    			$('.container').addClass('none');
                        var stime = setInterval(function(){
                            if ($('.itime').text()*1 == 0) {
                                toUrl('act.html');
                                clearInterval(stime);
                                stime = null;
                                return;
                            }
                            $('.itime').text($('.itime').text()*1 - 1);
                        }, 1e3);
					}
				} else {
					$('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_3</p>');
				}
			} else {
				$('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_2</p>');
			}
		} else {
			$('body').append('<h6><p>敬请期待</p><p>活动正在准备中</p></h6><p class="errcode">x_1</p>');
		}
	};

	W.callbackCollectCardResultHandler = function(data) {
		var me = H.acts;
		if (data.result && data.ca) {
			me.checkVote(data);
		} else {
			$('.jg-tip').text('卡牌还未集齐，等下再来看看哦~');
			$('.btn-hao, .btn-jieguo').removeClass('none');
		}
	};

	H.jssdk = {
        wxIsReady: false,
        loadWXconfig: 5,
        init: function(){
            this.wxConfig();
        },
        wxConfig: function(){
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
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                'addCard',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideAllNonBaseMenuItem',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideOptionMenu',
                                'showOptionMenu'
                            ]
                        });
                    }
                },
                error: function(xmlHttpRequest, error) {
                }
            });
        },
        menuShare: function() {
            var me = this;
            wx.onMenuShareTimeline({
                title: actDataShare.title,
                desc: actDataShare.desc,
                link: actDataShare.link,
                imgUrl: actDataShare.imgUrl,
                trigger: function(res) {
                },
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                    me.shareFail();
                },
                fail: function(res) {
                    me.shareFail();
                }
            })
        },
        menuToFriend: function() {
            var me = this;
            wx.onMenuShareAppMessage({
                title: actDataShare.title,
                desc: actDataShare.desc,
                link: actDataShare.link,
                imgUrl: actDataShare.imgUrl,
                success: function(res) {
                    me.shareSuccess();
                },
                cancel: function(res) {
                    me.shareFail();
                },
                fail: function(res) {
                    me.shareFail();
                }
            });
        },
        hideMenuList: function() {
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        showMenuList: function() {
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite",
                    "menuItem:copyUrl",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        shareSuccess: function() {
        },
        shareFail: function() {
        }
    };
})(Zepto);

$(function(){
    window.actDataShare = {
        "imgUrl": 'http://cdn.holdfun.cn/resources/images/4160bcaf21e9495f9cf17fe9689f5bbb/2015/03/05/eeda88d02e8c4d2388b9a542cf00f3fe.jpg',
        "link": getActsShareUrl(location.href, 'act.html'),
        "desc": '好友' + ((getQueryString('nickname') || nickname) || '') + '@了你，集齐卡牌惊喜好礼抢不停！',
        "title": '江苏卫视派大礼~'
    };

	H.acts.init();
    H.jssdk.init();
    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideAllNonBaseMenuItem',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideOptionMenu',
                'showOptionMenu'
            ],
            success: function (res) {
                H.jssdk.wxIsReady = true;
                H.jssdk.menuShare();
                H.jssdk.menuToFriend();
            }
        });
    });
    wx.error(function(res){
        H.jssdk.wxIsReady = false;
        if (H.jssdk.loadWXconfig != 0) {
            setTimeout(function(){
                H.jssdk.loadWXconfig--;
                H.jssdk.init();
            }, 6e3);
        }
    });
});