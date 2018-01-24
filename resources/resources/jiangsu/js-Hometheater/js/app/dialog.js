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
        ph:null,
        rn:null,
        init: function() {

            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                me.close();
            })
            this.$container.delegate('.btn-close1', 'click', function(e) {
                e.preventDefault();
                me.close();
            })
        },
        close: function() {
            $('.modal').addClass('none');
            H.dialog.isCanShake=true;
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
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 -30, 'top': top-45});
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': top,
					'bottom': height * 0.06
				});
				$('.rank-carat').css('height', height*0.88 - 100);
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
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
				t._('<section class="modal" id="guide-dialog">')
					._('<div class="dialog guide-dialog border-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="js-lizhi-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h1>参与剧情竞猜赢大奖</h1>')
						._('<div class="guide-img"><img src=images/circle.png></div>')
						
						._('<div class="guide-list"><ul><li><label>1</label>锁定安微卫视每周三晚21点15分</li><li><label>2</label>进入微信摇一摇（电视）</li><li><label>3</label>对着电视摇一摇</li><li><label>4</label>参与竞猜就有机会赢取超值产品</li></ul></div>')
						._('<a href="#" class="guide_btn" alt="" data-collect="true" data-collect-flag="guide_btn" data-collect-desc="现在就去试试">现在就去试试</a>')
							
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
				
				$('body').addClass('noscroll');
				getResult('api/common/rule', {dev:'hsl-jtjc'}, 'commonApiRuleHandler', true, this.$dialog);
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
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="js-lizhi-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h1>活动规则</h1>')
						._('<div class="rule-box">')
							._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		shareTopic: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				var winW = $(window).width(),
					ruleDH = this.$dialog.height(),
					ruleW = $('.rule-dialog').width()-60;
				var ruleH = Math.ceil(810 * ruleW / 523);
				var ruleTop = Math.ceil((ruleDH - ruleH) / 2);
				var ruleRight = Math.ceil((winW - ruleW) / 2);
				$('.rule-dialog').css({'height': ruleH, 'top': ruleTop});
				$('#rule-dialog .btn-close').css({'top': ruleTop-10,'right': ruleRight-40});
				$('body').addClass('noscroll');
				this.event();
			},
			close: function() {
				$('body').removeClass('noscroll');
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
			},
			event: function() {
				
				var me = this;
				
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				
				$('#share-topic-btn').click(function(e) {
					//发表话题
					var title = $(".share-con").val();
					if(title=="" || title.length<=0){
						showTips("请输入您的育儿心得");
						return;
					}
					if(openid==null || openid==""){
						showTips("亲,只有授权用户<br/>才可以发表育儿心得哦");
						return;
					}
					
					if(headimgurl==null || headimgurl==""){
						showTips("亲,只有授权用户<br/>才可以发表育儿心得哦");
						return;
					}
					if(nickname==null || nickname==""){
						showTips("亲,只有授权用户<br/>才可以发表育儿心得哦");
						return;
					}
					if( title.length<20){
						showTips("亲,您的育儿心得内容少于20个字哦");
						return;
					}
					
					window.callbackTwoSessionsAddTopic = function(data) {
						if (data.code == 0) {
							var title = $(".share-con").val() ;
							var headimgurl = $.fn.cookie(mpappid + '_headimgurl');
							var t = simpleTpl();
							t._('<li class="no-border">')
								._('<a class="cnt-left">')
									._('<img src="'+headimgurl+"/"+yao_avatar_size+'">')
								._('</a>')
								._('<div class="cnt-right">')
									._('<a class="nickname">'+nickname+'</a>')
									._('<div class="topic" id="msg-'+data.uuid+'" data-id="'+data.uuid+'">')
										._('<div class="words">'+title+'</div>')
										._('<div class="imgs imgs-col-0"></div>')
										._('<div class="ctrl">')
											._('<a href="#" class="btn-zan ">')
												._('<i></i>')
												._('<span>0</span>')
											._('</a>')
											._('<a href="#" class="btn-cmt c-box">')
												._('<i></i>')
												._('<span>0</span>')
											._('</a>')
										._('</div>')
										._('<div class="comments none">')
											._('<ul></ul>')
											._('<a href="comments.html?tid='+data.uuid+'" class="btn-more">更多-5条回复...</a>')
										._('</div>')
									._('</div>')
								._('</div>')
							._('</li>')
							$(".topics").prepend(t.toString());
							title = title.length > 25?(title.substring(0,25)+"......"):title;
//							window.location.href="talk.html?st=true&stuuid="+data.uuid+"&tle="+title;
							window['shaketv'] && shaketv.wxShare(headimgurl+"/"+yao_avatar_size, nickname+"分享育儿心得",title, H.talk.getShareUrl(data.uuid));
							H.dialog.shareTopic.close();
							return;
						}
					};
					getNewResult({
						url: 'twosessions/topic/add',
						data: {
							openid:openid,
							wxnick:encodeURIComponent(nickname),
							wxhead:headimgurl+"/"+yao_avatar_size,
							title: encodeURIComponent(title),
							dev:'wzz-superchild'
						}, 
						loading: true, 
						jsonpCallback: ' callbackTwoSessionsAddTopic',
						success: function(data) {
						
						}
						
					});
				
				});
				
				
				
				
				
			},
			update: function(rule) {
//				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="js-lizhi-ruledialog-closebtn" data-collect-desc="分享弹层-关闭按钮"></a>')
				._('<div class="dialog rule-dialog border-dialog">')
					._('<h1>和大家一起分享心得</h1>')
					._('<div class="rule-box" style="height: 85%;">')
						._('<textarea class="share-con" placeholder="请填写您的育儿心得"></textarea>')
						._('<div class="share-topic-btn" id="share-topic-btn">发表我的育儿心得</div>')
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
		rptip:{
			$dialog: null,
			open: function(msg,data) {
				H.dialog.open.call(this,msg,data);
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
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				$("#rptip-award").click(function(){
					me.close();
					$(".rptip-award").unbind("click");
//					H.dialog.gzwx.open();
				});
			},
			tpl: function(msg,data) {
				var t = simpleTpl();
					t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog1">')						
						._('<div class="rp-content">')
							._('<div class="dis_img"><img src="./images/gongxi.png"></div>')
							._('<div class="btn-close1 none"><img src="./images/close.png"></div>')
							._('<div class="collect submitBtn" style="background-color:#d62b1f;" id="rptip-award">继续摇奖</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		//抢红包
		redpaperImg:{
			$dialog: null,
			open: function(data) {
				console.log(data);
				
				W["data-hb"]=data;
				H.dialog.open.call(this,data);
				this.event(data);


				
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
					H.lottery.isCanShake = true;
			},
			event: function(data) {
				var me = this;
				 $('.jiu').removeClass("an-rollin");
				this.$dialog.find('.btn-close1').click(function(e) {
					e.preventDefault();
					me.close();
					H.lottery.isCanShake = true;
				});
				$("#promptly").click(function(){
					console.log(data);
					if (data.pt == 4) {
						location.href=data.rp; //跳转页面
					}
					me.close();
					$(".promptly").unbind("click");
				});
				
				
			},
			update: function(rule) {
			},
			tpl: function(data) {
				var t = simpleTpl();
				t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog1">')						
						._('<div class="rp-content">')
							._('<div class="dis_img"><img src="'+data.pi+'"></div>')
							._('<div class="btn-close1"><img src="./images/close.png"></div>')
							._('<div class="collect submitBtn" style="background-color:#d62b1f;" id="promptly">立即领取</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
			
		hh:{
			$dialog: null,
			open: function(data) {
				H.dialog.pn1=data.pn;
				H.dialog.pi1=data.pi;
				H.dialog.open.call(this,data);
				this.event(data);
				
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
					H.lottery.isCanShake = true;
			},
			event: function(data) {
				var me = this;
				$('.jiu').removeClass("an-rollin");
				this.$dialog.find('.btn-close3').click(function(e) {
					e.preventDefault();
					me.close();
						H.lottery.isCanShake = true;
				});
					console.log(data);
					
				$("#lq").click(function(){
					/*var data=W["data-hb"];*/
					getResult('api/lottery/award', {	//新接口领奖
						nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
						hi: headimgurl ? headimgurl : "",
						dev:"hsl-jtjc",
						oi: openid
					}, 'callbackLotteryAwardHandler');
					if(data.ph=="" || data.ph==null|| typeof(data.ph)=="undefined"){
								location.href=data.ru; //跳转页面
					}else{
						window.location.href =data.ru+"?mobile="+data.ph;
					}
					return;
					
					me.close();
					$(".promptly").unbind("click");
				});
			},
			update: function(rule) {
				//this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				/*var data=W["data-hb"];*/
				var t = simpleTpl();
			
				t._('<section class="modal" id="rp-dialog">')
					t._('<div class="dialog open-rptip-dialog ">')						
						t._('<div class="rp-content">')
							t._('<div class="dis_img"><img src="'+H.dialog.pi1+'"></div>')								
							t._('<div class="btn-close3"><img src="./images/close.png"></div>')
							t._('<div class="collect submitBtn" style="background-color:#d62b1f;" id="lq">立即领取</div>')
						t._('</div>')
					t._('</div>')
				t._('</section>');
				return t.toString();
			}
		},
			/** 未中奖 **/
		noprize:{
			$dialog: null,
			open: function(msg,data) {
				H.dialog.open.call(this,msg,data);
				this.event();
				H.lottery.isCanShake = false;
			},
			close: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog=null;
					H.lottery.isCanShake = true;
			},
			event: function() {
				var me = this;
				$('.jiu').removeClass("an-rollin");
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
					me.close();
					window.location.href="http://mall.chinayanghe.com/m";
				});
			},
			tpl: function(msg,data) {
				var t = simpleTpl();
					t._('<section class="modal" id="rp-dialog">')
					._('<div class="dialog open-rptip-dialog ">')						
						._('<div class="rp-content">')
							._('<div class="dis_img"><img src="./images/wzj.png"></div>')
							._('<div class="btn-close2"><img src="./images/close.png"></div>')
							._('<div class="collect submitBtn" style="background-color:#d62b1f;" id="tiaozhuan">立即前往</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		tiantiantaojin:{	//天天淘金
			$dialog: null,
			open: function(data) {
				H.lottery.isCanShake =false ;
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
				H.lottery.isCanShake = true;
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
				var getType = 10;
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
							._('<img src="'+data.pi+'" style="width: 65%;margin-top: 49%;">')
							._('<span class="cdd-dialog-cont">')
								._('<div class="cdd-dialog-div"><input type="tel" id="tttjphone" maxlength="11" placeholder="电话" class="cddphone" value="'+(data.ph||"")+'"></div>')
							._('</span>')
							._('<span class="collect cdd-btn-submit" style="background-color:#fdc728;" id="tj_promptly">立即领取</span>')
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
			lotteryConfirm: function() {
				var me = this, lotteryConfirm = confirm('您的奖品还没有领取!');
				if(lotteryConfirm == true) {
					return;
				} else {
					me.close();
				};
			},
			getPaySignType:function(mobile,pz,channel,timestamp){
				var key =  "91quible4lfwm0za";
				var sign = mobile+""+pz+""+channel+""+timestamp+""+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			teaSignType: function(phoneNum, score, getType, getDescripe){
				var key = "ncnqooervhdkafskuiencv";
				var sign = phoneNum+""+score+""+getType+""+getDescripe+""+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
			},
			tttjSignType: function(mobile, type, score, name, source, timestamp){
				var key = "az0mwfl4elbiuq19";
				var sign = mobile+""+type+""+score+""+name+""+source+""+timestamp+key;
				var md5SignValue = hex_md5(sign).toUpperCase();
				return md5SignValue;
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
						ad: encodeURIComponent(address),
						dev:'wzz-superchild'
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
			            tpl._('<div class="happyjs"><img src="./images/help-bg.png"><p class="wenzi">' + help + '</p></div>')
							._('<a href="#" class="lottery-close" id="notips"><img src="./images/lottery-btn.png"></a>')
						var noneLottTPL = tpl.toString();
				};
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog border-dialog">')
					._('<a href="#" class="lotterys-close" data-collect="true" data-collect-flag="js-lizhi-lott-dialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="not-lott" id="not-lott">')
							._(noneLottTPL)
						._('</div>')
						._('<div class="lott none" id="lott">')
							._('<h1>恭喜您中奖啦</h1>')
							._('<p class="lott-tip"></p>')
							._('<div class="back">')
								._('<div class="award-title"><p>您中到了<span></span>一瓶</p></div>')
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
						._('</div>')
                        ._('<div class="lott none" id="lott-code">')
                        	._('<h1>恭喜您中奖啦</h1>')
							._('<p class="lott-tip"></p>')
							._('<div class="back">')
							._('<div class="award-title"><p>您中到了<span></span>一张</p></div>')
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
                            ._('<a class="btn-award none" id="btn-cd-award" data-collect="true" data-collect-flag="js-lizhi-cd-combtn" data-collect-desc="抽奖弹层-兑换码确定按钮">获&nbsp;取</a>')
                            ._('<a class="btn-award none" id="btn-tc-award" data-collect="true" data-collect-flag="js-movie-tc-combtn" data-collect-desc="抽奖弹层-同城旅游确定按钮">获&nbsp;取</a>')
                            ._('<a class="btn-back none" id="btn-use" data-collect="true" data-collect-flag="js-lizhi-usebtn" data-collect-desc="抽奖弹层-兑换码使用">立即使用</a>')
                            ._('<a class="btn-award none" id="btn-cdd-award" data-collect="true" data-collect-flag="ah-cdd-awad" data-collect-desc="抽奖弹层-车点点确定按钮">确定</a>')
                        ._('</div>')
					  ._('</div>')
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
				data = is_undefined_null(data);
                H.dialog.pt = data.pt;
				if(data && data.result == true && data.pt == 1 ){
					$('.award-title span').html(data.pn);
                    $('#lottery-dialog').removeClass('lottery-no');
				    $("#lott").find(".win-img").attr("src",data.pi);
				    $("#lott").find(".win-tips").html(data.tt);
				    $("#lott").find(".win-care").html(data.pd);
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
				}else if(data&& data.result == true&&data.pt == 9){//车点点
					this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    this.$dialog.find("#lott-code").removeClass("none");
                    $("#lott-code").find("#btn-cdd-award").removeClass("none");
                    $("#lott-code").find(".input-box").eq(0).addClass("none");
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $('.award-title').html("您中到了<span>"+data.pn+"</span>一张</p>");
                    $("#btn-cdd-award").click(function(e) {
						var $kjph = $("#textphone-code");
						var kjph = $.trim($("#textphone-code").val());
						if (!kjph) {//手机号码
							showTips("请填写手机号码！");
							$kjph.focus();
							return false;
						}
						if (!/^\d{11}$/.test(kjph)) {//手机号码格式
							showTips("这手机号可打不通...");
							$kjph.focus();
							return false;
						}
						getResult('api/lottery/award', {
							oi: openid,
							rn:encodeURIComponent(H.dialog.cname),
							ad:encodeURIComponent(H.dialog.ad),
							ph: kjph
					    }, 'callbackLotteryAwardHandler', true, null,true);	
						var pz =data.aw;
						var timestamp = new Date().getTime();
						var channel = 74;
						var md5SignValue = H.dialog.lottery.getPaySignType(kjph,pz,channel,timestamp);
						window.location.href =data.ru+"?mobile="+kjph+"&value="+pz+"&channel="+channel+"&timestamp="+timestamp+"&sign="+md5SignValue;
					});

                    
                }else if(data&& data.result == true&& data.pt == 3){//车点点
                	var name = data.rn? data.rn:nickname;
                	var ph = data.ph? data.ph:'';
                	var ad = data.ad? data.ad:'';
					this.$dialog.find("#not-lott").addClass("none");
                    this.$dialog.find("#lott").addClass("none");
                    $(".win-info").addClass("none");
                    this.$dialog.find("#lott-code").removeClass("none");
                    $("#lott-code").find("#btn-tc-award").removeClass("none");
                    $("#lott-code").find(".input-box").addClass("none");
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $('.award-title').html("您中到了<span>"+data.pn+"</span>一份</p>");
                    
                    $("#btn-tc-award").click(function(e) { 
                    	
						getResult('api/lottery/award', {
							oi: openid,
							rn:encodeURIComponent(name),
							ad:encodeURIComponent(ad),
							ph: ph
					    }, 'callbackLotteryAwardHandler', true, null,true);	
						window.location.href =data.ru;
					});

                 }else if(data&& data.result == true&&data.pt == 5){
					H.dialog.ad = typeof(data.ad)=='undefined' ?'':data.ad;
                    $('#lottery-dialog').removeClass('lottery-no');
                    $("#lott-code").find(".win-img").attr("src",data.pi);
                    $("#lott-code").find(".win-tips").html(data.tt);
                    $("#lott-code").find(".win-care").html(data.pd);
					$("#lott-code").find('#textphone-code').val(data.ph || '');
					$("#lott-code").find('#textname-code').val(data.rn || '');
                    $("#d-code").text(data.cc);
                    $("#lott-code").find("#btn-use").attr("href", data.ru);
					$("#lott-code").find(".input-box").removeClass("none");
//                  $("#lott-code").find(".input-box").css("visibility","hidden");
                    $("#lott-code").find(".code-box").addClass("none");
//                  $("#lott-code").find(".win-info").addClass("none");
                    $("#lott-code").find("#btn-cd-award").removeClass("none");
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
    
    W.commonApiRuleHandler = function(data) {
    	console.log(data);
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		
		if (data.result) {
            if(H.dialog.pt == 5){
                $("#lott-code").find(".win-tips").addClass("none");
                $("#lott-code").find(".win-info").addClass("none");
                $("#lott-code").find(".input-box").addClass("none");
                $("#lott-code").find(".code-box").removeClass("none");
                $("#btn-cd-award").addClass("none");
                $("#btn-use").removeClass("none");
            }else{
                H.dialog.lottery.success();
            }
			return;
		} else {
			showTips('亲，服务君繁忙~ 稍后再试哦!');
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
