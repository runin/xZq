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
		lastScore: 0,
		isRestart: false,
		init: function(){
			this.show();
			this.bindBtns();
			H.wxRegister.ready();
   			H.wxRegister.init();
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
		              		H.index.endGame(score);
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
			$(".score").html(score+"分");
			$('#bgm').get(0).pause();
			H.score.show();
		},
		show: function(){
			this.$stage.removeClass('none');
			this.$stage.animate({opacity: 1}, 1300, 'ease');
		},
		bindBtns: function(){
			this.$play.click(function(e){
				e.preventDefault();
				H.index.startGame(400);
			});
			$('.btn-close,.btn-again').click(function(e){
				e.preventDefault();
				H.index.close();
			});
			$('.btn-share').click(function(e){
				e.preventDefault();
				H.index.close();
				H.share.show();
			});
			$('#share_dialog').click(function(e){
				e.preventDefault();
				$('.icon-share').removeClass("bounceInLeft");
				$(this).addClass("none");
			});
			$('#btn-danmu').click(function(e){
				e.preventDefault();
				toUrl("barrage.html");

			});
		},
		close : function(){
			H.index.show();
			$('.icon-share').removeClass("bounceInLeft");
   			$("#stage_main").addClass("none");
		    $('.dialog-wrapper').addClass('none');
		}
	};
	H.score = {
		$dialog: $('#score_dialog'),
		show: function(){
			$('#bgm').get(0).pause();
			this.$dialog.removeClass('none');
		}
	};
	H.share = {
		$dialog: $('#share_dialog'),
		show: function(){
			$('#score_dialog').addClass("none");
			$('.icon-share').addClass("bounceInLeft");
			this.$dialog.removeClass('none');
		}
	};
	H.wxRegister = {
        init : function(fn){
            this.wxConfig();
            this.event();
        },
        event: function() {
            var me = this;
        },
        ready: function() {
            var me = this;
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: [
                         'onMenuShareTimeline',
                         'onMenuShareAppMessage',
                         'hideAllNonBaseMenuItem',
                         'onMenuShareQQ',
                         'onMenuShareWeibo',
                         'hideMenuItems',
                         'showMenuItems',
                         'hideOptionMenu',
                         'showOptionMenu'
                    ],
                    success: function (res) {
                        wxIsReady = true; 
                        wx.hideOptionMenu();
                		me.showMenuList();
                    }
                });
            });
            wx.error(function(res){
                wxIsReady = false;
            });
        },
        wxConfig: function(){
        	shownewLoading();
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket' + dev,
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                	hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideAllNonBaseMenuItem',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideOptionMenu',
                                'showOptionMenu'
                            ]
                        });
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        //分享朋友圈
        menuShare: function(wxData) {
            wx.onMenuShareTimeline({
            	title : wxData.title,
	            desc : wxData.desc,
	            link : wxData.link,
	            imgUrl: wxData.imgUrl,
                trigger: function(res) {
                },
                success: function(res) {
                    H.index.close();
                },
                cancel: function(res) {
                    H.index.close();
                },
                fail: function(res) {
                    H.index.close();
                }
            })
        },
        // 分享给朋友
        menuToFriend: function(wxData) {
            wx.onMenuShareAppMessage({
                title: wxData.title,
                desc: wxData.desc,
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                success: function(res) {
                    H.index.close();
                },
                cancel: function(res) {
                    H.index.close();
                },
                fail: function(res) {
                    H.index.close();
                }
            });
        },
        hideMenuList:function() {
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.hideMenuItems({
                menuList: [
                    // "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ],
                success:function (res) {
                },
                fail:function (res) {
                }
            });
        },
        showMenuList:function() {
            var me = this;
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
            wx.showMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:favorite"
                ],
                success:function (res) {
                	var wxshareData = {};
                	wxshareData.desc = share_desc;
		            wxshareData.imgUrl = share_img;
		            wxshareData.link = getUrl(openid);
		            wxshareData.title = share_title;
                    H.wxRegister.menuShare(wxshareData);
            		H.wxRegister.menuToFriend(wxshareData);
                },
                fail:function (res) {
                }
            });
        }
    };
	H.loading.init();

})(Zepto);