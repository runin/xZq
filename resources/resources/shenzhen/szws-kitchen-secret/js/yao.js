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



var yaoBg = [{
	id:1,
	imgurl:"./images/yao_bg01.jpg"
},{
	id:2,
	imgurl:"./images/yao_bg02.jpg"
},{
	id:3,
	imgurl:"./images/yao_bg03.jpg"
},{
	id:4,
	imgurl:"./images/yao_bg04.jpg"
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
                ._('<p class="dialog-copyright">页面由深圳卫视提供</p>')
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
		
		var prizesHtmle = function() {
			var t = simpleTpl();
			t._('<section class="pop-bg">')
			t._('<div class="pop-prizes">')
			t._('<a href="###" class="pop-close" id="pop-close" data-collect="true" data-collect-flag="szws-kitchen-secret-gb" data-collect-desc="中奖弹层关闭"></a>')
			t._('<div class="pop-con none" id="pop-a">')
			t._('<div class="prizes-title"><div class="gx-info"><p id="gx-text">恭喜您获得</p><span id="points-number"></span></div></div>')
			t._('<div class="red-box">')
			t._('<p class="prizes-img" data-ci="" data-ts="" data-si=""></p>')
			t._('<p class="pop-input none">')
			t._('<input name="" type="text" class="text-a" id="rn" placeholder="姓名" />')
			t._('<input name="" type="text" class="text-a" id="ph" placeholder="电话" />')
			t._('<input name="" type="text" class="text-a" id="ad" placeholder="地址" />')
			t._('<span>请确认所有信息真实有效以确保奖品准确发放</span>')
			t._('</p>')
			t._('<a href="###" class="btn-a cardbtn none" id="jp-btn" data-collect="true" data-collect-flag="out-jp-lq" data-collect-desc="领取外部链接奖品">领 取</a>')
			t._('<a href="###" class="btn-a cardbtn none" id="lqhb-btn" data-collect="true" data-collect-flag="szws-kitchen-secret-lqhb" data-collect-desc="领取红包">领 取</a>')
			t._('<a href="###" class="btn-a cardbtn none" id="card-btn" data-collect="true" data-collect-flag="weixinkajuan" data-collect-desc="领取微信卡劵">领 取</a>')
			t._('<a href="###" class="btn-a cardbtn none" id="none-btn">确 定</a>')
			
			t._('</div>')
			t._('</div>')
			t._('<div class="pop-con success-bg none" id="pop-b">')
			t._('<h2 class="prizes-success">领取成功</h2>')
			t._('<a href="" class="xzq-tg" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a> ')
			t._('<a href="###" class="btn-b none">确 定</a>')
			t._('<a href="" class="btn-d none" id="to-user" data-collect="true" data-collect-flag="touser" data-collect-desc="外链接-去使用">去使用</a>')
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
					$("#pop-b,.btn-b").removeClass("none");
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
					},1700)
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
							$(".btn-b").removeClass("none");
						}else if(data.pt==7) {
							$(".prizes-img").attr({"data-ci":data.ci,"data-ts":data.ts,"data-si":data.si});
							$("#card-btn").removeClass("none");
							yao.wcardBtn();
						}else if(data.pt==2){
							$("#gx-text").text("对不起");
							$("#none-btn").removeClass("none");
						}else {
							$("#jp-btn").removeClass("none");
							//$(".pop-input").removeClass("none");
							$("#to-user").attr("href",data.ru).removeClass("none");
						}
						
						if(data.rn) {
							$("#rn").val(data.rn);
						}
						if(data.ph) {
							$("#ph").val(data.ph);
						}
						if(data.ad) {
							$("#ad").val(data.ad);
						}
						
						yao.promotion();
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
			wcardBtn: function() {//领取代金劵
			    // 在这里调用 API
				document.querySelector('#card-btn').onclick = function() {
					var ci = $(".prizes-img").attr("data-ci");
					var ts = $(".prizes-img").attr("data-ts");
					var si = $(".prizes-img").attr("data-si");
					wx.addCard({
						cardList: [{
							cardId: ci,
							cardExt: "{\"timestamp\":\""+ ts +"\",\"signature\":\""+ si +"\"}"
						}], // 需要添加的卡券列表
						success: function(res) {
							$("#pop-a").addClass("none");
							$("#pop-b,.btn-b").removeClass("none");
							//var cardList = res.cardList; // 添加的卡券列表信息
						},
						fail: function(res){
							//alert(res.errMsg);
						},
						complete: function(){
							//hidenewLoading();
						}
					});
				};
			},
			//领奖
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
				$("body").delegate(".btn-b,#none-btn,#pop-close,#follow","click",function(e) {
					e.preventDefault();
					e.stopPropagation();
					$(".pop-bg").remove();
					judge = true;
				});
			}
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
								countDownFn: function (t, tmp) {//每次倒数回调
								    window.location.href= "index.html";
								}, atTimeFn: function (t, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断

								}, endFn: function (t) {//整个倒计时结束的回调
								    window.location.href= "index.html";
								}
							});
						}
                    }
                });
        };

		
		this.init = function() {
			cook.pdCook();
			imgMath();
			rule.ruleBtn();
			yao.shake();
			wx.ready(function() {
				//wx.config成功
				//执行业务代码
			});
			wx.error(function(res){
				//alert("权限验证错误:"+res.errMsg);
			});
			this.load_activity();
		};
		this.init();
	});
	
})
