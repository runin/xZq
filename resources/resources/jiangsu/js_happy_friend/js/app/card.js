(function($) {
	H.card = {
		FPU: null,
		lotteryNum: 0,
		cardStatus: null,
		isSend: false,
		isRollBack: false,
		isFromShare: false,
		isCanLottery: false,
		presentedResult: false,
		cardPU: getQueryString('cardPU') || '',
		cardRU: getQueryString('cardRU') || '',
		duiback: getQueryString('duiback') || '',
		userName: getQueryString('userName') || '幸福剧场观众',
		init: function () {
    		this.event();
    		this.resize();
    		this.shareCheck();
    		this.awardListPort();
    		shownewLoading(null, '卡牌加载中...');
    	},
    	shareCheck: function() {
    		var me = this;
    		if (me.cardPU != '') {
    			me.isFromShare = true;
    			if (me.cardRU == '') {
    				me.cardStatus = 'get';
					getResult('api/lottery/dramacard/gainCount', {
						oi: openid,
						pu: me.cardPU
					}, 'callbackLotteryDramacardGainCountHandler');
    			} else {
    				me.cardStatus = 'send';
    				me.getSharePort(me.cardRU);
    			}
    			me.getCardPort();
    			// $('#marqueen').addClass('none');
    		} else {
    			me.isFromShare = false;
	    		me.getCardPort();
	    		$('.info').removeClass('none');
    		}
    		$('.nickname').removeClass('hide').find('label').text(me.userName);
    	},
		resize: function() {
			var winW = $(window).width(), winH = $(window).height();
			$('.bg').css({ 'height': winH });
		},
		event: function() {
			var me = this;
            $('body').delegate('.btn-send', 'tap', function(e) {
				e.preventDefault();
				me.isSend = true;
				me.cardStatus = 'send';
				me.sendSharePort($(this).closest('.swiper-slide').attr('id'));
            }).delegate('.btn-get', 'tap', function(e) {
				e.preventDefault();
				me.cardStatus = 'get';
				me.cardPU = $(this).closest('.swiper-slide').attr('id');
				me.shareCard();
				$('#share').removeClass('share-send').addClass('share-get');
            }).delegate('.f-link', 'tap', function(e) {
				e.preventDefault();
				me.cardStatus = 'get';
				me.cardPU = $(this).attr('data-pu');
				me.shareCard();
				$('#share').removeClass('share-send').addClass('share-get');
            });

            $('.info i').tap(function(e) {
				e.preventDefault();
				if ($('.info').hasClass('off')) {
					$('.info').removeClass('off').addClass('on');
				} else {
					$('.info').removeClass('on').addClass('off');
				}
            });

            $('#share').tap(function(e) {
				e.preventDefault();
				if ($('#share').hasClass('share-send')) {
					me.rollBackCard();
				} else {
					me.cardRU = me.cardPU = me.cardStatus = '';
		            H.jssdk.menuToFriend(wxData);
		            H.jssdk.menuShare(wxData);
				}
				$('#share').removeClass('share-send share-get');
            });

            $('.btn-go').tap(function(e) {
				e.preventDefault();
				toUrl('index.html');
            });
            $('.btn-no').tap(function(e) {
				e.preventDefault();
				toUrl('index.html');
            });
            $('.btn-collect').tap(function(e) {
				e.preventDefault();
				toUrl('index.html');
            });
            $('.btn-play').tap(function(e) {
				e.preventDefault();
				toUrl('index.html');
            });

            $('.btn-yes').tap(function(e) {
				e.preventDefault();
				me.isSend = true;
				me.cardStatus = 'send';
				me.cardPU = getQueryString('cardPU') || '';
				me.cardRU = getQueryString('cardRU') || '';
				me.sendSharePort(me.cardPU);
            });

            $('.btn-come').tap(function(e) {
				e.preventDefault();
				showTips('领取成功', 1500);
				setTimeout(function() {
					toUrl('index.html');
				}, 2000);
            });

            $('.btn-award').click(function(e) {
				e.preventDefault();
				toUrl('shop.html?exchange=card');
				// me.getlotteryPort();
            });
		},
		getCardPort: function() {
			getResult('api/lottery/dramacard/all', {
				oi: openid
			}, 'callbackLotteryDramacardAllHandler');
		},
		getNumPort: function() {
			getResult('api/servicecount/getcount', {
				key: tongjiKey
			}, 'callbackServiceCountGetHandler');
		},
		sendSharePort: function(pu) {
			if (!pu) {
				showTips('请求非法，请重试！');
				return;
			}
			if (this.isFromShare) shownewLoading(null, '卡牌生成中...');
			getResult('api/lottery/dramacard/presented', {
				matk: matk,
				pu: pu
			}, 'callbackLotteryDramacardPresentedHandler');
		},
		getSharePort: function(ru) {
			if (!ru) {
				showTips('请求非法，请重试！');
				return;
			}
			if (this.isFromShare) shownewLoading(null, '卡牌领取中...');
			getResult('api/lottery/dramacard/receive', {
				matk: matk,
				ru: ru
			}, 'callbackLotteryDramacardReceiveHandler');
		},
		fillCardInfo: function(data) {
			var me = this, t = simpleTpl(), cl = data.cl || [], length = cl.length;
			for (var i = 0; i < length; i ++) {
                t._('<section class="swiper-slide card' + i + '" id="' + cl[i].pu + '" data-port="no">')
                    ._('<section class="image-wrapper">')
                        ._('<p></p>')
                        ._('<img class="swiper-lazy" src="./images/reserve-default.png" data-src="' + cl[i].pi + '">')
                        ._('<section class="x-wrapper">')
                            ._('<img src="./images/icon-xcard.jpg">')
                            ._('<a href="javascript:;" class="btn-get" data-collect="true" data-collect-flag="btn-get" data-collect-desc="按钮-索要"><img src="./images/btn-get.png"></a>')
                        ._('</section>')
                        ._('<a href="javascript:;" class="btn-send" data-collect="true" data-collect-flag="btn-send" data-collect-desc="按钮-赠送"><img src="./images/btn-send.png"></a>')
                    ._('</section>')
                    ._('<p class="dot none">0张</p>')
                ._('</section>')
			};
			$('.swiper-wrapper').html(t.toString());
		    var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        nextButton: '.swiper-button-next',
		        prevButton: '.swiper-button-prev',
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
		        	rotate: -30,
		            slideShadows : false
		        },
		        iOSEdgeSwipeDetection : true,
		        preloadImages: false,
		        lazyLoading: true,
		        lazyLoadingInPrevNext : true,
		        // resistanceRatio : 0.9,
		        // touchRatio : 0.5,
                onInit: function(swiper){
					var index = parseInt(swiper.activeIndex);
					me.changeLink(index);
                	me.getCardNumPort(index);
			    },
				onSlideChangeEnd: function(swiper) {
					var index = parseInt(swiper.activeIndex);
					me.changeLink(index);
                	me.getCardNumPort(index);
				}
		    });
    		this.getNumPort();
			$('.swiper-control').animate({'opacity':'1'}, 500, function() {
				if (me.duiback == 'ok') showTips('您已成功兑换，静待好货上门~', 2500);
			});
		},
		findCardIMG: function(data) {
			var me = this, t = simpleTpl(), cl = data.cl || [], length = cl.length;
			for (var i = 0; i < length; i ++) {
				if (me.cardPU == cl[i].pu) {
					$('.solo .solo-img').attr('src', cl[i].pi);
					return;
				}
			};
		},
		fillAwardList: function(data) {
			var me = this, t = simpleTpl(), list = data.gitems[0].info.split(';') || [];
			var newList = this.getArrayItems(list, 30), length = newList.length;
			for (var i = 0; i < length; i ++) {
				t._('<li>' + newList[i] + '</li>')
			};
            $("#marqueen ul").html(t.toString());
			$("#marqueen").marqueen({
				mode: "top",
				container: "#marqueen ul",
				row: 1,
				speed: 60
			}).removeClass('hidden');
		},
		getArrayItems: function(arr, num) {
		    var temp_array = new Array(), return_array = new Array();
		    for (var index in arr) {
		        temp_array.push(arr[index]);
		    };
		    for (var i = 0; i < num; i++) {
		        if (temp_array.length>0) {
		            var arrIndex = Math.floor(Math.random()*temp_array.length);
		            return_array[i] = temp_array[arrIndex];
		            temp_array.splice(arrIndex, 1);
		        } else {
		            break;
		        }
		    };
		    return return_array;
		},
		fillFriendInfo: function(data) {
			var me = this, t = simpleTpl(), gf = data.gf || [], length = gf.length;
            t._('<section class="love love-' + data.pu + ' none">')
                ._('<p>可以向这些好友索要哦~</p>')
                ._('<img class="icon-split" src="./images/icon-split.png">')
                ._('<section class="link-wrapper">')
                    ._('<section class="link" style="width:' + (60*length + 15) + 'px;">')
                    for (var i = 0; i < length; i ++) {
                    	if (gf[i].gc > 0) {
	                        t._('<a class="f-link" href="javascript:;" data-pu="' + data.pu + '" data-collect="true" data-collect-flag="f-link" data-collect-desc="按钮-点击头像索要">')
	                            ._('<img src="' + gf[i].hi + '">')
	                            ._('<p>' + gf[i].nn + '</p>')
	                        ._('</a>')
                    	}
                    };
                    t._('</section>')
                ._('</section>')
            ._('</section>')
			$('.link-container').append(t.toString());
		},
		getCardNumPort: function(index) {
			var length = $('.swiper-slide').length, preLoad = 3;
			if (index > length - 1) return;
			if (index == length - 1) preLoad = 1;
			for (var i = index; i < index + preLoad; i++) {
				if (i > length) return;
				if ($('.card' + i).attr('data-port') == 'no') {
					$('.card' + i).attr('data-port', 'yes');
					var pu = $('.card' + i).attr('id');
					getResult('api/lottery/dramacard/gainCount', {
						oi: openid,
						pu: pu
					}, 'callbackLotteryDramacardGainCountHandler');
					getResult('api/lottery/dramacard/gainFriend', {
						oi: openid,
						pu: pu
					}, 'callbackLotteryDramacardGainFriendHandler');
				}
			};
			hidenewLoading();
		},
		changeLink: function(index) {
			if (this.isCanLottery) {
				$('.link-container').addClass('none');
				$('.btn-award').removeClass('none');
			} else {
				$('.link-container').removeClass('none');
				$('.btn-award').addClass('none');
				var pu = $('.card' + index).attr('id');
				$('.swiper-slide').removeClass('boom');
				$('.card' + index).addClass('boom');
				if ($('.card' + index).hasClass('had')) {
					$('.link-container').removeClass('none');
					$('.love').removeClass('show').addClass('none');
					$('#tips-send').removeClass('none').addClass('show');
				} else {
					$('.link-container').removeClass('none');
					$('.love').removeClass('show').addClass('none');
					if ($('.love').hasClass('love-' + pu)) {
						$('.love-' + pu).removeClass('none').addClass('show');
					} else {
						$('#tips-nobody').removeClass('none').addClass('show');
					}
				}
				// setTimeout(function(){
					$('body').scrollToTop($('body').height());
				// }, 800);
			}
		},
		checkLottery: function() {
			var me = this, tongjiNum = 0;
			$('.swiper-slide').each(function(i, el) {
				if ($('.card' + i).find('.dot').text().slice(0,1) * 1 > 0) tongjiNum++;
			});
			if (tongjiNum >= $('.swiper-slide').length) {
				me.isCanLottery = true;
			} else {
				me.isCanLottery = false;
			}
			if (me.isCanLottery && me.lotteryNum <= 0) {
				$('.lottery-container').addClass('none');
				$('.link-container').addClass('none');
				$('.btn-award').removeClass('none');
			} else {
				if (me.lotteryNum > 0) {
					$('.x-wrapper .btn-get').remove();
					$('.link-container').remove();
					$('.lottery-container').removeClass('none');
					$('.btn-award').addClass('none');
					return;
				}
				$('.x-wrapper .btn-get').removeClass('none');
				$('.link-container').removeClass('none');
				$('.btn-award').addClass('none');
				$('.lottery-container').addClass('none');
			}
		},
		shareCard: function(data) {
			var me = this;
			if (data) {
				this.cardPU = data.pu || '';
				this.cardRU = data.ru || '';
			}
	        wxshareData.link = getShareUrl(openid);
			if (me.cardStatus == 'send') {
				wxshareData.desc = '好友' + nickname + '给您赠送了一张卡牌，马上领取，兑换好礼！';
			} else if (me.cardStatus == 'get') {
				wxshareData.desc = '好友' + nickname + '@了你，紧急求助，快点进来！';
			}
	        H.jssdk.menuShare(wxshareData);
	        H.jssdk.menuToFriend(wxshareData);
		},
		rollBackCard: function() {
			this.isRollBack = true;
			this.isSend = false;
			this.getSharePort(this.cardRU);
			this.cardRU = this.cardPU = this.cardStatus = '';
            H.jssdk.menuToFriend(wxData);
            H.jssdk.menuShare(wxData);
		},
		fillRollBackCard: function() {
			if (this.isFromShare) {
				var cardNum = parseInt($('.tips-getNum label').text().slice(0,1)) + 1;
				$('body').removeClass().addClass('get');
				$('.tips-getNum label').text(cardNum + '张');
			} else {
				var cardNum = parseInt($('#' + this.cardPU).find('.dot').text().slice(0,1)) + 1;
				$('#' + this.cardPU).addClass('had').find('.dot').text(cardNum + '张');
				this.cardPU = '';
				this.checkLottery();
			}
		},
        getlotteryPort: function() {
            var me = this, sn = Math.sn();
            shownewLoading(null, '抽奖中');
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/lottery/exec/luck4DramaCard' + dev,
                data: { matk: matk , sn: sn},
                dataType: "jsonp",
                jsonpCallback: 'callbackLotteryLuck4DramaCardHandler',
                timeout: 10000,
                complete: function() {
                },
                success: function(data) {
                    if(data.flow && data.flow == 1){
                        sn = Math.sn();
                        me.fillLottery(null);
                        return;
                    }
                    if(data.result){
                        if(data.sn == sn){
                            sn = Math.sn();
                            me.fillLottery(data);
                        }
                    }else{
                        sn = Math.sn();
                        me.fillLottery(null);
                    }
                },
                error: function() {
                    sn = Math.sn();
                    me.fillLottery(null);
                }
            });
            recordUserOperate(openid, "调用卡牌抽奖接口", "doCardLottery");
            recordUserPage(openid, "调用卡牌抽奖接口", 0);
        },
        fillLottery: function(data) {
        	var me = this;
            hidenewLoading();
            this.lotteryNum = 1;
			$('.btn-award').addClass('none');
			$('.x-wrapper .btn-get').remove();
			$('.link-container').remove();
			$('.lottery-container').removeClass('none');
			$('.swiper-slide').each(function(i, el) {
				var cardNum = parseInt($('.card' + i).find('.dot').text().slice(0,1)) - 1;
				if (cardNum > 0) {
					$('.card' + i).addClass('had').find('.dot').text(cardNum + '张');
				} else {
					$('.card' + i).removeClass('had').find('.dot').text('0张');
				}
				me.checkLottery();
			});
            if(data == null || data.result == false || data.pt == 0){
                me.thanksLottery();
                return;
            }
            H.dialog.lottery.open(data,"lottery");
        },
        thanksLottery: function() {
        	showTips('幸运之神与您擦肩而过<br>继续努力吧~', 2000);
        },
        awardListPort: function() {
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
        }
	};

	H.jssdk = {
	    wxIsReady: false,
	    loadWXconfig: 5,
	    init: function(){
	        this.ready();
	        this.wxConfig();
	    },
	    ready: function() {
	        var me = this;
	        wx.ready(function () {
	            wx.checkJsApi({
	                jsApiList: [
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
	                    me.wxIsReady = true;
	                }
	            });
	            wx.hideOptionMenu();
	            me.showMenuList(wxData);
	        });
	        wx.error(function(res){
	            me.wxIsReady = false;
	            if (me.loadWXconfig == 0) {
	                setTimeout(function(){
	                    me.loadWXconfig--;
	                    H.jssdk.init();
	                }, 6000);
	            }
	        });
	    },
	    wxConfig: function(){
	        $.ajax({
	            type: 'GET',
	            async: true,
	            url: domain_url + 'mp/jsapiticket' + dev,
	            data: {appId: mpappid},
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
	                        appId: mpappid,
	                        timestamp: timestamp,
	                        nonceStr:nonceStr,
	                        signature:signature,
	                        jsApiList: [
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
	    menuShare: function(wxData) {
	        var me = this;
	        wx.onMenuShareTimeline({
	            title: wxData.title,
	            desc: wxData.desc,
	            link: wxData.link,
	            imgUrl: wxData.imgUrl,
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
	    menuToFriend: function(wxData) {
	        var me = this;
	        wx.onMenuShareAppMessage({
	            title: wxData.title,
	            desc: wxData.desc,
	            link: wxData.link,
	            imgUrl: wxData.imgUrl,
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
	    showMenuList: function(wxData) {
	        var me = this;
	        wx.showMenuItems({
	            menuList: [
	                "menuItem:share:appMessage",
	                "menuItem:share:timeline",
	                "menuItem:favorite",
	                "menuItem:copyUrl",
	                "menuItem:share:email"
	            ],
	            success:function (res) {
	                me.menuToFriend(wxData);
	                me.menuShare(wxData);
	            },
	            fail:function (res) {
	            }
	        });
	    },
	    shareSuccess: function() {
	    	$('#share').removeClass('share-send share-get');
	    	if (H.card.isFromShare) {
	    		if (H.card.presentedResult) {
	    			H.card.presentedResult = false;
					var cardNum = parseInt($('.tips-getNum label').text().slice(0,1)) - 1;
			    	if (cardNum > 0) {
			    		$('.tips-getNum label').text(cardNum + '张');
			    	} else {
			    		$('.tips-getNum label').text('0张');
			    		$('body').removeClass().addClass('noget');
			    	}
	    		}
	    		$('#kiss').removeClass('none');
	    	} else {
	    		if (H.card.presentedResult) {
	    			H.card.presentedResult = false;
			    	var cardNum = parseInt($('#' + H.card.cardPU).find('.dot').text().slice(0,1)) - 1;
			    	if (cardNum > 0) {
			    		$('#' + H.card.cardPU).find('.dot').text(cardNum + '张');
			    	} else {
			    		$('#' + H.card.cardPU).removeClass('had').find('.dot').text('0张');
			    	}
			    	H.card.checkLottery();
	    		}
	    		$('#kiss').addClass('none');
	    	}
	    	H.card.isSend = false;
	    	H.card.cardPU = H.card.cardRU = H.card.cardStatus = '';
            this.menuToFriend(wxData);
            this.menuShare(wxData);
	    },
	    shareFail: function() {
	    	$('#share').removeClass('share-send share-get');
	    	if (!H.card.isFromShare) {
		    	H.card.checkLottery();
	    	}
	    	if (H.card.isSend) H.card.rollBackCard();
	    	H.card.cardStatus = ''
            this.menuToFriend(wxData);
            this.menuShare(wxData);
	    }
	};

	W.callbackLotteryDramacardAllHandler = function(data) {
		if (H.card.isFromShare) {
			if (data.result) {
				H.card.findCardIMG(data);
			} else {
				hidenewLoading();
			}
		} else {
			if (data.result) {
				H.card.fillCardInfo(data);
				H.card.FPU = data.cl[0].pu;
				if (data.ca) {
					if (data.le > 0) {
						H.card.isCanLottery = false;
					} else {
						H.card.isCanLottery = true;
					}
					$('.link-container').addClass('none');
					$('.btn-award').removeClass('none');
				} else {
					H.card.isCanLottery = false;
					$('.link-container').removeClass('none');
					$('.btn-award').addClass('none');
				}
				if (data.le > 0) {
					H.card.lotteryNum = data.le;
					$('.x-wrapper .btn-get').remove();
					$('.link-container').remove();
					$('.lottery-container').removeClass('none');
				}
			} else {
				hidenewLoading();
			}
		}
	};

	W.callbackServiceCountGetHandler = function(data) {
		if (data.result && data.c) {
			$('.card-info').removeClass('hide').find('label').text(data.c);
		} else {
			$('.card-info').addClass('hide');
		}
	};

	W.callbackLotteryDramacardGainCountHandler = function(data) {
		if (H.card.isFromShare) {
			if (data.result && data.gc) {
				if (data.gc > 0) {
					if (H.card.cardStatus == 'get') {
						$('body').removeClass().addClass('get');
						$('.tips-getNum label').text(data.gc + '张');
					} else {
						$('body').removeClass().addClass('send');
					}
				} else {
					if (H.card.cardStatus == 'get') {
						$('body').removeClass().addClass('noget');
					} else {
						$('body').removeClass().addClass('nosend');
					}
				}
			} else {
				if (H.card.cardStatus == 'get') {
					$('body').removeClass().addClass('noget');
				} else {
					$('body').removeClass().addClass('nosend');
				}
			}
			hidenewLoading();
		} else {
			if (data.result && data.gc) {
				if (data.gc >= 0) {
					$('#' + data.pu).addClass('had');
					if (data.gc > 0) {
						$('#' + data.pu).find('.dot').text(data.gc + '张').removeClass('none');
					}
				} else {
					$('#' + data.pu).removeClass('had').find('.dot').addClass('none');
				}
				if ($('#' + H.card.FPU).hasClass('swiper-slide-active')) {
					H.card.changeLink(0);
				}
			}
		}
	};

	W.callbackLotteryDramacardGainFriendHandler = function(data) {
		if (data.result && data.gf) {
			H.card.fillFriendInfo(data);
		}
	};

	W.callbackLotteryDramacardPresentedHandler = function(data) {
		if (data.result && data.ru) {
			H.card.shareCard(data);
			H.card.presentedResult = true;
			$('#share').removeClass('share-get').addClass('share-send');
		} else {
			H.card.presentedResult = false;
			showTips('貌似出了点问题，别着急~<br>开发GG正在火速解决', 2000);
		}
        hidenewLoading();
	};

	W.callbackLotteryDramacardReceiveHandler = function(data) {
		if (data.result) {
			if (H.card.isRollBack) {
				H.card.isRollBack = false;
				// H.card.fillRollBackCard();
			} else {
				$('body').removeClass().addClass('send');
			}
		} else {
			if (!H.card.isRollBack) {
				$('body').removeClass().addClass('nosend');
			}
		}
		hidenewLoading();
	};

    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0 && data.gitems != undefined) {
            if (data.gitems[0].info != '') {
                H.card.fillAwardList(data);
            } else {
                $('#marqueen').addClass('hidden');
            }
        } else {
            $('#marqueen').addClass('hidden');
        }
    };
})(Zepto);

$(function(){
	H.card.init();
	H.jssdk.init();
});