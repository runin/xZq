// JavaScript Document
$(function() {
	var cmp = true;
	window.scconut = 0;//总支持数
	var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            });
        },
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: false }, param);
            if (p.showload) {
                W.showLoading();
            }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };
	//高度
	var conH = function() {
		var winh = $(window).height();
		$("#content-height").css("height",winh);
		//$(".encounter").css("height",winh-52);
	}
	
	N.module("mvote", function(){
		var other = {
			//赞助商品牌图片
			sponsor: function() {
				N.loadData({url: domain_url+'gansu/stock/brand',callbackGansuStockBrand:function(data){
					if(data.code == 0){
						$(".mingren").append("<img src='"+data.brand+"' />");
					}
				}});
				
				if(headimgurl) {
					$("#myuser img").attr("src",headimgurl+"/"+yao_avatar_size);
				}else {
					$("#myuser img").attr("src","images/touxiang.png");
				}
			},
			//我的战绩
			onRule: function() {
				$("#my-record").click(function(e) {
					e.preventDefault();
					 N.loadData({url: domain_url+'gansu/stock/transcript',callbackGansuStockTranscript:function(data){
	
						 if(data.code == 0) {
							 H.dialog.record.open("累计参与<span class='red'>"+data.jc+"</span>次<br /><span class='font14'>共获积分<span class='red'>"+data.iv+"</span>分，全国排第<span class='red'>"+data.rank+"</span>名</span>");
						 }else {
							 H.dialog.record.open("您暂无战绩哦！别灰心，加油"); 
						 }
					},data: {
						yoi:openid
					  }
					});
				});
			},
			init: function() {
				var that = this;
				that.sponsor();
				that.onRule();
			}
		};
		//定时器
		var timeOut = function(outt) {
			//var setout;
			//clearTimeout(setout);
			if(outt == 0) {
				return;
			}
			var ot = outt+2000;
			setTimeout(function() {
				questionTime();
			},ot)
		};
			//倒计时
		var countDown = function(nowt,djText) {
			//var setime;
			var t = nowt;
			//clearInterval(setime);
			$("#vote-cd").text(djText);
			if(t == 0) {
				$("#vote-time").addClass("none");
				return;
			}
			setInterval(function(){
				var day=0,
					hour=0,
					minute=0,
					second=0;//时间默认值
				if(t > 0){
					day = Math.floor(t / (60 * 60 * 24));
					hour = Math.floor(t / (60 * 60)) - (day * 24);
					minute = Math.floor(t / 60) - (day * 24 * 60) - (hour * 60);
					second = Math.floor(t) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
				}
				if (minute <= 9) minute = '0' + minute;
				if (second <= 9) second = '0' + second;
				$("#vote-time").text(hour+":"+minute+":"+second);
				t--;
			},1000);
		};
		
		//接口判断
		var questionTime = function() {
			N.loadData({url: domain_url+'api/question/info',callbackQuestionInfoHandler:function(data){
				if(data.code == 0){
					var pst = timestamp(data.pst);//该期播放开始时间
					var pet = timestamp(data.pet);//该期播放结束时间
					var pc = data.cut;
					var qitems = data.qitems;
					var supset;
					clearInterval(supset);
					if(qitems && pc>pst && pc<pet) {
						for(var i=0; i<qitems.length; i++) {
							var qst = timestamp(qitems[i].qst);//题目开始时间
							var qet = timestamp(qitems[i].qet);//题目结束时间
							var aitems = qitems[i].aitems;
							if(pc>qst && pc<qet) {
								$("#s-title").removeClass("none").text(qitems[i].qt).attr("data-uuid",qitems[i].quid);//题目
								//假如这题目已经投过票了
								if(qitems[i].anws != null) {
									support();
									supset = setInterval(support,5000);
									if(i<(qitems.length-1)){
										var nexttime=timestamp(qitems[i+1].qst);
										countDown(parseInt((nexttime-pc)/1000),'离下次抽奖还剩');
										timeOut(parseInt(nexttime-pc));
										
									}else {
										countDown(0,'今日抽奖已结束，明天再来吧');
										timeOut(parseInt(qet-pc));
									}
									$(".countdown").removeClass("none cd");//定时
									return;
								}
								option(aitems);
								return;	
							}
							if(pc<qst) {
								countDown(parseInt((qst-pc)/1000),'投票抽奖倒计时');
								timeOut(parseInt(qst-pc));
								$("#s-title").addClass("none");
								$("#inquire-into").addClass("none");
								$("#vote-result").addClass("none");
								$(".countdown").removeClass("none").addClass("cd");//定时
								return;
							}
							if(pc>=timestamp(qitems[qitems.length-1].qet)) {
								countDown(0,'今日抽奖已结束，明天再来吧');
								$("#s-title").addClass("none");
								$("#inquire-into").addClass("none");
								$("#vote-result").addClass("none");
								$(".countdown").removeClass("none").addClass("cd");//定时
								return;
							}
						}
					}else {
						$("#s-title").addClass("none");
						$("#inquire-into").addClass("none");
						$("#vote-result").addClass("none");
						$(".countdown").removeClass("none").addClass("cd");
						countDown(0,"节目已结束，明天再来吧");
					}
				}
			}, data:{
				yoi:openid
			}})
		};
		var option = function(aitems){
			var that = this;
			var vote = [];
			var result = [];
			for(var i=0; i<aitems.length; i++) {
				vote.push('<span data-auid="'+aitems[i].auid+'" class="radio-span">'+aitems[i].at+'</span>');
				result.push("<h5>"+aitems[i].at+"</h5><p><span class='r-ratio'><em id='sc"+i+"'></em></span> <span class='r-number' id='pc"+i+"'></span> </p>");
				scconut += aitems[i].sc;
			}
			$("#vote").empty().append(vote.join(''));
			$(".result").empty().append(result.join(''));
			$("#inquire-into").removeClass("none");//选项列表
			$("#vote-result").addClass("none");//投票结果
			$("#vote-btn").removeClass("none");
			$(".countdown").addClass("none").removeClass("cd");//定时
			answer();
		};
		var answer = function() {
			var auid;
			$("#vote").delegate('.radio-span',"click",function(e) {
				e.preventDefault();
				$(this).addClass("on").siblings().removeClass("on");
				var index = $(this).index();
				auid = $(this).attr("data-auid");
			});
			$("#vote-btn").click(function(e) {
				e.preventDefault();
				var suid = $("#s-title").attr("data-uuid");//题目uuid
				if(!$("#vote .radio-span").hasClass("on")) {
					alert("请选择您要投票的选项！");
					return;
				}
				N.loadData({url: domain_url+'api/question/answer',callbackQuestionAnswerHandler:function(data){
					if(data.code == 0) {
						//var suid = data.suid;
						$("#inquire-into").addClass("none");//选项列表
						$("#vote-result").removeClass("none");//投票结果
						$("#vote-btn").addClass("none");
						$("#lottery-btn").removeClass("none");
						$(".countdown").removeClass("none");//定时
						support();
						raffle.lotteryLq();
					}
			    }, data:{
					yoi:openid,
					suid:suid,
					auid:auid
				}});
			});
		};
		//获取每组竞猜比例数
		var support = function() {
			var subjectUuid = $("#s-title").attr("data-uuid");//题目uuid
			N.loadData({url: domain_url+'api/question/support/'+subjectUuid,callbackQuestionSupportHandler:function(data){
				var aitems = data.aitems;
				var allSupc=0;
				if(data.code == 0) {
					for(var i=0; i<aitems.length; i++){
						allSupc +=aitems[i].supc;
					}
					for(var t=0; t<aitems.length; t++){
						$("#sc"+t).css("width",Math.round(aitems[t].supc / allSupc * 10000) / 100.00 + "%");
						$("#pc"+t).text(Math.round(aitems[t].supc / allSupc * 10000) / 100.00 + "%");
					}
				}
			}})
		};
		
		//点击抽奖
		window.zjname = null;
		window.getself = null;
		var raffle = {
			lotteryLq: function() {
				var that = this;
				$("#lottery-btn").click(function(e) {
					$("#lottery-btn").addClass("none");
					e.preventDefault();
					that.lotteryBtn();
				});
			},
			//抽奖弹层
			lotteryBtn: function() {
				var liboxa = [];
				var t = simpleTpl();
				t._('<section class="lottery-box" id="lottery-box">')
				t._('<div class="lottery-text" id="lottery">')
				t._('<a href="###" class="a-close"></a>')
				t._('<h4>猛击一张卡片试试手气吧！</h4>')
				t._('<ul id="items">')
				
				for(var p=0; p<6; p++) {
					t._('<li id="li'+p+'">')
					t._('<div class="lotterycon">')
					t._('<em class="chest"><i></i></em>')
					t._('<p class="prizes none">')
					t._('<span class="prizes-name"></span>')
					t._('<span class="prizes-img"></span>')
					t._('<span class="prizes-draw none">点击领取</span>')
					t._('<span class="mask"></span>')
					t._('</p></div></li>')
				}
				
				t._('</ul>')
				t._('</div>')
				t._('<div class="lottery-text none" id="podium">')
				t._('<a href="###" class="a-close"></a>')
				t._('<div class="trophy line" id="prizes"></div>')
				t._('<div class="trophyname" id="prizesName"></div>')
				t._('<p class="podium-input"><input name="" type="text" class="text-b" id="rn-name" placeholder="姓名" /></p>')
				t._('<p class="podium-input"><input name="" type="text" class="text-b" id="ph-phone" placeholder="手机号码" /></p>')
				t._('<p class="podium-input"><input name="" type="text" class="text-b" id="ad-address" placeholder="地址" /></p>')
				t._('<p class="blackh"><input name="" type="button" class="btn-c" id="btn-podium" value="立即领取" /></p>')
				t._('</div>')
				t._('<div class="lottery-text none" id="lottery-success" >')
				t._('<a href="###" class="a-close"></a>')
				t._('<div class="trophy tm" id="trophyimg"></div>')
				//t._('<h3 id="winning"></h3>')
				t._('<p class="podium-text">领奖成功</p>')
				t._('<p class="blackh"><input name="" type="button" class="btn-c" id="btn-bls" value="确 定" /></p>')
				t._('</div>')
				t._('</section>')
				
				$("body").append(t.toString());
				this.lotteryCon();
				this.closepop();
			},
			//打开宝箱
			openbox: function() {
				var that = this;
				N.loadData({url: domain_url+'api/lottery/prizes',callbackLotteryPrizesHandler:function(data){
					var dimg1 = [];
					var dimg2 = [];
					var pa = data.pa;
					if(pa && data.result == true) {
						if(pa.length<5) {
							for(var j=0; j<6; j++) {
								if($("#items li").eq(j).attr("id") != thisid) {
									dimg1.push(j);
								}
							}
							for(var f=0; f<5; f++) {
								dimg2.push(dimg1.splice(Math.floor(Math.random()*dimg1.length), 1));
							}
							for(var k=0; k<(5-pa.length); k++) {
							   $("#items li").eq(dimg2[k]).find(".prizes-name").text(" ");
							   $("#items li").eq(dimg2[k]).find(".prizes-img").css({"background-image":"url('images/cry.png')"});
							}
							for(var t=0; t<pa.length; t++) {
								var arr = 5-pa.length;
								$("#items li").eq(dimg2[t+arr]).find(".prizes-name").text(pa[t].pn);
								$("#items li").eq(dimg2[t+arr]).find(".prizes-img").css({"background-image":"url('"+pa[t].pi+"')"});
	
								if(pa[t].pn == zjname) {
									$("#items li").eq(dimg2[t+arr]).find(".prizes-name").text(" ");
									$("#items li").eq(dimg2[t+arr]).find(".prizes-img").css({"background-image":"url('images/cry.png')"});
								}
							}
			
						}else {
							for(var t=0; t<pa.length; t++) {
								$("#items li").not($("#"+thisid)).eq(t).find(".prizes-name").text(pa[t].pn);
								$("#items li").not($("#"+thisid)).eq(t).find(".prizes-img").css({"background-image":"url('"+pa[t].pi+"')"});
							}
						}
					}
				}});
			},
			//判断是否中奖
			lotteryCon: function() {
				var that = this;
				var wh = $(window).height()*0.84;
				$(".lottery-text").css("height",wh);
				$(".lotterycon").unbind("click").click(function(e) {
					getself = $(this);
					thisid = $(this).parent().attr("id");
					$(this).addClass("white");
					$(this).find(".chest").addClass("key");
					N.loadData({url: domain_url+'api/lottery/luck',callbackLotteryLuckHandler:function(data){
						var urlimg = "images/cry.png";
						var urltext = " ";
						if(data.result == true) {
							zjname = data.pn;
							getself.addClass("onrecerve");
							getself.find(".prizes-draw").removeClass("none");
							getself.find(".mask").addClass("maskon");
							$("#"+thisid).find(".prizes-img").css({"background-image":"url('"+data.pi+"')"});
							$("#"+thisid).find(".prizes-name").text(data.pn);
							
							//$("#winning").text(data.pn);
							$("#prizesName").text("恭喜您，获得"+data.pn+"一"+data.pu);
							$("#prizes,#trophyimg").css({"background-image":"url('"+data.pi+"')"});
							//$(".podium-text").text(data.des);
	
							if(data.rn) {
								$("#rn-name").val(data.rn);
							}
							if(data.ph) {
								$("#ph-phone").val(data.ph);
							}
							if(data.ad) {
								$("#ad-address").val(data.ad);
							}
							that.recerve();
	
						}else {
							zjname = null;
							 $("#"+thisid).find(".prizes-img").css({"background-image":"url('"+urlimg+"')"});
							 $("#"+thisid).find(".prizes-name").text(urltext);
						}
						that.openbox();
						setTimeout(function() {
							getself.find(".chest").removeClass("key").addClass("none");
							getself.removeClass("white").addClass("on");
							$(".chest").addClass("opacity");
							$(".prizes,.mask").removeClass("none");
						}, 1000);
	
						setTimeout(function() {
							$(".chest").addClass("none");
						}, 2000);
	
					},data:{
						oi: openid
					}});
					$(".lotterycon").unbind("click");
				});
			},
			//点击领取
			recerve: function() {
				var that = this;
				$("#lottery-box").delegate(".maskon","click",function(e) {
					e.preventDefault();
					$("#lottery").addClass("none");
					$("#podium").removeClass("none");
					$("#lottery-success").addClass("none");
					that.psuccess();
				});
			},
			//填写领奖品
			psuccess: function() {
				var that = this;
				$("#lottery-box").delegate("#btn-podium","click",function(e) {
					e.preventDefault();
					var src = $("#items li.lion label").find("img").attr("src");
					var $rnName =$("#rn-name");
					var trnName = $.trim($rnName.val());
					var $phPhone = $("#ph-phone");
					var tphPhone = $.trim($phPhone.val());
					var $adAddress = $("#ad-address");
					var tadAddress = $.trim($adAddress.val());
					
					if (!trnName) {//姓名
						alert("请填写姓名！");
						$rnName.focus();
						return false;
					}
					if (!tphPhone) {//手机号码
						alert("请填写手机号码！");
						$phPhone.focus();
						return false;
					}
					if (!/^\d{11}$/.test(tphPhone)) {//手机号码格式
						alert("这手机号，可打不通...！");
						$phPhone.focus();
						return false;
					}
					if (tadAddress.length < 5 || tadAddress.length > 60) {//地址
						alert("地址长度应在5到60个字！");
						$adAddress.focus();
						return false;
					}
					
					N.loadData({url: domain_url+'gansu/stock/award',callbackGansuStockAward:function(data){
						
						if(data.code == 0) {
							$("#lottery").addClass("none");
							$("#podium").addClass("none");
							$("#lottery-success").removeClass("none");
						}else {
							alert('提交失败！');
						}
						
					},data:{
						yoi: openid,
						ph: tphPhone,
						rl: trnName,
						ad: tadAddress
					   }
					});
				});
			},
			//关闭弹层
			closepop: function() {
				var that = this;
				$("body").delegate(".a-close,#btn-bls","click",function(e) {
					e.preventDefault();
					//if($(".mask").hasClass("maskon")) {
						questionTime();
					//}
					$("#lottery-box").remove();
					$(".encounter").removeClass("enhidden");
				});
			}
		};
		this.init = function() {
			other.init();
			questionTime();
		}
		this.init();	
	});
	
	// 弹幕_S
	var sendFn = function () {
		var that =this;
		var inputVal = $("#input-comment");
		var tid = that.tid;
		if (!that.tid) {
			tid = $.fn.cookie("user_score_tid");
		}
		var sendText = encodeURIComponent(inputVal.val());
		N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
			if (data.code == 0) {
				var mode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
				if (headimgurl) {
					mode = "<div class='c_head_img'><img src='" + headimgurl + "/64' class='c_head_img_img' /></div>";
				}
				barrage.appendMsg(mode + inputVal.val());
				inputVal.val("");
				showTip($("#comments"), "发送成功");
			} else {
				if (data.message) {
					alert(data.message);
					inputVal.val("");
				} else {
					alert("发表评论失败");
				}
			}
		}, data: {
			co: sendText,
			op: openid,
			tid: tid,
			ty: 1,
			nickname: nickname ? encodeURIComponent(nickname) : "",
			headimgurl: headimgurl ? headimgurl : ""
		}
		});
	};
	var showTip = function (pn, m) {
		var s = $("<div></div>");
		s.addClass("showTip").addClass("fadein");
		s.text(m);
		if (pn) {
			pn.append(s);
			(function (s) {
				setTimeout(function () {
					s.remove();
				}, 2000);
			})(s)
		}
	};
