(function ($) {
	var classId = {
		$headimgurl: $("#headimgurl"),
		$nickname: $("#nickname"),
		$myspoil: $("#my-p-btn")
	};
	
    H.index = {
        init: function () {
            this.headImgUrl();
			this.myspoilFn();
        },
		headImgUrl: function() {//头像及昵称
			var headimgurl = window.headimgurl?window.headimgurl+"/64":"images/avatar.jpg";
			var nickname = window.nickname?window.nickname:"匿名";
			classId.$headimgurl.attr("src",headimgurl);
			classId.$nickname.text(nickname);
		},
		myspoilFn: function() {//我的奖品
		    var that = this;
		    classId.$myspoil.unbind("click").click(function() {
				var t = simpleTpl();
				t._('<div class="record-box bounce-in-sides">')
				t._('<a href="javascript:void(0)" class="pop-close"></a>')
				t._('<div class="record-con">')
				t._('<div class="record-block" id="record-block">')
				t._('</div>')
				t._('</div>')
				t._('</div>')
				$(".pop-bg").append(t.toString()).removeClass("none");
				that.hidePop(".pop-close",".record-box",".pop-bg");
				getResult('api/lottery/record', {oi:openid}, 'callbackLotteryRecordHandler', true, this.$dialog);
			});
		},
		hidePop: function(a,b,c) {//关闭弹层
			$(a).click(function(e) {
				e.preventDefault();
				$(b).removeClass("bounce-in-sides").addClass("bounce-out-down");
				setTimeout(function() {
					$(b).remove();
					$(c).addClass("none");
				},800);
			});
		}
    };

    W.callbackLotteryRecordHandler = function(data) {
		var t = simpleTpl();
		if(data && data.result) {
			var rl = data.rl;
			t._('<ul class="record-ul">')
			for(var i=0, leg=rl.length; i<leg; i++) {
				t._('<li>')
				t._('<i></i>')
				t._('<h2>'+rl[i].lt+'</h2>')
				t._('<div class="record-text">')
				t._('<h3>您在生活频道节目中赢得'+rl[i].pn+'</h3>')
				if(rl[i].cc && rl[i].pd) {//兑换码
					t._('<p>奖品信息：'+rl[i].pd+'<br />兑换码:'+rl[i].cc+'</p>')
				}else if(rl[i].pd){
					t._('<p>奖品信息：'+rl[i].pd+'</p>')
				}else if(rl[i].cc){
					t._('<p>兑换码:'+rl[i].cc+'</p>')
				}
				t._('</div>')
				t._('</li>')
			}
			t._('</ul>')
			
		}else {
			t._('<div class="dear-tips">亲，啥都没有哦</div>')
		}
		$("#record-block").append(t.toString());
    };

    H.index.init();

})(Zepto);