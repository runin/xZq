(function($) {
	H.dialog = {

		callBack:null,
		puid: 0,
		$container: $('body'),
		REQUEST_CLS: 'requesting',
		iscroll: null,
		init: function() {
			var me = this;
			this.$container.delegate('.btn-close', 'click', function(e) {
				e.preventDefault();
				$(this).closest('.modal').addClass('none');
			}).delegate('.btn-result', 'click', function(e) {
				e.preventDefault();
				H.dialog.result.open();
			}).delegate('.btn-receive', 'click', function(e) {
				e.preventDefault();
				var r =true;
                if(H.dialog.receiveFn){
                   r =H.dialog.receiveFn();
                }
                if(r){
                  H.dialog.receive.open();
                }
			

			});
		},
		close: function() {
			$('.modal').remove();
		},
		open: function() {
			H.dialog.close();
				this.$dialog = $(this.tpl());
				H.dialog.$container.append(this.$dialog);
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
				t._('<section class="modal" id="guide-dialog">')
					._('<div class="activities relocated">')
					    ._('<img src="images/activities-title.jpg" />')
						._('<section class="activities-con"><ul>')
						._('<ul>')
						._('<li>1.打开电视收看CCTV7美丽乡村过大年</li>')
						._('<li>2.打开微信进入"发现"打开“摇一摇”</li>')
						._('<li>3.选择“电视”，对着电视摇一摇</li>')
						._('<li>即有丰厚互动大奖等着</li>')
						._('</ul>')
						._('</section>')
						._('<a href="#" class="activities-btn btn-try" data-collect="true" data-collect-flag="dn-guide-trybtn" data-collect-desc="引导弹层-关闭按钮">马上就去</a>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
		
		//系统体tips
		tips: {
			$dialog: null,
			open: function() {

				H.dialog.open.call(this);
				this.event()
			},
			event: function() {
				var b = this;
				this.$dialog.find(".btn-now").click(function(c) {
					c.preventDefault();
					b.close()
				})
			},
			close: function() {
				this.$dialog && this.$dialog.addClass("none")
			},
			tpl: function() {
				var b = simpleTpl();
				b._('<section class="modal" id="tips-dialog">')
				._('<div class="safety">')
				._('<p class="safety-text">摇得很辛苦吧，您小歇一会儿，和家人一起聊聊家常，看看北京春晚吧！</p>')
				._('<a href="#" class="activities-btn btn-now">马上就去</a>')
				._("</div>")
				._("</section>");
				return b.toString()
			}
		},
		// 规则
		rule: {
			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
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
				._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="dn-ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
				._('<div class="dialog rule-dialog">')
				._("<h2></h2>")
				._('<div class="content border">')
				._('<div class="rule">')
				._("<p>1.&nbsp;&nbsp;活动日期：2.17~2.23日，央视7套“美丽乡村过大年”一共五期节目，每期节目21：17开播。</p>")
				._("<p>2.&nbsp;在您收看央视7套“美丽乡村过大年”节目的同时，请您拿起手机，打开微信，选择“电视”，对准电视屏幕摇动手机进入有奖互动</p>")
				._("<p>3.&nbsp;节目互动奖品包括：移动话费30元100份、300元10份，更有iphone6手机大奖11部，等您拿。</p>")
				._("<p>4.&nbsp;请您在中奖后，填写真实的领奖信息，便于奖品发放。</p>")
				._("</div>")
				._("</div>")
				._('<p class="dialog-copyright"></p>')
				._("</div>")
				._("</section>");
				return t.toString();
			}
		},
		
		// 领奖成功
		receive: {
			$dialog: null,
			open: function() {

				H.dialog.open.call(this);
				this.event()
			},
			event: function() {
				var b = this;
				this.$dialog.find("#successBtn").click(function(c) {
					var r = true;
					if(H.dialog.receive.successFn){
						r = H.dialog.receive.successFn();
					}
					c.preventDefault();
					if(r){
						b.close()
					}
				
				})
			},
			close: function() {
				this.$dialog && this.$dialog.addClass("none")
			},
			tpl: function() {
				var r = simpleTpl();
				r._('<section class="modal" id="guide-dialog">')
				._('<div class="receive relocated">')
				._('<p class="safety-text">恭喜您领奖成功，稍后我们的工作人员会与您联系，谢谢您的参与！')
				._('</p>')
				._('<a href="javascript:void(0)" class="activities-btn btn-try" id="successBtn" data-collect="true" data-collect-flag="dn-podium-trybtn" data-collect-desc="领奖成功-关闭按钮">确定</a>')
				._('</div>')
				._('</section>');
				return r.toString();
			}
		},
		
		// 未中奖
		nonereceive: {

			$dialog: null,
			open: function() {
				H.dialog.open.call(this);
				this.event();
				
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
               this.$dialog.find('#nonereceive-sure').click(function(e) {
					e.preventDefault();
					me.close();
					if(H.dialog.nonereceive.nonereceiveFn){
						 H.dialog.nonereceive.nonereceiveFn();
					}
				});


			},
			update: function(rule) {
				this.$dialog.find('.rule').html(rule).removeClass('none');
			},
			tpl: function() {
				var r = simpleTpl();
				r._('<section class="modal" id="guide-dialog">')
				._('<div class="receive relocated">')
				._('<p class="safety-text">对不起，您没有中奖，请不要灰心，祝您下一次中奖成功！')
				._('</p>')
				._('<a href="javascript:void(0)" id="nonereceive-sure" class="activities-btn btn-try" data-collect="true" data-collect-flag="dn-podium-trybtn" data-collect-desc="领奖成功-关闭按钮">确定</a>')
				._('</div>')
				._('</section>');
				return r.toString();
			}
		},
		showWin: {
			$dialog: null,
			open: function(temp,openFn,closeFn,customTemp) {
                this.customTemp =null;
				this.innerText = temp;
				this.closeFn =closeFn;
                this.customTemp =customTemp;

				H.dialog.open.call(this);
				this.event();
				if(openFn){
					openFn(this.$dialog);
				}
				this.changeText();
			},
			event: function() {
				var b = this;
				this.$dialog.find("#showWin-sure").unbind("click").click(function(c) {
					c.preventDefault();
					b.close()
				})
			},
			close: function() {
				this.$dialog && this.$dialog.addClass("none");
			
				if(this.closeFn){
					this.closeFn(this.$dialog);
				}
			},
			getText:function(){
             return  this.innerText;

			},
			changeText:function(){
           	 this.$dialog.find(".safety-text").text(this.getText());
			},
			tpl: function() {
;
                if(!this.customTemp){
                var b = simpleTpl();
				    b._('<section class="modal" id="guide-dialog">')
				    ._('<div class="receive relocated">')
				    ._('<p class="safety-text">' +this.getText())
				    ._('</p>')
				    ._('<a href="javascript:void(0)" id="showWin-sure" class="activities-btn btn-try" data-collect="true" data-collect-flag="dn-podium-trybtn" data-collect-desc="领奖成功-关闭按钮">确定</a>')
				    ._('</div>')
				    ._('</section>');
				    return b.toString()
                }else{
                  return this.customTemp(this); 

                }
		
			}
		},
		

	};
	
})(Zepto);

$(function() {
	H.dialog.init();
});
