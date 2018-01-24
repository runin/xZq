/*--------------wx.config---------------*/
H.openjs = {
	localId: "",
	serverId: "",
	init: function() {
		window.callbackJsapiTicketHandler = function(data) {};
		$.ajax({
			type: 'GET',
			url: domain_url + 'mp/jsapiticket',
			data: {
				appId: shaketv_appid
			},
			async: true,
			dataType: 'jsonp',
			jsonpCallback: 'callbackJsapiTicketHandler',
			success: function(data){
				if (data.code !== 0) {
					return;
				}
				var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
					timestamp = Math.round(new Date().getTime()/1000),
					url = window.location.href.split('#')[0],
					signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
				
				wx.config({
					debug: false,
					appId: shaketv_appid,   
					timestamp: timestamp,
					nonceStr: nonceStr,
					signature: signature,
					jsApiList: [
						'addCard'
					]
				});
			},
			error: function(xhr, type){
				 alert('获取微信授权失败！');
			}
		});
	}     
};
H.openjs.init();


(function ($) {
	var classId = {
		$mainBox: $(".main-box"),
		$downTime: $("#dowmtime"),
		$jpNumber: $(".jp-number"),
		$remain: $("#remain")
	};
	
    H.main = {
		$yao:false,
        init: function () {
			this.lotteryRound();
			this.shake();
        },
		shake: function() {
			W.addEventListener('shake', H.main.shake_listener, false);
		},
		unshake: function() {
			W.removeEventListener('shake', H.main.shake_listener, false);
		},
		shake_listener: function() {
			if(H.main.$yao == false) {
				return;
			}
			H.main.$yao = false;
			$("#audio-a").get(0).play();
			classId.$mainBox.addClass("yaoing");
			setTimeout(function() {
				classId.$mainBox.removeClass("yaoing");
				H.main.lotteryFn();
			},720);
		},
		heightFn: function() {
			var h = $(window).height();
			$("body,.pop-bg:before").css("height",h);
			$(".pop-box").css("height",h*0.8);
		},
		lotteryHtml: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="pop-box bounce-in-sides">')
			t._('<a href="javascript:void(0)" class="pop-close" data-collect="true" data-collect-flag="yaozhoubian-close" data-collect-desc="关闭层"></a>')
			//中奖
			t._('<div class="yao-box none" id="yao-a">')
			t._('<h2 class="prize-top"></h2>')
			t._('<p class="prize-img"></p>')
			t._('<p class="prize-tips">正确填写信息以便顺利领奖</p>')
			t._('<input name="ipt-rn" type="text" class="ipt-texta" id="rn" placeholder="姓名" />')
			t._('<input name="ipt-ph" type="text" class="ipt-texta" id="ph" placeholder="电话" />')
			t._('<a href="javascript:void(0)" class="btn-a" id="weixincard-btn" data-collect="true" data-collect-flag="yaozhoubian-lq" data-collect-desc="领取">领 取</a>')
			t._('</div>')
			//领取成功
			//t._('<div class="yao-box none" id="yao-b">')
			//t._('<p class="success-text">领取成功！</p>')
			//t._('<a href="javascript:void(0)" class="btn-a" id="success-btn">确 定</a>')
			//t._('</div>')
			//不中奖
			t._('<div class="yao-box none" id="yao-c">')
			t._('<h2 class="not-top"></h2>')
			t._('<p class="not-img"><img src="images/ewm.jpg" /></p>')
			t._('<a href="javascript:void(0)" class="btn-a" id="not-btn" data-collect="true" data-collect-flag="yaozhoubian-qd" data-collect-desc="确定">确 定</a>')
			t._('</div>')
			
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
			this.closePop(".pop-close,#success-btn,#not-btn",".pop-box",".pop-bg");
		},
		lotteryRound: function() {//抽奖时间段
		    getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');
		},
		lotteryFn: function() {//抽奖接口
		    this.lotteryHtml()
			getResult('api/lottery/exec/luck', {matk:matk}, 'callbackLotteryLuckHandler');
		},
		lotteryAward: function(rn,ph) {//领奖接口
			getResult('api/lottery/award', {oi:openid, rn:rn, ph:ph}, 'callbackLotteryAwardHandler');
		},
		leftLimitPrizeFn: function() {//奖品剩余数
			getResult('api/lottery/leftLimitPrize', {}, 'callbackLeftLimitPrizeHandler');
			window.setitv = setInterval(function(){
				getResult('api/lottery/leftLimitPrize', {}, 'callbackLeftLimitPrizeHandler');
			},5000);
		},
		formFn: function() {
			var $rn = $("#rn");
			var rn = $.trim($("#rn").val());
			var $ph = $("#ph");
			var ph = $.trim($("#ph").val());
			if (!rn) {//姓名
				alert("请填写姓名！");
				$rn.focus();
				return false;
			}
			if (!ph) {//手机号码
				alert("请填写手机号码！");
				$ph.focus();
				return false;
			}
			if (!/^\d{11}$/.test(ph)) {//手机号码格式
				alert("这手机号，可打不通...！");
				$ph.focus();
				return false;
			}
			this.lotteryAward(rn,ph);
		},
		wxcardBtn: function() {//微信卡劵
			// 在这里调用 API
			document.querySelector('#weixincard-btn').onclick = function(e) {
				e.preventDefault();
				H.main.formFn();
				
			};
		},
		closePop: function(a,b,c) {//关闭弹层
			$(a).click(function(e) {
				e.preventDefault();
				$(b).addClass("bounce-out-down");
				setTimeout(function() {
					$(c).remove();
					H.main.$yao = true;
				},800);
			});
		},
		downTimeFn: function(data) {
			function nostart(time) {
				classId.$downTime.html("距离摇奖开始还有"+time);
			};
			function lottery(time) {
				classId.$downTime.html("距离摇奖结束还有"+time);
			};
			function timeEnd() {
				H.main.$yao=false;
				classId.$jpNumber.addClass("none");
				classId.$downTime.html("敬请期待，下期更精彩");
			};
			var la = data.la;
			var timeArr=[];
			for(var i=0, leg=la.length; i<leg; i++) {
				var sctm = data.sctm;//系统时间
				var pdst = parseInt(timestamp(la[i].pd+" "+la[i].st));//开始时间
				var pdet = parseInt(timestamp(la[i].pd+" "+la[i].et));//结束时间
				var item = {};
				item.st =pdst;
				item.et =pdet;
				item.index = i;
				timeArr.push(item);
			}
			$("<span></span>").countDown({
				timeArr: timeArr,
				countDownFn: function (t, time, index) {//每次倒数回调
					if (index == 0) { //没有开始的情况
						nostart(time);
						return;
					}
					nostart(time);
					clearInterval(window.setitv);
				}, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
					if (nextstartTime) {
						lottery(obj.showTime(nextstartTime - nowTime));
					}else {
						lottery(obj.showTime(endTime - nowTime));
					}
					
				}, inQuantumFn: function (t, index) {//在时间断内的回调函数 index 是倒到哪个时间断
				   H.main.$yao = true;
				   H.main.leftLimitPrizeFn();
				   classId.$jpNumber.removeClass("none");   
				}, endFn: function (dt, index, obj, noTime) {//整个倒计时结束的回调
					timeEnd();
				}
			});
		}
    };
	
	W.callbackLotteryRoundHandler = function(data) {
		if(data && data.result==true) {
			H.main.downTimeFn(data)
		}
	};
	
	W.callbackLeftLimitPrizeHandler = function(data) {
		if(data && data.result==true) {
			classId.$remain.text(data.lc);
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if(data && data.result == true) {
			var ci = $(".prize-img").attr("data-ci");
			var ts = $(".prize-img").attr("data-ts");
			var si = $(".prize-img").attr("data-si");
			wx.addCard({
				cardList: [{
					cardId: ci,
					cardExt: "{\"timestamp\":\""+ ts +"\",\"signature\":\""+ si +"\"}"
				}], // 需要添加的卡券列表
				success: function(res) {
					$(".pop-bg").remove();
					H.main.$yao = true;
					//var cardList = res.cardList; // 添加的卡券列表信息
				},
				fail: function(res){
					//alert(res.errMsg);
					$(".pop-bg").remove();
					H.main.$yao = true;
				},
				complete: function(){
					//hidenewLoading();
				}
			});
		}
	};
	
    W.callbackLotteryLuckHandler = function(data) {
		if(data && data.result==true) {
			switch(data.pt) {
				case 0://谢谢参与
				case 2://积分
				    $("#yao-c").removeClass("none");
				    break;
				case 7://微信卡劵
				    $("#audio-b").get(0).play();
					H.main.heightFn();
				    $("#yao-a").removeClass("none");
					$(".prize-img").css("backgroundImage","url('"+data.pi+"')").attr({"data-ci":data.ci,"data-ts":data.ts,"data-si":data.si});
					if(data.ph){
						$("#ph").val(data.ph);
					}
					if(data.rn){
						$("#rn").val(data.rn);
					}
					//H.main.leftLimitPrizeFn();
					H.main.wxcardBtn();
				    break;
			}
		}else {
			$("#yao-c").removeClass("none");
		}
    };

    H.main.init();

})(Zepto);