/**
 * 我要找到你-首页
 */
(function($) {
	H.detail = {
		uuid: getQueryString('uuid'),
		init: function () {
			$("section").height($(window).height()-$(window).width()*330/640-60).removeClass("none");
			this.current_time();
			this.event_handler();
		},
		event_handler : function() {
			$(".back-btn").click(function(e){
				e.preventDefault();
				toUrl("enter.html");
			})
		},
		current_time: function(){
			   getResult('index/recommend/'+H.detail.uuid,{},'callbackRcommendDetailHander',true);
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
	
	
	W.callbackRcommendDetailHander  = function(data){
		if(data.code == 0){
			var  t = simpleTpl();
			t._('<img src="'+data.ib+'" />')
			._('<span class="name">'+data.rde+'</span>');
			var _img = new Image();
		    _img.src = data.ib;
		    _img.onload = function(){
		    	$(".header_banner").html(t.toString());
		    }
			$(".column_content").html(data.rds);
		}
					
	}
	
})(Zepto);                             

$(function(){
	H.detail.init();
});


