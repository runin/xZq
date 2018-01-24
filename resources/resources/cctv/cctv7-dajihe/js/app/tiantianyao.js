(function($) {
	
	H.tiantianyao = {
		$wrapper: $('.tiantianyao-wrapper'),
		data: null,

		init: function(){
			this.bindBtns();
			this.resize();
		},

		show: function(data){

			var data = JSON.parse(data);
			H.tiantianyao.data = data;
			H.tiantianyao.$wrapper.find('.hongbao-shiwu img').attr('src', data.pi);
			H.tiantianyao.fillUserInfo(data);
			H.tiantianyao.$wrapper.parent().removeClass('none');
		},

		fillUserInfo: function(data){
			H.tiantianyao.$wrapper.find('input.rn').val(data.rn ? data.rn : '');
			H.tiantianyao.$wrapper.find('input.ph').val(data.ph ? data.ph : '');
			H.tiantianyao.$wrapper.find('input.ad').val(data.ad ? data.ad : '');
		},

		bindBtns: function(){
			H.tiantianyao.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.tiantianyao.$wrapper.attr('onShiwuClose'));
				H.tiantianyao.$wrapper.parent().addClass('none');
			});

			H.tiantianyao.$wrapper.find('.hongbao-click').click(function(){
				var realname = "";
				var phone = "";
				var address = "";

				var $realname = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper.rn');
				var $phone = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper.ph');
				var $address = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper.ad');

				if($phone.length > 0 && !$phone.hasClass('none')){
					phone = $.trim($phone.find('input').val());
					if(!phone){
	                    alert("电话不能为空");
	                    return;
	                }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(phone)){
	                    alert('这个手机号可打不通...');
	                    return;
	                }
				}


				if($realname.length > 0 && !$realname.hasClass('none')){
					realname = $.trim($realname.find('input').val());
					if(realname.length <= 0){
	                    alert('请填写姓名');
	                    return;
	                }
				}

				if($address.length > 0 && !$address.hasClass('none')){
					address = $.trim($address.find('input').val());
					if(address.length <= 0){
	                    alert('请填写地址');
	                    return;
	                }
				}                

				H.tiantianyao.addAward(phone);
			});
		},


		addAward: function(phone){
			var data = H.tiantianyao.data;

			var phoneNum = phone;
			var pz = data.aw;
			var source = 'CCTV7';
			var timestamp = new Date().getTime();
			var md5SignValue = H.tiantianyao.tttjSignType(phoneNum,0,pz,'',source,timestamp);

			$.ajax({
			    type: "get",
			    async: false,
                url:data.ru,
                dataType: "jsonp",
                jsonp: "callback",
			    jsonpCallback: "callbackTttjAppScoreHandler",
			    data: {
			        phoneNum: phoneNum,
			        score: pz,
			        type: 0,
			        name:"",
			        source: source,
			        timestamp: timestamp,
			        sign:md5SignValue,
			        jsonp:true
			    },
			    success:function(data){
					if(data.code=="GOOD"){
						window.location.href="wangxin.html?pv="+pz+"&ph="+phoneNum+"&ru=http://a.app.qq.com/o/simple.jsp?pkgname=com.tea.activity"+"&tp=1";
					}else{
						alert(data.content);
					}
			    }
			});

		},

		tttjSignType: function(mobile, type, score, name, source, timestamp){
			var key = "az0mwfl4elbiuq19";
			var sign = mobile+""+type+""+score+""+name+""+source+""+timestamp+key;
			var md5SignValue = hex_md5(sign).toUpperCase();
			return md5SignValue;
		},

		resize: function(){

			var title = H.tiantianyao.$wrapper.find('.hongbao-title');
			H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom','line-height']);

			var shiwu = H.tiantianyao.$wrapper.find('.hongbao-shiwu');
			H.resize.attr(shiwu, ['height']);

			var hongbaoInput = H.tiantianyao.$wrapper.find('.hongbao-input');
			H.resize.attr(hongbaoInput, ['padding-top']);

			var inputWrapper = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper');
			H.resize.attr(inputWrapper, ['margin-bottom']);
			
			var inputLabel = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper label');
			H.resize.attr(inputLabel, ['line-height','height']);

			var input = H.tiantianyao.$wrapper.find('.hongbao-input-wrapper input');
			H.resize.attr(input, ['line-height','height']);
		}
	};


	H.tiantianyao.init();

})(Zepto);