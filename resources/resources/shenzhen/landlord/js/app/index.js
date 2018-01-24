(function($) {
	
	H.index = {
		$pages: $('#pages'),
		from: getQueryString('from'),
		$ctrl_wrapper: $('.ctrl-wrapper'),
		$ttips: $('.ttips'),
		$pv_tips: $('#pv-tips'),
		$pv_num: $('#pv-num'),
		$next_tips: $('#next-tips'),
		$next_num: $('#next-num'),
		
		init: function() {
			H.weixin.init();
			
			if (openid) {
				this.$pages.removeClass('disabled');
			} else {
				this.$pages.addClass('disabled');
				return;
			}
			
			var me = this;
			if (this.from) {
				setTimeout(function() {
					H.dialog.guide.open();
				}, 800);
			}
			
			getResult('landlord/index', {
				tsuid: stationUuid,
				yp: openid
			}, 'callbackLandlordIndex', true);
		},
		
		init_audio: function(url) {
			H.audio.init(url);
			H.audio.event_handler();
			
			// 播放声音
			var interval = setInterval(function() {
				if (!H.audio.audio) return;
				H.audio.show();
				H.audio.audio.play();
				clearInterval(interval);
			}, 1000);

			// 声音启动
			$(document).one("touchstart", function() {
				if ($('.page').eq(0).hasClass('current')) {
					H.audio.audio.play();
				}
			});
		},
		
		show_pvtip: function() {
			this.$ttips.addClass('none');
			this.$pv_tips.removeClass('none');
		},
		
		show_nexttip: function() {
			this.$ttips.addClass('none');
			this.$next_tips.removeClass('none');
		}
	};
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title,
		        'callback': function(res, type) {
		        	var share_txt = '斗地主分享' + (type == 'message' ? '给朋友' : '到朋友圈'),
		        		share_type = 'ah-share-' + type;
		        	recordUserOperate(openid, share_txt, share_type);
		        	
		        	if (!/\:cancel$/i.test(res.err_msg)) {
		        		recordUserOperate(openid, share_txt + '成功', share_type + '-success');
		        	}
		        }
			});
		}
	};
	
	H.page = {
		puid: 0,
		parallax: null,
		$pages: $('#pages'),
		$total_jifen: $('#ui-jifen'),
		s_type: 0,
		TURNED_CLS: 'turned',
		STARTING_CLS: 'starting',
		REQUESTING_CLS: 'requesting',
		ENDED_CLS: 'ended',
		timeout: true,
		time: 4000,
		BET_BASE: 10,	// 奖励积分基数
		init: function(data) {
			var me = this;
			this.$pages.append(this.tpl(data));
			if (this.$pages.find('.page').length <= 1) {
				return;
			}
			
			this.parallax = me.$pages.parallax({
				direction: 'horizontal', 	// vertical (垂直翻页)
				swipeAnim: 'default', 	// cover (切换效果)
				drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,		// 有无加载页
				indicator: false,		// 有无指示点
				arrow:     false,		// 有无指示箭头
				onchange: function(index, element, direction) {
					if (index > 0) {
						var message = direction == 'forward' ? '右翻' : (direction == 'backward' ? '左翻' : '');
						recordUserOperate(openid, message + '查看第' + index + '组选手', 'ah-pagechange-' + index);
					}
				}
			});
			
			me.event_handler();
			me.progress();
			me.count_down();
			
			// 每隔5s更新投票比率
			me.update_rates();
			setInterval(function() {
				me.update_rates();
			}, 5000);
		},
		
		// 没抽奖提示(选手的支持率如下)
		// 抽奖提示(您猜XX胜出,选手的支持率如下)
		// 结果公布:
		// 		恭喜您，猜对了，奖励20积分！
		// 		为便于礼包发放，<a href="#" class="btn-complete">请完善资料</a>
		update_tip: function(ruid, state) {
			var $page = this.get_page(ruid),
				$tip = $page.find('dt'),
				bet = parseInt($page.attr('data-bet')),
				tip = '',
				gpu = $page.attr('data-gpu'),
				result = $page.attr('data-rs');
			
			if (gpu) {
				if (state == 4) {
					if (result && result.indexOf(gpu) > -1) {
						tip = '恭喜您，猜对了，奖励'+ (bet + this.BET_BASE) +'积分！';
						if (!W['contact_info']) {
							tip += '<br />为便于礼包发放，<a href="#" class="btn-result">请完善资料</a>';
						}
					} else {
						tip = '很遗憾，没有猜中';
					}
				} else {
					var name = $page.find('.player-' + gpu).find('.xp-name').text();
					tip = '您猜'+ name +'胜出，选手的支持率如下：';
				}
				
			} else {
				tip = '您未参与本轮竞猜，选手的支持率如下：';
			}
			
			$tip.html(tip);
		},
		
		update_rates: function() {
			var me = this;
			$.each(W['pages_info'], function(key, value) {
				me.update_rate(value['ruid']);
			});
		},
		
		update_rate: function(ruid) {
			getResult('landlord/round/?ruid=' + ruid + '&pus=' + W['player_ids'].join(','), {}, 'callbackLandlordRound');
		},
		
		to: function(ruid) {
			if (!this.parallax || this.$pages.hasClass('disabled')) {
				return;
			}
			var width = $(window).width(),
				$pages = this.$pages.find('.page'),
				index = $pages.index('[data-ruid="'+ (ruid || 0) +'"]');
			
			index = index > -1 ? index : 1;
			var $page = $('.page').eq(index);
			if (index == 0 || $page.hasClass('none')) {
				return;
			}
			$pages.removeClass('current');
			$page.addClass('current');
			this.$pages.css("-webkit-transform", "matrix(1, 0, 0, 1, -" + (index * width) + ", 0)");
			window.curPage = index;
		},
		
		// 倒计时
		count_down: function() {
			var me = this;
			$('.countdown').each(function() {
				var $me = $(this), $page = $me.closest('.page');
				$(this).countDown({
					stpl: '竞猜还未开始',
					etpl: '立即竞猜 %H%:%M%:%S%', 
					otpl: '竞猜已截止',
					callback: function(state) {
						$page.attr('data-votestep', state);
					}
				});
			});
		},
		
		progress: function() {
			var me = this;
			$('.page-round').each(function(index) {
				var $page = $(this),
					$xstip = $page.find('.xs-tips'),
					ruid = $page.attr('data-ruid'),
					$prev_page = $page.prev(),
					result = $page.attr('data-rs');

				$page.progress({
					index: index,
					callback: function(state) {
						me.update_tip(ruid, state);
						
						var $last_page = $('.page-round').not(function() {
							return $(this).hasClass('ended');
						}).first();
						
						if (me.timeout && $last_page.length == 0) {
							$last_page = $('.page-round').eq(0);
						}

						if (!$last_page.hasClass(me.TURNED_CLS)) {
							var state_val = $last_page.attr('data-state');
							if (!state_val) {
								return;
							}
							$last_page.addClass(me.TURNED_CLS);
							if (state_val == 4 && $last_page.next().length == 0) {
								var $first = $('.page-round').eq(0);
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function() {
										me.to($first.length > 0 ? $first.attr('data-ruid') : 0);
									}, me.time);
								} else {
									me.to($first.length > 0 ? $first.attr('data-ruid') : 0);
								}
							} else {
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function(){
										me.to($last_page.attr('data-ruid'));
									}, me.time);
								} else {
									me.to($last_page.attr('data-ruid'));
								}
							}
						}
						
					},
					stCallback: function(state) {// 即将开始
						$page.addClass(me.STARTING_CLS).removeClass('none');
					},
					sdCallback: function(state) { // 正在进行
						$page.removeClass(me.STARTING_CLS).removeClass('none');
						
						if (parseInt($page.attr('data-votestep')) == 3) {
							$page.find('.cwc-item').addClass('none');
							$page.find('.cw-voted').removeClass('none');
						}
					},
					otCallback: function(state) {// 表演结束
						$page.find('.cwc-item').addClass('none');
						$page.addClass(me.ENDED_CLS).find('.cw-voted').removeClass('none');
					},
					ptCallback: function(state) { // 结果公布
						$page.find('.cwc-item').addClass('none');
						$page.addClass(me.ENDED_CLS).find('.cw-voted').removeClass('none');
						
						if ($page.attr('data-voted')) {
							$page.removeAttr('data-voted');
							
							var vote_bet = $page.attr('data-bet'),
								$rsplayer = $page.find('.player-' + result);
							
							$rsplayer.length > 0 && $rsplayer.addClass('xw-player-win');
							if (result && result.indexOf($page.attr('data-gpu')) > -1) {
								me.update_total(W.total_jf + me.BET_BASE + parseInt(vote_bet) * 2);
							}
						}
					}
				});
			});
		},
		
		event_handler: function() {
			var me = this;
			this.$pages.delegate('.btn-vote', 'click', function(e) {
				e.preventDefault();
				
				var $me = $(this),
					$page = $(this).closest('.page'),
					vote_step = parseInt($page.attr('data-votestep')) || 1,
					$voted = $page.find('.xw-player-voted'),
					bet = $(this).attr('data-bet');
				
				if (vote_step == 1) {
					H.dialog.tip.open('竞猜还未开始');
					return false;
				} else if (vote_step == 3) {
					H.dialog.tip.open('竞猜已结束');
					return false;
				}
				
				if ($voted.length == 0) {
					H.dialog.tip.open('请先选择要投票的选手');
					return false;
				}
				
				if (W.total_jf > 0 && bet === null) {
					H.dialog.bet.open($page.attr('data-ruid'), $voted.attr('data-uid'));
				} else {
					$me.addClass(me.REQUESTING_CLS);
					me.bet($page.attr('data-ruid'), $voted.attr('data-uid'), bet ? bet : 0);
				}
			});
			
			$('.btn-ontv').click(function(e) {
				e.preventDefault();
				H.dialog.ontv.open();
			});
			
			this.$pages.delegate('.xw-player', 'click', function(e) {
				e.preventDefault();

				var $page = $(this).closest('.page'),
					vote_step = parseInt($page.attr('data-votestep')) || 1;
				
				if ($page.attr('data-vote') == 'true') {
					return false;
				}
				if (vote_step == 1) {
					H.dialog.tip.open('竞猜还未开始');
					return false;
				} else if (vote_step == 3) {
					H.dialog.tip.open('竞猜已结束');
					return false;
				}
				
				$(this).siblings('.xw-player').removeClass('xw-player-voted');
				$(this).addClass('xw-player-voted');
			});
		},
		
		bet: function(ruid, puid, bet) {
			getResult('landlord/guess', {
				tsuid: stationUuid,
				yp: openid,
				ruid: ruid,
				pu: puid,
				gjf: bet
			}, 'callbackLandlordGuess', true);
		},
		
		get_page: function(ruid) {
			return this.$pages[ruid] || (this.$pages[ruid] = $('#page-' + ruid));
		},
		
		vote: function(data) {
			var $page = this.get_page(data.ruid);
			$page.find('.btn-vote').removeClass(this.REQUESTING);
			
			if (data.code != 0) {
				alert(data.message);
				return;
			}
			this.update_total(W.total_jf - (data.gjf || 0));
			
			$page.attr('data-voted', true).attr('data-vote', true).attr('data-bet', data.gjf).attr('data-gpu', data.gpu);
			$page.find('.cwc-item').addClass('none');
			$page.find('.cw-voted').removeClass('none');
			
			this.update_tip(data.ruid, 2);
			this.update_rate(data.ruid);
		},
		
		update_state: function(data) {
			if (!data.ruid) {
				return;
			}
			var $page = this.get_page(data.ruid);
			if ($page.find('.cw-voted').hasClass('none')) {
				return;
			}
			
			var total = 0, t_percent = 0, total_percent = 0, info = {};
			$.each(data.gc, function(index, obj) {
				$.each(obj, function(key, value) {
					total += value;
					info[key] = value;
				});
			});
			$.each(info, function(key, value) {
				total_percent += info[key];
				if (key == W['player_ids'][data.gc.length - 1]) {
					info[key] = total_percent > 0 ? (100 - t_percent) : 0;
				} else {
					info[key] = total ? Math.round((value / total) * 100) : 0; 
					t_percent += info[key];
				}
			});
			
			$page.find('.pg').each(function() {
				var puid = $(this).attr('data-puid')
				$(this).css('width', info[puid] + '%').closest('dd').find('.pgt').text(info[puid] + '%');
			});
		},
		
		// 总积分
		update_total: function(total) {
			W.total_jf = total;
			this.$total_jifen.find('strong').text(total);
		},
		
		update_server_time: function() {
			setInterval(function() {
				var curr = new Date().getTime(),
					dur = curr - W['local_time'];
				W['server_time'] = W['curr_time'] + dur;
			}, 100);
		},
		
		tpl: function(data) {
			var t = simpleTpl(),
				items = data.rounds || [],
				players = data.players || [];
			
			W['curr_time'] = W['server_time'] = timestamp(data.cut);
			W['local_time'] = new Date().getTime();
				
			this.update_server_time();
			
			this.puid = data.puid;
			H.dialog.puid = this.puid;
			
			this.update_total(data.tjf);
			
			W['contact_info'] = data.info;
			W['pages_info'] = W['pages_info'] || {}; 
			W['player_ids'] = [];
			for (var i = 0, len = players.length; i < len; i ++) {
				W['player_ids'].push(players[i].pu);
			}
			
			for (var i = 0, len = items.length; i < len; i ++) {
				var voted = items[i].gpu,
					over = timestamp(items[i].ret) <= timestamp(data.cut),
					vote_cls = voted ? 'none' : (over ? 'none' : ''),
					voted_cls = voted ? '' : 'none';
					
				var winers = {};
				$.each(items[i].wuids.split(','), function(key, value) {
					winers[value] = true;
				});
				
				W['pages_info'][i] = {'ruid': items[i].ruid};
				
				t._('<div class="page page-round" id="page-'+ items[i].ruid +'" data-ruid="'+ items[i].ruid +'" data-stime="'+ timestamp(items[i].rst) +'" data-etime="'+ timestamp(items[i].ret) +'" data-ptime="'+ timestamp(items[i].ret) +'" data-rs="'+ items[i].wuids +'" data-gpu="'+ (items[i].gpu || '') +'" data-bet="'+ (items[i].gjf || 0) +'" data-vote="'+ (items[i].gpu ? 'true' : 'false') +'">')
					._('<div class="xs-wrapper '+ (items[i].gpu ? 'voted' : '') +'">')
						._('<div class="xs-tips">')
							._('<h2>截止第<strong>'+ items[i].jnum +'</strong>局</h2>')
							._('<p class="countdown" data-stime="'+ timestamp(items[i].rgst) +'" data-etime="'+ timestamp(items[i].rget) +'"></p>')
						._('</div>');
				
						for (var j = 0, lenj = players.length; j < lenj; j ++) {
							var p_champ = data.wuid == players[j].pu ? ' xw-player-champ ' : '',
								p_voted = items[i].gpu == players[j].pu ? ' xw-player-voted ' : '',
								p_win = winers[players[j].pu] ? ' xw-player-win ' : '';
							t._('<a href="#" class="xw-player '+ p_champ + p_voted + p_win + ' player-'+ players[j].pu +'" data-uid="'+ players[j].pu +'">')
								._('<span class="xp-img"><img src="'+ players[j].pi +'" /></span>')
								._('<span class="xp-name">'+ players[j].pn +'</span>')
							._('</a>');
						}
						
					t._('</div>')
					
					._('<div class="ctrl-wrapper">')
						._('<div class="cwc-item cw-vote '+ vote_cls +'">')
							._('<p class="vote-tip">猜谁的积分领先</p>')
							._('<a href="#" class="btn-vote"></a>')
						._('</div>')
						
						._('<div class="cwc-item cw-voted '+ voted_cls +'">')
							._('<dl class="vote-result">')
								._('<dt></dt>')
								for (var j = 0, lenj = players.length; j < lenj; j ++) {
									t._('<dd class="clearfix">')
										._('<label>'+ players[j].pn +'</label>')
										._('<div class="cv-progress">')
											._('<p class="pg" data-puid="'+ players[j].pu +'"></p>')
										._('</div>')
										._('<label class="pgt">0%</label>')
									._('</dd>');
								}
								
							t._('</dl>')
						._('</div>')
						
						._('<div class="cwr-ctrl ctrl" id="cwr-ctrl">')
							._('<p><a href="#" class="btn-ontv"></a></p>')
							._('<a href="#" class="btn-rule" data-collect="true" data-collect-flag="ah-index-rulebtn" data-collect-desc="安徽首页-规则弹层按钮">活动规则</a>')
							._('<a href="#" class="btn-result" data-collect="true" data-collect-flag="ah-index-resultbtn" data-collect-desc="安徽首页-查看战绩按钮">查看战绩</a>')
						._('</div>')
						
					._('</div>')
				._('</div>');
			}
			return t.toString();
		}
	};
	
	W.callbackLandlordIndex = function(data) {
		if (data.code != 0) {
			return;
		}
		
		H.page.init(data);
		H.index.init_audio(data.mul);
	};
	
	W.callbackLandlordGuess = function(data) {
		H.page.vote(data);
	};
	
	W.callbackLandlordRound = function(data) {
		H.page.update_state(data);
	};
	
	// 中奖记录
	W.callbackComedianQuerywin = function(data) {
		if (data.code == 0) {
			W.lottery_record = data.items || [];
		}
	};
	
})(Zepto);

$(function() {
	H.index.init();
});
