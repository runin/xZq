(function($) {
	
	/** 语音播放**/
	H.audio ={
		$audio : null,
		$pages: $('#pages'),
		audioEventListener : function(e){  
			 $audio.addEventListener(e,function(){  
			 }); 
    	},
		play:function(src){
			$audio = new Audio();
			$audio.src =src;
			/**$audio.loop=true;**/
			H.audio.audioEventListener("ended");
			$audio.play();
		},
		pause:function(){
			$audio.pause();
		},
		replay:function(){
			$audio.play();
		},
		to: function(guid) {
			var width = $(window).width(),
				$pages = this.$pages.find('.page'),
				index = $pages.index('[data-guid="'+ (guid || 0) +'"]');
			
			index = index > -1 ? index : 1;
			var $page = $('.page').eq(index);
			if (index == 0 || $page.hasClass('none')) {
				return;
			}
			$pages.removeClass('current');
			$page.addClass('current');
			this.$pages.css("-webkit-transform", "matrix(1, 0, 0, 1, -" + (index * width) + ", 0)");
			window.curPage = index;
		}
		
	};
	/** 填写信息 **/
	H.award ={
		$awardClose:$("#award-close"),
		$award_message:$("#award-message"),
		is_dbclick:false,
		init : function(){
			$("#award-confirm").click(function(){
				if(!H.award.is_dbclick){
					H.award.is_dbclick =true;
					H.award.awardConfirm();
				}
				setTimeout(function(){
					H.award.is_dbclick =false;
				},500);
			});
			$("#award-close").click(function(){
				H.award.closeAward();
			});
		},
		closeAward:function(){
			H.lottery.awardMessage(false);
		},
		checkInfo:function(){
			var awardName = $('#awardname');
		    var awardTelphone = $("#award-telphone");
		    var awardAddress = $("#award-address");
			var $test = /^1\d{10}$/;
			if(awardName.val().trim()=="" ){
				alert("请输入姓名");
				return false;
			}else if(awardTelphone.val()=="" ){
				alert("请输入手机号码");
				return false;
			}else if($test.test(awardTelphone.val()) == false){
				alert("请输入正确的手机号");
				return false;
			}else{
				return true;
			}
		},
		confirmInfo:function(){
			
		},
		awardConfirm:function(){
			var res = H.award.checkInfo();
			if(res){
				H.lottery.award_flag = false;
				$("#pack-gift-btn span").text("去打包贺礼");
				getResult('ceremony/award', {
					oi: openid,
					ph: $("#award-telphone").val(),
					rn: $('#awardname').val(),
					ad: $("#award-address").val()
				}, 'callbackAwardHandler');
			}
		}
	}
	H.lottery = {
		count: 2,
		openid :openid,
		award: getQueryString('award'),
		soi:getQueryString('soi'),
		sn:getQueryString('sn'),
		lottery_rate:3,
		award_flag:true,
		expires: {expires: 7},
		forjoin:null,
		init : function(){
			if(this.openid ==""){/**非法进入**/
				H.lottery.lineChange(false);
			}
			else if(this.soi=="" || this.sn ==""){/**摇进入**/
				/**4s后跳转抽奖页面**/
				H.audio.play("http://cdn.holdfun.cn/ahtv/audios/bgmusic.mp3");
				setTimeout(function(){
					H.audio.to(2);
				},this.award ? 20 : 4000);
				H.lottery.shake();
			}
			else if(this.soi!="" && this.sn !=""){/**分享进入**/
				H.audio.to(2);
				H.lottery.share();
			}
			H.index.parallaxinit();
			getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			/**每五秒请求参与人数**/
			forjoin  = setInterval(function() {
				getResult('log/servicepv/'+ serviceNo, {}, 'callbackCountServicePvHander');
			}, 5000);
			
			$("#wait-try-btn").click(function(e){
				$(this).parent().parent().addClass("none");
				$("#pages").removeClass("disabled");
			});
		},
		joincount:function(data){
			$("#person-join-count strong").text(data.c);
		},
		shake:function(){/*摇一摇*/
			H.lottery.lineChange(true);
		},
		share:function(){
			$("#lottery-message").removeClass("none");
			$("#pages").addClass("disabled");
			H.lottery.lineChange(true);
		},
		rate: function() {
			var random = parseInt(Math.random() * 100) + 1;
			return parseInt(H.lottery.lottery_rate) >= random;
		},
		drawlottery:function(){
			var flag = H.lottery.rate();
			var is_award = $.fn.cookie("result-max"+this.openid);
			var award_step = 2;
			if(parseInt(is_award)==1){
				award_step = 2;/** 最高奖**/
				flag = false;
			}
			
			if(this.soi!="" && this.sn!=""){ /**分享**/
				$.fn.cookie("result-type-"+this.openid+"-"+this.soi+"-"+this.sn,'share',this.expires); /** 主动分享账号-明星号 只允许一次 **/
			}else{/**摇**/
				$.fn.cookie("result-type-"+this.openid,'shake',this.expires);
			}
			if(flag){
				//请求是否真正中奖
				getResult('ceremony/lottery', {oi:this.openid}, 'callbackLotteryHandler');
				
				/**
				H.lottery.phonePrize(true);
				$("#pack-gift-btn").click(function(){
					if(H.lottery.award_flag){
						H.lottery.awardMessage(true);
					}else{
						window.location.href="starlist.html";	
					}
				})**/
			}else{
				var random = parseInt(Math.random() * 4)+2;
				H.lottery.virtualPrize(true,random);
				$.fn.cookie("result-"+this.openid,random,this.expires);
				$("#pack-gift-btn").click(function(){
					window.location.href='stars.html';
				})
			}
		},
		
		awardMessage:function(flag){
			if(flag){
				$("#award-message").removeClass("none");
				$("#award-close").removeClass("none");
				$("#pages").addClass("disabled");
				H.award.init();
			}else{
				$("#award-message").addClass("none");
				$("#award-close").addClass("none");
				$("#pages").removeClass("disabled");
			}
		},
		lineChange:function(flag){
			if(flag){
				H.index.appentHTML_("page-2",'<section class="draw-line" id="draw-line">'+
                  '<img src="./images/bg_sz.png" class="draw-line-image" id="draw-line-image">'+
				  '<div class="sz-click" id="sz-click" ><div/>'+
              '</section>'+
			  '<section class="to-draw-light" id="to-draw-light">'+
				  '<img src="./images/ah_sz_light.png" class="to-draw-light-image">'+	
			  '</section>');
				H.myScroll.init();
			}else{
				$("#person-join-count").addClass("none");
				$("#word").remove();
				$("#draw-line").remove();
				$("#to-draw-light").remove();
				$("#to-draw").remove();	
			} 
		},
		lineClick:function(){
			$("#draw-line-image").css("-webkit-animation-name","clickcurtain");
			$("#draw-line-image").css("-webkit-animation-duration","1s");
			$("#draw-line-image").css("-webkit-animation-fill-mode","forwards");
			$("#sz-click").css("bottom","4%");

		},
		scrollLottery:function(){
			window.clearInterval(forjoin);
			if(H.lottery.soi!="" || H.lottery.sn!=""){//分享进入
				var share_soi_sn = $.fn.cookie("result-type-"+H.lottery.openid+"-"+H.lottery.soi+"-"+H.lottery.sn);
				if(share_soi_sn =="" || share_soi_sn ==null){ /** 没有分享此明星**/
					H.lottery.drawlottery();
					H.pullCurtain.draw();
				}else{
					/*好友明星组已经抽奖,显示最后一次的奖品*/
					H.lottery.showPrize();
					return false;
				}
			}else{
				var result = $.fn.cookie("result-"+H.lottery.openid);
				var result_type = $.fn.cookie("result-type-"+H.lottery.openid);
				if(parseInt(result)>0 && result_type=="shake"){
					H.lottery.showPrize();
					return false;
				}else{
					H.lottery.drawlottery();
					H.pullCurtain.draw();
				}
			}
		},
		phonePrize:function(flag,prurl,pn){
			if(flag){
				prurl = prurl =="" || prurl ==null ? "http://cdn.holdfun.cn/ahtv/images/ah_iphone.png" : prurl;
				pn = pn =="" || pn == null ? "iPhone6":pn;
				H.index.appentHTML_("page-2","<section class='congratulations-word' id='congratulations-word'>"+
											"<span>"+
												"<p>&nbsp;&nbsp;&nbsp;&nbsp;恭喜你,</p>"+
												"<p>你获得"+pn+"一部</p>"+
											"</span>"+
									"</section>"+
									"<section class='shadow-img' id='shadow-img'>"+
											"<img src='"+prurl+"' class='iphone-image'>"+	
									"</section>"+
									"<section class='pack-gift-btn' id='pack-gift-btn'>"+
											"<span><p>去领奖</p></span>"+
									"</section>"+
									"<section class='pack-gift-word' id='pack-gift-word'>"+
											"<span>"+
											"<p>和明星一起去送贺礼，</p>"+
											"<p>小伙伴有机会得到iPhone6哦！</p>"+
											"</span>"+
								  "</section>");
				H.lottery.lineChange(false);
			}else{
				$("#congratulations-word").remove();
				$("#pack-gift-btn").remove();
				$("#pack-gift-word").remove();
			}
		},
		virtualPrize:function(flag,rm){
			if(flag){
				//alert(virtualDatas[0].message);
				
				H.index.appentHTML_("page-2","<section class='congratulations-word' id='congratulations-word'>"+
											"<span>"+virtualDatas[rm-2].message+"</span>"+
									"</section>"+
									"<section class='vartual-prize-img' id='vartual-prize-img'>"+
									 "<img src='"+virtualDatas[rm-2].priurl+"' class='congratulations-word-image'>"+
							"</section>"+
									"<section class='pack-gift-btn' id='pack-gift-btn'>"+
											"<span><p>去打包贺礼</p></span>"+
									"</section>"+
									"<section class='pack-gift-word' id='pack-gift-word'>"+
											"<span>"+
											"<p>和明星一起去送贺礼，</p>"+
											"<p>小伙伴有机会得到iPhone6哦！</p>"+
											"</span>"+
								  "</section>");
				H.lottery.lineChange(false);
			}else{
				$("#congratulations-word-false").remove();
				$("#pack-gift-btn").remove();
				$("#pack-gift-word").remove();
			}
		},
		showPrize:function(){
			$.fn.cookie("result-"+H.lottery.openid) == 1 ? H.lottery.phonePrize(true,'','') : H.lottery.virtualPrize(true,$.fn.cookie("result-"+H.lottery.openid));							
			H.pullCurtain.draw();
			$("#pack-gift-btn span").text("去打包贺礼");
			$("#pack-gift-btn").click(function(){
					window.location.href='stars.html';
			});
		},
		update: function(data) {
			if(data.result){
				$.fn.cookie("result-"+this.openid,1,this.expires);
				$.fn.cookie("result-max"+this.openid,1,this.expires);/** 最高奖品 **/
				H.lottery.phonePrize(true,data.pp,data.pn);
				$("#pack-gift-btn").click(function(){
					if(H.lottery.award_flag){
						H.lottery.awardMessage(true);
					}else{
						window.location.href='stars.html';	
					}
				})
			}else{
				var random = parseInt(Math.random() * 4)+2;
				$.fn.cookie("result-"+this.openid,random,this.expires);
				H.lottery.virtualPrize(true,random);
					$("#pack-gift-btn").click(function(){
						window.location.href='stars.html';
				})
			}
		},
		awardPrize:function(data){
			if(data.result>0){
				alert("信息提交成功,我们会尽快和您联系");
			}else if(data.result<=0){
			}
			H.lottery.awardMessage(false);
		}
	}
	
	H.index = {
		init: function() {
			H.utils.resize();
			this.parallaxinit();
			
			W['shaketv'] && shaketv.subscribe(shaketv_token, function(returnData){
				console.log(returnData.errorMsg);
			});
		},
		appentHTML_:function(_id,_html){
			$("#"+_id+"").append(_html);
		},
		parallaxinit :function(){
			$('.pages').parallax({
				direction: 'horizontal', 	// vertical (垂直翻页)
				swipeAnim: 'default', 	// cover (切换效果)
				drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,		// 有无加载页
				indicator: false,		// 有无指示点
				arrow:     false,		// 有无指示箭头
				onchange: function(index, element, direction) {},
				orientationchange: function(orientation) {
					// console.log(orientation);
				}
			});
		}
	};
	
	H.myScroll = {
			startX:0,//触摸时的坐标
			startY:0,
			 x:0, //滑动的距离
			 y:0,
			 aboveY:0, //设一个全局变量记录上一次内部块滑动的位置 
			 is_move:false,
		init:function(){
			document.getElementById("sz-click").addEventListener('touchstart', this.touchSatrt,false);  
			document.getElementById("sz-click").addEventListener('touchmove', this.touchMove,false);  
			document.getElementById("sz-click").addEventListener('touchend', this.touchEnd,false);
		},
		 touchSatrt:function(e){//触摸
				$("#pages").addClass("disabled");
                e.preventDefault();
                var touch=e.touches[0];
                startY = touch.pageY;   //刚触摸时的坐标              
         },
         touchMove:function(e){//滑动
			e.preventDefault();
			var touch = e.touches[0];
			y = touch.pageY - startY;// 滑动的距离
			this.is_move = true;
			y = y > 45 ? 45 : y;
			y = y < 0 ? 0 : y;
			$("#sz-click").css("bottom", 20 - y / 3 + "%");
			$("#draw-line-image").css("bottom", 20 - y / 3 + "%");
         },
         touchEnd:function(e){//手指离开屏幕
			$("#pages").removeClass("disabled");
			if (!this.is_move) {

				H.lottery.lineClick();
			}
			e.preventDefault();
			H.lottery.scrollLottery();
         },
	};
	
	H.pullCurtain = {
		draw:function(){
			$("#left_lm").css("-webkit-animation-name","drawcurtain");
			$("#left_lm").css("-webkit-animation-duration","2s");
			$("#left_lm").css("-webkit-animation-fill-mode","forwards");
			$("#right_lm").css("-webkit-animation-name","drawcurtain");
			$("#right_lm").css("-webkit-animation-duration","2s");
			$("#right_lm").css("-webkit-animation-fill-mode","forwards");
			setTimeout(this.drawLine,500);		 
		},
		drawLine : function(){/** 文字渐渐显示效果**/
			$("#congratulations-word").css("z-index",'12');
			$("#pack-gift-btn").css("z-index",'122');
			$("#pack-gift-word").css("z-index",'122');
			$("#congratulations-word-false").css("z-index",'122');
		}
	}
	
	
	H.weixin = {
		init: function() {
			$(document).wx({
				"img_url" : share_img,
		        "desc" : share_desc,
		        "title" : share_title
			});
		}
	};
	
	H.utils = {
		$main: $('#main'),
		$shadow:$(".shadow"),
		$indexmain:$(".index-main"),
		$lottery_message:$("#lottery-message"),
		$award_close : $("#award-close"),
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'images/bg.png';
			
			this.$main.css('minHeight', height).css('height', height);
			this.$shadow.css('width', width-90).css('height', width-90).css("margin-left",45);
			this.$indexmain.css('minHeight', height).css('height', height);
			this.$award_close.css('top',height*0.02).css('right', height*0.04);
			$("#award-message").css('width', width*0.8).css('height',height* 0.8).css("margin-left",width*0.1);	
			//showLoading();
			if(height < 600){
				this.$lottery_message.css('width', 234).css('height', 270).css("margin-left",(width-234)/2).css('margin-top', (height-270)/2);
			}else{
				this.$lottery_message.css('width', 234).css('height', 270).css("margin-left",(width-234)/2).css('margin-top', (height-200)/2);
			}

		}
	};
	/**抽奖**/
	W.callbackLotteryHandler = function(data){
		H.lottery.update(data);
	}
	
	/**领奖**/
	W.callbackAwardHandler = function(data){
		H.lottery.awardPrize(data);
	}

	/**参与人数**/
	W.callbackCountServicePvHander = function(data){
		H.lottery.joincount(data);
	}
	
})(Zepto);

H.index.init();
H.lottery.init();