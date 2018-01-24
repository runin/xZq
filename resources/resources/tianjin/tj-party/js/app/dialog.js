(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
            var me = this;
            this.$container.delegate('.link-a', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-receive', 'click', function(e) {
                e.preventDefault();
                H.dialog.receive.open();
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

            H.dialog.relocate();
        },
        
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width(),
                top = $(window).scrollTop() + height * 0.06;

            $('.modal').each(function() {
                $(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15})
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
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
        
        
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();

				getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function () {
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
					me.close();
				});
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rul" id="rule-dialog">')
					._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="tj-party-ruledialog-closebtn" data-collect-desc="天津315规则弹层-关闭按钮"></a>')
					._('<div class="dialog rule-dialog">')
					._('<h2>活动规则</h2>')
					._('<div class="content">')
					._('<div class="rule-con"></div>')
					._('</div>')
					._('<p class="dialog-copyright"><a href="#" class="btn my-zhidao close" data-collect="true" data-collect-flag="tj-party-guide-trybtn" data-collect-desc="天津315规则弹层-我知道了按钮">我知道了</a>本活动最终解释权归天津广播电视台所有</p>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        // 规则
        succ_content: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                $('body').addClass('noscroll');
            },
            close: function() {
                $('body').removeClass('noscroll');
                this.$dialog && this.$dialog.addClass('none');
                toUrl("index.html");
            },
            event: function() {
                var me = this;
                this.$dialog.find('.lottery-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            tpl: function() {
                var t = simpleTpl();
                	t._('<div class="modal">')
						._('<div class="dialog lottery-dialog">')
						._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="tj-party-succdialog-closebtn" data-collect-desc="爆料成功弹层-关闭按钮"></a>')
							//爆料提交成功
							._('<div class="not-lott" id="not-lott">')
								._('<img src="images/smile.png">')
								._('<h1>恭喜您，您已成功提交!</h1>')
								._('<a class="btn lottery-close back" data-collect="true" data-collect-flag="tj-party-go-on-lottery" data-collect-desc="返回按钮">继续抽奖</a>')
							._('</div>')
							._('<p class="dialog-copyright">关注天视汇来领奖，滴滴红包等你抢！</p>')
						._('</div>')
					._('</div>');
                return t.toString();
            }
        },
        lottery: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
			},
			close: function() {
				this.$dialog && this.$dialog.addClass('none');
				$('.masking-box').addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.clear();
					me.close();
					toUrl("index.html");
				});
	

				$('#btn-award').click(function(e) {
					e.preventDefault();
					toUrl("index.html");
					
				});
			},
			check: function() {
				var me = this;

					var $mobile = me.$dialog.find('.mobile'),
						$name = me.$dialog.find('.name'),
						$address = me.$dialog.find('.address'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());

					if (!name) {
						alert('请先输入姓名');
						$name.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!mobile || !/^\d{11}$/.test(mobile)) {
						alert('请先输入正确的手机号');
						$mobile.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}
					if (!address) {
						alert('请输入您的地址');
						$address.focus();
						$(this).removeClass(me.REQUEST_CLS);
						return false;
					}

				return true;
			},
			enable: function() {
				this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
			},
			disable: function() {
				this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
			},
			butt_loading: function() {
				var t = simpleTpl();
				t._(' <div class="loader">')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('<span></span>')
					._('</div>');
				$('.dialog-copyright').before(t.toString());
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog lottery-dialog">')
					._('<a href="#" class="btn-close lottery-close" data-collect="true" data-collect-flag="tj-party-lottdialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
						//未中奖
						._('<div class="not-lott" id="not-lott">')
							._('<img src="images/sad.png">')
							._('<h1>很遗憾，您与奖品擦肩而过</h1>')
							._('<h1>请您继续关注节目，参与有奖互动！</h1>')
							._('<a class="btn lottery-close lott-back" data-collect="true" data-collect-flag="tj-party-sharebtn" data-collect-desc="返回按钮">返 回</a>')
						._('</div>')
						//中奖
						._('<div class="lott none" id="lott">')
							._('<img src="">')
							._('<h2></h2>')
							._('<h1><span class="ck"></span><span class="cn"></span></h1>')		
							._('<span>以上是您的领奖凭证，请关注天视汇查询</span>')
							._('<a class="btn btn-share bth-aw btn-award" id="btn-award" data-collect="true" data-collect-flag="tj-party-combtn" data-collect-desc="天津315-确定按钮">我知道了</a>')
							._('<span class="share">告诉小伙伴们一起来抽奖吧</span>')
						._('</div>')
						._('<p class="dialog-copyright">关注天视汇来领奖，滴滴红包等你抢！</p>')
					._('</div>')
					._('</div>');
				return t.toString();
			},
			update: function(data) {
					if(data.pt != 2 && data.code == 0){
						var classStateck = typeof(data.pcn)=="undefined"?"":data.pcn;
						var classStatecn = typeof(data.pck)=="undefined"?"":data.pck;
						$("#lott").find("img").attr("src",data.pi);
						$("#lott").find("h2").html("恭喜您，获得"+data.pn+"一"+data.pu);
						if(data.pt == 6){
							$("#lott").find(".ck").html("序列号:"+classStateck);
							$("#lott").find(".cn").html("密码:"+classStatecn);
	
						}
						if(!data.pcn||data.pcn==null){
								$("#lott").find("h1").html(data.ptt);
						}
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					}else{
						this.$dialog.find("#lott").addClass("none");
						this.$dialog.find("#not-lott").removeClass("none");
					}
			},
			clear:function(){
				this.$dialog.find("#not-lott").removeClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog.find('input').removeAttr('disabled').css('border','1px solid #D3D3D3');
				this.$dialog.find('#btn-award').removeClass('none').addClass('btn btn-share bth-aw btn-award');
				this.$dialog.find('#lott h1').text('请填写您的联系方式以便顺利领奖');
			},
			succ: function() {
				$('.loader').addClass('none');
				this.$dialog.find('input').attr('disabled','disabled').css('border','none');
				this.$dialog.find('#btn-award').addClass('none');
				this.$dialog.find('.da-tips').removeClass('none');
				var mob = this.$dialog.find('.mobile').val();
				var nam = this.$dialog.find('.name').val();
				var address = this.$dialog.find('.address').val();
				this.$dialog.find('.mobile').val("").attr('placeholder','电话：'+mob);
				this.$dialog.find('.name').val('姓名：'+nam);
				this.$dialog.find('.address').val('地址：'+address);
				this.$dialog.find('#lott h1').text('以下是您的联系方式，请等候工作人员联系');
			}
		},
        // 验证错误
        error: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                
                $('body').addClass('noscroll');
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
                var r = simpleTpl();
                r._('<section class="modal" id="guide-dialog">')
                ._('<div class="receive relocated">')
                ._('<p class="safety-text">')
                ._('</p>')
                ._('<a href="index.html" class="activities-btn btn-try" data-collect="true" data-collect-flag="tj-party-podium-trybtn" data-collect-desc="关闭按钮">确定</a>')
                ._('</div>')
                ._('</section>');
                return r.toString();
            }
        },

        showWin: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").text(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal" id="guide-dialog">')
                    ._('<div class="receive relocated">')
                    ._('<p class="safety-text">' + this.getText())
                    ._('</p>')
                    ._('<a href="javascript:void(0)" id="showWin-sure" class="activities-btn" data-collect="true" data-collect-flag="tj-party-podium-trybtn" data-collect-desc="关闭按钮">确定</a>')
                    ._('</div>')
                    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

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
                });
            },
            tpl: function() {
                var t = simpleTpl();
                
                t._('<section class="modal" id="confirm-dialog">')
                    ._('<div class="dialog confirm-dialog relocated">')
                        ._('<div class="content">资料填写不全，将被视为自愿放弃奖品。</div>')
                        ._('<div class="ctrl">')
                            ._('<a href="#" class="btn btn-confirm">返回填写</a>')
                        ._('</div>')
                    ._('</div>')
                ._('</section>');
                
                return t.toString();
            }
        }
    };
    
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.newseyeAwardHandler = function(data) {
		if (data.code == 0) {
			H.dialog.lottery.enable();
			H.dialog.lottery.succ();
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
			$('#btn-award').removeClass('none');
		}
	}
    
})(Zepto);

$(function() {
    H.dialog.init();
});