var load_comment = function () {//加载评论
		var that = this;
		that.maxid = 0;
		window.barrage = $("#comments").barrage({ fontColor: ["6FC3EF", "FFF", "DE0E4E"] });
		barrage.start(1);
		function loadComments() {
			$.ajax({
				type: 'GET',
				async: true,
				url: domain_url + "api/comments/room?temp=" + new Date().getTime(),
				dataType: "jsonp",
				data: { ps: 50, maxid: that.maxid },
				jsonpCallback: 'callbackCommentsRoom',
				success: function (data) {
					if (data.code == 0) {
						that.maxid = data.maxid;
						var items = data.items || [];
						for (var i = 0, len = items.length; i < len; i++) {
							var hmode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
							if (items[i].hu) {
								hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
							}
							if (i < 5) {
								$.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
							}
							barrage.pushMsg(hmode + items[i].co);
						}
						setTimeout(function () {
							loadComments();
						}, 5000);
					} else {
						setTimeout(function () {
							loadComments();
						}, 5000);
						if (data.message) {
							//alert(data.message);
						}
					}
				}
			});
		};
		loadComments();
	};
	this.pushCommentMas = function () {//默认评论条数
		if ($.fn.cookie('default_comment0')) {
			window.CACHEMSG.push($.fn.cookie('default_comment0'));
		} else {
			window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d1.jpg' class='c_head_img_img' /></div>" + "很好看！！");
		}
		if ($.fn.cookie('default_comment1')) {
			window.CACHEMSG.push($.fn.cookie('default_comment1'));
		} else {
			window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d2.jpg' class='c_head_img_img' /></div>" + "看到就留口水啦");
		}
		if ($.fn.cookie('default_comment2')) {
			window.CACHEMSG.push($.fn.cookie('default_comment2'));
		} else {
			window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d3.jpg' class='c_head_img_img' /></div>" + "这节目真好看");
		}
		if ($.fn.cookie('default_comment3')) {
			window.CACHEMSG.push($.fn.cookie('default_comment3'));
		} else {
			window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d4.jpg' class='c_head_img_img' /></div>" + "看预告片就好期待了");
		}
		if ($.fn.cookie('default_comment4')) {
			window.CACHEMSG.push($.fn.cookie('default_comment4'));
		} else {
			window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d5.jpg' class='c_head_img_img' /></div>" + "嗯嗯，我饿了");
		}
	};
	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height();
			this.$header.css('height', Math.round(height * 0.38));
			this.$wrapper.css('height', Math.round(height * 0.60));
			this.$comments.css('height', Math.round(height * 0.62 - 85));
			$('body').css('height', height);
		}	
	};
	$("#btn-comment").unbind("click").click(function() {
		sendFn();
	});
	// 弹幕_E
	
	H.utils.resize();
	load_comment();
	this.pushCommentMas();
	conH();
})
