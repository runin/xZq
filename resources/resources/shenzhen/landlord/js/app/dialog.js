(function($) {
	
	H.dialog = {
		puid: 0,
		$container: $('#main'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-rule', 'click', function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			}).delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-lottery', 'click', function(e) {
				e.preventDefault();
				H.dialog.lottery.open();
			}).delegate('.btn-comeon', 'click', function(e) {
				e.preventDefault();
				H.dialog.guide.open();
			});
		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}

			H.dialog.relocate();
		},
		
		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': top,
					'bottom': height * 0.06
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
		},
		
		//引导
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				var me = this;
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					
					localStorage.guided = true;
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<h2></h2>')
						._('<p><span><label>1.</label>关注深圳体育健康频道，收看《我来斗地主》</span></p>')
						._('<p><span><label>2.</label>打开微信，进入摇一摇(歌曲)</span></p>')
						._('<p><span><label>3.</label>对着电视摇一摇，猜哪位选手积分领先</span></p>')
						._('<a href="#" class="btn btn-try">等下就去试试</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('common/activtyRule/' + serviceNo, {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).closest('.content').removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<a href="#" class="btn-close"></a>')
					._('<div class="dialog rule-dialog">')
						._('<h2></h2>')
						._('<div class="content">')
							._('<div class="rule">')
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright">活动最终解释权归深圳体育健康频道</p>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		// 战绩
		result: {
			$dialog: null,
			mobile: '',
			qq: '',
			name: '',
			address: '',
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				getResult('landlord/transcript', {
					tsuid: stationUuid,
					page: 1,
					pageSize: 10,
					yp: openid
				}, 'callbackLandlordTranscript', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				
				
				var $mobile = me.$dialog.find('.mobile'),
					$qq = me.$dialog.find('.qq'),
					$name = me.$dialog.find('.name'),
					$address = me.$dialog.find('.address');
				
				this.$dialog.find('input').blur(function(e) {
					var mobile = $.trim($mobile.val()),
						qq = $.trim($qq.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());
					
					if ((me.mobile && me.mobile == mobile) && (me.qq && me.qq == qq) 
							&& (me.name && me.name == name) && (me.address && me.address == address)) {
						return;
					}
					
					if (!/^[1-9][0-9]{4,}$/.test(qq)) {
						me.alert('请输入正确的QQ号');
						return false;
					} else if (!/^\d{11}$/.test(mobile)) {
						me.alert('这手机号，可打不通哦...');
						return false;
					} else if (name.length < 2 || name.length > 30) {
						me.alert('姓名长度为2~30个字符');
						return false;
					} else if (address.length < 5 || address.length > 60) {
						me.alert('地址长度为5~60个字符');
						return false;
					}
					me.alert('');
					
					getResult('landlord/saveinfo', {
						tsuid: stationUuid,
						qq: qq,
						ph: mobile,
						rn: encodeURIComponent(name),
						ad: encodeURIComponent(address),
						yp: openid
					}, 'callbackLandlordSaveinfo', true, me.$dialog);
				});
			},
			alert: function(msg) {
				this.$dialog.find('.contact-alert').text(msg);
			},
			
			update: function(data) {
				this.mobile = data.ph || '';
				this.qq = data.qq || '';
				this.name = data.rn || '';
				this.address = data.ad || '';
				this.$dialog.find('.qq').val(this.qq);
				this.$dialog.find('.mobile').val(this.mobile);
				this.$dialog.find('.name').val(this.name);
				this.$dialog.find('.address').val(this.address);
				this.$dialog.find('.iv').text(data.iv);
				this.$dialog.find('.rk').text(data.rank || '-');
				
				var t = simpleTpl(), records = data.records || [];
				for (var i = 0, len = records.length; i < len; i ++) {
					t._('<tr>')
						._('<td>'+ dateformat(str2date(records[i].gpt || ''), 'MM-dd') +'<strong>'+ records[i].rn +'</strong>轮</td>')
						._('<td>+'+ records[i].gjf +'分</td>')
						._('<td>'+ records[i].gjfr +'分</td>')
					._('</tr>');
				}
				
				this.$dialog.find('tbody').html(t.toString());
				if (true) {
					this.$dialog.find('tfood').addClass('none');
				} else {
					this.$dialog.find('tfood').removeClass('none');
				}
				
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="result-dialog">')
					._('<a href="#" class="btn-close"></a>')
					._('<div class="dialog result-dialog">')
						._('<h2></h2>')
						._('<div class="wrapper">')
							._('<div class="contact">')
								._('<div class="item">')
									._('<label>QQ号：</label>')
									._('<div class="content"><input type="text" class="qq" /></div>')
								._('</div>')
								._('<div class="item">')
									._('<label>手机号：</label>')
									._('<div class="content"><input type="text" class="mobile"/></div>')
								._('</div>')
								._('<div class="item">')
									._('<label>姓名：</label>')
									._('<div class="content"><input type="text" class="name"/></div>')
								._('</div>')
								._('<div class="item">')
									._('<label>地址：</label>')
									._('<div class="content"><input type="text" class="address"/></div>')
								._('</div>')
								._('<p class="contact-tip">（为便于礼包发放，请务必填写联系方式）</p>')
								._('<p class="contact-alert"></p>')
							._('</div>')
							._('<div class="jifen">')
								._('<label>总积分：</label><span class="iv"></span>')
								._('<label>排名：</label><span class="rk"></span>')
							._('</div>')
							._('<div class="list">')
								._('<table>')
									._('<thead><tr><th>竞猜场次</th><th>我的竞猜</th><th>结果</th></tr></thead>')
									._('<tbody></tbody>')
									._('<tfoot class="none"><tr><td colspan="3" align="center">暂无竞猜记录</td></tr></tfood>')
								._('</table>')
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// tip
		tip: {
			$dialog: null,
			open: function(msg) {
				H.dialog.close();
				this.$dialog = $(this.tpl(msg));
				H.dialog.$container.append(this.$dialog);

				H.dialog.relocate();
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
			},
			tpl: function(msg) {
				var t = simpleTpl();
				
				t._('<section class="modal" id="tip-dialog">')
					._('<div class="dialog tip-dialog relocated">')
						._('<h2>'+ (msg || '') +'</h2>')
						._('<a href="#" class="btn btn-close">确定</a>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// 投注
		bet: {
			BET_STEP: 10,
			BET_ROUND: 1,
			$dialog: null,
			ruid: '',
			open: function(ruid) {
				var $dialog = this.$dialog;
				H.dialog.open.call(this);
				
				if (!$dialog) {
					this.event();
				}

				this.relocate();
				this.ruid = ruid;
				this.init();
			},
			
			init: function() {
				this.BET_ROUND = 1;
				this.BET_STEP = 10;
				this.$dialog.find('strong').text(W.total_jf);
				this.$dialog.find('.bet-nums').val(this.BET_STEP).attr('min', 0).attr('max', W.total_jf).attr('step', this.BET_STEP);
				this.$dialog.find('.bet-total').text(this.BET_STEP * 2);
			},
			relocate: function() {
				this.$dialog.find('.btn-close').css('right', $(window).width() * 0.5 - 120).css('top', $(window).height() * 0.5 - 114);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this,
					$btn_close = this.$dialog.find('.btn-close'),
					$bet_nums = this.$dialog.find('.bet-nums'),
					$bet_total = this.$dialog.find('.bet-total');
				
				this.$dialog.find('.btn-bet').click(function(e) {
					e.preventDefault();
					
					var $page = $('#page-' + me.ruid);
					if ($page.length == 0) {
						return;
					}
					me.close();
					$page.find('.btn-vote').attr('data-bet', me.BET_STEP * me.BET_ROUND).trigger('click');
				});
				this.$dialog.find('.btn-minus').click(function(e) {
					e.preventDefault();
					if (me.BET_ROUND > 0) {
						$bet_nums.val(me.BET_STEP * (--me.BET_ROUND));
						$bet_total.text(parseInt($bet_nums.val()) + me.BET_STEP);
					}
				});
				this.$dialog.find('.btn-plus').click(function(e) {
					e.preventDefault();
					if ((me.BET_ROUND + 1) * me.BET_STEP <= W.total_jf) {
						$bet_nums.val((++ me.BET_ROUND) * me.BET_STEP);
						$bet_total.text(parseInt($bet_nums.val()) + me.BET_STEP);
					}
				});
				
				$bet_nums.blur(function() {
					$btn_close.removeClass('none');
					me.BET_ROUND = Math.floor(Math.min(W.total_jf, $.trim($(this).val())) / me.BET_STEP);
					$(this).val(me.BET_ROUND * me.BET_STEP);
					$bet_total.text(parseInt($bet_nums.val()) + me.BET_STEP);
				}).focus(function() {
					$btn_close.addClass('none');
				});
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="bet-dialog">')
					._('<a href="#" class="btn-close"></a>')
					._('<div class="dialog bet-dialog relocated">')
						._('<h2>最多可加注积分：<strong>'+ W.total_jf +'</strong></h2>')
						._('<div class="ctrl">')
							._('<a href="#" class="btn-minus"></a>')
							._('<span><input type="number" class="bet-nums" value="'+ this.BET_STEP +'" /></span>')
							._('<a href="#" class="btn-plus"></a>')
							._('<p>猜中可以获得积分：<strong class="bet-total"></strong></p>')
						._('</div>')
						._('<a href="#" class="btn btn-bet">确定</a>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		
		// ontv
		ontv: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				
				getResult('landlord/prule', {tsuid: stationUuid}, 'callbackLandlordPrule', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			update: function(prule) {
				this.$dialog.find('.wrapper').html(prule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="ontv-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ah-lotterydialog-closebtn" data-collect-desc="上电视弹层-关闭按钮"></a>')
					._('<div class="dialog ontv-dialog">')
						._('<h2></h2>')
						._('<div class="wrapper none">')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
	};
	
	W.callbackComedianAward = function(data) {
		H.dialog.award.enable();
		
		if (data.code == 0) {
			H.dialog.award.succ();
			return;
		}
		alert(data.message);
	};
	
	W.callbackComedianShare = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.update(data.lc);
		}
	};
	
	W.callbackComedianLottery = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.update(data.lc);
			H.dialog.lottery.animate(data);
		} else {
			setTimeout(function() {
				alert(data.message);
				H.dialog.lottery.reset();
			}, 400);
		}
	};
	
	W.callbackComedianQuerylc = function(data) {
		if (data.code == 0) {
			W.jo = data.jo;
			W.gc = data.gc;
			W.hc = data.hc;
			W.lc = data.lc;
			
			H.dialog.lottery.update(data.lc);
		}
	};
	
	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};
	
	W.callbackLandlordPrule = function(data) {
		H.dialog.ontv.update(data.prule);
	};
	W.callbackLandlordTranscript = function(data) {
		H.dialog.result.update(data);
	};
	
	W.callbackLandlordSaveinfo = function(data) {
		H.dialog.result.alert(data.code == 0 ? '保存成功' : '保存失败');
	};
})(Zepto);

H.dialog.init();
