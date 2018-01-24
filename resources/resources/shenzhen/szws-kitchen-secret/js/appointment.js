/*
 * 预约
 *
 */
;(function(w, $) {
	w.Subscribeorder = function() {
		this.$reserveId = null;//节目预约编号
		this.$dateT = null;//节目播出日期
	};
	Subscribeorder.prototype.orderFn = function(obj,error_fn,success_fn) {
		var that = this;
		$.ajax({
			type: 'GET',
			async: true,
			url: domain_url + "api/program/reserve/get",
			dataType: "jsonp",
			data: {},
			jsonpCallback: 'callbackProgramReserveHandler',
			success: function(data) {
				that.$reserveId = data.reserveId;
				that.$dateT = data.date;
				if(data.reserveId) {
					window['shaketv'] && shaketv.preReserve_v2({tvid:obj.yao_tv_id, reserveid:data.reserveId, date:data.date}, function(data) {
						if (data.errorCode == 0) {
							obj.id.removeClass("none");
						}else if(data.errorCode == -1007) {//已经预约过的
							if(success_fn) {
								success_fn();
								return;
							}
							obj.id.addClass("none");//隐藏按钮
						}
					});
				}else {
					if(error_fn) {
						error_fn();
						return;
					}
					obj.id.addClass("none");//隐藏按钮
				}
			}
		});
	};
	Subscribeorder.prototype.orderBtn = function(obj,error_fn,success_fn) {
		var that = this;
		$(obj.id).click(function() {
			if(!that.$reserveId) {
				return;
			}
			shaketv.reserve_v2({tvid:obj.yao_tv_id, reserveid:that.$reserveId, date:that.$dateT},function(data) {
				if(data.errorCode == 0) {//预约成功回调
				    if(success_fn) {
						success_fn();
						return;
					}
					obj.id.addClass("none");//隐藏按钮
				}
			});
		});
	}
	Subscribeorder.prototype.init = function(obj,error_fn,success_fn) {
		this.orderFn(obj,error_fn,success_fn);
	    this.orderBtn(obj,error_fn,success_fn);
	};

})(window, Zepto);

//参数:按钮id、预约id和处理函数
$(function() {
	new Subscribeorder().init({id:"#pment", yao_tv_id:10048},
	function() {//获取预约id不成功
	
	},function() {//已经预约成功
		//$(".top_right").addClass("tab");
		//$("#pment").hide();
	});
})
