// JavaScript Document
var pid;
$(function() {
	var cmp = true;
	window.support = null;
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
		$(".encounter").css("height",winh-52);
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
				judge.voiedata();
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
			alert(t);
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
		var judge = {
			voiedata: function() {//第期时间
			    var that = this;
				N.loadData({url: domain_url+'gansu/stock/info',callbackGansuStockInfo:function(data){
					if(openid && data.code == 0) {
						var pstime = data.pst; //该期播放开始时间
					    var petime = data.pet; //该期播放结束时间
						var	cuttime = data.cut; //当前系统时间
						var	ps = timestamp(pstime);//该期播放开始毫秒
						var pe = timestamp(petime);//该期播放结束毫秒
						var pc = timestamp(cuttime);//系统时间毫秒
						var qitems = data.qitems;
						//评论
						if(cmp == true) {
							pid = data.pid;
							H.comments.currentComments(pid);
							cmp = false;
						}
						//clearInterval(support);
						if(qitems && pc>ps && pc<pe) {
							judge.timeTm(data,pc);
						}else {
							$("#s-title").addClass("none");//题目标题
							$("#inquire-into").addClass("none");//投票题目box
							$("#vote-result").addClass("none");//投票比例box
							$(".countdown").removeClass("none");//倒计时div
							countDown(0,'今日抽奖已结束，明天再来吧');
						}
					}
				},data: {
					yoi:openid
				  }
				});
			},
			//时间每个抽奖时间
			timeTm: function(data,pc) {
				var that = this;
				var qitems = data.qitems;
				for(var i=0; i<qitems.length; i++) {
					var qst = qitems[i].qst;//开始时间
					var qet = qitems[i].qet;//结束时间
					var qs = timestamp(qst);//开始秒
					var qe = timestamp(qet);//结束秒
					var qcode = qitems[i].qcode;//是否参与过
					
					if(pc>qs && pc<qe) {
						//假如这题目已经投过票了
						if(qcode == 1) {
							share.qcodeR();//投票比例
							support = setInterval(function(){
								share.qcodeR()
							},5000);
							if(i<(qitems.length-1)){
								var nexttime=timestamp(qitems[i+1].qst);
								countDown(parseInt((nexttime-pc)/1000),'离下次抽奖还剩');
								timeOut(parseInt(nexttime-pc));
								
							}else {
								countDown(0,'今日抽奖已结束，明天再来吧');
								timeOut(parseInt(qe-pc));
							}
							return;
						}
						timeOut(parseInt(qe-pc));
						topic.showTm(data, qitems[i].qt, qitems[i].aitems, qitems[i].quid);//题目函数
						return;	
					}
					$("#s-title").addClass("none");//题目
					$("#inquire-into").addClass("none");//选项列表
					$("#vote-result").addClass("none");//投票结果
					$(".countdown").removeClass("none");//定时
					if(pc<qs) {
						countDown(parseInt((qs-pc)/1000),'投票抽奖倒计时');
						timeOut(qs-pc);
						return;
					}
	
					if(pc>=timestamp(qitems[qitems.length-1].qet)) {
						countDown(0,'今日抽奖已结束，明天再来吧');
						return;
					}	
				}
			}
		};
		//每个时间点的题目
		var topic = {
			showTm: function(data, qt, aitems, quid) {
				var that = this;
				var vote = [];
				var result = [];
				//var scconut = 0;//总支持数
				$("#s-title").removeClass("none").text(qt).attr("data-uuid",quid);//题目
				var t=$("#s-title").attr("data-uuid");
				$("#inquire-into").removeClass("none");//选项列表
				$("#vote-result").addClass("none");//投票结果
				$(".countdown").addClass("none");//定时
	
				for(var t=0; t<aitems.length; t++) {
					vote.push('<span data-auid="'+aitems[t].auid+'" class="radio-span">'+aitems[t].at+'</span>');
					result.push("<h5>"+aitems[t].at+"</h5><p><span class='r-ratio'><em id='sc"+t+"'></em></span> <span class='r-number' id='pc"+t+"'></span> </p>");
					scconut += aitems[t].sc;
				}
				$("#vote").empty().append(vote.join(''));
				$(".result").empty().append(result.join(''));
				that.clickradio(aitems);
			},
			//选择答案
			clickradio: function(aitems) {
				var that = this;
				$("#vote").delegate('.radio-span',"click",function(e) {
					e.preventDefault();
					$(this).addClass("on").siblings().removeClass("on");
					var index = $(this).index();
					var checkid = $(this).attr("data-auid");
					alert("01:"+index+"----"+checkid);
					share.voteBtn(index, aitems, checkid);
				});
			}
		};

		var share = {
			//选择投票
			voteBtn: function(index, aitems, checkid) {
				var that = this;
				$("#vote-btn").click(function(e) {
					e.preventDefault();
					if(!$("#vote .radio-span").hasClass("on")) {
						alert("请选择您要投票的选项！");
						return;
					}
					alert("02:"+index+"----"+checkid);
					N.loadData({url: domain_url+'gansu/stock/answer',callbackGansuStockAnswer:function(data){
						if(data.code == 0) {
							var atCount = 0;
							alert("03:"+index+"----"+checkid);
							$("#s-title").removeClass("none");//题目
							$("#inquire-into").addClass("none");//选项列表
							$("#vote-result").removeClass("none");//投票结果
							$("#cj-p").removeClass("none");//抽奖按钮
							$(".countdown").addClass("none");//定时
							atCount = aitems[index].sc+1;
							for(var s=0; s<aitems.length; s++) {
								//if(s!=index) {
									$("#sc"+s).css("width",Math.round(aitems[s].sc / (scconut+1) * 10000) / 100.00 + "%");
									$("#pc"+s).text(Math.round(aitems[s].sc / (scconut+1) * 10000) / 100.00 + "%");
								//}
							}
							$("#sc"+index).css("width",Math.round(atCount / (scconut+1) * 10000) / 100.00 + "%");
							$("#pc"+index).text(Math.round(atCount / (scconut+1) * 10000) / 100.00 + "%");
							//raffle.lotteryLq();
						}
					},data: {
						yoi: openid,
						auid: checkid
					   }
					});
			  });
			},
			//投票比例
			qcodeR: function() {
				var that = this;
				$("#s-title").removeClass("none");//题目标题
				$("#inquire-into").addClass("none");//投票题目box
				$("#vote-result").removeClass("none");//投票比例box
				$(".countdown").removeClass("none");//倒计时div		
				$("#cj-p").addClass("none");//抽奖按钮
				var quid = $("#s-title").attr("data-uuid");
				
				N.loadData({url: domain_url+'gansu/stock/support',callbackGansuStockSupport:function(data){
					var aitem = data.aitem;
					if(aitem && data.code == 0) {
						var tpsc = 0;
						for(var i=0; i<aitem.length; i++) {
							tpsc += aitem[i].sc;
						}
						for(var t=0; t<aitem.length; t++) {
							$("#sc"+t).css("width",Math.round(aitem[t].sc / tpsc * 10000) / 100.00 + "%");
							$("#pc"+t).text(Math.round(aitem[t].sc / tpsc * 10000) / 100.00 + "%");
						}
				    }
			    },data:{
				    quid:quid
			    }});
			}
		};
		//点击抽奖
		window.zjname = null;
		window.getself = null;
		var raffle = {
			lotteryLq: function() {
				var that = this;
				$("#lottery-btn").click(function(e) {
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
					//$(".lotterycon").unbind("click");
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
						judge.voiedata();
					//}
					$("#lottery-box").remove();
					$(".encounter").removeClass("enhidden");
				});
			}
		};
		this.init = function() {
			other.init();
			judge.voiedata();
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
	conH();
})