var tips = [{
	id:1,
	text:"又一个大奖给人领走了~您加油啊!"
},{
	id:2,
	text:"哎，差一点就中大奖了"
},{
	id:3,
	text:"您与一个大奖擦肩而过，可惜啊~",
	aitems:[{
		
	}]
},{
	id:4,
	text:"要不您换个姿势试试~"
},{
	id:5,
	text:"不要灰心，您有福之相，肯定会中大奖~"
},{
	id:6,
	text:"加油！您没有天理不中奖的~"
}];
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
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        }
    };
	//执行代码
	var surplus = {//获取实物奖品剩余数
		restJk: function() {
			N.loadData({ url: domain_url + "api/lottery/leftLimitPrize", callbackLeftLimitPrizeHandler: function(data) {
				if(data.result == true) {
					$(".surplus").removeClass("none");
					$("#hongbao-mb").text(data.lc);
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
	surplus.restJk();
	surplus.restTimeout();
	
	N.module("yao", function(){
		window.judge = true;
		var cook = {
			pdCook: function() {
				if(getQueryString("rp") == 1) {
					yao.popHtml();
					$("#success-lq").removeClass("none");
					$(".redbao-top").removeClass("dlbao");
					$("#get-name").text("现金红包一个");
					yao.gold();
					yao.popClose();
					judge = false;
				}
			}
		};
		var winH = function() {
			var wH = $(window).height();
			$("body").css("min-height",wH);
		};
		var yao = {
			openN:null,
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
				if(!$(".yao-bg").hasClass("yaoing")) {
					$(".yao-tips").removeClass("y-tips");
					$("#audio-a").get(0).play();
					$(".yao-bg").addClass("yaoing");
					setTimeout(function() {
						yao.lottery();
					},1000);
					setTimeout(function() {
						$(".yao-bg").removeClass("yaoing");
					},1600);
				}
			},
			popHtml: function() {
				var t = simpleTpl();
				t._('<section class="pop-bg">')
				t._('<div class="pop-con">')
				t._('<div class="pop-redbao">')
				t._('<a href="###" class="pop-close"></a>')
				
				t._('<div class="redbao-top dlbao">')
				t._('<div class="congratulations">恭喜您，获得<span id="get-name"></span></div>')
				t._('</div>')
				
				t._('<div class="redbao-con">')
				
				t._('<div class="none" id="package">')
				t._('<div class="cjdlb"></div>')
				t._('<a href="###" class="pop-btn-a" id="open-redbao" data-collect="true" data-collect-flag="jiangkang-ckkk" data-collect-desc="拆开看看">拆开看看</a>')
				t._('</div>')
				
				t._('<div class="hongbao none" id="hong-bao">')
				t._('<div class="money"><span id="money"></span>元</div>')
				t._('<a href="" class="pop-btn-a" id="rp" data-collect="true" data-collect-flag="jiangkang-lqhb" data-collect-desc="领取红包">领　取</a>')
				t._('</div>')
				
				t._('<div class="card-coupons none" id="card-coupons"></div>')
				
				t._('<div class="none" id="write-phone">')
				t._('<div class="phone-title" id="focouse">请填写您的联系方式以便顺利领奖</div>')
				t._('<input name=rn"" type="text" class="phone-text" id="rn" placeholder="姓名" />')
				t._('<input name="ph" type="text" class="phone-text" id="ph" placeholder="手机号码" />')
				t._('<a href="###" class="pop-btn-a" id="tj-form" data-collect="true" data-collect-flag="jiangkang-lqswj" data-collect-desc="填写中奖信息">领 取</a> ')
				t._('</div>')
				
				t._('<div class="none" id="check-phone">')
				t._('<div class="phone-title">一、卡劵信息：</div>')
				t._('<div class="card-ms" id="card-ms"></div>')
				t._('<div class="phone-title">二、个人信息：</div>')
				t._('<div class="phone-check"></div>')
				t._('<a href="###" class="pop-btn-a" id="queren-btn" data-collect="true" data-collect-flag="queren" data-collect-desc="中奖信息确认">确 定</a> ')
				t._('</div>')
				
				t._('<div class="none" id="success-lq">')
				t._('<div class="success-text">恭喜您，领取成功！</div>')
				t._('<a href="###" class="pop-btn-a" id="lq-success">确 定</a>')
				t._('<a href="" class="pop-btn-b" id="tttj" data-collect="true" data-collect-flag="tttj" data-collect-desc="天天淘金"></a>')
				t._('</div>')

				t._('<div class="none" id="error-cj">')
				t._('<div class="error-text"><img src="" id="error-img" /><p id="error-tt"></p></div>')
				t._('<a href="###" class="pop-btn-c" id="error-btn" data-collect="true" data-collect-flag="jiangkang-none" data-collect-desc="下次换个姿势再抽奖哦"></a>')
				t._('</div>')
				
				t._('</div>')
				t._('</div>')
				t._('</div>')
				t._('</section>')
				$("body").append(t.toString());
			},
			lottery: function() {
				N.loadData({url: domain_url+'api/lottery/luck',callbackLotteryLuckHandler:function(data){
					if(data.result == true) {
						judge = false;
						$("#audio-a").get(0).pause();
						$("#audio-b").get(0).play();
						yao.popHtml();//加载弹层
						$(".pop-con").addClass("t-redbao");
						$(".yao-tips").removeClass("y-tips");
						
						$("#get-name").html(data.pn+"一"+data.pu);
						
						if(data.pt == 0 || data.pt == 2) {
							$("#error-cj").removeClass("none");
							$("#error-img").attr("src",data.pi);
							$("#error-tt").html(data.tt);
							$("#error-btn").text(data.aa);
						}else {
							$("#package").removeClass("none");
						}
						
						if(data.pt == 1) {
							yao.openN = 1;
							$("#card-coupons").css("backgroundImage","url('"+data.pi+"')");
							$("#focouse").html(data.aw);
							$("#card-ms").html(data.pd);
							if(data.rn) {
								$("#rn").val(data.rn);
							}
							if(data.ph) {
								$("#ph").val(data.ph);
							}
						}
						if(data.pt == 4) {
							yao.openN = 4;
							$("#rp").attr("href",data.rp);
							$("#money").text((data.pv/100)+".00");
						}
						yao.openRedbao();
						yao.tjForm();
						yao.popClose();
					}else {
						$("#audio-a").get(0).pause();
						$("#audio-c").get(0).play();
						var i = Math.floor((Math.random()*tips.length));
			            $(".yao-tips").text(tips[i].text).addClass("y-tips");
					}
				},data:{
					oi: openid
				},showload: false});
			},
			openRedbao: function() {//拆开看看
				$("#open-redbao").click(function(e) {
					e.preventDefault();
					$("#package").addClass("none");
					$(".redbao-top").removeClass("dlbao");
					if(yao.openN == 1) {
						$("#card-coupons").removeClass("none");
						$("#write-phone").removeClass("none");
					}else {
						$("#hong-bao").removeClass("none");
					}
					yao.gold();//天天淘金
				})
			},
			tjForm: function() {//领取奖品
				$("#tj-form").click(function(e) {
					e.preventDefault();
					var $rn = $("#rn");
					var rn = $.trim($("#rn").val());
					var $ph = $("#ph");
					var ph = $.trim($("#ph").val());
					
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
					$(".phone-check").html("姓名："+rn+"<br />"+"电话："+ph);
					N.loadData({url: domain_url+'api/lottery/award',callbackLotteryAwardHandler:function(data){
						if(data.result == true) {
							$("#write-phone,#card-coupons").addClass("none");
							$("#check-phone").removeClass("none");
							$("#queren-btn").click(function() {
								$("#check-phone").addClass("none");
								$("#success-lq").removeClass("none");
							});
						}else {
							alert('提交失败！');
						}
					},data:{
						oi: openid,
						ph: ph,
						rn: rn
					   }
					});
				});
			},
			gold: function() {//天天淘金
				N.loadData({url: domain_url+'api/common/promotion',commonApiPromotionHandler:function(data){
					if (data.code == 0 && data.desc && data.url) {
						$('#tttj').text(data.desc || '').attr('href', (data.url || ''));
					}else {
						$('#tttj').remove();
					};
				},data:{
					oi:openid
				}})
			},
			popClose: function() {
				$(".pop-close,#lq-success,#error-btn").click(function(e) {
					e.preventDefault();
					$(".pop-con").removeClass("t-redbao").addClass("g-redbao");
					setTimeout(function() {
						judge = true;
						$(".pop-bg").remove();
					},650);
				})
			}
		};
		var roundFn = {
			roundTime: function() {
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
								    window.location.href= "index.html";
								}, atTimeFn: function (t, index, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断
								    var arry = new Array();
								    arry = startTime.split(":");
									$("#time-a").text(arry[0]);
									$("#time-b").text(arry[1]);
									$("#time-c").text(arry[2]);
									
								}, endFn: function (t) {//整个倒计时结束的回调
								    window.location.href= "index.html";
								}
							});
						}
					}
				});
			}
		};
		this.init = function() {
			winH();
			roundFn.roundTime();
			cook.pdCook();
			yao.shake();
		};
		this.init();
	});
})