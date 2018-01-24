;(function($) {
	H.loading = {
		percent: 0,
		$stage: $('#stage_loading'),
		$loadingBar: $('#loading_bar'),
		init: function(){
			this.resize();
			PIXI.loader.add(gameConfig.assetsToLoader);
	    	PIXI.loader.load(function(){
	    		H.loading.$loadingBar.find('p').html('加载完成');
	    		setTimeout(function(){
	    			H.loading.$stage.addClass('none');
	    			H.index.init();
	    		},200);
	    	});
		},

		resize: function(){
			var height = $(window).height();
			this.$stage.css('height', height);
			this.$stage.removeClass('none');
			this.$loadingBar.css('top', (height - 70) / 2).removeClass('none');
			this.$stage.css('opacity', 1);
		}
	};

	H.index = {
		$stage: $('#stage_index'),
		$stages: $('.stage'),
		$play: $('#stage_index .play-btn'),
		$bgm: $('#bgm'),
		game: null,
		awardList: null,
		lastScore: 0,
		isRestart: false,
		repeat_load : true,
		dec:"",
		nowTime:"",
		pra:"",
		type:0,
		index: 0,
		roundIndex:0,
		istrue: true,
		vilidGameTime :0,
		stopGame :null,
		day:"",
		wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
		isError: false,
		sto:null,
		init: function(){
			  	var i=0;
             	setInterval(function(){
             		i++;
             	  $(".num").html(i).css("color","#fff");
             	},1000)
			this.resize();
			this.bindBtns();
			this.gameTimeInfo();
			this.refreshDec();
		},
		refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time'+dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = Date.parse(new Date());
                            H.index.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
		gameTimeInfo : function(){
			shownewLoading()
			 $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
				complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.result == true){
                        H.index.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        var serverTime = timestamp(H.index.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.index.dec = (nowTime - serverTime);
                        H.index.gameTime(data);
                     
                    }else{
                        if(H.index.repeat_load){
                            H.index.repeat_load = false;
                            setTimeout(function(){
                                H.index.gameTimeInfo();
                            },500);
                         //接口返回false
                        }else{
                        	H.index.gameTimeError();	
                        }
                    }
                },
                //接口出错
                error : function(xmlHttpRequest, error) {
                	H.index.gameTimeError();
                }	
			})
		},
		gameTimeError : function(){
			hidenewLoading();
 			$("#stage_index .index-btn").addClass("none");	
 			$(".time-tip").html("玩游戏抽大奖，敬请期待");
 			$(".time").removeClass("none");
		},
		//查抽奖活动接口
        gameTime:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.index.nowTime,
                me = this;
                H.index.pra = prizeActList;
                H.index.day = nowTimeStr.split(" ")[0];
            if(prizeActList.length >0){
                //如果最后一轮结束
              
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                   	H.index.change();
                    return;
                }
                 //config微信jssdk
                H.index.wxConfig();
                //第一轮摇奖开始之前，显示倒计时
                for ( var i = 0; i < prizeActList.length; i++) {
                	 
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	H.index.index = i;
                    	H.index.roundIndex = i;
                    	if(i >=prizeLength-1){
                    		H.index.type = 3;
		                }else{
                    		H.index.type = 2;
                    		H.index.index++;
                    	}
                    	H.index.nowCountdown(prizeActList[H.index.index]);
                    	return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                    	H.index.type = 1;
                    	H.index.index = i;
                    	H.index.roundIndex = i;
 						H.index.nowCountdown(prizeActList[i]);
                        return;
                    }

                }
            }else{
               $(".time-text").html('敬请期待!')
                return;
            }
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        checkGame : function(){
        	var endTimeStr = H.index.pra[H.index.roundIndex].pd+" "+H.index.pra[H.index.roundIndex].et;
            var endTimeLong = timestamp(endTimeStr);
      			endTimeLong += H.index.dec;
      		if($.fn.cookie('round-'+H.index.pra[H.index.roundIndex].ud)&&$.fn.cookie('round-'+H.index.pra[H.index.roundIndex].ud) == "flag"){
				$(".time").removeClass("none"); 
			    $(".play-btn").addClass("none");
		    }
      	   //本轮最后的不够玩一轮有游戏的时间
            else if((endTimeLong - new Date().getTime()) <= (gameTime+30000)){
	            $(".time").removeClass("none"); 
				$(".play-btn").addClass("none");
	        }else{
	            $(".time").addClass("none"); 
				$(".play-btn").removeClass("none");
				H.index.vilidGameTime =(endTimeLong - new Date().getTime())-(gameTime+30000);
				H.index.stopGame=setTimeout(function(){
					$(".time").removeClass("none"); 
					$(".play-btn").addClass("none");
			    },H.index.vilidGameTime)
	        } 
        },
        nowCountdown: function(pra){
            if(H.index.type == 1){
            	$(".time").removeClass("none"); 
				$(".play-btn").addClass("none");
            }else{
            	H.index.checkGame();
            }
            if(H.index.type !== 3){
            	var beginTimeStr = pra.pd+" "+pra.st;
	            var beginTimeLong = timestamp(beginTimeStr);
	      		beginTimeLong += H.index.dec;
	      		$('.downContTime').attr('etime',beginTimeLong);
            	$(".time-tip").html("距游戏开启还有");
            	H.index.count_down();
            	H.index.istrue = true;
            }else{
      			 $(".time-tip").html("关注下期玩游戏抽大奖");
      		}
            hidenewLoading();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.index.istrue){
                        	H.index.istrue = false;
                        	if(H.index.type == 2){
	                        	H.index.roundIndex++
	                        }
	                        if(H.index.index >= H.index.pra.length-1){
	                        	H.index.type =3;
	                        	H.index.nowCountdown(H.index.pra[H.index.roundIndex]);
	                        	return;
	                        }else{
	                        	H.index.type = 2
	                        	H.index.index++
	                        	H.index.nowCountdown(H.index.pra[H.index.index]);
	                        	return;
	                        }
                      	}       
                    },
                    sdCallback :function(){

                    }
                });
            });
        },
        change:function(){
        	$("#stage_index .index-btn").addClass("none");	
 			$(".time-tip").html("关注下期玩游戏抽大奖");
 			$(".time").removeClass("none");
        },
		startGame: function(value){
			//播放音频
			H.index.$stage.addClass('none');
		    $('#stage_main').removeClass('none');
			this.$bgm[0].play();
			//是第一次玩还是重玩，第一次玩
			if(!this.isRestart){
				this.isRestart = true;
				
				setTimeout(function(){
			        H.index.game = new Game();
		            H.index.game.start({
		                maxScore:value,
		              	endCallBack:function(score){
		              		H.index.endGame(score);
		                },
		                failCallBack:function(score){
		              		H.index.failGame(score);
		                }
		            });
			    },1000);
			//重玩
			}else{
				H.index.game.reStart({
					maxScore:value
				});
			}
		},

		restartGame: function(){
			this.isRestart = true;
			H.index.startGame(400);
		},

		endGame: function(score){
			this.lastScore = score;
			$(".score").html(this.lastScore);
			$('#bgm').get(0).pause();
			if(H.index.lastScore > banlanceScroe){
				H.win.show(score);
			}else{
				H.lost.show();
			}
		},

		failGame: function(score){
			this.lastScore = score;
			$('.crop-animate-wrapper .crop').removeClass('valid').css({
				'-webkit-transform': 'translate(0px,-0px)',
				'background-image': 'url(./images/icon-corn-disabled.png)'
			});
			H.index.$stage.append($('.crop-animate-wrapper .crop')[0]);
			H.index.$stage.append($('.crop-animate-wrapper .crop')[0]);
			$('#bgm').get(0).pause();
			H.lost.show();
		},
		show: function(){
			this.$stage.removeClass('none');
			this.$stage.animate({opacity: 1}, 1300, 'ease');
		},

		resize: function(){
			var width = $(window).width();
			var height = $(window).height();
			var originWidth = 640;
			var originHeight = 1009;
			var xRatio = originWidth / width;
			var yRatio = originHeight / height;

			this.$stages.css({
				'width': width,
				'height': height
			});

			$('.stage-item').each(function(){
				var width = $(this).attr('data-width') / xRatio;
				var height = $(this).attr('data-height') / yRatio;
				$(this).css({
					'left' : $(this).attr('data-left') / xRatio,
					'top' : $(this).attr('data-top') / yRatio,
					'width' : width,
					'height' : height
				});
				if($(this).attr('data-src')){
					$(this).css({
						'background-image' : 'url(' + $(this).attr('data-src') + ')' ,
						'background-size': width+ 'px ' + height + 'px'
					});
				}
			});

			this.$stage.css({
				'background-image': 'url(./images/g-bg.jpg)',
				'background-size': width+ 'px ' + height + 'px'
			});
			var ticketHeight = H.win.$ticket.css('height');
			H.win.$ticket.css('line-height', ticketHeight);

			$('#stage_main').css({
				'width': width,
				'height': height,
				'background-image' : 'url(./images/bg-game.jpg)' ,
				'background-size': width+ 'px ' + height + 'px'
			});

			this.show();
		},

		bindBtns: function(){
			this.$play.tap(function(){
				$.fn.cookie('round-'+H.index.pra[H.index.roundIndex].ud,"flag", {expires: 1 })
				H.index.startGame(40);
				H.index.stopGame && clearTimeout(H.index.stopGame);
			});
			$('#btn-lottery').tap(function(){
				var sn = new Date().getTime()+'';
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				if(H.index.wxCheck){
					$.ajax({
		                type : 'GET',
		                async : false,
		                url : domain_url + 'api/lottery/luck'+dev,
		                data: { oi: openid , sn : sn},
		                dataType : "jsonp",
		                jsonpCallback : 'callbackLotteryLuckHandler',
		                timeout: 10000,
		                complete: function() {
		                	sn = new Date().getTime()+'';
		                	$('#btn-lottery').removeClass("requesting")
		                	$('.award-box').removeClass('none');
		                	$(".lottery-box").addClass("none");
		                },
		                success : function(data) {
		                    if(data.result){
		                        if(data.sn == sn){
		                            H.win.update(data);
		                        }else{
		                        	H.win.thanks();
		                        }
		                    }else{
		                        H.win.thanks();
		                    }
		                },
		                error : function() {
		                    sn = new Date().getTime()+'';
		                    H.win.thanks();
		                }
		            });
				}else{
					sn = new Date().getTime()+'';
					$('#btn-lottery').removeClass("requesting");
					H.win.thanks();
				}
	           
			});			
			$('#game-back').tap(function(){
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				setTimeout(function(){
					$('#game-back').removeClass("requesting")
				},1000);
   			    toUrl("index.html");
			});
			$('.lost-close').tap(function(){
				H.index.close();
			});
			$('.close').tap(function(){
				H.index.close();
				H.win.reset();
			});
			$('#btn-getQuan').tap(function(){
			    if($(this).hasClass("requesting")){
                    $(this).text("领取中");
                    return;
				}
                $(this).addClass("requesting");
				if(H.win.pt == 7){
					shownewLoading(); 
					H.index.close();
				    H.win.reset();
				    H.index.sto = setTimeout(function(){
				    // 因为有一定几率会出现 拉起微信卡券页面无反应的情况，所以在点击领取之后的15秒后如果还没有拉起页面 则 hideloadding 并且 可以让其继续摇奖。
					    $('#btn-getQuan').removeClass("requesting");
					    hidenewLoading();
					},15000);
                    H.index.wxCheck = false;
                    setTimeout(function(){
                     	H.win.wx_card();
                     	$('#btn-getQuan').removeClass("requesting");
                	},1000);
                }else if(H.win.pt == 9){
                    getResult('api/lottery/award', {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname
	                }, 'callbackLotteryAwardHandler');
	                setTimeout(function(){
	                	shownewLoading();
	                    window.location.href = $('#btn-getQuan').attr("data-href");
	                    $('#btn-getQuan').removeClass("requesting");
	                },500);
                }else if(H.win.pt == 4){
                	shownewLoading();
                	window.location.href = $('#btn-getQuan').attr("data-href");
	                $('#btn-getQuan').removeClass("requesting");
                }
			});
			$('#btn-getGoods').tap(function(){
				if(!H.win.check()){
					return;
				};
				getResult('api/lottery/award', {
                        oi: openid,
                        hi: headimgurl,
                        nn: nickname,
                        ph: H.win.mobile,
                        rn : H.win.name,
                        ad : H.win.address
	            }, 'callbackLotteryAwardHandler');
	            showTips("信息提交成功")
	            $("#input-box").find("input").attr("disabled","disabled");
                $(this).addClass("none");
                $(".input-box-tips").html("以下是您的联系方式")
                $("#btn-back").removeClass("none");
			});
		},
		close : function(){
			H.index.show();
   			$("#stage_main").addClass("none");
		    $(".time").removeClass("none"); 
		    $(".play-btn").addClass("none");
		    $('.dialog-wrapper').addClass('none');
		}
	};

	H.win = {
		$dialog: $('#win_dialog'),
		$error: $('#error_dialog'),
		$ticket: $('#win_dialog .ticket'),
		$tt: $('#win_dialog .tt'),
		$pd: $('#win_dialog .pd'),
		pt:"",
		ci:"",
		ts:"",
		si:"",
		name:"",
		mobile:"",
		address:"",
		show: function(data){
			$('#bgm').get(0).pause();
			$('.scroe').html(data);
			$(".award-box").addClass("none");
            $(".lottery-box ").removeClass("none");
            $("#lost_dialog").addClass("none");
			this.$dialog.removeClass('none');
		},

		collectError: function(){
			this.$error.find('.scroe').html(H.index.lastScore);
			this.$error.removeClass('none');
		},

		collect: function(score){
			var rangeStr = "";
			var awardIndex = 0;
			if(score >= 100 && score <= 199 ){
				rangeStr = "100-199";
			}else if(score >= 200 && score <= 299){
				rangeStr = "200-299";
			}else{
				rangeStr = "300-399";
			}
			for(var i in H.index.awardList){
				if(H.index.awardList[i].tp == rangeStr){
					awardIndex = i;
				}
			}
			if(H.index.awardList[awardIndex]){
				getResult('api/lottery/collect',{
					oi : openid,
					pu : H.index.awardList[awardIndex].id
				},'callbackLotteryCollectHandler');
			}else{
				this.collectError();
			}
		},

		thanks: function(){
			$(".lottery-box").addClass("none");
			$(".award-box").removeClass("none")
			$("#dialog-win").addClass('none')
			$('#dialog-thanks').removeClass('none');
		},
		update :function(data){
    			var me = this;
				 H.win.pt = data.pt;
				if(data.pt!== 0){
					if(data.pt == 2||data.pt == 1){//积分奖品和实物奖品
						$("#dialog-shiwu .award-img").attr("src",data.pi).removeClass("none").attr("onerror","$(this).addClass(\'none\')");
						$("#dialog-shiwu").find('#name').val(data.rn || '');
						$("#dialog-shiwu").find('#phone').val(data.ph || '');
						$("#dialog-shiwu").find('#address').val(data.ad || '');
                    	$("#dialog-shiwu").find("#btn-getGoods").removeClass("none");
                    	$("#dialog-shiwu").find("#btn-back").addClass("none");
                    	$("#dialog-shiwu").find("input").removeAttr("disabled"); 
                    	$("#dialog-win").addClass("dialog-shiwu");
                        $("#dialog-quan").addClass("none");
                        $("#dialog-shiwu").removeClass("none");
					}else if(data.pt == 9||data.pt == 7||data.pt == 4){//外链奖品
						if(data.pt === 7){
   							me.ci = data.ci;
			                me.ts = data.ts;
			                me.si = data.si;
   						}
   						if(data.pt === 9){
   							$("#dialog-quan").find('#btn-getQuan').attr('data-href',data.ru);
   						}
   						if(data.pt === 4){
   							$("#dialog-quan").find('#btn-getQuan').attr("data-href",data.rp)
   						}
						$("#dialog-quan").find(".award-img").attr("src",data.pi).removeClass("none").attr("onerror","$(this).addClass(\'none\')");
                    	$("#dialog-quan").removeClass("none");
                        $("#dialog-shiwu").addClass("none");
					}
					$("#dialog-win").removeClass("none");
					$("dialog-thanks").addClass("none")
				}else{
					 H.win.thanks();
				}
					 
					
		},
		  wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.win.ci,
                        cardExt: "{\"timestamp\":\""+ H.win.ts +"\",\"signature\":\""+ H.win.si +"\"}"
                    }],
                    success: function (res) {
                        H.index.wxCheck = true;
                        getResult('api/lottery/award', {
                            oi: openid,
                            hi: headimgurl,
                            nn: nickname
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        recordUserOperate(openid, res.errMsg, "tv-hbnm-mow-card-fail");
                        hidenewLoading();
                    },
                    complete:function(){
                        H.index.sto && clearTimeout(H.index.sto);
                        hidenewLoading();
                    },
                    cancel:function(){
                        hidenewLoading();
                    }
                });
            },
        check:function(){
            var me = this;
            var $mobile = $('.phone'),
                mobile = $.trim($mobile.val()),
                $address = $('.address'),
                address = $.trim( $address.val()),
                $name = $('.name'),
                name = $.trim($name.val());
            if (name.length > 20 || name.length == 0) {
                showTips('请填写您的姓名，以便顺利领奖！');
                return false;
            }else if (!/^\d{11}$/.test(mobile)) {
                showTips('请填写正确手机号！');
                return false;
            }else if (address.length <5) {
                showTips('请填写详细地址！');
                return false;
            }
            me.name = name;
            me.mobile = mobile;
            me.address = address;
            return true;
        },
        reset :function(){
        	$('#btn-lottery').removeClass("requesting");
        	$(".dialog-lottery").find(".btn-lottery").removeClass("requesting");
        	$(".dialog-lottery").find("input").removeAttr("disabled");
        	$(".dialog-lottery").find(".award-img").attr("src","");
        	$(".input-box-tips").html("正确填写信息，以便工作人员顺利联系到您 ");
        	$("#dialog-shiwu").find("#btn-getGoods").removeClass("none").removeClass("requesting");
            $("#dialog-shiwu").find("#btn-back").addClass("none").removeClass("requesting");
            $("#dialog-quan").find('#btn-getQuan').attr("data-href","").removeClass("requesting");
            $("#dialog-shiwu").addClass("none");  
            $("#dialog-quan").addClass("none");
            $(".dialog-wrapper").addClass("none");
            $(".award-box").addClass("none");
            $(".lottery-box ").addClass("none");
            $("#dialog-win").addClass("none").removeClass("dialog-shiwu");
            $("#dialog-thanks").addClass("none");
        }
	};

	H.lost = {
		
		$dialog: $('#lost_dialog'),
		show: function(){
			$('#bgm').get(0).pause();
			$("#win_dialog").addClass("none");
			this.$dialog.removeClass('none');
		}
	};

	W.callbackLotteryLuckHandler = function(data){

		
	};
	// 领取积分
	W.callbackLotteryAwardHandler = function(data){
		
		
	};

	H.loading.init();
	wx.ready(function () {
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.index.isError){
                    H.index.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.index.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });

})(Zepto);