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
				/*H.dialog.lottery.open();*/
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
			if (is_android()) {
				$('#lottery-dialog').find('input').each(function() {

					$(this).focus(function(){
						setInterval(function(){
							if(H.dialog.height != $(window).height()){
								$('.dialog').css({
									'top': H.dialog.height * 0.06,
									'border': '1px solid #fff'
								});
							}else{
								$('.dialog').css({
									'bottom': H.dialog.height * 0.06
								});
							}
						},500)
					});
				});
			}
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

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.my-zhidao').click(function(e) {
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
					._('<a href="#" class="btn-close my-zhidao"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule">')
					._('</div>')
					._('</div>')
					._('<div><a href="#" class="btn-vote my-zhidao ip4" data-collect="true" data-collect-flag="js-sdp-guide-trybtn" data-collect-desc="耍大牌规则弹层-我知道了按钮">我知道了</a></div>')
					._('<p class="dialog-copyright">活动最终解释权归江苏体育休闲频道</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},

		// 报名
		result: {
			$dialog: null,
			mobile: '',
			qq: '',
			name: '',
			address: '',
			open: function() {
				if(H.page.pel){
					H.dialog.open.call(this);
					this.event();
				}else {
					alert('您已经报过名了！');
				}
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.back-close').click(function(e) {
					e.preventDefault();
					me.close();
				});

				this.$dialog.find('.tijiao').click(function(e) {
					e.preventDefault();

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$address = me.$dialog.find('.address'),
					    mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());

					if (((me.name && me.name == name) && me.mobile && me.mobile == mobile)
						&& (me.address && me.address == address)) {
						return;
					}
					if (name.length < 2 || name.length > 30) {
						alert('姓名长度为2~30个字符');
						return false;
					}
					else if (!/^\d{11}$/.test(mobile)) {
						alert('这手机号，可打不通哦...');
						return false;
					}  else if (address.length < 5 || address.length > 60) {
						alert('地址长度为5~60个字符');
						return false;
					}

					getResult('poser/enter', {
						phone: mobile,
						name: encodeURIComponent(name),
						address: encodeURIComponent(address),
						openid : openid,
						puid: H.page.puid
					}, 'poserEnterHandler', true, me.$dialog);
				});
			},

			tpl: function() {
				var t = simpleTpl();

				t._('<section class="modal" id="result-dialog">')
					._('<a href="#" class="btn-close"></a>')
					._('<div class="dialog result-dialog">')
					._('<h2></h2>')
					._('<div class="wrapper">')
					/*报名填写*/
					._('<div class="contact ">')
						._('<div class="item">')
							._('<div class="content"><input type="text" class="name" placeholder="姓名：" /></div>')
						._('</div>')
						._('<div class="item">')
							._('<div class="content"><input type="text" class="mobile" placeholder="电话："/></div>')
						._('</div>')
						._('<div class="item">')
							._('<div class="content"><input type="text" class="address" placeholder="城市："/></div>')
						._('</div>')
						._('<div class="sub-div"><a href="#" class="btn-vote sub tijiao" data-collect="true" data-collect-flag="js-sdp-guide-trybtn" data-collect-desc="耍大牌规则弹层-我知道了按钮">提 交</a></div>')
					._('</div>')
					/*报名成功*/
					._('<div class="apply-w none">')
						._('<div class="apply-wc">您的报名信息我们已经收到，请耐心等待我们工作人员联系。</div>')
							._('<div class="sub-div"><a href="#" class="btn-vote sub back-close" data-collect="true" data-collect-flag="js-sdp-guide-trybtn" data-collect-desc="耍大牌规则弹层-我知道了按钮">返 回</a></div>')
							._('</div>')
						._('</div>')
						._('<p class="dialog-copyright">活动最终解释权归江苏体育休闲频道</p>')
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
		lottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
				});

				$('#btn-award').click(function(e) {
					e.preventDefault();

					if (!me.check()) {
						return false;
					}

					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.address').val());

					me.disable();
					$('#btn-award').addClass('none');
					me.butt_loading();
					getResult('poser/award', {
						phone : mobile,
						openid: openid
					}, 'poserAwardHandler');
				});
			},
			check: function() {
				var me = this;

				var $mobile = me.$dialog.find('.mobile'),
					$name = me.$dialog.find('.name'),
					mobile = $.trim($mobile.val()),
					name = $.trim($name.val());

				if (!name) {
					alert('请先输入姓名');
					$name.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}
				if (!mobile || !/^\d{11}$/.test(mobile)) {
					alert('请先输入正确的手机号');
					$mobile.focus();
					$(this).removeClass(me.REQUEST_CLS);
					return false;
				}

				return true;
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			butt_loading: function() {
				var t = simpleTpl();
				t._(' <div class="loader">')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('</div>');
				$('.dialog-copyright').before(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="lottery-dialog">')

					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="js-sdp-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
					//未中奖
					._('<div class="not-lott" id="not-lott">')
					._('<img src="images/open-li.png">')
					._('<h1>运气不太好，没有中奖</h1>')
					._('<h2>别灰心，发评论上电视,<br/>有机会赢大奖哦！</h2>')
					._('<a class="btn-lott lottery-close lott-back" data-collect="true" data-collect-flag="js-sdp-sharebtn" data-collect-desc="返回按钮">返 回</a>')
					._('</div>')
					//中奖
					._('<div class="lott none" id="lott">')
					._('<img src=" ">')
					._('<h2>-</h2>')
					._('<h1>请填写您的联系方式以便顺利领奖</h1>')
					._('<input type="text" class="name" placeholder="姓名：(必填)" />')
					._('<input type="number" class="mobile" placeholder="电话：例：13888888888 (必填)" />')
					._('<a class="btn-lott btn-share btn-award" id="btn-award" data-collect="true" data-collect-flag="js-sdp-combtn" data-collect-desc="耍大牌-确定按钮">确 定</a>')
					._('<p class="da-tips none">')
					._('<a href="http://m.1312.com/huodong/Hongbao4JSBC" class="btn-lott btn-share" data-collect="true" data-collect-flag="js-sdp-rank" data-collect-desc="耍大牌-分享按钮">领 红 包</a>')
					/*._('<a class="lottery-close" data-collect="true" data-collect-flag="js-sdp-back" data-collect-desc="耍大牌-返回按钮">返回</a>')*/
					._('</p>')
					._('</div>')
					._('<p class="dialog-copyright">活动最终解释权归江苏体育休闲频道</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			},
			update: function(data) {
				if(data.prizeType == 1){
					$("#lott").find("img").attr("src",data.prizeImg);
//					$("#lott").find("h2").html('运气太好了，恭喜您获得' + data.prizeName + data.prizeCount + data.prizeUnit);
					$("#lott").find("h2").html(data.ptt);
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled').val("").css('border','1px solid #D3D3D3');
				this.$dialog.find('#btn-award').removeClass('none').addClass('btn btn-share btn-award');
				this.$dialog.find('#lott h1').text('请填写您的联系方式以便顺利领奖');
			},
			succ: function() {
				$('.loader').addClass('none');
				this.$dialog.find('input').attr('disabled','disabled').css('border','none');
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('.da-tips').removeClass('none');
				var mob = this.$dialog.find('.mobile').val();
				var nam = this.$dialog.find('.name').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('#lott h1').text('以下是您的联系方式，请等候工作人员联系');
			}
		}
	};

	W.callbackRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
		}
	};

	W.poserEnterHandler = function(data) {
		if(data.code == 0){
			$('.result-dialog h2').css({
				'background-size': '106px auto',
				'background': 'url(images/icon-zjb.png) no-repeat center top'

			});
			$('.contact').addClass('none');
			$('.apply-w').removeClass('none');
		}else if(data.code == 1){
			alert('系统繁忙，请稍后再试！');
		} if(data.code == 7){
			alert('您已经报过名了！');
		}
	};

	W.poserAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}
	}
})(Zepto);

H.dialog.init();
