// JavaScript Document
var pid;
window.getself = null;
$(function() {
    var ct = 0;
	var st = 0;
	var tr = 0;
	var timer = null;
    var cmp = true;
    var advertising  = null;
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

    H.main = {
        init: function() {
            this.updatepv();
        },
        //公用接口
        updatepv: function() {
            getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            setInterval(function() {
                getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            }, 5000);
        }
    };

	W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {//
            $(".part_num").text(data.c);
        }
    };

    N.module("bodyH", function(){

        this.mpage = function() {
            //$("body").css("background-image","url('images/lottery_bg.jpg')");
            var winH = $(window).height();
            $("#mainPage").css("height",winH);
            $(".encounter").css("height",winH-50);
        }
        this.init = function() {
            var that = this;
            this.mpage();
            window.onresize = function(){
                that.mpage();
            }
        }
        this.init();
    })

    //首页
    N.module("firstPage", function(){
		var setime;
		var mainFn = {
			firstPage: $("#firstPage"),
			nowtake: $(".now_take"),
			selectPage: $("#selectPage"),
			mainPage: $("#mainPage"),
			teamInfo: function() {
				var that = this;
				N.loadData({url: domain_url+'sport/match/info',callbackSportMatchInfo:function(data){
					if(data.code == 0){
						var items = data.items;
						$(".qiud-a, #team-logo-z").css({"background-image":"url('"+items[0].p+"')"});
						$(".qiud-b, #team-logo-k").css({"background-image":"url('"+items[1].p+"')"});
						$("#team_name_z, #team-name-z1").text(items[0].n);
						$("#team_name_k, #team-name-k1").text(items[1].n);
						$(".top_log").css({"background-image":"url('"+data.ad1+"')"});//广告01
						$(".drum-logo").css({"background-image":"url('"+data.ad2+"')"});//广告02
						advertising = data.ad3;//广告02
						$("#team1-portNo-z").text(items[0].s);
						$("#team1-portNo-k").text(items[1].s);
	
						if(cmp == true) {
							pid = data.uid;
							H.comments.currentComments(pid);
							cmp = false;
						}
	
						var zuuid = items[0].uid;
						var kuuid = items[1].uid;
						var su = data.su;
						var cuttime = data.cut; //系统时间
						var cut = timestamp(cuttime);
						var psttime = data.pst; //开始时间
						var pst = timestamp(psttime);
						var pettime = data.pet; //结束时间
						var pet = timestamp(pettime);
						st = data.st; //擂鼓间隔时间
						tr = st;
						ct = data.ct; //擂鼓持续时间

						if(cut>pst && cut<pet) {
							if(!that.mainPage.hasClass("none")) {
								that.drumProgress();
								$("#lgzw-a").addClass("none");
								$("#lgzw-b").removeClass("none");
								$("#lottery-btn-a").addClass("none");
								$("#lottery-btn-b").addClass("none");
							}else {
								$("#lgzw-a").removeClass("none");
								$("#lgzw-b").addClass("none");
							}
						}else {
							$("#p01").addClass("none");
							$("#p02").removeClass("none");
							$("#lgzw-a").addClass("none");
							$("#lgzw-b").removeClass("none");
							$("#lottery-btn-a").addClass("none");
							$("#lottery-btn-b").addClass("none");
						}
	
						that.nowTake(zuuid, kuuid, su);
					}
	
				},data:{
					op: openid
				}});
			},
			drumProgress: function() {//擂鼓倒计
				var that = this;
				$("#p01").removeClass("none");
				that.setTm(parseInt(st));
				setTimeout(function(){
					that.drumOpen();
				},parseInt(tr+1)*1000); 
			},
			drumOpen: function() {//打开擂鼓按钮
				var that = this;
				$("#lgzw-a").removeClass("none");
				$("#lgzw-b").addClass("none");
				$("#p01").addClass("none");
			},
			setTm: function() {//倒计时
				clearInterval(setime);
				setime = setInterval(function(){
					var day=0,
						hour=0,
						minute=0,
						second=0;//时间默认值
							
					if(st > 0){
						day = Math.floor(st / (60 * 60 * 24));
						hour = Math.floor(st / (60 * 60)) - (day * 24);
						minute = Math.floor(st / 60) - (day * 24 * 60) - (hour * 60);
						second = Math.floor(st) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
					}else {
						clearInterval(setime);
						st = 0;
					}
					if (minute <= 9) minute = '0' + minute;
					if (second <= 9) second = '0' + second;
					$("#zwtime").text(minute+":"+second);
					st--;
				},1000);
			},
			nowTake: function(zuuid, kuuid, su) {//马上参与
				var that = this;
				that.nowtake.click(function(e) {
					e.preventDefault();
					if(su) {
						that.firstPage.addClass("none");
						that.mainPage.removeClass("none");
						$(".comment-input").removeClass("none");
						if(su == zuuid) {//标记支持的球队
							$(".team1").find(".cheack-arrow").removeClass("none").attr("data-tc",zuuid);
						}else {
							$(".team2").find(".cheack-arrow").removeClass("none").attr("data-tc",kuuid);
						}
						$("body").css("background-image","url('images/lottery_bg.jpg')");
	
					}else {
						that.firstPage.addClass("none");
						that.selectPage.removeClass("none");
						N.selectPage.init(zuuid, kuuid);
						$("body").css("background-image","url('images/bg_1.jpg')");
					}
					//N.mainPage.lgzwJk.zwCount();//实时获助威总数
				});
			}
			
		}; 
        this.init = function() {
            mainFn.teamInfo();
        }
        this.init();
    });

    //选择球队
    N.module("selectPage", function(){
		var slectQd = {
			selectPage: $("#selectPage"),
			selectPagecon: $(".selectPage_con"),
			mainPage: $("#mainPage"),
			teamClick: function(zuuid, kuuid) {
				var that = this;
				that.selectPagecon.click(function() {
					var tuuid;
					$("body").css("background-image","url('images/lottery_bg.jpg')");
					if($(this).attr("id") == "onteam1") {
						tuuid = zuuid;
						$(".team1").find(".cheack-arrow").removeClass("none");
					}else {
						tuuid = kuuid;
						$(".team2").find(".cheack-arrow").removeClass("none");
					}
					N.loadData({url: domain_url+'sport/match/support',callbackSportMatchSupport:function(data) {
					if(data.code == 0) {
						$(this).addClass("on");
						that.selectPage.addClass("none");
						that.mainPage.removeClass("none");
						$(".comment-input").removeClass("none");
					}
					},data:{
						op: openid,
						tuid: tuuid
					}})
				});
			}
		};
        this.init = function(zuuid, kuuid) {
            slectQd.teamClick(zuuid, kuuid);
        }
        
    });

     //互动主页
    N.module("mainPage", function(){
		var lgsetime;
		//var timerL;
		var lotteryBtn = $("#lottery-btn-b");
		var lgzwJk = {
			setCount: function() {//实时获助威总数
				N.loadData({url: domain_url+'sport/match/point',callbackSportMatchPoint:function(data) {
					if(data.code != 1) {
						 $("#team1-portNo-z").text(data.items[0].s);
						 $("#team1-portNo-k").text(data.items[1].s);
					}
				}});
			},
			zwCount: function() {
				var that = this;
				that.setCount();
				setInterval(function() {
					that.setCount();
				},5000);
			},
			lgsetTm: function() {//擂鼓倒计时
				clearInterval(lgsetime);
				lgsetime = setInterval(function(){
					var day=0,
						hour=0,
						minute=0,
						second=0;//时间默认值
					if(ct > 0){
						day = Math.floor(ct / (60 * 60 * 24));
						hour = Math.floor(ct / (60 * 60)) - (day * 24);
						minute = Math.floor(ct / 60) - (day * 24 * 60) - (hour * 60);
						second = Math.floor(ct) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
					}else {
						clearInterval(lgsetime);
						ct = 0;
					}
					$(".cheer-djs em").eq(0).text(minute);
					$(".cheer-djs em").eq(1).text(second);
					ct--;
				},1000);
			},
			banging: function() {
				var that = this;
				$("#lgzw-a").click(function(e) {
					$(".lg-cheer").removeClass("none").addClass("fixed");
					$("#lgzw-a").addClass("none");
					$("#lottery-btn-a").removeClass("none");
					that.lgsetTm();
					that.drum();
					
					setTimeout(function(){
						that.drumstop();
					},parseInt(ct+1)*1000);
					
					clearInterval(timer);
					timer = setTimeout(function(){
						N.firstPage.teamInfo();
					},parseInt(tr+ct)*1000);
		
				});
			},
			drum: function() {//开始擂鼓计数
				var lgcount = 0;
				$(".drumclick").mousedown(function(e) {
					e.preventDefault();
					lgcount += 1;
					$(".drum-number").removeClass("none").find("label").text(lgcount);
					$("#audio").get(0).play();
					$(".great-left,.great-right").toggleClass("on");
	
					$(".drum-start").css("visibility","hidden");
				});
				$(".drumclick").mouseup(function(e) {
					e.preventDefault();
					setTimeout(function(){
						$("#audio").get(0).pause();
						$("#audio").currentTime = 0;
					},70);
				});  
			},
			drumstop: function() {//擂鼓接口
				$(".lg-cheer").addClass("siledown").removeClass("fixed");
				setTimeout(function(){
					$("#lottery-btn-a").addClass("none");
					$("#lottery-btn-b").removeClass("none");
					$(".lg-cheer").addClass("none").removeClass("siledown");
				},500);
				var text = parseInt($(".drum-number").addClass("none").find("label").text());
				var datatc;
				if(!$(".team1").find("span").hasClass("none")) {
					datatc = $(".team1").find("span").attr("data-tc");
				}else {
					datatc = $(".team2").find("span").attr("data-tc");
				}
				N.loadData({url: domain_url+'sport/match/encourage',callbackSportMatchEncourage:function(data) {},data:{
					op: openid,
					tuid: datatc,
					tc: text
				}});
			}
		};
		
		//抽奖互动
		
		var lotteryHd = {
			lotteryHtml: function() {
				var t = simpleTpl();
				t._('<section class="lottery-box" id="lottery-box">')
				t._('<div class="lottery-text id="lottery">')
				t._('<a href="###" class="a-close"></a>')
				t._('<div class="lottery-con" id="startlottery">')
				t._('<h4>您有<label id="opportunities"></label>次抽奖机会</h4>')
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
				
				t._('</ul></div>')
				t._('<div class="lottery-con none" id="winning">')
				t._('<div class="winning-img"></div>')
				t._('<h2 class="winning-name">太棒了，获得<i id="iname"></i></h2>')
				t._('<h3 class="winning-write">请填写您的真实信息以便领取奖品</h3>')
				t._('<div class="winning-form">')
				t._('<span>姓名:</span><input name="" type="text" class="text-c" id="input-rn" />')
				t._('</div>')
				t._('<div class="winning-form">')
				t._('<span>电话:</span><input name="" type="text" class="text-c" id="input-ph" />')
				t._('</div>')
				t._('<div class="winning-form">')
				t._('<span>地址:</span><input name="" type="text" class="text-c" id="input-ad" />')
				t._('</div>')
				t._('<a href="###" class="btn-d" id="lqprize">领取奖品</a>')
				t._('</div>')
				t._('<div class="lottery-con none" id="wsuccess">')
				t._('<h3 class="success-title"></h3>')
				t._('<p class="success-img"></p>')
				t._('<span class="chance">您还有 <label class="red"></label> 次抽奖机会</span>')
				t._('<a href="###" class="btn-e" id="continue">继续抽奖</a>')
				t._('</div></div></section>')
				
				$("body").append(t.toString());
			},
			startLottery: function() {
				var that = this;
				var winH = $(window).height();
				lotteryBtn.click(function(e) {
					e.preventDefault();
					that.lotteryHtml();
					$(".lottery-text").css("height",winH*0.82);
					clearInterval(timer);
					$(".chest i").css({"background-image":"url('"+advertising+"')"});
					
					N.loadData({url: domain_url+'api/lottery/leftChance',callbackLotteryLeftChanceHandler:function(data){
						if(data.result == true) {
							var lc = data.lc;
							$("#opportunities").text(lc);//抽奖机会
							if(data.lc<2) {
								$("#lottery-btn-b").addClass("none");
								$("#lgzw-b").removeClass("none");
							}
							that.treasure(lc);
						}
						
					},data:{
						oi: openid
					}})
					that.closeLottery();
				});
			},
			//抽奖数据读取
			readData: function(thisid) {
				var that = this;
				//var thisid = getself.parent().attr("id");
				var dimg1 = [];
           		var dimg2 = [];
           		N.loadData({url: domain_url+'api/lottery/prizes',callbackLotteryPrizesHandler:function(data){
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
							   $("#items li").eq(dimg2[k]).find(".prizes-img").css({"background-image":"url('images/cry.png')"});
							}
							for(var t=0; t<pa.length; t++) {
								var arr = 5-pa.length;
								$("#items li").eq(dimg2[t+arr]).find(".prizes-name").text(pa[t].pn);
								$("#items li").eq(dimg2[t+arr]).find(".prizes-img").css({"background-image":"url('"+pa[t].pi+"')"});
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
			treasure: function(lc) {//打开宝箱
				var that = this;
				$(".lotterycon").unbind("click").click(function(e) {
					getself = $(this);
					var thisid = $(this).parent().attr("id");
					$(this).addClass("white");
					var urlimg = "images/cry.png";
					var urltext = " ";
					if(lc != 0) {
						$("#opportunities,.chance>label").text(lc-1);//抽奖机会
					}
					$(this).find(".chest").addClass("key");
					N.loadData({url: domain_url+'api/lottery/luck',callbackLotteryLuckHandler:function(data){
						
						if(data.result == true) {
							$(this).addClass("onrecerve");
							$(this).find(".prizes-draw").removeClass("none");
							$(this).find(".mask").addClass("maskon");
                            $("#"+thisid).find(".prizes-img").css({"background-image":"url('"+data.pi+"')"});
                            $("#"+thisid).find(".prizes-name").text(data.pn);
							$(".winning-img,.success-img").css({"background-image":"url('"+data.pi+"')"});
							$("#iname").text(data.pn);

							if(data.rn) {
								$("#input-rn").val(data.rn);
							}
							if(data.ph) {
								$("#input-ph").val(data.ph);
							}
							if(data.ad) {
								$("#input-ad").val(data.ad);
							}
							that.recerve();

						}else {
							 $(this).parent().find(".prizes-img").css({"background-image":"url('"+urlimg+"')"});
                             $(this).parent().find(".prizes-name").text(urltext);
							 
						}
						that.readData(thisid);
						setTimeout(function() {
							getself.find(".chest").removeClass("key").addClass("none");
							getself.removeClass("white").addClass("on");
							$(".chest").addClass("opacity");
							$(".prizes,.mask").removeClass("none");
						}, 2000);
	
						setTimeout(function() {
							$(".chest").addClass("none");
						}, 3000);
	
					},data:{
						oi: openid
					}});

                    $(".lotterycon").unbind("click");
			    });
			},
			recerve: function() {//点击领取
				var that = this;
				$(".maskon").click(function(e) {
					e.preventDefault();
					$("#startlottery").addClass("none");
					$("#winning").removeClass("none");
					that.award();
				});
			},
			award: function() {//填写领奖品
				var that = this;
				$("#lqprize").click(function(e) {
					e.preventDefault();
					var $rnName =$("#input-rn");
					var trnName = $.trim($rnName.val());
					var $phPhone = $("#input-ph");
					var tphPhone = $.trim($phPhone.val());
					var $adAddress = $("#input-ad");
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
	
					N.loadData({url: domain_url+'api/lottery/award',callbackLotteryAwardHandler:function(data){
							
							if(data.result == true) {
								$("#winning").addClass("none");
								$("#wsuccess").removeClass("none");
							}else {
								alert('提交失败！');
							}
							
					},data:{
						oi: openid,
						ph: tphPhone,
						rn: trnName,
						ad: tadAddress
					   }
					});
					that.continueQj();
				}); 
			},
			continueQj: function() {//继续抽奖
				$("#continue").click(function(e) {
					e.preventDefault();
					$("#lottery-box").remove();
					if(!$("#lgzw-b").hasClass("none")) {
						N.firstPage.init();
					}else {
						clearInterval(timer);
						timer = setTimeout(function(){
							N.firstPage.init();
						},parseInt(tr)*1000);
					}
				});
			},
			closeLottery: function() {//关闭抽奖
				var that = this;
				$(".a-close").click(function(e) {
					e.preventDefault();
					$("#lottery-box").remove();
					if(!$("#lgzw-b").hasClass("none")) {
						N.firstPage.init();
					}else {
						clearInterval(timer);
						timer = setTimeout(function(){
							N.firstPage.init();
						},parseInt(tr)*1000);
					}
				});
			}
		};

        this.init = function() {
			lgzwJk.zwCount();
            lgzwJk.banging();
            lotteryHd.startLottery();
        }
        this.init();
    });

    //实时更新评论
    N.module("timerpl", function(){

        var plhtmle = {
            startBarrage: function() {
                var that = this;
                that.maxid = 0;

              this.loadComments = function () {
                    N.loadData({url: domain_url+'api/comments/room',callbackCommentsRoom:function(data){
                      if(data.code==0){
                       var t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
                        that.maxid = data.maxid;
                        for (var i = 0, len = item.length; i < len; i++) {

                                     if(lastUserText== (openid+"_" +item[i].co)){
                                        continue;
                                     }

                            t._('<li id="'+ that.maxid +''+i+'">')
                                ._('<img src="'+ (item[i].hu ? (item[i].hu + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/>')
                                ._('<div class="review-text">')
                                    ._('<h3>'+ (item[i].na || '匿名用户') +'</h3>')
                                    ._('<p class="all-con" id="all-con'+ that.maxid +''+i+'">')
                                        ._('<span>'+ item[i].co +'</span>')
                                    ._('</p>')
                                ._('</div>')
                                ._('</li>');

                        }

                         $nor_comment.prepend(t.toString());

                        }

                    }, data: { ps: 15, maxid: that.maxid}, showload: false
                    });
                };

            that.loadComments();
            this.CommentsInterVal = setInterval(function () {
                    that.loadComments();
                }, 5000);

            }
        }
        this.init = function() {
            plhtmle.startBarrage();
        }
        this.init();
    }); 
	
	//一键关注

	if(openid) {
		shaketv.subscribe({
			appid: weixin_appid,
			selector: "#div_subscribe_area",
			type: 1
		}, function(returnData) {

		});
	}

    H.main.init();
})