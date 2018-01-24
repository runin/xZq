/**
 * 我要找到你-首页
 */
(function($) {
	H.index = {
	
		init: function () {
			this.tv_show();
			this.event_handler();
		},
		event_handler : function() {
			$(".join-btn").click(function(e){
				e.preventDefault();
				toUrl("yaoyiyao.html")
			});
			$(".btn-rule").click(function(e){
				e.preventDefault();
				if (!$(this).hasClass('request')) {
					$(this).addClass('request');
					H.dialog.rule.open();
					setTimeout(function(){
						$(".btn-rule").removeClass('request');
					}, 1000);
				}
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
		tv_show : function(){
			   getResult('api/article/list',{},'callbackArticledetailListHandler',true);
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
	
	W.callbackArticledetailListHandler = function(data){
		if(data.code == 0){
			var imgSrc = data.arts;
			H.index.imgReady(imgSrc,2,function(){
				$(".box").addClass("pulse");
				setTimeout(function(){
					for (var i = 0;i<imgSrc.length;i++) {
						$('.boxT .photo')[i].src = imgSrc[i].img
					}
				},1000)
			})
			
			
		}
	}
})(Zepto);                             

$(function(){
	H.index.init();
});


