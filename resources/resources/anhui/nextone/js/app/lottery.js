(function($) {
	
	H.lottery = {
		$dialog: $('#lottery-dialog'),
		BROKEN_CLS: 'broken',
		ANIMATED_CLS: 'animated',
		init: function() {
			var me = this;
			$('#main').css({ 'width': $(window).width(), 'height': $(window).height() });
			
			getResult('comedian/querylc', {
				tsuid: stationUuid,
				yp: openid
			}, 'callbackComedianQuerylc', true);
			
			this.event();
			this.open();
			
			H.weixin.init();
		},
		
		open: function() {
			var me = this;
			$('.modal').addClass('none');
			this.$dialog.removeClass(this.BROKEN_CLS).removeClass(this.ANIMATED_CLS).removeClass('none');
			
			var $btn_hammer = this.$dialog.find('.btn-hammer').addClass(this.ANIMATED_CLS);
			setTimeout(function() {
				$btn_hammer.removeClass(me.ANIMATED_CLS);
			}, 800);
		},
		
		shake: function() {
			W.addEventListener('shake', H.lottery.shake_listener, false);
		},
		
		unshake: function() {
			W.removeEventListener('shake', H.lottery.shake_listener, false);
		},
		
		shake_listener: function() {
			var $dialog = H.lottery.$dialog;
			if ($dialog.hasClass('none')) {
				return;
			}
			$dialog.find('.btn-hammer').trigger('click');
		},
		
		event: function() {
			var me = this;
			this.$dialog.find('.btn-hammer').click(function(e) {
				var $me = $(this);
				e.preventDefault();
				
				$me.addClass(me.ANIMATED_CLS);
				setTimeout(function() {
					me.$dialog.addClass(me.BROKEN_CLS);
				}, 400);
				setTimeout(function() {
					$me.removeClass(me.ANIMATED_CLS);
				}, 800);
				
				getResult('comedian/lottery', {
					tsuid: stationUuid,
					tcuid: channelUuid,
					serviceNo: serviceNo,
					yp: openid
				}, 'callbackComedianLottery', this.$dialog);
			});
			
			this.shake();
		},
		animate: function(data) {
			var me = this;
			setTimeout(function() {
				me.$dialog.addClass(me.ANIMATED_CLS);
			}, 400);
			setTimeout(function() {
				H.award.init(data);
			}, 1100);
		},
		update: function(lc) {
			W.lc = lc;
			$('.s-lc').text(lc);
		},
		reset: function() {
			this.$dialog.removeClass(this.BROKEN_CLS).removeClass(this.ANIMATED_CLS);
		}
	};
	
	// 领奖
	H.award = {
		puid: 0,
		pt: 0,
		$dialog: $('#award-dialog'),
		SUCCESS_CLS: 'award-succ-dialog',
		REQUEST_CLS: 'requesting',
		init: function(data) {
			this.event();
			this.pt = data.pt;
			this.puid = data.puid;
			this.$dialog.find('.s-award').text(' ' + data.pn + ' ' + (data.pt == 2 ? '' : (data.co + data.pu)));
			this.$dialog.find('.prize').html('<img src="'+ data.pi +'" />').addClass('p' + data.pt);
			this.$dialog.find('.mobile').val(data.ph || '');
			this.$dialog.find('.name').val(data.rn || '');
			this.$dialog.find('.address').val(data.ad || '').addClass(data.pt == 2 ? 'none' : '');
			
			this.open();
		},
		open: function() {
			$('.modal').addClass('none');
			this.$dialog.removeClass('none');
		},
		enable: function() {
			this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
		},
		disable: function() {
			this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
		},
		
		succ: function() {
			H.lottery.update(W.lc);
			this.$dialog.addClass(this.SUCCESS_CLS);
			if (W.lc <= 0) {
				this.$dialog.find('.btn-again').addClass('none');
			} else {
				this.$dialog.find('.btn-again').removeClass('none');
			}
		},
		event: function() {
			var me = this;
			this.$dialog.find('.btn-award').click(function(e) {
				e.preventDefault();
				
				var $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$address = me.$dialog.find('.address'),
					address = $.trim($address.val());
				
				if (!name) {
					alert('该怎么称呼您呢？');
					$name.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				} else if (name.length > 10) {
					alert('姓名太太太长了！');
					$name.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('这手机号，可打不通...');
					$mobile.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				if (me.pt == 1 && (address.length < 5 || address.length > 60)) {
					alert('地址长度为5~60个字符');
					$address.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				
				me.disable();
				getResult('comedian/award/', {
					puid: me.puid,
					ph: mobile,
					rn: encodeURIComponent(name),
					ad: me.pt == 1 ? encodeURIComponent(address) : '',
					yp: openid
				}, 'callbackComedianAward', this.$dialog);
			});
			
			this.$dialog.find('.btn-again').click(function(e) {
				e.preventDefault();
				
				me.$dialog.removeClass(me.SUCCESS_CLS);
				H.lottery.open();
			});
			
		}
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title,
		        'callback': function(res, type) {
		        	var share_txt = '安徽卫视分享' + (type == 'message' ? '给朋友' : '到朋友圈'),
		        		share_type = 'ah-share-' + type;
		        	recordUserOperate(openid, share_txt, share_type);
		        	
		        	if (!/\:cancel$/i.test(res.err_msg)) {
		        		recordUserOperate(openid, share_txt + '成功', share_type + '-success');
		        		
		        		getResult('comedian/share', {
		        			puid: H.award.puid,
		        			yp: openid
		        		}, 'callbackComedianShare');
		        	}
		        }
			});
		}
	};
	
	W.callbackComedianAward = function(data) {
		H.award.enable();
		
		if (data.code == 0) {
			H.award.succ();
			return;
		}
		alert(data.message);
	};
	
	W.callbackComedianShare = function(data) {
		if (data.code == 0) {
			H.lottery.update(data.lc);
		}
	};
	
	W.callbackComedianLottery = function(data) {
		if (data.code == 0) {
			H.lottery.update(data.lc);
			H.lottery.animate(data);
		} else {
			setTimeout(function() {
				alert(data.message);
				H.lottery.reset();
			}, 400);
		}
	};
	
	W.callbackComedianQuerylc = function(data) {
		if (data.code == 0) {
			W.jo = data.jo;
			W.gc = data.gc;
			W.hc = data.hc;
			W.lc = data.lc;
			
			H.lottery.update(data.lc);
		}
	};
})(Zepto);

H.lottery.init();