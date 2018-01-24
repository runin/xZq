(function($) {
	
	H.chadiandian = {
		$wrapper: $('.chadiandian-wrapper'),
		data: null,

		init: function(){
			this.bindBtns();
			this.resize();
		},

		show: function(data){

			var data = JSON.parse(data);
			H.chadiandian.data = data;
			H.chadiandian.$wrapper.find('.hongbao-shiwu img').attr('src', data.pi);
			H.chadiandian.fillUserInfo(data);
			H.chadiandian.$wrapper.parent().removeClass('none');
		},

		fillUserInfo: function(data){
			H.chadiandian.$wrapper.find('input.rn').val(data.rn ? data.rn : '');
			H.chadiandian.$wrapper.find('input.ph').val(data.ph ? data.ph : '');
			H.chadiandian.$wrapper.find('input.ad').val(data.ad ? data.ad : '');
		},

		bindBtns: function(){
			H.chadiandian.$wrapper.find('.hongbao-close').click(function(){
				H.event.handle(H.chadiandian.$wrapper.attr('onShiwuClose'));
				H.chadiandian.$wrapper.parent().addClass('none');
			});

			H.chadiandian.$wrapper.find('.hongbao-click').click(function(){
				var realname = "";
				var phone = "";
				var address = "";

				var $realname = H.chadiandian.$wrapper.find('.hongbao-input-wrapper.rn');
				var $phone = H.chadiandian.$wrapper.find('.hongbao-input-wrapper.ph');
				var $address = H.chadiandian.$wrapper.find('.hongbao-input-wrapper.ad');

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

				H.chadiandian.addAward(phone);
			});
		},


		addAward: function(phone){
			var data = H.chadiandian.data;

			var phoneNum = phone;
			var score = data.aw;
			var getType = 13;
			var getDescripe = 'CCTV7';
			var md5SignValue = H.chadiandian.teaSignType(phoneNum,score,getType,getDescripe);
            $.ajax({
                type: "get",
                async: false,
                url:data.ru,
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "callbackTttjAppScoreHandler",
                data: {
                	phoneNum: phoneNum,
                	score: score,
                	getType: getType,
                	getDescripe:getDescripe,
                	sign:md5SignValue,
                	jsonp:true
                },
                success:function(data){
                     if(data.code=="GOOD"){
                    	 window.location.href="wangxin.html?pv="+score+"&ph="+phoneNum+"&ru=http://a.app.qq.com/o/simple.jsp?pkgname=com.tea.activity"+"&tp=2";
                     }else{
                       alert(data.content);
                     }
                }
            });
		},

		teaSignType: function(phoneNum, score, getType, getDescripe){
			var key = "ncnqooervhdkafskuiencv";
			var sign = phoneNum+""+score+""+getType+""+getDescripe+""+key;
			var md5SignValue = hex_md5(sign).toUpperCase();
			return md5SignValue;
		},

		resize: function(){

			var title = H.chadiandian.$wrapper.find('.hongbao-title');
			H.resize.attr(title, ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom','line-height']);

			var shiwu = H.chadiandian.$wrapper.find('.hongbao-shiwu');
			H.resize.attr(shiwu, ['height']);

			var hongbaoInput = H.chadiandian.$wrapper.find('.hongbao-input');
			H.resize.attr(hongbaoInput, ['padding-top']);

			var inputWrapper = H.chadiandian.$wrapper.find('.hongbao-input-wrapper');
			H.resize.attr(inputWrapper, ['margin-bottom']);
			
			var inputLabel = H.chadiandian.$wrapper.find('.hongbao-input-wrapper label');
			H.resize.attr(inputLabel, ['line-height','height']);

			var input = H.chadiandian.$wrapper.find('.hongbao-input-wrapper input');
			H.resize.attr(input, ['line-height','height']);
		}
	};


	H.chadiandian.init();

})(Zepto);