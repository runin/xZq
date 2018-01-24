(function($) {
	
	H.chediandian = {
		$wrapper: $('.chediandian-wrapper'),
		data: null,

		init: function(){
			this.bindBtns();
			this.resize();
		},

		show: function(data){

			var data = JSON.parse(data);
			H.chediandian.data = data;
			H.chediandian.$wrapper.find('.hongbao-shiwu img').attr('src', data.pi);
			H.chediandian.fillUserInfo(data);
			H.chediandian.$wrapper.parent().removeClass('none');
		},

		fillUserInfo: function(data){
			H.chediandian.$wrapper.find('input.rn').val(data.rn ? data.rn : '');
			H.chediandian.$wrapper.find('input.ph').val(data.ph ? data.ph : '');
			H.chediandian.$wrapper.find('input.ad').val(data.ad ? data.ad : '');
		},

		bindBtns: function(){
			H.chediandian.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.chediandian.$wrapper.attr('onShiwuClose'));
				H.chediandian.$wrapper.parent().addClass('none');
			});

			H.chediandian.$wrapper.find('.hongbao-click').click(function(){
				var realname = "";
				var phone = "";
				var address = "";

				var $realname = H.chediandian.$wrapper.find('.hongbao-input-wrapper.rn');
				var $phone = H.chediandian.$wrapper.find('.hongbao-input-wrapper.ph');
				var $address = H.chediandian.$wrapper.find('.hongbao-input-wrapper.ad');

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

				H.chediandian.addAward(phone);
			});
		},


		addAward: function(phone){
			var data = H.chediandian.data;

			var mobile = phone;
			var pz = data.aw;
			var channel = 85;
			var timestamp = new Date().getTime();
			var md5SignValue = H.chediandian.cheSignType(mobile,pz,channel,timestamp);
			window.location.href =data.ru+"?mobile="+mobile+"&value="+pz+"&channel="+channel+"&timestamp="+timestamp+"&type=jiayou&sign="+md5SignValue;
		},

		cheSignType: function(mobile, pz, channel, timestamp){
			var key =  "91quible4lfwm0za";
			var sign = mobile+""+pz+""+channel+""+timestamp+""+key;
			var md5SignValue = hex_md5(sign).toUpperCase();
			return md5SignValue;
		},

		resize: function(){

			var title = H.chediandian.$wrapper.find('.hongbao-title');
			H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom','line-height']);

			var shiwu = H.chediandian.$wrapper.find('.hongbao-shiwu');
			H.resize.attr(shiwu, ['height']);

			var hongbaoInput = H.chediandian.$wrapper.find('.hongbao-input');
			H.resize.attr(hongbaoInput, ['padding-top']);

			var inputWrapper = H.chediandian.$wrapper.find('.hongbao-input-wrapper');
			H.resize.attr(inputWrapper, ['margin-bottom']);
			
			var inputLabel = H.chediandian.$wrapper.find('.hongbao-input-wrapper label');
			H.resize.attr(inputLabel, ['line-height','height']);

			var input = H.chediandian.$wrapper.find('.hongbao-input-wrapper input');
			H.resize.attr(input, ['line-height','height']);
		}
	};


	H.chediandian.init();

})(Zepto);