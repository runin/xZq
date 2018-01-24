(function($) {
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
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        }
    };
	var listH = function() {
		var wH = $(window).height();
		var tH = $(".header").height();
	}
	//执行代码
	N.module("profile", function(){
		var profileFn = {
			roundTime: function() {//倒计时
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
								countDownFn: function (t, tmp) {//每次倒数回调
								    $("#start-cj").removeClass("none");
								}, atTimeFn: function (t, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断
									window.location.href= "yao.html";
								}, endFn: function (t) {//整个倒计时结束的回调
								    $("#start-cj").addClass("none");
									$("#end-cj").removeClass("none").text("今天摇奖已结束~");
								}
							});
						}else {
							$("#end-cj").removeClass("none").text("抽奖互动，敬请期待！");
						}
					}
				});
			},
			ruleHtml: function() {//规则
				var t = simpleTpl();
				t._('<section class="pop-bg">')
				t._('<div class="rule-con">')
				t._('<div class="rule">')
				t._('<a href="###" class="rule-close"></a>')
				t._('<div class="rule-title"></div>')
				t._('<div class="rule-text"></div>')
				t._('</div>')
				t._('</div>')
				t._('</section>')
				$("body").append(t.toString());
			},
			ruleFn: function() {
				$("#rule-btn").click(function() {
					profileFn.ruleHtml();
					$(".rule-con").addClass("r-rule");
					N.loadData({ url: domain_url + "api/common/rule", commonApiRuleHandler: function(data) {
						if(data.code == 0){
							$(".rule-text").html(data.rule);
						}
					}});
				});
				$("body").delegate(".rule-close","click",function(e) {
					$(".rule-con").removeClass("r-rule").addClass("g-rule");
					setTimeout(function() {
						$(".pop-bg").remove();
					},550);
				});
			},
			articleFn: function() {
				N.loadData({ url: domain_url + "api/article/list", callbackArticledetailListHandler: function (data) {
					var arts = data.arts;
					if(arts && data.code == 0) {
						$(".experts").css("backgroundImage","url('"+arts[arts.length-1].img+"')");
						$(".profile-text").html(arts[arts.length-1].i);
					}	
				}});
			},
			question: function() {
				$("#partake-Btn").click(function(e) {
					e.preventDefault();
					N.loadData({ url: domain_url + "api/comments/topic/round", callbackCommentsTopicInfo: function(data) {
						var items = data.items;
						if(items && data.code == 0){
							window.location.href="talking.html?uid="+items[0].uid+"";
						}else {
							window.location.href="talking.html";
						}
					}});
				});
			}
		};
		this.init = function() {
			profileFn.roundTime();
			profileFn.ruleFn();
			profileFn.articleFn();
			profileFn.question();
		};
		this.init();
	});

})(Zepto);