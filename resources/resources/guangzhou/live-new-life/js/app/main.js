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
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        }
    };

    N.module("main", function () {
		window.judge = true;
		var cook = {
			pdCook: function() {
				if(getQueryString("rp") == 1) {
					lottery.lyHtml();
					$("#hb-success").removeClass("none");
					lottery.promotion();
					lottery.closeBtn();
					judge = false;
				}
			}
		};
		var rule = {//规则
			ruleHtml: function() {
				var t = simpleTpl();
				t._('<section class="ruel-pop">')
				t._('<div class="ruel-con">')
				t._('<a href="###" class="r-close"></a>')
				t._('<div class="ruel-text">')
				t._('<h2>活动规则</h2>')
				t._('<div class="ruel-list"></div>')
				t._('</div>')
				t._('</div>')
				t._('</section>')
                $("body").append(t.toString());
			},
			ruleBtn: function() {
				$(".rule-bt").click(function() {
					rule.ruleHtml();
					judge = false;
					N.loadData({ url: domain_url + "api/common/rule", commonApiRuleHandler: function (data) {
						if(data.code == 0){
							$(".ruel-list").html(data.rule);
						}
					}});
				});
				$("body").delegate(".r-close","click",function(e) {
					$(".ruel-pop").remove();
					judge = true;
				});
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
				$("#yao-pv").click();
				if(!$(".yao-con").hasClass("yaoing")) {
					$("#audio-a").get(0).play();
					$(".yao-con").addClass("yaoing");
					setTimeout(function() {
						$(".yao-con").removeClass("yaoing");
						yao.article();
					},1000);
				}
			},
			article: function() {
				N.loadData({ url: domain_url + "api/article/list", callbackArticledetailListHandler: function(data) {
					if(data.code == 0) {
						var arts = data.arts;
						var leng = arts.length;
						var i = Math.floor(Math.random()*leng);
						window.location.href="lottery.html?uid="+arts[i].uid+"";
					}
				}})
			}
		};
		//互动时间
		var etime = function() {
			N.loadData({ url: domain_url + "api/lottery/round", callbackLotteryRoundHandler: function(data) {
				var la = data.la
				if(la && data.result == true) {
					var stime = parseInt(timestamp(la[0].pd+" "+la[0].et));//第一个时间
					var ent = parseInt(timestamp(la[la.length-1].pd+" "+la[la.length-1].et));//最后一个时间
					for(var i=0; i<la.length; i++) {
						var sctm = data.sctm;//系统时间
						var pdst = parseInt(timestamp(la[i].pd+" "+la[i].st));//开始时间
						var pdet = parseInt(timestamp(la[i].pd+" "+la[i].et));//结束时间

						if(sctm>pdst && sctm<pdet) {
							$("#lottery-btn,#favourable").removeClass("on");
							$(".jm-tips").addClass("none");
							return;
						}
						$("#lottery-btn,#favourable").addClass("on");
						if(sctm<stime) {
							$(".jm-tips").text("今天节目还没开始哦，请稍等~").removeClass("none");
							return;
						}
						if(sctm<pdst) {
							$(".jm-tips").text("下一轮还没开始哦，请稍等~").removeClass("none");
							return;
						}
						if(sctm>ent) {
							$(".jm-tips").text("今天节目已结束，明天再来吧~").removeClass("none");
							return;
						}
					}
				}else {
					$("#lottery-btn,#favourable").addClass("on");
					$(".jm-tips").text("敬请关注周一至周六18:12广州新闻频道").removeClass("none");
				}
				/*
				if(!la || data.result == false) {
					$("#lottery-btn,#favourable").addClass("on");
					$(".jm-tips").text("敬请关注周一至周六18:12广州新闻频道").removeClass("none");
				}
				*/
			},showload: false});
			setTimeout(etime,5000);
		};
        var lottery = {
			lyHtml: function() {
				var t = simpleTpl();
				t._('<section class="main-pop" id="main">')
				
				t._('<div class="pop-redbao none" id="hongbao">')
				t._('<a href="###" class="p-close"></a>')
				t._('<p id="money"></p>')
				t._('<a href="" class="btn-a" id="money-btn" data-collect="true" data-collect-flag="live-lqhb" data-collect-desc="领取红包">领 取</a>')
				t._('</div>')
				
				t._('<div class="pop-kj none" id="kajuan">')
				t._('<a href="###" class="p-close"></a>')
				t._('<h2 id="kjname"></h2>')
				t._('<p id="kjimg" data-ci="" data-ts="" data-si=""></p>')
				t._('<h3 class="none" id="lookkj">( 代金劵已发微信卡包，请查看 )</h3>')
				t._('<a href="###" class="btn-b" id="addcard" data-collect="true" data-collect-flag="live-lqdjj" data-collect-desc="领取代金劵">领 取</a>')
				t._('<a href="###" class="btn-b none" id="djjbtn" data-collect="true" data-collect-flag="live-djjbtn" data-collect-desc="代金劵领取成功">确 定</a>')
				t._('</div>')
				
				t._('<div class="pop-kj none" id="error">')
				t._('<a href="###" class="p-close"></a>')
				t._('<h4 id="awtext"></h4>')
				t._('<h5 class="none" id="myf"></h5>')
				t._('<p class="none" id="mzjimg"></p>')
				t._('<a href="###" class="btn-b" id="errorbtn" data-collect="true" data-collect-flag="live-jxjy" data-collect-desc="继续加油">继续加油</a>')
				t._('</div>')
				
				t._('<div class="pop-kj none" id="hb-success">')
				t._('<a href="###" class="p-close"></a>')
				t._('<h6>领取成功！</h6>')
				t._('<a href="" class="xzq-tg" id="tttj" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
				t._('<a href="###" class="btn-b" id="successbtn">确 定</a>')
				t._('</div>')
				
				t._('</section>')
				$("body").append(t.toString());
				lottery.closeBtn();
			},
			lyBtn: function() {
				$("#lottery-btn").click(function() {
					if($(this).hasClass("on")) {
						return;
					}
					lottery.lyHtml();
					N.loadData({ url: domain_url + "api/lottery/exec/luck", callbackLotteryLuckHandler: function(data) {
						if(data.result == true) {
							judge = false;
							if(data.pt == 4) {//假如是红包
							    $("#hongbao").removeClass("none");
								$("#money").text(data.pn);
								$("#money-btn").attr("href",data.rp);
							}else if(data.pt == 7){//代金劵
								$("#kajuan").removeClass("none");
								$("#batchAddCard").removeClass("none");
								$("#kjname").text(data.tt);
								$("#kjimg").css("backgroundImage","url('"+data.pi+"')").attr({"data-ci":data.ci,"data-ts":data.ts,"data-si":data.si});
								lottery.djjBtn();
							}else {
								$("#error").removeClass("none");
								if(data.pd) {
									$("#awtext").text(data.tt);
									$("#myf").removeClass("none").html(data.pd);
									$("#mzjimg").addClass("none");
									$("#errorbtn").text(data.al);
								}else {
									$("#awtext").text(data.tt);
									$("#mzjimg").css("backgroundImage","url('"+data.pi+"')").removeClass("none");
									if(data.al) {
										$("#errorbtn").text(data.al);
										return;
									}
									$("#errorbtn").text("继续加油");
								}
							}
							
						}else {
							$("#awtext").text("真不好意思！");
							$("#errorbtn").text("知道了~");
							$("#error").removeClass("none");
							$("#myf").removeClass("none").html("唉哎，差一点就中大奖了，换个姿势试试~");
						}
				    },data:{
						matk:matk
					}})
				});
			},
			djjBtn: function() {//领取代金劵
			    // 在这里调用 API
				document.querySelector('#addcard').onclick = function() {
					var ci = $("#kjimg").attr("data-ci");
					var ts = $("#kjimg").attr("data-ts");
					var si = $("#kjimg").attr("data-si");
					wx.addCard({
						cardList: [{
							cardId: ci,
							cardExt: "{\"timestamp\":\""+ ts +"\",\"signature\":\""+ si +"\"}"
						}], // 需要添加的卡券列表
						success: function(res) {
							$("#addcard").addClass("none");
							$("#djjbtn,#lookkj").removeClass("none");
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
			closeBtn: function() {
				$("body").delegate(".p-close,#successbtn,#errorbtn,#djjbtn","click",function(e) {
					$("#main").remove();
					judge = true;
				});
		    }
		};
		var pagehtml = function() {
			$("#favourable").click(function() {
				if($(this).hasClass("on")) {
					return;
				}
				window.location.href="card.html";
			});
			$("#mylk").click(function() {
				window.location.href="my.html";
			});
		};
		
        this.init = function() {
			etime();
			cook.pdCook();
			yao.shake();
			wx.ready(function() {
				//wx.config成功
				//执行业务代码
				lottery.lyBtn();
			});
			wx.error(function(res){
				//alert("权限验证错误:"+res.errMsg);
			});
			pagehtml();
			rule.ruleBtn();
        };
        this.init();
    });
});
