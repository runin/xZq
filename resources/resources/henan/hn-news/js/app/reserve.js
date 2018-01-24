/*
 /*
 * 预约
 *
 */
;(function(w, $) {
    w.Reserve = function() {
        this.$reserveId = null;//节目预约编号
        this.$dateT = null;//节目播出日期
    };
    Reserve.prototype.orderFn = function(obj,error_fn,success_fn) {
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
                            $(obj.id).removeClass("none");
                        }else if(data.errorCode == -1007) {//已经预约过的
                            if(success_fn) {
                                success_fn();
                                return;
                            }
                            $(obj.id).addClass("none");//隐藏按钮
                        }
                    });
                }else {
                    if(error_fn) {
                        error_fn();
                        return;
                    }
                    $(obj.id).addClass("none");//隐藏按钮
                }
            }
        });
    };
    Reserve.prototype.orderBtn = function(obj,error_fn,success_fn) {
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
                    $(obj.id).addClass("none");//隐藏按钮
                }
            });
        });
    }
    Reserve.prototype.init = function(obj,error_fn,success_fn) {
        this.orderFn(obj,error_fn,success_fn);
        this.orderBtn(obj,error_fn,success_fn);
    };
 
})(window, Zepto);
 

(function($) {
	
	H.reserve = {
		init: function(){
            $('#reserve_btn').addClass('none');
			if(W.yao_tv_id){
				new Reserve().init({
					id: "#reserve_btn", 
					yao_tv_id: W.yao_tv_id
				});
			}else{
				alert('请配置频道tvid');
			}
		}
	};

	H.reserve.init();

})(Zepto);