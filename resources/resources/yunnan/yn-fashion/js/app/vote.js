(function($) {
	H.vote = {
		currTime: null,
		commActUid: null,
		supportDiv: null,
		attrUuid: '', 
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REQUEST_CLS: 'requesting',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		SHOWTRUE_CLS: true,
		currTime: new Date().getTime(),
		headMix: Math.ceil(7*Math.random()),
		expires: {expires: 7},
		$avatar: $('.host-avatar img'),
		$actList: $('.vote-body ul'),
		$actListed: $('.actListed'),
		$timebox: $('#time-box'),
		init: function(){
			if (!openid) {
				return false;
			};
			var me = this,
				winW = $(window).width(),
				winH = $(window).height();
			$('body').css({
				'height': winH,
				'width': winW
			});
			me.event();
			me.getActlist();
			me.ddtj();
		},
		event: function() {
			var me = this;
			$(".go-back").click(function(e){
				e.preventDefault();
				showLoading();
				toUrl("index.html");
			});
		},
		bindVotebtn: function() {
			var me = this;
			$(".vote-bar p").click(function(e){
				e.preventDefault();
				if ($(this).hasClass('selected')) {
					showTips('亲，您已经投过票了哦!<br>等待下一轮吧', null, 1000);
					return;
				};
				var actuuid = $(this).attr('data-actuuid') || '',
					attruuid = $(this).attr('data-attruuid') || '';
				if (openid && actuuid && attruuid) {
					H.vote.supportDiv = $(this).parent('.vote-bar');
					$(this).parent('.vote-bar').find('p').addClass('selected');
					getResult('fashion/support', {
						openid: openid,
						activityUuid: actuuid,
						attrUuid: attruuid
					}, 'supportHandler',true);
				};
			});
		},
		getActlist: function() {
			getResult('fashion/index', {
				openid: openid
			}, 'fashionIndexHandler',true);
		},
		fillActlist: function(data) {
			var me = this,
				t = simpleTpl(),
				tl = data.tl || [],
				length = tl.length,
				winH = $(window).height();
			this.currTime = timestamp(data.act);
			for (var i = 0; i < length; i++) {
				var flag = tl[i].flag || 'sellect',
					actUuid = tl[i].actUid;
				t._('<li data-sellect="' + flag + '" data-actUuid="' + actUuid + '" data-stime="'+ timestamp(tl[i].st) +'" data-etime="'+ timestamp(tl[i].et) +'" style="z-index:' + i + ';">')
					._('<div class="host-avatar">')
						._('<img src="' + tl[i].ti + '">')
					._('</div>')
					._('<div class="content-box">')
						._('<h1>' + tl[i].actTle + '</h1>')
						._('<div class="vote-bar">')
							var attrs = tl[i].attrs;
							if(attrs != null && attrs.length != 0){
								var me = this,
									sumCount = data.tl[i].count,
									sumPercent = 0;
								for (var j = 0, len = attrs.length; j < len; j++) {
									if (sumCount != 0) {
										var percent = (attrs[j].ac/sumCount * 100).toFixed(0);
										if(j == len - 1){
											percent = (100.00 - sumPercent).toFixed(0);
										};
									} else {
										var percent = 0;
									};
									t._('<p data-actUuid="' + actUuid + '" data-attrUuid="' + attrs[j].au + '" data-collect="true" data-collect-flag="yn-fashion-vote-click" data-collect-desc="投票页-点击投票">')
										._('<label class="vote-name">' + attrs[j].av + '</label>')
										._('<label class="vote-count transparent">' + percent + '%</label>')
										._('<span class="transparent" style="width:' + percent + '%;background-color:' + attrs[j].acl + ';"></span>')
									._('</p>')
									sumPercent += percent * 1;
								};
							};
							var result = tl[i].result;
							if(result != null && result.length != 0){
								var me = this,
									sumCount = data.tl[i].count,
									sumPercent = 0;
								for (var j = 0, len = result.length; j < len; j++) {
									if (sumCount != 0) {
										var percent = (result[j].ac/sumCount * 100).toFixed(0);
										if(j == len - 1){
											percent = (100.00 - sumPercent).toFixed(0);
										};
									} else {
										var percent = 0;
									}
									t._('<p class="selected" data-actUuid="' + actUuid + '" data-attrUuid="' + result[j].au + '" data-collect="true" data-collect-flag="yn-fashion-vote-click" data-collect-desc="投票页-点击投票">')
										._('<label class="vote-name">' + result[j].av + '</label>')
										._('<label class="vote-count">' + percent + '%</label>')
										._('<span class="" style="width:' + percent + '%;background-color:' + result[j].acl + ';"></span>')
									._('</p>')
									sumPercent += percent * 1;
								};
							};
						t._('</div>')
					._('</div>')
				._('</li>')
			}
			this.$actList.html(t.toString());
			this.$actList.find('li').css('height', Math.ceil(winH * 0.75));
			me.bindVotebtn();
			this.progress(data.act);
		},
		fillResult: function(data) {
			var sumCount = data.count,
				sumPercent = 0,
				result = data.result,
				$voteBar = $('.vote-bar'),
				colorme = ['#00B2FF','#FF5252','#D3B100','#7874FF','#FFA500'];
			H.vote.supportDiv.parent('.content-box').parent('li').attr('data-sellect', 'sellected');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				var color = result[i].acl || colorme[i];
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				};
				H.vote.supportDiv.find('p').each(function() {
					if ($(this).attr('data-attruuid') == result[i].au) {
						$(this).find('.vote-count').removeClass('transparent').html(percent + '%');
						$(this).find('span').removeClass('transparent').css({
							'width': percent + '%',
							'background-color': color
						});
					};
				});
				sumPercent += percent * 1;
			};
			setTimeout(function() {
				H.dialog.fudai.open();
			}, 2000);
		},
		server_time: function(serverTime){
			var time, nowTime = Date.parse(new Date());
            if(nowTime > serverTime){
                time += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                time -= (serverTime - nowTime);
            }
            return time;
        },
		progress: function(data) {
			var me = this,
			server_time = new Date(data).getTime();
			this.$actList.find('li').each(function() {
				var $me = $(this);
				$me.progress({
					cTime: me.currTime,
					stpl : '距离投票抽奖开始还有 <span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
					callback: function(state) {
						if(H.vote.TIMETRUE_CLS) {
							var cls = '';
							switch(state) {
								case 1:
									cls = me.STARTING_CLS + ' none';
									break;
								case 2:
									cls = me.STARTED_CLS;
									break;
								default:
									cls = me.ENDED_CLS + ' none over';
							}
							$me.removeClass().addClass(cls);
							
							var $starting = me.$actList.find('li.' + me.STARTING_CLS),
								$started = me.$actList.find('li.' + me.STARTED_CLS).not(function() {
									return $(this).attr('data-sellect') != 'sellect';
								}),
								$ended = me.$actList.find('li.' + me.ENDED_CLS),
								length = me.$actList.find('li').length;

							if ($starting.length == length) {
								$('.wait').addClass('now');
							} else {
								$('.wait').removeClass('now');
							};

							if ($started.length > 0) {
								me.$timebox.addClass('none');
								$started.eq(0).removeClass('none');
								if ($started.eq(0).attr('data-sellect') != 'sellect') {
									me.$timebox.removeClass('none');
									me.$timebox.html($starting.eq(0).attr('data-timestr'));
								};
								if ($started.eq(0).next('li').length == 0) {
									$('.wait').addClass('vote-over').find('#time-box').removeClass('none').html('1111');
								};
							} else {
								if ($starting.length > 0) {
									var $prev = $starting.eq(0).prev('li');
									$starting.eq(0).addClass('none');
									$prev.removeClass('none').removeClass('over');
									$prev.find('.vote-count').removeClass('transparent');
									$prev.find('.vote-bar p span').removeClass('transparent');
									me.$timebox.removeClass('none');
									me.$timebox.html($starting.eq(0).attr('data-timestr'));
								} else if ($me.next('li').length == 0) {
									clearInterval(window.progressTimeInterval);
									$('.wait').addClass('vote-over').find('#time-box').removeClass('none').html('每周四晚22:20等你来');
								};
							};
						};
					}
				});
			});
		},
		preLoad: function() {
			$('.preme').animate({'opacity':'1'}, 500);
		},
		ddtj: function() {
			$('#ddtj').addClass('none');
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
		}
	};

	W.fashionIndexHandler = function(data){
		if (data.code == 0) {
			H.vote.preLoad();
			H.vote.fillActlist(data);
		} else {
			H.vote.preLoad();
		};
	};

	W.supportHandler = function(data){
		if(data.code == 0){
			H.vote.fillResult(data);
		};
	};

	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.desc && data.url) {
			$('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
		} else {
			$('#ddtj').remove();
		};
	};

})(Zepto);

$(function(){
	H.vote.init();
});