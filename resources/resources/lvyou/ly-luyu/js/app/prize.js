
(function($){
	H.prize = {
	   token: null,
	   isEdit : false,
       init : function(){
       	   $(".prize-per").find("img").attr("src", headimgurl || "images/danmu-head.jpg" )
       	   $(".prize-per").find("span").html(nickname || "匿名用户" )
       	   this.prize_record();
       	   this.userInfo();
       	   this.event_handler();
       	   
       },
       prize_record: function(){
       	 getResult("api/lottery/record",{oi:openid},"callbackLotteryRecordHandler",true);
       },
       userInfo : function(){
		 getResult("api/user/info_v2",{matk:matk},"callbackUserInfoHandler",false);
	   },
	   event_handler : function(){
	   		$('#btn-edit').click(function(e) {
				e.preventDefault();
				H.prize.isEdit = true;
			    H.prize.userInfo();
			    $("#btn-sub").removeClass("none").removeClass("requseting");
				$(this).addClass("none");
			});
			$('#btn-sub').click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				if(!H.prize.check()){
					return;
				}
				
				var name = $(".name").val(),
				    mobile = $(".mobile").val(),
					address =$(".address").val();
			    getResult('api/user/edit_v2', {
						nn: nickname ? encodeURIComponent(nickname) : "",
						hi: headimgurl ? headimgurl : "",
						matk: matk,
						rn: name?encodeURIComponent(name) : '',
						ph: mobile? mobile : '',
						ad: address? encodeURIComponent(address) : ''
					}, 'callbackUserEditHandler');

			});
	  },
	  check: function() { 
			var me = this;
			var $mobile = $('.mobile'),$address = $('.address'),$name = $('.name');
				me.mobile = $.trim($mobile.val()),
				me.address = $.trim($address.val()),
				me.name = $.trim($name.val());
			if (me.name.length > 20 || me.name.length == 0) {
				showTips('请输入您的姓名，不要超过20字哦!');
				$("#btn-award").removeClass("requesting");
				return false;
			}else if (!/^\d{11}$/.test(me.mobile)) {
				showTips('这手机号，可打不通...');
				$("#btn-award").removeClass("requesting");
				return false;
			}else if(me.address.length <5){
				showTips(' 请填写详细的地址...');
				$("#btn-award").removeClass("requesting");
				return false;
			}
		return true;
	},
	   
	}
	W.callbackLotteryRecordHandler = function(data){
		if(data&&data.result){
			var h = "images/danmu-head.jpg";
			var prize_list = data.rl,t = simpleTpl();
			for (var i = 0;i<prize_list.length;i++) {
				t._('<li>')
	  	    		._('<div class="prize-item">')
						._('<label><img src="'+(headimgurl||h)+'"/></label>')
						._('<div>')
							._('<p>'+(nickname || data.rn ||"匿名用户")+'</p>')
							._('<p>')
								._('<span>奖品名称：'+(prize_list[i].pn||" ") +'</span>')
								var state = prize_list[i].cc?"show":"none";
								t._('<span class="'+state+'">兑换码：'+(prize_list[i].cc||" ")+'</span>')
							._('</p>')
						._('</div>')
					._('</div>')
				._('</li>')
			}
			$(".prize-list").html(t.toString());
		}else{
			$(".prize-list").html('<div class="no-prize">暂时没有中奖纪录</p></div>');
		}
	}
	W.callbackUserEditHandler = function(data){
		if(data&&data.result){
			showTips("个人信息修改成功");
			$(".info-box").find("input").attr("disabled","disabled");
			$('#btn-sub').removeClass("requesting").addClass("none");
			$("#btn-edit").removeClass("none");
		}else{
			showTips("修改失败");
			$('#btn-sub').removeClass("requseting").addClass("none");
			$("#btn-edit").removeClass("none");
		}
	}
	W.callbackUserInfoHandler = function(data){
  		if(data&&data.result){
	  		$(".name").val(data.rn||"");
			$(".mobile").val(data.ph ||"");
			$(".address").val(data.ad ||"");
  			if(!H.prize.isEdit){	
	  			if(!data.rn || !data.ph || !data.ad){
	  				$(".info-box").find("input").removeAttr("disabled");
	  				showTips("请完善您的个人信息");
	  				$("#btn-sub").removeClass("none")
					$("#btn-edit").addClass("none")
	  			}else{
	  				$(".name").val(data.rn).attr("disabled","disabled");
					$(".mobile").val(data.ph).attr("disabled","disabled");
					$(".address").val(data.ad).attr("disabled","disabled");
					$("#btn-sub").addClass("none")
					$("#btn-edit").removeClass("none")
	  			}
  			}else{
				$(".info-box").find("input").removeAttr("disabled");
				$(".info-box").find("input").removeAttr("disabled");
			    $(".info-box").find("input").get(0).focus();
			}
  			
  		}else{
		    $(".info-box").find("input").removeAttr("disabled");
  			showTips("请完善您的个人信息");
  			$("#btn-sub").removeClass("none").removeClass("requseting");
			$("#btn-edit").addClass("none");
  		}
  	}
})(Zepto)


$(function(){
	H.prize.init();
});

