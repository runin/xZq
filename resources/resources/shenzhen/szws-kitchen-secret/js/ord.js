/*
 * 预约
 *
 */
;(function(w, $) {
	w.o = function() {
		this.$pment = $("#pment");//预约按钮id
		this.$reserveId = null;//节目预约编号
		this.$dateT = null;//节目播出日期
	};
	o.prototype.orderFn = function() {
		var that = this;
		$.ajax({
			type: 'GET',
			async: true,
			url: domain_url + "program/reserve/get",
			dataType: "jsonp",
			data: {},
			jsonpCallback: 'callbackProgramReserveHandler',
			success: function(data) {
				if (!data.reserveId) {
					that.$pment.hide();//当没有预约的时候隐藏预约按钮
					return;
				}else {
					that.$reserveId = data.reserveId;
					that.$dateT = data.date;
					window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(data) {
						if (data.errorCode == 0) {
							that.$pment.show();
						}else if(data.errorCode == -1007) {//已经预约过的
						    $(".top_right").addClass("tab");
							that.$pment.hide();//隐藏按钮
						}
					});
				}
			}
		});
	};
	o.prototype.orderBnt = function() {
		var that = this;
		that.$pment.click(function() {
			if(!that.$reserveId) {
				return;
			}
			shaketv.reserve_v2({tvid:yao_tv_id, reserveid:that.$reserveId, date:that.$dateT},function(data) {
				if(data.errorCode == 0) {//预约成功回调
				    $(".top_right").addClass("tab");
					that.$pment.hide();//隐藏按钮
				}
			});
		});
	}
	o.prototype.init = function() {
		this.orderFn();
	    this.orderBnt();
	};
	new o().init();

})(window,Zepto);
