(function($) {
	H.dialog = {
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		as: getQueryString('as'),
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			});
		},
		close: function() {
			$('.modal').addClass('none');
		},
		open: function() {
			H.dialog.close();
			if (this.$dialog) {
				this.$dialog.removeClass('none');
			} else {
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
			}
			$('.modal-guide').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			$('#rule-dialog').click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			H.dialog.relocate();
		},
		
		relocate: function() {
			var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

			$('.modal').each(function() {
				$(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': '12%', 'top': '8%'})
			});
			$('.dialog').each(function() {
				if ($(this).hasClass('relocated')) {
					return;
				}
				$(this).css({ 
					'width': width * 0.88, 
					'max-height': height * 0.88, 
					'left': width * 0.06,
					'right': width * 0.06,
					'top': top
				});
				var $box = $(this).find('.box');
				if ($box.length > 0) {
					$box.css('height', height * 0.38);
				}
			});
			$(".rank-dialog").css("top",top+10+"px");
		},
		//引导
		guide: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				var me = this;
				setTimeout(function() {
					me.close();
				}, 8000);
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-try').click(function(e) {
					e.preventDefault();
					me.close();
				});
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal modal-guide" id="guide-dialog">')
					._('<div class="dialog guide-dialog relocated">')
						._('<h2></h2>')
						._('<p class="ellipsis"><label><img src="images/hb-1.jpg" /></label>锁定河北卫视《中华好民歌》</p>')
						._('<p class="ellipsis"><label><img src="images/hb-2.jpg" /></label>打开微信，进入摇一摇（电视）</p>')
						._('<p class="ellipsis"><label><img src="images/hb-3.jpg" /></label>对着电视摇一摇</p>')
						._('<p class="ellipsis"><label><img src="images/hb-4.jpg" /></label>参与互动就有机会赢取超值礼品</p>')
						._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="hb-folk-song-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">等下就去试试</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
				$('body').addClass('noscroll');
				getResult('api/common/rule', {}, 'commonApiRuleHandler');
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
				this.$dialog.find('.rule').html(rule);
				hidenewLoading();
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<section class="modal" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-folk-song-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2><img src="images/hbrule-tlt.png"></h2>')
						._('<div class="content border">')
							._('<div class="rule"><p><span style="color:#FFFFFF;">1、本活动由河北卫视《中华好民歌》栏目与河北网络电视台日共同发起，每周五准时开启。</span></p><p><span style="color:#FFFFFF;">2</span><span style="font-size:12px;line-height:1.5;color:#FFFFFF;">、在电视机前观看《中华好民歌》的同时，请您打开手机微信，选择摇一摇（电视），对准电视屏幕摇动手机进入有奖互动</span><span style="font-size:12px;line-height:1.5;color:#FFFFFF;">&nbsp;</span><span style="font-size:12px;line-height:1.5;color:#FFFFFF;">。</span></p><p><span><span style="color:#FFFFFF;"> 3、参与摇奖环节，有机会获得不同面值（</span><span style="color:#FFFFFF;">300</span><span style="color:#FFFFFF;">元，</span><span style="color:#FFFFFF;">500</span><span style="color:#FFFFFF;">元，</span><span style="color:#FFFFFF;">800</span><span style="color:#FFFFFF;">元，</span><span style="color:#FFFFFF;">1000</span><span style="color:#FFFFFF;">元，</span><span style="color:#FFFFFF;">2000</span><span style="color:#FFFFFF;">元）的保食安食品净化机购机红包。</span></span></p><p><span><span style="color:#000000;"><span style="color:#FFFFFF;">4、代金券请在有效期内使用，每次仅限使用一张。</span><span style="color:#FFFFFF;">2000</span><span style="color:#FFFFFF;">元面值代金券仅限于选购保食安水槽型食品净化机使用；其他面值代金券均适用于选购保食安食品净化机各种型号使用。</span></span></span></p><p><span style="color:#FFFFFF;"><span style="color:#FFFFFF;">5、食品净化机及购机代金券等奖品凭微信代金券中唯一代码联系商家领取奖品，中奖者姓名、联系电话、地址必须填写清楚，否则视为放弃。若中奖者不需要此奖品，可不填个人信息内容。</span></span></p><p><span style="color:#FFFFFF;">6、</span><span style="color:#FFFFFF;">保食安食品净化机中奖者须自己联系商家兑奖，邮费自理。</span></p><p><span style="color:#FFFFFF;"><span style="color:#FFFFFF;">7、本活动最终解释权归河北卫视《中华好民歌》栏目组所有。</span></span></p></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		// 积分排行榜
		rank: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();

				getResult('api/lottery/integral/rank/self', {
					oi: openid,
					pu: getQueryString('actUid')
				}, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-close').click(function(e) {
					e.preventDefault();
					me.close();
				});
				
			},
			selfupdate: function(data) {
				this.$dialog.find('.jf').text(data.in || 0);
				this.$dialog.find('.pm').text(data.rk || '暂无排名');

				getResult('api/lottery/integral/rank/top10', {
					pu: getQueryString('actUid')
				}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
			},
			update: function(data) {
				var t = simpleTpl(),
					items = data.top10 || [],
					len = items.length;
				
				for (var i = 0; i < len; i ++) {
					t._('<li>')
						._('<span class="r-avatar"><img src="'+ (items[i].hi ? (items[i].hi + '/' + 0) : './images/avatar.jpg') +'" /></span>')
						._('<span class="r-name">第<span class="jf-num">'+ (items[i].rk || '-') +'</span>名</span>')
						._('<span class="r-rank"><span class="jf-num">积分:</span>'+ (items[i].in || '-') +'</span>')
					._('</li>');
				}
				this.$dialog.find('ul').html(t.toString());
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="rank-dialog">')
					._('<div class="dialog rank-dialog">')
						._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="hb-folk-song-rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
						._('<label class="infor"></label><h2>积分排行榜</h2>')
						._('<div class="list border">')
							._('<div class="content">')
								._('<h3>我的积分：<span class="jf"></span>排名：<span class="pm"></span></h3>')
								._('<ul></ul>')		
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		lottery: {
			iscroll: null,
			$dialog: null,
			LOTTERIED_CLS: 'lotteried',
			REQUEST_CLS: 'requesting',
			AWARDED_CLS: 'lottery-awarded',
			LOTTERY_NONE_CLS: 'lottery-none',
            pt: 0,
			open: function(data) {
				var me = this, $dialog = this.$dialog;
				H.dialog.open.call(this);
				H.dialog.lottery.update(data);
				hideLoading($dialog);
				if (!$dialog) {
					this.event(data);
				}
				
				this.scroll_enable();
				this.$dialog && this.$dialog.removeClass('none');
			},
			
			event: function() {
				var me = this;
				this.$dialog.find('.btn-award').click(function(e) {
					e.preventDefault();
					
					if ($(this).hasClass(me.REQUEST_CLS)) {
						return false;
					}
					if (!me.check()) {
						return false;
					}
					$(this).addClass(me.REQUEST_CLS);
					var mobile = $.trim(me.$dialog.find('.mobile').val()),
						name = $.trim(me.$dialog.find('.name').val()),
						address = $.trim(me.$dialog.find('.idc').val());
					
					me.disable();
					getResult('api/lottery/award', {
						oi: openid,
						rn: encodeURIComponent(name),
						ph: mobile,
						ad: encodeURIComponent(address)
					}, 'callbackLotteryAwardHandler', true, me.$dialog);
					
				});
				this.$dialog.find('.btn-back').click(function(e) {
					e.preventDefault();
					me.close_lottery();
				});
			},
			close_lottery: function() {
				var me = this;
				this.$dialog.addClass('none');
				this.$dialog.find('.mobile').attr('type','tel');
				this.$dialog.find('input').removeAttr('disabled');
				this.$dialog.find('.duihuan').addClass('none');
				this.$dialog.removeClass(this.AWARDED_CLS);
				this.$dialog.find('.btn-award').removeClass(me.REQUEST_CLS);
				this.$dialog.find('.award-tip').text('请填写您的联系方式,以便顺利领奖');
				if(this.$dialog.find('.address').hasClass('none')){
					this.$dialog.find('.address').removeClass('none');
				}
				H.yao.isCanShake = true;
			},
			update: function(data) {
				if (data) {
					if (data.result) {
						// 中奖后
                        H.dialog.lottery.pt = data.pt;
						this.$dialog.find('.prize-tip').text(data.tt || '');
						if(data.pt == 5){
							if(window.screen.height==480){
								this.$dialog.find('.award-img img').css('width','60%');
							}else{
								this.$dialog.find('.award-img img').css('width','85%');
							}
						}else{
							if(window.screen.height==480){
								this.$dialog.find('.award-img img').css('width','19%');
							}else{
								this.$dialog.find('.award-img img').css('width','initial');
							}
						}
						this.$dialog.find('.award-img img').attr('src', (data.pi || ''));
						this.$dialog.find('.name').val(data.rn || '');
						this.$dialog.find('.mobile').val(data.ph || '');
						this.$dialog.find('.address').val(data.ad || '');
						if(data.pt == 5 && data.cc){
							this.$dialog.find('.duihuan span').text(data.cc || '');
							this.$dialog.find('.duihuan').removeClass("none");
							this.$dialog.find('.cont-tip h4').text(data.aw || '');
						}
						this.$dialog.find('.award-win').removeClass('none');
					}else{
						H.yao.not_winning();
					}
				}

			},
			
			check: function() {
				var me = this, $mobile = me.$dialog.find('.mobile'),
					mobile = $.trim($mobile.val()),
					$name = me.$dialog.find('.name'),
					name = $.trim($name.val()),
					$address = me.$dialog.find('.address'),
					address = $.trim($address.val());

				if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
				&& (me.address && me.address == address)) {
					return;
				}

				if (name.length < 2 || name.length > 30) {
					showTips('姓名长度为2~30个字符');
					$name.focus();
					return false;
				}
				else if (!/^\d{11}$/.test(mobile)) {
					showTips('这手机号，可打不通哦...');
					$mobile.focus();
					return false;
				} else if (H.dialog.lottery.pt == 1){
					if(address.length < 5 || address.length > 60) {
						showTips('地址长度为5~60个字符');
						return false;
					}
				}
				return true;
			},
			
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			scroll_enable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.enable();
				}
			},
			scroll_disable: function() {
				if (this.iscroll) {
					this.iscroll.scrollTo(0, 0);
					this.iscroll.disable();
				}
			},
			// 领奖成功
			succ: function() {
				this.$dialog.find('.mobile').attr('type','text');
				var rn = "姓名：" + this.$dialog.find('.name').val(),
					ph = "电话：" + this.$dialog.find('.mobile').val(),
					ad = "地址：" + this.$dialog.find('.address').val();
				this.scroll_disable();
				this.$dialog.addClass(this.AWARDED_CLS);
				this.$dialog.find('.share').removeClass('none');
				this.$dialog.find('.name').val(rn);
				this.$dialog.find('.mobile').val(ph);
				if(ad.length != 3){
					this.$dialog.find('.address').val(ad);
				}else{
					this.$dialog.find('.address').addClass('none');
				}
				this.$dialog.find('.award-tip').text('(保存此截图，作为领奖唯一凭证)');
				this.$dialog.find('input').attr('disabled', 'disabled');
			},
			
			reset: function() {
				this.$dialog && this.$dialog.remove();
				this.$dialog = null;
			},

			close: function() {
				this.$dialog.find('.btn-close').trigger('click');
			},
			
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close btn-back" data-collect="true" data-collect-flag="hb-folk-song-new-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						._('<div class="dialog-inner">')
							._('<div class="content">')
								._('<div class="back">')
								
									._('<div class="award-win none">')
										._('<div class="award-img">')
											._('<img src="" />')
										._('</div>')
										._('<div class="contact">')
											._('<h3 class="prize-tip">恭喜你，答对了！</h3>')
											._('<h3 class="duihuan none">兑换码：<span></span></h3>')
											._('<h4 class="award-tip">请填写您的联系方式,以便顺利领奖</h4>')
											._('<p><input type="text" class="name" placeholder="姓名" /></p>')
											._('<p><input type="tel" class="mobile" placeholder="电话" /></p>')
											._('<p><input type="text" class="address" placeholder="地址" /></p>')
											._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="hb-folk-song-new-lotterydialog-combtn" data-collect-desc="抽奖弹层-抽奖确认按钮">确定</a>')
											._('<a href="#" class="btn btn-share btn-back" data-collect="true" data-collect-flag="hb-folk-song-new-lotterydialog-back-btn" data-collect-desc="抽奖弹层-返回按钮">返 回</a>')
											._('<div class="cont-tip">')
												._('<h4></h4>')
											._('</div>')
										._('</div>')

									._('</div>')
								
								._('</div>')
								
							._('</div>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
		// confirm
		confirm: {
			$dialog: null,
			$focus_obj: null,
			open: function($obj) {
				this.$focus_obj = $obj;
				if (this.$dialog) {
					this.$dialog.removeClass('none');
				} else {
					this.$dialog = $(this.tpl());
					H.dialog.$container.append(this.$dialog);
				}
				H.dialog.relocate();
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.btn-confirm').click(function(e) {
					e.preventDefault();
					//me.$focus_obj.focus();
					me.close();
					showTips('领取成功');
				});
			},
			tpl: function() {
				var t = simpleTpl();
				
				t._('<section class="modal" id="confirm-dialog">')
					._('<div class="dialog confirm-dialog relocated">')
						._('<div class="content">资料填写不全，将被视为自愿放弃奖品。</div>')
						._('<div class="ctrl">')
							._('<a href="#" class="btn btn-confirm" data-collect="true" data-collect-flag="hb-folk-song-lotterydialog-tip-btn" data-collect-desc="抽奖弹层-返回填写信息按钮">返回填写</a>')
						._('</div>')
					._('</div>')
				._('</section>');
				
				return t.toString();
			}
		},
        redbagLottery: {
            $dialog: null,
            rp:null,
            open: function(data) {
                var me =this, $dialog = this.$dialog, winW = $(window).width(), winH = $(window).height();
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                $(".redbag-dialog").click(function(e){
                    e.preventDefault();
                    if(!$('.redbag-dialog').hasClass("flag")) {
                        shownewLoading(null, '领取中...');
                        $('.redbag-dialog').addClass("flag");
                        $('.btn-redbag-get').text("领取中");
                        setTimeout(function(){
                            location.href = H.dialog.redbagLottery.rp;
                        },500);
                    }
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result){
                    me.rp = data.rp;
                    $("#redbag-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#redbag-dialog").find(".award-keyTips").html(data.tt || '');
                    $("#redbag-dialog").find("h6 label").html((data.pv / 100) || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-redbag" id="redbag-dialog">')
                    ._('<section class="dialog redbag-dialog" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-redbag-btn-close" data-collect-desc="弹层(红包)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                            	._('<img class="award-img" src="./images/new-dialog.jpg">')
                            	._('<section class="redbag-tips">')
	                                ._('<p class="award-keyTips"></p>')
	                                ._('<h6>获得现金<label></label>元</h6>')
	                            ._('</section>')
                            ._('</section>')
                            ._('<section class="dialog-footer">')
                                ._('<section class="btn-lottery-box">')
                                    ._('<a href="javascript:void(0);" class="btn-lottery btn-redbag-get" id="btn-redbagLottery-use" data-collect="true" data-collect-flag="dialog-redbag-btn-redbagLottery-use" data-collect-desc="弹层(红包)-立即使用按钮">领取红包</a>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        linkLottery: {
            $dialog: null,
            ru: '',
            open: function(data) {
                H.yao.isCanShake = false;
                var me =this,$dialog = this.$dialog;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
            },
            close: function() {
                var me = this;
                H.yao.isCanShake = true;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-linkLottery-use').click(function(e) {
                    e.preventDefault();
                    if (me.ru.length == 0) {
                        me.close();
                        hidenewLoading();
                    } else {
                        showTips('领取成功');
                        getResult('api/lottery/award', {
                            oi: openid,
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : ""
                        }, 'callbackLotteryAwardHandler');
                        setTimeout(function(){
                            location.href = me.ru;
                        },1000);
                    }
                });
            },
            update: function(data) {
                var me = this;
                if(data.result){
                    me.ru = data.ru;
                    if (data.ru.length == 0) {
                        $('#btn-linkLottery-use').html('继续摇奖');
                    } else {
                        $('#btn-linkLottery-use').html('点我领取');
                    }
                    $("#link-dialog").find(".award-img").attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                    $("#link-dialog").find(".award-keyTips").html(data.tt || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-link" id="link-dialog">')
                    ._('<section class="dialog link-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-link-btn-close" data-collect-desc="弹层(外链)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<img class="award-img" src="./images/new-dialog.jpg">')
                                ._('<p class="award-keyTips"></p>')
                            ._('</section>')
                            ._('<section class="dialog-footer">')
                                ._('<section class="btn-lottery-box">')
                                    ._('<a href="javascript:void(0);" class="btn-lottery btn-link-use" id="btn-linkLottery-use" data-collect="true" data-collect-flag="dialog-link-btn-linkLottery-use" data-collect-desc="弹层(外链)-点我领取按钮">点我领取</a>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        },
        wxcardLottery: {
            $dialog: null,
            ci:null,
            ts:null,
            si:null,
            pt:null,
            sto:null,
            open: function(data) {
                var me =this, $dialog = this.$dialog;
                H.yao.isCanShake = false;
                H.dialog.open.call(this);
                if (!$dialog) {
                   this.event();
                }
                me.update(data);
                me.readyFunc();
            },
            close: function() {
                var me = this;
                me.$dialog && me.$dialog.remove();
                me.$dialog = null;
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-dialog-close').click(function(e) {
                    e.preventDefault();
                    H.yao.isCanShake = true;
                    me.close();
                });
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    H.yao.isCanShake = true;
                    me.close();
                });
            },
            readyFunc: function(){
                var me = this;
                $('#btn-wxcardLottery-award').click(function(e) {
                    e.preventDefault();
                    H.yao.isCanShake = false;
                    if(!$('#btn-wxcardLottery-award').hasClass("flag")){
                        $('#btn-wxcardLottery-award').addClass("flag");
                        shownewLoading();
                        me.close();
                        me.sto = setTimeout(function(){
                            H.yao.isCanShake = true;
                            hidenewLoading();
                        },15000);
                        $('#btn-wxcardLottery-award').text("领取中");
                        setTimeout(function(){
                            me.wx_card();
                        },1000);
                    }
                });
            },
            wx_card:function(){
                var me = this;
                wx.addCard({
                    cardList: [{
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        H.yao.wxCheck = true;
                        H.yao.isCanShake = true;
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler');
                        showTips('领取成功');
                    },
                    fail: function(res){
                        H.yao.isCanShake = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    },
                    cancel:function(){
                        H.yao.isCanShake = true;
                        hidenewLoading();
                    }
                });
            },
            update: function(data) {
                var me = this, height = $(window).height();
                if(data.result && data.pt == 7){
                    me.pt = data.pt;
                    me.ci = data.ci;
                    me.ts = data.ts;
                    me.si = data.si;
                    $("#wxcard-dialog").find(".award-img").attr("src",data.pi).attr("onerror","$(this).addClass(\'none\')");
                    $("#wxcard-dialog").find(".award-keyTips").html(data.tt || '');
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-wxcard" id="wxcard-dialog">')
                    ._('<section class="dialog wxcard-dialog">')
                        ._('<a href="javascript:void(0);" class="btn-dialog-close" id="btn-dialog-close" data-collect="true" data-collect-flag="dialog-wxcard-btn-close" data-collect-desc="弹层(卡券)-关闭按钮"></a>')
                        ._('<section class="dialog-content">')
                            ._('<section class="dialog-body">')
                                ._('<img class="award-img" src="./images/new-dialog.jpg">')
                                ._('<p class="award-keyTips"></p>')
                            ._('</section>')
                            ._('<section class="dialog-footer">')
                                ._('<section class="btn-lottery-box">')
                                    ._('<a href="javascript:void(0);" class="btn-lottery btn-wxcard-lottery-award" id="btn-wxcardLottery-award" data-collect="true" data-collect-flag="dialog-wxcard-btn-wxcardLottery-award" data-collect-desc="弹层(卡券)-领取按钮">领&nbsp;&nbsp;取</a>')
                                ._('</section>')
                            ._('</section>')
                        ._('</section>')
                    ._('</section>')
                ._('</section>');
                return t.toString();
            }
        }
	};
	
	W.commonApiRuleHandler = function(data) {
		if (data.code == 0 && data.rule) {
			H.dialog.rule.update(data.rule);
			hidenewLoading();
		}
	};

	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			H.dialog.lottery.succ();
		}
	};

	W.callbackIntegralRankSelfRoundHandler = function(data) {
		if (data.result) {
			H.dialog.rank.selfupdate(data);
		}
	};

	W.callbackIntegralRankTop10RoundHandler = function(data) {
		//H.dialog.rank.update(rankData);
		if (data.result) {
			H.dialog.rank.update(data);
			$('.rank-dialog .infor').text(H.dialog.as);
		}
	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});

