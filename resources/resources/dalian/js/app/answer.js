// JavaScript Document
/*^^^^^^^答题抽奖^^^^^^*/
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
				appId: "wx8172be554b269be7"
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
					appId: "wx8172be554b269be7",   
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

var tips = [{
	id:1,
	text:"又一个大奖给人领走了~"
},{
	id:2,
	text:"哎，差一点就中大奖了"
},{
	id:3,
	text:"您与一个大奖擦肩而过~",
	aitems:[{
		
	}]
},{
	id:4,
	text:"要不您换个姿势试试~"
},{
	id:5,
	text:"不要灰心,肯定会中大奖~"
},{
	id:6,
	text:"加油！出点力摇~"
}];

(function($) {
	var classId = {
		$popBg: $(".pop-bg"),
		$dtText: $("#d-t-text"),
		$mainDt: $("#main-dt"),
		$mainYao: $(".main-yao"),
		$downTime: $(".down-time"),
		$question: $("#question"),
		$answer: $("#answer"),
		$wydjBtn: $(".wydj-btn"),
		$mainLoading: $("#main-loading"),
		$yaoTips: $(".yao-tips")
	}; 
	
	H.answer = {
		$yao:false,
		$bi:[],
		$tid:"",
		$questionArray:[],
		$href:"",
		$wxcard:0,
		$type:false,
		init: function() {
			this.lotteryRound();
			this.shake();
			this.cookFn();
		},
		heigthFn: function() {
			var wh = $(window).height();
			$("body,.pop-bg:before").css("height",wh);
			$(".spoil-box").css("height",wh*0.8);
		},
		cookFn: function() {
			if(getQueryString("rp") != "") {
				H.answer.successTips();
			}
		},
		shake: function() {
			W.addEventListener('shake', H.answer.shake_listener, false);
		},
		unshake: function() {
			W.removeEventListener('shake', H.answer.shake_listener, false);
		},
		shake_listener: function() {
			if(H.answer.$yao == false || classId.$mainYao.hasClass("none")) {
				return;
			}
			$("#audio-a").get(0).play();
			classId.$yaoTips.text("").removeClass("lr-yao");
			classId.$mainYao.addClass("mainyao");
			setTimeout(function() {
				H.answer.lotteryLuck();
				classId.$mainYao.removeClass("mainyao");
			},500);
			
		},
		lotteryHtml: function() {//抽奖弹层
			var t = simpleTpl();
			t._('<div class="spoil-box bounce-in-sides" id="pop-b">')
			t._('<a href="javascript:void(0)" class="pop-close" data-collect="true" data-collect-flag="btn-cj-close" data-collect-desc="关闭抽奖弹层"></a>')
			
			t._('<div class="spoil-con none" id="thanks">')
			t._('<p class="spoil-img"></p>')
			t._('<p class="spoil-pn" id="thanks-text">加油！下次会中奖的</p>')
			t._('<a href="###" class="spoil-btn-a none" id="thanks-return">返 回</a>')
			t._('</div>')
			
			t._('<div class="spoil-con none" id="spoil-a">')
			t._('<h2 class="spoil-head">恭喜您中奖啦！</h2>')
			t._('<p class="spoil-img"></p>')
			t._('<p class="spoil-pn" id="pn-text"></p>')
			
			t._('<div class="none" id="form-input">')
			t._('<p class="spoil-warn">请填写您的准确信息以便顺利领奖</p>')
			t._('<input name="" type="text" class="ipt-text-a" id="rn" placeholder="姓名" />')
			t._('<input name="" type="text" class="ipt-text-a" id="ph" placeholder="电话" />')
			t._('<input name="" type="text" class="ipt-text-a" id="ad" placeholder="地址" />')
			t._('</div>')
			t._('<a href="" class="spoil-btn-b none" id="hongbao" data-collect="true" data-collect-flag="btn-hongbao" data-collect-desc="领取红包">领 取</a>')
			t._('<a href="javascript:void(0)" class="spoil-btn-b none" id="wxincard" data-collect="true" data-collect-flag="btn-wxincard" data-collect-desc="领取卡劵">领 取</a>')
			t._('<a href="javascript:void(0)" class="spoil-btn-a none" id="shiwu" data-collect="true" data-collect-flag="btn-shiwu" data-collect-desc="领取实物奖品">领 取</a>')
			t._('<a href="javascript:void(0)" class="spoil-btn-b none" id="wailian" data-collect="true" data-collect-flag="btn-wailian" data-collect-desc="领取外链奖品">领 取</a>')
			t._('</div>')
			
			t._('</div>')
			classId.$popBg.append(t.toString()).removeClass("none");
			this.hidePop(".pop-close,#thanks-return,#make-return","#pop-b",".pop-bg");
			this.heigthFn();
		},
		notPrizeA: function() {
			var t = simpleTpl();
			t._('<div class="answer-box bounce-in-sides" id="pop-c">')
			t._('<a href="###" class="pop-close"></a>')
			t._('<div class="error-con">')
			t._('<div class="answer-e-icon"></div>')
			t._('<div class="answer-error">哎呀~啥都没抽到!</div>')
			t._('<a href="###" class="spoil-btn-a" id="notprize-return" data-collect="true" data-collect-flag="btn-not-return" data-collect-desc="没抽到返回">返回</a>')
			t._('</div>')
			t._('</div>')
			classId.$popBg.append(t.toString()).removeClass("none");
			this.hidePop(".pop-close,#notprize-return","#pop-c",".pop-bg");
		},
		successTips: function() {
			$("body").append('<span class="success-tips">领取成功！</span>');
			setTimeout(function() {
				$(".success-tips").remove();
			},1500);
		},
		lotteryRound: function() {//抽奖时间段
		    getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');
		},
		lotteryLuck: function() {//抽奖接口
		    getResult('api/lottery/exec/luck', {matk:matk}, 'callbackLotteryLuckHandler');
		},
		lotteryAward: function(rn,ph,ad) {//领奖接口
			if(!rn) rn = "";
			if(!ph) ph = "";
			if(!ad) ad = "";
			getResult('api/lottery/award', {oi:openid, rn:rn, ph:ph, ad:ad}, 'callbackLotteryAwardHandler');
		},
		yaoLotteryNot: function() {//不中奖
			var i = Math.floor((Math.random()*tips.length));
			classId.$yaoTips.text(tips[i].text).addClass("lr-yao");
			setTimeout(function() {
				H.answer.$yao = true;
			},1000);
		},
		questionRound: function() {//题目接口
		    getResult('api/question/round', {}, 'callbackQuestionRoundHandler',true);
		},
		questionAllrecord: function() {//是否已经答过题
			getResult('api/question/allrecord', {yoi:openid, tid:H.answer.$tid}, 'callbackQuestionAllRecordHandler');
		},
		questionList: function(i) {//题目列表
		    var t = simpleTpl();
			var array = this.$questionArray;
			if(array.length==i) {//所有的题都答完了
			    classId.$mainLoading.removeClass("none").html("题目已经答完啦！");
				classId.$mainDt.addClass("none");
				return;
			};
			var quid = array[i].quid;
			var qt = array[i].qt;
			var aitems = array[i].aitems;
			classId.$mainDt.removeClass("none");
			for(var i=0,leg=aitems.length; i<leg; i++) {
				t._('<label data-auid="'+aitems[i].auid+'"><i class="i-radio"><input name="answer" type="radio" /></i> '+aitems[i].at+'</label>')
			}
			classId.$question.html(qt);
			classId.$question.attr("data-quid", quid);
			classId.$answer.empty().append(t.toString());
			this.questionAnswer();
		},
		questionAnswer: function() {//提交答案接口
		    var quid,auid;
		    classId.$answer.find("label").click(function () {
				$(".i-radio").removeClass("check");
				$(this).find(".i-radio").addClass("check").find("input[type='radio']").attr("checked", "checked");
				quid = classId.$question.attr("data-quid");
				auid = $(this).attr("data-auid");
				classId.$answer.find("input[type='radio']").unbind("click"); //解除绑定
			});
		    classId.$wydjBtn.unbind("click").click(function() {
				var radio = classId.$answer.find("input[type='radio']");
			    var checked=0;
				$("input[type='radio']").each(function() {
					if($(this).attr("checked")) {
						checked=1;
					}
				});
				if(!checked) {
					alert("请选择您的答题！");
					return;
				}
				getResult('api/question/answer', {yoi:openid, suid:quid, auid:auid}, 'callbackQuestionAnswerHandler');
		    });
		    
		},
		
		downTimeFn: function(data) {//倒计时
		    function nostart(time) {
				classId.$downTime.html("距离互动开始还有"+time);
				classId.$mainLoading.removeClass("none").html("互动就要开始了,做好准备!");
			};
			function answer(time) {
				classId.$downTime.html("距离答题结束还有"+time);
			};
			function lottery(time) {
				classId.$downTime.html("距离摇奖结束还有"+time);
			};
			function nextTime(time) {
				classId.$downTime.html("距离下一轮抽奖还有"+time);
				H.answer.$yao=false;
				classId.$yaoTips.text("");
				classId.$mainDt.addClass("none");
			    classId.$mainYao.removeClass("none");
			};
			function timeEnd() {
				H.answer.$yao=false;
				classId.$downTime.html("敬请期待，下期更精彩");
				classId.$mainDt.addClass("none");
			    classId.$mainYao.removeClass("none");
				classId.$mainLoading.addClass("none");
				classId.$yaoTips.text("");
				
			};
			var la = data.la;
			var f = false;
			var timeArr=[];
			for(var i=0, leg=la.length; i<leg; i++) {
				var sctm = data.sctm;//系统时间
				var pdst = parseInt(timestamp(la[i].pd+" "+la[i].st));//开始时间
				var pdet = parseInt(timestamp(la[i].pd+" "+la[i].et));//结束时间
				if(la[i].bi) {
					H.answer.$bi.push(i);
				}else {
					H.answer.$bi.push(100);
				}
				var item = {};
				item.st =pdst;
				item.et =pdet;
				item.index = i;
				timeArr.push(item);
			}
			$("<div></div>").countDown({
				timeArr: timeArr,
				countDownFn: function (t, time, index) {//每次倒数回调
					if(index == 0) { //没有开始的情况
						nostart(time);
						return;
					}
					nextTime(time);
				}, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
					if (nextstartTime) {
						if(f) {//答题的时间
						    answer(obj.showTime(nextstartTime - nowTime));
						}else {
							lottery(obj.showTime(nextstartTime - nowTime));
						}
					}else {
						if(f) {//答题的时间
						    answer(obj.showTime(endTime - nowTime));
						}else {
							lottery(obj.showTime(endTime - nowTime));
						}
					}
					
				}, inQuantumFn: function (t, index) {//在时间断内的回调函数 index 是倒到哪个时间断
				   var bi = H.answer.$bi;
				   if(bi[index]==index) {
					   f = true;
					   H.answer.$type=false;
					   H.answer.questionRound();
					   classId.$mainLoading.addClass("none");
					   classId.$mainDt.removeClass("none");
					   classId.$mainYao.addClass("none");
				   }else {
					   f = false;
					   H.answer.$yao=true;
					   H.answer.$type=true;
					   classId.$mainDt.addClass("none");
					   classId.$mainYao.removeClass("none");
					   classId.$mainLoading.addClass("none");
				   }
				}, endFn: function (dt, index, obj, noTime) {//整个倒计时结束的回调
					timeEnd();
				}
			});
		},
		wailianBtn: function() {//领取外链奖品
			$("#wailian").click(function() {
				H.answer.lotteryAward();
			});
		},
		shiwuBtn: function() {//领取实物奖品
			$("#shiwu").click(function(e) {
				e.preventDefault();
				var $rn = $("#rn");
				var rn = $.trim($("#rn").val());
				var $ph = $("#ph");
				var ph = $.trim($("#ph").val());
				var $ad = $("#ad");
				var ad = $.trim($("#ad").val());
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
				if (ad.length < 5 || ad.length > 60) {//地址
					alert("地址长度应在5到60个字！");
					$ad.focus();
					return false;
				}
				H.answer.lotteryAward();
				
			});
		},
		wcardBtn: function() {//领取代金劵
			// 在这里调用 API
			document.querySelector('#wxincard').onclick = function() {
				H.answer.lotteryAward();
			};
		},
		wxcardFn: function() {//微信卡劵跳转
			var ci = $(".spoil-img").attr("data-ci");
			var ts = $(".spoil-img").attr("data-ts");
			var si = $(".spoil-img").attr("data-si");
			wx.addCard({
				cardList: [{
					cardId: ci,
					cardExt: "{\"timestamp\":\""+ ts +"\",\"signature\":\""+ si +"\"}"
				}], // 需要添加的卡券列表
				success: function(res) {
					$("#pop-b").remove();
					classId.$popBg.addClass("none");
					H.answer.successTips();
					//$("#spoil-b").removeClass("none");
					//var cardList = res.cardList; // 添加的卡券列表信息
				},
				fail: function(res){
					//alert(res.errMsg);
					$("#pop-b").remove();
					classId.$popBg.addClass("none");
					H.answer.$yao = true;
				},
				complete: function(){
					//hidenewLoading();
				}
			});
		},
		questionLottery: function() {//问题抽奖
		    var that = this;
			$("#click-luck").click(function() {
				that.lotteryLuck();
			});
		},
		closePop: function(a, b) {//关闭弹层
			$(a).click(function(e) {
				e.preventDefault();
				$(b).removeClass("bounce-in-sides").addClass("bounce-out-down");
				setTimeout(function() {
					$(b).remove();
					if(a=="#click-luck") {
						H.answer.lotteryLuck();
					}
				},800);
				H.answer.$yao = true;
			});
		},
		hidePop: function(a,b,c) {//关闭弹层
			$(a).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(b).addClass("bounce-out-down");
				setTimeout(function() {
					$(c).empty().addClass("none");
				},800);
				H.answer.$yao = true;
			});
		}
	};
	
	W.callbackLotteryRoundHandler = function(data) {
		if(data && data.result==true) {
			H.answer.downTimeFn(data)
		}else {
			classId.$mainYao.removeClass("none");
			classId.$downTime.html("敬请期待，下期更精彩");
		}
	};
	
	W.callbackQuestionRoundHandler = function(data) {
		if(data && data.code==0) {
			var qtems = data.qitems;
			H.answer.$tid = data.tid;
			for(var i=0,leg=qtems.length; i<leg; i++) {
				var aitems = qtems[i].aitems;
				var j={};
				j.quid = qtems[i].quid;
				j.qt = qtems[i].qt;
				j.aitems=[];
				for(var k=0; k<aitems.length; k++) {
					var t={};
					t.auid = aitems[k].auid;
					t.at = aitems[k].at;
					j.aitems.push(t);
				}
				H.answer.$questionArray.push(j);
			}
			H.answer.questionAllrecord();
		}
	};
	
	W.callbackLotteryLuckHandler = function(data) {
		if(data && data.result) {
			H.answer.$href="";
			H.answer.$yao = false;
			$("#audio-b").get(0).play();
			H.answer.lotteryHtml();
			$(".spoil-img").css("backgroundImage","url('"+data.pi+"')");
			$("#pn-text").text("获得"+data.pn+"一"+data.pu+"");
			switch(data.pt) {
				case 0://谢谢参与
				    $("#thanks").removeClass("none");
				    $("#thanks-text").text(data.tt);
				    break;
				case 4://红包
				    $("#spoil-a").addClass("notform").removeClass("none");
					$("#hongbao").attr("href",data.rp).removeClass("none");
					break;
				case 7://微信卡劵
				    $("#spoil-a").addClass("notform").removeClass("none");
					$("#wxincard").removeClass("none");
					$(".spoil-img").attr({"data-ci":data.ci,"data-ts":data.ts,"data-si":data.si});
					H.answer.$wxcard=1;
					H.answer.wcardBtn();
					break;
				case 9://外链奖品
				    $("#spoil-a").addClass("notform").removeClass("none");
					$("#wailian").removeClass("none");
					H.answer.$href = data.ru;
					H.answer.wailianBtn();
					break;
				default:
				    if(data.ru) {
						H.answer.$href = data.ru;
					}
				    $("#spoil-a,#form-input,#shiwu").removeClass("none");
					if(data.ph){
						$("#ph").val(data.ph);
					}
					if(data.rn){
						$("#rn").val(data.rn);
					}
					if(data.ad){
						$("#ad").val(data.ad);
					}
					H.answer.shiwuBtn();
			}
		}else {
			$("#audio-c").get(0).play();
			if(H.answer.$type) {
				H.answer.$yao = false;
				H.answer.yaoLotteryNot();
			}else {
				H.answer.notPrizeA();
			}
			
		}
	};
	
	W.callbackLotteryAwardHandler = function(data) {
		if(data && data.result == true) {
			if(H.answer.$href !="") {//如果是有地址跳转
				window.location.href = H.answer.$href;
				return;
			}
			if(H.answer.$wxcard) {//如果卡劵
				H.answer.wxcardFn();
				return;
			}
			$("#pop-b").addClass("bounce-out-down");
			setTimeout(function() {
				classId.$popBg.empty().addClass("none");
				H.answer.successTips();
				H.answer.$yao = true;
			},800);
		}
	};
	
	W.callbackQuestionAllRecordHandler = function(data) {
		if(data && data.code==0) {
			var items = data.items;
			H.answer.questionList(items.length);
		}else {
			classId.$mainLoading.removeClass("none");
		}
	};
	
	W.callbackQuestionAnswerHandler = function(data) {
		var t = simpleTpl();
		if(data && data.code == 0) {
			H.answer.questionAllrecord();
			t._('<div class="answer-box bounce-in-sides" id="pop-a">')
			t._('<a href="###" class="pop-close"></a>')
			if(data.rs == 2) {
				t._('<div class="answer-con">')
				t._('<div class="answer-success">恭喜您！答对啦</div>')
				t._('<div class="answer-s-start"></div>')
				t._('<a href="###" class="spoil-btn-a" id="click-luck" data-collect="true" data-collect-flag="btn-dt-cj" data-collect-desc="答对啦,点击抽奖">点击抽奖</a>')
				t._('</div>')
			}else {
				t._('<div class="error-con">')
				t._('<div class="answer-e-icon"></div>')
				t._('<div class="answer-error">答错啦~继续加油吧!</div>')
				t._('<a href="###" class="spoil-btn-a" id="spoil-return" data-collect="true" data-collect-flag="btn-dt-return" data-collect-desc="答错啦,返回">返回</a>')
				t._('</div>')
			}
			t._('</div>')
			classId.$popBg.append(t.toString()).removeClass("none");
			H.answer.hidePop(".pop-close,#spoil-return","#pop-a",".pop-bg");
			H.answer.closePop("#click-luck","#pop-a");
		}else {
			alert("网络出错，提交失败！")
		} 
	};
	
	H.answer.init();
	
})(Zepto);