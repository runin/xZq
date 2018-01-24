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
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };
	
	var timeds = 5000;
    N.module("lottery", function(){
		var jktime = {
            stimeFn: function() {
                var that = this;
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
								window.location.href = "index.html"
								return;
							}
							if(s<sctm && sctm<e) {
								timeds = e-sctm;
								return;
							}
                        }
                    }
                    
                }});
            },
            stimeInt: function() {
                var that = this;
				var stime;
                that.stimeFn();
				clearInterval(stime);
                stime = setInterval(function() {
                    that.stimeFn();
                },timeds);
            }
        };
		
        var popHtml = {
            $openlottery: $("#openlottery"),
            $mainLottery: $(".main-lottery"),
            lHtml: function() {
                var t = simpleTpl();
                t._('<section class="lottery-pop">')
                    //t._('<div class="share-bt none"></div>')//分享有惊喜
                    t._('<div class="bags-bg">')
                    t._('<div class="red-envelope">')
                    t._('<ul id="on-lottery">')
                    t._('<li></li><li></li><li></li>')
                    t._('</ul>')
                    t._('<span class="lottery-btn-a" id="num-text">领取 <strong id="elememt">0</strong>/3</span>')
                    t._('<span class="lottery-btn-a none" id="num-btn">制作邀请卡</span>')
                    t._('</div>')
                    t._('</div>')

                    t._('<div class="winning-bg none">')//填写信息
                    t._('<a href="###" class="close-a"></a>')
                    t._('<div class="winning-top"></div>')
                    t._('<div class="winning-coupons"></div>')
                    t._('<h3 class="winning-title">恭喜您获得<label></label></h3>')

                    t._('<div class="credentials none">')
                    t._('<p class="credentials-munber"></p>')
                    t._('<h5 class="ts-check none">以上是您的领奖凭证，请关注天视汇查询</h5>')
                    t._('<p class="winning-btn"><span class="btn-a none" id="success-btn">确 定</span><a href="###" class="btn-a none" id="lqhb-btn">点击领取</a></p>')
                    t._('</div>')
                    t._('<h4 class="attention">关注天视汇来领奖，滴滴红包等你抢！</h4>')
                    t._('<section class="footer-pop">页面由天津广播电视台提供 <br />新掌趣科技技术支持&Powered by holdfun.cn</section>')
                    t._('</div>')

                    t._('<div class="error none">')
                    t._('<a href="###" class="close-b"></a>')
                    t._('<div class="error-img"></div>')
                    t._('<span class="btn-b" id="error-btn">返 回</span>')
                    t._('</div>')
                t._('</section>')
                $("body").append(t.toString());
            },
            cookFn: function() {//cookie存在的时候
                var that = this;
                var erer = $.parseJSON($.fn.cookie("lotterycook"));//获取cookie;
                if(erer) {
                    that.lHtml();
                    $("#elememt").text(erer.num);
                    if(erer.num == 3){
                        $("#num-text").addClass("none");
                        $("#num-btn").removeClass("none");
                    }
                    var l = erer.lion;
                    if(erer.lion.red1 == "false") {
                        $("#on-lottery li").eq(0).addClass("on");
                    }
                    if(erer.lion.red2 == "false") {
                        $("#on-lottery li").eq(1).addClass("on");
                    }
                    if(erer.lion.red3 == "false") {
                        $("#on-lottery li").eq(2).addClass("on");
                    }
                    
                    $.fn.cookie("lotterycook",null);
                    that.startLottery();
                    that.closePop();
                    that.numBackcard();
                }
            },
            loadHtml: function() {//打开弹层
                var that = this;
                that.$mainLottery.click(function() {
                    that.lHtml();
                    that.startLottery();
                    that.closePop();
                    that.numBackcard();
                });
            },
            startLottery: function() {//点击抽奖
                var that = this;
                var elm = $("#elememt").text();
                var num = elm;
                var lion = {red1:"true",red2:"true",red3:"true"};
                var r ={};
                
                for(var i=0; i<3; i++){
                    if($("#on-lottery li").eq(i).hasClass("on")) {
                        switch(i) {
                            case 0:
                                lion.red1 = "false";
                                break
                            case 1:
                                lion.red2 = "false";
                                break
                            case 2:
                                lion.red3 = "false";
                                break 
                        }
                    }
                }
                $("#on-lottery").delegate("li","click",function(e) {
                    e.preventDefault();
                //$("#on-lottery").find("li").click(function() {
                    if(!$(this).hasClass("on")) {
                        $(this).addClass("on");
                        num++;
                        var index = $(this).index();
                        switch(index) {
                            case 0:
                                lion.red1 = "false";
                                break
                            case 1:
                                lion.red2 = "false";
                                break
                            case 2:
                                lion.red3 = "false";
                                break 
                        }
                        $("#elememt").text(num);
                        if(num == 3) {
                            $("#num-text").addClass("none");
                            $("#num-btn").removeClass("none");
                        }
                        r.lion =lion;
                        r.num = num;
                        N.loadData({url: domain_url+'api/lottery/luck',callbackLotteryLuckHandler:function(data) {
                            if(data.result == true) {
                                if(data.pt == 4) {//红包
                                    $("#lqhb-btn").attr("href",data.rp).removeClass("none");
									$("#success-btn").addClass("none");
                                    $(".credentials-munber").text((data.pv/100)+".00 元");
                                    $.fn.cookie("lotterycook",JSON.stringify(r));

                                }else {//卡劵
                                    $(".credentials-munber").text(data.cc);
                                    $("#success-btn").removeClass("none");
									$("#lqhb-btn").addClass("none");
                                    podium.backLottery();
                                }
                                $(".winning-bg").removeClass("none");
                                $(".credentials").removeClass("none");
                                $(".bags-bg").addClass("none");
                                $(".winning-title").find("label").text(data.pn);
                                $(".winning-coupons").css("backgroundImage","url('"+data.pi+"')");

                            }else {
                                $(".bags-bg").addClass("none");
                                $(".error").removeClass("none");
                            }

                        },data:{
                            oi: openid
                        }});
                    }
                })
            }, 
            closePop:function() {
                $(".close-a").click(function(e) {
                    e.preventDefault();
                    $(".winning-bg,.credentials").addClass("none");
                    $(".bags-bg").removeClass("none");
                });
                $(".close-b,#error-btn").click(function(e) {
                    e.preventDefault();
                    $(".bags-bg").removeClass("none");
                    $(".error").addClass("none");
                });
            },
            numBackcard: function() {
                $("#num-btn").click(function() {
                    window.location.href = "star.html";
                });
            }
        };

        var podium = {//领奖

            writeForm: function(ph, rn) {
                var that = this;
                if(ph){
                    $("#input-phone").val(ph);
                }
                if(rn){
                    $("#input-name").val(rn);
                }
                $("#form-btn").click(function(e) {
                    e.preventDefault();
                    var $rnName = $("#input-name");
                    var trnName = $.trim($rnName.val());
                    var $phPhone = $("#input-phone");
                    var tphPhone = $.trim($phPhone.val());

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
                    $("#c-name").text(trnName);
                    $("#c-phone").text(tphPhone);
                    that.confirmed(tphPhone, trnName);
                });
            },
            confirmed: function(tphPhone, trnName) {
                var that = this;
                N.loadData({url: domain_url+'api/lottery/award',callbackLotteryAwardHandler:function(data) {
                    alert(data.result);
                    if(data.result == true) {
                        $(".credentials,#success-btn").removeClass("none");
                        that.backLottery();
                    }else {
                        alert('提交失败！');
                    }
                },data:{
                    oi: openid,
                    ph:tphPhone,
                    rn:trnName
                }})
            },
            tipsPop: function() {//成功后提示
                var t = simpleTpl();
                t._('<section class="tipspop">领奖成功！</section>')
                $("body").append(t.toString());
            },
            backLottery: function() {
                $("#success-btn").click(function() {
                    $(".winning-bg,.credentials").addClass("none");
                    $(".bags-bg").removeClass("none");
                    this.tipsPop();
                    setTimeout(function() {
                        $(".tipspop").remove();
                    },1000);

                });
            }
        };
        this.init = function() {
            popHtml.cookFn();
            popHtml.loadHtml();
            $(".backhome").click(function() {
                window.location.href="index.html";
            });
            jktime.stimeInt();
        };
        this.init();
    });
    
    WeixinApi.hideOptionMenu();
    wx.hideOptionMenu();

})