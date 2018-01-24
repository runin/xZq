(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        redpack : '',
        iscroll: null,
        isJump :true, 
        outurl :null,
        resultUuid : null,
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
        open: function() {
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }
            H.dialog.relocate();
        },
        relocate : function(){
        	var height = $(window).height(),
        		width = $(window).width(),
        		top = $(window).scrollTop();
            $(".rule-dialog").css({
                    'width': width * 0.82, 
                    'height': height * 0.7, 
                    'left': width * 0.09,
                    'right': width * 0.09,
                    'top': height * 0.15,
                    'bottom': height * 0.15
            });
            $(".rule-dialog .content").css({
                    'height': $(".rule-dialog").height() - 54, 
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
					._('<div class="dialog rule-dialog">')
					    ._('<a href="#" class="btn-close close" data-collect="true" data-collect-flag="fj-sea-rule-dialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
						._('<h2>活动规则</h2>')
						._('<div class="content">')
							 ._('<div class="rule-con"></div>')
						._('</div>')
					._('</div>')
				._('</section>');
				return t.toString();
			}
		},
        lottery: {
			$dialog: null,
			open: function(resultUuid) {
				var me =this,$dialog = this.$dialog;
				H.dialog.open.call(this);
				if (!$dialog) {
				   this.event();
				}
				H.dialog.resultUuid = resultUuid;
			},
			close: function() {
				this.$dialog.find(".btn-close").addClass("none");
				this.$dialog.find("#gift-box").removeClass("none");
				this.$dialog.find("#not-lott").addClass("none");
				this.$dialog.find("#lott").addClass("none");
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function() {
				var me = this;
				this.$dialog.find('.lottery-close').click(function(e) {
					e.preventDefault();
					me.close();
					return;
				});
				
				this.$dialog.find('.back-index').click(function(e) {
					e.preventDefault();
					window.location.href = "index.html";
					me.close();
				});
				this.$dialog.find('#yaoBtnBoxa').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if (!me.checkInfo("yaoBtnBoxa")) {
						return false;
					}
					var mobile = $.trim(me.$dialog.find('#textphone').val()),
						name = $.trim(me.$dialog.find('#textname').val()),
						address = $.trim(me.$dialog.find('#textaddress').val());
					getResult('api/lottery/award', {
						ph: mobile,
						rn: encodeURIComponent(name),
						ad: encodeURIComponent(address),
						oi: openid
					}, 'callbackLotteryAwardHandler',true);
				
				});	
				this.$dialog.find('#yaoBtnBoxb').click(function(e) {
					   e.preventDefault();
	                    me.close();
	   			        H.yao.isCanShake = true;
	   			        H.yao.prize_count();
	            });
	            this.$dialog.find('#quizBtnBoxa').click(function(e) {
					e.preventDefault();
					if($(this).hasClass("requesting")){
						return;
					}
					$(this).addClass("requesting");
					if (!me.checkInfo("quizBtnBoxa")) {
						return false;
					}
					var mobile = $.trim(me.$dialog.find('#textphone').val()),
						name = $.trim(me.$dialog.find('#textname').val()),
						address = $.trim(me.$dialog.find('#textaddress').val());
					getResult('earsonme/quiz/award', {
						phone: mobile,
						userName: encodeURIComponent(name),
						add: encodeURIComponent(address),
						prizeResultUuid: H.dialog.resultUuid,
						openid:openid
					}, 'earsonmeAwardrHandler',true);
				
				});	
				this.$dialog.find('#quizBtnBoxb').click(function(e) {
					    e.preventDefault();
	                    me.close();
	   			        window.location.href = "index.html";
	            });
			},
			checkInfo: function(id) {
				   var me = this;
				   var $checkBtn = $("#"+id);
					var $mobile = me.$dialog.find('#textphone'),
						$name = me.$dialog.find('#textname'),
						$address = me.$dialog.find('#textaddress'),
						mobile = $.trim($mobile.val()),
						name = $.trim($name.val()),
						address = $.trim($address.val());

					if (!name) {
						$name.focus();
						alert('请先输入姓名');
						$checkBtn.removeClass("requesting");
						return false;
					}
					if (!mobile || !/^\d{11}$/.test(mobile)) {
						alert('请先输入正确的手机号');
						$checkBtn.removeClass("requesting");
						$mobile.focus();
						return false;
					}
					if (!address) {
						alert('请先输入正确的地址');
						$checkBtn.removeClass("requesting");
						$address.focus();
						return false;
					}
				return true;
			},
			tpl: function() {
				var t = simpleTpl();
				t._('<div class="modal" id="lottery-dialog">')
					._('<div class="dialog">')
						//未中奖
						._('<div class="not-lott none" id="not-lott">')
						  ._('<div class="nothing"><img src="images/nothing.png" /></div>')
						      ._('<div class="gift-text">')
						       ._('<h1>没中奖，再接再厉！</h1>')
						       ._('<img src="images/not-lott.png" />')
						      ._('</div>')
							._('<a class="back-index" data-collect="true" data-collect-flag="fj-sea-back" data-collect-desc="海峡卫视-返回按钮">返回首页</a>')
						  ._('</div>')
						
						//中奖
						._('<div class="lott none" id="lott">')
						    //中红包
							._('<div class="redhongbao none">')
						        ._('<div class="gift-hongbao">')
						      	    ._('<img src="" />')
						        ._('</div>')
						        ._('<div class="btn-box-b">')
						      	    ._('<span class="confirm">记得点[确认]噢！</span>')
						            ._('<input name="" type="button" class="btn-b none" id="btnBoxYao" value="确 认" data-collect="true" data-collect-flag="fj-sea-redpack-sbt" data-collect-desc="领取红包" />')
						        ._(' </div>')
   							._(' </div>')
							//中实物奖
							._('<div class="goods none">')
						      ._('<div class="gift"><img src="" /></div>')
						      ._('<div class="gift-text">')
						      	 ._(' <h2 class="title">请填写您的手机号，以便顺利领奖</h2>')
						      	 ._('<ul class="gift-touch">')
							        ._('<li><span>姓名</span>')
							        	._('<input name="" type="text" id="textname" class="text-a" placeholder="请填写真实姓名" />')
							        ._('</li>')
							        ._('<li><span>电话</span>')
							         	._('<input name="" type="number" id="textphone" class="text-a" placeholder="请填写真实电话号码" />')
							        ._('</li>')
							        ._('<li><span>地址</span>')
							        	._(' <input name="" type="text" id="textaddress" class="text-a" placeholder="请如实填写收货地址" />')
							        ._('</li>')
						        ._('</ul>')
						        ._(' <div class="yao-prize-btn none">')
							        ._('<input name="" type="button" class="btn-a none" id="yaoBtnBoxb" value="确&nbsp;&nbsp;&nbsp;定" data-collect="true" data-collect-flag="fj-sea--yao-back" data-collect-desc="摇奖领奖返回" />')
							        ._('<input name="" type="button" class="btn-a none" id="yaoBtnBoxa" value="预&nbsp;&nbsp;&nbsp;览" data-collect="true" data-collect-flag="fj-sea-yao-sbt" data-collect-desc="摇奖提交领奖" />')
						        ._(' </div>')
						        ._('<div class="quiz-prize-btn none">')
							        ._('<input name="" type="button" class="btn-a none" id="quizBtnBoxb" value="确&nbsp;&nbsp;&nbsp;定" data-collect="true" data-collect-flag="fj-sea-quiz-back" data-collect-desc="答题领奖返回" />')
							        ._('<input name="" type="button" class="btn-a none" id="quizBtnBoxa" value="预&nbsp;&nbsp;&nbsp;览" data-collect="true" data-collect-flag="fj-sea-quiz-sbt" data-collect-desc="答题提交领奖" />')
						     	._(' </div>')
						     ._(' </div>')
						._('</div>')
						
					  ._('</div>')
					._('</div>');
				return t.toString();
			},
			//摇一摇抽奖
			update: function(data) {
	            //接口回调成功且中奖
					this.$dialog.find("#not-lott").addClass("none");
					this.$dialog.find("#lott").removeClass("none");
					//实物奖品
					if(data.pt == 1){
						 $("#lott .goods").find("img").attr("src",data.pi);
                    	 $("#lott .goods").find("#textname").val(data.rn || "");
                    	 $("#lott .goods").find("#textphone").val(data.ph || "");
                    	 $("#lott .goods").find("#textaddress").val(data.ad || "");
                    	 $("#lott .goods").find(".quiz-prize-btn").addClass("none");
                    	 $("#lott .goods").find(".yao-prize-btn").removeClass("none")
                    	 $("#lott .goods").find("#yaoBtnBoxb").addClass("none");
                    	 $("#lott .goods").find("#yaoBtnBoxa").removeClass("none");
                    	 $("#lott .goods").find("input").removeAttr("disabled");	
                    	 $("#lott .redbao").addClass("none");
                    	 $("#lott .goods").removeClass("none");
					//外链奖品
					}else if(data.pt == 4){
						$("#lott").find(".redhongbao").removeClass("none");
						$("#lott").find(".goods").addClass("none");
						$(".redhongbao").find("img").attr("src",data.pi);
						$(".redhongbao").find("#btnBoxcQuiz").addClass("none");
						$(".redhongbao").find("#btnBoxYao").removeClass("none").attr("href",data.rp);
						H.yao.isCanShake = true;
					}
			},
			award: function(data) {
	            //接口回调成功且中奖
			    if(data&&data.code == 0&&data.pt != 2){
						this.$dialog.find("#not-lott").addClass("none");
						this.$dialog.find("#lott").removeClass("none");
					//实物奖品
					if(data.pt == 1){
						 $("#lott .goods").find("img").attr("src",data.pi);
						
                    	 $("#lott .goods").find("#textname").val(data.na || "");
                    	 $("#lott .goods").find("#textphone").val(data.phone || "");
                    	 $("#lott .goods").find("#textaddress").val(data.address || "");
                    	 $("#lott .goods").find(".quiz-prize-btn").removeClass("none");
                    	 $("#lott .goods").find(".yao-prize-btn").addClass("none")
                    	 //可以领奖为true
                    	 if(data.lj||data.lj === undefined){
                    	 	$("#lott .goods").find("input").removeAttr("disabled");
                    	 	$("#lott .goods").find("#quizBtnBoxb").addClass("none");
                    	 	$("#lott .goods").find("#quizBtnBoxa").removeClass("none");	
                    	 //不可以领奖
						 }else{
						 	$("#lott .goods").find(".gift-touch input").attr("disabled","disabled");
						 	$("#lott .goods").find("#quizBtnBoxa").addClass("none");
                    	 	$("#lott .goods").find("#quizBtnBoxb").removeClass("none");				
						 }
                    	 $("#lott .redbao").addClass("none");
                    	 $("#lott .goods").removeClass("none");
					}
				}else{
					this.$dialog.find("#not-lott").removeClass("none");
					this.$dialog.find("#lott").addClass("none");
					this.$dialog.find(".btn-close").removeClass("none");
				}
			}
			
		},

    };
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
	W.callbackLotteryAwardHandler = function(data) {
		if (data.result) {
			$("#yaoBtnBoxa").removeClass("requesting");
			$("#yaoBtnBoxa").addClass("none");
			$("#yaoBtnBoxb").removeClass("none");
			$(".dialog").find(".gift-touch input").attr("disabled","disabled");
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
		}
	};
	W.earsonmeAwardrHandler = function(data){
		if (data.code == 0) {
			$("#quizBtnBoxa").removeClass("requesting");
			$("#quizBtnBoxa").addClass("none");
			$("#quizBtnBoxb").removeClass("none");
			$(".dialog").find(".gift-touch input").attr("disabled","disabled");
			return;
		}else{
			alert("系统繁忙，请稍候再试！");
			$('.loader').addClass('none');
		}
	};
    
})(Zepto);

$(function() {
    H.dialog.init();
});
