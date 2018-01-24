var yaoBg = [{
	id:1,
	imgurl:"./images/yao_bg01.jpg"
},{
	id:2,
	imgurl:"./images/yao_bg02.jpg"
},{
	id:3,
	imgurl:"./images/yao_bg03.jpg"
}];
$(function () {
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

            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
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
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {

                    W.hideLoading();
                    cbFn(data);

                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        loadImg: function (img) {
            if (!this.images) {
                this.images = [];
            }
            if (img && !(img instanceof Array)) {
                img.isLoad = false;
                this.images.push(img);
            } else if ((img instanceof Array)) {
                for (var i = 0; i < img.length; i++) {
                    img[i].isLoad = false;
                    this.images.push(img[i]);
                }
            }
            for (var j = 0; j < this.images.length; j++) {
                var that = this;
                if (!this.images[j].isLoad) {
                    var im = new Image();
                    im.src = this.images[j].src;
                    this.images[j].isLoad = true;
                    im.onload = function () {

                    }
                }
            }
        },
        showWin: function (obj) {
            var p = $.extend({
                html: "", //内部html
                beforeOpenFn: null, //打开之前
                afterOpenFn: null//打开之后执行的函数

            }, obj || {});
            this.winObj = $('<div class="win"><div class="win_contain"><div class="win_html"></div></div></div>');
            this.close = function (fn) {
                this.winObj.remove();
                if (fn) {
                    fn()
                }
                if (this.closeFn) {
                    this.closeFn();
                }
            }
            this.setWidth = function (w) {
                this.winObj.css("width", w);
            }
            this.setHeight = function (h) {
                this.winObj.css("height", h);
            }
            this.setHtml = function (html) {
                this.winObj.find(".win_html").append(html || p.html);

            }
            var that = this;
            this.winObj.find(".win_close").unbind("click").click(function () {
                that.close();
            });
            this.init = function (fn) {
                this.setHtml();
                if (p.beforeOpenFn) {
                    p.beforeOpenFn(this.winObj);
                }
                $("body").append(this.winObj);
                this.winObj.find(".win_contain").addClass("show_slow");
                if (p.afterOpenFn) {
                    p.afterOpenFn(this.winObj, this);
                }
                if (fn) {
                    fn();
                }
            }
        },
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        }
    };
    var rest = {//获取实物奖品剩余数
    	restJk: function() {
    		N.loadData({ url: domain_url + "api/lottery/leftLimitPrize", callbackLeftLimitPrizeHandler: function (data) {
    			if(data.result == true) {
    				$(".rest-redbao i").text(data.lc);
    			}
    		}, data:{},showload: false});
    	},
    	restTimeout: function() {
    		var that = this;
    		setInterval(function() {
    			that.restJk();
    		},5000)
    	}
    };
    rest.restJk();
    rest.restTimeout();
	N.module("main", function(){
		window.judge = true;
		window.pu = null;
		window.js = 0;
		var rule = {//规则
			ruleHtml: function() {
				var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                ._('<div class="dialog rule-dialog">')
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                ._("<h2></h2>")
                ._('<div class="content border">')
                ._('<div class="rule-con">')
                ._("</div>")
                ._("</div>")
                ._('<p class="dialog-copyright">页面由安徽卫视提供</p>')
                ._("</div>")
                ._("</section>");
                $("body").append(t.toString());
			},
			ruleBtn: function() {
				$(".rule-btn").click(function() {
					rule.ruleHtml();
					
					N.loadData({ url: domain_url + "api/common/rule", commonApiRuleHandler: function (data) {
						if(data.code == 0){
							$(".rule-con").html(data.rule);
						}
					}});
				});
				$("body").delegate(".btn-close","click",function(e) {
					$("#rule-dialog").remove();
				});
			}
		};
		
		var points = {//积分排行
			pointsHtml: function() {
				//加载用户积分排行
				var that = this;
				N.loadData({ url: domain_url + "api/lottery/integral/rank/self", callbackIntegralRankSelfRoundHandler: function (data) {
					var arr2 = [];
					arr2.push('<section class="contain_rank"><a href="###" class="win_close"></a><section class="pop-points">');
					arr2.push('<div class="rank-tips">每周积分前五名可分别获得现金<br />500、100、50、30、20元</div>');
					arr2.push('<div class="points-head"><i class="head-img"></i> 我的积分:<span class="my_score">0</span><em id="mypm">排名 <span class="my_rank"></span></em>');
					arr2.push('</div>');
					arr2.push('<div class="points-list">');
					arr2.push('<ul class="points-list-ul"></ul></div></section></section>');
					
					var con = $(arr2.join(""));
					if (data.result) {
						
						if (data.rk) {
							con.find(".my_rank").text(data.rk);
						}
						if (data["in"]) {
							
							con.find(".my_score").text(data["in"]);
						}
						if (headimgurl) {
                            con.find(".head-img").css({ "background-image": "url('" +  headimgurl + "/64" + "')" });
                         }
					} else {

					}
					that.win_rank = new N.showWin({
						html: con[0].outerHTML,
						beforeOpenFn: function (w) {
							w.addClass("fadein")
							w.find(".win_contain").addClass("Transparent");
						},
						afterOpenFn: function () {
							N.loadData({ url: domain_url + "api/lottery/integral/rank/top10", callbackIntegralRankTop10RoundHandler: function (data) {//其他用户积分排行
								
								if (data.result) {
									
									var arr1 = [];
									for (var i = 0; i < data.top10.length; i++) {
										if (data.top10[i].hi) {
											arr1.push('<li><i style="background-image:url(\'' + data.top10[i].hi + '\')"></i> ' + (data.top10[i]["nn"] ? data.top10[i]["nn"] : "匿名") + '</li><li class="right"><span>第' + data.top10[i].rk + '名</span></li>');
										} else {
											arr1.push('<li><i></i> ' + (data.top10[i]["nn"] ? data.top10[i]["nn"] : "匿名") + '</li><li class="right"><span>第' + data.top10[i].rk + '名</span></li>');
										}

									}
									that.win_rank.winObj.find(".points-list ul").append(arr1.join(""));
								} else {

								}
							}, data: { pu: pu }
							});
						}
					});
					that.win_rank.init();
				}, data: { 
				    pu: pu, 
					oi: openid 
				}, showload: false
				});
			},
			pointsBtn: function() {
				$(".points").click(function() {
					points.pointsHtml();
					points.pointsClose();
				});
			},
			pointsClose: function() {
				$("body").delegate(".win_close","click",function(e) {
					$(".win").remove();
				});
			}
		};
		
		var prizesHtmle = function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="pop-prizes">')
			t._('<a href="###" class="pop-close" id="pop-close"></a>')
			
			t._('<div class="pop-con none" id="pop-a">')
			t._('<div class="prizes-title">恭喜您获得 <span id="points-number"></span></div>')
			t._('<div class="red-box">')
			t._('<p class="prizes-wd none"></p>')
			t._('<p class="prizes-img"></p>')
			t._('<p class="pop-input none">')
			t._('<input name="" type="text" class="text-a" id="rn" placeholder="姓名" />')
			t._('<input name="" type="text" class="text-a" id="ph" placeholder="电话" />')
			t._('<input name="" type="text" class="text-a" id="ad" placeholder="地址" />')
			t._('<span>请确认所有信息真实有效以确保奖品准确发放</span>')
			t._('</p>')
			t._('<p class="kj-input none">')
			t._('<input name="" type="text" class="text-a" id="ph-kj" placeholder="电话" />')
			t._('<span>请确认所有信息真实有效以确保奖品准确发放</span>')
			t._('</p>')
			t._('<a href="###" class="btn-a none" id="jp-btn" data-collect="true" data-collect-flag="sister-jp" data-collect-desc="积分">领 取</a>')
			t._('<a href="###" class="btn-a none" id="kj-btn" data-collect="true" data-collect-flag="sister-kj" data-collect-desc="卡劵">领 取</a>')
			t._('<a href="###" class="btn-a pcenter none" id="lqhb-btn" data-collect="true" data-collect-flag="sister-lqhb" data-collect-desc="红包">领 取</a>')
			t._('</div>')
			t._('</div>')
			t._('<div class="pop-con success-bg none" id="pop-b">')
			t._('<h2 class="prizes-success">领取成功</h2>')
			t._('<a href="" class="xzq-tg" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a> ')
			t._('<a href="###" class="btn-b none" id="btn-qd">确 定</a>')
			t._('<a href="" class="btn-b none" id="btn-qsy" data-collect="true" data-collect-flag="sister-shiyong" data-collect-desc="去沟店使用">去使用</a>')
			t._('</div>')
			t._('</div>')
			t._('</section>')
			$("body").append(t.toString());
		};
		var imgMath = function() {//随机背景
			var i = Math.floor((Math.random()*yaoBg.length));
			$("body").css("backgroundImage","url('"+yaoBg[i].imgurl+"')");
		};
		
		var cook = {
			pdCook: function() {
				if(getQueryString("rp") == 1) {
					prizesHtmle();
					$("#pop-b").removeClass("none");
					$("#btn-qd").removeClass("none");
					yao.promotion();
					yao.popcolse();
					judge = false;
				}
			}
		};
		
		var yao = {
			shake: function() {
				W.addEventListener('shake', yao.shake_listener, false);
			},
			unshake: function() {
				W.removeEventListener('shake', yao.shake_listener, false);
			},
			shake_listener: function() {
				if(judge == false) {
					return;
				}
				if(!$(".home-box").hasClass("yao") && !$(".home-box").hasClass("noing")) {
					$(".come-on").removeClass("cn-tips").addClass("none");
					$("#audio-a").get(0).play();
					$(".home-box").addClass("yao noing");
					setTimeout(function() {
						imgMath();
						$(".home-box").removeClass("yao");
						yao.lottery();
					},1000);
					setTimeout(function() {
						$(".home-box").removeClass("noing");
					},1700);
				}
			},
			//抽奖
			lottery: function(){
				N.loadData({url: domain_url+'api/lottery/luck',callbackLotteryLuckHandler:function(data){
					if(data.result == true) {
						judge = false;
						$("#audio-b").get(0).play();
						prizesHtmle();
						var winH = $(window).height();
						$(".pop-prizes").css("height",winH*0.85);
						$("#pop-a").removeClass("none");
						$("#points-number").text(data.pn);
						$(".prizes-img").css("backgroundImage","url('"+data.pi+"')");
						if(data.pt==4) {
							$("#lqhb-btn").attr("href",data.rp).removeClass("none");
						}else if(data.pt==9){
							$(".prizes-wd").removeClass("none");
							$(".prizes-img").addClass("pcenter");
							$("#btn-qsy").removeClass("none").attr("href",data.ru);
							$("#kj-btn").removeClass("none");
							$(".kj-input").removeClass("none");
						}else {
							$(".pop-input").removeClass("none");
							$("#jp-btn").removeClass("none");
							$("#btn-qd").removeClass("none");
						}
						
						if(data.rn) {
							$("#rn").val(data.rn);
						}
						if(data.ph) {
							$("#ph,#ph-kj").val(data.ph);
						}
						if(data.ad) {
							$("#ad").val(data.ad);
						}
						yao.promotion();
						yao.kajuan();
						yao.recerve();
						yao.popcolse();
					}else {
						$("#audio-c").get(0).play();
						$(".come-on").removeClass("none").addClass("cn-tips");
					}
				}, data:{
					oi: openid,
					sau: pu
				},showload: false});
			},
			promotion: function() {//推广
				N.loadData({url: domain_url+'api/common/promotion',commonApiPromotionHandler:function(data){
					if (data.code == 0 && data.desc && data.url) {
						$('.xzq-tg').text(data.desc || '').attr('href', (data.url || ''));
					}else {
						$('.xzq-tg').remove();
					};
				},data:{
					oi:openid
				}})
			},
			//领奖
			//1卡劵
			kajuan: function() {
				$("#kj-btn").click(function(e) {
					var $kjph = $("#ph-kj");
					var kjph = $.trim($("#ph-kj").val());
					if (!kjph) {//手机号码
						alert("请填写手机号码！");
						$ph.focus();
						return false;
					}
					if (!/^\d{11}$/.test(kjph)) {//手机号码格式
						alert("这手机号，可打不通...！");
						$kjph.focus();
						return false;
					}
					
					$.ajax({
						type: 'GET',
						async: true,
						url: "http://h5.m.koudai.com/hd/wdjx/getCoupon.do?temp=" + new Date().getTime(),
						dataType: "jsonp",
						data: { phone:kjph, country:86, callback:"getCouponCallback"},
						jsonpCallback: "getCouponCallback",
						success: function (data) {
							if (data.result.status == 1) {
								$("#pop-a").addClass("none");
							    $("#pop-b").removeClass("none");
							} else if (data.result.status == 0) {
								alert(" 已经领取过，不能重复领取");
							} else {
								alert("抱歉领取失败");
							}
						}
					});
				});
			},
			//2积分
			recerve: function() {
				$("#jp-btn").click(function(e) {
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
					
					N.loadData({url: domain_url+'api/lottery/award',callbackLotteryAwardHandler:function(data){
							
							if(data.result == true) {
								$("#pop-a").addClass("none");
								$("#pop-b").removeClass("none");
							}else {
								alert('提交失败！');
							}
							
					},data:{
						oi: openid,
						ph: ph,
						rn: rn,
						ad: ad
					   }
					});
				});
			},
			//关闭
			popcolse: function() {
				$("body").delegate("#btn-qd,#pop-close,#follow","click",function(e) {
					e.preventDefault();
					e.stopPropagation();
					$(".pop-bg").remove();
					$(".attention-bg").addClass("none");
					judge = true;
				});
			}
		};
		
		this.down_count = function (obj) {//倒计时
			var p = $.extend({
				itemObj: "", //倒计时显示的元素
				activity: [], //活动的时间段
				cTime: this.systemTime, //当前时间
				eachShowFn: null, //每次倒计时回调
				canLotteryFn: null, //当前时间落在抽奖时间的回调
				endFn: null//结束事件
			}, obj || {});

			var that = this;
			var wTime = 500;
			var cTime = p.cTime;
			window.t_count = 0;
			var showTime = function (rT, showTpl) {
				var s_ = Math.round((rT % 60000) / wTime);
				s_ = dateNum(Math.min(Math.floor(s_ / 1000 * wTime), 59));
				var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
				var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
				var d_ = dateNum(Math.floor(rT / 86400000));
				p.itemObj.text(showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_));
			};
			var runTime = function () {
				try {
					// if ($.fn.cookie(p.activity[t_count].au) == "zhong") {//当前这期已经中奖
					//     t_count++;
					// };
					cTime += wTime;
					if (!p.activity[t_count]) {
						if (window.progressTimeInterval) {
							clearInterval(window.progressTimeInterval);
						}
						return;
					}

					var sorgT = parseInt(timestamp(p.activity[t_count].pd + " " + p.activity[t_count].st));
					var eorgT = parseInt(timestamp(p.activity[t_count].pd + " " + p.activity[t_count].et));
					var sT = isNaN(sorgT) ? 0 : sorgT - cTime;
					var eT = isNaN(eorgT) ? 0 : eorgT - cTime;

					if (sT > 0) {// 即将开始
						//showTime(sT, "%H%:%M%:%S%");
						if (p.eachShowFn) {
							p.eachShowFn(p.itemObj.text());
						}
					} else if (eT > 0) {//显示，可以进行抽奖
						if (p.canLotteryFn) {
							showTime(eT, "%H%:%M%:%S%");
							p.canLotteryFn(p.activity[t_count]);
						}
					} else {// 结束
						t_count++;
						if (t_count >= p.activity.length) {
							if (p.endFn) {
								p.endFn();
							}
							if (window.progressTimeInterval) {
								clearInterval(window.progressTimeInterval);
							}
						}
					}
				}
				catch (e) {
					if (window.progressTimeInterval) {
						clearInterval(window.progressTimeInterval);
					}
				}
			}
			runTime();
			window.progressTimeInterval = setInterval(function () {
				runTime();
			}, wTime);

		};
		this.LotteryTag =0;
		this.load_activity = function () {//加载活动时间
		        var that = this;
                that.activity = [];
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: domain_url + "api/lottery/round",
                    dataType: "jsonp",
                    jsonpCallback: 'callbackLotteryRoundHandler',
                    success: function (data) {
                        if (data.result) {
                            that.systemTime = data.sctm;
                            that.activity = data.la;
                            that.down_count({ itemObj: $("#dowmtime"), activity: that.activity, eachShowFn: function () {
								 //if(that.LotteryTag>0){
									 window.location.href= "index.html";
							     //}
								 
                            }, canLotteryFn: function (o) {
								
                                that.au = o.ud;
                                that.tid = o.ud;
								pu = o.ud;
							    that.LotteryTag++;
									
								
								
                            }, endFn: function () {
								 window.location.href= "index.html";
                            }
                            });

                        } else {
                            setTimeout(function () {
                                that.load_activity();
                            }, 1000);

                            if (data.message) {
                            }
                        }
                    }, error: function () {
                        setTimeout(function () {
                            that.load_activity();
                        }, 1000);
                    }
                });

        };
		this.yuyue = function() {
			N.loadData({ url: domain_url + "program/reserve/get", callbackProgramReserveHandler: function (data) {
                    if (!data.reserveId) {
                        return;
                    } else {
						$(".order").removeClass("none");
						$(".points").removeClass("mtop");
                        window.reserveId_t = data.reserveId;
                        window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function (resp) {
                            if (resp.errorCode == 0) {

                            }
                        });
                    }
                }
            });
		};
		
		var order = function() {
			$(".order").click(function() {
				var reserveId = window.reserveId_t;
				if (!reserveId) {
					return;
				}
				shaketv.reserve(yao_tv_id, reserveId, function (data) {});
			});
		};
		this.init = function() {
			cook.pdCook();
			this.yuyue();
			imgMath();
			order();
			rule.ruleBtn();
			points.pointsBtn();
			yao.shake();
			this.load_activity();
		};
		this.init();
	});
	
})
