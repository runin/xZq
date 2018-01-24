(function($) {
	
	H.event = {
		init: function() {
		},

		handle: function(attr, param){
			if(!attr){
				return false;
			}else if(attr.indexOf('.html') >= 0){
				// FIXME 可以统一处理url中的参数
				location.href = attr;
				return true;
			}else if(attr.indexOf('H.dialog') == 0){
				var param = attr.split(' ');
				if(param.length >= 2){
					try{
						var callback = eval(param[0]);
						if($.isFunction(callback)){
							callback(param[1]);
							return true;
						}else{
							return false;
						}
					}catch(e){
						console.log(e);
						return false;
					}
				}
			}else{
				try{
					var callback = eval(attr);
					if($.isFunction(callback)){
						callback(param);
						return true;
					}else{
						return false;
					}
				}catch(e){
					console.log(e);
					return false
				}
			}
		}
		
	};

	H.event.init();

})(Zepto);
