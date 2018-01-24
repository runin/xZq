(function($) {
	H.index = {
		nowTime: null,
		isLottery: true,
		leftCount: 0,
		init: function() {
			var me = this;
			if(openid == "" || openid == null){
				return false;
			};
			imgReady(index_bg, function() {
				$('html').css('background-color', '#003366');
				$('body').css({
					'background-size': document.documentElement.clientWidth + 'px auto',
					'background-image': 'url('+ index_bg +')',
					'height': document.documentElement.clientHeight + 'px'
				});
				$('#tab').removeClass('none').addClass('bounce-in-up');
				$('#jifen').attr('href', "javascript:toUrl('user.html');");
				getResult('user/jf', {oi: openid}, 'callbackUserjfHandler', true);
				//getResult('news/travel', {},'newsTravelHandler');
				setTimeout(function(){
					$('#award').addClass('cjani1');
					setTimeout(function(){$('#award').removeClass('cjani1').addClass('cjani2')}, 2600);
				}, 50);
			});

			
			this.event();
			this.tz();
			this.leftLotteryCount();
			this.newList();
		},
		btn_animate: function(str){
			str.addClass('flipInY');
			setTimeout(function(){
				str.removeClass('flipInY');
			},200);
		},
		event: function() {
			var me = this;
			$('.mxp').click(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				toUrl('postcard.html');
			});
			$('.bn').click(function(e){
				e.preventDefault();
				me.btn_animate($(this));
				toUrl('bn.html');
			});
			$('#comments').click(function(){
				toUrl('comments.html');
			});
			$('#apply').click(function(){
				toUrl('signup.html?uuid=' + $('#apply').attr('data-uuid'));
			});
			$('#comments').click(function(){
				toUrl('comments.html');
			});
			$("#btn-begin").click(function(){
				if(getQueryString('from') || getQueryString('gefrom') || !getQueryString('cb41faa22e731e9b')) {
					showTips('看电视-玩微信-摇一摇-抢大奖<br/>对着电视摇进来才能摇奖哦');
					return;
				}
				toUrl("answer.html");
			});
			if (me.isLottery) {
				me.isLottery = false;
				$('#award').click(function(e){
					e.preventDefault();
					H.dialog.fudai.open();
				});
			};
			$("#rule-close").click(function(e){
				e.preventDefault();
				$('.rule-section').addClass('guide-top-ease');
				setTimeout(function()
				{
					$('.rule-section').addClass('none');
					$('.rule-section').removeClass('guide-top-ease');
				},700);
			});
			$('ul').click(function(e){
				e.preventDefault();
				var me = $(this).find('li').eq(0);
				if(me.attr('data-gu')){
					toUrl(me.attr('data-gu'));
				}else{
					toUrl('detail.html?uid=' + me.attr('data-uid'));
				}
			});
		},
		tz: function(){
			getResult('findyou/info',{},'callbackFindyouInfo',true);
		},
		leftLotteryCount: function() {
			getResult('api/lottery/leftLotteryCount', {oi:openid}, 'callbackLotteryleftLotteryCountHandler');
		},
		lotteryRound: function(){
			getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');
		},
		tzIsShow: function(data){
			var me = H.index;
			if(data.desc && (comptime(data.pst, data.cut)>= 0 && comptime(data.cut, data.pet)>= 0)){
				$('.con').html(data.desc);
				$('.rule-section').removeClass('none');
		
	
			}
		},
		newList: function(){
			getResult('api/ article /list', {}, 'callbackArticledetailListHandler', true);
		},
		scroll: function(options){
			$('.marquee').each(function(i) {
				var me = this, com = [], delay = 1000;
				var len  = $(me).find('li').length;
				var $ul = $(me).find('ul');
				if (len == 0) {
					$(me).addClass('none');
				} else {
					$(me).removeClass('none');
				}
				if(len > 1) {
					com[i] = setInterval(function() {
						$(me).find('ul').animate({'margin-top': '-25px'}, delay, function() {
							$(me).find('ul li').eq(0).appendTo($ul);
							$(me).find('ul').css({'margin-top': '0'});
						});
					}, 3000);
				};
			});
		},
		fillNewTilt: function(data){
			var t = simpleTpl(),
				items = data.arts,
				$ul = $('ul');
			for(i = 0, len = items.length; i< len; i++){
				t._('<li data-uid = "'+ items[i].uid +'" data-gu="'+ items[i].gu +'">'+ items[i].t +'</li>')
			}
			$ul.append(t.toString());
			this.scroll();
		},
		lotteryAct:function(data){
            var me = this,
            	prizeActListAll = data.la,
             	prizeLength = 0,
				nowTimeStr = H.index.nowTime,
				prizeActList = [],
				day = nowTimeStr.split(" ")[0];

			if(prizeActListAll && prizeActListAll.length > 0) {
				for (var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].pd == day){
						prizeActList.push(prizeActListAll[i]);
					}
			    }
			};
			prizeLength = prizeActList.length;
            if(prizeActList.length >0){
	            if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) > 0) {
	             	H.index.isLottery = false;
	             	me.hideLottery();
	             	return;
	            };
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0 && comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) <= 0 && H.index.leftCount<=0){
	             	H.index.isLottery = false;
	             	me.hideLottery();
	             	return;
			    };
		        for (var i = 0; i < prizeActList.length; i++) {
		        	var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
		        	var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
		        	var beginTime = str2date(beginTimeStr), endTime = str2date(endTimeStr), nowTime = str2date(nowTimeStr);
		        	if(comptime(beginTimeStr,nowTimeStr) >= 0 && comptime(nowTimeStr,endTimeStr) >= 0 && H.index.leftCount > 0){
		        		H.index.isLottery = true;
			        	var lastEndTime = new Date(endTime).getTime() - new Date(nowTime).getTime();
		        		setTimeout(function() {me.hideLottery();H.index.isLottery = false;}, lastEndTime);
		        		me.showLottery();
		        	};
		        	if (comptime(beginTimeStr,nowTimeStr) < 0) {
		        		H.index.isLottery = false;
			        	var lastBeginTime = new Date(beginTime).getTime() - new Date(nowTime).getTime();
			        	var lastEndTime = new Date(endTime).getTime() - new Date(nowTime).getTime();
		        		setTimeout(function() {me.showLottery();H.index.isLottery = true;}, lastBeginTime);
		        		setTimeout(function() {me.hideLottery();H.index.isLottery = false;}, lastEndTime);
		        	};
		        };
		    } else {
		    	H.index.isLottery = false;
		    	me.hideLottery();
		    	return;
			};
        },
        getLottery: function(){
        	getResult('api/lottery/luck', {oi: openid}, 'callbackLotteryLuckHandler', true, null);
        },
		showLottery: function() {
			$('#award').removeClass('none');
			$('.awardline').removeClass('none');
			$('.tab span').css('margin', '0 12px');
		},
		hideLottery: function() {
			$('#award').addClass('none');
			$('.awardline').addClass('none');
			$('.tab span').css('margin', '0 20px');
		},
		timeTransform: function(TimeMillis){
			var data = new Date(TimeMillis);
			var year = data.getFullYear();
			var month = data.getMonth()>=9?(data.getMonth()+1).toString():'0' + (data.getMonth()+1);//获取月
			var day = data.getDate()>9?data.getDate().toString():'0' + data.getDate(); //获取日
			var hours = data.getHours()>9?data.getHours().toString():'0' + data.getHours();
			var minutes = data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes();
			var ss = data.getSeconds()>9?data.getSeconds().toString():'0' + data.getSeconds();
			var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"+ ss;
			return time;
		}
	};

	W.newsTravelHandler=function (data){
		if(data.code == 0){
			$('#apply').removeClass('none');
			$("#apply").prev().removeClass('none');
			$('#apply').attr('data-uuid',data.id);
		}
	};

	W.callbackUserjfHandler = function(data) {
		if (data.code == 0) {
			if (data.hn > 0) {
				$('#jifen').addClass('news');
			}
		}
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result){
			H.index.leftCount = data.lc;
			H.index.lotteryRound();
		} else {
			H.index.hideLottery();
		}
	};

	W.callbackArticledetailListHandler = function(data) {
		if(data.code == 0){
			H.index.fillNewTilt(data);
		}
	};

	W.callbackLotteryRoundHandler = function(data) {
		if(data.result){
			H.index.nowTime = H.index.timeTransform(data.sctm);
			H.index.lotteryAct(data);
		} else {
			H.index.hideLottery();
		}
	};

	W.callbackFindyouInfo = function(data){
		if(data.code == 0){
			H.index.tzIsShow(data);
		}
	}
})(Zepto);

$(function() {
	H.index.init();
});