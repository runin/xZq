var tips = [{
	id:1,
	img:"images/bmh01.png"
},{
	id:2,
	img:"images/bmh02.png"
},{
	id:3,
	img:"images/bmh03.png"
},{
	id:4,
	img:"images/bmh04.png"
},{
	id:5,
	img:"images/bmh05.png"
},{
	id:6,
	img:"images/bmh06.png"
},{
	id:7,
	img:"images/bmh07.png"
},{
	id:8,
	img:"images/bmh01.png"
},{
	id:9,
	img:"images/bmh02.png"
},{
	id:10,
	img:"images/bmh03.png"
}];

var etest = [{
	id:1,
	text:"哎呀，差点就中大奖了~"
},{
	id:2,
	text:"换个姿势再试试~"
},{
	id:3,
	text:"加油，不要灰心~"
},{
	id:4,
	text:"sorry，还是没中奖~"
},{
	id:5,
	text:"爆米花洒得一地都是~"
}];

(function($) {
    window.winH = $(window).height();
	window.winW = $(window).width();
	window.judge = true;
	H.index = {
		yaoOj: false,
		yaoJx: false,
		init: function() {
			H.index.roundTime();
			H.index.ruleOpen();
			H.index.mihuaHtml();
			H.index.shake();
		},
		ruleHtml: function() {//活动规则html
			var t = simpleTpl();
			t._('<section class="pop-box">')
			t._('<div class="rule-box">')
			t._('<div class="rule-con">')
			t._('<a href="###" class="rule-close" data-collect="true" data-collect-flag="mc-closerule" data-collect-desc="关闭规则"></a>')
			t._('<div class="rule-text"></div>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
		},
		ruleOpen: function() {
			$(".rule-btn").click(function() {
				judge=false;
				if($("body").find(".rule-box").length == 0) {
					H.index.ruleHtml();
					$(".rule-box").addClass("r-rule");
					getResult('api/common/rule', {}, 'commonApiRuleHandler', true, this.$dialog);
				}else {
					$(".pop-box").removeClass("none");
					$(".rule-box").addClass("r-rule");
				}
			});
			$("body").delegate(".rule-close","click",function(e) {
				judge=true;
				$(".rule-box").removeClass("r-rule").addClass("g-rule");
				setTimeout(function() {
					$(".pop-box").addClass("none");
					$(".rule-box").removeClass("g-rule");
				},550);
			});
		},
		mihuaHtml: function() {//添加爆米花
			var t = simpleTpl();
			var mcH = $(".mc-barrels").height();
			var mcW = $(".mc-barrels").width();
			var mcL = (winW+mcW*0.5)/2;
			var m = 40;//爆米花个数
			var top = 0,
			    left = 0,
				w = 0,
				bmh = 0;
			for(var i=0; i<m; i++) {
				w =  Math.ceil(Math.random()*120);
				top = Math.ceil(Math.random()*35)+winH-mcH-30;
				left = Math.ceil(Math.random()*220);
				if(left<85) left=85;
				if(left>mcL) left=mcL;
				if(w<30) w=30;
				b = Math.floor((Math.random()*tips.length));
				t._('<span style="width:'+w+'px;top:'+top+'px;left:'+left+'px;background-image:url('+tips[b].img+');"></span>');
			}
			$(".mc-box").append(t.toString());
		},
		baokai: function() {//爆米花弹开
			var span = $(".mc-box").find("span");
			var css = [];
			var x = 0,
			    y = 0,
				t = 0,
				l = 0,
				deg = 0;
			var mb = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"];
			$("style").remove();//清空历史样式
			for(var i=0; i<span.length; i++) {
				if((parseInt(Math.random()*10))%2==0) {
					x = -Math.ceil(Math.random()*150);
					deg = -Math.ceil(Math.random()*50)+"deg";
				}else {
					x = Math.ceil(Math.random()*200);
					deg = Math.ceil(Math.random()*50)+"deg";
				}
				y = -Math.ceil(Math.random()*300);
				t = Math.random()*0.8;
				if(i==0) css.push("<style>");
				css.push(".tform_"+mb[i]+"{");
				css.push("-webkit-animation-name: arule_"+mb[i]+";");
				css.push("-webkit-animation-duration: "+t+"s;");
				css.push("-webkit-animation-timing-function: ease;");
				css.push("-webkit-animation-iteration-count: 1;");
				css.push("-webkit-animation-fill-mode: forwards;");
				css.push("-webkit-transform:rotate(0deg);");
				css.push("}\n");
				
				css.push("@-webkit-keyframes arule_"+mb[i]+"{");
				css.push("0%{");
				css.push("-webkit-transform:translateX(0) translateY(0) rotate(0deg);");
				css.push("}");
				css.push("100%{");
				css.push("-webkit-transform:translateX("+x+"px) translateY("+y+"px) rotate("+deg+");");
				css.push("}}\n");
				if(i==(span.length-1)) css.push("</style>");
			}
			$("head").append(css.join(""));
			l = Math.ceil(Math.random()*20);
			$(".pop").addClass("popimg");
			for(var t=0; t<(l>25?l:25); t++) {
				$(".mc-box>span").eq(t).addClass("tform_"+mb[t]);
			}
			$(".mc-barrels").addClass("mcb");
		},
		shake: function() {//摇一摇
			W.addEventListener('shake', H.index.shake_listener, false);
		},
		unshake: function() {
			W.removeEventListener('shake', H.index.shake_listener, false);
		},
		shake_listener: function() {
			if(H.index.yaoOj == false){
				if(!$(".dowm-time").hasClass("none") && !$(".dowm-time").hasClass("d-time")) {
					$(".dowm-time").addClass("d-time");
					setTimeout(function() {
						$(".dowm-time").removeClass("d-time");
					},520);
				}
				if(!$(".dowm-end").hasClass("none") && !$(".dowm-end").hasClass("d-time")) {
					$(".dowm-end").addClass("d-time");
					setTimeout(function() {
						$(".dowm-end").removeClass("d-time");
					},520);
				}
				return;
			}
			if(judge==false){
				return;
			}
			judge=false;
			$("#yao-pv").click();
			//$(".yaojixi").removeClass("youjixi");
			H.index.baokai();
			$("#audio-a").get(0).play();
			setTimeout(function() {
				H.index.yao();
			},1100);
		},
		cardHtml: function() {//摇卡劵
			var t = simpleTpl();
			t._('<section class="pop-box">')
			t._('<div class="card-coupons">')
			
			t._('<div class="card-con none" id="card-error">')
			t._('<div class="lq-error">对不起，爆米花洒得一地都是~</div>')
			t._('</div>')
			
			t._('<div class="card-con none" id="card-info">')
			t._('<div class="prosit">恭喜您获得<span id="gx-card"></span></div>')
			t._('<div class="card-img"></div>')
			t._('<div class="card-number"></div>')
			t._('<div class="card-tips">（请截图并妥善保存兑换码在电影院领取)</div>')
			t._('<a href="###" class="card-lq-btn" id="lq-btn" data-collect="true" data-collect-flag="mc-lq" data-collect-desc="领取"></a>')
			t._('</div>')
			
			t._('<div class="card-con none" id="url-info">')
			t._('<div class="prosit">恭喜您获得<span id="gx-card"></span></div>')
			t._('<div class="card-img"></div>')
			t._('<a href="###" class="card-lq-btn" id="url-btn" data-collect="true" data-collect-flag="url-lq" data-collect-desc="外链奖品领取"></a>')
			t._('</div>')
			
			t._('<div class="card-con none" id="card-success">')
			t._('<div class="lq-success">领取成功！</div>')
			t._('</div>')
			
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
		},    
		yao: function() {
			getResult('api/lottery/exec/luck', {matk:matk}, 'callbackLotteryLuckHandler',true, this.$dialog);
		},
		collect: function() {//领取奖品
			getResult('api/lottery/award', {oi:openid}, 'callbackLotteryAwardHandler',true, this.$dialog);
		},
		gxsuccess: function() {
			$("#lq-btn").click(function() {
				H.index.collect();
				setTimeout(function() {
					H.index.closeFn();
				},500);
				setTimeout(function() {
					judge = true;
					$(".pop-box").remove();
				},800);
			});
		},
		urlBtn: function() {//外链领取
			$("#url-btn").click(function() {
				H.index.collect();
			})
		},
		closeFn: function() {//关闭弹层相关事件
			$(".card-coupons").removeClass("c-come").addClass("c-beat");
			$(".mc-barrels").removeClass("mcb");
			$(".pop").removeClass("popimg");
			$(".mc-box").empty();
			H.index.mihuaHtml();
		},
		roundTime: function() {
			var that = this;
			$.ajax({
				type: 'GET',
				async: true,
				url: domain_url + "api/lottery/round",
				dataType: "jsonp",
				jsonpCallback: 'callbackLotteryRoundHandler',
				success: function (data) {
					var la = data.la;
					if(la && data.result==true) {
						var arr=[];
						for(var i=0; i<la.length; i++) {
							var sctm = data.sctm;//系统时间
							var pdst = parseInt(timestamp(la[i].pd+" "+la[i].st));//开始时间
							var pdet = parseInt(timestamp(la[i].pd+" "+la[i].et));//结束时间 
							var item = {};
							item.st =pdst;
							item.et =pdet;
							arr.push(item);
						}
						$("#downTime").countDown({ 
							timeArr: arr,
							countDownFn: function (t, tmp) {//每次倒数回调;
							    H.index.yaoOj = false;
								$(".dowm-time").removeClass("none");
							}, atTimeFn: function (t, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断
							    $(".dowm-time").addClass("none");
								H.index.yaoOj = true;
							}, endFn: function(t) {//整个倒计时结束的回调
							    $(".dowm-time").addClass("none");
								$(".dowm-end").removeClass("none");
								H.index.yaoOj = false;
							}
						});
					}else {
						$(".dowm-end").removeClass("none").text("敬请期待！");
					}
				}
			});
		}
	};

	W.commonApiRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-text").html(data.rule);
		}
	};
	W.callbackLotteryLuckHandler = function(data) {//摇奖品
		if(data.result == true){
			$("#audio-b").get(0).play();
			H.index.cardHtml();
			$(".card-coupons").addClass("c-come");
			$(".card-img").css("background-image","url('"+data.pi+"')");
			if(data.pt == 11) {
				$("#card-info").removeClass("none");
				$("#gx-card").html(data.pn+"一"+data.pu);
			    $(".card-number").html("兑换码："+data.cc);
			}else if(data.pt == 9){
				$("#url-info").removeClass("none");
				$("#url-btn").attr("data-url",data.ru);
				H.index.urlBtn();
			}
			H.index.gxsuccess();
		}else {
			H.index.cardHtml();
			$(".card-coupons").addClass("c-come");
			var i = Math.floor((Math.random()*etest.length));
			$(".lq-error").html(etest[i].text);
			$("#card-error").removeClass("none");
			setTimeout(function() {
				H.index.closeFn();
			},1000);
			setTimeout(function() {
				judge = true;
				$(".pop-box").remove();
			},1600);
			
		}
	};
	W.callbackLotteryAwardHandler = function(data) {//领取奖品
		if(data.result == true){
			$("#card-info,#url-info").addClass("none");
			var url = $("#url-btn").attr("data-url");
			window.location.href = url;
			//$("#card-success").removeClass("none");
		}
	};

	H.index.init();

})(Zepto);