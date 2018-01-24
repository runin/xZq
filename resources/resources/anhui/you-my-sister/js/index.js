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
		/*
        hashchange: (function () {
            $(window).bind("hashchange", function () {
                var pname = window.location.hash.slice(1);
                if (pname) {
                    N.page[pname]();
                } else {
                    pname = "firstPage";
                    N.page[pname]();
                }
                if (N[pname].goIntoFn) {
                    N[pname].goIntoFn();
                }
            });
            return {};
        })(),
		*/
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

            this.initEvent = function () {
                var that = this;
                this.winObj.find(".win_close").unbind("click").click(function () {
                    that.close();
                });
            }
            this.init = function (fn) {
                this.setHtml();
                if (p.beforeOpenFn) {
                    p.beforeOpenFn(this.winObj);
                }
                $("body").append(this.winObj);
                this.initEvent();
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

        },
		/*
        page: {
            firstPage: function (fn) {
                window.location.hash = "firstPage";
                $(".footer").show();
                $(".bottom_tip").show();
                N.showPage("firstPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            },
            starPage: function (fn) {
                window.location.hash = "starPage";
                $(".footer").hide();
                N.showPage("starPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            }
        }
		*/
    };

    N.module("comment", function () {
		
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
				$(".top_my_rule").click(function() {
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
		
		this.pageH = function() {
			var winH = $(window).height();
			$(".page").css("height",winH);
		}
        this.initParam = function () {
            this.top_down_no = $(".top_down_no");
            this.top_subscribe = $(".top_subscribe");
            this.top_my_score = $(".top_my_score");
            this.c_input = $(".c_input");
            this.send = $("#send");
            this.c_input = $(".c_input");
            this.comments = $(".comments");
            this.top_canLottery = $(".top_canLottery");

        }
        this.initEvent = function () {
            var that = this;
            this.eventobj = {
                top_subscribeFn: function () {

                    var reserveId = window.reserveId_t;
                    if (!reserveId) {
                        return;
                    }
                    shaketv.reserve(yao_tv_id, reserveId, function (data) {
                    });
                },
                top_my_scoreFn: function () {

                    var tid = that.tid;
                    if (!that.tid) {
                        tid = $.fn.cookie("user_score_tid");
                    }
                    //加载用户积分排行
                    N.loadData({ url: domain_url + "api/lottery/integral/rank/self", callbackIntegralRankSelfRoundHandler: function (data) {
                        var arr2 = [];
                        arr2.push('<section class="contain_rank"><img src="./images/close.png" class="win_close" /><section class="pop-points">');
						arr2.push('<div class="rank-tips">每周积分前五名可分别获得现金<br />500、100、50、30、20元</div>');
                        arr2.push('<div class="points-head"><i class="head-img"></i> 我的积分:<span class="my_score">0</span><em id="mypm">排名 <span class="my_rank"></span></em>');
						arr2.push('</div>');
						arr2.push('<div class="points-list">');
                        arr2.push('<ul class="points-list-ul"></ul></div></section></section>');
						
                        var con = $(arr2.join(''));
                        if (data.result) {
                            if (data.rk) {
                                con.find(".my_rank").text(data.rk);
                            }
                            if (data["in"]) {
                                con.find(".my_score").text(data["in"]);
                            }
                            if (headimgurl) {
                                headimgurl + "/64"
                                con.find(".head-img").css({ "background-image": "url('" + headimgurl + "/64" + "')" });
                            }
                        } else {

                        }
						
                        that.win_rank = new N.showWin({
                            html: con[0].outerHTML,
                            beforeOpenFn: function (w) {
                                w.addClass("fadein");
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
                                }, data: { pu: tid }
                                });
                            }
                        });
                        that.win_rank.init();
                    }, data:{ 
					    pu: tid, 
						oi: openid
						}, showload: false
                    });


                },
                sendFn: function () {
                    var tid = that.tid;
                    if (!that.tid) {
                        tid = $.fn.cookie("user_score_tid");
                    }
                    var sendText = encodeURIComponent(this.c_input.val());
                    N.loadData({ url: domain_url + "api/comments/save", callbackCommentsSave: function (data) {
                        if (data.code == 0) {
                            var mode = "<div class='c_head_img'><img src='./images/avatar.jpg' class='c_head_img_img' /></div>";
                            if (headimgurl) {
                                mode = "<div class='c_head_img'><img src='" + headimgurl + "/64' class='c_head_img_img' /></div>";
                            }
                            barrage.appendMsg(mode + that.c_input.val());
                            that.c_input.val("");
                            that.showTip($("#comments"), "发送成功");
                        } else {
                            if (data.message) {
                                alert(data.message);
                                that.c_input.val("");
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
                },
                top_canLotteryFn: function () {
                    window.location.href = "yao.html";
                }
            };
			
            this.top_subscribe.unbind("click").click($.proxy(this.eventobj.top_subscribeFn, this));
            this.top_my_score.unbind("click").click($.proxy(this.eventobj.top_my_scoreFn, this));
            this.send.unbind("click").click($.proxy(this.eventobj.sendFn, this));
            this.top_canLottery.unbind("click").click($.proxy(this.eventobj.top_canLotteryFn, this));
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
                            showTime(sT, "%H%:%M%:%S%");
                            if (p.eachShowFn) {
                                p.eachShowFn(p.itemObj.text());
                            }
                        } else if (eT > 0) {//显示，可以进行抽奖
                            if (p.canLotteryFn) {

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

        };
        this.loadData = function () {
            var that = this;
            this.load_reserve = function () {
                N.loadData({ url: domain_url + "program/reserve/get", callbackProgramReserveHandler: function (data) {
                    if (!data.reserveId) {
                        $(".top_subscribe").hide();
                        return;
                    } else {
                        $(".top_subscribe").show();
						$(".top_right").removeClass("tab");
                        window.reserveId_t = data.reserveId;
                        window['shaketv'] && shaketv.preReserve(yao_tv_id, data.reserveId, function (resp) {
                            if (resp.errorCode == 0) {

                            }
                        });
                    }
                }
                });
            };
            this.load_comment = function () {//加载评论
                var that = this;
                that.maxid = 0;
                window.barrage = this.comments.barrage({ fontColor: ["6FC3EF", "FFF", "DE0E4E"] });
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



            that.activity = [];
            var top_down = $(".top_down");
            var top_canLottery = $(".top_canLottery");
            var top_end = $(".top_end");
            this.load_activity = function () {//加载活动时间

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
                            that.down_count({ itemObj: $(".top_down_no"), activity: that.activity, eachShowFn: function () {

                                top_down.show();
                                top_canLottery.hide();
                                top_end.hide();
                            }, canLotteryFn: function (o) {

                                top_down.hide();
                                top_canLottery.show();
                                top_end.hide();
                                that.au = o.ud;
                                that.tid = o.ud;
                                $.fn.cookie("user_score_tid", that.tid, { expires: 30 });
                            }, endFn: function () {
                                top_down.hide();
                                top_canLottery.hide();
                                top_end.show();
                            }
                            });

                        } else {
                            top_down.hide();
                            top_canLottery.hide();
                            top_end.show();
                            setTimeout(function () {
                                that.load_activity();
                            }, 1000);

                            if (data.message) {
                            }
                        }
                    }, error: function () {
                        top_end.show();
                        setTimeout(function () {
                            that.load_activity();
                        }, 1000);
                    }
                });

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
                    window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d2.jpg' class='c_head_img_img' /></div>" + "很喜欢男1号哦");
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
                    window.CACHEMSG.push("<div class='c_head_img'><img src='./images/d5.jpg' class='c_head_img_img' /></div>" + "女一号好好好好好漂亮啊！！！");
                }
            };
			//零食话题
			this.wdgg = function() {
				N.loadData({ url: domain_url + "api/comments/topic/round?dev=lingshi", callbackCommentsTopicInfo: function (data) {
					var items = data.items;
                    if (items && data.code == 0) {
                        $(".yida").removeClass("none").find("a").text(items[0].t).attr("href",items[0].c);
                        if (items[0].im) {
							$(".yida").find("i").css({ "background-image": "url('" + items[0].im + "')"}).removeClass("none");
                        }
                     }
                }});
			};
            this.load_reserve();
            this.load_comment();
            this.load_activity();
            this.pushCommentMas();
			this.wdgg();

        };
        this.initPlugins = function () {

            this.showTip = function (pn, m) {
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
            }
        };
        this.init = function () {
			rule.ruleBtn();
			this.pageH();
            this.initParam();
            this.initPlugins();
            this.loadData();
			this.initEvent();
        };
        this.init();

    });

});
