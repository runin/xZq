/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
		init: function () {
			this.event_handler();
		},
		event_handler : function() {
			$(".enter-btn").click(function(e){
				e.preventDefault();
				toUrl("yaoyiyao.html")
			});
			$(".rul-btn").click(function(e){
				e.preventDefault();
				H.dialog.rule.open();
			});
			$(".btn-reserve").click(function(e){
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				};
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                });
			});
			
		},
		prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
		imgReady : function(items,type,fn){
		    var _srcList = [],
		    i = 0;　
		    $.each(items,function(index,value){
		    	if(type == 1){
		    		 _srcList.push(value.ib);
		    	}else if(type == 2){
		    		 _srcList.push(value.img);
		    	}
		    	
		    })
		    imgLoadComplate(_srcList[i]);
		    function imgLoadComplate(imgSrc){
		        var _img = new Image();
		        _img.src = imgSrc;
		        _img.onload = function(){　　　　　　　　　　　　　　　　　　 //判断是否加载到最后一个图片
		            if (i < _srcList.length-1) {
		                i++;
		                imgLoadComplate(_srcList[i]);
		            }else{
		               if(fn){
		               	fn();
		               }
		            }
		        }
		    }
		}
	}

})(Zepto);                             

$(function(){
	H.index.init();
});


