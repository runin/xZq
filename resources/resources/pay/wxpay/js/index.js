(function($) {
	
	
	H.order = {
		init: function() {
			H.utils.resize();
			var ou = getQueryString("oid");
			showLoading();
			getResult('ceremony/getOrder', {
					ou:ou
				}, 'callbackGetOrderHandler');
		},
		//页面数据
		tpl:function(data){
			 $("#order-no").text(data.ou);
			 $("#order-date").text(data.ot);
			 $("#totalprice").text(data.tm);
			 goods = JsonArrayToStringCfz(data.ii);
			 var t = simpleTpl();
			 if(data.ii.length>0&&data.ii!=null){
				for(var i =0;i<data.ii.length;i++){
					var gd = data.ii[i];
					var gc = gd.num == "" ? "1":gd.num;
					t._('<div >'+gd.gn+'&nbsp;&nbsp;&nbsp;*'+gc+'</div>');
				}
			 }
			 $("#order-item").append(t.toString());

		},
		checkOrder:function(){
			getResult('ceremony/checkOrder', {
					ou:getQueryString("oid")
				}, 'callbackCheckOrderHandler');
		}
		
	};

	
	H.utils = {
		$main: $('#main'),
		$shadow:$(".shadow"),
		$indexmain:$(".index-main"),
		$lottery_message:$("#lottery-message"),
		$award_close : $("#award-close"),
		appentHTML_:function(_id,_html){
			$("#"+_id+"").append(_html);
		},
		disClick:function(e){
			$(e).addClass("none");
				setTimeout(function(){
					$(e).removeClass("none");
				},200);
		},
		resize: function() {
			var me = this,
				width = $(window).width(),
				height = $(window).height(),
				main_bg = 'images/bg.png';
			this.$main.css('minHeight', height).css('height', height);
			this.$shadow.css('width', width-90).css('height', width-90).css("margin-left",45);
			this.$indexmain.css('minHeight', height).css('height', height);
			$("#award-message").css('width', width*0.8).css('height',height* 0.7).css("margin-left",width*0.1);
			this.$award_close.css('top',height*0.04).css('right', height*0.04);
			
			if(height < 600){
				this.$lottery_message.css('width', 234).css('height', 270).css("margin-left",(width-234)/2).css('margin-top', (height-270)/2);
			}else{
				this.$lottery_message.css('width', 234).css('height', 270).css("margin-left",(width-234)/2).css('margin-top', (height-200)/2);
			}

		}

	};

	W.callbackGetOrderHandler = function(data){
		 if(data.result){
			H.order.tpl(data);
		 }
		 hideLoading();
	}
	
	W.callbackCheckOrderHandler = function(data){
		wh = parseInt(getQueryString("who"));
		if(data.result){
			if(data.orderStatus){
				/**var ht = nyf_url+"confirm.html?goods="+goods+"&ou="+getQueryString("oid")+"&turnFlag="+2;**/
				

				if(wh == 1){//自己  跳转地址
					window.location.href=nyf_url+"confirm.html?goods="+goods+"&ou="+getQueryString("oid")+"&turnFlag="+2;
//					window.location.href=nyf_url+"confirm.html?goods="+goods+"&ou="+getQueryString("oid")+"&turnFlag="+1;	
//				    window.location.href=nyf_url+"confirm.html?goods=[{id:1,num:2},{id:2,num:3}]"+goods+"&ou="+getQueryString("oid")+"&turnFlag="+1;	
				}else{//明星填写");
					window.location.href=nyf_url+"stars.html?goods="+goods+"&ou="+getQueryString("oid");
					//window.location.href=nyf_url+"stars.html?goods=[{id:1,num:2},{id:2,num:3}]&ou="+getQueryString("oid");
					
				}
			}
		}
	}
	
	
	
	
})(Zepto);

H.order.init();

