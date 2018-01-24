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
			var me = this;
			
			if (yao_openid) {
				this.$pages.removeClass('disabled');
			} else {
				this.$pages.addClass('disabled');
				return;
			}
			
			if (this.from && window['localStorage'] && !localStorage.nextoneGuided) {
				setTimeout(function() {
					H.dialog.guide.open();
				}, 800);
			}
			
			getResult('comedian/index', {
				tsuid: stationUuid,
				yp: openid,
				serviceNo: serviceNo
			}, 'callbackComedianIndex', true);
			
			// 每5s获取pv
			this.update_pv();
			
			// 每20分钟获取一次中奖记录
			this.update_record();
			
			H.weixin.init();
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
		
		update_pv: function() {
			getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			setInterval(function() {
				getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			}, 5000);
		},
		
		update_record: function() {
			W.lottery_record = W.lottery_record || [];
			getResult('comedian/querywin', {tsuid: stationUuid, tcuid: channelUuid}, 'callbackComedianQuerywin');
			setInterval(function() {
				getResult('comedian/querywin', {tsuid: stationUuid, tcuid: channelUuid}, 'callbackComedianQuerywin');
			}, 600000);
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
		        	var share_txt = '安徽卫视分享' + (type == 'message' ? '给朋友' : '到朋友圈'),
		        		share_type = 'ah-share-' + type;
		        	recordUserOperate(openid, share_txt, share_type);
		        	
		        	if (!/\:cancel$/i.test(res.err_msg)) {
		        		recordUserOperate(openid, share_txt + '成功', share_type + '-success');
		        		
		        		getResult('comedian/share', {
		        			puid: H.page.puid,
		        			yp: openid
		        		}, 'callbackComedianShare');
		        	}
		        }
			});
		}
	};
	
	H.page = {
		puid: 0,
		curr_time: new Date().getTime(),
		$pages: $('#pages'),
		$top_outer: $('#ui-outer-top'),
		$top_inner: $('#ui-inner-top'),
		s_type: 0,
		TURNED_CLS: 'turned',
		STARTING_CLS: 'starting',
		timeout: true,
		time: 4000,
		init: function(data) {
			var me = this;
			$("#show-result").before(this.tpl(data));
			if (this.$pages.find('.page').length <= 1) {
				return;
			}
			/** 初始滑动效果 **/
			H.myScroll.init(data);
			var parallax = me.$pages.parallax({
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
			
			var height = $(window).height();
			$('.xs-wrapper').css('height', height * 0.4).css('marginTop', height * 0.2).find('img').css('maxHeight', height * 0.4);
			$('.ctrl-wrapper').css('height', height * 0.4);
			
			me.event_handler();
			me.progress();
			
			// 每隔5s更新投票比率
			setInterval(function() {
				$.each(W['pages_info'], function(key, value) {
					if (value['state'] > 1 && value['guid']) {
						getResult('comedian/group/' + value['guid'], {}, 'callbackComedianGroup');
					}
				});
			}, 5000);
		},
		
		to: function(guid) {
			var width = $(window).width(),
				$pages = this.$pages.find('.page'),
				index = $pages.index('[data-guid="'+ (guid || 0) +'"]');
			
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
		
		progress: function() {
			var me = this;
			$('.progress-bar').each(function(index) {
				var $me = $(this),
					$prev = $me.prev(),
					guid = $me.attr('data-guid'),
					$page = me.get_page(guid),
					$prev_page = $page.prev(),
					result = parseInt($page.attr('data-sr'));

				$me.progress({
					index: index,
					cTime: me.curr_time,
					callback: function(state) {
						// 最后一个已出场的选手
						var $last_page = $('.page').not(function() {
							return $(this).hasClass('none');
						}).last();
						
						if (!$last_page.hasClass(me.TURNED_CLS)) {
							var state_val = $last_page.attr('data-state');
							if (!state_val) {
								return;
							}
							$last_page.addClass(me.TURNED_CLS);
							if (state_val >= 3 && $last_page.next().length == 0) {
								var $first = $('.page').eq(1);
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function() {
										if($("#show-result").hasClass("none")){
											me.to($first.length > 0 ? $first.attr('data-guid') : 0);
										}
									}, me.time);
								} else {
									if($("#show-result").hasClass("none")){
										me.to($first.length > 0 ? $first.attr('data-guid') : 0);
									}
								}
							} else {
								if (me.timeout) {
									me.timeout = false;
									setTimeout(function(){
										if($("#show-result").hasClass("none")){
											me.to($last_page.attr('data-guid'));
										}
									}, me.time);
								} else {
									if($("#show-result").hasClass("none")){
										me.to($last_page.attr('data-guid'));
									}
								}
							}
						}
						me.update_state(guid);
					},
					stCallback: function(state) {// 即将开始
						$page.addClass('none');
						var last_state = index > 0 ? W['pages_info'][index - 1]['state'] : 0;
						if (last_state >= 3 || last_state == 0) {
							H.index.show_nexttip();
							$page.addClass(me.STARTING_CLS).removeClass('none');
						}
					},
					sdCallback: function(state) { // 正在进行
						$page.removeClass(me.STARTING_CLS).removeClass('none');
						H.index.show_pvtip();
					},
					otCallback: function(state) {// 表演结束
						$page.find('.cwc-item').addClass('none');
						$page.find('.cw-voted').removeClass('none');
					},
					ptCallback: function(state) { // 结果公布
						$page.find('.cwc-item').addClass('none');
						$page.find('.cw-voted').removeClass('none');
						$page.find('.xs-wrapper').addClass('type t' + result);
						
						if ($page.attr('data-vote')) {
							$page.removeAttr('data-vote');
							
							W.gc ++;
							if (parseInt($page.attr('data-type')) == result) {
								W.lc += 1;
								W.hc += 1;
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
				var type = $(this).attr('data-type'),
					$page = $(this).closest('.page'),
					guid = $page.attr('data-guid');
				
				if ($page.hasClass(me.STARTING_CLS)) {
					H.dialog.tip.open();
					return false;
				}
				getResult('comedian/guess', {
					guid: guid, 
					yp: openid,
					rsl: type
				}, 'callbackComedianGuess', true);
			});
		},
		
		get_page: function(group_id) {
			return $('#page-' + group_id);
		},
		
		vote: function(type, group_id) {
			/** 投票成功 页面处理**/
			var $page = this.get_page(group_id),
				result = parseInt($page.attr('data-sr')),
				attr = this.get_attr(type);
			
			$page.find('.cwc-item').addClass('none');
			$page.find('.cw-voted').removeClass('none');
			$page.attr('data-vote', true).attr('data-type', type).attr(attr, parseInt($page.attr(attr)) + 1).attr('data-total', parseInt($page.attr('data-total')) + 1);
			
			H.page.update_state(group_id);
		},
		
		update_rate: function(data) {
			if (data.guid) {
				var $page = this.get_page(data.guid),
					pc = data.pc || 0,
					wc = data.wc || 0,
					wdc = data.wdc || 0,
					total = pc + wc + wdc;
				
				$page.attr('data-t1', pc).attr('data-t2', wc).attr('data-t3', wdc).attr('data-total', total);
				H.page.update_state(data.guid);
			}
		},
		
		update_state: function(group_id) {
			var me = this,
				$page = this.get_page(group_id),
				type = $page.attr('data-type'),
				attr = me.get_attr(type),
				total = $page.attr('data-total'),
				$vote = $page.find('.cw-vote'),
				$voted = $page.find('.cw-voted'),
				$ctrl = $page.find('.cwr-ctrl'),
				$tip = $page.find('.tips-txt'),
				$btn_result = $page.find('.btn-result'),
				$btn_lottery = $page.find('.btn-lottery');
				
			// 初次竞猜--竞猜获得抽奖机会
			// 初次竞猜-竞猜未出结果--等待开奖，祝您好运
			// 还有抽奖机会--您有1次抽奖机会
			// 非初次竞猜-有抽奖机会--您有1次抽奖机会
			// 非初次竞猜-竞猜未出结果-有抽奖机会--您有1次抽奖机会
			// 没有抽奖机会--您还未中奖，继续加油
			// 非初次竞猜-无抽奖机会--您猜中了2次，离大奖越来越近了
			// 非初次竞猜-竞猜未出结果-无抽奖机会--您猜中了2次，离大奖越来越近了
			if (W.lc > 0) { // 剩余抽奖次数
				$btn_lottery.removeClass('none');
				$tip.text('晋级结果在节目最后揭晓,猜对一次即有一次抽奖机会');
			} else {
				$tip.text('晋级结果在节目最后揭晓,猜对一次即有一次抽奖机会');
				$btn_lottery.addClass('none');
				if (W.hc > 0) { // 猜中次数
					//$tip.text('您猜中了'+ W.hc +'次，离大奖越来越近了');
				} else {
					//$tip.text('您还未中奖，继续加油');
				}
			}
			if (W.jo || W.gc > 0) { // 参与次数
				$btn_result.removeClass('none');
			} else {
				$btn_result.addClass('none');
				!$vote.hasClass('none') && $tip.text('晋级结果在节目最后揭晓,猜对一次即有一次抽奖机会');
				!$voted.hasClass('none') && $tip.text('晋级结果在节目最后揭晓,猜对一次即有一次抽奖机会');
			}
			
			$ctrl.removeClass('none');
			if ($voted.hasClass('none')) {
				return;
			}
			
			var $dl = $page.find('dl').attr('data-percent', 0);
			/**投票比率 **/
			$page.find('.pg').each(function() {
				var percent_attr = parseInt($dl.attr('data-percent')) || 0;
				if ($(this).closest('.cv-progress-tt').length > 0) {
					percent = 100 - percent_attr;
				} else {
					percent = Math.round($page.attr(me.get_attr($(this).attr('data-type'))) * 100 / total)
					$dl.attr('data-percent', percent + percent_attr);
				}
				percent = Math.max(0, percent);
				percent = Math.min(100, percent);
				
				//晋级百分比
				if($(this).attr("data-type")==3){
					var ttpercent = 100-parseInt($(this).parent().parent().find(".pgt_jj").text().replace("%"));
					$(this).parent().parent().find(".pgt_tt").text(ttpercent+"%");
					$(this).css('width', ttpercent + '%');
				}else{
					$(this).parent().parent().find(".pgt_jj").text(percent+"%");
					$(this).css('width', percent + '%');
				}
				
			});
			$page.find('dt').text(this.get_label(type));
			$page.find('.cwc-item').addClass('none');
			$voted.removeClass('none');
			$tip.text('晋级结果在节目最后揭晓,猜对一次即有一次抽奖机会');
		},
		
		get_attr: function(type) {
			return 'data-t' + type;
		},
		
		get_label: function(type) {
			var label = ['晋级', '待定', '淘汰'];
			if (type > 0) {
				return '您猜此选手将会' + label[parseInt(type) - 1];
			} else {
				return '用户的竞猜结果：';
			}
		},
		
		/**  组装选手**/
		tpl: function(data) {
			var t = simpleTpl(),
				items = data.items || [];
			
			this.curr_time = timestamp(data.cud);  //活动开始时间  （） 
			this.puid = data.puid;  //活动场次
			H.dialog.puid = this.puid;
			
			W.jo = data.jo;
			W.gc = data.gc;
			W.hc = data.hc;
			W.lc = data.lc;

			H.index.$pv_num.text(data.pv).closest('.pv-tips').removeClass('none');
			
			for (var i = 0, len = items.length; i < len; i ++) {
				var voted = items[i].ij,
					over = timestamp(items[i].pt) <= timestamp(data.cud),
					vote_cls = voted ? 'none' : (over ? 'none' : ''),
					voted_cls = voted ? '' : 'none',
					result_cls = 'none';	//over ? '' : 'none';
					
				W['pages_info'] = W['pages_info'] || {}; 
				W['pages_info'][i] = {'guid': items[i].guid, 'type': items[i].ij};
				
				t._('<div class="page" id="page-'+ items[i].guid +'" data-type="'+ items[i].ij +'" data-guid="'+ items[i].guid +'" data-sr="'+ items[i].sr +'" data-t1="'+ items[i].pc +'" data-t2="'+ items[i].wc +'" data-t3="'+ items[i].wdc +'" data-total="'+ (items[i].pc + items[i].wc + items[i].wdc) +'">');
		        	t._('<div class="xs-wrapper type t'+ (over ? items[i].sr : '') +'">')
		        		._('<img src="'+ items[i].pi +'" />')
		        	._('</div>')
		        	._('<div class="ctrl-wrapper">')
		        		._('<div class="cw-progress">')
		        			._('<p class="progress-bar" data-guid="'+ items[i].guid +'" ptime="'+ timestamp(items[i].pt) +'" etime="'+ timestamp(items[i].set) +'" stime="'+ timestamp(items[i].sst) +'"></p>')
		        		._('</div>');
		        	
		        		t._('<div class="cwc-item cw-vote '+ vote_cls +'">')
		        			._('<div class="cw-btns">')
		        				._('<a href="#" id="btn-jj'+i+'" class="btn-vote btn-jinji cli-jinji'+i+'" data-type="1" data-collect="true" data-collect-flag="ah-index-votejj" data-collect-desc="安徽首页-晋级按钮" ></a>')
			        			._('<a href="#" id="btn-tt'+i+'" class="btn-vote btn-taotai cli-taotai'+i+'" data-type="3" data-collect="true" data-collect-flag="ah-index-votett" data-collect-desc="安徽首页-淘汰按钮"></a>')
			        			._('<span style="line-height: 58px;  font-size: 16px;  color: red;position: absolute;left:38%;z-index:-1;">晋级</span>')
								._('<span style="line-height: 58px;  font-size: 16px;  color: green;position: absolute;right:38%;z-index:-1;">淘汰</span>')
		        			._('</div>')
		        		._('</div>');
		        		
		        		t._('<div class="cwc-item cw-voted '+ voted_cls +'">')
		        			._('<dl class="vote-result">')
		        				._('<dt>您猜此选手将会<span class="stt"></span></dt>')
		        				._('<dd class="clearfix">')
		        					._('<div class="mes-jj">晋级')
									._('<br/><span class="pgt_jj" style="font-size:16px;">0%</span></div>')
									._('<div class="mes-tt" >淘汰')
									._('<br/><span class="pgt_tt" style="font-size:16px;">0%</span></div>')
		        					._('<div class="cv-progress cv-progress-jj">')
		        						._('<p class="pg" data-type="'+ 1 +'" style=" float: left;"></p>')
										._('<p class="pg" data-type="'+ 3 +'" style=" float: left;background:rgba(100,170,5,1);"></p>')
		        					._('</div>')
		        				._('</dd>')

		        			._('</dl>')
		        		._('</div>');
		        		
		        		t._('<div class="cwc-item cw-result '+ result_cls +'">')
		        			._('<div class="movie" data-guid="'+ items[i].guid +'" data-collect="true" data-collect-flag="ah-index-tomovie" data-collect-desc="安徽首页-进入视频页">')
		        				._('<div class="cover"><img src="'+ items[i].vi +'" /></div>')
		        				._('<div class="content">')
		        					._('<h3 class="ellipsis">《超级笑星》<span>'+ items[i].da +'</span></h3>')
		        					._('<p>'+ items[i].vd +'</p>')
		        					._('<a href="#">立即分享</a>')
		        				._('</div>')
		        			._('</div>')
		        		._('</div>');
		        		
		        		t._('<div class="cwr-ctrl ctrl">')
	        				._('<p class="tips"><span class="tips-txt"></span><br/><a href="#" class="btn-rule" data-collect="true" data-collect-flag="ah-index-rulebtn" data-collect-desc="安徽首页-规则弹层按钮">查看规则</a></p>')
	        			._('</div>');
        			
		        	t._('</div>')
		        ._('</div>');
			}
			return t.toString();
		}
	};
	H.myScroll = {
		startX:0,//触摸时的坐标
		startY:0,
		x:0, //滑动的距离
		y:0,
		aboveY:0, //设一个全局变量记录上一次内部块滑动的位置 
		is_jj:true,
		cl:"",
		mam:60,
		init:function(data){
			for(var i=0;i<data.items.length;i++){
				document.getElementById("btn-jj"+i).addEventListener('touchstart', this.touchSatrt,false);  
				document.getElementById("btn-jj"+i).addEventListener('touchmove', this.touchMove,false);  
				document.getElementById("btn-jj"+i).addEventListener('touchend', this.touchEnd,false);
				document.getElementById("btn-tt"+i).addEventListener('touchstart', this.touchSatrt,false);  
				document.getElementById("btn-tt"+i).addEventListener('touchmove', this.touchMove,false);  
				document.getElementById("btn-tt"+i).addEventListener('touchend', this.touchEnd,false);
			}

		},
		touchSatrt:function(e){//触摸
			cl = e.srcElement.classList[2];
			e.preventDefault();
			var touch=e.touches[0];
			$("#pages").addClass("disabled");
			startY = touch.pageY;   //刚触摸时的坐标      
			startX = touch.pageX;   //刚触摸时的坐标     
			is_jj = startX >150 ? false:true;
			mam = $(this).parent().width()/2-60;
		
		},
		touchMove:function(e){//滑动
			 e.preventDefault();        
			 var  touch = e.touches[0];               
			 y = touch.pageY - startY;//滑动的距离
			 x = touch.pageX - startX;//滑动的距离
			 if(is_jj){
				x = x > mam ? mam:x;
				x = x < 0 ? 0:x;
				$("."+cl).css("margin-left",x+"px");
			 }else{
                x = -x;  
				x = x > mam ? mam:x;
				x = x < 0 ? 0:x;
				$("."+cl).css("margin-right",x+"px");
			 }
		 },
		 touchEnd:function(e){//手指离开屏幕
			  e.preventDefault();
			  $("."+cl).css("margin-left","0px");
			  $("."+cl).css("margin-right","0px");
			  $("#pages").removeClass("disabled");
			  if(x>=mam){
				  var type = $(this).attr('data-type'),
					  $page = $(this).closest('.page'),
					  guid = $page.attr('data-guid');
					
				  if ($page.hasClass(H.page.STARTING_CLS)) {
					  H.dialog.tip.open();
					  return false;
				  }
				  getResult('comedian/guess', {
						guid: guid, 
						yp: openid,
						rsl: type
					}, 'callbackComedianGuess', true);
			  }
		}
	};

	
	W.callbackComedianIndex = function(data) {
		if (data.code != 0) {
			return;
		}
		
		var totime = timestamp(data.put) - timestamp(data.cud) <= 0 ? 50:timestamp(data.put) - timestamp(data.cud);
		setTimeout(function(){H.cjdialog.init();},parseInt(totime));
		
		H.page.init(data);
		H.index.init_audio(data.vul);
	};
	
	W.callbackComedianGuess = function(data) {
		if (data.code != 0) {
			alert(data.message);
			return;
		}
		H.page.vote(data.rsl, data.guid);
	};
	
	W.callbackCountServicePvHander = function(data) {
		if (data.c) {
			H.index.$pv_num.text(data.c);
		}
	};
	
	W.callbackComedianGroup = function(data) {
		H.page.update_rate(data);
	};
	
	W.callbackComedianShare = function(data) {
		if (data.code == 0) {
			W.jo = true;
			W.gc = data.gc;
			W.hc = data.hc;
			W.lc = data.lc;
		}
	};
	
	// 中奖记录
	W.callbackComedianQuerywin = function(data) {
		if (data.code == 0) {
			W.lottery_record = data.items || [];
		}
	};
	
})(Zepto);

H.index.init();