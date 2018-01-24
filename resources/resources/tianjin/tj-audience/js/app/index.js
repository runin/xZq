// JavaScript Document
$(function() {
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
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
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

    N.module("main", function(){
        //广告
        /*
        var advert = {
            atFn: function() {
                N.loadData({url: domain_url+'api/ad/get',callbackAdGetHandler:function(data) {
                    
                    if(data.code == true) {
                        var ads = data.ads;
                        $(".home-logo").css("backgroundImage","url('"+ads[0].p+"')");
                    }
                    
                },data:{
                    areaNo:"No1"
                  }
                });
            }
        };
        */
        var dTime = {
            mainTime: $(".main-time"),
            timeFn: function() {
                var that = this;
                var timeall = that.timeCount*that.timeSeconds;
                N.loadData({url: domain_url+'common/time',callbackTimeHandler:function(data) {
                    var t = data.t;
                    var timenow = new Date(t);
                    var getDate = timenow.getDate();
                    switch(getDate){
                        case 1:
                           that.mainTime.addClass("img7");
                           break;
                        case 2:
                           that.mainTime.addClass("img6");
                           break;
                        case 3:
                           that.mainTime.addClass("img5");
                           break;
                        case 4:
                           that.mainTime.addClass("img4");
                           break;
                        case 5:
                           that.mainTime.addClass("img3");
                           break;
                        case 6:
                           that.mainTime.addClass("img2");
                           break;
                        case 7:
                           that.mainTime.addClass("img1");
                           break;
						case 8:
						   that.mainTime.addClass("img8");
						   break;
						case 9:
						   that.mainTime.addClass("img8");
						   break;
						case 10:
						   that.mainTime.addClass("img8");
						   break;
                        default:
                           that.mainTime.addClass("img9");
                    };
                }});
            },
            yaoRule: function() {
                var t = simpleTpl();
                t._('<section class="rule-box">')
                t._('<div class="rule">')
                t._('<a href="###" class="close"></a>')
                t._('<div class="rule-con">')
                t._('<div class="rule-img"></div>')
                t._('</div>')
                t._('</div>')
                t._('</section>')
                $("body").addClass("truepop").append(t.toString());
                $(".rule-box").click(function(e) {
                    e.stopPropagation();
                    $(".rule-box").remove();
                    $("body").removeClass("truepop");
                });

            },
            timer: function() {
                var that = this;
                var timeInt;
                N.loadData({url: domain_url+'api/lottery/round',callbackLotteryRoundHandler:function(data) {
                    
                    if(data.result == true) {
                        var sctm = data.sctm;//系统当前毫秒时间
                        var la = data.la;
                        for(var i=0; i<la.length; i++) {
                            var pd = la[i].pd;//活动日期YYYY-MM-DD
                            var st = la[i].st;//开始时间HH:mm:ss
                            var s = timestamp(pd+" "+st);
                            var et = la[i].et;//结束时间HH:mm:ss
                            var e = timestamp(pd+" "+et);
                            var en = la[la.length-1].et;//结束时间HH:mm:s
                            var n = timestamp(pd+" "+en);

                            if(s>sctm || n<sctm) {
								return;
                            }
                            if(s<sctm && sctm<e) {
                                $(document).click(function() {
                                    window.location.href = "lottery.html";
                                });
                                timeInt = setTimeout(function(){
                                    if(!$("body").hasClass("truepop")) {
                                        window.location.href = "lottery.html";
                                        clearInterval(timeInt);
                                    }
                                },5000);
								return
                            }
                        }
                    }
					
                }});
            },
            timeSet: function() {
                var that = this;
                var stime;
                that.timer();
                clearInterval(stime);
                stime = setInterval(function() {
                    that.timer();
                },5000);
            }
        };
        this.init = function() {
			dTime.timeFn();
            if(getQueryString("from")) {
                dTime.yaoRule();
            }
            dTime.timeSet();
        };
        this.init();
    });

	
})