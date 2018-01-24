 $(function() {

	(function($) {

		H.cover = {
			scrollY : 0,
			startY : 0,
			restHeight : 0,
			slide : $(".cover-host"),
			cover : $(".cover"),
			init : function(){
				// 初始化钢管高度
				this.cover.removeClass('none');
				this.prereserve();
				this.guide();

				H.cover.coverReady();	
				
				// 绑定规则按钮
				$("#rule_open").click(function(){
					H.dialog.rule.open();
				});

				$("#appointment").click(function(e){
					e.preventDefault();
				
					var reserveId = $(this).attr('data-reserveid');
					var dateT = $(this).attr('data-date');
					if (!reserveId) {
						return;
					}
					shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveId, date:dateT},function(data) {});
				});

				// 一键关注
				if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
	                $('#div_subscribe_area').css('height', '0');
	            } else {
	                $('#div_subscribe_area').css('height', '50px');
	            };

			},

			coverReady : function(){
				var height = $(".title").height();
				// 循环遍历，直到正确绘出标题后，才显示钢管
				if(height > 0 && height < 196){
					var restHeight = $(window).height() - $(".cover-slide").offset().top - 45;
					$(".cover-slide .guan").css("height",restHeight + 'px').removeClass('none');
					H.cover.restHeight = restHeight;
					
					H.cover.slide.bind('touchstart',function(e){
						var touch=e.touches[0];
	                	H.cover.startY = touch.pageY;
					});

					H.cover.slide.bind('touchmove',function(e){
						if(!$(this).hasClass('disabled')){
							var touch = e.touches[0];
							y = touch.pageY - H.cover.startY;
							if(y > 0 && y < restHeight - 83){
								H.cover.slide.css("top", y);	
							}
							return false;
						}
					});

					H.cover.slide.bind('touchend',function(e){
						if(!$(this).hasClass('disabled')){
							var top = parseInt(H.cover.slide.css('top'),10);
							if(top > restHeight / 3){
								H.cover.coverClose();
							}else{
								H.cover.slide.addClass('back');
								H.cover.slide.css("top", 0);
								setTimeout(function(){
									H.cover.slide.removeClass('back');
								},500);
							}
						}
					});
				}else{
					setTimeout(function(){
						H.cover.coverReady();
					},40);
				}
			},

			guide : function(){
				if(location.search.indexOf('cb41faa22e731e9b') < 0){
					H.dialog.guide.open();
				}
			},

			coverClose : function(){
				H.cover.cover.addClass('fadeOut');
				H.record.init();

				if(H.round.selectedIndex == H.round.totalSize - 1){
					H.round.runFinalAnimate();
				}

				setTimeout(function(){
					H.cover.cover.addClass('none');
				},1500);
			},

			// 检查该互动是否配置了预约功能
			prereserve: function() {
				var me = this;

				$.ajax({
					type : 'GET',
					async : true,
					url : domain_url + 'api/program/reserve/get',
					data: {},
					dataType : "jsonp",
					jsonpCallback : 'callbackProgramReserveHandler',
					success : function(data) {
						
						if (!data.reserveId) {
							return;
						}
						// yao_tv_id: 微信为电视台分配的id
						window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(resp) {
							if(resp.errorCode == 0) {
								$("#appointment").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
							}
                        });
					}
				});
			},
		},

		H.record = {
			page : 1,
			pageSize : 100,
			data : {},
			recordWidth : 0,
			recordTime : 0,

			init : function(){
				getResult('api/mall/order/record', {
						page : this.page,
						pageSize : this.pageSize
				},'callbackMallOrderRecord');
			},

			initRecord : function(data){
				this.data = data;
				if(this.data.items.length > 0){	
					$recordHtml = '<li>';
					$len = 0;
					for(var i in this.data.items){
						$recordHtml += '' + this.data.items[i].rl + '成功兑换了' + this.data.items[i].n + '&nbsp;&nbsp;&nbsp;&nbsp;';
						$len += this.data.items[i].rl.length + 6 + this.data.items[i].n.length;
					}
					$recordHtml += '</li>';

					H.record.recordWidth = $len * 14 ;
					$(".award-list").html($recordHtml).css('width',this.recordWidth);
					H.record.recordTime = H.record.data.items.length * 8 ;
					
					this.runAgain();
				}
			},

			runAgain : function(){
				setTimeout(function(){
					$(".award-list").css('-webkit-transform','matrix(1, 0, 0, 1, 0, 0)');
					$(".award-list").css('-webkit-transition-duration','0s');
					setTimeout(function(){
						$(".award-list").css('-webkit-transform', 'matrix(1, 0, 0, 1, '+(-1 * H.record.recordWidth)+', 0)');
						$(".award-list").css('-webkit-transition-duration', H.record.recordTime + 's');
						setTimeout(function(){
							H.record.runAgain();
						}, H.record.recordTime * 1000);
					},200);
				},200);
			}
		}

		H.round = {
			selectedIndex: 0, 	// 用户滚动到的页面
			activeIndex: 0,		// 倒计时更新的页面
			
			curCountDownNext: 0,	// 倒计时进入下个页面
			nextTimeout : 0,
			curCountDownOut: 0,		// 倒计时当前页面开奖
			outTimeout : 0,
			timeOffset: 0,			// 与服务器时间时差

			selectedPluids: '', 	// 投票的条目
			selectedGuid: '',		// 投票的页面
			lotteryClicked: 0,		// 抽奖选中的礼物
			lotteryId: 0,			// 中奖礼物id
			lotteryPv: 0,			// 最后抽中的积分值
			roundData: {},
			$pages: $(".pages"),
			totalSize : 6,
			hasCover : true,

			init : function(hasCover) {
				this.hasCover = hasCover;
				showLoading();
				if (openid) {
					getResult('api/voteguess/info', {
						yoi : openid
					}, 'callbackVoteguessInfoHandler');
				}

			},

			initRounds: function(data){
				this.roundData = data;

				for(var i in data.items){
					this.initRound(data.items[i], i);
				}

				// 绑定投票按钮
				this.bindGuess();
				this.bindLottery();

				// 兼容ip4分辨率
				if($(window).height() < 500){
					$(".header-final img").css('padding-top','25px');
				}

				// 初始化滑动组件
				$('.pages').parallax({
					direction: 'horizontal', 	// vertical (垂直翻页)
					swipeAnim: 'default', 	// cover (切换效果)
					drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
					loading:   false,		// 有无加载页
					indicator: false,		// 有无指示点
					arrow:     true,		// 有无指示箭头
					onchange: function(index, element, direction) {
						if(direction != 'stay'){
							H.round.selectedIndex = index;
						}
					}
				});

				// 自动滑动到当前round
				setTimeout(function(){
					H.round.slideTo(H.round.activeIndex,false);	
				},300);
				
			},

			// 初始化一轮活动
			initRound: function(roundData, index){


				// 初始化选手展示
				if(roundData.pitems.length == 4){
					this.appendFour(roundData, index);
					var oneHeight = $(window).height() - 59 - 31 - 75 - 60 - (28 * 2);
					$("#page_"+index+" .team .avatar-wrapper").css('width', oneHeight/2);
					$("#page_"+index+" .team .avatar-wrapper").css('height', oneHeight/2);
					$("#page_"+index+" .round-wrapper").css('top',oneHeight/2 - 30);
				}else if(roundData.pitems.length == 3){
					this.appendThree(roundData, index);
					var oneHeight = $(window).height() - 59 - 31 - 75 - 60 - (28 * 2);
					$("#page_"+index+" .team .avatar-wrapper").css('width', oneHeight/2);
					$("#page_"+index+" .team .avatar-wrapper").css('height', oneHeight/2);
					$("#page_"+index+" .round-wrapper").css('top',oneHeight/2);
				}else{
					this.appendTwo(roundData, index);
					var roundHeight = $(window).height() - 59;
					$(".round3").css('height',roundHeight);
					var oneHeight = $(window).height() - 59 - 31 - 75 - 60 - 28;
					$("#page_"+index+" .team .avatar-wrapper").css('width', oneHeight/2);

					if(!this.hasCover){
						$(".round3").removeClass('none');
					}
				}

				this.updateRound(roundData, index);
			},

			// 根据每轮状态更新文案以及显示方式
			updateRound: function(roundData, index){
				// 更新已经选中的队伍
				this.updateSelected(roundData, index);
				
				// 更新顶部提示信息
				this.updateTopText(roundData, index, false);

				// 更新倒计时
				this.updateCountdown(roundData, index);

				// 更新每轮胜负
				this.updateWin(roundData, index, false);

				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				if(now > timestamp(roundData.put)){
					this.checkLotteryChance(index);
				}
			},

			updateSelected: function(roundData, index){
				if(roundData.so){
					$("#page_" + index).find('.team[pluids="'+roundData.so+'"]').addClass('selected');	
				}
			},

			updateCountdown: function(roundData, index){

				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				// 倒计时位
				if(now < timestamp(roundData.gst)){
					// 还没开始
					controlHtml = '<p>竞猜还未开始</p>';
					$("#page_" + index).addClass('none');
					$("#page_" + index).find('.vote-tips span.tipsText').html('竞猜还未开始');
				}else if(now > timestamp(roundData.get)){
					this.activeIndex = parseInt(index,10);
					if(index < this.totalSize - 1){
						// 当轮已结束
						controlHtml = '<p>本轮结果已公布</p>';
						$("#page_" + index).find('.vote-control').html(controlHtml);
					}else{
						controlHtml = '<p>本期竞猜已结束</p>';
						$("#page_" + index).find('.vote-control').html(controlHtml);
					}
					$("#page_" + index).find('.vote-wrapper').addClass('ended');
				}else if(now > timestamp(roundData.put)){
					this.activeIndex = parseInt(index,10);
					if(index < this.totalSize - 1){
						// 竞猜已结束，倒计时下轮开始
						controlHtml = '<p>距离下轮开始还有<span class="countdown">00:00</span></p>';
						$("#page_" + index).find('.vote-control').html(controlHtml);
						clearTimeout(H.round.nextTimeout);
						this.curCountDownNext = (timestamp(roundData.get) - now) / 1000;
						H.round.updateCountdownNext();
					}else{
						controlHtml = '<p>本期竞猜已结束</p>';
						$("#page_" + index).find('.vote-control').html(controlHtml);
					}
				}else{
					this.activeIndex = parseInt(index,10);
					// 竞猜未结束，倒计时竞猜结束
					controlHtml = '<p>距离本轮竞猜结束还有<span class="countdown">00:00</span></p>';
					$("#page_" + index).find('.vote-control').html(controlHtml);
					clearTimeout(H.round.outTimeout);
					this.curCountDownOut = (timestamp(roundData.put) - now) / 1000;
					H.round.updateCountdownOut();
				}
			},
			updateCountdownNext: function(){
				this.curCountDownNext -= 1;
				if(this.curCountDownNext >= 0){
					// 本页倒计时
					min = (this.curCountDownNext / 60 < 10 )? '0' + Math.floor(this.curCountDownNext / 60) : Math.floor(this.curCountDownNext / 60) ;
					sec = (this.curCountDownNext % 60 < 10) ? '0' + Math.floor(this.curCountDownNext % 60) : Math.floor(this.curCountDownNext % 60) ;
					$(".countdown").html(min + ':' + sec);
					H.round.nextTimeout = setTimeout(function(){
						H.round.updateCountdownNext();
					},1000);
				}else{
					// 倒计时结束后，跳转下一页
					if(this.activeIndex < this.totalSize - 1){
						if($("#page_" + this.activeIndex).find(".vote-control a").length <= 0){
							$("#page_" + this.activeIndex ).find('.vote-control').html("<p>本轮结果已公布</p>");	
						}

						this.activeIndex++;
						$("#page_" + this.activeIndex ).removeClass('none');
						setTimeout(function(){
							H.round.slideTo(H.round.activeIndex,true);
						},600);
						
						
						// 下一页倒计时初始化
						var localNow = new Date();
						var now = localNow.getTime() - this.timeOffset;
						controlHtml = '<p>距离本轮竞猜结束还有<span class="countdown">00:00</span></p>';
						$("#page_" + this.activeIndex).find('.vote-control').html(controlHtml);
						this.curCountDownOut = (timestamp(this.roundData.items[this.activeIndex].put) - now) / 1000;
						H.round.updateCountdownOut();

						this.updateTopText(this.roundData.items[this.activeIndex], this.activeIndex, false);
					}
				}
			},
			updateCountdownOut: function(){
				this.curCountDownOut -= 1;
				if(this.curCountDownOut >= 0){
					// 本页倒计时
					min = (this.curCountDownOut / 60 < 10 )? '0' + Math.floor(this.curCountDownOut / 60) : Math.floor(this.curCountDownOut / 60) ;
					sec = (this.curCountDownOut % 60 < 10) ? '0' + Math.floor(this.curCountDownOut % 60) : Math.floor(this.curCountDownOut % 60) ;
					$(".countdown").html(min + ':' + sec);
					H.round.outTimeout = setTimeout(function(){
						H.round.updateCountdownOut();
					},1000);
				}else{
					// 当前页开奖
					this.updateWin(this.roundData.items[this.activeIndex], this.activeIndex, true);
					this.updateTopText(this.roundData.items[this.activeIndex], this.activeIndex, true);
					
					$("#page_" + this.activeIndex).find('.vote-wrapper').addClass('ended');
					
					// 拉取抽奖剩余次数
					H.round.checkLotteryChance(this.activeIndex);

					if(this.activeIndex < this.totalSize - 1){
						// 开启跳转下页倒计时
						var localNow = new Date();
						var now = localNow.getTime() - this.timeOffset;
						controlHtml = '<p>距离下轮开始还有<span class="countdown">00:00</span></p>';
						$("#page_" + this.activeIndex).find('.vote-control').html(controlHtml);
						this.curCountDownNext = (timestamp(this.roundData['items'][this.activeIndex].get) - now) / 1000;
						H.round.updateCountdownNext();
					}else{
						controlHtml = '<p>本期竞猜已结束</p>';
						$("#page_" + this.activeIndex).find('.vote-control').html(controlHtml);
					}
					
				}
			},
			updateWin : function(roundData, index, forceEnd){
				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				if(forceEnd || now >= timestamp(roundData.put)){
					if(roundData.gt == 1){
						$("#page_" + index).find(".result-team").find('.icon-win').removeClass('none');	
					}else{
						$("#page_" + index).find(".result-team").find('.avatar').addClass('gray');
						$("#page_" + index).find(".result-team").find('.icon-lost').removeClass('none');
					}
				}
			},
			updateTopText : function(roundData, index, forceEnd){
				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				if(forceEnd || now >= timestamp(roundData.put)){
					var isRight = false;
					var isJoin = false;
					if(roundData.so){
						isJoin = true;
					}

					if(isJoin){
						for(var i in roundData.pitems){
							if(roundData.pitems[i].pid == roundData.so){
								if(roundData.pitems[i].re == 1){
									isRight = true;	
								}
							}
						}
					}
					
					if (!isJoin) {
						if(index < this.totalSize - 1){
							$("#page_" + index).find('.vote-tips span.tipsText').html('啊哦，该轮已结束，下轮竞猜马上开始');	
						}else{
							$("#page_" + index).find('.vote-tips span.tipsText').html('本期竞猜已结束，敬请留意下期节目');	
						}
						
					}else{
						if(isRight){
							$("#page_" + index).find('.vote-tips span.tipsText').html('恭喜您猜中了');	
						}else{
							if(index < this.totalSize - 1){
								$("#page_" + index).find('.vote-tips span.tipsText').html('啊哦，猜错了别灰心，下轮竞猜马上开始');
							}else{
								$("#page_" + index).find('.vote-tips span.tipsText').html('啊哦，猜错了别灰心，敬请留意下期节目');
							}
							
						}
					}
				}else{
					if(roundData.gt == 1){
						$("#page_" + index).find('.vote-tips span.tipsText').html('点击选手头像竞猜本轮答题<span class="win">胜出</span>选手');	
					}else{
						$("#page_" + index).find('.vote-tips span.tipsText').html('点击选手头像竞猜本环节答题<span class="lost">淘汰</span>的选手');
					}
				}
			},



			// 投票
			bindGuess: function(){
				$(".vote-wrapper a.team").click(function(){
					if($(this).parent().parent().hasClass('joined')){
						alert('该轮你已经参加过投票了哦~');
						return;
					}
					if($(this).parent().parent().hasClass('ended')){
						alert('该轮已经结束了哦~');
						return;
					}
					H.round.selectedPluids = $(this).attr('pluids');
					H.round.selectedGuid = $(this).parent().parent().attr('guid');
					getResult('api/voteguess/guessplayer', {
						yoi : openid,
						guid: $(this).parent().parent().attr('guid'),
						pluids: $(this).attr('pluids')
					}, 'callbackVoteguessGuessHandler');
				});
			},
			guessCallback: function(){
				$(".vote-wrapper[guid='"+this.selectedGuid+"'] a[pluids='"+this.selectedPluids+"']").addClass('selected');
				$(".vote-wrapper[guid='"+this.selectedGuid+"']").addClass('joined').removeClass('unjoined');

				this.roundData.items[this.selectedIndex]['jo'] = true;
				pitems = this.roundData.items[this.selectedIndex].pitems;
				for(var i in pitems){
					if(pitems[i].pid == this.selectedPluids){
						this.roundData.items[this.selectedIndex].pitems[i].jo = 1;
					}
				}
			},
			


			// 抽奖
			checkLotteryChance: function(index){
				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				if(now > timestamp(this.roundData.pst) && now < timestamp(this.roundData.pet)){
					getResult('api/lottery/leftChance', {
						oi : openid,
						pu : this.roundData.items[index].guid
					}, 'callbackLotteryLeftChanceHandler');
				}
			},
			lotteryLeftCallback: function(data){
				if(data.lc > 0){
					$(".page[guid='"+data.pu+"']").find('.vote-tips span.tipsText').html("恭喜您猜中了，快去拆礼盒吧");	

					var controlHtml = '<a data-collect="true" data-collect-flag="zhimakaimen-round-lottery" data-collect-desc="芝麻开门开礼盒按钮" id="lottery_'+data.pu+'" href="javascript:void(0)">开礼盒</a>';
					$(".page[guid='"+data.pu+"']").find(".vote-control").html(controlHtml);
					
					$("#lottery_" + data.pu).click(function(){
						H.round.showLotteryWrapper();
					});
				}
			},
			showLotteryWrapper: function(){
				$(".lottery-btn").removeClass('disabled');
				$(".lottery-btn img").css('visibility','visible').attr('src','./images/gift.png');
				$(".lottery-btn .award").remove();
				$(".lottery-tips").html('<p>点击礼盒进行抽奖</p>');
				$(".lottery-ok").addClass('none');
				$("#lottery").removeClass('none');
				$("#lottery .lottery-dialog").removeClass('none');

				var margin = ($(window).height() - 398) / 2;
				$("#lottery .lottery-dialog").css('top',margin).addClass('dialogIn');
				
			},
			bindLottery: function(){
				$(".lottery-dialog-close").click(function(){
					$("#lottery").addClass('none');
				});
				$(".lottery-btn").click(function(){
					if(!$(this).hasClass('disabled')){
						showLoading();
						$(this).find('img').attr('src',"../images/gift-open.png");
						H.round.lotteryClicked = $(this).attr('id');
						$(".lottery-btn").addClass('disabled');
						getResult('api/lottery/luck', {
							oi : openid,
							sn : openid,
							sau : H.round.roundData.items[H.round.selectedIndex].guid
						}, 'callbackLotteryLuckHandler');
					}
				});
			},
			lotteryLuckCallback: function(data){
				hideLoading();
				if(data.result){
					this.lotteryId = data.id;
					this.lotteryPv = data.pv;

					
					$imgUrl = "<img class='award awardIn none' src='"+data.pi+"' />";
					$("#" + H.round.lotteryClicked).append($imgUrl);
					$(".lottery-tips").html("<p>" + data.tt + "</p>");

					imgReady(data.pi, function(){}, function(){
						$("#" + H.round.lotteryClicked).find('.gift').css('visibility','hidden');
						$(".award").removeClass('none');
					});


					$(".lottery-ok").removeClass('none');
					$(".lottery-ok").click(function(){
						$("#lottery").addClass('none');
					});
					setTimeout(function(){
						getResult('api/lottery/prizes', {}, 'callbackLotteryPrizesHandler');
					},1500);
					
				}else{
					alert('好可惜，差一点点就中奖了');
					$("#lottery").addClass('none');
				}
				$("#lottery_" + H.round.selectedIndex).addClass('none');

				this.updateCountdown(this.roundData.items[this.selectedIndex],this.selectedIndex);
				$("#page_" + this.selectedIndex).find('.vote-tips span.tipsText').html('恭喜您猜中了');	
			},

			lotteryLeftLuckCallback: function(data){

				btnId = this.lotteryClicked.split('_');
				var arr = [];
				for(var i = 0 ; i < 6 ; i++ ){
					if(i != parseInt(btnId[2],10)){
						arr.push(i);	
					}
				}
				// 将数组打乱顺序
				arr.sort(function(){return Math.random()>0.5?-1:1;});

				var j = 0;
				for(var i in data.pa){
					if(data.pa[i].id != this.lotteryId){
						this.updateLeftLuck(data.pa[i].pi, arr[j]);
						j++;
					}
				}
			},

			updateLeftLuck: function(url, index){
				$("#lottery_btn_" + index).find('img').css('visibility','hidden');
				$imgUrl = "<img class='gray award awardIn' src='"+ url +"' />";
				$("#lottery_btn_" + index).append($imgUrl);
			},
			isValidhLotteryTime: function(roundData){
				var localNow = new Date();
				var now = localNow.getTime() - this.timeOffset;
				if(now > timestamp(roundData.put) && now < timestamp(this.roundData.pet)){
					return true;
				}else{
					return false;
				}
			},

			runFinalAnimate: function(){
				$(".header-animate").removeClass('none');
				setTimeout(function(){
					$(".header-animate img").addClass('in');
						setTimeout(function(){
						$(".final-animate-wrapper").removeClass('none').addClass('fadeOut');
						$(".round3").removeClass('none');
						$(".header-animate").addClass('none');
						setTimeout(function(){
							$(".final-animate-wrapper").addClass('none');
						},2000);
					},2000);
				},50);
			},



			// parallax插件滚动到指定页
			slideTo: function(index, runFinal){
				$('.pages').removeClass('current');
				$('#page_' + index).addClass('current');
				this.$pages.css("-webkit-transform", "matrix(1, 0, 0, 1, -" + (index * $(window).width()) + ", 0)");
				this.selectedIndex = this.activeIndex;
				window.curPage = parseInt(this.activeIndex,10);

				$('.parallax-arrow.right').removeClass('none');
				$('#page_' + index).find('.parallax-arrow.right').addClass('none');

				if(runFinal){
					if(this.selectedIndex == this.totalSize - 1 && $(".round3").hasClass('none')){
						this.runFinalAnimate();
					}	
				}
				
			},

			appendFour:function(roundData, index){
				$html = '<section class="page" guid="'+roundData.guid+'"  id="page_'+index+'">' +
						'<section class="vote-tips">' + 
							'<span class="tips-out"><span class="tipsText"></span></span>' +
						'</section>' +
					'<section class="body round1">' +
						'<section class="vote-wrapper '+(roundData.so ? 'joined' : 'unjoined' )+'" guid='+roundData.guid+'>' +
							'<section class="vote-line-1">' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票"  href="javascript:void(0)" pluids="'+(roundData.pitems[0].pid)+'"  class="team team1  '+(roundData.pitems[0].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[0].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[0].na+'</span>' +
								'</a>' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[1].pid)+'" class="team team2  '+(roundData.pitems[1].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[1].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[1].na+'</span>' +
								'</a>' +
							'</section>' +
							'<section class="vote-line-2">' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[2].pid)+'" class="team team4  '+(roundData.pitems[2].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[2].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[2].na+'</span>' +
								'</a>' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[3].pid)+'" class="team team3  '+(roundData.pitems[3].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[3].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[3].na+'</span>' +
								'</a>' +
							'</section>' +
							'<section class="round-wrapper">' +
								'<section class="round-1"></section>' +
							'</section>' +
						'</section>' +
						'<section class="vote-control"></section>' +
					'</section>';
					this.$pages.append($html);
			},

			appendThree: function(roundData, index){
				$html = '<section class="page" guid="'+roundData.guid+'" id="page_'+index+'">' +
						'<section class="vote-tips">' + 
							'<span class="tips-out"><span class="tipsText"></span></span>' +
						'</section>' +
					'<section class="body round2">' +
						'<section class="vote-wrapper '+(roundData.so ? 'joined' : 'unjoined' )+'"  guid='+roundData.guid+'>' +
							'<section class="vote-line-1">' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[0].pid)+'" class="team team1  '+(roundData.pitems[0].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[0].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[0].na+'</span>' +
								'</a>' +
							'</section>' +
							'<section class="vote-line-2">' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[1].pid)+'" class="team team4  '+(roundData.pitems[1].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[1].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[1].na+'</span>' +
								'</a>' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[2].pid)+'" class="team team3  '+(roundData.pitems[2].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[2].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">' + roundData.pitems[2].na + '</span>' +
								'</a>' +
							'</section>' +
							'<section class="round-wrapper">' +
								'<section class="round-2"></section>' +
							'</section>' +
						'</section>' +
						'<section class="vote-control"></section>' +
					'</section>';
				this.$pages.append($html);
			},

			appendTwo: function(roundData, index){
				$html = 
		        '<section class="page" guid="'+roundData.guid+'" id="page_'+index+'">' +
		        	'<section class="header-animate none">' +
						'<img class="left" src="./images/icon-ice.png">' +
						'<img class="right" src="./images/icon-fire.png">' +
					'</section>' +
		        	'<section class="body round3 none">' +
						'<section class="header-final">' +
							'<img class="" src="./images/title-final.png">' +
						'</section>' +
						'<section class=" vote-wrapper '+(roundData.so ? 'joined' : 'unjoined' )+'" guid='+roundData.guid+'>' +
							'<section class="vote-line-1">' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[0].pid)+'" class="team team1  '+(roundData.pitems[0].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[0].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[0].na+'</span>' +
								'</a>' +
								'<a data-collect="true" data-collect-flag="zhimakaimen-vote" data-collect-desc="芝麻开门-投票" href="javascript:void(0)" pluids="'+(roundData.pitems[1].pid)+'" class="team team2  '+(roundData.pitems[1].re == 1 ? 'result-team' : '')+'">' +
									'<section class="avatar-wrapper">' +
										'<img class="avatar" src="'+roundData.pitems[1].im+'">' +
										'<img class="shadow" src="./images/bg-guang.png">' +
										'<section class="icon-win none"><img src="./images/icon-win.png" /></section>' + 
										'<section class="icon-lost none"><img src="./images/icon-lost.png" /></section>' + 
									'</section>' +
									'<span class="name">'+roundData.pitems[1].na+'</span>' +
								'</a>' +
							'</section>' +
						'</section>' +
						'<section class="vote-tips">' +
							'<span class="tips-out"><span class="tipsText"></span></span>' +
						'</section>' +
						'<section class="vote-control"></section>' +
					'</section>' +
		        '</section>' ;
				this.$pages.append($html);
			}
		};

		W.callbackVoteguessInfoHandler = function(data) {
			hideLoading();
			if (data.code == 0) {
				H.round.initRounds(data);
				$(".cover-host").removeClass('disabled');
			} else {
				alert(data.message);
			}
		};

		W.callbackVoteguessGuessHandler = function(data) {
			hideLoading();
			if (data.code == 0) {
				alert('投票成功~');
				H.round.guessCallback(data);
			} else {
				alert(data.message);
			}
		};

		W.callbackLotteryLeftChanceHandler = function(data) {
			if (data.result) {
				H.round.lotteryLeftCallback(data);
			}
		};

		W.callbackLotteryLuckHandler = function(data){
			H.round.lotteryLuckCallback(data);
		};

		W.callbackMallOrderRecord = function(data){
			if(data.code == 0){
				H.record.initRecord(data);	
			}
		};

		W.callbackLotteryPrizesHandler = function(data){
			if(data.result){
				H.round.lotteryLeftLuckCallback(data);
			}
		}

	})(Zepto);

	if(window.location.href.indexOf('nocover') == -1){
		H.cover.init();	
		H.round.init(true);
	}else{
		H.record.init();
		H.cover.cover.addClass('none');
		H.round.init(false);
	}

});
