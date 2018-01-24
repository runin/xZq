
(function($) {
	H.progressive = {
		$pageSize:10,
		init: function() {
			this.frequencyFn();
		},
		frequencyFn: function() {
		    getResult('api/mall/item/list', {pageSize:H.progressive.$pageSize}, 'callbackStationCommMall');
	    },
		scrollTop: function() {
			var ulH = $("#progressive").height();
			var pstop = $(".progressive-list").scrollTop();
		},
		scrollFn: function() {
			$(".progressive-list").scroll(function() {
				
			});
		}
		
	};
	W.callbackStationCommMall = function(data) {
	   var t = simpleTpl();
	    if(data && data.code==0) {
			var items = data.items;
			for(var i=0,leg = items.length; i<leg; i++) {
				var ip = items[i].ip/100;
				t._('<li>')
				t._('<a href="javascript:void(0);" id="'+items[i].uid+'"></a>')
				t._('<div class="p-img" style="background-image:url('+items[i].is+')"></div>')
				t._('<div class="p-box">')
				t._('<h2>'+items[i].n+'</h2>')
				t._('<p>兑换福荔币：<label>'+items[i].ip+'</label><em class="price">¥'+ip+'</em></p>')
				t._('</div>')
				t._('</li>')
			}
			$("#progressive").append(t.toString());
		}
	}
	H.progressive.init();

})(Zepto);