$(function(){

	(function($) {
		
		H.lottery = {
			interval: null,
			init: function() {
				$('.pages').parallax({
				    direction: 'horizontal',
				    swipeAnim: 'default',
				    drag:      true,
				    loading:   false,
				    indicator: false,
				    arrow:     false
				    });
				$(".lottery-list a").click(function(){
					showLoading();
					$(".lottery-list a").removeClass("active")
					clearTimeout(interval);
					H.award.setItemId($(this).attr('id'));
					getResult('debate/lottery',{op:openid}, 'callbackDebateLottery');
				});
				
				// 兼容ip4
				if($(window).height() < 460){
					$("#lottery_page .page-inner-wrapper").addClass("small");
					$("#award_page .page-inner-wrapper").addClass("scroll");
				}
				
				this.randomActive();
			},
			randomActive: function(){
				var random = Math.floor( Math.random() * $(".lottery-list a").length);
				$(".lottery-list a").removeClass("active").eq(random).addClass("active");
				interval = setTimeout(H.lottery.randomActive,2000);
			}
		};
		
		H.award = {
			$id: "",
			$puid: 0,
			$img: $("#award_img"),
			$title: $("#award_title"),
			$desc: $("#award_desc"),
			$input: $("#award_input"),
			$submit: $("#award_submit"),
			$awardContainer: $("#award_container"),
			$awardFinish: $("#award_finish"),
			$share: $("#share_wrapper"),
			$shareBtn: $("#award_share"),
			init: function(data){
				$("#"+this.$id).find(".face.back img").attr("src",data.pi);
				$("#"+this.$id).find(".face.back img")[0].onload = function(){
					hideLoading();
					$("#"+H.award.$id).addClass("card-flipped");
					H.award.goToAward();
				};
				
				$("#"+this.$id).find(".face.back img")[0].onerror = function(){
					hideLoading();
					H.award.$img.addClass("none");
					H.award.goToAward();
				}
				
				if(data.pt == 1){
					// 获得实物奖品
					this.$title.text("恭喜您，获得" + data.pn + data.pu + "！");
					this.$awardContainer.removeClass('none');
				}else{
					// 获得积分
					this.$title.text("恭喜您，获得" + data.pv + "点积分！");
					this.$awardFinish.removeClass('none');
				}
				this.$desc.text(data.desc);
				this.$img.attr("src",data.pi).attr("alt",data.pn);
				if(data.ph){
					this.$input.val(data.ph);
				}
				this.$input.attr("puid",data.puid);
				this.$submit.click(function(){
					if(/^\d{11}$/.test($.trim(H.award.$input.val()))){
						showLoading();
						getResult('debate/award',{
							op:openid,
							ph:$.trim(H.award.$input.val()),
							puid:H.award.$input.attr("puid")
						}, 'callbackDebateAward');
					}else{
						alert('这手机号，可打不通...');
					}
				});
				
				this.$shareBtn.click(function(){
					H.award.$share.removeClass("none");
					$("#award_page").addClass("blur");
				});

				
				// 关闭分享
				this.$share.click(function(){
					H.award.$share.addClass("none");
					$("#award_page").removeClass("blur");
				});
				
				// 禁止滚动
				this.$share.bind("touchmove",function() {
					return false;
				});
				
				
			},
			setItemId: function(id){
				this.$id = id;
			},
			goToAward: function(){
				$("#lottery_page").removeClass("current");
				$("#award_page").addClass("current");
				
				
				
				$(".pages").removeClass("disabled");
				setTimeout(function(){
					$(".pages").css("-webkit-transform",  "matrix(1, 0, 0, 1, -"+$(window).width()+", 0)")
						.addClass("disabled");

					// 兼容ip4无法弹出输入框的问题
					var height = parseInt($(".award-wrapper").height(),10) + 30;
					var minHeight = $(window).height();
					$("#award_page").css("height",height + "px").css("min-height",minHeight);
					$(".pages").css("height",height + "px").css("min-height",minHeight);
					$(".wrapper").css("height",height + "px").css("min-height",minHeight);
					$("body").css("height",height + "px").css("min-height",minHeight);
					},1000);
			},
			afterAward: function(){
				this.$awardContainer.addClass('none');
				this.$awardFinish.removeClass('none');
				alert("领取成功！稍后工作人员将电话跟您联络");
			}
		};
		
		W.callbackDebateLottery = function(data){
			if(data.code == 0){
				H.award.init(data);
			}else{
				hideLoading();
				alert(data.message);
				location.href = "./index.html";
			}
		}
		
		W.callbackDebateAward = function(data){
			hideLoading();
			if(data.code == 0){
				H.award.afterAward();
			}else{
				alert("网络出现问题，请重新提交一次");
			}
		}

	})(Zepto);

	H.lottery.init();
});
