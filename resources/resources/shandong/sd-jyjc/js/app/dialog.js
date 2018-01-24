(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        redpack: '',
        iscroll: null,
        isJump:true,
        voiceFlag: true,
        pt: null,
        ad:null,
        isgr:"",
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                me.close();
            })
        },
        close: function() {
            $('.modal').addClass('none');
        },
        open: function(data) {
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl(data));
                H.dialog.$container.append(this.$dialog);
            }
            H.dialog.relocate();
        },
        relocate : function(){
        	var height = $(window).height(),
        		width = $(window).width(),
        		top = $(window).scrollTop();
            $('.dialog').each(function() {
                $(this).css({ 
                    'width': width, 
                    'height': height, 
                    'left': 0,
                    'top': 0
                });
            });
        },
		guide: {
			$dialog: null,
			open: function () {
				var me = this;
				H.dialog.open.call(this);
				this.event();
				setTimeout(function() {
					me.close();
				}, 5000);
				var winW = $(window).width(),
					winH = $(window).height();
				var guideW = Math.round(winW * 0.82);
				var guideH = Math.round(guideW * 627 / 456);
				var guideT = Math.round((winH - guideH) / 2);
				$('#guide-dialog .dialog').css({
					'width': guideW,
					'height': guideH,
					'left': Math.round((winW - guideW) / 2),
					'top': guideT+50
				});
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				$('.guide-dialog').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog">')
						._('<img src="./images/guide-bg.jpg">')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				var winW = $(window).width(),
					winH = $(window).height();
				var ruleW = Math.round(winW * 0.94);
				var ruleH = Math.round(ruleW * 789 / 700);
				var ruleT = Math.round((winH - ruleH) / 2)+20;
				$('#rule-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
				$('body').addClass('noscroll');
				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog border-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="js-lizhi-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮">关闭</a>')
						._('<div class="rule-box">')
							._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		/**关注微信**/
		gzwx:{
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
			LOTTERY_NONE_CLS: 'lottery-none',
			open: function() {
				H.dialog.open.call(this);
				this.event();
				this.scroll_enable();
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+20;
				$('#gzwx-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
				$('#gzwx-dialog .btn-close').css({
					'right': Math.round((winW - ruleW) / 2)+10,
					'top': ruleT-30
				});
				
			},
			scroll_enable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.enable();
				}
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.$dialog && me.$dialog.remove();
					me.$dialog = null;
					var href = window.location.href;
					href = delQueStr(href,"uuid");
					href = delQueStr(href,"rp");
					window.location.href = href;
					
					
				});
			},
			tpl:function(){
				var t = simpleTpl();
				t._('<section class="modal" id="gzwx-dialog">')
					._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="yg-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮">关闭</a>')
					._('<div class="dialog wx-dialog" style="background-color:none;">')
						._('<div class="dialog-inner">')
						._('<div style="height: 100%">')
							._('<div style=" margin:3%;height:85%;padding-left:5px;">')
							
							._('<div class="content ">')
								 ._('<div class="lottery-box" id="lottery-box">')
								   	._('<img src="./images/jsmvwx.png"/> ')
								 ._('</div>')
								 ._('<div style="text-align: center;color:white;">长按二维码，关注公众号，等待小编与你联系</div>')
								._('</div>')
							._('</div>')
						._('</div>')
						._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			},
		},
		/** 红包领取回调 **/
		rptip:{},
		//抢红包
		redpaperImg:{},
		
		chediandian:{},
		
		duihuanma:{
			$dialog: null,
			ci:null,
			ts:null,
			si:null,
			open: function(data) {
				H.dialog.open.call(this,data);
				this.event(data);
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+70;
				$('#rp-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH*0.8,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
				H.lottery.isCanShake = true;
			},
			event: function(data) {
				var me = this;
				
				this.$dialog.find('.card-btn-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					me.close();
				});
				
				
				$('#getDHM').click(function(e){
					e.preventDefault();
					 if ($('#dhmphone').val().trim() == "") {
                        showTips("请填写手机号码！");
                        return false;
                    };
                    if (!/^\d{11}$/.test($('#dhmphone').val())) {
                        showTips("这手机号，可打不通...");
                        return false;
                    };
                    
                    var keysInfo = '91quible4lfwm0za';
                    var cdk = data.cc;
                    var usermobile = $('#dhmphone').val().trim();
                    var type='yaotv';
                    var timestampInfos = new Date().getTime();
                  //  var signInfos = hex_md5(usermobile+""+cdk+""+type+""+timestampInfos+""+keysInfo);
                  //  window.location.href = data.ru+"?mobile="+usermobile+"&cdk="+cdk+"&timestamp="+new Date().getTime()+"&type="+type+"&sign="+hex_md5(usermobile+cdk+type+new Date().getTime()+'91quible4lfwm0za');
                    
                    
	                    $.ajax({
								type: "get",
								async: !1,
								url: data.ru,
								data:{'mobile':usermobile,'cdk':cdk,'timestamp':new Date().getTime(),'type':type,'sign':hex_md5(usermobile+cdk+type+new Date().getTime()+'91quible4lfwm0za')},
								dataType: "jsonp",
								jsonp: "callback",
								jsonpCallback: "callbackGameHandler",
								success: function() {},
								error: function() {}
						});
                    
					
				})
			},
			tpl: function(data) {
				var t = simpleTpl();
				
				
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog rule-dialog border-dialog card-diolg">')
						._('<a href="#" class="card-btn-close" data-collect="true" data-collect-flag="js-lizhi-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮">关闭</a>')
						
						._('<div class="card-box card-info">')
							._('<div class="card-name">'+data.pn+'</div>')
							
							._('<div class="card-img dmh"><img src="'+data.pi+'"/></div>')
							._('<div class="dhm-phone"><input type="tel" id="dhmphone" maxlength="11" class="cddphone" placeholder="请输入手机号" value="'+(data.ph||"")+'"></div>')
							._('<div class="getCard" id="getDHM"  data-collect="true" data-collect-flag="ah-cdd-get-duihuanma" data-collect-desc="领取兑换码" >立即领取</div>')
							._('<div class="getCard none" id="lj-use"  data-collect="true" data-collect-flag="ah-cdd-get-duihuanma" data-collect-desc="领取兑换码" >立即使用</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		noprize:{
			$dialog: null,
			open: function(data) {				
				H.dialog.open.call(this,data);
				this.event(data);
				H.lottery.isCanShake = false;
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
					H.lottery.isCanShake = true;
			},
			event: function(data) {
				console.log(data);
				var me = this;
				this.$dialog.find('.btn-close2').click(function(e) {
					e.preventDefault();
					me.close();
						H.lottery.isCanShake = true;
				});
				$("#noprize-award").click(function(){
					me.close();
					$(".noprize-award").unbind("click");
				});
				$("#tiaozhuan").click(function(){
					getResult('api/lottery/award', {	//新接口领奖
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid
					}, 'callbackLotteryAwardHandler');
					me.close();
					window.location.href=data.ru;
				});
			},
			tpl: function(data) {

				var t = simpleTpl();
					t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog11 ">')						
						._('<div class="rp-content">')
							._('<div class="dis_img"><img src="'+data.pi+'"></div>')
							._('<div class="btn-close2"><img src="./images/close.png"></div>')
							._('<div class="collect submitBtn11" style="background-color:#d62b1f;" id="tiaozhuan" data-collect="true" data-collect-flag="js-hhyx-index-noprize" data-collect-desc="皇后游戏-谢谢参与按钮">立即体验</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		
		cardInfo:{
			$dialog: null,
			ci:null,
			ts:null,
			si:null,
			open: function(data) {
				H.dialog.open.call(this,data);
				this.event();
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+70;
				$('#rp-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH*0.8,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
				H.lottery.isCanShake = true;
			},
			event: function() {
				var me = this;
				
				this.$dialog.find('.card-btn-close').click(function(e) {
					e.preventDefault();
					H.lottery.isCanShake = true;
					me.close();
				});
				
				
				$('#getCard').click(function(e){
					e.preventDefault();
					if(!$('#getCard').hasClass("flag")){
					$('#getCard').text("领取中");
					$('#getCard').addClass("flag");
					   showLoading(); // 点击领取之后 出现loadding
					   W['to']  =  setTimeout(function(){
					    // 因为有一定几率会出现 拉起微信卡券页面无反应的情况，所以在点击领取之后的15秒后如果还没有拉起页面 则 hideloadding 并且 可以让其继续摇奖。
					    H.index.isCanShake = true; // 如果是摇一摇抽奖形式， 用来限制是否可以摇动。true：可以，false：不行。
					    hideLoading();
					   },15000);
					   
					   me.close();
						H.lottery.isCanShake = false; // 不能摇动。
						//H.lottery.wxCheck = false; 
						
						setTimeout(function(){
							
						H.lottery.wx_card({ci:H.dialog.cardInfo.ci,ts:H.dialog.cardInfo.ts,si:H.dialog.cardInfo.si});
					},1000);
					}
				})
			},
			tpl: function(data) {
				var t = simpleTpl();
				H.dialog.cardInfo.ci = data.ci;
				H.dialog.cardInfo.ts = data.ts;
				H.dialog.cardInfo.si = data.si;
				
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog rule-dialog border-dialog card-diolg">')
						._('<a href="#" class="card-btn-close" data-collect="true" data-collect-flag="js-lizhi-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮">关闭</a>')
						/*._('<h1>恭喜你中奖啦！！</h1>')*/
						._('<div class="card-box card-info">')
							._('<div class="card-name">'+data.pn+'</div>')
							/*._('<div class="card-name">恭喜您获得玛萨玛索满200减100优惠券</div>')*/
							._('<div class="card-img"><img src="'+data.pi+'"/></div>')
							/*._('<div class="card-img"><img src="./images/ces.jpg"/></div>')*/
							._('<div class="getCard" id="getCard" data-cookie='+data.id+' data-cookie-time="'+data.pd+'" data-collect="true" data-collect-flag="ah-cdd-get-card" data-collect-desc="领取卡券" >立即领取</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		tongcheng:{	//同城旅游
			$dialog: null,
			open: function(data) {
				H.dialog.open.call(this,data);
				H["currentData"]=data;	//同城data
				this.event();
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+20;
				$('#rp-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
			},
			event: function(data) {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				$("#tc_promptly").unbind("click").click(function(){
					var data=H["currentData"];
					
					
					getResult('api/lottery/award', {	//新接口领奖
						oi: openid
					}, 'callbackLotteryAwardHandler');
					
					window.location.href = data.ru;
				});
			},
			update: function(rule) {},
			tpl: function(data) {
				var t = simpleTpl();
				var pv = data.pv/100;
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog ">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv_sdtv_jczm-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<p class="open-cdd">'+data.tt+'</p>')
						._('<div class="rp-content">')
							._('<img src="'+data.pi+'" style="width: 125%;margin-top: 20%;">')
							._('<span class="cdd-dialog-cont none">')
								._('<div class="cdd-dialog-div"><input type="tel" id="cddphone_" class="cddphone" value="'+(data.ph||"")+'"></div>')
							._('</span>')
							._('<a class="collect cdd-btn-submit" data-cookie='+data.id+' data-cookie-time="'+data.pd+'"  data-collect="true" data-collect-flag="ah-cdd-get-card" data-collect-desc="同城旅游领取" style="background-color:#fdc728;margin-top:20%" id="tc_promptly">立即领取</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		
		wobaifu:{	//沃百富
			$dialog: null,
			open: function(data) {
				H.dialog.open.call(this,data);
				H["currentData"]=data;	//沃百富
				this.event();
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+20;
				$('#rp-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
			},
			event: function() {
				var data=data;
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				$("#wb_promptly").unbind("click").click(function(){
					var data=H["currentData"];
					var $mobile = $("#cddphone");
					var mobile = $.trim($("#cddphone").val())||'';
//					if (!mobile) {//手机号码
//						showTips("请填写手机号码！");
//						$mobile.focus();
//						return false;
//					}
//					if (!/^\d{11}$/.test(mobile)) {//手机号码格式
//						showTips("这手机号，可打不通...！");
//						$mobile.focus();
//						return false;
//					}
					getResult('api/lottery/award', {	//新接口领奖
						ph : mobile,
						oi: openid
					}, 'callbackLotteryAwardHandler');
					var pz =data.aw;
					var timestamp = new Date().getTime();
					var channel = 76;
					var md5SignValue = H.dialog.lottery.getPaySignType(mobile,pz,channel,timestamp);
					me.close();
					window.location.href =data.ru+"?mobile="+mobile+"&value="+pz+"&channel="+channel+"&timestamp="+timestamp+"&sign="+md5SignValue;
					return;
					
					var data=W["data-hb"];
					location.href=data.rp; //跳转页面
					me.close();
				});
			},
			update: function(rule) {},
			tpl: function(data) {
				var t = simpleTpl();
				var pv = data.pv/100;
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog ">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv_sdtv_jczm-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<p class="open-cdd">恭喜您中了'+data.pn+data.aw+'</p>')
						._('<div class="rp-content">')
							._('<img src="'+data.pi+'" style="width: 65%;margin-top: 13%;">')
							._('<span class="cdd-dialog-cont">')
								._('<div class="cdd-dialog-div"><input type="tel" id="cddphone" class="cddphone none" value="'+(data.ph||"")+'"></div>')
							._('</span>')
							._('<span class="collect cdd-btn-submit" style="background-color:#fdc728;margin-top:100px" id="wb_promptly">立即领取</span>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		
		
		tiantiantaojin:{	//天天淘金
			$dialog: null,
			open: function(data) {
				H.dialog.open.call(this,data);
				this.event(data);
				var winW = $(window).width(),
				winH = $(window).height();
				var ruleW = Math.round(winW * 0.85);
				var ruleH = Math.round(ruleW * 789 / 598)+50;
				var ruleT = Math.round((winH - ruleH) / 2)+20;
				$('#rp-dialog .dialog').css({
					'width': ruleW,
					'height': ruleH,
					'left': Math.round((winW - ruleW) / 2),
					'top': ruleT
				});
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
			},
			toShakeConis:function(data){
				var mobile = data.mobile;
				var pz = data.pv||data.aw;
				var timestamp = new Date().getTime();
				var md5SignValue = H.dialog.lottery.tttjSignType(data.mobile,0,pz,data.pn,data.aa,timestamp);
                $.ajax({
                    type: "get",
                    async: false,
                    url:data.ru,
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "callbackTttjAppScoreHandler",
                    data: {
                        phoneNum: mobile,
                        score: pz,
                        type: 0,
                        name:data.pn,
                        source: data.aa,
                        timestamp: timestamp,
                        sign:md5SignValue,
                        jsonp:true
                    },
                    success:function(data){
                         if(data.code=="GOOD"){
                           window.location.href="wangxin.html?pv="+pz+"&ph="+mobile+"&ru="+data.url+"&tp=1";
                         }else{
                           alert(data.content);
                         }
                    }
                });
			},
			toTeaConis:function(data){
				var phoneNum = data.mobile;
				var score = data.pv||data.aw;
				var getType = 5;
				var getDescripe = data.aa;
				var md5SignValue = H.dialog.lottery.teaSignType(phoneNum,score,getType,getDescripe);
                $.ajax({
                    type: "get",
                    async: false,
                    url:data.ru,
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "callbackTttjAppScoreHandler",
                    data: {
                    	phoneNum: phoneNum,
                    	score: score,
                    	getType: getType,
                    	getDescripe:getDescripe,
                    	sign:md5SignValue,
                    	jsonp:true
                    },
                    success:function(data){
                         if(data.code=="GOOD"){
                        	 window.location.href="wangxin.html?pv="+score+"&ph="+phoneNum+"&ru=http://a.app.qq.com/o/simple.jsp?pkgname=com.tea.activity"+"&tp=2";
                         }else{
                           alert(data.content);
                         }
                    }
                });
			},
			event: function(data) {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				$("#tj_promptly").unbind("click").click(function(){
				//===================================================
						var $tttjphone=$("#tttjphone");
						var mobile = $tttjphone.val();
						if(mobile == "" || mobile == undefined || mobile==null){
							showTips('手机号码不能为空...');
							return false;
						}else if (!/^\d{11}$/.test(mobile)) {
							showTips('这手机号，可打不通...');
							$tttjphone.focus();
							return false;
						}
						
						var name = data.rn? data.rn:'';
	                	var ad = data.ad? data.ad:'';
	                		data.mobile = mobile;
						getResult('api/lottery/award', {
							oi: openid,
							rn:encodeURIComponent(name),
							ad:encodeURIComponent(ad),
							ph: mobile
					    }, 'callbackLotteryAwardHandler', true, null,true);	
						if(data.pn.indexOf("茶")>=0){
							me.toTeaConis(data);
						}else{
							me.toShakeConis(data);
						}
				//===================================================	
				});
			},
			update: function(rule) {},
			tpl: function(data) {
				var t = simpleTpl();
				var pv = data.pv/100;
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog ">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv_sdtv_jczm-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<p class="open-cdd">'+data.tt+'</p>')
						._('<div class="rp-content">')
							._('<img src="'+data.pi+'" style="width: 65%;margin-top: 6%;">')
							._('<span class="cdd-dialog-cont">')
								._('<div class="cdd-dialog-div"><input type="tel" id="tttjphone" maxlength="11" class="cddphone" placeholder="请输入手机号" value="'+(data.ph||"")+'"></div>')
							._('</span>')
							._('<a class="collect cdd-btn-submit" data-cookie="'+data.id+'" data-cookie-time="'+data.pd+'" data-collect="true" data-collect-flag="sd-jyjc" data-collect-desc="抽奖弹层-领奖按钮"  style="background-color:#fdc728;" id="tj_promptly">立即领取</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
        lottery: {
			$dialog: null,
			open: function() {
				H.lottery.isCanShake = false;
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				};
				var winW = $(window).width(),
					winH = $(window).height();
				var lotteryW = Math.round(winW * 0.94);
				var lotteryH = Math.round(lotteryW * 789 / 598);
				var lotteryT = Math.round((winH - lotteryH) / 2);
				$('#lottery-dialog .dialog').css({
					'width': lotteryW,
					'height': lotteryH,
					'left': Math.round((winW - lotteryW) / 2),
					'top': lotteryT
				});
				$('#lott').removeClass('success');
				$('.lott .win-info').removeClass('none');
				$('.lott input').removeClass('none');
				$('#btn-award').removeClass('none');
				$('#btn-back').addClass('none');
				$('.lott .win-care').addClass('none');
				$('label.input-name span').text('');
				$('label.input-phone span').text('');
				$('label.input-address span').text('');
			},
			close: function() {
				H.lottery.isCanShake = true;
				H.dialog.voiceFlag = true;
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},
			getPaySignType:function(mobile,pz,channel,timestamp){
				var key =  "91quible4lfwm0za";
				var sign = mobile+""+pz+""+channel+""+timestamp+""+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			tttjSignType: function(mobile, type, score, name, source, timestamp){
				var key = "az0mwfl4elbiuq19";
				var sign = mobile+""+type+""+score+""+name+""+source+""+timestamp+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			teaSignType: function(phoneNum, score, getType, getDescripe){
				var key = "ncnqooervhdkafskuiencv";
				var sign = phoneNum+""+score+""+getType+""+getDescripe+""+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			lotteryConfirm: function() {
				var me = this, lotteryConfirm = confirm('您的奖品还没有领取!');
				if(lotteryConfirm == true) {
					return;
				} else {
					me.close();
				};
			},
			event: function() {
				var me = this, closeFlag = 0, hostVoice = document.getElementById("host-voice");
				this.$dialog.find('.lotterys-close').click(function(e) {
					e.preventDefault();
					if($("#not-lott").hasClass("none")){
						if (closeFlag == 0) {
							showTips("您的奖品还没有领取~检查下吧!");
							closeFlag++;
							return;
						} else {
							me.close();
							return;
						};
					}else{
						me.close();
					}
					
					// me.lotteryConfirm();
				});
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('#btn-award').click(function(e) {
					e.preventDefault();
					if ($('#textname').val().trim() == "") {
	               		showTips("请填写姓名！");
	                	return false;
		            };
		            if ($('#textphone').val().trim() == "") {
		               showTips("请填写手机号码！");
		                return false;
		            };
		            if (!/^\d{11}$/.test($('#textphone').val())) {
		                showTips("这手机号，可打不通...");
		                return false;
		            };
		            if ($('#textaddress').val().length < 5 || $('#textaddress').val().length > 60) {
	                    showTips("地址长度应在5到60个字！");
	                    return false;
	                };
	                
	                
	                var name = $.trim($('#textname').val()),
	                	mobile = $.trim($('#textphone').val()),
						address = $.trim($('#textaddress').val());
					$('label.input-name span').text(name);
					$('label.input-phone span').text(mobile);
					$('label.input-address span').text(address);
					getResult('api/lottery/award', {
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
				this.$dialog.find('#btn-cd-award').click(function(e) {
                    e.preventDefault();
                    if ($('#textname-code').val().trim() == "") {
                        showTips("请填写您的姓名！");
                        return false;
                    };
                    if ($('#textphone-code').val().trim() == "") {
                        showTips("请填写手机号码！");
                        return false;
                    };
                    if (!/^\d{11}$/.test($('#textphone-code').val())) {
                        showTips("这手机号，可打不通...");
                        return false;
                    };
                    var mobile = $.trim($('#textphone-code').val());
                    var cname = $.trim($('#textname-code').val());
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        oi: openid,
                        rn: encodeURIComponent(cname),
						ph: mobile,
						ad: encodeURIComponent(H.dialog.ad)
                    }, 'callbackLotteryAwardHandler', true, me.$dialog);
				});
                this.$dialog.find('#btn-back').click(function(e) {
					e.preventDefault();
					me.close();
				});
				this.$dialog.find('.host-sound-click').click(function(e) {
					e.preventDefault();
					if (H.dialog.voiceFlag) {
						H.dialog.voiceFlag = false;
						hostVoice.addEventListener('ended', function () {
							$('.host-voice').removeClass('play');
							$('.host-voice').get(0).pause();
							$('.host-voice').get(0).currentTime = 0.0;
							$('.host-sound-icon').removeClass('ani-sound');
						}, false);
					};
					if ($('.host-voice').hasClass('play')) {
						$('.host-voice').removeClass('play');
						$('.host-voice').get(0).pause();
						$('.host-voice').get(0).currentTime = 0.0;
						$('.host-sound-icon').removeClass('ani-sound');
					} else {
						$('.host-voice').addClass('play');
						$('.host-voice').get(0).play();
						$('.host-sound-icon').addClass('ani-sound');
					};
				});
				this.$dialog.find('.host-sound-icon').click(function(e) {
					e.preventDefault();
					if (H.dialog.voiceFlag) {
						H.dialog.voiceFlag = false;
						hostVoice.addEventListener('ended', function () {
							$('.host-voice').removeClass('play');
							$('.host-voice').get(0).pause();
							$('.host-voice').get(0).currentTime = 0.0;
							$('.host-sound-icon').removeClass('ani-sound');
						}, false);
					};
					if ($('.host-voice').hasClass('play')) {
						$('.host-voice').removeClass('play');
						$('.host-voice').get(0).pause();
						$('.host-voice').get(0).currentTime = 0.0;
						$('.host-sound-icon').removeClass('ani-sound');
					} else {
						$('.host-voice').addClass('play');
						$('.host-voice').get(0).play();
						$('.host-sound-icon').addClass('ani-sound');
					};
				});
			},
			success: function() {
				$('#lott').addClass('success');
				$('.lott .win-info').addClass('none');
				$('.lott input').addClass('none');
				$('#btn-award').addClass('none');
				$('#btn-back').removeClass('none');
				$('.lott .win-care').removeClass('none');
                $("#lott-code").find(".win-tips").removeClass("none");
                $("#lott-code").find(".win-info").removeClass("none");
			},
			tpl: function() {
				var state = getRandomArbitrary(2, 4);
				switch(state) {
					case 1:
						var tpl = simpleTpl();
			            if(hostList.length >0){
			                var i = Math.floor((Math.random()*hostList.length));;
			                var host = hostList[i];
			            };
			            if (host == 'hh' || host == 'lh' || host == 'ly') {
			            	var hostaudio = '';
			            	var none = 'none';
			            	var notips = 'notips';
			            	var soundimg = '';
			            } else {
			            	var hostaudio = '<audio preload="auto" id="host-voice" class="host-voice host-' + host + '-voice" src="images/host-' + host + '-voice.mp3" class="preload"></audio><div class="host-sound-icon"></div>';
			            	var none = '';
			            	var notips = '';
			            	var soundimg = 'host-sound-click';
			            };
			            tpl._(hostaudio)
							._('<img class="host-img host-' + ' ' + soundimg + '" src="./images/host/' + host + '.jpg">')
							._('<p class="' + none + '"><img src="./images/lottery-tips.png"></p>')
							._('<a href="#" class="lottery-close" id="' + notips + '"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
						break;
					case 2:
						var tpl = simpleTpl();
			            if(joyList.length >0){
			                var i = Math.floor((Math.random()*joyList.length));;
			                var joy = joyList[i];
			            };
			            tpl._('<div class="happyjs"><img src="./images/joy-bg.png"><p>' + joy + '</p></div>')
							._('<a href="#" class="lottery-close" id="notips"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
						
						break;
					default:
						var tpl = simpleTpl();
			            if(helpList.length >0){
			                var i = Math.floor((Math.random()*helpList.length));;
			                var help = helpList[i];
			            };
			            tpl._('<div class="happyjs"><img src="./images/help-bg.png"><p>' + help + '</p></div>')
							._('<a href="#" class="lottery-close" id="notips"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
				};
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog border-dialog">')
					._('<a href="#" class="lotterys-close" data-collect="true" data-collect-flag="js-lizhi-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮">关闭</a>')
						._('<div class="not-lott" id="not-lott">')
							._(noneLottTPL)
						._('</div>')
						._('<div class="lott none" id="lott">')
							._('<img class="win-img" src="">')
							._('<p class="win-tips"></p>')
							._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
							._('<p class="win-care none"></p>')
							._('<div class="input-box"><label class="input-name"><img src="./images/icon-name.png"><i>姓名:</i><span></span></label>')
							._('<input name="" type="text" id="textname" placeholder="请输姓名" class="text-a" /></div>')
							._('<div class="input-box"><label class="input-phone"><img src="./images/icon-phone.png"><i>电话:</i><span></span></label>')
							._('<input name="" type="number" id="textphone" placeholder="请输入正确电话" class="text-a" /></div>')
							._('<div class="input-box input-box-address"><label class="input-address"><img src="./images/icon-address.png"><i>地址:</i><span></span></label>')
							._('<input name="" type="text" id="textaddress" placeholder="请输入正确的地址" class="text-a" /></div>')
							._('<a class="btn-award" id="btn-award" data-collect="true" data-collect-flag="js-lizhi-combtn" data-collect-desc="抽奖弹层-确定按钮">确&nbsp;定</a>')
							._('<a class="btn-back none" id="btn-back" data-collect="true" data-collect-flag="js-lizhi-combtn" data-collect-desc="抽奖弹层-确定按钮">返&nbsp;回</a>')
						._('</div>')
                        ._('<div class="lott none" id="lott-code">')
                            ._('<img class="win-img" src="">')
                            ._('<p class="win-tips"></p>')
                            ._('<p class="win-info">请填写您的联系方式，以便顺利领奖</p>')
                            ._('<p class="win-care none"></p>')
                            ._('<div class="input-box"><label class="input-name"><img src="./images/icon-name.png"><i>姓名:</i><span></span></label>')
                            ._('<input name="" type="text" id="textname-code" class="text-a" /></div>')
                            ._('<div class="input-box"><label class="input-phone"><img src="./images/icon-phone.png"><i>电话:</i><span></span></label>')
                            ._('<input name="" type="number" id="textphone-code" class="text-a" /></div>')
                            ._('<div class="code-box none">')
                                ._('<p class="tip-info">请截屏此页，需凭此码兑换票券</p>')
                                ._('<p class="code-info">兑奖码:<span id="d-code"></span></p>')
                            ._('</div>')
                            ._('<a class="btn-award" id="btn-cd-award" data-collect="true" data-collect-flag="js-lizhi-cd-combtn" data-collect-desc="抽奖弹层-兑换码确定按钮">获&nbsp;取</a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="js-lizhi-usebtn" data-collect-desc="抽奖弹层-兑换码使用">立即使用</a>')
                        ._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
                H.dialog.pt = data.pt;
                if(data && data.result == true && data.pt >= 1 ){
	            	$(".lott a[data-collect='true']").attr('data-cookie',data.id);
	            }
				if(data && data.result == true && data.pt == 1 ){
                    $('#lottery-dialog').removeClass('lottery-no');
				    $("#lott").find(".win-img").attr("src",data.pi);
				    $("#lott").find(".win-tips").html(data.tt);
//				    $("#lott").find(".win-care").html(data.pd);
					$("#lott").find('#textname').val(data.rn || '');
					$("#lott").find('#textphone').val(data.ph || '');
					$("#lott").find('#textaddress').val(data.ad || '');
					this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
				}else if(data&& data.result == true&&data.pt == 0){
                    H.lottery.thank_times++;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html(data.tt);
					this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				}else if(data&& data.result == true&&data.pt == 5){
					H.dialog.ad = typeof(data.ad)=='undefined' ?'':data.ad;
                    $('#lottery-dialog').removeClass('lottery-no');
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $("#lott-code").find(".win-tips").html(data.tt);
//                  $("#lott-code").find(".win-care").html(data.pd);
					$("#lott-code").find('#textphone-code').val(data.ph || '');
					$("#lott-code").find('#textname-code').val(data.rn || '');
                    $("#d-code").text(data.cc);
                    $("#lott-code").find("#btn-use").attr("href", data.ru);
					$("#lott-code").find(".input-box").removeClass("none");
//                  $("#lott-code").find(".input-box").css("visibility","hidden");
                    $("#lott-code").find(".code-box").addClass("none");
//                  $("#lott-code").find(".win-info").addClass("none");
                    $("#lott-code").find("#btn-cd-award").attr("href",data.ru+"?cd="+data.cc);
                    this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").removeClass("none");
                }else if(data&& data.result == true&&data.pt == 2){
					H.dialog.ad = typeof(data.ad)=='undefined' ?'':data.ad;
                    $('#lottery-dialog').removeClass('lottery-no');
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $("#lott-code").find(".win-tips").html(data.tt);
//                  $("#lott-code").find(".win-care").html(data.pd);
					$("#lott-code").find('#textphone-code').val(data.ph || '');
					$("#lott-code").find('#textname-code').val(data.rn || '');
                    $("#d-code").text(data.cc);
                    $("#lott-code").find("#btn-use").attr("href", data.ru);
					$("#lott-code").find(".input-box").removeClass("none");
//                  $("#lott-code").find(".input-box").css("visibility","hidden");
                    $("#lott-code").find(".code-box").addClass("none");
//                  $("#lott-code").find(".win-info").addClass("none");
                    $("#lott-code").find("#btn-cd-award").attr("href",data.ru+"?cd="+data.cc);
                    this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").removeClass("none");
                }else{
					H.dialog.isJump = false;
                    $('#lottery-dialog').addClass('lottery-no');
					$("#not-lott").find(".win-tips").html("<span></span>");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find("#not-lott").removeClass("none");
				};
			}
		},

    };
    
    W.callbackGameHandler = function(data){
    	
		
		if(data.code == 0){
			$('#getDHM').html("已领取")	;
			$('.dhm-phone').attr("readonly",'readonly');
			/*setTimeout(function(){H.dialog.duihuanma.close()},5000);	*/
		getResult('api/lottery/award', {
			nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
			hi: headimgurl ? headimgurl : "",
			oi: openid,
			}, 'callbackLotteryAwardHandler', false);
			showTips("领取成功！！");
					 
					 $('#getDHM').addClass('none');
			$('#lj-use').removeClass('none').click(function(){
				window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wandao.huanghou';
			});
					 
		}else{
				showTips(data.mes);
		}
							
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			
			if(W.dataPt==7){
				return false;
			}else{
			
			
            if(H.dialog.pt == 5){/*
                $("#lott-code").find(".win-tips").addClass("none");
                $("#lott-code").find(".win-info").addClass("none");
                $("#lott-code").find(".input-box").addClass("none");
                $("#lott-code").find(".code-box").removeClass("none");
                $("#btn-cd-award").addClass("none");
                $("#btn-use").removeClass("none");
            */}else{
                H.dialog.lottery.success();
            }
			return;
			
			
			}
			
		} else {
			showTips('亲，服务君繁忙~ 稍后再试哦!');
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
